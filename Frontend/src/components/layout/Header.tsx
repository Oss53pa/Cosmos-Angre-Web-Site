import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, User, Globe, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useMedia } from '../../hooks/useMedia';
import CosmosLogo from '../ui/CosmosLogo';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { files: logoFiles } = useMedia({ type: 'logo' });
  const activeLogo = logoFiles.find((f) => f.is_active_logo);

  // Track scroll position for header background transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  const navigationLinks = [
    { label: t('nav.enseignes', 'Les Enseignes'), path: '/boutiques' },
    { label: t('nav.restaurants', 'Restaurants & Cafés'), path: '/gastronomie' },
    { label: t('nav.leisure'), path: '/loisirs' },
    { label: t('nav.agenda', "L'Agenda"), path: '/evenements' },
    { label: t('nav.club', 'Cosmos Club'), path: '/fidelite' },
    { label: t('nav.infosPratiques', 'Infos pratiques'), path: '/preparer-visite' },
  ];

  const handleLanguageToggle = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  const isHomePage = location.pathname === '/';
  const headerBg =
    isHomePage && !isScrolled ? 'bg-transparent' : 'bg-cosmos-night/95 backdrop-blur-md';

  return (
    <>
      {/* Skip to content — Accessibility */}
      <a href="#main-content" className="skip-to-content">
        {t('common.skipToContent', 'Skip to main content')}
      </a>

      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBg} ${
          isScrolled ? 'shadow-lg' : ''
        }`}
      >
        <div className="container-cosmos">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0 mr-8">
              {activeLogo ? (
                <img
                  src={activeLogo.url}
                  alt="Cosmos Angre"
                  className="h-10 w-auto object-contain transition-all duration-500 group-hover:opacity-80"
                />
              ) : (
                <CosmosLogo
                  height={32}
                  className="transition-all duration-500 group-hover:opacity-80"
                />
              )}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-3 xl:gap-6" aria-label={t('nav.home')}>
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`gold-underline whitespace-nowrap text-[10px] xl:text-[11px] uppercase tracking-[0.1em] xl:tracking-[0.15em] font-inter font-light transition-colors duration-300 ${
                    location.pathname === link.path
                      ? 'text-cosmos-gold active'
                      : 'text-cosmos-cream/80 hover:text-cosmos-cream'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3 xl:gap-5 flex-shrink-0 ml-4">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-cosmos-cream/70 hover:text-cosmos-gold transition-colors duration-300"
                aria-label={t('common.search')}
              >
                <Search className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </button>

              {/* Language Toggle */}
              <button
                onClick={handleLanguageToggle}
                className="hidden md:flex items-center gap-1.5 text-cosmos-cream/70 hover:text-cosmos-gold transition-colors duration-300"
              >
                <Globe className="w-[18px] h-[18px]" strokeWidth={1.5} />
                <span className="text-[11px] uppercase tracking-[0.15em] font-inter font-light">
                  {i18n.language === 'fr' ? 'FR' : 'EN'}
                </span>
              </button>

              {/* Account */}
              {user ? (
                <div className="hidden lg:flex items-center gap-3">
                  <Link
                    to="/enseigne"
                    className="flex items-center gap-1.5 text-cosmos-cream/70 hover:text-cosmos-gold transition-colors duration-300"
                  >
                    <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
                    <span className="hidden xl:inline text-[10px] uppercase tracking-[0.1em] font-inter font-light">
                      {profile?.first_name || t('nav.myAccount')}
                    </span>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="text-cosmos-cream/60 hover:text-cosmos-gold transition-colors duration-300"
                    title="Déconnexion"
                  >
                    <LogOut className="w-[16px] h-[16px]" strokeWidth={1.5} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth/login"
                  className="hidden lg:flex items-center gap-1.5 text-cosmos-cream/70 hover:text-cosmos-gold transition-colors duration-300"
                >
                  <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
                  <span className="hidden xl:inline text-[10px] uppercase tracking-[0.1em] font-inter font-light">
                    {t('nav.myAccount')}
                  </span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-cosmos-cream/70 hover:text-cosmos-gold transition-colors duration-300"
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" strokeWidth={1.5} />
                ) : (
                  <Menu className="w-6 h-6" strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          {isSearchOpen && (
            <div className="pb-6 animate-fade-in-down">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cosmos-gold"
                  strokeWidth={1.5}
                />
                <input
                  type="text"
                  placeholder={t('nav.searchPlaceholder')}
                  className="input-dark w-full pl-12"
                  autoFocus
                  aria-label={t('common.search')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Gold accent line at bottom */}
        <div
          className={`h-px transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background:
              'linear-gradient(90deg, transparent, rgb(var(--cosmos-gold) / 0.3), transparent)',
          }}
        />
      </header>

      {/* Mobile Menu — Fullscreen Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-cosmos-night animate-fade-in">
          {/* Close button */}
          <div className="absolute top-6 right-6">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-cosmos-cream/70 hover:text-cosmos-gold transition-colors"
            >
              <X className="w-7 h-7" strokeWidth={1.5} />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex flex-col items-center justify-center h-full px-8">
            {/* Logo */}
            <div className="mb-12">
              <CosmosLogo height={48} />
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col items-center gap-8 stagger-children">
              {navigationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`font-cormorant text-2xl tracking-wide transition-colors duration-300 animate-fade-in-up ${
                    location.pathname === link.path
                      ? 'text-cosmos-gold'
                      : 'text-cosmos-cream/80 hover:text-cosmos-cream'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Divider */}
            <div className="w-12 h-px bg-cosmos-gold/30 my-10" />

            {/* Secondary Links */}
            <div className="flex flex-col items-center gap-4">
              <Link
                to="/a-propos"
                onClick={() => setIsMenuOpen(false)}
                className="text-xs uppercase tracking-[0.2em] font-inter font-light text-cosmos-cream/60 hover:text-cosmos-gold transition-colors"
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/blog"
                onClick={() => setIsMenuOpen(false)}
                className="text-xs uppercase tracking-[0.2em] font-inter font-light text-cosmos-cream/60 hover:text-cosmos-gold transition-colors"
              >
                {t('nav.journal')}
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="text-xs uppercase tracking-[0.2em] font-inter font-light text-cosmos-cream/60 hover:text-cosmos-gold transition-colors"
              >
                {t('nav.contact')}
              </Link>
            </div>

            {/* Bottom: Language + Account */}
            <div className="absolute bottom-10 flex items-center gap-8">
              <button
                onClick={handleLanguageToggle}
                className="flex items-center gap-1.5 text-cosmos-cream/60 hover:text-cosmos-gold transition-colors"
              >
                <Globe className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-[11px] uppercase tracking-[0.15em] font-inter font-light">
                  {i18n.language === 'fr' ? 'FR' : 'EN'}
                </span>
              </button>
              {user ? (
                <>
                  <Link
                    to="/enseigne"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-1.5 text-cosmos-cream/60 hover:text-cosmos-gold transition-colors"
                  >
                    <User className="w-4 h-4" strokeWidth={1.5} />
                    <span className="text-[11px] uppercase tracking-[0.15em] font-inter font-light">
                      {t('nav.myAccount')}
                    </span>
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 text-cosmos-cream/60 hover:text-cosmos-gold transition-colors"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    <span className="text-[11px] uppercase tracking-[0.15em] font-inter font-light">
                      Déconnexion
                    </span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-1.5 text-cosmos-cream/60 hover:text-cosmos-gold transition-colors"
                >
                  <User className="w-4 h-4" strokeWidth={1.5} />
                  <span className="text-[11px] uppercase tracking-[0.15em] font-inter font-light">
                    {t('nav.myAccount')}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
