import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MapPin, Search, Maximize2,
  Filter, ChevronDown, X, Route,
  ShoppingBag, Utensils, Sparkles,
  Watch, Warehouse,
  Gamepad2, Building2, Pill, Hotel,
  Info,
} from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';

/* ================================================================== */
/*  COSMOS ANGRÉ — Plan 3D intégré                                     */
/*  Plan image: 3308 × 2339 px → World: 120 × 84.85 units            */
/* ================================================================== */

const PW = 120, PH = 120 * (2339 / 3308);  // ≈ 84.85
const S = PW / 3308;                        // ≈ 0.03626

// Direct pixel → world mapping (no transform, coords are in 3308×2339 space)
const mapX = (raw: number) => raw * S;
const mapZ = (raw: number) => raw * S;

/* ------------------------------------------------------------------ */
/*  Store data                                                         */
/* ------------------------------------------------------------------ */
// [name, cat, color, px1, py1, px2, py2, area, desc, status]
type StoreEntry = [string, string, number, number, number, number, number, string, string, string];

const STORE_DATA: StoreEntry[] = [
  // ─── Zone Nord (Boulevard des Martyrs) ───
  ["Carrefour Market",    "supermarche",0xD4A520, 155,175, 530,440,"2 211m²","Supermarché principal · Ancre alimentaire nord-ouest","loue"],
  ["Surface Alimentaire", "supermarche",0xD4A520, 535,240, 630,410,"552m²","Surface alimentaire complémentaire","loue"],
  ["Kiabi",               "mode",       0xC2185B, 1060,130,1430,310,"648m²","Mode à petits prix · Grande surface textile","loue"],
  ["Bonus",               "market",     0xFF7043, 870,340, 1010,410,"300m²","Magasin multiservice · Prix discount","loue"],
  ["Craft Market",        "market",     0xFF7043, 1270,260,1440,435,"456m²","Marché artisanal · Produits locaux","loue"],
  ["Boutique C18",        "boutique",   0x78909C, 815,175, 880,240,"62m²","Boutique galerie · Zone nord","libre"],
  ["Boutique C19",        "boutique",   0x78909C, 885,175, 950,240,"74m²","Boutique galerie · Zone nord","libre"],
  ["Boutique C16",        "boutique",   0x78909C, 640,280, 720,350,"70m²","Boutique galerie · Aile centrale","libre"],
  ["Boutique C15",        "boutique",   0x78909C, 635,375, 750,445,"107m²","Boutique galerie · Aile centrale","libre"],
  ["Boutique B10",        "boutique",   0x78909C, 510,410, 565,445,"50m²","Boutique galerie","libre"],
  ["Kiosque FC1",         "boutique",   0x78909C, 790,385, 830,420,"12m²","Petit commerce · Food corner","libre"],
  // ─── Galerie Centrale ───
  ["Boutique C8",         "boutique",   0x78909C, 310,490, 440,540,"135m²","Boutique galerie centrale","libre"],
  ["Boutique C10",        "boutique",   0x78909C, 445,490, 530,540,"95m²","Boutique galerie centrale","libre"],
  ["Boutique C11",        "boutique",   0x78909C, 555,490, 625,540,"77m²","Boutique galerie centrale","libre"],
  ["Restaurant Galerie",  "restaurant", 0xE53935, 650,490, 830,540,"116m²","Zone restauration · Galerie centrale","loue"],
  ["Aldo",                "mode",       0xC2185B, 650,465, 700,490,"44m²","Chaussures & maroquinerie premium","loue"],
  ["City Sport",          "mode",       0xC2185B, 960,460, 1100,540,"222m²","Sport · Multimarque · Équipements","loue"],
  // ─── Terrasses & Food Court Est ───
  ["Terrasse T1",         "restaurant", 0xE53935, 1110,475,1170,540,"152m²","Terrasse restaurant 1 · La Halle Gourmande","loue"],
  ["Terrasse T2",         "restaurant", 0xE53935, 1175,475,1240,540,"174m²","Terrasse restaurant 2 · La Halle Gourmande","loue"],
  ["Terrasse T3",         "restaurant", 0xE53935, 1245,475,1310,540,"175m²","Terrasse restaurant 3 · La Halle Gourmande","loue"],
  // ─── Aile Ouest ───
  ["Oïmo Shoes",          "mode",       0xC2185B, 95,570,  260,650,"275m²","Chaussures · Grande surface spécialisée","loue"],
  ["Boutique Mode Ouest", "mode",       0xC2185B, 95,655,  200,710,"113m²","Boutique mode · Aile ouest","accord"],
  ["Boutique B11",        "boutique",   0x78909C, 260,590, 310,640,"46m²","Boutique galerie · Aile ouest","libre"],
  ["Boutique 42m²",       "boutique",   0x78909C, 265,565, 325,590,"42m²","Boutique disponible · Aile ouest","libre"],
  ["Boutique Ouest A",    "boutique",   0x78909C, 335,610, 395,660,"54m²","Boutique · Galerie ouest","libre"],
  ["Boutique Ouest B",    "boutique",   0x78909C, 335,665, 395,710,"54m²","Boutique · Galerie ouest","libre"],
  ["Boutique Ouest C",    "boutique",   0x78909C, 335,730, 395,775,"54m²","Boutique · Galerie ouest","libre"],
  ["Boutique Ouest D",    "boutique",   0x78909C, 335,780, 395,825,"54m²","Boutique · Galerie ouest","libre"],
  ["Boutique C5",         "boutique",   0x78909C, 95,740,  200,795,"143m²","Boutique galerie · Grande surface","libre"],
  ["Jules",               "mode",       0xC2185B, 95,795,  200,840,"133m²","Mode homme · Enseigne française","loue"],
  ["Zino Galerie",        "mode",       0xC2185B, 205,795, 290,840,"70m²","Mode & accessoires","loue"],
  ["Lacoste",             "mode",       0xC2185B, 95,840,  200,895,"140m²","Prêt-à-porter premium international","loue"],
  ["Kiosque FC6",         "boutique",   0x78909C, 305,730, 380,795,"54m²","Boutique compacte · Galerie ouest","libre"],
  // ─── Loisirs & Expo ───
  ["Zone d'Expo",         "loisirs",    0x7B1FA2, 480,620, 625,735,"116m²","Espace d'expo polyvalent · Pop-up","loue"],
  ["Dreamland",           "loisirs",    0x7B1FA2, 720,590, 1010,740,"1 125m²","Parc de loisirs intérieur · Enfants","loue"],
  ["Big Box 3",           "services",   0x42A5F5, 1040,670,1210,760,"500m²","Grande surface · Box commercial","accord"],
  // ─── Zone Sud ───
  ["Zino Flagship",       "mode",       0xC2185B, 95,920,  240,1020,"332m²","Mode · Flagship store","loue"],
  ["Zino Extension",      "mode",       0xC2185B, 245,905, 380,975,"193m²","Mode · Extension","loue"],
  ["Boutique C29",        "boutique",   0x78909C, 340,885, 460,950,"199m²","Boutique galerie · Zone sud","libre"],
  ["Boutique C32",        "boutique",   0x78909C, 465,885, 540,950,"94m²","Boutique galerie · Zone sud","libre"],
  ["Boutique C27",        "boutique",   0x78909C, 290,1000,365,1050,"98m²","Boutique galerie · Zone sud","libre"],
  ["Pharmacie",           "beaute",     0xF48FB1, 370,1000,440,1055,"98m²","Pharmacie · Parapharmacie · Santé","loue"],
  ["Boutique C30",        "boutique",   0x78909C, 445,1000,510,1055,"70m²","Boutique galerie · Zone sud","libre"],
  ["DAB",                 "services",   0x42A5F5, 515,1020,545,1055,"29m²","Distributeurs automatiques de billets","loue"],
  // ─── Restauration Sud & Hôtel ───
  ["BB4-1 Terrasse",      "restaurant", 0xE53935, 615,825, 730,860,"24m²","Terrasse Sports Bar","loue"],
  ["Sports Bar BB4-1",    "restaurant", 0xE53935, 540,860, 730,940,"200m²","Sports Bar · Convivialité · Écrans","loue"],
  ["ibis Styles / Adagio","hotel",      0x2E7D32, 780,890,1260,1105,"739m²","Hôtel ★★★ · ibis Styles & Adagio Aparthotel","loue"],
  // ─── Big Box Sud ───
  ["Big Box BB4-3",       "services",   0x42A5F5, 545,1110,680,1175,"270m²","Box commercial · Grande surface","accord"],
  ["Big Box BB4-4",       "services",   0x42A5F5, 685,1110,780,1175,"110m²","Box commercial · Surface modulable","accord"],
  // ─── Bureaux Est ───
  ["Bureaux & Clinique",  "services",   0x42A5F5, 1440,130,1540,310,"—","Bureaux et commerces · Clinique médicale","loue"],
];

