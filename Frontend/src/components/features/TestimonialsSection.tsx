import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { useTestimonials, type Testimonial } from '../../hooks/useTestimonials';

const TestimonialsSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.split('-')[0] ?? 'fr';

  const { testimonials: dbTestimonials, isLoading } = useTestimonials({
    featuredOnly: true,
    locale: lang,
    limit: 8,
  });

  // Pas de faux avis : on n'affiche que les vrais témoignages de la base.
  const items: Testimonial[] = dbTestimonials;

  // Aucun vrai avis (ex. pré-lancement) → on masque la section.
  if (!isLoading && items.length === 0) return null;

  if (isLoading && dbTestimonials.length === 0) {
    return (
      <section className="py-20 md:py-28 bg-cosmos-warm overflow-hidden">
        <div className="container-cosmos">
          <div className="text-center mb-12">
            <span className="overline mb-4 block">{t('home.testimonials.overline')}</span>
            <h2 className="section-title">{t('home.testimonials.title')}</h2>
          </div>
          <div
            role="status"
            aria-label={t('home.testimonials.loading', 'Chargement des avis')}
            className="flex gap-5 px-6 md:px-12 overflow-hidden"
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[320px] md:w-[380px] bg-cosmos-cream/40 rounded-lg p-6 md:p-8 animate-pulse"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <div key={j} className="w-4 h-4 bg-cosmos-text/10 rounded-full" />
                  ))}
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-cosmos-text/10 rounded w-full" />
                  <div className="h-3 bg-cosmos-text/10 rounded w-5/6" />
                  <div className="h-3 bg-cosmos-text/10 rounded w-3/4" />
                </div>
                <div className="h-4 bg-cosmos-text/10 rounded w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 md:py-28 bg-cosmos-warm overflow-hidden">
      <div className="container-cosmos">
        <div className="text-center mb-12">
          <span className="overline mb-4 block">{t('home.testimonials.overline')}</span>
          <h2 className="section-title">{t('home.testimonials.title')}</h2>
          <p className="section-subtitle max-w-2xl mx-auto">{t('home.testimonials.subtitle')}</p>
        </div>
      </div>

      <ul
        className="flex gap-5 overflow-x-auto px-6 md:px-12 pb-6 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((testimonial) => (
          <li
            key={testimonial.id}
            className="flex-shrink-0 w-[320px] md:w-[380px] snap-center bg-cosmos-cream rounded-lg p-6 md:p-8 border border-cosmos-text/10 shadow-sm hover:shadow-md transition-shadow list-none"
          >
            <div className="flex gap-1 mb-4" aria-label={`${testimonial.rating} étoiles sur 5`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  aria-hidden="true"
                  className={`w-4 h-4 ${
                    i < testimonial.rating
                      ? 'text-cosmos-gold fill-cosmos-gold'
                      : 'text-cosmos-text/20'
                  }`}
                  strokeWidth={1.5}
                />
              ))}
            </div>

            <blockquote className="text-sm text-cosmos-text/70 font-inter font-light leading-relaxed mb-6 line-clamp-4">
              &laquo;&nbsp;{testimonial.content}&nbsp;&raquo;
            </blockquote>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cosmos-night font-inter font-medium">
                  {testimonial.author_name}
                </p>
                <p className="text-[11px] text-cosmos-text/60 font-inter font-light mt-0.5">
                  {t('home.testimonials.via')} {testimonial.source}
                </p>
              </div>
              <span className="text-[10px] uppercase tracking-[0.1em] text-cosmos-gold/60 font-inter font-medium px-2 py-1 border border-cosmos-gold/20 rounded-sm">
                {testimonial.source}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TestimonialsSection;
