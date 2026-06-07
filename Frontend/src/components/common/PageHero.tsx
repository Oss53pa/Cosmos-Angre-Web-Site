import React from 'react';

/**
 * PageHero — en-tête photographique premium pour les pages intérieures
 * (direction B). Image plein cadre + voiles de lisibilité + surtitre / titre /
 * sous-titre. Fondu bas vers le contenu clair (cosmos-warm). Léger ken-burns.
 */
interface PageHeroProps {
  image: string;
  overline: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  /** classes de hauteur (par défaut ~60vh) */
  heightClassName?: string;
  children?: React.ReactNode;
  /** texte alternatif de l'image */
  alt?: string;
}

const PageHero: React.FC<PageHeroProps> = ({
  image,
  overline,
  title,
  titleAccent,
  subtitle,
  heightClassName = 'min-h-[460px] h-[60vh] max-h-[680px]',
  children,
  alt = '',
}) => {
  return (
    <section
      className={`relative w-full overflow-hidden bg-cosmos-night-deep flex items-center justify-center ${heightClassName}`}
    >
      <div className="absolute inset-0 animate-ken-burns">
        <img src={image} alt={alt} className="w-full h-full object-cover" loading="eager" decoding="async" />
      </div>

      {/* Voiles premium — lisibilité renforcée du titre sur fond clair */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgb(var(--cosmos-night-deep) / 0.62) 0%, rgb(var(--cosmos-night-deep) / 0.5) 50%, rgb(var(--cosmos-night-deep) / 0.92) 100%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(110% 80% at 50% 45%, rgb(var(--cosmos-night-deep) / 0.15) 0%, transparent 38%, rgb(var(--cosmos-night-deep) / 0.6) 100%)',
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-cosmos-warm/40 to-cosmos-warm pointer-events-none" />

      {/* Contenu */}
      <div
        className="container-cosmos relative z-10 text-center"
        style={{ textShadow: '0 2px 24px rgb(var(--cosmos-night-deep) / 0.8)' }}
      >
        <div className="inline-flex items-center gap-3 mb-5 animate-fade-in-down">
          <span className="w-6 h-px bg-cosmos-gold/60" />
          <span className="overline text-cosmos-gold">{overline}</span>
          <span className="w-6 h-px bg-cosmos-gold/60" />
        </div>

        <h1 className="font-cormorant text-5xl sm:text-6xl md:text-7xl text-cosmos-cream font-light leading-[1.04] animate-fade-in-up text-balance">
          {title}
          {titleAccent ? (
            <>
              {' '}
              <span className="text-gradient-gold italic">{titleAccent}</span>
            </>
          ) : null}
        </h1>

        {subtitle ? (
          <p className="mt-6 text-base md:text-lg text-cosmos-cream/85 font-inter font-light max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        ) : null}

        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
};

export default PageHero;
