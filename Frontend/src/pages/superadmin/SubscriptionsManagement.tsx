import React, { useState } from 'react';
import {
  Package,
  Search,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Crown,
  Star,
  TrendingUp,
} from 'lucide-react';

interface Subscription {
  id: string;
  storeName: string;
  storeOwner: string;
  category: string;
  plan: 'Free' | 'Gold' | 'Platinum';
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  revenue: number;
  autoRenew: boolean;
  paymentMethod?: string;
  lastPayment?: string;
  nextBilling?: string;
}

const SubscriptionsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Données des abonnements
  const [subscriptions] = useState<Subscription[]>([
    {
      id: '1',
      storeName: 'Nike Store',
      storeOwner: 'Jean Kouassi',
      category: 'Mode & Sport',
      plan: 'Platinum',
      startDate: '2024-01-15',
      endDate: '2025-01-15',
      status: 'active',
      revenue: 150000,
      autoRenew: true,
      paymentMethod: 'Orange Money',
      lastPayment: '2024-10-15',
      nextBilling: '2024-12-15',
    },
    {
      id: '2',
      storeName: 'Zara Fashion',
      storeOwner: 'Marie Diabate',
      category: 'Mode & Accessoires',
      plan: 'Gold',
      startDate: '2024-02-20',
      endDate: '2025-02-20',
      status: 'active',
      revenue: 75000,
      autoRenew: true,
      paymentMethod: 'MTN Money',
      lastPayment: '2024-10-20',
      nextBilling: '2024-12-20',
    },
    {
      id: '3',
      storeName: 'Tech Paradise',
      storeOwner: 'Yao Koffi',
      category: 'Électronique',
      plan: 'Free',
      startDate: '2024-10-15',
      endDate: '2024-11-15',
      status: 'active',
      revenue: 0,
      autoRenew: false,
    },
    {
      id: '4',
      storeName: 'Beauty Corner',
      storeOwner: 'Aya Toure',
      category: 'Beauté & Cosmétiques',
      plan: 'Gold',
      startDate: '2024-03-10',
      endDate: '2025-03-10',
      status: 'cancelled',
      revenue: 75000,
      autoRenew: false,
      paymentMethod: 'Carte Bancaire',
      lastPayment: '2024-09-10',
    },
    {
      id: '5',
      storeName: 'Librairie Moderne',
      storeOwner: 'Ibrahim Bamba',
      category: 'Livres & Papeterie',
      plan: 'Gold',
      startDate: '2024-04-12',
      endDate: '2025-04-12',
      status: 'active',
      revenue: 75000,
      autoRenew: true,
      paymentMethod: 'Orange Money',
      lastPayment: '2024-10-12',
      nextBilling: '2024-12-12',
    },
    {
      id: '6',
      storeName: 'Sports Arena',
      storeOwner: 'Sekou Traore',
      category: 'Sport & Fitness',
      plan: 'Platinum',
      startDate: '2024-03-25',
      endDate: '2025-03-25',
      status: 'active',
      revenue: 150000,
      autoRenew: true,
      paymentMethod: 'MTN Money',
      lastPayment: '2024-10-25',
      nextBilling: '2024-12-25',
    },
    {
      id: '7',
      storeName: 'Bijouterie Prestige',
      storeOwner: 'Nadege Coulibaly',
      category: 'Bijouterie & Horlogerie',
      plan: 'Platinum',
      startDate: '2024-02-08',
      endDate: '2025-02-08',
      status: 'active',
      revenue: 150000,
      autoRenew: true,
      paymentMethod: 'Carte Bancaire',
      lastPayment: '2024-10-08',
      nextBilling: '2024-12-08',
    },
    {
      id: '8',
      storeName: 'Café Gourmet',
      storeOwner: 'Fatou Kone',
      category: 'Restauration',
      plan: 'Free',
      startDate: '2024-05-20',
      endDate: '2024-11-20',
      status: 'active',
      revenue: 0,
      autoRenew: false,
    },
    {
      id: '9',
      storeName: 'Électro Plus',
      storeOwner: 'Kouame Adjoumani',
      category: 'Électronique & Électroménager',
      plan: 'Gold',
      startDate: '2024-06-10',
      endDate: '2025-06-10',
      status: 'active',
      revenue: 75000,
      autoRenew: true,
      paymentMethod: 'Orange Money',
      lastPayment: '2024-10-10',
      nextBilling: '2024-12-10',
    },
    {
      id: '10',
      storeName: 'Kids Paradise',
      storeOwner: 'Amina Soro',
      category: 'Enfants & Jouets',
      plan: 'Gold',
      startDate: '2024-07-05',
      endDate: '2025-07-05',
      status: 'active',
      revenue: 75000,
      autoRenew: true,
      paymentMethod: 'MTN Money',
      lastPayment: '2024-10-05',
      nextBilling: '2024-12-05',
    },
    {
      id: '11',
      storeName: 'Pharmacie du Centre',
      storeOwner: 'Dr. Youssouf Ouattara',
      category: 'Santé & Bien-être',
      plan: 'Platinum',
      startDate: '2024-01-20',
      endDate: '2025-01-20',
      status: 'active',
      revenue: 150000,
      autoRenew: true,
      paymentMethod: 'Carte Bancaire',
      lastPayment: '2024-10-20',
      nextBilling: '2024-12-20',
    },
    {
      id: '12',
      storeName: 'Optique Vision',
      storeOwner: 'Rachel Kone',
      category: 'Optique & Lunetterie',
      plan: 'Gold',
      startDate: '2024-08-15',
      endDate: '2025-08-15',
      status: 'active',
      revenue: 75000,
      autoRenew: true,
      paymentMethod: 'Orange Money',
      lastPayment: '2024-10-15',
      nextBilling: '2024-12-15',
    },
    {
      id: '13',
      storeName: 'Papeterie Express',
      storeOwner: 'Mohamed Diallo',
      category: 'Papeterie & Bureau',
      plan: 'Free',
      startDate: '2024-09-01',
      endDate: '2024-12-01',
      status: 'active',
      revenue: 0,
      autoRenew: false,
    },
    {
      id: '14',
      storeName: 'La Mode Chic',
      storeOwner: 'Sophie Bamba',
      category: 'Mode Femme',
      plan: 'Gold',
      startDate: '2023-11-10',
      endDate: '2024-11-10',
      status: 'expired',
      revenue: 75000,
      autoRenew: false,
      paymentMethod: 'MTN Money',
      lastPayment: '2024-09-10',
    },
    {
      id: '15',
      storeName: 'Électronique 2000',
      storeOwner: 'Konan Yao',
      category: 'Électronique',
      plan: 'Platinum',
      startDate: '2024-05-01',
      endDate: '2025-05-01',
      status: 'active',
      revenue: 150000,
      autoRenew: true,
      paymentMethod: 'Carte Bancaire',
      lastPayment: '2024-10-01',
      nextBilling: '2024-12-01',
    },
  ]);

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Platinum':
        return 'from-cosmos-night to-cosmos-night/80';
      case 'Gold':
        return 'from-cosmos-gold to-cosmos-gold-light';
      default:
        return 'from-gray-600 to-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'expired':
        return 'text-red-500';
      case 'cancelled':
        return 'text-text-secondary';
      default:
        return 'text-text-secondary';
    }
  };

  // Filtrer les abonnements
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.storeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.storeOwner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || sub.plan.toLowerCase() === filterPlan;
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesPlan && matchesStatus;
  });

  // Calculer les statistiques
  const activeSubscriptions = subscriptions.filter((s) => s.status === 'active');
  const platinumCount = activeSubscriptions.filter((s) => s.plan === 'Platinum').length;
  const goldCount = activeSubscriptions.filter((s) => s.plan === 'Gold').length;
  const freeCount = activeSubscriptions.filter((s) => s.plan === 'Free').length;
  const monthlyRevenue = activeSubscriptions.reduce((sum, s) => sum + s.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-white mb-2 tracking-tight">
            Gestion des Abonnements
          </h1>
          <p className="text-text-secondary font-light">
            Gérez les abonnements et les plans des boutiques
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cosmos-night to-cosmos-night/80 text-white font-light hover:opacity-90 transition-opacity">
          <Plus className="w-5 h-5" strokeWidth={1.5} />
          Nouvel Abonnement
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-cosmos-night border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
            <span className="text-sm text-text-secondary font-light">Total Actifs</span>
          </div>
          <div className="text-3xl font-light text-white tracking-tight">
            {activeSubscriptions.length}
          </div>
        </div>
        <div className="bg-cosmos-night border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-5 h-5 text-purple-500" strokeWidth={1.5} />
            <span className="text-sm text-text-secondary font-light">Platinum</span>
          </div>
          <div className="text-3xl font-light text-white tracking-tight">{platinumCount}</div>
        </div>
        <div className="bg-cosmos-night border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-yellow-500" strokeWidth={1.5} />
            <span className="text-sm text-text-secondary font-light">Gold</span>
          </div>
          <div className="text-3xl font-light text-white tracking-tight">{goldCount}</div>
        </div>
        <div className="bg-cosmos-night border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
            <span className="text-sm text-text-secondary font-light">Free</span>
          </div>
          <div className="text-3xl font-light text-white tracking-tight">{freeCount}</div>
        </div>
        <div className="bg-cosmos-night border border-white/5 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-500" strokeWidth={1.5} />
            <span className="text-sm text-text-secondary font-light">Revenus/mois</span>
          </div>
          <div className="text-2xl font-light text-white tracking-tight">
            {(monthlyRevenue / 1000).toFixed(0)}K FCFA
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-cosmos-night border border-white/5 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary"
                strokeWidth={1.5}
              />
              <input
                type="text"
                placeholder="Rechercher une boutique..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black border border-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-white/10 font-light"
              />
            </div>
          </div>
          <div>
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
            >
              <option value="all">Tous les plans</option>
              <option value="platinum">Platinum</option>
              <option value="gold">Gold</option>
              <option value="free">Free</option>
            </select>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="expired">Expiré</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table des abonnements */}
      <div className="bg-cosmos-night border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-black border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-text-secondary uppercase tracking-wider font-light">
                  Boutique
                </th>
                <th className="px-6 py-4 text-left text-xs text-text-secondary uppercase tracking-wider font-light">
                  Catégorie
                </th>
                <th className="px-6 py-4 text-left text-xs text-text-secondary uppercase tracking-wider font-light">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-xs text-text-secondary uppercase tracking-wider font-light">
                  Période
                </th>
                <th className="px-6 py-4 text-left text-xs text-text-secondary uppercase tracking-wider font-light">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs text-text-secondary uppercase tracking-wider font-light">
                  Revenus
                </th>
                <th className="px-6 py-4 text-left text-xs text-text-secondary uppercase tracking-wider font-light">
                  Paiement
                </th>
                <th className="px-6 py-4 text-center text-xs text-text-secondary uppercase tracking-wider font-light">
                  Auto-Renew
                </th>
                <th className="px-6 py-4 text-right text-xs text-text-secondary uppercase tracking-wider font-light">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-black transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm text-white font-light">{sub.storeName}</div>
                    <div className="text-xs text-text-secondary font-light">{sub.storeOwner}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary font-light">
                    {sub.category}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${getPlanColor(sub.plan)} text-white text-xs font-light`}
                    >
                      {sub.plan === 'Platinum' && <Crown className="w-3 h-3" />}
                      {sub.plan === 'Gold' && <Star className="w-3 h-3" />}
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-secondary font-light">
                      {new Date(sub.startDate).toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-xs text-text-secondary font-light">
                      au {new Date(sub.endDate).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-light ${getStatusColor(sub.status)}`}>
                      {sub.status === 'active'
                        ? 'Actif'
                        : sub.status === 'expired'
                          ? 'Expiré'
                          : 'Annulé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-light">
                    {sub.revenue.toLocaleString()} FCFA
                  </td>
                  <td className="px-6 py-4">
                    {sub.paymentMethod && (
                      <>
                        <div className="text-sm text-text-secondary font-light">
                          {sub.paymentMethod}
                        </div>
                        {sub.nextBilling && (
                          <div className="text-xs text-text-secondary font-light">
                            Prochain: {new Date(sub.nextBilling).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {sub.autoRenew ? (
                      <Check className="w-5 h-5 text-green-500 mx-auto" strokeWidth={1.5} />
                    ) : (
                      <X className="w-5 h-5 text-text-secondary mx-auto" strokeWidth={1.5} />
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-white/5 transition-colors" title="Modifier">
                        <Edit className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
                      </button>
                      <button className="p-2 hover:bg-white/5 transition-colors" title="Supprimer">
                        <Trash2 className="w-4 h-4 text-red-500" strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* No results message */}
        {filteredSubscriptions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary font-light">Aucun abonnement trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsManagement;
