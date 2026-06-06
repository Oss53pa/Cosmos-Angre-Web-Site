import React from 'react';
import {
  Bell,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Mail,
  MapPin,
  Phone,
  ShoppingBag,
  Sparkles,
  Utensils,
  Wifi,
  BatteryFull,
  Signal,
  ArrowLeft,
  ArrowRight,
  Film,
  Hotel,
  ParkingCircle,
  Baby,
  Coffee,
  Music,
  Flower2,
} from 'lucide-react';
import CosmosLogo from '../../components/ui/CosmosLogo';

/**
 * A9 · Supports de communication — déclinaisons de la charte Cosmos Angré.
 * Palette dominante : Forêt (vert profond) · Sable · Or (raphia).
 * Galerie de mockups : affiche, app push, textile, bâche, social, newsletter,
 * carte de visite, tote bag.
 */

/* ============================================================
   PALETTE COMPLÈTE (toutes déclinaisons charte Cosmos)
   Forêt · Or / Raphia · Sable / Marbre · Terracotta · Bronze · Ébène
   (le bleu est exclu de la charte)
   ============================================================ */
// — Famille Forêt (Proximité)
const FOREST = '#2D5238';
const FOREST_DEEP = '#1F3A28';
const FOREST_LIGHT = '#4A7058';
// — Famille Or / Raphia
const OR = '#C5A874';
const OR_BRIGHT = '#E2CFA8';
const OR_MAT = '#C7A964';      // or mat premium
const OR_CLAIR = '#D9C9A0';
// — Famille Sable / Marbre
const SABLE = '#E5D9BD';
const SABLE_LIGHT = '#F2EBDD'; // blanc cassé
const MARBRE = '#EFEAD8';
// — Accents signature
const TERRACOTTA = '#B66A4A';
const TERRACOTTA_LIGHT = '#D08862';
const BRONZE = '#8C7338';
const EBENE = '#2A1810';
const INK = EBENE; // alias compat

/* ============================================================
   PRIMITIVES — étiquettes, bandeau % palette
   ============================================================ */

const SwatchBar: React.FC<{ items: { color: string; pct: number; name: string }[] }> = ({
  items,
}) => (
  <div className="flex h-1 w-full overflow-hidden rounded-full">
    {items.map((s) => (
      <div
        key={s.name}
        style={{ backgroundColor: s.color, width: `${s.pct}%` }}
        title={`${s.name} ${s.pct}%`}
      />
    ))}
  </div>
);

