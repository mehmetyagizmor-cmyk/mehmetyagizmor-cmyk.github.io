// Çay Ocağı Tycoon — 3D sahne katmanı (Three.js, low-poly)
// Oyun mantığına dokunmaz: her karede index.html'deki durumu (R, S, SLOTS, lv…) okuyup çizer.
// Birimler 2D sahneyle aynı (piksel): 2D'deki x → 3D x, 2D'deki y (derinlik) → 3D z, yükseklik → 3D y.
import * as THREE from './vendor/three.module.min.js';
import {Person} from './people3d.js';

export const to3 = (x, y, h = 0) => new THREE.Vector3(x, h, y);
const WALL_H = FLOOR;   // 2D'de duvar zeminin üstündeki 200 piksel
const TALL = 1500;      // duvarların gerçek yüksekliği: kameranın üstünde boş karanlık kalmasın

// ---------- Paylaşılan geometri ve materyaller ----------
const GEO = {
  box: new THREE.BoxGeometry(1, 1, 1),
  cyl: new THREE.CylinderGeometry(1, 1, 1, 12),
  cyl6: new THREE.CylinderGeometry(1, 1, 1, 6),
  cone: new THREE.CylinderGeometry(0.6, 1, 1, 8),
  sph: new THREE.IcosahedronGeometry(1, 1),
  plane: new THREE.PlaneGeometry(1, 1),
};
const MATS = new Map();
const SHARED = new Set(Object.values(GEO));   // oda yenilenince silinmeyecek geometri ve materyaller
function mat(color, basic){
  const k = color + (basic ? 'b' : '');
  let m = MATS.get(k);
  if (!m){
    m = basic ? new THREE.MeshBasicMaterial({color}) : new THREE.MeshLambertMaterial({color, flatShading:true});
    MATS.set(k, m); SHARED.add(m);
  }
  return m;
}
// Sahneden çıkan grubun bellek kaynaklarını bırakır: telefon döndükçe ya da dekor alındıkça dokular birikmesin
function dispose(group){
  group.traverse(o => {
    if (o.geometry && !SHARED.has(o.geometry)) o.geometry.dispose();
    [].concat(o.material || []).forEach(m => {
      if (SHARED.has(m)) return;
      if (m.map) m.map.dispose();
      m.dispose();
    });
  });
}
// Alt yüzü y'de duran kutu / silindir (merkez x, z)
function box(parent, w, h, d, color, x, y, z){
  const m = new THREE.Mesh(GEO.box, typeof color === 'string' ? mat(color) : color);
  m.scale.set(w, h, d); m.position.set(x, y + h / 2, z); parent.add(m); return m;
}
function cyl(parent, r, h, color, x, y, z, geo = GEO.cyl){
  const m = new THREE.Mesh(geo, typeof color === 'string' ? mat(color) : color);
  m.scale.set(r, h, r); m.position.set(x, y + h / 2, z); parent.add(m); return m;
}

function canvasTex(w, h, draw){
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

// Zemin desenleri: 2D drawRoom'daki dört seviyenin karşılığı (tekrarlanan karo)
const FLOOR_TEX = [];
function floorTex(L){
  if (FLOOR_TEX[L]) return FLOOR_TEX[L];
  const t = canvasTex(256, 256, (c, w) => {
    if (L === 0){
      c.fillStyle = '#8b5a35'; c.fillRect(0, 0, w, w); c.strokeStyle = '#6e4527'; c.lineWidth = 4;
      for (let y = 0, r = 0; y < w; y += 52, r++){ c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke();
        const x = (r * 114) % w; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 52); c.stroke(); }
    } else if (L === 1){
      for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++){ c.fillStyle = (r + k) % 2 ? '#3f3a36' : '#ddd3c1'; c.fillRect(k * 64, r * 64, 64, 64); }
    } else if (L === 2){
      for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++){
        const alt = (r + k) % 2, x = k * 64, y = r * 64;
        c.fillStyle = alt ? '#9a6538' : '#b07a45'; c.fillRect(x, y, 64, 64);
        c.strokeStyle = 'rgba(0,0,0,.18)'; c.lineWidth = 2;
        for (let j = 1; j < 3; j++){ c.beginPath(); alt ? (c.moveTo(x + j * 21, y), c.lineTo(x + j * 21, y + 64)) : (c.moveTo(x, y + j * 21), c.lineTo(x + 64, y + j * 21)); c.stroke(); }
      }
    } else {
      c.fillStyle = '#ece7df'; c.fillRect(0, 0, w, w);
      c.strokeStyle = 'rgba(140,125,110,.35)'; c.lineWidth = 2;
      for (let i = 0; i < 6; i++){ const x0 = (i * 97) % w, y0 = (i * 61) % w; c.beginPath(); c.moveTo(x0, y0); c.quadraticCurveTo(x0 + 40, y0 + 16, x0 + 90, y0 - 8); c.stroke(); }
      c.strokeStyle = '#cbc2b4'; c.lineWidth = 3; c.strokeRect(0, 0, w, w);
    }
  });
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return FLOOR_TEX[L] = t;
}
const FLOOR_TILE = [120, 80, 72, 140];   // bir karonun 2D piksel karşılığı

// ---------- Kurulum ----------
let renderer, scene, cam, room, roomKey = '', camKey = '';
let lost = false, lostAt = 0;
let skyMats = [], clockH, clockM, sign, signKey = '', signTex = {}, hemi, sun;
let sway = [], bobs = [], glows = [], bulbs = [], snow = null, deco, decoKey = '';
const tables = [];
const ray = new THREE.Raycaster(), groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

export function init(canvas){
  renderer = new THREE.WebGLRenderer({canvas, antialias:(window.devicePixelRatio || 1) < 2, powerPreference:'high-performance'});
  renderer.setClearColor('#1a110b');
  // Sessizce siyah çizmek yerine hata versin: index.html yakalayıp 2D'ye döner ve sebebini gösterir
  renderer.debug.onShaderError = (gl, program) => { throw new Error('shader: ' + (gl.getProgramInfoLog(program) || 'derlenemedi').slice(0, 100)); };
  // Telefon kilitlenince bağlam kısa süre düşebilir: geri gelmesi beklenir, gelince oda yeniden kurulur
  canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); lost = true; lostAt = performance.now(); });
  canvas.addEventListener('webglcontextrestored', () => { lost = false; roomKey = camKey = signKey = decoKey = ''; });
  scene = new THREE.Scene();
  hemi = new THREE.HemisphereLight('#fff4e0', '#5a4030', 1.9); scene.add(hemi);
  sun = new THREE.DirectionalLight('#ffffff', 1.4); sun.position.set(-300, 600, 900); scene.add(sun);
  cam = new THREE.PerspectiveCamera(46, 16 / 9, 10, 6000);   // geniş açı: derinlik daha belirgin
  resize();
  return {render, resize, pick, hit, toScreen, anchor, from2D};
}

