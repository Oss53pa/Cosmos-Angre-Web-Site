import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  UtensilsCrossed,
  Clapperboard,
  CalendarDays,
  Crown,
  Hotel,
  Sparkles,
  MapPin,
  Boxes,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import GalaxyCanvas from './GalaxyCanvas';
import GrainOverlay from './GrainOverlay';
import CosmosLogo from '../../ui/CosmosLogo';

/**
 * BrandGalaxy — « La Galaxie des Enseignes ».
 * Navigation originale : chaque univers du centre de vie est une planète qui
 * gravite autour du cœur Cosmos. Survol = arrêt de l'orbite + mise en lumière.
 * Repli en grille élégante sur mobile et en mode mouvement réduit.
 */

interface Planet {
  /** libellé court affiché sur l'orbite */
  short: string;
  label: string;
  desc: string;
  path: string;
  icon: LucideIcon;
  ring: 0 | 1;
  /** position angulaire de départ (degrés) */
  start: number;
}

// Univers reliés aux routes réelles — arborescence hybride
const PLANETS: Planet[] = [
  { short: 'Enseignes', label: 'Les Enseignes', desc: 'Mode, beauté, et l’envie de se faire plaisir', path: '/boutiques', icon: ShoppingBag, ring: 0, start: -90 },
  { short: 'Restaurants', label: 'Restaurants & Cafés', desc: 'Une faim, mille tables', path: '/gastronomie', icon: UtensilsCrossed, ring: 0, start: 30 },
  { short: 'Agenda', label: "L'Agenda", desc: 'Ce qui fait vibrer tout Angré', path: '/evenements', icon: CalendarDays, ring: 0, start: 150 },
  { short: 'Loisirs', label: 'Loisirs & Culture', desc: 'Le grand écran et les fous rires', path: '/loisirs', icon: Clapperboard, ring: 1, start: -85 },
  { short: 'Cosmos Club', label: 'Cosmos Club', desc: 'Vos avantages, vos privilèges', path: '/fidelite', icon: Crown, ring: 1, start: -25 },
  { short: 'Retail Park', label: 'Retail Park', desc: 'Quatre grandes enseignes, et bientôt bien plus', path: '/retail-park', icon: Boxes, ring: 1, start: 35 },
  { short: 'Hôtel', label: 'Hôtel', desc: 'Dormir au cœur de l’effervescence', path: '/hotel', icon: Hotel, ring: 1, start: 95 },
  { short: 'Services', label: 'Services', desc: 'Tout pour vous faciliter la vie', path: '/services', icon: Sparkles, ring: 1, start: 155 },
  { short: 'Plan & Accès', label: 'Plan & Accès', desc: 'Votre chemin, votre parking', path: '/plan-interactif', icon: MapPin, ring: 1, start: 215 },
];

const RING_FRACTION = [0.52, 0.82]; // rayon relatif au rayon utile
const RING_DIR = [1, -1]; // sens de rotation
const RING_SPEED = [0.55, 0.4];
const ELLIPSE = 0.56; // aplatissement vertical (galaxie franchement inclinée)
const PAD_X = 160; // marge horizontale (bulles + pastilles libellés)
const PAD_Y = 92; // marge verticale

