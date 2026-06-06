import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Eye,
  Lock,
} from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  resource: string;
  details: string;
  ip: string;
  status: 'success' | 'warning' | 'error';
  changes?: {
    before: Record<string, unknown>;
    after: Record<string, unknown>;
  };
}

const AuditLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [viewLog, setViewLog] = useState<AuditLog | null>(null);

  const [logs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: '2024-11-15 10:30:25',
      user: 'Super Admin',
      userRole: 'super_admin',
      action: 'UPDATE',
      resource: 'SystemSettings',
      details: 'Modification des paramètres SMTP',
      ip: '192.168.1.100',
      status: 'success',
      changes: {
        before: { smtp_port: 465 },
        after: { smtp_port: 587 },
      },
    },
    {
      id: '2',
      timestamp: '2024-11-15 10:15:42',
      user: 'Jean Kouassi',
      userRole: 'admin',
      action: 'CREATE',
      resource: 'Product',
      details: 'Ajout d\'un nouveau produit "Nike Air Max 2024"',
      ip: '192.168.1.105',
      status: 'success',
    },
    {
      id: '3',
      timestamp: '2024-11-15 09:50:18',
      user: 'Marie Diabate',
      userRole: 'admin',
      action: 'DELETE',
      resource: 'Product',
      details: 'Suppression du produit "Ancienne collection"',
      ip: '192.168.1.110',
      status: 'success',
    },
    {
      id: '4',
      timestamp: '2024-11-15 09:30:05',
      user: 'Utilisateur Inconnu',
      userRole: 'unknown',
      action: 'LOGIN_FAILED',
      resource: 'Authentication',
      details: 'Tentative de connexion échouée - Mot de passe incorrect',
      ip: '185.234.56.78',
      status: 'warning',
    },
    {
      id: '5',
      timestamp: '2024-11-15 09:00:00',
      user: 'System',
      userRole: 'system',
      action: 'BACKUP',
      resource: 'Database',
      details: 'Sauvegarde automatique de la base de données',
      ip: '127.0.0.1',
      status: 'success',
    },
    {
      id: '6',
      timestamp: '2024-11-15 08:45:32',
      user: 'Super Admin',
      userRole: 'super_admin',
      action: 'UPDATE',
      resource: 'Admin',
      details: 'Suspension du compte admin "test@example.com"',
      ip: '192.168.1.100',
      status: 'success',
      changes: {
        before: { status: 'active' },
        after: { status: 'suspended' },
      },
    },
    {
      id: '7',
      timestamp: '2024-11-15 08:20:15',
      user: 'Yao Kouadio',
      userRole: 'admin',
      action: 'UPDATE',
      resource: 'Store',
      details: "Modification des horaires d'ouverture",
      ip: '192.168.1.115',
      status: 'success',
    },
    {
      id: '8',
      timestamp: '2024-11-15 07:55:44',
      user: 'System',
      userRole: 'system',
      action: 'PAYMENT_FAILED',
      resource: 'Subscription',
      details: "Échec du paiement pour l'abonnement #SUB-1234",
      ip: '127.0.0.1',
      status: 'error',
    },
    {
      id: '9',
      timestamp: '2024-11-15 07:30:20',
      user: 'Modérateur Site',
      userRole: 'moderator',
      action: 'UPDATE',
      resource: 'Event',
      details: 'Publication d\'un nouvel événement "Black Friday 2024"',
      ip: '192.168.1.120',
      status: 'success',
    },
    {
      id: '10',
      timestamp: '2024-11-15 07:00:00',
      user: 'System',
      userRole: 'system',
      action: 'CLEANUP',
      resource: 'TempFiles',
      details: 'Nettoyage automatique des fichiers temporaires',
      ip: '127.0.0.1',
      status: 'success',
    },
  ]);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action.includes(actionFilter.toUpperCase());
    const matchesUser = userFilter === 'all' || log.userRole === userFilter;
    return matchesSearch && matchesAction && matchesUser;
  });

  const getActionIcon = (action: string) => {
    if (action === 'CREATE') return <Plus className="w-4 h-4" strokeWidth={1.5} />;
    if (action === 'UPDATE') return <Edit className="w-4 h-4" strokeWidth={1.5} />;
    if (action === 'DELETE') return <Trash2 className="w-4 h-4" strokeWidth={1.5} />;
    if (action.includes('LOGIN')) return <Lock className="w-4 h-4" strokeWidth={1.5} />;
    if (action.includes('VIEW')) return <Eye className="w-4 h-4" strokeWidth={1.5} />;
    return <FileText className="w-4 h-4" strokeWidth={1.5} />;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'success')
      return <CheckCircle className="w-5 h-5 text-green-500" strokeWidth={1.5} />;
    if (status === 'warning')
      return <AlertCircle className="w-5 h-5 text-orange-500" strokeWidth={1.5} />;
    return <XCircle className="w-5 h-5 text-red-500" strokeWidth={1.5} />;
  };

  const getStatusBadge = (status: string) => {
    if (status === 'success') return 'bg-green-900 text-green-100 border-green-800';
    if (status === 'warning') return 'bg-orange-900 text-orange-100 border-orange-800';
    return 'bg-red-900 text-red-100 border-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-white mb-2 tracking-tight">Journal d'Audit</h1>
          <p className="text-text-secondary font-light">
            Historique complet des actions système et utilisateurs
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white text-cosmos-night font-light hover:bg-cosmos-cream transition-colors">
          <Download className="w-5 h-5" strokeWidth={1.5} />
          Exporter les logs
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-cosmos-night border border-white/5 p-6">
          <div className="text-3xl font-light text-white mb-2 tracking-tight">{logs.length}</div>
          <div className="text-sm text-text-secondary font-light">Total Actions</div>
        </div>
        <div className="bg-cosmos-night border border-white/5 p-6">
          <div className="text-3xl font-light text-green-500 mb-2 tracking-tight">
            {logs.filter((l) => l.status === 'success').length}
          </div>
          <div className="text-sm text-text-secondary font-light">Succès</div>
        </div>
        <div className="bg-cosmos-night border border-white/5 p-6">
          <div className="text-3xl font-light text-orange-500 mb-2 tracking-tight">
            {logs.filter((l) => l.status === 'warning').length}
          </div>
          <div className="text-sm text-text-secondary font-light">Avertissements</div>
        </div>
        <div className="bg-cosmos-night border border-white/5 p-6">
          <div className="text-3xl font-light text-red-500 mb-2 tracking-tight">
            {logs.filter((l) => l.status === 'error').length}
          </div>
          <div className="text-sm text-text-secondary font-light">Erreurs</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-cosmos-night border border-white/5 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

          {/* Action Filter */}
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
          >
            <option value="all">Toutes les actions</option>
            <option value="create">Créations</option>
            <option value="update">Modifications</option>
            <option value="delete">Suppressions</option>
            <option value="login">Connexions</option>
          </select>

          {/* User Filter */}
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
          >
            <option value="all">Tous les utilisateurs</option>
            <option value="super_admin">Super Admins</option>
            <option value="admin">Administrateurs</option>
            <option value="moderator">Modérateurs</option>
            <option value="system">Système</option>
          </select>

          {/* Date Range */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
          >
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="all">Tout l'historique</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-cosmos-night border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-xs font-light text-text-secondary uppercase tracking-wider">
                  Statut
                </th>
                <th className="text-left px-6 py-4 text-xs font-light text-text-secondary uppercase tracking-wider">
                  Date & Heure
                </th>
                <th className="text-left px-6 py-4 text-xs font-light text-text-secondary uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="text-left px-6 py-4 text-xs font-light text-text-secondary uppercase tracking-wider">
                  Action
                </th>
                <th className="text-left px-6 py-4 text-xs font-light text-text-secondary uppercase tracking-wider">
                  Ressource
                </th>
                <th className="text-left px-6 py-4 text-xs font-light text-text-secondary uppercase tracking-wider">
                  Détails
                </th>
                <th className="text-left px-6 py-4 text-xs font-light text-text-secondary uppercase tracking-wider">
                  IP
                </th>
                <th className="text-right px-6 py-4 text-xs font-light text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-white/5 hover:bg-black transition-colors"
                >
                  <td className="px-6 py-4">{getStatusIcon(log.status)}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white font-light">{log.timestamp}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white font-light">{log.user}</div>
                    <div className="text-xs text-text-secondary font-light capitalize">
                      {log.userRole.replace('_', ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-black border border-white/5">
                        {getActionIcon(log.action)}
                      </div>
                      <span className="text-sm text-white font-light">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-white font-light">{log.resource}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-secondary font-light max-w-md truncate">
                      {log.details}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-text-secondary font-mono">{log.ip}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => setViewLog(log)}
                        className="p-2 hover:bg-white/5 transition-colors"
                        title="Voir détails"
                      >
                        <Eye className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Log Modal */}
      {viewLog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-cosmos-night border border-white/5 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-white tracking-tight">Détails du Log</h2>
                <span
                  className={`inline-block px-3 py-1 text-xs border ${getStatusBadge(viewLog.status)} font-light`}
                >
                  {viewLog.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm text-text-secondary uppercase tracking-wider mb-2 font-light">
                    Date & Heure
                  </h3>
                  <p className="text-white font-light">{viewLog.timestamp}</p>
                </div>
                <div>
                  <h3 className="text-sm text-text-secondary uppercase tracking-wider mb-2 font-light">
                    Utilisateur
                  </h3>
                  <p className="text-white font-light">{viewLog.user}</p>
                  <p className="text-sm text-text-secondary font-light capitalize">
                    {viewLog.userRole.replace('_', ' ')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm text-text-secondary uppercase tracking-wider mb-2 font-light">
                    Action
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-black border border-white/5">
                      {getActionIcon(viewLog.action)}
                    </div>
                    <p className="text-white font-light">{viewLog.action}</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm text-text-secondary uppercase tracking-wider mb-2 font-light">
                    Ressource
                  </h3>
                  <p className="text-white font-light">{viewLog.resource}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm text-text-secondary uppercase tracking-wider mb-2 font-light">
                  Détails
                </h3>
                <p className="text-white font-light">{viewLog.details}</p>
              </div>

              <div>
                <h3 className="text-sm text-text-secondary uppercase tracking-wider mb-2 font-light">
                  Adresse IP
                </h3>
                <p className="text-white font-mono font-light">{viewLog.ip}</p>
              </div>

              {/* Changes */}
              {viewLog.changes && (
                <div>
                  <h3 className="text-sm text-text-secondary uppercase tracking-wider mb-4 font-light">
                    Modifications
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black border border-white/5 p-4">
                      <h4 className="text-xs text-text-secondary uppercase tracking-wider mb-2 font-light">
                        Avant
                      </h4>
                      <pre className="text-sm text-white font-mono overflow-x-auto">
                        {JSON.stringify(viewLog.changes.before, null, 2)}
                      </pre>
                    </div>
                    <div className="bg-black border border-white/5 p-4">
                      <h4 className="text-xs text-text-secondary uppercase tracking-wider mb-2 font-light">
                        Après
                      </h4>
                      <pre className="text-sm text-white font-mono overflow-x-auto">
                        {JSON.stringify(viewLog.changes.after, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/5 flex justify-end">
              <button
                onClick={() => setViewLog(null)}
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

export default AuditLogs;
