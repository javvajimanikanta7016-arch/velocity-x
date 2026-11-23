/* ==========================================================================
   VELOCITY X — showroom interactions
   script.js
   --------------------------------------------------------------------------
   01. Data (car catalogue)
   02. Helpers
   03. Preloader + boot
   04. Navigation
   05. 3D stages (hero + 360 showcase) — Three.js
   06. Card grid + filters
   07. Detail modal
   08. Search
   09. Compare tool
   10. Booking form
   11. Newsletter
   12. Testimonial carousel
   13. Scroll reveals, counters, tilt
   14. Misc (toast, back-to-top, year)
   ========================================================================== */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = window.matchMedia('(max-width: 760px)').matches;

/* ---------- 01. DATA ---------- */
const CARS = [
  {
    id: 'revuelto', brand: 'Lamborghini', name: 'Revuelto',
    tagline: 'The first HPEV V12 hybrid from Sant’Agata — 1,001 CV of pure theatre.',
    price: 88900000, hp: 1001, torque: 1060, topSpeed: 350, accel: 2.5,
    engine: '6.5L V12 + 3 e-motors', transmission: '8-speed DCT', fuel: 'Petrol Hybrid',
    economy: '6.5 km/l', economyLabel: 'Fuel Efficiency',
    categories: ['supercar'], badge: 'NEW', accent: '#ff7a18', baseHue: 24,
    image: 'assets/images/car-lamborghini-revuelto.jpg',
    colors: [['Arancio Apodis', '#ff7a18'], ['Verde Alceo', '#3ad0a8'], ['Nero Helene', '#151518'], ['Rosso Mars', '#c8102e']],
    interior: ['Exposed carbon monocoque', '8.4" portrait touchscreen', '12.3" digital instrument cluster', 'Track buckets in Alcantara'],
    safety: ['6 airbags + head protection', 'ADAS lane keep & adaptive cruise', 'Carbon-ceramic brakes', '360° camera & parking sensors'],
  },
  {
    id: '296gtb', brand: 'Ferrari', name: '296 GTB',
    tagline: 'A 120° V6 hybrid that rewrote the rulebook for the modern berlinetta.',
    price: 54000000, hp: 830, torque: 740, topSpeed: 330, accel: 2.9,
    engine: '3.0L V6 twin-turbo + e-motor', transmission: '8-speed DCT', fuel: 'Petrol Hybrid',
    economy: '7.5 km/l', economyLabel: 'Fuel Efficiency',
    categories: ['supercar'], badge: 'HYBRID', accent: '#ff3355', baseHue: 352,
    image: 'assets/images/car-ferrari-296.jpg',
    colors: [['Rosso Corsa', '#c8102e'], ['Blu Corsa', '#0b57d0'], ['Argento Nürburgring', '#b8bcc6'], ['Nero Daytona', '#151518']],
    interior: ['Driver-focused cockpit', 'Digital rear-view mirror', 'Apple CarPlay + navigation', 'Carbon-fibre racing seats'],
    safety: ['6 airbags', 'Side slip control 6.0', 'ABS with Ferrari e-diff', 'Tyre pressure monitoring'],
  },
  {
    id: '911', brand: 'Porsche', name: '911 Carrera',
    tagline: 'Eight generations of the same idea: the perfect sports car, refined.',
    price: 19900000, hp: 385, torque: 450, topSpeed: 294, accel: 4.1,
    engine: '3.0L twin-turbo flat-6', transmission: '8-speed PDK', fuel: 'Petrol',
    economy: '10.5 km/l', economyLabel: 'Fuel Efficiency',
    categories: ['sports'], badge: 'ICON', accent: '#38e8ff', baseHue: 212,
    image: 'assets/images/car-porsche-911.jpg',
    colors: [['Gentian Blue', '#1f4bb8'], ['Guards Red', '#c8102e'], ['Carrara White', '#e8e8ea'], ['Jet Black', '#151518']],
    interior: ['12.6" curved cluster', '10.9" PCM touchscreen', '14-way sport seats', 'Bose surround sound'],
    safety: ['Porsche Stability Management', 'Adaptive cruise control', 'Night vision assist', 'Front & rear parking aid'],
  },
  {
    id: '750s', brand: 'McLaren', name: '750S',
    tagline: 'The lightest and most powerful series-production McLaren ever built.',
    price: 59100000, hp: 750, torque: 800, topSpeed: 332, accel: 2.8,
    engine: '4.0L twin-turbo V8', transmission: '7-speed SSG', fuel: 'Petrol',
    economy: '6.5 km/l', economyLabel: 'Fuel Efficiency',
    categories: ['sports'], badge: 'TRACK', accent: '#ff7a18', baseHue: 20,
    image: 'assets/images/car-mclaren-750s.jpg',
    colors: [['Papaya Spark', '#ff7a18'], ['Volcano Yellow', '#f5d000'], ['Onyx Black', '#151518'], ['Silica White', '#e8e8ea']],
    interior: ['Carbon monocoque tub', '8" central infotainment', 'Nappa leather + Alcantara', 'Bowers & Wilkins audio'],
    safety: ['Airbags + side protection', 'Adaptive damping control', 'Carbon-ceramic brakes', 'Tyre pressure monitoring'],
  },
  {
    id: 'm4', brand: 'BMW', name: 'M4 Competition',
    tagline: 'A twin-turbo straight-six with 510 hp and a chassis that loves to be pushed.',
    price: 15300000, hp: 510, torque: 650, topSpeed: 290, accel: 3.5,
    engine: '3.0L twin-turbo inline-6', transmission: '8-speed M Steptronic', fuel: 'Petrol',
    economy: '9.5 km/l', economyLabel: 'Fuel Efficiency',
    categories: ['sports'], badge: 'M POWER', accent: '#4d8dff', baseHue: 218,
    image: 'assets/images/car-bmw-m4.jpg',
    colors: [['Isle of Man Green', '#0f7a5a'], ['Portimao Blue', '#1a5fd0'], ['Frozen Black', '#1b1b1e'], ['Alpine White', '#e8e8ea']],
    interior: ['M carbon bucket seats', '12.3" + 14.9" curved display', 'Harman Kardon surround', 'M Drive Professional'],
    safety: ['Front & side airbags', 'Driving assistant professional', 'M compound brakes', 'Lane departure warning'],
  },
  {
    id: 'amggt', brand: 'Mercedes-AMG', name: 'GT Coupe',
    tagline: 'A hand-built 4.0L V8 wrapped in a body that is pure sculpture.',
    price: 30000000, hp: 585, torque: 800, topSpeed: 315, accel: 3.2,
    engine: '4.0L twin-turbo V8', transmission: '9-speed AMG Speedshift', fuel: 'Petrol',
    economy: '7.0 km/l', economyLabel: 'Fuel Efficiency',
    categories: ['grand-tourer'], badge: 'V8 BI-TURBO', accent: '#8b5cf6', baseHue: 255,
    image: 'assets/images/car-mercedes-amg-gt.jpg',
    colors: [['Obsidian Black', '#151518'], ['Hyper Blue', '#1a5fd0'], ['AMG Green', '#0f7a5a'], ['Iridium Silver', '#b8bcc6']],
    interior: ['Nappa leather dashboard', '11.9" portrait touchscreen', 'Burmester 3D surround', 'AMG performance seats'],
    safety: ['Attention assist', 'Active brake assist', 'Blind spot assist', 'Adaptive highbeam assist'],
  },
  {
    id: 'models', brand: 'Tesla', name: 'Model S Plaid',
    tagline: '1,020 hp, three motors and the quickest acceleration of any production sedan.',
    price: 12500000, hp: 1020, torque: 1420, topSpeed: 322, accel: 2.1,
    engine: 'Tri-motor electric', transmission: '1-speed direct drive', fuel: 'Electric',
    economy: '600 km range', economyLabel: 'Electric Range',
    categories: ['electric', 'sedan'], badge: 'PLAID', accent: '#5ef0c0', baseHue: 165,
    image: 'assets/images/car-tesla-model-s.jpg',
    colors: [['Ultra Red', '#b8162a'], ['Deep Blue', '#123a7a'], ['Pearl White', '#e8e8ea'], ['Solid Black', '#151518']],
    interior: ['17" cinematic touchscreen', '22-speaker audio', 'Yoke steering', 'HEPA air filtration'],
    safety: ['Autopilot hardware', '360° camera vision', 'Automatic emergency braking', 'Blind spot detection'],
  },
  {
    id: 'r8', brand: 'Audi', name: 'R8 V10 Performance',
    tagline: 'The naturally aspirated 5.2L V10 — a farewell to an era of unfiltered sound.',
    price: 27200000, hp: 620, torque: 580, topSpeed: 331, accel: 3.1,
    engine: '5.2L naturally aspirated V10', transmission: '7-speed S tronic', fuel: 'Petrol',
    economy: '6.5 km/l', economyLabel: 'Fuel Efficiency',
    categories: ['supercar'], badge: 'V10', accent: '#4d8dff', baseHue: 212,
    image: 'assets/images/car-audi-r8.jpg',
    colors: [['Kyalami Green', '#0f6a52'], ['Tango Red', '#b8162a'], ['Kemora Grey', '#8a8f99'], ['Mythos Black', '#151518']],
    interior: ['Virtual cockpit plus', 'MMI touch response', 'Fine Nappa leather', 'Bang & Olufsen 3D sound'],
    safety: ['Audi pre sense basic', 'Lane departure warning', 'Adaptive dampers', 'Carbon-ceramic brakes'],
  },
  {
    id: 'urus', brand: 'Lamborghini', name: 'Urus S',
    tagline: 'A 657 hp super-SUV that treats the school run like a stage rally.',
    price: 41800000, hp: 657, torque: 850, topSpeed: 306, accel: 3.3,
    engine: '4.0L twin-turbo V8', transmission: '8-speed automatic', fuel: 'Petrol',
    economy: '7.0 km/l', economyLabel: 'Fuel Efficiency',
    categories: ['suv'], badge: 'SUV', accent: '#ffc65c', baseHue: 40,
    image: 'assets/images/car-urus.jpg',
    colors: [['Nero Noctis', '#151518'], ['Arancio Argos', '#ff7a18'], ['Verde Mantis', '#3ad0a8'], ['Bianco Monocerus', '#e8e8ea']],
    interior: ['Dual touchscreen infotainment', '4-seat configuration', 'Ambient light package', 'Bang & Olufsen 3D audio'],
    safety: ['ADAS with lane assist', 'Night vision camera', '360° parking view', '8 airbags'],
  },
];

