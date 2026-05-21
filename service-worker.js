const CACHE_NAME = 'safety-patrol-v3';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './manifest.json',
        './icon-72.png',
        './icon-192.png',
        './icon-512.png',
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
  e.waitUntil(
    self.registration.showNotification('⚠️ 안전 패트롤 미완료', {
      body: '점검을 아직 완료하지 않았습니다. 지금 바로 점검해 주세요.',
      requireInteraction: true,
      tag: 'safety-patrol-reminder',
      renotify: true,
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('./'));
});