const SupportFrame: React.FC<{
  index: string;
  title: string;
  description: string;
  palette: { color: string; pct: number; name: string }[];
  children: React.ReactNode;
  span?: 'sm' | 'md' | 'lg';
}> = ({ index, title, description, palette, children }) => {
  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition hover:border-white/20"
    >
      {/* en-tête */}
      <header className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[10px] tracking-[0.2em] text-white/40"
            style={{ color: OR_BRIGHT }}
          >
            {index}
          </span>
          <span className="h-3 w-px bg-white/20" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-white/70">
            {title}
          </span>
        </div>
        <span className="text-[10px] text-white/40">
          {palette.map((p) => `${p.name} ${p.pct}`).join(' · ')}
        </span>
      </header>

      {/* scène mockup */}
      <div className="relative flex min-h-[640px] flex-1 items-center justify-center overflow-hidden p-10">
        {/* fond ambient */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 30%, ${FOREST_LIGHT}40 0%, ${FOREST_DEEP} 70%, #0d1a14 100%)`,
          }}
        />
        {/* grain léger */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          }}
        />
        <div className="relative z-10 flex items-center justify-center">
          {children}
        </div>
      </div>

      {/* légende */}
      <footer className="border-t border-white/10 bg-black/30 px-5 py-4">
        <p className="text-sm font-medium text-white">{description}</p>
        <div className="mt-3">
          <SwatchBar items={palette} />
          <div className="mt-2 flex justify-between text-[9px] uppercase tracking-wider text-white/40">
            {palette.map((s) => (
              <span key={s.name} className="flex items-center gap-1">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </article>
  );
};

/* ============================================================
   01 — AFFICHE INSTITUTIONNELLE
   ============================================================ */
const Affiche: React.FC = () => (
  <div
    className="relative overflow-hidden rounded shadow-2xl"
    style={{
      width: 400,
      height: 580,
      background: `linear-gradient(180deg, ${FOREST_LIGHT} 0%, ${FOREST} 35%, ${FOREST_DEEP} 100%)`,
      color: SABLE_LIGHT,
    }}
  >
    {/* ornement or */}
    <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 400 580">
      <circle cx="200" cy="140" r="100" fill="none" stroke={OR} strokeWidth="0.7" />
      <circle cx="200" cy="140" r="150" fill="none" stroke={OR} strokeWidth="0.4" />
    </svg>

    {/* cachet terracotta angle haut-droit */}
    <div
      className="absolute right-5 top-5 flex h-16 w-16 -rotate-12 items-center justify-center rounded-full border-2"
      style={{
        background: TERRACOTTA,
        borderColor: OR_BRIGHT,
        color: SABLE_LIGHT,
      }}
    >
      <div className="text-center leading-tight">
        <div className="font-cormorant text-[16px] italic">2026</div>
        <div className="text-[7px] uppercase tracking-[0.2em]">Ouverture</div>
      </div>
    </div>

    <div className="relative flex h-full flex-col items-center justify-between p-10 text-center">
      <CosmosLogo height={70} dotColor={SABLE_LIGHT} />

      <div className="flex flex-col items-center gap-5">
        <span
          className="text-[12px] uppercase tracking-[0.5em]"
          style={{ color: OR_BRIGHT }}
        >
          Cocody · Angré 8<sup>e</sup>
        </span>
        <h2
          className="font-cormorant text-[56px] leading-[0.95]"
          style={{ color: SABLE_LIGHT }}
        >
          COSMOS
          <br />
          ANGRÉ
        </h2>
        <div
          className="my-1 h-px w-24"
          style={{ background: `linear-gradient(90deg, transparent, ${OR}, transparent)` }}
        />
        <p
          className="font-cormorant text-[22px] italic leading-tight"
          style={{ color: OR_BRIGHT }}
        >
          « Le meilleur
          <br />
          du quotidien,
          <br />
          ici. »
        </p>
      </div>

      {/* filet bronze */}
      <div
        className="h-px w-3/4"
        style={{ background: `linear-gradient(90deg, transparent, ${BRONZE}, transparent)` }}
      />

      <div className="flex w-full flex-col items-center gap-2">
        <span
          className="text-[11px] uppercase tracking-[0.4em]"
          style={{ color: SABLE }}
        >
          Boulevard Latrille
        </span>
        <span className="text-[10px] tracking-[0.25em]" style={{ color: OR_CLAIR }}>
          cosmos-angre.ci
        </span>
      </div>
    </div>
  </div>
);

/* ============================================================
   AFFICHE PARAMÉTRABLE — sert aux 3 déclinaisons palette
   ============================================================ */
type AfficheVariantProps = {
  bgFrom: string;
  bgMid: string;
  bgTo: string;
  ink: string;
  accent: string;
  signature: string;
  stamp: string;
  stampInk: string;
  rule: string;
  label: string;
  title: [string, string];
  baseline: string;
};

const AfficheVariant: React.FC<AfficheVariantProps> = (p) => (
  <div
    className="relative overflow-hidden rounded shadow-2xl"
    style={{
      width: 300,
      height: 440,
      background: `linear-gradient(180deg, ${p.bgFrom} 0%, ${p.bgMid} 40%, ${p.bgTo} 100%)`,
      color: p.ink,
    }}
  >
    <svg className="absolute inset-0 h-full w-full opacity-25" viewBox="0 0 300 440">
      <circle cx="150" cy="110" r="85" fill="none" stroke={p.accent} strokeWidth="0.6" />
      <circle cx="150" cy="110" r="120" fill="none" stroke={p.accent} strokeWidth="0.4" />
    </svg>
    {/* cachet */}
    <div
      className="absolute right-4 top-4 flex h-12 w-12 -rotate-12 items-center justify-center rounded-full"
      style={{ background: p.stamp, color: p.stampInk }}
    >
      <span className="font-cormorant text-[13px] italic">2026</span>
    </div>
    <div className="relative flex h-full flex-col items-center justify-between p-7 text-center">
      <CosmosLogo height={50} dotColor={p.ink} />
      <div className="flex flex-col items-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.4em]" style={{ color: p.accent }}>
          {p.label}
        </span>
        <h2 className="font-cormorant text-[42px] leading-[0.95]" style={{ color: p.ink }}>
          {p.title[0]}
          <br />
          {p.title[1]}
        </h2>
        <div
          className="my-1 h-px w-16"
          style={{ background: `linear-gradient(90deg, transparent, ${p.rule}, transparent)` }}
        />
        <p
          className="font-cormorant text-[17px] italic leading-tight"
          style={{ color: p.accent }}
        >
          « {p.baseline} »
        </p>
      </div>
      <span className="text-[9px] uppercase tracking-[0.3em]" style={{ color: p.signature }}>
        cosmos-angre.ci
      </span>
    </div>
  </div>
);

/* ============================================================
   02 — PUSH DIGITAL / APP
   ============================================================ */
const AppPush: React.FC = () => (
  <div
    className="relative rounded-[44px] shadow-2xl"
    style={{
      width: 320,
      height: 620,
      background: '#0a0a0a',
      padding: 10,
    }}
  >
    {/* notch */}
    <div className="absolute left-1/2 top-3 z-20 h-5 w-28 -translate-x-1/2 rounded-full bg-black" />

    <div
      className="relative h-full w-full overflow-hidden rounded-[36px]"
      style={{
        background: `linear-gradient(180deg, ${FOREST} 0%, ${FOREST_DEEP} 100%)`,
      }}
    >
      {/* status bar */}
      <div
        className="flex items-center justify-between px-8 pt-4 text-[11px]"
        style={{ color: SABLE_LIGHT }}
      >
        <span className="font-semibold">9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal size={12} />
          <Wifi size={12} />
          <BatteryFull size={14} />
        </div>
      </div>

      {/* header app */}
      <div
        className="mt-8 flex items-center justify-between px-5"
        style={{ color: SABLE_LIGHT }}
      >
        <CosmosLogo height={44} dotColor={SABLE_LIGHT} />
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: OR + '30' }}
        >
          <Bell size={15} style={{ color: OR_BRIGHT }} />
        </div>
      </div>

      {/* hero */}
      <div className="px-5 pt-6">
        <p
          className="text-[10px] uppercase tracking-[0.4em]"
          style={{ color: OR_BRIGHT }}
        >
          Aujourd'hui · Samedi
        </p>
        <h3
          className="mt-1 font-cormorant text-[30px] leading-tight"
          style={{ color: SABLE_LIGHT }}
        >
          Courses, lunch,
          <br />
          cinéma
        </h3>
        <p
          className="mt-2 font-cormorant text-[15px] italic leading-tight"
          style={{ color: OR_BRIGHT }}
        >
          « Cosmos Angré, une adresse,
          <br />
          une expérience. »
        </p>
      </div>

      {/* notification card */}
      <div
        className="mx-4 mt-5 rounded-2xl p-4 shadow-lg"
        style={{
          background: 'rgba(255,255,255,0.97)',
          color: EBENE,
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg"
            style={{ background: FOREST }}
          >
            <Sparkles size={18} style={{ color: OR_BRIGHT }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                Cosmos Angré
              </span>
              <span className="text-[10px] text-black/40">à l'instant</span>
            </div>
            <p className="mt-1.5 text-[12px] leading-snug">
              Votre table chez <strong>Le Comptoir</strong> est confirmée
              pour 13 h. Le cinéma vous attend à 15 h 45.
            </p>
          </div>
        </div>
      </div>

      {/* quick actions */}
      <div className="px-4 pt-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { i: ShoppingBag, l: 'Shop' },
            { i: Utensils, l: 'Lunch' },
            { i: Sparkles, l: 'Ciné' },
          ].map(({ i: Icon, l }) => (
            <div
              key={l}
              className="flex flex-col items-center gap-1.5 rounded-xl py-3"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              <Icon size={18} style={{ color: OR_BRIGHT }} strokeWidth={1.5} />
              <span
                className="text-[10px] uppercase tracking-wider"
                style={{ color: SABLE_LIGHT }}
              >
                {l}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* badge urgence terracotta */}
      <div className="mx-4 mt-4">
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2.5"
          style={{ background: TERRACOTTA + '22', borderLeft: `3px solid ${TERRACOTTA}` }}
        >
          <span
            className="h-2 w-2 animate-pulse rounded-full"
            style={{ background: TERRACOTTA_LIGHT }}
          />
          <span
            className="text-[10px] uppercase tracking-[0.25em]"
            style={{ color: TERRACOTTA_LIGHT }}
          >
            Promo flash · cinéma -30 %
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="absolute bottom-7 left-4 right-4">
        <button
          className="w-full rounded-xl py-3 text-[12px] font-semibold uppercase tracking-[0.3em]"
          style={{ background: OR, color: FOREST_DEEP }}
        >
          Préparer mon samedi
        </button>
      </div>
    </div>
  </div>
);

/* ============================================================
   03 — TEXTILE STAFF (T-shirt mockup)
   ============================================================ */
const TextileStaff: React.FC = () => (
  <svg viewBox="0 0 280 320" className="h-[460px] w-[400px] drop-shadow-2xl">
    {/* ombre projetée */}
    <ellipse cx="140" cy="305" rx="80" ry="6" fill="rgba(0,0,0,0.4)" />

    {/* corps t-shirt */}
    <path
      d="M 60 50 L 90 30 L 110 40 Q 140 55 170 40 L 190 30 L 220 50 L 235 90 L 215 105 L 215 280 Q 215 290 205 290 L 75 290 Q 65 290 65 280 L 65 105 L 45 90 Z"
      fill={FOREST}
      stroke={FOREST_DEEP}
      strokeWidth="0.5"
    />
    {/* col */}
    <path
      d="M 110 40 Q 140 60 170 40 Q 155 52 140 52 Q 125 52 110 40 Z"
      fill={FOREST_DEEP}
    />
    {/* ombre */}
    <path
      d="M 65 105 L 75 110 L 75 280 Q 75 285 80 285 L 75 290 Q 65 290 65 280 Z"
      fill="rgba(0,0,0,0.18)"
    />
    <path
      d="M 215 105 L 205 110 L 205 280 Q 205 285 200 285 L 205 290 Q 215 290 215 280 Z"
      fill="rgba(0,0,0,0.18)"
    />

    {/* logo brodé (poitrine gauche) */}
    <g transform="translate(95, 100)">
      <text
        x="0"
        y="0"
        fill={SABLE_LIGHT}
        fontFamily="serif"
        fontSize="13"
        fontWeight="600"
        letterSpacing="2"
      >
        COSMOS
      </text>
      <text
        x="0"
        y="14"
        fill={SABLE_LIGHT}
        fontFamily="serif"
        fontSize="13"
        fontWeight="600"
        letterSpacing="2"
      >
        ANGRÉ
      </text>
      <line x1="0" y1="20" x2="60" y2="20" stroke={OR_BRIGHT} strokeWidth="1" />
      <text
        x="0"
        y="30"
        fill={OR_BRIGHT}
        fontFamily="sans-serif"
        fontSize="7"
        fontWeight="700"
        letterSpacing="3"
      >
        STAFF
      </text>
    </g>

    {/* badge or brodé (manche droite) */}
    <g transform="translate(200, 75)">
      <circle cx="0" cy="0" r="9" fill="none" stroke={OR} strokeWidth="0.8" />
      <circle cx="0" cy="0" r="4" fill={OR} />
      {/* ombre bronze sous broderie */}
      <circle cx="0.6" cy="0.6" r="4" fill={BRONZE} opacity="0.4" />
    </g>

    {/* parement terracotta intérieur de col */}
    <path
      d="M 110 40 Q 140 60 170 40 Q 155 50 140 50 Q 125 50 110 40 Z"
      fill={TERRACOTTA}
      opacity="0.85"
    />

    {/* étiquette intérieure (col) sable */}
    <rect x="135" y="62" width="10" height="6" fill={SABLE} opacity="0.7" rx="1" />
    <text
      x="140"
      y="67"
      textAnchor="middle"
      fontSize="2"
      fill={EBENE}
      fontFamily="sans-serif"
    >
      COSMOS
    </text>

    {/* surpiqûre or bas */}
    <line x1="80" y1="282" x2="200" y2="282" stroke={OR} strokeWidth="0.4" strokeDasharray="2,2" opacity="0.5" />
  </svg>
);

/* ============================================================
   04 — BÂCHE URBAINE (format horizontal)
   ============================================================ */
const Bache: React.FC = () => (
  <div
    className="relative overflow-hidden rounded shadow-2xl"
    style={{
      width: 620,
      height: 300,
      background: `linear-gradient(135deg, ${FOREST_DEEP} 0%, ${FOREST} 50%, ${FOREST_LIGHT} 100%)`,
      color: SABLE_LIGHT,
    }}
  >
    {/* anneaux pose */}
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={`top-${i}`}
        className="absolute h-3 w-3 rounded-full border-2"
        style={{
          top: 8,
          left: 18 + i * 150,
          borderColor: OR,
          background: '#222',
        }}
      />
    ))}
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={`bot-${i}`}
        className="absolute h-3 w-3 rounded-full border-2"
        style={{
          bottom: 8,
          left: 18 + i * 150,
          borderColor: OR,
          background: '#222',
        }}
      />
    ))}

    {/* ornement */}
    <svg className="absolute inset-0 h-full w-full opacity-15" viewBox="0 0 620 300">
      <path
        d="M 0 150 Q 155 90 310 150 T 620 150"
        fill="none"
        stroke={OR}
        strokeWidth="0.8"
      />
      <path
        d="M 0 200 Q 155 140 310 200 T 620 200"
        fill="none"
        stroke={OR}
        strokeWidth="0.5"
      />
    </svg>

    <div className="relative grid h-full grid-cols-[1fr_auto] items-center gap-8 px-14">
      <div>
        <p
          className="text-[13px] uppercase tracking-[0.5em]"
          style={{ color: OR_BRIGHT }}
        >
          Boulevard Latrille · Cocody
        </p>
        <h3 className="mt-3 font-cormorant text-[64px] leading-[0.95]">
          Un monde
          <em className="not-italic" style={{ color: OR_BRIGHT }}>
            {' '}
            à part.
          </em>
        </h3>
        <div
          className="mt-4 h-px w-32"
          style={{ background: `linear-gradient(90deg, ${OR}, transparent)` }}
        />
        <p
          className="mt-4 text-[13px] uppercase tracking-[0.3em]"
          style={{ color: SABLE }}
        >
          Shopping · Gastronomie · Cinéma · Hôtel
        </p>
      </div>
      <div className="flex flex-col items-center gap-3 border-l border-white/15 pl-8">
        <CosmosLogo height={64} dotColor={SABLE_LIGHT} />
        <div
          className="rounded px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.3em]"
          style={{ background: TERRACOTTA, color: SABLE_LIGHT }}
        >
          J-180
        </div>
        <span
          className="text-[10px] uppercase tracking-[0.3em]"
          style={{ color: OR_BRIGHT }}
        >
          Ouverture · Nov. 2026
        </span>
      </div>
    </div>

    {/* bande inférieure bronze */}
    <div
      className="absolute bottom-0 left-0 right-0 h-1.5"
      style={{ background: `linear-gradient(90deg, ${BRONZE}, ${OR}, ${BRONZE})` }}
    />
  </div>
);

