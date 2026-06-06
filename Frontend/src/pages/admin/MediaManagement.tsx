import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Image as ImageIcon, Trash2, Check, AlertCircle } from 'lucide-react';
import { useMedia } from '../../hooks/useMedia';
import type { MediaType } from '../../types/database';

const MediaManagement: React.FC = () => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<string>('logo');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Supabase hooks
  const {
    files: mediaFiles,
    isLoading,
    uploadFile,
    deleteFile,
    setActiveLogo,
    getActiveLogo,
  } = useMedia({ type: selectedType as MediaType });
  const [activeLogo, setActiveLogoState] = useState<{
    id: string;
    url: string;
    originalName: string | null;
    size: number | null;
  } | null>(null);

  useEffect(() => {
    getActiveLogo().then((logo) =>
      setActiveLogoState(
        logo
          ? { id: logo.id, url: logo.url, originalName: logo.original_name, size: logo.size }
          : null
      )
    );
  }, [getActiveLogo, mediaFiles]);

  const mediaTypes = [
    {
      value: 'logo',
      label: t('admin.media.types.logos', 'Logos'),
      description: t('admin.media.types.logosDesc', 'Logo principal du centre commercial'),
    },
    {
      value: 'banner',
      label: t('admin.media.types.banners', 'Bannières'),
      description: t('admin.media.types.bannersDesc', 'Images de bannière pour le site'),
    },
    {
      value: 'favicon',
      label: t('admin.media.types.favicon', 'Favicon'),
      description: t('admin.media.types.faviconDesc', 'Icône du site (16x16, 32x32)'),
    },
    {
      value: 'partner',
      label: t('admin.media.types.partners', 'Partenaires'),
      description: t('admin.media.types.partnersDesc', 'Logos des partenaires'),
    },
    {
      value: 'other',
      label: t('admin.media.types.other', 'Autres'),
      description: t('admin.media.types.otherDesc', 'Autres médias'),
    },
  ];

  // Gestion du drag & drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files: FileList) => {
    const file = files[0];

    // Validation
    if (!file.type.startsWith('image/')) {
      alert(
        t(
          'admin.media.validation.invalidImage',
          'Veuillez sélectionner une image valide (PNG, JPG, SVG, etc.)'
        )
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB max
      alert(
        t(
          'admin.media.validation.fileTooLarge',
          'Le fichier est trop volumineux. Taille maximale : 5 MB'
        )
      );
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      await uploadFile(file, selectedType as MediaType);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 2000);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      alert(t('admin.media.errors.uploadFailed', "Erreur lors de l'upload du fichier"));
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        t('admin.media.confirmDelete', 'Êtes-vous sûr de vouloir supprimer ce média ?')
      )
    ) {
      try {
        const file = mediaFiles.find((f) => f.id === id);
        await deleteFile(id, file?.filename || '', 'media');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert(t('admin.media.errors.deleteFailed', 'Erreur lors de la suppression du média'));
      }
    }
  };

  const handleSetActiveLogo = async (id: string) => {
    try {
      await setActiveLogo(id);
    } catch (error) {
      console.error('Erreur lors de la définition du logo actif:', error);
      alert(
        t('admin.media.errors.setActiveLogoFailed', 'Erreur lors de la définition du logo actif')
      );
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-cosmos-night tracking-tight">
          {t('admin.media.title', 'Gestion des Médias')}
        </h1>
        <p className="mt-2 text-sm text-text-secondary font-light">
          {t('admin.media.subtitle', 'Gérez les logos, bannières et autres médias du site web')}
        </p>
      </div>

      {/* Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {mediaTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setSelectedType(type.value)}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              selectedType === type.value
                ? 'border-blue-600 bg-cosmos-gold/10'
                : 'border-cosmos-cream hover:border-cosmos-cream'
            }`}
          >
            <div className="text-sm font-medium text-cosmos-night">{type.label}</div>
            <div className="text-xs text-text-secondary mt-1 font-light">{type.description}</div>
          </button>
        ))}
      </div>

      {/* Upload Zone */}
      <div className="bg-white border border-cosmos-cream rounded-lg p-8">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
            dragActive
              ? 'border-blue-600 bg-cosmos-gold/10'
              : 'border-cosmos-cream hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />

          <Upload className="w-12 h-12 text-text-secondary mx-auto mb-4" strokeWidth={1.5} />

          <h3 className="text-lg font-light text-cosmos-night mb-2">
            {t('admin.media.uploadTitle', 'Télécharger un {{type}}', {
              type: mediaTypes.find((tp) => tp.value === selectedType)?.label.toLowerCase(),
            })}
          </h3>

          <p className="text-sm text-text-secondary mb-4 font-light">
            {t(
              'admin.media.dragDropMessage',
              'Glissez-déposez un fichier ici ou cliquez pour sélectionner'
            )}
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-6 py-3 bg-cosmos-night text-white rounded-lg hover:bg-cosmos-night/90 transition-colors disabled:opacity-50 font-light"
          >
            {isUploading
              ? t('admin.media.uploading', 'Upload en cours...')
              : t('admin.media.selectFile', 'Sélectionner un fichier')}
          </button>

          <p className="text-xs text-text-secondary mt-4 font-light">
            {t('admin.media.fileFormats', "PNG, JPG, SVG jusqu'à 5 MB")}
          </p>

          {/* Progress Bar */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-4 max-w-md mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-cosmos-night h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logo actif (pour le type 'logo' uniquement) */}
      {selectedType === 'logo' && activeLogo && (
        <div className="bg-emerald-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Check className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
            <h3 className="text-sm font-medium text-green-900">
              {t('admin.media.activeLogo', 'Logo Actif')}
            </h3>
          </div>
          <p className="text-xs text-green-700 font-light">
            {t(
              'admin.media.activeLogoDescription',
              'Ce logo est actuellement affiché dans le header du site web'
            )}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <img
              src={activeLogo.url}
              alt={activeLogo.originalName}
              className="h-16 w-auto object-contain border border-green-200 rounded p-2 bg-white"
            />
            <div>
              <div className="text-sm text-green-900">{activeLogo.originalName}</div>
              <div className="text-xs text-green-700 font-light">
                {formatFileSize(activeLogo.size)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Grid */}
      <div>
        <h2 className="text-xl font-light text-cosmos-night mb-4">
          {t('admin.media.availableMedia', '{{type}} disponibles', {
            type: mediaTypes.find((tp) => tp.value === selectedType)?.label,
          })}
        </h2>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-sm text-text-secondary font-light">
              {t('common.loading', 'Chargement...')}
            </p>
          </div>
        ) : mediaFiles.length === 0 ? (
          <div className="text-center py-12 bg-cosmos-cream/50 rounded-lg border border-cosmos-cream">
            <ImageIcon className="w-12 h-12 text-text-secondary mx-auto mb-4" strokeWidth={1.5} />
            <p className="text-sm text-text-secondary font-light">
              {t('admin.media.noMediaFound', 'Aucun média de type "{{type}}" trouvé', {
                type: mediaTypes.find((tp) => tp.value === selectedType)?.label.toLowerCase(),
              })}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {mediaFiles.map((media) => (
              <div
                key={media.id}
                className="bg-white border border-cosmos-cream rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-cosmos-cream flex items-center justify-center p-4">
                  <img
                    src={media.url}
                    alt={media.original_name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <div className="p-4">
                  <div className="text-sm text-cosmos-night truncate mb-1">
                    {media.original_name}
                  </div>
                  <div className="text-xs text-text-secondary font-light">
                    {formatFileSize(media.size ?? 0)}
                  </div>

                  <div className="mt-4 flex gap-2">
                    {selectedType === 'logo' && activeLogo?.id !== media.id && (
                      <button
                        onClick={() => handleSetActiveLogo(media.id)}
                        className="flex-1 px-3 py-2 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors font-light"
                      >
                        {t('admin.media.setAsActive', 'Définir comme actif')}
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(media.id)}
                      className="px-3 py-2 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-cosmos-gold/10 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle
            className="w-5 h-5 text-cosmos-night flex-shrink-0 mt-0.5"
            strokeWidth={1.5}
          />
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              {t('admin.media.recommendations', 'Recommandations')}
            </h3>
            <ul className="text-xs text-blue-800 space-y-1 font-light">
              <li>
                {t(
                  'admin.media.rec.logo',
                  '• Logo : Format PNG transparent, taille recommandée 500x150px'
                )}
              </li>
              <li>
                {t(
                  'admin.media.rec.favicon',
                  '• Favicon : Format ICO ou PNG, taille 32x32px ou 64x64px'
                )}
              </li>
              <li>
                {t(
                  'admin.media.rec.banners',
                  '• Bannières : Format JPG ou PNG, largeur minimale 1920px'
                )}
              </li>
              <li>
                {t(
                  'admin.media.rec.optimize',
                  "• Optimisez vos images avant l'upload pour de meilleures performances"
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaManagement;
