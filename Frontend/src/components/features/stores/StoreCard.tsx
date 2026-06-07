import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Star, Tag } from 'lucide-react';
import OptimizedImage from '../../common/OptimizedImage';

export interface StoreData {
  id: string;
  name: string;
  categoryKey: string;
  category: string;
  zone: string;
  zoneKey: string;
  locationCode: string;
  hours: string;
  phone: string;
  description: string;
  rating: number;
  image: string;
  logo?: string;
  website?: string;
  photos?: string[];
  currentOffers?: string[];
}

interface StoreCardProps {
  store: StoreData;
  index: number;
  onClick: (store: StoreData) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, index, onClick }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="card group cursor-pointer"
      onClick={() => onClick(store)}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <OptimizedImage
          src={store.image}
          alt={store.name}
          containerClassName="absolute inset-0"
          hoverZoom
        />
        {store.rating > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-sm">
            <Star className="w-3 h-3 text-cosmos-gold fill-cosmos-gold" strokeWidth={1.5} />
            <span className="text-[11px] font-inter font-medium text-cosmos-night">
              {store.rating}
            </span>
          </div>
        )}
        {store.currentOffers && store.currentOffers.length > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-cosmos-night text-cosmos-cream rounded-sm">
            <Tag className="w-3 h-3" strokeWidth={1.5} />
            <span className="text-[10px] font-inter font-medium uppercase tracking-wider">
              {t('storeDirectory.hasOffers')}
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <span className="text-[10px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium">
          {store.category}
        </span>
        <h4 className="font-cormorant text-lg text-cosmos-night font-light mt-1 mb-2">
          {store.name}
        </h4>
        <p className="text-xs text-text-secondary font-inter font-light line-clamp-2 mb-3">
          {store.description}
        </p>
        <div className="flex items-center gap-2 text-[11px] text-text-secondary font-inter font-light">
          <MapPin className="w-3 h-3" strokeWidth={1.5} />
          <span>
            {store.zone} — {store.locationCode}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default StoreCard;
