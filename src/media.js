
// Web Audio beep for the rest timer
// True on iPhone/iPad (incl. iPadOS reporting as Mac with touch).
const IS_IOS = typeof navigator !== 'undefined' &&
  (/iP(ad|hone|od)/.test(navigator.userAgent) ||
   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

// Hand a duration (seconds) off to the iOS Clock via a one-time "FitLab Timer"
// Shortcut — a real system timer that shows in the Dynamic Island / lock screen
// and alerts even in silent mode.
// In a browser tab we use x-callback to return to the tab. In the INSTALLED
// home-screen app we omit the return URL — sending it back to the https URL
// would open Safari (iOS can't deep-link back into a standalone PWA), so we let
// the user swipe back to the app instead of getting kicked to the browser.
function startPhoneTimer(seconds) {
  try {
    const name = encodeURIComponent('FitLab Timer');
    const standalone = (typeof navigator !== 'undefined' && navigator.standalone === true) ||
      (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
    if (standalone) {
      window.location.href = `shortcuts://run-shortcut?name=${name}&input=text&text=${seconds}`;
    } else {
      const back = encodeURIComponent(window.location.href);
      window.location.href =
        `shortcuts://x-callback-url/run-shortcut?name=${name}&input=text&text=${seconds}` +
        `&x-success=${back}&x-cancel=${back}&x-error=${back}`;
    }
  } catch {}
}

function playBeep(durationMs = 200, frequency = 800) {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
    osc.start();
    setTimeout(() => { osc.stop(); ctx.close(); }, durationMs + 50);
  } catch (e) { /* ignore */ }
}

// Vibrate the phone (where supported) — used so timer endings are felt even
// if the screen is off / you've looked away.
function buzz(pattern = [120, 60, 120]) {
  try { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern); } catch {}
}

// ------------------------------------------------------------
// Timer notifications (service-worker local notifications)
// ------------------------------------------------------------

const canNotify = () =>
  typeof Notification !== 'undefined' && typeof navigator !== 'undefined' && 'serviceWorker' in navigator;

// Ask for notification permission. Must be called from a user gesture
// (iOS requires it, and only grants to Home-Screen-installed web apps).
async function ensureNotifyPermission() {
  if (!canNotify()) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  try { return (await Notification.requestPermission()) === 'granted'; } catch { return false; }
}

// Show a notification when the app is NOT visible (foreground already
// beeps + vibrates). Goes through the service worker registration —
// `new Notification()` is unsupported on iOS; reg.showNotification() works
// in installed PWAs on iOS 16.4+. `tag` replaces older timer alerts.
async function notify(title, body) {
  try {
    if (!canNotify() || Notification.permission !== 'granted') return false;
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') return false;
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(title, {
      body, tag: 'fitlab-timer', renotify: true,
      icon: '/icon-192.png', badge: '/icon-192.png',
      vibrate: [200, 80, 200],
    });
    return true;
  } catch { return false; }
}

// ------------------------------------------------------------
// Server-sent Web Push for timer endings.
// The page schedules a push for when the timer expires and cancels it if it is
// still running at that moment (foreground OR background-with-JS handles the
// alert locally). If the OS suspended the page — iOS PWA in background — the
// cancel never happens and the push service delivers the notification.
// ------------------------------------------------------------

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

const canPush = () => canNotify() && typeof window !== 'undefined' && 'PushManager' in window;

let subPromise = null;
async function getPushSubscription() {
  if (!canPush() || Notification.permission !== 'granted') return null;
  if (!subPromise) {
    subPromise = (async () => {
      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      if (existing) return existing;
      const res = await fetch('/api/push/pubkey');
      const { key } = await res.json();
      if (!key) return null;
      return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(key) });
    })().catch(() => { subPromise = null; return null; });
  }
  return subPromise;
}

// Schedule a push for `delaySeconds` from now. Same id replaces the previous
// schedule. Returns true if the server accepted it. Pass `again` ({label,
// confirm}, pre-localized) to give the notification a "run again" action that
// restarts the same timer straight from the notification.
async function schedulePush(id, delaySeconds, title, body, again) {
  try {
    const sub = await getPushSubscription();
    if (!sub) return false;
    const res = await fetch('/api/push/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, subscription: sub.toJSON(), delaySeconds, title, body, again }),
    });
    return res.ok;
  } catch { return false; }
}

function cancelPush(id) {
  try {
    fetch('/api/push/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

// ------------------------------------------------------------
// Daily physio reminder — the server sends a push every day at the chosen
// local time. The preference lives in localStorage and re-registers with the
// server on every app open (heals server restarts/redeploys).
// ------------------------------------------------------------

const REMINDER_PREF_KEY = 'fitlab:physio-reminder';

function readReminderPref() {
  try { return JSON.parse(window.localStorage.getItem(REMINDER_PREF_KEY)) || null; } catch { return null; }
}
function writeReminderPref(pref) {
  try {
    if (pref) window.localStorage.setItem(REMINDER_PREF_KEY, JSON.stringify(pref));
    else window.localStorage.removeItem(REMINDER_PREF_KEY);
  } catch {}
}

// Register (or move) the daily reminder. title/body arrive pre-localized.
async function setDailyReminder(hour, minute, title, body) {
  try {
    const sub = await getPushSubscription();
    if (!sub) return false;
    const res = await fetch('/api/reminder/set', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription: sub.toJSON(), hour, minute,
        tzOffsetMinutes: -new Date().getTimezoneOffset(),
        title, body,
      }),
    });
    return res.ok;
  } catch { return false; }
}

async function clearDailyReminder() {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return true;
    await fetch('/api/reminder/clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: sub.endpoint }),
    });
    return true;
  } catch { return false; }
}

// Called once on app boot: re-upsert a stored reminder (also refreshes the
// timezone offset across DST changes). No-op without permission or pref.
function rearmReminderFromStorage() {
  const pref = readReminderPref();
  if (!pref?.enabled || !canNotify() || Notification.permission !== 'granted') return;
  setDailyReminder(pref.hour, pref.minute, pref.title, pref.body);
}

export { IS_IOS, startPhoneTimer, playBeep, buzz, ensureNotifyPermission, notify, schedulePush, cancelPush, readReminderPref, writeReminderPref, setDailyReminder, clearDailyReminder, rearmReminderFromStorage };
