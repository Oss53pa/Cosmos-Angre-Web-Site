import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Star } from 'lucide-react';
import { type StoreData } from './StoreCard';
import OptimizedImage from '../../common/OptimizedImage';

interface StoreListItemProps {
  store: StoreData;
  index: number;
  onClick: (store: StoreData) => void;
}

const StoreListItem: React.FC<StoreListItemProps> = ({ store, index, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="card group block cursor-pointer"
      onClick={() => onClick(store)}
    >
      <div className="flex items-center gap-4 md:gap-6 p-5">
        <OptimizedImage
          src={store.image}
          alt={store.name}
          containerClassName="w-20 h-20 rounded-md flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <span className="text-[10px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium">
            {store.category}
          </span>
          <h4 className="font-cormorant text-lg text-cosmos-night font-light">{store.name}</h4>
          <p className="text-xs text-text-secondary font-inter font-light line-clamp-1">
            {store.description}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-6 text-[11px] text-text-secondary font-inter font-light flex-shrink-0">
          {store.rating > 0 && (
            <span className="flex items-center gap-1.5">
              <Star className="w-3 h-3 text-cosmos-gold fill-cosmos-gold" strokeWidth={1.5} />
              {store.rating}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3 h-3" strokeWidth={1.5} />
            {store.zone}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" strokeWidth={1.5} />
            {store.hours}
          </span>
        </div>
        <ArrowRight
          className="w-4 h-4 text-text-secondary group-hover:text-cosmos-gold group-hover:translate-x-1 transition-all flex-shrink-0"
          strokeWidth={1.5}
        />
      </div>
    </motion.div>
  );
};

export default StoreListItem;
