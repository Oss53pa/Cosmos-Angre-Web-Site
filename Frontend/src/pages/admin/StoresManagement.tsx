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
} from 'lucide-react';
import { useStores } from '../../hooks/useStores';

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

interface StoreFormData {
  name: string;
  slug: string;
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
    setFormData({
      name: store.name,
      slug: store.slug,
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
        await updateStore(editStore.id, payload);
        setFeedbackMessage({
          type: 'success',
          text: t('admin.stores.form.updateSuccess', 'Boutique mise à jour avec succès.'),
        });
      } else {
        await createStore(payload);
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
