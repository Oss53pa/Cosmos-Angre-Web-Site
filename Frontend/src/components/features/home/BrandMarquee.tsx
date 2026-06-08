import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStores } from '../../../hooks/useStores';
import { useContent } from '../../../lib/content/SiteContentProvider';

interface MarqueeBrand {
  slug: string;
  name: string;
  logo?: string | null;
}

const MarqueeItem: React.FC<{ b: MarqueeBrand }> = ({ b }) => {
  const [ok, setOk] = useState(!!b.logo);
  const initial = (b.name.trim().charAt(0) || '·').toUpperCase();
  return (
    <Link
      to={`/boutiques?store=${encodeURIComponent(b.slug)}`}
      className="group flex-shrink-0 flex flex-col items-center gap-2 w-28"
      title={b.name}
    >
      <span className="w-16 h-16 rounded-full bg-white ring-1 ring-cosmos-night/10 group-hover:ring-cosmos-gold/50 flex items-center justify-center overflow-hidden transition-all">
        {b.logo && ok ? (
          <img
            src={b.logo}
            alt={b.name}
            className="max-h-9 max-w-[78%] object-contain"
            loading="lazy"
            onError={() => setOk(false)}
          />
        ) : (
          <span className="font-cormorant text-2xl text-cosmos-gold font-light">{initial}</span>
        )}
      </span>
      <span className="text-[10px] uppercase tracking-[0.12em] text-cosmos-night/55 font-inter text-center line-clamp-1 w-full group-hover:text-cosmos-night transition-colors">
        {b.name}
      </span>
    </Link>
  );
};

/**
 * Carrousel d'enseignes en défilement continu (façon Westfield / Aventura).
 * Logos réels quand disponibles, repli monogramme sinon. Pause au survol,
 * respect de "réduire les animations".
 */
const BrandMarquee: React.FC = () => {
  const { c } = useContent();
  const { stores } = useStores({ status: 'active' });

  const brands: MarqueeBrand[] = stores
    .map((s) => ({ slug: s.slug ?? s.id, name: s.name, logo: s.logo }))
    .filter((b) => b.name);

  if (brands.length < 6) return null;

  // On duplique la liste pour une boucle sans couture.
  const loop = [...brands, ...brands];

  return (
    <section className="section bg-cosmos-warm overflow-hidden">
      <div className="container-cosmos">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="overline mb-3 block">{c('home.marquee.overline', 'Les enseignes')}</span>
            <h2 className="section-title">{c('home.marquee.title', 'Ils sont à Cosmos')}</h2>
          </div>
          <Link
            to="/boutiques"
            className="hidden md:inline-flex items-center gap-2 text-cosmos-gold text-xs uppercase tracking-[0.15em] font-inter font-medium hover:gap-3 transition-all"
          >
            {c('home.marquee.cta', 'Toutes les enseignes')} <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-cosmos-warm to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-cosmos-warm to-transparent" />
        <div className="flex w-max gap-6 animate-marquee-slow hover:[animation-play-state:paused] motion-reduce:animate-none">
          {loop.map((b, i) => (
            <MarqueeItem key={`${b.slug}-${i}`} b={b} />
          ))}
        </div>
      </div>

      <div className="md:hidden container-cosmos mt-8 text-center">
        <Link to="/boutiques" className="btn-secondary">
          {c('home.marquee.cta', 'Toutes les enseignes')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
        </Link>
      </div>
    </section>
  );
};

export default BrandMarquee;