/* ------------------------------------------------------------------ */
/*  Categories                                                         */
/* ------------------------------------------------------------------ */
interface CatDef { key: string; label: string; icon: React.ElementType; color: string; }

// Catégories métier — couleurs sémantiques fixes intentionnelles (identité visuelle des catégories)
const CATEGORIES: CatDef[] = [
  { key: 'all',          label: 'Toutes',                 icon: Building2,    color: '#6B7280' },
  { key: 'supermarche',  label: 'Supermarché',            icon: ShoppingBag,  color: '#D4A520' },
  { key: 'mode',         label: 'Mode & Chaussures',      icon: ShoppingBag,  color: '#C2185B' },
  { key: 'restaurant',   label: 'Restaurant',             icon: Utensils,     color: '#E53935' },
  { key: 'boutique',     label: 'Boutique Galerie',       icon: Watch,        color: '#78909C' },
  { key: 'loisirs',      label: 'Loisirs & Jeux',         icon: Gamepad2,     color: '#7B1FA2' },
  { key: 'services',     label: 'Services & Big Box',     icon: Warehouse,    color: '#42A5F5' },
  { key: 'beaute',       label: 'Beauté & Santé',         icon: Pill,         color: '#F48FB1' },
  { key: 'market',       label: 'Market & Artisanat',     icon: Sparkles,     color: '#FF7043' },
  { key: 'hotel',        label: 'Hôtel',                  icon: Hotel,        color: '#2E7D32' },
];

/* ------------------------------------------------------------------ */
/*  Journey                                                            */
/* ------------------------------------------------------------------ */
interface JourneyStep { n: string; d: string; px: number; py: number; }

