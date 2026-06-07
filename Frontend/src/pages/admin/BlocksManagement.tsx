import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Save,
  Trash2,
  Check,
  AlertCircle,
  Loader2,
  Layers,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Block {
  id: string;
  page_path: string;
  type: 'heading' | 'paragraph' | 'image' | 'cta' | 'html';
  title: string | null;
  body: string | null;
  image_url: string | null;
  link_url: string | null;
  link_label: string | null;
  align: 'left' | 'center';
  variant: 'light' | 'dark';
  sort: number;
  is_visible: boolean;
}

interface PageOpt {
  label: string;
  path: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const db = supabase as unknown as { from: (t: string) => any };

const TYPES: { value: Block['type']; label: string }[] = [
  { value: 'heading', label: 'Titre' },
  { value: 'paragraph', label: 'Paragraphe' },
  { value: 'image', label: 'Image' },
  { value: 'cta', label: 'Bouton (CTA)' },
  { value: 'html', label: 'HTML libre' },
];

const newBlock = (page_path: string, sort: number): Block => ({
  id: '',
  page_path,
  type: 'paragraph',
  title: '',
  body: '',
  image_url: '',
  link_url: '',
  link_label: '',
  align: 'left',
  variant: 'light',
  sort,
  is_visible: true,
});

const BlocksManagement: React.FC = () => {
  const [pages, setPages] = useState<PageOpt[]>([{ label: "Accueil", path: '/' }]);
  const [path, setPath] = useState('/');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(false);
  const [editor, setEditor] = useState<Block | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  const showToast = (ok: boolean, msg: string) => {
    setToast({ ok, msg });
    window.setTimeout(() => setToast(null), 3500);
  };

  // Liste des pages (depuis site_pages) + Accueil
  const loadPages = useCallback(async () => {
    try {
      const { data } = await db
        .from('site_pages')
        .select('label,path')
        .order('sort', { ascending: true });
      const opts: PageOpt[] = [{ label: 'Accueil', path: '/' }];
      if (data) for (const r of data as PageOpt[]) opts.push({ label: r.label, path: r.path });
      setPages(opts);
    } catch {
      /* ignore */
    }
  }, []);

  const loadBlocks = useCallback(async (p: string) => {
    setLoading(true);
    try {
      const { data } = await db
        .from('page_blocks')
        .select('*')
        .eq('page_path', p)
        .order('sort', { ascending: true });
      setBlocks((data as Block[]) || []);
    } catch {
      setBlocks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPages();
  }, [loadPages]);
  useEffect(() => {
    void loadBlocks(path);
  }, [path, loadBlocks]);

  const openNew = () => {
    setEditor(newBlock(path, (blocks[blocks.length - 1]?.sort ?? 0) + 10));
    setIsNew(true);
  };
  const openEdit = (b: Block) => {
    setEditor({ ...b });
    setIsNew(false);
  };

  const saveEditor = async () => {
    if (!editor) return;
    setSaving(true);
    try {
      const payload = {
        page_path: path,
        type: editor.type,
        title: editor.title || null,
        body: editor.body || null,
        image_url: editor.image_url || null,
        link_url: editor.link_url || null,
        link_label: editor.link_label || null,
        align: editor.align,
        variant: editor.variant,
        sort: editor.sort,
        is_visible: editor.is_visible,
      };
      const { error } = isNew
        ? await db.from('page_blocks').insert([payload])
        : await db.from('page_blocks').update(payload).eq('id', editor.id);
      if (error) showToast(false, "Échec de l'enregistrement.");
      else {
        showToast(true, 'Bloc enregistré.');
        setEditor(null);
        await loadBlocks(path);
      }
    } catch {
      showToast(false, "Échec de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const removeBlock = async (b: Block) => {
    if (!window.confirm('Supprimer ce bloc ?')) return;
    try {
      const { error } = await db.from('page_blocks').delete().eq('id', b.id);
      if (error) showToast(false, 'Échec de la suppression.');
      else {
        setBlocks((prev) => prev.filter((x) => x.id !== b.id));
        showToast(true, 'Bloc supprimé.');
      }
    } catch {
      showToast(false, 'Échec de la suppression.');
    }
  };

  const toggleVisible = async (b: Block) => {
    const next = !b.is_visible;
    setBlocks((prev) => prev.map((x) => (x.id === b.id ? { ...x, is_visible: next } : x)));
    try {
      await db.from('page_blocks').update({ is_visible: next }).eq('id', b.id);
    } catch {
      /* ignore */
    }
  };

  // Réordonnancement : échange les valeurs sort avec le voisin
  const move = async (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= blocks.length) return;
    const a = blocks[index];
    const b = blocks[j];
    const arr = [...blocks];
    arr[index] = { ...b, sort: a.sort };
    arr[j] = { ...a, sort: b.sort };
    arr.sort((x, y) => x.sort - y.sort);
    setBlocks(arr);
    try {
      await db.from('page_blocks').update({ sort: b.sort }).eq('id', a.id);
      await db.from('page_blocks').update({ sort: a.sort }).eq('id', b.id);
    } catch {
      /* ignore */
    }
  };

  const inputCls =
    'w-full px-4 py-2.5 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-sm';

  return (
    <div className="space-y-6">
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

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-light text-cosmos-night mb-2 tracking-tight">Blocs de page</h1>
          <p className="text-text-secondary font-light">
            Ajoutez, modifiez ou supprimez des blocs de contenu affichés sur une page du site.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-6 py-2.5 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          Nouveau bloc
        </button>
      </div>

      {/* Sélecteur de page */}
      <div className="bg-white border border-cosmos-cream p-6">
        <label className="block text-sm text-text-secondary font-light mb-2">Page</label>
        <select
          value={path}
          onChange={(e) => setPath(e.target.value)}
          className="w-full md:w-96 px-4 py-2.5 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
        >
          {pages.map((p) => (
            <option key={p.path} value={p.path}>
              {p.label} — {p.path}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des blocs */}
      <div className="bg-white border border-cosmos-cream">
        <div className="px-6 py-4 border-b border-cosmos-cream flex items-center gap-2">
          <Layers className="w-5 h-5 text-cosmos-gold" strokeWidth={1.5} />
          <h2 className="text-lg font-light text-cosmos-night">
            Blocs de « {pages.find((p) => p.path === path)?.label || path} »
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-text-secondary">
            <Loader2 className="w-6 h-6 animate-spin mr-3" /> Chargement…
          </div>
        ) : blocks.length === 0 ? (
          <p className="px-6 py-12 text-center text-text-secondary font-light text-sm">
            Aucun bloc sur cette page. Cliquez sur « Nouveau bloc » pour en ajouter un.
          </p>
        ) : (
          <div className="divide-y divide-cosmos-cream">
            {blocks.map((b, i) => (
              <div key={b.id} className="px-6 py-4 flex items-center gap-4">
                <div className="flex flex-col">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="text-text-secondary hover:text-cosmos-night disabled:opacity-30"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === blocks.length - 1}
                    className="text-text-secondary hover:text-cosmos-night disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[10px] uppercase tracking-wide bg-cosmos-cream px-2 py-1 rounded text-text-secondary w-24 text-center">
                  {TYPES.find((tt) => tt.value === b.type)?.label || b.type}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-cosmos-night truncate">
                    {b.title || b.body || b.link_label || b.image_url || '(bloc)'}
                  </div>
                  <div className="text-[11px] text-text-secondary font-light">
                    {b.variant === 'dark' ? 'Fond foncé' : 'Fond clair'} ·{' '}
                    {b.align === 'center' ? 'Centré' : 'Aligné à gauche'}
                  </div>
                </div>
                <button
                  onClick={() => toggleVisible(b)}
                  className={`p-1.5 rounded ${b.is_visible ? 'text-emerald-600' : 'text-text-secondary'}`}
                  title={b.is_visible ? 'Visible' : 'Masqué'}
                >
                  {b.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => openEdit(b)}
                  className="px-3 py-1.5 border border-cosmos-cream hover:border-gray-900 text-cosmos-night text-xs font-light transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => removeBlock(b)}
                  className="p-1.5 border border-cosmos-cream hover:border-red-600 hover:bg-red-50 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Éditeur */}
      {editor && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setEditor(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-cosmos-cream flex items-center justify-between sticky top-0 bg-white">
                <h2 className="text-xl font-light text-cosmos-night">
                  {isNew ? 'Nouveau bloc' : 'Modifier le bloc'}
                </h2>
                <button onClick={() => setEditor(null)} className="text-text-secondary hover:text-cosmos-night">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-text-secondary font-light mb-1.5">Type</label>
                    <select
                      value={editor.type}
                      onChange={(e) => setEditor((p) => (p ? { ...p, type: e.target.value as Block['type'] } : p))}
                      className={inputCls}
                    >
                      {TYPES.map((tt) => (
                        <option key={tt.value} value={tt.value}>
                          {tt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm text-text-secondary font-light mb-1.5">Fond</label>
                      <select
                        value={editor.variant}
                        onChange={(e) => setEditor((p) => (p ? { ...p, variant: e.target.value as 'light' | 'dark' } : p))}
                        className={inputCls}
                      >
                        <option value="light">Clair</option>
                        <option value="dark">Foncé</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary font-light mb-1.5">Align.</label>
                      <select
                        value={editor.align}
                        onChange={(e) => setEditor((p) => (p ? { ...p, align: e.target.value as 'left' | 'center' } : p))}
                        className={inputCls}
                      >
                        <option value="left">Gauche</option>
                        <option value="center">Centré</option>
                      </select>
                    </div>
                  </div>
                </div>

                {editor.type !== 'image' && (
                  <div>
                    <label className="block text-sm text-text-secondary font-light mb-1.5">Titre (optionnel)</label>
                    <input
                      type="text"
                      value={editor.title || ''}
                      onChange={(e) => setEditor((p) => (p ? { ...p, title: e.target.value } : p))}
                      className={inputCls}
                    />
                  </div>
                )}

                {(editor.type === 'paragraph' || editor.type === 'heading' || editor.type === 'html') && (
                  <div>
                    <label className="block text-sm text-text-secondary font-light mb-1.5">
                      {editor.type === 'html' ? 'Contenu HTML' : 'Texte'}
                    </label>
                    <textarea
                      value={editor.body || ''}
                      onChange={(e) => setEditor((p) => (p ? { ...p, body: e.target.value } : p))}
                      rows={6}
                      className={`${inputCls} resize-y ${editor.type === 'html' ? 'font-mono' : ''}`}
                    />
                  </div>
                )}

                {editor.type === 'image' && (
                  <div>
                    <label className="block text-sm text-text-secondary font-light mb-1.5">URL de l'image</label>
                    <input
                      type="text"
                      value={editor.image_url || ''}
                      onChange={(e) => setEditor((p) => (p ? { ...p, image_url: e.target.value } : p))}
                      placeholder="https://…"
                      className={inputCls}
                    />
                  </div>
                )}

                {editor.type === 'cta' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-text-secondary font-light mb-1.5">Texte du bouton</label>
                      <input
                        type="text"
                        value={editor.link_label || ''}
                        onChange={(e) => setEditor((p) => (p ? { ...p, link_label: e.target.value } : p))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary font-light mb-1.5">Lien</label>
                      <input
                        type="text"
                        value={editor.link_url || ''}
                        onChange={(e) => setEditor((p) => (p ? { ...p, link_url: e.target.value } : p))}
                        placeholder="/contact ou https://…"
                        className={inputCls}
                      />
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-2 text-sm text-cosmos-night font-light">
                  <input
                    type="checkbox"
                    checked={editor.is_visible}
                    onChange={(e) => setEditor((p) => (p ? { ...p, is_visible: e.target.checked } : p))}
                  />
                  Bloc visible
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
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light text-sm hover:bg-opacity-90 transition-colors disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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

export default BlocksManagement;
