import React, { useState } from 'react';
import {
  Settings,
  Save,
  Mail,
  Database,
  Shield,
  Bell,
  Code,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'database', label: 'Base de données', icon: Database },
    { id: 'api', label: 'API', icon: Code },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-white mb-2 tracking-tight">Paramètres Système</h1>
          <p className="text-text-secondary font-light">Configuration globale de la plateforme</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-white text-cosmos-night font-light hover:bg-cosmos-cream transition-colors"
        >
          <Save className="w-5 h-5" strokeWidth={1.5} />
          Enregistrer les modifications
        </button>
      </div>

      {/* Save Success Message */}
      {saved && (
        <div className="bg-green-900 border border-green-800 p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500" strokeWidth={1.5} />
          <span className="text-green-100 font-light">Paramètres enregistrés avec succès</span>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-cosmos-night border border-white/5">
        <div className="flex overflow-x-auto border-b border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-light transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-black text-white border-b-2 border-white'
                  : 'text-text-secondary hover:text-white hover:bg-black'
              }`}
            >
              <tab.icon className="w-5 h-5" strokeWidth={1.5} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-text-secondary mb-2 font-light">
                  Nom du site
                </label>
                <input
                  type="text"
                  defaultValue="Cosmos Angré"
                  className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2 font-light">
                  Description
                </label>
                <textarea
                  rows={3}
                  defaultValue="Le plus grand complexe commercial de Côte d'Ivoire"
                  className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-text-secondary mb-2 font-light">
                    Langue par défaut
                  </label>
                  <select className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light">
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-2 font-light">
                    Fuseau horaire
                  </label>
                  <select className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light">
                    <option value="Africa/Abidjan">Africa/Abidjan (GMT)</option>
                    <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-text-secondary mb-2 font-light">
                    URL du site
                  </label>
                  <input
                    type="url"
                    defaultValue="https://cosmosangre.ci"
                    className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-2 font-light">
                    Email de contact
                  </label>
                  <input
                    type="email"
                    defaultValue="contact@cosmosangre.ci"
                    className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-black border border-white/5">
                <input
                  type="checkbox"
                  id="maintenance"
                  className="w-5 h-5"
                  defaultChecked={false}
                />
                <label htmlFor="maintenance" className="text-white font-light cursor-pointer">
                  Mode maintenance (Désactiver temporairement le site public)
                </label>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-text-secondary mb-2 font-light">
                  Serveur SMTP
                </label>
                <input
                  type="text"
                  defaultValue="smtp.cosmosangre.ci"
                  className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm text-text-secondary mb-2 font-light">Port</label>
                  <input
                    type="number"
                    defaultValue="587"
                    className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-2 font-light">
                    Utilisateur
                  </label>
                  <input
                    type="text"
                    defaultValue="noreply@cosmosangre.ci"
                    className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-secondary mb-2 font-light">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    defaultValue="••••••••"
                    className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-4 bg-black border border-white/5">
                  <input type="checkbox" id="email_ssl" className="w-5 h-5" defaultChecked={true} />
                  <label htmlFor="email_ssl" className="text-white font-light cursor-pointer">
                    Utiliser SSL/TLS
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 bg-black border border-white/5">
                  <input
                    type="checkbox"
                    id="email_queue"
                    className="w-5 h-5"
                    defaultChecked={true}
                  />
                  <label htmlFor="email_queue" className="text-white font-light cursor-pointer">
                    Utiliser la file d'attente
                  </label>
                </div>
              </div>

              <div>
                <button className="px-6 py-3 bg-white/5 text-white font-light hover:bg-gray-700 transition-colors">
                  Tester la configuration email
                </button>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-text-secondary mb-2 font-light">
                  Durée de session (minutes)
                </label>
                <input
                  type="number"
                  defaultValue="1440"
                  className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2 font-light">
                  Nombre max de tentatives de connexion
                </label>
                <input
                  type="number"
                  defaultValue="5"
                  className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
                />
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2 font-light">
                  Durée de blocage après échec (minutes)
                </label>
                <input
                  type="number"
                  defaultValue="30"
                  className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-black border border-white/5">
                  <input
                    type="checkbox"
                    id="two_factor"
                    className="w-5 h-5"
                    defaultChecked={true}
                  />
                  <label htmlFor="two_factor" className="text-white font-light cursor-pointer">
                    Activer l'authentification à deux facteurs (2FA)
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 bg-black border border-white/5">
                  <input
                    type="checkbox"
                    id="strong_password"
                    className="w-5 h-5"
                    defaultChecked={true}
                  />
                  <label htmlFor="strong_password" className="text-white font-light cursor-pointer">
                    Exiger des mots de passe forts (8+ caractères, majuscules, chiffres, symboles)
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 bg-black border border-white/5">
                  <input
                    type="checkbox"
                    id="ip_whitelist"
                    className="w-5 h-5"
                    defaultChecked={false}
                  />
                  <label htmlFor="ip_whitelist" className="text-white font-light cursor-pointer">
                    Activer la liste blanche d'adresses IP pour les admins
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 bg-black border border-white/5">
                  <input type="checkbox" id="ssl_only" className="w-5 h-5" defaultChecked={true} />
                  <label htmlFor="ssl_only" className="text-white font-light cursor-pointer">
                    Forcer HTTPS (Rediriger HTTP vers HTTPS)
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Database Settings */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="bg-black border border-white/5 p-6">
                <h3 className="text-lg font-light text-white mb-4 tracking-tight">
                  Connexion Base de Données
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-text-secondary font-light">Hôte:</span>
                      <span className="text-white font-light ml-2">localhost:5432</span>
                    </div>
                    <div>
                      <span className="text-sm text-text-secondary font-light">Base:</span>
                      <span className="text-white font-light ml-2">cosmos_angre_db</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-text-secondary font-light">Utilisateur:</span>
                      <span className="text-white font-light ml-2">admin</span>
                    </div>
                    <div>
                      <span className="text-sm text-text-secondary font-light">Statut:</span>
                      <span className="text-green-500 font-light ml-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                        Connecté
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-light text-white mb-4 tracking-tight">
                  Sauvegardes automatiques
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-text-secondary mb-2 font-light">
                      Fréquence des sauvegardes
                    </label>
                    <select className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light">
                      <option value="daily">Quotidienne</option>
                      <option value="weekly">Hebdomadaire</option>
                      <option value="monthly">Mensuelle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-text-secondary mb-2 font-light">
                      Nombre de sauvegardes à conserver
                    </label>
                    <input
                      type="number"
                      defaultValue="7"
                      className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button className="px-6 py-3 bg-white/5 text-white font-light hover:bg-gray-700 transition-colors">
                      Créer une sauvegarde maintenant
                    </button>
                    <button className="px-6 py-3 bg-white/5 text-white font-light hover:bg-gray-700 transition-colors">
                      Restaurer depuis une sauvegarde
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Settings */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-text-secondary mb-2 font-light">
                  Clé API publique
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    defaultValue="pk_live_51JqR8..."
                    readOnly
                    className="flex-1 px-4 py-3 bg-black border border-white/5 text-white focus:outline-none font-light"
                  />
                  <button className="px-6 py-3 bg-white/5 text-white font-light hover:bg-gray-700 transition-colors">
                    Copier
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2 font-light">
                  Clé API secrète
                </label>
                <div className="flex gap-3">
                  <input
                    type="password"
                    defaultValue="sk_live_51JqR8..."
                    readOnly
                    className="flex-1 px-4 py-3 bg-black border border-white/5 text-white focus:outline-none font-light"
                  />
                  <button className="px-6 py-3 bg-white/5 text-white font-light hover:bg-gray-700 transition-colors">
                    Copier
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2 font-light">
                  Limite de requêtes (par heure)
                </label>
                <input
                  type="number"
                  defaultValue="1000"
                  className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-black border border-white/5">
                <input type="checkbox" id="api_logging" className="w-5 h-5" defaultChecked={true} />
                <label htmlFor="api_logging" className="text-white font-light cursor-pointer">
                  Activer les logs des requêtes API
                </label>
              </div>

              <div>
                <button className="px-6 py-3 bg-red-900 text-white font-light hover:bg-red-800 transition-colors">
                  Régénérer les clés API
                </button>
                <p className="text-xs text-text-secondary mt-2 font-light">
                  <AlertCircle className="w-4 h-4 inline mr-1" strokeWidth={1.5} />
                  Attention : Cette action invalidera toutes les intégrations existantes
                </p>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-light text-white mb-4 tracking-tight">
                Notifications Email
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-black border border-white/5">
                  <input
                    type="checkbox"
                    id="notif_new_store"
                    className="w-5 h-5"
                    defaultChecked={true}
                  />
                  <label htmlFor="notif_new_store" className="text-white font-light cursor-pointer">
                    Nouvelle demande d'inscription boutique
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 bg-black border border-white/5">
                  <input
                    type="checkbox"
                    id="notif_new_subscription"
                    className="w-5 h-5"
                    defaultChecked={true}
                  />
                  <label
                    htmlFor="notif_new_subscription"
                    className="text-white font-light cursor-pointer"
                  >
                    Nouvel abonnement payant
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 bg-black border border-white/5">
                  <input
                    type="checkbox"
                    id="notif_payment_failed"
                    className="w-5 h-5"
                    defaultChecked={true}
                  />
                  <label
                    htmlFor="notif_payment_failed"
                    className="text-white font-light cursor-pointer"
                  >
                    Échec de paiement
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 bg-black border border-white/5">
                  <input
                    type="checkbox"
                    id="notif_system_error"
                    className="w-5 h-5"
                    defaultChecked={true}
                  />
                  <label
                    htmlFor="notif_system_error"
                    className="text-white font-light cursor-pointer"
                  >
                    Erreurs système critiques
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 bg-black border border-white/5">
                  <input
                    type="checkbox"
                    id="notif_daily_report"
                    className="w-5 h-5"
                    defaultChecked={false}
                  />
                  <label
                    htmlFor="notif_daily_report"
                    className="text-white font-light cursor-pointer"
                  >
                    Rapport quotidien d'activité
                  </label>
                </div>

                <div className="flex items-center gap-3 p-4 bg-black border border-white/5">
                  <input
                    type="checkbox"
                    id="notif_weekly_report"
                    className="w-5 h-5"
                    defaultChecked={true}
                  />
                  <label
                    htmlFor="notif_weekly_report"
                    className="text-white font-light cursor-pointer"
                  >
                    Rapport hebdomadaire d'activité
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-2 font-light">
                  Emails destinataires des notifications
                </label>
                <textarea
                  rows={3}
                  defaultValue="admin@cosmosangre.ci&#10;superadmin@cosmosangre.ci"
                  className="w-full px-4 py-3 bg-black border border-white/5 text-white focus:outline-none focus:border-white/10 font-light"
                  placeholder="Un email par ligne"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
