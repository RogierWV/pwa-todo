# TodoPWA
Basic todo app with:
- client side caching
- offline mode
- sync with Firestore
- editor
- minimal JS, use common features wherever possible to maximize portability

# How to recreate the PWA aspect
To turn a simple project into a PWA add a manifest that gives enough metadata to be installable (see public/manifest.json) and a service worker to intercept fetch calls. Those fetches are to be served from cache when offline at least (or in this case I used a cache while revalidate strategy so resources do get updated but loads are still near instant). By serving those from cache you can avoid the dreaded "you're offline" page from your browser. Alternatively one can set up an offline fallback page (which in this case wasn't needed as everything except sync works while offline). After setting up a service worker at the root of your project (for scoping reasons as they do get limited access to your site otherwise) you can register your service worker with the browser. 