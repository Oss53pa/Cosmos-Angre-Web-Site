import { useLocation } from 'react-router-dom';
import { SITE_CONFIG } from './siteConfig';

const SITE_URL = SITE_CONFIG.url.replace(/\/$/, '');

/**
 * Génère les liens hreflang alternates pour la page courante.
 * - Détecte le préfixe /en/ et calcule la version FR équivalente, et inversement.
 * - Retourne un tableau utilisable directement dans le prop `alternates` de <Seo>.
 */
export function useAlternates() {
  const { pathname } = useLocation();

  let frPath = pathname;
  let enPath = pathname;

  if (pathname.startsWith('/en/') || pathname === '/en') {
    frPath = pathname.replace(/^\/en/, '') || '/';
    enPath = pathname;
  } else {
    enPath = pathname === '/' ? '/en' : `/en${pathname}`;
  }

  return [
    { lang: 'fr', href: `${SITE_URL}${frPath}` },
    { lang: 'en', href: `${SITE_URL}${enPath}` },
    { lang: 'x-default', href: `${SITE_URL}${frPath}` },
  ];
}