export function resize(){
  const c = renderer.domElement, w = c.clientWidth, h = c.clientHeight;
  if (!w || !h) return;
  renderer.setPixelRatio(pr);
  renderer.setSize(w, h, false);
  camKey = '';
}

// Kamera: sabit, önden ve hafif yukarıdan. Görünen alanın (W × viewH) tamamı sığana kadar geri çekilir,
// bu yüzden dikey telefonda ve dükkân büyüdükçe kendiliğinden uzaklaşır.
const TILT = 0.3;    // aşağı bakış açısı (radyan, ~17°): önden, hafif yukarıdan
function fitCamera(){
  const vh = viewH(), c = renderer.domElement;
  cam.aspect = c.clientWidth / c.clientHeight || W / vh;
  const X = Math.min(W, rightWall() + 30);   // kiralanmamış alan kenarda kalır, dükkân büyüyünce kamera uzaklaşır
  const pts = [[0, 0, FLOOR], [X, 0, FLOOR], [0, WALL_H, FLOOR], [X, WALL_H, FLOOR], [0, 0, vh], [X, 0, vh]].map(p => new THREE.Vector3(...p));
  const dir = new THREE.Vector3(0, -Math.sin(TILT), -Math.cos(TILT));
  const target = new THREE.Vector3(X / 2, WALL_H * 0.35, (FLOOR + vh) / 2);
  const place = d => { cam.position.copy(target).addScaledVector(dir, -d); cam.lookAt(target); cam.updateMatrixWorld(); cam.updateProjectionMatrix(); };
  const fits = () => pts.every(p => { const q = p.clone().project(cam); return Math.abs(q.x) <= 1 && Math.abs(q.y) <= 1; });
  const solve = () => { let lo = 100, hi = 8000; for (let i = 0; i < 30; i++){ const m = (lo + hi) / 2; place(m); fits() ? hi = m : lo = m; } place(hi); return hi; };
  // İki tur: önce sığdır, sonra içeriği dikeyde ortala ve tekrar sığdır
  for (let k = 0; k < 2; k++){
    const d = solve();
    let lo = 1, hi = -1;
    pts.forEach(p => { const y = p.clone().project(cam).y; lo = Math.min(lo, y); hi = Math.max(hi, y); });
    const halfH = Math.tan(cam.fov * Math.PI / 360) * d;
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(cam.quaternion);
    target.addScaledVector(up, (lo + hi) / 2 * halfH);
  }
  solve();
}

