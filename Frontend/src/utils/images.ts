/**
 * Configuration centralisée des images Cosmos Angré
 * Une fois les images extraites de la plaquette, placez-les dans assets/images/branding/
 * et elles seront automatiquement disponibles dans tout le site
 */

// Images principales
export const BRANDING_IMAGES = {
  // Logo
  logo: '/src/assets/images/branding/logo-cosmos-angre.png',

  // Hero / Couverture
  hero: {
    exterior: '/src/assets/images/branding/hero-exterior.jpg',
    aerial: '/src/assets/images/branding/aerial-3d-plan.jpg',
  },

  // Certification EDGE
  edge: {
    building: '/src/assets/images/branding/edge-building.jpg',
    logo: '/src/assets/images/branding/edge-logo.png',
  },

  // Localisation
  location: {
    aerial: '/src/assets/images/branding/location-aerial.jpg',
    map: '/src/assets/images/branding/location-map.jpg',
  },

  // Plans
  floorPlan: '/src/assets/images/branding/floor-plan.jpg',

  // Galerie Commerciale
  gallery: {
    interior: '/src/assets/images/branding/gallery-interior.jpg',
    escalators: '/src/assets/images/branding/gallery-escalators.jpg',
  },

  // Espaces extérieurs
  outdoor: {
    court: '/src/assets/images/branding/outdoor-court.jpg',
    promenade: '/src/assets/images/branding/promenade-park.jpg',
    garden: '/src/assets/images/branding/indoor-garden.jpg',
  },

  // Marché Artisanal
  artisan: {
    market: '/src/assets/images/branding/artisan-market.jpg',
  },

  // BIG BOX - Cinéma
  cinema: {
    experience: '/src/assets/images/branding/cinema-experience.jpg',
    screen: '/src/assets/images/branding/cinema-screen.jpg',
  },

  // Polyclinique
  medical: {
    team: '/src/assets/images/branding/medical-team.jpg',
    interior: '/src/assets/images/branding/polyclinic-interior.jpg',
    staff: '/src/assets/images/branding/medical-staff.jpg',
  },

  // Bureaux
  office: {
    space: '/src/assets/images/branding/office-space.jpg',
  },

  // Hôtels
  hotels: {
    ibisStyles: '/src/assets/images/branding/ibis-styles-exterior.jpg',
    adagio: '/src/assets/images/branding/adagio-exterior.jpg',
    facade: '/src/assets/images/branding/hotels-facade.jpg',
  },

  // Parking
  parking: {
    outdoor: '/src/assets/images/branding/parking-outdoor.jpg',
  },

  // Lifestyle / Expérience visiteur
  lifestyle: {
    family: '/src/assets/images/branding/family-lifestyle.jpg',
    visitors: '/src/assets/images/branding/visitors-experience.jpg',
    experience: '/src/assets/images/branding/experience-lifestyle.jpg',
  },
};

// Images placeholder (Unsplash) - À remplacer par les vraies images
export const PLACEHOLDER_IMAGES = {
  // Ces URLs seront remplacées une fois les vraies images extraites
  hero: 'https://images.unsplash.com/photo-1555529902-5261145633bf?w=1920&q=80',
  shopping: 'https://images.unsplash.com/photo-1555529902-5261145633bf?w=800&q=80',
  cinema: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
  gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  medical: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
  hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  park: 'https://images.unsplash.com/photo-1569959310708-410b7b72c5e0?w=800&q=80',
  location: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
};

/**
 * Helper function pour obtenir une image avec fallback
 * @param realImage - Chemin vers la vraie image
 * @param placeholderImage - Image placeholder Unsplash
 * @returns L'URL de l'image (vraie ou placeholder)
 */
export const getImage = (realImage: string, placeholderImage: string): string => {
  // TODO: Ajouter une logique pour vérifier si l'image existe
  // Pour l'instant, retourne le placeholder
  // Une fois les images extraites, retournera realImage
  return placeholderImage;
};

/**
 * Helper pour vérifier si une image existe
 */
export const imageExists = async (imagePath: string): Promise<boolean> => {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Status d'extraction des images
 * Mettre à true une fois l'image extraite et placée dans le dossier
 */
export const IMAGE_STATUS = {
  logo: false,
  heroExterior: false,
  aerialPlan: false,
  edgeBuilding: false,
  edgeLogo: false,
  locationAerial: false,
  floorPlan: false,
  galleryInterior: false,
  artisanMarket: false,
  cinema: false,
  medical: false,
  office: false,
  hotels: false,
  parking: false,
};

/**
 * Instructions d'utilisation :
 *
 * 1. Extraire les images de la plaquette PDF
 * 2. Renommer selon la nomenclature dans GUIDE_IMAGES.md
 * 3. Placer dans Frontend/src/assets/images/branding/
 * 4. Mettre à jour IMAGE_STATUS à true pour chaque image extraite
 * 5. Les composants utiliseront automatiquement les vraies images
 */