const BrandGalaxy: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const orbitRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const linesGroupRef = useRef<SVGGElement | null>(null);
  const pausedRef = useRef(false);
  const angleRef = useRef(0);
  const rafRef = useRef(0);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const place = () => {
      const W = container.clientWidth;
      const H = container.clientHeight;
      const outer = RING_FRACTION[RING_FRACTION.length - 1];
      // Rayon utile maximal : on remplit la largeur, plafonné par la hauteur disponible.
      const R = Math.max(
        120,
        Math.min((W / 2 - PAD_X) / outer, (H / 2 - PAD_Y) / (outer * ELLIPSE))
      );

      // Dimensionne les orbites (en px, pour suivre le rayon utile)
      RING_FRACTION.forEach((f, i) => {
        const o = orbitRef.current[i];
        if (!o) return;
        o.style.width = `${2 * R * f}px`;
        o.style.height = `${2 * R * f * ELLIPSE}px`;
      });

      // Lignes de constellation (cœur → planètes)
      if (linesGroupRef.current) {
        linesGroupRef.current.setAttribute('transform', `translate(${W / 2}, ${H / 2})`);
      }

      PLANETS.forEach((p, i) => {
        const node = nodeRefs.current[i];
        if (!node) return;
        const dir = RING_DIR[p.ring];
        const speed = RING_SPEED[p.ring];
        const deg = p.start + angleRef.current * speed * dir;
        const rad = (deg * Math.PI) / 180;
        const radius = R * RING_FRACTION[p.ring];
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius * ELLIPSE; // ellipse (galaxie inclinée)
        node.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        const line = lineRefs.current[i];
        if (line) {
          line.setAttribute('x2', x.toFixed(1));
          line.setAttribute('y2', y.toFixed(1));
        }
        // profondeur : les planètes « devant » (y>0) passent au-dessus
        node.style.zIndex = String(10 + Math.round((y / radius + 1) * 10));
        const depth = 0.82 + ((y / radius) + 1) / 2 * 0.28;
        const inner = node.firstElementChild as HTMLElement | null;
        if (inner) {
          inner.style.setProperty('--depth', depth.toFixed(3));
          // Libellé au-dessus pour la moitié haute (évite de recouvrir le cœur)
          inner.style.flexDirection = y < -6 ? 'column-reverse' : 'column';
        }
      });
    };

    const tick = () => {
      if (!pausedRef.current) angleRef.current += 0.18;
      place();
      rafRef.current = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(() => {
      place();
    });
    ro.observe(container);

    place();
    if (!reduced) rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <section
      id="galaxie-enseignes"
      className="section bg-cosmos-night-deep relative overflow-hidden"
    >
      {/* Fond galaxie discret (cœur centré) */}
      <div className="absolute inset-0 opacity-70">
        <GalaxyCanvas
          density="med"
          interactive={false}
          speed={0.6}
          opacity={0.8}
          centerX={0.5}
          centerY={0.5}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-cosmos-night-deep via-transparent to-cosmos-night-deep pointer-events-none" />
      <GrainOverlay opacity={0.07} />

      <div className="container-cosmos relative z-10">
        {/* En-tête */}
        <div className="text-center mb-8 md:mb-10">
          <span className="overline mb-4 block">La Galaxie Cosmos</span>
          <h2 className="section-title-light">Tout ce que vous aimez tourne autour de vous</h2>
          <p className="section-subtitle-light max-w-2xl mx-auto">
            Chaque planète vous ouvre une porte. Survolez la galaxie, puis posez-vous
            là où vous avez envie d'aller.
          </p>
        </div>

        {/* ── Système orbital (tablette / desktop) ── */}
        <div
          ref={containerRef}
          className="relative mx-auto hidden lg:block w-full h-[82vh] max-h-[900px] min-h-[540px]"
        >
          {/* Orbites (dimensionnées en JS pour suivre le rayon utile) */}
          {RING_FRACTION.map((_, i) => (
            <div
              key={i}
              ref={(el) => (orbitRef.current[i] = el)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-cosmos-gold/22 pointer-events-none"
            />
          ))}

          {/* Lignes de constellation (cœur → planètes) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 5 }}
            aria-hidden="true"
          >
            <g
              ref={linesGroupRef}
              style={{ stroke: 'rgb(var(--cosmos-gold))', strokeOpacity: 0.18, strokeWidth: 1 }}
            >
              {PLANETS.map((p, i) => (
                <line
                  key={p.path}
                  ref={(el) => (lineRefs.current[i] = el)}
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={0}
                />
              ))}
            </g>
          </svg>

          {/* Cœur Cosmos */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center pointer-events-none w-60">
            <div
              className="absolute -inset-14 rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgb(var(--cosmos-gold) / 0.22), transparent 70%)',
              }}
            />
            <div className="relative">
              <div className="inline-block">
                <CosmosLogo height={54} />
              </div>
              <div className="mt-4 h-12 flex items-center justify-center">
                {hovered !== null ? (
                  <div className="animate-fade-in">
                    <p className="font-cormorant text-lg text-cosmos-gold-light leading-tight">
                      {PLANETS[hovered].label}
                    </p>
                    <p className="text-[11px] text-cosmos-cream/55 font-inter font-light mt-0.5">
                      {PLANETS[hovered].desc}
                    </p>
                  </div>
                ) : (
                  <p className="text-[10px] text-cosmos-cream/40 font-inter font-light uppercase tracking-[0.25em]">
                    Centre de vie · Angré
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Planètes */}
          {PLANETS.map((p, i) => {
            const Icon = p.icon;
            const active = hovered === i;
            return (
              <div
                key={p.path}
                ref={(el) => (nodeRefs.current[i] = el)}
                className="absolute top-1/2 left-1/2"
                style={{ willChange: 'transform' }}
              >
                <Link
                  to={p.path}
                  onMouseEnter={() => {
                    pausedRef.current = true;
                    setHovered(i);
                  }}
                  onMouseLeave={() => {
                    pausedRef.current = false;
                    setHovered(null);
                  }}
                  onFocus={() => {
                    pausedRef.current = true;
                    setHovered(i);
                  }}
                  onBlur={() => {
                    pausedRef.current = false;
                    setHovered(null);
                  }}
                  className="group flex flex-col items-center gap-2 outline-none"
                  style={{
                    transform: 'scale(var(--depth, 1))',
                    transition: 'transform 0.4s var(--ease-premium, ease)',
                  }}
                  aria-label={`${p.label}. ${p.desc}`}
                >
                  <span
                    className={`relative flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                      active
                        ? 'w-24 h-24 border-cosmos-gold bg-cosmos-gold/20 shadow-gold-glow'
                        : 'w-[76px] h-[76px] border-cosmos-gold/40 bg-cosmos-night/70 backdrop-blur-md group-hover:border-cosmos-gold/70 group-hover:bg-cosmos-night/80'
                    }`}
                  >
                    <Icon
                      className={`transition-colors duration-300 ${
                        active ? 'text-cosmos-gold-light' : 'text-cosmos-cream group-hover:text-cosmos-gold'
                      }`}
                      style={{ width: active ? 34 : 30, height: active ? 34 : 30 }}
                      strokeWidth={1.5}
                    />
                  </span>
                  <span
                    className={`whitespace-nowrap rounded-full px-3 py-1 text-[13px] md:text-sm font-inter font-medium uppercase tracking-[0.1em] transition-all duration-300 backdrop-blur-sm ${
                      active
                        ? 'text-cosmos-night bg-cosmos-gold'
                        : 'text-cosmos-cream bg-cosmos-night/55 group-hover:bg-cosmos-night/75'
                    }`}
                  >
                    {p.short}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* ── Repli grille (mobile + tablette) ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 lg:hidden">
          {PLANETS.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.path}
                to={p.path}
                className="flex flex-col items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10 active:bg-white/10"
              >
                <span className="w-11 h-11 flex items-center justify-center rounded-full border border-cosmos-gold/30 bg-cosmos-night/60">
                  <Icon className="w-5 h-5 text-cosmos-gold" strokeWidth={1.5} />
                </span>
                <span>
                  <span className="block font-cormorant text-base text-cosmos-cream leading-tight">
                    {p.label}
                  </span>
                  <span className="block text-[11px] text-cosmos-cream/55 font-inter font-light mt-0.5">
                    {p.desc}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 md:mt-16">
          <Link to="/boutiques" className="btn-secondary">
            Découvrir toutes les enseignes
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BrandGalaxy;
