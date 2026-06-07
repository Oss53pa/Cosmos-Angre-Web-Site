import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Calendar,
  CalendarDays,
  FileText,
  Users,
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
  ArrowLeft,
  Briefcase,
  CreditCard,
  Globe,
  Mail,
  BookOpen,
  Image,
  MessageSquare,
  Pencil,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminLayout: React.FC = () => {
  const { t } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  const displayName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email
    : 'Admin';
  const displayEmail = profile?.email || '';
  const initials = displayName.charAt(0).toUpperCase();

  const menuItems = [
    { icon: LayoutDashboard, label: t('admin.sidebar.dashboard', 'Dashboard'), path: '/admin' },
    { icon: Store, label: t('admin.sidebar.stores', 'Boutiques'), path: '/admin/boutiques' },
    { icon: Calendar, label: t('admin.sidebar.events', 'Evenements'), path: '/admin/evenements' },
    {
      icon: CalendarDays,
      label: t('admin.sidebar.lifeCalendar', 'Calendrier de la vie'),
      path: '/admin/calendrier-vie',
    },
    {
      icon: FileText,
      label: t('admin.sidebar.moderation', 'Moderation'),
      path: '/admin/moderation',
    },
    {
      icon: CreditCard,
      label: t('admin.sidebar.billing', 'Facturation'),
      path: '/admin/facturation',
    },
    { icon: Globe, label: t('admin.sidebar.content', 'Contenu Site'), path: '/admin/contenu' },
    {
      icon: Pencil,
      label: t('admin.sidebar.pageContent', 'Contenu des pages'),
      path: '/admin/contenu-site',
    },
    { icon: Mail, label: t('admin.sidebar.newsletter', 'Newsletter'), path: '/admin/newsletter' },
    {
      icon: MessageSquare,
      label: t('admin.sidebar.contacts', 'Messages'),
      path: '/admin/messages',
    },
    { icon: BookOpen, label: t('admin.sidebar.blog', 'Blog'), path: '/admin/blog' },
    { icon: Users, label: t('admin.sidebar.users', 'Utilisateurs'), path: '/admin/utilisateurs' },
    { icon: Image, label: t('admin.sidebar.media', 'Medias'), path: '/admin/medias' },
    { icon: Settings, label: t('admin.sidebar.settings', 'Parametres'), path: '/admin/parametres' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-cosmos-warm flex">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-cosmos-night text-cosmos-cream transition-all duration-300 flex flex-col fixed h-screen z-30`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cosmos-gold/10 rounded-md flex items-center justify-center flex-shrink-0">
              <span className="font-cormorant font-light text-cosmos-gold text-xl">C</span>
            </div>
            {isSidebarOpen && (
              <div>
                <h2 className="font-cormorant text-lg text-cosmos-cream font-light">Admin</h2>
                <p className="text-[10px] text-cosmos-cream/60 font-inter">Cosmos Angre</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 ${
                      active
                        ? 'bg-cosmos-gold/10 text-cosmos-gold'
                        : 'text-cosmos-cream/60 hover:text-cosmos-cream hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                    {isSidebarOpen && (
                      <span className="text-sm font-inter font-light">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-1">
          {/* Bascule vers l'interface Enseigne */}
          <Link
            to="/enseigne"
            className="w-full flex items-center gap-3 px-4 py-2.5 text-cosmos-gold border border-cosmos-gold/30 hover:bg-cosmos-gold/10 hover:border-cosmos-gold/60 rounded-md transition-all"
            title="Accéder à l'interface Enseigne"
          >
            <Briefcase className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
            {isSidebarOpen && (
              <span className="text-sm font-inter font-medium">
                {t('admin.sidebar.storeView', 'Vue Enseigne')}
              </span>
            )}
          </Link>

          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 text-cosmos-cream/60 hover:text-cosmos-cream hover:bg-white/5 rounded-md transition-all"
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
            {isSidebarOpen && (
              <span className="text-sm font-inter font-light">
                {t('admin.sidebar.backToSite', 'Retour au site')}
              </span>
            )}
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-cosmos-cream/60 hover:text-cosmos-cream hover:bg-white/5 rounded-md transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
            {isSidebarOpen && (
              <span className="text-sm font-inter font-light">
                {t('admin.sidebar.logout', 'Deconnexion')}
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-cosmos-cream sticky top-0 z-20">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-cosmos-cream rounded-md transition-colors"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5 text-cosmos-night" strokeWidth={1.5} />
              ) : (
                <Menu className="w-5 h-5 text-cosmos-night" strokeWidth={1.5} />
              )}
            </button>

            <div className="flex items-center gap-3">
              {/* Bascule vers l'interface Enseigne (vue boutique) */}
              <Link
                to="/enseigne"
                className="hidden md:flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-[0.1em] font-inter font-medium text-cosmos-night hover:text-cosmos-gold border border-cosmos-night/15 hover:border-cosmos-gold/50 rounded transition-colors"
                title="Accéder à l'interface Enseigne"
              >
                <Briefcase className="w-4 h-4" strokeWidth={1.5} />
                <span>Vue Enseigne</span>
              </Link>
              {/* Version mobile : icône seule */}
              <Link
                to="/enseigne"
                className="md:hidden p-2 hover:bg-cosmos-cream rounded-md transition-colors"
                title="Vue Enseigne"
                aria-label="Accéder à l'interface Enseigne"
              >
                <Briefcase className="w-5 h-5 text-cosmos-night" strokeWidth={1.5} />
              </Link>

              <button
                type="button"
                aria-label="Notifications"
                className="relative p-2 hover:bg-cosmos-cream rounded-md transition-colors"
              >
                <Bell className="w-5 h-5 text-cosmos-night" strokeWidth={1.5} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cosmos-gold rounded-full" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-cosmos-night rounded-md flex items-center justify-center">
                  <span className="text-cosmos-gold font-cormorant text-sm">{initials}</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-inter font-medium text-cosmos-night">{displayName}</p>
                  <p className="text-[10px] text-text-secondary font-inter">{displayEmail}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
