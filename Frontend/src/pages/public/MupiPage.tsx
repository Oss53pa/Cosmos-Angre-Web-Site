import React from 'react';
import { MapPin, Sparkles, Calendar, Gift, Music } from 'lucide-react';
import CosmosLogo from '../../components/ui/CosmosLogo';

/**
 * Aperçu d'affiches MUPI (Mobilier Urbain Pour l'Information).
 * Format réel : 120 × 176 cm (ratio ≈ 1:1.467, portrait).
 * Galerie de déclinaisons : Signature, Ouverture, Événement, Proximité.
 */

type Message = {
  id: string;
  label: string;
  eyebrow: string;
  titleLines: string[];
  accentWord?: string;
  subtitle?: string;
  badge: string;
  address: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
};

const MESSAGES: Message[] = [
  {
    id: 'quotidien',
    label: 'Signature institutionnelle',
    eyebrow: 'Cocody · Abidjan',
    titleLines: ['Le meilleur', 'du quotidien,'],
    accentWord: 'ici.',
    subtitle: 'Shopping · Restaurants · Loisirs · Bien-être',
    badge: 'Ouverture · Novembre 2026',
    address: "Boulevard Latrille · Angré 8e Tranche",
    icon: Sparkles,
  },
  {
    id: 'exception',
    label: "L'exception",
    eyebrow: 'Cosmos Angré',
    titleLines: ['Vivez'],
    accentWord: "l'exception.",
    subtitle: 'Marques premium · Services signature · Expériences uniques',
    badge: 'Ouverture · Novembre 2026',
    address: "Boulevard Latrille · Angré 8e Tranche",
    icon: Sparkles,
  },
  {
    id: 'envies',
    label: 'Envies',
    eyebrow: 'Une destination, mille envies',
    titleLines: ['Le centre', 'de vos'],
    accentWord: 'envies.',
    subtitle: '63 enseignes · 14 restaurants · Cinéma · Spa',
    badge: 'Tout sous un même toit',
    address: "cosmos-angre.ci",
    icon: Gift,
  },
  {
    id: 'monde',
    label: 'Un monde à part',
    eyebrow: 'Architecture EDGE Advanced',
    titleLines: ['Un monde'],
    accentWord: 'à part.',
    subtitle: 'Un écrin urbain au cœur de Cocody Angré',
    badge: 'Ouverture · Novembre 2026',
    address: "Boulevard Latrille · 8e Tranche",
    icon: Music,
  },
  {
    id: 'experience',
    label: 'Une adresse, une expérience',
    eyebrow: 'Cosmos Angré',
    titleLines: ['Une adresse,', 'une'],
    accentWord: 'expérience.',
    subtitle: 'Shopping · Restaurants · Loisirs · Bien-être · Hôtel',
    badge: 'Programme Cosmos Club',
    address: "Cocody Angré · Ouvert 7j/7",
    icon: Calendar,
  },
];

/* ============================================================
   Palette Proximité — 5 déclinaisons chromatiques
   (chaque affiche utilise une combinaison différente)
   ============================================================ */
type PaletteVariant = {
  bg: string; // dégradé du fond
  text: string; // couleur du texte principal
  textSoft: string; // couleur secondaire (eyebrow, address)
  accent: string; // couleur d'accent (mot mis en valeur, bordures, traits)
  accentSoft: string; // accent atténué
  swatch: { label: string; color: string }[];
  paletteName: string;
};

const FOREST = '45 82 56'; // #2D5238
const FOREST_DEEP = '31 58 40'; // #1F3A28
const FOREST_LIGHT = '74 112 88'; // #4A7058
const RAPHIA = '197 168 116'; // #C5A874
const RAPHIA_LIGHT = '212 187 140'; // #D4BB8C
const RAPHIA_BRIGHT = '226 207 168'; // #E2CFA8
const SABLE = '229 217 189'; // #E5D9BD
const SABLE_LIGHT = '242 235 221'; // #F2EBDD
const TERRACOTTA = '182 106 74'; // #B66A4A
const TERRACOTTA_LIGHT = '210 142 109'; // #D28E6D
const INK = '42 24 16'; // #2A1810

const c = (rgb: string, a = 1) => `rgb(${rgb} / ${a})`;

