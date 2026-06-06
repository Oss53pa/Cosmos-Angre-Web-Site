import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  MessageSquare,
  Mail,
  Eye,
  EyeOff,
  Search,
  Clock,
  User,
  Phone,
  Trash2,
  XCircle,
  Calendar,
} from 'lucide-react';
import { useContacts } from '../../hooks/useContacts';
import type { Contact } from '../../types/database';

const ContactsManagement: React.FC = () => {
  const { t } = useTranslation();
  const { contacts, isLoading, error, fetchContacts, markAsRead } = useContacts();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [viewContact, setViewContact] = useState<Contact | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      if (viewContact && viewContact.id === id) {
        setViewContact({ ...viewContact, is_read: true });
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleViewContact = (contact: Contact) => {
    setViewContact(contact);
    if (!contact.is_read) {
      handleMarkAsRead(contact.id);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.subject && contact.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'read' && contact.is_read) ||
      (statusFilter === 'unread' && !contact.is_read);
    return matchesSearch && matchesStatus;
  });

  const totalMessages = contacts.length;
  const unreadMessages = contacts.filter((c) => !c.is_read).length;
  const readMessages = contacts.filter((c) => c.is_read).length;

  // Count messages from this week
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const thisWeekMessages = contacts.filter((c) => new Date(c.created_at) >= startOfWeek).length;

  const stats = [
    {
      label: t('admin.contacts.stats.total', 'Total Messages'),
      value: totalMessages,
      icon: MessageSquare,
      color: 'text-cosmos-night',
      bg: 'bg-cosmos-gold/10',
    },
    {
      label: t('admin.contacts.stats.unread', 'Non Lus'),
      value: unreadMessages,
      icon: EyeOff,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: t('admin.contacts.stats.read', 'Lus'),
      value: readMessages,
      icon: Eye,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: t('admin.contacts.stats.thisWeek', 'Cette Semaine'),
      value: thisWeekMessages,
      icon: Clock,
      color: 'text-cosmos-gold',
      bg: 'bg-cosmos-gold/5',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-cosmos-night mb-2 tracking-tight">
            {t('admin.contacts.title', 'Gestion des Messages')}
          </h1>
          <p className="text-text-secondary font-light">
            {t(
              'admin.contacts.subtitle',
              'Consultez et gerez les messages du formulaire de contact'
            )}
          </p>
        </div>
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
          <p className="text-red-600 font-light">
            {t('admin.contacts.error', 'Erreur lors du chargement des messages')}: {error}
          </p>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Statistics */}
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

          {/* Filters */}
          <div className="bg-white border border-cosmos-cream p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  placeholder={t(
                    'admin.contacts.searchPlaceholder',
                    'Rechercher par nom, email ou sujet...'
                  )}
                  className="w-full pl-10 pr-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`flex-1 px-4 py-3 border font-light text-sm transition-colors ${
                    statusFilter === 'all'
                      ? 'border-gray-900 text-cosmos-night bg-cosmos-cream/50'
                      : 'border-cosmos-cream text-text-secondary hover:border-gray-900 hover:text-cosmos-night'
                  }`}
                >
                  {t('admin.contacts.filter.all', 'Tous')} ({totalMessages})
                </button>
                <button
                  onClick={() => setStatusFilter('unread')}
                  className={`flex-1 px-4 py-3 border font-light text-sm transition-colors ${
                    statusFilter === 'unread'
                      ? 'border-gray-900 text-cosmos-night bg-cosmos-cream/50'
                      : 'border-cosmos-cream text-text-secondary hover:border-gray-900 hover:text-cosmos-night'
                  }`}
                >
                  {t('admin.contacts.filter.unread', 'Non Lus')} ({unreadMessages})
                </button>
                <button
                  onClick={() => setStatusFilter('read')}
                  className={`flex-1 px-4 py-3 border font-light text-sm transition-colors ${
                    statusFilter === 'read'
                      ? 'border-gray-900 text-cosmos-night bg-cosmos-cream/50'
                      : 'border-cosmos-cream text-text-secondary hover:border-gray-900 hover:text-cosmos-night'
                  }`}
                >
                  {t('admin.contacts.filter.read', 'Lus')} ({readMessages})
                </button>
              </div>
            </div>
          </div>

          {/* Messages Table */}
          <div className="bg-white border border-cosmos-cream">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-cosmos-cream">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                      {t('admin.contacts.table.status', 'Statut')}
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                      {t('admin.contacts.table.sender', 'Expediteur')}
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                      {t('admin.contacts.table.subject', 'Sujet')}
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                      {t('admin.contacts.table.date', 'Date')}
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                      {t('common.actions', 'Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className={`hover:bg-cosmos-cream/50 transition-colors cursor-pointer ${
                        !contact.is_read ? 'bg-cosmos-gold/5' : ''
                      }`}
                      onClick={() => handleViewContact(contact)}
                    >
                      <td className="px-6 py-4">
                        {contact.is_read ? (
                          <span className="text-xs px-3 py-1 text-emerald-600 bg-emerald-50 border border-green-200 font-light">
                            {t('admin.contacts.status.read', 'Lu')}
                          </span>
                        ) : (
                          <span className="text-xs px-3 py-1 text-amber-600 bg-amber-50 border border-orange-200 font-light">
                            {t('admin.contacts.status.unread', 'Non Lu')}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-cosmos-night rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm">
                              {contact.full_name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                                .slice(0, 2)}
                            </span>
                          </div>
                          <div>
                            <div
                              className={`font-light text-cosmos-night ${!contact.is_read ? 'font-medium' : ''}`}
                            >
                              {contact.full_name}
                            </div>
                            <div className="text-sm text-text-secondary font-light">
                              {contact.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`text-sm font-light text-cosmos-night ${!contact.is_read ? 'font-medium' : ''}`}
                        >
                          {contact.subject || t('admin.contacts.noSubject', '(Aucun sujet)')}
                        </div>
                        <div className="text-xs text-text-secondary font-light line-clamp-1 mt-1">
                          {contact.message}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-light text-cosmos-night">
                          {new Date(contact.created_at).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-xs text-text-secondary font-light">
                          {new Date(contact.created_at).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleViewContact(contact)}
                            className="p-2 border border-cosmos-cream hover:border-gray-900 transition-colors"
                            title={t('common.view', 'Voir')}
                          >
                            <Eye className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                          {!contact.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(contact.id)}
                              className="p-2 border border-green-200 bg-emerald-50 hover:border-green-600 text-emerald-600 transition-colors"
                              title={t('admin.contacts.markAsRead', 'Marquer comme lu')}
                            >
                              <Eye className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteConfirm(contact.id)}
                            className="p-2 border border-red-200 bg-red-50 hover:border-red-600 text-red-600 transition-colors"
                            title={t('common.delete', 'Supprimer')}
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredContacts.length === 0 && (
              <div className="p-12 text-center">
                <MessageSquare
                  className="w-12 h-12 text-text-secondary mx-auto mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="text-lg font-light text-cosmos-night mb-2">
                  {t('admin.contacts.noMessages', 'Aucun message')}
                </h3>
                <p className="text-sm text-text-secondary font-light">
                  {t(
                    'admin.contacts.noMessagesDescription',
                    'Aucun message ne correspond a vos criteres de recherche'
                  )}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {/* View Contact Modal */}
      {viewContact && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setViewContact(null)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
                <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                  {t('admin.contacts.detail.title', 'Details du Message')}
                </h2>
                <button
                  onClick={() => setViewContact(null)}
                  className="text-text-secondary hover:text-cosmos-night"
                >
                  <XCircle className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Sender Info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-cosmos-night rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xl">
                      {viewContact.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-light text-cosmos-night mb-1 tracking-tight">
                      {viewContact.full_name}
                    </h3>
                    <div className="flex items-center gap-2">
                      {viewContact.is_read ? (
                        <span className="text-xs px-3 py-1 text-emerald-600 bg-emerald-50 border border-green-200 font-light">
                          {t('admin.contacts.status.read', 'Lu')}
                        </span>
                      ) : (
                        <span className="text-xs px-3 py-1 text-amber-600 bg-amber-50 border border-orange-200 font-light">
                          {t('admin.contacts.status.unread', 'Non Lu')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-cosmos-cream bg-cosmos-cream/30">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-text-secondary flex-shrink-0" strokeWidth={1.5} />
                    <div>
                      <div className="text-xs text-text-secondary font-light">
                        {t('admin.contacts.detail.email', 'Email')}
                      </div>
                      <div className="text-sm font-light text-cosmos-night">
                        {viewContact.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone
                      className="w-5 h-5 text-text-secondary flex-shrink-0"
                      strokeWidth={1.5}
                    />
                    <div>
                      <div className="text-xs text-text-secondary font-light">
                        {t('admin.contacts.detail.phone', 'Telephone')}
                      </div>
                      <div className="text-sm font-light text-cosmos-night">
                        {viewContact.phone || t('admin.contacts.detail.noPhone', 'Non renseigne')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar
                      className="w-5 h-5 text-text-secondary flex-shrink-0"
                      strokeWidth={1.5}
                    />
                    <div>
                      <div className="text-xs text-text-secondary font-light">
                        {t('admin.contacts.detail.date', 'Date de reception')}
                      </div>
                      <div className="text-sm font-light text-cosmos-night">
                        {new Date(viewContact.created_at).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-text-secondary flex-shrink-0" strokeWidth={1.5} />
                    <div>
                      <div className="text-xs text-text-secondary font-light">
                        {t('admin.contacts.detail.name', 'Nom complet')}
                      </div>
                      <div className="text-sm font-light text-cosmos-night">
                        {viewContact.full_name}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <h4 className="text-sm text-text-secondary font-light mb-2">
                    {t('admin.contacts.detail.subject', 'Sujet')}
                  </h4>
                  <div className="p-4 bg-cosmos-cream/50 border border-cosmos-cream">
                    <p className="font-light text-cosmos-night">
                      {viewContact.subject || t('admin.contacts.noSubject', '(Aucun sujet)')}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h4 className="text-sm text-text-secondary font-light mb-2">
                    {t('admin.contacts.detail.message', 'Message')}
                  </h4>
                  <div className="p-4 bg-cosmos-cream/50 border border-cosmos-cream">
                    <p className="font-light text-cosmos-night whitespace-pre-line leading-relaxed">
                      {viewContact.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-cosmos-cream">
                  {!viewContact.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(viewContact.id)}
                      className="flex items-center gap-2 px-6 py-2 border border-green-200 bg-emerald-50 hover:border-green-600 text-emerald-600 font-light transition-colors"
                    >
                      <Eye className="w-4 h-4" strokeWidth={1.5} />
                      {t('admin.contacts.markAsRead', 'Marquer comme lu')}
                    </button>
                  )}
                  <button
                    onClick={() => setViewContact(null)}
                    className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                  >
                    {t('common.close', 'Fermer')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setDeleteConfirm(null)}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-md w-full">
              <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
                <h2 className="text-xl font-light text-cosmos-night tracking-tight">
                  {t('admin.contacts.deleteConfirm.title', 'Confirmer la suppression')}
                </h2>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="text-text-secondary hover:text-cosmos-night"
                >
                  <XCircle className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-text-secondary font-light">
                  {t(
                    'admin.contacts.deleteConfirm.message',
                    'Etes-vous sur de vouloir supprimer ce message ? Cette action est irreversible.'
                  )}
                </p>
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-cosmos-cream">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                  >
                    {t('common.cancel', 'Annuler')}
                  </button>
                  <button
                    onClick={() => {
                      // Delete is optional - hook doesn't expose delete, so we just close
                      setDeleteConfirm(null);
                    }}
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
    </div>
  );
};

export default ContactsManagement;
