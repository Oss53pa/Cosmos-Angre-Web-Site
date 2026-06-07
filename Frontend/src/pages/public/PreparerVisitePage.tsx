import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Car, Bus, Smartphone, ParkingCircle, Clock, Wifi, Baby, Accessibility, CreditCard, Battery, MapPin, ArrowRight, ChevronDown } from 'lucide-react';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import PageHero from '../../components/common/PageHero';
import { useContent } from '../../lib/content/SiteContentProvider';
import heroImage from '../../assets/images/branding/hero-exterior.jpg';

const PreparerVisitePage: React.FC = () => {
  const { t } = useTranslation();
  const { c } = useContent();

  const services = [
    { icon: Wifi, label: t('visit.services.wifi.label'), desc: t('visit.services.wifi.desc') },
    { icon: Baby, label: t('visit.services.nursery.label'), desc: t('visit.services.nursery.desc') },
    { icon: Accessibility, label: t('visit.services.accessibility.label'), desc: t('visit.services.accessibility.desc') },
    { icon: CreditCard, label: t('visit.services.atm.label'), desc: t('visit.services.atm.desc') },
    { icon: Battery, label: t('visit.services.charging.label'), desc: t('visit.services.charging.desc') },
    { icon: MapPin, label: t('visit.services.concierge.label'), desc: t('visit.services.concierge.desc') },
  ];

  const faq = [
    { q: t('visit.faq.q1'), a: t('visit.faq.a1') },
    { q: t('visit.faq.q2'), a: t('visit.faq.a2') },
    { q: t('visit.faq.q3'), a: t('visit.faq.a3') },
    { q: t('visit.faq.q4'), a: t('visit.faq.a4') },
  ];

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title="Préparer votre visite"
        description="Horaires, accès, parking, services et FAQ : toutes les informations pratiques pour préparer votre visite à Cosmos Angré, Cocody-Angré."
        keywords={['préparer visite Cosmos Angré', 'horaires Cocody', 'accès Angré Abidjan', 'parking centre commercial', 'infos pratiques']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Préparer votre visite', url: '/preparer-visite' },
        ])}
      />
      <PageHero
        image={c('visit.hero.image') || heroImage}
        alt="Préparer votre visite — Cosmos Angré"
        overline={c('visit.hero.overline', t('visit.hero.overline'))}
        title={c('visit.hero.title', t('visit.hero.title'))}
        subtitle={c('visit.hero.subtitle', t('visit.hero.subtitle'))}
      />

      {/* How to get there */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="text-center mb-16">
            <span className="overline mb-4 block">{t('visit.access.overline')}</span>
            <h2 className="section-title">{t('visit.access.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Car, title: t('visit.access.byCar.title'), desc: t('visit.access.byCar.desc') },
              { icon: Bus, title: t('visit.access.byBus.title'), desc: t('visit.access.byBus.desc') },
              { icon: Smartphone, title: t('visit.access.byVtc.title'), desc: t('visit.access.byVtc.desc') },
            ].map((item, index) => (
              <div key={index} className="card p-8 text-center">
                <item.icon className="w-8 h-8 text-cosmos-night/60 mx-auto mb-4" strokeWidth={1.5} />
                <h4 className="font-cormorant text-xl text-cosmos-night font-light mb-2">{item.title}</h4>
                <p className="text-sm text-text-secondary font-inter font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parking + Hours */}
      <section id="parking" className="py-16 bg-cosmos-night scroll-mt-24">
        <div className="container-cosmos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-white/5 border border-white/5 rounded-lg">
              <ParkingCircle className="w-8 h-8 text-cosmos-cream/60 mb-4" strokeWidth={1.5} />
              <h3 className="font-cormorant text-2xl text-cosmos-cream font-light mb-3">{t('visit.parking.title')}</h3>
              <p className="text-sm text-cosmos-cream/60 font-inter font-light mb-4">
                {t('visit.parking.description')}
              </p>
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cosmos-gold/15 border border-cosmos-gold/30 text-cosmos-gold text-xs font-inter font-medium uppercase tracking-[0.15em]">
                  {t('visit.parking.free', 'Gratuit pour tous les visiteurs')}
                </span>
                <p className="text-xs text-cosmos-cream/60 font-inter font-light">
                  {t('visit.parking.amenities', 'Places PMR · Bornes de recharge électrique · Vidéo-surveillance 24/7')}
                </p>
              </div>
            </div>
            <div id="horaires" className="p-8 bg-white/5 border border-white/5 rounded-lg scroll-mt-24">
              <Clock className="w-8 h-8 text-cosmos-cream/60 mb-4" strokeWidth={1.5} />
              <h3 className="font-cormorant text-2xl text-cosmos-cream font-light mb-3">{t('visit.openingHours.title')}</h3>
              <div className="space-y-3 text-sm text-cosmos-cream/60 font-inter font-light">
                <div className="flex justify-between"><span>{t('visit.openingHours.monSat')}</span><span className="text-cosmos-cream">{t('visit.openingHours.monSatValue')}</span></div>
                <div className="flex justify-between"><span>{t('visit.openingHours.sunday')}</span><span className="text-cosmos-cream">{t('visit.openingHours.sundayValue')}</span></div>
                <div className="flex justify-between"><span>{t('visit.openingHours.holidays')}</span><span className="text-cosmos-cream">{t('visit.openingHours.holidaysValue')}</span></div>
                <p className="text-xs text-cosmos-cream/30 mt-4">{t('visit.openingHours.note')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="text-center mb-16">
            <span className="overline mb-4 block">{t('visit.services.overline')}</span>
            <h2 className="section-title">{t('visit.services.title')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <div key={i} className="card p-6 flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-cosmos-night/5 rounded-md flex-shrink-0">
                  <s.icon className="w-5 h-5 text-cosmos-night" strokeWidth={1.5} />
                </div>
                <div>
                  <h5 className="font-inter text-sm font-medium text-cosmos-night mb-1">{s.label}</h5>
                  <p className="text-xs text-text-secondary font-inter font-light">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section bg-cosmos-cream scroll-mt-24">
        <div className="container-cosmos max-w-3xl">
          <div className="text-center mb-16">
            <span className="overline mb-4 block">{t('visit.faq.overline')}</span>
            <h2 className="section-title">{t('visit.faq.title')}</h2>
          </div>
          <div className="space-y-4">
            {faq.map((item, i) => (
              <details key={i} className="card group p-6">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-inter text-sm font-medium text-cosmos-night pr-4">{item.q}</span>
                  <ChevronDown className="w-4 h-4 text-cosmos-night/40 flex-shrink-0 transition-transform group-open:rotate-180" strokeWidth={1.5} />
                </summary>
                <p className="text-sm text-text-secondary font-inter font-light mt-4 pt-4 border-t border-cosmos-cream">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map CTA */}
      <section className="py-20 bg-cosmos-night">
        <div className="container-cosmos text-center">
          <span className="overline mb-4 block">{t('visit.map.overline')}</span>
          <h2 className="font-cormorant text-3xl md:text-5xl text-cosmos-cream font-light mb-4">{t('visit.map.title')}</h2>
          <p className="text-sm text-cosmos-cream/60 font-inter font-light mb-10">
            {t('visit.map.subtitle')}
          </p>
          <Link to="/plan-interactif" className="btn-primary">
            {t('visit.map.openMap')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PreparerVisitePage;
