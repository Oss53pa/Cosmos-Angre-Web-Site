import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Phone, Star, Tag, Map, Globe } from 'lucide-react';
import { type StoreData } from './StoreCard';

interface StoreDetailModalProps {
  store: StoreData | null;
  onClose: () => void;
}

const StoreDetailModal: React.FC<StoreDetailModalProps> = ({ store, onClose }) => {
  const { t } = useTranslation();

  return (
    <AnimatePresence>
      {store && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-cosmos-night/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal — centré via flex (sinon le transform de framer-motion casse le -translate) */}
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-3 md:p-4 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="pointer-events-auto bg-white rounded-xl overflow-hidden w-full max-w-[560px] max-h-[88vh] flex flex-col shadow-luxury-lg"
          >
            {/* Header — logo (ou nom) sur fond forêt, jamais de photo stock */}
            <div className="relative h-44 md:h-52 flex-shrink-0 bg-cosmos-night flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 38%, rgb(var(--cosmos-gold) / 0.14), transparent 70%)',
                }}
              />
              {store.logo ? (
                <img
                  src={store.logo}
                  alt={store.name}
                  className="relative max-h-16 md:max-h-20 max-w-[55%] object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : null}

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-cosmos-cream hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>

              {/* Catégorie + nom */}
              <div className="absolute bottom-4 left-6 right-6 z-10">
                <span className="text-[10px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium">
                  {store.category}
                </span>
                <h3 className="font-cormorant text-2xl md:text-3xl text-cosmos-cream font-light mt-1">
                  {store.name}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              {/* Galerie photos (quelques visuels) */}
              {store.photos && store.photos.length > 0 && (
                <div className="-mx-1 flex gap-3 overflow-x-auto pb-1 snap-x">
                  {store.photos.slice(0, 8).map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`${store.name} ${i + 1}`}
                      loading="lazy"
                      className="h-40 w-64 flex-shrink-0 object-cover rounded-lg border border-cosmos-cream snap-start"
                    />
                  ))}
                </div>
              )}

              {/* Rating */}
              {store.rating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(store.rating) ? 'text-cosmos-gold fill-cosmos-gold' : 'text-cosmos-cream'}`}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-inter font-medium text-cosmos-night">
                    {store.rating}
                  </span>
                </div>
              )}

              {/* Description */}
              {store.description && (
                <p className="text-sm text-text-secondary font-inter font-light leading-relaxed">
                  {store.description}
                </p>
              )}

              {/* Info Grid — uniquement les infos renseignées */}
              {(store.category || store.zone || store.locationCode || store.hours || store.phone) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {store.category && (
                    <div className="flex items-start gap-3 p-4 bg-cosmos-cream/50 rounded-md">
                      <Tag className="w-4 h-4 text-cosmos-gold mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.1em] text-text-secondary font-inter font-medium mb-1">
                          {t('storeDirectory.modal.segment', 'Segment')}
                        </p>
                        <p className="text-sm text-cosmos-night font-inter font-light">{store.category}</p>
                      </div>
                    </div>
                  )}

                  {(store.zone || store.locationCode) && (
                    <div className="flex items-start gap-3 p-4 bg-cosmos-cream/50 rounded-md">
                      <MapPin className="w-4 h-4 text-cosmos-gold mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.1em] text-text-secondary font-inter font-medium mb-1">
                          {t('storeDirectory.modal.location')}
                        </p>
                        <p className="text-sm text-cosmos-night font-inter font-light">
                          {[store.zone, store.locationCode].filter(Boolean).join(' — ')}
                        </p>
                      </div>
                    </div>
                  )}

                  {store.hours && (
                    <div className="flex items-start gap-3 p-4 bg-cosmos-cream/50 rounded-md">
                      <Clock className="w-4 h-4 text-cosmos-gold mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.1em] text-text-secondary font-inter font-medium mb-1">
                          {t('storeDirectory.modal.hours')}
                        </p>
                        <p className="text-sm text-cosmos-night font-inter font-light">{store.hours}</p>
                      </div>
                    </div>
                  )}

                  {store.phone && (
                    <div className="flex items-start gap-3 p-4 bg-cosmos-cream/50 rounded-md">
                      <Phone className="w-4 h-4 text-cosmos-gold mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.1em] text-text-secondary font-inter font-medium mb-1">
                          {t('storeDirectory.modal.phone')}
                        </p>
                        <a
                          href={`tel:${store.phone.replace(/\s/g, '')}`}
                          className="text-sm text-cosmos-night font-inter font-light hover:text-cosmos-gold transition-colors"
                        >
                          {store.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Current Offers */}
              {store.currentOffers && store.currentOffers.length > 0 && (
                <div>
                  <h4 className="text-[11px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium mb-3 flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5" strokeWidth={1.5} />
                    {t('storeDirectory.modal.currentOffers')}
                  </h4>
                  <div className="space-y-2">
                    {store.currentOffers.map((offer, i) => (
                      <div
                        key={i}
                        className="text-sm text-cosmos-night font-inter font-light p-3 bg-cosmos-gold/5 border border-cosmos-gold/10 rounded-md"
                      >
                        {offer}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {store.website && (
                  <a
                    href={store.website.startsWith('http') ? store.website : `https://${store.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary flex-1 justify-center"
                  >
                    <Globe className="w-4 h-4" strokeWidth={1.5} />
                    {t('storeDirectory.modal.visitWebsite', 'Visiter le site')}
                  </a>
                )}
                {store.locationCode && (
                  <Link
                    to={`/plan-interactif?store=${store.locationCode}`}
                    className={`${store.website ? 'btn-outline' : 'btn-primary'} flex-1 justify-center`}
                    onClick={onClose}
                  >
                    <Map className="w-4 h-4" strokeWidth={1.5} />
                    {t('storeDirectory.modal.viewOnMap', 'Voir sur le plan')}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StoreDetailModal;
