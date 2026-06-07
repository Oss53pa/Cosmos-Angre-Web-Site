import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Save,
  RefreshCw,
  Image as ImageIcon,
  Type,
  AlignLeft,
  Upload,
  Loader2,
  Eye,
  ExternalLink,
  Monitor,
  Smartphone,
  PanelRightOpen,
  PanelRightClose,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

/**
 * SiteContentManagement — édition de TOUT le contenu éditable du site, en
 * 3 colonnes : onglets (groupes) à gauche, champs du groupe au centre,
 * prévisualisation de la page concernée à droite.
 */

interface Row {
  key: string;
  value: string | null;
  type: string; // text | textarea | image | url
  group_label: string | null;
  label: string | null;
  sort: number;
}

const db = supabase as unknown as {
  from: (t: string) => {
    select: (c: string) => {
      order: (
        c: string
      ) => { order: (c: string) => Promise<{ data: Row[] | null; error: unknown }> };
    };
    upsert: (rows: Partial<Row>[]) => Promise<{ error: unknown }>;
  };
};

// Préfixe de clé (avant le 1er point) → URL publique pour l'aperçu.
const PREFIX_TO_PATH: Record<string, string> = {
  home: '/',
  about: '/a-propos',
  spaces: '/nos-espaces',
  stores: '/boutiques',
  gastronomy: '/gastronomie',
  loisirs: '/loisirs',
  leisure: '/loisirs',
  events: '/evenements',
  hotel: '/hotel',
  retailpark: '/retail-park',
  'retail-park': '/retail-park',
  visit: '/preparer-visite',
  fidelity: '/fidelite',
  services: '/services',
  blog: '/blog',
  contact: '/contact',
  practical: '/',
  footer: '/',
};

function previewPathFor(items: Row[]): string {
  for (const r of items) {
    const prefix = r.key.split('.')[0];
    if (PREFIX_TO_PATH[prefix]) return PREFIX_TO_PATH[prefix];
  }
  return '/';
}

