import React from 'react';
import {
  Users,
  Package,
  Activity,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Server,
} from 'lucide-react';

const SuperAdminDashboard: React.FC = () => {
  // Statistiques système
  const systemStats = [
    {
      label: 'Utilisateurs Totaux',
      value: '3,247',
      icon: Users,
      change: '+12%',
      color: 'from-cosmos-night to-cosmos-night/80',
    },
    {
      label: 'Abonnements Actifs',
      value: '156',
      icon: Package,
      change: '+8%',
      color: 'from-green-600 to-emerald-600',
    },
    {
      label: 'Revenus Mensuels',
      value: '45,8M FCFA',
      icon: DollarSign,
      change: '+23%',
      color: 'from-cosmos-night to-cosmos-night/80',
    },
    {
      label: 'Requêtes API',
      value: '1.2M/jour',
      icon: Activity,
      change: '+5%',
      color: 'from-orange-600 to-red-600',
    },
  ];

  // Santé du système
  const systemHealth = [
    { service: 'API Server', status: 'operational', uptime: '99.98%', latency: '45ms' },
    { service: 'Database Primary', status: 'operational', uptime: '99.99%', latency: '12ms' },
    { service: 'CDN', status: 'operational', uptime: '100%', latency: '8ms' },
    { service: 'Payment Gateway', status: 'operational', uptime: '99.95%', latency: '120ms' },
  ];

  // Abonnements par plan
  const subscriptionPlans = [
    { plan: 'Free', count: 89, percentage: 57, revenue: '0 FCFA' },
    { plan: 'Gold', count: 45, percentage: 29, revenue: '11.25M FCFA' },
    { plan: 'Platinum', count: 22, percentage: 14, revenue: '34.5M FCFA' },
  ];

  // Alertes récentes
  const recentAlerts = [
    {
      type: 'warning',
      message: 'Pic de trafic détecté - 150% du trafic normal',
      time: 'Il y a 5 min',
    },
    { type: 'info', message: 'Mise à jour de sécurité disponible', time: 'Il y a 2h' },
    { type: 'success', message: 'Sauvegarde automatique complétée', time: 'Il y a 3h' },
  ];

  // Ressources système
  const systemResources = [
    { name: 'CPU', usage: 45, max: 100, unit: '%' },
    { name: 'RAM', usage: 12.4, max: 32, unit: 'GB' },
    { name: 'Disque', usage: 450, max: 1000, unit: 'GB' },
    { name: 'Bande passante', usage: 2.3, max: 10, unit: 'TB/mois' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-white mb-2 tracking-tight">
          Tableau de bord Super Admin
        </h1>
        <p className="text-text-secondary font-light">
          Vue d'ensemble du système et des opérations
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemStats.map((stat, index) => (
          <div
            key={index}
            className="bg-cosmos-night border border-white/5 p-6 hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <stat.icon className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-green-500 text-sm font-light">{stat.change}</span>
            </div>
            <div className="text-3xl font-light text-white mb-1 tracking-tight">{stat.value}</div>
            <div className="text-xs text-text-secondary uppercase tracking-wider font-light">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Santé du système */}
        <div className="bg-cosmos-night border border-white/5 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-green-500" strokeWidth={1.5} />
            <h2 className="text-xl font-light text-white tracking-tight">Santé du Système</h2>
          </div>
          <div className="space-y-4">
            {systemHealth.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-black border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" strokeWidth={1.5} />
                  <div>
                    <div className="text-sm text-white font-light">{service.service}</div>
                    <div className="text-xs text-text-secondary font-light">
                      Uptime: {service.uptime}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-text-secondary font-light">Latence</div>
                  <div className="text-sm text-white font-light">{service.latency}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Abonnements */}
        <div className="bg-cosmos-night border border-white/5 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-purple-500" strokeWidth={1.5} />
            <h2 className="text-xl font-light text-white tracking-tight">
              Répartition des Abonnements
            </h2>
          </div>
          <div className="space-y-4">
            {subscriptionPlans.map((plan, index) => (
              <div key={index} className="p-4 bg-black border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white font-light">{plan.plan}</span>
                  <span className="text-sm text-text-secondary font-light">
                    {plan.count} utilisateurs
                  </span>
                </div>
                <div className="w-full bg-white/5 h-2 mb-2">
                  <div
                    className="h-2 bg-gradient-to-r from-cosmos-night to-cosmos-night/80"
                    style={{ width: `${plan.percentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-secondary font-light">
                    {plan.percentage}% du total
                  </span>
                  <span className="text-green-500 font-light">{plan.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ressources système */}
      <div className="bg-cosmos-night border border-white/5 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Server className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
          <h2 className="text-xl font-light text-white tracking-tight">Ressources Système</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {systemResources.map((resource, index) => (
            <div key={index} className="p-4 bg-black border border-white/5">
              <div className="text-sm text-text-secondary mb-2 font-light">{resource.name}</div>
              <div className="text-2xl text-white mb-2 font-light tracking-tight">
                {resource.usage}{' '}
                <span className="text-base text-text-secondary">/ {resource.max}</span>
              </div>
              <div className="text-xs text-text-secondary font-light">{resource.unit}</div>
              <div className="w-full bg-white/5 h-1.5 mt-3">
                <div
                  className={`h-1.5 ${
                    (resource.usage / resource.max) * 100 > 80
                      ? 'bg-red-600'
                      : (resource.usage / resource.max) * 100 > 60
                        ? 'bg-orange-600'
                        : 'bg-green-600'
                  }`}
                  style={{ width: `${(resource.usage / resource.max) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alertes récentes */}
      <div className="bg-cosmos-night border border-white/5 p-6">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
          <h2 className="text-xl font-light text-white tracking-tight">Alertes Récentes</h2>
        </div>
        <div className="space-y-3">
          {recentAlerts.map((alert, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-black border border-white/5 hover:border-white/10 transition-colors"
            >
              {alert.type === 'warning' && (
                <AlertTriangle
                  className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
              )}
              {alert.type === 'success' && (
                <CheckCircle
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
              )}
              {alert.type === 'info' && (
                <Activity
                  className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5"
                  strokeWidth={1.5}
                />
              )}
              <div className="flex-1">
                <div className="text-sm text-white font-light">{alert.message}</div>
                <div className="text-xs text-text-secondary font-light mt-1">{alert.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
