import React from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Heart, MessageSquare, ShoppingCart, Users, Calendar, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePublications } from '../../hooks/usePublications';
import { usePromotions } from '../../hooks/usePromotions';

const StoreDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { publications } = usePublications({ storeId: profile?.store_id || undefined });
  const { promotions } = usePromotions({ storeId: profile?.store_id || undefined });

  const totalViews = publications.reduce((sum, p) => sum + p.views, 0);
  const totalLikes = publications.reduce((sum, p) => sum + p.likes, 0);
  const activePromos = promotions.filter((p) => p.is_active).length;

  // Statistiques
  const stats = [
    {
      label: t('store.dashboard.viewsThisWeek', 'Vues cette semaine'),
      value: String(totalViews),
      icon: Eye,
      change: '',
      color: 'text-cosmos-night',
      bg: 'bg-cosmos-gold/10',
    },
    {
      label: t('store.dashboard.likes', 'Likes'),
      value: String(totalLikes),
      icon: Heart,
      change: '',
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: t('store.dashboard.messages', 'Messages'),
      value: String(publications.length),
      icon: MessageSquare,
      change: '',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: t('store.dashboard.conversion', 'Conversion'),
      value: `${activePromos}`,
      icon: ShoppingCart,
      change: '',
      color: 'text-cosmos-gold',
      bg: 'bg-cosmos-gold/5',
    },
  ];

  // Publications récentes
  const recentPosts = [
    {
      id: 1,
      title: 'Nouvelle collection Printemps',
      status: 'approved',
      views: 1234,
      likes: 89,
      date: '2024-10-20',
    },
    { id: 2, title: 'Soldes -30%', status: 'pending', views: 0, likes: 0, date: '2024-10-23' },
    {
      id: 3,
      title: 'Événement VIP',
      status: 'approved',
      views: 890,
      likes: 67,
      date: '2024-10-18',
    },
  ];

  // Événements à venir
  const upcomingEvents = [
    { id: 1, title: 'Fashion Show 2025', date: '2024-11-15', attendees: 45 },
    { id: 2, title: 'Soldes Black Friday', date: '2024-11-29', attendees: 0 },
  ];

  // Commentaires récents
  const recentComments = [
    {
      id: 1,
      user: 'Marie D.',
      comment: 'Superbe collection ! Quand arrivent les nouveaux modèles ?',
      time: 'Il y a 2h',
      rating: 5,
    },
    {
      id: 2,
      user: 'Jean K.',
      comment: 'Service client excellent, je recommande !',
      time: 'Il y a 5h',
      rating: 5,
    },
    {
      id: 3,
      user: 'Sophie M.',
      comment: 'Très bons prix pendant les soldes',
      time: 'Il y a 1j',
      rating: 4,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-emerald-600 bg-emerald-50 border-green-200';
      case 'pending':
        return 'text-amber-600 bg-amber-50 border-orange-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-text-secondary bg-cosmos-cream/50 border-cosmos-cream';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-cosmos-night mb-2 tracking-tight">
          {t('store.dashboard.title', 'Tableau de bord')}
        </h1>
        <p className="text-text-secondary font-light">
          {t('store.dashboard.subtitle', 'Aperçu de la performance de votre boutique')}
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
              <span className="text-emerald-600 text-sm font-light">{stat.change}</span>
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
        {/* Publications récentes */}
        <div className="bg-white border border-cosmos-cream">
          <div className="p-6 border-b border-cosmos-cream">
            <h2 className="text-xl font-light text-cosmos-night tracking-tight">
              {t('store.dashboard.recentPublications', 'Publications Récentes')}
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentPosts.map((post) => (
              <div key={post.id} className="p-4 hover:bg-cosmos-cream/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm text-cosmos-night font-light mb-1">{post.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-text-secondary font-light">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" strokeWidth={1.5} />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" strokeWidth={1.5} />
                        {post.likes}
                      </span>
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 ${getStatusColor(post.status)} border font-light`}
                  >
                    {post.status === 'approved'
                      ? t('store.dashboard.statusApproved', 'Approuvé')
                      : post.status === 'pending'
                        ? t('store.dashboard.statusPending', 'En attente')
                        : t('store.dashboard.statusRejected', 'Refusé')}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-cosmos-cream">
            <button className="w-full text-center text-sm text-text-secondary hover:text-cosmos-night font-light">
              {t('store.dashboard.viewAllPublications', 'Voir toutes les publications')} →
            </button>
          </div>
        </div>

        {/* Événements à venir */}
        <div className="bg-white border border-cosmos-cream">
          <div className="p-6 border-b border-cosmos-cream">
            <h2 className="text-xl font-light text-cosmos-night tracking-tight">
              {t('store.dashboard.upcomingEvents', 'Événements à Venir')}
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="p-4 hover:bg-cosmos-cream/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Calendar
                      className="w-5 h-5 text-cosmos-gold flex-shrink-0 mt-0.5"
                      strokeWidth={1.5}
                    />
                    <div>
                      <h3 className="text-sm text-cosmos-night font-light mb-1">{event.title}</h3>
                      <div className="flex items-center gap-3 text-xs text-text-secondary font-light">
                        <span>{event.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" strokeWidth={1.5} />
                          {event.attendees} {t('store.dashboard.participants', 'participants')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-cosmos-cream">
            <button className="w-full text-center text-sm text-text-secondary hover:text-cosmos-night font-light">
              {t('store.dashboard.viewAllEvents', 'Voir tous les événements')} →
            </button>
          </div>
        </div>
      </div>

      {/* Commentaires récents */}
      <div className="bg-white border border-cosmos-cream">
        <div className="p-6 border-b border-cosmos-cream">
          <h2 className="text-xl font-light text-cosmos-night tracking-tight">
            {t('store.dashboard.recentComments', 'Commentaires Récents')}
          </h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentComments.map((comment) => (
            <div key={comment.id} className="p-4 hover:bg-cosmos-cream/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-cosmos-night font-light">{comment.user}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: comment.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 text-yellow-500 fill-yellow-500"
                          strokeWidth={1.5}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-cosmos-night font-light mb-1">{comment.comment}</p>
                  <span className="text-xs text-text-secondary font-light">{comment.time}</span>
                </div>
                <button className="text-xs text-text-secondary hover:text-cosmos-night font-light border border-cosmos-cream px-3 py-1">
                  {t('store.dashboard.reply', 'Répondre')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Graphiques (placeholder) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-cosmos-cream p-6">
          <h3 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
            {t('store.dashboard.viewsLast30Days', 'Vues des 30 derniers jours')}
          </h3>
          <div className="h-64 flex items-center justify-center border border-cosmos-cream">
            <span className="text-text-secondary font-light">
              {t('store.dashboard.chartPlaceholder', 'Graphique à implémenter')}
            </span>
          </div>
        </div>
        <div className="bg-white border border-cosmos-cream p-6">
          <h3 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
            {t('store.dashboard.engagementByContentType', 'Engagement par type de contenu')}
          </h3>
          <div className="h-64 flex items-center justify-center border border-cosmos-cream">
            <span className="text-text-secondary font-light">
              {t('store.dashboard.chartPlaceholder', 'Graphique à implémenter')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboard;
