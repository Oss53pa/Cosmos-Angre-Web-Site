import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShoppingBag,
  Film,
  Dumbbell,
  Briefcase,
  Stethoscope,
  Hotel,
  Car,
  Palette,
  TreePine,
  ArrowRight,
} from 'lucide-react';
import { SPACES, BRANDING } from '../../utils/brochureData';
import OptimizedImage from '../../components/common/OptimizedImage';
import PageHero from '../../components/common/PageHero';
import Reveal from '../../components/common/Reveal';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import { useContent } from '../../lib/content/SiteContentProvider';

import galleryInterior from '../../assets/images/branding/gallery-interior.jpg';
import artisanMarket from '../../assets/images/branding/artisan-market.jpg';
import promenadePark from '../../assets/images/branding/promenade-park.jpg';
import cinemaExperience from '../../assets/images/branding/cinema-experience.jpg';
import outdoorCourt from '../../assets/images/branding/outdoor-court.jpg';
import modernOffice from '../../assets/images/branding/modern-office.jpg';
import medicalTeam from '../../assets/images/branding/medical-team.jpg';
import hotelsFacade from '../../assets/images/branding/hotels-facade.jpg';

const SpacesPage: React.FC = () => {
  const { t } = useTranslation();
  const { c } = useContent();

  const spacesList = [
    { id: 'gallery', icon: ShoppingBag, data: SPACES.gallery, image: galleryInterior },
    { id: 'artisan', icon: Palette, data: SPACES.artisanMarket, image: artisanMarket },
    { id: 'promenade', icon: TreePine, data: SPACES.promenade, image: promenadePark },
    { id: 'entertainment', icon: Dumbbell, data: SPACES.bigBox1, image: outdoorCourt },
    { id: 'cinema', icon: Film, data: SPACES.bigBox2, image: cinemaExperience },
    { id: 'clinique', icon: Stethoscope, data: SPACES.bigBox3, image: medicalTeam },
    { id: 'office', icon: Briefcase, data: SPACES.bigBox4, image: modernOffice },
    {
      id: 'hotels',
      icon: Hotel,
      data: {
        name: 'Hotels Ibis Styles & Adagio',
        subtitle: "L'hospitalite au coeur de Cosmos Angre",
        description: 'Avec les hotels Ibis Styles et Adagio, Cosmos Angre offre bien plus que du shopping et des loisirs, devenant un lieu de sejour ideal pour tous les visiteurs.',
        features: [...SPACES.hotels.ibisStyles.features, ...SPACES.hotels.adagio.features],
      },
      image: hotelsFacade,
    },
  ];

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title="Nos espaces"
        description="Galerie marchande, retail park, bureaux, hôtels et jardins : explorez les espaces emblématiques de Cosmos Angré, à Cocody-Angré, Abidjan."
        keywords={['espaces Cosmos Angré', 'galerie marchande Abidjan', 'retail park Cocody', 'bureaux Angré', 'hôtels Abidjan']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Nos espaces', url: '/espaces' },
        ])}
      />
      <PageHero
        image={c('spaces.hero.image') || galleryInterior}
        alt="Les espaces de Cosmos Angré"
        overline={c('spaces.hero.overline', t('spaces.hero.overline'))}
        title={c('spaces.hero.title', t('spaces.hero.title'))}
        subtitle={c('spaces.hero.subtitle', t('spaces.hero.subtitle'))}
      />

      {/* Spaces */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="space-y-6">
            {spacesList.map((space, index) => (
              <Reveal
                key={space.id}
                direction={index % 2 === 1 ? 'left' : 'right'}
                className="card group grid md:grid-cols-2 overflow-hidden"
              >
                <div className={`aspect-[16/10] md:aspect-auto ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <OptimizedImage src={space.image} alt={space.data.name} containerClassName="w-full h-full" hoverZoom />
                </div>
                <div className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <space.icon className="w-6 h-6 text-cosmos-gold" strokeWidth={1.5} />
                    <span className="text-[10px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium">{space.data.name}</span>
                  </div>
                  <h2 className="font-cormorant text-3xl text-cosmos-night font-light mb-4">{space.data.subtitle}</h2>
                  <p className="text-sm text-text-secondary font-inter font-light leading-relaxed mb-6">{space.data.description}</p>

                  <div className="space-y-2 mb-6">
                    {space.data.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0 bg-cosmos-gold" />
                        <span className="text-xs font-inter font-light text-text-secondary">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {space.data.specs && (
                    <div className="flex gap-4 md:gap-6 pt-4 border-t border-cosmos-cream">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-text-secondary font-inter mb-1">{t('common.surface')}</p>
                        <p className="font-cormorant text-xl text-cosmos-night">{space.data.specs.totalArea}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-text-secondary font-inter mb-1">{t('common.floors')}</p>
                        <p className="font-cormorant text-xl text-cosmos-night">{space.data.specs.floors}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Parking */}
      <section className="py-16 bg-cosmos-night">
        <div className="container-cosmos">
          <div className="text-center mb-12">
            <span className="overline mb-4 block">{t('spaces.parking.overline')}</span>
            <h2 className="font-cormorant text-3xl md:text-5xl text-cosmos-cream font-light mb-4">{SPACES.parking.subtitle}</h2>
            <p className="text-sm text-cosmos-cream/60 font-inter font-light max-w-2xl mx-auto">{SPACES.parking.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-8">
            <div className="p-8 bg-white/5 border border-white/5 rounded-lg">
              <Car className="w-8 h-8 text-cosmos-gold mb-4" strokeWidth={1.5} />
              <h3 className="font-cormorant text-2xl text-cosmos-cream font-light mb-3">{SPACES.parking.underground.name}</h3>
              <div className="font-cormorant text-4xl text-cosmos-gold mb-3">{SPACES.parking.underground.capacity}</div>
              <p className="text-sm text-cosmos-cream/60 font-inter font-light">{SPACES.parking.underground.description}</p>
            </div>
            <div className="p-8 bg-white/5 border border-white/5 rounded-lg">
              <TreePine className="w-8 h-8 text-cosmos-gold mb-4" strokeWidth={1.5} />
              <h3 className="font-cormorant text-2xl text-cosmos-cream font-light mb-3">{SPACES.parking.outdoor.name}</h3>
              <div className="font-cormorant text-4xl text-cosmos-gold mb-3">{SPACES.parking.outdoor.capacity}</div>
              <p className="text-sm text-cosmos-cream/60 font-inter font-light">{SPACES.parking.outdoor.description}</p>
            </div>
          </div>

          <div className="p-8 bg-white/5 border border-white/5 rounded-lg text-center">
            <p className="text-[10px] uppercase tracking-[0.15em] text-cosmos-cream/60 font-inter mb-2">{t('common.totalCapacity')}</p>
            <p className="font-cormorant text-5xl text-cosmos-gold">{SPACES.parking.total}</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-cosmos-cream">
        <Reveal className="container-cosmos text-center">
          <span className="overline mb-4 block">{c('spaces.cta.overline', t('spaces.cta.overline'))}</span>
          <h2 className="section-title mb-4">{c('spaces.cta.title', t('spaces.cta.title'))}</h2>
          <p className="section-subtitle max-w-lg mx-auto">{BRANDING.messages.invitation}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary">
              {t('common.contactUs')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
            <Link to="/a-propos" className="btn-secondary">
              {t('common.learnMore')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default SpacesPage;
