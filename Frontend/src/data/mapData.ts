/**
 * Cosmos Angré — Interactive Map Data
 * Faithfully reconstructed from the official commercial plan PDF (09/02/2026)
 * PDF page: 1191 × 842 — SVG viewBox: 0 0 960 680 (scale ≈ 0.807)
 *
 * Coordinate system: PDF coord × 0.807 ≈ SVG coord
 */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface MapStoreUnit {
  id: string;
  code: string;
  name: string;
  zone: string;
  category: string;
  surface: number;
  x: number;
  y: number;
  w: number;
  h: number;
  status?: 'loue' | 'accord' | 'libre';
}

export interface MapZoneRect {
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
}

export interface MapZone {
  key: string;
  labelFr: string;
  fill: string;
  stroke: string;
  textColor: string;
  rects: MapZoneRect[];
  labelPos?: { x: number; y: number };
}

export interface MapAmenity {
  id: string;
  type:
    | 'entrance'
    | 'entrance-employee'
    | 'depose-minute'
    | 'elevator'
    | 'escalator'
    | 'travelator'
    | 'toilet'
    | 'atm'
    | 'stairs'
    | 'livraison';
  label: string;
  x: number;
  y: number;
  number?: number;
}

export interface MapCategory {
  key: string;
  labelFr: string;
  color: string;
}

/* ------------------------------------------------------------------ */
/*  Scale helper — PDF 1191×842 → SVG 960×680                        */
/* ------------------------------------------------------------------ */
const sx = (v: number) => Math.round(v * 0.807);
const sy = (v: number) => Math.round(v * 0.808);
const sw = sx;
const sh = sy;

/* ------------------------------------------------------------------ */
/*  Categories (from official legend)                                  */
/* ------------------------------------------------------------------ */
export const MAP_CATEGORIES: MapCategory[] = [
  { key: 'all', labelFr: 'Toutes', color: '#6B7280' },
  { key: 'supermarche', labelFr: 'Supermarché', color: '#16A34A' },
  { key: 'modes', labelFr: 'Modes', color: '#7C3AED' },
  { key: 'restaurant', labelFr: 'Restaurant', color: '#E11D48' },
  { key: 'accessoires', labelFr: 'Accessoires', color: '#0891B2' },
  { key: 'banqueAssurance', labelFr: 'Banque & Assurance', color: '#1D4ED8' },
  { key: 'multimedia', labelFr: 'Multimédia', color: '#059669' },
  { key: 'services', labelFr: 'Services', color: '#6366F1' },
  { key: 'cadeauxAlim', labelFr: 'Cadeaux & Alimentaires', color: '#CA8A04' },
  { key: 'beaute', labelFr: 'Beauté & Santé', color: '#DB2777' },
  { key: 'shoes', labelFr: 'Chaussures', color: '#92400E' },
  { key: 'loisirs', labelFr: 'Loisirs & Jeux', color: '#EA580C' },
  { key: 'bigBox', labelFr: 'Big Box', color: '#7C3AED' },
  { key: 'pharmacie', labelFr: 'Pharmacie', color: '#16A34A' },
  { key: 'hotel', labelFr: 'Hôtel', color: '#4338CA' },
];

