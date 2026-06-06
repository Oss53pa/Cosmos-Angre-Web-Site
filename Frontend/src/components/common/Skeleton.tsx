import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  /** Hauteur en classe Tailwind (h-4, h-32...) */
  height?: string;
  /** Largeur (w-full, w-1/2...) */
  width?: string;
  /** Forme: 'text' | 'circle' | 'rectangle' */
  variant?: 'text' | 'circle' | 'rectangle';
}

/**
 * Bloc de chargement neutre, anti-CLS.
 * Utiliser pour remplacer le contenu pendant le fetch.
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  height,
  width = 'w-full',
  variant = 'rectangle',
  ...rest
}) => {
  const base = 'bg-cosmos-cream/10 animate-pulse';
  const variantClass =
    variant === 'circle'
      ? 'rounded-full aspect-square'
      : variant === 'text'
        ? 'rounded h-4'
        : 'rounded';

  return (
    <div
      role="status"
      aria-label="Chargement"
      className={`${base} ${variantClass} ${width} ${height ?? ''} ${className}`}
      {...rest}
    />
  );
};

interface CardSkeletonProps {
  count?: number;
  className?: string;
}

export const StoreCardSkeleton: React.FC<CardSkeletonProps> = ({ count = 6, className = '' }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="bg-cosmos-cream/5 border border-cosmos-cream/10 rounded overflow-hidden"
      >
        <Skeleton height="h-48" />
        <div className="p-5 space-y-3">
          <Skeleton variant="text" width="w-3/4" />
          <Skeleton variant="text" width="w-1/2" />
          <Skeleton variant="text" width="w-full" />
        </div>
      </div>
    ))}
  </div>
);

export const BlogCardSkeleton: React.FC<CardSkeletonProps> = ({ count = 3, className = '' }) => (
  <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <article key={i} className="space-y-4">
        <Skeleton height="h-64" />
        <Skeleton variant="text" width="w-1/4" />
        <Skeleton variant="text" width="w-full" />
        <Skeleton variant="text" width="w-5/6" />
      </article>
    ))}
  </div>
);

export const TableRowSkeleton: React.FC<CardSkeletonProps> = ({ count = 5, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 border border-cosmos-cream/10 rounded">
        <Skeleton variant="circle" width="w-10" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="w-1/3" />
          <Skeleton variant="text" width="w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
