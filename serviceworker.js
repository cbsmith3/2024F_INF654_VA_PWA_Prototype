const CACHE_NAME = "discHaven-v6";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/pages/contact.html",
  "/pages/shop.html",
  "/pages/cart.html",
  "/css/materialize.min.css",
  "/js/materialize.min.js",
  "/js/ui.js",
  "/img/basket.png",
  "/img/mybag.png",
  "/img/mybag96.png",
  "/img/mybag199.png",
  "/img/mybagFavicon.png",
  "/img/discs/archangel.PNG",
  "/img/discs/aviar.PNG",
  "/img/discs/banshee.PNG",
  "/img/discs/beast.PNG",
  "/img/discs/destroyer.PNG",
  "/img/discs/leopard.PNG",
  "/img/discs/pure.PNG",
  "/img/discs/skeeter.PNG",
  "/img/discs/truth.PNG",
  "/img/discs/valkyrie.PNG",
  "/img/discs/wraith.PNG",
  "/img/icons/mybag62x62.png",
  "/img/icons/mybag72x72.png",
  "/img/icons/mybag96x96.png",
  "/img/icons/mybag128x128.png",
  "/img/icons/mybag144x144.png",
  "/img/icons/mybag152x152.png",
  "/img/icons/mybag192x192.png",
  "/img/icons/mybag384x384.png",
  "/img/icons/mybag512x512.png",
  "/img/screenshots/screenshot512x512.png"
];


// Install Event
self.addEventListener("install", async (event) => {
  console.log("Service worker: Installing...");
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log("Service Worker: caching files");
      await cache.addAll(ASSETS_TO_CACHE);
    })()
  );
});


// Activate Event
self.addEventListener("activate", async (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(async (cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Service Worker:  Deleting old Cache");
            await caches.delete(cache);
          }
        })
      );
    })()
  );
});

// Fetch Event with async/await
self.addEventListener("fetch", (event) => {

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);

      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(event.request);
        const cache = await caches.open(CACHE_NAME);
        // Update cache with the fetched response
        await cache.put(event.request, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        console.error("Fetch failed, returning offline page:  ", error);
        // Optionally, return an offline page here if available in the cache
        // Not needed until user login and shopping cart completed
      }
    })()
  );
});