/* ---------- 02. HELPERS ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const inr = (n) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2).replace(/\.00$/, '')} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2).replace(/\.00$/, '')} L`;
  return `₹${n.toLocaleString('en-IN')}`;
};

const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const hexToHsl = (hex) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) { r = parseInt(hex[1] + hex[1], 16); g = parseInt(hex[2] + hex[2], 16); b = parseInt(hex[3] + hex[3], 16); }
  else { r = parseInt(hex.slice(1, 3), 16); g = parseInt(hex.slice(3, 5), 16); b = parseInt(hex.slice(5, 7), 16); }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return { h: h * 360, s, l };
};

const bodyFilter = (hex, baseHue) => {
  const { h, s, l } = hexToHsl(hex);
  const rotate = h - baseHue;
  const sat = s < 0.12 ? 0.18 : 1 + s * 0.35;
  const bri = l < 0.28 ? 0.74 : l > 0.86 ? 1.1 : 1;
  return `hue-rotate(${rotate.toFixed(0)}deg) saturate(${sat.toFixed(2)}) brightness(${bri.toFixed(2)})`;
};

const toastEl = $('#toast');
let toastTimer;
function showToast(msg) {
  $('#toastTxt').textContent = msg;
  toastEl.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 3200);
}

/* ---------- 03. PRELOADER + BOOT ---------- */
const preloader = $('#preloader');
const loadBar = $('#loadBar');
const loadPct = $('#loadPct');
let loadProgress = 0;
let progressInterval = null;

function setProgress(p) {
  loadProgress = Math.max(loadProgress, Math.min(100, p));
  loadBar.style.width = `${loadProgress}%`;
  loadPct.textContent = Math.round(loadProgress);
}
function startFakeProgress() {
  progressInterval = setInterval(() => {
    if (loadProgress < 82) setProgress(loadProgress + Math.random() * 9);
  }, 220);
}
function finishBoot() {
  clearInterval(progressInterval);
  setProgress(100);
  setTimeout(() => {
    preloader.classList.add('is-hidden');
    document.body.classList.add('is-ready');
    startCounters();
    setTimeout(() => document.body.classList.add('vx-no-anim'), 3200);
    setTimeout(() => preloader.remove(), 900);
  }, 420);
}

startFakeProgress();

// Safety net: never leave the visitor stuck behind the loader
const bootTimeout = setTimeout(() => { if (!document.body.classList.contains('is-ready')) finishBoot(); }, 12000);

document.fonts.ready.then(() => setProgress(loadProgress + 6));
$('#year').textContent = new Date().getFullYear();

/* ---------- 04. NAVIGATION ---------- */
const nav = $('#nav');
const navLinks = $('#navLinks');
const burger = $('#burger');

