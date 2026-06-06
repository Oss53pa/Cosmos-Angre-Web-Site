import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ChevronDown,
  ShoppingBag,
  UtensilsCrossed,
  Gamepad2,
  Sparkles,
  Leaf,
  Gem,
  Gift,
  Star,
  Coffee,
  Film,
  Hotel,
  Crown,
} from 'lucide-react';
import CosmosLogo from '../ui/CosmosLogo';

// ─────────────────────────────────────────────
// CSS Keyframes (scoped to .cinematic-hero)
// ─────────────────────────────────────────────
const heroStyles = `
  @keyframes ch-twinkle {
    0%, 100% { opacity: 0.12; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.3); }
  }
  @keyframes ch-build-up {
    0% { transform: scaleY(0); opacity: 0; }
    100% { transform: scaleY(1); opacity: 1; }
  }
  @keyframes ch-window-glow {
    0%, 100% { opacity: 0.06; }
    50% { opacity: 0.75; }
  }
  @keyframes ch-walk {
    0% { transform: translateX(-30px); }
    100% { transform: translateX(calc(100vw + 30px)); }
  }
  @keyframes ch-float-up {
    0% { opacity: 0; transform: translateY(0) scale(0.5); }
    12% { opacity: 0.4; transform: translateY(-12vh) scale(1); }
    80% { opacity: 0.4; transform: translateY(-72vh) scale(1); }
    100% { opacity: 0; transform: translateY(-88vh) scale(0.4); }
  }
  @keyframes ch-ring-pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(0.85); opacity: 0.1; }
    50% { transform: translate(-50%, -50%) scale(1.06); opacity: 0.03; }
  }
  @keyframes ch-ring-rotate {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
  @keyframes ch-logo-reveal {
    0% { opacity: 0; transform: scale(0.8); }
    55% { opacity: 1; }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes ch-fade-up {
    0% { opacity: 0; transform: translateY(22px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes ch-scene-in {
    0% { opacity: 0; transform: translateY(24px) scale(0.97); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes ch-glow-drift {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.12; }
    33% { transform: translate(25px, -18px) scale(1.08); opacity: 0.18; }
    66% { transform: translate(-18px, 12px) scale(0.93); opacity: 0.1; }
  }
  @keyframes ch-progress {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
  @keyframes ch-bag-float {
    0%, 100% { transform: translateY(0) rotate(-3deg); }
    50% { transform: translateY(-8px) rotate(3deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .cinematic-hero *,
    .cinematic-hero *::before,
    .cinematic-hero *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
    }
  }
`;

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const INTRO_DURATION = 4500;
const SCENE_DURATION = 5000;

interface SceneDef {
  icon: React.ElementType;
  key: string;
}

const SCENES: SceneDef[] = [
  { icon: ShoppingBag, key: 'shopping' },
  { icon: UtensilsCrossed, key: 'gastronomy' },
  { icon: Gamepad2, key: 'leisure' },
  { icon: Sparkles, key: 'wellness' },
  { icon: Leaf, key: 'edge' },
];

const TOTAL_PHASES = SCENES.length + 1;

