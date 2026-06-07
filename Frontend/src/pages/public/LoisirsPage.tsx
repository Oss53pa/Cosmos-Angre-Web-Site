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
import PageHero from '../../components/common/PageHero';
import Reveal from '../../components/common/Reveal';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import { useContent } from '../../lib/content/SiteContentProvider';

const LoisirsPage: React.FC = () => {
  const { t } = useTranslation();
  const { c } = useContent();

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
        keywords={['loisirs Cosmos Angré', 'cinéma Abidjan', 'bowling Cocody', 'jeux enfants', "galerie d'art Angré"]}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Loisirs', url: '/loisirs' },
        ])}
      />

      <PageHero
        image={c('leisure.hero.image') || cinemaExperience}
        alt="Loisirs & Culture à Cosmos Angré"
        overline={c('leisure.hero.overline', t('leisure.hero.overline'))}
        title={c('leisure.hero.title', t('leisure.hero.title'))}
        subtitle={c('leisure.hero.subtitle', t('leisure.hero.subtitle'))}
      />

      {/* Bande d'ambiance en mouvement */}
      <section className="bg-cosmos-night py-10 md:py-14 overflow-hidden">
        <div className="container-cosmos mb-6 text-center">
          <span className="overline text-cosmos-gold">{c('leisure.motion.overline', "L'énergie Cosmos")}</span>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-cosmos-night to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-cosmos-night to-transparent" />
          <div className="flex w-max gap-4 animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none">
            {[cinemaExperience, bowlingAlley, kidsPlayground, artGallery, expoConvention, cinemaExperience, bowlingAlley, kidsPlayground, artGallery, expoConvention].map((src, i) => (
              <div key={i} className="w-64 md:w-80 h-44 md:h-52 flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10">
                <img src={src} alt="" aria-hidden="true" loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spaces */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            {spaces.map((space, index) => (
              <Reveal
                key={index}
                direction={index % 2 === 1 ? 'left' : 'right'}
                className="card group grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 overflow-hidden"
              >
                <div
                  className={`relative overflow-hidden aspect-[16/10] md:aspect-auto ${
                    index % 2 === 1 ? 'md:order-2' : ''
                  }`}
                >
                  <OptimizedImage
                    src={space.image}
                    alt={space.title}
                    containerClassName="w-full h-full"
                    hoverZoom
                  />
                </div>
                <div
                  className={`p-8 md:p-12 flex flex-col justify-center ${
                    index % 2 === 1 ? 'md:order-1' : ''
                  }`}
                >
                  <space.icon className="w-8 h-8 text-cosmos-gold mb-4" strokeWidth={1.5} />
                  <h3 className="font-cormorant text-3xl text-cosmos-night font-light mb-3">
                    {space.title}
                  </h3>
                  <p className="text-sm text-text-secondary font-inter font-light leading-relaxed">
                    {space.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark">
        <div className="container-cosmos text-center">
          <Reveal>
            <span className="overline mb-4 block">{c('leisure.cta.overline', t('leisure.cta.overline'))}</span>
            <h2 className="section-title-light">{c('leisure.cta.title', t('leisure.cta.title'))}</h2>
            <p className="section-subtitle-light max-w-lg mx-auto">
              {c('leisure.cta.subtitle', t('leisure.cta.subtitle'))}
            </p>
            <Link to="/evenements" className="btn-primary">
              {c('leisure.cta.viewAgenda', t('leisure.cta.viewAgenda'))}{' '}
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default LoisirsPage;
