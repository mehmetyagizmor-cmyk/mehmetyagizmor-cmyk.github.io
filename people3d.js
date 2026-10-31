// Çay Ocağı Tycoon — 3D insan üretici
// drawPerson'daki look nesnesinden ({skin, hair, style, shirt, beard, glasses, hat, prop, suit, vest, g}) low-poly model kurar.
// Performans: gövde+kafa+saç+yüz tek bir birleşik geometri (renkler köşe rengi), kollar ve bacaklar ayrı parça.
// Aynı görünüş için geometriler önbellekte paylaşılır; tek materyal tüm insanlarda ortak → kişi başı ~8 çizim çağrısı.
import * as THREE from './vendor/three.module.min.js';

// Ölçüler (2D sahne pikseli): kalça 20, gövde 28, kafa merkezi 66 → boy ~82
const HIP = 20, TORSO = 28, SH = HIP + TORSO, HY = 66, HR = 14;

const G = {
  box: new THREE.BoxGeometry(1, 1, 1),
  sph: new THREE.IcosahedronGeometry(1, 1),
  cap: new THREE.SphereGeometry(1, 10, 5, 0, Math.PI * 2, 0, Math.PI * 0.5),
  cyl: new THREE.CylinderGeometry(1, 1, 1, 10),
  cone: new THREE.ConeGeometry(1, 1, 5),
  skirt: new THREE.CylinderGeometry(0.62, 1, 1, 8),
  arc: new THREE.TorusGeometry(1, 0.28, 3, 7, Math.PI),
  ring: new THREE.TorusGeometry(1, 0.18, 3, 10),
  disc: new THREE.CircleGeometry(1, 14),
};
const MAT = new THREE.MeshLambertMaterial({vertexColors:true, flatShading:true});
// VIP'in altın parçaları (taç, kravat) ayrı: hafif kendinden parlayan altın
const GOLD = new THREE.MeshLambertMaterial({color:'#f5c518', emissive:'#8a6400', flatShading:true});
const SHADOW = new THREE.MeshBasicMaterial({color:'#000', transparent:true, opacity:0.22, depthWrite:false});
const FLASH = new THREE.MeshBasicMaterial({color:'#ffffff', transparent:true, opacity:0.9, depthWrite:false});

// ---------- Birleşik geometri ----------
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _c = new THREE.Color();
function parts(){
  const list = [];
  // add(geo, renk, x, y, z, sx, sy, sz, rx, ry, rz)
  list.add = (geo, color, x, y, z, sx, sy = sx, sz = sx, rx = 0, ry = 0, rz = 0) => {
    _m.compose(new THREE.Vector3(x, y, z), _q.setFromEuler(_e.set(rx, ry, rz)), new THREE.Vector3(sx, sy, sz));
    list.push([geo, _m.clone(), _c.set(color).clone()]);
  };
  // alt yüzü y'de duran kutu
  list.box = (color, x, y, z, w, h, d, rx, ry, rz) => list.add(G.box, color, x, y + h / 2, z, w, h, d, rx, ry, rz);
  return list;
}
function merge(list){
  const geos = list.map(([g, m]) => (g.index ? g.toNonIndexed() : g.clone()).applyMatrix4(m));
  const n = geos.reduce((s, g) => s + g.attributes.position.count, 0);
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), col = new Float32Array(n * 3);
  let o = 0;
  geos.forEach((g, i) => {
    const k = g.attributes.position.count, c = list[i][2];
    pos.set(g.attributes.position.array, o * 3); nor.set(g.attributes.normal.array, o * 3);
    for (let j = 0; j < k; j++){ col[(o + j) * 3] = c.r; col[(o + j) * 3 + 1] = c.g; col[(o + j) * 3 + 2] = c.b; }
    o += k; g.dispose();
  });
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  out.computeBoundingSphere();
  return out;
}
// En son kullanılan 400 model saklanır: uzun oyunda görünüşler bellekte birikmesin.
// Silinen model hâlâ ekrandaysa Three.js onu kendiliğinden yeniden yükler
const CACHE = new Map(), CACHE_MAX = 400;
const cached = (key, make) => {
  let g = CACHE.get(key);
  if (g === undefined) g = make(); else CACHE.delete(key);
  CACHE.set(key, g);
  if (CACHE.size > CACHE_MAX){
    const [k, old] = CACHE.entries().next().value;
    CACHE.delete(k);
    if (old) old.dispose();
  }
  return g;
};

