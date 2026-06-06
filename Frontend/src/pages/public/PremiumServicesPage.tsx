import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Car, Gift, Navigation, User, Crown, Package, ArrowRight } from 'lucide-react';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';

const PremiumServicesPage: React.FC = () => {
  const { t } = useTranslation();

  const premiumServices = [
    {
      icon: Package,
      title: t('premiumServices.clickCollect.title'),
      subtitle: t('premiumServices.clickCollect.subtitle'),
      description: t('premiumServices.clickCollect.description'),
      features: t('premiumServices.clickCollect.features', { returnObjects: true }) as string[],
      benefits: t('premiumServices.clickCollect.benefits', { returnObjects: true }) as string[],
    },
    {
      icon: Car,
      title: t('premiumServices.smartParking.title'),
      subtitle: t('premiumServices.smartParking.subtitle'),
      description: t('premiumServices.smartParking.description'),
      features: t('premiumServices.smartParking.features', { returnObjects: true }) as string[],
      benefits: t('premiumServices.smartParking.benefits', { returnObjects: true }) as string[],
    },
    {
      icon: Gift,
      title: t('premiumServices.loyaltyProgram.title'),
      subtitle: t('premiumServices.loyaltyProgram.subtitle'),
      description: t('premiumServices.loyaltyProgram.description'),
      features: t('premiumServices.loyaltyProgram.features', { returnObjects: true }) as string[],
      benefits: t('premiumServices.loyaltyProgram.benefits', { returnObjects: true }) as string[],
    },
    {
      icon: Navigation,
      title: t('premiumServices.arNavigation.title'),
      subtitle: t('premiumServices.arNavigation.subtitle'),
      description: t('premiumServices.arNavigation.description'),
      features: t('premiumServices.arNavigation.features', { returnObjects: true }) as string[],
      benefits: t('premiumServices.arNavigation.benefits', { returnObjects: true }) as string[],
    },
    {
      icon: User,
      title: t('premiumServices.personalShopper.title'),
      subtitle: t('premiumServices.personalShopper.subtitle'),
      description: t('premiumServices.personalShopper.description'),
      features: t('premiumServices.personalShopper.features', { returnObjects: true }) as string[],
      benefits: t('premiumServices.personalShopper.benefits', { returnObjects: true }) as string[],
    },
    {
      icon: Crown,
      title: t('premiumServices.vipLounge.title'),
      subtitle: t('premiumServices.vipLounge.subtitle'),
      description: t('premiumServices.vipLounge.description'),
      features: t('premiumServices.vipLounge.features', { returnObjects: true }) as string[],
      benefits: t('premiumServices.vipLounge.benefits', { returnObjects: true }) as string[],
    },
  ];

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title="Services premium"
        description="Conciergerie VIP, personal shopper, lounge privé, parking intelligent : profitez des services premium signés Cosmos Angré à Cocody-Angré."
        keywords={['services premium', 'conciergerie VIP', 'personal shopper Abidjan', 'lounge VIP', 'Cosmos Angré']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Services premium', url: '/services-premium' },
        ])}
      />
      {/* Hero Section */}
      <section className="relative py-32 md:py-40 bg-cosmos-night overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cosmos-gold/5 to-transparent" />
        <div className="container-cosmos relative z-10 text-center">
          <div className="inline-flex items-center gap-2 mb-6 text-cosmos-gold">
            <Crown className="w-5 h-5" strokeWidth={1.5} />
            <span className="text-xs font-inter font-light uppercase tracking-[0.2em]">{t('premiumServices.hero.overline')}</span>
          </div>
          <h1 className="font-cormorant text-5xl md:text-7xl text-cosmos-cream font-light mb-6 animate-fade-in-up">
            {t('premiumServices.hero.title')}
          </h1>
          <p className="text-base text-cosmos-cream/60 font-inter font-light max-w-xl mx-auto">
            {t('premiumServices.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Services Premium — Detailed Sections */}
      {premiumServices.map((service, index) => (
        <section
          key={index}
          className={`section ${index % 2 === 0 ? 'bg-cosmos-warm' : 'bg-cosmos-cream'}`}
        >
          <div className="container-cosmos">
            <div className={`grid md:grid-cols-2 gap-12 md:gap-16 items-center ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
              {/* Content */}
              <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                <div className="flex items-center gap-3 mb-6">
                  <service.icon className="w-7 h-7 text-cosmos-gold" strokeWidth={1.5} />
                  <span className="overline">{t('premiumServices.serviceLabel')}</span>
                </div>

                <h2 className="font-cormorant text-3xl md:text-4xl text-cosmos-night font-light mb-4">
                  {service.title}
                </h2>
                <p className="text-base text-cosmos-gold font-inter font-light mb-4">
                  {service.subtitle}
                </p>
                <p className="text-sm text-text-secondary font-inter font-light mb-8 leading-relaxed">
                  {service.description}
                </p>

                <div className="mb-8">
                  <h3 className="text-sm font-inter font-medium text-cosmos-night mb-4 uppercase tracking-[0.1em]">
                    {t('premiumServices.featuresLabel')}
                  </h3>
                  <div className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-cosmos-gold/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-cosmos-gold" />
                        </div>
                        <p className="text-sm text-text-secondary font-inter font-light">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Benefits Card */}
              <div className={index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}>
                <div className="card p-8 border border-cosmos-cream">
                  <h3 className="text-sm font-inter font-medium text-cosmos-night mb-6 uppercase tracking-[0.1em]">
                    {t('premiumServices.keyBenefitsLabel')}
                  </h3>
                  <div className="space-y-4">
                    {service.benefits.map((benefit, idx) => (
                      <div key={idx} className="border-l-2 border-cosmos-gold pl-4">
                        <p className="text-sm text-text-secondary font-inter font-light">{benefit}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-cosmos-cream">
                    <button className="btn-primary w-full">
                      {t('premiumServices.learnMore')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Subscription Comparison Table */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="text-center mb-16">
            <span className="overline mb-4 block">{t('premiumServices.subscriptions.title')}</span>
            <h2 className="section-title">
              {t('premiumServices.subscriptions.subtitle')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Standard */}
            <div className="card p-8 border border-cosmos-cream">
              <div className="text-center mb-6">
                <h3 className="font-cormorant text-2xl text-cosmos-night font-light mb-2">{t('premiumServices.subscriptions.standard.name')}</h3>
                <p className="text-xs text-text-secondary font-inter font-light mb-4">{t('premiumServices.subscriptions.standard.label')}</p>
                <div className="font-cormorant text-4xl text-cosmos-night font-light mb-2">{t('premiumServices.subscriptions.standard.price')}</div>
                <p className="text-xs text-text-secondary font-inter font-light">{t('premiumServices.subscriptions.standard.period')}</p>
              </div>
              <div className="space-y-3 mb-8">
                {(t('premiumServices.subscriptions.standard.features', { returnObjects: true }) as string[]).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-cosmos-gold/15 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-cosmos-gold" />
                    </div>
                    <span className="text-sm text-text-secondary font-inter font-light">{feature}</span>
                  </div>
                ))}
              </div>
              <button className="btn-secondary w-full">
                {t('premiumServices.subscriptions.standard.cta')}
              </button>
            </div>

            {/* Gold — Featured */}
            <div className="relative bg-cosmos-night rounded-lg overflow-hidden border-2 border-cosmos-gold shadow-gold scale-[1.02]">
              <div className="bg-cosmos-gold text-cosmos-night text-center py-2 text-[10px] font-inter font-medium uppercase tracking-[0.15em]">
                {t('premiumServices.subscriptions.gold.badge')}
              </div>
              <div className="p-8">
                <div className="text-center mb-6">
                  <h3 className="font-cormorant text-2xl text-cosmos-cream font-light mb-2">{t('premiumServices.subscriptions.gold.name')}</h3>
                  <p className="text-xs text-cosmos-gold font-inter font-light mb-4">{t('premiumServices.subscriptions.gold.label')}</p>
                  <div className="font-cormorant text-4xl text-cosmos-cream font-light mb-2">{t('premiumServices.subscriptions.gold.price')}</div>
                  <p className="text-xs text-cosmos-cream/60 font-inter font-light">{t('premiumServices.subscriptions.gold.period')}</p>
                </div>
                <div className="space-y-3 mb-8">
                  {(t('premiumServices.subscriptions.gold.features', { returnObjects: true }) as string[]).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-cosmos-gold/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-cosmos-gold" />
                      </div>
                      <span className="text-sm text-cosmos-cream/70 font-inter font-light">{feature}</span>
                    </div>
                  ))}
                </div>
                <button className="btn-primary w-full">
                  {t('premiumServices.subscriptions.gold.cta')}
                </button>
              </div>
            </div>

            {/* Platinum */}
            <div className="card p-8 border border-cosmos-cream">
              <div className="text-center mb-6">
                <h3 className="font-cormorant text-2xl text-cosmos-night font-light mb-2">{t('premiumServices.subscriptions.platinum.name')}</h3>
                <p className="text-xs text-text-secondary font-inter font-light mb-4">{t('premiumServices.subscriptions.platinum.label')}</p>
                <div className="font-cormorant text-4xl text-cosmos-night font-light mb-2">{t('premiumServices.subscriptions.platinum.price')}</div>
                <p className="text-xs text-text-secondary font-inter font-light">{t('premiumServices.subscriptions.platinum.period')}</p>
              </div>
              <div className="space-y-3 mb-8">
                {(t('premiumServices.subscriptions.platinum.features', { returnObjects: true }) as string[]).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-cosmos-gold/15 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-cosmos-gold" />
                    </div>
                    <span className="text-sm text-text-secondary font-inter font-light">{feature}</span>
                  </div>
                ))}
              </div>
              <button className="btn-secondary w-full">
                {t('premiumServices.subscriptions.platinum.cta')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cosmos-night">
        <div className="container-cosmos text-center">
          <Crown className="w-12 h-12 mx-auto mb-6 text-cosmos-gold" strokeWidth={1.5} />
          <span className="overline mb-4 block">{t('premiumServices.hero.overline')}</span>
          <h2 className="font-cormorant text-3xl md:text-5xl text-cosmos-cream font-light mb-4">
            {t('premiumServices.cta.title')}
          </h2>
          <p className="text-sm text-cosmos-cream/60 font-inter font-light mb-10 max-w-lg mx-auto">
            {t('premiumServices.cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/register" className="btn-primary">
              {t('premiumServices.cta.signUp')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
            <Link to="/contact" className="btn-outline">
              {t('premiumServices.cta.learnMore')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PremiumServicesPage;
