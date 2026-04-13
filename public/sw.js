// ATA SOHBET CACHE BUSTER
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => caches.delete(cache))
      );
    }).then(() => {
      self.registration.unregister();
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
// V2
// V3
// V4
// V5
// V6
// V7
