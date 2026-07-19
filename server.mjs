// FitLab production server: serves the built dist/ and provides the Web Push
// timer API. When a rest/work timer starts, the client schedules a push for
// its end; if the app is still alive at that moment it cancels the push and
// alerts locally. If the OS suspended the page (iOS PWA in background), the
// cancel never arrives and the push is delivered by the push service instead.
import express from 'express';
import webpush from 'web-push';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Minimal .env loader (local dev only — Railway injects real env vars).
const envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].trim();
  }
}

const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;
const pushEnabled = Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY);
if (pushEnabled) {
  webpush.setVapidDetails(VAPID_SUBJECT || 'mailto:admin@fitlab.local', VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
} else {
  console.warn('VAPID keys missing — push API disabled, serving static only.');
}

const app = express();
app.use(express.json({ limit: '8kb' }));

// In-memory schedule: id -> timeout handle. Rest timers are 30–180s, so a
// restart losing them is acceptable; a DB would be overkill here.
const pending = new Map();
const MAX_PENDING = 1000;
// Sent GRACE_MS after the nominal end: a live client cancels at 0s and wins
// the race; a suspended client can't cancel, so the push goes out.
const GRACE_MS = 2000;

// ------------------------------------------------------------
// Daily reminders. Persisted to /data (Railway volume) when present,
// else a local file — plus the client re-registers on every app open,
// so a lost store heals itself as soon as the user opens the app.
// Entry: endpoint -> { subscription, hour, minute, tzOffsetMinutes,
//                      title, body, lastSentDay }
// ------------------------------------------------------------
const REMINDER_FILE = fs.existsSync('/data')
  ? '/data/reminders.json'
  : path.join(__dirname, '.reminders.json');
const reminders = new Map();
try {
  if (fs.existsSync(REMINDER_FILE)) {
    for (const [k, v] of Object.entries(JSON.parse(fs.readFileSync(REMINDER_FILE, 'utf8')))) reminders.set(k, v);
    console.log(`loaded ${reminders.size} reminder(s) from ${REMINDER_FILE}`);
  }
} catch (e) { console.warn('reminder store load failed:', e.message); }
function persistReminders() {
  try { fs.writeFileSync(REMINDER_FILE, JSON.stringify(Object.fromEntries(reminders))); }
  catch (e) { console.warn('reminder store save failed:', e.message); }
}

const REMINDER_TICK_MS = parseInt(process.env.REMINDER_TICK_MS || '60000', 10);
setInterval(async () => {
  if (!pushEnabled || reminders.size === 0) return;
  const now = Date.now();
  for (const [endpoint, r] of reminders) {
    // Shift to the user's local clock, then read with UTC getters.
    const local = new Date(now + r.tzOffsetMinutes * 60000);
    const day = local.toISOString().slice(0, 10);
    const hm = local.getUTCHours() * 60 + local.getUTCMinutes();
    const target = r.hour * 60 + r.minute;
    if (hm >= target && hm < target + 5 && r.lastSentDay !== day) {
      r.lastSentDay = day;
      persistReminders();
      console.log(`reminder due -> sending to ...${endpoint.slice(-16)}`);
      try {
        await webpush.sendNotification(r.subscription, JSON.stringify({ title: r.title, body: r.body, tag: 'fitlab-reminder' }), { TTL: 3600 });
      } catch (e) {
        console.warn('reminder send failed:', e.statusCode || e.message);
        if (e.statusCode === 404 || e.statusCode === 410) { reminders.delete(endpoint); persistReminders(); } // subscription gone
      }
    }
  }
}, REMINDER_TICK_MS);

app.post('/api/reminder/set', (req, res) => {
  if (!pushEnabled) return res.status(503).json({ ok: false, error: 'push disabled' });
  const { subscription, hour, minute, tzOffsetMinutes, title, body } = req.body || {};
  if (!subscription || typeof subscription.endpoint !== 'string' ||
      !subscription.endpoint.startsWith('https://') || subscription.endpoint.length > 1000) {
    return res.status(400).json({ ok: false, error: 'bad subscription' });
  }
  const h = Number(hour), m = Number(minute), tz = Number(tzOffsetMinutes);
  if (!Number.isInteger(h) || h < 0 || h > 23 || !Number.isInteger(m) || m < 0 || m > 59 ||
      !Number.isFinite(tz) || tz < -840 || tz > 840) {
    return res.status(400).json({ ok: false, error: 'bad time' });
  }
  if (typeof title !== 'string' || title.length > 120 || typeof body !== 'string' || body.length > 200) {
    return res.status(400).json({ ok: false, error: 'bad payload' });
  }
  if (!reminders.has(subscription.endpoint) && reminders.size >= 500) return res.status(429).json({ ok: false });
  reminders.set(subscription.endpoint, { subscription, hour: h, minute: m, tzOffsetMinutes: tz, title, body, lastSentDay: null });
  persistReminders();
  res.json({ ok: true });
});

app.post('/api/reminder/clear', (req, res) => {
  const { endpoint } = req.body || {};
  if (typeof endpoint !== 'string') return res.status(400).json({ ok: false });
  const existed = reminders.delete(endpoint);
  if (existed) persistReminders();
  res.json({ ok: true, cleared: existed });
});

app.get('/api/health', (req, res) => res.json({ ok: true, push: pushEnabled, pending: pending.size, reminders: reminders.size }));
app.get('/api/push/pubkey', (req, res) => res.json({ key: pushEnabled ? VAPID_PUBLIC_KEY : null }));

app.post('/api/push/schedule', (req, res) => {
  if (!pushEnabled) return res.status(503).json({ ok: false, error: 'push disabled' });
  const { id, subscription, delaySeconds, title, body, again } = req.body || {};
  const delay = Number(delaySeconds);
  if (typeof id !== 'string' || !id || id.length > 64) return res.status(400).json({ ok: false, error: 'bad id' });
  if (!Number.isFinite(delay) || delay < 1 || delay > 3600) return res.status(400).json({ ok: false, error: 'bad delay' });
  if (!subscription || typeof subscription.endpoint !== 'string' ||
      !subscription.endpoint.startsWith('https://') || subscription.endpoint.length > 1000) {
    return res.status(400).json({ ok: false, error: 'bad subscription' });
  }
  if (typeof title !== 'string' || title.length > 120 || (body != null && (typeof body !== 'string' || body.length > 200))) {
    return res.status(400).json({ ok: false, error: 'bad payload' });
  }
  // Optional "run again" descriptor: the SW gets an action button that
  // reschedules this same push. label/confirm arrive pre-localized.
  if (again != null && (typeof again !== 'object' || typeof again.label !== 'string' || again.label.length === 0 || again.label.length > 40 ||
      (again.confirm != null && (typeof again.confirm !== 'string' || again.confirm.length > 80)))) {
    return res.status(400).json({ ok: false, error: 'bad again' });
  }
  if (!pending.has(id) && pending.size >= MAX_PENDING) return res.status(429).json({ ok: false, error: 'too many pending' });

  if (pending.has(id)) clearTimeout(pending.get(id)); // reschedule replaces
  const payload = JSON.stringify({
    title,
    body: body || '',
    again: again ? { seconds: delay, title, body: body || '', label: again.label, confirm: again.confirm } : undefined,
  });
  const handle = setTimeout(async () => {
    pending.delete(id);
    try {
      await webpush.sendNotification(subscription, payload, { TTL: 120 });
    } catch (e) {
      console.warn('push send failed:', e.statusCode || e.message);
    }
  }, delay * 1000 + GRACE_MS);
  pending.set(id, handle);
  res.json({ ok: true });
});

app.post('/api/push/cancel', (req, res) => {
  const { id } = req.body || {};
  if (typeof id !== 'string') return res.status(400).json({ ok: false });
  const handle = pending.get(id);
  if (handle) { clearTimeout(handle); pending.delete(id); }
  res.json({ ok: true, cancelled: Boolean(handle) });
});

// Static app: hashed assets cache forever, everything else revalidates.
const dist = path.join(__dirname, 'dist');
app.use(express.static(dist, {
  setHeaders(res, filePath) {
    if (/[\\/]assets[\\/]/.test(filePath)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    else res.setHeader('Cache-Control', 'no-cache');
  },
}));
app.get('*', (req, res) => res.sendFile(path.join(dist, 'index.html')));

const port = parseInt(process.env.PORT || '4173', 10);
app.listen(port, '0.0.0.0', () => console.log(`FitLab server on :${port} (push: ${pushEnabled ? 'on' : 'off'})`));
