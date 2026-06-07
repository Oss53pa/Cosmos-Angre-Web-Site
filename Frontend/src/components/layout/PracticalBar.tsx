import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Car, Map } from 'lucide-react';
import { useContent } from '../../lib/content/SiteContentProvider';

/**
 * PracticalBar — bandeau "infos pratiques" toujours accessible (inspiré des
 * grands centres : Westfield Les 4 Temps, AEON Mall). Horaires + accès rapide.
 * Tout est éditable via la console (clés practical.*).
 */
const PracticalBar: React.FC = () => {
  const { c } = useContent();

  const items = [
    {
      icon: Clock,
      label: c('practical.hours', 'Tous les jours · 10h – 22h'),
      to: '/preparer-visite',
    },
    { icon: MapPin, label: c('practical.access', 'Accès & itinéraire'), to: '/preparer-visite' },
    { icon: Car, label: c('practical.parking', 'Parking gratuit'), to: '/preparer-visite' },
    { icon: Map, label: c('practical.plan', 'Plan interactif'), to: '/plan-interactif' },
  ];

  return (
    <section className="bg-cosmos-night-deep border-t border-white/5">
      <div className="container-cosmos py-3.5">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5">
          {items.map(({ icon: Icon, label, to }) => (
            <li key={label}>
              <Link
                to={to}
                className="group inline-flex items-center gap-2.5 text-cosmos-cream/70 hover:text-cosmos-gold transition-colors"
              >
                <Icon className="w-4 h-4 text-cosmos-gold/80" strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-[0.14em] font-inter">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PracticalBar;
