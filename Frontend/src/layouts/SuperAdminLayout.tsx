import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Shield,
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
  Package,
  ArrowLeft,
  FileText,
  Users,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SuperAdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  const displayName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Super Admin'
    : 'Super Admin';
  const displayEmail = profile?.email || '';

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/superadmin' },
    { icon: Package, label: 'Abonnements', path: '/superadmin/abonnements' },
    { icon: Users, label: 'Administrateurs', path: '/superadmin/administrateurs' },
    { icon: FileText, label: "Logs d'Audit", path: '/superadmin/logs' },
    { icon: Settings, label: 'Parametres', path: '/superadmin/parametres' },
  ];

  const isActive = (path: string) => {
    if (path === '/superadmin') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-cosmos-night flex">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-[#060e18] text-cosmos-cream transition-all duration-300 flex flex-col fixed h-screen z-30 border-r border-white/5`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cosmos-gold/10 rounded-md flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-cosmos-gold" strokeWidth={1.5} />
            </div>
            {isSidebarOpen && (
              <div>
                <h2 className="font-cormorant text-lg text-cosmos-cream font-light">Super Admin</h2>
                <p className="text-[10px] text-cosmos-cream/60 font-inter">Developer Panel</p>
              </div>
            )}
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
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-all duration-200 text-sm font-inter font-light ${
                      active
                        ? 'bg-cosmos-gold/10 text-cosmos-gold'
                        : 'text-cosmos-cream/60 hover:text-cosmos-cream hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                    {isSidebarOpen && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* System Status */}
        {isSidebarOpen && (
          <div className="p-4 border-t border-white/5">
            <div className="bg-white/5 rounded-md p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-cosmos-cream/60 font-inter">
                  Systeme operationnel
                </span>
              </div>
              <div className="text-[10px] text-cosmos-cream/20 font-inter">Uptime: 99.9%</div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-white/5 space-y-1">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-2.5 text-cosmos-cream/60 hover:text-cosmos-cream hover:bg-white/5 rounded-md transition-all"
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
            {isSidebarOpen && <span className="text-sm font-inter font-light">Retour au site</span>}
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-cosmos-cream/60 hover:text-cosmos-cream hover:bg-white/5 rounded-md transition-all"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
            {isSidebarOpen && <span className="text-sm font-inter font-light">Deconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="bg-[#060e18] border-b border-white/5 sticky top-0 z-20">
          <div className="px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-md transition-colors text-cosmos-cream/60"
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={1.5} />
              )}
            </button>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-white/5 rounded-md transition-colors">
                <Bell className="w-5 h-5 text-cosmos-cream/60" strokeWidth={1.5} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cosmos-gold rounded-full" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-cosmos-gold/10 rounded-md flex items-center justify-center">
                  <span className="text-cosmos-gold font-cormorant text-sm">SA</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-inter font-light text-cosmos-cream">{displayName}</p>
                  <p className="text-[10px] text-cosmos-cream/60 font-inter">{displayEmail}</p>
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

export default SuperAdminLayout;