let scrollTick = false;
function onScroll() {
  if (scrollTick) return;
  scrollTick = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 24);
    $('#toTop').classList.toggle('is-on', y > 700);
    scrollTick = false;
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('is-open');
  burger.classList.toggle('is-open', open);
  burger.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('is-locked', open);
});
$$('.nav__link', navLinks).forEach((a) => a.addEventListener('click', () => {
  navLinks.classList.remove('is-open');
  burger.classList.remove('is-open');
  burger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('is-locked');
}));

// Active link follows the section in view
const sections = $$('main section[id]');
const linkFor = (id) => $$('.nav__link').find((a) => a.getAttribute('href') === `#${id}`);
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    $$('.nav__link').forEach((a) => a.classList.remove('is-active'));
    const link = linkFor(e.target.id);
    if (link) link.classList.add('is-active');
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
sections.forEach((s) => sectionObserver.observe(s));

$('#toTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' }));

/* ---------- 05. 3D STAGES ---------- */
const MODEL_URL = 'assets/models/ferrari.glb';
const stages = [];
window.__vxStages = stages;
let gltfScene = null;

function makeSpriteTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(160,240,255,0.85)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const PARTICLE_TEX = makeSpriteTexture();
const BODY_COLORS = { default: 0xc8102e };

function buildStage(canvas, options) {
  const { mode } = options; // 'hero' | 'showcase'
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
  } catch (err) {
    return null;
  }

  // if the GPU process dies mid-session, degrade to the photo instead of freezing
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    showFallback('WebGL context lost');
  }, false);

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.6));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = mode === 'hero' ? 1.15 : 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(mode === 'hero' ? 28 : 32, 1, 0.1, 120);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  // --- lights ---
  scene.add(new THREE.HemisphereLight(0x7fa6ff, 0x04060c, 0.55));

  const key = new THREE.DirectionalLight(0xe8f2ff, 2.1);
  key.position.set(5, 8, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -6;
  key.shadow.camera.right = 6;
  key.shadow.camera.top = 6;
  key.shadow.camera.bottom = -6;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 26;
  key.shadow.bias = -0.0009;
  key.shadow.radius = 5;
  scene.add(key);

  const rimCyan = new THREE.PointLight(0x38e8ff, 55, 22, 2);
  rimCyan.position.set(-6, 1.8, -4);
  scene.add(rimCyan);

  const rimViolet = new THREE.PointLight(0x8b5cf6, 55, 22, 2);
  rimViolet.position.set(6, 1.6, 4);
  scene.add(rimViolet);

  const rimWarm = new THREE.PointLight(0xff7a18, 26, 16, 2);
  rimWarm.position.set(0, 0.9, -7);
  scene.add(rimWarm);

  const floorSpot = new THREE.SpotLight(0x6fd8ff, 40, 26, Math.PI / 5, 0.7, 2);
  floorSpot.position.set(0, 9, 0);
  floorSpot.target.position.set(0, 0, 0);
  scene.add(floorSpot, floorSpot.target);

  // --- shadow catcher ---
  const shadowMat = new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.62 });
  const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 0.001;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  // --- stage glow (soft pool of light under the car) ---
  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = glowCanvas.height = 256;
  const gctx = glowCanvas.getContext('2d');
  const grad = gctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  grad.addColorStop(0, 'rgba(90,200,255,0.55)');
  grad.addColorStop(0.45, 'rgba(60,120,255,0.16)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  gctx.fillStyle = grad;
  gctx.fillRect(0, 0, 256, 256);
  const glowTex = new THREE.CanvasTexture(glowCanvas);
  glowTex.colorSpace = THREE.SRGBColorSpace;
  const glowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(11, 11),
    new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.75 })
  );
  glowPlane.rotation.x = -Math.PI / 2;
  glowPlane.position.y = 0.005;
  scene.add(glowPlane);

  // --- technical floor grid ---
  const grid = new THREE.GridHelper(26, 52, 0x2b6f9e, 0x12324a);
  grid.material.transparent = true;
  grid.material.opacity = 0.35;
  grid.position.y = 0.01;
  scene.add(grid);

  // --- particles ---
  const particleGroup = new THREE.Group();
  const COUNT = isMobile ? 220 : 520;
  const positions = new Float32Array(COUNT * 3);
  const speeds = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 1] = Math.random() * 9 - 0.5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 26;
    speeds[i] = 0.05 + Math.random() * 0.18;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.055, map: PARTICLE_TEX, color: 0x9ce8ff, transparent: true, opacity: 0.85,
    blending: THREE.AdditiveBlending, depthWrite: false, sizeAttenuation: true,
  });
  const points = new THREE.Points(pGeo, pMat);
  particleGroup.add(points);
  scene.add(particleGroup);

  // --- car ---
  const carRoot = new THREE.Group();
  scene.add(carRoot);

  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: BODY_COLORS.default, metalness: 0.88, roughness: 0.24,
    clearcoat: 1, clearcoatRoughness: 0.06, envMapIntensity: 0.85,
  });

  const ghostMaterial = new THREE.MeshBasicMaterial({
    color: 0x0d3a5c, transparent: true, opacity: 0.032,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });

  let carGroup = null;
  let reflectionGroup = null;
  let carHeight = 1.2;

  function setupCar(source) {
    carGroup = source.clone(true);
    carGroup.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = false;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      const next = mats.map((m) => {
        if (!m) return m;
        if (m.name === 'Body_Color' || o.name === 'body') {
          return bodyMaterial.clone();
        }
        const clone = m.clone();
        clone.envMapIntensity = 0.7;
        return clone;
      });
      o.material = Array.isArray(o.material) ? next : next[0];
      o.frustumCulled = false;
    });

    // normalise: centre the car and rest it on y = 0
    const box = new THREE.Box3().setFromObject(carGroup);
    const size = box.getSize(new THREE.Vector3());
    const targetLength = 4.7;
    const length = Math.max(size.x, size.z);
    const scale = targetLength / Math.max(length, 0.001);
    carGroup.scale.setScalar(scale);
    box.setFromObject(carGroup);
    const center = box.getCenter(new THREE.Vector3());
    carGroup.position.x -= center.x;
    carGroup.position.z -= center.z;
    carGroup.position.y -= box.min.y;
    carHeight = size.y * scale;
    carRoot.add(carGroup);

    // mirrored reflection beneath the floor
    reflectionGroup = carGroup.clone(true);
    reflectionGroup.scale.y *= -1;
    reflectionGroup.position.y = -box.min.y * 2;
    reflectionGroup.traverse((o) => {
      if (o.isMesh) { o.material = ghostMaterial; o.castShadow = false; o.receiveShadow = false; }
    });
    reflectionGroup.renderOrder = -1;
    carRoot.add(reflectionGroup);
  }

  if (gltfScene) setupCar(gltfScene);

  // --- controls ---
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enablePan = false;
  controls.autoRotate = !prefersReducedMotion;
  controls.autoRotateSpeed = mode === 'hero' ? 0.55 : 0.8;
  controls.rotateSpeed = 0.55;
  controls.zoomSpeed = 0.7;
  controls.minDistance = mode === 'hero' ? 3.6 : 3.2;
  controls.maxDistance = mode === 'hero' ? 14 : 12;
  controls.minPolarAngle = mode === 'hero' ? 1.12 : 0.55;
  controls.maxPolarAngle = mode === 'hero' ? 1.52 : 1.52;
  controls.target.set(0, mode === 'hero' ? 1.42 : 1.35, 0);
  canvas.style.touchAction = 'pan-y';

  if (mode === 'hero') {
    camera.position.set(4.6, 2.05, 8.2);
  } else {
    camera.position.set(4.4, 1.95, 6.2);
    controls.enableZoom = true;
  }
  const camDir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
  controls.update();

  const clock = new THREE.Clock();
  let visible = true;
  let disposed = false;

  // Keeps the car beautifully framed on any aspect ratio:
  // portrait phones need a much longer camera distance than a wide desktop.
  function frame() {
    const w = canvas.clientWidth || canvas.parentElement.clientWidth;
    const h = canvas.clientHeight || canvas.parentElement.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    const portrait = aspect < 0.95;
    const targetWidth = portrait ? 5.2 : 7.2;
    const vFov = THREE.MathUtils.degToRad(camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    const dist = (targetWidth / 2) / Math.tan(hFov / 2);
    const visibleH = 2 * dist * Math.tan(vFov / 2);
    const frac = portrait ? 0.12 : 0.20;

    if (mode === 'hero') {
      controls.target.set(0, carHeight / 2 + frac * visibleH, 0);
      camera.position.copy(controls.target).addScaledVector(camDir, dist);
    }
    controls.update();
  }
  frame();

  const ro = new ResizeObserver(frame);
  ro.observe(canvas.parentElement || canvas);

  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
  }, { rootMargin: '120px' });
  io.observe(canvas);

  const state = {
    renderer, scene, camera, controls, canvas, mode,
    get visible() { return visible && !document.hidden; },
    bodyMaterials: [],
    update(dt, elapsed) {
      if (!visible) return;
      controls.update();
      // particles drift upward and slowly rotate
      points.rotation.y = elapsed * 0.03;
      const pos = pGeo.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        pos[i * 3 + 1] += speeds[i] * dt;
        if (pos[i * 3 + 1] > 9) pos[i * 3 + 1] = -0.6;
      }
      pGeo.attributes.position.needsUpdate = true;
      if (reflectionGroup) reflectionGroup.rotation.y = carGroup ? carGroup.rotation.y : 0;
      renderer.render(scene, camera);
    },
    setBodyColor(hex) {
      bodyMaterial.color.set(hex);
      scene.traverse((o) => {
        if (!o.isMesh) return;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => { if (m && m.isMeshPhysicalMaterial && m.clearcoat > 0) m.color.set(hex); });
      });
    },
    resetView() {
      if (mode === 'showcase') {
        controls.target.set(0, 1.35, 0);
        camera.position.copy(controls.target).addScaledVector(camDir, 6.4);
      } else {
        frame();
      }
      controls.update();
    },
    setCar(source) { setupCar(source); },
    renderOnce() { renderer.render(scene, camera); },
    dispose() {
      disposed = true;
      ro.disconnect(); io.disconnect(); controls.dispose(); renderer.dispose();
    },
  };

  // collect body materials for recolouring
  scene.traverse((o) => {
    if (!o.isMesh) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    mats.forEach((m) => { if (m && m.isMeshPhysicalMaterial) state.bodyMaterials.push(m); });
  });

  return state;
}