/* ------------------------------------------------------------------ */
/*  Zone background shapes (from PDF zone rectangles)                  */
/* ------------------------------------------------------------------ */
export const MAP_ZONES: MapZone[] = [
  // ── Galerie Commerciale — L-shape (top bar + left wing) ──
  {
    key: 'galerie',
    labelFr: 'Galerie Commerciale',
    fill: 'rgba(120,191,140,0.22)',
    stroke: 'rgba(120,191,140,0.55)',
    textColor: '#3D7A50',
    rects: [
      // Top bar (Carrefour → 552m² column)
      { x: sx(122), y: sy(114), w: sw(363), h: sh(140), rx: 4 },
      // 552m² column
      { x: sx(418), y: sy(115), w: sw(67), h: sh(139), rx: 4 },
      // Below 552m² — services court
      { x: sx(122), y: sy(114), w: sw(67), h: sh(245), rx: 4 },
      // Left wing going down (stores column)
      { x: sx(122), y: sy(356), w: sw(72), h: sh(268), rx: 4 },
      // Secondary left stores
      { x: sx(196), y: sy(356), w: sw(110), h: sh(170), rx: 4 },
      // Center corridor stores row
      { x: sx(220), y: sy(279), w: sw(450), h: sh(70), rx: 4 },
      // Lower left area (Zino, C27, C29...)
      { x: sx(122), y: sy(537), w: sw(240), h: sh(90), rx: 4 },
    ],
    labelPos: { x: sx(240), y: sy(100) },
  },

  // ── Supermarché (Carrefour Market) ──
  {
    key: 'supermarche',
    labelFr: 'Carrefour Market',
    fill: 'rgba(34,197,94,0.18)',
    stroke: '#16A34A',
    textColor: '#166534',
    rects: [{ x: sx(140), y: sy(125), w: sw(230), h: sh(120), rx: 4 }],
    labelPos: { x: sx(255), y: sy(185) },
  },

  // ── KIABI zone ──
  {
    key: 'kiabi',
    labelFr: 'KIABI',
    fill: 'rgba(120,191,140,0.22)',
    stroke: 'rgba(120,191,140,0.55)',
    textColor: '#3D7A50',
    rects: [
      { x: sx(616), y: sy(115), w: sw(130), h: sh(84), rx: 4 },
      { x: sx(616), y: sy(199), w: sw(113), h: sh(55), rx: 4 },
    ],
  },

  // ── Craft Market ──
  {
    key: 'craftMarket',
    labelFr: 'Craft Market',
    fill: 'rgba(52,211,153,0.20)',
    stroke: '#059669',
    textColor: '#047857',
    rects: [{ x: sx(760), y: sy(195), w: sw(95), h: sh(140), rx: 4 }],
    labelPos: { x: sx(808), y: sy(220) },
  },

  // ── Restaurants (T1, T2, T3 area) ──
  {
    key: 'restaurants',
    labelFr: 'Restaurants',
    fill: 'rgba(244,114,182,0.18)',
    stroke: '#E11D48',
    textColor: '#BE123C',
    rects: [{ x: sx(710), y: sy(276), w: sw(122), h: sh(68), rx: 4 }],
    labelPos: { x: sx(771), y: sy(292) },
  },

  // ── Food Court ──
  {
    key: 'foodCourt',
    labelFr: 'Food Court',
    fill: 'rgba(251,146,60,0.16)',
    stroke: '#EA580C',
    textColor: '#C2410C',
    rects: [{ x: sx(250), y: sy(418), w: sw(80), h: sh(100), rx: 4 }],
    labelPos: { x: sx(290), y: sy(435) },
  },

  // ── DREAMLAND (Loisirs & Jeux) — large purple block ──
  {
    key: 'dreamland',
    labelFr: 'DREAMLAND',
    fill: 'rgba(134,59,143,0.22)',
    stroke: 'rgba(134,59,143,0.6)',
    textColor: '#FFFFFF',
    rects: [{ x: sx(480), y: sy(365), w: sw(158), h: sh(130), rx: 4 }],
    labelPos: { x: sx(560), y: sy(415) },
  },

  // ── BIG BOX 3 ──
  {
    key: 'bigBox3',
    labelFr: 'BIG BOX 3',
    fill: 'rgba(134,59,143,0.18)',
    stroke: 'rgba(134,59,143,0.5)',
    textColor: '#7C3AED',
    rects: [{ x: sx(655), y: sy(365), w: sw(100), h: sh(130), rx: 4 }],
    labelPos: { x: sx(705), y: sy(425) },
  },

  // ── Zone d'Expo ──
  {
    key: 'zoneExpo',
    labelFr: "Zone d'Expo",
    fill: 'rgba(0,145,69,0.15)',
    stroke: 'rgba(0,145,69,0.45)',
    textColor: '#047857',
    rects: [{ x: sx(415), y: sy(410), w: sw(55), h: sh(55), rx: 4 }],
  },

  // ── BB4 group + Hotels ──
  {
    key: 'bb4Hotels',
    labelFr: 'BB4 & Hôtels',
    fill: 'rgba(17,177,167,0.12)',
    stroke: 'rgba(17,177,167,0.4)',
    textColor: '#0D9488',
    rects: [
      { x: sx(400), y: sy(505), w: sw(148), h: sh(210), rx: 4 },
      { x: sx(400), y: sy(660), w: sw(148), h: sh(60), rx: 4 },
    ],
  },

  // ── Hotels (ibis, Adagio) ──
  {
    key: 'hotels',
    labelFr: 'Hôtels',
    fill: 'rgba(99,102,241,0.12)',
    stroke: '#6366F1',
    textColor: '#4338CA',
    rects: [{ x: sx(560), y: sy(570), w: sw(135), h: sh(80), rx: 4 }],
    labelPos: { x: sx(628), y: sy(600) },
  },

  // ── Parking ──
  {
    key: 'parking',
    labelFr: 'Parking',
    fill: 'rgba(209,213,219,0.30)',
    stroke: '#9CA3AF',
    textColor: '#6B7280',
    rects: [{ x: sx(122), y: sy(680), w: sw(210), h: sh(80), rx: 4 }],
    labelPos: { x: sx(227), y: sy(710) },
  },
];

