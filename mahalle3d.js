// Çay Ocağı Tycoon — Mahalle 3D görünümü (Three.js, izometrik maket).
// Yalnızca Mahalle ekranı açıkken ve binaların durumu ya da boyut değişince çizilir: sürekli döngü yok, pil harcamaz.
import * as THREE from './vendor/three.module.min.js';

let renderer, scene, cam, town = null, key = '', size = '';
const ray = new THREE.Raycaster();
const INK = '#3a2214';
// Dükkân ortada, altı bina çevresinde (ızgara birimi). Sıra HOODS sırasıyla aynı
const LOTS = [[-1.15, -1.1], [0, -1.1], [1.15, -1.1], [-1.15, 1.1], [0, 1.1], [1.15, 1.1]];
const LOOK = {
  firin:  {body:'#e8a15a', roof:'#b8322a'}, manav: {body:'#8fd07a', roof:'#f2c94c'},
  durak:  {body:'#6fb0e0', roof:'#2e6fa8'}, berber:{body:'#f08fae', roof:'#ffffff'},
  banka:  {body:'#e6dcc6', roof:'#8a6a3a'}, sinema:{body:'#9b6fd0', roof:'#ffd36b'},
};

export function init(canvas){
  renderer = new THREE.WebGLRenderer({canvas, antialias:true});
  renderer.setClearColor('#bfe3f2');
  scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight('#fff6e0', '#7a8a5a', 2.2));
  const sun = new THREE.DirectionalLight('#ffffff', 1.6); sun.position.set(-3, 6, 4); scene.add(sun);
  cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 50);
  cam.position.set(5, 5.7, 5); cam.lookAt(0, 0.3, 0);   // biraz yukarı: en üstteki etiket kenara dayanmasın
}

// Kenar çizgili kutu: çizgi film konturu
function box(g, w, h, d, color, x, y, z, opacity = 1){
  const geo = new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({color, transparent:opacity < 1, opacity}));
  m.position.set(x, y + h / 2, z); g.add(m);
  const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({color:INK}));
  e.position.copy(m.position); g.add(e);
  return m;
}
function label(g, text, x, y, z, bg){
  const c = document.createElement('canvas'); c.width = 320; c.height = 80;
  const x2 = c.getContext('2d');
  x2.fillStyle = bg; x2.strokeStyle = INK; x2.lineWidth = 6;
  x2.beginPath(); x2.roundRect ? x2.roundRect(4, 4, 312, 64, 18) : x2.rect(4, 4, 312, 64); x2.fill(); x2.stroke();
  x2.fillStyle = '#ffffff'; x2.font = 'bold 34px Fredoka, system-ui, sans-serif'; x2.textAlign = 'center'; x2.textBaseline = 'middle';
  x2.fillText(text, 160, 38, 296);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({map:t, depthTest:false}));
  s.scale.set(1.3, 0.33, 1); s.position.set(x, y, z); s.renderOrder = 2; g.add(s);   // telefonda okunur boy
}
function building(g, x, z, look, h, hit){
  const body = box(g, 0.62, h, 0.62, look.body, x, 0.05, z);
  body.userData.id = hit;
  box(g, 0.72, 0.08, 0.72, look.roof, x, 0.05 + h, z);
  box(g, 0.16, 0.24, 0.02, '#5a3420', x, 0.05, z + 0.32);                      // kapı
  for (const dx of [-0.17, 0.17]) box(g, 0.12, 0.1, 0.02, '#fff3b0', x + dx, 0.05 + h * 0.62, z + 0.32);
  return body;
}

function dispose(g){
  g.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material){ if (o.material.map) o.material.map.dispose(); o.material.dispose(); } });
}

// list: [{id, emoji, name, lv, open, need}] HOODS sırasıyla
export function update(list, shopName){
  const c = renderer.domElement, w = c.clientWidth, h = c.clientHeight;
  if (!w || !h) return;
  const sz = w + 'x' + h, k = JSON.stringify(list) + shopName;
  if (sz !== size){
    size = sz; renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); renderer.setSize(w, h, false);
    const a = w / h, half = 1.85;   // görünen alanın yarı yüksekliği (birim): maket kareyi doldursun
    cam.left = -half * a; cam.right = half * a; cam.top = half; cam.bottom = -half; cam.updateProjectionMatrix();
    key = '';
  }
  if (k !== key){
    key = k;
    if (town){ scene.remove(town); dispose(town); }
    town = new THREE.Group(); scene.add(town);
    box(town, 3.9, 0.05, 3.7, '#a8d68a', 0, 0, 0);                              // çimen
    for (const z of [-0.5, 0.5]) box(town, 3.9, 0.02, 0.22, '#6b6f78', 0, 0.05, z); // yollar
    for (const z of [-0.5, 0.5]) for (let x = -1.7; x <= 1.7; x += 0.4) box(town, 0.18, 0.005, 0.03, '#ffffff', x, 0.075, z);
    // Ortada senin çay ocağın
    building(town, 0, 0, {body:'#f2a65a', roof:'#b8322a'}, 0.55, null);
    label(town, '🍵 ' + shopName, 0, 1.05, 0, '#b8322a');
    list.forEach((b, i) => {
      const [x, z] = LOTS[i], look = LOOK[b.id] || {body:'#dddddd', roof:'#999999'};
      if (b.lv > 0){
        building(town, x, z, look, 0.3 + 0.1 * b.lv, b.id);
        label(town, `${b.emoji} ${b.name} ${'★'.repeat(b.lv)}`, x, 0.75 + 0.1 * b.lv, z, '#3aa64c');
      } else if (b.open){
        const lot = box(town, 0.66, 0.04, 0.66, '#d9c29a', x, 0.05, z); lot.userData.id = b.id;   // arsa
        for (const [dx, dz] of [[-0.2, 0.2], [0.2, 0.2], [0.2, -0.2]]){
          const cone = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 10), new THREE.MeshLambertMaterial({color:'#f07a2a'}));
          cone.position.set(x + dx, 0.18, z + dz); town.add(cone);
        }
        const sc = box(town, 0.5, 0.5, 0.5, '#ffd36b', x, 0.09, z, 0.18); sc.userData.id = b.id;   // iskele
        label(town, `🚧 ${b.name}`, x, 0.95, z, '#e8672c');
      } else {
        const g = box(town, 0.62, 0.42, 0.62, '#b9b2a6', x, 0.05, z, 0.55); g.userData.id = b.id;
        label(town, `🔒 ${b.name}`, x, 0.85, z, INK);
      }
    });
  }
  renderer.render(scene, cam);
}

// Dokunulan binanın kimliği (yoksa null)
export function pick(clientX, clientY){
  if (!town) return null;
  const r = renderer.domElement.getBoundingClientRect();
  ray.setFromCamera(new THREE.Vector2((clientX - r.left) / r.width * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1), cam);
  const hit = ray.intersectObjects(town.children.filter(o => o.isMesh && o.userData.id), false)[0];
  return hit ? hit.object.userData.id : null;
}