/* global animation loop: renders only the stages that are on screen */
let rafId = null;
const clock = new THREE.Clock();
function loop() {
  rafId = requestAnimationFrame(loop);
  if (window.__vxPause) return;
  const dt = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;
  let anyVisible = false;
  for (const s of stages) {
    if (s && s.visible) { anyVisible = true; s.update(dt, elapsed); }
  }
  if (!anyVisible) { /* keep the loop alive but cheap */ }
}

function startLoop() { if (rafId === null) loop(); }

function loadCarModel() {
  return new Promise((resolve) => {
    const draco = new DRACOLoader();
    draco.setDecoderPath('./vendor/draco/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);
    loader.load(
      MODEL_URL,
      (gltf) => { gltfScene = gltf.scene; resolve(true); },
      (e) => {
        if (e.total) setProgress((e.loaded / e.total) * 80);
      },
      (err) => { console.warn('3D model unavailable:', err); resolve(false); }
    );
  });
}

/* ---------- 3D CAPABILITY + PHOTOGRAPHIC FALLBACK ----------
   Every failure path (no WebGL context, model download failed, renderer
   produced no pixels) lands on showFallback(), so the page never shows a
   blank rectangle where a car should be. */
let webglSupport = null;
function hasWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl') || probe.getContext('experimental-webgl');
    if (!gl || typeof gl.getParameter !== 'function') { webglSupport = false; return false; }
    // release the probe context immediately — browsers cap live contexts
    const lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    webglSupport = true;
  } catch (err) {
    webglSupport = false;
  }
  return webglSupport;
}

/* true when the canvas has actually painted something (not just a transparent rect) */
function canvasHasInk(canvas, stage) {
  if (!canvas) return false;
  try {
    if (stage && typeof stage.renderOnce === 'function') stage.renderOnce();
    const probe = document.createElement('canvas');
    probe.width = 48; probe.height = 48;
    const ctx = probe.getContext('2d', { willReadFrequently: true });
    ctx.clearRect(0, 0, 48, 48);
    ctx.drawImage(canvas, 0, 0, 48, 48);
    const data = ctx.getImageData(0, 0, 48, 48).data;
    let ink = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 6) ink++;
    return ink > 8;
  } catch (err) {
    return true; // unreadable (tainted / no buffer) — assume it rendered
  }
}

let fallbackActive = false;

