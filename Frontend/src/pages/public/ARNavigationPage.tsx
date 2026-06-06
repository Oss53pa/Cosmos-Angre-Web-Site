import React from 'react';
import { useTranslation } from 'react-i18next';
import { Smartphone, Map, Navigation, QrCode, MapPin, Store, Utensils, ShoppingBag, Film } from 'lucide-react';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';

// Import des images de plans
import floorPlan from '../../assets/images/branding/floor-plan.jpg';
import aerial3dPlan from '../../assets/images/branding/aerial-3d-plan.jpg';

const ARNavigationPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Seo
        title="Navigation AR"
        description="Vivez une expérience immersive avec la navigation en réalité augmentée de Cosmos Angré : repérez boutiques, restaurants et services en un instant."
        keywords={['navigation AR', 'réalité augmentée', 'Cosmos Angré', 'visite immersive', 'plan interactif Abidjan']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Navigation AR', url: '/navigation-ar' },
        ])}
      />
      {/* Hero Section */}
      <section className="py-24 bg-cosmos-warm border-b border-cosmos-cream">
        <div className="container-cosmos text-center">
          <h1 className="text-6xl md:text-8xl font-light text-cosmos-night mb-6 tracking-tighter">{t('arNavigation.hero.title')}</h1>
          <p className="text-xl text-cosmos-text/70 font-light">{t('arNavigation.hero.subtitle')}</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 bg-cosmos-cream/50">
        <div className="container-cosmos">
          <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div>
              <h2 className="text-4xl font-light text-cosmos-night mb-6 tracking-tight">
                {t('arNavigation.intro.title')}
              </h2>
              <p className="text-xl text-cosmos-text/70 mb-6 font-light">
                {t('arNavigation.intro.description')}
              </p>
              <p className="text-lg text-cosmos-text/70 font-light">
                {t('arNavigation.intro.description2')}
              </p>
            </div>
            <div>
              <div className="border border-cosmos-cream p-12 bg-cosmos-warm">
                <Smartphone className="w-16 h-16 text-cosmos-night mb-6 mx-auto" />
                <h3 className="text-2xl font-light text-cosmos-night mb-4 text-center tracking-tight">
                  {t('arNavigation.intro.downloadTitle')}
                </h3>
                <p className="text-cosmos-text/70 font-light text-center mb-6">
                  {t('arNavigation.intro.downloadSubtitle')}
                </p>
                <div className="w-48 h-48 bg-cosmos-cream/50 mx-auto flex items-center justify-center border border-cosmos-cream">
                  <QrCode className="w-32 h-32 text-cosmos-text/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans du Centre */}
      <section className="py-24 bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-cosmos-night mb-6 tracking-tight">
              {t('arNavigation.plans.title')}
            </h2>
            <p className="text-xl text-cosmos-text/70 font-light">
              {t('arNavigation.plans.subtitle')}
            </p>
          </div>

          <div className="space-y-16">
            {/* Plan 3D Aerien */}
            <div>
              <h3 className="text-2xl font-light text-cosmos-night mb-6 tracking-tight">{t('arNavigation.plans.aerialView')}</h3>
              <img
                src={aerial3dPlan}
                alt={t('arNavigation.plans.aerialView')}
                className="w-full h-auto border border-cosmos-cream"
              />
            </div>

            {/* Plan d'Etage */}
            <div>
              <h3 className="text-2xl font-light text-cosmos-night mb-6 tracking-tight">{t('arNavigation.plans.floorPlan')}</h3>
              <img
                src={floorPlan}
                alt={t('arNavigation.plans.floorPlan')}
                className="w-full h-auto border border-cosmos-cream"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalites */}
      <section className="py-24 bg-cosmos-cream/50">
        <div className="container-cosmos">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-cosmos-night mb-6 tracking-tight">
              {t('arNavigation.features.title')}
            </h2>
            <p className="text-xl text-cosmos-text/70 font-light">
              {t('arNavigation.features.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px border border-cosmos-cream">
            {[
              {
                icon: Navigation,
                title: t('arNavigation.features.realTimeGuide.title'),
                description: t('arNavigation.features.realTimeGuide.desc')
              },
              {
                icon: Store,
                title: t('arNavigation.features.storeLocation.title'),
                description: t('arNavigation.features.storeLocation.desc')
              },
              {
                icon: MapPin,
                title: t('arNavigation.features.poi.title'),
                description: t('arNavigation.features.poi.desc')
              },
              {
                icon: ShoppingBag,
                title: t('arNavigation.features.geoPromos.title'),
                description: t('arNavigation.features.geoPromos.desc')
              }
            ].map((feature, index) => (
              <div key={index} className="bg-cosmos-warm hover:bg-cosmos-cream/50 transition-colors p-8 text-center">
                <feature.icon className="w-8 h-8 mx-auto mb-4 text-cosmos-night" />
                <h3 className="text-lg font-light text-cosmos-night mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-sm text-cosmos-text/70 font-light">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-cosmos-night mb-6 tracking-tight">
              {t('arNavigation.browseCategories.title')}
            </h2>
            <p className="text-xl text-cosmos-text/70 font-light">
              {t('arNavigation.browseCategories.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px border border-cosmos-cream">
            {[
              { icon: ShoppingBag, name: t('arNavigation.browseCategories.shopsMode'), count: t('arNavigation.browseCategories.galleryZone') },
              { icon: Utensils, name: t('arNavigation.browseCategories.restaurantsCafes'), count: t('arNavigation.browseCategories.restaurantsZone') },
              { icon: Film, name: t('arNavigation.browseCategories.cinemaLeisure'), count: t('arNavigation.browseCategories.bigBoxZone') },
              { icon: Store, name: t('arNavigation.browseCategories.artisanMarket'), count: t('arNavigation.browseCategories.gardenZone') },
              { icon: MapPin, name: t('arNavigation.browseCategories.servicesLabel'), count: t('arNavigation.browseCategories.allZones') },
              { icon: Map, name: t('arNavigation.browseCategories.parkingLabel'), count: t('arNavigation.browseCategories.undergroundOutdoor') }
            ].map((category, index) => (
              <div key={index} className="bg-cosmos-warm hover:bg-cosmos-cream/50 transition-colors p-8 text-center border-r border-b border-cosmos-cream last:border-r-0">
                <category.icon className="w-8 h-8 mx-auto mb-4 text-cosmos-night" />
                <h3 className="text-lg font-light text-cosmos-night mb-2 tracking-tight">{category.name}</h3>
                <p className="text-sm text-cosmos-text/60 font-light">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-cosmos-night text-cosmos-cream">
        <div className="container-cosmos text-center">
          <Smartphone className="w-16 h-16 mx-auto mb-6 text-cosmos-cream" />
          <h2 className="text-5xl font-light mb-6 tracking-tight">
            {t('arNavigation.cta.title')}
          </h2>
          <p className="text-xl text-cosmos-cream/60 mb-10 font-light">
            {t('arNavigation.cta.subtitle')}
          </p>
          <button className="bg-cosmos-cream text-cosmos-night px-12 py-4 text-lg font-light hover:bg-cosmos-warm transition-colors">
            {t('arNavigation.cta.downloadApp')}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ARNavigationPage;
