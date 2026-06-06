import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  XCircle,
  Image as ImageIcon,
  Send,
  Save,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePublications } from '../../hooks/usePublications';
import type { PublicationStatus } from '../../types/database';

interface PublicationDisplay {
  id: string;
  title: string;
  content: string;
  image?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  views: number;
  likes: number;
  createdAt: string;
}

const StorePublications: React.FC = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const {
    publications: supabasePublications,
    createPublication,
    updatePublication,
    deletePublication,
  } = usePublications({ storeId: profile?.store_id || undefined });
  const [isCreating, setIsCreating] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [previewPost, setPreviewPost] = useState<PublicationDisplay | null>(null);
  const [deletePost, setDeletePost] = useState<PublicationDisplay | null>(null);
  const [editingPost, setEditingPost] = useState<PublicationDisplay | null>(null);

  const publications: PublicationDisplay[] = supabasePublications.map((p) => ({
    id: p.id,
    title: p.title,
    content: p.content || '',
    image: p.image || undefined,
    status: p.status as PublicationDisplay['status'],
    views: p.views,
    likes: p.likes,
    createdAt: p.created_at?.split('T')[0] || '',
  }));

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    image: '',
  });

  const handleCreatePost = async (status: 'draft' | 'pending') => {
    if (!newPost.title || !newPost.content) return;

    await createPublication({
      title: newPost.title,
      content: newPost.content,
      image: newPost.image || undefined,
      status: status as PublicationStatus,
      store_id: profile?.store_id || undefined,
    });
    setNewPost({ title: '', content: '', image: '' });
    setIsCreating(false);
  };

  const handleDeletePost = async () => {
    if (!deletePost) return;
    await deletePublication(deletePost.id);
    setDeletePost(null);
  };

  const handleEditPost = async () => {
    if (!editingPost) return;
    await updatePublication(editingPost.id, {
      title: editingPost.title,
      content: editingPost.content,
      image: editingPost.image || undefined,
    });
    setEditingPost(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-emerald-600 bg-emerald-50 border-green-200';
      case 'pending':
        return 'text-amber-600 bg-amber-50 border-orange-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'draft':
        return 'text-text-secondary bg-cosmos-cream/50 border-cosmos-cream';
      default:
        return 'text-text-secondary bg-cosmos-cream/50 border-cosmos-cream';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return t('store.publications.statusApproved', 'Approuvé');
      case 'pending':
        return t('store.publications.statusPending', 'En attente');
      case 'rejected':
        return t('store.publications.statusRejected', 'Refusé');
      case 'draft':
        return t('store.publications.statusDraft', 'Brouillon');
      default:
        return status;
    }
  };

  const filteredPublications =
    filter === 'all' ? publications : publications.filter((p) => p.status === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-cosmos-night mb-2 tracking-tight">
            {t('store.publications.title', 'Publications')}
          </h1>
          <p className="text-text-secondary font-light">
            {t(
              'store.publications.subtitle',
              'Créez et gérez vos publications pour promouvoir votre boutique'
            )}
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white font-light hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          {t('store.publications.newPublication', 'Nouvelle Publication')}
        </button>
      </div>

      {/* Nouvelle publication */}
      {isCreating && (
        <div className="bg-white border border-cosmos-cream p-6 animate-fade-in-down">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light text-cosmos-night tracking-tight">
              {t('store.publications.createPublication', 'Créer une Publication')}
            </h2>
            <button
              onClick={() => setIsCreating(false)}
              className="text-text-secondary hover:text-cosmos-night"
            >
              <XCircle className="w-5 h-5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-secondary font-light mb-2">
                {t('store.publications.titleLabel', 'Titre')}
              </label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder={t(
                  'store.publications.titlePlaceholder',
                  'Ex: Nouvelle collection Printemps 2025'
                )}
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary font-light mb-2">
                {t('store.publications.content', 'Contenu')}
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows={6}
                placeholder={t(
                  'store.publications.contentPlaceholder',
                  'Décrivez votre publication...'
                )}
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary font-light mb-2">
                {t('store.publications.imageOptional', 'Image (optionnel)')}
              </label>
              <div className="border-2 border-dashed border-cosmos-cream hover:border-gray-400 transition-colors p-8 text-center cursor-pointer">
                <ImageIcon
                  className="w-12 h-12 text-text-secondary mx-auto mb-3"
                  strokeWidth={1.5}
                />
                <div className="text-sm text-text-secondary font-light mb-2">
                  {t(
                    'store.publications.uploadImage',
                    'Cliquez pour télécharger ou glissez une image ici'
                  )}
                </div>
                <div className="text-xs text-text-secondary font-light">
                  {t('store.publications.imageFormats', "PNG, JPG jusqu'à 5MB")}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                onClick={() => setIsCreating(false)}
                className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
              >
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                onClick={() => handleCreatePost('draft')}
                className="flex items-center gap-2 px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
              >
                <Save className="w-4 h-4" strokeWidth={1.5} />
                {t('store.publications.saveDraft', 'Enregistrer brouillon')}
              </button>
              <button
                onClick={() => handleCreatePost('pending')}
                className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white font-light hover:bg-gray-800 transition-colors"
              >
                <Send className="w-4 h-4" strokeWidth={1.5} />
                {t('store.publications.publish', 'Publier')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      <div className="flex items-center gap-4 bg-white border border-cosmos-cream p-4">
        <span className="text-sm text-text-secondary font-light">
          {t('store.publications.filterBy', 'Filtrer par')} :
        </span>
        <div className="flex gap-2">
          {[
            { value: 'all', label: t('store.publications.filterAll', 'Toutes') },
            { value: 'approved', label: t('store.publications.filterApproved', 'Approuvées') },
            { value: 'pending', label: t('store.publications.filterPending', 'En attente') },
            { value: 'draft', label: t('store.publications.filterDraft', 'Brouillons') },
            { value: 'rejected', label: t('store.publications.filterRejected', 'Refusées') },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 text-sm font-light transition-colors ${
                filter === option.value
                  ? 'bg-gray-900 text-white'
                  : 'border border-cosmos-cream text-text-secondary hover:border-gray-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des publications */}
      <div className="space-y-4">
        {filteredPublications.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-cosmos-cream hover:border-cosmos-cream transition-colors"
          >
            <div className="p-6">
              <div className="flex items-start gap-6">
                {/* Image preview */}
                {post.image && (
                  <div className="w-48 h-32 flex-shrink-0 border border-cosmos-cream">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-light text-cosmos-night mb-2 tracking-tight">
                        {post.title}
                      </h3>
                      <p className="text-sm text-text-secondary font-light leading-relaxed mb-3">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-text-secondary font-light">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" strokeWidth={1.5} />
                          {post.createdAt}
                        </span>
                        {post.status === 'approved' && (
                          <>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" strokeWidth={1.5} />
                              {post.views} {t('store.publications.views', 'vues')}
                            </span>
                            <span>
                              {post.likes} {t('store.publications.likes', 'likes')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 ${getStatusColor(post.status)} border font-light`}
                    >
                      {getStatusLabel(post.status)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => setPreviewPost(post)}
                      className="flex items-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light text-sm transition-colors"
                    >
                      <Eye className="w-4 h-4" strokeWidth={1.5} />
                      {t('store.publications.view', 'Voir')}
                    </button>
                    {(post.status === 'draft' || post.status === 'rejected') && (
                      <button
                        onClick={() => setEditingPost(post)}
                        className="flex items-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light text-sm transition-colors"
                      >
                        <Edit className="w-4 h-4" strokeWidth={1.5} />
                        {t('common.edit', 'Modifier')}
                      </button>
                    )}
                    <button
                      onClick={() => setDeletePost(post)}
                      className="flex items-center gap-2 px-4 py-2 border border-red-200 hover:border-red-600 bg-red-50 text-red-600 font-light text-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                      {t('common.delete', 'Supprimer')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredPublications.length === 0 && (
          <div className="bg-white border border-cosmos-cream p-12 text-center">
            <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4" strokeWidth={1.5} />
            <h3 className="text-lg font-light text-cosmos-night mb-2">
              {t('store.publications.noPublications', 'Aucune publication')}
            </h3>
            <p className="text-sm text-text-secondary font-light mb-6">
              {filter === 'all'
                ? t(
                    'store.publications.noPublicationsYet',
                    "Vous n'avez pas encore créé de publication"
                  )
                : t('store.publications.noPublicationsFiltered', 'Aucune publication {{status}}', {
                    status: getStatusLabel(filter).toLowerCase(),
                  })}
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white font-light hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" strokeWidth={1.5} />
              {t('store.publications.createFirstPublication', 'Créer ma première publication')}
            </button>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewPost && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setPreviewPost(null)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
                <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                  {t('store.publications.publicationPreview', 'Aperçu de la Publication')}
                </h2>
                <button
                  onClick={() => setPreviewPost(null)}
                  className="text-text-secondary hover:text-cosmos-night"
                >
                  <XCircle className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-6">
                {previewPost.image && (
                  <div className="mb-6">
                    <img
                      src={previewPost.image}
                      alt={previewPost.title}
                      className="w-full h-auto border border-cosmos-cream"
                    />
                  </div>
                )}
                <div className="mb-4">
                  <span
                    className={`text-xs px-3 py-1 ${getStatusColor(previewPost.status)} border font-light`}
                  >
                    {getStatusLabel(previewPost.status)}
                  </span>
                </div>
                <h3 className="text-3xl font-light text-cosmos-night mb-4 tracking-tight">
                  {previewPost.title}
                </h3>
                <p className="text-base text-text-secondary font-light leading-relaxed mb-6 whitespace-pre-wrap">
                  {previewPost.content}
                </p>
                <div className="flex items-center gap-6 text-sm text-text-secondary font-light pt-4 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" strokeWidth={1.5} />
                    {previewPost.createdAt}
                  </span>
                  {previewPost.status === 'approved' && (
                    <>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" strokeWidth={1.5} />
                        {previewPost.views} {t('store.publications.views', 'vues')}
                      </span>
                      <span>
                        {previewPost.likes} {t('store.publications.likes', 'likes')}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Modal */}
      {deletePost && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setDeletePost(null)}></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-50 flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-cosmos-night tracking-tight">
                      {t('store.publications.deletePublication', 'Supprimer la publication')}
                    </h3>
                    <p className="text-sm text-text-secondary font-light">
                      {t('store.publications.irreversibleAction', 'Cette action est irréversible')}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary font-light mb-6">
                  {t(
                    'store.publications.confirmDelete',
                    'Êtes-vous sûr de vouloir supprimer la publication "{{title}}" ? Toutes les statistiques associées seront également supprimées.',
                    { title: deletePost.title }
                  )}
                </p>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setDeletePost(null)}
                    className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                  >
                    {t('common.cancel', 'Annuler')}
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="px-6 py-2 bg-red-600 text-white font-light hover:bg-red-700 transition-colors"
                  >
                    {t('common.delete', 'Supprimer')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setEditingPost(null)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
                <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                  {t('store.publications.editPublication', 'Modifier la Publication')}
                </h2>
                <button
                  onClick={() => setEditingPost(null)}
                  className="text-text-secondary hover:text-cosmos-night"
                >
                  <XCircle className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-text-secondary font-light mb-2">
                      {t('store.publications.titleLabel', 'Titre')}
                    </label>
                    <input
                      type="text"
                      value={editingPost.title}
                      onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                      placeholder={t(
                        'store.publications.titlePlaceholder',
                        'Ex: Nouvelle collection Printemps 2025'
                      )}
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary font-light mb-2">
                      {t('store.publications.content', 'Contenu')}
                    </label>
                    <textarea
                      value={editingPost.content}
                      onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                      rows={8}
                      placeholder={t(
                        'store.publications.contentPlaceholder',
                        'Décrivez votre publication...'
                      )}
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary font-light mb-2">
                      {t('store.publications.imageOptional', 'Image (optionnel)')}
                    </label>
                    {editingPost.image && (
                      <div className="mb-3">
                        <img
                          src={editingPost.image}
                          alt="Preview"
                          className="w-full h-48 object-cover border border-cosmos-cream mb-2"
                        />
                        <button
                          onClick={() => setEditingPost({ ...editingPost, image: undefined })}
                          className="text-sm text-red-600 hover:text-red-700 font-light"
                        >
                          {t('store.publications.removeImage', "Supprimer l'image")}
                        </button>
                      </div>
                    )}
                    <div className="border-2 border-dashed border-cosmos-cream hover:border-gray-400 transition-colors p-8 text-center cursor-pointer">
                      <ImageIcon
                        className="w-12 h-12 text-text-secondary mx-auto mb-3"
                        strokeWidth={1.5}
                      />
                      <div className="text-sm text-text-secondary font-light mb-2">
                        {t(
                          'store.publications.uploadImage',
                          'Cliquez pour télécharger ou glissez une image ici'
                        )}
                      </div>
                      <div className="text-xs text-text-secondary font-light">
                        {t('store.publications.imageFormats', "PNG, JPG jusqu'à 5MB")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-cosmos-cream">
                  <button
                    onClick={() => setEditingPost(null)}
                    className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                  >
                    {t('common.cancel', 'Annuler')}
                  </button>
                  <button
                    onClick={handleEditPost}
                    className="px-6 py-2 bg-gray-900 text-white font-light hover:bg-gray-800 transition-colors"
                  >
                    {t('common.saveChanges', 'Enregistrer les modifications')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StorePublications;
