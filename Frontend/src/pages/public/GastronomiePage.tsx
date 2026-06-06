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
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';

const GastronomiePage: React.FC = () => {
  const { t } = useTranslation();

  const restaurants = [
    { id: 1, name: 'Le Cosmos', cuisineKey: 'leCosmos', price: 3, rating: 4.8, terrace: true, image: luxuryRestaurant },
    { id: 2, name: 'La Brasserie', cuisineKey: 'laBrasserie', price: 3, rating: 4.6, terrace: true, image: restaurantInterior },
    { id: 3, name: 'Sakura', cuisineKey: 'sakura', price: 2, rating: 4.5, terrace: false, image: sushiJapanese },
    { id: 4, name: 'Trattoria Bella', cuisineKey: 'trattoriaBella', price: 2, rating: 4.4, terrace: true, image: italianRestaurant },
  ];

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title="Gastronomie"
        description="Brasseries, fine dining, cuisines du monde et terrasses : découvrez la sélection gastronomique de Cosmos Angré à Cocody-Angré, Abidjan."
        keywords={['restaurants Cosmos Angré', 'gastronomie Abidjan', 'fine dining Cocody', 'brasserie Angré', 'restaurants Côte d\'Ivoire']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Gastronomie', url: '/gastronomie' },
        ])}
      />
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[55vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 animate-ken-burns">
          <OptimizedImage
            src={fineDiningFood}
            alt="Gastronomie Cosmos Angre"
            containerClassName="w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-cosmos-night/80 via-cosmos-night/50 to-cosmos-night/85" />
        <div className="container-cosmos relative z-10 text-center">
          <span className="overline mb-4 block animate-fade-in-down">{t('gastronomy.hero.overline')}</span>
          <h1 className="font-cormorant text-5xl md:text-7xl text-cosmos-cream font-light mb-4 animate-fade-in-up">{t('gastronomy.hero.title')}</h1>
          <p className="text-base text-cosmos-cream/60 font-inter font-light max-w-xl mx-auto">
            {t('gastronomy.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Restaurants */}
      <section id="reservation" className="section bg-cosmos-warm scroll-mt-24">
        <div className="container-cosmos">
          <div className="text-center mb-16">
            <span className="overline mb-4 block">{t('gastronomy.restaurants.overline')}</span>
            <h2 className="section-title">{t('gastronomy.restaurants.title')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {restaurants.map((r) => (
              <div key={r.id} className="card group">
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
                    {r.terrace && <span className="text-[10px] uppercase tracking-[0.1em] text-text-secondary font-inter">{t('gastronomy.restaurants.terraceAvailable')}</span>}
                    <button className="btn-secondary text-xs px-4 py-2">{t('common.reserve')}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Court */}
      <section id="food-court" className="section bg-cosmos-night scroll-mt-24">
        <div className="container-cosmos text-center">
          <span className="overline mb-4 block">{t('gastronomy.foodCourt.overline')}</span>
          <h2 className="section-title-light mb-4">{t('gastronomy.foodCourt.title')}</h2>
          <p className="section-subtitle-light max-w-2xl mx-auto">
            {t('gastronomy.foodCourt.description')}
          </p>
          <Link to="/preparer-visite" className="btn-primary mt-4">
            {t('gastronomy.foodCourt.viewPlan')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default GastronomiePage;
