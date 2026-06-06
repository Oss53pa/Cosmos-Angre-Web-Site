import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlog } from '../../hooks/useBlog';
import {
  FileText,
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  XCircle,
  Calendar,
  User,
  Save,
  TrendingUp,
  MessageSquare,
  Heart,
  Link as LinkIcon,
  CheckCircle,
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author?: string;
  authorId?: string;
  authorName?: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  publishDate?: string;
  status: 'published' | 'draft' | 'scheduled';
  views: number;
  likes: number;
  comments: number;
  createdAt?: string;
  updatedAt?: string;
}

interface Category {
  name: string;
  count: number;
}

/**
 * Generate a URL-friendly slug from a title string.
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .replace(/^-|-$/g, ''); // Trim leading/trailing hyphens
}

const BlogManagement: React.FC = () => {
  const { t } = useTranslation();
  const { posts, isLoading, error, fetchPosts, createPost, updatePost, deletePost } = useBlog();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewPost, setViewPost] = useState<BlogPost | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Auto-clear feedback after 4 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Set image preview when editing
  useEffect(() => {
    if (editingPost?.featuredImage) {
      setImagePreview(editingPost.featuredImage);
    } else {
      setImagePreview('');
    }
  }, [editingPost]);

  // Transform Supabase posts to match local interface
  const transformedPosts: BlogPost[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || '',
    content: post.content || '',
    author: post.author_name || 'Admin',
    authorId: post.author_id,
    authorName: post.author_name,
    category: post.category || '',
    tags: post.tags || [],
    featuredImage: post.featured_image,
    publishDate: post.publish_date,
    status: post.status,
    views: post.views || 0,
    likes: post.likes || 0,
    comments: post.comments || 0,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
  }));

  const categories: Category[] = [
    { name: 'Mode', count: transformedPosts.filter((p) => p.category === 'Mode').length },
    { name: 'Lifestyle', count: transformedPosts.filter((p) => p.category === 'Lifestyle').length },
    {
      name: 'Gastronomie',
      count: transformedPosts.filter((p) => p.category === 'Gastronomie').length,
    },
    {
      name: 'Événements',
      count: transformedPosts.filter((p) => p.category === 'Événements').length,
    },
    {
      name: 'Décoration',
      count: transformedPosts.filter((p) => p.category === 'Décoration').length,
    },
    {
      name: 'Technologie',
      count: transformedPosts.filter((p) => p.category === 'Technologie').length,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-emerald-600 bg-emerald-50 border-green-200';
      case 'draft':
        return 'text-text-secondary bg-cosmos-cream/50 border-cosmos-cream';
      case 'scheduled':
        return 'text-amber-600 bg-amber-50 border-orange-200';
      default:
        return 'text-text-secondary bg-cosmos-cream/50 border-cosmos-cream';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return t('admin.blog.status.published', 'Publié');
      case 'draft':
        return t('admin.blog.status.draft', 'Brouillon');
      case 'scheduled':
        return t('admin.blog.status.scheduled', 'Programmé');
      default:
        return status;
    }
  };

  const filteredPosts = transformedPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const stats = [
    {
      label: t('admin.blog.stats.totalArticles', 'Total Articles'),
      value: transformedPosts.length,
      icon: FileText,
      color: 'text-cosmos-night',
      bg: 'bg-cosmos-gold/10',
    },
    {
      label: t('admin.blog.stats.published', 'Publiés'),
      value: transformedPosts.filter((p) => p.status === 'published').length,
      icon: Eye,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: t('admin.blog.stats.totalViews', 'Total Vues'),
      value: transformedPosts.reduce((sum, p) => sum + p.views, 0).toLocaleString(),
      icon: TrendingUp,
      color: 'text-cosmos-gold',
      bg: 'bg-cosmos-gold/5',
    },
    {
      label: t('admin.blog.stats.totalLikes', 'Total Likes'),
      value: transformedPosts.reduce((sum, p) => sum + p.likes, 0),
      icon: Heart,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
  ];

  const handleDeletePost = async (postId: string) => {
    if (
      window.confirm(
        t('admin.blog.confirmDelete', 'Êtes-vous sûr de vouloir supprimer cet article ?')
      )
    ) {
      try {
        const success = await deletePost(postId);
        if (success) {
          setFeedback({
            type: 'success',
            message: t('admin.blog.feedback.deleted', 'Article supprimé avec succès'),
          });
        } else {
          setFeedback({
            type: 'error',
            message: t(
              'admin.blog.feedback.deleteError',
              "Erreur lors de la suppression de l'article"
            ),
          });
        }
        await fetchPosts();
      } catch {
        setFeedback({
          type: 'error',
          message: t(
            'admin.blog.feedback.deleteError',
            "Erreur lors de la suppression de l'article"
          ),
        });
      }
    }
  };

  const handleSavePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const title = (formData.get('title') as string)?.trim();
    let slug = (formData.get('slug') as string)?.trim();
    const excerpt = (formData.get('excerpt') as string)?.trim() || '';
    const content = (formData.get('content') as string)?.trim() || '';
    const category = (formData.get('category') as string) || '';
    const status = (formData.get('status') as 'published' | 'draft' | 'scheduled') || 'draft';
    const featured_image = (formData.get('featuredImage') as string)?.trim() || null;
    const tagsRaw = (formData.get('tags') as string) || '';
    const tags = tagsRaw
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    const publish_date = (formData.get('publishDate') as string) || null;

    if (!title) {
      setFeedback({
        type: 'error',
        message: t('admin.blog.feedback.titleRequired', 'Le titre est obligatoire'),
      });
      setIsSaving(false);
      return;
    }

    // Auto-generate slug from title if slug is empty
    if (!slug) {
      slug = generateSlug(title);
    }

    try {
      if (editingPost) {
        const result = await updatePost(editingPost.id, {
          title,
          slug,
          excerpt,
          content,
          category,
          status,
          featured_image,
          tags,
          publish_date,
          author_name: editingPost.authorName || 'Admin',
        });
        if (result) {
          setFeedback({
            type: 'success',
            message: t('admin.blog.feedback.updated', 'Article mis à jour avec succès'),
          });
        } else {
          setFeedback({
            type: 'error',
            message: t(
              'admin.blog.feedback.updateError',
              "Erreur lors de la mise à jour de l'article"
            ),
          });
          setIsSaving(false);
          return;
        }
      } else {
        const result = await createPost({
          title,
          slug,
          excerpt,
          content,
          category,
          status,
          featured_image,
          tags,
          publish_date,
          author_name: 'Admin',
        });
        if (result) {
          setFeedback({
            type: 'success',
            message: t('admin.blog.feedback.created', 'Article créé avec succès'),
          });
        } else {
          setFeedback({
            type: 'error',
            message: t(
              'admin.blog.feedback.createError',
              "Erreur lors de la création de l'article"
            ),
          });
          setIsSaving(false);
          return;
        }
      }

      setEditingPost(null);
      setIsCreating(false);
      setImagePreview('');
      await fetchPosts();
    } catch {
      setFeedback({
        type: 'error',
        message: t('admin.blog.feedback.saveError', "Erreur lors de l'enregistrement"),
      });
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Auto-fill slug field from title when creating a new post.
   */
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingPost) {
      const form = e.currentTarget.form;
      if (form) {
        const slugInput = form.elements.namedItem('slug') as HTMLInputElement;
        if (slugInput) {
          slugInput.value = generateSlug(e.currentTarget.value);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 border ${feedback.type === 'success' ? 'bg-emerald-50 border-green-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'} flex items-center justify-between`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
            ) : (
              <XCircle className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
            )}
            <p className="font-light">{feedback.message}</p>
          </div>
          <button onClick={() => setFeedback(null)} className="ml-4">
            <XCircle className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-cosmos-night mb-2 tracking-tight">
            {t('admin.blog.title', 'Gestion du Blog')}
          </h1>
          <p className="text-text-secondary font-light">
            {t('admin.blog.subtitle', 'Créez et gérez les articles de votre blog')}
          </p>
        </div>
        <button
          onClick={() => {
            setIsCreating(true);
            setImagePreview('');
          }}
          className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          {t('admin.blog.newArticle', 'Nouvel Article')}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white border border-cosmos-cream p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmos-night mx-auto mb-4"></div>
          <p className="text-text-secondary font-light">{t('common.loading', 'Chargement...')}</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-6 text-center">
          <p className="text-red-600 font-light">{error}</p>
        </div>
      )}

      {/* Statistics */}
      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white border border-cosmos-cream p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} strokeWidth={1.5} />
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

          {/* Categories Overview */}
          <div className="bg-white border border-cosmos-cream p-6">
            <h2 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
              {t('admin.blog.categories', 'Catégories')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="border border-cosmos-cream p-3 hover:border-cosmos-cream transition-colors"
                >
                  <div className="text-sm font-light text-cosmos-night">{category.name}</div>
                  <div className="text-xs text-text-secondary font-light">
                    {category.count} {t('admin.blog.articles', 'articles')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border border-cosmos-cream p-6">
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
                  placeholder={t('admin.blog.searchPlaceholder', 'Rechercher un article...')}
                  className="w-full pl-10 pr-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              >
                <option value="all">
                  {t('admin.blog.filter.allStatuses', 'Tous les statuts')}
                </option>
                <option value="published">{t('admin.blog.status.published', 'Publié')}</option>
                <option value="draft">{t('admin.blog.status.draft', 'Brouillon')}</option>
                <option value="scheduled">{t('admin.blog.status.scheduled', 'Programmé')}</option>
              </select>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              >
                <option value="all">
                  {t('admin.blog.filter.allCategories', 'Toutes les catégories')}
                </option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-cosmos-cream hover:border-cosmos-cream transition-colors"
              >
                {post.featuredImage && (
                  <div className="h-48 border-b border-cosmos-cream">
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-light text-cosmos-night mb-2 tracking-tight">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-3 py-1 bg-cosmos-cream text-xs text-text-secondary font-light">
                          {post.category || '\u2014'}
                        </span>
                        <span
                          className={`text-xs px-3 py-1 ${getStatusColor(post.status)} border font-light`}
                        >
                          {getStatusLabel(post.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-text-secondary font-light leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-cosmos-cream text-text-secondary font-light"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {post.status === 'published' && (
                    <div className="flex items-center gap-4 text-sm text-text-secondary font-light mb-4 pb-4 border-b border-gray-100">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" strokeWidth={1.5} />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" strokeWidth={1.5} />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
                        {post.comments}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-text-secondary font-light mb-4">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" strokeWidth={1.5} />
                      {post.author}
                    </span>
                    {post.publishDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" strokeWidth={1.5} />
                        {new Date(post.publishDate).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewPost(post)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light text-sm transition-colors"
                    >
                      <Eye className="w-4 h-4" strokeWidth={1.5} />
                      {t('common.view', 'Voir')}
                    </button>
                    <button
                      onClick={() => setEditingPost(post)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light text-sm transition-colors"
                    >
                      <Edit className="w-4 h-4" strokeWidth={1.5} />
                      {t('common.edit', 'Modifier')}
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 hover:border-red-600 bg-red-50 text-red-600 font-light text-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="bg-white border border-cosmos-cream p-12 text-center">
              <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-light text-cosmos-night mb-2">
                {t('admin.blog.noArticles', 'Aucun article')}
              </h3>
              <p className="text-sm text-text-secondary font-light mb-6">
                {t(
                  'admin.blog.noArticlesDescription',
                  'Aucun article ne correspond à vos critères de recherche'
                )}
              </p>
            </div>
          )}
        </>
      )}

      {/* View Post Modal */}
      {viewPost && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setViewPost(null)}></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
                <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                  {t('admin.blog.articlePreview', "Aperçu de l'Article")}
                </h2>
                <button
                  onClick={() => setViewPost(null)}
                  className="text-text-secondary hover:text-cosmos-night"
                >
                  <XCircle className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>

              {viewPost.featuredImage && (
                <div className="h-64 border-b border-cosmos-cream">
                  <img
                    src={viewPost.featuredImage}
                    alt={viewPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-3 py-1 bg-cosmos-cream text-sm text-text-secondary font-light">
                      {viewPost.category || '\u2014'}
                    </span>
                    <span
                      className={`text-xs px-3 py-1 ${getStatusColor(viewPost.status)} border font-light`}
                    >
                      {getStatusLabel(viewPost.status)}
                    </span>
                  </div>
                  <h3 className="text-3xl font-light text-cosmos-night mb-4 tracking-tight">
                    {viewPost.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-text-secondary font-light mb-4">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" strokeWidth={1.5} />
                      {viewPost.author}
                    </span>
                    {viewPost.publishDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" strokeWidth={1.5} />
                        {new Date(viewPost.publishDate).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-lg text-cosmos-night font-light italic mb-6">
                    {viewPost.excerpt}
                  </p>
                  <p className="text-cosmos-night font-light leading-relaxed">{viewPost.content}</p>
                </div>

                <div>
                  <h4 className="text-sm text-text-secondary font-light mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewPost.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-cosmos-cream text-sm text-text-secondary font-light"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {viewPost.status === 'published' && (
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-cosmos-cream">
                    <div className="text-center p-4 border border-cosmos-cream">
                      <div className="text-2xl font-light text-cosmos-night mb-1">
                        {viewPost.views}
                      </div>
                      <div className="text-xs text-text-secondary font-light">
                        {t('admin.blog.views', 'Vues')}
                      </div>
                    </div>
                    <div className="text-center p-4 border border-cosmos-cream">
                      <div className="text-2xl font-light text-cosmos-night mb-1">
                        {viewPost.likes}
                      </div>
                      <div className="text-xs text-text-secondary font-light">
                        {t('admin.blog.likes', 'Likes')}
                      </div>
                    </div>
                    <div className="text-center p-4 border border-cosmos-cream">
                      <div className="text-2xl font-light text-cosmos-night mb-1">
                        {viewPost.comments}
                      </div>
                      <div className="text-xs text-text-secondary font-light">
                        {t('admin.blog.comments', 'Commentaires')}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit/Create Post Modal */}
      {(editingPost || isCreating) && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setEditingPost(null);
              setIsCreating(false);
              setImagePreview('');
            }}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
                <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                  {editingPost
                    ? t('admin.blog.editArticle', "Modifier l'Article")
                    : t('admin.blog.newArticle', 'Nouvel Article')}
                </h2>
                <button
                  onClick={() => {
                    setEditingPost(null);
                    setIsCreating(false);
                    setImagePreview('');
                  }}
                  className="text-text-secondary hover:text-cosmos-night"
                >
                  <XCircle className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>

              <form onSubmit={handleSavePost} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.blog.form.title', 'Titre')}
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingPost?.title}
                    onChange={handleTitleChange}
                    placeholder={t('admin.blog.form.titlePlaceholder', "Titre de l'article")}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.blog.form.slug', 'Slug (URL)')}
                  </label>
                  <input
                    type="text"
                    name="slug"
                    defaultValue={editingPost?.slug}
                    placeholder="titre-de-larticle"
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                  <p className="text-xs text-text-secondary font-light mt-1">
                    {t(
                      'admin.blog.form.slugHint',
                      'Laissez vide pour générer automatiquement depuis le titre'
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-cosmos-night font-light mb-2">
                      {t('admin.blog.form.category', 'Catégorie')}
                    </label>
                    <select
                      name="category"
                      defaultValue={editingPost?.category || 'Mode'}
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-cosmos-night font-light mb-2">
                      {t('admin.blog.form.status', 'Statut')}
                    </label>
                    <select
                      name="status"
                      defaultValue={editingPost?.status || 'draft'}
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                      required
                    >
                      <option value="draft">{t('admin.blog.status.draft', 'Brouillon')}</option>
                      <option value="published">
                        {t('admin.blog.status.published', 'Publié')}
                      </option>
                      <option value="scheduled">
                        {t('admin.blog.status.scheduled', 'Programmé')}
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.blog.form.excerpt', 'Extrait')}
                  </label>
                  <textarea
                    name="excerpt"
                    defaultValue={editingPost?.excerpt}
                    rows={3}
                    placeholder={t(
                      'admin.blog.form.excerptPlaceholder',
                      "Court résumé de l'article..."
                    )}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.blog.form.content', 'Contenu')}
                  </label>
                  <textarea
                    name="content"
                    defaultValue={editingPost?.content}
                    rows={10}
                    placeholder={t(
                      'admin.blog.form.contentPlaceholder',
                      "Contenu complet de l'article..."
                    )}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    <span className="flex items-center gap-1">
                      <LinkIcon className="w-4 h-4" strokeWidth={1.5} />
                      {t('admin.blog.form.featuredImageUrl', "URL de l'image à la une")}
                    </span>
                  </label>
                  <input
                    type="url"
                    name="featuredImage"
                    defaultValue={editingPost?.featuredImage || ''}
                    onChange={(e) => setImagePreview(e.target.value)}
                    placeholder="https://exemple.com/image.jpg"
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                  <p className="text-xs text-text-secondary font-light mt-1">
                    {t(
                      'admin.blog.form.imageUrlHint',
                      "Entrez l'URL directe d'une image (JPG, PNG, WebP)"
                    )}
                  </p>
                  {imagePreview && (
                    <div className="mt-3 border border-cosmos-cream p-2">
                      <img
                        src={imagePreview}
                        alt={t('admin.blog.form.imagePreview', 'Aperçu')}
                        className="max-h-40 object-contain mx-auto"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                        onLoad={(e) => {
                          (e.target as HTMLImageElement).style.display = 'block';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.blog.form.tags', 'Tags (séparés par des virgules)')}
                  </label>
                  <input
                    type="text"
                    name="tags"
                    defaultValue={editingPost?.tags.join(', ')}
                    placeholder="mode, tendances, automne"
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.blog.form.publishDate', 'Date de publication')}
                  </label>
                  <input
                    type="date"
                    name="publishDate"
                    defaultValue={
                      editingPost?.publishDate ? editingPost.publishDate.split('T')[0] : ''
                    }
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-cosmos-cream">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPost(null);
                      setIsCreating(false);
                      setImagePreview('');
                    }}
                    className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                  >
                    {t('common.cancel', 'Annuler')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" strokeWidth={1.5} />
                    {isSaving
                      ? t('common.saving', 'Enregistrement...')
                      : t('common.save', 'Enregistrer')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BlogManagement;
