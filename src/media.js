
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

export { IS_IOS, startPhoneTimer, playBeep, buzz, ensureNotifyPermission, notify };
