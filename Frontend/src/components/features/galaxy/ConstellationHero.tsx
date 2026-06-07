import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  ChevronDown,
  type LucideIcon,
} from 'lucide-react';
import GalaxyCanvas from './GalaxyCanvas';
import GrainOverlay from './GrainOverlay';
import CosmosLogo from '../../ui/CosmosLogo';

/**
 * ConstellationHero — PROTOTYPE (version A).
 * La galaxie des enseignes DEVIENT le hero : la signature flotte au centre,
 * les univers gravitent en étoiles nommées et navigables tout autour.
 */

interface Planet {
  short: string;
  label: string;
  desc: string;
  path: string;
  icon: LucideIcon;
  ring: 0 | 1;
  start: number;
}

const PLANETS: Planet[] = [
  { short: 'Enseignes', label: 'Les Enseignes', desc: 'Mode, beauté, plaisir', path: '/boutiques', icon: ShoppingBag, ring: 0, start: -90 },
  { short: 'Restaurants', label: 'Restaurants & Cafés', desc: 'Une faim, mille tables', path: '/gastronomie', icon: UtensilsCrossed, ring: 0, start: 30 },
  { short: 'Agenda', label: "L'Agenda", desc: 'Ce qui fait vibrer Angré', path: '/evenements', icon: CalendarDays, ring: 0, start: 150 },
  { short: 'Loisirs', label: 'Loisirs & Culture', desc: 'Grand écran et fous rires', path: '/loisirs', icon: Clapperboard, ring: 1, start: -85 },
  { short: 'Cosmos Club', label: 'Cosmos Club', desc: 'Vos avantages, vos privilèges', path: '/fidelite', icon: Crown, ring: 1, start: -25 },
  { short: 'Retail Park', label: 'Retail Park', desc: 'Quatre grandes enseignes, bientôt plus', path: '/retail-park', icon: Boxes, ring: 1, start: 35 },
  { short: 'Hôtel', label: 'Hôtel', desc: "Au cœur de l'effervescence", path: '/hotel', icon: Hotel, ring: 1, start: 95 },
  { short: 'Services', label: 'Services', desc: 'Tout pour vous faciliter la vie', path: '/services', icon: Sparkles, ring: 1, start: 155 },
  { short: 'Plan & Accès', label: 'Plan & Accès', desc: 'Votre chemin, votre parking', path: '/plan-interactif', icon: MapPin, ring: 1, start: 215 },
];

const RING_FRACTION = [0.58, 0.92];
const RING_DIR = [1, -1];
const RING_SPEED = [0.5, 0.36];
const ELLIPSE = 0.55;
const PAD_X = 180;
const PAD_Y = 110;

interface ConstellationHeroProps {
  /** true = hero plein écran avec signature ; false = section "navigation" sous le hero */
  showSignature?: boolean;
  /** overline affichée en mode section */
  overline?: string;
  /** titre affiché en mode section */
  heading?: string;
}

