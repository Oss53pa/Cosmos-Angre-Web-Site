import React from 'react';
import {
  Search,
  Menu,
  Heart,
  MapPin,
  Calendar,
  ShoppingBag,
  Utensils,
  Sparkles,
  ChevronRight,
  Navigation,
  Star,
  Clock,
  Bell,
  User,
} from 'lucide-react';
import CosmosLogo from '../../components/ui/CosmosLogo';

/**
 * Galerie de mockups numériques — Cosmos Angré.
 * Disposition verticale, tailles natives lisibles.
 * Supports : Mobile · Tablette · Ordinateur · Wayfinder.
 */

/* ============================================================
   ÉCRAN 1 — MOBILE : Home cinematique
   ============================================================ */
const MobileScreen: React.FC = () => (
  <div className="w-full h-full flex flex-col bg-cosmos-bleu-nuit text-cosmos-sable overflow-hidden">
    <div className="flex justify-between items-center px-5 pt-2 text-[11px] text-cosmos-sable/70">
      <span>9:41</span>
      <span>●●●● 5G</span>
    </div>

    <div
      className="relative flex-1 flex flex-col items-center justify-between p-5 pt-7"
      style={{
        background:
          'radial-gradient(ellipse at top, rgb(var(--cosmos-night-light)), rgb(var(--cosmos-bleu-nuit, 10 27 46)) 60%, rgb(var(--cosmos-ebene, 42 24 16)))',
      }}
    >
      <div className="flex items-center justify-between w-full">
        <Menu size={20} className="text-cosmos-or-clair" />
        <CosmosLogo height={36} dotColor="rgb(var(--cosmos-terracotta, 182 106 74))" />
        <User size={20} className="text-cosmos-or-clair" />
      </div>

      <div className="flex flex-col items-center text-center gap-3 my-auto">
        <p className="text-[10px] uppercase tracking-[0.4em] text-cosmos-terracotta">Cocody · Abidjan</p>
        <h1 className="font-cormorant text-[40px] leading-[1.05] text-cosmos-blanc-casse">
          Le meilleur
          <br />
          du quotidien,
          <br />
          <em className="not-italic font-medium text-cosmos-or-clair">ici.</em>
        </h1>
        <button className="mt-4 px-6 py-2 border border-cosmos-terracotta text-[11px] uppercase tracking-[0.3em] text-cosmos-terracotta">
          Découvrir
        </button>
      </div>

      <div className="w-full grid grid-cols-3 gap-2">
        {[
          {
            i: ShoppingBag,
            l: 'Shopping',
            bg: 'bg-cosmos-terracotta/10',
            border: 'border-cosmos-terracotta/40',
            text: 'text-cosmos-terracotta',
          },
          {
            i: Utensils,
            l: 'Gastro',
            bg: 'bg-cosmos-raphia/10',
            border: 'border-cosmos-raphia/40',
            text: 'text-cosmos-raphia',
          },
          {
            i: Sparkles,
            l: 'Loisirs',
            bg: 'bg-cosmos-or-clair/10',
            border: 'border-cosmos-or-clair/40',
            text: 'text-cosmos-or-clair',
          },
        ].map(({ i: Icon, l, bg, border, text }) => (
          <div
            key={l}
            className={`${bg} ${border} border rounded p-2.5 flex flex-col items-center gap-1`}
          >
            <Icon size={18} className={text} strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-wider text-cosmos-sable">{l}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-cosmos-ebene border-t border-cosmos-or-mat/30 flex justify-around py-3">
      {[
        { I: ShoppingBag, c: 'text-cosmos-terracotta' },
        { I: MapPin, c: 'text-cosmos-raphia/60' },
        { I: Heart, c: 'text-cosmos-or-clair/60' },
        { I: User, c: 'text-cosmos-sable/50' },
      ].map(({ I, c }, i) => (
        <I key={i} size={20} className={c} />
      ))}
    </div>
  </div>
);

/* ============================================================
   ÉCRAN 2 — TABLETTE : Liste boutiques
   ============================================================ */
const TabletScreen: React.FC = () => {
  const tilePalettes = [
    'linear-gradient(135deg, rgb(var(--cosmos-terracotta, 182 106 74) / 0.85), rgb(var(--cosmos-bronze, 140 115 56) / 0.7))',
    'linear-gradient(135deg, rgb(var(--cosmos-vert-profond, 45 82 56) / 0.8), rgb(var(--cosmos-raphia, 197 168 116) / 0.7))',
    'linear-gradient(135deg, rgb(var(--cosmos-raphia, 197 168 116) / 0.85), rgb(var(--cosmos-sable, 229 217 189) / 0.9))',
    'linear-gradient(135deg, rgb(var(--cosmos-bleu-nuit, 10 27 46) / 0.85), rgb(var(--cosmos-or-mat, 199 169 100) / 0.55))',
    'linear-gradient(135deg, rgb(var(--cosmos-or-mat, 199 169 100) / 0.85), rgb(var(--cosmos-blanc-casse, 242 235 221) / 0.95))',
    'linear-gradient(135deg, rgb(var(--cosmos-ebene, 42 24 16) / 0.85), rgb(var(--cosmos-terracotta, 182 106 74) / 0.65))',
    'linear-gradient(135deg, rgb(var(--cosmos-vert-profond, 45 82 56) / 0.8), rgb(var(--cosmos-or-clair, 217 201 160) / 0.7))',
    'linear-gradient(135deg, rgb(var(--cosmos-bronze, 140 115 56) / 0.85), rgb(var(--cosmos-marbre, 239 234 216) / 0.95))',
  ];
  return (
    <div className="w-full h-full bg-cosmos-blanc-casse text-cosmos-ebene overflow-hidden flex flex-col">
      <div className="bg-cosmos-bleu-nuit text-cosmos-marbre px-8 py-3.5 flex items-center justify-between">
        <CosmosLogo height={36} dotColor="rgb(var(--cosmos-or-clair, 217 201 160))" />
        <div className="flex gap-7 text-[12px] uppercase tracking-[0.2em]">
          <span className="text-cosmos-or-clair">Boutiques</span>
          <span>Événements</span>
          <span>Services</span>
          <span>Visiter</span>
        </div>
        <div className="flex items-center gap-2 bg-cosmos-night-light rounded-full px-3 py-1.5">
          <Search size={14} className="text-cosmos-or-clair" />
          <span className="text-[11px] text-cosmos-marbre/70">Rechercher</span>
        </div>
      </div>

      <div className="px-10 py-5 border-b border-cosmos-bronze/20">
        <p className="text-[11px] uppercase tracking-[0.4em] text-cosmos-terracotta mb-2">
          Répertoire · 63 enseignes
        </p>
        <h2 className="font-cormorant text-4xl text-cosmos-vert-profond">Toutes les boutiques</h2>
      </div>

      <div className="px-10 py-3 flex gap-2 border-b border-cosmos-bronze/20">
        {[
          { l: 'Tout', active: true },
          { l: 'Mode' },
          { l: 'Beauté' },
          { l: 'Tech' },
          { l: 'Maison' },
          { l: 'Enfants' },
        ].map(({ l, active }) => (
          <span
            key={l}
            className={`text-[11px] uppercase tracking-wider px-3 py-1 rounded-full ${
              active
                ? 'bg-cosmos-terracotta text-cosmos-blanc-casse'
                : 'bg-cosmos-marbre text-cosmos-ebene/70 border border-cosmos-bronze/20'
            }`}
          >
            {l}
          </span>
        ))}
      </div>

      <div className="flex-1 px-10 py-5 grid grid-cols-4 gap-4 overflow-hidden bg-cosmos-marbre/40">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white border border-cosmos-bronze/20 rounded p-2.5 flex flex-col gap-2"
          >
            <div
              className="aspect-square rounded-sm"
              style={{ background: tilePalettes[i % tilePalettes.length] }}
            />
            <div className="text-[12px] font-semibold leading-tight text-cosmos-vert-profond">
              Enseigne {i + 1}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-cosmos-bronze">
              <Star size={10} className="text-cosmos-terracotta" />
              <span>Niveau {(i % 3) + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   ÉCRAN 3 — DESKTOP : Hero + sections
   ============================================================ */
const DesktopScreen: React.FC = () => (
  <div className="w-full h-full bg-cosmos-marbre text-cosmos-ebene overflow-hidden flex flex-col">
    <div className="bg-cosmos-ebene text-cosmos-sable px-10 py-1.5 text-[11px] flex justify-between">
      <span>Ouvert aujourd'hui · 10h – 22h</span>
      <span className="flex gap-5">
        <span>FR / EN</span>
        <span className="text-cosmos-or-clair">Cosmos Club</span>
        <span className="text-cosmos-terracotta">Pro</span>
      </span>
    </div>

    <div className="bg-cosmos-bleu-nuit text-cosmos-marbre px-10 py-4 flex items-center justify-between">
      <CosmosLogo height={42} dotColor="rgb(var(--cosmos-or-clair, 217 201 160))" />
      <div className="flex gap-7 text-[12px] uppercase tracking-[0.25em]">
        <span>Boutiques</span>
        <span>Restaurants</span>
        <span>Loisirs</span>
        <span>Événements</span>
        <span>Services</span>
        <span>Préparer la visite</span>
      </div>
      <div className="flex items-center gap-4">
        <Search size={16} className="text-cosmos-sable" />
        <User size={16} className="text-cosmos-or-clair" />
      </div>
    </div>

    <div
      className="relative flex-1 flex items-center justify-center"
      style={{
        background:
          'radial-gradient(ellipse at top, rgb(var(--cosmos-vert-profond, 45 82 56) / 0.55), rgb(var(--cosmos-bleu-nuit, 10 27 46)) 75%)',
        color: 'rgb(var(--cosmos-marbre, 239 234 216))',
      }}
    >
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full opacity-25"
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <circle
          cx="400"
          cy="200"
          r="180"
          fill="none"
          stroke="rgb(var(--cosmos-or-mat, 199 169 100))"
          strokeWidth="0.8"
        />
        <circle
          cx="400"
          cy="200"
          r="120"
          fill="none"
          stroke="rgb(var(--cosmos-terracotta, 182 106 74))"
          strokeWidth="0.7"
        />
      </svg>

      <div className="relative text-center px-10">
        <p className="text-[11px] uppercase tracking-[0.5em] text-cosmos-or-clair mb-4">
          Centre commercial premium · Cocody Angré
        </p>
        <h1 className="font-cormorant text-7xl leading-none text-cosmos-blanc-casse">
          Le meilleur du quotidien,
          <br />
          <em className="not-italic font-medium text-cosmos-terracotta">ici.</em>
        </h1>
        <div className="flex justify-center gap-4 mt-7">
          <button className="bg-cosmos-terracotta text-cosmos-blanc-casse px-6 py-2.5 text-[11px] uppercase tracking-[0.3em] font-semibold">
            Explorer les enseignes
          </button>
          <button className="border border-cosmos-or-clair text-cosmos-or-clair px-6 py-2.5 text-[11px] uppercase tracking-[0.3em]">
            Préparer ma visite
          </button>
        </div>
      </div>
    </div>

    <div className="bg-cosmos-blanc-casse grid grid-cols-4 gap-2 px-10 py-5">
      {[
        {
          i: ShoppingBag,
          l: 'Shopping',
          n: '63 enseignes',
          accent: 'text-cosmos-terracotta',
          bg: 'bg-white',
        },
        {
          i: Utensils,
          l: 'Restaurants',
          n: '14 restaurants',
          accent: 'text-cosmos-vert-profond',
          bg: 'bg-cosmos-sable/40',
        },
        {
          i: Sparkles,
          l: 'Loisirs',
          n: 'Cinéma · Kids',
          accent: 'text-cosmos-or-mat',
          bg: 'bg-white',
        },
        {
          i: Calendar,
          l: 'Événements',
          n: 'Cette semaine',
          accent: 'text-cosmos-bronze',
          bg: 'bg-cosmos-marbre',
        },
      ].map(({ i: Icon, l, n, accent, bg }) => (
        <div
          key={l}
          className={`${bg} border border-cosmos-bronze/20 p-3 flex items-center gap-3`}
        >
          <Icon size={22} className={accent} strokeWidth={1.3} />
          <div className="flex-1">
            <div className="text-[12px] uppercase tracking-wider font-semibold text-cosmos-ebene">
              {l}
            </div>
            <div className="text-[10px] text-cosmos-ebene/60">{n}</div>
          </div>
          <ChevronRight size={14} className={accent} />
        </div>
      ))}
    </div>
  </div>
);

/* ============================================================
   ÉCRAN 4 — WAYFINDER
   ============================================================ */
const WayfinderScreen: React.FC = () => {
  const actions = [
    {
      i: ShoppingBag,
      l: 'Boutiques',
      bg: 'bg-cosmos-terracotta/15',
      border: 'border-cosmos-terracotta/50',
      text: 'text-cosmos-terracotta',
    },
    {
      i: Utensils,
      l: 'Restauration',
      bg: 'bg-cosmos-raphia/15',
      border: 'border-cosmos-raphia/50',
      text: 'text-cosmos-raphia',
    },
    {
      i: MapPin,
      l: 'Toilettes',
      bg: 'bg-cosmos-vert-profond/15',
      border: 'border-cosmos-vert-profond/60',
      text: 'text-cosmos-vert-profond',
    },
    {
      i: Bell,
      l: 'Accueil',
      bg: 'bg-cosmos-or-clair/15',
      border: 'border-cosmos-or-clair/50',
      text: 'text-cosmos-or-clair',
    },
  ];
  return (
    <div className="w-full h-full bg-cosmos-ebene text-cosmos-sable overflow-hidden flex flex-col">
      <div className="px-6 py-6 flex flex-col items-center gap-3 border-b border-cosmos-or-mat/30">
        <CosmosLogo height={48} dotColor="rgb(var(--cosmos-or-clair, 217 201 160))" />
        <p className="text-[11px] uppercase tracking-[0.5em] text-cosmos-or-clair">
          Plan interactif · Vous êtes ici
        </p>
      </div>

      <div className="px-6 py-5 text-center border-b border-cosmos-or-mat/20">
        <p className="font-cormorant text-4xl leading-tight text-cosmos-blanc-casse">
          Bienvenue
          <br />
          <span className="text-cosmos-terracotta">à Cosmos Angré</span>
        </p>
        <p className="text-[11px] uppercase tracking-[0.3em] text-cosmos-raphia mt-2">
          Touchez l'écran pour naviguer
        </p>
      </div>

      <div className="relative flex-1 m-5 bg-cosmos-bleu-nuit border border-cosmos-or-mat/40 rounded overflow-hidden">
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 280"
          preserveAspectRatio="xMidYMid meet"
        >
          {[40, 100, 160, 220].map((y, i) => (
            <g key={y}>
              <rect
                x="20"
                y={y}
                width="160"
                height="50"
                fill="none"
                stroke="rgb(var(--cosmos-or-mat, 199 169 100))"
                strokeWidth="0.8"
                opacity="0.7"
              />
              {[0, 1, 2, 3, 4].map((j) => {
                const fills = [
                  'rgb(var(--cosmos-terracotta, 182 106 74))',
                  'rgb(var(--cosmos-raphia, 197 168 116))',
                  'rgb(var(--cosmos-or-clair, 217 201 160))',
                  'rgb(var(--cosmos-vert-profond, 45 82 56))',
                  'rgb(var(--cosmos-bronze, 140 115 56))',
                ];
                return (
                  <rect
                    key={j}
                    x={25 + j * 30}
                    y={y + 5}
                    width="25"
                    height="18"
                    fill={fills[j]}
                    opacity={i === 1 && j === 2 ? 1 : 0.25}
                  />
                );
              })}
              <text
                x="100"
                y={y + 42}
                textAnchor="middle"
                fontSize="7"
                fill="rgb(var(--cosmos-or-clair, 217 201 160))"
                opacity="0.85"
              >
                NIVEAU {3 - i}
              </text>
            </g>
          ))}
          <circle cx="100" cy="115" r="5" fill="rgb(var(--cosmos-terracotta, 182 106 74))">
            <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle
            cx="100"
            cy="115"
            r="10"
            fill="none"
            stroke="rgb(var(--cosmos-terracotta, 182 106 74))"
            strokeWidth="0.6"
          />
        </svg>
        <div className="absolute top-3 right-3 bg-cosmos-ebene/85 border border-cosmos-terracotta/50 px-3 py-1.5 rounded">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-cosmos-terracotta">
            <Navigation size={12} />
            <span>Vous êtes ici</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 grid grid-cols-2 gap-2.5">
        {actions.map(({ i: Icon, l, bg, border, text }) => (
          <div
            key={l}
            className={`${bg} ${border} border rounded p-3 flex items-center gap-2`}
          >
            <Icon size={18} className={text} strokeWidth={1.5} />
            <span className="text-[12px] uppercase tracking-wider text-cosmos-blanc-casse">
              {l}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-cosmos-bleu-nuit px-5 py-3 flex justify-between items-center border-t border-cosmos-or-mat/30">
        <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-cosmos-raphia">
          <Clock size={14} className="text-cosmos-or-clair" />
          <span>Ouvert jusqu'à 22h</span>
        </div>
        <span className="font-cormorant text-cosmos-terracotta text-2xl">14:32</span>
      </div>
    </div>
  );
};

/* ============================================================
   DEVICES MOCKUPS (cadres) — tailles natives lisibles
   ============================================================ */

const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="relative bg-neutral-900 rounded-[44px] shadow-2xl"
    style={{ width: 360, height: 740, padding: 12 }}
  >
    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-5 bg-neutral-950 rounded-full z-10" />
    <div className="w-full h-full rounded-[34px] overflow-hidden bg-black">{children}</div>
    <div className="absolute -right-1 top-32 w-1 h-24 bg-neutral-700 rounded-r" />
    <div className="absolute -left-1 top-24 w-1 h-14 bg-neutral-700 rounded-l" />
    <div className="absolute -left-1 top-44 w-1 h-24 bg-neutral-700 rounded-l" />
  </div>
);

const TabletFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    className="relative bg-neutral-900 rounded-[24px] shadow-2xl"
    style={{ width: 880, height: 640, padding: 22 }}
  >
    <div className="w-full h-full rounded-[10px] overflow-hidden bg-black">{children}</div>
    <div className="absolute top-1/2 -translate-y-1/2 left-3 w-2 h-2 rounded-full bg-neutral-700" />
    <div className="absolute top-1/2 -translate-y-1/2 right-5 w-1.5 h-10 border border-neutral-700 rounded-sm" />
  </div>
);

const LaptopFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col items-center">
    <div
      className="relative bg-neutral-800 rounded-t-lg shadow-2xl"
      style={{ width: 1000, height: 620, padding: 16, paddingTop: 26 }}
    >
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-neutral-600" />
      <div className="w-full h-full rounded-sm overflow-hidden bg-black">{children}</div>
    </div>
    <div
      className="bg-gradient-to-b from-neutral-700 to-neutral-800 rounded-b-2xl shadow-xl"
      style={{ width: 1140, height: 22 }}
    >
      <div className="mx-auto bg-neutral-900 rounded-b-md" style={{ width: 140, height: 7 }} />
    </div>
  </div>
);

const WayfinderFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col items-center">
    <div className="bg-neutral-700 w-14 h-3 rounded-t" />
    <div
      className="relative bg-neutral-900 rounded-md shadow-2xl border-[3px] border-neutral-700"
      style={{ width: 360, height: 780, padding: 14 }}
    >
      <div className="w-full h-full rounded overflow-hidden bg-black">{children}</div>
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-cosmos-gold/90 text-cosmos-night text-[10px] uppercase tracking-[0.3em] px-3 py-1 rounded font-semibold">
        Tactile
      </div>
    </div>
    <div className="mt-7 bg-gradient-to-b from-neutral-700 to-neutral-900 w-24 h-6 rounded-sm" />
    <div className="bg-neutral-800 w-56 h-3 rounded-full mt-1" />
  </div>
);

/* ============================================================
   PAGE
   ============================================================ */

const items: { label: string; sub: string; render: React.ReactNode }[] = [
  {
    label: 'Mobile',
    sub: 'Home · cinematic',
    render: (
      <PhoneFrame>
        <MobileScreen />
      </PhoneFrame>
    ),
  },
  {
    label: 'Tablette',
    sub: 'Répertoire enseignes',
    render: (
      <TabletFrame>
        <TabletScreen />
      </TabletFrame>
    ),
  },
  {
    label: 'Ordinateur',
    sub: "Page d'accueil complète",
    render: (
      <LaptopFrame>
        <DesktopScreen />
      </LaptopFrame>
    ),
  },
  {
    label: 'Wayfinder',
    sub: 'Totem tactile in-mall',
    render: (
      <WayfinderFrame>
        <WayfinderScreen />
      </WayfinderFrame>
    ),
  },
];

const MockupsPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-neutral-950 py-16 px-4 sm:px-8">
      <div className="max-w-[1280px] mx-auto">
        <header className="text-center mb-20">
          <p className="text-xs uppercase tracking-[0.3em] text-cosmos-gold mb-3">
            Affichage digital
          </p>
          <h1 className="font-cormorant text-5xl text-neutral-100">
            Cosmos Angré · Supports de communication
          </h1>
          <p className="text-base text-neutral-400 mt-3">
            Mobile · Tablette · Ordinateur · Wayfinder tactile
          </p>
        </header>

        <div className="flex flex-col items-center gap-32">
          {items.map((item) => (
            <section
              key={item.label}
              className="w-full flex flex-col items-center gap-8 overflow-x-auto"
            >
              <div className="text-center">
                <p className="text-sm uppercase tracking-[0.4em] text-cosmos-gold">{item.label}</p>
                <p className="text-sm text-neutral-500 mt-1.5">{item.sub}</p>
              </div>
              <div className="flex justify-center w-full">{item.render}</div>
            </section>
          ))}
        </div>

        <p className="mt-24 text-center text-xs text-neutral-500 tracking-wide">
          Maquettes illustratives · Charte Cosmos Angré
        </p>
      </div>
    </div>
  );
};

export default MockupsPage;
