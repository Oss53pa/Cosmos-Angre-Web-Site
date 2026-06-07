import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Phone, Star, Tag, Map, Globe, ImageIcon } from 'lucide-react';
import { type StoreData } from './StoreCard';

interface StoreDetailModalProps {
  store: StoreData | null;
  onClose: () => void;
}

const StoreDetailModal: React.FC<StoreDetailModalProps> = ({ store, onClose }) => {
  const { t } = useTranslation();

  const coverSrc = store?.image || store?.photos?.[0] || null;
  // Galerie = photos hors couverture
  const galleryPhotos = (store?.photos || []).filter((p) => p && p !== coverSrc);
  const initial = (store?.name?.trim().charAt(0) || '·').toUpperCase();

  type InfoCard = { icon: typeof Tag; label: string; value: string; href?: string };
  const infoCards: InfoCard[] = [];
  if (store) {
    if (store.category) infoCards.push({ icon: Tag, label: t('storeDirectory.modal.segment', 'Segment'), value: store.category });
    const loc = [store.zone, store.locationCode].filter(Boolean).join(' · ');
    if (loc) infoCards.push({ icon: MapPin, label: t('storeDirectory.modal.location', 'Localisation'), value: loc });
    if (store.hours) infoCards.push({ icon: Clock, label: t('storeDirectory.modal.hours', 'Horaires'), value: store.hours });
    if (store.phone) infoCards.push({ icon: Phone, label: t('storeDirectory.modal.phone', 'Téléphone'), value: store.phone, href: `tel:${store.phone.replace(/\s/g, '')}` });
  }

  return (
    <AnimatePresence>
      {store && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-cosmos-night/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="pointer-events-auto bg-white rounded-t-2xl md:rounded-2xl overflow-hidden w-full max-w-[680px] max-h-[92vh] md:max-h-[88vh] flex flex-col shadow-luxury-lg"
            >
              {/* Bande visuelle (couverture ou repli de marque) */}
              <div className="relative h-52 md:h-60 flex-shrink-0 bg-cosmos-night overflow-hidden">
                {coverSrc ? (
                  <>
                    <img
                      src={coverSrc}
                      alt={store.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cosmos-night via-cosmos-night/45 to-cosmos-night/10" />
                  </>
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 35%, rgb(var(--cosmos-gold) / 0.18), transparent 70%)',
                    }}
                  >
                    {store.logo ? (
                      <img
                        src={store.logo}
                        alt={store.name}
                        className="max-h-20 max-w-[45%] object-contain opacity-90"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="font-cormorant text-7xl text-cosmos-gold/35 font-light select-none">
                        {initial}
                      </span>
                    )}
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-white/15 backdrop-blur-sm border border-white/25 rounded-full text-cosmos-cream hover:bg-white/25 transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-4 h-4" strokeWidth={1.5} />
                </button>

                <div className="absolute bottom-4 left-6 right-6 z-10">
                  {store.category && (
                    <span className="text-[10px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium">
                      {store.category}
                    </span>
                  )}
                  <h3 className="font-cormorant text-2xl md:text-3xl text-cosmos-cream font-light mt-1">
                    {store.name}
                  </h3>
                </div>
              </div>

              {/* Contenu */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
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
                    <span className="text-sm font-inter font-medium text-cosmos-night">{store.rating}</span>
                  </div>
                )}

                {store.description && (
                  <p className="text-sm text-text-secondary font-inter font-light leading-relaxed">
                    {store.description}
                  </p>
                )}

                {/* Infos clés */}
                {infoCards.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {infoCards.map((card, i) => (
                      <div key={i} className="flex items-start gap-3 p-4 bg-cosmos-cream/50 rounded-lg">
                        <card.icon className="w-4 h-4 text-cosmos-gold mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                        <div className="min-w-0">
                          <p className="text-[11px] uppercase tracking-[0.1em] text-text-secondary font-inter font-medium mb-1">
                            {card.label}
                          </p>
                          {'href' in card && card.href ? (
                            <a
                              href={card.href}
                              className="text-sm text-cosmos-night font-inter font-light hover:text-cosmos-gold transition-colors break-words"
                            >
                              {card.value}
                            </a>
                          ) : (
                            <p className="text-sm text-cosmos-night font-inter font-light break-words">
                              {card.value}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Galerie photos */}
                {galleryPhotos.length > 0 ? (
                  <div>
                    <h4 className="text-[11px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium mb-3 flex items-center gap-2">
                      <ImageIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                      {t('storeDirectory.modal.gallery', 'Galerie')}
                    </h4>
                    <div className="-mx-1 flex gap-3 overflow-x-auto pb-1 snap-x">
                      {galleryPhotos.slice(0, 10).map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt={`${store.name} ${i + 1}`}
                          loading="lazy"
                          className="h-36 w-56 flex-shrink-0 object-cover rounded-lg border border-cosmos-cream snap-start"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  !coverSrc && (
                    <div className="rounded-lg border border-dashed border-cosmos-cream bg-cosmos-cream/30 py-8 flex flex-col items-center justify-center text-center">
                      <ImageIcon className="w-7 h-7 text-cosmos-night/20 mb-2" strokeWidth={1.25} />
                      <p className="text-xs text-text-secondary font-inter font-light">
                        {t('storeDirectory.modal.noPhotos', 'Photos bientôt disponibles')}
                      </p>
                    </div>
                  )
                )}

                {/* Offres en cours */}
                {store.currentOffers && store.currentOffers.length > 0 && (
                  <div>
                    <h4 className="text-[11px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium mb-3 flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5" strokeWidth={1.5} />
                      {t('storeDirectory.modal.currentOffers', 'Offres en cours')}
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
                {(store.website || store.locationCode) && (
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
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StoreDetailModal;