/* ============================================================
   05 — POST RÉSEAU SOCIAL
   ============================================================ */
const SocialPost: React.FC = () => (
  <div
    className="overflow-hidden rounded-2xl shadow-2xl"
    style={{ width: 380, background: 'white' }}
  >
    {/* header */}
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: FOREST }}
        >
          <span className="font-cormorant text-[15px]" style={{ color: OR_BRIGHT }}>
            CA
          </span>
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold">cosmos.angre</div>
          <div className="text-[11px] text-black/50">Cocody · Abidjan</div>
        </div>
      </div>
      <span className="text-[18px] tracking-widest text-black/40">···</span>
    </div>

    {/* image */}
    <div
      className="relative aspect-square w-full"
      style={{
        background: `linear-gradient(160deg, ${FOREST_LIGHT} 0%, ${FOREST} 50%, ${FOREST_DEEP} 100%)`,
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-25"
        viewBox="0 0 380 380"
      >
        <circle cx="190" cy="190" r="140" fill="none" stroke={OR} strokeWidth="0.7" />
        <circle cx="190" cy="190" r="100" fill="none" stroke={OR} strokeWidth="0.5" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <CosmosLogo height={50} dotColor={SABLE_LIGHT} />
        <span
          className="mt-5 text-[11px] uppercase tracking-[0.5em]"
          style={{ color: OR_BRIGHT }}
        >
          Cosmos Club · Nouveau
        </span>
        <h3
          className="mt-3 font-cormorant text-[40px] leading-[0.95]"
          style={{ color: SABLE_LIGHT }}
        >
          Le centre
          <br />
          <em className="not-italic" style={{ color: OR_BRIGHT }}>
            de vos envies.
          </em>
        </h3>
        <button
          className="mt-5 rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.3em]"
          style={{ background: OR, color: FOREST_DEEP }}
        >
          Rejoindre
        </button>
      </div>
    </div>

    {/* actions */}
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex gap-4">
        <Heart size={22} strokeWidth={1.4} />
        <MessageCircle size={22} strokeWidth={1.4} />
        <Send size={22} strokeWidth={1.4} />
      </div>
      <Bookmark size={22} strokeWidth={1.4} />
    </div>

    {/* caption */}
    <div className="px-4 pb-4 text-[12px] leading-snug text-black/80">
      <strong>cosmos.angre</strong> Adhésion offerte aux 100 premiers
      jours d'ouverture.
      <span className="text-black/40">
        {' '}
        #CosmosClub #CosmosAngre #Cocody
      </span>
    </div>
  </div>
);

/* ============================================================
   06 — NEWSLETTER (email)
   ============================================================ */
const Newsletter: React.FC = () => (
  <div
    className="overflow-hidden rounded-md shadow-2xl"
    style={{ width: 500, background: SABLE_LIGHT }}
  >
    {/* barre client mail */}
    <div className="flex items-center gap-2 bg-neutral-200 px-4 py-2">
      <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
      <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
      <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
      <span className="ml-2 text-[11px] text-black/40">
        bonjour@cosmos-angre.ci
      </span>
    </div>

    {/* header newsletter */}
    <div
      className="relative px-8 py-9"
      style={{
        background: `linear-gradient(135deg, ${FOREST} 0%, ${FOREST_DEEP} 100%)`,
        color: SABLE_LIGHT,
      }}
    >
      <svg
        className="absolute right-0 top-0 h-full opacity-20"
        viewBox="0 0 160 200"
      >
        <circle cx="140" cy="50" r="80" fill="none" stroke={OR} strokeWidth="0.8" />
        <circle cx="140" cy="50" r="55" fill="none" stroke={OR} strokeWidth="0.5" />
      </svg>
      <div className="relative">
        <CosmosLogo height={52} dotColor={SABLE_LIGHT} />
        <p
          className="mt-5 text-[10px] uppercase tracking-[0.5em]"
          style={{ color: OR_BRIGHT }}
        >
          Newsletter · Mai 2026
        </p>
        <h2 className="mt-2 font-cormorant text-[32px] leading-tight">
          Ce qui change à Cosmos
          <br />
          ce mois-ci.
        </h2>
        <p
          className="mt-2 font-cormorant text-[15px] italic"
          style={{ color: OR_BRIGHT }}
        >
          « Le centre de vos envies. »
        </p>
      </div>
    </div>

    {/* content */}
    <div className="px-8 py-7" style={{ color: EBENE }}>
      <p className="text-[13px] leading-relaxed">
        Bonjour,
        <br />
        <br />
        Le printemps s'installe à Cocody, et Cosmos Angré se déploie. Au
        sommaire : trois nouvelles enseignes, un dimanche brunch en accès
        libre, et un avant-goût du Cosmos Club…
      </p>

      <div
        className="my-5 h-px w-full"
        style={{ background: `linear-gradient(90deg, ${OR}, transparent)` }}
      />

      <div className="grid grid-cols-3 gap-3">
        {[
          { l: 'Nouveau', t: 'Maison Atelier', bg: SABLE, accent: FOREST },
          { l: 'Événement', t: 'Brunch dimanche', bg: MARBRE, accent: TERRACOTTA },
          { l: 'Club', t: 'Adhésion ouverte', bg: SABLE_LIGHT, accent: BRONZE },
        ].map((c) => (
          <div
            key={c.t}
            className="rounded p-3"
            style={{ background: c.bg, color: EBENE, borderLeft: `3px solid ${c.accent}` }}
          >
            <span
              className="text-[9px] uppercase tracking-[0.3em]"
              style={{ color: c.accent }}
            >
              {c.l}
            </span>
            <div className="mt-1.5 font-cormorant text-[16px] leading-tight">
              {c.t}
            </div>
          </div>
        ))}
      </div>

      <button
        className="mt-6 w-full rounded py-3 text-[12px] font-semibold uppercase tracking-[0.4em]"
        style={{ background: FOREST, color: OR_BRIGHT }}
      >
        Lire la newsletter
      </button>
    </div>

    {/* footer */}
    <div
      className="px-6 py-4 text-center text-[11px] uppercase tracking-[0.3em]"
      style={{ background: FOREST_DEEP, color: OR_BRIGHT }}
    >
      cosmos-angre.ci · Cocody Angré
    </div>
  </div>
);

/* ============================================================
   07 — CARTE DE VISITE (recto / verso)
   ============================================================ */
const BusinessCards: React.FC = () => (
  <div className="flex flex-col items-center gap-5">
    {/* recto */}
    <div
      className="relative overflow-hidden rounded-md shadow-2xl"
      style={{
        width: 380,
        height: 220,
        background: `linear-gradient(135deg, ${FOREST} 0%, ${FOREST_DEEP} 100%)`,
        color: SABLE_LIGHT,
      }}
    >
      <svg className="absolute inset-0 h-full w-full opacity-20" viewBox="0 0 380 220">
        <circle cx="320" cy="30" r="80" fill="none" stroke={OR} strokeWidth="0.6" />
      </svg>
      <div className="relative flex h-full flex-col justify-between p-7">
        <CosmosLogo height={44} dotColor={SABLE_LIGHT} />
        <div>
          <p className="font-cormorant text-[26px] leading-tight">
            Aïcha Konaté
          </p>
          <p
            className="text-[11px] uppercase tracking-[0.4em]"
            style={{ color: OR_BRIGHT }}
          >
            Directrice Expérience
          </p>
        </div>
        <p
          className="font-cormorant text-[13px] italic"
          style={{ color: OR_BRIGHT }}
        >
          « Une adresse, une expérience. »
        </p>
      </div>
    </div>

    {/* verso */}
    <div
      className="relative overflow-hidden rounded-md shadow-2xl rotate-[2deg]"
      style={{
        width: 380,
        height: 220,
        background: SABLE_LIGHT,
        color: EBENE,
      }}
    >
      <div className="flex h-full flex-col justify-between p-7">
        <p
          className="text-[11px] uppercase tracking-[0.5em]"
          style={{ color: FOREST }}
        >
          Cosmos Angré
        </p>
        <div className="space-y-2 text-[12px]">
          <div className="flex items-center gap-2.5">
            <Phone size={13} style={{ color: FOREST }} />
            <span>+225 27 22 49 00 00</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Mail size={13} style={{ color: FOREST }} />
            <span>aicha.konate@cosmos-angre.ci</span>
          </div>
          <div className="flex items-center gap-2.5">
            <MapPin size={13} style={{ color: FOREST }} />
            <span>Bd Latrille · Angré 8<sup>e</sup> · Abidjan</span>
          </div>
        </div>
        <div
          className="self-end font-cormorant text-4xl italic"
          style={{ color: OR }}
        >
          C
        </div>
      </div>
    </div>
  </div>
);

/* ============================================================
   08 — TOTE BAG GOODIE
   ============================================================ */
const ToteBag: React.FC = () => (
  <svg viewBox="0 0 280 320" className="h-[480px] w-[420px] drop-shadow-2xl">
    <ellipse cx="140" cy="305" rx="85" ry="6" fill="rgba(0,0,0,0.4)" />

    {/* anses (terracotta tressé) */}
    <path
      d="M 95 40 Q 95 10 115 10 L 115 45"
      fill="none"
      stroke={TERRACOTTA}
      strokeWidth="4"
      strokeLinecap="round"
    />
    <path
      d="M 185 40 Q 185 10 165 10 L 165 45"
      fill="none"
      stroke={TERRACOTTA}
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* surpiqûre anses bronze */}
    <path
      d="M 95 40 Q 95 10 115 10 L 115 45"
      fill="none"
      stroke={BRONZE}
      strokeWidth="0.5"
      strokeDasharray="2,2"
      opacity="0.7"
    />
    <path
      d="M 185 40 Q 185 10 165 10 L 165 45"
      fill="none"
      stroke={BRONZE}
      strokeWidth="0.5"
      strokeDasharray="2,2"
      opacity="0.7"
    />

    {/* sac */}
    <path
      d="M 70 45 L 210 45 L 220 290 Q 220 295 215 295 L 65 295 Q 60 295 60 290 Z"
      fill={MARBRE}
      stroke={FOREST}
      strokeWidth="0.5"
    />

    {/* parement haut sable */}
    <rect x="60" y="45" width="160" height="8" fill={SABLE} opacity="0.7" />

    {/* pliures */}
    <path d="M 95 45 L 95 295" stroke={FOREST} strokeWidth="0.3" opacity="0.3" />
    <path d="M 185 45 L 185 295" stroke={FOREST} strokeWidth="0.3" opacity="0.3" />

    {/* logo central */}
    <g transform="translate(140, 155)">
      <text
        x="0"
        y="0"
        textAnchor="middle"
        fill={FOREST}
        fontFamily="serif"
        fontSize="26"
        fontWeight="500"
        letterSpacing="3"
      >
        COSMOS
      </text>
      <text
        x="0"
        y="26"
        textAnchor="middle"
        fill={FOREST}
        fontFamily="serif"
        fontSize="26"
        fontWeight="500"
        letterSpacing="3"
      >
        ANGRÉ
      </text>
      <line x1="-40" y1="38" x2="40" y2="38" stroke={OR} strokeWidth="1.2" />
      <text
        x="0"
        y="52"
        textAnchor="middle"
        fill={OR}
        fontFamily="serif"
        fontSize="10"
        fontStyle="italic"
      >
        « Le meilleur du quotidien, ici. »
      </text>
      {/* tampon ébène discret */}
      <text
        x="0"
        y="78"
        textAnchor="middle"
        fill={EBENE}
        fontFamily="sans-serif"
        fontSize="5"
        letterSpacing="2.5"
        opacity="0.6"
      >
        ÉD. LIMITÉE · 001/500
      </text>
    </g>
  </svg>
);

