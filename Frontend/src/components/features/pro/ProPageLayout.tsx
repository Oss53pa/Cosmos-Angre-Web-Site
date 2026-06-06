import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import OptimizedImage from '../../common/OptimizedImage';

export interface ProBenefit {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ProStat {
  value: string;
  label: string;
}

interface ProPageLayoutProps {
  /** Hero overline (small uppercase tag) */
  overline: string;
  /** Hero main title */
  title: string;
  /** Hero subtitle / description */
  subtitle: string;
  /** Hero background image */
  heroImage: string;
  /** Hero image alt */
  heroAlt: string;
  /** Optional intro paragraph (after hero) */
  intro?: string;
  /** Stats row (KPI cards) */
  stats?: ProStat[];
  /** Benefits grid (3-6 cards) */
  benefits?: ProBenefit[];
  /** Section "Pourquoi nous" — bullet points */
  reasons?: { title: string; description: string }[];
  /** Process steps */
  steps?: { number: string; title: string; description: string }[];
  /** CTA bottom */
  ctaTitle?: string;
  ctaDescription?: string;
  ctaLabel?: string;
  ctaTo?: string;
  /** Email pour mailto */
  contactEmail?: string;
}

export const ProPageLayout: React.FC<ProPageLayoutProps> = ({
  overline,
  title,
  subtitle,
  heroImage,
  heroAlt,
  intro,
  stats,
  benefits,
  reasons,
  steps,
  ctaTitle = 'Discutons de votre projet',
  ctaDescription = 'Notre équipe vous accompagne à chaque étape.',
  ctaLabel = 'Prendre contact',
  ctaTo = '/contact',
  contactEmail,
}) => (
  <main className="bg-cosmos-warm">
    {/* Hero */}
    <section className="relative h-[55vh] md:h-[60vh] flex items-end overflow-hidden">
      <div className="absolute inset-0 animate-ken-burns">
        <OptimizedImage src={heroImage} alt={heroAlt} containerClassName="w-full h-full" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-cosmos-night via-cosmos-night/60 to-cosmos-night/20" />
      <div className="container-cosmos relative z-10 pb-12 md:pb-16">
        <span className="overline mb-4 block animate-fade-in-down">{overline}</span>
        <h1 className="font-cormorant text-4xl md:text-6xl text-cosmos-cream font-light mb-4 max-w-3xl animate-fade-in-up">
          {title}
        </h1>
        <p className="text-base md:text-lg text-cosmos-cream/70 font-inter font-light max-w-2xl">
          {subtitle}
        </p>
      </div>
    </section>

    {/* Intro */}
    {intro && (
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <p className="max-w-3xl mx-auto text-center font-cormorant text-2xl md:text-3xl text-cosmos-night font-light leading-relaxed">
            {intro}
          </p>
        </div>
      </section>
    )}

    {/* Stats */}
    {stats && stats.length > 0 && (
      <section className="py-16 bg-cosmos-night">
        <div className="container-cosmos">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-cormorant text-4xl md:text-6xl text-cosmos-gold font-light mb-2">
                  {stat.value}
                </div>
                <div className="text-[11px] md:text-xs uppercase tracking-[0.15em] text-cosmos-cream/60 font-inter font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* Benefits */}
    {benefits && benefits.length > 0 && (
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="text-center mb-16">
            <span className="overline mb-4 block">Avantages</span>
            <h2 className="section-title">Ce que nous offrons</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={i}
                  className="card p-7 hover-lift group bg-cosmos-cream/40 border border-cosmos-text/10"
                >
                  <div className="w-12 h-12 rounded-lg bg-cosmos-gold/10 flex items-center justify-center mb-5 group-hover:bg-cosmos-gold/20 transition-colors">
                    <Icon className="w-6 h-6 text-cosmos-gold" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-cormorant text-xl text-cosmos-night font-light mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-cosmos-text/70 font-inter font-light leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    )}

    {/* Reasons */}
    {reasons && reasons.length > 0 && (
      <section className="section bg-cosmos-cream">
        <div className="container-cosmos">
          <div className="text-center mb-16">
            <span className="overline mb-4 block">Pourquoi Cosmos Angré</span>
            <h2 className="section-title">Une plateforme premium</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 max-w-4xl mx-auto">
            {reasons.map((r, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cosmos-gold/10 text-cosmos-gold font-cormorant text-lg flex items-center justify-center">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="font-cormorant text-xl text-cosmos-night font-light mb-2">
                    {r.title}
                  </h3>
                  <p className="text-sm text-cosmos-text/70 font-inter font-light leading-relaxed">
                    {r.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* Steps */}
    {steps && steps.length > 0 && (
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="text-center mb-16">
            <span className="overline mb-4 block">Comment procéder</span>
            <h2 className="section-title">Notre processus</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="font-cormorant text-6xl text-cosmos-gold/20 font-light mb-3">
                  {step.number}
                </div>
                <h3 className="font-cormorant text-lg text-cosmos-night font-light mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-cosmos-text/70 font-inter font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* CTA */}
    <section className="py-20 bg-cosmos-night">
      <div className="container-cosmos text-center max-w-2xl mx-auto">
        <span className="overline mb-4 block">Contact dédié</span>
        <h2 className="font-cormorant text-3xl md:text-5xl text-cosmos-cream font-light mb-4">
          {ctaTitle}
        </h2>
        <p className="text-sm text-cosmos-cream/60 font-inter font-light mb-10">
          {ctaDescription}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to={ctaTo} className="btn-primary">
            {ctaLabel} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="px-6 py-3 border border-cosmos-cream/20 text-cosmos-cream hover:border-cosmos-gold hover:text-cosmos-gold transition-colors rounded font-inter text-sm tracking-wide"
            >
              {contactEmail}
            </a>
          )}
        </div>
      </div>
    </section>
  </main>
);

export default ProPageLayout;
