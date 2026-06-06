import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useEvents } from '../../hooks/useEvents';
import {
  Calendar,
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  X,
  Save,
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  organizer: string;
  maxParticipants: number;
  registeredParticipants: number;
  image?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  visibility: 'public' | 'private';
}

interface EventFormData {
  title: string;
  slug: string;
  description: string;
  category: string;
  location: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  organizer: string;
  max_participants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  visibility: 'public' | 'private';
}

const emptyEventForm: EventFormData = {
  title: '',
  slug: '',
  description: '',
  category: '',
  location: '',
  start_date: '',
  end_date: '',
  start_time: '',
  end_time: '',
  organizer: '',
  max_participants: 0,
  status: 'upcoming',
  visibility: 'public',
};

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

const EventsManagement: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewEvent, setViewEvent] = useState<Event | null>(null);
  const [deleteEventModal, setDeleteEventModal] = useState<Event | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>(emptyEventForm);
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Use Supabase hook
  const {
    events: supabaseEvents,
    isLoading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
  } = useEvents();

  // Auto-clear feedback after 4 seconds
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  // Map Supabase events (snake_case) to local Event interface (camelCase)
  const events: Event[] = supabaseEvents.map((event) => ({
    id: event.id,
    title: event.title,
    slug: event.slug,
    description: event.description || '',
    category: event.category || '',
    location: event.location || '',
    startDate: event.start_date || '',
    endDate: event.end_date || '',
    startTime: event.start_time || '',
    endTime: event.end_time || '',
    organizer: event.organizer || '',
    maxParticipants: event.max_participants || 0,
    registeredParticipants: event.registered_participants,
    image: event.image || undefined,
    status: event.status,
    visibility: event.visibility,
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'text-cosmos-night bg-cosmos-gold/10 border-blue-200';
      case 'ongoing':
        return 'text-emerald-600 bg-emerald-50 border-green-200';
      case 'completed':
        return 'text-text-secondary bg-cosmos-cream/50 border-cosmos-cream';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-text-secondary bg-cosmos-cream/50 border-cosmos-cream';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming':
        return t('admin.events.status.upcoming', 'À venir');
      case 'ongoing':
        return t('admin.events.status.ongoing', 'En cours');
      case 'completed':
        return t('admin.events.status.completed', 'Terminé');
      case 'cancelled':
        return t('admin.events.status.cancelled', 'Annulé');
      default:
        return status;
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      label: t('admin.events.stats.totalEvents', 'Total Événements'),
      value: events.length,
      icon: Calendar,
      color: 'text-cosmos-night',
      bg: 'bg-cosmos-gold/10',
    },
    {
      label: t('admin.events.stats.upcoming', 'À Venir'),
      value: events.filter((e) => e.status === 'upcoming').length,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: t('admin.events.stats.ongoing', 'En Cours'),
      value: events.filter((e) => e.status === 'ongoing').length,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: t('admin.events.stats.completed', 'Terminés'),
      value: events.filter((e) => e.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-text-secondary',
      bg: 'bg-cosmos-cream/50',
    },
  ];

  // --- Form helpers ---
  const openCreateForm = () => {
    setFormData(emptyEventForm);
    setIsCreating(true);
    setEditingEvent(null);
  };

  const openEditForm = (event: Event) => {
    setFormData({
      title: event.title,
      slug: event.slug,
      description: event.description,
      category: event.category,
      location: event.location,
      start_date: event.startDate,
      end_date: event.endDate,
      start_time: event.startTime,
      end_time: event.endTime,
      organizer: event.organizer,
      max_participants: event.maxParticipants,
      status: event.status,
      visibility: event.visibility,
    });
    setEditingEvent(event);
    setIsCreating(false);
  };

  const closeForm = () => {
    setIsCreating(false);
    setEditingEvent(null);
    setFormData(emptyEventForm);
  };

  const handleFormChange = (field: keyof EventFormData, value: string | number) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'title') {
        updated.slug = generateSlug(value as string);
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) {
      setFeedbackMessage({
        type: 'error',
        text: t('admin.events.form.titleRequired', 'Le titre est obligatoire.'),
      });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description || null,
        category: formData.category || null,
        location: formData.location || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        organizer: formData.organizer || null,
        max_participants: formData.max_participants || null,
        status: formData.status,
        visibility: formData.visibility,
      };

      if (editingEvent) {
        await updateEvent(editingEvent.id, payload);
        setFeedbackMessage({
          type: 'success',
          text: t('admin.events.form.updateSuccess', 'Événement mis à jour avec succès.'),
        });
      } else {
        await createEvent(payload);
        setFeedbackMessage({
          type: 'success',
          text: t('admin.events.form.createSuccess', 'Événement créé avec succès.'),
        });
      }
      closeForm();
    } catch {
      setFeedbackMessage({
        type: 'error',
        text: t('admin.events.form.saveError', 'Erreur lors de la sauvegarde.'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (
    eventId: string,
    newStatus: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  ) => {
    try {
      await updateEvent(eventId, { status: newStatus });
      setFeedbackMessage({
        type: 'success',
        text: t('admin.events.statusUpdated', 'Statut mis à jour.'),
      });
    } catch {
      setFeedbackMessage({
        type: 'error',
        text: t('admin.events.statusUpdateError', 'Erreur lors de la mise à jour du statut.'),
      });
    }
  };

  // --- Render form modal ---
  const isFormOpen = isCreating || editingEvent !== null;

  const renderFormModal = () => {
    if (!isFormOpen) return null;
    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-40" onClick={closeForm}></div>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-cosmos-cream max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
              <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                {editingEvent
                  ? t('admin.events.form.editTitle', "Modifier l'Événement")
                  : t('admin.events.form.createTitle', 'Nouvel Événement')}
              </h2>
              <button onClick={closeForm} className="text-text-secondary hover:text-cosmos-night">
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-light text-text-secondary mb-1">
                  {t('admin.events.form.title', 'Titre')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  placeholder={t('admin.events.form.titlePlaceholder', "Nom de l'événement")}
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-light text-text-secondary mb-1">
                  {t('admin.events.form.slug', 'Slug')}
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleFormChange('slug', e.target.value)}
                  className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light bg-gray-50"
                  placeholder={t('admin.events.form.slugPlaceholder', 'auto-genere-depuis-titre')}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-light text-text-secondary mb-1">
                  {t('admin.events.form.description', 'Description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light resize-none"
                  placeholder={t(
                    'admin.events.form.descriptionPlaceholder',
                    "Description de l'événement"
                  )}
                />
              </div>

              {/* Category + Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-1">
                    {t('admin.events.form.category', 'Catégorie')}
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    placeholder={t(
                      'admin.events.form.categoryPlaceholder',
                      'Ex: Concert, Exposition...'
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-1">
                    {t('admin.events.form.location', 'Lieu')}
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleFormChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    placeholder={t('admin.events.form.locationPlaceholder', 'Ex: Hall principal')}
                  />
                </div>
              </div>

              {/* Start date + End date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-1">
                    {t('admin.events.form.startDate', 'Date de début')}
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleFormChange('start_date', e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-1">
                    {t('admin.events.form.endDate', 'Date de fin')}
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleFormChange('end_date', e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>
              </div>

              {/* Start time + End time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-1">
                    {t('admin.events.form.startTime', 'Heure de début')}
                  </label>
                  <input
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => handleFormChange('start_time', e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-1">
                    {t('admin.events.form.endTime', 'Heure de fin')}
                  </label>
                  <input
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => handleFormChange('end_time', e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>
              </div>

              {/* Organizer + Max participants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-1">
                    {t('admin.events.form.organizer', 'Organisateur')}
                  </label>
                  <input
                    type="text"
                    value={formData.organizer}
                    onChange={(e) => handleFormChange('organizer', e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    placeholder={t(
                      'admin.events.form.organizerPlaceholder',
                      "Nom de l'organisateur"
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-1">
                    {t('admin.events.form.maxParticipants', 'Participants max')}
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.max_participants}
                    onChange={(e) =>
                      handleFormChange('max_participants', parseInt(e.target.value) || 0)
                    }
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>
              </div>

              {/* Status + Visibility */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-1">
                    {t('admin.events.form.status', 'Statut')}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  >
                    <option value="upcoming">{t('admin.events.status.upcoming', 'À venir')}</option>
                    <option value="ongoing">{t('admin.events.status.ongoing', 'En cours')}</option>
                    <option value="completed">
                      {t('admin.events.status.completed', 'Terminé')}
                    </option>
                    <option value="cancelled">
                      {t('admin.events.status.cancelled', 'Annulé')}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-light text-text-secondary mb-1">
                    {t('admin.events.form.visibility', 'Visibilité')}
                  </label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => handleFormChange('visibility', e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  >
                    <option value="public">
                      {t('admin.events.form.visibilityPublic', 'Public')}
                    </option>
                    <option value="private">
                      {t('admin.events.form.visibilityPrivate', 'Privé')}
                    </option>
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
                {editingEvent
                  ? t('admin.events.form.save', 'Enregistrer')
                  : t('admin.events.form.create', 'Créer')}
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
            {t('admin.events.title', 'Gestion des Événements')}
          </h1>
          <p className="text-text-secondary font-light">
            {t('admin.events.subtitle', 'Créez et gérez tous les événements du centre commercial')}
          </p>
        </div>
        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          {t('admin.events.addEvent', 'Nouvel Événement')}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              placeholder={t('admin.events.searchPlaceholder', 'Rechercher un événement...')}
              className="w-full pl-10 pr-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
          >
            <option value="all">{t('admin.events.filter.allStatuses', 'Tous les statuts')}</option>
            <option value="upcoming">{t('admin.events.status.upcoming', 'À venir')}</option>
            <option value="ongoing">{t('admin.events.status.ongoing', 'En cours')}</option>
            <option value="completed">{t('admin.events.status.completed', 'Terminé')}</option>
            <option value="cancelled">{t('admin.events.status.cancelled', 'Annulé')}</option>
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

      {/* Events Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white border border-cosmos-cream hover:border-cosmos-cream transition-colors"
            >
              {event.image && (
                <div className="h-48 border-b border-cosmos-cream">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-light text-cosmos-night mb-2 tracking-tight">
                      {event.title}
                    </h3>
                    <span
                      className={`text-xs px-3 py-1 ${getStatusColor(event.status)} border font-light`}
                    >
                      {getStatusLabel(event.status)}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-text-secondary font-light leading-relaxed mb-4 line-clamp-2">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-text-secondary font-light">
                    <Calendar className="w-4 h-4" strokeWidth={1.5} />
                    <span>
                      {new Date(event.startDate).toLocaleDateString('fr-FR')}
                      {event.startDate !== event.endDate &&
                        ` - ${new Date(event.endDate).toLocaleDateString('fr-FR')}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary font-light">
                    <Clock className="w-4 h-4" strokeWidth={1.5} />
                    <span>
                      {event.startTime} - {event.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary font-light">
                    <MapPin className="w-4 h-4" strokeWidth={1.5} />
                    <span>{event.location}</span>
                  </div>
                  {event.maxParticipants > 0 && (
                    <div className="flex items-center gap-2 text-sm text-text-secondary font-light">
                      <Users className="w-4 h-4" strokeWidth={1.5} />
                      <span>
                        {event.registeredParticipants} / {event.maxParticipants}{' '}
                        {t('admin.events.participants', 'participants')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status action buttons */}
                {(event.status === 'cancelled' || event.status === 'upcoming') && (
                  <div className="flex items-center gap-2 mb-4">
                    {event.status === 'cancelled' && (
                      <button
                        onClick={() => handleStatusChange(event.id, 'upcoming')}
                        className="flex items-center gap-1 px-3 py-1 border border-green-200 bg-emerald-50 hover:border-green-600 text-emerald-600 font-light text-xs transition-colors"
                      >
                        <CheckCircle className="w-3 h-3" strokeWidth={1.5} />
                        {t('admin.events.actions.reactivate', 'Réactiver')}
                      </button>
                    )}
                    {event.status === 'upcoming' && (
                      <button
                        onClick={() => handleStatusChange(event.id, 'cancelled')}
                        className="flex items-center gap-1 px-3 py-1 border border-red-200 bg-red-50 hover:border-red-600 text-red-600 font-light text-xs transition-colors"
                      >
                        <XCircle className="w-3 h-3" strokeWidth={1.5} />
                        {t('admin.events.actions.cancel', 'Annuler')}
                      </button>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setViewEvent(event)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light text-sm transition-colors"
                  >
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                    {t('common.view', 'Voir')}
                  </button>
                  <button
                    onClick={() => openEditForm(event)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light text-sm transition-colors"
                  >
                    <Edit className="w-4 h-4" strokeWidth={1.5} />
                    {t('common.edit', 'Modifier')}
                  </button>
                  <button
                    onClick={() => setDeleteEventModal(event)}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 hover:border-red-600 bg-red-50 text-red-600 font-light text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && filteredEvents.length === 0 && (
        <div className="bg-white border border-cosmos-cream p-12 text-center">
          <Calendar className="w-12 h-12 text-text-secondary mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="text-lg font-light text-cosmos-night mb-2">
            {t('admin.events.noEvents', 'Aucun événement')}
          </h3>
          <p className="text-sm text-text-secondary font-light mb-6">
            {t(
              'admin.events.noEventsMessage',
              'Aucun événement ne correspond à vos critères de recherche'
            )}
          </p>
        </div>
      )}

      {/* Create / Edit Event Modal */}
      {renderFormModal()}

      {/* View Event Modal */}
      {viewEvent && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setViewEvent(null)}></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
                <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                  {t('admin.events.eventDetails', "Détails de l'Événement")}
                </h2>
                <button
                  onClick={() => setViewEvent(null)}
                  className="text-text-secondary hover:text-cosmos-night"
                >
                  <XCircle className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>

              {viewEvent.image && (
                <div className="h-64 border-b border-cosmos-cream">
                  <img
                    src={viewEvent.image}
                    alt={viewEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-2xl font-light text-cosmos-night tracking-tight">
                      {viewEvent.title}
                    </h3>
                    <span
                      className={`text-xs px-3 py-1 ${getStatusColor(viewEvent.status)} border font-light`}
                    >
                      {getStatusLabel(viewEvent.status)}
                    </span>
                  </div>
                  <span className="inline-block px-3 py-1 bg-cosmos-cream text-sm text-text-secondary font-light">
                    {viewEvent.category}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm text-text-secondary font-light mb-2">
                    {t('admin.events.detail.description', 'Description')}
                  </h4>
                  <p className="text-cosmos-night font-light leading-relaxed">
                    {viewEvent.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-text-secondary font-light mb-1">
                      {t('admin.events.detail.startDate', 'Date de début')}
                    </div>
                    <div className="font-light text-cosmos-night">
                      {new Date(viewEvent.startDate).toLocaleDateString('fr-FR')}{' '}
                      {t('admin.events.detail.at', 'à')} {viewEvent.startTime}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary font-light mb-1">
                      {t('admin.events.detail.endDate', 'Date de fin')}
                    </div>
                    <div className="font-light text-cosmos-night">
                      {new Date(viewEvent.endDate).toLocaleDateString('fr-FR')}{' '}
                      {t('admin.events.detail.at', 'à')} {viewEvent.endTime}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary font-light mb-1">
                      {t('admin.events.detail.location', 'Lieu')}
                    </div>
                    <div className="font-light text-cosmos-night">{viewEvent.location}</div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary font-light mb-1">
                      {t('admin.events.detail.organizer', 'Organisateur')}
                    </div>
                    <div className="font-light text-cosmos-night">{viewEvent.organizer}</div>
                  </div>
                  {viewEvent.maxParticipants > 0 && (
                    <>
                      <div>
                        <div className="text-sm text-text-secondary font-light mb-1">
                          {t('admin.events.detail.registeredParticipants', 'Participants inscrits')}
                        </div>
                        <div className="font-light text-cosmos-night">
                          {viewEvent.registeredParticipants}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-text-secondary font-light mb-1">
                          {t('admin.events.detail.availableSpots', 'Places disponibles')}
                        </div>
                        <div className="font-light text-cosmos-night">
                          {viewEvent.maxParticipants - viewEvent.registeredParticipants} /{' '}
                          {viewEvent.maxParticipants}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Event Modal */}
      {deleteEventModal && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setDeleteEventModal(null)}
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
                      {t('admin.events.deleteEvent', "Supprimer l'événement")}
                    </h3>
                    <p className="text-sm text-text-secondary font-light">
                      {t('admin.events.deleteIrreversible', 'Cette action est irréversible')}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary font-light mb-6">
                  {t(
                    'admin.events.confirmDelete',
                    'Êtes-vous sûr de vouloir supprimer l\'événement "{{title}}" ? Tous les participants inscrits seront notifiés de l\'annulation.',
                    { title: deleteEventModal.title }
                  )}
                </p>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setDeleteEventModal(null)}
                    className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                  >
                    {t('common.cancel', 'Annuler')}
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await deleteEvent(deleteEventModal.id);
                        setDeleteEventModal(null);
                        setFeedbackMessage({
                          type: 'success',
                          text: t('admin.events.deleteSuccess', 'Événement supprimé avec succès.'),
                        });
                      } catch (err) {
                        console.error('Error deleting event:', err);
                        setFeedbackMessage({
                          type: 'error',
                          text: t(
                            'admin.events.deleteError',
                            "Erreur lors de la suppression de l'événement."
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
    </div>
  );
};

export default EventsManagement;
