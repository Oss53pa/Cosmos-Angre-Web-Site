import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Gamepad2, Film, HeartPulse, Briefcase, ArrowRight, Check, Ruler } from 'lucide-react';

import OptimizedImage from '../../components/common/OptimizedImage';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import GalaxyPageHeader from '../../components/features/galaxy/GalaxyPageHeader';
import GrainOverlay from '../../components/features/galaxy/GrainOverlay';
import CosmicDivider from '../../components/features/galaxy/CosmicDivider';
import bowlingAlley from '../../assets/images/branding/bowling-alley.jpg';
import cinemaExperience from '../../assets/images/branding/cinema-experience.jpg';
import modernClinic from '../../assets/images/branding/modern-clinic.jpg';
import modernOffice from '../../assets/images/branding/modern-office.jpg';

const RetailParkPage: React.FC = () => {
  const { t } = useTranslation();

  const bigBoxes = [
    {
      icon: Gamepad2,
      titleKey: 'retailPark.boxes.entertainment',
      area: '522 m\u00B2',
      image: bowlingAlley,
    },
    {
      icon: Film,
      titleKey: 'retailPark.boxes.cinema',
      area: '1 167 m\u00B2',
      image: cinemaExperience,
    },
    {
      icon: HeartPulse,
      titleKey: 'retailPark.boxes.clinic',
      area: '500 m\u00B2',
      image: modernClinic,
    },
    {
      icon: Briefcase,
      titleKey: 'retailPark.boxes.officePark',
      area: '1 820 m\u00B2',
      image: modernOffice,
    },
  ];

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title="Retail Park"
        description="Cinéma, salle de jeu, clinique et bureaux : le Retail Park agrandit bientôt Cosmos Angré, au cœur d'Angré, Cocody, Abidjan."
        keywords={['retail park Angré', 'cinéma Angré', 'clinique Cocody', 'Cosmos Angré', 'bureaux Cocody']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Retail Park', url: '/retail-park' },
        ])}
      />
      {/* Hero galaxie */}
      <GalaxyPageHeader
        overline="Retail Park"
        title="Quatre géants,"
        titleAccent="bientôt."
        subtitle="Cinéma, salle de jeu, clinique et immeuble de bureaux. Le Retail Park prolonge Cosmos Angré bien au-delà du shopping."
      />

      {/* Introduction */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="overline mb-4 block">L'expansion</span>
            <h2 className="section-title mb-4">Bien plus qu'une galerie</h2>
            <p className="section-subtitle">
              À côté des enseignes, quatre grandes surfaces viennent prolonger l'expérience :
              se divertir, se soigner, travailler. Une nouvelle dimension qui ouvre bientôt
              ses portes au cœur d'Angré.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { value: '4', label: 'Grandes enseignes' },
              { value: '4 009', suffix: 'm\u00B2', label: 'Surface suppl\u00E9mentaire' },
              { value: '2026', label: 'Premi\u00E8res ouvertures' },
              { value: '24/7', label: 'Acc\u00E8s & s\u00E9curit\u00E9' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-cosmos-warm border border-cosmos-cream rounded-md">
                <div className="font-cormorant text-3xl md:text-4xl text-cosmos-night font-light mb-1">
                  {stat.value}<span className="text-cosmos-gold text-xl">{stat.suffix || ''}</span>
                </div>
                <span className="text-[11px] uppercase tracking-[0.12em] text-text-secondary font-inter font-light">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Big Box Spaces */}
      <section className="section bg-cosmos-cream">
        <div className="container-cosmos">
          <div className="text-center mb-12 md:mb-16">
            <span className="overline mb-4 block">À venir</span>
            <h2 className="section-title">Les quatre géants du Retail Park</h2>
          </div>

          <div className="space-y-8 md:space-y-12">
            {bigBoxes.map((box, index) => {
              const Icon = box.icon;
              const features = t(`${box.titleKey}.features`, { returnObjects: true }) as string[];

              return (
                <div
                  key={index}
                  className={`card group grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden`}
                >
                  {/* Image / Placeholder */}
                  <div className={`relative aspect-[16/10] lg:aspect-auto bg-cosmos-night/5 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    {box.image ? (
                      <OptimizedImage
                        src={box.image}
                        alt={t(`${box.titleKey}.name`)}
                        containerClassName="w-full h-full"
                        hoverZoom
                      />
                    ) : (
                      <div className="w-full h-full min-h-[250px] flex flex-col items-center justify-center bg-gradient-to-br from-cosmos-night/5 to-cosmos-night/10">
                        <Icon className="w-16 h-16 text-cosmos-gold/30 mb-3" strokeWidth={1} />
                        <span className="text-xs text-text-secondary font-inter font-light">{t(`${box.titleKey}.name`)}</span>
                      </div>
                    )}
                    {/* Area badge */}
                    <div className="absolute top-4 left-4 z-10 px-3 py-1.5 bg-cosmos-warm/90 backdrop-blur-sm rounded-md flex items-center gap-1.5">
                      <Ruler className="w-3 h-3 text-cosmos-gold" strokeWidth={1.5} />
                      <span className="text-[11px] font-inter font-medium text-cosmos-night">{box.area}</span>
                    </div>
                    {/* À venir */}
                    <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-cosmos-gold rounded-full">
                      <span className="text-[10px] font-inter font-semibold uppercase tracking-[0.15em] text-cosmos-night">
                        Bientôt
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`p-8 md:p-10 lg:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-cosmos-gold/10 rounded-md flex items-center justify-center">
                        <Icon className="w-5 h-5 text-cosmos-gold" strokeWidth={1.5} />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium">
                        Big Box {index + 1}
                      </span>
                    </div>
                    <h3 className="font-cormorant text-2xl md:text-3xl text-cosmos-night font-light mb-2">
                      {t(`${box.titleKey}.name`)}
                    </h3>
                    <p className="text-sm text-cosmos-gold font-inter font-medium uppercase tracking-wider mb-4">
                      {t(`${box.titleKey}.subtitle`)}
                    </p>
                    <p className="text-sm text-text-secondary font-inter font-light leading-relaxed mb-6">
                      {t(`${box.titleKey}.description`)}
                    </p>
                    {Array.isArray(features) && (
                      <ul className="space-y-2.5">
                        {features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-cosmos-gold/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-cosmos-gold" strokeWidth={2} />
                            </div>
                            <span className="text-sm text-text-secondary font-inter font-light">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 bg-cosmos-night relative overflow-hidden">
        <GrainOverlay opacity={0.05} />
        <div className="container-cosmos relative z-10">
          <div className="text-center mb-10">
            <span className="overline mb-4 block">{t('retailPark.advantages.overline')}</span>
            <h2 className="font-cormorant text-3xl md:text-4xl text-cosmos-cream font-light">{t('retailPark.advantages.title')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(t('retailPark.advantages.items', { returnObjects: true }) as { title: string; desc: string }[]).map((item, i) => (
              <div key={i} className="text-center p-6 bg-white/5 border border-white/5 rounded-md">
                <h4 className="font-cormorant text-lg text-cosmos-cream font-light mb-2">{item.title}</h4>
                <p className="text-xs text-cosmos-cream/60 font-inter font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — ouverture */}
      <section className="section bg-cosmos-cream">
        <div className="container-cosmos text-center">
          <CosmicDivider className="mb-10" />
          <span className="overline mb-4 block">Restez connectés</span>
          <h2 className="section-title mb-4">Soyez là dès l'ouverture</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Le Retail Park ouvre ses portes en 2026. Laissez-nous votre email et soyez
            parmi les premiers prévenus, dès le premier jour.
          </p>
          <Link to="/pre-lancement" className="btn-primary">
            Être informé de l'ouverture <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default RetailParkPage;
