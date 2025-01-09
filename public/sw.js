const urlsToCache = [];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open("pwa-assets")
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
            .catch((err) => {
                console.error(err, "error cache");
            })
    );
});

self.addEventListener("activate", (event) => {
    console.log("Service worker activated");
});
