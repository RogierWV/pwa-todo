const cacheName = 'cache-v1';
const cacheables = [
     '/',
     '/index.html',
     '/css/style.css',
     '/js/main.js',
     '/js/firebase-app.js',
     '/js/firebase-firestore.js'
];

self.addEventListener('install', (event) => {
     console.log("Service worker installed!");
     event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(cacheables)));
});

self.addEventListener('activate', (event) => {
     console.log("Service worker activate event");
});

self.addEventListener('fetch', (event) => {
     // console.log('Fetch intercepted for: ', event.request.url);
     const { request } = event;

     // if (request.cache === 'only-if-cached' && request.mode !== 'same-origin')
     //      return // potential Chrome bug, preventive measures

     event.respondWith(async function() {
          const cache = await caches.open(cacheName);
          const cachedPromise = await cache.match(request);
          const fetchPromise = fetch(request);

          if(request.url.startsWith(self.location.origin)) {
               event.waitUntil(async function() {
                    const fetchResponse = await fetchPromise;
                    await cache.put(request, fetchResponse.clone());
               }());
          }

          return cachedPromise || fetchPromise;

          // caches.match(event.request).then((cachedResponse) => {
          //      if (cachedResponse) {
          //           console.log(`${event.request.url} loaded from cache`);
          //           return cachedResponse;
          //      } else {
          //           console.log(`${event.request.url} shall be fetched...`);
          //           return fetch(event.request);
          //      }
          // })
     }()
     );
});