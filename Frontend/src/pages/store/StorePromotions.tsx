import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Percent,
  ToggleLeft,
  ToggleRight,
  Copy,
  Users,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePromotions } from '../../hooks/usePromotions';

interface PromotionDisplay {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  code?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  uses: number;
  maxUses?: number;
}

const StorePromotions: React.FC = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const {
    promotions: supabasePromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
  } = usePromotions({ storeId: profile?.store_id || undefined });
  const [isCreating, setIsCreating] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromotionDisplay | null>(null);
  const [deletePromo, setDeletePromo] = useState<PromotionDisplay | null>(null);

  const promotions: PromotionDisplay[] = supabasePromotions.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description || '',
    discountType: p.discount_type,
    discountValue: p.discount_value,
    code: p.code || undefined,
    startDate: p.start_date || '',
    endDate: p.end_date || '',
    isActive: p.is_active,
    uses: p.uses,
    maxUses: p.max_uses || undefined,
  }));

  const [newPromo, setNewPromo] = useState({
    title: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    code: '',
    startDate: '',
    endDate: '',
    maxUses: 0,
  });

  const togglePromotion = async (id: string) => {
    const promo = promotions.find((p) => p.id === id);
    if (promo) {
      await updatePromotion(id, { is_active: !promo.isActive });
    }
  };

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setNewPromo({ ...newPromo, code });
  };

  const handleCreatePromo = async () => {
    if (!newPromo.title || !newPromo.startDate || !newPromo.endDate) return;

    await createPromotion({
      title: newPromo.title,
      description: newPromo.description,
      discount_type: newPromo.discountType,
      discount_value: newPromo.discountValue,
      code: newPromo.code || undefined,
      start_date: newPromo.startDate,
      end_date: newPromo.endDate,
      is_active: true,
      max_uses: newPromo.maxUses || undefined,
      store_id: profile?.store_id || undefined,
    });
    setNewPromo({
      title: '',
      description: '',
      discountType: 'percentage',
      discountValue: 0,
      code: '',
      startDate: '',
      endDate: '',
      maxUses: 0,
    });
    setIsCreating(false);
  };

  const handleEditPromo = async () => {
    if (!editingPromo) return;
    await updatePromotion(editingPromo.id, {
      title: editingPromo.title,
      description: editingPromo.description,
      discount_type: editingPromo.discountType,
      discount_value: editingPromo.discountValue,
      code: editingPromo.code || undefined,
      start_date: editingPromo.startDate,
      end_date: editingPromo.endDate,
      max_uses: editingPromo.maxUses || undefined,
    });
    setEditingPromo(null);
  };

  const handleDeletePromo = async () => {
    if (!deletePromo) return;
    await deletePromotion(deletePromo.id);
    setDeletePromo(null);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-cosmos-night mb-2 tracking-tight">
            {t('store.promotions.title', 'Promotions')}
          </h1>
          <p className="text-text-secondary font-light">
            {t('store.promotions.subtitle', 'Créez et gérez vos codes promotionnels et réductions')}
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white font-light hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          {t('store.promotions.newPromotion', 'Nouvelle Promotion')}
        </button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: t('store.promotions.activePromotions', 'Promotions actives'),
            value: promotions.filter((p) => p.isActive).length,
            color: 'text-emerald-600',
          },
          {
            label: t('store.promotions.totalUses', 'Total utilisations'),
            value: promotions.reduce((sum, p) => sum + p.uses, 0),
            color: 'text-cosmos-night',
          },
          {
            label: t('store.promotions.upcoming', 'À venir'),
            value: promotions.filter((p) => !p.isActive && new Date(p.startDate) > new Date())
              .length,
            color: 'text-amber-600',
          },
          {
            label: t('store.promotions.expired', 'Expirées'),
            value: promotions.filter((p) => new Date(p.endDate) < new Date()).length,
            color: 'text-text-secondary',
          },
        ].map((stat, index) => (
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

      {/* Nouvelle promotion */}
      {isCreating && (
        <div className="bg-white border border-cosmos-cream p-6 animate-fade-in-down">
          <h2 className="text-xl font-light text-cosmos-night mb-6 tracking-tight">
            {t('store.promotions.createPromotion', 'Créer une Promotion')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-text-secondary font-light mb-2">
                {t('store.promotions.promotionTitle', 'Titre de la promotion')}
              </label>
              <input
                type="text"
                value={newPromo.title}
                onChange={(e) => setNewPromo({ ...newPromo, title: e.target.value })}
                placeholder={t('store.promotions.titlePlaceholder', "Ex: Soldes d'été")}
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary font-light mb-2">
                {t('store.promotions.promoCode', 'Code promo')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPromo.code}
                  onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                  placeholder="EX: SUMMER2024"
                  className="flex-1 px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light uppercase"
                />
                <button
                  onClick={generateCode}
                  className="px-4 py-3 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                >
                  {t('store.promotions.generate', 'Générer')}
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-text-secondary font-light mb-2">
                {t('store.promotions.description', 'Description')}
              </label>
              <textarea
                value={newPromo.description}
                onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
                rows={3}
                placeholder={t(
                  'store.promotions.descriptionPlaceholder',
                  'Décrivez votre promotion...'
                )}
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary font-light mb-2">
                {t('store.promotions.discountType', 'Type de réduction')}
              </label>
              <select
                value={newPromo.discountType}
                onChange={(e) =>
                  setNewPromo({
                    ...newPromo,
                    discountType: e.target.value as 'percentage' | 'fixed',
                  })
                }
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              >
                <option value="percentage">
                  {t('store.promotions.percentage', 'Pourcentage (%)')}
                </option>
                <option value="fixed">
                  {t('store.promotions.fixedAmount', 'Montant fixe (FCFA)')}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-text-secondary font-light mb-2">
                {t('store.promotions.value', 'Valeur')}
              </label>
              <input
                type="number"
                value={newPromo.discountValue}
                onChange={(e) =>
                  setNewPromo({ ...newPromo, discountValue: Number(e.target.value) })
                }
                placeholder={newPromo.discountType === 'percentage' ? '30' : '10000'}
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary font-light mb-2">
                {t('store.promotions.startDate', 'Date de début')}
              </label>
              <input
                type="date"
                value={newPromo.startDate}
                onChange={(e) => setNewPromo({ ...newPromo, startDate: e.target.value })}
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary font-light mb-2">
                {t('store.promotions.endDate', 'Date de fin')}
              </label>
              <input
                type="date"
                value={newPromo.endDate}
                onChange={(e) => setNewPromo({ ...newPromo, endDate: e.target.value })}
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-text-secondary font-light mb-2">
                {t('store.promotions.maxUses', "Nombre maximum d'utilisations (optionnel)")}
              </label>
              <input
                type="number"
                value={newPromo.maxUses}
                onChange={(e) => setNewPromo({ ...newPromo, maxUses: Number(e.target.value) })}
                placeholder={t('store.promotions.maxUsesPlaceholder', 'Laisser vide pour illimité')}
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-cosmos-cream">
            <button
              onClick={() => setIsCreating(false)}
              className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
            >
              {t('common.cancel', 'Annuler')}
            </button>
            <button
              onClick={handleCreatePromo}
              className="px-6 py-2 bg-gray-900 text-white font-light hover:bg-gray-800 transition-colors"
            >
              {t('store.promotions.createThePromotion', 'Créer la promotion')}
            </button>
          </div>
        </div>
      )}

      {/* Liste des promotions */}
      <div className="space-y-4">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="bg-white border border-cosmos-cream hover:border-cosmos-cream transition-colors"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-light text-cosmos-night tracking-tight">
                      {promo.title}
                    </h3>
                    {promo.code && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-cosmos-cream border border-cosmos-cream">
                        <Tag className="w-3 h-3 text-text-secondary" strokeWidth={1.5} />
                        <span className="text-sm font-mono text-cosmos-night">{promo.code}</span>
                        <button
                          onClick={() => handleCopyCode(promo.code!)}
                          className="text-text-secondary hover:text-cosmos-night"
                        >
                          <Copy className="w-3 h-3" strokeWidth={1.5} />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-text-secondary font-light mb-4">{promo.description}</p>

                  <div className="flex items-center gap-6 text-sm text-text-secondary font-light">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4" strokeWidth={1.5} />
                      <span>
                        {promo.discountType === 'percentage'
                          ? `-${promo.discountValue}%`
                          : `-${promo.discountValue.toLocaleString()} FCFA`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" strokeWidth={1.5} />
                      <span>
                        {t('store.promotions.fromTo', 'Du {{start}} au {{end}}', {
                          start: promo.startDate,
                          end: promo.endDate,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" strokeWidth={1.5} />
                      <span>
                        {promo.uses} {promo.maxUses ? `/ ${promo.maxUses}` : ''}{' '}
                        {t('store.promotions.uses', 'utilisations')}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => togglePromotion(promo.id)}
                  className={`p-2 transition-colors ${
                    promo.isActive
                      ? 'text-emerald-600 hover:text-green-700'
                      : 'text-text-secondary hover:text-text-secondary'
                  }`}
                >
                  {promo.isActive ? (
                    <ToggleRight className="w-8 h-8" strokeWidth={1.5} />
                  ) : (
                    <ToggleLeft className="w-8 h-8" strokeWidth={1.5} />
                  )}
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div
                  className={`text-xs font-light ${promo.isActive ? 'text-emerald-600' : 'text-text-secondary'}`}
                >
                  {promo.isActive
                    ? t('store.promotions.active', 'Promotion active')
                    : t('store.promotions.inactive', 'Promotion inactive')}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingPromo(promo)}
                    className="flex items-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light text-sm transition-colors"
                  >
                    <Edit className="w-4 h-4" strokeWidth={1.5} />
                    {t('common.edit', 'Modifier')}
                  </button>
                  <button
                    onClick={() => setDeletePromo(promo)}
                    className="flex items-center gap-2 px-4 py-2 border border-red-200 hover:border-red-600 bg-red-50 text-red-600 font-light text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    {t('common.delete', 'Supprimer')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      {deletePromo && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setDeletePromo(null)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-50 flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-lg font-light text-cosmos-night tracking-tight">
                      {t('store.promotions.deletePromotion', 'Supprimer la promotion')}
                    </h3>
                    <p className="text-sm text-text-secondary font-light">
                      {t('store.promotions.irreversibleAction', 'Cette action est irréversible')}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary font-light mb-6">
                  {t(
                    'store.promotions.confirmDelete',
                    'Êtes-vous sûr de vouloir supprimer la promotion "{{title}}" ?',
                    { title: deletePromo.title }
                  )}
                  {deletePromo.code &&
                    ` ${t('store.promotions.codeInvalid', 'Le code "{{code}}" ne sera plus valide.', { code: deletePromo.code })}`}
                </p>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setDeletePromo(null)}
                    className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                  >
                    {t('common.cancel', 'Annuler')}
                  </button>
                  <button
                    onClick={handleDeletePromo}
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
      {editingPromo && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setEditingPromo(null)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
                <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                  {t('store.promotions.editPromotion', 'Modifier la Promotion')}
                </h2>
                <button
                  onClick={() => setEditingPromo(null)}
                  className="text-text-secondary hover:text-cosmos-night"
                >
                  <XCircle className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-text-secondary font-light mb-2">
                      {t('store.promotions.promotionTitle', 'Titre de la promotion')}
                    </label>
                    <input
                      type="text"
                      value={editingPromo.title}
                      onChange={(e) => setEditingPromo({ ...editingPromo, title: e.target.value })}
                      placeholder={t('store.promotions.titlePlaceholder', "Ex: Soldes d'été")}
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary font-light mb-2">
                      {t('store.promotions.promoCode', 'Code promo')}
                    </label>
                    <input
                      type="text"
                      value={editingPromo.code || ''}
                      onChange={(e) =>
                        setEditingPromo({ ...editingPromo, code: e.target.value.toUpperCase() })
                      }
                      placeholder="EX: SUMMER2024"
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light uppercase"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-text-secondary font-light mb-2">
                      {t('store.promotions.description', 'Description')}
                    </label>
                    <textarea
                      value={editingPromo.description}
                      onChange={(e) =>
                        setEditingPromo({ ...editingPromo, description: e.target.value })
                      }
                      rows={3}
                      placeholder={t(
                        'store.promotions.descriptionPlaceholder',
                        'Décrivez votre promotion...'
                      )}
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary font-light mb-2">
                      {t('store.promotions.discountType', 'Type de réduction')}
                    </label>
                    <select
                      value={editingPromo.discountType}
                      onChange={(e) =>
                        setEditingPromo({
                          ...editingPromo,
                          discountType: e.target.value as 'percentage' | 'fixed',
                        })
                      }
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    >
                      <option value="percentage">
                        {t('store.promotions.percentage', 'Pourcentage (%)')}
                      </option>
                      <option value="fixed">
                        {t('store.promotions.fixedAmount', 'Montant fixe (FCFA)')}
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary font-light mb-2">
                      {t('store.promotions.value', 'Valeur')}
                    </label>
                    <input
                      type="number"
                      value={editingPromo.discountValue}
                      onChange={(e) =>
                        setEditingPromo({ ...editingPromo, discountValue: Number(e.target.value) })
                      }
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary font-light mb-2">
                      {t('store.promotions.startDate', 'Date de début')}
                    </label>
                    <input
                      type="date"
                      value={editingPromo.startDate}
                      onChange={(e) =>
                        setEditingPromo({ ...editingPromo, startDate: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary font-light mb-2">
                      {t('store.promotions.endDate', 'Date de fin')}
                    </label>
                    <input
                      type="date"
                      value={editingPromo.endDate}
                      onChange={(e) =>
                        setEditingPromo({ ...editingPromo, endDate: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-text-secondary font-light mb-2">
                      {t('store.promotions.maxUses', "Nombre maximum d'utilisations (optionnel)")}
                    </label>
                    <input
                      type="number"
                      value={editingPromo.maxUses || ''}
                      onChange={(e) =>
                        setEditingPromo({
                          ...editingPromo,
                          maxUses: Number(e.target.value) || undefined,
                        })
                      }
                      placeholder={t(
                        'store.promotions.maxUsesPlaceholder',
                        'Laisser vide pour illimité'
                      )}
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-cosmos-cream">
                  <button
                    onClick={() => setEditingPromo(null)}
                    className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                  >
                    {t('common.cancel', 'Annuler')}
                  </button>
                  <button
                    onClick={handleEditPromo}
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

export default StorePromotions;
