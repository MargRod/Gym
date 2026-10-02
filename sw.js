// Guarda la app en el teléfono para que funcione sin internet en el gimnasio.
// ad6442be3d lo reemplaza scripts/build.py con un hash del index.html: cada build nuevo actualiza los teléfonos.
const CACHE = "gym-ad6442be3d";
const FILES = ["./", "./index.html", "./manifest.json",
  "./icon-192.png", "./icon-512.png", "./maskable-512.png", "./apple-touch-icon.png", "./favicon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin && !/^(fonts\.googleapis\.com|fonts\.gstatic\.com)$/.test(url.hostname)) return;
  if (req.mode === "navigate") {
    e.respondWith(caches.match(req, { ignoreSearch: true })
      .then(r => r || caches.match("./index.html")).then(r => r || fetch(req)));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(res => {
      if (res && (res.ok || res.type === "opaque")) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
