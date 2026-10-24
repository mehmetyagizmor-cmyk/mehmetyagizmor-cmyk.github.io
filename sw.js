// Ã‡ay OcaÄŸÄ± Tycoon â€” Ã§evrimdÄ±ÅŸÄ± Ã§alÄ±ÅŸma
// Yeni sÃ¼rÃ¼m yayÄ±nlarken VERSION'Ä± artÄ±r: eski Ã¶nbellek silinir, oyuncular gÃ¼ncel sÃ¼rÃ¼mÃ¼ alÄ±r.
const VERSION = 'v19';
const CACHE = 'cayocagi-' + VERSION;
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './privacy.html',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Ã–nce Ã¶nbellekten anÄ±nda aÃ§, arka planda internetten gÃ¼ncelle (bir sonraki aÃ§Ä±lÄ±ÅŸta yeni sÃ¼rÃ¼m)
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(req, {ignoreSearch: true});
    const net = fetch(req).then(res => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