// ---------- Oda ----------
function buildRoom(){
  if (room){ scene.remove(room); dispose(room); }
  room = new THREE.Group(); scene.add(room);
  skyMats = []; tables.length = 0; signKey = '';
  const L = lv('dukkan'), RW = rightWall(), front = H + 3000;   // zemin ve yan duvarlar kameranın arkasına kadar uzanır: kenarlarda boşluk kalmaz

  // Zemin
  const ft = floorTex(L).clone(); ft.needsUpdate = true;
  ft.repeat.set(RW / FLOOR_TILE[L], (front - FLOOR) / FLOOR_TILE[L]);
  const floor = new THREE.Mesh(GEO.plane, new THREE.MeshLambertMaterial({map:ft}));
  floor.rotation.x = -Math.PI / 2; floor.scale.set(RW, front - FLOOR, 1); floor.position.set(RW / 2, 0, (FLOOR + front) / 2);
  room.add(floor);
  // Henüz kiralanmamış kısım
  if (RW < W){
    box(room, W - RW + 200, 2, front - FLOOR + 200, '#2a1d16', (RW + W + 200) / 2, -2, (FLOOR + front) / 2);
    const lock = new THREE.Mesh(GEO.plane, new THREE.MeshBasicMaterial({transparent:true, map:canvasTex(512, 160, (c, w) => {
      c.fillStyle = '#c9b39a'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.font = `bold 44px system-ui, ${EMOJI}`; c.fillText('🔒 Burası henüz senin değil', w / 2, 55);
      c.font = '34px system-ui'; c.fillText('Dükkânı büyütünce açılır', w / 2, 115);
    })}));
    const lw = Math.min(W - RW - 70, 260);
    lock.scale.set(lw, lw * 160 / 512, 1); lock.rotation.x = -Math.PI / 2 + 0.5;
    lock.position.set((RW + W) / 2 + 15, 30, 380); room.add(lock);
  }

  // Arka duvar ve alt bant
  const wallCol = ['#d8c3a0', '#efe3c6', '#7b2f2f', '#22344a'][L];
  box(room, RW, TALL, 10, wallCol, RW / 2, 0, FLOOR - 5);
  box(room, RW, 8, 10, '#6b4428', RW / 2, WALL_H, FLOOR + 2);   // tavan pervazı
  if (L >= 1) box(room, RW, 65, 4, ['', '#3e6b4f', '#4a2a1a', '#1a2838'][L], RW / 2, 0, FLOOR + 1);
  if (L === 1) for (let x = 8; x + 44 < RW; x += 60) box(room, 44, 45, 2, '#2d5039', x + 22, 10, FLOOR + 4);
  if (L === 3){ box(room, RW, 3, 3, '#c9a14a', RW / 2, 186, FLOOR + 1); box(room, RW, 3, 3, '#c9a14a', RW / 2, 64, FLOOR + 1);
    for (let x = 20; x < RW; x += 160) box(room, 10, 121, 2, '#4f5a55', x + 5, 65, FLOOR + 1); }
  // Yan duvarlar ve kapı (kapı koridorun hizasında, sağ duvarda)
  box(room, 10, TALL, front - FLOOR, wallCol, -5, 0, (FLOOR + front) / 2);
  const a = aisleY(), doorA = a - 45, doorB = a + 45;
  box(room, 10, TALL, doorA - FLOOR, wallCol, RW + 5, 0, (FLOOR + doorA) / 2);
  if (front > doorB) box(room, 10, TALL, front - doorB, wallCol, RW + 5, 0, (doorB + front) / 2);
  box(room, 12, TALL - 110, doorB - doorA, wallCol, RW + 5, 110, a);
  box(room, 14, 8, doorB - doorA + 16, '#6b4428', RW + 5, 106, a);

  // Pencereler (gökyüzü rengi her karede güncellenir)
  const x0 = 300, x1 = RW - 190, ww = 100, n = Math.min([1, 2, 3, 3][L], Math.floor((x1 - x0) / (ww + 10)));
  const gap = (x1 - x0 - n * ww) / (n + 1);
  for (let i = 0; i < n; i++){
    const wx = x0 + gap + i * (ww + gap) + ww / 2, wy = 87, wh = 85;
    box(room, ww + 12, wh + 12, 4, '#5a3a22', wx, wy - 6, FLOOR + 1);
    const sky = new THREE.MeshBasicMaterial({color:'#8fd0f5'}); skyMats.push(sky);
    box(room, ww, wh, 2, sky, wx, wy, FLOOR + 3);
    [[-36, 22, 28], [-2, 32, 30], [35, 18, 30]].forEach(([dx, h, w]) => box(room, w, h, 1, '#3d4a5e', wx + dx, wy, FLOOR + 4.5));
    box(room, 4, wh, 4, '#5a3a22', wx, wy, FLOOR + 6); box(room, ww, 4, 4, '#5a3a22', wx, wy + wh / 2 - 2, FLOOR + 6);
    box(room, ww + 20, 5, 12, '#6b4428', wx, wy - 12, FLOOR + 6);
    if (L >= 2){ const cc = L === 3 ? '#7a1f2b' : '#b8483a';
      box(room, 22, wh + 14, 5, cc, wx - ww / 2 - 4, wy - 8, FLOOR + 9); box(room, 22, wh + 14, 5, cc, wx + ww / 2 + 4, wy - 8, FLOOR + 9); }
  }

  // Duvar saati (akrep/yelkovan her karede döner)
  const clock = new THREE.Group(); clock.position.set(RW - 70, WALL_H - 72, FLOOR + 2); room.add(clock);
  const face = (r, c, z) => { const m = new THREE.Mesh(GEO.cyl, mat(c)); m.scale.set(r, 4, r); m.rotation.x = Math.PI / 2; m.position.z = z; clock.add(m); };
  face(30, '#5a3a22', 2); face(25, '#fbf6ee', 4);
  const hand = (len, w) => { const p = new THREE.Group(); p.position.z = 7; const m = new THREE.Mesh(GEO.box, mat('#2a1a12')); m.scale.set(w, len, 2); m.position.y = len / 2; p.add(m); clock.add(p); return p; };
  clockH = hand(12, 4); clockM = hand(19, 2.5);

  // Raf ve bardaklar
  box(room, 244, 6, 16, '#6b4428', 150, WALL_H - 119, FLOOR + 8);
  for (let i = 0; i < 8; i++){ const x = 44 + i * 28;
    cyl(room, 5, 18, '#b5481c', x, WALL_H - 113, FLOOR + 8, GEO.cone); cyl(room, 6.2, 3, '#e8e2d8', x, WALL_H - 97, FLOOR + 8); }
  if (L >= 2){ box(room, 244, 6, 16, '#6b4428', 150, 52, FLOOR + 8);
    ['#d35400', '#7f8c8d', '#27ae60', '#c0392b'].forEach((c, i) => { cyl(room, 12, 22, c, 57 + i * 60, 58, FLOOR + 8, GEO.cyl6); cyl(room, 12.5, 4, '#dddddd', 57 + i * 60, 80, FLOOR + 8, GEO.cyl6); }); }

  // Tabela (yazısı ve neonu canvas dokusu)
  const wood = mat('#3a2416');
  sign = new THREE.Mesh(GEO.box, [wood, wood, wood, wood, new THREE.MeshBasicMaterial({color:'#ffffff'}), wood]);
  sign.scale.set(252, 62, 6); sign.position.set(150, WALL_H - 51, FLOOR + 3); room.add(sign);

  buildCounter(L);
  buildDecor(L);

  // Masalar ve sandalyeler
  for (let i = 0; i < numTables(); i++){
    const s = SLOTS[i], t = new THREE.Group(); t.position.set(s.x, 0, s.y); room.add(t); tables[i] = t;
    const top = ['#a0703f', '#c0392b', '#f3ead6', '#f4f1ec'][L], ch = CHAIR[L];
    // sandalye masanın arkasında (kameradan uzakta)
    box(t, 32, 4, 28, ch, 0, 20, -24);
    box(t, 32, 34, 5, ch, 0, 24, -40);
    [[-13, -12], [13, -12], [-13, -36], [13, -36]].forEach(([x, z]) => box(t, 3, 20, 3, ch, x, 0, z));
    cyl(t, 14, 3, '#2a1d16', 0, 0, 0); cyl(t, 4, 28, '#2a1d16', 0, 0, 0);
    cyl(t, 42, 4, top, 0, 28, 0);
    if (L === 1) for (let k = -30; k <= 30; k += 15) cyl(t, 3, 0.6, '#ffffff', k, 32, 0, GEO.cyl6);
    if (L === 3) cyl(t, 43.5, 2, '#c9a14a', 0, 28.5, 0);
  }
}

function buildCounter(L){
  const g = new THREE.Group(); room.add(g);
  const z = 318, dep = 34;
  box(g, 260, 44, dep, ['#7a4f2b', '#8a5a30', '#4a2a16', '#2a3b4f'][L], 148, 0, z);
  box(g, 268, 5, dep + 8, ['#a0703f', '#b98a55', '#6b3e22', '#e9e4dc'][L], 148, 44, z);
  for (let x = 30; x < 270; x += 62) box(g, 50, 32, 1, ['#6a4425', '#7a4f2a', '#3d2312', '#22313f'][L], x + 25, 6, z + dep / 2 + 0.5);
  if (L === 3) box(g, 262, 2, 1, '#c9a14a', 148, 41, z + dep / 2 + 1);
  // Sahibin isim plaketi
  const plate = new THREE.Mesh(GEO.plane, new THREE.MeshBasicMaterial({map:canvasTex(256, 52, (c, w, h) => {
    c.fillStyle = '#c9a14a'; c.fillRect(0, 0, w, h); c.fillStyle = '#2b1d14'; c.font = 'bold 28px system-ui';
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(owner().name.slice(0, 16), w / 2, h / 2 + 1);
  })}));
  plate.scale.set(100, 20, 1); plate.position.set(148, 22, z + dep / 2 + 1.5); g.add(plate);
  // Semaver
  const sl = lv('semaver'), sh = 34 + sl * 3, col = sl >= 4 ? '#d9d9e0' : '#c9a14a';
  cyl(g, 15, 6, '#3a2416', 245, 49, z); cyl(g, 13, sh, col, 245, 55, z, GEO.cyl6);
  cyl(g, 9, 9, '#c0392b', 245, 55 + sh, z, GEO.cone); cyl(g, 3, 4, '#c0392b', 245, 64 + sh, z);
  box(g, 8, 3, 3, '#333333', 260, 70, z + 6);
}