function showFallback(reason) {
  if (fallbackActive) return;
  fallbackActive = true;
  console.info('[VELOCITY X] 3D stage unavailable (' + reason + ') — using photographic fallback.');
  document.body.classList.add('no-3d');

  // stop the render loop and free the contexts
  if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  while (stages.length) { const s = stages.pop(); if (s && s.dispose) s.dispose(); }

  ['#hero-canvas', '#showcase-canvas'].forEach((sel) => {
    const c = $(sel);
    if (c) { c.classList.remove('is-live'); c.style.display = 'none'; }
  });

  const hero = $('.hero');
  if (hero && !$('.hero > .hero__fallback')) {
    const img = document.createElement('img');
    img.src = 'assets/images/hero-car-cut.webp';
    img.alt = 'Lamborghini Revuelto';
    img.className = 'hero__fallback';
    img.decoding = 'async';
    hero.insertBefore(img, hero.querySelector('.hero__content'));
  }

  const stage = $('.showcase__stage');
  if (stage && !$('.showcase__stage .hero__fallback')) {
    const img = document.createElement('img');
    img.src = 'assets/images/stage-car-cut.webp';
    img.alt = 'Ferrari 296 GTB';
    img.className = 'hero__fallback hero__fallback--stage';
    img.decoding = 'async';
    stage.prepend(img);
  }

  // swatches still work — they respray the photo instead of the model
  const photo = $('.showcase__stage .hero__fallback');
  $$('#swatches .swatch').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('#swatches .swatch').forEach((b) => { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
      if (photo) photo.style.filter = bodyFilter(btn.dataset.color, 353);
      showToast(`Body finished in ${btn.getAttribute('aria-label')}`);
    });
  });
}

async function initThree() {
  // capability first — never download a 1.7 MB model for a browser that can't draw it
  if (!hasWebGL()) return showFallback('WebGL unavailable');

  if (!(await loadCarModel())) return showFallback('model unavailable');

  const heroStage = buildStage($('#hero-canvas'), { mode: 'hero' });
  if (!heroStage) return showFallback('renderer unavailable');
  stages.push(heroStage);
  $('#hero-canvas').classList.add('is-live');
  startLoop();

  // a context can be created and still paint nothing (blocked GPU, context lost,
  // driver allow-list). Verify real pixels before we trust it.
  setTimeout(() => {
    if (fallbackActive) return;
    if (!canvasHasInk($('#hero-canvas'), heroStage)) showFallback('renderer produced no pixels');
  }, 1600);

  // the 360 stage is built only when it scrolls into view — keeps first paint light
  const target = $('#showcase-canvas');
  const io = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    io.disconnect();
    const stage = buildStage(target, { mode: 'showcase' });
    if (stage) {
      stages.push(stage);
      target.classList.add('is-live');
      setTimeout(() => {
        if (fallbackActive) return;
        if (!canvasHasInk(target, stage)) showFallback('showcase renderer produced no pixels');
      }, 1600);
    } else {
      showFallback('showcase renderer unavailable');
    }
  }, { rootMargin: '400px' });
  io.observe(target);

  // swatches repaint the 3D body
  $$('#swatches .swatch').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('#swatches .swatch').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      stages.forEach((s) => s.setBodyColor(btn.dataset.color));
      showToast(`Body finished in ${btn.getAttribute('aria-label')}`);
    });
  });

  $('#resetView').addEventListener('click', () => {
    stages.forEach((s) => s.resetView());
    showToast('Camera reset');
  });
}

/* boot must never wait on the 3D pipeline */
const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const minSplash = delay(1100);
const modelReady = initThree().catch((err) => console.warn('3D init failed', err));

Promise.all([Promise.race([modelReady, delay(4500)]), document.fonts.ready, minSplash])
  .then(() => finishBoot());

/* ---------- 06. CARD GRID + FILTERS ---------- */
const grid = $('#carGrid');

function carCard(car, index) {
  const specs = [
    [car.hp, 'hp'],
    [car.topSpeed, 'km/h'],
    [car.accel, '0–100'],
  ];
  return `
  <article class="car-card tilt" data-id="${car.id}" data-cats="${car.categories.join(' ')}"
           style="--accent:${car.accent};animation-delay:${index * 70}ms" tabindex="0" aria-label="${escapeHtml(car.brand)} ${escapeHtml(car.name)} — ${inr(car.price)}">
    <div class="car-card__media">
      <img src="${car.image}" alt="${escapeHtml(car.brand)} ${escapeHtml(car.name)} studio profile" loading="lazy" width="1600" height="1000" />
      <span class="car-card__badge">${car.badge}</span>
    </div>
    <div class="car-card__body">
      <span class="car-card__brand">${escapeHtml(car.brand)}</span>
      <h3 class="car-card__name">${escapeHtml(car.name)}</h3>
      <p class="car-card__price"><strong>${inr(car.price)}</strong><span>ex-showroom</span></p>
      <div class="car-card__specs">
        ${specs.map(([v, l]) => `<div class="ccs"><b>${v}</b><span>${l}</span></div>`).join('')}
      </div>
      <div class="car-card__actions">
        <button class="btn btn--neon" type="button" data-view="${car.id}"><span>View Details</span></button>
        <button class="btn btn--ghost btn--icon" type="button" data-compare="${car.id}" aria-label="Compare ${escapeHtml(car.name)}" title="Add to comparison">
          <svg class="ic ic--s"><use href="#i-compare"/></svg>
        </button>
      </div>
    </div>
  </article>`;
}

function renderGrid(filter = 'all') {
  const list = filter === 'all' ? CARS : CARS.filter((c) => c.categories.includes(filter));
  grid.innerHTML = list.map((c, i) => carCard(c, i)).join('');
  $('#gridEmpty').hidden = list.length > 0;
  initTilt(grid);
}

renderGrid();

$('#filters').addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  $$('#filters .chip').forEach((c) => c.classList.remove('is-active'));
  btn.classList.add('is-active');
  renderGrid(btn.dataset.filter);
});

// delegate card actions
grid.addEventListener('click', (e) => {
  const view = e.target.closest('[data-view]');
  if (view) { openModal(view.dataset.view); return; }
  const cmp = e.target.closest('[data-compare]');
  if (cmp) { addToCompare(cmp.dataset.compare); return; }
  const card = e.target.closest('.car-card');
  if (card) openModal(card.dataset.id);
});
grid.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.car-card');
  if (card) { e.preventDefault(); openModal(card.dataset.id); }
});

