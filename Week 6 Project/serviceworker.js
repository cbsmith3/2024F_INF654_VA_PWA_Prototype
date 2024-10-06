const CACHE_NAME = "discHaven-v1";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/pages/about.html",
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
  "/img/discs/aviarPNG",
  "/img/discs/banshee.PNG",
  "/img/discs/beast.PNG",
  "/img/discs/destroyer.PNG",
  "/img/discs/leopard.PNG",
  "/img/discs/pure.PNG",
  "/img/discs/skeeter.PNG",
  "/img/discs/truth.PNG",
  "/img/discs/valkyrie.PNG",
  "/img/discs/wraith.PNG",
  "/img/icons/mybag72x72.png",
  "/img/icons/mybag96x96.png",
  "/img/icons/mybag128x128.png",
  "/img/icons/mybag144x144.png",
  "/img/icons/mybag152x152.png",
  "/img/icons/mybag192x192.png",
  "/img/icons/mybag384x384.png",
  "/img/icons/mybag512x512.png"
  
];

self.addEventListener("install", (event) => {
  console.log("Service worker: Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service worker: caching files");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("service Worker: Deleting old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  console.log("Service Worker: Fetching...", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