const SiteContentManagement: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [dirty, setDirty] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [previewNonce, setPreviewNonce] = useState(0);

  const uploadImage = async (key: string, file: File) => {
    setUploading(key);
    try {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
      const safe = key.replace(/[^a-z0-9._-]/gi, '_');
      const path = `content/${safe}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from('site')
        .upload(path, file, { upsert: true, cacheControl: '3600' });
      if (error) {
        toast.error('Téléversement échoué');
        return;
      }
      const { data } = supabase.storage.from('site').getPublicUrl(path);
      setVal(key, data.publicUrl);
      toast.success('Image téléversée — pense à Enregistrer');
    } catch {
      toast.error('Téléversement échoué');
    } finally {
      setUploading(null);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await db
      .from('site_content')
      .select('*')
      .order('group_label')
      .order('sort');
    if (error) toast.error('Chargement du contenu impossible');
    else setRows(data ?? []);
    setDirty({});
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const grouped = useMemo(() => {
    const m: Record<string, Row[]> = {};
    for (const r of rows) {
      const g = r.group_label ?? 'Divers';
      (m[g] ??= []).push(r);
    }
    return m;
  }, [rows]);

  const groupNames = useMemo(() => Object.keys(grouped), [grouped]);

  // Sélectionne le 1er groupe par défaut
  useEffect(() => {
    if (!activeGroup && groupNames.length > 0) setActiveGroup(groupNames[0]);
    if (activeGroup && groupNames.length > 0 && !groupNames.includes(activeGroup)) {
      setActiveGroup(groupNames[0]);
    }
  }, [groupNames, activeGroup]);

  const valueOf = (r: Row) => (r.key in dirty ? dirty[r.key] : r.value ?? '');
  const setVal = (key: string, v: string) => setDirty((d) => ({ ...d, [key]: v }));
  const changedCount = Object.keys(dirty).length;

  const groupDirty = useCallback(
    (g: string) => (grouped[g] ?? []).some((r) => r.key in dirty),
    [grouped, dirty]
  );

  const save = async () => {
    if (!changedCount) {
      toast.info('Aucune modification à enregistrer');
      return;
    }
    setSaving(true);
    const payload = Object.entries(dirty).map(([key, value]) => {
      const r = rows.find((x) => x.key === key)!;
      return {
        key,
        value,
        type: r.type,
        group_label: r.group_label,
        label: r.label,
        sort: r.sort,
      };
    });
    const { error } = await db.from('site_content').upsert(payload);
    if (error) toast.error("Échec de l'enregistrement");
    else {
      toast.success(`${changedCount} élément(s) enregistré(s)`);
      await load();
      setPreviewNonce((n) => n + 1); // rafraîchit l'aperçu
    }
    setSaving(false);
  };

  const activeItems = activeGroup ? grouped[activeGroup] ?? [] : [];
  const previewPath = previewPathFor(activeItems);
  const previewUrl = `${previewPath}${previewPath.includes('?') ? '&' : '?'}_cms=${previewNonce}`;

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-cosmos-cream">
        <div>
          <h1 className="font-cormorant text-2xl md:text-3xl text-cosmos-night font-light">
            Contenu du site
          </h1>
          <p className="text-xs text-text-secondary font-inter font-light">
            Modifiez chaque texte et image des pages publiques.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview((s) => !s)}
            className={`hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-md border text-sm transition-colors ${
              showPreview
                ? 'border-cosmos-gold bg-cosmos-gold/10 text-cosmos-night'
                : 'border-cosmos-cream text-text-secondary hover:border-gray-400'
            }`}
            type="button"
          >
            {showPreview ? (
              <PanelRightClose className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <PanelRightOpen className="w-4 h-4" strokeWidth={1.5} />
            )}
            Aperçu
          </button>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-cosmos-cream text-sm text-text-secondary hover:border-gray-400"
            type="button"
          >
            <RefreshCw className="w-4 h-4" strokeWidth={1.5} /> Recharger
          </button>
          <button
            onClick={save}
            disabled={saving || !changedCount}
            className="btn-primary px-5 disabled:opacity-50"
            type="button"
          >
            <Save className="w-4 h-4" strokeWidth={1.5} />
            {saving ? 'Enregistrement…' : `Enregistrer${changedCount ? ` (${changedCount})` : ''}`}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-text-secondary">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Chargement…
        </div>
      ) : rows.length === 0 ? (
        <p className="text-sm text-text-secondary p-6">Aucun contenu éditable pour l'instant.</p>
      ) : (
        <div className="flex-1 min-h-0 flex gap-0 mt-4">
          {/* Sidebar onglets */}
          <aside className="w-48 lg:w-56 flex-shrink-0 overflow-y-auto pr-3 border-r border-cosmos-cream">
            <nav className="space-y-1">
              {groupNames.map((g) => {
                const active = g === activeGroup;
                return (
                  <button
                    key={g}
                    onClick={() => setActiveGroup(g)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-inter transition-colors flex items-center justify-between gap-2 ${
                      active
                        ? 'bg-cosmos-night text-cosmos-cream'
                        : 'text-cosmos-night/70 hover:bg-cosmos-cream'
                    }`}
                  >
                    <span className="truncate">{g}</span>
                    {groupDirty(g) && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cosmos-gold flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Éditeur du groupe */}
          <div className="flex-1 min-w-0 overflow-y-auto px-4">
            <h2 className="text-xs uppercase tracking-[0.2em] text-cosmos-gold font-medium mb-4">
              {activeGroup}
            </h2>
            <div className="space-y-4 pb-8">
              {activeItems.map((r) => (
                <div key={r.key} className="bg-white rounded-lg border border-cosmos-cream p-4">
                  <label className="flex items-center gap-2 text-xs text-text-secondary font-medium mb-2">
                    {r.type === 'image' ? (
                      <ImageIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                    ) : r.type === 'textarea' ? (
                      <AlignLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                    ) : (
                      <Type className="w-3.5 h-3.5" strokeWidth={1.5} />
                    )}
                    {r.label ?? r.key}
                    <span className="text-gray-300 font-mono">· {r.key}</span>
                  </label>

                  {r.type === 'textarea' ? (
                    <textarea
                      value={valueOf(r)}
                      onChange={(e) => setVal(r.key, e.target.value)}
                      rows={3}
                      className="input w-full"
                    />
                  ) : r.type === 'image' ? (
                    <div className="flex items-start gap-3">
                      {valueOf(r) ? (
                        <img
                          src={valueOf(r)}
                          alt="aperçu"
                          className="w-28 h-20 object-cover rounded-md border border-cosmos-cream flex-shrink-0"
                        />
                      ) : (
                        <div className="w-28 h-20 rounded-md border border-dashed border-cosmos-cream flex items-center justify-center text-gray-300 flex-shrink-0">
                          <ImageIcon className="w-6 h-6" strokeWidth={1.25} />
                        </div>
                      )}
                      <div className="flex-1 space-y-2">
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-cosmos-night text-cosmos-cream text-xs font-inter cursor-pointer hover:bg-cosmos-night-light transition-colors">
                          {uploading === r.key ? (
                            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                          ) : (
                            <Upload className="w-4 h-4" strokeWidth={1.5} />
                          )}
                          Téléverser une image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) void uploadImage(r.key, f);
                              e.currentTarget.value = '';
                            }}
                          />
                        </label>
                        <input
                          type="url"
                          value={valueOf(r)}
                          onChange={(e) => setVal(r.key, e.target.value)}
                          placeholder="…ou colle une URL  (vide = image par défaut)"
                          className="input w-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={valueOf(r)}
                      onChange={(e) => setVal(r.key, e.target.value)}
                      className="input w-full"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Aperçu */}
          {showPreview && (
            <div className="hidden md:flex w-[380px] lg:w-[440px] flex-shrink-0 flex-col border-l border-cosmos-cream pl-4">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-cosmos-cream">
                <div className="flex items-center gap-2 text-sm text-cosmos-night">
                  <Eye className="w-4 h-4 text-cosmos-gold" strokeWidth={1.5} />
                  <span className="font-light">Aperçu</span>
                  <span className="text-[10px] text-text-secondary font-mono">{previewPath}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`p-1.5 rounded ${previewDevice === 'desktop' ? 'bg-cosmos-night text-cosmos-cream' : 'text-text-secondary hover:bg-cosmos-cream'}`}
                    title="Bureau"
                  >
                    <Monitor className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`p-1.5 rounded ${previewDevice === 'mobile' ? 'bg-cosmos-night text-cosmos-cream' : 'text-text-secondary hover:bg-cosmos-cream'}`}
                    title="Mobile"
                  >
                    <Smartphone className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => setPreviewNonce((n) => n + 1)}
                    className="p-1.5 rounded text-text-secondary hover:bg-cosmos-cream"
                    title="Rafraîchir l'aperçu"
                  >
                    <RefreshCw className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </button>
                  <a
                    href={previewPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded text-text-secondary hover:bg-cosmos-cream"
                    title="Ouvrir dans un onglet"
                  >
                    <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                  </a>
                </div>
              </div>
              <div className="flex-1 min-h-0 bg-cosmos-cream/30 rounded-lg overflow-hidden flex items-start justify-center p-2">
                <div
                  className={`bg-white shadow-lg h-full overflow-hidden transition-all ${
                    previewDevice === 'mobile' ? 'w-[375px] rounded-xl border-4 border-cosmos-night' : 'w-full rounded'
                  }`}
                >
                  <iframe
                    key={previewNonce}
                    src={previewUrl}
                    title="Aperçu de la page"
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
              <p className="text-[10px] text-text-secondary font-inter font-light text-center mt-2">
                Enregistrez pour voir vos modifications dans l'aperçu.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SiteContentManagement;