// category cards filter the grid
$$('.cat-card').forEach((card) => {
  card.addEventListener('click', () => {
    const cat = card.dataset.cat;
    const map = { supercars: 'supercar', luxury: 'grand-tourer', sports: 'sports', electric: 'electric', suv: 'suv', sedan: 'sedan' };
    const filter = map[cat] || 'all';
    $$('#filters .chip').forEach((c) => c.classList.toggle('is-active', c.dataset.filter === filter));
    renderGrid(filter);
    $('#cars').scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
});
$$('[data-cat-link]').forEach((a) => {
  a.addEventListener('click', () => {
    const map = { supercars: 'supercar', luxury: 'grand-tourer', sports: 'sports', electric: 'electric', suv: 'suv', sedan: 'sedan' };
    const filter = map[a.dataset.catLink] || 'all';
    $$('#filters .chip').forEach((c) => c.classList.toggle('is-active', c.dataset.filter === filter));
    renderGrid(filter);
  });
});

/* ---------- 07. DETAIL MODAL ---------- */
const modal = $('#carModal');
let lastFocus = null;

function openModal(id) {
  const car = CARS.find((c) => c.id === id);
  if (!car) return;
  lastFocus = document.activeElement;

  $('#modalImg').src = car.image;
  $('#modalImg').alt = `${car.brand} ${car.name} studio profile`;
  $('#modalImg').style.filter = 'none';
  $('#modalBrand').textContent = car.brand.toUpperCase();
  $('#modalTitle').textContent = car.name;
  $('#modalTagline').textContent = car.tagline;
  $('#modalPrice').textContent = inr(car.price);
  $('#modalBadge').textContent = car.badge;
  $('.modal__panel').style.setProperty('--accent', car.accent);

  $('#modalStats').innerHTML = [
    [car.hp, 'HP'],
    [car.accel + 's', '0–100'],
    [car.topSpeed, 'KM/H'],
    [car.torque, 'NM'],
  ].map(([v, l]) => `<div class="ms"><b>${v}</b><span>${l}</span></div>`).join('');

  $('#modalSpecs').innerHTML = [
    ['Engine', car.engine],
    ['Torque', `${car.torque} Nm`],
    ['Transmission', car.transmission],
    ['Fuel Type', car.fuel],
    ['Max Speed', `${car.topSpeed} km/h`],
    ['0–100 km/h', `${car.accel} s`],
    [car.economyLabel, car.economy],
    ['Seating', '2 + 2'],
  ].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');

  $('#modalInterior').innerHTML = car.interior.map((f) => `<li><svg class="ic"><use href="#i-check"/></svg><span>${escapeHtml(f)}</span></li>`).join('');
  $('#modalSafety').innerHTML = car.safety.map((f) => `<li><svg class="ic"><use href="#i-check"/></svg><span>${escapeHtml(f)}</span></li>`).join('');

  const swatches = $('#modalSwatches');
  swatches.innerHTML = car.colors.map(([n, hex], i) =>
    `<button class="swatch${i === 0 ? ' is-active' : ''}" type="button" data-hex="${hex}" data-name="${escapeHtml(n)}"
             style="--c:${hex}" aria-label="${escapeHtml(n)}" title="${escapeHtml(n)}"></button>`).join('');

  $('#modalCompare').dataset.id = car.id;

  modal.hidden = false;
  document.body.classList.add('is-locked');
  $('.modal__panel').scrollTop = 0;
  $('.modal__close').focus();
}

function closeModal() {
  modal.hidden = true;
  document.body.classList.remove('is-locked');
  if (lastFocus) lastFocus.focus();
}

$('#modalSwatches').addEventListener('click', (e) => {
  const btn = e.target.closest('.swatch');
  if (!btn) return;
  const car = CARS.find((c) => c.id === $('#modalCompare').dataset.id);
  $$('#modalSwatches .swatch').forEach((s) => s.classList.remove('is-active'));
  btn.classList.add('is-active');
  const img = $('#modalImg');
  img.style.filter = bodyFilter(btn.dataset.hex, car ? car.baseHue : 0);
  $('.modal__panel').style.setProperty('--accent', btn.dataset.hex);
  showToast(`Colour preview — ${btn.dataset.name}`);
});

$('#modalCompare').addEventListener('click', (e) => {
  addToCompare(e.currentTarget.dataset.id);
  closeModal();
});

$$('[data-close]', modal).forEach((el) => el.addEventListener('click', closeModal));
$('#modalCloseBtn').addEventListener('click', closeModal);

/* ---------- 08. SEARCH ---------- */
const searchModal = $('#searchModal');
const searchInput = $('#searchInput');
const searchResults = $('#searchResults');

function renderSearch(q = '') {
  const term = q.trim().toLowerCase();
  const list = CARS.filter((c) =>
    !term || `${c.brand} ${c.name} ${c.fuel} ${c.engine}`.toLowerCase().includes(term)
  );
  if (!list.length) {
    searchResults.innerHTML = '<p class="search-empty">No machines match that search.</p>';
    return;
  }
  searchResults.innerHTML = list.map((c) => `
    <button class="sr-item" type="button" data-open="${c.id}">
      <img src="${c.image.replace('.jpg', '-sm.jpg')}" alt="" width="160" height="100" loading="lazy" />
      <span><b>${escapeHtml(c.brand)} ${escapeHtml(c.name)}</b><span>${escapeHtml(c.engine)} · ${c.hp} hp</span></span>
      <em>${inr(c.price)}</em>
    </button>`).join('');
}

function openSearch() {
  lastFocus = document.activeElement;
  searchModal.hidden = false;
  document.body.classList.add('is-locked');
  renderSearch('');
  setTimeout(() => searchInput.focus(), 60);
}
function closeSearch() {
  searchModal.hidden = true;
  document.body.classList.remove('is-locked');
  searchInput.value = '';
  if (lastFocus) lastFocus.focus();
}

$('#searchBtn').addEventListener('click', openSearch);
searchInput.addEventListener('input', (e) => renderSearch(e.target.value));
searchResults.addEventListener('click', (e) => {
  const item = e.target.closest('[data-open]');
  if (!item) return;
  closeSearch();
  setTimeout(() => openModal(item.dataset.open), 120);
});
$$('[data-close]', searchModal).forEach((el) => el.addEventListener('click', closeSearch));

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  if (!searchModal.hidden) closeSearch();
  else if (!modal.hidden) closeModal();
  else if (navLinks.classList.contains('is-open')) {
    navLinks.classList.remove('is-open');
    burger.classList.remove('is-open');
    document.body.classList.remove('is-locked');
  }
});
// Ctrl/Cmd+K opens search
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openSearch();
  }
});

/* ---------- 09. COMPARE TOOL ---------- */
const slots = [$('#cmp0'), $('#cmp1'), $('#cmp2')];
const compareWrap = $('#compareTableScroll');
const compareEmpty = $('#compareEmpty');

function fillSelects() {
  slots.forEach((sel, i) => {
    sel.innerHTML = `<option value="">— Select a car —</option>` +
      CARS.map((c) => `<option value="${c.id}">${c.brand} ${c.name}</option>`).join('');
    const preset = ['revuelto', '296gtb', ''][i];
    sel.value = preset;
  });
}
fillSelects();

