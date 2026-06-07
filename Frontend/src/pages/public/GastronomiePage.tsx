import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, ArrowRight } from 'lucide-react';
import luxuryRestaurant from '../../assets/images/branding/luxury-restaurant.jpg';
import restaurantInterior from '../../assets/images/branding/restaurant-interior.jpg';
import sushiJapanese from '../../assets/images/branding/sushi-japanese.jpg';
import italianRestaurant from '../../assets/images/branding/italian-restaurant.jpg';
import fineDiningFood from '../../assets/images/branding/fine-dining-food.jpg';
import OptimizedImage from '../../components/common/OptimizedImage';
import PageHero from '../../components/common/PageHero';
import Reveal from '../../components/common/Reveal';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import { useContent } from '../../lib/content/SiteContentProvider';
import { useStores } from '../../hooks/useStores';

interface RestoCard {
  id: string;
  name: string;
  caption: string;
  desc: string;
  rating: number;
  image: string;
  to?: string;
}

const FALLBACK_IMAGES = [
  luxuryRestaurant,
  restaurantInterior,
  sushiJapanese,
  italianRestaurant,
  fineDiningFood,
];

const GastronomiePage: React.FC = () => {
  const { t } = useTranslation();
  const { c } = useContent();
  const { stores } = useStores({ status: 'active' });

  // Vraies enseignes restaurants depuis cosmos.stores
  const realRestaurants: RestoCard[] = stores
    .filter(
      (s) =>
        (s.category_key === 'restaurants' || /restau|caf|food|gastro/i.test(s.category ?? '')) &&
        !!s.name
    )
    .map((s, i) => ({
      id: s.slug ?? s.id,
      name: s.name,
      caption: s.category ?? 'Restaurant',
      desc: s.description ?? '',
      rating: s.rating ?? 0,
      image: s.cover_image || s.logo || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
      to: s.slug ? `/boutiques/${s.slug}` : undefined,
    }));

  // Repli (jamais de page vide) : exemples i18n si la base ne répond pas encore
  const fallback: RestoCard[] = [
    { id: 'leCosmos', name: 'Le Cosmos', caption: t('gastronomy.restaurants.leCosmos.cuisine'), desc: t('gastronomy.restaurants.leCosmos.desc'), rating: 4.8, image: luxuryRestaurant },
    { id: 'laBrasserie', name: 'La Brasserie', caption: t('gastronomy.restaurants.laBrasserie.cuisine'), desc: t('gastronomy.restaurants.laBrasserie.desc'), rating: 4.6, image: restaurantInterior },
    { id: 'sakura', name: 'Sakura', caption: t('gastronomy.restaurants.sakura.cuisine'), desc: t('gastronomy.restaurants.sakura.desc'), rating: 4.5, image: sushiJapanese },
    { id: 'trattoriaBella', name: 'Trattoria Bella', caption: t('gastronomy.restaurants.trattoriaBella.cuisine'), desc: t('gastronomy.restaurants.trattoriaBella.desc'), rating: 4.4, image: italianRestaurant },
  ];

  const restaurants = realRestaurants.length > 0 ? realRestaurants : fallback;

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title="Restaurants & Cafés"
        description="Brasseries, cafés, cuisines du monde et terrasses : de quoi se régaler à toute heure à Cosmos Angré, Cocody-Angré, Abidjan."
        keywords={['restaurants Cosmos Angré', 'restaurants Cocody', 'cafés Angré', 'brasserie Angré', "Côte d'Ivoire"]}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Restaurants & Cafés', url: '/gastronomie' },
        ])}
      />

      <PageHero
        image={c('gastronomy.hero.image') || fineDiningFood}
        alt="Restaurants & cafés Cosmos Angré"
        overline={c('gastronomy.hero.overline', t('gastronomy.hero.overline'))}
        title={c('gastronomy.hero.title', t('gastronomy.hero.title'))}
        subtitle={c('gastronomy.hero.subtitle', t('gastronomy.hero.subtitle'))}
      />

      {/* Restaurants */}
      <section id="reservation" className="section bg-cosmos-warm scroll-mt-24">
        <div className="container-cosmos">
          <Reveal className="text-center mb-16">
            <span className="overline mb-4 block">
              {c('gastronomy.restaurants.overline', t('gastronomy.restaurants.overline'))}
            </span>
            <h2 className="section-title">
              {c('gastronomy.restaurants.title', t('gastronomy.restaurants.title'))}
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {restaurants.map((r, index) => (
              <Reveal key={r.id} delay={Math.min(index, 8) * 80} className="card group h-full">
                <div className="relative overflow-hidden aspect-[16/10]">
                  <OptimizedImage
                    src={r.image}
                    alt={r.name}
                    containerClassName="absolute inset-0"
                    hoverZoom
                    overlay="gradient-bottom"
                  />
                  {r.rating > 0 && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-sm">
                      <Star className="w-3 h-3 text-cosmos-gold" strokeWidth={1.5} />
                      <span className="text-[11px] font-inter font-medium text-cosmos-night">{r.rating}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium line-clamp-1">
                      {r.caption}
                    </span>
                  </div>
                  <h4 className="font-cormorant text-2xl text-cosmos-night font-light mb-2">{r.name}</h4>
                  {r.desc && (
                    <p className="text-sm text-text-secondary font-inter font-light mb-4 line-clamp-2">
                      {r.desc}
                    </p>
                  )}
                  {r.to && (
                    <div className="flex items-center justify-end">
                      <Link to={r.to} className="btn-secondary text-xs px-4 py-2">
                        {t('common.discover', 'Découvrir')}
                      </Link>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Food Court */}
      <section id="food-court" className="section-dark scroll-mt-24">
        <div className="container-cosmos text-center">
          <Reveal>
            <span className="overline mb-4 block">
              {c('gastronomy.foodCourt.overline', t('gastronomy.foodCourt.overline'))}
            </span>
            <h2 className="section-title-light mb-4">
              {c('gastronomy.foodCourt.title', t('gastronomy.foodCourt.title'))}
            </h2>
            <p className="section-subtitle-light max-w-2xl mx-auto">
              {c('gastronomy.foodCourt.description', t('gastronomy.foodCourt.description'))}
            </p>
            <Link to="/preparer-visite" className="btn-primary mt-4">
              {c('gastronomy.foodCourt.viewPlan', t('gastronomy.foodCourt.viewPlan'))}{' '}
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default GastronomiePage;
