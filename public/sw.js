const cacheName = 'cache-v1';
const cacheables = [
     '/',
     '/index.html',
     '/css/style.css',
     '/js/main.js',
     '/js/lib/firebase-app.js',
     '/js/lib/firebase-firestore.js'
];

self.addEventListener('install', (event) => {
     console.log("Service worker installed!");
     event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(cacheables)))
});

self.addEventListener('activate', (event) => {
     console.log("Service worker activate event");
});

self.addEventListener('fetch', (event) => {
     const { request } = event;

     event.respondWith(async function () {
          const cache = await caches.open(cacheName);
          const cachedPromise = await cache.match(request);
          let fetchPromise = fetch(request);

          if (request.url.startsWith(self.location.origin)) {
               event.waitUntil(async function () {
                    const fetchResponse = await fetchPromise;
                    await cache.put(request, fetchResponse.clone());
               }());
          }

          return cachedPromise || fetchPromise;
     }()
     );
});