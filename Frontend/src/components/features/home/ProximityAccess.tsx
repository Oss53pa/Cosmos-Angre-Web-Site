import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Car, MapPin, Navigation, ArrowRight } from 'lucide-react';
import Reveal from '../../common/Reveal';
import GrainOverlay from '../galaxy/GrainOverlay';
import { useContent } from '../../../lib/content/SiteContentProvider';

/**
 * ProximityAccess — « la proximité est le rempart » (stratégie).
 * Repères pratiques (distance, horaires, parking, adresse) + accès.
 */
const ProximityAccess: React.FC = () => {
  const { c } = useContent();

  const items = [
    {
      icon: Navigation,
      label: c('home.proximity.distance', 'À 10 min'),
      sub: c('home.proximity.distanceSub', "du cœur d'Angré"),
    },
    {
      icon: Clock,
      label: c('practical.hours', 'Tous les jours · 10h–22h'),
      sub: c('home.proximity.hoursSub', 'Boutiques & restaurants'),
    },
    {
      icon: Car,
      label: c('home.proximity.parking', '1 200 places'),
      sub: c('home.proximity.parkingSub', 'Parking gratuit'),
    },
    {
      icon: MapPin,
      label: c('home.proximity.address', 'Bd Latrille, Angré'),
      sub: c('home.proximity.addressSub', 'Cocody · Abidjan'),
    },
  ];

  return (
    <section className="section-dark relative overflow-hidden">
      <GrainOverlay opacity={0.05} />
      <div className="container-cosmos relative z-10">
        <Reveal className="text-center mb-12">
          <span className="overline mb-4 block">{c('home.proximity.overline', 'Proximité')}</span>
          <h2 className="section-title-light">
            {c('home.proximity.title', 'À deux pas de chez vous')}
          </h2>
          <p className="section-subtitle-light max-w-2xl mx-auto">
            {c(
              'home.proximity.subtitle',
              "Le meilleur du quotidien, sans reprendre la voiture. Au cœur d'Angré, le temps vous est rendu."
            )}
          </p>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
          {items.map((it, i) => (
            <Reveal
              key={i}
              delay={i * 80}
              className="text-center p-6 bg-white/5 border border-white/5 rounded-xl"
            >
              <it.icon className="w-7 h-7 text-cosmos-gold mx-auto mb-3" strokeWidth={1.25} />
              <div className="font-cormorant text-xl md:text-2xl text-cosmos-cream font-light leading-tight">
                {it.label}
              </div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-cosmos-cream/70 font-inter mt-1.5">
                {it.sub}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="text-center">
          <Link to="/preparer-visite" className="btn-primary">
            {c('home.proximity.cta', 'Préparer ma visite')}
            <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProximityAccess;
