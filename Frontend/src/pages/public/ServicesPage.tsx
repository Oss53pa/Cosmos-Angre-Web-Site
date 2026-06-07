import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Wifi, Car, CreditCard, Map, ShoppingBag, Headphones, Shield, Gift, ArrowRight } from 'lucide-react';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import PageHero from '../../components/common/PageHero';
import Reveal from '../../components/common/Reveal';
import { useContent } from '../../lib/content/SiteContentProvider';
import visitorsExperience from '../../assets/images/branding/visitors-experience.jpg';

const ServicesPage: React.FC = () => {
  const { t } = useTranslation();
  const { c } = useContent();

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
      <PageHero
        image={c('services.hero.image') || visitorsExperience}
        alt="Les services de Cosmos Angré"
        overline={c('services.hero.overline', t('services.hero.overline'))}
        title={c('services.hero.title', t('services.hero.title'))}
        subtitle={c('services.hero.subtitle', t('services.hero.subtitle'))}
      />

      {/* Services Grid */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <Reveal className="text-center mb-16">
            <span className="overline mb-4 block">{c('services.grid.overline', t('services.grid.overline'))}</span>
            <h2 className="section-title">{c('services.grid.title', t('services.grid.title'))}</h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((service, index) => (
              <Reveal key={index} delay={Math.min(index, 8) * 60} className="card p-8 text-center">
                <service.icon className="w-8 h-8 mx-auto mb-4 text-cosmos-gold" strokeWidth={1.5} />
                <h3 className="font-cormorant text-lg text-cosmos-night font-light mb-2">{service.name}</h3>
                <p className="text-xs text-text-secondary font-inter font-light">{service.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark">
        <Reveal className="container-cosmos text-center">
          <span className="overline mb-4 block">{c('services.cta.overline', t('services.cta.overline'))}</span>
          <h2 className="section-title-light">{c('services.cta.title', t('services.cta.title'))}</h2>
          <p className="section-subtitle-light max-w-lg mx-auto">
            {c('services.cta.subtitle', t('services.cta.subtitle'))}
          </p>
          <Link to="/contact" className="btn-primary">
            {c('services.cta.contact', t('services.cta.contact'))} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
};

export default ServicesPage;
