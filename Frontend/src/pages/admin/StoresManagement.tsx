import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Store,
  Search,
  Plus,
  Edit,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Users,
  Package,
  AlertCircle,
  Trash2,
  X,
  Save,
  Upload,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { useStores } from '../../hooks/useStores';
import { supabase } from '../../lib/supabase';

interface StoreType {
  id: string;
  name: string;
  slug: string;
  category: string;
  owner: string;
  email: string;
  phone: string;
  location: string;
  floor: string;
  plan: 'Free' | 'Gold' | 'Platinum';
  status: 'active' | 'pending' | 'suspended' | 'rejected';
  joinedDate: string;
  revenue: number;
  views: number;
  rating: number;
  logo?: string;
  description?: string;
  openingHours?: string;
  website?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
  };
  employees?: number;
  products?: number;
  lastSale?: string;
}

interface GalleryItem {
  url: string;
  title?: string;
}

interface StoreFormData {
  name: string;
  slug: string;
  logo: string;
  cover_image: string;
  gallery: GalleryItem[];
  description: string;
  category: string;
  zone: string;
  location_code: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  plan: 'Free' | 'Gold' | 'Platinum';
  status: 'active' | 'pending' | 'suspended' | 'rejected';
}

const emptyStoreForm: StoreFormData = {
  name: '',
  slug: '',
  logo: '',
  cover_image: '',
  gallery: [],
  description: '',
  category: '',
  zone: '',
  location_code: '',
  phone: '',
  email: '',
  website: '',
  hours: '',
  plan: 'Free',
  status: 'pending',
};

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

