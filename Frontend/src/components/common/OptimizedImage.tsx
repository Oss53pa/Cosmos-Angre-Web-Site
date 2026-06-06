import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  overlay?: 'none' | 'light' | 'dark' | 'gradient-bottom' | 'gradient-top';
  hoverZoom?: boolean;
  aspectRatio?: string;
  objectPosition?: string;
  onClick?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  overlay = 'none',
  hoverZoom = false,
  aspectRatio,
  objectPosition = 'center',
  onClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const overlayClasses: Record<string, string> = {
    none: '',
    light: 'after:absolute after:inset-0 after:bg-white/20',
    dark: 'after:absolute after:inset-0 after:bg-cosmos-night/40',
    'gradient-bottom':
      'after:absolute after:inset-0 after:bg-gradient-to-t after:from-cosmos-night/70 after:via-cosmos-night/20 after:to-transparent',
    'gradient-top':
      'after:absolute after:inset-0 after:bg-gradient-to-b after:from-cosmos-night/60 after:to-transparent',
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${overlayClasses[overlay]} ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {/* Skeleton placeholder */}
      <div
        className={`absolute inset-0 bg-cosmos-night/10 transition-opacity duration-700 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="absolute inset-0 shimmer" />
      </div>

      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          } ${hoverZoom ? 'group-hover:scale-110' : ''} ${className}`}
          style={{ objectPosition }}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
