import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  Users,
  Calendar,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { useStores } from '../../hooks/useStores';
import { useUsers } from '../../hooks/useUsers';
import { useEvents } from '../../hooks/useEvents';
import { usePublications } from '../../hooks/usePublications';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { stores } = useStores({ status: 'active' });
  const { users } = useUsers();
  const { events } = useEvents({ status: 'upcoming' });
  const { publications } = usePublications({ status: 'pending' });

  // Statistiques
  const stats = [
    {
      label: t('admin.dashboard.stats.activeStores', 'Boutiques Actives'),
      value: String(stores.length),
      icon: Store,
      change: '',
      color: 'text-cosmos-night',
      bg: 'bg-cosmos-gold/10',
    },
    {
      label: t('admin.dashboard.stats.users', 'Utilisateurs'),
      value: String(users.length),
      icon: Users,
      change: '',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: t('admin.dashboard.stats.upcomingEvents', 'Evenements a venir'),
      value: String(events.length),
      icon: Calendar,
      change: '',
      color: 'text-cosmos-gold',
      bg: 'bg-cosmos-gold/5',
    },
    {
      label: t('admin.dashboard.stats.pendingPublications', 'Publications en attente'),
      value: String(publications.length),
      icon: FileText,
      change: '',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  // Build moderation items from real publications if available, otherwise use translated mock data
  const pendingModeration = useMemo(() => {
    if (publications.length > 0) {
      return publications.slice(0, 4).map((pub, index) => ({
        id: index + 1,
        type: t('admin.dashboard.types.publication', 'Publication'),
        title:
          ((pub as Record<string, unknown>).title as string) ||
          t('admin.dashboard.moderation.untitled', 'Sans titre'),
        store:
          ((pub as Record<string, unknown>).store_name as string) ||
          t('admin.dashboard.moderation.unknownStore', 'Boutique inconnue'),
        time: t('admin.dashboard.time.recently', 'Recemment'),
        status: 'pending',
      }));
    }
    return [
      {
        id: 1,
        type: t('admin.dashboard.types.store', 'Boutique'),
        title: t('admin.dashboard.moderation.item1', 'Nike Store - Nouvelle promotion'),
        store: 'Nike Store',
        time: t('admin.dashboard.time.minutesAgo', 'Il y a {{count}} min', { count: 15 }),
        status: 'pending',
      },
      {
        id: 2,
        type: t('admin.dashboard.types.event', 'Evenement'),
        title: t('admin.dashboard.moderation.item2', 'Fashion Week 2025'),
        store: 'Zara Fashion',
        time: t('admin.dashboard.time.hoursAgo', 'Il y a {{count}}h', { count: 1 }),
        status: 'pending',
      },
      {
        id: 3,
        type: t('admin.dashboard.types.publication', 'Publication'),
        title: t('admin.dashboard.moderation.item3', 'Soldes de printemps'),
        store: 'H&M',
        time: t('admin.dashboard.time.hoursAgo', 'Il y a {{count}}h', { count: 2 }),
        status: 'pending',
      },
      {
        id: 4,
        type: t('admin.dashboard.types.store', 'Boutique'),
        title: t('admin.dashboard.moderation.item4', 'Mise a jour catalogue'),
        store: 'Adidas',
        time: t('admin.dashboard.time.hoursAgo', 'Il y a {{count}}h', { count: 3 }),
        status: 'pending',
      },
    ];
  }, [publications, t]);

  // Build activity feed from real data if available, otherwise use translated mock data
  const recentActivity = useMemo(() => {
    const dynamicItems: {
      action: string;
      detail: string;
      time: string;
      icon: typeof CheckCircle;
      color: string;
    }[] = [];

    // Add recent stores as activity
    if (stores.length > 0) {
      const latestStore = stores[0] as Record<string, unknown>;
      dynamicItems.push({
        action: t('admin.dashboard.activity.storeApproved', 'Nouvelle boutique approuvee'),
        detail:
          (latestStore.name as string) ||
          t('admin.dashboard.activity.newStore', 'Nouvelle boutique'),
        time: t('admin.dashboard.time.recently', 'Recemment'),
        icon: CheckCircle,
        color: 'text-emerald-600',
      });
    }

    // Add recent events as activity
    if (events.length > 0) {
      const latestEvent = events[0] as Record<string, unknown>;
      dynamicItems.push({
        action: t('admin.dashboard.activity.eventPublished', 'Evenement publie'),
        detail:
          (latestEvent.title as string) ||
          (latestEvent.name as string) ||
          t('admin.dashboard.activity.newEvent', 'Nouvel evenement'),
        time: t('admin.dashboard.time.recently', 'Recemment'),
        icon: Calendar,
        color: 'text-cosmos-night',
      });
    }

    // Add recent publications as activity
    if (publications.length > 0) {
      const latestPub = publications[0] as Record<string, unknown>;
      dynamicItems.push({
        action: t('admin.dashboard.activity.newPublication', 'Nouvelle publication en attente'),
        detail:
          (latestPub.title as string) ||
          t('admin.dashboard.activity.pendingReview', 'En attente de revision'),
        time: t('admin.dashboard.time.recently', 'Recemment'),
        icon: FileText,
        color: 'text-amber-600',
      });
    }

    if (dynamicItems.length > 0) {
      return dynamicItems;
    }

    // Fallback to translated mock data
    return [
      {
        action: t('admin.dashboard.activity.storeApproved', 'Nouvelle boutique approuvee'),
        detail: 'La Parisienne',
        time: t('admin.dashboard.time.minutesAgo', 'Il y a {{count}} min', { count: 30 }),
        icon: CheckCircle,
        color: 'text-emerald-600',
      },
      {
        action: t('admin.dashboard.activity.eventPublished', 'Evenement publie'),
        detail: 'Concert Live @ Cosmos',
        time: t('admin.dashboard.time.hoursAgo', 'Il y a {{count}}h', { count: 1 }),
        icon: Calendar,
        color: 'text-cosmos-night',
      },
      {
        action: t('admin.dashboard.activity.publicationRejected', 'Publication refusee'),
        detail: t('admin.dashboard.activity.nonCompliant', 'Contenu non conforme'),
        time: t('admin.dashboard.time.hoursAgo', 'Il y a {{count}}h', { count: 2 }),
        icon: AlertCircle,
        color: 'text-red-600',
      },
      {
        action: t('admin.dashboard.activity.commentFlagged', 'Commentaire signale'),
        detail: t('admin.dashboard.activity.flaggedByUsers', 'Par {{count}} utilisateurs', {
          count: 3,
        }),
        time: t('admin.dashboard.time.hoursAgo', 'Il y a {{count}}h', { count: 3 }),
        icon: MessageSquare,
        color: 'text-amber-600',
      },
    ];
  }, [stores, events, publications, t]);

  // Mock traffic data for last 7 days bar chart
  const trafficData = [
    { day: t('admin.dashboard.charts.mon', 'Lun'), value: 320 },
    { day: t('admin.dashboard.charts.tue', 'Mar'), value: 480 },
    { day: t('admin.dashboard.charts.wed', 'Mer'), value: 390 },
    { day: t('admin.dashboard.charts.thu', 'Jeu'), value: 520 },
    { day: t('admin.dashboard.charts.fri', 'Ven'), value: 680 },
    { day: t('admin.dashboard.charts.sat', 'Sam'), value: 750 },
    { day: t('admin.dashboard.charts.sun', 'Dim'), value: 430 },
  ];
  const maxTraffic = Math.max(...trafficData.map((d) => d.value));

  // Stores by category data
  const categoryData = [
    { category: t('admin.dashboard.charts.fashion', 'Mode'), value: 35, color: 'bg-cosmos-night' },
    {
      category: t('admin.dashboard.charts.food', 'Restauration'),
      value: 22,
      color: 'bg-cosmos-gold',
    },
    {
      category: t('admin.dashboard.charts.electronics', 'Electronique'),
      value: 15,
      color: 'bg-emerald-500',
    },
    { category: t('admin.dashboard.charts.beauty', 'Beaute'), value: 12, color: 'bg-amber-500' },
    { category: t('admin.dashboard.charts.services', 'Services'), value: 10, color: 'bg-blue-500' },
    { category: t('admin.dashboard.charts.other', 'Autres'), value: 6, color: 'bg-gray-400' },
  ];
  const maxCategory = Math.max(...categoryData.map((d) => d.value));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-cosmos-night mb-2 tracking-tight">
          {t('admin.dashboard.title', 'Tableau de bord Admin')}
        </h1>
        <p className="text-text-secondary font-light">
          {t('admin.dashboard.subtitle', "Apercu de l'activite du centre commercial")}
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-cosmos-cream p-6 hover:border-cosmos-cream transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} strokeWidth={1.5} />
              </div>
              <span className="text-emerald-600 text-sm font-light">+{stat.change}</span>
            </div>
            <div className="text-3xl font-light text-cosmos-night mb-1 tracking-tight">
              {stat.value}
            </div>
            <div className="text-xs text-text-secondary uppercase tracking-wider font-light">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Moderation en attente */}
        <div className="bg-white border border-cosmos-cream">
          <div className="p-6 border-b border-cosmos-cream">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
                <h2 className="text-xl font-light text-cosmos-night tracking-tight">
                  {t('admin.dashboard.pendingModeration', 'Moderation en attente')}
                </h2>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-amber-600 text-sm font-light border border-orange-200">
                {pendingModeration.length}
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingModeration.map((item) => (
              <div key={item.id} className="p-4 hover:bg-cosmos-cream/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 bg-cosmos-cream text-cosmos-night font-light border border-cosmos-cream">
                        {item.type}
                      </span>
                      <span className="text-xs text-text-secondary font-light">{item.time}</span>
                    </div>
                    <h3 className="text-sm text-cosmos-night font-light mb-1">{item.title}</h3>
                    <p className="text-xs text-text-secondary font-light">{item.store}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-emerald-50 border border-cosmos-cream hover:border-green-600 transition-colors">
                      <CheckCircle className="w-4 h-4 text-emerald-600" strokeWidth={1.5} />
                    </button>
                    <button className="p-2 hover:bg-red-50 border border-cosmos-cream hover:border-red-600 transition-colors">
                      <AlertCircle className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-cosmos-cream">
            <button
              onClick={() => navigate('/admin/moderation')}
              className="w-full text-center text-sm text-text-secondary hover:text-cosmos-night font-light"
            >
              {t('admin.dashboard.viewAllModerations', 'Voir toutes les moderations')} &rarr;
            </button>
          </div>
        </div>

        {/* Activite recente */}
        <div className="bg-white border border-cosmos-cream">
          <div className="p-6 border-b border-cosmos-cream">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cosmos-night" strokeWidth={1.5} />
              <h2 className="text-xl font-light text-cosmos-night tracking-tight">
                {t('admin.dashboard.recentActivity', 'Activite Recente')}
              </h2>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.map((activity, index) => (
              <div key={index} className="p-4 hover:bg-cosmos-cream/50 transition-colors">
                <div className="flex items-start gap-3">
                  <activity.icon
                    className={`w-5 h-5 ${activity.color} flex-shrink-0 mt-0.5`}
                    strokeWidth={1.5}
                  />
                  <div className="flex-1">
                    <div className="text-sm text-cosmos-night font-light mb-1">
                      {activity.action}
                    </div>
                    <div className="text-xs text-text-secondary font-light">{activity.detail}</div>
                  </div>
                  <span className="text-xs text-text-secondary font-light">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Last 7 Days - Vertical Bar Chart */}
        <div className="bg-white border border-cosmos-cream p-6">
          <h3 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
            {t('admin.dashboard.charts.trafficLast7Days', 'Trafic des 7 derniers jours')}
          </h3>
          <div className="h-64 flex items-end justify-between gap-3 px-2">
            {trafficData.map((data, index) => {
              const heightPercent = (data.value / maxTraffic) * 100;
              const barColors = [
                'bg-cosmos-night/70',
                'bg-cosmos-night/80',
                'bg-cosmos-night/70',
                'bg-cosmos-night/80',
                'bg-cosmos-gold',
                'bg-cosmos-gold',
                'bg-cosmos-night/60',
              ];
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-text-secondary font-light">{data.value}</span>
                  <div className="w-full flex justify-center" style={{ height: '180px' }}>
                    <div
                      className={`w-full max-w-[40px] ${barColors[index]} transition-all duration-500 ease-out hover:opacity-80`}
                      style={{ height: `${heightPercent}%`, marginTop: 'auto' }}
                    />
                  </div>
                  <span className="text-xs text-text-secondary font-light">{data.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stores by Category - Horizontal Bar Chart */}
        <div className="bg-white border border-cosmos-cream p-6">
          <h3 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
            {t('admin.dashboard.charts.storesByCategory', 'Boutiques par categorie')}
          </h3>
          <div className="h-64 flex flex-col justify-between py-2">
            {categoryData.map((data, index) => {
              const widthPercent = (data.value / maxCategory) * 100;
              return (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs text-text-secondary font-light w-24 text-right flex-shrink-0">
                    {data.category}
                  </span>
                  <div className="flex-1 h-6 bg-cosmos-cream/50 relative">
                    <div
                      className={`h-full ${data.color} transition-all duration-500 ease-out hover:opacity-80`}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-cosmos-night font-light w-8 flex-shrink-0">
                    {data.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