const JOURNEY: JourneyStep[] = [
  {n:"Arrivée Parking",d:"325 places surface + 100 souterrain", px:540,py:1280},
  {n:"Entrée Sud",d:"Entrées 1-4 · Façade iconique", px:350,py:1100},
  {n:"Galerie Mode Ouest",d:"Zino · Lacoste · Jules · Oïmo Shoes", px:170,py:850},
  {n:"Galerie Centrale",d:"Boutiques C5-C11 · Services", px:400,py:510},
  {n:"Carrefour Market",d:"2 211m² · Ancre alimentaire", px:340,py:300},
  {n:"Kiabi & Mode Nord",d:"648m² mode famille", px:1200,py:220},
  {n:"Craft Market",d:"456m² artisanat · Produits locaux", px:1350,py:350},
  {n:"Bonus & Services",d:"300m² multiservice · C15-C16", px:920,py:380},
  {n:"La Halle Gourmande & Terrasses",d:"T1-T2-T3 · Destination food", px:1100,py:510},
  {n:"City Sport & Aldo",d:"Sport · Chaussures premium", px:1020,py:500},
  {n:"Dreamland",d:"1 125m² loisirs enfants", px:860,py:670},
  {n:"Zone d'Expo",d:"Pop-up stores · Animations", px:550,py:680},
  {n:"Sports Bar",d:"200m² · Terrasse · Convivialité", px:635,py:890},
  {n:"ibis / Adagio",d:"Hôtel ★★★ · Business & tourisme", px:1020,py:1000},
  {n:"Sortie & Fidélisation",d:"Programme fidélité · À bientôt", px:540,py:1200},
];

/* ================================================================== */
/*  Three.js helpers                                                   */
/* ================================================================== */

function makeSprite(text: string, color: number, canvasW: number, fontSize: number): THREE.Sprite {
  const c = document.createElement('canvas');
  c.width = canvasW; c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.font = `600 ${fontSize}px Inter, sans-serif`;
  ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvasW / 2, 64);
  const tex = new THREE.CanvasTexture(c);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  return new THREE.Sprite(mat);
}