/* ------------------------------------------------------------------ */
/*  Store units — positioned from PDF text labels & image analysis     */
/* ------------------------------------------------------------------ */
export const MAP_STORES: MapStoreUnit[] = [
  // ══════════════════════════════════════════════════════════════════
  //  ANCHOR STORES (large, named)
  // ══════════════════════════════════════════════════════════════════

  // Carrefour Market — huge, upper-left
  {
    id: 'carrefour',
    code: 'SM',
    name: 'Carrefour Market',
    zone: 'supermarche',
    category: 'supermarche',
    surface: 2211,
    x: sx(145),
    y: sy(130),
    w: sw(220),
    h: sh(110),
  },

  // 552m² store (center column, tall) — likely H&M or similar
  {
    id: 'store-552',
    code: 'C',
    name: '',
    zone: 'galerie',
    category: 'modes',
    surface: 552,
    x: sx(420),
    y: sy(120),
    w: sw(62),
    h: sh(130),
    status: 'loue',
  },

  // KIABI — upper-right, large
  {
    id: 'kiabi',
    code: 'KIABI',
    name: 'KIABI',
    zone: 'kiabi',
    category: 'modes',
    surface: 648,
    x: sx(620),
    y: sy(120),
    w: sw(124),
    h: sh(75),
  },

  // ALDO group — center area
  {
    id: 'aldo',
    code: 'ALDO',
    name: 'ALDOgroup',
    zone: 'galerie',
    category: 'accessoires',
    surface: 222,
    x: sx(584),
    y: sy(280),
    w: sw(80),
    h: sh(65),
  },

  // GÉMO (Shoes) — left column
  {
    id: 'gemo',
    code: 'GÉMO',
    name: 'GÉMO (Shoes)',
    zone: 'galerie',
    category: 'shoes',
    surface: 275,
    x: sx(125),
    y: sy(360),
    w: sw(68),
    h: sh(52),
  },

  // C5 — left column below GÉMO
  {
    id: 'c5',
    code: 'C5',
    name: '',
    zone: 'galerie',
    category: 'modes',
    surface: 143,
    x: sx(125),
    y: sy(445),
    w: sw(68),
    h: sh(38),
  },

  // JULES — left column
  {
    id: 'jules',
    code: 'JULES',
    name: 'JULES',
    zone: 'galerie',
    category: 'modes',
    surface: 140,
    x: sx(125),
    y: sy(487),
    w: sw(68),
    h: sh(35),
  },

  // LACOSTE — left column
  {
    id: 'lacoste',
    code: 'LACOSTE',
    name: 'LACOSTE',
    zone: 'galerie',
    category: 'modes',
    surface: 113,
    x: sx(125),
    y: sy(415),
    w: sw(68),
    h: sh(28),
  },

  // Zino (2 units) — left lower
  {
    id: 'zino1',
    code: 'Zino',
    name: 'Zino',
    zone: 'galerie',
    category: 'modes',
    surface: 193,
    x: sx(125),
    y: sy(540),
    w: sw(40),
    h: sh(38),
  },
  {
    id: 'zino2',
    code: 'Zino',
    name: 'Zino',
    zone: 'galerie',
    category: 'modes',
    surface: 100,
    x: sx(168),
    y: sy(540),
    w: sw(28),
    h: sh(38),
  },

  // 332m² store — bottom-left
  {
    id: 'store-332',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'modes',
    surface: 332,
    x: sx(125),
    y: sy(580),
    w: sw(68),
    h: sh(42),
    status: 'libre',
  },

  // ══════════════════════════════════════════════════════════════════
  //  GALERIE — Top area stores (row near Carrefour)
  // ══════════════════════════════════════════════════════════════════

  // C18, C19 — small stores top-center
  {
    id: 'c18',
    code: 'C18',
    name: '',
    zone: 'galerie',
    category: 'accessoires',
    surface: 62,
    x: sx(538),
    y: sy(120),
    w: sw(30),
    h: sh(30),
  },
  {
    id: 'c19',
    code: 'C19',
    name: '',
    zone: 'galerie',
    category: 'beaute',
    surface: 74,
    x: sx(571),
    y: sy(120),
    w: sw(30),
    h: sh(30),
  },

  // C16, C15 — center column stores
  {
    id: 'c16',
    code: 'C16',
    name: '',
    zone: 'galerie',
    category: 'beaute',
    surface: 70,
    x: sx(488),
    y: sy(175),
    w: sw(30),
    h: sh(28),
  },
  {
    id: 'c15',
    code: 'C15',
    name: '',
    zone: 'galerie',
    category: 'services',
    surface: 107,
    x: sx(488),
    y: sy(220),
    w: sw(30),
    h: sh(30),
  },

  // B10 — two 50m² units
  {
    id: 'b10a',
    code: 'B10',
    name: '',
    zone: 'galerie',
    category: 'cadeauxAlim',
    surface: 50,
    x: sx(353),
    y: sy(232),
    w: sw(32),
    h: sh(22),
  },
  {
    id: 'b10b',
    code: 'B10',
    name: '',
    zone: 'galerie',
    category: 'cadeauxAlim',
    surface: 50,
    x: sx(388),
    y: sy(232),
    w: sw(28),
    h: sh(22),
  },

  // ══════════════════════════════════════════════════════════════════
  //  GALERIE — Middle row (y≈279-347, the big store corridor)
  // ══════════════════════════════════════════════════════════════════

  // Left side stores
  {
    id: 'g01',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'modes',
    surface: 31,
    x: sx(221),
    y: sy(280),
    w: sw(15),
    h: sh(33),
    status: 'libre',
  },
  {
    id: 'g02',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'modes',
    surface: 36,
    x: sx(236),
    y: sy(280),
    w: sw(17),
    h: sh(33),
    status: 'libre',
  },
  {
    id: 'g03',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'accessoires',
    surface: 37,
    x: sx(253),
    y: sy(280),
    w: sw(19),
    h: sh(33),
    status: 'libre',
  },
  {
    id: 'g04',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'modes',
    surface: 34,
    x: sx(272),
    y: sy(280),
    w: sw(16),
    h: sh(33),
    status: 'libre',
  },

  // C8
  {
    id: 'c8',
    code: 'C8',
    name: '',
    zone: 'galerie',
    category: 'multimedia',
    surface: 135,
    x: sx(275),
    y: sy(316),
    w: sw(30),
    h: sh(30),
  },

  // C10
  {
    id: 'c10',
    code: 'C10',
    name: '',
    zone: 'galerie',
    category: 'multimedia',
    surface: 95,
    x: sx(336),
    y: sy(280),
    w: sw(49),
    h: sh(33),
  },

  // C11-C
  {
    id: 'c11c',
    code: 'C11-C',
    name: '',
    zone: 'galerie',
    category: 'services',
    surface: 77,
    x: sx(394),
    y: sy(316),
    w: sw(25),
    h: sh(30),
  },

  // C13-A group (multiple 35m² units)
  {
    id: 'c13a',
    code: 'C13-A',
    name: '',
    zone: 'galerie',
    category: 'cadeauxAlim',
    surface: 35,
    x: sx(435),
    y: sy(280),
    w: sw(16),
    h: sh(26),
  },
  {
    id: 'g05',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'modes',
    surface: 35,
    x: sx(452),
    y: sy(280),
    w: sw(16),
    h: sh(26),
    status: 'libre',
  },
  {
    id: 'g06',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'modes',
    surface: 35,
    x: sx(470),
    y: sy(280),
    w: sw(16),
    h: sh(26),
    status: 'libre',
  },
  {
    id: 'g07',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'beaute',
    surface: 35,
    x: sx(388),
    y: sy(280),
    w: sw(16),
    h: sh(26),
    status: 'accord',
  },
  {
    id: 'g08',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'modes',
    surface: 35,
    x: sx(405),
    y: sy(280),
    w: sw(16),
    h: sh(26),
    status: 'accord',
  },

  // Stores along corridor (right side)
  {
    id: 'g09',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'multimedia',
    surface: 116,
    x: sx(487),
    y: sy(280),
    w: sw(34),
    h: sh(66),
  },
  {
    id: 'g10',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'services',
    surface: 118,
    x: sx(521),
    y: sy(280),
    w: sw(32),
    h: sh(66),
  },
  {
    id: 'g11',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'beaute',
    surface: 92,
    x: sx(553),
    y: sy(280),
    w: sw(30),
    h: sh(66),
  },

  // DAB (ATM)
  {
    id: 'dab',
    code: 'DAB',
    name: 'DAB / ATM',
    zone: 'galerie',
    category: 'banqueAssurance',
    surface: 29,
    x: sx(645),
    y: sy(280),
    w: sw(20),
    h: sh(26),
  },

  // Bank/services row below
  {
    id: 'g12',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'banqueAssurance',
    surface: 97,
    x: sx(337),
    y: sy(313),
    w: sw(49),
    h: sh(33),
  },
  {
    id: 'g13',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'multimedia',
    surface: 64,
    x: sx(254),
    y: sy(313),
    w: sw(67),
    h: sh(33),
  },

  // ══════════════════════════════════════════════════════════════════
  //  RESTAURANTS (T1, T2, T3)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 't1',
    code: 'T1',
    name: '',
    zone: 'restaurants',
    category: 'restaurant',
    surface: 152,
    x: sx(712),
    y: sy(280),
    w: sw(35),
    h: sh(55),
  },
  {
    id: 't2',
    code: 'T2',
    name: '',
    zone: 'restaurants',
    category: 'restaurant',
    surface: 174,
    x: sx(750),
    y: sy(280),
    w: sw(38),
    h: sh(55),
  },
  {
    id: 't3',
    code: 'T3',
    name: '',
    zone: 'restaurants',
    category: 'restaurant',
    surface: 175,
    x: sx(790),
    y: sy(280),
    w: sw(42),
    h: sh(55),
  },

  // ══════════════════════════════════════════════════════════════════
  //  CRAFT MARKET
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'craft',
    code: 'CM',
    name: 'Craft Market',
    zone: 'craftMarket',
    category: 'cadeauxAlim',
    surface: 456,
    x: sx(765),
    y: sy(200),
    w: sw(85),
    h: sh(130),
  },

  // Below KIABI — galerie stores
  {
    id: 'g14',
    code: '',
    name: '',
    zone: 'kiabi',
    category: 'modes',
    surface: 300,
    x: sx(620),
    y: sy(202),
    w: sw(110),
    h: sh(50),
    status: 'accord',
  },

  // ══════════════════════════════════════════════════════════════════
  //  FOOD COURT
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'fc6',
    code: 'FC6',
    name: '',
    zone: 'foodCourt',
    category: 'restaurant',
    surface: 54,
    x: sx(270),
    y: sy(445),
    w: sw(35),
    h: sh(28),
  },
  {
    id: 'fc1',
    code: 'FC1',
    name: '',
    zone: 'foodCourt',
    category: 'restaurant',
    surface: 12,
    x: sx(270),
    y: sy(476),
    w: sw(25),
    h: sh(18),
  },
  {
    id: 'fc-a',
    code: '',
    name: '',
    zone: 'foodCourt',
    category: 'restaurant',
    surface: 54,
    x: sx(250),
    y: sy(430),
    w: sw(28),
    h: sh(25),
    status: 'libre',
  },

  // ══════════════════════════════════════════════════════════════════
  //  LEFT COLUMN — more stores
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'b11',
    code: 'B11',
    name: '',
    zone: 'galerie',
    category: 'services',
    surface: 46,
    x: sx(224),
    y: sy(400),
    w: sw(16),
    h: sh(22),
  },
  {
    id: 'b7',
    code: 'B7',
    name: '',
    zone: 'galerie',
    category: 'services',
    surface: 34,
    x: sx(290),
    y: sy(289),
    w: sw(14),
    h: sh(22),
  },

  // Le Petit Viet
  {
    id: 'viet',
    code: '',
    name: 'Le Petit Viet',
    zone: 'galerie',
    category: 'restaurant',
    surface: 54,
    x: sx(263),
    y: sy(468),
    w: sw(38),
    h: sh(22),
  },

  // Pharmacie
  {
    id: 'pharma',
    code: 'PHARMA',
    name: 'Pharmacie',
    zone: 'galerie',
    category: 'pharmacie',
    surface: 300,
    x: sx(260),
    y: sy(580),
    w: sw(80),
    h: sh(36),
  },

  // C27, C29, C30, C32
  {
    id: 'c27',
    code: 'C27',
    name: '',
    zone: 'galerie',
    category: 'beaute',
    surface: 98,
    x: sx(258),
    y: sy(558),
    w: sw(20),
    h: sh(20),
  },
  {
    id: 'c29',
    code: 'C29',
    name: '',
    zone: 'galerie',
    category: 'beaute',
    surface: 199,
    x: sx(260),
    y: sy(537),
    w: sw(30),
    h: sh(18),
  },
  {
    id: 'c30',
    code: 'C30',
    name: '',
    zone: 'galerie',
    category: 'cadeauxAlim',
    surface: 70,
    x: sx(320),
    y: sy(580),
    w: sw(25),
    h: sh(20),
  },
  {
    id: 'c32',
    code: 'C32',
    name: '',
    zone: 'galerie',
    category: 'modes',
    surface: 94,
    x: sx(316),
    y: sy(540),
    w: sw(30),
    h: sh(25),
  },

  // Small stores left column
  {
    id: 'g15',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'modes',
    surface: 70,
    x: sx(220),
    y: sy(360),
    w: sw(32),
    h: sh(25),
    status: 'libre',
  },
  {
    id: 'g16',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'accessoires',
    surface: 42,
    x: sx(260),
    y: sy(388),
    w: sw(40),
    h: sh(18),
    status: 'libre',
  },
  {
    id: 'g17',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'beaute',
    surface: 54,
    x: sx(260),
    y: sy(410),
    w: sw(40),
    h: sh(18),
    status: 'libre',
  },
  {
    id: 'g18',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'cadeauxAlim',
    surface: 54,
    x: sx(260),
    y: sy(430),
    w: sw(40),
    h: sh(18),
    status: 'accord',
  },
  {
    id: 'g19',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'modes',
    surface: 54,
    x: sx(260),
    y: sy(450),
    w: sw(40),
    h: sh(18),
    status: 'libre',
  },

  // ══════════════════════════════════════════════════════════════════
  //  ZONE D'EXPO
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'expo',
    code: 'EXPO',
    name: "Zone d'Expo",
    zone: 'zoneExpo',
    category: 'services',
    surface: 116,
    x: sx(418),
    y: sy(413),
    w: sw(50),
    h: sh(50),
  },

  // ══════════════════════════════════════════════════════════════════
  //  DREAMLAND (Loisirs & Jeux)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'dreamland',
    code: 'DREAMLAND',
    name: 'Dreamland',
    zone: 'dreamland',
    category: 'loisirs',
    surface: 1125,
    x: sx(485),
    y: sy(370),
    w: sw(148),
    h: sh(122),
  },

  // ══════════════════════════════════════════════════════════════════
  //  BIG BOX 3
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'bb3',
    code: 'BB3',
    name: 'Big Box 3',
    zone: 'bigBox3',
    category: 'bigBox',
    surface: 500,
    x: sx(660),
    y: sy(370),
    w: sw(90),
    h: sh(122),
  },

  // ══════════════════════════════════════════════════════════════════
  //  BB4 GROUP
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'bb41sb',
    code: 'BB4-1',
    name: 'Sports Bar',
    zone: 'bb4Hotels',
    category: 'loisirs',
    surface: 200,
    x: sx(405),
    y: sy(540),
    w: sw(100),
    h: sh(35),
  },
  {
    id: 'bb41t',
    code: 'BB4-1T',
    name: 'Terrasse',
    zone: 'bb4Hotels',
    category: 'loisirs',
    surface: 24,
    x: sx(405),
    y: sy(510),
    w: sw(100),
    h: sh(28),
  },
  {
    id: 'bb42',
    code: 'BB4-2',
    name: '',
    zone: 'bb4Hotels',
    category: 'bigBox',
    surface: 739,
    x: sx(405),
    y: sy(578),
    w: sw(140),
    h: sh(75),
  },
  {
    id: 'bb43',
    code: 'BB4-3',
    name: '',
    zone: 'bb4Hotels',
    category: 'bigBox',
    surface: 270,
    x: sx(405),
    y: sy(663),
    w: sw(65),
    h: sh(48),
  },
  {
    id: 'bb44',
    code: 'BB4-4',
    name: '',
    zone: 'bb4Hotels',
    category: 'bigBox',
    surface: 110,
    x: sx(478),
    y: sy(663),
    w: sw(60),
    h: sh(48),
  },

  // ══════════════════════════════════════════════════════════════════
  //  HOTELS (ibis Styles, Adagio Aparthotel)
  // ══════════════════════════════════════════════════════════════════
  {
    id: 'ibis',
    code: 'IBIS',
    name: 'ibis Styles',
    zone: 'hotels',
    category: 'hotel',
    surface: 400,
    x: sx(565),
    y: sy(575),
    w: sw(60),
    h: sh(70),
  },
  {
    id: 'adagio',
    code: 'ADAGIO',
    name: 'Adagio Aparthotel',
    zone: 'hotels',
    category: 'hotel',
    surface: 400,
    x: sx(630),
    y: sy(575),
    w: sw(58),
    h: sh(70),
  },

  // ══════════════════════════════════════════════════════════════════
  //  MORE GALERIE STORES (to fill gaps)
  // ══════════════════════════════════════════════════════════════════
  // Stores below 552m² column
  {
    id: 'g20',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'modes',
    surface: 70,
    x: sx(420),
    y: sy(256),
    w: sw(30),
    h: sh(22),
    status: 'libre',
  },
  {
    id: 'g21',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'beaute',
    surface: 44,
    x: sx(455),
    y: sy(256),
    w: sw(30),
    h: sh(22),
    status: 'libre',
  },

  // Stores near restaurants
  {
    id: 'g22',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'cadeauxAlim',
    surface: 50,
    x: sx(649),
    y: sy(250),
    w: sw(40),
    h: sh(26),
    status: 'libre',
  },
  {
    id: 'g23',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'restaurant',
    surface: 26,
    x: sx(764),
    y: sy(230),
    w: sw(24),
    h: sh(24),
    status: 'libre',
  },
  {
    id: 'g24',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'restaurant',
    surface: 26,
    x: sx(800),
    y: sy(230),
    w: sw(24),
    h: sh(24),
    status: 'libre',
  },

  // Stores near Dreamland
  {
    id: 'g25',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'modes',
    surface: 74,
    x: sx(420),
    y: sy(316),
    w: sw(25),
    h: sh(30),
    status: 'libre',
  },
  {
    id: 'g26',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'services',
    surface: 34,
    x: sx(177),
    y: sy(310),
    w: sw(17),
    h: sh(28),
  },

  // Store at corridor crossing
  {
    id: 'g27',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'modes',
    surface: 95,
    x: sx(200),
    y: sy(540),
    w: sw(28),
    h: sh(35),
  },
  {
    id: 'g28',
    code: '',
    name: '',
    zone: 'galerie',
    category: 'modes',
    surface: 100,
    x: sx(200),
    y: sy(580),
    w: sw(22),
    h: sh(36),
  },
];