/* ============================================================
   09 — PANNEAU DIRECTIONNEL SUSPENDU (signalétique intérieure)
   Centre commercial de plain-pied — orientation par zones / allées
   ============================================================ */
type Direction = {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  sub: string;
};

type PanneauPalette = {
  bgFrom: string;
  bgMid: string;
  bgTo: string;
  border: string;        // bordure + liserés
  accent: string;        // sous-titres + ornement
  textPrimary: string;   // labels destinations
  pulseDot: string;      // point "vous êtes ici"
  logoDot: string;       // dotColor du logo Cosmos
};

const PALETTE_FOREST: PanneauPalette = {
  bgFrom: FOREST_LIGHT,
  bgMid: FOREST,
  bgTo: FOREST_DEEP,
  border: OR,
  accent: OR_BRIGHT,
  textPrimary: SABLE_LIGHT,
  pulseDot: TERRACOTTA,
  logoDot: SABLE_LIGHT,
};

// Palette Crème — pour signalétique zones Accueil / Hospitalité
const PALETTE_CREAM: PanneauPalette = {
  bgFrom: SABLE_LIGHT,   // #F2EBDD
  bgMid: MARBRE,         // #EFEAD8
  bgTo: SABLE,           // #E5D9BD
  border: FOREST,        // liserés vert profond — contraste élégant
  accent: BRONZE,        // sous-titres bronze
  textPrimary: EBENE,    // labels en bois d'ébène
  pulseDot: TERRACOTTA,  // point "vous êtes ici" terracotta
  logoDot: FOREST,       // dotColor du logo en Forêt pour lisibilité sur crème
};

