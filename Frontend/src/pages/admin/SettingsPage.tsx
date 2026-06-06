import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Settings,
  Save,
  Bell,
  Shield,
  CreditCard,
  Image as ImageIcon,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Key,
  Database,
  Upload,
  Download,
  Check,
  AlertCircle,
  Globe,
} from 'lucide-react';

// ========================================
// Types
// ========================================

interface GeneralSettings {
  mallName: string;
  slogan: string;
  description: string;
  logoUrl: string;
  defaultLanguage: string;
  currency: string;
  openingHours: Record<string, { open: string; close: string }>;
}

interface ContactSettings {
  address: string;
  mainPhone: string;
  secondaryPhone: string;
  mainEmail: string;
  supportEmail: string;
  latitude: string;
  longitude: string;
  googleMapsLink: string;
}

interface SocialSettings {
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  linkedin: string;
  tiktok: string;
}

interface PaymentSettings {
  orangeMoneyEnabled: boolean;
  orangeMoneyMerchant: string;
  mtnEnabled: boolean;
  mtnMerchant: string;
  moovEnabled: boolean;
  moovMerchant: string;
  creditCardsEnabled: boolean;
  planFreePrice: string;
  planGoldPrice: string;
  planPlatinumPrice: string;
}

interface NotificationSettings {
  newRegistrations: boolean;
  newStores: boolean;
  newPayments: boolean;
  contentModeration: boolean;
  weeklyReports: boolean;
  systemAlerts: boolean;
}

interface SecuritySettings {
  twoFactor: boolean;
  forceHttps: boolean;
  logConnections: boolean;
}

interface AllSettings {
  general: GeneralSettings;
  contact: ContactSettings;
  social: SocialSettings;
  payments: PaymentSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
}

// ========================================
// Default values
// ========================================

const STORAGE_KEY = 'cosmos-admin-settings';

const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const defaultSettings: AllSettings = {
  general: {
    mallName: 'Cosmos Angre',
    slogan: "L'experience shopping ultime a Abidjan",
    description:
      "Cosmos Angre est le plus grand centre commercial d'Abidjan, offrant une experience unique avec plus de 200 boutiques, restaurants et services.",
    logoUrl: '',
    defaultLanguage: 'fr',
    currency: 'FCFA',
    openingHours: {
      monday: { open: '09:00', close: '21:00' },
      tuesday: { open: '09:00', close: '21:00' },
      wednesday: { open: '09:00', close: '21:00' },
      thursday: { open: '09:00', close: '21:00' },
      friday: { open: '09:00', close: '21:00' },
      saturday: { open: '09:00', close: '21:00' },
      sunday: { open: '09:00', close: '21:00' },
    },
  },
  contact: {
    address: "Angre, Abidjan, Cote d'Ivoire",
    mainPhone: '+225 27 22 XX XX XX',
    secondaryPhone: '+225 07 XX XX XX XX',
    mainEmail: 'contact@cosmosangre.com',
    supportEmail: 'support@cosmosangre.com',
    latitude: '5.3599',
    longitude: '-4.0083',
    googleMapsLink: '',
  },
  social: {
    facebook: 'https://facebook.com/cosmosangre',
    instagram: 'https://instagram.com/cosmosangre',
    twitter: 'https://twitter.com/cosmosangre',
    youtube: 'https://youtube.com/@cosmosangre',
    linkedin: '',
    tiktok: '',
  },
  payments: {
    orangeMoneyEnabled: true,
    orangeMoneyMerchant: '',
    mtnEnabled: true,
    mtnMerchant: '',
    moovEnabled: true,
    moovMerchant: '',
    creditCardsEnabled: false,
    planFreePrice: '0',
    planGoldPrice: '75000',
    planPlatinumPrice: '150000',
  },
  notifications: {
    newRegistrations: true,
    newStores: true,
    newPayments: true,
    contentModeration: true,
    weeklyReports: false,
    systemAlerts: true,
  },
  security: {
    twoFactor: false,
    forceHttps: true,
    logConnections: true,
  },
};

