import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Wifi, Car, CreditCard, Map, ShoppingBag, Headphones, Shield, Gift, ArrowRight } from 'lucide-react';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import visitorsExperience from '../../assets/images/branding/visitors-experience.jpg';

const ServicesPage: React.FC = () => {
  const { t } = useTranslation();

  const services = [
    { icon: Wifi, name: t('services.list.wifi.name'), description: t('services.list.wifi.description') },
    { icon: Car, name: t('services.list.parking.name'), description: t('services.list.parking.description') },
    { icon: CreditCard, name: t('services.list.clickCollect.name'), description: t('services.list.clickCollect.description') },
    { icon: Map, name: t('services.list.guide.name'), description: t('services.list.guide.description') },
    { icon: ShoppingBag, name: t('services.list.concierge.name'), description: t('services.list.concierge.description') },
    { icon: Headphones, name: t('services.list.support.name'), description: t('services.list.support.description') },
    { icon: Shield, name: t('services.list.security.name'), description: t('services.list.security.description') },
    { icon: Gift, name: t('services.list.loyalty.name'), description: t('services.list.loyalty.description') },
  ];

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title="Services"
        description="Wi-Fi gratuit, parking, conciergerie, click & collect : tous les services pratiques pour profiter pleinement de Cosmos Angré à Cocody."
        keywords={['services Cosmos Angré', 'conciergerie Abidjan', 'parking Cocody', 'click and collect', 'Wi-Fi centre commercial']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Services', url: '/services' },
        ])}
      />
      {/* Hero */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 animate-ken-burns" style={{ backgroundImage: `url(${visitorsExperience})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-cosmos-night/80 via-cosmos-night/60 to-cosmos-night/80" />
        <div className="container-cosmos relative z-10 text-center">
          <span className="overline mb-4 block animate-fade-in-down">{t('services.hero.overline')}</span>
          <h1 className="font-cormorant text-5xl md:text-7xl text-cosmos-cream font-light mb-4 animate-fade-in-up">{t('services.hero.title')}</h1>
          <p className="text-base text-cosmos-cream/60 font-inter font-light max-w-xl mx-auto">
            {t('services.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="text-center mb-16">
            <span className="overline mb-4 block">{t('services.grid.overline')}</span>
            <h2 className="section-title">{t('services.grid.title')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service, index) => (
              <div key={index} className="card p-8 text-center hover-lift">
                <service.icon className="w-8 h-8 mx-auto mb-4 text-cosmos-night" strokeWidth={1.5} />
                <h3 className="font-cormorant text-lg text-cosmos-night font-light mb-2">{service.name}</h3>
                <p className="text-xs text-text-secondary font-inter font-light">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cosmos-night">
        <div className="container-cosmos text-center">
          <span className="overline mb-4 block">{t('services.cta.overline')}</span>
          <h2 className="font-cormorant text-3xl md:text-5xl text-cosmos-cream font-light mb-4">{t('services.cta.title')}</h2>
          <p className="text-sm text-cosmos-cream/60 font-inter font-light mb-10 max-w-lg mx-auto">
            {t('services.cta.subtitle')}
          </p>
          <Link to="/contact" className="btn-primary">
            {t('services.cta.contact')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;
