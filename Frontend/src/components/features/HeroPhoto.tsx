import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import GrainOverlay from './galaxy/GrainOverlay';
import CosmosLogo from '../ui/CosmosLogo';
import { useContent } from '../../lib/content/SiteContentProvider';
import heroImage from '../../assets/images/branding/edge-building.jpg';

/**
 * HeroPhoto — Hero photographique (direction B).
 * Ancre la promesse dans le réel : rendu architectural plein cadre du centre,
 * voiles premium pour la lisibilité, signature + un seul CTA. Mouvement minimal
 * (léger ken-burns), registre « quiet luxury ».
 */
const HeroPhoto: React.FC = () => {
  const { c } = useContent();
  const scrollDown = useCallback(() => {
    const target =
      document.getElementById('univers') ?? document.getElementById('apres-hero');
    target?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-cosmos-night-deep">
      {/* Photo plein cadre */}
      <div className="absolute inset-0 animate-ken-burns">
        <img
          src={c('home.hero.image') || heroImage}
          alt="Cosmos Angré — la destination de Cocody-Angré"
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Voiles premium (lisibilité + profondeur) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgb(var(--cosmos-night-deep) / 0.55) 0%, rgb(var(--cosmos-night-deep) / 0.22) 38%, rgb(var(--cosmos-night-deep) / 0.88) 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 58%, transparent 42%, rgb(var(--cosmos-night-deep) / 0.6) 100%)',
        }}
      />
      <GrainOverlay opacity={0.06} />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-cosmos-warm pointer-events-none" />

      {/* Contenu centré */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-5 py-24">
        <div className="inline-flex items-center gap-3 mb-6 animate-fade-in-down">
          <span className="w-6 h-px bg-cosmos-gold/60" />
          <span className="overline text-cosmos-gold">
            {c('home.hero.overline', 'Angré · Cocody · Abidjan')}
          </span>
          <span className="w-6 h-px bg-cosmos-gold/60" />
        </div>

        <div className="flex justify-center mb-7 animate-fade-in">
          <div className="scale-[1.25] sm:scale-[1.5] md:scale-[1.7] inline-block">
            <CosmosLogo height={48} />
          </div>
        </div>
        <div className="h-6 sm:h-9 md:h-10" />

        <h1
          className="font-cormorant text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cosmos-cream font-light leading-[1.05] mb-9 animate-fade-in-up text-balance"
          style={{ textShadow: '0 2px 30px rgb(var(--cosmos-night-deep) / 0.9)' }}
        >
          {c('home.hero.tagline', 'Le meilleur du quotidien,')}{' '}
          <span className="text-gradient-gold italic">
            {c('home.hero.tagline_accent', 'ici.')}
          </span>
        </h1>

        <div className="flex justify-center mb-10 animate-fade-in-up">
          <Link to="/preparer-visite" className="btn-primary">
            {c('home.hero.cta', 'Préparer ma visite')}
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>

        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-cosmos-gold/60 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cosmos-gold" />
          </span>
          <span className="text-[11px] text-cosmos-cream/70 font-inter font-light uppercase tracking-[0.2em]">
            {c('home.hero.badge', 'Soft opening · Octobre 2026')}
          </span>
        </div>

        <p className="mt-5 text-[11px] text-cosmos-cream/45 font-inter tracking-[0.14em] uppercase">
          {c('practical.hours', 'Tous les jours · 10h – 22h')}
        </p>
      </div>

      {/* Indice de scroll */}
      <button
        onClick={scrollDown}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 group"
        aria-label="Découvrir la suite"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-inter font-light text-cosmos-cream/50 group-hover:text-cosmos-gold/80 transition-colors">
          Découvrir
        </span>
        <ChevronDown className="w-4 h-4 text-cosmos-gold/60 animate-bounce" strokeWidth={1.5} />
      </button>
    </section>
  );
};

export default HeroPhoto;
