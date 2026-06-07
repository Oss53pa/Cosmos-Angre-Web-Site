import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Wifi, Car, UtensilsCrossed, Sparkles, ArrowRight, Check } from 'lucide-react';
import OptimizedImage from '../../components/common/OptimizedImage';
import PageHero from '../../components/common/PageHero';
import Reveal from '../../components/common/Reveal';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import { useContent } from '../../lib/content/SiteContentProvider';
import ibisStylesImg from '../../assets/images/branding/ibis-styles-exterior.jpg';
import adagioImg from '../../assets/images/branding/adagio-exterior.jpg';

const HotelPage: React.FC = () => {
  const { t } = useTranslation();
  const { c } = useContent();

  const services = [
    { icon: UtensilsCrossed, label: t('hotel.services.roomService') },
    { icon: Sparkles, label: t('hotel.services.spaFitness') },
    { icon: Car, label: t('hotel.services.privateParking') },
    { icon: Wifi, label: t('hotel.services.wifi') },
  ];

  const ibisFeatures = t('hotel.ibisStyles.features', { returnObjects: true }) as string[];
  const adagioFeatures = t('hotel.adagio.features', { returnObjects: true }) as string[];

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title="Hôtel"
        description="Ibis Styles et Adagio à Cosmos Angré : un hébergement premium au cœur de Cocody-Angré, idéal pour vos séjours d'affaires ou loisirs à Abidjan."
        keywords={['hôtel Cosmos Angré', 'Ibis Styles Abidjan', 'Adagio Cocody', 'hébergement premium', 'hôtel Angré']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Hôtel', url: '/hotel' },
        ])}
      />
      <PageHero
        image={c('hotel.hero.image') || ibisStylesImg}
        alt="Hôtels à Cosmos Angré"
        overline={c('hotel.hero.overline', t('hotel.hero.overline'))}
        title={c('hotel.hero.title', t('hotel.hero.title'))}
        subtitle={c('hotel.hero.subtitle', t('hotel.hero.subtitle'))}
      />

      {/* Two Hotels Intro */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="text-center mb-12 md:mb-16">
            <span className="overline mb-4 block">{t('hotel.brands.overline')}</span>
            <h2 className="section-title">{t('hotel.brands.title')}</h2>
            <p className="section-subtitle max-w-2xl mx-auto">{t('hotel.brands.subtitle')}</p>
          </div>

          {/* Ibis Styles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16 md:mb-24 items-center">
            <div className="relative rounded-lg aspect-[4/3] group">
              <OptimizedImage src={ibisStylesImg} alt="Ibis Styles Cosmos Angre" containerClassName="w-full h-full rounded-lg" hoverZoom />
              <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-md">
                <span className="text-sm font-inter font-semibold text-cosmos-night tracking-wide">ibis Styles</span>
              </div>
            </div>
            <div>
              <span className="overline mb-3 block">{t('hotel.ibisStyles.overline')}</span>
              <h3 className="font-cormorant text-3xl md:text-4xl text-cosmos-night font-light mb-2">
                {t('hotel.ibisStyles.name')}
              </h3>
              <p className="text-sm text-cosmos-night/60 font-inter font-medium uppercase tracking-wider mb-4">
                {t('hotel.ibisStyles.subtitle')}
              </p>
              <p className="text-base text-text-secondary font-inter font-light leading-relaxed mb-6">
                {t('hotel.ibisStyles.description')}
              </p>
              <ul className="space-y-3 mb-8">
                {ibisFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-cosmos-night/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-cosmos-night/60" strokeWidth={2} />
                    </div>
                    <span className="text-sm text-text-secondary font-inter font-light">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4">
                <span className="font-cormorant text-2xl text-cosmos-night">
                  {t('hotel.ibisStyles.priceFrom')}
                </span>
              </div>
            </div>
          </div>

          {/* Adagio */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="relative rounded-lg aspect-[4/3] group lg:order-2">
              <OptimizedImage src={adagioImg} alt="Adagio Aparthotel Cosmos Angre" containerClassName="w-full h-full rounded-lg" hoverZoom />
              <div className="absolute top-4 left-4 z-10 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-md">
                <span className="text-sm font-inter font-semibold text-cosmos-night tracking-wide">Adagio</span>
              </div>
            </div>
            <div className="lg:order-1">
              <span className="overline mb-3 block">{t('hotel.adagio.overline')}</span>
              <h3 className="font-cormorant text-3xl md:text-4xl text-cosmos-night font-light mb-2">
                {t('hotel.adagio.name')}
              </h3>
              <p className="text-sm text-cosmos-night/60 font-inter font-medium uppercase tracking-wider mb-4">
                {t('hotel.adagio.subtitle')}
              </p>
              <p className="text-base text-text-secondary font-inter font-light leading-relaxed mb-6">
                {t('hotel.adagio.description')}
              </p>
              <ul className="space-y-3 mb-8">
                {adagioFeatures.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-cosmos-night/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-cosmos-night/60" strokeWidth={2} />
                    </div>
                    <span className="text-sm text-text-secondary font-inter font-light">{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4">
                <span className="font-cormorant text-2xl text-cosmos-night">
                  {t('hotel.adagio.priceFrom')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-cosmos-night">
        <div className="container-cosmos">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <div key={index} className="text-center p-6 bg-white/5 border border-white/5 rounded-md">
                <service.icon className="w-6 h-6 text-cosmos-cream/60 mx-auto mb-3" strokeWidth={1.5} />
                <span className="text-xs text-cosmos-cream/60 font-inter font-light">{service.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages CTA */}
      <section className="section bg-cosmos-cream">
        <div className="container-cosmos text-center">
          <Reveal>
            <span className="overline mb-4 block">{c('hotel.packages.overline', t('hotel.packages.overline'))}</span>
            <h2 className="section-title mb-4">{c('hotel.packages.title', t('hotel.packages.title'))}</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              {c('hotel.packages.description', t('hotel.packages.description'))}
            </p>
            <Link to="/contact" className="btn-primary">
              {t('common.requestQuote')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default HotelPage;
