import React, { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Synchronise i18n.language avec le préfixe d'URL.
 * - `/en/...` → bascule en anglais
 * - tout autre path → bascule en français (locale par défaut)
 *
 * À placer en wrapper de la racine du router (au-dessus des layouts).
 */
const LanguageGate: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    const isEn = pathname === '/en' || pathname.startsWith('/en/');
    const target = isEn ? 'en' : 'fr';
    if (i18n.language?.split('-')[0] !== target) {
      void i18n.changeLanguage(target);
    }
  }, [pathname, i18n]);

  return children ? <>{children}</> : <Outlet />;
};

export default LanguageGate;