function drawSignTex(){
  const t = lv('tabela'), name = owner().shopName, blink = t >= 3 ? Math.floor(now() * 4) % 2 : 0;
  // Yanıp sönmenin iki hâli bir kez çizilir, sonra yalnızca doku değiştirilir
  const key = [t, name, S.cur].join('|');
  if (key !== signKey){ signKey = key; Object.values(signTex).forEach(x => x.dispose()); signTex = {}; }
  const m = sign.material[4];
  const tex = signTex[blink] || (signTex[blink] = canvasTex(504, 124, (c, w, h) => {
    c.fillStyle = '#3a2416'; c.fillRect(0, 0, w, h);
    c.strokeStyle = '#c9a14a'; c.lineWidth = 4; c.strokeRect(8, 8, w - 16, h - 16);
    let size = S.cur ? 44 : 52;
    c.font = `bold ${size}px Georgia, serif`;
    while (c.measureText(name).width > w - 48 && size > 24){ size--; c.font = `bold ${size}px Georgia, serif`; }
    c.textAlign = 'center'; c.textBaseline = 'middle';
    if (t > 0){ const col = ['#ffd36b', '#ff6bd6', '#6be3ff', '#7bff8a', '#ff8a5c'][t - 1]; c.shadowColor = col; c.shadowBlur = 16 + t * 10; c.fillStyle = col; }
    else c.fillStyle = '#f6ead8';
    const sub = S.cur ? city().name.toLocaleUpperCase('tr-TR') : '';
    c.fillText(name, w / 2, h / 2 + (sub ? -14 : 2));
    c.shadowBlur = 0;
    if (sub){ c.font = 'bold 24px Georgia, serif'; c.fillStyle = '#c9a14a'; c.fillText('— ' + sub + ' —', w / 2, h - 28); }
    if (t >= 3) for (let i = 0; i < 14; i++){
      c.fillStyle = (blink + i) % 2 ? '#fff3b0' : '#a0884a';
      c.beginPath(); c.arc(16 + i * (w - 32) / 13, 4, 4, 0, 7); c.fill();
      c.beginPath(); c.arc(16 + i * (w - 32) / 13, h - 4, 4, 0, 7); c.fill();
    }
  }));
  if (m.map === tex) return;
  if (!m.map) m.needsUpdate = true;   // yeni materyal: gölgelendirici dokulu derlensin
  m.map = tex;
}

// ---------- Her kare ----------
// Uyarlanır çözünürlük: kare süresi uzarsa (yavaş telefon) piksel oranı adım adım düşer, akıcı kalınca geri çıkar
const MAX_PR = Math.min(matchMedia('(pointer:coarse)').matches ? 1.5 : 2, window.devicePixelRatio || 1);
let pr = MAX_PR, ema = 1 / 60, slowT = 0, fastT = 0, lastF = 0, fpsEl = null;
function adapt(t){
  const dt = t - lastF; lastF = t;
  if (dt <= 0 || dt > 0.5) return;               // sekme arka plandaydı
  if (status !== 'running' || modalOpen()) return;   // durgunken sahne bilerek yavaş çizilir, ölçüme girmesin
  ema += (dt - ema) * 0.05;
  if (ema > 1 / 45){ slowT += dt; fastT = 0; } else if (ema < 1 / 57){ fastT += dt; slowT = 0; } else slowT = fastT = 0;
  const set = v => { pr = v; slowT = fastT = 0; resize(); };
  if (slowT > 2 && pr > 0.75) set(Math.max(0.75, pr - 0.25));
  else if (fastT > 6 && pr < MAX_PR) set(Math.min(MAX_PR, pr + 0.25));
  // Test: adrese ?fps eklenince köşede kare hızı ve çözünürlük görünür
  if (/fps/.test(location.search)){
    if (!fpsEl){ fpsEl = document.createElement('div'); fpsEl.style.cssText = 'position:fixed;left:6px;bottom:6px;z-index:999;background:#000a;color:#7f7;font:12px monospace;padding:3px 6px;border-radius:4px;pointer-events:none'; document.body.appendChild(fpsEl); }
    fpsEl.textContent = `${Math.round(1 / ema)} fps · çöz. ${pr} · ${people.size} kişi · ${renderer.info.render.calls} çizim`;
  }
}

export function render(frac){
  if (lost){
    if (performance.now() - lostAt > 5000) throw new Error('ekran kartı bağlantısı koptu (WebGL context lost)');
    return;
  }
  const rk = [lv('dukkan'), rightWall(), portrait, numTables(), lv('semaver'), owner().name, W, H, lv('dekor'), COL_ITEMS.filter(it => owned(it.id)).length].join('|');
  if (rk !== roomKey){ roomKey = rk; buildRoom(); camKey = ''; }
  const ck = [W, viewH(), rightWall(), renderer.domElement.clientWidth, renderer.domElement.clientHeight].join('|');
  if (ck !== camKey){ camKey = ck; fitCamera(); }

  const sky = frac < 0.6 ? '#8fd0f5' : frac < 0.85 ? mix('#8fd0f5', '#f5a15a', (frac - 0.6) / 0.25) : mix('#f5a15a', '#33406a', Math.min(1, (frac - 0.85) / 0.15));
  skyMats.forEach(m => m.color.set(sky));
  const mins = 8 * 60 + frac * 12 * 60;
  clockH.rotation.z = -(mins / 60 % 12) / 12 * Math.PI * 2;
  clockM.rotation.z = -(mins % 60) / 60 * Math.PI * 2;
  drawSignTex();
  const dk = [(EV() || {}).deco, rightWall(), lv('dukkan')].join('|');
  if (dk !== decoKey){ decoKey = dk; buildEventDeco(); }
  const t = now();
  adapt(t);
  animateDecor(t, frac);
  // Yeni masa "belirme" animasyonu (2D ile aynı tableBorn kaydını okur)
  tables.forEach((tb, i) => {
    let k = 1;
    if (tableBorn[i] != null){ const a = (t - tableBorn[i]) / 0.6; if (a < 1) k = easeBack(Math.max(0.01, a)); }
    tb.scale.setScalar(k);
  });
  syncPeople(t);
  syncFloor(t);
  renderer.render(scene, cam);
}