function compareRows() {
  return [
    { label: 'Ex-showroom Price', key: 'price', fmt: (v) => inr(v), best: 'min', cls: 'cmp-price' },
    { label: 'Horsepower', key: 'hp', fmt: (v) => `${v} hp`, best: 'max' },
    { label: 'Torque', key: 'torque', fmt: (v) => `${v} Nm`, best: 'max' },
    { label: 'Top Speed', key: 'topSpeed', fmt: (v) => `${v} km/h`, best: 'max' },
    { label: '0–100 km/h', key: 'accel', fmt: (v) => `${v} s`, best: 'min' },
    { label: 'Engine', key: 'engine' },
    { label: 'Fuel Type', key: 'fuel' },
    { label: 'Transmission', key: 'transmission' },
    { label: 'Mileage / Range', key: 'economy' },
  ];
}

function renderCompare() {
  const picked = slots.map((s) => s.value).filter(Boolean).map((id) => CARS.find((c) => c.id === id));
  if (picked.length < 2) {
    compareEmpty.hidden = false;
    compareWrap.hidden = true;
    compareWrap.innerHTML = '';
    return;
  }
  compareEmpty.hidden = true;
  compareWrap.hidden = false;

  const rows = compareRows();
  const head = `<tr><th scope="col">Specification</th>${picked.map((c) => `
    <th scope="col"><div class="cmp-car"><img src="${c.image.replace('.jpg', '-sm.jpg')}" alt="${escapeHtml(c.name)}" loading="lazy" /><b>${escapeHtml(c.brand)}</b><span>${escapeHtml(c.name)}</span></div></th>`).join('')}</tr>`;

  const body = rows.map((row) => {
    const values = picked.map((c) => c[row.key]);
    let bestIdx = -1;
    if (row.best === 'min') bestIdx = values.indexOf(Math.min(...values));
    if (row.best === 'max') bestIdx = values.indexOf(Math.max(...values));
    const cells = picked.map((c, i) => {
      const v = row.fmt ? row.fmt(c[row.key]) : c[row.key];
      return `<td class="${i === bestIdx ? 'is-best' : ''} ${row.cls || ''}">${v}</td>`;
    }).join('');
    return `<tr><th scope="row">${row.label}</th>${cells}</tr>`;
  }).join('');

  compareWrap.innerHTML = `<table class="cmp-table"><thead>${head}</thead><tbody>${body}</tbody></table>`;
}

$('#compareNow').addEventListener('click', () => {
  const count = slots.filter((s) => s.value).length;
  if (count < 2) { showToast('Pick at least two cars to compare'); return; }
  renderCompare();
  compareWrap.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
  showToast('Comparison updated');
});

$('#clearCompare').addEventListener('click', () => {
  slots.forEach((s) => { s.value = ''; });
  compareWrap.innerHTML = '';
  compareWrap.hidden = true;
  compareEmpty.hidden = false;
  showToast('Comparison cleared');
});

slots.forEach((s) => s.addEventListener('change', () => {
  if (slots.filter((x) => x.value).length >= 2) renderCompare();
}));

function addToCompare(id) {
  const car = CARS.find((c) => c.id === id);
  if (!car) return;
  const empty = slots.find((s) => !s.value);
  const target = empty || slots[0];
  target.value = id;
  renderCompare();
  $('#compare').scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  showToast(`${car.brand} ${car.name} added to comparison`);
}

renderCompare();

/* ---------- 10. BOOKING FORM ---------- */
const bookingForm = $('#bookingForm');
const fCar = $('#fCar');
fCar.innerHTML = '<option value="">Select a machine</option>' +
  CARS.map((c) => `<option value="${c.id}">${c.brand} ${c.name} — ${inr(c.price)}</option>`).join('');

const fDate = $('#fDate');
fDate.min = new Date().toISOString().split('T')[0];

function setError(name, msg) {
  const el = $(`[data-err="${name}"]`);
  const input = bookingForm.elements[name];
  if (el) { el.textContent = msg || ''; el.classList.toggle('is-on', !!msg); }
  if (input) input.classList.toggle('is-invalid', !!msg);
}

bookingForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = {
    name: bookingForm.name.value.trim(),
    email: bookingForm.email.value.trim(),
    phone: bookingForm.phone.value.trim(),
    car: bookingForm.car.value,
    date: bookingForm.date.value,
    time: bookingForm.time.value,
    location: bookingForm.location.value,
  };
  let ok = true;

  if (data.name.length < 3) { setError('name', 'Please enter your full name (min. 3 characters).'); ok = false; } else setError('name', '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) { setError('email', 'Enter a valid email address.'); ok = false; } else setError('email', '');
  if (!/^(\+91[\s-]?)?[0-9]{10}$/.test(data.phone.replace(/\s/g, ''))) { setError('phone', 'Enter a valid 10-digit Indian mobile number.'); ok = false; } else setError('phone', '');
  if (!data.car) { setError('car', 'Please choose a car model.'); ok = false; } else setError('car', '');
  if (!data.date) { setError('date', 'Choose a preferred date.'); ok = false; } else setError('date', '');
  if (!data.time) { setError('time', 'Choose a preferred time.'); ok = false; } else setError('time', '');
  if (!data.location) { setError('location', 'Choose a showroom.'); ok = false; } else setError('location', '');

  if (!ok) {
    showToast('Please check the highlighted fields');
    const firstBad = $('.field__input.is-invalid', bookingForm);
    if (firstBad) firstBad.focus();
    return;
  }

  const car = CARS.find((c) => c.id === data.car);
  bookingForm.hidden = true;
  const success = $('#bookingSuccess');
  success.hidden = false;
  $('#bookingSummary').textContent =
    `${data.name.split(' ')[0]}, your ${car.brand} ${car.name} test drive is requested for ` +
    `${new Date(data.date + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} ` +
    `at ${data.time}. A concierge will call ${data.phone} to confirm.`;
  showToast('Test drive request submitted');
});

$('#bookAnother').addEventListener('click', () => {
  bookingForm.reset();
  $$('.field__input', bookingForm).forEach((i) => i.classList.remove('is-invalid'));
  $$('.field__err', bookingForm).forEach((i) => { i.textContent = ''; i.classList.remove('is-on'); });
  $('#bookingSuccess').hidden = true;
  bookingForm.hidden = false;
});

/* ---------- 11. NEWSLETTER ---------- */
$('#newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const input = $('#nlEmail');
  const msg = $('#nlMsg');
  const value = input.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
    msg.textContent = 'Please enter a valid email address.';
    msg.classList.add('is-error');
    input.focus();
    return;
  }
  msg.classList.remove('is-error');
  msg.textContent = 'Welcome to the inner circle — check your inbox to confirm.';
  input.value = '';
  showToast('Subscribed to Velocity X updates');
});

