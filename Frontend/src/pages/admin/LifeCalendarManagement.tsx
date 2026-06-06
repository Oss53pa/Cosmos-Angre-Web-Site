import React, { useMemo, useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Star,
  StarOff,
  Eye,
  EyeOff,
  Search,
  CalendarDays,
  X,
  Save,
} from 'lucide-react';
import {
  useLifeCalendar,
  type LifeCalendarCategory,
  type LifeCalendarEvent,
  type LifeCalendarEventInsert,
} from '../../hooks/useLifeCalendar';
import { toast } from '../../lib/ui/toast';

// Couleurs alignées avec celles du composant public LifeCalendarSection
// (tokens cosmos theme-reactive : commercial / accent / bronze / gold)
const CATEGORY_OPTIONS: { value: LifeCalendarCategory; label: string; color: string }[] = [
  { value: 'commercial', label: 'Commercial', color: 'bg-cosmos-night' },
  { value: 'famille', label: 'Famille', color: 'bg-cosmos-accent' },
  { value: 'communautaire', label: 'Communautaire', color: 'bg-cosmos-bronze' },
  { value: 'partenaires', label: 'Partenaires', color: 'bg-cosmos-gold' },
];

const ICON_SUGGESTIONS = [
  'Sparkles', 'Heart', 'ShoppingBag', 'PartyPopper', 'Calendar', 'Gift',
  'Star', 'Sun', 'Music', 'Camera', 'Trophy', 'Leaf',
];

interface FormState {
  title: string;
  description: string;
  category: LifeCalendarCategory;
  start_date: string;
  end_date: string;
  is_highlighted: boolean;
  highlight_label: string;
  highlight_icon: string;
  image: string;
  cta_url: string;
  display_order: number;
  is_published: boolean;
}

const emptyForm = (year: number): FormState => ({
  title: '',
  description: '',
  category: 'commercial',
  start_date: `${year}-01-01`,
  end_date: '',
  is_highlighted: false,
  highlight_label: '',
  highlight_icon: 'Sparkles',
  image: '',
  cta_url: '',
  display_order: 0,
  is_published: true,
});

