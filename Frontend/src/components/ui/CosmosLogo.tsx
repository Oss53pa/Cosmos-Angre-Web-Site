import React from 'react';

interface CosmosLogoProps {
  height?: number;
  className?: string;
  dotColor?: string;
}

const CosmosLogo: React.FC<CosmosLogoProps> = ({
  height = 90,
  className = '',
  dotColor = '#ffffff',
}) => {
  const GOLD = 'rgb(var(--cosmos-gold))';

  const dotStyle = {
    fill: 'none',
    stroke: dotColor,
    strokeWidth: 3.5,
    strokeDasharray: '0.1 5.8',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const s = 54;
  const x = (i: number) => i * s;
  const cy = 22;
  const oR = 20;

  return (
    <svg
      viewBox="-2 -2 334 78"
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Cosmos Angré"
    >
      {/* C — arc pointillé */}
      <path d="M 37,5 A 22,22 0 1,0 37,39" transform={`translate(${x(0)},0)`} {...dotStyle} />

      {/* Premier O — cercle outline gold */}
      <circle cx={x(1) + 20} cy={cy} r={oR} fill="none" stroke={GOLD} strokeWidth={2} />

      {/* S — pointillé */}
      <path
        d="M 34,8 C 32,2 26,0 19,0 C 10,0 1,4 1,12 C 1,19 9,22 19,22 C 29,22 37,25 37,33 C 37,40 30,44 21,44 C 15,44 5,42 2,36"
        transform={`translate(${x(2)},0)`}
        {...dotStyle}
      />

      {/* M — pointillé */}
      <path
        d="M 0,44 L 0,0 L 20,26 L 40,0 L 40,44"
        transform={`translate(${x(3)},0)`}
        {...dotStyle}
      />

      {/* Deuxième O — cercle plein gold */}
      <circle cx={x(4) + 20} cy={cy} r={oR} fill={GOLD} />

      {/* S — pointillé (même path) */}
      <path
        d="M 34,8 C 32,2 26,0 19,0 C 10,0 1,4 1,12 C 1,19 9,22 19,22 C 29,22 37,25 37,33 C 37,40 30,44 21,44 C 15,44 5,42 2,36"
        transform={`translate(${x(5)},0)`}
        {...dotStyle}
      />

      {/* ANGRĒ — texte gold aligné à droite sous le dernier S
          Le E final porte un macron (trait horizontal U+0112) — signature visuelle officielle. */}
      <text
        x={x(5) + 38}
        y={72}
        textAnchor="end"
        fontFamily="'Inter', 'Helvetica Neue', sans-serif"
        fontSize={16}
        fontWeight={600}
        letterSpacing={4}
        fill={GOLD}
      >
        ANGR&#x112;
      </text>
    </svg>
  );
};

export default CosmosLogo;
