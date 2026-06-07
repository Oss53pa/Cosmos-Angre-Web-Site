import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Save, RefreshCw, Image as ImageIcon, Type, AlignLeft, Upload, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

/**
 * SiteContentManagement — édition de TOUT le contenu éditable du site.
 * Chaque clé de cosmos.site_content (texte, zone de texte, image) est modifiable
 * ici puis enregistrée. Les pages publiques lisent ces valeurs via useContent().
 */

interface Row {
  key: string;
  value: string | null;
  type: string; // text | textarea | image | url
  group_label: string | null;
  label: string | null;
  sort: number;
}

// site_content vit dans le schéma cosmos (hors typage Database public)
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

const SiteContentManagement: React.FC = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [dirty, setDirty] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

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

  const valueOf = (r: Row) => (r.key in dirty ? dirty[r.key] : r.value ?? '');
  const setVal = (key: string, v: string) => setDirty((d) => ({ ...d, [key]: v }));
  const changedCount = Object.keys(dirty).length;

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
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* En-tête */}
      <div className="flex items-center justify-between gap-4 mb-8 sticky top-0 bg-white/90 backdrop-blur z-10 py-3">
        <div>
          <h1 className="font-cormorant text-3xl text-cosmos-night font-light">Contenu du site</h1>
          <p className="text-sm text-gray-500 font-inter font-light">
            Modifiez chaque texte et image des pages publiques.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
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
        <p className="text-sm text-gray-500">Chargement…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun contenu éditable pour l'instant.</p>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([group, items]) => (
            <section key={group}>
              <h2 className="text-xs uppercase tracking-[0.2em] text-cosmos-gold font-medium mb-4">
                {group}
              </h2>
              <div className="space-y-5">
                {items.map((r) => (
                  <div key={r.key} className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
                    <label className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-2">
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
                            className="w-28 h-20 object-cover rounded-md border border-gray-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-28 h-20 rounded-md border border-dashed border-gray-300 flex items-center justify-center text-gray-300 flex-shrink-0">
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
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default SiteContentManagement;