const LifeCalendarManagement: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<LifeCalendarCategory | 'all'>('all');
  const [showHighlightedOnly, setShowHighlightedOnly] = useState(false);

  const [editing, setEditing] = useState<LifeCalendarEvent | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm(year));
  const [saving, setSaving] = useState(false);

  const { events, isLoading, createEvent, updateEvent, deleteEvent } = useLifeCalendar({
    year,
    includeUnpublished: true,
  });

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (categoryFilter !== 'all' && e.category !== categoryFilter) return false;
      if (showHighlightedOnly && !e.is_highlighted) return false;
      if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [events, categoryFilter, showHighlightedOnly, search]);

  const openCreate = () => {
    setForm(emptyForm(year));
    setEditing(null);
    setIsCreating(true);
  };

  const openEdit = (event: LifeCalendarEvent) => {
    setForm({
      title: event.title,
      description: event.description ?? '',
      category: event.category,
      start_date: event.start_date,
      end_date: event.end_date ?? '',
      is_highlighted: event.is_highlighted,
      highlight_label: event.highlight_label ?? '',
      highlight_icon: event.highlight_icon ?? 'Sparkles',
      image: event.image ?? '',
      cta_url: event.cta_url ?? '',
      display_order: event.display_order,
      is_published: event.is_published,
    });
    setEditing(event);
    setIsCreating(true);
  };

  const closeModal = () => {
    setIsCreating(false);
    setEditing(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: LifeCalendarEventInsert = {
      year,
      title: form.title.trim(),
      description: form.description.trim() || null,
      category: form.category,
      start_date: form.start_date,
      end_date: form.end_date || null,
      is_highlighted: form.is_highlighted,
      highlight_label: form.is_highlighted ? form.highlight_label.trim() || null : null,
      highlight_icon: form.is_highlighted ? form.highlight_icon || null : null,
      highlight_color: null,
      image: form.image.trim() || null,
      cta_url: form.cta_url.trim() || null,
      display_order: form.display_order,
      is_published: form.is_published,
    };

    const result = editing
      ? await updateEvent(editing.id, payload)
      : await createEvent(payload);

    setSaving(false);
    if (result.error) {
      toast.error(editing ? 'Échec de la modification' : "Échec de l'ajout", result.error);
    } else {
      toast.success(editing ? 'Événement modifié' : 'Événement ajouté');
      closeModal();
    }
  };

  const handleDelete = async (event: LifeCalendarEvent) => {
    if (!window.confirm(`Supprimer "${event.title}" ?`)) return;
    const { error } = await deleteEvent(event.id);
    if (error) toast.error('Échec suppression', error);
    else toast.success('Événement supprimé');
  };

  const toggleHighlight = async (event: LifeCalendarEvent) => {
    const { error } = await updateEvent(event.id, { is_highlighted: !event.is_highlighted });
    if (error) toast.error('Échec mise à jour', error);
  };

  const togglePublished = async (event: LifeCalendarEvent) => {
    const { error } = await updateEvent(event.id, { is_published: !event.is_published });
    if (error) toast.error('Échec mise à jour', error);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-white mb-2 tracking-tight flex items-center gap-3">
            <CalendarDays className="w-7 h-7 text-cosmos-gold" strokeWidth={1.5} />
            Calendrier de la vie
          </h1>
          <p className="text-text-secondary font-light text-sm">
            Gérez les événements annuels du centre, par catégorie et par trimestre.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 bg-cosmos-gold text-cosmos-night font-medium hover:bg-cosmos-gold/90 transition-colors rounded"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          Nouvel événement
        </button>
      </header>

      {/* Filters */}
      <div className="bg-cosmos-night border border-white/5 p-4 rounded">
        <div className="flex flex-wrap items-center gap-3">
          {/* Year */}
          <div className="flex items-center gap-1 p-1 bg-white/5 rounded">
            {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  year === y
                    ? 'bg-cosmos-gold text-cosmos-night'
                    : 'text-cosmos-cream/60 hover:text-cosmos-cream'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cosmos-cream/30"
              strokeWidth={1.5}
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un événement..."
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 text-cosmos-cream text-sm placeholder-cosmos-cream/40 rounded focus:outline-none focus:border-cosmos-gold/40"
            />
          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as LifeCalendarCategory | 'all')}
            className="px-3 py-2 bg-white/5 border border-white/10 text-cosmos-cream text-sm rounded focus:outline-none focus:border-cosmos-gold/40"
          >
            <option value="all">Toutes catégories</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Highlighted toggle */}
          <button
            type="button"
            onClick={() => setShowHighlightedOnly((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 text-xs rounded transition-colors ${
              showHighlightedOnly
                ? 'bg-cosmos-gold text-cosmos-night'
                : 'bg-white/5 text-cosmos-cream/70 hover:text-cosmos-cream'
            }`}
          >
            <Star className="w-3.5 h-3.5" strokeWidth={2} />
            Highlights
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-cosmos-night border border-white/5 p-4 rounded">
          <div className="text-2xl font-light text-white">{events.length}</div>
          <div className="text-xs text-text-secondary mt-1">Total {year}</div>
        </div>
        {CATEGORY_OPTIONS.map((c) => (
          <div key={c.value} className="bg-cosmos-night border border-white/5 p-4 rounded">
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${c.color}`} />
              <span className="text-2xl font-light text-white">
                {events.filter((e) => e.category === c.value).length}
              </span>
            </div>
            <div className="text-xs text-text-secondary">{c.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-cosmos-night border border-white/5 rounded overflow-hidden">
        {isLoading && events.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block w-6 h-6 border-2 border-cosmos-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-cosmos-cream/40 text-sm">
            Aucun événement trouvé.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-cosmos-cream/50">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Titre</th>
                <th className="px-4 py-3 font-medium">Catégorie</th>
                <th className="px-4 py-3 font-medium text-center">Highlight</th>
                <th className="px-4 py-3 font-medium text-center">Publié</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((event) => {
                const cat = CATEGORY_OPTIONS.find((c) => c.value === event.category);
                return (
                  <tr
                    key={event.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 text-cosmos-cream/80 font-mono text-xs">
                      {event.start_date}
                      {event.end_date && (
                        <span className="text-cosmos-cream/40"> → {event.end_date}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-cosmos-cream font-medium">{event.title}</div>
                      {event.description && (
                        <div className="text-cosmos-cream/40 text-xs mt-0.5 line-clamp-1">
                          {event.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-2 px-2.5 py-1 rounded text-xs ${cat?.color} text-white`}
                      >
                        {cat?.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleHighlight(event)}
                        title={event.is_highlighted ? 'Retirer du highlight' : 'Mettre en avant'}
                        className={`p-1.5 rounded transition-colors ${
                          event.is_highlighted
                            ? 'text-cosmos-gold hover:bg-cosmos-gold/10'
                            : 'text-cosmos-cream/30 hover:text-cosmos-cream/60'
                        }`}
                      >
                        {event.is_highlighted ? (
                          <Star className="w-4 h-4 fill-current" strokeWidth={1.5} />
                        ) : (
                          <StarOff className="w-4 h-4" strokeWidth={1.5} />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => togglePublished(event)}
                        title={event.is_published ? 'Dépublier' : 'Publier'}
                        className={`p-1.5 rounded transition-colors ${
                          event.is_published
                            ? 'text-emerald-400 hover:bg-emerald-400/10'
                            : 'text-cosmos-cream/30 hover:text-cosmos-cream/60'
                        }`}
                      >
                        {event.is_published ? (
                          <Eye className="w-4 h-4" strokeWidth={1.5} />
                        ) : (
                          <EyeOff className="w-4 h-4" strokeWidth={1.5} />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(event)}
                          className="p-1.5 text-cosmos-cream/60 hover:text-cosmos-gold hover:bg-white/5 rounded transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(event)}
                          className="p-1.5 text-cosmos-cream/60 hover:text-red-400 hover:bg-white/5 rounded transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* === Edit Modal === */}
      {isCreating && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-cosmos-night/80 backdrop-blur-sm overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={editing ? 'Modifier événement' : 'Nouvel événement'}
        >
          <div className="bg-cosmos-night border border-cosmos-gold/30 rounded-lg w-full max-w-2xl my-8 shadow-2xl">
            <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-lg font-medium text-cosmos-cream">
                {editing ? `Modifier — ${editing.title}` : 'Nouvel événement'}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 text-cosmos-cream/60 hover:text-cosmos-cream rounded"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </header>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label
                  htmlFor="lc-title"
                  className="block text-xs uppercase tracking-wider text-cosmos-cream/60 mb-2"
                >
                  Titre *
                </label>
                <input
                  id="lc-title"
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 text-cosmos-cream rounded focus:outline-none focus:border-cosmos-gold/40"
                  maxLength={120}
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="lc-desc"
                  className="block text-xs uppercase tracking-wider text-cosmos-cream/60 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="lc-desc"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 text-cosmos-cream rounded focus:outline-none focus:border-cosmos-gold/40 resize-none"
                  maxLength={500}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-cosmos-cream/60 mb-2">
                  Catégorie *
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORY_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setForm({ ...form, category: c.value })}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-colors ${
                        form.category === c.value
                          ? `${c.color} text-white`
                          : 'bg-white/5 text-cosmos-cream/60 hover:text-cosmos-cream'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full bg-white/80`} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="lc-start"
                    className="block text-xs uppercase tracking-wider text-cosmos-cream/60 mb-2"
                  >
                    Début *
                  </label>
                  <input
                    id="lc-start"
                    type="date"
                    required
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 text-cosmos-cream rounded focus:outline-none focus:border-cosmos-gold/40"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lc-end"
                    className="block text-xs uppercase tracking-wider text-cosmos-cream/60 mb-2"
                  >
                    Fin (optionnel)
                  </label>
                  <input
                    id="lc-end"
                    type="date"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 text-cosmos-cream rounded focus:outline-none focus:border-cosmos-gold/40"
                  />
                </div>
              </div>

              {/* Order + published */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="lc-order"
                    className="block text-xs uppercase tracking-wider text-cosmos-cream/60 mb-2"
                  >
                    Ordre d'affichage
                  </label>
                  <input
                    id="lc-order"
                    type="number"
                    value={form.display_order}
                    onChange={(e) =>
                      setForm({ ...form, display_order: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 text-cosmos-cream rounded focus:outline-none focus:border-cosmos-gold/40"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm text-cosmos-cream/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.is_published}
                      onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    Publié (visible côté public)
                  </label>
                </div>
              </div>

              {/* Highlight section */}
              <div className="border-t border-white/10 pt-5">
                <label className="flex items-center gap-2 text-sm text-cosmos-cream cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={form.is_highlighted}
                    onChange={(e) => setForm({ ...form, is_highlighted: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <Star className="w-4 h-4 text-cosmos-gold" strokeWidth={1.5} />
                  Mettre en avant (carte highlight en haut du calendrier)
                </label>

                {form.is_highlighted && (
                  <div className="grid grid-cols-2 gap-4 pl-6">
                    <div>
                      <label
                        htmlFor="lc-hl-label"
                        className="block text-xs uppercase tracking-wider text-cosmos-cream/60 mb-2"
                      >
                        Label
                      </label>
                      <input
                        id="lc-hl-label"
                        type="text"
                        value={form.highlight_label}
                        onChange={(e) => setForm({ ...form, highlight_label: e.target.value })}
                        placeholder="ex: INCONTOURNABLE"
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 text-cosmos-cream rounded focus:outline-none focus:border-cosmos-gold/40"
                        maxLength={30}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lc-hl-icon"
                        className="block text-xs uppercase tracking-wider text-cosmos-cream/60 mb-2"
                      >
                        Icône (lucide)
                      </label>
                      <select
                        id="lc-hl-icon"
                        value={form.highlight_icon}
                        onChange={(e) => setForm({ ...form, highlight_icon: e.target.value })}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 text-cosmos-cream rounded focus:outline-none focus:border-cosmos-gold/40"
                      >
                        {ICON_SUGGESTIONS.map((i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2 text-sm text-cosmos-cream/70 hover:text-cosmos-cream transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving || !form.title.trim()}
                  className="flex items-center gap-2 px-5 py-2 bg-cosmos-gold text-cosmos-night text-sm font-medium hover:bg-cosmos-gold/90 transition-colors rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-cosmos-night border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" strokeWidth={2} />
                      {editing ? 'Modifier' : 'Créer'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LifeCalendarManagement;