// ---------- İnsanlar ----------
// Her karede oyundaki kişiler okunur; model yoksa kurulur, görünüş değiştiyse yenilenir, gidenler kaldırılır.
const people = new Map();
let seen;
function put(id, look, opts, st, t){
  let p = people.get(id);
  if (!p){ p = new Person(look, opts); people.set(id, p); scene.add(p.root); p.lx = st.x; p.ly = st.y; p.face = st.face || 0; }
  else if ((p.look !== look || p.apron !== !!opts.apron) && p.key !== JSON.stringify(look) + !!opts.apron) p.setLook(look, opts);
  else p.look = look;
  // Yüzü yürüdüğü yöne döner (2D'deki flip'in karşılığı); duranlar kameraya bakar
  const dx = st.x - p.lx, dy = st.y - p.ly;
  if (st.face != null) p.face = st.face;
  else if (dx * dx + dy * dy > 0.01) p.face = Math.atan2(dx, dy);
  else if (st.walk == null) p.face = 0;
  p.lx = st.x; p.ly = st.y;
  p.update({...st, face:p.face}, t);
  seen.add(id);
}
function syncPeople(t){
  seen = new Set();
  if (R){
    // tezgâh arkası: sahip ve çıraklar (meşgulken hafifçe sallanır)
    for (let i = 0; i < lv('cirak'); i++)
      put('cirak' + i, CIRAK_LOOKS[i], {apron:true}, {x:CIRAK_X[i], y:282, face:0, bob:R.helpers[i] ? Math.abs(Math.sin(t * 14 + i)) * 1.5 : 0}, t);
    put('owner', owner(), {apron:true}, {x:128, y:282, face:0, bob:R.queue.length ? Math.abs(Math.sin(t * 14)) * 1.5 : 0}, t);
    R.customers.forEach(c => {
      if (c.state === 'seated'){
        const s = SLOTS[c.seat], ratio = c.patience / c.max;
        const mood = c.leaving ? c.leaving.mood : ratio > 0.5 ? 'happy' : ratio > 0.25 ? 'neutral' : 'angry';
        const shake = ratio < 0.25 ? Math.sin(t * 40) * 1.2 : 0;
        put('c' + c.id, c.look, {}, {x:s.x + shake, y:s.y - 24, face:0, sit:true, mood}, t);
      } else {
        // kalkış: mutlu olan bahşişi bırakırken iki kez zıplar, kızgın olan hızlı yürür
        const id = 'c' + c.id, p = people.get(id), mood = c.leaving ? c.leaving.mood : 'happy';
        if (p && c.leaving && p.leftAt == null) p.leftAt = t;
        const since = p && p.leftAt != null ? t - p.leftAt : 9;
        const hop = mood === 'happy' && since < 0.7 ? Math.abs(Math.sin(since * 9)) * 9 : 0;
        put(id, c.look, {}, {x:c.x, y:c.y, walk:c.walk, mood, hurry:mood === 'angry', hop}, t);
      }
    });
    R.garsons.forEach(gs => put('g' + gs.i, GARSON_LOOKS[gs.i], {}, {x:gs.x, y:gs.y, walk:gs.state === 'idle' ? null : gs.walk, carry:!!gs.carry}, t));
    if (R.arson) put('arson', ARSON_LOOK, {}, {x:R.arson.x, y:R.arson.y, face:0, mood:'angry'}, t);
    cleaners(t);
  }
  if (VITRIN) vitrin(t);
  for (const [id, p] of people) if (!seen.has(id)){ scene.remove(p.root); people.delete(id); }
  // ekrandaki baş ve tepsi noktaları (balon, uçan yazı, taşınan ürün için)
  for (const [id, p] of people){
    p.root.updateMatrixWorld(true);
    p.head = toScreen(p.root.position.x, p.fig.position.y + 90, p.root.position.z);
    if (p.armProp === 'tray'){ const v = p.armR.mesh.localToWorld(new THREE.Vector3(0, -21, 6)); p.tray = toScreen(v.x, v.y + 4, v.z); }
  }
}
export function anchor(id, which = 'head'){ const p = people.get(id); return p && p[which]; }

// Temizlikçi: 2D'de çizilmez, oyunda konumu yok. 3D'de görsel olarak sıradaki kire yürüyüp süpürür
// (kiri oyun mantığı R.cleanIn ile siler; bu yalnızca görüntü)
const TEMIZLIK_LOOKS = [
  {skin:SKINS[2], hair:HAIRS[1], style:0, shirt:'#3b8fc4', beard:true, hat:'kasket'},
  {skin:SKINS[0], hair:HAIRS[3], style:3, shirt:'#3b8fc4', beard:false},
  {skin:SKINS[3], hair:HAIRS[0], style:4, shirt:'#3b8fc4', beard:false},
];
const cl = [];
let clT = 0;
function cleaners(t){
  const dt = Math.min(0.1, t - clT); clT = t;
  for (let i = 0; i < lv('temizlikci'); i++){
    const home = {x:30 + i * 34, y:aisleY() - 8};
    const c = cl[i] || (cl[i] = {...home, walk:0});
    const st = R.stains[i], to = st ? {x:st.x + 22, y:st.y} : home;
    const dx = to.x - c.x, dy = to.y - c.y, d = Math.hypot(dx, dy), step = 110 * dt;
    let walk = null;
    if (d > 2){ const k = Math.min(1, step / d); c.x += dx * k; c.y += dy * k; c.walk += dt * 13; walk = c.walk; }
    put('temiz' + i, TEMIZLIK_LOOKS[i], {}, {x:c.x, y:c.y, walk, prop:'broom', sweep:!!st && d <= 2}, t);
  }
}

