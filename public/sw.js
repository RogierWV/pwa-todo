const cacheName = 'cache-v1';
const cacheables = [
     '/',
     '/index.html',
     '/css/style.css',
     '/js/main.js',
     'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js',
     'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js'
];

self.addEventListener('install', (event) => {
     console.log("Service worker installed!");
     event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(cacheables.map((url) => {
          return new Request(url, url.startsWith('https://www.gstatic.com')?{mode: 'no-cors'}:{})
     }))));
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
          // const cache = await caches.open(cacheName);
          // const cachedPromise = await cache.match(request);
          // let fetchPromise = fetch(request);

          // if(request.url.startsWith(self.location.origin)) {
          //      event.waitUntil(async function() {
          //           const fetchResponse = await fetchPromise;
          //           await cache.put(request, fetchResponse.clone());
          //      }());
          // } else if (cacheables.includes(request.url)) {
          //      event.waitUntil(async function() {
          //           fetchPromise = fetch(new Request(request.url, {mode: 'no-cors'}));
          //           fetchResponse = await fetchPromise;
          //           await cache.put(request, fetchResponse.clone());
          //      }());
          // }

          // return cachedPromise || fetchPromise;

          caches.match(request).then((cachedResponse) => {
               if (cachedResponse) {
                    console.log(`${request.url} loaded from cache`);
                    fetch(request)
                         .then((res) => {return {c:caches.open(cacheName), r:res}})
                         .then(({c,r}) => {if(r.ok) c.put(request, r)})
                         .then(() => console.log(`cache updated for ${request}`))
                         .catch(e => console.error(`failed to update cache for ${request}`));
                    return cachedResponse;
               } else {
                    console.log(`${request.url} shall be fetched...`);
                    return fetch(request);
               }
          })
     }()
     );
});