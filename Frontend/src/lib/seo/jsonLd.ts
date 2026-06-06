/**
 * Helpers JSON-LD (schema.org).
 * Tous les générateurs renvoient un objet sérialisable.
 */
import { SITE_CONFIG } from './siteConfig';

const SITE_URL = SITE_CONFIG.url.replace(/\/$/, '');
const abs = (path: string) =>
  /^https?:\/\//i.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

// ============================================================
// Organization (à inclure sur la home, layout global)
// ============================================================
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.legalName,
    url: SITE_URL,
    logo: abs('/logo.png'),
    image: abs(SITE_CONFIG.defaultOgImage),
    description: SITE_CONFIG.longDescription,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.addressLocality,
      addressRegion: SITE_CONFIG.address.addressRegion,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.addressCountry,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.contact.phone,
      email: SITE_CONFIG.contact.email,
      contactType: 'customer service',
      areaServed: 'CI',
      availableLanguage: ['French', 'English'],
    },
    sameAs: Object.values(SITE_CONFIG.social),
  };
}

// ============================================================
// LocalBusiness / ShoppingCenter (centre commercial)
// ============================================================
export function shoppingCenterJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ShoppingCenter',
    '@id': `${SITE_URL}/#mall`,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.longDescription,
    url: SITE_URL,
    image: abs(SITE_CONFIG.defaultOgImage),
    telephone: SITE_CONFIG.contact.phone,
    email: SITE_CONFIG.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.addressLocality,
      addressRegion: SITE_CONFIG.address.addressRegion,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE_CONFIG.geo.latitude,
      longitude: SITE_CONFIG.geo.longitude,
    },
    openingHoursSpecification: SITE_CONFIG.openingHours.map((spec) => {
      const [days, hours] = spec.split(' ');
      const [opens, closes] = (hours ?? '').split('-');
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: days,
        opens,
        closes,
      };
    }),
    priceRange: '€€-€€€',
    sameAs: Object.values(SITE_CONFIG.social),
  };
}

// ============================================================
// WebSite + Sitelinks SearchBox
// ============================================================
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_CONFIG.name,
    url: SITE_URL,
    description: SITE_CONFIG.shortDescription,
    inLanguage: ['fr-FR', 'en-US'],
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/boutiques?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ============================================================
// Store / LocalBusiness (boutique individuelle)
// ============================================================
interface StoreLdInput {
  name: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  cover_image?: string | null;
  category?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  hours?: string | null;
  rating?: number | null;
}

export function storeJsonLd(store: StoreLdInput) {
  const url = `${SITE_URL}/boutiques/${store.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': `${url}#store`,
    name: store.name,
    description: store.description ?? undefined,
    url,
    image: store.cover_image ? abs(store.cover_image) : undefined,
    logo: store.logo ? abs(store.logo) : undefined,
    telephone: store.phone ?? undefined,
    email: store.email ?? undefined,
    sameAs: store.website ?? undefined,
    category: store.category ?? undefined,
    parentOrganization: { '@id': `${SITE_URL}/#mall` },
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.addressLocality,
      addressRegion: SITE_CONFIG.address.addressRegion,
      addressCountry: SITE_CONFIG.address.addressCountry,
    },
    aggregateRating:
      store.rating && store.rating > 0
        ? {
            '@type': 'AggregateRating',
            ratingValue: store.rating,
            bestRating: 5,
            worstRating: 0,
          }
        : undefined,
  };
}

// ============================================================
// Event
// ============================================================
interface EventLdInput {
  title: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
  organizer?: string | null;
  status?: string | null;
}

export function eventJsonLd(event: EventLdInput) {
  const url = `${SITE_URL}/evenements/${event.slug}`;
  const startDateTime =
    event.start_date && event.start_time
      ? `${event.start_date}T${event.start_time}`
      : (event.start_date ?? undefined);
  const endDateTime =
    event.end_date && event.end_time
      ? `${event.end_date}T${event.end_time}`
      : (event.end_date ?? undefined);

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${url}#event`,
    name: event.title,
    description: event.description ?? undefined,
    url,
    image: event.image ? abs(event.image) : undefined,
    startDate: startDateTime,
    endDate: endDateTime,
    eventStatus:
      event.status === 'cancelled'
        ? 'https://schema.org/EventCancelled'
        : event.status === 'completed'
          ? 'https://schema.org/EventScheduled'
          : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.location ?? SITE_CONFIG.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE_CONFIG.address.streetAddress,
        addressLocality: SITE_CONFIG.address.addressLocality,
        addressRegion: SITE_CONFIG.address.addressRegion,
        postalCode: SITE_CONFIG.address.postalCode,
        addressCountry: SITE_CONFIG.address.addressCountry,
      },
    },
    organizer: {
      '@type': 'Organization',
      name: event.organizer ?? SITE_CONFIG.name,
      url: SITE_URL,
    },
  };
}

// ============================================================
// Article (blog)
// ============================================================
interface ArticleLdInput {
  title: string;
  slug: string;
  excerpt?: string | null;
  featured_image?: string | null;
  author_name?: string | null;
  publish_date?: string | null;
  updated_at?: string | null;
  category?: string | null;
  tags?: string[] | null;
}

export function articleJsonLd(article: ArticleLdInput) {
  const url = `${SITE_URL}/blog/${article.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: article.title,
    description: article.excerpt ?? undefined,
    image: article.featured_image ? [abs(article.featured_image)] : undefined,
    datePublished: article.publish_date ?? undefined,
    dateModified: article.updated_at ?? article.publish_date ?? undefined,
    author: {
      '@type': 'Person',
      name: article.author_name ?? SITE_CONFIG.name,
    },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: article.category ?? undefined,
    keywords: article.tags?.join(', '),
  };
}

// ============================================================
// BreadcrumbList
// ============================================================
export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.url),
    })),
  };
}

// ============================================================
// FAQ
// ============================================================
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
