import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Crown, Plus, Save, Trash2, RefreshCw, Users, Star, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

/**
 * ClubManagement — module complet du programme de fidélité Cosmos Club.
 * Onglet Niveaux (tiers) + onglet Membres. Données dans cosmos.club_tiers /
 * cosmos.club_members.
 */

interface Tier {
  id: string;
  name: string;
  level: number;
  price: string | null;
  tagline: string | null;
  benefits: string[];
  is_featured: boolean;
  is_published: boolean;
  sort: number;
}
interface Member {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  tier: string;
  points: number;
  status: string;
  joined_at: string;
}

// tables cosmos hors typage Database public
const db = supabase as unknown as {
  from: (t: string) => {
    select: (c: string) => { order: (c: string, o?: { ascending: boolean }) => Promise<{ data: unknown; error: unknown }> };
    upsert: (rows: unknown) => Promise<{ error: unknown }>;
    insert: (rows: unknown) => Promise<{ error: unknown }>;
    update: (v: unknown) => { eq: (c: string, val: string) => Promise<{ error: unknown }> };
    delete: () => { eq: (c: string, val: string) => Promise<{ error: unknown }> };
  };
};

const ClubManagement: React.FC = () => {
  const [tab, setTab] = useState<'tiers' | 'members'>('tiers');
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [newMember, setNewMember] = useState({ first_name: '', last_name: '', email: '', phone: '', tier: 'Membre' });

  const load = useCallback(async () => {
    setLoading(true);
    const tRes = await db.from('club_tiers').select('*').order('sort', { ascending: true });
    const mRes = await db.from('club_members').select('*').order('joined_at', { ascending: false });
    if (tRes.error || mRes.error) toast.error('Chargement Cosmos Club impossible (cache API ?).');
    setTiers((tRes.data as Tier[]) ?? []);
    setMembers((mRes.data as Member[]) ?? []);
    setLoading(false);
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  const setTier = (id: string, patch: Partial<Tier>) =>
    setTiers((arr) => arr.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const saveTier = async (tier: Tier) => {
    setSaving(true);
    const { error } = await db.from('club_tiers').upsert({
      id: tier.id,
      name: tier.name,
      level: tier.level,
      price: tier.price,
      tagline: tier.tagline,
      benefits: tier.benefits,
      is_featured: tier.is_featured,
      is_published: tier.is_published,
      sort: tier.sort,
    });
    if (error) toast.error("Échec de l'enregistrement"); else toast.success('Niveau enregistré');
    setSaving(false);
  };

  const addTier = async () => {
    const { error } = await db.from('club_tiers').insert({
      name: 'Nouveau niveau', level: tiers.length + 1, price: '', tagline: '', benefits: [], sort: tiers.length + 1,
    });
    if (error) toast.error('Échec'); else { toast.success('Niveau ajouté'); await load(); }
  };

  const deleteTier = async (id: string) => {
    const { error } = await db.from('club_tiers').delete().eq('id', id);
    if (error) toast.error('Échec'); else { toast.success('Niveau supprimé'); await load(); }
  };

  const addMember = async () => {
    if (!newMember.email.trim()) { toast.error('Email requis'); return; }
    const { error } = await db.from('club_members').insert({ ...newMember });
    if (error) toast.error('Échec'); else {
      toast.success('Membre ajouté');
      setNewMember({ first_name: '', last_name: '', email: '', phone: '', tier: 'Membre' });
      await load();
    }
  };

  const updateMember = async (id: string, patch: Partial<Member>) => {
    setMembers((arr) => arr.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    await db.from('club_members').update(patch).eq('id', id);
  };

  const deleteMember = async (id: string) => {
    const { error } = await db.from('club_members').delete().eq('id', id);
    if (error) toast.error('Échec'); else { toast.success('Membre supprimé'); await load(); }
  };

  const stats = useMemo(() => {
    const total = members.length;
    const active = members.filter((m) => m.status === 'active').length;
    const byTier = members.reduce<Record<string, number>>((acc, m) => {
      acc[m.tier] = (acc[m.tier] ?? 0) + 1;
      return acc;
    }, {});
    return { total, active, byTier };
  }, [members]);

  const filteredMembers = members.filter((m) => {
    const q = search.toLowerCase();
    return (
      q === '' ||
      `${m.first_name ?? ''} ${m.last_name ?? ''}`.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q)
    );
  });

  const tierNames = tiers.map((t) => t.name);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-cosmos-night tracking-tight flex items-center gap-3">
            <Crown className="w-7 h-7 text-cosmos-gold" strokeWidth={1.5} /> Cosmos Club
          </h1>
          <p className="text-text-secondary font-light">Programme de fidélité — niveaux & membres</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-600 hover:bg-gray-50" type="button">
          <RefreshCw className="w-4 h-4" strokeWidth={1.5} /> Recharger
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Membres" value={stats.total} />
        <StatCard icon={Star} label="Actifs" value={stats.active} />
        {tierNames.slice(0, 2).map((n) => (
          <StatCard key={n} icon={Crown} label={n} value={stats.byTier[n] ?? 0} />
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-cosmos-cream">
        {(['tiers', 'members'] as const).map((tb) => (
          <button
            key={tb}
            onClick={() => setTab(tb)}
            className={`px-5 py-3 text-sm font-inter -mb-px border-b-2 transition-colors ${
              tab === tb ? 'border-cosmos-gold text-cosmos-night' : 'border-transparent text-gray-400 hover:text-cosmos-night'
            }`}
            type="button"
          >
            {tb === 'tiers' ? 'Niveaux' : 'Membres'}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Chargement…</p>
      ) : tab === 'tiers' ? (
        <div className="space-y-5">
          <button onClick={addTier} className="inline-flex items-center gap-2 px-4 py-2 bg-cosmos-night text-white text-sm rounded-md hover:bg-opacity-90" type="button">
            <Plus className="w-4 h-4" strokeWidth={1.5} /> Ajouter un niveau
          </button>
          {tiers.map((tier) => (
            <div key={tier.id} className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm">
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <Field label="Nom"><input className="input" value={tier.name} onChange={(e) => setTier(tier.id, { name: e.target.value })} /></Field>
                <Field label="Prix"><input className="input" value={tier.price ?? ''} onChange={(e) => setTier(tier.id, { price: e.target.value })} /></Field>
                <Field label="Accroche"><input className="input" value={tier.tagline ?? ''} onChange={(e) => setTier(tier.id, { tagline: e.target.value })} /></Field>
              </div>
              <Field label="Avantages (un par ligne)">
                <textarea
                  className="input w-full" rows={4}
                  value={tier.benefits.join('\n')}
                  onChange={(e) => setTier(tier.id, { benefits: e.target.value.split('\n').filter(Boolean) })}
                />
              </Field>
              <div className="flex items-center justify-between mt-4">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={tier.is_featured} onChange={(e) => setTier(tier.id, { is_featured: e.target.checked })} />
                  Mis en avant
                </label>
                <div className="flex gap-2">
                  <button onClick={() => deleteTier(tier.id)} className="p-2 border border-red-200 text-red-600 rounded-md hover:bg-red-50" type="button">
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                  <button onClick={() => saveTier(tier)} disabled={saving} className="btn-primary px-5 disabled:opacity-50" type="button">
                    <Save className="w-4 h-4" strokeWidth={1.5} /> Enregistrer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {/* Ajout membre */}
          <div className="bg-white rounded-lg border border-gray-100 p-5 shadow-sm grid md:grid-cols-6 gap-3 items-end">
            <Field label="Prénom"><input className="input" value={newMember.first_name} onChange={(e) => setNewMember({ ...newMember, first_name: e.target.value })} /></Field>
            <Field label="Nom"><input className="input" value={newMember.last_name} onChange={(e) => setNewMember({ ...newMember, last_name: e.target.value })} /></Field>
            <Field label="Email"><input className="input" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} /></Field>
            <Field label="Téléphone"><input className="input" value={newMember.phone} onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })} /></Field>
            <Field label="Niveau">
              <select className="input" value={newMember.tier} onChange={(e) => setNewMember({ ...newMember, tier: e.target.value })}>
                {(tierNames.length ? tierNames : ['Membre']).map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
            <button onClick={addMember} className="btn-primary justify-center" type="button"><Plus className="w-4 h-4" strokeWidth={1.5} /> Ajouter</button>
          </div>

          {/* Recherche */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
            <input className="input w-full pl-9" placeholder="Rechercher un membre…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-100 text-left text-gray-400">
                <tr>
                  <th className="px-4 py-3 font-light">Membre</th>
                  <th className="px-4 py-3 font-light">Email</th>
                  <th className="px-4 py-3 font-light">Niveau</th>
                  <th className="px-4 py-3 font-light">Statut</th>
                  <th className="px-4 py-3 font-light text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMembers.map((m) => (
                  <tr key={m.id}>
                    <td className="px-4 py-3 text-cosmos-night">{`${m.first_name ?? ''} ${m.last_name ?? ''}`.trim() || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{m.email}</td>
                    <td className="px-4 py-3">
                      <select className="text-xs border border-gray-200 rounded px-2 py-1" value={m.tier} onChange={(e) => updateMember(m.id, { tier: e.target.value })}>
                        {(tierNames.length ? tierNames : ['Membre']).map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select className="text-xs border border-gray-200 rounded px-2 py-1" value={m.status} onChange={(e) => updateMember(m.id, { status: e.target.value })}>
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => deleteMember(m.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded" type="button"><Trash2 className="w-4 h-4" strokeWidth={1.5} /></button>
                    </td>
                  </tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-400">Aucun membre pour l'instant.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ icon: typeof Users; label: string; value: number }> = ({ icon: Icon, label, value }) => (
  <div className="bg-white border border-gray-100 rounded-lg p-5">
    <Icon className="w-5 h-5 text-cosmos-gold mb-3" strokeWidth={1.5} />
    <div className="text-3xl font-light text-cosmos-night">{value}</div>
    <div className="text-xs text-gray-400 uppercase tracking-wider">{label}</div>
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block">
    <span className="block text-xs text-gray-500 mb-1">{label}</span>
    {children}
  </label>
);

export default ClubManagement;