/* ------------------------------------------------------------------ */
/*  Amenities                                                          */
/* ------------------------------------------------------------------ */
export const MAP_AMENITIES: MapAmenity[] = [
  // Entrances (from PDF positions)
  { id: 'e1', type: 'entrance', label: 'Entrée 1', x: sx(654), y: sy(258), number: 1 },
  { id: 'e2', type: 'entrance', label: 'Entrée 2', x: sx(343), y: sy(350), number: 2 },
  { id: 'e3', type: 'entrance', label: 'Entrée 3', x: sx(343), y: sy(515), number: 3 },
  { id: 'e4', type: 'entrance', label: 'Entrée 4', x: sx(200), y: sy(608), number: 4 },
  { id: 'ee', type: 'entrance-employee', label: 'Entrée Personnel', x: sx(520), y: sy(126) },

  // Dépose-minute
  { id: 'dm', type: 'depose-minute', label: 'Dépose-minute', x: sx(460), y: sy(64) },

  // Travelators (near T1-T3)
  { id: 'tv1', type: 'travelator', label: 'Travelator', x: sx(729), y: sy(318) },
  { id: 'tv2', type: 'travelator', label: 'Travelator', x: sx(763), y: sy(318) },
  { id: 'tv3', type: 'travelator', label: 'Travelator', x: sx(805), y: sy(318) },

  // Elevator & stairs
  { id: 'el1', type: 'elevator', label: 'Ascenseur', x: sx(500), y: sy(260) },
  { id: 'st1', type: 'stairs', label: 'Escalier', x: sx(470), y: sy(260) },

  // Toilets
  { id: 'wc1', type: 'toilet', label: 'Toilettes', x: sx(180), y: sy(335) },

  // ATM
  { id: 'atm1', type: 'atm', label: 'DAB / ATM', x: sx(336), y: sy(615) },

  // Delivery courtyards
  { id: 'lv1', type: 'livraison', label: 'Cour de livraison', x: sx(100), y: sy(140) },
  { id: 'lv2', type: 'livraison', label: 'Cour de livraison', x: sx(100), y: sy(285) },
];

/* ------------------------------------------------------------------ */
/*  Road / Building constants                                          */
/* ------------------------------------------------------------------ */

export const ROAD = {
  label: 'Boulevard des Martyrs',
  subLabel: '← Angré — Cocody →',
  y: sy(30),
  h: sh(45),
};

export const BUILDING = {
  x: sx(80),
  y: sy(100),
  w: sw(780),
  h: sh(700),
  rx: 5,
};

export const SVG_VIEWBOX = '0 0 960 680';
