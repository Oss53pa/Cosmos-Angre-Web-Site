import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Crown, Award, Gift, ArrowRight, Percent, Calendar, Car } from 'lucide-react';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import { useContent } from '../../lib/content/SiteContentProvider';

const FidelitePage: React.FC = () => {
  const { t } = useTranslation();
  const { c } = useContent();
  const navigate = useNavigate();

  const tiers = [
    {
      name: t('fidelity.tiers.silver.name'),
      icon: Star,
      price: t('fidelity.tiers.silver.price'),
      benefits: t('fidelity.tiers.silver.benefits', { returnObjects: true }) as string[],
    },
    {
      name: t('fidelity.tiers.gold.name'),
      icon: Crown,
      price: t('fidelity.tiers.gold.price'),
      featured: true,
      benefits: t('fidelity.tiers.gold.benefits', { returnObjects: true }) as string[],
    },
    {
      name: t('fidelity.tiers.platinum.name'),
      icon: Award,
      price: t('fidelity.tiers.platinum.price'),
      benefits: t('fidelity.tiers.platinum.benefits', { returnObjects: true }) as string[],
    },
  ];

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title="Programme fidélité"
        description="Silver, Gold, Platinum : rejoignez le programme fidélité Cosmos Angré et profitez d'avantages exclusifs, remises et invitations VIP à Cocody."
        keywords={['programme fidélité', 'Cosmos Angré', 'avantages VIP Abidjan', 'carte fidélité Cocody', 'récompenses centre commercial']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Programme fidélité', url: '/fidelite' },
        ])}
      />
      {/* Hero */}
      <section className="relative py-32 md:py-40 bg-cosmos-night overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cosmos-gold/5 to-transparent" />
        <div className="container-cosmos relative z-10 text-center">
          <span className="overline mb-4 block animate-fade-in-down">{c('fidelity.hero.overline', t('fidelity.hero.overline'))}</span>
          <h1 className="font-cormorant text-5xl md:text-7xl text-cosmos-cream font-light mb-4 animate-fade-in-up text-balance">{c('fidelity.hero.title', t('fidelity.hero.title'))}</h1>
          <p className="text-base text-cosmos-cream/60 font-inter font-light max-w-xl mx-auto">
            {c('fidelity.hero.subtitle', t('fidelity.hero.subtitle'))}
          </p>
        </div>
      </section>

      {/* Tiers */}
      <section id="offres" className="section bg-cosmos-warm scroll-mt-24">
        <div className="container-cosmos">
          <div className="text-center mb-16">
            <span className="overline mb-4 block">{t('fidelity.tiers.overline')}</span>
            <h2 className="section-title">{t('fidelity.tiers.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className={`rounded-lg overflow-hidden ${
                  tier.featured
                    ? 'bg-cosmos-night text-cosmos-cream border-2 border-cosmos-gold shadow-gold scale-[1.02]'
                    : 'card border border-cosmos-cream'
                }`}
              >
                <div className="p-8">
                  <tier.icon className={`w-8 h-8 mb-4 ${tier.featured ? 'text-cosmos-gold' : 'text-cosmos-night'}`} strokeWidth={1.5} />
                  <h3 className={`font-cormorant text-3xl font-light mb-1 ${tier.featured ? 'text-cosmos-cream' : 'text-cosmos-night'}`}>
                    {tier.name}
                  </h3>
                  <p className={`text-xs font-inter font-light mb-6 ${tier.featured ? 'text-cosmos-gold' : 'text-cosmos-gold'}`}>
                    {tier.price}
                  </p>
                  <ul className="space-y-3 mb-8">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className={`w-1 h-1 rounded-full mt-2 flex-shrink-0 ${tier.featured ? 'bg-cosmos-gold' : 'bg-cosmos-gold'}`} />
                        <span className={`text-sm font-inter font-light ${tier.featured ? 'text-cosmos-cream/70' : 'text-text-secondary'}`}>
                          {b}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate(tier.featured ? '/auth/register' : '/contact')}
                    className={tier.featured ? 'btn-primary w-full' : 'btn-secondary w-full'}
                  >
                    {tier.featured ? t('fidelity.tiers.joinCta') : t('fidelity.tiers.learnMoreCta')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Overview */}
      <section className="py-16 bg-cosmos-night">
        <div className="container-cosmos">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Percent, label: t('fidelity.benefits.discounts') },
              { icon: Calendar, label: t('fidelity.benefits.events') },
              { icon: Car, label: t('fidelity.benefits.parking') },
              { icon: Gift, label: t('fidelity.benefits.gifts') },
            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-white/5 border border-white/5 rounded-md">
                <item.icon className="w-6 h-6 text-cosmos-gold mx-auto mb-3" strokeWidth={1.5} />
                <span className="text-xs text-cosmos-cream/60 font-inter font-light">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="carte-cadeau" className="section bg-cosmos-cream scroll-mt-24">
        <div className="container-cosmos text-center">
          <span className="overline mb-4 block">{t('fidelity.cta.overline')}</span>
          <h2 className="section-title mb-4">{t('fidelity.cta.title')}</h2>
          <p className="section-subtitle max-w-lg mx-auto">
            {t('fidelity.cta.subtitle')}
          </p>
          <Link to="/auth/register" className="btn-primary">
            {t('fidelity.cta.createAccount')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FidelitePage;
