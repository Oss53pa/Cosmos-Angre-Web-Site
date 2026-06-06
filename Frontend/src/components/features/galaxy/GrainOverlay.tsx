import React from 'react';

/**
 * GrainOverlay — Grain de pellicule fin (finition cinématographique).
 * Texture de bruit fractal SVG, en superposition douce sur les sections sombres.
 * Statique (aucune animation), coût négligeable, pointer-events: none.
 */

const NOISE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E";

interface GrainOverlayProps {
  opacity?: number;
  className?: string;
}

const GrainOverlay: React.FC<GrainOverlayProps> = ({ opacity = 0.06, className = '' }) => (
  <div
    aria-hidden="true"
    className={`absolute inset-0 pointer-events-none ${className}`}
    style={{
      backgroundImage: `url("${NOISE}")`,
      backgroundSize: '160px 160px',
      mixBlendMode: 'overlay',
      opacity,
      zIndex: 1,
    }}
  />
);

export default GrainOverlay;
