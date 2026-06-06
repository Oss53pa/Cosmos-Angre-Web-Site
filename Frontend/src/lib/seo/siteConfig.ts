/**
 * Configuration SEO globale — source unique de vérité.
 */
export const SITE_CONFIG = {
  name: 'Cosmos Angré',
  legalName: 'New Heaven SA',
  shortDescription: 'Un monde à part — destination urbaine premium à Cocody-Angré',
  longDescription:
    "Cosmos Angré est une destination urbaine premium à Cocody-Angré, Abidjan. Shopping, gastronomie, loisirs, bien-être, hôtel et événements dans un cadre unique en Côte d'Ivoire.",
  url: import.meta.env.VITE_APP_URL ?? 'https://www.cosmos-angre.com',
  defaultLocale: 'fr_FR',
  alternateLocales: ['en_US'],
  twitter: '@cosmosangre',
  defaultOgImage: '/og-image.jpg',
  themeColor: '#0B1929',
  // Adresse / coordonnées (LocalBusiness JSON-LD)
  address: {
    streetAddress: 'Boulevard Mitterrand',
    addressLocality: 'Cocody-Angré',
    addressRegion: 'Abidjan',
    postalCode: '08 BP',
    addressCountry: 'CI',
  },
  geo: {
    latitude: 5.385,
    longitude: -3.984,
  },
  contact: {
    phone: '+225 27 22 00 00 00',
    email: 'contact@cosmos-angre.com',
  },
  social: {
    facebook: 'https://www.facebook.com/cosmosangre',
    instagram: 'https://www.instagram.com/cosmosangre',
    linkedin: 'https://www.linkedin.com/company/cosmos-angre',
    youtube: 'https://www.youtube.com/@cosmosangre',
  },
  openingHours: ['Mo-Sa 09:00-22:00', 'Su 10:00-21:00'],
} as const;

export type SiteConfig = typeof SITE_CONFIG;
