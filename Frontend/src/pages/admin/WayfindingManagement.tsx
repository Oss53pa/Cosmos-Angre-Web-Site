import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Upload, Plus, Save, Trash2, MapPin, Pencil, Check, X, Map as MapIcon, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useStores } from '../../hooks/useStores';

/**
 * WayfindingManagement — éditeur de plan wayfinding.
 * Importer un plan par étage, dessiner chaque local en polygone, le lier à une
 * enseigne + infos. Données : cosmos.wayfinding_floors / wayfinding_zones.
 */

interface Floor { id: string; name: string; level: number; plan_url: string | null; sort: number }
interface Zone {
  id: string; floor_id: string; name: string; category: string | null; color: string;
  points: [number, number][]; store_id: string | null; info: string | null; sort: number;
}

const CATEGORIES: { label: string; color: string }[] = [
  { label: 'Mode & Accessoires', color: '#C2185B' },
  { label: 'Restaurants & Cafés', color: '#E53935' },
  { label: 'Beauté & Bien-être', color: '#8E24AA' },
  { label: 'High-Tech', color: '#1E88E5' },
  { label: 'Supermarché', color: '#43A047' },
  { label: 'Loisirs', color: '#7B1FA2' },
  { label: 'Services', color: '#546E7A' },
  { label: 'Circulation / Vide', color: '#B0A88F' },
];

const db = supabase as unknown as {
  from: (t: string) => {
    select: (c: string) => {
      order: (c: string, o?: { ascending: boolean }) => Promise<{ data: unknown; error: unknown }>;
      eq: (c: string, v: string) => { order: (c: string, o?: { ascending: boolean }) => Promise<{ data: unknown; error: unknown }> };
    };
    upsert: (rows: unknown) => Promise<{ error: unknown }>;
    insert: (rows: unknown) => { select: (c: string) => Promise<{ data: unknown; error: unknown }> };
    update: (v: unknown) => { eq: (c: string, v: string) => Promise<{ error: unknown }> };
    delete: () => { eq: (c: string, v: string) => Promise<{ error: unknown }> };
  };
};