const shade = (hex, to, t) => '#' + _c.set(hex).lerp(new THREE.Color(to), t).getHexString();

// ---------- Gövde + kafa (yüz ifadesine göre üç çeşit) ----------
function bodyGeo(L, apron, mood){
  const P = parts(), k = L.g === 'k', skin = mood === 'angry' ? shade(L.skin, '#ff2828', 0.18) : L.skin;
  const tw = k ? 21 : 24;
  // gövde, boyun
  P.box(L.shirt, 0, HIP, 0, tw, TORSO, 14);
  P.add(G.cyl, L.skin, 0, SH + 2, 0, 4, 4, 4);
  if (k) P.add(G.skirt, shade(L.shirt, '#000000', 0.3), 0, HIP - 4, 0, 14, 14, 13);   // etek
  if (L.vest){
    P.box('#26262e', -tw / 2 + 3.5, HIP + 1, 7.2, 7, TORSO - 2, 1); P.box('#26262e', tw / 2 - 3.5, HIP + 1, 7.2, 7, TORSO - 2, 1);
    P.add(G.cone, '#b3202b', -3, SH - 1.5, 7.8, 2.4, 4.5, 2, 0, 0, -Math.PI / 2); P.add(G.cone, '#b3202b', 3, SH - 1.5, 7.8, 2.4, 4.5, 2, 0, 0, Math.PI / 2);
  }
  if (L.suit) P.add(G.cone, '#ffffff', 0, SH - 5, 7.1, 5, 10, 0.6, 0, 0, Math.PI);   // beyaz gömlek yakası
  if (apron){
    P.box('#fbf6ee', 0, HIP - 2, 7.4, 18, 22, 1);
    P.box('#fbf6ee', -7.5, HIP + 19, 7.4, 2, 9, 1, 0, 0, 0.2); P.box('#fbf6ee', 7.5, HIP + 19, 7.4, 2, 9, 1, 0, 0, -0.2);
  }
  if (L.prop === 'camera'){
    P.box('#222222', 0, HIP + 9, 8, 12, 8, 6);
    P.add(G.cyl, '#66ccff', 0, HIP + 13, 11.5, 2.6, 2, 2.6, Math.PI / 2);
    P.box('#222222', -6, HIP + 17, 2, 1.2, 14, 1.2, 0, 0, -0.5); P.box('#222222', 6, HIP + 17, 2, 1.2, 14, 1.2, 0, 0, 0.5);
  }

  // kafa ve kulaklar
  P.add(G.sph, skin, 0, HY, 0, HR, HR, HR * 0.95);
  P.add(G.sph, skin, -HR, HY - 1, 0, 3, 4, 3); P.add(G.sph, skin, HR, HY - 1, 0, 3, 4, 3);

  // saç (5 model, 2D ile aynı mantık)
  const hair = L.hair, s = L.style;
  const cap = () => P.add(G.cap, hair, 0, HY + 1, -1.2, HR + 1, HR + 1, HR + 1, -0.32);
  if (s === 0) cap();
  if (s === 1){ cap();
    P.box(hair, 0, HY - 26, -8, 30, 30, 7);                        // arka uzun saç
    P.box(hair, -HR + 1.5, HY - 18, 2, 5, 20, 8); P.box(hair, HR - 1.5, HY - 18, 2, 5, 20, 8); }
  if (s === 2){ P.add(G.sph, hair, -HR + 1, HY + 3, -1, 3, 5, 4); P.add(G.sph, hair, HR - 1, HY + 3, -1, 3, 5, 4); }
  if (s === 3){ cap(); P.add(G.sph, hair, 0, HY + 16, -4, 7); }
  if (s === 4){
    for (let a = 0; a <= 6; a++){ const t = Math.PI + a / 6 * Math.PI; P.add(G.sph, hair, Math.cos(t) * 12, HY + 2 - Math.sin(t) * 12, -2, 6); }
    P.add(G.sph, hair, -5, HY + 13, 3, 6); P.add(G.sph, hair, 5, HY + 13, 3, 6); P.add(G.sph, hair, 0, HY + 10, -9, 7);
  }

  // yüz: gözler, yanaklar, bıyık, ağız (ifade), kadında kirpik ve ruj
  const fz = HR * 0.92, ink = '#2a1a12';
  P.add(G.sph, ink, -5, HY - 1, fz, 1.8, 2.2, 1);
  P.add(G.sph, ink, 5, HY - 1, fz, 1.8, 2.2, 1);
  P.add(G.sph, shade(L.skin, '#ff7878', 0.35), -8.5, HY - 6, fz - 2.5, 3, 2, 1.5);
  P.add(G.sph, shade(L.skin, '#ff7878', 0.35), 8.5, HY - 6, fz - 2.5, 3, 2, 1.5);
  if (L.beard && !k) P.add(G.sph, L.hair === '#9b9b9b' ? '#777777' : L.hair, 0, HY - 5.5, fz + 0.3, 6, 2.2, 2);
  if (k){
    P.box(ink, -7.6, HY + 0.5, fz - 0.8, 3, 0.9, 1, 0, 0, 0.6); P.box(ink, 7.6, HY + 0.5, fz - 0.8, 3, 0.9, 1, 0, 0, -0.6);
    P.add(G.sph, '#c0392b', 0, HY - 8.5, fz - 0.6, 3, 1.6, 1.2);
  }
  if (mood === 'angry'){
    P.add(G.arc, ink, 0, HY - 10.5, fz - 1.4, 3.5, 3.5, 3.5);                        // asık ağız
    P.box(ink, -5.5, HY + 3, fz - 0.4, 5, 1.3, 1, 0, 0, -0.35); P.box(ink, 5.5, HY + 3, fz - 0.4, 5, 1.3, 1, 0, 0, 0.35);
  } else if (mood === 'neutral'){
    P.box(ink, 0, HY - 9.5, fz - 1.2, 6, 1.3, 1);
  } else {
    P.add(G.arc, ink, 0, HY - 5.5, fz - 0.6, 3.6, 3.6, 3.6, 0, 0, Math.PI);       // gülümseme
  }
  if (L.glasses){
    P.add(G.ring, ink, -5, HY - 1, fz + 0.9, 4.2, 3.6, 4.2); P.add(G.ring, ink, 5, HY - 1, fz + 0.9, 4.2, 3.6, 4.2);
    P.box(ink, 0, HY - 0.6, fz + 0.9, 2.4, 0.9, 0.9);
  }

  // şapkalar (taç ayrıca altın parçada)
  const top = HY + HR;
  if (L.hat === 'kasket'){
    P.add(G.cyl, '#5b4a3a', 0, top - 3, -1, 14.5, 5, 14.5, -0.15);
    P.box('#5b4a3a', 0, top - 6, 13, 18, 2, 10, -0.1);
  }
  if (L.hat === 'bere'){
    const bc = L.prop === 'note' ? '#8b1e2d' : '#2c3e50';
    P.add(G.sph, bc, -1, top - 3, -1, 15.5, 7, 15.5, -0.15, 0, 0.12);
    P.add(G.sph, bc, -2, top + 4, -2, 2.4);
  }
  if (L.hat === 'sun'){
    P.add(G.cyl, '#e3c27a', 0, top - 4, 0, 23, 1.5, 23);
    P.add(G.cyl, '#e3c27a', 0, top, 0, 12, 9, 12);
    P.add(G.cyl, '#c0392b', 0, top - 2, 0, 12.4, 2.5, 12.4);
  }
  return merge(P);
}
function goldGeo(L){
  const P = parts(), top = HY + HR;
  if (L.hat === 'crown'){
    P.add(G.cyl, '#f5c518', 0, top - 1, 0, 10.5, 7, 10.5);
    for (let i = 0; i < 5; i++){ const a = i / 5 * Math.PI * 2; P.add(G.cone, '#f5c518', Math.sin(a) * 8.5, top + 5.5, Math.cos(a) * 8.5, 2.6, 6, 2.6); }
  }
  if (L.suit) P.box('#f5c518', 0, SH - 15, 7.5, 3, 12, 1);       // altın kravat
  return P.length ? merge(P) : null;
}

