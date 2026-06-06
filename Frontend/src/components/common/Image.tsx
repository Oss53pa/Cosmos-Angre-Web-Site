import React, { useState } from 'react';

type Sizes = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'loading' | 'src'> {
  /** Source principale (JPEG/PNG fallback) */
  src: string;
  /** Texte alternatif obligatoire pour l'a11y */
  alt: string;
  /** URL optimisée AVIF (auto-générée si vous avez le pipeline) */
  avifSrc?: string;
  /** URL optimisée WebP */
  webpSrc?: string;
  /** Aspect ratio pour réserver l'espace (évite CLS) */
  aspectRatio?: `${number}/${number}` | string;
  /** Hint sizes (exemple: "(min-width: 1024px) 50vw, 100vw") */
  sizes?: string;
  /** Eager-load (héro, above-the-fold) */
  priority?: boolean;
  /** Set personnalisé (sm/md/lg/xl) ou breakpoints custom */
  preset?: Sizes;
  /** Classes sur le wrapper <picture> */
  containerClassName?: string;
  /** Active le placeholder blur pendant le chargement */
  showPlaceholder?: boolean;
}

const PRESET_SIZES: Record<Sizes, string> = {
  sm: '(max-width: 640px) 100vw, 320px',
  md: '(max-width: 768px) 100vw, 50vw',
  lg: '(max-width: 1024px) 100vw, 33vw',
  xl: '(max-width: 1280px) 50vw, 25vw',
  full: '100vw',
};

/**
 * Composant <Image> performance-first :
 *  - <picture> avec AVIF, WebP, fallback JPEG
 *  - lazy-loading natif (priority=true pour héro)
 *  - decoding="async"
 *  - réservation d'espace via aspect-ratio (anti-CLS)
 *  - placeholder fade-in pendant le chargement
 */
export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  avifSrc,
  webpSrc,
  aspectRatio,
  sizes,
  priority = false,
  preset,
  className = '',
  containerClassName = '',
  showPlaceholder = true,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const finalSizes = sizes ?? (preset ? PRESET_SIZES[preset] : undefined);

  const containerStyle: React.CSSProperties = aspectRatio
    ? { aspectRatio: aspectRatio.replace('/', ' / ') }
    : {};

  return (
    <picture className={`relative overflow-hidden ${containerClassName}`} style={containerStyle}>
      {avifSrc && <source type="image/avif" srcSet={avifSrc} sizes={finalSizes} />}
      {webpSrc && <source type="image/webp" srcSet={webpSrc} sizes={finalSizes} />}
      {showPlaceholder && !loaded && (
        <span aria-hidden="true" className="absolute inset-0 bg-cosmos-cream/20 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        sizes={finalSizes}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        {...rest}
      />
    </picture>
  );
};

export default Image;
