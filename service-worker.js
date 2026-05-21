const CACHE_NAME = 'safety-patrol-v2';
const BASE_URL = '/safety-patroll';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        BASE_URL + '/',
        BASE_URL + '/index.html',
        BASE_URL + '/manifest.json',
        BASE_URL + '/icon-72.png',
        BASE_URL + '/icon-192.png',
        BASE_URL + '/icon-512.png',
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

self.addEventListener('push', e => {
  let data = {
    title: '⚠️ 안전 패트롤 미완료',
    body: '점검을 아직 완료하지 않았습니다. 지금 바로 점검해 주세요.'
  };
  if (e.data) {
    try { data = { ...data, ...e.data.json() }; } catch(_) {}
  }
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: BASE_URL + '/icon-192.png',
      badge: BASE_URL + '/icon-72.png',
      tag: 'safety-patrol-reminder',
      renotify: true,
      requireInteraction: true,
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      return clients.openWindow('https://kimsol970920-ui.github.io/safety-patroll/');
    })
  );
});