// ---------- Kollar ve bacaklar ----------
function armGeo(shirt, skin, prop){
  const P = parts();
  P.box(shirt, 0, -17, 0, 6, 17, 6);
  P.add(G.sph, skin, 0, -19, 0, 3.5);
  if (prop === 'phone') P.box('#222222', 0, -26, 2.5, 7, 12, 2);
  if (prop === 'note'){ P.box('#fff8e1', 0, -27, 3, 11, 14, 1.5); P.box('#9a8a70', 0, -22, 3.9, 8, 0.8, 0.2); P.box('#9a8a70', 0, -25, 3.9, 8, 0.8, 0.2); }
  if (prop === 'tray') P.add(G.cyl, '#cfd3d8', 0, -21, 6, 12, 1.2, 12);
  if (prop === 'broom'){ P.box('#a0703f', 0, -50, 3, 1.8, 40, 1.8); P.box('#e0b85f', 0, -58, 3, 12, 9, 3); }
  return merge(P);
}
const thighGeo = pants => { const P = parts(); P.box(pants, 0, -10, 0, 7, 10, 7); return merge(P); };
const shinGeo = pants => { const P = parts(); P.box(pants, 0, -10, 0, 7, 10, 7); P.box('#1f1a17', 0, -10, 1.5, 8, 4, 10); return merge(P); };

