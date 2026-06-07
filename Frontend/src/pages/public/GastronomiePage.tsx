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

const GastronomiePage: React.FC = () => {
  const { t } = useTranslation();
  const { c } = useContent();

  const restaurants = [
    { id: 1, name: 'Le Cosmos', cuisineKey: 'leCosmos', price: 3, rating: 4.8, terrace: true, image: luxuryRestaurant },
    { id: 2, name: 'La Brasserie', cuisineKey: 'laBrasserie', price: 3, rating: 4.6, terrace: true, image: restaurantInterior },
    { id: 3, name: 'Sakura', cuisineKey: 'sakura', price: 2, rating: 4.5, terrace: false, image: sushiJapanese },
    { id: 4, name: 'Trattoria Bella', cuisineKey: 'trattoriaBella', price: 2, rating: 4.4, terrace: true, image: italianRestaurant },
  ];

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {restaurants.map((r, index) => (
              <Reveal key={r.id} delay={index * 90} className="card group h-full">
                <div className="relative overflow-hidden aspect-[16/10]">
                  <OptimizedImage
                    src={r.image}
                    alt={r.name}
                    containerClassName="absolute inset-0"
                    hoverZoom
                    overlay="gradient-bottom"
                  />
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-sm">
                    <Star className="w-3 h-3 text-cosmos-gold" strokeWidth={1.5} />
                    <span className="text-[11px] font-inter font-medium text-cosmos-night">{r.rating}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium">
                      {t(`gastronomy.restaurants.${r.cuisineKey}.cuisine`)}
                    </span>
                    <span className="text-xs text-text-secondary font-inter">{'$'.repeat(r.price)}</span>
                  </div>
                  <h4 className="font-cormorant text-2xl text-cosmos-night font-light mb-2">{r.name}</h4>
                  <p className="text-sm text-text-secondary font-inter font-light mb-4">
                    {t(`gastronomy.restaurants.${r.cuisineKey}.desc`)}
                  </p>
                  <div className="flex items-center justify-between">
                    {r.terrace && (
                      <span className="text-[10px] uppercase tracking-[0.1em] text-text-secondary font-inter">
                        {t('gastronomy.restaurants.terraceAvailable')}
                      </span>
                    )}
                    <button className="btn-secondary text-xs px-4 py-2">{t('common.reserve')}</button>
                  </div>
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
