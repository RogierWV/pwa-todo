const cacheName = 'cache-v1';
const precacheResources = [
     '/', 
     '/index.html', 
     '/css/style.css', 
     '/js/main.js',
];

self.addEventListener('install', (event) => {
     console.log("Service worker installed!");
     event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
     console.log("Service worker activate event");
});

self.addEventListener('fetch', (event) => {
     // console.log('Fetch intercepted for: ', event.request.url);
     event.respondWith(
          caches.match(event.request).then((cachedResponse) => {
               if (cachedResponse) {
                    console.log(`${event.request.url} loaded from cache`);
                    return cachedResponse;
               } else {
                    console.log(`${event.request.url} shall be fetched...`);
                    return fetch(event.request);
               }
          })
     );
});