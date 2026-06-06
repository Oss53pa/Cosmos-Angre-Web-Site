import React from 'react';

import GalaxyCanvas from './GalaxyCanvas';
import GrainOverlay from './GrainOverlay';

/**
 * GalaxyPageHeader — En-tête galaxie pour les pages intérieures.
 * Décline la signature cosmique du site (canvas + grain + vignette) en format
 * compact, avec un fondu vers le contenu clair de la page.
 */

interface GalaxyPageHeaderProps {
  overline: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  children?: React.ReactNode;
  /** classes de hauteur (par défaut ~58vh) */
  heightClassName?: string;
}

const GalaxyPageHeader: React.FC<GalaxyPageHeaderProps> = ({
  overline,
  title,
  titleAccent,
  subtitle,
  children,
  heightClassName = 'min-h-[420px] h-[58vh] max-h-[640px]',
}) => {
  return (
    <section
      className={`relative w-full overflow-hidden bg-cosmos-night-deep flex items-center justify-center ${heightClassName}`}
    >
      <div className="absolute inset-0">
        <GalaxyCanvas
          density="med"
          interactive
          centerX={0.82}
          centerY={0.24}
          coreIntensity={0.5}
          coreScale={0.7}
        />
      </div>

      {/* Vignette + fondu vers le contenu clair */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(130% 120% at 50% 45%, transparent 30%, rgb(var(--cosmos-night-deep) / 0.72) 100%)',
        }}
      />
      <GrainOverlay opacity={0.06} />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-cosmos-warm pointer-events-none" />

      {/* Contenu */}
      <div
        className="container-cosmos relative z-10 text-center pt-16"
        style={{ textShadow: '0 2px 24px rgb(var(--cosmos-night-deep) / 0.8)' }}
      >
        <div className="inline-flex items-center gap-3 mb-5 animate-fade-in-down">
          <span className="w-6 h-px bg-cosmos-gold/60" />
          <span className="overline text-cosmos-gold">{overline}</span>
          <span className="w-6 h-px bg-cosmos-gold/60" />
        </div>

        <h1 className="font-cormorant text-5xl sm:text-6xl md:text-7xl text-cosmos-cream font-light leading-[1.04] animate-fade-in-up">
          {title}
          {titleAccent ? (
            <>
              {' '}
              <span className="text-gradient-gold italic">{titleAccent}</span>
            </>
          ) : null}
        </h1>

        {subtitle ? (
          <p className="mt-6 text-base md:text-lg text-cosmos-cream/65 font-inter font-light max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        ) : null}

        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
};

export default GalaxyPageHeader;
