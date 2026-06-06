import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  BarChart3,
  Settings,
  FileText,
  Tag,
  ArrowLeft,
  HelpCircle,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const StoreLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut, hasRole } = useAuth();
  const canAccessAdmin = hasRole('SUPER_ADMIN', 'MALL_ADMIN', 'MALL_MODERATOR');

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  const storeName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : 'Mon Enseigne';
  const storeInitial = storeName.charAt(0).toUpperCase();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de Bord', path: '/enseigne' },
    { icon: Store, label: 'Ma Vitrine', path: '/enseigne/vitrine' },
    { icon: FileText, label: 'Publications', path: '/enseigne/publications' },
    { icon: Tag, label: 'Promotions', path: '/enseigne/promotions' },
    { icon: BarChart3, label: 'Analytics', path: '/enseigne/analytics' },
    { icon: Settings, label: 'Parametres', path: '/enseigne/parametres' },
  ];

  const isActive = (path: string) => {
    if (path === '/enseigne') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-cosmos-warm flex">
      {/* Sidebar */}
      <aside className="w-64 bg-cosmos-night text-cosmos-cream flex flex-col fixed h-screen z-30">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cosmos-gold/10 rounded-md flex items-center justify-center">
              <Store className="w-5 h-5 text-cosmos-gold" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-cormorant text-lg text-cosmos-cream font-light">Mon Enseigne</h2>
              <p className="text-[10px] text-cosmos-cream/60 font-inter">Espace commercant</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
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
                    <span className="text-sm font-inter font-light">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Help + Back */}
        <div className="p-4 border-t border-white/10 space-y-3">
          <div className="bg-white/5 rounded-md p-4">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-cosmos-gold" strokeWidth={1.5} />
              <span className="text-xs text-cosmos-cream/60 font-inter">Besoin d'aide ?</span>
            </div>
            <p className="text-[10px] text-cosmos-cream/30 font-inter font-light mb-3">
              Consultez notre guide ou contactez le support.
            </p>
            <button className="w-full px-3 py-2 bg-cosmos-gold/10 text-cosmos-gold text-xs font-inter rounded-md hover:bg-cosmos-gold/20 transition-colors">
              Centre d'aide
            </button>
          </div>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2.5 text-cosmos-cream/60 hover:text-cosmos-cream hover:bg-white/5 rounded-md transition-all"
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
            <span className="text-sm font-inter font-light">Retour au site</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-cosmos-cream/60 hover:text-cosmos-cream hover:bg-white/5 rounded-md transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
            <span className="text-sm font-inter font-light">Deconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-cosmos-cream sticky top-0 z-20">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="font-cormorant text-xl text-cosmos-night font-light">Bienvenue</h1>
              <p className="text-xs text-text-secondary font-inter font-light">
                Gerez votre presence sur Cosmos Angre
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Bascule vers la console Admin (SUPER_ADMIN / MALL_ADMIN uniquement) */}
              {canAccessAdmin && (
                <>
                  <Link
                    to="/admin"
                    className="hidden md:flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-[0.1em] font-inter font-medium text-cosmos-night hover:text-cosmos-gold border border-cosmos-night/15 hover:border-cosmos-gold/50 rounded transition-colors"
                    title="Accéder à la console Admin"
                  >
                    <Shield className="w-4 h-4" strokeWidth={1.5} />
                    <span>Console Admin</span>
                  </Link>
                  <Link
                    to="/admin"
                    className="md:hidden p-2 hover:bg-cosmos-cream rounded-md transition-colors"
                    title="Console Admin"
                    aria-label="Accéder à la console Admin"
                  >
                    <Shield className="w-5 h-5 text-cosmos-night" strokeWidth={1.5} />
                  </Link>
                </>
              )}

              <div className="text-right">
                <p className="text-sm font-inter font-medium text-cosmos-night">{storeName}</p>
                <p className="text-[10px] text-text-secondary font-inter">{profile?.email || ''}</p>
              </div>
              <div className="w-9 h-9 bg-cosmos-night rounded-md flex items-center justify-center">
                <span className="text-cosmos-gold font-cormorant text-sm">{storeInitial}</span>
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

export default StoreLayout;
