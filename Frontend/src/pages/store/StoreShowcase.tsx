import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Store,
  Edit,
  Image as ImageIcon,
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
  Loader2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface GalleryItem {
  url: string;
  title: string;
}

interface StoreSocials {
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

interface StoreRecord {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  category: string | null;
  zone: string | null;
  location_code: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  hours: string | null;
  logo: string | null;
  cover_image: string | null;
  social_media: StoreSocials | null;
  gallery: GalleryItem[] | null;
  owner_id: string | null;
}

const STORE_COLUMNS =
  'id,name,tagline,description,category,zone,location_code,phone,email,website,hours,logo,cover_image,social_media,gallery,owner_id';

const SELECTED_STORE_KEY = 'cosmos-vitrine-store';

// Accès Supabase non typé (schéma cosmos hors typage public)
type AnyTable = {
  select: (c: string) => {
    order: (
      col: string,
      o: { ascending: boolean }
    ) => Promise<{ data: StoreRecord[] | null; error: unknown }>;
  };
  update: (v: Partial<StoreRecord>) => {
    eq: (col: string, val: string) => Promise<{ error: unknown }>;
  };
};
const db = supabase as unknown as { from: (t: string) => AnyTable };

const CATEGORIES = [
  'Mode & Accessoires',
  'Horlogerie & Joaillerie',
  'Beauté & Parfumerie',
  'Maison & Décoration',
  'Électronique',
  'Gastronomie',
  'Sports & Loisirs',
  'Services',
];

const StoreShowcase: React.FC = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [stores, setStores] = useState<StoreRecord[]>([]);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [form, setForm] = useState<StoreRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  // -- chargement des boutiques -------------------------------------------
  const loadStores = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await db
        .from('stores')
        .select(STORE_COLUMNS)
        .order('name', { ascending: true });
      if (!error && data) {
        setStores(data);
        // Choix de "ma boutique" : owner_id → localStorage → première.
        const byOwner = profile?.id
          ? data.find((s) => s.owner_id === profile.id)
          : undefined;
        const saved = localStorage.getItem(SELECTED_STORE_KEY);
        const bySaved = saved ? data.find((s) => s.id === saved) : undefined;
        const chosen = byOwner || bySaved || data[0] || null;
        setStoreId(chosen ? chosen.id : null);
        setForm(chosen ? { ...chosen } : null);
      }
    } catch {
      // silencieux
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    void loadStores();
  }, [loadStores]);

  const selectStore = (id: string) => {
    const s = stores.find((x) => x.id === id) || null;
    setStoreId(id);
    setForm(s ? { ...s } : null);
    setIsEditing(false);
    if (id) localStorage.setItem(SELECTED_STORE_KEY, id);
  };

  const showToast = (ok: boolean, msg: string) => {
    setToast({ ok, msg });
    window.setTimeout(() => setToast(null), 3500);
  };

  const set = <K extends keyof StoreRecord>(key: K, value: StoreRecord[K]) =>
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

  const setSocial = (k: keyof StoreSocials, v: string) =>
    setForm((prev) =>
      prev ? { ...prev, social_media: { ...(prev.social_media || {}), [k]: v } } : prev
    );

  const addGalleryItem = () =>
    setForm((prev) =>
      prev
        ? { ...prev, gallery: [...(prev.gallery || []), { url: '', title: '' }] }
        : prev
    );

  const updateGalleryItem = (i: number, patch: Partial<GalleryItem>) =>
    setForm((prev) => {
      if (!prev) return prev;
      const g = [...(prev.gallery || [])];
      g[i] = { ...g[i], ...patch };
      return { ...prev, gallery: g };
    });

  const removeGalleryItem = (i: number) =>
    setForm((prev) =>
      prev ? { ...prev, gallery: (prev.gallery || []).filter((_, idx) => idx !== i) } : prev
    );

  const handleSave = async () => {
    if (!form || !storeId) return;
    setSaving(true);
    try {
      const payload: Partial<StoreRecord> = {
        name: form.name,
        tagline: form.tagline,
        description: form.description,
        category: form.category,
        zone: form.zone,
        location_code: form.location_code,
        phone: form.phone,
        email: form.email,
        website: form.website,
        hours: form.hours,
        logo: form.logo,
        cover_image: form.cover_image,
        social_media: form.social_media || {},
        gallery: (form.gallery || []).filter((g) => g.url.trim().length > 0),
      };
      const { error } = await db.from('stores').update(payload).eq('id', storeId);
      if (error) {
        showToast(false, t('store.showcase.saveError', "Échec de l'enregistrement. Réessayez."));
      } else {
        setStores((prev) => prev.map((s) => (s.id === storeId ? { ...s, ...payload } as StoreRecord : s)));
        setIsEditing(false);
        showToast(true, t('store.showcase.saved', 'Vitrine enregistrée avec succès'));
      }
    } catch {
      showToast(false, t('store.showcase.saveError', "Échec de l'enregistrement. Réessayez."));
    } finally {
      setSaving(false);
    }
  };

  // -- rendu ---------------------------------------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32 text-text-secondary">
        <Loader2 className="w-6 h-6 animate-spin mr-3" strokeWidth={1.5} />
        <span className="font-light">{t('common.loading', 'Chargement…')}</span>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="bg-white border border-cosmos-cream p-10 text-center">
        <Store className="w-10 h-10 text-cosmos-gold mx-auto mb-4" strokeWidth={1.2} />
        <h2 className="text-xl font-light text-cosmos-night mb-2">
          {t('store.showcase.noStore', 'Aucune boutique disponible')}
        </h2>
        <p className="text-text-secondary font-light">
          {t(
            'store.showcase.noStoreHint',
            "Les boutiques sont créées depuis la console Admin (Boutiques). Revenez ensuite ici pour gérer votre vitrine."
          )}
        </p>
      </div>
    );
  }

  const inputCls =
    'w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light';
  const labelCls = 'block text-sm text-text-secondary font-light mb-2';

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[60] px-5 py-3 rounded shadow-lg flex items-center gap-2 text-sm font-inter ${
            toast.ok ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.ok ? (
            <Check className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <AlertCircle className="w-4 h-4" strokeWidth={1.5} />
          )}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
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
          {/* Sélecteur de boutique (utile pour admins gérant plusieurs enseignes) */}
          {stores.length > 1 && (
            <select
              value={storeId || ''}
              onChange={(e) => selectStore(e.target.value)}
              className="px-3 py-2 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-sm"
              title={t('store.showcase.selectStore', 'Choisir la boutique')}
            >
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
          >
            <Eye className="w-4 h-4" strokeWidth={1.5} />
            {t('store.showcase.preview', 'Prévisualiser')}
          </button>
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  const orig = stores.find((s) => s.id === storeId);
                  if (orig) setForm({ ...orig });
                  setIsEditing(false);
                }}
                className="px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
              >
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white font-light hover:bg-gray-800 transition-colors disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                ) : (
                  <Save className="w-4 h-4" strokeWidth={1.5} />
                )}
                {t('common.save', 'Enregistrer')}
              </button>
            </>
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
            <label className={labelCls}>{t('store.showcase.storeName', 'Nom de la boutique')}</label>
            {isEditing ? (
              <input
                type="text"
                value={form.name || ''}
                onChange={(e) => set('name', e.target.value)}
                className={inputCls}
              />
            ) : (
              <div className="text-lg font-light text-cosmos-night">{form.name}</div>
            )}
          </div>

          <div>
            <label className={labelCls}>{t('store.showcase.tagline', 'Slogan')}</label>
            {isEditing ? (
              <input
                type="text"
                value={form.tagline || ''}
                onChange={(e) => set('tagline', e.target.value)}
                className={inputCls}
              />
            ) : (
              <div className="text-lg font-light text-text-secondary">{form.tagline || '—'}</div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className={labelCls}>{t('store.showcase.description', 'Description')}</label>
            {isEditing ? (
              <textarea
                value={form.description || ''}
                onChange={(e) => set('description', e.target.value)}
                rows={4}
                className={inputCls}
              />
            ) : (
              <div className="text-cosmos-night font-light leading-relaxed">
                {form.description || '—'}
              </div>
            )}
          </div>

          <div>
            <label className={labelCls}>{t('store.showcase.category', 'Catégorie')}</label>
            {isEditing ? (
              <select
                value={form.category || ''}
                onChange={(e) => set('category', e.target.value)}
                className={inputCls}
              >
                <option value="">—</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            ) : (
              <div className="text-cosmos-night font-light">{form.category || '—'}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t('store.showcase.floor', 'Niveau / Zone')}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={form.zone || ''}
                  onChange={(e) => set('zone', e.target.value)}
                  className={inputCls}
                />
              ) : (
                <div className="text-cosmos-night font-light">{form.zone || '—'}</div>
              )}
            </div>
            <div>
              <label className={labelCls}>{t('store.showcase.local', 'Local')}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={form.location_code || ''}
                  onChange={(e) => set('location_code', e.target.value)}
                  className={inputCls}
                />
              ) : (
                <div className="text-cosmos-night font-light">{form.location_code || '—'}</div>
              )}
            </div>
          </div>
        </div>

        {/* Logo + Couverture */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className={labelCls}>{t('store.showcase.logo', 'Logo (URL)')}</label>
            {isEditing ? (
              <input
                type="text"
                value={form.logo || ''}
                onChange={(e) => set('logo', e.target.value)}
                placeholder="https://…"
                className={inputCls}
              />
            ) : form.logo ? (
              <img src={form.logo} alt="logo" className="h-16 object-contain" />
            ) : (
              <div className="text-text-secondary font-light">—</div>
            )}
          </div>
          <div>
            <label className={labelCls}>{t('store.showcase.cover', 'Image de couverture (URL)')}</label>
            {isEditing ? (
              <input
                type="text"
                value={form.cover_image || ''}
                onChange={(e) => set('cover_image', e.target.value)}
                placeholder="https://…"
                className={inputCls}
              />
            ) : form.cover_image ? (
              <img src={form.cover_image} alt="cover" className="h-16 w-full object-cover" />
            ) : (
              <div className="text-text-secondary font-light">—</div>
            )}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelCls}>{t('store.showcase.phone', 'Téléphone')}</label>
            {isEditing ? (
              <input
                type="tel"
                value={form.phone || ''}
                onChange={(e) => set('phone', e.target.value)}
                className={inputCls}
              />
            ) : (
              <div className="text-cosmos-night font-light">{form.phone || '—'}</div>
            )}
          </div>
          <div>
            <label className={labelCls}>{t('store.showcase.email', 'Email')}</label>
            {isEditing ? (
              <input
                type="email"
                value={form.email || ''}
                onChange={(e) => set('email', e.target.value)}
                className={inputCls}
              />
            ) : (
              <div className="text-cosmos-night font-light">{form.email || '—'}</div>
            )}
          </div>
          <div>
            <label className={labelCls}>{t('store.showcase.website', 'Site web')}</label>
            {isEditing ? (
              <input
                type="url"
                value={form.website || ''}
                onChange={(e) => set('website', e.target.value)}
                className={inputCls}
              />
            ) : (
              <div className="text-cosmos-night font-light">{form.website || '—'}</div>
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
        {isEditing ? (
          <input
            type="text"
            value={form.hours || ''}
            onChange={(e) => set('hours', e.target.value)}
            placeholder="Tous les jours : 9h30 - minuit"
            className={inputCls}
          />
        ) : (
          <div className="text-cosmos-night font-light">{form.hours || '—'}</div>
        )}
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
          {(['facebook', 'instagram', 'twitter'] as const).map((net) => {
            const Icon = net === 'facebook' ? Facebook : net === 'instagram' ? Instagram : Twitter;
            return (
              <div key={net}>
                <label className="flex items-center gap-2 text-sm text-text-secondary font-light mb-2 capitalize">
                  <Icon className="w-4 h-4" strokeWidth={1.5} />
                  {net}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={form.social_media?.[net] || ''}
                    onChange={(e) => setSocial(net, e.target.value)}
                    className={inputCls}
                  />
                ) : (
                  <div className="text-cosmos-night font-light">
                    {form.social_media?.[net] || '—'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Galerie Photos */}
      <div className="bg-white border border-cosmos-cream p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-pink-600" strokeWidth={1.5} />
            <h2 className="text-xl font-light text-cosmos-night tracking-tight">
              {t('store.showcase.photoGallery', 'Galerie Photos')}
            </h2>
          </div>
          {isEditing && (
            <button
              onClick={addGalleryItem}
              className="flex items-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
            >
              <Plus className="w-4 h-4" strokeWidth={1.5} />
              {t('store.showcase.addPhotos', 'Ajouter une photo')}
            </button>
          )}
        </div>

        {(form.gallery || []).length === 0 && !isEditing ? (
          <p className="text-text-secondary font-light text-sm">
            {t('store.showcase.noPhotos', 'Aucune photo pour le moment.')}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(form.gallery || []).map((photo, i) => (
              <div key={i} className="relative group border border-cosmos-cream">
                {photo.url ? (
                  <img src={photo.url} alt={photo.title} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-cosmos-cream/40 flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-text-secondary" strokeWidth={1.5} />
                  </div>
                )}
                <div className="p-3 space-y-2">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={photo.url}
                        onChange={(e) => updateGalleryItem(i, { url: e.target.value })}
                        placeholder="URL de l'image"
                        className="w-full px-2 py-1.5 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-xs"
                      />
                      <input
                        type="text"
                        value={photo.title}
                        onChange={(e) => updateGalleryItem(i, { title: e.target.value })}
                        placeholder="Légende"
                        className="w-full px-2 py-1.5 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-xs"
                      />
                    </>
                  ) : (
                    <div className="text-sm text-cosmos-night font-light">{photo.title || '—'}</div>
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={() => removeGalleryItem(i)}
                    className="absolute top-2 right-2 p-2 bg-white border border-cosmos-cream hover:border-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowPreview(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-5xl w-full max-h-[90vh] overflow-y-auto">
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
                <div className="text-center mb-8 pb-8 border-b border-cosmos-cream">
                  {form.logo && (
                    <img src={form.logo} alt={form.name} className="h-16 mx-auto mb-4 object-contain" />
                  )}
                  <h1 className="text-4xl font-light text-cosmos-night mb-3 tracking-tight">
                    {form.name}
                  </h1>
                  {form.tagline && (
                    <p className="text-xl text-text-secondary font-light mb-4">{form.tagline}</p>
                  )}
                  <div className="flex items-center justify-center gap-6 text-sm text-text-secondary font-light flex-wrap">
                    {form.category && (
                      <span className="flex items-center gap-2">
                        <Store className="w-4 h-4" strokeWidth={1.5} />
                        {form.category}
                      </span>
                    )}
                    {(form.zone || form.location_code) && (
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" strokeWidth={1.5} />
                        {[form.zone, form.location_code].filter(Boolean).join(' · ')}
                      </span>
                    )}
                    {form.hours && (
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" strokeWidth={1.5} />
                        {form.hours}
                      </span>
                    )}
                  </div>
                </div>

                {form.description && (
                  <div className="mb-8">
                    <h3 className="text-xl font-light text-cosmos-night mb-3 tracking-tight">
                      {t('store.showcase.about', 'À Propos')}
                    </h3>
                    <p className="text-text-secondary font-light leading-relaxed">
                      {form.description}
                    </p>
                  </div>
                )}

                {(form.gallery || []).filter((g) => g.url).length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-xl font-light text-cosmos-night mb-4 tracking-tight">
                      {t('store.showcase.photoGallery', 'Galerie Photos')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {(form.gallery || [])
                        .filter((g) => g.url)
                        .map((photo, i) => (
                          <div key={i} className="aspect-[4/3] border border-cosmos-cream overflow-hidden">
                            <img
                              src={photo.url}
                              alt={photo.title}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-light text-cosmos-night mb-4 tracking-tight">
                      {t('store.showcase.contactUs', 'Nous Contacter')}
                    </h3>
                    <div className="space-y-3">
                      {form.phone && (
                        <div className="flex items-center gap-3 text-text-secondary font-light">
                          <div className="w-10 h-10 bg-cosmos-cream flex items-center justify-center">
                            <Phone className="w-5 h-5" strokeWidth={1.5} />
                          </div>
                          <span>{form.phone}</span>
                        </div>
                      )}
                      {form.email && (
                        <div className="flex items-center gap-3 text-text-secondary font-light">
                          <div className="w-10 h-10 bg-cosmos-cream flex items-center justify-center">
                            <Mail className="w-5 h-5" strokeWidth={1.5} />
                          </div>
                          <span>{form.email}</span>
                        </div>
                      )}
                      {form.website && (
                        <div className="flex items-center gap-3 text-text-secondary font-light">
                          <div className="w-10 h-10 bg-cosmos-cream flex items-center justify-center">
                            <Globe className="w-5 h-5" strokeWidth={1.5} />
                          </div>
                          <span>{form.website}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {form.hours && (
                    <div>
                      <h3 className="text-xl font-light text-cosmos-night mb-4 tracking-tight">
                        {t('store.showcase.openingHours', "Horaires d'Ouverture")}
                      </h3>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-cosmos-cream flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
                        </div>
                        <div className="text-lg text-text-secondary font-light">{form.hours}</div>
                      </div>
                    </div>
                  )}
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
