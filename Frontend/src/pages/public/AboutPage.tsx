import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Award, MapPin, ArrowRight } from 'lucide-react';
import { BRANDING, LOCATION, WHY_CHOOSE, SUSTAINABILITY, KEY_FIGURES } from '../../utils/brochureData';

import OptimizedImage from '../../components/common/OptimizedImage';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import heroExterior from '../../assets/images/branding/hero-exterior.jpg';
import locationAerial from '../../assets/images/branding/location-aerial.jpg';
import edgeBuilding from '../../assets/images/branding/edge-building.jpg';
import galleryInterior from '../../assets/images/branding/gallery-interior.jpg';
import visitorsExperience from '../../assets/images/branding/visitors-experience.jpg';
import indoorGarden from '../../assets/images/branding/indoor-garden.jpg';
import familyLifestyle from '../../assets/images/branding/family-lifestyle.jpg';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title="À propos"
        description="Découvrez Cosmos Angré, l'écrin de vie premium à Cocody-Angré qui réunit shopping, gastronomie, hôtels et bien-être au cœur d'Abidjan."
        keywords={['Cosmos Angré', 'à propos', 'centre commercial Abidjan', 'Cocody Angré', 'lifestyle premium', 'Côte d\'Ivoire']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'À propos', url: '/a-propos' },
        ])}
      />
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[55vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 animate-ken-burns">
          <OptimizedImage src={heroExterior} alt="Cosmos Angre Exterieur" containerClassName="w-full h-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-cosmos-night/80 via-cosmos-night/60 to-cosmos-night/80" />
        <div className="container-cosmos relative z-10 text-center">
          <span className="overline mb-4 block animate-fade-in-down">{t('about.hero.overline')}</span>
          <h1 className="font-cormorant text-5xl md:text-7xl text-cosmos-cream font-light mb-4 animate-fade-in-up">
            {BRANDING.tagline}
          </h1>
          <p className="text-base text-cosmos-cream/60 font-inter font-light max-w-xl mx-auto">
            "{BRANDING.mainSlogan}"
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16">
            <div>
              <span className="overline mb-4 block">{t('about.vision.overline')}</span>
              <h2 className="section-title">{t('about.vision.title')}</h2>
              <p className="text-sm text-text-secondary font-inter font-light leading-relaxed">
                {BRANDING.messages.welcome}
              </p>
            </div>
            <div className="group">
              <OptimizedImage src={galleryInterior} alt="Interieur du centre" containerClassName="w-full rounded-lg" hoverZoom />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="card p-10">
              <h3 className="font-cormorant text-2xl text-cosmos-night font-light mb-4">{t('about.vision.ecosystem')}</h3>
              <p className="text-sm text-text-secondary font-inter font-light mb-6">{BRANDING.messages.ecosystem}</p>
              <p className="font-cormorant text-xl text-cosmos-night italic">{BRANDING.catchPhrases.success}</p>
            </div>
            <OptimizedImage src={visitorsExperience} alt="Experience visiteurs" containerClassName="w-full h-full rounded-lg" />
          </div>
        </div>
      </section>

      {/* Why Choose Cosmos */}
      <section className="section bg-cosmos-cream">
        <div className="container-cosmos">
          <div className="text-center mb-16">
            <span className="overline mb-4 block">{t('about.strengths.overline')}</span>
            <h2 className="section-title">{WHY_CHOOSE.title}</h2>
            <p className="section-subtitle max-w-2xl mx-auto">{WHY_CHOOSE.description}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-12">
            {WHY_CHOOSE.reasons.map((reason, index) => (
              <div key={index} className="card p-8 hover-lift">
                <h3 className="font-cormorant text-xl text-cosmos-night font-light mb-3">{reason.title}</h3>
                <p className="text-sm text-text-secondary font-inter font-light">{reason.description}</p>
              </div>
            ))}
          </div>

          <div className="card p-10 text-center bg-cosmos-night">
            <p className="font-cormorant text-2xl text-cosmos-cream font-light italic">{WHY_CHOOSE.conclusion}</p>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <span className="overline mb-4 block">{t('about.location.overline')}</span>
              <h2 className="section-title">Au coeur du dynamisme de {LOCATION.name}</h2>
              <p className="text-sm text-text-secondary font-inter font-light leading-relaxed mb-8">{LOCATION.description}</p>

              <div className="space-y-3 mb-8">
                {LOCATION.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0 bg-cosmos-night/40" />
                    <span className="text-sm font-inter font-light text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="card p-6 flex items-start gap-4">
                <MapPin className="w-6 h-6 text-cosmos-gold flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.15em] text-cosmos-night/60 font-inter font-medium mb-1">{t('about.location.address')}</p>
                  <p className="font-cormorant text-lg text-cosmos-night">{BRANDING.contact.address.full}</p>
                </div>
              </div>
            </div>

            <OptimizedImage src={locationAerial} alt="Angre Chateau" containerClassName="w-full rounded-lg" />
          </div>
        </div>
      </section>

      {/* Sustainability / EDGE */}
      <section className="py-20 bg-cosmos-night">
        <div className="container-cosmos">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-16">
            <div>
              <span className="overline mb-4 block">{t('about.sustainability.overline')}</span>
              <h2 className="font-cormorant text-3xl md:text-5xl text-cosmos-cream font-light mb-6">{SUSTAINABILITY.name}</h2>
              <p className="text-sm text-cosmos-cream/60 font-inter font-light mb-4">{SUSTAINABILITY.description}</p>
              <p className="text-sm text-cosmos-cream/60 font-inter font-light mb-6">{SUSTAINABILITY.commitment}</p>
              <div className="pl-6 border-l-2 border-white/20">
                <p className="font-cormorant text-lg text-cosmos-cream italic">{SUSTAINABILITY.message}</p>
              </div>
            </div>
            <OptimizedImage src={edgeBuilding} alt="Batiment certifie EDGE" containerClassName="w-full rounded-lg" />
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <OptimizedImage src={indoorGarden} alt="Jardin interieur" containerClassName="w-full h-full rounded-lg" />
            <div className="p-10 bg-white/5 border border-white/5 rounded-lg">
              <div className="text-center mb-8">
                <Award className="w-12 h-12 mx-auto mb-4 text-cosmos-gold" strokeWidth={1.5} />
                <h3 className="font-cormorant text-3xl text-cosmos-cream font-light mb-2">EDGE</h3>
                <p className="text-sm text-cosmos-cream/60 font-inter font-light">{SUSTAINABILITY.fullName}</p>
                <p className="text-xs text-cosmos-cream/70 font-inter mt-3">{SUSTAINABILITY.status}</p>
              </div>
              <div className="space-y-3">
                {SUSTAINABILITY.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0 bg-cosmos-cream/40" />
                    <span className="text-sm font-inter font-light text-cosmos-cream/60">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Figures */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="text-center mb-16">
            <span className="overline mb-4 block">{t('about.figures.overline')}</span>
            <h2 className="section-title">{KEY_FIGURES.title}</h2>
            <p className="section-subtitle max-w-2xl mx-auto">{KEY_FIGURES.description}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-12">
            {KEY_FIGURES.figures.map((figure, index) => (
              <div key={index} className="card p-8 text-center hover-lift">
                <div className="font-cormorant text-4xl text-cosmos-night mb-3">{figure.value}</div>
                <h3 className="font-cormorant text-lg text-cosmos-night font-light mb-2">{figure.title}</h3>
                <p className="text-xs text-text-secondary font-inter font-light">{figure.description}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="card p-10">
              <h3 className="font-cormorant text-2xl text-cosmos-night font-light mb-4">{t('about.vision.growthLever')}</h3>
              <p className="text-sm text-text-secondary font-inter font-light">{KEY_FIGURES.conclusion}</p>
            </div>
            <OptimizedImage src={familyLifestyle} alt="Ambiance familiale" containerClassName="w-full h-full rounded-lg" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cosmos-night">
        <div className="container-cosmos text-center">
          <span className="overline mb-4 block">{t('about.cta.overline')}</span>
          <h2 className="font-cormorant text-3xl md:text-5xl text-cosmos-cream font-light mb-4">
            {BRANDING.catchPhrases.destination}
          </h2>
          <p className="text-sm text-cosmos-cream/60 font-inter font-light mb-10 max-w-lg mx-auto">
            {BRANDING.messages.invitation}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary">
              {t('common.contactUs')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
            <Link to="/boutiques" className="btn-outline">
              {t('about.cta.discoverSpaces')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