// ---------- Kişi ----------
// opts: {apron}. Görünüş değişirse (ör. sahip düzenlendi) setLook ile yeniden kurulur.
export class Person {
  constructor(look, opts = {}){
    this.root = new THREE.Group();
    this.fig = new THREE.Group(); this.root.add(this.fig);   // zıplama / oturma yüksekliği
    this.shadow = new THREE.Mesh(G.disc, SHADOW); this.shadow.rotation.x = -Math.PI / 2; this.shadow.scale.set(15, 15, 1); this.shadow.position.y = 0.6;
    this.root.add(this.shadow);
    const limb = (x, y, parent) => { const p = new THREE.Group(); p.position.set(x, y, 0); const m = new THREE.Mesh(undefined, MAT); p.add(m); (parent || this.fig).add(p); p.mesh = m; return p; };
    this.body = new THREE.Mesh(undefined, MAT); this.fig.add(this.body);
    this.gold = new THREE.Mesh(undefined, GOLD); this.fig.add(this.gold);
    this.armL = limb(-13.5, SH - 2); this.armR = limb(13.5, SH - 2);
    this.thighL = limb(-5.5, HIP); this.thighR = limb(5.5, HIP);
    this.shinL = limb(0, -10, this.thighL); this.shinR = limb(0, -10, this.thighR);
    this.flash = new THREE.Mesh(G.sph, FLASH); this.flash.scale.setScalar(7); this.flash.position.set(0, -24, 6); this.flash.visible = false;
    this.armR.add(this.flash);
    this.phase = Math.random() * 10;
    this.setLook(look, opts);
  }
  setLook(look, opts = {}){
    this.look = look; this.apron = !!opts.apron; this.mood = null; this.armProp = undefined;
    const L = look, pants = L.suit ? '#1d1d2b' : '#3a3346';
    const gold = cached('g|' + L.hat + '|' + !!L.suit, () => goldGeo(L));
    this.gold.visible = !!gold; if (gold) this.gold.geometry = gold;
    this.armL.mesh.geometry = cached(`a|${L.shirt}|${L.skin}|`, () => armGeo(L.shirt, L.skin));
    this.thighL.mesh.geometry = this.thighR.mesh.geometry = cached('t|' + pants, () => thighGeo(pants));
    this.shinL.mesh.geometry = this.shinR.mesh.geometry = cached('s|' + pants, () => shinGeo(pants));
    this.key = JSON.stringify(look) + this.apron;
  }
  setMood(mood){
    if (mood === this.mood) return;
    this.mood = mood;
    const L = this.look, apron = this.apron;
    this.body.geometry = cached(`b|${this.key}|${mood}`, () => bodyGeo(L, apron, mood));
  }
  setArmProp(p){
    if (p === this.armProp) return;
    this.armProp = p;
    const L = this.look;
    this.armR.mesh.geometry = cached(`a|${L.shirt}|${L.skin}|${p || ''}`, () => armGeo(L.shirt, L.skin, p));
    this.flash.visible = false;
  }
  // s: {x, y (2D derinlik), face (radyan), sit, walk (faz|null), mood, bob, carry, prop, hurry, hop, sweep}
  update(s, t){
    const L = this.look;
    this.setMood(s.mood || 'happy');
    const prop = s.carry ? 'tray' : s.prop || (L.prop === 'phone' || L.prop === 'note' ? L.prop : null);
    this.setArmProp(prop);
    this.root.position.set(s.x, 0, s.y);
    this.root.rotation.y = s.face || 0;
    // kızgın müşteri öne eğilip uzun ve hızlı adımlarla çıkar
    const sw = s.walk != null ? Math.sin(s.hurry ? s.walk * 1.6 : s.walk) : 0, amp = s.hurry ? 0.95 : 0.6;
    this.fig.rotation.x = s.hurry ? 0.2 : 0;
    this.shadow.visible = !s.sit;
    if (s.sit){
      this.fig.position.y = 4;
      this.thighL.rotation.x = this.thighR.rotation.x = -Math.PI / 2;
      this.shinL.rotation.x = this.shinR.rotation.x = Math.PI / 2;
      this.armL.rotation.set(-0.7, 0, 0.05);
    } else {
      this.fig.position.y = (s.walk != null ? Math.abs(sw) * 2 : (s.bob || 0)) + (s.hop || 0);
      this.thighL.rotation.x = sw * amp; this.thighR.rotation.x = -sw * amp;
      this.shinL.rotation.x = Math.max(0, -sw) * 0.7; this.shinR.rotation.x = Math.max(0, sw) * 0.7;
      this.armL.rotation.set(-sw * amp * 0.8, 0, 0.08);
    }
    // sağ kol: telefon yukarıda, not defteri önde, tepsi omuz hizasında, yoksa sallanır
    if (prop === 'phone') this.armR.rotation.set(-2.5, 0, 0.35);
    else if (prop === 'note') this.armR.rotation.set(-1.1, 0, 0.25);
    else if (prop === 'tray') this.armR.rotation.set(-1.9, 0, -0.1);
    else if (prop === 'broom') this.armR.rotation.set(-0.45 + (s.sweep ? Math.sin(t * 10) * 0.35 : 0), 0, -0.15);
    else if (s.sit) this.armR.rotation.set(-0.7, 0, -0.05);
    else this.armR.rotation.set(sw * amp * 0.8, 0, -0.08);
    // influencer ara sıra flaş patlatır
    if (prop === 'phone'){ const f = (t * 0.45 + this.phase) % 1; this.flash.visible = f < 0.05; this.flash.scale.setScalar(4 + f * 120); }
  }
}
