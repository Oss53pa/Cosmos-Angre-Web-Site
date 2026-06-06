import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Lock, CreditCard, Users, Shield, Save, Eye, EyeOff } from 'lucide-react';

const StoreSettings: React.FC = () => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    newMessages: true,
    newComments: true,
    newFollowers: false,
    promotions: true,
    weeklyReport: true,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-cosmos-night mb-2 tracking-tight">
          {t('store.settings.title', 'Paramètres')}
        </h1>
        <p className="text-text-secondary font-light">
          {t(
            'store.settings.subtitle',
            'Gérez les paramètres de votre compte et de votre boutique'
          )}
        </p>
      </div>

      {/* Informations du compte */}
      <div className="bg-white border border-cosmos-cream p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-5 h-5 text-cosmos-night" strokeWidth={1.5} />
          <h2 className="text-xl font-light text-cosmos-night tracking-tight">
            {t('store.settings.accountInfo', 'Informations du Compte')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-text-secondary font-light mb-2">
              {t('store.settings.managerName', 'Nom du responsable')}
            </label>
            <input
              type="text"
              defaultValue="Jean Kouassi"
              className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary font-light mb-2">
              {t('store.settings.email', 'Email')}
            </label>
            <input
              type="email"
              defaultValue="jean@maboutique.com"
              className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary font-light mb-2">
              {t('store.settings.phone', 'Téléphone')}
            </label>
            <input
              type="tel"
              defaultValue="+225 27 22 XX XX XX"
              className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
            />
          </div>

          <div>
            <label className="block text-sm text-text-secondary font-light mb-2">
              {t('store.settings.role', 'Fonction')}
            </label>
            <input
              type="text"
              defaultValue="Gérant"
              className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white font-light hover:bg-gray-800 transition-colors">
            <Save className="w-4 h-4" strokeWidth={1.5} />
            {t('common.saveChanges', 'Enregistrer les modifications')}
          </button>
        </div>
      </div>

      {/* Sécurité */}
      <div className="bg-white border border-cosmos-cream p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="w-5 h-5 text-red-600" strokeWidth={1.5} />
          <h2 className="text-xl font-light text-cosmos-night tracking-tight">
            {t('store.settings.security', 'Sécurité')}
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm text-text-secondary font-light mb-2">
              {t('store.settings.currentPassword', 'Mot de passe actuel')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light pr-12"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-cosmos-night"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" strokeWidth={1.5} />
                ) : (
                  <Eye className="w-5 h-5" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-text-secondary font-light mb-2">
                {t('store.settings.newPassword', 'Nouveau mot de passe')}
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary font-light mb-2">
                {t('store.settings.confirmPassword', 'Confirmer le mot de passe')}
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
              />
            </div>
          </div>

          <div className="p-4 bg-cosmos-cream/50 border border-cosmos-cream">
            <h3 className="text-sm font-light text-cosmos-night mb-2">
              {t('store.settings.passwordRequirements', 'Exigences du mot de passe')} :
            </h3>
            <ul className="text-xs text-text-secondary font-light space-y-1">
              <li>{t('store.settings.passwordMinChars', '- Au moins 8 caractères')}</li>
              <li>{t('store.settings.passwordUppercase', '- Au moins une lettre majuscule')}</li>
              <li>{t('store.settings.passwordNumber', '- Au moins un chiffre')}</li>
              <li>{t('store.settings.passwordSpecial', '- Au moins un caractère spécial')}</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white font-light hover:bg-gray-800 transition-colors">
            <Save className="w-4 h-4" strokeWidth={1.5} />
            {t('store.settings.changePassword', 'Changer le mot de passe')}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white border border-cosmos-cream p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-amber-600" strokeWidth={1.5} />
          <h2 className="text-xl font-light text-cosmos-night tracking-tight">
            {t('store.settings.notifications', 'Notifications')}
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              key: 'newMessages',
              label: t('store.settings.newMessages', 'Nouveaux messages'),
              description: t(
                'store.settings.newMessagesDesc',
                'Recevez une notification pour chaque nouveau message'
              ),
            },
            {
              key: 'newComments',
              label: t('store.settings.newComments', 'Nouveaux commentaires'),
              description: t(
                'store.settings.newCommentsDesc',
                'Soyez averti des commentaires sur vos publications'
              ),
            },
            {
              key: 'newFollowers',
              label: t('store.settings.newFollowers', 'Nouveaux abonnés'),
              description: t(
                'store.settings.newFollowersDesc',
                "Notification quand quelqu'un suit votre boutique"
              ),
            },
            {
              key: 'promotions',
              label: t('store.settings.promotionsAndOffers', 'Promotions et offres'),
              description: t(
                'store.settings.promotionsAndOffersDesc',
                'Recevez des informations sur les nouvelles fonctionnalités'
              ),
            },
            {
              key: 'weeklyReport',
              label: t('store.settings.weeklyReport', 'Rapport hebdomadaire'),
              description: t(
                'store.settings.weeklyReportDesc',
                'Recevez un résumé de vos statistiques chaque semaine'
              ),
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-start justify-between p-4 border border-cosmos-cream hover:border-cosmos-cream transition-colors"
            >
              <div className="flex-1">
                <div className="text-sm font-light text-cosmos-night mb-1">{item.label}</div>
                <div className="text-xs text-text-secondary font-light">{item.description}</div>
              </div>
              <button
                onClick={() =>
                  setNotifications({
                    ...notifications,
                    [item.key]: !notifications[item.key as keyof typeof notifications],
                  })
                }
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  notifications[item.key as keyof typeof notifications]
                    ? 'bg-gray-900'
                    : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    notifications[item.key as keyof typeof notifications]
                      ? 'translate-x-6'
                      : 'translate-x-0.5'
                  }`}
                ></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Abonnement */}
      <div className="bg-white border border-cosmos-cream p-6">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="w-5 h-5 text-emerald-600" strokeWidth={1.5} />
          <h2 className="text-xl font-light text-cosmos-night tracking-tight">
            {t('store.settings.subscription', 'Abonnement')}
          </h2>
        </div>

        <div className="flex items-start justify-between p-6 border border-cosmos-cream mb-6">
          <div>
            <div className="text-lg font-light text-cosmos-night mb-2">
              {t('store.settings.planGold', 'Plan Gold')}
            </div>
            <div className="text-sm text-text-secondary font-light mb-4">
              {t(
                'store.settings.planDescription',
                'Accès aux fonctionnalités premium de Cosmos Angré'
              )}
            </div>
            <div className="text-xs text-text-secondary font-light">
              {t('store.settings.nextRenewal', 'Prochain renouvellement : 15 novembre 2024')}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-light text-cosmos-night mb-1">25,000 FCFA</div>
            <div className="text-xs text-text-secondary font-light">
              {t('store.settings.perMonth', 'par mois')}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors">
            {t('store.settings.changePlan', 'Changer de plan')}
          </button>
          <button className="flex-1 px-6 py-2 border border-red-200 hover:border-red-600 bg-red-50 text-red-600 font-light transition-colors">
            {t('store.settings.cancelSubscription', "Annuler l'abonnement")}
          </button>
        </div>
      </div>

      {/* Confidentialité */}
      <div className="bg-white border border-cosmos-cream p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-cosmos-gold" strokeWidth={1.5} />
          <h2 className="text-xl font-light text-cosmos-night tracking-tight">
            {t('store.settings.privacyAndData', 'Confidentialité et Données')}
          </h2>
        </div>

        <div className="space-y-4">
          <button className="w-full text-left p-4 border border-cosmos-cream hover:border-gray-900 transition-colors">
            <div className="text-sm font-light text-cosmos-night mb-1">
              {t('store.settings.downloadData', 'Télécharger mes données')}
            </div>
            <div className="text-xs text-text-secondary font-light">
              {t('store.settings.downloadDataDesc', 'Recevez une copie de toutes vos données')}
            </div>
          </button>

          <button className="w-full text-left p-4 border border-red-200 hover:border-red-600 bg-red-50 transition-colors">
            <div className="text-sm font-light text-red-600 mb-1">
              {t('store.settings.deleteAccount', 'Supprimer mon compte')}
            </div>
            <div className="text-xs text-red-600 font-light">
              {t('store.settings.deleteAccountWarning', 'Cette action est irréversible')}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreSettings;
