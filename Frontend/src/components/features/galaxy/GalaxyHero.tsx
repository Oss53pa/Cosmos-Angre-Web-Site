import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import GalaxyCanvas from './GalaxyCanvas';
import GrainOverlay from './GrainOverlay';
import CosmosLogo from '../../ui/CosmosLogo';

/**
 * GalaxyHero — Pièce maîtresse de l'accueil.
 * Galaxie immersive plein écran : le visiteur entre dans l'univers Cosmos Angré.
 */

const heroStyles = `
  @keyframes gh-reveal {
    0% { opacity: 0; transform: translateY(26px) scale(0.96); filter: blur(6px); }
    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
  }
  @keyframes gh-fade {
    0% { opacity: 0; transform: translateY(18px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes gh-ring {
    from { transform: translate(-50%, -50%) rotate(0deg); }
    to { transform: translate(-50%, -50%) rotate(360deg); }
  }
  @keyframes gh-ring-rev {
    from { transform: translate(-50%, -50%) rotate(360deg); }
    to { transform: translate(-50%, -50%) rotate(0deg); }
  }
  @keyframes gh-bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  .gh-anim { opacity: 0; animation: gh-fade 1s var(--ease-premium, cubic-bezier(0.4,0,0.2,1)) forwards; }
  @media (prefers-reduced-motion: reduce) {
    .gh-anim, .gh-reveal { opacity: 1 !important; animation: none !important; transform: none !important; filter: none !important; }
    .gh-ring { animation: none !important; }
  }
`;

const GalaxyHero: React.FC = () => {
  const scrollToGalaxy = useCallback(() => {
    document.getElementById('galaxie-enseignes')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden bg-cosmos-night-deep"
      aria-label="Cosmos Angré, centre de vie à Angré"
    >
      <style>{heroStyles}</style>

      {/* ── Galaxie ── */}
      <div className="absolute inset-0">
        <GalaxyCanvas density="high" interactive speed={1} />
      </div>

      {/* ── Anneaux orbitaux signature (motif discret) ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="gh-ring absolute rounded-full border border-cosmos-gold/25"
          style={{
            width: '70vmin',
            height: '70vmin',
            top: '46%',
            left: '62%',
            animation: 'gh-ring 60s linear infinite',
          }}
        />
        <div
          className="gh-ring absolute rounded-full border border-cosmos-gold/15"
          style={{
            width: '110vmin',
            height: '110vmin',
            top: '46%',
            left: '62%',
            animation: 'gh-ring-rev 90s linear infinite',
          }}
        />
      </div>

      {/* ── Vignette + dégradé de fondu vers la section suivante ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(120% 90% at 62% 46%, transparent 35%, rgb(var(--cosmos-night-deep) / 0.55) 100%)',
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-cosmos-night-deep pointer-events-none" />
      <GrainOverlay opacity={0.06} />

      {/* ── Contenu ── */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container-cosmos w-full">
          <div className="max-w-2xl">
            {/* Overline */}
            <div
              className="gh-anim inline-flex items-center gap-3 mb-8"
              style={{ animationDelay: '0.2s' }}
            >
              <span className="w-8 h-px bg-cosmos-gold/60" />
              <span className="overline text-cosmos-gold">Angré · Cocody · Abidjan</span>
            </div>

            {/* Wordmark */}
            <div
              className="origin-left"
              style={{
                animation: 'gh-reveal 1.4s var(--ease-premium, cubic-bezier(0.4,0,0.2,1)) forwards',
              }}
            >
              <div className="scale-[1.4] sm:scale-[1.65] md:scale-[1.9] lg:scale-[2.1] origin-left inline-block">
                <CosmosLogo height={48} />
              </div>
            </div>
            {/* Espace réservé au logo agrandi (le scale déborde de sa boîte) */}
            <div className="h-8 sm:h-12 md:h-16 lg:h-20" />

            {/* Headline */}
            <h1
              className="gh-anim font-cormorant text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-cosmos-cream font-light leading-[1.04] mb-7"
              style={{ animationDelay: '0.5s' }}
            >
              Le meilleur du quotidien,
              <br className="hidden sm:block" /> <span className="text-gradient-gold italic">ici.</span>
            </h1>

            {/* Subtitle */}
            <p
              className="gh-anim text-lg md:text-xl text-cosmos-cream/65 font-inter font-light max-w-xl leading-relaxed mb-10"
              style={{ animationDelay: '0.7s' }}
            >
              Vos boutiques, vos tables, vos sorties, vos plus beaux moments.
              Tout ce qui fait la vie à Angré, réuni ici.
            </p>

            {/* CTAs */}
            <div
              className="gh-anim flex flex-col sm:flex-row gap-4"
              style={{ animationDelay: '0.9s' }}
            >
              <button onClick={scrollToGalaxy} className="btn-primary">
                <Sparkles className="w-4 h-4" strokeWidth={1.5} />
                Explorer la galaxie
              </button>
              <Link to="/preparer-visite" className="btn-outline">
                Préparer ma visite
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>

            {/* Opening chip */}
            <div
              className="gh-anim inline-flex items-center gap-3 mt-12 px-5 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10"
              style={{ animationDelay: '1.1s' }}
            >
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
      </div>

      {/* ── Indice de scroll ── */}
      <button
        onClick={scrollToGalaxy}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 group"
        aria-label="Explorer la galaxie des enseignes"
        style={{ animation: 'gh-bob 2.6s ease-in-out infinite' }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-inter font-light text-cosmos-cream/40 group-hover:text-cosmos-gold/80 transition-colors">
          Explorer
        </span>
        <div className="w-7 h-11 border border-cosmos-gold/25 rounded-full flex items-start justify-center pt-2 group-hover:border-cosmos-gold/50 transition-colors">
          <ChevronDown className="w-3.5 h-3.5 text-cosmos-gold/50" strokeWidth={1.5} />
        </div>
      </button>
    </section>
  );
};

export default GalaxyHero;
