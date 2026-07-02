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

app.get('/api/health', (req, res) => res.json({ ok: true, push: pushEnabled, pending: pending.size }));
app.get('/api/push/pubkey', (req, res) => res.json({ key: pushEnabled ? VAPID_PUBLIC_KEY : null }));

app.post('/api/push/schedule', (req, res) => {
  if (!pushEnabled) return res.status(503).json({ ok: false, error: 'push disabled' });
  const { id, subscription, delaySeconds, title, body } = req.body || {};
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
  if (!pending.has(id) && pending.size >= MAX_PENDING) return res.status(429).json({ ok: false, error: 'too many pending' });

  if (pending.has(id)) clearTimeout(pending.get(id)); // reschedule replaces
  const handle = setTimeout(async () => {
    pending.delete(id);
    try {
      await webpush.sendNotification(subscription, JSON.stringify({ title, body: body || '' }), { TTL: 120 });
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
