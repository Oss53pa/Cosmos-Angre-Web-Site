import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SITE_CONFIG } from './siteConfig';
import { useAlternates } from './useAlternates';

interface SeoProps {
  /** Titre de page (sans le suffixe site) */
  title?: string;
  /** Override complet du titre (ignore le suffixe) */
  titleTemplate?: string;
  /** Meta description */
  description?: string;
  /** Image OG/Twitter (URL absolue ou relative) */
  image?: string;
  /** URL canonique. Par défaut : URL courante. */
  canonical?: string;
  /** Type Open Graph */
  type?: 'website' | 'article' | 'product' | 'profile';
  /** Empêche l'indexation */
  noindex?: boolean;
  /** Auteur (pour article) */
  author?: string;
  /** Date de publication (article) */
  publishedAt?: string;
  /** Date de modification (article) */
  modifiedAt?: string;
  /** Tags / mots-clés */
  keywords?: string[];
  /** JSON-LD à injecter (objet ou tableau) */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Liens hreflang alternates ([{ lang, href }]) */
  alternates?: { lang: string; href: string }[];
}

const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);
const toAbsoluteUrl = (url: string) =>
  isAbsoluteUrl(url)
    ? url
    : `${SITE_CONFIG.url.replace(/\/$/, '')}${url.startsWith('/') ? url : `/${url}`}`;

/**
 * Composant SEO universel — meta tags + Open Graph + Twitter + JSON-LD.
 * À placer en premier enfant de chaque page.
 */
export const Seo: React.FC<SeoProps> = ({
  title,
  titleTemplate,
  description,
  image,
  canonical,
  type = 'website',
  noindex = false,
  author,
  publishedAt,
  modifiedAt,
  keywords,
  jsonLd,
  alternates,
}) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const autoAlternates = useAlternates();
  const finalAlternates = alternates ?? autoAlternates;

  const lang = i18n.language?.split('-')[0] ?? 'fr';
  const ogLocale = lang === 'en' ? 'en_US' : 'fr_FR';

  const currentUrl = `${SITE_CONFIG.url.replace(/\/$/, '')}${location.pathname}`;
  const finalCanonical = canonical ? toAbsoluteUrl(canonical) : currentUrl;
  const finalImage = toAbsoluteUrl(image ?? SITE_CONFIG.defaultOgImage);
  const finalDescription = description ?? SITE_CONFIG.longDescription;
  const finalTitle =
    titleTemplate ??
    (title
      ? `${title} — ${SITE_CONFIG.name}`
      : `${SITE_CONFIG.name} — ${SITE_CONFIG.shortDescription}`);

  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <html lang={lang} />
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      {author && <meta name="author" content={author} />}

      <link rel="canonical" href={finalCanonical} />
      {finalAlternates.map((alt) => (
        <link key={alt.lang} rel="alternate" hrefLang={alt.lang} href={alt.href} />
      ))}

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={ogLocale} />
      {SITE_CONFIG.alternateLocales
        .filter((l) => l !== ogLocale)
        .map((l) => (
          <meta key={l} property="og:locale:alternate" content={l} />
        ))}

      {type === 'article' && publishedAt && (
        <meta property="article:published_time" content={publishedAt} />
      )}
      {type === 'article' && modifiedAt && (
        <meta property="article:modified_time" content={modifiedAt} />
      )}
      {type === 'article' && author && <meta property="article:author" content={author} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={SITE_CONFIG.twitter} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* JSON-LD */}
      {jsonLdArray.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

export default Seo;
