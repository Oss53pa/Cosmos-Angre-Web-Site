import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useUsers } from '../../hooks/useUsers';
import type { UserRole } from '../../types/database';
import {
  Users,
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  XCircle,
  Shield,
  Store,
  CheckCircle,
  Ban,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  registeredDate: string;
  storeName?: string;
  avatar?: string;
}

// Map local role back to Supabase UserRole
function mapLocalRoleToSupabaseRole(role: string): UserRole {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'SUPER_ADMIN';
    case 'MALL_ADMIN':
      return 'MALL_ADMIN';
    case 'MALL_MODERATOR':
      return 'MALL_MODERATOR';
    case 'STORE_ADMIN':
      return 'STORE_ADMIN';
    case 'STORE_EMPLOYEE':
      return 'STORE_EMPLOYEE';
    case 'VISITOR':
    default:
      return 'VISITOR';
  }
}

const UsersManagement: React.FC = () => {
  const { t } = useTranslation();
  const { users: supabaseUsers, isLoading, error, fetchUsers, updateUser, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form refs
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLSelectElement>(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Auto-clear feedback after 4 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Map Supabase profiles to local User type
  const users: User[] = supabaseUsers.map((profile) => ({
    id: profile.id,
    name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'N/A',
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    email: profile.email || 'N/A',
    phone: profile.phone || '',
    role: profile.role,
    registeredDate: profile.created_at || new Date().toISOString(),
    storeName: undefined,
    avatar: profile.avatar,
  }));

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'text-cosmos-gold bg-cosmos-gold/5 border-purple-200';
      case 'MALL_ADMIN':
      case 'MALL_MODERATOR':
        return 'text-cosmos-night bg-cosmos-gold/10 border-blue-200';
      case 'STORE_ADMIN':
      case 'STORE_EMPLOYEE':
        return 'text-emerald-600 bg-emerald-50 border-green-200';
      case 'VISITOR':
      default:
        return 'text-text-secondary bg-cosmos-cream/50 border-cosmos-cream';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return t('admin.users.role.superAdmin', 'Super Admin');
      case 'MALL_ADMIN':
        return t('admin.users.role.admin', 'Administrateur');
      case 'MALL_MODERATOR':
        return t('admin.users.role.moderator', 'Modérateur');
      case 'STORE_ADMIN':
        return t('admin.users.role.storeAdmin', 'Admin Boutique');
      case 'STORE_EMPLOYEE':
        return t('admin.users.role.storeEmployee', 'Employé Boutique');
      case 'VISITOR':
        return t('admin.users.role.visitor', 'Visiteur');
      default:
        return role;
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.storeName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const stats = [
    {
      label: t('admin.users.stats.total', 'Total Utilisateurs'),
      value: users.length,
      icon: Users,
      color: 'text-cosmos-night',
      bg: 'bg-cosmos-gold/10',
    },
    {
      label: t('admin.users.stats.storeOwners', 'Commerçants'),
      value: users.filter((u) => u.role === 'STORE_ADMIN' || u.role === 'STORE_EMPLOYEE').length,
      icon: Store,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: t('admin.users.stats.visitors', 'Visiteurs'),
      value: users.filter((u) => u.role === 'VISITOR').length,
      icon: Users,
      color: 'text-cosmos-gold',
      bg: 'bg-cosmos-gold/5',
    },
    {
      label: t('admin.users.stats.admins', 'Administrateurs'),
      value: users.filter(
        (u) => u.role === 'SUPER_ADMIN' || u.role === 'MALL_ADMIN' || u.role === 'MALL_MODERATOR'
      ).length,
      icon: Shield,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      setDeleteConfirmId(null);
      setFeedback({
        type: 'success',
        message: t('admin.users.feedback.deleted', 'Utilisateur supprimé avec succès'),
      });
      await fetchUsers();
    } catch {
      setFeedback({
        type: 'error',
        message: t(
          'admin.users.feedback.deleteError',
          "Erreur lors de la suppression de l'utilisateur"
        ),
      });
    }
  };

  const handleChangeRole = async (userId: string, newRole: UserRole) => {
    try {
      await updateUser(userId, { role: newRole });
      setFeedback({
        type: 'success',
        message: t('admin.users.feedback.roleChanged', 'Rôle mis à jour avec succès'),
      });
    } catch {
      setFeedback({
        type: 'error',
        message: t('admin.users.feedback.roleError', 'Erreur lors de la mise à jour du rôle'),
      });
    }
  };

  const handleSaveUser = async () => {
    const firstName = firstNameRef.current?.value?.trim() || '';
    const lastName = lastNameRef.current?.value?.trim() || '';
    const email = emailRef.current?.value?.trim() || '';
    const phone = phoneRef.current?.value?.trim() || '';
    const role = roleRef.current?.value as UserRole;

    if (!firstName && !lastName) {
      setFeedback({
        type: 'error',
        message: t('admin.users.feedback.nameRequired', 'Le nom est obligatoire'),
      });
      return;
    }

    if (!email) {
      setFeedback({
        type: 'error',
        message: t('admin.users.feedback.emailRequired', "L'email est obligatoire"),
      });
      return;
    }

    setIsSaving(true);

    try {
      if (editingUser) {
        // Update existing user
        await updateUser(editingUser.id, {
          first_name: firstName || null,
          last_name: lastName || null,
          email,
          phone: phone || null,
          role: mapLocalRoleToSupabaseRole(role),
        });
        setFeedback({
          type: 'success',
          message: t('admin.users.feedback.updated', 'Utilisateur mis à jour avec succès'),
        });
      } else {
        // Cannot create users from admin panel (requires Supabase Auth)
        setFeedback({
          type: 'error',
          message: t(
            'admin.users.feedback.createNotSupported',
            "La création d'utilisateurs n'est pas supportée depuis le panneau admin. L'utilisateur doit s'inscrire lui-même."
          ),
        });
        setIsSaving(false);
        return;
      }

      setEditingUser(null);
      setIsCreating(false);
      await fetchUsers();
    } catch {
      setFeedback({
        type: 'error',
        message: t('admin.users.feedback.saveError', "Erreur lors de l'enregistrement"),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 border ${feedback.type === 'success' ? 'bg-emerald-50 border-green-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'} flex items-center justify-between`}
        >
          <p className="font-light">{feedback.message}</p>
          <button onClick={() => setFeedback(null)} className="ml-4">
            <XCircle className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white border border-cosmos-cream p-6 text-center">
          <p className="text-text-secondary font-light">{t('common.loading', 'Chargement...')}</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-6 text-center">
          <p className="text-red-600 font-light">
            {t('common.error', 'Erreur')}: {error}
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-cosmos-night mb-2 tracking-tight">
            {t('admin.users.title', 'Gestion des Utilisateurs')}
          </h1>
          <p className="text-text-secondary font-light">
            {t('admin.users.subtitle', 'Gérez tous les utilisateurs de la plateforme')}
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
          {t('admin.users.newUser', 'Nouvel Utilisateur')}
        </button>
      </div>

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
              placeholder={t('admin.users.searchPlaceholder', 'Rechercher un utilisateur...')}
              className="w-full pl-10 pr-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
          >
            <option value="all">{t('admin.users.filter.allRoles', 'Tous les rôles')}</option>
            <option value="SUPER_ADMIN">{t('admin.users.role.superAdmin', 'Super Admin')}</option>
            <option value="MALL_ADMIN">{t('admin.users.role.admin', 'Administrateur')}</option>
            <option value="MALL_MODERATOR">{t('admin.users.role.moderator', 'Modérateur')}</option>
            <option value="STORE_ADMIN">
              {t('admin.users.role.storeAdmin', 'Admin Boutique')}
            </option>
            <option value="STORE_EMPLOYEE">
              {t('admin.users.role.storeEmployee', 'Employé Boutique')}
            </option>
            <option value="VISITOR">{t('admin.users.role.visitor', 'Visiteur')}</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-cosmos-cream">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-cosmos-cream">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                  {t('admin.users.table.user', 'Utilisateur')}
                </th>
                <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                  {t('admin.users.table.contact', 'Contact')}
                </th>
                <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                  {t('admin.users.table.role', 'Rôle')}
                </th>
                <th className="text-left px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                  {t('admin.users.table.registered', 'Inscription')}
                </th>
                <th className="text-right px-6 py-4 text-sm font-light text-text-secondary uppercase tracking-wider">
                  {t('common.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-cosmos-cream/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cosmos-night rounded-full flex items-center justify-center flex-shrink-0">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-semibold text-sm">
                            {user.name !== 'N/A'
                              ? user.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()
                              : '?'}
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-light text-cosmos-night">{user.name}</div>
                        {user.storeName && (
                          <div className="text-sm text-text-secondary font-light">
                            {user.storeName}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-light text-cosmos-night">{user.email}</div>
                    <div className="text-sm text-text-secondary font-light">
                      {user.phone || '\u2014'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-3 py-1 ${getRoleColor(user.role)} border font-light`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-light text-cosmos-night">
                      {new Date(user.registeredDate).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewUser(user)}
                        className="p-2 border border-cosmos-cream hover:border-gray-900 transition-colors"
                        title={t('common.view', 'Voir les détails')}
                      >
                        <Eye className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => setEditingUser(user)}
                        className="p-2 border border-cosmos-cream hover:border-gray-900 transition-colors"
                        title={t('common.edit', 'Modifier')}
                      >
                        <Edit className="w-4 h-4" strokeWidth={1.5} />
                      </button>
                      {user.role === 'VISITOR' && (
                        <button
                          onClick={() => handleChangeRole(user.id, 'STORE_EMPLOYEE')}
                          className="p-2 border border-green-200 bg-emerald-50 hover:border-green-600 text-emerald-600 transition-colors"
                          title={t('admin.users.actions.promote', 'Promouvoir')}
                        >
                          <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      )}
                      {(user.role === 'STORE_ADMIN' || user.role === 'STORE_EMPLOYEE') && (
                        <button
                          onClick={() => handleChangeRole(user.id, 'VISITOR')}
                          className="p-2 border border-orange-200 bg-amber-50 hover:border-orange-600 text-amber-600 transition-colors"
                          title={t('admin.users.actions.demote', 'Rétrograder en visiteur')}
                        >
                          <Ban className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      )}
                      {deleteConfirmId === user.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 border border-red-400 bg-red-100 hover:bg-red-200 text-red-700 transition-colors text-xs font-light"
                            title={t(
                              'admin.users.actions.confirmDelete',
                              'Confirmer la suppression'
                            )}
                          >
                            <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="p-2 border border-cosmos-cream hover:border-gray-900 transition-colors text-xs font-light"
                            title={t('common.cancel', 'Annuler')}
                          >
                            <XCircle className="w-4 h-4" strokeWidth={1.5} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(user.id)}
                          className="p-2 border border-red-200 bg-red-50 hover:border-red-600 text-red-600 transition-colors"
                          title={t('common.delete', 'Supprimer')}
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View User Modal */}
      {viewUser && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setViewUser(null)}></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
                <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                  {t('admin.users.userDetails', "Détails de l'Utilisateur")}
                </h2>
                <button
                  onClick={() => setViewUser(null)}
                  className="text-text-secondary hover:text-cosmos-night"
                >
                  <XCircle className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-cosmos-night rounded-full flex items-center justify-center">
                    {viewUser.avatar ? (
                      <img
                        src={viewUser.avatar}
                        alt={viewUser.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-2xl">
                        {viewUser.name !== 'N/A'
                          ? viewUser.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()
                          : '?'}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-light text-cosmos-night mb-1 tracking-tight">
                      {viewUser.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-3 py-1 ${getRoleColor(viewUser.role)} border font-light`}
                      >
                        {getRoleLabel(viewUser.role)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-text-secondary font-light mb-1">
                      {t('admin.users.detail.email', 'Email')}
                    </div>
                    <div className="font-light text-cosmos-night">{viewUser.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary font-light mb-1">
                      {t('admin.users.detail.phone', 'Téléphone')}
                    </div>
                    <div className="font-light text-cosmos-night">{viewUser.phone || '\u2014'}</div>
                  </div>
                  {viewUser.storeName && (
                    <div>
                      <div className="text-sm text-text-secondary font-light mb-1">
                        {t('admin.users.detail.store', 'Boutique')}
                      </div>
                      <div className="font-light text-cosmos-night">{viewUser.storeName}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-text-secondary font-light mb-1">
                      {t('admin.users.detail.registeredDate', "Date d'inscription")}
                    </div>
                    <div className="font-light text-cosmos-night">
                      {new Date(viewUser.registeredDate).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Edit/Create User Modal */}
      {(editingUser || isCreating) && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setEditingUser(null);
              setIsCreating(false);
            }}
          ></div>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-cosmos-cream max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
                <h2 className="text-2xl font-light text-cosmos-night tracking-tight">
                  {editingUser
                    ? t('admin.users.editUser', "Modifier l'Utilisateur")
                    : t('admin.users.newUser', 'Nouvel Utilisateur')}
                </h2>
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setIsCreating(false);
                  }}
                  className="text-text-secondary hover:text-cosmos-night"
                >
                  <XCircle className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>

              {isCreating && !editingUser && (
                <div className="px-6 pt-4">
                  <div className="p-4 bg-amber-50 border border-orange-200 text-amber-700 font-light text-sm">
                    {t(
                      'admin.users.createNotice',
                      "Note : les utilisateurs doivent s'inscrire eux-mêmes via le formulaire d'inscription. Vous pouvez ensuite modifier leur profil et leur rôle ici."
                    )}
                  </div>
                </div>
              )}

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-cosmos-night font-light mb-2">
                      {t('admin.users.form.firstName', 'Prénom')}
                    </label>
                    <input
                      ref={firstNameRef}
                      type="text"
                      defaultValue={editingUser?.firstName}
                      placeholder="Jean"
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                      disabled={isCreating && !editingUser}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-cosmos-night font-light mb-2">
                      {t('admin.users.form.lastName', 'Nom')}
                    </label>
                    <input
                      ref={lastNameRef}
                      type="text"
                      defaultValue={editingUser?.lastName}
                      placeholder="Kouassi"
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                      disabled={isCreating && !editingUser}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-cosmos-night font-light mb-2">Email</label>
                    <input
                      ref={emailRef}
                      type="email"
                      defaultValue={editingUser?.email !== 'N/A' ? editingUser?.email : ''}
                      placeholder="email@exemple.com"
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                      disabled={isCreating && !editingUser}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-cosmos-night font-light mb-2">
                      {t('admin.users.form.phone', 'Téléphone')}
                    </label>
                    <input
                      ref={phoneRef}
                      type="tel"
                      defaultValue={editingUser?.phone}
                      placeholder="+225 XX XX XX XX XX"
                      className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                      disabled={isCreating && !editingUser}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-cosmos-night font-light mb-2">
                    {t('admin.users.form.role', 'Rôle')}
                  </label>
                  <select
                    ref={roleRef}
                    defaultValue={editingUser?.role || 'VISITOR'}
                    className="w-full px-4 py-3 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light"
                    disabled={isCreating && !editingUser}
                  >
                    <option value="VISITOR">{t('admin.users.role.visitor', 'Visiteur')}</option>
                    <option value="STORE_EMPLOYEE">
                      {t('admin.users.role.storeEmployee', 'Employé Boutique')}
                    </option>
                    <option value="STORE_ADMIN">
                      {t('admin.users.role.storeAdmin', 'Admin Boutique')}
                    </option>
                    <option value="MALL_MODERATOR">
                      {t('admin.users.role.moderator', 'Modérateur')}
                    </option>
                    <option value="MALL_ADMIN">
                      {t('admin.users.role.admin', 'Administrateur')}
                    </option>
                    <option value="SUPER_ADMIN">
                      {t('admin.users.role.superAdmin', 'Super Admin')}
                    </option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-cosmos-cream">
                  <button
                    onClick={() => {
                      setEditingUser(null);
                      setIsCreating(false);
                    }}
                    className="px-6 py-2 border border-cosmos-cream hover:border-gray-900 text-cosmos-night font-light transition-colors"
                  >
                    {t('common.cancel', 'Annuler')}
                  </button>
                  {editingUser && (
                    <button
                      onClick={handleSaveUser}
                      disabled={isSaving}
                      className="px-6 py-2 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors disabled:opacity-50"
                    >
                      {isSaving
                        ? t('common.saving', 'Enregistrement...')
                        : t('common.save', 'Enregistrer')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UsersManagement;
