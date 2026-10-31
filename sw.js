// Çay Ocağı Tycoon — çevrimdışı çalışma
// Yeni sürüm yayınlarken VERSION'ı artır: eski önbellek silinir, oyuncular güncel sürümü alır.
const VERSION = 'v46';
const CACHE = 'cayocagi-' + VERSION;
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './privacy.html',
  './scene3d.js',
  './people3d.js',
  './vendor/three.module.min.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.png',
];

self.addEventListener('install', e => {
  // cache:'reload': GitHub Pages dosyaları 10 dk önbellekte tutar; yeni sürüm kurulurken eskisi alınmasın
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, {cache:'reload'})))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Önce önbellekten anında aç, arka planda internetten güncelle (bir sonraki açılışta yeni sürüm)
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(req, {ignoreSearch: true});
    // tarayıcı önbelleğini atla, sunucuya sor (sayfa açılışı isteği seçenekle kopyalanamaz, bu yüzden adresle)
    const net = fetch(req.url, {cache:'no-cache'}).then(res => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
