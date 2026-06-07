import React, { useState, useEffect, useCallback } from 'react';
import {
  Eye,
  EyeOff,
  Plus,
  Save,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  FileText,
  ExternalLink,
  Layout,
  X,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

// ---------------------------------------------------------------------------
interface SitePageRow {
  key: string;
  label: string;
  path: string;
  nav_group: string;
  is_visible: boolean;
  is_custom: boolean;
  body: string | null;
  seo_description: string | null;
  sort: number;
}

type AnyTable = {
  select: (c: string) => {
    order: (col: string, o: { ascending: boolean }) => Promise<{ data: SitePageRow[] | null; error: unknown }>;
  };
  upsert: (v: SitePageRow[], o: { onConflict: string }) => Promise<{ error: unknown }>;
  update: (v: Partial<SitePageRow>) => { eq: (c: string, v: string) => Promise<{ error: unknown }> };
  delete: () => { eq: (c: string, v: string) => Promise<{ error: unknown }> };
};
const db = supabase as unknown as { from: (t: string) => AnyTable };

const NAV_GROUPS: { value: string; label: string }[] = [
  { value: 'primary', label: 'Menu principal' },
  { value: 'secondary', label: 'Menu secondaire' },
  { value: 'none', label: 'Hors menu' },
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const emptyDraft = (): SitePageRow => ({
  key: '',
  label: '',
  path: '',
  nav_group: 'secondary',
  is_visible: true,
  is_custom: true,
  body: '',
  seo_description: '',
  sort: 100,
});

// ---------------------------------------------------------------------------
const PagesManagement: React.FC = () => {
  const [rows, setRows] = useState<SitePageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);
  const [editor, setEditor] = useState<SitePageRow | null>(null);
  const [isNew, setIsNew] = useState(false);

  const showToast = (ok: boolean, msg: string) => {
    setToast({ ok, msg });
    window.setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await db
        .from('site_pages')
        .select('key,label,path,nav_group,is_visible,is_custom,body,seo_description,sort')
        .order('sort', { ascending: true });
      if (!error && data) setRows(data);
    } catch {
      // silencieux
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  // Bascule de visibilité (optimiste)
  const toggleVisible = async (row: SitePageRow) => {
    const next = !row.is_visible;
    setRows((prev) => prev.map((r) => (r.key === row.key ? { ...r, is_visible: next } : r)));
    setSavingKey(row.key);
    try {
      const { error } = await db.from('site_pages').update({ is_visible: next }).eq('key', row.key);
      if (error) {
        setRows((prev) => prev.map((r) => (r.key === row.key ? { ...r, is_visible: !next } : r)));
        showToast(false, 'Échec de la mise à jour.');
      } else {
        showToast(true, next ? 'Page affichée.' : 'Page masquée.');
      }
    } finally {
      setSavingKey(null);
    }
  };

  const updateNavGroup = async (row: SitePageRow, nav_group: string) => {
    setRows((prev) => prev.map((r) => (r.key === row.key ? { ...r, nav_group } : r)));
    try {
      await db.from('site_pages').update({ nav_group }).eq('key', row.key);
      showToast(true, 'Emplacement mis à jour.');
    } catch {
      showToast(false, 'Échec de la mise à jour.');
    }
  };

  const openNew = () => {
    setEditor(emptyDraft());
    setIsNew(true);
  };

  const openEdit = (row: SitePageRow) => {
    setEditor({ ...row });
    setIsNew(false);
  };

  const saveEditor = async () => {
    if (!editor) return;
    const draft: SitePageRow = { ...editor };
    if (isNew) {
      const key = slugify(draft.key || draft.label);
      draft.key = key;
      draft.path = draft.path?.startsWith('/') ? draft.path : `/${slugify(draft.path || draft.label)}`;
      if (!key || !draft.label.trim()) {
        showToast(false, 'Nom et identifiant requis.');
        return;
      }
      if (rows.some((r) => r.key === key)) {
        showToast(false, 'Cet identifiant existe déjà.');
        return;
      }
    }
    setSavingKey(draft.key);
    try {
      const { error } = await db
        .from('site_pages')
        .upsert([{ ...draft, body: draft.body ?? '', seo_description: draft.seo_description ?? '' }], {
          onConflict: 'key',
        });
      if (error) {
        showToast(false, "Échec de l'enregistrement.");
      } else {
        showToast(true, 'Page enregistrée.');
        setEditor(null);
        await load();
      }
    } catch {
      showToast(false, "Échec de l'enregistrement.");
    } finally {
      setSavingKey(null);
    }
  };

  const deletePage = async (row: SitePageRow) => {
    if (!row.is_custom) return;
    if (!window.confirm(`Supprimer définitivement la page « ${row.label} » ?`)) return;
    setSavingKey(row.key);
    try {
      const { error } = await db.from('site_pages').delete().eq('key', row.key);
      if (error) showToast(false, 'Échec de la suppression.');
      else {
        setRows((prev) => prev.filter((r) => r.key !== row.key));
        showToast(true, 'Page supprimée.');
      }
    } finally {
      setSavingKey(null);
    }
  };

  const builtIn = rows.filter((r) => !r.is_custom);
  const custom = rows.filter((r) => r.is_custom);

  const inputCls =
    'w-full px-4 py-2.5 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-sm';

  return (
    <div className="space-y-8">
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[60] px-5 py-3 rounded shadow-lg flex items-center gap-2 text-sm font-inter ${
            toast.ok ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.ok ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-cosmos-night mb-2 tracking-tight">
            Pages du site
          </h1>
          <p className="text-text-secondary font-light">
            Affichez ou masquez les pages, gérez leur place dans le menu, et créez de nouvelles pages.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-6 py-2.5 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Nouvelle page
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-text-secondary">
          <Loader2 className="w-6 h-6 animate-spin mr-3" />
          Chargement…
        </div>
      ) : (
        <>
          {/* Pages du site (built-in) */}
          <div className="bg-white border border-cosmos-cream">
            <div className="px-6 py-4 border-b border-cosmos-cream flex items-center gap-2">
              <Layout className="w-5 h-5 text-cosmos-gold" strokeWidth={1.5} />
              <h2 className="text-lg font-light text-cosmos-night">Pages standard</h2>
            </div>
            <div className="divide-y divide-cosmos-cream">
              {builtIn.map((row) => (
                <PageRow
                  key={row.key}
                  row={row}
                  saving={savingKey === row.key}
                  onToggle={() => toggleVisible(row)}
                  onNavGroup={(g) => updateNavGroup(row, g)}
                  inputCls={inputCls}
                />
              ))}
            </div>
          </div>

          {/* Pages personnalisées */}
          <div className="bg-white border border-cosmos-cream">
            <div className="px-6 py-4 border-b border-cosmos-cream flex items-center gap-2">
              <FileText className="w-5 h-5 text-cosmos-gold" strokeWidth={1.5} />
              <h2 className="text-lg font-light text-cosmos-night">Pages personnalisées</h2>
            </div>
            {custom.length === 0 ? (
              <p className="px-6 py-10 text-center text-text-secondary font-light text-sm">
                Aucune page personnalisée. Cliquez sur « Nouvelle page » pour en créer une.
              </p>
            ) : (
              <div className="divide-y divide-cosmos-cream">
                {custom.map((row) => (
                  <PageRow
                    key={row.key}
                    row={row}
                    saving={savingKey === row.key}
                    onToggle={() => toggleVisible(row)}
                    onNavGroup={(g) => updateNavGroup(row, g)}
                    onEdit={() => openEdit(row)}
                    onDelete={() => deletePage(row)}
                    inputCls={inputCls}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Éditeur (modal) */}
      {editor && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setEditor(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-cosmos-cream flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-xl font-light text-cosmos-night">
                  {isNew ? 'Nouvelle page' : `Modifier — ${editor.label}`}
                </h2>
                <button onClick={() => setEditor(null)} className="text-text-secondary hover:text-cosmos-night">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm text-text-secondary font-light mb-1.5">Nom de la page</label>
                  <input
                    type="text"
                    value={editor.label}
                    onChange={(e) =>
                      setEditor((p) =>
                        p
                          ? {
                              ...p,
                              label: e.target.value,
                              ...(isNew
                                ? { key: slugify(e.target.value), path: `/${slugify(e.target.value)}` }
                                : {}),
                            }
                          : p
                      )
                    }
                    className={inputCls}
                    placeholder="Ex : Galerie photos"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary font-light mb-1.5">
                      URL (chemin)
                    </label>
                    <input
                      type="text"
                      value={editor.path}
                      onChange={(e) => setEditor((p) => (p ? { ...p, path: e.target.value } : p))}
                      disabled={!isNew}
                      className={`${inputCls} ${!isNew ? 'bg-cosmos-cream/30 text-text-secondary' : ''} font-mono`}
                      placeholder="/galerie"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-text-secondary font-light mb-1.5">
                      Emplacement menu
                    </label>
                    <select
                      value={editor.nav_group}
                      onChange={(e) => setEditor((p) => (p ? { ...p, nav_group: e.target.value } : p))}
                      className={inputCls}
                    >
                      {NAV_GROUPS.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-text-secondary font-light mb-1.5">
                    Description SEO
                  </label>
                  <input
                    type="text"
                    value={editor.seo_description || ''}
                    onChange={(e) =>
                      setEditor((p) => (p ? { ...p, seo_description: e.target.value } : p))
                    }
                    className={inputCls}
                    placeholder="Courte description pour les moteurs de recherche"
                  />
                </div>
                <div>
                  <label className="block text-sm text-text-secondary font-light mb-1.5">
                    Contenu (HTML)
                  </label>
                  <textarea
                    value={editor.body || ''}
                    onChange={(e) => setEditor((p) => (p ? { ...p, body: e.target.value } : p))}
                    rows={10}
                    className={`${inputCls} font-mono resize-y`}
                    placeholder="<h2>Mon titre</h2>\n<p>Mon paragraphe…</p>"
                  />
                  <p className="text-[11px] text-text-secondary font-light mt-1">
                    Balises HTML simples acceptées (h2, h3, p, ul/li, a, strong, img…).
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm text-cosmos-night font-light">
                  <input
                    type="checkbox"
                    checked={editor.is_visible}
                    onChange={(e) => setEditor((p) => (p ? { ...p, is_visible: e.target.checked } : p))}
                  />
                  Page visible sur le site
                </label>
              </div>
              <div className="px-6 py-4 border-t border-cosmos-cream flex justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  onClick={() => setEditor(null)}
                  className="px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light text-sm transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={saveEditor}
                  disabled={savingKey === editor.key}
                  className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light text-sm hover:bg-opacity-90 transition-colors disabled:opacity-60"
                >
                  {savingKey === editor.key ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
const PageRow: React.FC<{
  row: SitePageRow;
  saving: boolean;
  onToggle: () => void;
  onNavGroup: (g: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  inputCls: string;
}> = ({ row, saving, onToggle, onNavGroup, onEdit, onDelete }) => (
  <div className="px-6 py-4 flex flex-wrap items-center gap-4">
    <div className="flex-1 min-w-[180px]">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-cosmos-night">{row.label}</span>
        {!row.is_visible && (
          <span className="text-[10px] uppercase tracking-wide bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">
            Masquée
          </span>
        )}
      </div>
      <a
        href={row.path}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-text-secondary font-mono hover:text-cosmos-gold transition-colors"
      >
        {row.path}
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>

    <select
      value={row.nav_group}
      onChange={(e) => onNavGroup(e.target.value)}
      className="px-3 py-1.5 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-xs"
    >
      {NAV_GROUPS.map((g) => (
        <option key={g.value} value={g.value}>
          {g.label}
        </option>
      ))}
    </select>

    {/* Toggle visibilité */}
    <button
      onClick={onToggle}
      disabled={saving}
      className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-inter transition-colors disabled:opacity-50 ${
        row.is_visible
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
          : 'bg-cosmos-cream text-text-secondary border border-cosmos-cream hover:border-gray-400'
      }`}
      title={row.is_visible ? 'Masquer la page' : 'Afficher la page'}
    >
      {saving ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : row.is_visible ? (
        <Eye className="w-3.5 h-3.5" />
      ) : (
        <EyeOff className="w-3.5 h-3.5" />
      )}
      {row.is_visible ? 'Visible' : 'Masquée'}
    </button>

    {onEdit && (
      <button
        onClick={onEdit}
        className="px-3 py-1.5 border border-cosmos-cream hover:border-gray-900 text-cosmos-night text-xs font-light transition-colors"
      >
        Modifier
      </button>
    )}
    {onDelete && (
      <button
        onClick={onDelete}
        className="p-1.5 border border-cosmos-cream hover:border-red-600 hover:bg-red-50 transition-colors"
        title="Supprimer"
      >
        <Trash2 className="w-4 h-4 text-red-600" />
      </button>
    )}
  </div>
);

export default PagesManagement;