const ConstellationHero: React.FC<ConstellationHeroProps> = ({
  showSignature = true,
  overline = 'Explorez',
  heading = 'Nos univers',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const orbitRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(SVGLineElement | null)[]>([]);
  const linesGroupRef = useRef<SVGGElement | null>(null);
  const pausedRef = useRef(false);
  const angleRef = useRef(0);
  const rafRef = useRef(0);
  const hoveredRef = useRef<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const enter = (i: number) => {
    pausedRef.current = true;
    hoveredRef.current = i;
    setHovered(i);
  };
  const leave = () => {
    pausedRef.current = false;
    hoveredRef.current = null;
    setHovered(null);
  };

  const scrollDown = useCallback(() => {
    document.getElementById('apres-hero')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

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
      const R = Math.max(
        140,
        Math.min((W / 2 - PAD_X) / outer, (H / 2 - PAD_Y) / (outer * ELLIPSE))
      );

      RING_FRACTION.forEach((f, i) => {
        const o = orbitRef.current[i];
        if (!o) return;
        o.style.width = `${2 * R * f}px`;
        o.style.height = `${2 * R * f * ELLIPSE}px`;
      });

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
        const y = Math.sin(rad) * radius * ELLIPSE;
        node.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        const line = lineRefs.current[i];
        if (line) {
          line.setAttribute('x2', x.toFixed(1));
          line.setAttribute('y2', y.toFixed(1));
          line.setAttribute('stroke-opacity', hoveredRef.current === i ? '0.5' : '0');
        }
        node.style.zIndex = String(10 + Math.round((y / radius + 1) * 5));
        const depth = 0.85 + ((y / radius) + 1) / 2 * 0.25;
        const inner = node.firstElementChild as HTMLElement | null;
        if (inner) {
          inner.style.setProperty('--depth', depth.toFixed(3));
          inner.style.flexDirection = y < -6 ? 'column-reverse' : 'column';
        }
      });
    };

    const tick = () => {
      if (!pausedRef.current) angleRef.current += 0.1;
      place();
      rafRef.current = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(() => place());
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
      id={showSignature ? undefined : 'univers'}
      className="relative min-h-screen w-full overflow-hidden bg-cosmos-night-deep scroll-mt-20"
    >
      {/* Galaxie */}
      <div className="absolute inset-0">
        <GalaxyCanvas
          density="high"
          interactive
          centerX={0.5}
          centerY={0.46}
          coreIntensity={0.36}
          coreScale={0.8}
        />
      </div>
      {/* Voile uniforme : assombrit l'ensemble du hero */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgb(var(--cosmos-night-deep) / 0.32)' }}
      />
      {/* Vignette radiale renforcée (bords plus profonds) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(70% 65% at 50% 46%, transparent 22%, rgb(var(--cosmos-night-deep) / 0.94) 100%)',
        }}
      />
      <GrainOverlay opacity={0.07} />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-cosmos-night-deep pointer-events-none" />

      {/* ── Constellation (desktop large) ── */}
      <div ref={containerRef} className="absolute inset-0 hidden lg:block">
        {RING_FRACTION.map((_, i) => (
          <div
            key={i}
            ref={(el) => (orbitRef.current[i] = el)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] pointer-events-none"
            style={{
              border: '1px solid rgb(var(--cosmos-gold) / 0.18)',
              boxShadow: '0 0 50px rgb(var(--cosmos-gold) / 0.04)',
            }}
          />
        ))}

        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
          <g ref={linesGroupRef} style={{ stroke: 'rgb(var(--cosmos-gold-light))', strokeWidth: 1.5 }}>
            {PLANETS.map((p, i) => (
              <line key={p.path} ref={(el) => (lineRefs.current[i] = el)} x1={0} y1={0} x2={0} y2={0} />
            ))}
          </g>
        </svg>

        {PLANETS.map((p, i) => {
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
                onMouseEnter={() => enter(i)}
                onMouseLeave={leave}
                onFocus={() => enter(i)}
                onBlur={leave}
                className="group flex flex-col items-center gap-2.5 outline-none"
                style={{
                  transform: 'scale(var(--depth, 1))',
                  transition: 'transform 0.5s var(--ease-premium, ease)',
                }}
                aria-label={`${p.label}. ${p.desc}`}
              >
                <span className="relative flex items-center justify-center" style={{ width: 24, height: 24 }}>
                  <span
                    className="absolute rounded-full transition-all duration-500"
                    style={{
                      width: active ? 48 : 24,
                      height: active ? 48 : 24,
                      background: 'radial-gradient(circle, rgb(var(--cosmos-gold-light) / 0.5), transparent 70%)',
                      opacity: active ? 1 : 0.65,
                    }}
                  />
                  <span
                    className="relative rounded-full transition-all duration-500"
                    style={{
                      width: active ? 12 : 7,
                      height: active ? 12 : 7,
                      background: active ? 'rgb(var(--cosmos-gold-bright))' : 'rgb(var(--cosmos-gold-light))',
                      boxShadow: active
                        ? '0 0 20px rgb(var(--cosmos-gold) / 0.9), 0 0 5px rgb(var(--cosmos-cream))'
                        : '0 0 10px rgb(var(--cosmos-gold) / 0.6)',
                    }}
                  />
                </span>
                <span
                  className={`whitespace-nowrap font-inter uppercase transition-all duration-300 ${
                    active
                      ? 'text-cosmos-gold-light text-xs tracking-[0.32em]'
                      : 'text-cosmos-cream/80 text-[11px] tracking-[0.26em] group-hover:text-cosmos-cream'
                  }`}
                  style={{ textShadow: '0 1px 12px rgba(0,0,0,0.9)' }}
                >
                  {p.short}
                </span>
              </Link>
            </div>
          );
        })}
      </div>

      {/* ── Contenu central (signature flottante) — hero uniquement ── */}
      {showSignature && (
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center text-center px-5 py-24 pointer-events-none">
        {/* Voile de lisibilité */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[760px] max-w-[92vw] h-[460px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgb(var(--cosmos-night-deep) / 0.72) 0%, transparent 65%)',
          }}
        />

        <div className="relative pointer-events-auto">
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="w-6 h-px bg-cosmos-gold/60" />
            <span className="overline text-cosmos-gold">Angré · Cocody · Abidjan</span>
            <span className="w-6 h-px bg-cosmos-gold/60" />
          </div>

          <div className="flex justify-center mb-7">
            <div className="scale-[1.25] sm:scale-[1.5] md:scale-[1.7] inline-block">
              <CosmosLogo height={48} />
            </div>
          </div>
          <div className="h-6 sm:h-9 md:h-10" />

          <h1
            className="font-cormorant text-4xl sm:text-5xl md:text-6xl text-cosmos-cream font-light leading-[1.05] mb-9"
            style={{ textShadow: '0 2px 30px rgb(var(--cosmos-night-deep) / 0.9)' }}
          >
            Le meilleur du quotidien,{' '}
            <span className="text-gradient-gold italic">ici.</span>
          </h1>

          <div className="flex justify-center mb-10">
            <Link to="/preparer-visite" className="btn-primary">
              Préparer ma visite
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cosmos-gold/60 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cosmos-gold" />
            </span>
            <span className="text-[11px] text-cosmos-cream/70 font-inter font-light uppercase tracking-[0.2em]">
              Soft opening · Octobre 2026
            </span>
          </div>
        </div>
      </div>
      )}

      {/* ── En-tête (mode "section navigation") — au CENTRE de la galaxie ── */}
      {!showSignature && (
        <div className="relative z-20 min-h-screen flex flex-col items-center justify-center text-center px-5 pointer-events-none">
          {/* Voile de lisibilité au cœur */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] max-w-[90vw] h-[320px] pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgb(var(--cosmos-night-deep) / 0.7) 0%, transparent 65%)',
            }}
          />
          <div className="relative">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="w-6 h-px bg-cosmos-gold/60" />
              <span className="overline text-cosmos-gold">{overline}</span>
              <span className="w-6 h-px bg-cosmos-gold/60" />
            </div>
            <h2
              className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-cosmos-cream font-light text-balance"
              style={{ textShadow: '0 2px 24px rgb(var(--cosmos-night-deep) / 0.8)' }}
            >
              {heading}
            </h2>
          </div>
        </div>
      )}

      {/* ── Repli univers (mobile / tablette) ── */}
      <div className="relative z-20 lg:hidden container-cosmos pb-20 -mt-10">
        <div className="grid grid-cols-2 gap-3">
          {PLANETS.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.path}
                to={p.path}
                className="flex items-center gap-3 p-3.5 rounded-lg bg-white/5 border border-white/10 active:bg-white/10"
              >
                <span className="w-10 h-10 flex items-center justify-center rounded-full border border-cosmos-gold/30 bg-cosmos-night/60 flex-shrink-0">
                  <Icon className="w-5 h-5 text-cosmos-gold" strokeWidth={1.5} />
                </span>
                <span className="block font-inter text-[12px] uppercase tracking-[0.12em] text-cosmos-cream">
                  {p.short}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Indice de scroll — hero uniquement */}
      {showSignature && (
        <button
          onClick={scrollDown}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 z-30 hidden lg:flex flex-col items-center gap-2 group"
          aria-label="Découvrir la suite"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] font-inter font-light text-cosmos-cream/40 group-hover:text-cosmos-gold/80 transition-colors">
            Découvrir
          </span>
          <ChevronDown className="w-4 h-4 text-cosmos-gold/50 animate-bounce" strokeWidth={1.5} />
        </button>
      )}
    </section>
  );
};

export default ConstellationHero;
