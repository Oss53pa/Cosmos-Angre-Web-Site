import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Store,
  Edit,
  Image,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Save,
  Plus,
  Trash2,
  Eye,
  XCircle,
} from 'lucide-react';

const StoreShowcase: React.FC = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Données de la boutique (simulées)
  const [storeData, setStoreData] = useState({
    name: 'Ma Boutique Premium',
    tagline: 'Le meilleur de la mode à Abidjan',
    description:
      'Découvrez notre collection exclusive de vêtements et accessoires de luxe. Nous proposons les plus grandes marques internationales avec un service personnalisé.',
    category: 'Mode & Accessoires',
    floor: 'Étage 2',
    location: 'Local A-23',
    phone: '+225 27 22 XX XX XX',
    email: 'contact@maboutique.com',
    website: 'www.maboutique.com',
    hours: {
      weekdays: '9h00 - 21h00',
      weekend: '10h00 - 20h00',
    },
    socials: {
      facebook: 'facebook.com/maboutique',
      instagram: '@maboutique',
      twitter: '@maboutique',
    },
  });

  const [gallery] = useState([
    { id: 1, url: 'https://via.placeholder.com/400x300', title: 'Vitrine principale' },
    { id: 2, url: 'https://via.placeholder.com/400x300', title: 'Intérieur boutique' },
    { id: 3, url: 'https://via.placeholder.com/400x300', title: 'Collection printemps' },
    { id: 4, url: 'https://via.placeholder.com/400x300', title: 'Espace VIP' },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-cosmos-night mb-2 tracking-tight">
            {t('store.showcase.title', 'Ma Vitrine')}
          </h1>
          <p className="text-text-secondary font-light">
            {t(
              'store.showcase.subtitle',
              "Gérez l'apparence et les informations de votre boutique"
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
          >
            <Eye className="w-4 h-4" strokeWidth={1.5} />
            {t('store.showcase.preview', 'Prévisualiser')}
          </button>
          {isEditing ? (
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white font-light hover:bg-gray-800 transition-colors"
            >
              <Save className="w-4 h-4" strokeWidth={1.5} />
              {t('common.save', 'Enregistrer')}
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white font-light hover:bg-gray-800 transition-colors"
            >
              <Edit className="w-4 h-4" strokeWidth={1.5} />
              {t('common.edit', 'Modifier')}
            </button>
          )}
        </div>
      </div>

      {/* Informations principales */}
      <div className="bg-white border border-cosmos-cream p-6">
        <div className="flex items-center gap-2 mb-6">
          <Store className="w-5 h-5 text-cosmos-night" strokeWidth={1.5} />
          <h2 className="text-xl font-light text-cosmos-night tracking-tight">
            {t('store.showcase.mainInfo', 'Informations Principales')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary font-light mb-2">
              {t('store.showcase.storeName', 'Nom de la boutique')}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={storeData.name}
                onChange={(e) => setStoreData({ ...storeData, name: e.target.value })}
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            ) : (
              <div className="text-lg font-light text-cosmos-night">{storeData.name}</div>
            )}
          </div>

          <div>
            <label className="block text-sm text-text-secondary font-light mb-2">
              {t('store.showcase.tagline', 'Slogan')}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={storeData.tagline}
                onChange={(e) => setStoreData({ ...storeData, tagline: e.target.value })}
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            ) : (
              <div className="text-lg font-light text-text-secondary">{storeData.tagline}</div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-text-secondary font-light mb-2">
              {t('store.showcase.description', 'Description')}
            </label>
            {isEditing ? (
              <textarea
                value={storeData.description}
                onChange={(e) => setStoreData({ ...storeData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            ) : (
              <div className="text-cosmos-night font-light leading-relaxed">
                {storeData.description}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm text-text-secondary font-light mb-2">
              {t('store.showcase.category', 'Catégorie')}
            </label>
            {isEditing ? (
              <select
                value={storeData.category}
                onChange={(e) => setStoreData({ ...storeData, category: e.target.value })}
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              >
                <option>{t('store.showcase.categoryFashion', 'Mode & Accessoires')}</option>
                <option>{t('store.showcase.categoryElectronics', 'Électronique')}</option>
                <option>{t('store.showcase.categoryBeauty', 'Beauté & Cosmétiques')}</option>
                <option>{t('store.showcase.categoryHome', 'Maison & Décoration')}</option>
                <option>{t('store.showcase.categorySports', 'Sports & Loisirs')}</option>
                <option>{t('store.showcase.categoryFood', 'Alimentation')}</option>
              </select>
            ) : (
              <div className="text-cosmos-night font-light">{storeData.category}</div>
            )}
          </div>

          <div>
            <label className="block text-sm text-text-secondary font-light mb-2">
              {t('store.showcase.location', 'Emplacement')}
            </label>
            <div className="text-cosmos-night font-light">
              {storeData.floor} - {storeData.location}
            </div>
          </div>
        </div>
      </div>

      {/* Coordonnées */}
      <div className="bg-white border border-cosmos-cream p-6">
        <div className="flex items-center gap-2 mb-6">
          <Phone className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
          <h2 className="text-xl font-light text-cosmos-night tracking-tight">
            {t('store.showcase.contactInfo', 'Coordonnées')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary font-light mb-2">
              {t('store.showcase.phone', 'Téléphone')}
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={storeData.phone}
                onChange={(e) => setStoreData({ ...storeData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            ) : (
              <div className="text-cosmos-night font-light">{storeData.phone}</div>
            )}
          </div>

          <div>
            <label className="block text-sm text-text-secondary font-light mb-2">
              {t('store.showcase.email', 'Email')}
            </label>
            {isEditing ? (
              <input
                type="email"
                value={storeData.email}
                onChange={(e) => setStoreData({ ...storeData, email: e.target.value })}
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            ) : (
              <div className="text-cosmos-night font-light">{storeData.email}</div>
            )}
          </div>

          <div>
            <label className="block text-sm text-text-secondary font-light mb-2">
              {t('store.showcase.website', 'Site web')}
            </label>
            {isEditing ? (
              <input
                type="url"
                value={storeData.website}
                onChange={(e) => setStoreData({ ...storeData, website: e.target.value })}
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            ) : (
              <div className="text-cosmos-night font-light">{storeData.website}</div>
            )}
          </div>
        </div>
      </div>

      {/* Horaires */}
      <div className="bg-white border border-cosmos-cream p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5 text-cosmos-gold" strokeWidth={1.5} />
          <h2 className="text-xl font-light text-cosmos-night tracking-tight">
            {t('store.showcase.openingHours', "Horaires d'Ouverture")}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary font-light mb-2">
              {t('store.showcase.mondayToSaturday', 'Lundi - Samedi')}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={storeData.hours.weekdays}
                onChange={(e) =>
                  setStoreData({
                    ...storeData,
                    hours: { ...storeData.hours, weekdays: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            ) : (
              <div className="text-cosmos-night font-light">{storeData.hours.weekdays}</div>
            )}
          </div>

          <div>
            <label className="block text-sm text-text-secondary font-light mb-2">
              {t('store.showcase.sunday', 'Dimanche')}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={storeData.hours.weekend}
                onChange={(e) =>
                  setStoreData({
                    ...storeData,
                    hours: { ...storeData.hours, weekend: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            ) : (
              <div className="text-cosmos-night font-light">{storeData.hours.weekend}</div>
            )}
          </div>
        </div>
      </div>

      {/* Réseaux sociaux */}
      <div className="bg-white border border-cosmos-cream p-6">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
          <h2 className="text-xl font-light text-cosmos-night tracking-tight">
            {t('store.showcase.socialNetworks', 'Réseaux Sociaux')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm text-text-secondary font-light mb-2">
              <Facebook className="w-4 h-4" strokeWidth={1.5} />
              Facebook
            </label>
            {isEditing ? (
              <input
                type="text"
                value={storeData.socials.facebook}
                onChange={(e) =>
                  setStoreData({
                    ...storeData,
                    socials: { ...storeData.socials, facebook: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            ) : (
              <div className="text-cosmos-night font-light">{storeData.socials.facebook}</div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-text-secondary font-light mb-2">
              <Instagram className="w-4 h-4" strokeWidth={1.5} />
              Instagram
            </label>
            {isEditing ? (
              <input
                type="text"
                value={storeData.socials.instagram}
                onChange={(e) =>
                  setStoreData({
                    ...storeData,
                    socials: { ...storeData.socials, instagram: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            ) : (
              <div className="text-cosmos-night font-light">{storeData.socials.instagram}</div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-text-secondary font-light mb-2">
              <Twitter className="w-4 h-4" strokeWidth={1.5} />
              Twitter
            </label>
            {isEditing ? (
              <input
                type="text"
                value={storeData.socials.twitter}
                onChange={(e) =>
                  setStoreData({
                    ...storeData,
                    socials: { ...storeData.socials, twitter: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            ) : (
              <div className="text-cosmos-night font-light">{storeData.socials.twitter}</div>
            )}
          </div>
        </div>
      </div>

      {/* Galerie Photos */}
      <div className="bg-white border border-cosmos-cream p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-pink-600" strokeWidth={1.5} />
            <h2 className="text-xl font-light text-cosmos-night tracking-tight">
              {t('store.showcase.photoGallery', 'Galerie Photos')}
            </h2>
          </div>
          {isEditing && (
            <button className="flex items-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors">
              <Plus className="w-4 h-4" strokeWidth={1.5} />
              {t('store.showcase.addPhotos', 'Ajouter des photos')}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gallery.map((photo) => (
            <div
              key={photo.id}
              className="relative group border border-cosmos-cream hover:border-cosmos-cream transition-colors"
            >
              <img src={photo.url} alt={photo.title} className="w-full h-48 object-cover" />
              <div className="p-3">
                <div className="text-sm text-cosmos-night font-light">{photo.title}</div>
              </div>
              {isEditing && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <button className="p-2 bg-white border border-cosmos-cream hover:border-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowPreview(false)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-cosmos-cream flex items-center justify-between sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                  {t('store.showcase.showcasePreview', 'Aperçu de Votre Vitrine')}
                </h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-text-secondary hover:text-cosmos-night"
                >
                  <XCircle className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>

              <div className="p-8">
                {/* Store Header */}
                <div className="text-center mb-8 pb-8 border-b border-cosmos-cream">
                  <h1 className="text-4xl font-light text-cosmos-night mb-3 tracking-tight">
                    {storeData.name}
                  </h1>
                  <p className="text-xl text-text-secondary font-light mb-4">{storeData.tagline}</p>
                  <div className="flex items-center justify-center gap-6 text-sm text-text-secondary font-light">
                    <span className="flex items-center gap-2">
                      <Store className="w-4 h-4" strokeWidth={1.5} />
                      {storeData.category}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" strokeWidth={1.5} />
                      {storeData.floor} - {storeData.location}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-xl font-light text-cosmos-night mb-3 tracking-tight">
                    {t('store.showcase.about', 'À Propos')}
                  </h3>
                  <p className="text-text-secondary font-light leading-relaxed">
                    {storeData.description}
                  </p>
                </div>

                {/* Gallery */}
                <div className="mb-8">
                  <h3 className="text-xl font-light text-cosmos-night mb-4 tracking-tight">
                    {t('store.showcase.photoGallery', 'Galerie Photos')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {gallery.map((photo) => (
                      <div
                        key={photo.id}
                        className="aspect-[4/3] border border-cosmos-cream overflow-hidden"
                      >
                        <img
                          src={photo.url}
                          alt={photo.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact & Hours Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Contact Info */}
                  <div>
                    <h3 className="text-xl font-light text-cosmos-night mb-4 tracking-tight">
                      {t('store.showcase.contactUs', 'Nous Contacter')}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-text-secondary font-light">
                        <div className="w-10 h-10 bg-cosmos-cream flex items-center justify-center">
                          <Phone className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <span>{storeData.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-text-secondary font-light">
                        <div className="w-10 h-10 bg-cosmos-cream flex items-center justify-center">
                          <Mail className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <span>{storeData.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-text-secondary font-light">
                        <div className="w-10 h-10 bg-cosmos-cream flex items-center justify-center">
                          <Globe className="w-5 h-5" strokeWidth={1.5} />
                        </div>
                        <span>{storeData.website}</span>
                      </div>
                    </div>

                    {/* Social Media */}
                    <div className="mt-6">
                      <h4 className="text-sm text-cosmos-night font-light mb-3">
                        {t('store.showcase.followUs', 'Suivez-nous')}
                      </h4>
                      <div className="flex items-center gap-3">
                        {storeData.socials.facebook && (
                          <a
                            href={`https://${storeData.socials.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-cosmos-cream hover:bg-gray-900 hover:text-white flex items-center justify-center transition-colors"
                          >
                            <Facebook className="w-5 h-5" strokeWidth={1.5} />
                          </a>
                        )}
                        {storeData.socials.instagram && (
                          <a
                            href={`https://instagram.com/${storeData.socials.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-cosmos-cream hover:bg-gray-900 hover:text-white flex items-center justify-center transition-colors"
                          >
                            <Instagram className="w-5 h-5" strokeWidth={1.5} />
                          </a>
                        )}
                        {storeData.socials.twitter && (
                          <a
                            href={`https://twitter.com/${storeData.socials.twitter.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-cosmos-cream hover:bg-gray-900 hover:text-white flex items-center justify-center transition-colors"
                          >
                            <Twitter className="w-5 h-5" strokeWidth={1.5} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div>
                    <h3 className="text-xl font-light text-cosmos-night mb-4 tracking-tight">
                      {t('store.showcase.openingHours', "Horaires d'Ouverture")}
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-cosmos-cream flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-cosmos-night font-light mb-1">
                            {t('store.showcase.mondayToFriday', 'Lundi - Vendredi')}
                          </div>
                          <div className="text-lg text-text-secondary font-light">
                            {storeData.hours.weekdays}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-cosmos-cream flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-cosmos-night font-light mb-1">
                            {t('store.showcase.saturdaySunday', 'Samedi - Dimanche')}
                          </div>
                          <div className="text-lg text-text-secondary font-light">
                            {storeData.hours.weekend}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StoreShowcase;
