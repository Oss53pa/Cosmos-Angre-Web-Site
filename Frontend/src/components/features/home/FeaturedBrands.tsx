import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useStores } from '../../../hooks/useStores';
import Reveal from '../../common/Reveal';
import { useContent } from '../../../lib/content/SiteContentProvider';

/**
 * FeaturedBrands — « Maisons à la une » : curation d'enseignes phares (Aventura).
 * On met en avant, on ne déballe pas tout l'annuaire.
 */
const FeaturedBrands: React.FC = () => {
  const { c } = useContent();
  const { stores } = useStores({ status: 'active' });

  const featured = useMemo(
    () => stores.filter((s) => s.plan === 'Platinum' || s.plan === 'Gold').slice(0, 12),
    [stores]
  );

  if (featured.length === 0) return null;

  return (
    <section className="section bg-cosmos-warm">
      <div className="container-cosmos">
        <Reveal className="flex items-end justify-between mb-12 gap-4">
          <div>
            <span className="overline mb-3 block">{c('home.brands.overline', 'Les maisons')}</span>
            <h2 className="section-title mb-0">{c('home.brands.title', 'Maisons à la une')}</h2>
          </div>
          <Link
            to="/boutiques"
            className="hidden md:inline-flex items-center gap-2 text-cosmos-gold text-xs uppercase tracking-[0.15em] font-inter font-medium hover:gap-3 transition-all flex-shrink-0"
          >
            {c('home.brands.cta', 'Toutes les enseignes')}
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
          </Link>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 md:gap-3">
          {featured.map((s, i) => (
            <Reveal key={s.id} delay={Math.min(i, 10) * 40}>
              <Link
                to="/boutiques"
                className="group w-full h-28 md:h-32 bg-white rounded-lg border border-cosmos-night/5 flex flex-col items-center justify-center px-3 text-center transition-all duration-400 hover:-translate-y-1 hover:border-cosmos-gold/40 hover:shadow-[0_16px_36px_-22px_rgb(var(--cosmos-night)/0.35)]"
              >
                {s.logo ? (
                  <img
                    src={s.logo}
                    alt={s.name}
                    className="max-h-10 md:max-h-12 max-w-[78%] object-contain grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                    loading="lazy"
                  />
                ) : (
                  <span className="font-cormorant text-base md:text-lg text-cosmos-night font-light leading-tight line-clamp-2 group-hover:text-cosmos-gold transition-colors">
                    {s.name}
                  </span>
                )}
                <span className="mt-1.5 text-[9px] uppercase tracking-[0.14em] text-cosmos-night/45 font-inter line-clamp-1">
                  {s.category}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="md:hidden text-center mt-8">
          <Link to="/boutiques" className="btn-secondary">
            {c('home.brands.cta', 'Toutes les enseignes')}
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands;
