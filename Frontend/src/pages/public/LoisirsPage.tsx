import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Film, Gamepad2, Baby, Palette, Calendar, ArrowRight } from 'lucide-react';
import cinemaExperience from '../../assets/images/branding/cinema-experience.jpg';
import bowlingAlley from '../../assets/images/branding/bowling-alley.jpg';
import kidsPlayground from '../../assets/images/branding/kids-playground.jpg';
import artGallery from '../../assets/images/branding/art-gallery.jpg';
import expoConvention from '../../assets/images/branding/expo-convention.jpg';
import OptimizedImage from '../../components/common/OptimizedImage';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';

const LoisirsPage: React.FC = () => {
  const { t } = useTranslation();

  const spaces = [
    { icon: Film, title: t('leisure.spaces.cinema.title'), desc: t('leisure.spaces.cinema.desc'), image: cinemaExperience },
    { icon: Gamepad2, title: t('leisure.spaces.entertainment.title'), desc: t('leisure.spaces.entertainment.desc'), image: bowlingAlley },
    { icon: Baby, title: t('leisure.spaces.kids.title'), desc: t('leisure.spaces.kids.desc'), image: kidsPlayground },
    { icon: Palette, title: t('leisure.spaces.gallery.title'), desc: t('leisure.spaces.gallery.desc'), image: artGallery },
    { icon: Calendar, title: t('leisure.spaces.expo.title'), desc: t('leisure.spaces.expo.desc'), image: expoConvention },
  ];

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title="Loisirs"
        description="Cinéma, bowling, espaces enfants, galerie d'art et expositions : vivez le divertissement nouvelle génération à Cosmos Angré, Cocody."
        keywords={['loisirs Cosmos Angré', 'cinéma Abidjan', 'bowling Cocody', 'jeux enfants', 'galerie d\'art Angré']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Loisirs', url: '/loisirs' },
        ])}
      />
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[55vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 animate-ken-burns">
          <OptimizedImage
            src={bowlingAlley}
            alt="Loisirs Cosmos Angre"
            containerClassName="w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-cosmos-night/80 via-cosmos-night/50 to-cosmos-night/85" />
        <div className="container-cosmos relative z-10 text-center">
          <span className="overline mb-4 block animate-fade-in-down">{t('leisure.hero.overline')}</span>
          <h1 className="font-cormorant text-5xl md:text-7xl text-cosmos-cream font-light mb-4 animate-fade-in-up">{t('leisure.hero.title')}</h1>
          <p className="text-base text-cosmos-cream/60 font-inter font-light max-w-xl mx-auto">
            {t('leisure.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Spaces */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            {spaces.map((space, index) => (
              <div key={index} className={`card group grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 overflow-hidden`}>
                <div className={`relative overflow-hidden aspect-[16/10] md:aspect-auto ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <OptimizedImage
                    src={space.image}
                    alt={space.title}
                    containerClassName="w-full h-full"
                    hoverZoom
                  />
                </div>
                <div className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <space.icon className="w-8 h-8 text-cosmos-night/60 mb-4" strokeWidth={1.5} />
                  <h3 className="font-cormorant text-3xl text-cosmos-night font-light mb-3">{space.title}</h3>
                  <p className="text-sm text-text-secondary font-inter font-light leading-relaxed">{space.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cosmos-night">
        <div className="container-cosmos text-center">
          <span className="overline mb-4 block">{t('leisure.cta.overline')}</span>
          <h2 className="font-cormorant text-3xl md:text-5xl text-cosmos-cream font-light mb-4">{t('leisure.cta.title')}</h2>
          <p className="text-sm text-cosmos-cream/60 font-inter font-light mb-10 max-w-lg mx-auto">
            {t('leisure.cta.subtitle')}
          </p>
          <Link to="/evenements" className="btn-primary">{t('leisure.cta.viewAgenda')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} /></Link>
        </div>
      </section>
    </div>
  );
};

export default LoisirsPage;
