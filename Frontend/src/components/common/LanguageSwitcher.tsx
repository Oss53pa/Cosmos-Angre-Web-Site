import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LanguageSwitcherProps {
  className?: string;
}

/**
 * Switch FR ↔ EN en préservant le path courant.
 * - `/boutiques` → `/en/boutiques`
 * - `/en/boutiques` → `/boutiques`
 */
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { i18n } = useTranslation();
  const { pathname, search, hash } = useLocation();

  const currentLang = i18n.language?.split('-')[0] === 'en' ? 'en' : 'fr';

  const toFr = pathname.replace(/^\/en\b/, '') || '/';
  const toEn = pathname === '/' ? '/en' : pathname.startsWith('/en') ? pathname : `/en${pathname}`;

  return (
    <nav aria-label="Langue" className={`flex items-center gap-1 text-sm ${className}`}>
      <Link
        to={`${toFr}${search}${hash}`}
        hrefLang="fr"
        aria-current={currentLang === 'fr' ? 'true' : undefined}
        className={`px-2 py-1 transition ${
          currentLang === 'fr'
            ? 'text-cosmos-gold font-medium'
            : 'text-cosmos-cream/60 hover:text-cosmos-cream'
        }`}
      >
        FR
      </Link>
      <span aria-hidden="true" className="text-cosmos-cream/30">
        |
      </span>
      <Link
        to={`${toEn}${search}${hash}`}
        hrefLang="en"
        aria-current={currentLang === 'en' ? 'true' : undefined}
        className={`px-2 py-1 transition ${
          currentLang === 'en'
            ? 'text-cosmos-gold font-medium'
            : 'text-cosmos-cream/60 hover:text-cosmos-cream'
        }`}
      >
        EN
      </Link>
    </nav>
  );
};

export default LanguageSwitcher;