const FOREST_LEFT: Direction[] = [
  { icon: ShoppingBag, label: 'Mode & Beauté', sub: 'Allée Ouest' },
  { icon: Film, label: 'Cinéma', sub: 'Le Pavillon' },
  { icon: ParkingCircle, label: 'Parking', sub: '350 places' },
];

const FOREST_RIGHT: Direction[] = [
  { icon: Utensils, label: 'Restaurants', sub: "L'Esplanade" },
  { icon: Hotel, label: 'Hôtel Ibis Style', sub: 'Aile Est' },
  { icon: Baby, label: 'Espace Kids', sub: 'Le Patio' },
];

const CREAM_LEFT: Direction[] = [
  { icon: Hotel, label: 'Hôtel Ibis Style', sub: 'Aile Est' },
  { icon: Flower2, label: 'Spa & Bien-être', sub: 'Jardin Privé' },
  { icon: Coffee, label: 'Lounge Café', sub: 'Le Lobby' },
];

const CREAM_RIGHT: Direction[] = [
  { icon: Sparkles, label: 'Conciergerie', sub: '24h / 24' },
  { icon: Music, label: 'Restaurant signature', sub: 'Le Belvédère' },
  { icon: Utensils, label: 'Brunch dimanche', sub: 'Sur réservation' },
];

const PANEL_WIDTH = 740;
const PANEL_HEIGHT = 240;
const CABLE_HEIGHT = 60;

const DirectionRow: React.FC<{
  d: Direction;
  side: 'left' | 'right';
  palette: PanneauPalette;
}> = ({ d, side, palette }) => {
  const Icon = d.icon;
  const Arrow = side === 'left' ? ArrowLeft : ArrowRight;

  return (
    <div
      className={`flex items-center gap-3 ${
        side === 'right' ? 'flex-row-reverse' : ''
      }`}
    >
      <Arrow
        size={24}
        strokeWidth={2}
        style={{ color: palette.accent, flexShrink: 0 }}
      />
      <Icon
        size={20}
        strokeWidth={1.5}
        style={{ color: palette.textPrimary, flexShrink: 0 } as React.CSSProperties}
      />
      <div
        className="min-w-0 flex-1 leading-tight"
        style={{ textAlign: side === 'left' ? 'left' : 'right' }}
      >
        <div
          className="truncate font-cormorant text-[22px]"
          style={{ color: palette.textPrimary }}
        >
          {d.label}
        </div>
        <div
          className="truncate text-[9px] uppercase tracking-[0.25em]"
          style={{ color: palette.accent }}
        >
          {d.sub}
        </div>
      </div>
    </div>
  );
};

const SuspensionCable: React.FC<{ left: string }> = ({ left }) => (
  <div
    className="pointer-events-none absolute flex flex-col items-center"
    style={{ left, top: -CABLE_HEIGHT, transform: 'translateX(-50%)' }}
  >
    {/* ancrage plafond */}
    <div
      className="h-2.5 w-5 rounded-sm"
      style={{
        background: `linear-gradient(180deg, ${BRONZE}, #6a5a30)`,
        boxShadow: '0 1px 1px rgba(0,0,0,0.5)',
      }}
    />
    {/* câble métallique */}
    <div
      style={{
        width: 2,
        height: CABLE_HEIGHT - 12,
        background: `linear-gradient(180deg, ${BRONZE} 0%, #c8bfa8 50%, ${BRONZE} 100%)`,
        boxShadow: '0 0 2px rgba(0,0,0,0.3)',
      }}
    />
    {/* fixation panneau */}
    <div
      className="-mt-0.5 h-2 w-3 rounded-sm"
      style={{ background: BRONZE, boxShadow: '0 1px 0 rgba(0,0,0,0.4)' }}
    />
  </div>
);

type PanneauProps = {
  palette: PanneauPalette;
  left: Direction[];
  right: Direction[];
  zone: string;
};

