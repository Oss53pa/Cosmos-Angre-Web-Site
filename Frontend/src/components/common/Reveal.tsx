import React, { useEffect, useRef, useState } from 'react';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: React.ReactNode;
  /** Sens d'entrée (par défaut : remontée douce) */
  direction?: RevealDirection;
  /** Délai en ms (utile pour cascader des éléments) */
  delay?: number;
  /** Décalage initial en px */
  distance?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const OFFSETS: Record<RevealDirection, string> = {
  up: 'translateY(34px)',
  down: 'translateY(-34px)',
  left: 'translateX(34px)',
  right: 'translateX(-34px)',
  none: 'none',
};

/**
 * Reveal — révélation premium au scroll (IntersectionObserver).
 * Respecte prefers-reduced-motion (affichage immédiat sans transition).
 */
const Reveal: React.FC<RevealProps> = ({
  children,
  direction = 'up',
  delay = 0,
  distance,
  className = '',
  as = 'div',
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setReduced(true);
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const offset =
    distance != null && direction !== 'none'
      ? direction === 'up'
        ? `translateY(${distance}px)`
        : direction === 'down'
          ? `translateY(${-distance}px)`
          : direction === 'left'
            ? `translateX(${distance}px)`
            : `translateX(${-distance}px)`
      : OFFSETS[direction];

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : offset,
        transition: reduced
          ? 'none'
          : `opacity 0.9s var(--ease-premium, ease), transform 0.9s var(--ease-premium, ease)`,
        transitionDelay: visible && !reduced ? `${delay}ms` : '0ms',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
