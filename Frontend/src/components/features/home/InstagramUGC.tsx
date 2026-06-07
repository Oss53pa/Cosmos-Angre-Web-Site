import React from 'react';
import { Instagram } from 'lucide-react';
import Reveal from '../../common/Reveal';
import { useContent } from '../../../lib/content/SiteContentProvider';

/**
 * InstagramUGC — preuve sociale / communauté (Westfield, Aventura).
 * 6 vignettes éditables (home.ugc.image1..6) + lien vers le compte.
 */
const InstagramUGC: React.FC = () => {
  const { c } = useContent();
  const handle = c('home.ugc.handle', '@cosmos.angre');
  const url = c('home.ugc.url', 'https://www.instagram.com/');

  return (
    <section className="section bg-cosmos-cream">
      <div className="container-cosmos">
        <Reveal className="text-center mb-10">
          <span className="overline mb-3 block">{c('home.ugc.overline', 'Communauté')}</span>
          <h2 className="section-title mb-2">{c('home.ugc.title', 'Vivez Cosmos, partagez-le')}</h2>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-cosmos-gold font-inter text-sm hover:gap-3 transition-all"
          >
            <Instagram className="w-4 h-4" strokeWidth={1.5} /> {handle}
          </a>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {Array.from({ length: 6 }).map((_, i) => {
            const img = c(`home.ugc.image${i + 1}`);
            return (
              <Reveal key={i} delay={i * 60}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block aspect-square rounded-lg overflow-hidden relative bg-cosmos-night"
                >
                  {img ? (
                    <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          'radial-gradient(circle at 50% 40%, rgb(var(--cosmos-gold) / 0.18), transparent 70%)',
                      }}
                    />
                  )}
                  <span className="absolute inset-0 flex items-center justify-center bg-cosmos-night/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Instagram className="w-6 h-6 text-cosmos-cream" strokeWidth={1.5} />
                  </span>
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InstagramUGC;