// Monochrome floating icons (Lucide components)
const FLOATING_ICONS: React.ElementType[] = [
  ShoppingBag,
  Gem,
  Gift,
  Star,
  Coffee,
  Film,
  Hotel,
  Crown,
];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
const CinematicHero: React.FC = () => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<'intro' | 'scenes'>('intro');
  const [currentScene, setCurrentScene] = useState(0);

  // ── Procedurally generated elements (stable) ──

  const stars = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 65,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 2,
      })),
    []
  );

  const buildings = useMemo(() => {
    const count = 18;
    return Array.from({ length: count }, (_, i) => {
      const w = Math.random() * 30 + 25;
      const h = Math.random() * 70 + 40;
      const cols = Math.max(1, Math.floor(w / 14));
      const rows = Math.max(1, Math.floor(h / 16));
      const windows: { rx: number; ry: number; d: number; dur: number }[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() > 0.25) {
            windows.push({
              rx: ((c + 0.5) / cols) * 100,
              ry: ((r + 0.5) / rows) * 100,
              d: Math.random() * 5,
              dur: Math.random() * 3 + 2,
            });
          }
        }
      }
      return { id: i, x: (i / count) * 100, w, h, delay: i * 0.07, windows };
    });
  }, []);

  const people = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        id: i,
        speed: Math.random() * 20 + 18,
        delay: Math.random() * 14,
        bottom: Math.random() * 2.5 + 0.5,
        scale: Math.random() * 0.25 + 0.7,
        hasBag: Math.random() > 0.35,
      })),
    []
  );

  const floatingIcons = useMemo(
    () =>
      FLOATING_ICONS.map((Icon, i) => ({
        Icon,
        id: i,
        x: Math.random() * 80 + 10,
        delay: i * 1.8 + Math.random() * 2,
        duration: Math.random() * 4 + 8,
      })),
    []
  );

  // ── Phase management ──

  useEffect(() => {
    const timer = setTimeout(() => setPhase('scenes'), INTRO_DURATION);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== 'scenes') return;
    const interval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % TOTAL_PHASES);
    }, SCENE_DURATION);
    return () => clearInterval(interval);
  }, [phase]);

  const skipIntro = useCallback(() => setPhase('scenes'), []);

  const scrollToCarousel = useCallback(() => {
    document.getElementById('hero-carousel')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const isCTA = phase === 'scenes' && currentScene === SCENES.length;

  // ── Render ──

  return (
    <>
      <style>{heroStyles}</style>

      <section
        className="cinematic-hero relative min-h-screen overflow-hidden"
        style={{
          background:
            'linear-gradient(160deg, rgb(var(--cosmos-night-deep)) 0%, rgb(var(--cosmos-night)) 35%, rgb(var(--cosmos-night-light)) 100%)',
        }}
        aria-label="Cosmos Angré"
      >
        {/* ── Gold Glow Orbs ── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute w-[450px] h-[450px] rounded-full"
            style={{
              top: '8%',
              left: '-5%',
              background:
                'radial-gradient(circle, rgb(var(--cosmos-gold) / 0.12) 0%, transparent 70%)',
              animation: 'ch-glow-drift 12s ease-in-out infinite',
            }}
          />
          <div
            className="absolute w-[380px] h-[380px] rounded-full"
            style={{
              top: '28%',
              right: '-3%',
              background:
                'radial-gradient(circle, rgb(var(--cosmos-gold) / 0.07) 0%, transparent 70%)',
              animation: 'ch-glow-drift 15s 3s ease-in-out infinite',
            }}
          />
          <div
            className="absolute w-[320px] h-[320px] rounded-full"
            style={{
              bottom: '18%',
              left: '30%',
              background:
                'radial-gradient(circle, rgb(var(--cosmos-gold) / 0.05) 0%, transparent 70%)',
              animation: 'ch-glow-drift 10s 6s ease-in-out infinite',
            }}
          />
        </div>

        {/* ── Stars ── */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {stars.map((s) => (
            <div
              key={s.id}
              className="absolute rounded-full bg-white/80"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.size,
                height: s.size,
                animation: `ch-twinkle ${s.duration}s ${s.delay}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>

        {/* ── Cosmos Rings ── */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute rounded-full border border-cosmos-gold/10"
            style={{
              width: 500,
              height: 500,
              top: '20%',
              left: '70%',
              animation: 'ch-ring-pulse 8s ease-in-out infinite',
            }}
          />
          <div
            className="absolute rounded-full border border-cosmos-gold/[0.04]"
            style={{
              width: 700,
              height: 700,
              top: '50%',
              left: '15%',
              animation: 'ch-ring-rotate 45s linear infinite',
            }}
          />
        </div>

        {/* ── Main Content ── */}
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center px-6">
            {phase === 'intro' ? (
              /* ── Intro: Logo Reveal ── */
              <div className="flex flex-col items-center">
                {/* Cosmos Angré Logo — scaled up for hero impact */}
                <div
                  className="mb-10 opacity-0"
                  style={{
                    animation: 'ch-logo-reveal 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                  }}
                >
                  <div className="transform scale-[2] sm:scale-[2.5] md:scale-[3] lg:scale-[3.5]">
                    <CosmosLogo height={48} />
                  </div>
                </div>

                {/* Spacer for scaled logo */}
                <div className="h-8 sm:h-12 md:h-16 lg:h-20" />

                <div
                  className="w-16 h-px bg-cosmos-gold/40 mb-6 opacity-0"
                  style={{ animation: 'ch-fade-up 0.8s 1.8s ease-out forwards' }}
                />

                <p
                  className="font-inter text-xs sm:text-sm text-cosmos-cream/60 uppercase tracking-[0.3em] font-light opacity-0"
                  style={{ animation: 'ch-fade-up 1s 2.2s ease-out forwards' }}
                >
                  {t('home.cinematic.tagline')}
                </p>
              </div>
            ) : (
              /* ── Scene Content ── */
              <div key={currentScene} style={{ animation: 'ch-scene-in 0.8s ease-out forwards' }}>
                {!isCTA ? (
                  /* ── Regular Scene ── */
                  (() => {
                    const SceneIcon = SCENES[currentScene].icon;
                    return (
                      <>
                        <SceneIcon
                          className="w-12 h-12 sm:w-14 sm:h-14 text-cosmos-gold/60 mx-auto mb-6"
                          strokeWidth={1}
                        />
                        <h2 className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cosmos-cream font-light mb-4 leading-tight">
                          {t(`home.cinematic.scenes.${SCENES[currentScene].key}.title`)}
                        </h2>
                        <div className="w-12 h-px bg-cosmos-gold/50 mx-auto mb-4" />
                        <p className="font-inter text-sm sm:text-base text-cosmos-cream/45 font-light tracking-wide max-w-lg mx-auto">
                          {t(`home.cinematic.scenes.${SCENES[currentScene].key}.subtitle`)}
                        </p>
                      </>
                    );
                  })()
                ) : (
                  /* ── CTA Scene ── */
                  <>
                    {/* Cosmos Logo — smaller for CTA */}
                    <div className="mb-6 flex justify-center">
                      <div className="transform scale-[1.5] sm:scale-[1.8] md:scale-[2.2]">
                        <CosmosLogo height={48} />
                      </div>
                    </div>
                    {/* Spacer for scaled logo */}
                    <div className="h-4 sm:h-6 md:h-8" />
                    <p className="font-cormorant text-xl sm:text-2xl text-cosmos-gold font-light tracking-[0.1em] mb-6">
                      {t('home.cinematic.cta.opening')}
                    </p>
                    <div className="w-12 h-px bg-cosmos-gold/40 mx-auto mb-6" />
                    <p className="font-inter text-sm text-cosmos-cream/60 font-light tracking-wide mb-10 max-w-md mx-auto">
                      {t('home.cinematic.cta.subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button onClick={scrollToCarousel} className="btn-primary">
                        {t('home.hero.discoverCta')}
                        <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <Link to="/preparer-visite" className="btn-outline">
                        {t('home.hero.planVisitCta')}
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Animated Skyline ── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[140px] sm:h-[180px] pointer-events-none"
          aria-hidden="true"
        >
          {buildings.map((b) => (
            <div
              key={b.id}
              className="absolute bottom-0"
              style={{
                left: `${b.x}%`,
                width: b.w,
                height: b.h,
                background:
                  'linear-gradient(180deg, rgb(var(--cosmos-night) / 0.5) 0%, rgb(var(--cosmos-night) / 0.85) 100%)',
                borderTop: '1px solid rgb(var(--cosmos-gold) / 0.06)',
                transformOrigin: 'bottom',
                animation: `ch-build-up 1s ${b.delay}s ease-out forwards`,
                opacity: 0,
              }}
            >
              {b.windows.map((w, wi) => (
                <div
                  key={wi}
                  className="absolute w-[3px] h-[3px] rounded-[0.5px] bg-cosmos-gold"
                  style={{
                    left: `${w.rx}%`,
                    top: `${w.ry}%`,
                    animation: `ch-window-glow ${w.dur}s ${w.d}s ease-in-out infinite`,
                  }}
                />
              ))}
            </div>
          ))}
          {/* Ground accent line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgb(var(--cosmos-gold) / 0.12), transparent)',
            }}
          />
        </div>

        {/* ── Walking People ── */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
          {people.map((p) => (
            <div
              key={p.id}
              className="absolute"
              style={{
                bottom: `${p.bottom}%`,
                left: 0,
                animation: `ch-walk ${p.speed}s ${p.delay}s linear infinite`,
              }}
            >
              <div style={{ transform: `scale(${p.scale})` }}>
                {/* Silhouette */}
                <svg width="14" height="28" viewBox="0 0 14 28" fill="none">
                  <circle cx="7" cy="3.5" r="3" fill="rgb(var(--cosmos-gold) / 0.22)" />
                  <rect
                    x="4"
                    y="7"
                    width="6"
                    height="12"
                    rx="2"
                    fill="rgb(var(--cosmos-gold) / 0.18)"
                  />
                  <rect
                    x="3"
                    y="20"
                    width="3"
                    height="8"
                    rx="1"
                    fill="rgb(var(--cosmos-gold) / 0.13)"
                  />
                  <rect
                    x="8"
                    y="20"
                    width="3"
                    height="8"
                    rx="1"
                    fill="rgb(var(--cosmos-gold) / 0.13)"
                  />
                </svg>
                {/* Shopping bag */}
                {p.hasBag && (
                  <div
                    className="absolute -right-2 top-3"
                    style={{ animation: 'ch-bag-float 3s ease-in-out infinite' }}
                  >
                    <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
                      <rect
                        x="0"
                        y="3"
                        width="8"
                        height="7"
                        rx="1"
                        fill="rgb(var(--cosmos-gold) / 0.25)"
                      />
                      <path
                        d="M2 3 C2 1 6 1 6 3"
                        stroke="rgb(var(--cosmos-gold) / 0.18)"
                        strokeWidth="1"
                        fill="none"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── Floating Icons (monochrome gold) ── */}
        {phase === 'scenes' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {floatingIcons.map((item) => {
              const FloatIcon = item.Icon;
              return (
                <div
                  key={item.id}
                  className="absolute bottom-0"
                  style={{
                    left: `${item.x}%`,
                    animation: `ch-float-up ${item.duration}s ${item.delay}s ease-in-out infinite`,
                    opacity: 0,
                  }}
                >
                  <FloatIcon
                    className="w-5 h-5 sm:w-6 sm:h-6 text-cosmos-gold/25"
                    strokeWidth={1}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* ── Progress Bar ── */}
        {phase === 'scenes' && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.04] z-20">
            <div
              key={`progress-${currentScene}`}
              className="h-full bg-cosmos-gold/50 origin-left"
              style={{
                animation: `ch-progress ${SCENE_DURATION}ms linear forwards`,
              }}
            />
          </div>
        )}

        {/* ── Skip Intro Button ── */}
        {phase === 'intro' && (
          <button
            onClick={skipIntro}
            className="absolute bottom-8 right-8 z-30 px-4 py-2 text-[10px] uppercase tracking-[0.2em] font-inter font-light text-cosmos-cream/25 hover:text-cosmos-cream/60 border border-white/[0.06] hover:border-white/15 rounded transition-all duration-300 opacity-0"
            style={{ animation: 'ch-fade-up 0.6s 2s ease-out forwards' }}
          >
            {t('home.cinematic.skipIntro')}
          </button>
        )}

        {/* ── Scroll to Carousel CTA ── */}
        <button
          onClick={scrollToCarousel}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 group cursor-pointer"
          aria-label="D\u00e9couvrir"
        >
          <span className="text-[10px] uppercase tracking-[0.25em] font-inter font-light text-cosmos-cream/30 group-hover:text-cosmos-gold/70 transition-colors duration-500">
            {t('home.cinematic.discover', 'D\u00e9couvrir')}
          </span>
          <div className="w-8 h-12 border border-cosmos-gold/20 rounded-full flex items-start justify-center pt-2 group-hover:border-cosmos-gold/40 transition-colors duration-500">
            <ChevronDown
              className="w-3.5 h-3.5 text-cosmos-gold/40 group-hover:text-cosmos-gold animate-bounce transition-colors duration-500"
              strokeWidth={1.5}
            />
          </div>
        </button>
      </section>
    </>
  );
};

export default CinematicHero;