const PALETTES: PaletteVariant[] = [
  // 1 — FORÊT DOMINANT (raphia accent)
  {
    bg: `radial-gradient(ellipse at 50% 0%, ${c(FOREST_LIGHT)} 0%, ${c(FOREST)} 45%, ${c(FOREST_DEEP)} 100%)`,
    text: c(SABLE_LIGHT),
    textSoft: c(SABLE, 0.75),
    accent: c(RAPHIA),
    accentSoft: c(RAPHIA_BRIGHT),
    paletteName: 'Forêt · Raphia',
    swatch: [
      { label: 'Forêt', color: c(FOREST) },
      { label: 'Raphia', color: c(RAPHIA) },
      { label: 'Sable', color: c(SABLE) },
    ],
  },
  // 2 — FORÊT DEEP + TERRACOTTA (signature accent)
  {
    bg: `radial-gradient(ellipse at 50% 100%, ${c(FOREST)} 0%, ${c(FOREST_DEEP)} 60%, #0e1a13 100%)`,
    text: c(SABLE_LIGHT),
    textSoft: c(SABLE, 0.7),
    accent: c(TERRACOTTA_LIGHT),
    accentSoft: c(TERRACOTTA),
    paletteName: 'Forêt deep · Terracotta',
    swatch: [
      { label: 'Forêt deep', color: c(FOREST_DEEP) },
      { label: 'Terracotta', color: c(TERRACOTTA) },
      { label: 'Sable', color: c(SABLE_LIGHT) },
    ],
  },
  // 3 — RAPHIA DOMINANT (or éclatant, vert texte)
  {
    bg: `radial-gradient(ellipse at 50% 0%, ${c(RAPHIA_BRIGHT)} 0%, ${c(RAPHIA)} 50%, ${c(RAPHIA_LIGHT)} 100%)`,
    text: c(FOREST_DEEP),
    textSoft: c(FOREST, 0.7),
    accent: c(FOREST),
    accentSoft: c(TERRACOTTA),
    paletteName: 'Raphia · Forêt',
    swatch: [
      { label: 'Raphia', color: c(RAPHIA) },
      { label: 'Forêt', color: c(FOREST) },
      { label: 'Terracotta', color: c(TERRACOTTA) },
    ],
  },
  // 4 — SABLE DOMINANT (clair, vert + or)
  {
    bg: `linear-gradient(160deg, ${c(SABLE_LIGHT)} 0%, ${c(SABLE)} 100%)`,
    text: c(FOREST_DEEP),
    textSoft: c(FOREST, 0.65),
    accent: c(RAPHIA),
    accentSoft: c(TERRACOTTA),
    paletteName: 'Sable · Or · Forêt',
    swatch: [
      { label: 'Sable', color: c(SABLE) },
      { label: 'Forêt', color: c(FOREST) },
      { label: 'Or', color: c(RAPHIA) },
    ],
  },
  // 5 — TERRACOTTA DOMINANT (chaleureux, sable + ink)
  {
    bg: `radial-gradient(ellipse at 50% 0%, ${c(TERRACOTTA_LIGHT)} 0%, ${c(TERRACOTTA)} 60%, #6a3a26 100%)`,
    text: c(SABLE_LIGHT),
    textSoft: c(SABLE, 0.8),
    accent: c(RAPHIA_BRIGHT),
    accentSoft: c(RAPHIA),
    paletteName: 'Terracotta · Sable',
    swatch: [
      { label: 'Terracotta', color: c(TERRACOTTA) },
      { label: 'Sable', color: c(SABLE_LIGHT) },
      { label: 'Raphia', color: c(RAPHIA_BRIGHT) },
    ],
  },
];

