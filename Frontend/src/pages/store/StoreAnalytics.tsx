import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageSquare,
  Users,
  ShoppingCart,
  Download,
} from 'lucide-react';

const StoreAnalytics: React.FC = () => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState('7days');

  // Données statistiques
  const stats = [
    {
      label: t('store.analytics.totalViews', 'Vues totales'),
      value: '12,458',
      change: '+15.3%',
      trend: 'up',
      icon: Eye,
      color: 'text-cosmos-night',
      bg: 'bg-cosmos-gold/10',
    },
    {
      label: t('store.analytics.engagement', 'Engagement'),
      value: '8.4%',
      change: '+2.1%',
      trend: 'up',
      icon: Heart,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: t('store.analytics.uniqueVisitors', 'Visiteurs uniques'),
      value: '3,247',
      change: '-3.2%',
      trend: 'down',
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: t('store.analytics.conversionRate', 'Taux de conversion'),
      value: '4.2%',
      change: '+0.8%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-cosmos-gold',
      bg: 'bg-cosmos-gold/5',
    },
  ];

  // Performance des publications
  const topPublications = [
    {
      id: 1,
      title: 'Nouvelle collection Printemps',
      views: 2453,
      likes: 189,
      comments: 45,
      engagement: 9.5,
    },
    { id: 2, title: 'Soldes -30%', views: 1876, likes: 143, comments: 32, engagement: 9.3 },
    { id: 3, title: 'Événement VIP', views: 1654, likes: 98, comments: 23, engagement: 7.3 },
    { id: 4, title: 'Lookbook Été 2025', views: 1432, likes: 87, comments: 19, engagement: 7.4 },
  ];

  // Données démographiques
  const demographics = {
    age: [
      { range: '18-24', percentage: 25 },
      { range: '25-34', percentage: 35 },
      { range: '35-44', percentage: 20 },
      { range: '45-54', percentage: 12 },
      { range: '55+', percentage: 8 },
    ],
    gender: [
      { label: t('store.analytics.women', 'Femmes'), percentage: 68 },
      { label: t('store.analytics.men', 'Hommes'), percentage: 30 },
      { label: t('store.analytics.other', 'Autre'), percentage: 2 },
    ],
  };

  // Sources de trafic
  const trafficSources = [
    {
      source: t('store.analytics.internalSearch', 'Recherche interne'),
      visitors: 4523,
      percentage: 38,
    },
    { source: t('store.analytics.homepage', "Page d'accueil"), visitors: 3245, percentage: 27 },
    {
      source: t('store.analytics.socialNetworks', 'Réseaux sociaux'),
      visitors: 2187,
      percentage: 18,
    },
    { source: t('store.analytics.direct', 'Direct'), visitors: 1456, percentage: 12 },
    { source: t('store.analytics.others', 'Autres'), visitors: 589, percentage: 5 },
  ];

  // Heures de pointe
  const peakHours = [
    { hour: '9h-12h', activity: t('store.analytics.activityAverage', 'Moyenne'), value: 45 },
    { hour: '12h-15h', activity: t('store.analytics.activityHigh', 'Élevée'), value: 75 },
    { hour: '15h-18h', activity: t('store.analytics.activityVeryHigh', 'Très élevée'), value: 95 },
    { hour: '18h-21h', activity: t('store.analytics.activityHigh', 'Élevée'), value: 80 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-cosmos-night mb-2 tracking-tight">
            {t('store.analytics.title', 'Analytics')}
          </h1>
          <p className="text-text-secondary font-light">
            {t('store.analytics.subtitle', 'Analysez la performance de votre boutique')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-sm"
          >
            <option value="7days">{t('store.analytics.last7days', '7 derniers jours')}</option>
            <option value="30days">{t('store.analytics.last30days', '30 derniers jours')}</option>
            <option value="90days">{t('store.analytics.last90days', '90 derniers jours')}</option>
            <option value="year">{t('store.analytics.thisYear', 'Cette année')}</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors">
            <Download className="w-4 h-4" strokeWidth={1.5} />
            {t('store.analytics.export', 'Exporter')}
          </button>
        </div>
      </div>

      {/* Statistiques principales */}
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
              <div
                className={`flex items-center gap-1 text-sm font-light ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
                ) : (
                  <TrendingDown className="w-4 h-4" strokeWidth={1.5} />
                )}
                {stat.change}
              </div>
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

      {/* Graphique principal */}
      <div className="bg-white border border-cosmos-cream p-6">
        <h2 className="text-xl font-light text-cosmos-night mb-6 tracking-tight">
          {t('store.analytics.viewsEvolution', 'Évolution des Vues')}
        </h2>
        <div className="h-80 flex items-center justify-center border border-cosmos-cream">
          <span className="text-text-secondary font-light">
            {t(
              'store.analytics.chartPlaceholder',
              'Graphique à implémenter (Chart.js ou Recharts)'
            )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Publications les plus performantes */}
        <div className="bg-white border border-cosmos-cream p-6">
          <h2 className="text-xl font-light text-cosmos-night mb-6 tracking-tight">
            {t('store.analytics.topPublications', 'Publications les Plus Performantes')}
          </h2>
          <div className="space-y-4">
            {topPublications.map((pub) => (
              <div
                key={pub.id}
                className="p-4 border border-cosmos-cream hover:border-cosmos-cream transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-sm font-light text-cosmos-night">{pub.title}</h3>
                  <span className="text-xs font-light text-emerald-600">
                    {pub.engagement}% {t('store.analytics.engagement', 'engagement')}
                  </span>
                </div>
                <div className="flex items-center gap-6 text-xs text-text-secondary font-light">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" strokeWidth={1.5} />
                    {pub.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" strokeWidth={1.5} />
                    {pub.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" strokeWidth={1.5} />
                    {pub.comments}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sources de trafic */}
        <div className="bg-white border border-cosmos-cream p-6">
          <h2 className="text-xl font-light text-cosmos-night mb-6 tracking-tight">
            {t('store.analytics.trafficSources', 'Sources de Trafic')}
          </h2>
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-light text-cosmos-night">{source.source}</span>
                  <span className="text-sm font-light text-text-secondary">
                    {source.visitors.toLocaleString()} ({source.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2">
                  <div
                    className="bg-gray-900 h-2 transition-all duration-500"
                    style={{ width: `${source.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Démographie - Âge */}
        <div className="bg-white border border-cosmos-cream p-6">
          <h2 className="text-xl font-light text-cosmos-night mb-6 tracking-tight">
            {t('store.analytics.ageDistribution', 'Répartition par Âge')}
          </h2>
          <div className="space-y-4">
            {demographics.age.map((group, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-light text-cosmos-night">
                    {group.range} {t('store.analytics.years', 'ans')}
                  </span>
                  <span className="text-sm font-light text-text-secondary">
                    {group.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2">
                  <div
                    className="bg-cosmos-night h-2 transition-all duration-500"
                    style={{ width: `${group.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Démographie - Genre */}
        <div className="bg-white border border-cosmos-cream p-6">
          <h2 className="text-xl font-light text-cosmos-night mb-6 tracking-tight">
            {t('store.analytics.genderDistribution', 'Répartition par Genre')}
          </h2>
          <div className="space-y-4">
            {demographics.gender.map((group, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-light text-cosmos-night">{group.label}</span>
                  <span className="text-sm font-light text-text-secondary">
                    {group.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2">
                  <div
                    className="bg-purple-600 h-2 transition-all duration-500"
                    style={{ width: `${group.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heures de pointe */}
      <div className="bg-white border border-cosmos-cream p-6">
        <h2 className="text-xl font-light text-cosmos-night mb-6 tracking-tight">
          {t('store.analytics.peakHours', 'Heures de Pointe')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {peakHours.map((hour, index) => (
            <div key={index} className="p-4 border border-cosmos-cream">
              <div className="text-lg font-light text-cosmos-night mb-2">{hour.hour}</div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-text-secondary font-light">{hour.activity}</span>
                <span className="text-xs text-text-secondary font-light">{hour.value}%</span>
              </div>
              <div className="w-full bg-gray-200 h-1.5">
                <div
                  className={`h-1.5 transition-all duration-500 ${
                    hour.value > 80
                      ? 'bg-green-600'
                      : hour.value > 60
                        ? 'bg-orange-600'
                        : 'bg-gray-600'
                  }`}
                  style={{ width: `${hour.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparaison avec la période précédente */}
      <div className="bg-white border border-cosmos-cream p-6">
        <h2 className="text-xl font-light text-cosmos-night mb-6 tracking-tight">
          {t('store.analytics.periodComparison', 'Comparaison avec la Période Précédente')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              metric: t('store.analytics.views', 'Vues'),
              current: 12458,
              previous: 10823,
              unit: '',
            },
            {
              metric: t('store.analytics.engagement', 'Engagement'),
              current: 8.4,
              previous: 6.3,
              unit: '%',
            },
            {
              metric: t('store.analytics.conversion', 'Conversion'),
              current: 4.2,
              previous: 3.4,
              unit: '%',
            },
          ].map((item, index) => {
            const diff = item.current - item.previous;
            const diffPercentage = ((diff / item.previous) * 100).toFixed(1);
            const isPositive = diff > 0;

            return (
              <div key={index} className="p-4 border border-cosmos-cream">
                <div className="text-sm text-text-secondary font-light mb-2">{item.metric}</div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-light text-cosmos-night mb-1">
                      {item.current.toLocaleString()}
                      {item.unit}
                    </div>
                    <div className="text-xs text-text-secondary font-light">
                      vs {item.previous.toLocaleString()}
                      {item.unit}
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm font-light ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
                    ) : (
                      <TrendingDown className="w-4 h-4" strokeWidth={1.5} />
                    )}
                    {diffPercentage}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoreAnalytics;