const StoresManagement: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [viewStore, setViewStore] = useState<StoreType | null>(null);
  const [editStore, setEditStore] = useState<StoreType | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteStoreModal, setDeleteStoreModal] = useState<StoreType | null>(null);
  const [formData, setFormData] = useState<StoreFormData>(emptyStoreForm);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // Upload générique vers le bucket Storage "site", renvoie l'URL publique.
  const uploadToStorage = async (file: File, folder: string): Promise<string | null> => {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const base = (formData.slug || formData.name || 'store').replace(/[^a-z0-9._-]/gi, '_');
    const path = `${folder}/${base}-${Date.now()}-${Math.round(performance.now())}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from('site')
      .upload(path, file, { upsert: true, cacheControl: '3600' });
    if (upErr) return null;
    return supabase.storage.from('site').getPublicUrl(path).data.publicUrl;
  };

  const uploadLogo = async (file: File) => {
    setUploadingLogo(true);
    try {
      const url = await uploadToStorage(file, 'logos');
      if (!url) {
        setFeedbackMessage({ type: 'error', text: 'Téléversement du logo échoué.' });
        return;
      }
      setFormData((prev) => ({ ...prev, logo: url }));
      setFeedbackMessage({ type: 'success', text: 'Logo téléversé — pensez à Enregistrer.' });
    } finally {
      setUploadingLogo(false);
    }
  };

  const uploadCover = async (file: File) => {
    setUploadingCover(true);
    try {
      const url = await uploadToStorage(file, 'covers');
      if (!url) {
        setFeedbackMessage({ type: 'error', text: 'Téléversement de la couverture échoué.' });
        return;
      }
      setFormData((prev) => ({ ...prev, cover_image: url }));
      setFeedbackMessage({ type: 'success', text: 'Couverture téléversée — pensez à Enregistrer.' });
    } finally {
      setUploadingCover(false);
    }
  };

  const uploadGalleryFiles = async (files: FileList) => {
    setUploadingGallery(true);
    try {
      const added: GalleryItem[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadToStorage(file, 'gallery');
        if (url) added.push({ url, title: '' });
      }
      if (added.length === 0) {
        setFeedbackMessage({ type: 'error', text: 'Téléversement des photos échoué.' });
        return;
      }
      setFormData((prev) => ({ ...prev, gallery: [...prev.gallery, ...added] }));
      setFeedbackMessage({
        type: 'success',
        text: `${added.length} photo(s) ajoutée(s) — pensez à Enregistrer.`,
      });
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryItem = (i: number) =>
    setFormData((prev) => ({ ...prev, gallery: prev.gallery.filter((_, idx) => idx !== i) }));
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Fetch stores from Supabase
  const {
    stores: supabaseStores,
    isLoading,
    error,
    createStore,
    updateStore,
    deleteStore,
  } = useStores();

  // Auto-clear feedback after 4 seconds
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  // Map Supabase stores to local StoreType format
  const stores = useMemo<StoreType[]>(() => {
    return supabaseStores.map((store) => ({
      id: store.id,
      name: store.name,
      slug: store.slug,
      category: store.category || 'Non catégorisé',
      owner: store.name, // Placeholder - will be populated from owner relationship later
      email: store.email || '',
      phone: store.phone || '',
      location: store.location_code || '',
      floor: store.zone || '',
      plan: store.plan,
      status: store.status,
      joinedDate: store.created_at,
      revenue: 0, // Placeholder - to be populated from analytics later
      views: store.view_count,
      rating: store.rating,
      logo: store.logo || undefined,
      description: store.description || undefined,
      openingHours: store.hours || undefined,
      website: store.website || undefined,
      socialMedia: store.social_media
        ? {
            facebook: store.social_media.facebook,
            instagram: store.social_media.instagram,
          }
        : undefined,
      employees: undefined, // Placeholder - to be populated later
      products: undefined, // Placeholder - to be populated later
      lastSale: undefined, // Placeholder - to be populated later
    }));
  }, [supabaseStores]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-emerald-600 bg-emerald-50 border-green-200';
      case 'pending':
        return 'text-amber-600 bg-amber-50 border-orange-200';
      case 'suspended':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'rejected':
        return 'text-text-secondary bg-cosmos-cream/50 border-cosmos-cream';
      default:
        return 'text-text-secondary bg-cosmos-cream/50 border-cosmos-cream';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return t('admin.stores.status.active', 'Actif');
      case 'pending':
        return t('admin.stores.status.pending', 'En attente');
      case 'suspended':
        return t('admin.stores.status.suspended', 'Suspendu');
      case 'rejected':
        return t('admin.stores.status.rejected', 'Rejeté');
      default:
        return status;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Platinum':
        return 'from-purple-600 to-pink-600';
      case 'Gold':
        return 'from-yellow-500 to-orange-500';
      case 'Free':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || store.status === statusFilter;
    const matchesPlan = planFilter === 'all' || store.plan === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const stats = [
    {
      label: t('admin.stores.stats.total', 'Total Boutiques'),
      value: stores.length,
      icon: Store,
      color: 'text-cosmos-night',
      bg: 'bg-cosmos-gold/10',
    },
    {
      label: t('admin.stores.stats.active', 'Actives'),
      value: stores.filter((s) => s.status === 'active').length,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: t('admin.stores.stats.pending', 'En Attente'),
      value: stores.filter((s) => s.status === 'pending').length,
      icon: AlertCircle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: t('admin.stores.stats.suspended', 'Suspendues'),
      value: stores.filter((s) => s.status === 'suspended').length,
      icon: Ban,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  // --- Form helpers ---
  const openCreateForm = () => {
    setFormData(emptyStoreForm);
    setIsCreating(true);
    setEditStore(null);
  };

  const openEditForm = (store: StoreType) => {
    // Récupère les champs bruts (cover_image, gallery) depuis la source Supabase.
    const raw = supabaseStores.find((s) => s.id === store.id) as
      | { cover_image?: string | null; gallery?: GalleryItem[] | null }
      | undefined;
    setFormData({
      name: store.name,
      slug: store.slug,
      logo: store.logo || '',
      cover_image: raw?.cover_image || '',
      gallery: Array.isArray(raw?.gallery) ? raw!.gallery : [],
      description: store.description || '',
      category: store.category === 'Non catégorisé' ? '' : store.category,
      zone: store.floor,
      location_code: store.location,
      phone: store.phone,
      email: store.email,
      website: store.website || '',
      hours: store.openingHours || '',
      plan: store.plan,
      status: store.status,
    });
    setEditStore(store);
    setIsCreating(false);
  };

  const closeForm = () => {
    setIsCreating(false);
    setEditStore(null);
    setFormData(emptyStoreForm);
  };

  const handleFormChange = (field: keyof StoreFormData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'name') {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.slug.trim()) {
      setFeedbackMessage({
        type: 'error',
        text: t('admin.stores.form.nameRequired', 'Le nom est obligatoire.'),
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        logo: formData.logo || null,
        cover_image: formData.cover_image || null,
        gallery: formData.gallery.filter((g) => g.url.trim().length > 0),
        description: formData.description || null,
        category: formData.category || null,
        zone: formData.zone || null,
        location_code: formData.location_code || null,
        phone: formData.phone || null,
        email: formData.email || null,
        website: formData.website || null,
        hours: formData.hours || null,
        plan: formData.plan,
        status: formData.status,
      };

      if (editStore) {
        await updateStore(editStore.id, payload as unknown as Parameters<typeof updateStore>[1]);
        setFeedbackMessage({
          type: 'success',
          text: t('admin.stores.form.updateSuccess', 'Boutique mise à jour avec succès.'),
        });
      } else {
        await createStore(payload as unknown as Parameters<typeof createStore>[0]);
        setFeedbackMessage({
          type: 'success',
          text: t('admin.stores.form.createSuccess', 'Boutique créée avec succès.'),
        });
      }
      closeForm();
    } catch {
      setFeedbackMessage({
        type: 'error',
        text: t('admin.stores.form.saveError', 'Erreur lors de la sauvegarde.'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (
    storeId: string,
    newStatus: 'active' | 'pending' | 'suspended' | 'rejected'
  ) => {
    try {
      await updateStore(storeId, { status: newStatus });
      setFeedbackMessage({
        type: 'success',
        text: t('admin.stores.statusUpdated', 'Statut mis à jour.'),
      });
    } catch {
      setFeedbackMessage({
        type: 'error',
        text: t('admin.stores.statusUpdateError', 'Erreur lors de la mise à jour du statut.'),
      });
    }
  };

  const isFormOpen = isCreating || editStore !== null;

  const renderFormModal = () => {
    if (!isFormOpen) return null;
    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-40" onClick={closeForm}></div>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-cosmos-cream max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
              <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                {editStore
                  ? t('admin.stores.form.editTitle', 'Modifier la Boutique')
                  : t('admin.stores.form.createTitle', 'Nouvelle Boutique')}
              </h2>
              <button onClick={closeForm} className="text-text-secondary hover:text-cosmos-night">
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-light text-text-secondary mb-1">
                  {t('admin.stores.form.name', 'Nom')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  placeholder={t('admin.stores.form.namePlaceholder', 'Nom de la boutique')}
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-light text-text-secondary mb-1">
                  {t('admin.stores.form.slug', 'Slug')}
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleFormChange('slug', e.target.value)}
                  className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light bg-gray-50"
                  placeholder={t('admin.stores.form.slugPlaceholder', 'auto-genere-depuis-nom')}
                />
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm font-light text-text-secondary mb-1">
                  {t('admin.stores.form.logo', 'Logo')}
                </label>
                <div className="flex items-start gap-3">
                  {formData.logo ? (
                    <img
                      src={formData.logo}
                      alt="logo"
                      className="w-20 h-20 object-contain rounded border border-cosmos-cream bg-white flex-shrink-0"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded border border-dashed border-cosmos-cream flex items-center justify-center text-text-secondary flex-shrink-0">
                      <ImageIcon className="w-6 h-6" strokeWidth={1.25} />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-cosmos-night text-white text-sm font-light cursor-pointer hover:bg-opacity-90 transition-colors">
                      {uploadingLogo ? (
                        <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                      ) : (
                        <Upload className="w-4 h-4" strokeWidth={1.5} />
                      )}
                      {t('admin.stores.form.uploadLogo', 'Téléverser un logo')}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void uploadLogo(f);
                          e.currentTarget.value = '';
                        }}
                      />
                    </label>
                    <input
                      type="url"
                      value={formData.logo}
                      onChange={(e) => handleFormChange('logo', e.target.value)}
                      placeholder="…ou collez une URL de logo"
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>
                </div>
              </div>

              {/* Image de couverture */}
              <div>
                <label className="block text-sm font-light text-text-secondary mb-1">
                  {t('admin.stores.form.cover', 'Image de couverture')}
                </label>
                <div className="flex items-start gap-3">
                  {formData.cover_image ? (
                    <img
                      src={formData.cover_image}
                      alt="couverture"
                      className="w-28 h-20 object-cover rounded border border-cosmos-cream bg-white flex-shrink-0"
                    />
                  ) : (
                    <div className="w-28 h-20 rounded border border-dashed border-cosmos-cream flex items-center justify-center text-text-secondary flex-shrink-0">
                      <ImageIcon className="w-6 h-6" strokeWidth={1.25} />
                    </div>
                  )}
                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-cosmos-night text-white text-sm font-light cursor-pointer hover:bg-opacity-90 transition-colors">
                      {uploadingCover ? (
                        <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                      ) : (
                        <Upload className="w-4 h-4" strokeWidth={1.5} />
                      )}
                      {t('admin.stores.form.uploadCover', 'Téléverser une couverture')}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void uploadCover(f);
                          e.currentTarget.value = '';
                        }}
                      />
                    </label>
                    <input
                      type="url"
                      value={formData.cover_image}
                      onChange={(e) => handleFormChange('cover_image', e.target.value)}
                      placeholder="…ou collez une URL d'image"
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>
                </div>
              </div>

              {/* Galerie photos (multi) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-light text-text-secondary">
                    {t('admin.stores.form.gallery', 'Galerie photos')}
                  </label>
                  <label className="inline-flex items-center gap-2 px-3 py-1.5 border border-cosmos-cream hover:border-gray-900 text-sm font-light cursor-pointer transition-colors">
                    {uploadingGallery ? (
                      <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                    ) : (
                      <Plus className="w-4 h-4" strokeWidth={1.5} />
                    )}
                    {t('admin.stores.form.addPhotos', 'Ajouter des photos')}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length) void uploadGalleryFiles(e.target.files);
                        e.currentTarget.value = '';
                      }}
                    />
                  </label>
                </div>
                {formData.gallery.length === 0 ? (
                  <p className="text-xs text-text-secondary font-light">
                    {t('admin.stores.form.galleryEmpty', 'Aucune photo. Ajoutez plusieurs visuels (montrés dans la fiche enseigne).')}
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {formData.gallery.map((g, i) => (
                      <div key={i} className="relative group">
                        <img
                          src={g.url}
                          alt={`photo ${i + 1}`}
                          className="w-full h-20 object-cover rounded border border-cosmos-cream"
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryItem(i)}
                          className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-white/90 border border-cosmos-cream rounded hover:border-red-600 hover:bg-red-50 transition-colors"
                          title="Retirer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-600" strokeWidth={1.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-light text-text-secondary mb-1">
                  {t('admin.stores.form.description', 'Description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light resize-none"
                  placeholder={t(
                    'admin.stores.form.descriptionPlaceholder',
                    'Description de la boutique'
                  )}
                />
              </div>

              {/* Category + Zone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-1">
                    {t('admin.stores.form.category', 'Catégorie')}
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    placeholder={t(
                      'admin.stores.form.categoryPlaceholder',
                      'Ex: Mode, Restauration...'
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-1">
                    {t('admin.stores.form.zone', 'Zone')}
                  </label>
                  <input
                    type="text"
                    value={formData.zone}
                    onChange={(e) => handleFormChange('zone', e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    placeholder={t('admin.stores.form.zonePlaceholder', 'Ex: RDC, Étage 1...')}
                  />
                </div>
              </div>

              {/* Location code + Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-1">
                    {t('admin.stores.form.locationCode', 'Code emplacement')}
                  </label>
                  <input
                    type="text"
                    value={formData.location_code}
                    onChange={(e) => handleFormChange('location_code', e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    placeholder={t('admin.stores.form.locationCodePlaceholder', 'Ex: A-12')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-1">
                    {t('admin.stores.form.hours', 'Horaires')}
                  </label>
                  <input
                    type="text"
                    value={formData.hours}
                    onChange={(e) => handleFormChange('hours', e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    placeholder={t('admin.stores.form.hoursPlaceholder', 'Ex: 9h-21h')}
                  />
                </div>
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-1">
                    {t('admin.stores.form.phone', 'Téléphone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    placeholder={t('admin.stores.form.phonePlaceholder', '+225 XX XX XX XX')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-1">
                    {t('admin.stores.form.email', 'Email')}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    placeholder={t('admin.stores.form.emailPlaceholder', 'boutique@email.com')}
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-light text-text-secondary mb-1">
                  {t('admin.stores.form.website', 'Site Web')}
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleFormChange('website', e.target.value)}
                  className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  placeholder={t('admin.stores.form.websitePlaceholder', 'https://www.example.com')}
                />
              </div>

              {/* Plan + Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-1">
                    {t('admin.stores.form.plan', 'Plan')}
                  </label>
                  <select
                    value={formData.plan}
                    onChange={(e) => handleFormChange('plan', e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  >
                    <option value="Free">Free</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-1">
                    {t('admin.stores.form.status', 'Statut')}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  >
                    <option value="active">{t('admin.stores.status.active', 'Actif')}</option>
                    <option value="pending">
                      {t('admin.stores.status.pending', 'En attente')}
                    </option>
                    <option value="suspended">
                      {t('admin.stores.status.suspended', 'Suspendu')}
                    </option>
                    <option value="rejected">{t('admin.stores.status.rejected', 'Rejeté')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Form actions */}
            <div className="p-6 border-t border-cosmos-cream flex items-center justify-end gap-3">
              <button
                onClick={closeForm}
                className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
              >
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-4 h-4" strokeWidth={1.5} />
                )}
                {editStore
                  ? t('admin.stores.form.save', 'Enregistrer')
                  : t('admin.stores.form.create', 'Créer')}
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Feedback message */}
      {feedbackMessage && (
        <div
          className={`p-4 border font-light text-sm flex items-center justify-between ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 border-green-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <AlertCircle className="w-4 h-4" strokeWidth={1.5} />
            )}
            {feedbackMessage.text}
          </div>
          <button onClick={() => setFeedbackMessage(null)} className="hover:opacity-70">
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-cosmos-night mb-2 tracking-tight">
            {t('admin.stores.title', 'Gestion des Boutiques')}
          </h1>
          <p className="text-text-secondary font-light">
            {t('admin.stores.subtitle', 'Gérez toutes les boutiques du centre commercial')}
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          {t('admin.stores.newStore', 'Nouvelle Boutique')}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-cosmos-cream p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} strokeWidth={1.5} />
              </div>
            </div>
            <div className="text-3xl font-light text-cosmos-night mb-1 tracking-tight">
              {stat.value}
            </div>
            <div className="text-xs text-text-secondary uppercase tracking-wider font-light">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-cosmos-cream p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary"
              strokeWidth={1.5}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('admin.stores.searchPlaceholder', 'Rechercher une boutique...')}
              className="w-full pl-10 pr-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
          >
            <option value="all">{t('admin.stores.filter.allStatuses', 'Tous les statuts')}</option>
            <option value="active">{t('admin.stores.status.active', 'Actif')}</option>
            <option value="pending">{t('admin.stores.status.pending', 'En attente')}</option>
            <option value="suspended">{t('admin.stores.status.suspended', 'Suspendu')}</option>
            <option value="rejected">{t('admin.stores.status.rejected', 'Rejeté')}</option>
          </select>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
          >
            <option value="all">{t('admin.stores.filter.allPlans', 'Tous les plans')}</option>
            <option value="Free">Free</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white border border-cosmos-cream p-12 text-center">
          <div className="flex justify-center items-center gap-2 text-text-secondary">
            <div className="w-5 h-5 border-2 border-cosmos-night border-t-transparent rounded-full animate-spin"></div>
            <span className="font-light">{t('common.loading', 'Chargement...')}</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" strokeWidth={1.5} />
            <div>
              <h3 className="text-sm font-light text-red-900 mb-1">
                {t('common.error', 'Erreur')}
              </h3>
              <p className="text-sm text-red-700 font-light">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stores Table */}
      {!isLoading && !error && (
        <div className="bg-white border border-cosmos-cream">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-cosmos-cream">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                    {t('admin.stores.table.store', 'Boutique')}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                    {t('admin.stores.table.owner', 'Propriétaire')}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                    {t('admin.stores.table.location', 'Emplacement')}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                    {t('admin.stores.table.plan', 'Plan')}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                    {t('admin.stores.table.status', 'Statut')}
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                    {t('admin.stores.table.stats', 'Stats')}
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                    {t('common.actions', 'Actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStores.map((store) => (
                  <tr key={store.id} className="hover:bg-cosmos-cream/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-light text-cosmos-night">{store.name}</div>
                        <div className="text-sm text-text-secondary font-light">
                          {store.category}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-light text-cosmos-night">{store.owner}</div>
                        <div className="text-sm text-text-secondary font-light">{store.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-light text-cosmos-night">{store.floor}</div>
                      <div className="text-sm text-text-secondary font-light">{store.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs text-white bg-gradient-to-r ${getPlanColor(store.plan)} font-light`}
                      >
                        {store.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-3 py-1 ${getStatusColor(store.status)} border font-light`}
                      >
                        {getStatusLabel(store.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-light text-cosmos-night">
                        {store.views.toLocaleString()} {t('admin.stores.views', 'vues')}
                      </div>
                      {store.rating > 0 && (
                        <div className="text-sm text-text-secondary font-light">
                          &#11088; {store.rating}/5
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setViewStore(store)}
                          className="p-2 border border-cosmos-cream hover:border-gray-900 transition-colors"
                          title={t('common.view', 'Voir les détails')}
                        >
                          <Eye className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => openEditForm(store)}
                          className="p-2 border border-cosmos-cream hover:border-gray-900 transition-colors"
                          title={t('common.edit', 'Modifier')}
                        >
                          <Edit className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        {store.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(store.id, 'active')}
                              className="p-2 border border-green-200 bg-emerald-50 hover:border-green-600 text-emerald-600 transition-colors"
                              title={t('admin.stores.actions.approve', 'Approuver')}
                            >
                              <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(store.id, 'rejected')}
                              className="p-2 border border-red-200 bg-red-50 hover:border-red-600 text-red-600 transition-colors"
                              title={t('admin.stores.actions.reject', 'Rejeter')}
                            >
                              <XCircle className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                          </>
                        )}
                        {store.status === 'active' && (
                          <button
                            onClick={() => handleStatusChange(store.id, 'suspended')}
                            className="p-2 border border-red-200 bg-red-50 hover:border-red-600 text-red-600 transition-colors"
                            title={t('admin.stores.actions.suspend', 'Suspendre')}
                          >
                            <Ban className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteStoreModal(store)}
                          className="p-2 border border-red-200 bg-red-50 hover:border-red-600 text-red-600 transition-colors"
                          title={t('common.delete', 'Supprimer')}
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!isLoading && !error && filteredStores.length === 0 && (
        <div className="bg-white border border-cosmos-cream p-12 text-center">
          <Store className="w-12 h-12 text-text-secondary mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-light text-cosmos-night mb-2">
            {t('admin.stores.noStores', 'Aucune boutique')}
          </h3>
          <p className="text-sm text-text-secondary font-light mb-6">
            {t(
              'admin.stores.noStoresMessage',
              'Aucune boutique ne correspond à vos critères de recherche'
            )}
          </p>
        </div>
      )}

      {/* Create / Edit Store Modal */}
      {renderFormModal()}

      {/* Delete Store Modal */}
      {deleteStoreModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setDeleteStoreModal(null)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-50 flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-cosmos-night tracking-tight">
                      {t('admin.stores.deleteStore', 'Supprimer la boutique')}
                    </h3>
                    <p className="text-sm text-text-secondary font-light">
                      {t('admin.stores.deleteIrreversible', 'Cette action est irréversible')}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary font-light mb-6">
                  {t(
                    'admin.stores.confirmDelete',
                    'Êtes-vous sûr de vouloir supprimer la boutique "{{name}}" ? Toutes les données associées seront perdues.',
                    { name: deleteStoreModal.name }
                  )}
                </p>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setDeleteStoreModal(null)}
                    className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                  >
                    {t('common.cancel', 'Annuler')}
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await deleteStore(deleteStoreModal.id);
                        setDeleteStoreModal(null);
                        setFeedbackMessage({
                          type: 'success',
                          text: t('admin.stores.deleteSuccess', 'Boutique supprimée avec succès.'),
                        });
                      } catch (err) {
                        console.error('Error deleting store:', err);
                        setFeedbackMessage({
                          type: 'error',
                          text: t(
                            'admin.stores.deleteError',
                            'Erreur lors de la suppression de la boutique.'
                          ),
                        });
                      }
                    }}
                    className="px-6 py-2 bg-red-600 text-white font-light hover:bg-red-700 transition-colors"
                  >
                    {t('common.delete', 'Supprimer')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* View Store Modal */}
      {viewStore && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setViewStore(null)}></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
                <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                  {t('admin.stores.storeDetails', 'Détails de la Boutique')}
                </h2>
                <button
                  onClick={() => setViewStore(null)}
                  className="text-text-secondary hover:text-cosmos-night"
                >
                  <XCircle className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Header Info */}
                <div>
                  <h3 className="text-xl font-light text-cosmos-night mb-1 tracking-tight">
                    {viewStore.name}
                  </h3>
                  <p className="text-sm text-text-secondary font-light mb-2">
                    {viewStore.category}
                  </p>
                  <span
                    className={`text-xs px-3 py-1 ${getStatusColor(viewStore.status)} border font-light`}
                  >
                    {getStatusLabel(viewStore.status)}
                  </span>
                </div>

                {/* Description */}
                {viewStore.description && (
                  <div className="pt-4 border-t border-cosmos-cream">
                    <h4 className="text-sm text-text-secondary font-light mb-2">
                      {t('admin.stores.detail.description', 'Description')}
                    </h4>
                    <p className="font-light text-cosmos-night">{viewStore.description}</p>
                  </div>
                )}

                {/* Basic Information */}
                <div className="pt-4 border-t border-cosmos-cream">
                  <h4 className="text-sm text-text-secondary font-light mb-4">
                    {t('admin.stores.detail.basicInfo', 'Informations de base')}
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-text-secondary font-light mb-1">
                        {t('admin.stores.detail.owner', 'Propriétaire')}
                      </div>
                      <div className="font-light text-cosmos-night">{viewStore.owner}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary font-light mb-1">Plan</div>
                      <span
                        className={`inline-block px-3 py-1 text-xs text-white bg-gradient-to-r ${getPlanColor(viewStore.plan)} font-light`}
                      >
                        {viewStore.plan}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary font-light mb-1">
                        {t('admin.stores.detail.joinedDate', "Date d'inscription")}
                      </div>
                      <div className="font-light text-cosmos-night flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
                        {new Date(viewStore.joinedDate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    {viewStore.openingHours && (
                      <div>
                        <div className="text-sm text-text-secondary font-light mb-1">
                          {t('admin.stores.detail.openingHours', "Horaires d'ouverture")}
                        </div>
                        <div className="font-light text-cosmos-night">{viewStore.openingHours}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="pt-4 border-t border-cosmos-cream">
                  <h4 className="text-sm text-text-secondary font-light mb-4">
                    {t('admin.stores.detail.contact', 'Contact')}
                  </h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm text-text-secondary font-light mb-1">Email</div>
                      <div className="font-light text-cosmos-night flex items-center gap-2">
                        <Mail className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
                        {viewStore.email}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary font-light mb-1">
                        {t('admin.stores.detail.phone', 'Téléphone')}
                      </div>
                      <div className="font-light text-cosmos-night flex items-center gap-2">
                        <Phone className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
                        {viewStore.phone}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary font-light mb-1">
                        {t('admin.stores.detail.location', 'Emplacement')}
                      </div>
                      <div className="font-light text-cosmos-night flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
                        {viewStore.floor} - {viewStore.location}
                      </div>
                    </div>
                    {viewStore.website && (
                      <div>
                        <div className="text-sm text-text-secondary font-light mb-1">Site Web</div>
                        <a
                          href={viewStore.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-light text-cosmos-night hover:underline flex items-center gap-2"
                        >
                          {viewStore.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Media */}
                {viewStore.socialMedia &&
                  (viewStore.socialMedia.facebook || viewStore.socialMedia.instagram) && (
                    <div className="pt-4 border-t border-cosmos-cream">
                      <h4 className="text-sm text-text-secondary font-light mb-4">
                        {t('admin.stores.detail.socialMedia', 'Réseaux Sociaux')}
                      </h4>
                      <div className="flex gap-4">
                        {viewStore.socialMedia.facebook && (
                          <a
                            href={viewStore.socialMedia.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 border border-cosmos-cream hover:border-gray-900 font-light text-cosmos-night transition-colors"
                          >
                            Facebook
                          </a>
                        )}
                        {viewStore.socialMedia.instagram && (
                          <a
                            href={viewStore.socialMedia.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 border border-cosmos-cream hover:border-gray-900 font-light text-cosmos-night transition-colors"
                          >
                            Instagram
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                {/* Business Stats */}
                <div className="pt-4 border-t border-cosmos-cream">
                  <h4 className="text-sm text-text-secondary font-light mb-4">
                    {t('admin.stores.detail.businessInfo', 'Informations commerciales')}
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {viewStore.employees && (
                      <div className="text-center p-4 border border-cosmos-cream">
                        <Users
                          className="w-6 h-6 text-text-secondary mx-auto mb-2"
                          strokeWidth={1.5}
                        />
                        <div className="text-2xl font-light text-cosmos-night">
                          {viewStore.employees}
                        </div>
                        <div className="text-xs text-text-secondary font-light">
                          {t('admin.stores.detail.employees', 'Employés')}
                        </div>
                      </div>
                    )}
                    {viewStore.products && (
                      <div className="text-center p-4 border border-cosmos-cream">
                        <Package
                          className="w-6 h-6 text-text-secondary mx-auto mb-2"
                          strokeWidth={1.5}
                        />
                        <div className="text-2xl font-light text-cosmos-night">
                          {viewStore.products.toLocaleString()}
                        </div>
                        <div className="text-xs text-text-secondary font-light">
                          {t('admin.stores.detail.products', 'Produits')}
                        </div>
                      </div>
                    )}
                    {viewStore.lastSale && (
                      <div className="text-center p-4 border border-cosmos-cream">
                        <TrendingUp
                          className="w-6 h-6 text-text-secondary mx-auto mb-2"
                          strokeWidth={1.5}
                        />
                        <div className="text-lg font-light text-cosmos-night">
                          {new Date(viewStore.lastSale).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-xs text-text-secondary font-light">
                          {t('admin.stores.detail.lastSale', 'Dernière Vente')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Performance Statistics */}
                <div className="pt-4 border-t border-cosmos-cream">
                  <h4 className="text-sm text-text-secondary font-light mb-4">
                    {t('admin.stores.detail.performanceStats', 'Statistiques de performance')}
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 border border-cosmos-cream">
                      <div className="text-2xl font-light text-cosmos-night">
                        {viewStore.views.toLocaleString()}
                      </div>
                      <div className="text-xs text-text-secondary font-light">
                        {t('admin.stores.detail.viewsLabel', 'Vues')}
                      </div>
                    </div>
                    <div className="text-center p-4 border border-cosmos-cream">
                      <div className="text-2xl font-light text-cosmos-night">
                        {viewStore.rating > 0 ? viewStore.rating : 'N/A'}
                      </div>
                      <div className="text-xs text-text-secondary font-light">
                        {t('admin.stores.detail.rating', 'Note /5')}
                      </div>
                    </div>
                    <div className="text-center p-4 border border-cosmos-cream">
                      <div className="text-2xl font-light text-cosmos-night">
                        {(viewStore.revenue / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-text-secondary font-light">
                        {t('admin.stores.detail.revenue', 'Revenu FCFA')}
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

export default StoresManagement;