const Poster: React.FC<{ v: Message; p: PaletteVariant }> = ({ v, p }) => {
  const Icon = v.icon;
  return (
    <article
      className="poster relative overflow-hidden rounded-md shadow-2xl"
      style={{
        aspectRatio: '120 / 176',
        width: '100%',
        background: p.bg,
        color: p.text,
        containerType: 'inline-size',
      }}
    >
      {/* Motif décor — utilise l'accent de la palette */}
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full opacity-[0.18]"
        viewBox="0 0 600 880"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id={`glow-${v.id}`} cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor={p.accentSoft} stopOpacity="0.9" />
            <stop offset="100%" stopColor={p.accent} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="300" cy="0" r="500" fill={`url(#glow-${v.id})`} />
        <circle cx="300" cy="440" r="380" fill="none" stroke={p.accent} strokeWidth="0.6" />
        <circle cx="300" cy="440" r="280" fill="none" stroke={p.accent} strokeWidth="0.5" />
        <circle cx="300" cy="440" r="180" fill="none" stroke={p.accent} strokeWidth="0.4" />
      </svg>

      {/* Liseré */}
      <div
        aria-hidden
        className="absolute inset-[4cqw] rounded-sm pointer-events-none"
        style={{ border: `1px solid ${p.accent}66` }}
      />

      {/* Contenu */}
      <div
        className="relative h-full grid text-center"
        style={{
          gridTemplateRows: '1fr auto 1fr',
          padding: '7cqw 8cqw',
        }}
      >
        {/* Bloc haut */}
        <header className="flex flex-col items-center justify-start gap-[2cqw]">
          <div style={{ width: '60cqw', maxWidth: 280 }}>
            <CosmosLogo height={56} className="w-full h-auto" dotColor={p.text} />
          </div>
          <p
            className="uppercase font-inter"
            style={{
              fontSize: 'clamp(0.5rem, 1.6cqw, 0.95rem)',
              letterSpacing: '0.5em',
              color: p.accent,
            }}
          >
            {v.eyebrow}
          </p>
        </header>

        {/* Bloc central */}
        <div className="flex flex-col items-center justify-center gap-[3cqw]">
          <div className="flex items-center gap-[2cqw]" style={{ color: p.accent }}>
            <span style={{ height: 1, width: 'clamp(20px, 7cqw, 60px)', background: `${p.accent}99` }} />
            <Icon size={18} strokeWidth={1.2} />
            <span style={{ height: 1, width: 'clamp(20px, 7cqw, 60px)', background: `${p.accent}99` }} />
          </div>

          <h2
            className="font-cormorant font-light m-0"
            style={{
              fontSize: 'clamp(1.6rem, 9cqw, 6rem)',
              lineHeight: 1.02,
              color: p.text,
            }}
          >
            {v.titleLines.map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))}
            {v.accentWord && (
              <span className="block not-italic font-medium" style={{ color: p.accentSoft }}>
                {v.accentWord}
              </span>
            )}
          </h2>

          {v.subtitle && (
            <p
              className="font-inter uppercase max-w-[90%]"
              style={{
                fontSize: 'clamp(0.5rem, 1.5cqw, 0.85rem)',
                letterSpacing: '0.4em',
                color: p.textSoft,
              }}
            >
              {v.subtitle}
            </p>
          )}
        </div>

        {/* Bloc bas */}
        <footer className="flex flex-col items-center justify-end gap-[2cqw]">
          <div
            className="uppercase"
            style={{
              fontSize: 'clamp(0.5rem, 1.4cqw, 0.85rem)',
              letterSpacing: '0.35em',
              padding: '1.2cqw 3cqw',
              border: `1px solid ${p.accent}`,
              color: p.accentSoft,
            }}
          >
            {v.badge}
          </div>
          <div
            className="flex items-center gap-[1cqw] uppercase"
            style={{
              fontSize: 'clamp(0.45rem, 1.2cqw, 0.7rem)',
              letterSpacing: '0.25em',
              color: p.textSoft,
            }}
          >
            <MapPin size={11} strokeWidth={1.5} />
            <span>{v.address}</span>
          </div>
          <p
            className="font-inter"
            style={{
              fontSize: 'clamp(0.4rem, 1cqw, 0.65rem)',
              letterSpacing: '0.2em',
              color: `${p.accent}cc`,
            }}
          >
            cosmos-angre.ci
          </p>
        </footer>
      </div>
    </article>
  );
};

const PosterFrame: React.FC<{ v: Message; p: PaletteVariant }> = ({ v, p }) => (
  <div className="flex flex-col items-center gap-3">
    <div
      className="relative bg-neutral-800 rounded-[14px] shadow-2xl"
      style={{ padding: '12px', width: '100%' }}
    >
      <Poster v={v} p={p} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-sm"
        style={{
          background:
            'linear-gradient(115deg, rgba(255,255,255,0.07) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.04) 100%)',
          mixBlendMode: 'overlay',
        }}
      />
      <div
        aria-hidden
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[40%] h-4 bg-neutral-700 rounded-b-md shadow-lg"
      />
    </div>
    <p className="text-xs uppercase tracking-[0.25em] text-neutral-400 mt-4">{v.label}</p>
    <div className="flex items-center gap-1.5 mt-1">
      {p.swatch.map((s) => (
        <span
          key={s.label}
          title={s.label}
          className="block h-3 w-3 rounded-full ring-1 ring-white/20"
          style={{ background: s.color }}
        />
      ))}
      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 ml-1.5">
        {p.paletteName}
      </span>
    </div>
  </div>
);

const MupiPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-neutral-900 py-12 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-cosmos-gold mb-2">
            Aperçu campagne
          </p>
          <h1 className="font-cormorant text-4xl text-neutral-100">
            Affiches MUPI · Cosmos Angré
          </h1>
          <p className="text-sm text-neutral-400 mt-2">
            Format 120 × 176 cm · 5 signatures · 5 déclinaisons chromatiques de la charte Proximité
          </p>
        </header>

        <div className="flex flex-col items-center gap-24">
          {MESSAGES.map((msg, i) => (
            <div key={msg.id} className="w-full" style={{ maxWidth: 560 }}>
              <PosterFrame v={msg} p={PALETTES[i % PALETTES.length]} />
            </div>
          ))}
        </div>

        <p className="mt-20 text-center text-xs text-neutral-500 tracking-wide">
          Ratio 120/176 · Marges techniques 6 cm · Police titre Cormorant · Police corps Inter
        </p>
      </div>
    </div>
  );
};

export default MupiPage;