// ---------- Zemindeki kirler ve kundakçı halkası ----------
const STAIN = new THREE.MeshBasicMaterial({color:'#46260c', transparent:true, opacity:0.78, depthWrite:false});
const RING = new THREE.MeshBasicMaterial({color:'#ff4d3a'});
const DISC = new THREE.CircleGeometry(1, 16), TORUS = new THREE.TorusGeometry(1, 0.08, 4, 32);
const stainPool = [];
let ring;
function syncFloor(t){
  const list = R ? R.stains : [];
  while (stainPool.length < list.length * 2){ const m = new THREE.Mesh(DISC, STAIN); m.rotation.x = -Math.PI / 2; scene.add(m); stainPool.push(m); }
  stainPool.forEach((m, i) => {
    const st = list[i >> 1];
    m.visible = !!st;
    if (!st) return;
    if (i % 2 === 0){ m.position.set(st.x, 0.8, st.y); m.scale.set(15 + st.r * 6, 9 + st.r * 3, 1); }
    else { m.position.set(st.x + 14, 0.9, st.y - 4); m.scale.set(5, 3.5, 1); }
  });
  if (!ring){ ring = new THREE.Mesh(TORUS, RING); ring.rotation.x = -Math.PI / 2; scene.add(ring); }
  ring.visible = !!(R && R.arson);
  if (ring.visible){ const p = 1 + Math.sin(t * 10) * 0.12; ring.position.set(R.arson.x, 1, R.arson.y); ring.scale.set(30 * p, 22 * p, 30 * p); }
}

// ---------- Ekran izdüşümü ----------
const _v = new THREE.Vector3();
// 3D nokta → üst katmanın (2D canvas, W × viewH birim) koordinatı
export function toScreen(x, h, z){
  _v.set(x, h, z).project(cam);
  return [(_v.x + 1) / 2 * W, (1 - _v.y) / 2 * viewH()];
}
// 2D efekt parçacığının (x, y) konumunu 3D'ye yerleştirir: ilk görüldüğünde neye ait olduğu bulunur
// (masadaki müşteri, semaver buharı, ekran efekti ya da zemindeki bir nokta), sonra yükselip alçalması korunur
export function from2D(p){
  if (!p.m3){
    const s = SLOTS.slice(0, numTables()).find(s => Math.abs(p.x - s.x) < 8 && p.y <= s.y && s.y - p.y <= 240);
    if (p.screen || (!s && p.y < 120)) p.m3 = {scr:true};
    else if (p.type === 'puff') p.m3 = {z:318, base:p.y, k:0.8, c:75 + lv('semaver') * 3};
    else if (s) p.m3 = {z:s.y - 24, base:s.y, k:0.8, c:15};
    else p.m3 = {z:p.y + 40, base:p.y + 40, k:1, c:0};
  }
  const m = p.m3;
  return m.scr ? [p.x, p.y] : toScreen(p.x, (m.base - p.y) * m.k + m.c, m.z);
}

// ---------- Dokunma (raycast) ----------
// Oturan müşteriler ve kundakçı için görünmez, parmağa uygun geniş kutular; hiçbirine değmezse zemindeki nokta
const HITMAT = new THREE.MeshBasicMaterial({side:THREE.DoubleSide});
export function hit(clientX, clientY){
  const r = renderer.domElement.getBoundingClientRect();
  ray.setFromCamera(new THREE.Vector2((clientX - r.left) / r.width * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1), cam);
  const boxes = [];
  const add = (id, x, h, z, w, hh, d) => { const m = new THREE.Mesh(GEO.box, HITMAT); m.position.set(x, h, z); m.scale.set(w, hh, d); m.updateMatrixWorld(); m.userData.id = id; boxes.push(m); };
  if (R.arson) add('arson', R.arson.x, 55, R.arson.y, 80, 130, 60);
  R.customers.forEach(c => { if (c.state === 'seated' && !c.leaving){ const s = SLOTS[c.seat]; add('c' + c.id, s.x, 80, s.y - 12, 120, 190, 90); } });
  const hits = ray.intersectObjects(boxes, false);
  if (hits.length){
    // Kutular derinlikte üst üste biner: en öndeki değil, ekranda dokunuşa en yakın kişi seçilir (baştan biraz aşağısı)
    const tx = (clientX - r.left) / r.width * W, ty = (clientY - r.top) / r.height * viewH();
    const away = h => { const p = anchor(h.object.userData.id); return p ? Math.hypot(p[0] - tx, p[1] + 35 - ty) : Infinity; };
    const id = hits.reduce((a, b) => away(b) < away(a) ? b : a).object.userData.id;
    return id === 'arson' ? {arson:true} : {cust:+id.slice(1)};
  }
  return {ground:pick(clientX, clientY)};
}

// Test vitrini (adrese ?vitrin eklenince): tüm müşteri tipleri ve ekip yan yana dizilir
const VITRIN = /vitrin/.test(location.search);
let VLOOKS;
function vitrin(t){
  if (!VLOOKS){
    const rl = () => randomLook();
    VLOOKS = [
      [rl()], [{...rl(), style:1}], [{...rl(), style:2, beard:true}], [{...rl(), style:3}], [{...rl(), style:4}],
      [{...rl(), shirt:'#1d1d2b', suit:true, hat:'crown'}],                              // VIP
      [{...rl(), shirt:'#ff6fae', prop:'phone'}],                                        // influencer
      [{...rl(), shirt:'#21b3a5', hat:'sun', prop:'camera'}],                            // turist
      [{...rl(), shirt:'#3d3d46', glasses:true, hat:'bere', prop:'note'}],               // eleştirmen
      ...REGULARS.slice(0, 3).map(r => [r.look]),                                        // müdavimler
      [ARSON_LOOK, {}, 'angry'], [GARSON_LOOKS[0]], [CIRAK_LOOKS[0], {apron:true}],
      [null, {apron:true}], [null, {apron:true}, 'happy', 'k'],                         // sahip (erkek / kadın hâli)
    ];
  }
  const per = Math.ceil(VLOOKS.length / 2), RW = rightWall(), a = aisleY();
  VLOOKS.forEach(([look, opts = {}, mood, g], i) => {
    if (!look) look = g ? {...owner(), g:'k', beard:false, style:owner().style === 0 ? 1 : owner().style} : owner();
    const row = Math.floor(i / per), col = i % per;
    put('v' + i, look, opts, {x:40 + col * (RW - 80) / (per - 1), y:a - 70 + row * 60, face:0, mood:mood || ['happy', 'neutral', 'angry'][Math.floor(t / 3) % 3]}, t);
  });
}

// Ekrandaki dokunuşu zemine indirir: 2D koordinatı ({x, y}) döner
export function pick(clientX, clientY){
  const r = renderer.domElement.getBoundingClientRect();
  ray.setFromCamera(new THREE.Vector2((clientX - r.left) / r.width * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1), cam);
  const p = ray.ray.intersectPlane(groundPlane, new THREE.Vector3());
  return p ? {x:p.x, y:p.z} : null;
}