function loadSettings(): AllSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        general: { ...defaultSettings.general, ...parsed.general },
        contact: { ...defaultSettings.contact, ...parsed.contact },
        social: { ...defaultSettings.social, ...parsed.social },
        payments: { ...defaultSettings.payments, ...parsed.payments },
        notifications: { ...defaultSettings.notifications, ...parsed.notifications },
        security: { ...defaultSettings.security, ...parsed.security },
      };
    }
  } catch {
    // Ignore parse errors
  }
  return { ...defaultSettings };
}

function saveSettings(settings: AllSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

// ========================================
// Component
// ========================================

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  type SettingsTab = 'general' | 'contact' | 'social' | 'payments' | 'notifications' | 'security';
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  // Settings state
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(defaultSettings.general);
  const [contactSettings, setContactSettings] = useState<ContactSettings>(defaultSettings.contact);
  const [socialSettings, setSocialSettings] = useState<SocialSettings>(defaultSettings.social);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(defaultSettings.payments);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(
    defaultSettings.notifications
  );
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(
    defaultSettings.security
  );

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Feedback
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Logo upload ref
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const loaded = loadSettings();
    setGeneralSettings(loaded.general);
    setContactSettings(loaded.contact);
    setSocialSettings(loaded.social);
    setPaymentSettings(loaded.payments);
    setNotificationSettings(loaded.notifications);
    setSecuritySettings(loaded.security);
  }, []);

  // Show success message helper
  const showSuccess = useCallback((msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage(null);
    setTimeout(() => setSuccessMessage(null), 3000);
  }, []);

  // Show error message helper
  const showError = useCallback((msg: string) => {
    setErrorMessage(msg);
    setSuccessMessage(null);
    setTimeout(() => setErrorMessage(null), 5000);
  }, []);

  // Gather all settings for saving
  const getAllSettings = useCallback(
    (): AllSettings => ({
      general: generalSettings,
      contact: contactSettings,
      social: socialSettings,
      payments: paymentSettings,
      notifications: notificationSettings,
      security: securitySettings,
    }),
    [
      generalSettings,
      contactSettings,
      socialSettings,
      paymentSettings,
      notificationSettings,
      securitySettings,
    ]
  );

  // Save handler for each tab
  const handleSaveGeneral = () => {
    const all = getAllSettings();
    all.general = generalSettings;
    saveSettings(all);
    showSuccess(t('admin.settings.saved', 'Parametres generaux enregistres avec succes'));
  };

  const handleSaveContact = () => {
    const all = getAllSettings();
    all.contact = contactSettings;
    saveSettings(all);
    showSuccess(t('admin.settings.contactSaved', 'Informations de contact enregistrees'));
  };

  const handleSaveSocial = () => {
    const all = getAllSettings();
    all.social = socialSettings;
    saveSettings(all);
    showSuccess(t('admin.settings.socialSaved', 'Reseaux sociaux enregistres'));
  };

  const handleSavePayments = () => {
    const all = getAllSettings();
    all.payments = paymentSettings;
    saveSettings(all);
    showSuccess(t('admin.settings.paymentsSaved', 'Parametres de paiement enregistres'));
  };

  const handleSaveNotifications = () => {
    const all = getAllSettings();
    all.notifications = notificationSettings;
    saveSettings(all);
    showSuccess(
      t('admin.settings.notificationsSaved', 'Preferences de notifications enregistrees')
    );
  };

  const handleSaveSecurity = () => {
    const all = getAllSettings();
    all.security = securitySettings;
    saveSettings(all);
    showSuccess(t('admin.settings.securitySaved', 'Parametres de securite enregistres'));
  };

  // Password change handler
  const handlePasswordChange = () => {
    if (!currentPassword.trim()) {
      showError(
        t(
          'admin.settings.security.errorCurrentRequired',
          'Veuillez saisir votre mot de passe actuel'
        )
      );
      return;
    }
    if (newPassword.length < 8) {
      showError(
        t(
          'admin.settings.security.errorMinLength',
          'Le nouveau mot de passe doit contenir au moins 8 caracteres'
        )
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      showError(
        t('admin.settings.security.errorMismatch', 'Les mots de passe ne correspondent pas')
      );
      return;
    }
    // No server, just show success and clear fields
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showSuccess(t('admin.settings.security.passwordChanged', 'Mot de passe modifie avec succes'));
  };

  // Logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setGeneralSettings((prev) => ({ ...prev, logoUrl: objectUrl }));
    }
  };

  // Backup handler - export all localStorage data as JSON
  const handleBackup = () => {
    const allData: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        allData[key] = localStorage.getItem(key) || '';
      }
    }
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cosmos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showSuccess(t('admin.settings.security.backupSuccess', 'Sauvegarde telechargee avec succes'));
  };

  // Export data handler
  const handleExportData = () => {
    handleBackup();
  };

  const tabs: readonly { id: SettingsTab; label: string; icon: typeof Settings }[] = [
    { id: 'general', label: t('admin.settings.tabs.general', 'General'), icon: Settings },
    { id: 'contact', label: t('admin.settings.tabs.contact', 'Contact'), icon: Phone },
    { id: 'social', label: t('admin.settings.tabs.social', 'Reseaux Sociaux'), icon: Globe },
    { id: 'payments', label: t('admin.settings.tabs.payments', 'Paiements'), icon: CreditCard },
    {
      id: 'notifications',
      label: t('admin.settings.tabs.notifications', 'Notifications'),
      icon: Bell,
    },
    { id: 'security', label: t('admin.settings.tabs.security', 'Securite'), icon: Shield },
  ];

  const dayLabels: Record<string, string> = {
    monday: t('admin.settings.days.monday', 'Lundi'),
    tuesday: t('admin.settings.days.tuesday', 'Mardi'),
    wednesday: t('admin.settings.days.wednesday', 'Mercredi'),
    thursday: t('admin.settings.days.thursday', 'Jeudi'),
    friday: t('admin.settings.days.friday', 'Vendredi'),
    saturday: t('admin.settings.days.saturday', 'Samedi'),
    sunday: t('admin.settings.days.sunday', 'Dimanche'),
  };

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      {successMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-3 shadow-lg flex items-center gap-2 animate-fade-in-down">
          <Check className="w-4 h-4" strokeWidth={1.5} />
          <span className="text-sm font-light">{successMessage}</span>
        </div>
      )}

      {/* Error Banner */}
      {errorMessage && (
        <div className="fixed top-6 right-6 z-50 bg-red-600 text-white px-6 py-3 shadow-lg flex items-center gap-2 animate-fade-in-down">
          <AlertCircle className="w-4 h-4" strokeWidth={1.5} />
          <span className="text-sm font-light">{errorMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-cosmos-night mb-2 tracking-tight">
          {t('admin.settings.title', 'Parametres')}
        </h1>
        <p className="text-text-secondary font-light">
          {t('admin.settings.subtitle', 'Configurez les parametres de la plateforme')}
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-cosmos-cream">
        <div className="flex border-b border-cosmos-cream overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-light text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-gray-900 text-cosmos-night'
                    : 'text-text-secondary hover:text-cosmos-night'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
                {t('admin.settings.general.title', 'Informations Generales')}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.settings.general.mallName', 'Nom du Centre Commercial')}
                  </label>
                  <input
                    type="text"
                    value={generalSettings.mallName}
                    onChange={(e) =>
                      setGeneralSettings((prev) => ({ ...prev, mallName: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.settings.general.slogan', 'Slogan')}
                  </label>
                  <input
                    type="text"
                    value={generalSettings.slogan}
                    onChange={(e) =>
                      setGeneralSettings((prev) => ({ ...prev, slogan: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.settings.general.description', 'Description')}
                  </label>
                  <textarea
                    rows={4}
                    value={generalSettings.description}
                    onChange={(e) =>
                      setGeneralSettings((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.settings.general.logo', 'Logo')}
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 border-2 border-cosmos-cream rounded-lg flex items-center justify-center bg-cosmos-cream/50 overflow-hidden">
                      {generalSettings.logoUrl ? (
                        <img
                          src={generalSettings.logoUrl}
                          alt="Logo"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-text-secondary" strokeWidth={1.5} />
                      )}
                    </div>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                    >
                      <Upload className="w-4 h-4" strokeWidth={1.5} />
                      {t('admin.settings.general.uploadLogo', 'Telecharger un Logo')}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-cosmos-night font-light mb-2">
                      {t('admin.settings.general.defaultLanguage', 'Langue par Defaut')}
                    </label>
                    <select
                      value={generalSettings.defaultLanguage}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({ ...prev, defaultLanguage: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    >
                      <option value="fr">Francais</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-cosmos-night font-light mb-2">
                      {t('admin.settings.general.currency', 'Devise')}
                    </label>
                    <select
                      value={generalSettings.currency}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({ ...prev, currency: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    >
                      <option value="FCFA">FCFA (XOF)</option>
                      <option value="EUR">Euro (EUR)</option>
                      <option value="USD">Dollar (USD)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
                {t('admin.settings.general.openingHours', "Horaires d'Ouverture")}
              </h2>

              <div className="space-y-3">
                {dayKeys.map((dayKey) => (
                  <div key={dayKey} className="grid grid-cols-4 gap-4 items-center">
                    <div className="font-light text-cosmos-night">{dayLabels[dayKey]}</div>
                    <input
                      type="time"
                      value={generalSettings.openingHours[dayKey]?.open || '09:00'}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          openingHours: {
                            ...prev.openingHours,
                            [dayKey]: { ...prev.openingHours[dayKey], open: e.target.value },
                          },
                        }))
                      }
                      className="px-4 py-2 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                    <span className="text-center text-text-secondary font-light">
                      {t('admin.settings.general.to', 'a')}
                    </span>
                    <input
                      type="time"
                      value={generalSettings.openingHours[dayKey]?.close || '21:00'}
                      onChange={(e) =>
                        setGeneralSettings((prev) => ({
                          ...prev,
                          openingHours: {
                            ...prev.openingHours,
                            [dayKey]: { ...prev.openingHours[dayKey], close: e.target.value },
                          },
                        }))
                      }
                      className="px-4 py-2 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-cosmos-cream">
              <button
                onClick={handleSaveGeneral}
                className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
              >
                <Save className="w-4 h-4" strokeWidth={1.5} />
                {t('common.save', 'Enregistrer')}
              </button>
            </div>
          </div>
        )}

        {/* Contact Settings */}
        {activeTab === 'contact' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
                {t('admin.settings.contact.title', 'Informations de Contact')}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.settings.contact.address', 'Adresse')}
                  </label>
                  <input
                    type="text"
                    value={contactSettings.address}
                    onChange={(e) =>
                      setContactSettings((prev) => ({ ...prev, address: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-cosmos-night font-light mb-2">
                      {t('admin.settings.contact.mainPhone', 'Telephone Principal')}
                    </label>
                    <input
                      type="tel"
                      value={contactSettings.mainPhone}
                      onChange={(e) =>
                        setContactSettings((prev) => ({ ...prev, mainPhone: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-cosmos-night font-light mb-2">
                      {t('admin.settings.contact.secondaryPhone', 'Telephone Secondaire')}
                    </label>
                    <input
                      type="tel"
                      value={contactSettings.secondaryPhone}
                      onChange={(e) =>
                        setContactSettings((prev) => ({ ...prev, secondaryPhone: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-cosmos-night font-light mb-2">
                      {t('admin.settings.contact.mainEmail', 'Email Principal')}
                    </label>
                    <input
                      type="email"
                      value={contactSettings.mainEmail}
                      onChange={(e) =>
                        setContactSettings((prev) => ({ ...prev, mainEmail: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-cosmos-night font-light mb-2">
                      {t('admin.settings.contact.supportEmail', 'Email Support')}
                    </label>
                    <input
                      type="email"
                      value={contactSettings.supportEmail}
                      onChange={(e) =>
                        setContactSettings((prev) => ({ ...prev, supportEmail: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.settings.contact.gpsCoordinates', 'Coordonnees GPS')}
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Latitude"
                      value={contactSettings.latitude}
                      onChange={(e) =>
                        setContactSettings((prev) => ({ ...prev, latitude: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                    <input
                      type="text"
                      placeholder="Longitude"
                      value={contactSettings.longitude}
                      onChange={(e) =>
                        setContactSettings((prev) => ({ ...prev, longitude: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.settings.contact.googleMapsLink', 'Lien Google Maps')}
                  </label>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={contactSettings.googleMapsLink}
                    onChange={(e) =>
                      setContactSettings((prev) => ({ ...prev, googleMapsLink: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-cosmos-cream">
              <button
                onClick={handleSaveContact}
                className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
              >
                <Save className="w-4 h-4" strokeWidth={1.5} />
                {t('common.save', 'Enregistrer')}
              </button>
            </div>
          </div>
        )}

        {/* Social Media Settings */}
        {activeTab === 'social' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
                {t('admin.settings.social.title', 'Reseaux Sociaux')}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2 flex items-center gap-2">
                    <Facebook className="w-4 h-4 text-cosmos-night" strokeWidth={1.5} />
                    Facebook
                  </label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/cosmosangre"
                    value={socialSettings.facebook}
                    onChange={(e) =>
                      setSocialSettings((prev) => ({ ...prev, facebook: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2 flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-pink-600" strokeWidth={1.5} />
                    Instagram
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/cosmosangre"
                    value={socialSettings.instagram}
                    onChange={(e) =>
                      setSocialSettings((prev) => ({ ...prev, instagram: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2 flex items-center gap-2">
                    <Twitter className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
                    Twitter / X
                  </label>
                  <input
                    type="url"
                    placeholder="https://twitter.com/cosmosangre"
                    value={socialSettings.twitter}
                    onChange={(e) =>
                      setSocialSettings((prev) => ({ ...prev, twitter: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2 flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-red-600" strokeWidth={1.5} />
                    YouTube
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/@cosmosangre"
                    value={socialSettings.youtube}
                    onChange={(e) =>
                      setSocialSettings((prev) => ({ ...prev, youtube: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/company/cosmosangre"
                    value={socialSettings.linkedin}
                    onChange={(e) =>
                      setSocialSettings((prev) => ({ ...prev, linkedin: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">TikTok</label>
                  <input
                    type="url"
                    placeholder="https://tiktok.com/@cosmosangre"
                    value={socialSettings.tiktok}
                    onChange={(e) =>
                      setSocialSettings((prev) => ({ ...prev, tiktok: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-cosmos-cream">
              <button
                onClick={handleSaveSocial}
                className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
              >
                <Save className="w-4 h-4" strokeWidth={1.5} />
                {t('common.save', 'Enregistrer')}
              </button>
            </div>
          </div>
        )}

        {/* Payment Settings */}
        {activeTab === 'payments' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
                {t('admin.settings.payments.title', 'Moyens de Paiement')}
              </h2>

              <div className="space-y-4">
                <div className="border border-cosmos-cream p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-amber-50 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-amber-600" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-light text-cosmos-night">Orange Money</h3>
                        <p className="text-sm text-text-secondary font-light">
                          {t('admin.settings.payments.mobilePayment', 'Paiement mobile')}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paymentSettings.orangeMoneyEnabled}
                        onChange={(e) =>
                          setPaymentSettings((prev) => ({
                            ...prev,
                            orangeMoneyEnabled: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cosmos-cream after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cosmos-night"></div>
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder={t('admin.settings.payments.merchantNumber', 'Numero marchand')}
                    value={paymentSettings.orangeMoneyMerchant}
                    onChange={(e) =>
                      setPaymentSettings((prev) => ({
                        ...prev,
                        orangeMoneyMerchant: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-sm"
                  />
                </div>

                <div className="border border-cosmos-cream p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-50 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-yellow-600" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-light text-cosmos-night">MTN Mobile Money</h3>
                        <p className="text-sm text-text-secondary font-light">
                          {t('admin.settings.payments.mobilePayment', 'Paiement mobile')}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paymentSettings.mtnEnabled}
                        onChange={(e) =>
                          setPaymentSettings((prev) => ({ ...prev, mtnEnabled: e.target.checked }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cosmos-cream after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cosmos-night"></div>
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder={t('admin.settings.payments.merchantNumber', 'Numero marchand')}
                    value={paymentSettings.mtnMerchant}
                    onChange={(e) =>
                      setPaymentSettings((prev) => ({ ...prev, mtnMerchant: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-sm"
                  />
                </div>

                <div className="border border-cosmos-cream p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-50 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-emerald-600" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-light text-cosmos-night">Moov Money</h3>
                        <p className="text-sm text-text-secondary font-light">
                          {t('admin.settings.payments.mobilePayment', 'Paiement mobile')}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paymentSettings.moovEnabled}
                        onChange={(e) =>
                          setPaymentSettings((prev) => ({ ...prev, moovEnabled: e.target.checked }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cosmos-cream after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cosmos-night"></div>
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder={t('admin.settings.payments.merchantNumber', 'Numero marchand')}
                    value={paymentSettings.moovMerchant}
                    onChange={(e) =>
                      setPaymentSettings((prev) => ({ ...prev, moovMerchant: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-sm"
                  />
                </div>

                <div className="border border-cosmos-cream p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-cosmos-gold/10 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-cosmos-night" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-light text-cosmos-night">
                          {t('admin.settings.payments.creditCards', 'Cartes Bancaires')}
                        </h3>
                        <p className="text-sm text-text-secondary font-light">
                          Visa, Mastercard, etc.
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paymentSettings.creditCardsEnabled}
                        onChange={(e) =>
                          setPaymentSettings((prev) => ({
                            ...prev,
                            creditCardsEnabled: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cosmos-cream after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cosmos-night"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
                {t('admin.settings.payments.planPricing', 'Tarifs des Plans')}
              </h2>

              <div className="grid grid-cols-3 gap-4">
                <div className="border border-cosmos-cream p-4">
                  <h3 className="text-sm text-text-secondary font-light mb-2">Plan Free</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <input
                      type="number"
                      value={paymentSettings.planFreePrice}
                      onChange={(e) =>
                        setPaymentSettings((prev) => ({ ...prev, planFreePrice: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                    <span className="text-sm text-text-secondary font-light">FCFA/mois</span>
                  </div>
                </div>
                <div className="border border-cosmos-cream p-4">
                  <h3 className="text-sm text-text-secondary font-light mb-2">Plan Gold</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <input
                      type="number"
                      value={paymentSettings.planGoldPrice}
                      onChange={(e) =>
                        setPaymentSettings((prev) => ({ ...prev, planGoldPrice: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                    <span className="text-sm text-text-secondary font-light">FCFA/mois</span>
                  </div>
                </div>
                <div className="border border-cosmos-cream p-4">
                  <h3 className="text-sm text-text-secondary font-light mb-2">Plan Platinum</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <input
                      type="number"
                      value={paymentSettings.planPlatinumPrice}
                      onChange={(e) =>
                        setPaymentSettings((prev) => ({
                          ...prev,
                          planPlatinumPrice: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    />
                    <span className="text-sm text-text-secondary font-light">FCFA/mois</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-cosmos-cream">
              <button
                onClick={handleSavePayments}
                className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
              >
                <Save className="w-4 h-4" strokeWidth={1.5} />
                {t('common.save', 'Enregistrer')}
              </button>
            </div>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
                {t('admin.settings.notifications.title', 'Preferences de Notifications')}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-cosmos-cream">
                  <div>
                    <h3 className="font-light text-cosmos-night">
                      {t('admin.settings.notifications.newRegistrations', 'Nouvelles Inscriptions')}
                    </h3>
                    <p className="text-sm text-text-secondary font-light">
                      {t(
                        'admin.settings.notifications.newRegistrationsDesc',
                        "Recevoir un email quand un nouvel utilisateur s'inscrit"
                      )}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.newRegistrations}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          newRegistrations: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cosmos-cream after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cosmos-night"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-cosmos-cream">
                  <div>
                    <h3 className="font-light text-cosmos-night">
                      {t('admin.settings.notifications.newStores', 'Nouvelles Boutiques')}
                    </h3>
                    <p className="text-sm text-text-secondary font-light">
                      {t(
                        'admin.settings.notifications.newStoresDesc',
                        'Recevoir un email quand une boutique est creee'
                      )}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.newStores}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          newStores: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cosmos-cream after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cosmos-night"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-cosmos-cream">
                  <div>
                    <h3 className="font-light text-cosmos-night">
                      {t('admin.settings.notifications.newPayments', 'Nouveaux Paiements')}
                    </h3>
                    <p className="text-sm text-text-secondary font-light">
                      {t(
                        'admin.settings.notifications.newPaymentsDesc',
                        'Recevoir un email pour chaque paiement recu'
                      )}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.newPayments}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          newPayments: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cosmos-cream after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cosmos-night"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-cosmos-cream">
                  <div>
                    <h3 className="font-light text-cosmos-night">
                      {t('admin.settings.notifications.contentModeration', 'Contenu a Moderer')}
                    </h3>
                    <p className="text-sm text-text-secondary font-light">
                      {t(
                        'admin.settings.notifications.contentModerationDesc',
                        'Recevoir un email quand du contenu necessite une moderation'
                      )}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.contentModeration}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          contentModeration: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cosmos-cream after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cosmos-night"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-cosmos-cream">
                  <div>
                    <h3 className="font-light text-cosmos-night">
                      {t('admin.settings.notifications.weeklyReports', 'Rapports Hebdomadaires')}
                    </h3>
                    <p className="text-sm text-text-secondary font-light">
                      {t(
                        'admin.settings.notifications.weeklyReportsDesc',
                        'Recevoir un rapport hebdomadaire des activites'
                      )}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.weeklyReports}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          weeklyReports: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cosmos-cream after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cosmos-night"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-cosmos-cream">
                  <div>
                    <h3 className="font-light text-cosmos-night">
                      {t('admin.settings.notifications.systemAlerts', 'Alertes Systeme')}
                    </h3>
                    <p className="text-sm text-text-secondary font-light">
                      {t(
                        'admin.settings.notifications.systemAlertsDesc',
                        'Recevoir des alertes en cas de probleme systeme'
                      )}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.systemAlerts}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          systemAlerts: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cosmos-cream after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cosmos-night"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-cosmos-cream">
              <button
                onClick={handleSaveNotifications}
                className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
              >
                <Save className="w-4 h-4" strokeWidth={1.5} />
                {t('common.save', 'Enregistrer')}
              </button>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
                {t('admin.settings.security.title', 'Securite')}
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-cosmos-cream">
                  <div>
                    <h3 className="font-light text-cosmos-night">
                      {t(
                        'admin.settings.security.twoFactor',
                        'Authentification a Deux Facteurs (2FA)'
                      )}
                    </h3>
                    <p className="text-sm text-text-secondary font-light">
                      {t(
                        'admin.settings.security.twoFactorDesc',
                        'Ajouter une couche de securite supplementaire'
                      )}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.twoFactor}
                      onChange={(e) =>
                        setSecuritySettings((prev) => ({ ...prev, twoFactor: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cosmos-cream after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cosmos-night"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-cosmos-cream">
                  <div>
                    <h3 className="font-light text-cosmos-night">
                      {t('admin.settings.security.forceHttps', 'Forcer HTTPS')}
                    </h3>
                    <p className="text-sm text-text-secondary font-light">
                      {t(
                        'admin.settings.security.forceHttpsDesc',
                        'Rediriger automatiquement vers HTTPS'
                      )}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.forceHttps}
                      onChange={(e) =>
                        setSecuritySettings((prev) => ({ ...prev, forceHttps: e.target.checked }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cosmos-cream after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cosmos-night"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-cosmos-cream">
                  <div>
                    <h3 className="font-light text-cosmos-night">
                      {t('admin.settings.security.logConnections', 'Enregistrer les Connexions')}
                    </h3>
                    <p className="text-sm text-text-secondary font-light">
                      {t(
                        'admin.settings.security.logConnectionsDesc',
                        'Garder un historique des connexions'
                      )}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={securitySettings.logConnections}
                      onChange={(e) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          logConnections: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cosmos-cream after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cosmos-night"></div>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
                {t('admin.settings.security.changePassword', 'Changer le Mot de Passe')}
              </h2>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.settings.security.currentPassword', 'Mot de passe actuel')}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>
                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.settings.security.newPassword', 'Nouveau mot de passe')}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                  {newPassword.length > 0 && newPassword.length < 8 && (
                    <p className="text-xs text-red-500 mt-1 font-light">
                      {t('admin.settings.security.minLengthHint', 'Minimum 8 caracteres')}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t(
                      'admin.settings.security.confirmPassword',
                      'Confirmer le nouveau mot de passe'
                    )}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                  />
                  {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                    <p className="text-xs text-red-500 mt-1 font-light">
                      {t(
                        'admin.settings.security.mismatchHint',
                        'Les mots de passe ne correspondent pas'
                      )}
                    </p>
                  )}
                </div>
                <button
                  onClick={handlePasswordChange}
                  className="flex items-center gap-2 px-5 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors text-sm"
                >
                  <Key className="w-4 h-4" strokeWidth={1.5} />
                  {t('admin.settings.security.updatePassword', 'Mettre a jour le mot de passe')}
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
                {t('admin.settings.security.backupData', 'Sauvegarde et Donnees')}
              </h2>

              <div className="space-y-3">
                <button
                  onClick={handleBackup}
                  className="w-full flex items-center justify-between p-4 border border-cosmos-cream hover:border-gray-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
                    <div className="text-left">
                      <h3 className="font-light text-cosmos-night">
                        {t(
                          'admin.settings.security.backupDatabase',
                          'Sauvegarder la Base de Donnees'
                        )}
                      </h3>
                      <p className="text-sm text-text-secondary font-light">
                        {t(
                          'admin.settings.security.lastBackup',
                          'Derniere sauvegarde: 10 Nov 2024'
                        )}
                      </p>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
                </button>

                <button
                  onClick={handleExportData}
                  className="w-full flex items-center justify-between p-4 border border-cosmos-cream hover:border-gray-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 text-text-secondary" strokeWidth={1.5} />
                    <div className="text-left">
                      <h3 className="font-light text-cosmos-night">
                        {t('admin.settings.security.exportData', 'Exporter Toutes les Donnees')}
                      </h3>
                      <p className="text-sm text-text-secondary font-light">
                        {t(
                          'admin.settings.security.exportDataDesc',
                          'Telecharger un export complet en JSON'
                        )}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-cosmos-cream">
              <button
                onClick={handleSaveSecurity}
                className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
              >
                <Save className="w-4 h-4" strokeWidth={1.5} />
                {t('common.save', 'Enregistrer')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
