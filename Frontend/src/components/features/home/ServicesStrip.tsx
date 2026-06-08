import React from 'react';
import { Car, Wifi, ConciergeBell, Baby, Gift, CreditCard } from 'lucide-react';
import Reveal from '../../common/Reveal';
import { useContent } from '../../../lib/content/SiteContentProvider';

/**
 * ServicesStrip — rangée de services en icônes (réassurance), inspirée des
 * grands centres. Libellés éditables via la console (home.services.*).
 */
const ServicesStrip: React.FC = () => {
  const { c } = useContent();

  const services = [
    { icon: Car, label: c('home.services.parking', 'Parking gratuit') },
    { icon: Wifi, label: c('home.services.wifi', 'Wi-Fi gratuit') },
    { icon: ConciergeBell, label: c('home.services.concierge', 'Conciergerie') },
    { icon: Baby, label: c('home.services.family', 'Espace famille') },
    { icon: Gift, label: c('home.services.giftcard', 'Carte cadeau') },
    { icon: CreditCard, label: c('home.services.club', 'Cosmos Club') },
  ];

  return (
    <section className="py-12 md:py-14 bg-cosmos-warm border-y border-cosmos-night/5">
      <div className="container-cosmos">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-y-8 gap-x-4">
          {services.map(({ icon: Icon, label }, i) => (
            <Reveal key={i} delay={i * 60} className="flex flex-col items-center text-center gap-3">
              <span className="w-12 h-12 rounded-full border border-cosmos-gold/30 flex items-center justify-center">
                <Icon className="w-5 h-5 text-cosmos-gold" strokeWidth={1.5} />
              </span>
              <span className="text-[11px] md:text-xs uppercase tracking-[0.12em] text-cosmos-night/70 font-inter">
                {label}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesStrip;
