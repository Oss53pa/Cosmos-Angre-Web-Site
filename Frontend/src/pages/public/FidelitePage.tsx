import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, Crown, Award, Gift, ArrowRight, Percent, Calendar, Car } from 'lucide-react';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import { useContent } from '../../lib/content/SiteContentProvider';
import { supabase } from '../../lib/supabase';

interface TierView {
  name: string;
  icon: React.ElementType;
  price: string;
  featured?: boolean;
  benefits: string[];
}

interface ClubTierRow {
  name: string;
  price: string | null;
  tagline: string | null;
  benefits: string[] | null;
  is_featured: boolean | null;
  is_published: boolean | null;
  sort: number | null;
  level: number | null;
}

// Icône attribuée par rang (les niveaux supérieurs prennent les plus prestigieuses)
const TIER_ICONS = [Star, Crown, Award];

const FidelitePage: React.FC = () => {
  const { t } = useTranslation();
  const { c } = useContent();
  const navigate = useNavigate();

  // Valeurs par défaut (i18n) — utilisées tant que la base n'a pas répondu.
  const fallbackTiers: TierView[] = [
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

  const [tiers, setTiers] = useState<TierView[]>(fallbackTiers);

  // Source de vérité : cosmos.club_tiers (gérée par /admin/cosmos-club).
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await (
          supabase as unknown as {
            from: (t: string) => {
              select: (c: string) => {
                order: (
                  col: string,
                  o: { ascending: boolean }
                ) => Promise<{ data: ClubTierRow[] | null; error: unknown }>;
              };
            };
          }
        )
          .from('club_tiers')
          .select('name,price,tagline,benefits,is_featured,is_published,sort,level')
          .order('sort', { ascending: true });

        if (!active || error || !data) return;
        const published = data.filter((r) => r.is_published !== false);
        if (published.length === 0) return; // garde le fallback i18n
        const mapped: TierView[] = published.map((r, i) => ({
          name: r.name,
          price: r.price || r.tagline || '',
          featured: !!r.is_featured,
          benefits: Array.isArray(r.benefits) ? r.benefits : [],
          icon: TIER_ICONS[Math.min(i, TIER_ICONS.length - 1)],
        }));
        setTiers(mapped);
      } catch {
        // garde le fallback
      }
    })();
    return () => {
      active = false;
    };
  }, []);

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
      <section className="relative py-24 md:py-32 bg-cosmos-night overflow-hidden">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-cosmos-gold/8 to-transparent" />
        <div className="container-cosmos relative z-10 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div className="text-center md:text-left">
            <span className="overline mb-4 block animate-fade-in-down">{c('fidelity.hero.overline', t('fidelity.hero.overline'))}</span>
            <h1 className="font-cormorant text-5xl md:text-6xl text-cosmos-cream font-light mb-5 animate-fade-in-up text-balance">{c('fidelity.hero.title', t('fidelity.hero.title'))}</h1>
            <p className="text-base text-cosmos-cream/70 font-inter font-light max-w-xl md:mx-0 mx-auto mb-8 leading-relaxed">
              {c('fidelity.hero.subtitle', t('fidelity.hero.subtitle'))}
            </p>
            <Link to="/auth/register" className="btn-primary">
              {t('fidelity.tiers.joinCta', 'Rejoindre le Cosmos Club')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          {/* Carte de membre flottante */}
          <div className="flex items-center justify-center">
            <div className="relative w-80 h-48 md:w-96 md:h-56">
              <div
                className="absolute -inset-12 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgb(var(--cosmos-gold) / 0.18), transparent 70%)' }}
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cosmos-gold via-cosmos-gold-light to-cosmos-gold shadow-gold-lg transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-cormorant text-lg text-cosmos-night font-medium tracking-wide">COSMOS CLUB</span>
                    <Crown className="w-6 h-6 text-cosmos-night/60" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="w-10 h-7 rounded-sm bg-cosmos-night/20 mb-4" />
                    <div className="text-xs text-cosmos-night/60 font-inter tracking-[0.3em] uppercase">**** **** **** 2026</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-cosmos-night/60 font-inter uppercase tracking-wider">Platinum</span>
                    <Gift className="w-5 h-5 text-cosmos-night/40" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section id="offres" className="section bg-cosmos-warm scroll-mt-24">
        <div className="container-cosmos">
          <div className="text-center mb-16">
            <span className="overline mb-4 block">{t('fidelity.tiers.overline')}</span>
            <h2 className="section-title">{t('fidelity.tiers.title')}</h2>
          </div>
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${
              tiers.length >= 4 ? 'lg:grid-cols-4' : 'md:grid-cols-3'
            }`}
          >
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

      {/* Comment ça marche */}
      <section className="section bg-cosmos-cream">
        <div className="container-cosmos">
          <div className="text-center mb-14">
            <span className="overline mb-4 block">{c('fidelity.how.overline', 'Simple et gratuit')}</span>
            <h2 className="section-title">{c('fidelity.how.title', 'Comment ça marche')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: '01', title: c('fidelity.how.step1.title', 'Inscrivez-vous'), desc: c('fidelity.how.step1.desc', "En quelques secondes, gratuitement. Votre carte Cosmos Club est immédiatement active.") },
              { n: '02', title: c('fidelity.how.step2.title', 'Cumulez à chaque visite'), desc: c('fidelity.how.step2.desc', 'Vos achats et votre présence vous font monter en niveau, automatiquement.') },
              { n: '03', title: c('fidelity.how.step3.title', 'Profitez des privilèges'), desc: c('fidelity.how.step3.desc', "Remises, invitations, parking et services réservés aux membres.") },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-cosmos-cream p-8 text-center">
                <div className="font-cormorant text-5xl text-cosmos-gold/30 font-light mb-3">{s.n}</div>
                <h3 className="font-cormorant text-2xl text-cosmos-night font-light mb-2">{s.title}</h3>
                <p className="text-sm text-text-secondary font-inter font-light leading-relaxed">{s.desc}</p>
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
