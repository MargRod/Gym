// Guarda la app en el teléfono para que funcione sin internet en el gimnasio.
// 0819fac46c lo reemplaza scripts/build.py con un hash del index.html: cada build nuevo actualiza los teléfonos.
const CACHE = "gym-0819fac46c";
const FILES = ["./", "./index.html", "./manifest.json",
  "./icon-192.png", "./icon-512.png", "./maskable-512.png", "./apple-touch-icon.png", "./favicon.png", "./instalar.html", "./privacidad.html", "./qr.svg"];
const ART = ["./art/abductor-a.svg", "./art/abductor-b.svg", "./art/aductor-a.svg", "./art/aductor-b.svg", "./art/aperturas-a.svg", "./art/aperturas-b.svg", "./art/aperturas_polea-a.png", "./art/aperturas_polea-b.png", "./art/bulgara-a.svg", "./art/bulgara-b.svg", "./art/cruce_poleas-a.svg", "./art/cruce_poleas-b.svg", "./art/crunch-a.svg", "./art/crunch-b.svg", "./art/crunch_maq-a.svg", "./art/crunch_maq-b.svg", "./art/curl_barra-a.svg", "./art/curl_barra-b.svg", "./art/curl_barra_z-a.svg", "./art/curl_barra_z-b.svg", "./art/curl_cuerda-a.svg", "./art/curl_cuerda-b.svg", "./art/curl_femoral-a.svg", "./art/curl_femoral-b.svg", "./art/curl_manc-a.svg", "./art/curl_manc-b.svg", "./art/curl_maq-a.svg", "./art/curl_maq-b.svg", "./art/curl_polea-a.svg", "./art/curl_polea-b.svg", "./art/curl_scott-a.svg", "./art/curl_scott-b.svg", "./art/dominadas-a.svg", "./art/dominadas-b.svg", "./art/elev_piernas-a.svg", "./art/elev_piernas-b.svg", "./art/extension-a.svg", "./art/extension-b.svg", "./art/fondos-a.svg", "./art/fondos-b.svg", "./art/fondos_banco-a.svg", "./art/fondos_banco-b.svg", "./art/goblet-a.svg", "./art/goblet-b.svg", "./art/hack-a.svg", "./art/hack-b.svg", "./art/hiperextension-a.svg", "./art/hiperextension-b.svg", "./art/inclinado_manc-a.svg", "./art/inclinado_manc-b.svg", "./art/jalon-a.svg", "./art/jalon-b.svg", "./art/jalon_v-a.svg", "./art/jalon_v-b.svg", "./art/lagartijas-a.svg", "./art/lagartijas-b.svg", "./art/laterales-a.svg", "./art/laterales-b.svg", "./art/martillo-a.svg", "./art/martillo-b.svg", "./art/pajaros-a.svg", "./art/pajaros-b.svg", "./art/pantorrilla-a.svg", "./art/pantorrilla-b.svg", "./art/pantorrilla_prensa-a.svg", "./art/pantorrilla_prensa-b.svg", "./art/patada_polea-a.svg", "./art/patada_polea-b.svg", "./art/pec_deck-a.png", "./art/pec_deck-b.png", "./art/plancha-a.svg", "./art/plancha-b.svg", "./art/prensa-a.svg", "./art/prensa-b.svg", "./art/press_banca-a.svg", "./art/press_banca-b.svg", "./art/press_hombro_manc-a.png", "./art/press_hombro_manc-b.png", "./art/press_hombro_maq-a.png", "./art/press_hombro_maq-b.png", "./art/press_manc-a.svg", "./art/press_manc-b.svg", "./art/press_maquina-a.svg", "./art/press_maquina-b.svg", "./art/puente_manc-a.svg", "./art/puente_manc-b.svg", "./art/pullover-a.svg", "./art/pullover-b.svg", "./art/remo_barra-a.svg", "./art/remo_barra-b.svg", "./art/remo_manc-a.svg", "./art/remo_manc-b.svg", "./art/remo_polea-a.svg", "./art/remo_polea-b.svg", "./art/reverse_deck-a.svg", "./art/reverse_deck-b.svg", "./art/rumano-a.svg", "./art/rumano-b.svg", "./art/rumano_manc-a.svg", "./art/rumano_manc-b.svg", "./art/sentadilla-a.svg", "./art/sentadilla-b.svg", "./art/smith_banca-a.svg", "./art/smith_banca-b.svg", "./art/smith_hombro-a.svg", "./art/smith_hombro-b.svg", "./art/smith_inclinado-a.svg", "./art/smith_inclinado-b.svg", "./art/smith_sentadilla-a.svg", "./art/smith_sentadilla-b.svg", "./art/triceps_barra-a.svg", "./art/triceps_barra-b.svg", "./art/triceps_cabeza-a.svg", "./art/triceps_cabeza-b.svg", "./art/triceps_cuerda-a.svg", "./art/triceps_cuerda-b.svg", "./art/triceps_manc-a.svg", "./art/triceps_manc-b.svg", "./art/triceps_maq-a.svg", "./art/triceps_maq-b.svg", "./art/zancada-a.svg", "./art/zancada-b.svg"]; // dibujos de los ejercicios: se bajan en segundo plano, sin frenar la instalación

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))
      .then(() => { c.addAll(ART).catch(() => {}); }))
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