const PanneauDirectionnel: React.FC<PanneauProps> = ({
  palette,
  left,
  right,
  zone,
}) => (
  <div
    className="relative flex flex-col items-center"
    style={{ paddingTop: CABLE_HEIGHT + 8 }}
  >
    {/* plafond suggéré */}
    <div
      className="absolute left-1/2 top-0 h-px -translate-x-1/2"
      style={{
        width: PANEL_WIDTH + 80,
        background:
          'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
      }}
    />

    {/* conteneur panneau + câbles solidaires */}
    <div className="relative" style={{ width: PANEL_WIDTH }}>
      {/* câbles ancrés directement sur le panneau */}
      <SuspensionCable left="22%" />
      <SuspensionCable left="78%" />

      {/* panneau */}
      <div
        className="relative overflow-hidden rounded-md"
        style={{
          width: PANEL_WIDTH,
          height: PANEL_HEIGHT,
          background: `linear-gradient(180deg, ${palette.bgFrom} 0%, ${palette.bgMid} 35%, ${palette.bgTo} 100%)`,
          border: `1px solid ${palette.border}40`,
          boxShadow:
            '0 22px 44px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -2px 0 rgba(0,0,0,0.3)',
        }}
      >
        {/* liserés */}
        <div
          className="absolute left-0 right-0 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${palette.border}, transparent)`,
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${palette.border}, transparent)`,
          }}
        />

        {/* badge zone (haut centre) */}
        <div
          className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full px-3 py-0.5 text-[8px] uppercase tracking-[0.4em]"
          style={{
            background: `${palette.border}25`,
            color: palette.accent,
            border: `1px solid ${palette.border}40`,
          }}
        >
          {zone}
        </div>

        {/* ornement central discret */}
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full opacity-10"
          viewBox={`0 0 ${PANEL_WIDTH} ${PANEL_HEIGHT}`}
        >
          <circle
            cx={PANEL_WIDTH / 2}
            cy={PANEL_HEIGHT / 2}
            r="100"
            fill="none"
            stroke={palette.border}
            strokeWidth="0.5"
          />
          <circle
            cx={PANEL_WIDTH / 2}
            cy={PANEL_HEIGHT / 2}
            r="145"
            fill="none"
            stroke={palette.border}
            strokeWidth="0.3"
          />
        </svg>

        {/* grille 3 colonnes */}
        <div className="relative grid h-full grid-cols-[1fr_240px_1fr] items-center px-8">
          {/* COL GAUCHE */}
          <div className="flex flex-col gap-5 pr-4">
            {left.map((d) => (
              <DirectionRow key={d.label} d={d} side="left" palette={palette} />
            ))}
          </div>

          {/* CENTRE — logo officiel + "Vous êtes ici" */}
          <div
            className="flex h-full flex-col items-center justify-center gap-3 border-x"
            style={{ borderColor: `${palette.border}30` }}
          >
            <CosmosLogo height={56} dotColor={palette.logoDot} />
            <div className="mt-1 flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: palette.pulseDot,
                  boxShadow: `0 0 8px ${palette.pulseDot}`,
                }}
              />
              <span
                className="text-[10px] uppercase tracking-[0.4em]"
                style={{ color: palette.textPrimary }}
              >
                Vous êtes ici
              </span>
            </div>
          </div>

          {/* COL DROITE */}
          <div className="flex flex-col gap-5 pl-4">
            {right.map((d) => (
              <DirectionRow key={d.label} d={d} side="right" palette={palette} />
            ))}
          </div>
        </div>

        {/* mention double-face intégrée bas du panneau */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-[0.4em]"
          style={{ color: `${palette.accent}99` }}
        >
          Double face · Recto / Verso
        </div>
      </div>

      {/* ombre projetée sous le panneau */}
      <div
        className="mx-auto rounded-b-md"
        style={{
          width: PANEL_WIDTH - 40,
          height: 10,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.5), transparent)',
          filter: 'blur(4px)',
        }}
      />
    </div>
  </div>
);

/* ============================================================
   PAGE
   ============================================================ */

const SUPPORTS = [
  {
    key: 'affiche',
    index: 'A9.1',
    title: 'Affiche institutionnelle',
    description: '« Le meilleur du quotidien, ici. » · Format 4×3 · MUPI · Réseau urbain Abidjan',
    palette: [
      { color: FOREST, pct: 45, name: 'Forêt' },
      { color: SABLE, pct: 25, name: 'Sable' },
      { color: OR, pct: 15, name: 'Or' },
      { color: TERRACOTTA, pct: 10, name: 'Terracotta' },
      { color: BRONZE, pct: 5, name: 'Bronze' },
    ],
    render: <Affiche />,
  },
  {
    key: 'app',
    index: 'A9.2',
    title: 'Push digital · App',
    description: 'Notification · « Cosmos Angré, une adresse, une expérience. » + alerte Terracotta',
    palette: [
      { color: FOREST, pct: 50, name: 'Forêt' },
      { color: OR, pct: 20, name: 'Or' },
      { color: SABLE_LIGHT, pct: 15, name: 'Sable' },
      { color: TERRACOTTA, pct: 10, name: 'Terracotta' },
      { color: EBENE, pct: 5, name: 'Ébène' },
    ],
    render: <AppPush />,
  },
  {
    key: 'textile',
    index: 'A9.3',
    title: 'Textile staff',
    description: 'Polo équipe · Parement Terracotta intérieur · Broderie or & bronze',
    palette: [
      { color: FOREST, pct: 60, name: 'Forêt' },
      { color: TERRACOTTA, pct: 15, name: 'Terracotta' },
      { color: OR, pct: 10, name: 'Or brodé' },
      { color: BRONZE, pct: 10, name: 'Bronze' },
      { color: SABLE, pct: 5, name: 'Sable' },
    ],
    render: <TextileStaff />,
  },
  {
    key: 'bache',
    index: 'A9.4',
    title: 'Bâche événement',
    description: 'Bâche 6×2 m · Compte à rebours Terracotta · Filet bronze inférieur',
    palette: [
      { color: FOREST_DEEP, pct: 45, name: 'Forêt deep' },
      { color: FOREST_LIGHT, pct: 20, name: 'Forêt clair' },
      { color: OR, pct: 15, name: 'Or' },
      { color: TERRACOTTA, pct: 10, name: 'Terracotta' },
      { color: BRONZE, pct: 10, name: 'Bronze' },
    ],
    render: <Bache />,
    span: 'lg' as const,
  },
  {
    key: 'social',
    index: 'A9.5',
    title: 'Post réseau social',
    description: 'Format carré · Instagram / LinkedIn · Annonce Cosmos Club',
    palette: [
      { color: FOREST, pct: 50, name: 'Forêt' },
      { color: OR, pct: 20, name: 'Or' },
      { color: SABLE_LIGHT, pct: 20, name: 'Sable' },
      { color: EBENE, pct: 10, name: 'Ébène' },
    ],
    render: <SocialPost />,
  },
  {
    key: 'newsletter',
    index: 'A9.6',
    title: 'Newsletter mensuelle',
    description: 'Email HTML · 3 cartes en déclinaison Sable / Marbre / Blanc cassé',
    palette: [
      { color: SABLE_LIGHT, pct: 30, name: 'Blanc cassé' },
      { color: MARBRE, pct: 15, name: 'Marbre' },
      { color: SABLE, pct: 15, name: 'Sable' },
      { color: FOREST, pct: 25, name: 'Forêt' },
      { color: TERRACOTTA, pct: 10, name: 'Terracotta' },
      { color: BRONZE, pct: 5, name: 'Bronze' },
    ],
    render: <Newsletter />,
  },
  {
    key: 'cartes',
    index: 'A9.7',
    title: 'Carte de visite',
    description: 'Recto Forêt · Verso Sable · Initiale or & contact ébène',
    palette: [
      { color: FOREST, pct: 45, name: 'Forêt' },
      { color: SABLE_LIGHT, pct: 30, name: 'Sable' },
      { color: OR, pct: 15, name: 'Or' },
      { color: EBENE, pct: 10, name: 'Ébène' },
    ],
    render: <BusinessCards />,
  },
  {
    key: 'tote',
    index: 'A9.8',
    title: 'Tote bag · Goodies',
    description: 'Marbre 280g · Anses Terracotta · Surpiqûre bronze · Tampon ébène',
    palette: [
      { color: MARBRE, pct: 55, name: 'Marbre' },
      { color: TERRACOTTA, pct: 15, name: 'Terracotta' },
      { color: FOREST, pct: 15, name: 'Forêt' },
      { color: OR, pct: 10, name: 'Or' },
      { color: BRONZE, pct: 5, name: 'Bronze' },
    ],
    render: <ToteBag />,
  },
  {
    key: 'panneau-foret',
    index: 'A9.9',
    title: 'Panneau directionnel · Forêt',
    description:
      'Signalétique aérienne zone Shopping & Services · Aluminium laqué Forêt · Câbles bronze',
    palette: [
      { color: FOREST, pct: 60, name: 'Forêt' },
      { color: OR, pct: 15, name: 'Or' },
      { color: SABLE_LIGHT, pct: 15, name: 'Sable' },
      { color: BRONZE, pct: 10, name: 'Bronze' },
    ],
    render: (
      <PanneauDirectionnel
        palette={PALETTE_FOREST}
        left={FOREST_LEFT}
        right={FOREST_RIGHT}
        zone="Shopping · Services"
      />
    ),
    span: 'lg' as const,
  },
  {
    key: 'panneau-creme',
    index: 'A9.10',
    title: 'Panneau directionnel · Crème',
    description:
      'Déclinaison Hospitalité · Zone Hôtel Ibis Style & Services · Fond crème · Encre ébène · Liserés forêt',
    palette: [
      { color: SABLE_LIGHT, pct: 35, name: 'Blanc cassé' },
      { color: MARBRE, pct: 25, name: 'Marbre' },
      { color: SABLE, pct: 15, name: 'Sable' },
      { color: FOREST, pct: 10, name: 'Forêt' },
      { color: BRONZE, pct: 10, name: 'Bronze' },
      { color: EBENE, pct: 5, name: 'Ébène' },
    ],
    render: (
      <PanneauDirectionnel
        palette={PALETTE_CREAM}
        left={CREAM_LEFT}
        right={CREAM_RIGHT}
        zone="Hospitalité · Services"
      />
    ),
    span: 'lg' as const,
  },
];

const SupportsCommunicationPage: React.FC = () => {
  return (
    <div
      className="min-h-screen w-full text-white"
      style={{
        background:
          'radial-gradient(ellipse at top, #15281c 0%, #0a1410 50%, #050a08 100%)',
      }}
    >
      {/* ===== Hero ===== */}
      <header className="relative overflow-hidden border-b border-white/10">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `radial-gradient(ellipse at 80% 20%, ${OR}22 0%, transparent 50%)`,
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-28">
          <div className="flex items-center gap-4">
            <span
              className="font-mono text-xs uppercase tracking-[0.4em]"
              style={{ color: OR_BRIGHT }}
            >
              A9 · Communication
            </span>
            <span className="h-px w-16" style={{ background: OR }} />
          </div>
          <h1 className="mt-6 font-cormorant text-5xl leading-tight sm:text-7xl">
            Supports de
            <br />
            <em className="not-italic" style={{ color: OR_BRIGHT }}>
              communication.
            </em>
          </h1>
          <p
            className="mt-6 max-w-2xl text-base uppercase tracking-[0.25em] sm:text-lg"
            style={{ color: SABLE }}
          >
            Le seul territoire où les couleurs s'expriment sans contrainte.
          </p>

          {/* Signatures validées */}
          <div className="mt-10 max-w-3xl rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <p
              className="text-[10px] uppercase tracking-[0.4em]"
              style={{ color: OR_BRIGHT }}
            >
              Signatures validées · à utiliser exclusivement
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2">
              {[
                'Le meilleur du quotidien, ici.',
                "Vivez l'exception.",
                'Le centre de vos envies.',
                'Un monde à part.',
                'Cosmos Angré, une adresse, une expérience.',
              ].map((sig) => (
                <li
                  key={sig}
                  className="flex items-start gap-2 font-cormorant text-base italic"
                  style={{ color: SABLE_LIGHT }}
                >
                  <span style={{ color: OR }}>«</span>
                  <span>{sig}</span>
                  <span style={{ color: OR }}>»</span>
                </li>
              ))}
            </ul>
          </div>

          {/* mini-palette — toutes les déclinaisons */}
          <div className="mt-12">
            <p className="mb-4 text-[10px] uppercase tracking-[0.4em] text-white/40">
              Palette complète · 16 nuances
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {[
                { c: FOREST_LIGHT, n: 'Forêt clair' },
                { c: FOREST, n: 'Forêt' },
                { c: FOREST_DEEP, n: 'Forêt deep' },
                { c: TERRACOTTA_LIGHT, n: 'Terracotta clair' },
                { c: TERRACOTTA, n: 'Terracotta' },
                { c: OR_BRIGHT, n: 'Or éclairé' },
                { c: OR_CLAIR, n: 'Or clair' },
                { c: OR, n: 'Raphia' },
                { c: OR_MAT, n: 'Or mat' },
                { c: BRONZE, n: 'Bronze' },
                { c: SABLE_LIGHT, n: 'Blanc cassé' },
                { c: MARBRE, n: 'Marbre' },
                { c: SABLE, n: 'Sable' },
                { c: EBENE, n: 'Ébène' },
              ].map((s) => (
                <div
                  key={s.n}
                  className="group/sw flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-2 py-1.5"
                  title={s.n}
                >
                  <div
                    className="h-5 w-5 rounded ring-1 ring-white/20"
                    style={{ background: s.c }}
                  />
                  <span className="text-[10px] uppercase tracking-wider text-white/70">
                    {s.n}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-[11px] uppercase tracking-[0.3em] text-white/40">
              10 supports · 3 déclinaisons palette · 1 charte
            </div>
          </div>
        </div>
      </header>

      {/* ===== Grille supports ===== */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p
              className="text-[10px] uppercase tracking-[0.4em]"
              style={{ color: OR_BRIGHT }}
            >
              Galerie
            </p>
            <h2 className="mt-2 font-cormorant text-3xl text-white sm:text-4xl">
              Une marque, dix incarnations.
            </h2>
          </div>
          <span className="hidden text-[10px] uppercase tracking-[0.3em] text-white/40 sm:block">
            Survolez pour isoler · Palette % indicative
          </span>
        </div>

        <div className="flex flex-col gap-10">
          {SUPPORTS.map((s) => (
            <SupportFrame
              key={s.key}
              index={s.index}
              title={s.title}
              description={s.description}
              palette={s.palette}
              span={s.span}
            >
              {s.render}
            </SupportFrame>
          ))}
        </div>
      </section>

      {/* ===== Déclinaisons palette ===== */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.4em]"
                style={{ color: OR_BRIGHT }}
              >
                Déclinaisons · même affiche, trois territoires
              </p>
              <h2 className="mt-2 font-cormorant text-3xl text-white sm:text-4xl">
                Une charte, plusieurs voix.
              </h2>
              <p className="mt-2 max-w-xl text-sm text-white/50">
                La même affiche signature, déclinée sur les trois familles de la
                charte — Proximité Forêt, Premium Or & Ébène, Lifestyle Terracotta.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                key: 'foret',
                title: 'Proximité · Forêt',
                desc: 'Quotidien, famille, ancrage Cocody',
                palette: [
                  { color: FOREST, pct: 50, name: 'Forêt' },
                  { color: SABLE, pct: 25, name: 'Sable' },
                  { color: OR, pct: 15, name: 'Raphia' },
                  { color: TERRACOTTA, pct: 10, name: 'Terracotta' },
                ],
                render: (
                  <AfficheVariant
                    bgFrom={FOREST_LIGHT}
                    bgMid={FOREST}
                    bgTo={FOREST_DEEP}
                    ink={SABLE_LIGHT}
                    accent={OR_BRIGHT}
                    signature={SABLE}
                    rule={OR}
                    stamp={TERRACOTTA}
                    stampInk={SABLE_LIGHT}
                    label="Cocody · Angré"
                    title={['Le meilleur', 'du quotidien,']}
                    baseline="Le meilleur du quotidien, ici."
                  />
                ),
              },
              {
                key: 'premium-clair',
                title: 'Premium · Or & Ébène',
                desc: 'Hôtel, services signature, expériences hautes',
                palette: [
                  { color: MARBRE, pct: 50, name: 'Marbre' },
                  { color: OR_MAT, pct: 25, name: 'Or mat' },
                  { color: EBENE, pct: 15, name: 'Ébène' },
                  { color: BRONZE, pct: 10, name: 'Bronze' },
                ],
                render: (
                  <AfficheVariant
                    bgFrom={SABLE_LIGHT}
                    bgMid={MARBRE}
                    bgTo={SABLE}
                    ink={EBENE}
                    accent={OR_MAT}
                    signature={BRONZE}
                    rule={BRONZE}
                    stamp={EBENE}
                    stampInk={OR_CLAIR}
                    label="Cosmos Premium"
                    title={['Vivez', "l'exception."]}
                    baseline="Un monde à part."
                  />
                ),
              },
              {
                key: 'envies',
                title: 'Lifestyle · Terracotta',
                desc: 'Loisirs, restauration, signature affective',
                palette: [
                  { color: TERRACOTTA, pct: 45, name: 'Terracotta' },
                  { color: SABLE, pct: 25, name: 'Sable' },
                  { color: EBENE, pct: 15, name: 'Ébène' },
                  { color: OR, pct: 10, name: 'Raphia' },
                  { color: BRONZE, pct: 5, name: 'Bronze' },
                ],
                render: (
                  <AfficheVariant
                    bgFrom={TERRACOTTA_LIGHT}
                    bgMid={TERRACOTTA}
                    bgTo="#8a4a32"
                    ink={SABLE_LIGHT}
                    accent={SABLE}
                    signature={SABLE}
                    rule={EBENE}
                    stamp={EBENE}
                    stampInk={SABLE_LIGHT}
                    label="Cosmos Lifestyle"
                    title={['Le centre', 'de vos envies.']}
                    baseline="Le centre de vos envies."
                  />
                ),
              },
            ].map((d) => (
              <article
                key={d.key}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
              >
                <div
                  className="flex items-center justify-center p-10"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 30%, #15281c80 0%, #050a08 100%)',
                  }}
                >
                  {d.render}
                </div>
                <div className="border-t border-white/10 px-5 py-4">
                  <h3 className="font-cormorant text-xl text-white">{d.title}</h3>
                  <p className="mt-1 text-xs text-white/50">{d.desc}</p>
                  <div className="mt-4">
                    <SwatchBar items={d.palette} />
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[9px] uppercase tracking-wider text-white/40">
                      {d.palette.map((s) => (
                        <span key={s.name} className="flex items-center gap-1">
                          <span
                            className="inline-block h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: s.color }}
                          />
                          {s.name} {s.pct}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Palette complète (référence) ===== */}
      <section className="border-t border-white/10 bg-black/40">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10">
          <p
            className="text-[10px] uppercase tracking-[0.4em]"
            style={{ color: OR_BRIGHT }}
          >
            Référence palette
          </p>
          <h2 className="mt-2 font-cormorant text-3xl text-white sm:text-4xl">
            Toutes les couleurs, toutes les déclinaisons.
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
            {[
              {
                title: 'Famille Forêt',
                sub: 'Territoire principal Proximité',
                items: [
                  { c: FOREST_LIGHT, n: 'Forêt clair', h: '#4A7058' },
                  { c: FOREST, n: 'Forêt', h: '#2D5238' },
                  { c: FOREST_DEEP, n: 'Forêt deep', h: '#1F3A28' },
                ],
              },
              {
                title: 'Famille Or & Bronze',
                sub: 'Accents universels',
                items: [
                  { c: OR_BRIGHT, n: 'Or éclairé', h: '#E2CFA8' },
                  { c: OR_CLAIR, n: 'Or clair', h: '#D9C9A0' },
                  { c: OR, n: 'Raphia', h: '#C5A874' },
                  { c: OR_MAT, n: 'Or mat', h: '#C7A964' },
                  { c: BRONZE, n: 'Bronze', h: '#8C7338' },
                ],
              },
              {
                title: 'Famille Sable & Marbre',
                sub: 'Surfaces claires, fonds de lecture',
                items: [
                  { c: SABLE_LIGHT, n: 'Blanc cassé', h: '#F2EBDD' },
                  { c: MARBRE, n: 'Marbre', h: '#EFEAD8' },
                  { c: SABLE, n: 'Sable', h: '#E5D9BD' },
                ],
              },
              {
                title: 'Accents signature',
                sub: 'Terracotta · CTA, alertes, artisanat',
                items: [
                  { c: TERRACOTTA_LIGHT, n: 'Terracotta clair', h: '#D08862' },
                  { c: TERRACOTTA, n: 'Terracotta', h: '#B66A4A' },
                ],
              },
              {
                title: 'Encrage',
                sub: 'Textes, tampons, contrastes profonds',
                items: [{ c: EBENE, n: 'Ébène', h: '#2A1810' }],
              },
            ].map((fam) => (
              <div
                key={fam.title}
                className="rounded-lg border border-white/10 bg-white/[0.02] p-5"
              >
                <h4 className="font-cormorant text-lg text-white">{fam.title}</h4>
                <p className="text-[10px] uppercase tracking-wider text-white/40">
                  {fam.sub}
                </p>
                <div className="mt-4 space-y-1.5">
                  {fam.items.map((c) => (
                    <div
                      key={c.h}
                      className="flex items-center gap-3 rounded bg-white/[0.02] p-2"
                    >
                      <div
                        className="h-8 w-12 flex-shrink-0 rounded ring-1 ring-white/15"
                        style={{ background: c.c }}
                      />
                      <div className="flex-1 leading-tight">
                        <div className="text-xs text-white">{c.n}</div>
                        <div className="font-mono text-[10px] text-white/40">
                          {c.h}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Règles d'usage ===== */}
      <section className="border-t border-white/10 bg-black/30">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
          <p
            className="text-[10px] uppercase tracking-[0.4em]"
            style={{ color: OR_BRIGHT }}
          >
            Règles d'usage
          </p>
          <h3 className="mt-2 font-cormorant text-3xl">Quatre règles, toutes les déclinaisons.</h3>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: '01',
                t: 'La Forêt domine',
                d: 'Le vert profond reste le territoire de marque pour la Proximité. Minimum 45 % de la surface visible.',
              },
              {
                n: '02',
                t: 'L\'or, jamais seul',
                d: "Or éclairé, raphia, or mat ou bronze — quatre nuances pour quatre niveaux de prestige. Toujours en accent, jamais en aplat majoritaire.",
              },
              {
                n: '03',
                t: 'Sable & Marbre respirent',
                d: 'Sable, marbre, blanc cassé : trois nuances claires interchangeables selon la finesse du grain souhaitée.',
              },
              {
                n: '04',
                t: 'Terracotta signe',
                d: "Le terracotta est l'accent vivant — alertes, CTAs, parements textiles, marchés. Maximum 15 %, mais visible.",
              },
            ].map((r) => (
              <div
                key={r.n}
                className="rounded-lg border border-white/10 bg-white/[0.02] p-6"
              >
                <span
                  className="font-mono text-xs"
                  style={{ color: OR_BRIGHT }}
                >
                  {r.n}
                </span>
                <h4 className="mt-3 font-cormorant text-xl">{r.t}</h4>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {r.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-10 text-center sm:px-10">
          <CosmosLogo height={44} dotColor={SABLE_LIGHT} />
          <p
            className="text-[10px] uppercase tracking-[0.4em]"
            style={{ color: OR_BRIGHT }}
          >
            Charte Cosmos Angré · A9 Communication
          </p>
          <p className="text-[10px] text-white/40">
            Document de référence · Reproduction interne uniquement
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SupportsCommunicationPage;