function makePinTexture(color: number): THREE.CanvasTexture {
  const sz = 128;
  const c = document.createElement('canvas');
  c.width = sz; c.height = sz;
  const ctx = c.getContext('2d')!;
  const hex = '#' + color.toString(16).padStart(6, '0');
  // Shadow
  ctx.beginPath();
  ctx.ellipse(sz / 2, sz * 0.92, sz * 0.18, sz * 0.05, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(10, 27, 46, 0.2)'; // canvas overlay — bleu nuit semi-transparent
  ctx.fill();
  // Pin body (teardrop)
  ctx.beginPath();
  ctx.moveTo(sz / 2, sz * 0.82);
  ctx.bezierCurveTo(sz / 2 - 3, sz * 0.55, sz * 0.18, sz * 0.38, sz * 0.18, sz * 0.28);
  ctx.arc(sz / 2, sz * 0.28, sz * 0.32, Math.PI, 0, false);
  ctx.bezierCurveTo(sz * 0.82, sz * 0.38, sz / 2 + 3, sz * 0.55, sz / 2, sz * 0.82);
  ctx.closePath();
  ctx.fillStyle = hex;
  ctx.fill();
  ctx.strokeStyle = 'rgba(10, 27, 46, 0.25)'; // canvas overlay — bleu nuit semi-transparent
  ctx.lineWidth = 2;
  ctx.stroke();
  // White dot
  ctx.beginPath();
  ctx.arc(sz / 2, sz * 0.28, sz * 0.11, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  return new THREE.CanvasTexture(c);
}

function animCam(
  camera: THREE.PerspectiveCamera, controls: OrbitControls,
  pos: { x: number; y: number; z: number },
  tgt: { x: number; y: number; z: number },
  dur = 1000,
) {
  const s = {
    x: camera.position.x, y: camera.position.y, z: camera.position.z,
    tx: controls.target.x, ty: controls.target.y, tz: controls.target.z,
  };
  const t0 = performance.now();
  (function up() {
    const t = Math.min((performance.now() - t0) / dur, 1);
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    camera.position.set(s.x + (pos.x - s.x) * e, s.y + (pos.y - s.y) * e, s.z + (pos.z - s.z) * e);
    controls.target.set(s.tx + (tgt.x - s.tx) * e, s.ty + (tgt.y - s.ty) * e, s.tz + (tgt.z - s.tz) * e);
    if (t < 1) requestAnimationFrame(up);
  })();
}

/* ================================================================== */
/*  Scene Ref type                                                     */
/* ================================================================== */

interface SceneRef {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  blocks: THREE.Sprite[];     // store pin sprites (for raycasting)
  journeyLine: THREE.Mesh;
  journeyDots: THREE.Group[];
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  hovered: THREE.Sprite | null;
  animId: number;
}

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */

const InteractiveMapPage: React.FC = () => {
  const { t } = useTranslation();
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneRef | null>(null);

  const [loading, setLoading] = useState(true);
  const [journeyOn, setJourneyOn] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [storeInfo, setStoreInfo] = useState<{ cat: string; name: string; area: string; desc: string; status: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLegend, setShowLegend] = useState(true);

  /* ──────── Derived store list ──────── */
  const storeList = useMemo(() => {
    return STORE_DATA.map((sd, i) => ({
      idx: i, name: sd[0], cat: sd[1], area: sd[7], desc: sd[8],
      color: sd[2], status: sd[9],
    })).filter(s => {
      const matchSearch = !searchTerm || s.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCat === 'all' || s.cat === selectedCat;
      return matchSearch && matchCat;
    });
  }, [searchTerm, selectedCat]);

  /* ──────── Highlight filtered stores in 3D ──────── */
  useEffect(() => {
    const ref = sceneRef.current;
    if (!ref) return;
    const filteredIndices = new Set(storeList.map(s => s.idx));
    ref.blocks.forEach((b, i) => {
      b.visible = filteredIndices.has(i);
    });
  }, [storeList]);

  /* ──────── Focus store in 3D ──────── */
  const focusStore = useCallback((idx: number) => {
    const ref = sceneRef.current;
    if (!ref) return;
    const sd = STORE_DATA[idx];
    const px1 = sd[3], py1 = sd[4], px2 = sd[5], py2 = sd[6];
    const cx = mapX((px1 + px2) / 2);
    const cz = mapZ((py1 + py2) / 2);
    animCam(ref.camera, ref.controls, { x: cx - 8, y: 18, z: cz + 12 }, { x: cx, y: 0, z: cz }, 800);

    // Highlight: enlarge selected pin, dim others
    ref.blocks.forEach((b, i) => {
      const bs = b.userData.baseScale || 1.8;
      if (i === idx) {
        b.scale.set(bs * 1.5, bs * 1.5 * 1.28, 1);
        (b.material).opacity = 1;
      } else {
        b.scale.set(bs, bs * 1.28, 1);
        (b.material).opacity = 0.4;
      }
    });

    setStoreInfo({ cat: sd[1], name: sd[0], area: sd[7], desc: sd[8], status: sd[9] });
  }, []);

  /* ──────── Init Three.js ──────── */
  const initScene = useCallback(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = null;

    const aspect0 = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, aspect0, 0.1, 500);
    // Compute initial distance so the full plan fits in view
    const fovRad = camera.fov * Math.PI / 180;
    let initDist = (PH / 2) / Math.tan(fovRad / 2);
    if (PW / PH > aspect0) {
      initDist = (PW / 2) / (aspect0 * Math.tan(fovRad / 2));
    }
    initDist *= 1.1;
    // Center camera on mall area (calibrated store span)
    const MALL_CX = 39, MALL_CZ = 35;
    camera.position.set(MALL_CX, initDist * 0.72, MALL_CZ + initDist * 0.45);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 10;
    controls.maxDistance = 180;
    controls.target.set(MALL_CX, 0, MALL_CZ);
    controls.enablePan = true;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-9, -9);
    const blocks: THREE.Sprite[] = [];

    // Lights — brighter for light theme
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    scene.add(new THREE.HemisphereLight(0xffffff, 0xE8E0D4, 0.5));
    const sun = new THREE.DirectionalLight(0xffffff, 0.6);
    sun.position.set(80, 100, -40);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    const sc = sun.shadow.camera;
    sc.left = -80; sc.right = 80; sc.top = 80; sc.bottom = -80;
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xffffff, 0.3);
    fill.position.set(-40, 50, 80);
    scene.add(fill);

    // Plan texture
    new THREE.TextureLoader().load(
      '/plan-cosmos.png',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const geo = new THREE.PlaneGeometry(PW, PH);
        const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, metalness: 0.0 });
        const floor = new THREE.Mesh(geo, mat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(PW / 2, 0, PH / 2);
        floor.receiveShadow = true;
        scene.add(floor);
        setTimeout(() => setLoading(false), 400);
      },
      undefined,
      () => {
        const geo = new THREE.PlaneGeometry(PW, PH);
        const mat = new THREE.MeshStandardMaterial({ color: 0x2a2a30, roughness: 0.8 });
        const floor = new THREE.Mesh(geo, mat);
        floor.rotation.x = -Math.PI / 2;
        floor.position.set(PW / 2, 0, PH / 2);
        scene.add(floor);
        setTimeout(() => setLoading(false), 400);
      },
    );

    // Store pins
    const pinCache = new Map<number, THREE.CanvasTexture>();
    STORE_DATA.forEach(sd => {
      const [name, , color, px1, py1, px2, py2, area, desc] = sd;
      const cat = sd[1];
      const cx = mapX(((px1) + (px2)) / 2);
      const cz = mapZ(((py1) + (py2)) / 2);
      const status = sd[9];

      // Pin sprite
      let pinTex = pinCache.get(color);
      if (!pinTex) { pinTex = makePinTexture(color); pinCache.set(color, pinTex); }
      const pinMat = new THREE.SpriteMaterial({ map: pinTex, transparent: true, depthTest: false, sizeAttenuation: true });
      const pin = new THREE.Sprite(pinMat);
      pin.center.set(0.5, 0.18);
      pin.position.set(cx, 0.1, cz);
      pin.scale.set(1.8, 2.3, 1);
      pin.userData = { name, cat, area, desc, color, status, baseScale: 1.8 };
      scene.add(pin);
      blocks.push(pin);

      // Store delimitation rectangle (border + light fill)
      const x1w = mapX(px1), z1w = mapZ(py1);
      const x2w = mapX(px2), z2w = mapZ(py2);
      const rw = x2w - x1w, rh = z2w - z1w;
      const rcx = (x1w + x2w) / 2, rcz = (z1w + z2w) / 2;

      // Semi-transparent fill
      const fillGeo = new THREE.PlaneGeometry(rw, rh);
      const hexColor = color;
      const fillMat = new THREE.MeshBasicMaterial({
        color: hexColor, transparent: true, opacity: 0.12,
        side: THREE.DoubleSide, depthWrite: false,
      });
      const fill = new THREE.Mesh(fillGeo, fillMat);
      fill.rotation.x = -Math.PI / 2;
      fill.position.set(rcx, 0.04, rcz);
      scene.add(fill);

      // Border outline
      const borderVerts = new Float32Array([
        x1w, 0.06, z1w,  x2w, 0.06, z1w,
        x2w, 0.06, z2w,  x1w, 0.06, z2w,
        x1w, 0.06, z1w,
      ]);
      const borderGeo = new THREE.BufferGeometry();
      borderGeo.setAttribute('position', new THREE.BufferAttribute(borderVerts, 3));
      const borderMat = new THREE.LineBasicMaterial({ color: hexColor, transparent: true, opacity: 0.6 });
      const border = new THREE.Line(borderGeo, borderMat);
      scene.add(border);

      // Label: brand name if rented, lot number if vacant
      const labelText = (name);
      const label = makeSprite(labelText, 0x1a1a2e, 1024, 24);
      label.position.set(rcx, 0.15, rcz);
      const labelW = Math.max(rw * 1.2, 3);
      label.scale.set(labelW, labelW * 0.12, 1);
      label.renderOrder = 1;
      scene.add(label);
    });

    // Journey
    const jPts = JOURNEY.map(j => new THREE.Vector3(mapX(j.px), 0.25, mapZ(j.py)));
    const curve = new THREE.CatmullRomCurve3(jPts, false, 'catmullrom', 0.25);
    const tubeGeo = new THREE.TubeGeometry(curve, 300, 0.15, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0xC9943A, transparent: true, opacity: 0.8 });
    const journeyLine = new THREE.Mesh(tubeGeo, tubeMat);
    journeyLine.visible = false;
    scene.add(journeyLine);

    const journeyDots: THREE.Group[] = [];
    JOURNEY.forEach((j, i) => {
      const group = new THREE.Group();
      group.position.set(mapX(j.px), 0.05, mapZ(j.py));

      const rGeo = new THREE.RingGeometry(0.55, 0.75, 24);
      const rMat = new THREE.MeshBasicMaterial({ color: 0xC9943A, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(rGeo, rMat);
      ring.rotation.x = -Math.PI / 2;
      group.add(ring);

      const dGeo = new THREE.CircleGeometry(0.45, 24);
      const dMat = new THREE.MeshBasicMaterial({ color: 0xC9943A, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
      const dot = new THREE.Mesh(dGeo, dMat);
      dot.rotation.x = -Math.PI / 2;
      dot.position.y = 0.01;
      group.add(dot);

      const bGeo = new THREE.CylinderGeometry(0.06, 0.06, 4, 8);
      const bMat = new THREE.MeshBasicMaterial({ color: 0xC9943A, transparent: true, opacity: 0.25 });
      const beam = new THREE.Mesh(bGeo, bMat);
      beam.position.y = 2;
      group.add(beam);

      const numSprite = makeSprite(String(i + 1), 0xC9943A, 512, 48);
      numSprite.position.y = 4.5;
      numSprite.scale.set(2, 0.5, 1);
      group.add(numSprite);

      const nameSprite = makeSprite(j.n, 0x1a1a2e, 1024, 32);
      nameSprite.position.y = 5.5;
      nameSprite.scale.set(4, 0.5, 1);
      group.add(nameSprite);

      group.visible = false;
      scene.add(group);
      journeyDots.push(group);
    });

    sceneRef.current = { scene, camera, renderer, controls, blocks, journeyLine, journeyDots, raycaster, mouse, hovered: null, animId: 0 };

    // Animate
    function animate() {
      const ref = sceneRef.current;
      if (!ref) return;
      ref.animId = requestAnimationFrame(animate);
      ref.controls.update();
      if (ref.journeyLine?.visible) {
        const t = performance.now() * 0.003;
        ref.journeyDots.forEach((g, i) => {
          g.children.forEach(c => {
            if ((c as THREE.Mesh).geometry?.type === 'RingGeometry') {
              c.scale.setScalar(1 + Math.sin(t + i * 0.4) * 0.15);
              ((c as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(t + i * 0.4) * 0.2;
            }
          });
        });
      }
      ref.renderer.render(ref.scene, ref.camera);
    }
    animate();

    // Mouse
    const onMove = (e: MouseEvent) => {
      const ref = sceneRef.current;
      if (!ref) return;
      const rect = ref.renderer.domElement.getBoundingClientRect();
      ref.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ref.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      ref.raycaster.setFromCamera(ref.mouse, ref.camera);
      const hits = ref.raycaster.intersectObjects(ref.blocks);
      if (ref.hovered) {
        const bs = ref.hovered.userData.baseScale || 1.8;
        ref.hovered.scale.set(bs, bs * 1.28, 1);
        ref.hovered = null;
      }
      if (hits.length > 0) {
        ref.hovered = hits[0].object as THREE.Sprite;
        const bs2 = ref.hovered.userData.baseScale || 1.8;
        ref.hovered.scale.set(bs2 * 1.3, bs2 * 1.3 * 1.28, 1);
        ref.renderer.domElement.style.cursor = 'pointer';
      } else {
        ref.renderer.domElement.style.cursor = 'default';
      }
    };

    const onClick = () => {
      const ref = sceneRef.current;
      if (!ref?.hovered) { setStoreInfo(null); return; }
      const u = ref.hovered.userData;
      setStoreInfo({ cat: u.cat, name: u.name, area: u.area, desc: u.desc, status: u.status });
    };

    renderer.domElement.addEventListener('mousemove', onMove);
    renderer.domElement.addEventListener('click', onClick);

    // Resize — update aspect & renderer size only (don't move camera)
    const onResize = () => {
      if (!container || !sceneRef.current) return;
      const { camera: cam, renderer: rend } = sceneRef.current;
      cam.aspect = container.clientWidth / container.clientHeight;
      cam.updateProjectionMatrix();
      rend.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ResizeObserver for container size changes
    const ro = new ResizeObserver(() => onResize());
    ro.observe(container);

    return () => {
      window.removeEventListener('resize', onResize);
      ro.disconnect();
      renderer.domElement.removeEventListener('mousemove', onMove);
      renderer.domElement.removeEventListener('click', onClick);
      cancelAnimationFrame(sceneRef.current?.animId ?? 0);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => { const cleanup = initScene(); return cleanup; }, [initScene]);

  /* ──────── Actions ──────── */
  const toggleJourney = useCallback(() => {
    setJourneyOn(prev => {
      const next = !prev;
      const ref = sceneRef.current;
      if (ref) {
        ref.journeyLine.visible = next;
        ref.journeyDots.forEach(d => { d.visible = next; });
      }
      if (!next) setActiveStep(-1);
      return next;
    });
  }, []);

  const goStep = useCallback((i: number) => {
    setActiveStep(i);
    const ref = sceneRef.current;
    if (!ref) return;
    const j = JOURNEY[i];
    const cx = mapX(j.px), cz = mapZ(j.py);
    animCam(ref.camera, ref.controls, { x: cx - 12, y: 22, z: cz + 15 }, { x: cx, y: 1, z: cz }, 900);
    ref.blocks.forEach(b => {
      const dx = b.position.x - cx, dz = b.position.z - cz;
      const near = Math.sqrt(dx * dx + dz * dz) < 12; (b.material).opacity = near ? 1 : 0.3;
    });
  }, []);

  const viewTop = () => { const r = sceneRef.current; if (r) animCam(r.camera, r.controls, { x: PW / 2, y: 90, z: PH / 2 + 1 }, { x: PW / 2, y: 0, z: PH / 2 }); };
  const viewPersp = () => { const r = sceneRef.current; if (r) animCam(r.camera, r.controls, { x: -10, y: 50, z: 95 }, { x: PW / 2, y: 0, z: PH / 2 - 5 }); };
  const viewFront = () => { const r = sceneRef.current; if (r) animCam(r.camera, r.controls, { x: PW / 2, y: 25, z: -20 }, { x: PW / 2, y: 2, z: PH / 2 }); };
  const viewSide = () => { const r = sceneRef.current; if (r) animCam(r.camera, r.controls, { x: PW + 30, y: 30, z: PH / 2 }, { x: PW / 2, y: 0, z: PH / 2 }); };

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCat('all');
    setStoreInfo(null);
    const ref = sceneRef.current;
    if (ref) {
      ref.blocks.forEach(b => { const bs = b.userData.baseScale || 2.5; b.scale.set(bs, bs * 1.28, 1); (b.material).opacity = 1; b.visible = true; });
      animCam(ref.camera, ref.controls, { x: 60, y: 80, z: 110 }, { x: PW / 2, y: 0, z: PH / 2 });
    }
  }, []);

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="bg-cosmos-warm h-screen flex flex-col overflow-hidden">
      <Seo
        title="Plan interactif"
        description="Parcourez Cosmos Angré en 3D : repérez boutiques, restaurants, parkings et services grâce au plan interactif du complexe à Cocody-Angré."
        keywords={['plan interactif', 'plan 3D Cosmos Angré', 'boutiques', 'parking Cocody', 'centre commercial Abidjan']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Plan interactif', url: '/plan-interactif' },
        ])}
      />

      {/* ═══════════ Hero ═══════════ */}
      <section className="relative py-2 bg-cosmos-night flex-shrink-0">
        <div className="px-4 relative z-10 flex items-center justify-center gap-3">
          <h1 className="font-cormorant text-xl text-cosmos-cream font-light">
            {t('interactiveMap.hero.title', 'Plan Interactif')}
          </h1>
          <span className="text-[10px] text-cosmos-cream/40 font-inter font-light">—</span>
          <p className="text-[11px] text-cosmos-cream/50 font-inter font-light">
            {t('interactiveMap.hero.subtitle', 'Explorez le complexe Cosmos Angré')}
          </p>
        </div>
      </section>

      {/* ═══════════ Main Content ═══════════ */}
      <section className="flex-1 min-h-0 py-1">
        <div className="px-1 md:px-2 lg:px-3 mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-1.5 h-full">

            {/* ────── Sidebar ────── */}
            <div className={`overflow-y-auto space-y-1.5 ${sidebarOpen ? 'block' : 'hidden lg:flex lg:flex-col'}`}>

              {/* Search */}
              <div className="card p-3 border border-cosmos-cream">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cosmos-night/30" strokeWidth={1.5} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Rechercher..."
                    className="input pl-8 text-[11px] py-1.5"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="card p-3 border border-cosmos-cream">
                <div className="flex flex-wrap gap-1">
                  {CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => setSelectedCat(cat.key)}
                        className={`flex items-center gap-1 px-2 py-1 rounded transition-all text-[10px] font-inter ${
                          selectedCat === cat.key
                            ? 'bg-cosmos-night text-cosmos-cream'
                            : 'text-cosmos-night/60 hover:bg-cosmos-night/5'
                        }`}
                      >
                        <Icon className="w-3 h-3 flex-shrink-0" strokeWidth={1.5} />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-cosmos-night/5">
                  <span className="text-[10px] text-cosmos-night/40 font-inter">{storeList.length}/{STORE_DATA.length}</span>
                  {(searchTerm || selectedCat !== 'all') && (
                    <button onClick={resetFilters} className="text-[10px] text-cosmos-gold hover:text-cosmos-gold/80 font-inter font-medium transition-colors">
                      Réinitialiser
                    </button>
                  )}
                </div>
              </div>

              {/* Store List */}
              <div className="card p-3 border border-cosmos-cream flex-1 min-h-0 flex flex-col">
                <div className="space-y-0.5 overflow-y-auto flex-1">
                  {storeList.map(store => (
                    <button
                      key={store.idx}
                      onClick={() => focusStore(store.idx)}
                      className={`w-full text-left px-2 py-1.5 rounded transition-all text-[10px] font-inter ${
                        storeInfo?.name === store.name
                          ? 'bg-cosmos-night text-cosmos-cream'
                          : 'hover:bg-cosmos-night/5 text-cosmos-night/70'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#' + store.color.toString(16).padStart(6, '0') }} />
                        <span className="truncate flex-1">{store.name}</span>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${store.status === 'loue' ? 'bg-emerald-500' : store.status === 'accord' ? 'bg-amber-500' : 'bg-cosmos-text/30'}`} />
                      </div>
                    </button>
                  ))}
                  {storeList.length === 0 && (
                    <p className="text-[10px] text-cosmos-night/40 font-inter text-center py-4">Aucune boutique trouvée</p>
                  )}
                </div>
              </div>

              {/* Journey panel (inside sidebar on desktop) */}
              {journeyOn && (
                <div className="card p-5 border border-cosmos-gold/20 bg-cosmos-night">
                  <h3 className="text-[11px] font-inter font-medium text-cosmos-gold mb-3 uppercase tracking-[0.12em]">
                    Parcours du consommateur
                  </h3>
                  <div className="space-y-1 max-h-72 overflow-y-auto">
                    {JOURNEY.map((j, i) => (
                      <button
                        key={i}
                        onClick={() => goStep(i)}
                        className={`flex gap-2 w-full text-left p-2 rounded transition-colors ${
                          activeStep === i ? 'bg-cosmos-gold/10' : 'hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="w-5 h-5 rounded-full bg-cosmos-gold/15 border border-cosmos-gold/35 flex items-center justify-center text-[9px] font-semibold text-cosmos-gold flex-shrink-0">
                          {i + 1}
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-cosmos-cream/80">{j.n}</div>
                          <div className="text-[9px] text-cosmos-cream/35 leading-[1.4] mt-0.5">{j.d}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ────── Map Area ────── */}
            <div className="flex flex-col gap-1 min-h-0">

              {/* Mobile sidebar toggle */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden card p-2 border border-cosmos-cream w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-cosmos-gold" strokeWidth={1.5} />
                  <span className="text-[11px] font-inter font-medium text-cosmos-night">Filtres & Boutiques</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-cosmos-night/40 transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} strokeWidth={1.5} />
              </button>

              {/* Controls bar */}
              <div className="card px-3 py-1.5 border border-cosmos-cream flex-shrink-0">
                <div className="flex items-center justify-between flex-wrap gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cosmos-gold" strokeWidth={1.5} />
                    <span className="text-[10px] font-inter font-medium text-cosmos-night uppercase tracking-[0.1em]">
                      Plan 3D
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap">
                    {[
                      { label: 'Dessus', fn: viewTop },
                      { label: 'Perspective', fn: viewPersp },
                      { label: 'Nord', fn: viewFront },
                      { label: 'Est', fn: viewSide },
                    ].map(v => (
                      <button
                        key={v.label}
                        onClick={v.fn}
                        className="px-2 py-1 rounded border border-cosmos-night/10 text-[9px] font-inter font-medium text-cosmos-night/50 hover:border-cosmos-night/30 hover:text-cosmos-night transition-all"
                      >
                        {v.label}
                      </button>
                    ))}
                    <div className="w-px h-5 bg-cosmos-night/10 mx-0.5" />
                    <button
                      onClick={toggleJourney}
                      className={`px-2 py-1 rounded border text-[9px] font-inter font-medium transition-all flex items-center gap-1 ${
                        journeyOn
                          ? 'bg-cosmos-gold/10 border-cosmos-gold/30 text-cosmos-gold'
                          : 'border-cosmos-night/10 text-cosmos-night/50 hover:border-cosmos-gold/30 hover:text-cosmos-gold'
                      }`}
                    >
                      <Route className="w-3 h-3" strokeWidth={1.5} />
                      Parcours
                    </button>
                    <button onClick={resetFilters} className="p-1 rounded border border-cosmos-night/10 text-cosmos-night/40 hover:border-cosmos-night/30 transition-all" title="Réinitialiser">
                      <Maximize2 className="w-3 h-3" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>

              {/* 3D Canvas */}
              <div className="rounded-lg overflow-hidden relative bg-transparent flex-1 min-h-0">
                {/* Loading overlay */}
                {loading && (
                  <div className="absolute inset-0 z-10 bg-cosmos-warm flex flex-col items-center justify-center">
                    <div className="font-cormorant text-2xl font-light text-cosmos-night/80 mb-1">Cosmos Angré</div>
                    <div className="text-[10px] text-cosmos-night/25 tracking-[0.1em]">Chargement du plan 3D...</div>
                  </div>
                )}
                <div
                  ref={mountRef}
                  className="w-full h-full"
                />
                {/* Store Detail Overlay */}
                {storeInfo && (
                  <div className="absolute bottom-4 right-4 z-20 w-80 bg-cosmos-warm/95 backdrop-blur-sm rounded-lg shadow-lg p-5 border border-cosmos-cream animate-fade-in">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase tracking-[0.12em] text-cosmos-night/35 font-inter font-medium">
                            {CATEGORIES.find(c => c.key === storeInfo.cat)?.label ?? storeInfo.cat}
                          </span>
                          <span className={`text-[9px] font-inter font-medium px-2 py-0.5 rounded-full ${
                            storeInfo.status === 'loue' ? 'bg-emerald-100 text-emerald-700' :
                            storeInfo.status === 'accord' ? 'bg-amber-100 text-amber-700' :
                            'bg-cosmos-cream text-cosmos-text/60'
                          }`}>
                            {storeInfo.status === 'loue' ? 'Loue' : storeInfo.status === 'accord' ? 'Accord de principe' : 'Libre'}
                          </span>
                        </div>
                        <h3 className="font-cormorant text-xl text-cosmos-night font-light mb-1">{storeInfo.name}</h3>
                        <div className="text-xs text-cosmos-gold font-inter">{storeInfo.area}</div>
                      </div>
                      <button onClick={() => setStoreInfo(null)} className="p-1 rounded hover:bg-cosmos-night/5 transition-colors">
                        <X className="w-4 h-4 text-cosmos-night/30" strokeWidth={1.5} />
                      </button>
                    </div>
                    <p className="text-xs text-cosmos-night/60 font-inter font-light leading-relaxed">{storeInfo.desc}</p>
                  </div>
                )}
                {/* Legend Overlay */}
                <div className="absolute top-3 right-3 z-20">
                  <button
                    onClick={() => setShowLegend(v => !v)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-cosmos-warm/90 backdrop-blur-sm rounded-lg shadow-sm border border-cosmos-cream text-[10px] font-inter font-medium text-cosmos-night/60 hover:text-cosmos-night transition-colors"
                  >
                    <Info className="w-3 h-3" strokeWidth={1.5} />
                    {showLegend ? 'Masquer légende' : 'Afficher légende'}
                  </button>
                  {showLegend && (
                    <div className="mt-2 bg-cosmos-warm/95 backdrop-blur-sm rounded-lg shadow-lg border border-cosmos-cream p-4 w-64 animate-fade-in">
                      <h4 className="text-[10px] font-inter font-medium text-cosmos-night mb-2.5 uppercase tracking-[0.12em]">Catégories</h4>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-3">
                        {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
                          <div key={cat.key} className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: cat.color }} />
                            <span className="text-[9px] font-inter font-light text-cosmos-night/70">{cat.label}</span>
                          </div>
                        ))}
                      </div>
                      <div className="h-px bg-cosmos-night/5 mb-3" />
                      <h4 className="text-[10px] font-inter font-medium text-cosmos-night mb-2.5 uppercase tracking-[0.12em]">Statut des locaux</h4>
                      <div className="space-y-1.5">
                        {[
                          { label: 'Loué', color: 'bg-emerald-500', count: STORE_DATA.filter(s => s[9] === 'loue').length },
                          { label: 'Accord de principe', color: 'bg-amber-500', count: STORE_DATA.filter(s => s[9] === 'accord').length },
                          { label: 'Libre / Disponible', color: 'bg-cosmos-text/30', count: STORE_DATA.filter(s => s[9] === 'libre').length },
                        ].map(s => (
                          <div key={s.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-2.5 h-2.5 rounded-sm ${s.color}`} />
                              <span className="text-[9px] font-inter font-light text-cosmos-night/70">{s.label}</span>
                            </div>
                            <span className="text-[10px] font-inter font-medium text-cosmos-night">{s.count}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between pt-1 border-t border-cosmos-night/5">
                          <span className="text-[9px] font-inter font-light text-cosmos-night/50">Total</span>
                          <span className="text-[10px] font-inter font-medium text-cosmos-night">{STORE_DATA.length}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Inline hint */}
                <div className="absolute bottom-3 left-3 text-[9px] text-cosmos-night/30 font-inter pointer-events-none">
                  Clic gauche : tourner · Molette : zoom · Clic droit : déplacer
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InteractiveMapPage;
