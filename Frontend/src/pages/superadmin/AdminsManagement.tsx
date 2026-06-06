import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Lock,
} from 'lucide-react';

interface Admin {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'super_admin' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  storeName?: string;
  joinedDate: string;
  lastLogin: string;
  permissions: string[];
}

const AdminsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewAdmin, setViewAdmin] = useState<Admin | null>(null);
  const [, setAddAdmin] = useState(false);

  const [admins] = useState<Admin[]>([
    {
      id: '1',
      name: 'Super Admin',
      email: 'superadmin@cosmosangre.com',
      phone: '+225 27 20 00 00 00',
      role: 'super_admin',
      status: 'active',
      joinedDate: '2024-01-01',
      lastLogin: '2024-11-15 10:30',
      permissions: ['all'],
    },
    {
      id: '2',
      name: 'Jean Kouassi',
      email: 'jean@nikestore.com',
      phone: '+225 27 22 XX XX XX',
      role: 'admin',
      status: 'active',
      storeName: 'Nike Store',
      joinedDate: '2024-01-15',
      lastLogin: '2024-11-14 18:45',
      permissions: ['manage_store', 'manage_products', 'view_analytics'],
    },
    {
      id: '3',
      name: 'Marie Diabate',
      email: 'marie@zara.com',
      phone: '+225 27 22 YY YY YY',
      role: 'admin',
      status: 'active',
      storeName: 'Zara Fashion',
      joinedDate: '2024-02-20',
      lastLogin: '2024-11-15 09:15',
      permissions: ['manage_store', 'manage_products', 'view_analytics'],
    },
    {
      id: '4',
      name: 'Yao Kouadio',
      email: 'yao@techparadise.com',
      phone: '+225 27 22 ZZ ZZ ZZ',
      role: 'admin',
      status: 'active',
      storeName: 'Tech Paradise',
      joinedDate: '2024-03-10',
      lastLogin: '2024-11-13 16:20',
      permissions: ['manage_store', 'manage_products'],
    },
    {
      id: '5',
      name: 'Modérateur Site',
      email: 'moderator@cosmosangre.com',
      phone: '+225 27 20 11 11 11',
      role: 'moderator',
      status: 'active',
      joinedDate: '2024-01-10',
      lastLogin: '2024-11-15 08:00',
      permissions: ['moderate_content', 'manage_events', 'view_reports'],
    },
    {
      id: '6',
      name: 'Ancien Admin',
      email: 'ancien@example.com',
      phone: '+225 27 22 AA AA AA',
      role: 'admin',
      status: 'inactive',
      storeName: 'Ancienne Boutique',
      joinedDate: '2024-01-01',
      lastLogin: '2024-08-20 12:00',
      permissions: ['manage_store'],
    },
  ]);

  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.storeName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || admin.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || admin.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: string) => {
    const badges = {
      super_admin: 'bg-gradient-to-r from-cosmos-night to-cosmos-night/80',
      admin: 'bg-gradient-to-r from-cosmos-night to-cosmos-night/80',
      moderator: 'bg-gradient-to-r from-green-600 to-emerald-600',
    };
    return badges[role as keyof typeof badges];
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      super_admin: 'Super Admin',
      admin: 'Administrateur',
      moderator: 'Modérateur',
    };
    return labels[role as keyof typeof labels];
  };

  const getStatusIcon = (status: string) => {
    if (status === 'active') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (status === 'suspended') return <Lock className="w-5 h-5 text-red-500" />;
    return <XCircle className="w-5 h-5 text-text-secondary" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-white mb-2 tracking-tight">
            Gestion des Administrateurs
          </h1>
          <p className="text-text-secondary font-light">
            Gérez les comptes administrateurs et leurs permissions
          </p>
        </div>
        <button
          onClick={() => setAddAdmin(true)}
          className="flex items-center gap-2 px-6 py-3 bg-white text-cosmos-night font-light hover:bg-cosmos-cream transition-colors"
        >
          <Plus className="w-5 h-5" strokeWidth={1.5} />
          Nouvel Administrateur
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-cosmos-night border border-white/5 p-6">
          <div className="text-3xl font-light text-white mb-2 tracking-tight">{admins.length}</div>
          <div className="text-sm text-text-secondary font-light">Total Administrateurs</div>
        </div>
        <div className="bg-cosmos-night border border-white/5 p-6">
          <div className="text-3xl font-light text-white mb-2 tracking-tight">
            {admins.filter((a) => a.status === 'active').length}
          </div>
          <div className="text-sm text-text-secondary font-light">Actifs</div>
        </div>
        <div className="bg-cosmos-night border border-white/5 p-6">
          <div className="text-3xl font-light text-white mb-2 tracking-tight">
            {admins.filter((a) => a.role === 'admin').length}
          </div>
          <div className="text-sm text-text-secondary font-light">Admins Boutique</div>
        </div>
        <div className="bg-cosmos-night border border-white/5 p-6">
          <div className="text-3xl font-light text-white mb-2 tracking-tight">
            {admins.filter((a) => a.role === 'super_admin').length}
          </div>
          <div className="text-sm text-text-secondary font-light">Super Admins</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-cosmos-night border border-white/5 p-6">
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
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-3 bg-black border border-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-white/10 font-light"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
          >
            <option value="all">Tous les rôles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Administrateur</option>
            <option value="moderator">Modérateur</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="suspended">Suspendu</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-cosmos-night border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-xs font-light text-text-secondary uppercase tracking-wider">
                  Administrateur
                </th>
                <th className="text-left px-6 py-4 text-xs font-light text-text-secondary uppercase tracking-wider">
                  Rôle
                </th>
                <th className="text-left px-6 py-4 text-xs font-light text-text-secondary uppercase tracking-wider">
                  Boutique
                </th>
                <th className="text-left px-6 py-4 text-xs font-light text-text-secondary uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left px-6 py-4 text-xs font-light text-text-secondary uppercase tracking-wider">
                  Dernière Connexion
                </th>
                <th className="text-left px-6 py-4 text-xs font-light text-text-secondary uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-right px-6 py-4 text-xs font-light text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr
                  key={admin.id}
                  className="border-b border-white/5 hover:bg-black transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white font-light">
                        {admin.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm text-white font-light">{admin.name}</div>
                        <div className="text-xs text-text-secondary font-light">{admin.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 text-xs text-white ${getRoleBadge(admin.role)} font-light`}
                    >
                      {getRoleLabel(admin.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-white font-light">{admin.storeName || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-secondary font-light">{admin.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white font-light">{admin.lastLogin}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(admin.status)}
                      <span className="text-sm text-text-secondary font-light capitalize">
                        {admin.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewAdmin(admin)}
                        className="p-2 hover:bg-white/5 transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
                      </button>
                      <button className="p-2 hover:bg-white/5 transition-colors" title="Modifier">
                        <Edit className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                      </button>
                      {admin.role !== 'super_admin' && (
                        <button
                          className="p-2 hover:bg-white/5 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" strokeWidth={1.5} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Admin Modal */}
      {viewAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-cosmos-night border border-white/5 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-2xl font-light text-white tracking-tight">
                Détails Administrateur
              </h2>
            </div>
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-sm text-text-secondary uppercase tracking-wider mb-4 font-light">
                  Informations Personnelles
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
                    <span className="text-white font-light">{viewAdmin.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
                    <span className="text-white font-light">{viewAdmin.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
                    <span className="text-white font-light">{viewAdmin.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
                    <span className="text-white font-light">
                      Inscrit le {new Date(viewAdmin.joinedDate).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role & Store */}
              <div>
                <h3 className="text-sm text-text-secondary uppercase tracking-wider mb-4 font-light">
                  Rôle & Boutique
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
                    <span
                      className={`inline-block px-3 py-1 text-xs text-white ${getRoleBadge(viewAdmin.role)} font-light`}
                    >
                      {getRoleLabel(viewAdmin.role)}
                    </span>
                  </div>
                  {viewAdmin.storeName && (
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
                      <span className="text-white font-light">{viewAdmin.storeName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h3 className="text-sm text-text-secondary uppercase tracking-wider mb-4 font-light">
                  Permissions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {viewAdmin.permissions.map((perm, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-black border border-white/5 text-xs text-gray-300 font-light"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button
                onClick={() => setViewAdmin(null)}
                className="px-6 py-2 bg-white/5 text-white font-light hover:bg-gray-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminsManagement;
