import React from 'react';

/**
 * CosmicDivider — Fil cosmique signature.
 * Séparateur discret : une ligne dorée, un astre central et quelques étoiles.
 * Décline le motif galaxie sur tout le site, y compris les sections claires.
 */

interface CosmicDividerProps {
  className?: string;
  /** 'light' sur fond clair, 'dark' sur fond sombre */
  variant?: 'light' | 'dark';
}

const CosmicDivider: React.FC<CosmicDividerProps> = ({ className = '', variant = 'light' }) => {
  const dust = variant === 'dark' ? 'bg-cosmos-cream/30' : 'bg-cosmos-gold/40';
  return (
    <div
      className={`relative flex items-center justify-center gap-4 py-2 select-none ${className}`}
      aria-hidden="true"
    >
      <span
        className="h-px w-16 sm:w-28 md:w-40"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgb(var(--cosmos-gold) / 0.5))',
        }}
      />
      <span className="relative flex items-center justify-center">
        {/* orbite */}
        <span className="absolute w-6 h-6 rounded-full border border-cosmos-gold/30" />
        <span
          className="absolute w-6 h-6 rounded-full"
          style={{ animation: 'spin 8s linear infinite' }}
        >
          <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cosmos-gold" />
        </span>
        {/* astre central */}
        <span className="w-1.5 h-1.5 rounded-full bg-cosmos-gold shadow-gold-glow" />
      </span>
      <span
        className="h-px w-16 sm:w-28 md:w-40"
        style={{
          background:
            'linear-gradient(90deg, rgb(var(--cosmos-gold) / 0.5), transparent)',
        }}
      />
      {/* poussière d'étoiles */}
      <span className={`absolute left-[18%] top-1 w-0.5 h-0.5 rounded-full ${dust}`} />
      <span className={`absolute right-[20%] bottom-1 w-0.5 h-0.5 rounded-full ${dust}`} />
      <span className={`absolute left-[30%] bottom-0 w-px h-px rounded-full ${dust}`} />
    </div>
  );
};

export default CosmicDivider;
