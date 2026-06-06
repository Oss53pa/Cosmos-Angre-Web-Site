import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle,
  XCircle,
  Eye,
  Search,
  AlertTriangle,
  FileText,
  Loader2,
  X,
} from 'lucide-react';
import { usePublications } from '../../hooks/usePublications';
import type { Publication } from '../../types/database';

const ModerationPage: React.FC = () => {
  const { t } = useTranslation();
  const { publications, isLoading, error, fetchPublications, updatePublication } =
    usePublications();
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{
    id: string;
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [viewPublication, setViewPublication] = useState<Publication | null>(null);

  // Clear feedback after 3 seconds
  useEffect(() => {
    if (actionFeedback) {
      const timer = setTimeout(() => setActionFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [actionFeedback]);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await updatePublication(id, { status: 'approved' });
      setActionFeedback({
        id,
        type: 'success',
        message: t('admin.moderation.approvedSuccess', 'Publication approved'),
      });
      await fetchPublications();
    } catch {
      setActionFeedback({
        id,
        type: 'error',
        message: t('admin.moderation.approveError', 'Failed to approve'),
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await updatePublication(id, { status: 'rejected' });
      setActionFeedback({
        id,
        type: 'success',
        message: t('admin.moderation.rejectedSuccess', 'Publication rejected'),
      });
      await fetchPublications();
    } catch {
      setActionFeedback({
        id,
        type: 'error',
        message: t('admin.moderation.rejectError', 'Failed to reject'),
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Filter and search publications
  const filteredPublications = useMemo(() => {
    return publications.filter((pub) => {
      const matchesFilter = filter === 'all' || pub.status === filter;
      const matchesSearch =
        searchTerm === '' ||
        pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pub.content && pub.content.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [publications, filter, searchTerm]);

  // Calculate stats from real data
  const today = new Date().toISOString().split('T')[0];
  const pendingCount = publications.filter((p) => p.status === 'pending').length;
  const approvedTodayCount = publications.filter(
    (p) => p.status === 'approved' && p.updated_at && p.updated_at.startsWith(today)
  ).length;
  const rejectedTodayCount = publications.filter(
    (p) => p.status === 'rejected' && p.updated_at && p.updated_at.startsWith(today)
  ).length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-emerald-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-amber-600';
    }
  };

  const stats = [
    {
      label: t('admin.moderation.pending', 'Pending'),
      value: pendingCount,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: t('admin.moderation.approvedToday', 'Approved today'),
      value: approvedTodayCount,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: t('admin.moderation.rejectedToday', 'Rejected today'),
      value: rejectedTodayCount,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: t('admin.moderation.totalPublications', 'Total publications'),
      value: publications.length,
      color: 'text-cosmos-night',
      bg: 'bg-cosmos-gold/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-cosmos-night mb-2 tracking-tight">
          {t('admin.moderation.title', 'Moderation')}
        </h1>
        <p className="text-text-secondary font-light">
          {t('admin.moderation.subtitle', 'Manage publications and content submitted by stores')}
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600" strokeWidth={1.5} />
          <span className="text-sm text-red-600 font-light">{error}</span>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-cosmos-cream p-6">
            <div className={`text-3xl font-light ${stat.color} mb-1 tracking-tight`}>
              {stat.value}
            </div>
            <div className="text-xs text-text-secondary uppercase tracking-wider font-light">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-cosmos-cream p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary"
                strokeWidth={1.5}
              />
              <input
                type="text"
                placeholder={t('common.search', 'Search...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-cosmos-cream text-cosmos-night placeholder-gray-500 focus:outline-none focus:border-cosmos-cream font-light"
              />
            </div>
          </div>
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-3 border border-cosmos-cream text-cosmos-night focus:outline-none focus:border-cosmos-cream font-light"
            >
              <option value="all">{t('admin.moderation.filter.allTypes', 'All statuses')}</option>
              <option value="pending">{t('admin.moderation.pending', 'Pending')}</option>
              <option value="approved">{t('admin.moderation.approved', 'Approved')}</option>
              <option value="rejected">{t('admin.moderation.rejected', 'Rejected')}</option>
              <option value="draft">{t('admin.moderation.draft', 'Draft')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-cosmos-night animate-spin" strokeWidth={1.5} />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredPublications.length === 0 && (
        <div className="bg-white border border-cosmos-cream p-12 text-center">
          <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4" strokeWidth={1} />
          <p className="text-text-secondary font-light">
            {t('admin.moderation.noItems', 'No publications to display')}
          </p>
        </div>
      )}

      {/* Moderation queue */}
      <div className="space-y-4">
        {filteredPublications.map((pub) => (
          <div
            key={pub.id}
            className="bg-white border border-cosmos-cream hover:border-cosmos-cream transition-colors"
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
                    <span className="text-xs px-3 py-1 text-emerald-600 bg-emerald-50 border border-green-200 font-light uppercase tracking-wider">
                      {t('admin.moderation.publication', 'Publication')}
                    </span>
                    <span className={`text-sm font-light ${getStatusColor(pub.status)}`}>
                      {pub.status === 'pending'
                        ? t('admin.moderation.pending', 'Pending')
                        : pub.status === 'approved'
                          ? t('admin.moderation.approved', 'Approved')
                          : pub.status === 'rejected'
                            ? t('admin.moderation.rejected', 'Rejected')
                            : t('admin.moderation.draft', 'Draft')}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-light text-cosmos-night mb-2 tracking-tight">
                    {pub.title}
                  </h3>
                  <p className="text-sm text-text-secondary font-light mb-3">
                    {pub.content
                      ? pub.content.length > 120
                        ? pub.content.substring(0, 120) + '...'
                        : pub.content
                      : t('admin.moderation.noContent', 'No content')}
                  </p>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-text-secondary font-light">
                    {pub.store_id && (
                      <>
                        <span>
                          {t('admin.moderation.storeId', 'Store')}{' '}
                          <span className="text-cosmos-night">{pub.store_id}</span>
                        </span>
                        <span>•</span>
                      </>
                    )}
                    <span>{new Date(pub.created_at).toLocaleString()}</span>
                    <span>•</span>
                    <span>
                      {pub.views} {t('admin.moderation.views', 'views')}
                    </span>
                    <span>•</span>
                    <span>
                      {pub.likes} {t('admin.moderation.likes', 'likes')}
                    </span>
                  </div>

                  {/* Inline feedback */}
                  {actionFeedback && actionFeedback.id === pub.id && (
                    <div
                      className={`mt-2 text-sm font-light ${actionFeedback.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}
                    >
                      {actionFeedback.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 inline mr-1" strokeWidth={1.5} />
                      ) : (
                        <XCircle className="w-4 h-4 inline mr-1" strokeWidth={1.5} />
                      )}
                      {actionFeedback.message}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewPublication(pub)}
                    className="flex items-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                  >
                    <Eye className="w-4 h-4" strokeWidth={1.5} />
                    {t('common.view', 'View')}
                  </button>
                  {pub.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(pub.id)}
                        disabled={actionLoading === pub.id}
                        className="flex items-center gap-2 px-4 py-2 border border-green-200 hover:border-green-600 bg-emerald-50 text-emerald-600 font-light transition-colors disabled:opacity-50"
                      >
                        {actionLoading === pub.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                        ) : (
                          <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                        )}
                        {t('admin.moderation.approve', 'Approve')}
                      </button>
                      <button
                        onClick={() => handleReject(pub.id)}
                        disabled={actionLoading === pub.id}
                        className="flex items-center gap-2 px-4 py-2 border border-red-200 hover:border-red-600 bg-red-50 text-red-600 font-light transition-colors disabled:opacity-50"
                      >
                        {actionLoading === pub.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                        ) : (
                          <XCircle className="w-4 h-4" strokeWidth={1.5} />
                        )}
                        {t('admin.moderation.reject', 'Reject')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View Publication Modal */}
      {viewPublication && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setViewPublication(null)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
                <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                  {t('admin.moderation.publicationDetails', 'Publication Details')}
                </h2>
                <button
                  onClick={() => setViewPublication(null)}
                  className="text-text-secondary hover:text-cosmos-night"
                >
                  <X className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-light text-cosmos-night mb-1 tracking-tight">
                      {viewPublication.title}
                    </h3>
                    <p className="text-sm text-text-secondary font-light">
                      {t('admin.moderation.createdAt', 'Created')}:{' '}
                      {new Date(viewPublication.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 font-light ${
                      viewPublication.status === 'approved'
                        ? 'text-emerald-600 bg-emerald-50 border border-green-200'
                        : viewPublication.status === 'rejected'
                          ? 'text-red-600 bg-red-50 border border-red-200'
                          : viewPublication.status === 'pending'
                            ? 'text-amber-600 bg-amber-50 border border-orange-200'
                            : 'text-text-secondary bg-cosmos-cream/50 border border-cosmos-cream'
                    }`}
                  >
                    {viewPublication.status === 'pending'
                      ? t('admin.moderation.pending', 'Pending')
                      : viewPublication.status === 'approved'
                        ? t('admin.moderation.approved', 'Approved')
                        : viewPublication.status === 'rejected'
                          ? t('admin.moderation.rejected', 'Rejected')
                          : t('admin.moderation.draft', 'Draft')}
                  </span>
                </div>

                {viewPublication.image && (
                  <div className="border border-cosmos-cream overflow-hidden">
                    <img
                      src={viewPublication.image}
                      alt={viewPublication.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                <div className="border-t border-b border-cosmos-cream py-4">
                  <div className="grid grid-cols-2 gap-6">
                    {viewPublication.store_id && (
                      <div>
                        <div className="text-sm text-text-secondary font-light mb-1">
                          {t('admin.moderation.storeId', 'Store')}
                        </div>
                        <div className="font-light text-cosmos-night">
                          {viewPublication.store_id}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="text-sm text-text-secondary font-light mb-1">
                        {t('admin.moderation.views', 'Views')}
                      </div>
                      <div className="font-light text-cosmos-night">{viewPublication.views}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary font-light mb-1">
                        {t('admin.moderation.likes', 'Likes')}
                      </div>
                      <div className="font-light text-cosmos-night">{viewPublication.likes}</div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary font-light mb-1">
                        {t('admin.moderation.lastUpdated', 'Last updated')}
                      </div>
                      <div className="font-light text-cosmos-night">
                        {new Date(viewPublication.updated_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-text-secondary font-light mb-2">
                    {t('admin.moderation.content', 'Content')}
                  </div>
                  <div className="font-light text-cosmos-night whitespace-pre-wrap">
                    {viewPublication.content || t('admin.moderation.noContent', 'No content')}
                  </div>
                </div>

                {viewPublication.status === 'pending' && (
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-cosmos-cream">
                    <button
                      onClick={async () => {
                        await handleApprove(viewPublication.id);
                        setViewPublication(null);
                      }}
                      disabled={actionLoading === viewPublication.id}
                      className="flex items-center gap-2 px-6 py-2 border border-green-200 hover:border-green-600 bg-emerald-50 text-emerald-600 font-light transition-colors disabled:opacity-50"
                    >
                      {actionLoading === viewPublication.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                      ) : (
                        <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                      )}
                      {t('admin.moderation.approve', 'Approve')}
                    </button>
                    <button
                      onClick={async () => {
                        await handleReject(viewPublication.id);
                        setViewPublication(null);
                      }}
                      disabled={actionLoading === viewPublication.id}
                      className="flex items-center gap-2 px-6 py-2 border border-red-200 hover:border-red-600 bg-red-50 text-red-600 font-light transition-colors disabled:opacity-50"
                    >
                      {actionLoading === viewPublication.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" strokeWidth={1.5} />
                      ) : (
                        <XCircle className="w-4 h-4" strokeWidth={1.5} />
                      )}
                      {t('admin.moderation.reject', 'Reject')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ModerationPage;
