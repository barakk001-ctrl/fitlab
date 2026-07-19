// FitLab service worker — app-shell offline support.
// Bump CACHE when the shell list changes to evict old caches.
const CACHE = 'fitlab-v6';
const CORE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Server-sent timer push (survives the page being suspended, e.g. iOS PWA
// in the background). iOS requires every push to show a notification.
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch {}
  const opts = {
    body: data.body || '',
    tag: data.tag || 'fitlab-timer',
    renotify: true,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 80, 200],
  };
  if (data.again) {
    // "Run again" action: rescheduling happens entirely in the SW (below),
    // so another rest can start without opening the app.
    opts.actions = [{ action: 'again', title: data.again.label }];
    opts.data = { again: data.again };
  }
  event.waitUntil(self.registration.showNotification(data.title || 'FitLab', opts));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const again = event.notification.data && event.notification.data.again;

  if (event.action === 'again' && again) {
    // Rearm the same timer server-side; the chain stays repeatable.
    event.waitUntil((async () => {
      try {
        const sub = await self.registration.pushManager.getSubscription();
        if (!sub) return;
        await fetch('/api/push/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: 'again-' + Math.random().toString(36).slice(2, 10),
            subscription: sub.toJSON(),
            delaySeconds: again.seconds,
            title: again.title,
            body: again.body,
            again: { label: again.label, confirm: again.confirm },
          }),
        });
        if (again.confirm) {
          await self.registration.showNotification(again.confirm, {
            tag: 'fitlab-timer', silent: true,
            icon: '/icon-192.png', badge: '/icon-192.png',
          });
        }
      } catch {}
    })());
    return;
  }

  // Default tap: focus the app (or reopen it). For rest-over notifications,
  // hand the app the duration so it opens with a new rest already running —
  // iOS never renders action buttons, so the body tap IS "run again" there.
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const client = list.find((w) => 'focus' in w);
      if (client) {
        client.focus();
        if (again) client.postMessage({ type: 'fitlab-again', seconds: again.seconds });
        return;
      }
      return self.clients.openWindow(again ? '/?again=' + again.seconds : '/');
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Only handle same-origin requests — never intercept YouTube embeds etc.
  if (url.origin !== self.location.origin) return;

  // Navigations: network-first, fall back to the cached shell when offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('/index.html', copy));
          return res;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Static assets (content-hashed): cache-first, populate on demand.
  event.respondWith(
    caches.match(request).then((cached) =>
      cached ||
      fetch(request)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => cached)
    )
  );
});