const WayfindingManagement: React.FC = () => {
  const { stores } = useStores({ status: 'active' });
  const [floors, setFloors] = useState<Floor[]>([]);
  const [floorId, setFloorId] = useState<string | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [draft, setDraft] = useState<[number, number][]>([]);
  const [drawing, setDrawing] = useState(false);
  const [selId, setSelId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const floor = floors.find((f) => f.id === floorId) ?? null;
  const sel = zones.find((z) => z.id === selId) ?? null;

  const loadFloors = useCallback(async () => {
    const { data } = await db.from('wayfinding_floors').select('*').order('sort', { ascending: true });
    const list = (data as Floor[]) ?? [];
    setFloors(list);
    setFloorId((cur) => cur ?? list[0]?.id ?? null);
  }, []);
  useEffect(() => { void loadFloors(); }, [loadFloors]);

  const loadZones = useCallback(async (fid: string) => {
    const { data } = await db.from('wayfinding_zones').select('*').eq('floor_id', fid).order('sort', { ascending: true });
    setZones((data as Zone[]) ?? []);
    setSelId(null); setDraft([]); setDrawing(false);
  }, []);
  useEffect(() => { if (floorId) void loadZones(floorId); }, [floorId, loadZones]);

  const addFloor = async () => {
    const res = await db.from('wayfinding_floors').insert({ name: `Étage ${floors.length}`, level: floors.length, sort: floors.length }).select('*');
    if (res.error) { toast.error('Échec'); return; }
    toast.success('Étage ajouté'); await loadFloors();
  };

  const uploadPlan = async (file: File) => {
    if (!floor) return;
    setUploading(true);
    try {
      const ext = (file.name.split('.').pop() || 'png').toLowerCase();
      const path = `wayfinding/${floor.id}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('site').upload(path, file, { upsert: true });
      if (error) { toast.error('Téléversement échoué'); return; }
      const { data } = supabase.storage.from('site').getPublicUrl(path);
      await db.from('wayfinding_floors').update({ plan_url: data.publicUrl }).eq('id', floor.id);
      toast.success('Plan importé'); await loadFloors();
    } finally { setUploading(false); }
  };

  const onCanvasClick = (e: React.MouseEvent) => {
    if (!drawing || !wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    setDraft((d) => [...d, [Number(x.toFixed(4)), Number(y.toFixed(4))]]);
  };

  const finishPolygon = async () => {
    if (draft.length < 3 || !floorId) { toast.error('Au moins 3 points'); return; }
    const res = await db.from('wayfinding_zones').insert({
      floor_id: floorId, name: 'Nouveau local', category: CATEGORIES[0].label, color: CATEGORIES[0].color,
      points: draft, sort: zones.length,
    }).select('*');
    if (res.error) { toast.error('Échec'); return; }
    setDraft([]); setDrawing(false);
    await loadZones(floorId);
    toast.success('Local créé — complétez ses infos');
  };

  const patchZone = (id: string, patch: Partial<Zone>) =>
    setZones((arr) => arr.map((z) => (z.id === id ? { ...z, ...patch } : z)));

  const saveZone = async (z: Zone) => {
    const { error } = await db.from('wayfinding_zones').update({
      name: z.name, category: z.category, color: z.color, store_id: z.store_id, info: z.info,
    }).eq('id', z.id);
    if (error) toast.error('Échec'); else toast.success('Local enregistré');
  };

  const deleteZone = async (id: string) => {
    const { error } = await db.from('wayfinding_zones').delete().eq('id', id);
    if (error) { toast.error('Échec'); return; }
    if (floorId) await loadZones(floorId);
  };

  const centroid = (pts: [number, number][]): [number, number] => {
    const n = pts.length || 1;
    return [pts.reduce((s, p) => s + p[0], 0) / n, pts.reduce((s, p) => s + p[1], 0) / n];
  };

  const toPts = (pts: [number, number][]) => pts.map((p) => `${p[0] * 100},${p[1] * 100}`).join(' ');

  const storeName = useMemo(() => {
    const m = new Map(stores.map((s) => [s.id, s.name] as const));
    return (id: string | null) => (id ? m.get(id) ?? '' : '');
  }, [stores]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-cosmos-night tracking-tight flex items-center gap-3">
            <MapIcon className="w-7 h-7 text-cosmos-gold" strokeWidth={1.5} /> Plan / Wayfinding
          </h1>
          <p className="text-text-secondary font-light">Importez un plan, dessinez les locaux, liez-les aux enseignes.</p>
        </div>
        <button onClick={addFloor} className="inline-flex items-center gap-2 px-4 py-2 bg-cosmos-night text-white text-sm rounded-md hover:bg-opacity-90" type="button">
          <Plus className="w-4 h-4" strokeWidth={1.5} /> Ajouter un étage
        </button>
      </div>

      {/* Étages */}
      <div className="flex flex-wrap gap-2">
        {floors.map((f) => (
          <button key={f.id} onClick={() => setFloorId(f.id)} type="button"
            className={`px-4 py-2 rounded-md text-sm ${floorId === f.id ? 'bg-cosmos-night text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            {f.name}
          </button>
        ))}
        {floors.length === 0 && <p className="text-sm text-gray-400">Aucun étage. Ajoutez-en un pour commencer.</p>}
      </div>

      {floor && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-cosmos-night text-white text-sm rounded-md cursor-pointer hover:bg-opacity-90">
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" strokeWidth={1.5} />}
                {floor.plan_url ? 'Remplacer le plan' : 'Importer le plan'}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadPlan(f); e.currentTarget.value=''; }} />
              </label>
              <button onClick={() => { setDrawing((d) => !d); setDraft([]); }} type="button"
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md ${drawing ? 'bg-cosmos-gold text-cosmos-night' : 'border border-gray-200 text-gray-600'}`}>
                <Pencil className="w-4 h-4" strokeWidth={1.5} /> {drawing ? 'Mode dessin actif' : 'Dessiner un local'}
              </button>
              {drawing && (
                <>
                  <button onClick={finishPolygon} type="button" className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-md bg-emerald-600 text-white"><Check className="w-4 h-4" /> Fermer le polygone</button>
                  <button onClick={() => setDraft([])} type="button" className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-md border border-gray-200 text-gray-500"><X className="w-4 h-4" /> Effacer</button>
                  <span className="text-xs text-gray-400">{draft.length} point(s) — cliquez sur le plan</span>
                </>
              )}
            </div>

            <div
              ref={wrapRef}
              onClick={onCanvasClick}
              className={`relative w-full rounded-lg overflow-hidden border border-gray-200 bg-cosmos-cream/40 ${drawing ? 'cursor-crosshair' : ''}`}
              style={{ aspectRatio: '16 / 11' }}
            >
              {floor.plan_url ? (
                <img src={floor.plan_url} alt={floor.name} className="absolute inset-0 w-full h-full object-contain pointer-events-none" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Importez un plan pour cet étage</div>
              )}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {zones.map((z) => {
                  const [cx, cy] = centroid(z.points);
                  return (
                    <g key={z.id} onClick={(e) => { e.stopPropagation(); if (!drawing) setSelId(z.id); }} style={{ cursor: drawing ? 'crosshair' : 'pointer' }}>
                      <polygon points={toPts(z.points)} fill={z.color} fillOpacity={selId === z.id ? 0.65 : 0.4}
                        stroke={z.color} strokeWidth={selId === z.id ? 2 : 1} vectorEffect="non-scaling-stroke" />
                      <text x={cx * 100} y={cy * 100} fontSize="2.4" textAnchor="middle" fill="#1A1410" style={{ pointerEvents: 'none', fontWeight: 600 }}>{z.name}</text>
                    </g>
                  );
                })}
                {draft.length > 0 && (
                  <>
                    <polyline points={toPts(draft)} fill="rgba(201,169,97,0.25)" stroke="#C9A961" strokeWidth={2} vectorEffect="non-scaling-stroke" />
                    {draft.map((p, i) => <circle key={i} cx={p[0] * 100} cy={p[1] * 100} r={0.8} fill="#C9A961" />)}
                  </>
                )}
              </svg>
            </div>
          </div>

          {/* Panneau d'édition / liste */}
          <div className="space-y-4">
            {sel ? (
              <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-cormorant text-xl text-cosmos-night">Local sélectionné</h3>
                  <button onClick={() => deleteZone(sel.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" type="button"><Trash2 className="w-4 h-4" /></button>
                </div>
                <label className="block"><span className="block text-xs text-gray-500 mb-1">Nom du local</span>
                  <input className="input w-full" value={sel.name} onChange={(e) => patchZone(sel.id, { name: e.target.value })} /></label>
                <label className="block"><span className="block text-xs text-gray-500 mb-1">Catégorie / couleur</span>
                  <select className="input w-full" value={sel.category ?? ''} onChange={(e) => { const c = CATEGORIES.find((x) => x.label === e.target.value); patchZone(sel.id, { category: e.target.value, color: c?.color ?? sel.color }); }}>
                    {CATEGORIES.map((c) => <option key={c.label} value={c.label}>{c.label}</option>)}
                  </select></label>
                <label className="block"><span className="block text-xs text-gray-500 mb-1">Enseigne liée</span>
                  <select className="input w-full" value={sel.store_id ?? ''} onChange={(e) => patchZone(sel.id, { store_id: e.target.value || null })}>
                    <option value="">— Aucune —</option>
                    {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select></label>
                <label className="block"><span className="block text-xs text-gray-500 mb-1">Infos (horaires, n° local…)</span>
                  <textarea className="input w-full" rows={3} value={sel.info ?? ''} onChange={(e) => patchZone(sel.id, { info: e.target.value })} /></label>
                <button onClick={() => saveZone(sel)} className="btn-primary w-full justify-center" type="button"><Save className="w-4 h-4" strokeWidth={1.5} /> Enregistrer le local</button>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm text-sm text-gray-500">
                {drawing ? 'Cliquez sur le plan pour poser les points, puis « Fermer le polygone ».' : 'Cliquez un local sur le plan pour l\'éditer, ou « Dessiner un local ».'}
              </div>
            )}

            <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
              <h3 className="text-xs uppercase tracking-[0.15em] text-cosmos-gold font-medium mb-3">Locaux ({zones.length})</h3>
              <ul className="space-y-1 max-h-72 overflow-y-auto">
                {zones.map((z) => (
                  <li key={z.id}>
                    <button onClick={() => setSelId(z.id)} type="button" className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-sm ${selId === z.id ? 'bg-cosmos-cream' : 'hover:bg-gray-50'}`}>
                      <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: z.color }} />
                      <span className="flex-1 truncate text-cosmos-night">{z.name}</span>
                      {z.store_id && <MapPin className="w-3 h-3 text-cosmos-gold" />}
                      <span className="text-[10px] text-gray-400 truncate max-w-[90px]">{storeName(z.store_id)}</span>
                    </button>
                  </li>
                ))}
                {zones.length === 0 && <li className="text-sm text-gray-400">Aucun local dessiné.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WayfindingManagement;