// ---------- Dekorasyon (Mağaza → Dekorasyon seviyeleri, 2D drawRoom ile aynı eşikler) ----------
const EMOJI_TEX = new Map();
function emojiMat(ch){
  let m = EMOJI_TEX.get(ch);
  if (!m){
    m = new THREE.MeshBasicMaterial({transparent:true, alphaTest:0.1, side:THREE.DoubleSide, map:canvasTex(128, 128, (c, w) => {
      c.font = `100px ${EMOJI}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(ch, w / 2, w / 2 + 6);
    })});
    EMOJI_TEX.set(ch, m); SHARED.add(m);
  }
  return m;
}
function emojiPlane(parent, ch, size, x, y, z){
  const m = new THREE.Mesh(GEO.plane, emojiMat(ch)); m.scale.set(size, size, 1); m.position.set(x, y, z); parent.add(m); return m;
}
let GLOW_MAT;
function glow(parent, x, y, z, size){
  if (!GLOW_MAT) GLOW_MAT = new THREE.SpriteMaterial({blending:THREE.AdditiveBlending, depthWrite:false, transparent:true, map:canvasTex(64, 64, (c, w) => {
    const gr = c.createRadialGradient(w / 2, w / 2, 1, w / 2, w / 2, w / 2);
    gr.addColorStop(0, 'rgba(255,214,130,.9)'); gr.addColorStop(1, 'rgba(255,214,130,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, w);
  })});
  SHARED.add(GLOW_MAT);
  const s = new THREE.Sprite(GLOW_MAT); s.scale.set(size, size, 1); s.position.set(x, y, z); parent.add(s); glows.push(s); return s;
}

function plant(x, z, big){
  const p = new THREE.Group(); p.position.set(x, 0, z); room.add(p);
  cyl(p, 13, 26, '#b5562d', 0, 0, 0, GEO.cone).rotation.x = Math.PI;   // ters koni saksı
  cyl(p, 12, 2, '#4a2e1a', 0, 24, 0);
  const leaves = new THREE.Group(); leaves.position.y = 26; p.add(leaves);
  const n = big ? 7 : 5;
  for (let i = 0; i < n; i++){
    const a = (i - (n - 1) / 2) * 0.45, l = new THREE.Mesh(GEO.sph, mat('#2f8a4a'));
    l.scale.set(6, 18, 4); l.position.set(Math.sin(a) * 16, Math.cos(a) * 16, (i % 2 ? 4 : -4)); l.rotation.z = -a; leaves.add(l);
  }
  sway.push(leaves);
}

function buildDecor(L){
  sway = []; glows = [];
  const RW = rightWall(), D = lv('dekor');
  if (D >= 1) plant(RW - 34, 236, D >= 3);
  if (D >= 5) plant(36, Math.min(530, aisleY() + 5), true);
  // Tablo
  if (D >= 2){
    box(room, 58, 68, 4, '#c9a14a', RW - 148, WALL_H - 98, FLOOR + 2);
    const pic = new THREE.Mesh(GEO.plane, new THREE.MeshBasicMaterial({map:canvasTex(96, 116, (c, w, h) => {
      c.fillStyle = '#9fd3f5'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#4c8c4a'; c.beginPath(); c.moveTo(0, h); c.quadraticCurveTo(40, h * 0.43, w, h * 0.78); c.lineTo(w, h); c.fill();
      c.fillStyle = '#fff3b0'; c.beginPath(); c.arc(w * 0.75, 28, 12, 0, 7); c.fill();
    })}));
    pic.scale.set(48, 58, 1); pic.position.set(RW - 148, WALL_H - 64, FLOOR + 4.2); room.add(pic);
  }
  // Halı (dikeyde masa ızgarasının altında, genişte masaların altında)
  if (D >= 3){
    const [x, y, w, h] = portrait ? [36, 372, W - 72, aisleY() - 400] : [320, 268, Math.min(RW - 20, 900) - 320, 238];
    const rug = new THREE.Mesh(GEO.plane, new THREE.MeshLambertMaterial({map:canvasTex(512, Math.round(512 * h / w), (c, cw, ch) => {
      c.fillStyle = '#8e2b2b'; c.fillRect(0, 0, cw, ch);
      c.strokeStyle = '#e6c98f'; c.lineWidth = 6; c.strokeRect(14, 14, cw - 28, ch - 28);
      c.fillStyle = 'rgba(230,201,143,.35)';
      for (let k = 50; k < cw - 30; k += 60) for (const yy of [40, ch - 40]){ c.beginPath(); c.moveTo(k, yy - 12); c.lineTo(k + 12, yy); c.lineTo(k, yy + 12); c.lineTo(k - 12, yy); c.fill(); }
    })}));
    rug.rotation.x = -Math.PI / 2; rug.scale.set(w, h, 1); rug.position.set(x + w / 2, 0.5, y + h / 2); room.add(rug);
  }
  // Sarkıt lambalar (Ünlü Mekân'da altın, öncekilerde yeşil)
  if (D >= 4){
    (portrait ? [290, 488] : COLS.filter(x => x < RW - 60)).forEach(x => {
      const z = FLOOR + 34;
      box(room, 1.5, 120, 1.5, '#222222', x, 160, z);
      cyl(room, 14, 14, L === 3 ? '#c9a14a' : '#2d5039', x, 146, z, GEO.cone);
      const b = new THREE.Mesh(GEO.sph, mat('#ffe9a8', true)); b.scale.setScalar(5); b.position.set(x, 145, z); room.add(b);
      glow(room, x, 140, z + 2, 110);
    });
  }
  // Nazar boncuğu
  if (D >= 5) [['#1f4fa3', 11], ['#ffffff', 7], ['#5fb3f0', 4.5], ['#111111', 2.2]].forEach(([c, r], i) => {
    const m = new THREE.Mesh(GEO.cyl, mat(c)); m.scale.set(r, 1, r); m.rotation.x = Math.PI / 2; m.position.set(RW - 26, 50, FLOOR + 2 + i * 0.8); room.add(m);
  });
  // Koleksiyon rafı: sahip olunan parçalar pencerelerin altında (sığdığı kadar, en yeniler)
  const shown = COL_ITEMS.filter(it => owned(it.id));
  if (shown.length){
    const fit = Math.max(1, Math.floor((RW - 430) / 28)), list = shown.slice(-fit), sx0 = 300, w = list.length * 28 + 16;
    box(room, w, 5, 16, '#6b4428', sx0 - 8 + w / 2, 42, FLOOR + 8);
    list.forEach((it, i) => emojiPlane(room, it.emoji, 22, sx0 + 14 + i * 28, 58, FLOOR + 10));
  }
}

// ---------- Etkinlik süslemeleri (bayramlar) ----------
function buildEventDeco(){
  if (deco){ scene.remove(deco); dispose(deco); }
  deco = new THREE.Group(); scene.add(deco);
  bobs = []; bulbs = []; snow = null;
  const type = (EV() || {}).deco;
  if (!type) return;
  const RW = rightWall(), z = FLOOR + 14, top = WALL_H - 8, sag = 16;
  const ropeY = x => top - Math.sin(x / RW * Math.PI) * sag;
  const rope = () => {
    const pts = []; for (let x = 0; x <= RW; x += 20) pts.push(new THREE.Vector3(x, ropeY(x), z));
    deco.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({color:'#3a2a20'})));
  };
  const bunting = colors => {
    rope();
    const n = Math.floor(RW / 34), tri = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-10, 0, 0), new THREE.Vector3(10, 0, 0), new THREE.Vector3(0, -16, 0)]);
    tri.computeVertexNormals();
    for (let i = 0; i < n; i++){
      const x = (i + 0.5) * RW / n, m = new THREE.Mesh(tri, new THREE.MeshBasicMaterial({color:colors[i % colors.length], side:THREE.DoubleSide}));
      m.position.set(x, ropeY(x), z); deco.add(m);
    }
  };
  const garland = (chars, step, size, swing) => {
    rope();
    for (let x = step / 2, i = 0; x < RW; x += step, i++){
      const g = new THREE.Group(); g.position.set(x, ropeY(x), z); deco.add(g);
      box(g, 0.8, 8, 0.8, '#3a2a20', 0, -8, 0);
      emojiPlane(g, chars[i % chars.length], size, 0, -8 - size / 2, 0);
      if (swing) bobs.push({o:g, swing, i});
    }
  };
  if (type === 'flags'){
    bunting(['#e30a17', '#ffffff']);
    const f = new THREE.Mesh(GEO.plane, new THREE.MeshBasicMaterial({side:THREE.DoubleSide, map:canvasTex(150, 100, (c, w, h) => {
      c.fillStyle = '#e30a17'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#fff'; c.beginPath(); c.arc(w * 0.36, h / 2, h * 0.25, 0, 7); c.fill();
      c.fillStyle = '#e30a17'; c.beginPath(); c.arc(w * 0.41, h / 2, h * 0.2, 0, 7); c.fill();
      c.fillStyle = '#fff'; c.beginPath();
      for (let k = 0; k < 10; k++){ const r = k % 2 ? h * 0.055 : h * 0.13, a = -Math.PI / 2 + k * Math.PI / 5; c.lineTo(w * 0.58 + Math.cos(a) * r, h / 2 + Math.sin(a) * r); }
      c.fill();
    })}));
    f.scale.set(46, 31, 1); f.position.set(RW - 43, WALL_H - 116, FLOOR + 4); deco.add(f);
  } else if (type === 'snow'){
    garland(['🎄', '⭐', '🎁'], 110, 16, 2);
    const n = 120, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++){ pos[i * 3] = Math.random() * RW; pos[i * 3 + 1] = Math.random() * 260; pos[i * 3 + 2] = FLOOR + Math.random() * (H - FLOOR); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    snow = new THREE.Points(geo, new THREE.PointsMaterial({color:'#ffffff', size:4, transparent:true, opacity:0.8, depthWrite:false}));
    deco.add(snow);
  } else if (type === 'hearts'){
    garland(['💕', '❤️', '💗'], 70, 15);
  } else if (type === 'lanterns'){
    // Mahya ışıkları + sallanan fenerler
    for (let x = 12, i = 0; x < RW; x += 18, i++){
      const m = new THREE.MeshBasicMaterial({color:'#ffd678', transparent:true});
      const b = new THREE.Mesh(GEO.sph, m); b.scale.setScalar(2.5); b.position.set(x, ropeY(x) - 6, z + 2); deco.add(b); bulbs.push({m, x});
    }
    garland(['🏮', '🌙'], 110, 24, 3);
  } else if (type === 'candy'){
    bunting(['#e74c3c', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6']);
  } else if (type === 'balloons'){
    bunting(['#e74c3c', '#f1c40f', '#3498db']);
    [['#e74c3c', -22, 108], ['#f1c40f', 0, 94], ['#2ecc71', 22, 90]].forEach(([c, dx, h], i) => {
      const g = new THREE.Group(); g.position.set(RW - 60 + dx, h, FLOOR + 24); deco.add(g);
      const b = new THREE.Mesh(GEO.sph, mat(c)); b.scale.set(12, 15, 12); g.add(b);
      box(g, 0.6, 40, 0.6, '#555555', -dx * 0.5, -55, 0).rotation.z = dx * 0.012;
      bobs.push({o:g, bob:4, base:h, i});
    });
  } else if (type === 'sun'){
    bunting(['#f1c40f', '#3498db', '#ffffff']);
    emojiPlane(deco, '🌞', 32, RW - 50, WALL_H - 80, FLOOR + 6);
  }
}

// Bitkiler ve fenerler sallanır, balonlar süzülür, kar yağar, lambalar akşam daha çok parlar
let lastA = 0;
function animateDecor(t, frac){
  const dt = Math.min(0.1, t - lastA); lastA = t;
  sway.forEach((l, i) => { l.rotation.z = Math.sin(t * 1.5 + i) * 0.04; });
  bobs.forEach(b => { if (b.swing) b.o.rotation.z = Math.sin(t * 1.5 + b.i) * b.swing * 0.05; else b.o.position.y = b.base + Math.sin(t * 1.4 + b.i) * b.bob; });
  bulbs.forEach(b => { b.m.opacity = 0.55 + 0.45 * Math.sin(t * 3 + b.x); });
  if (snow){
    const p = snow.geometry.attributes.position, a = p.array;
    for (let i = 0; i < p.count; i++){ a[i * 3 + 1] -= dt * (14 + i % 5 * 4); a[i * 3] += Math.sin(t + i) * dt * 6; if (a[i * 3 + 1] < 0) a[i * 3 + 1] = 260; }
    p.needsUpdate = true;
  }
  // akşam ışık azalır, elektrik kesintisinde salon kararır
  const night = Math.max(0, (frac - 0.8) / 0.2), dark = R && status === 'running' && effect('elektrik');
  const k = dark ? 0.4 : 1 - night * 0.3;
  hemi.intensity = 1.9 * k; sun.intensity = 1.4 * k;
  glows.forEach(s => { s.visible = !dark; s.material.opacity = 0.5 + night * 0.5; });
}