/* ---------- 12. TESTIMONIAL CAROUSEL ---------- */
const track = $('#carouselTrack');
const slides = $$('.t-card', track);
const dotsWrap = $('#carouselDots');
let slideIndex = 0;

const visibleCount = () => (window.innerWidth > 1080 ? 3 : window.innerWidth > 760 ? 2 : 1);
const maxIndex = () => Math.max(0, slides.length - visibleCount());

function renderDots() {
  const n = maxIndex() + 1;
  dotsWrap.innerHTML = Array.from({ length: n }, (_, i) =>
    `<button type="button" role="tab" aria-label="Go to slide ${i + 1}" aria-selected="${i === slideIndex}" class="${i === slideIndex ? 'is-active' : ''}"></button>`).join('');
}
function goTo(index) {
  const max = maxIndex();
  slideIndex = (index + (max + 1)) % (max + 1);
  const gap = 18;
  const step = slides[0].getBoundingClientRect().width + gap;
  track.style.transform = `translateX(${-slideIndex * step}px)`;
  $$('#carouselDots button').forEach((d, i) => {
    d.classList.toggle('is-active', i === slideIndex);
    d.setAttribute('aria-selected', String(i === slideIndex));
  });
}
renderDots();
goTo(0);

$('#nextSlide').addEventListener('click', () => goTo(slideIndex + 1));
$('#prevSlide').addEventListener('click', () => goTo(slideIndex - 1));
dotsWrap.addEventListener('click', (e) => {
  const i = [...dotsWrap.children].indexOf(e.target.closest('button'));
  if (i > -1) goTo(i);
});

let autoSlide = null;
function startAuto() {
  if (prefersReducedMotion || autoSlide) return;
  autoSlide = setInterval(() => goTo(slideIndex + 1), 6500);
}
function stopAuto() { clearInterval(autoSlide); autoSlide = null; }
startAuto();
const carouselEl = $('#carousel');
carouselEl.addEventListener('mouseenter', stopAuto);
carouselEl.addEventListener('mouseleave', startAuto);
carouselEl.addEventListener('focusin', stopAuto);
carouselEl.addEventListener('focusout', startAuto);

// swipe
let dragStart = null;
track.addEventListener('pointerdown', (e) => { dragStart = e.clientX; });
track.addEventListener('pointerup', (e) => {
  if (dragStart === null) return;
  const dx = e.clientX - dragStart;
  if (Math.abs(dx) > 45) goTo(slideIndex + (dx < 0 ? 1 : -1));
  dragStart = null;
});

window.addEventListener('resize', () => {
  const max = maxIndex();
  if (slideIndex > max) slideIndex = max;
  renderDots();
  goTo(slideIndex);
});

/* ---------- 13. REVEALS, COUNTERS, TILT ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add('in-view');
    revealObserver.unobserve(el);
    // Failsafe: if the transition clock stalls (background tab, busy GPU), still land on the final state.
    const timer = setTimeout(() => {
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, 1800);
    el.addEventListener('transitionend', () => clearTimeout(timer), { once: true });
  });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
$$('[data-reveal]').forEach((el) => revealObserver.observe(el));

function animateCounter(el) {
  const target = parseFloat(el.dataset.counter);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const duration = 1500;
  const start = performance.now();
  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 4);
    const val = target * eased;
    el.textContent = val.toFixed(decimals);
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = target.toFixed(decimals);
  }
  requestAnimationFrame(frame);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    animateCounter(e.target);
    counterObserver.unobserve(e.target);
  });
}, { threshold: 0.6 });

function startCounters() {
  $$('[data-counter]').forEach((el) => counterObserver.observe(el));
}

/* 3D tilt — only for fine pointers (skips touch) */
function initTilt(scope = document) {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || prefersReducedMotion) return;
  $$('.tilt', scope).forEach((el) => {
    if (el.dataset.tiltReady) return;
    el.dataset.tiltReady = '1';
    const max = parseFloat(el.dataset.tiltMax || 6);
    el.addEventListener('pointerenter', () => { el.style.transition = 'transform .14s ease-out'; });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const lift = el.classList.contains('offer') ? -8 : -4;
      el.style.transform =
        `perspective(1000px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateY(${lift}px) translateZ(6px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transition = 'transform .6s cubic-bezier(.16,1,.3,1)';
      el.style.transform = '';
    });
  });
}
initTilt();

/* hero mouse parallax (DOM layers) */
if (!prefersReducedMotion) {
  const heroContent = $('.hero__content');
  const orbs = $$('.orb');
  let px = 0, py = 0, tx = 0, ty = 0;
  window.addEventListener('pointermove', (e) => {
    tx = (e.clientX / window.innerWidth - 0.5) * 2;
    ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
  (function parallax() {
    px += (tx - px) * 0.05;
    py += (ty - py) * 0.05;
    if (heroContent) heroContent.style.transform = `translate3d(${px * 10}px, ${py * 8}px, 0)`;
    orbs.forEach((o, i) => {
      const depth = (i + 1) * 14;
      o.style.translate = `${-px * depth}px ${-py * depth}px`;
    });
    requestAnimationFrame(parallax);
  })();
}

/* hotspot tooltips */
const tip = $('#hotspotTip');
let tipTarget = null;
$$('.hotspot').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const title = btn.dataset.title;
    const text = btn.dataset.text;
    if (tipTarget === btn) {
      tip.classList.remove('is-on');
      tipTarget = null;
      return;
    }
    tipTarget = btn;
    tip.innerHTML = `<b>${escapeHtml(title)}</b>${escapeHtml(text)}`;
    tip.classList.add('is-on');
    tip.style.left = getComputedStyle(btn).getPropertyValue('--x').trim();
    tip.style.bottom = 'auto';
    tip.style.top = `calc(${getComputedStyle(btn).getPropertyValue('--y').trim()} - 20px)`;
    tip.style.transform = 'translate(-50%, -100%)';
  });
});
document.addEventListener('click', (e) => {
  if (!e.target.closest('.hotspot')) { tip.classList.remove('is-on'); tipTarget = null; }
});

/* ---------- 14. MISC ---------- */
// keep the year fresh
$('#year').textContent = new Date().getFullYear();

// reveal hero content once the loader finishes (handled by body.is-ready)
console.log(
  '%c VELOCITY X %c showroom online ',
  'background:#38e8ff;color:#04060c;font-weight:bold;padding:4px 6px;border-radius:4px 0 0 4px',
  'background:#8b5cf6;color:#fff;padding:4px 6px;border-radius:0 4px 4px 0'
);
