import { SITE_CONFIG } from './siteConfig';

type OgType = 'store' | 'event' | 'article' | 'page' | 'default';

interface OgImageOptions {
  title: string;
  subtitle?: string;
  type?: OgType;
}

/**
 * Construit l'URL d'une OG image générée dynamiquement par /api/og.
 * Cache: 1 an (immutable, query-keyed).
 */
export function buildOgImageUrl({ title, subtitle, type = 'default' }: OgImageOptions): string {
  const base = SITE_CONFIG.url.replace(/\/$/, '');
  const params = new URLSearchParams();
  params.set('title', title);
  if (subtitle) params.set('subtitle', subtitle);
  params.set('type', type);
  return `${base}/api/og?${params.toString()}`;
}
