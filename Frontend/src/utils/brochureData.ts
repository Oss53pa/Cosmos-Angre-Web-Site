/**
 * Données extraites de la plaquette officielle Cosmos Angré
 * Ce fichier centralise toutes les informations du branding
 */

export const BRANDING = {
  // Slogans principaux
  mainSlogan: "L'art de vivre ensemble",
  tagline: 'Le meilleur du quotidien, ici.',

  // Phrases d'accroche
  catchPhrases: {
    success: 'Votre succès commence ici !',
    destination: 'Votre destination préférée, pour toutes les bonnes raisons',
    convergence: 'Un lieu de vie et de convergence incomparable',
    experience: "Bien plus qu'un centre commercial, une expérience à vivre",
    ecosystem: 'intégrer un écosystème où innovation, commerce et convivialité se rencontrent',
  },

  // Contact
  contact: {
    email: 'infos@cosmos-angre.com',
    phone: '+225 27 22 XX XX XX',
    address: {
      street: 'Boulevard des Martyrs, Angré Château',
      city: 'Cocody',
      country: "Abidjan, Côte d'Ivoire",
      full: "Boulevard des Martyrs, Angré Château, Cocody, Abidjan, Côte d'Ivoire",
    },
  },

  // Messages marketing
  messages: {
    intro:
      "Une destination unique qui révolutionne l'expérience du commerce, des loisirs et de la vie quotidienne à Abidjan",
    welcome:
      "Bienvenue à Cosmos Angré, une destination unique qui révolutionne l'expérience du commerce, des loisirs et de la vie quotidienne à Abidjan. Situé dans le quartier animé d'Angré Cocody, ce centre commercial moderne est conçu pour attirer des millions de visiteurs et offrir une plateforme idéale pour les marques et entreprises visionnaires.",
    ecosystem:
      "Rejoindre Cosmos Angré, c'est intégrer un écosystème où innovation, commerce et convivialité se rencontrent. Que vous soyez une grande enseigne ou une jeune entreprise, le centre met à votre disposition tous les atouts nécessaires pour faire de votre activité un succès.",
    invitation:
      "Ne ratez pas cette opportunité unique de donner une visibilité exceptionnelle à votre activité au sein de l'emblématique Cosmos Angré.",
  },
};

export const LOCATION = {
  name: 'Angré Château',
  description:
    "Niché à Angré Château, l'un des quartiers les plus prisés d'Abidjan, Cosmos Angré incarne l'élégance et l'effervescence de ce secteur en plein essor.",
  features: [
    'Larges avenues arborées',
    'Résidences haut de gamme',
    'Infrastructures modernes',
    'Proximité des écoles réputées',
    'Espaces culturels',
  ],
  positioning:
    "c'est le reflet du charme et de l'énergie d'Angré Château, un quartier en pleine expansion",
};

export const SPACES = {
  gallery: {
    name: 'Galerie Commerciale',
    subtitle: 'Le cœur battant de Cosmos Angré',
    description:
      'La galerie commerciale de Cosmos Angré est le véritable poumon du centre, un espace où shopping, détente et loisirs se rencontrent pour offrir une expérience inoubliable à chaque visiteur.',
    features: [
      'Mode et lifestyle : Boutiques tendance, marques locales et internationales',
      'Beauté et bien-être : Espaces dédiés aux soins et à la relaxation',
      'Gastronomie : Restaurants, cafés et snacks pour des moments gourmands',
      'Services essentiels : Solutions pratiques pour simplifier le quotidien',
    ],
    specs: {
      totalArea: '-',
      commonArea: '-',
      rentalArea: '-',
      floors: '-',
      units: '63',
    },
  },

  artisanMarket: {
    name: 'Marché Artisanal',
    subtitle: "L'âme authentique de Cosmos Angré",
    description:
      "Au cœur du Centre Commercial Cosmos Angré, le marché artisanal incarne l'authenticité, la créativité et le savoir-faire local. Véritable vitrine de l'artisanat, cet espace unique met en lumière des talents exceptionnels et des produits faits main.",
    features: [
      'Des créations uniques : Bijoux, vêtements, accessoires, objets de décoration',
      'Des produits authentiques : Articles de qualité, fabriqués avec des matières locales',
      "Une immersion culturelle : Chaque stand raconte l'histoire d'un artisan",
    ],
    specs: {
      totalArea: '456 m²',
      commonArea: '-',
      rentalArea: '-',
      floors: '0',
      units: '-',
    },
  },

  promenade: {
    name: "Promenade et Parc d'Exposition",
    subtitle: 'Un lieu de vie et de découverte',
    description:
      'Cosmos Angré dépasse le simple shopping en offrant un cadre unique où détente, culture et événements se rencontrent.',
    features: [
      'Un cadre verdoyant : Espaces paysagers, allées ombragées et zones de repos',
      'Un lieu convivial : Parfait pour une balade en famille',
      'Des animations régulières : Concerts, spectacles et activités',
      'Un lieu moderne et modulable : Parfait pour salons, foires, expositions',
    ],
    specs: {
      totalArea: '-',
      commonArea: '-',
      rentalArea: '0',
      floors: '0',
      units: '0',
    },
  },

  bigBox1: {
    name: 'BIG BOX 1 - Salle de Jeu / Entertainment',
    subtitle: 'Divertissement et sensations fortes',
    description:
      'Avec ses espaces BIG BOX, Cosmos Angré devient un véritable pôle de divertissement et de bien-être, offrant des expériences uniques pour tous.',
    features: [
      'Salle de jeux moderne : Jeux vidéo, simulateurs, arcade et activités interactives',
      'Espaces de divertissement pour tous les âges',
      'Animations et événements réguliers',
    ],
    specs: {
      totalArea: '522 m²',
      commonArea: '-',
      rentalArea: '-',
      floors: '0',
      units: '-',
    },
  },

  bigBox2: {
    name: 'BIG BOX 2 - Cinéma',
    subtitle: 'Un cinéma moderne pour des émotions inoubliables',
    description: 'Un cinéma de dernière génération au cœur de Cosmos Angré.',
    features: [
      "Technologie de pointe : Salles équipées pour une qualité d'image et de son exceptionnelle",
      'Programmation variée : Blockbusters, films locaux, avant-premières',
      'Confort optimal : Sièges ergonomiques et cadre accueillant',
    ],
    specs: {
      totalArea: '1 167 m²',
      commonArea: '-',
      rentalArea: '-',
      floors: '0',
      units: '-',
    },
  },

  bigBox3: {
    name: 'BIG BOX 3 - Clinique',
    subtitle: 'La santé au cœur de Cosmos Angré',
    description:
      'Avec sa clinique moderne, Cosmos Angré va au-delà du shopping et des loisirs, en offrant des services médicaux de qualité dans un cadre pratique et accessible.',
    features: [
      'Spécialités variées : Médecine générale, pédiatrie, gynécologie, cardiologie, dermatologie',
      'Équipements de pointe : Technologies modernes pour des diagnostics précis',
      "Service rapide et fluide : Organisation optimisée pour réduire les temps d'attente",
    ],
    specs: {
      totalArea: '500 m²',
      commonArea: '-',
      rentalArea: '-',
      floors: '0',
      units: '-',
    },
  },

  bigBox4: {
    name: 'BIG BOX 4 - Office & Retail Park',
    subtitle: 'Un espace bureau moderne et fonctionnel',
    description:
      "Avec BIG BOX 4, Cosmos Angré propose un espace bureau polyvalent et inspirant, idéal pour les entreprises et professionnels en quête d'un cadre dynamique et pratique.",
    features: [
      'Espaces modulables : Bureaux individuels, open spaces ou salles de réunion',
      'Design contemporain : Espaces lumineux, ergonomiques et confortables',
      'Infrastructures de pointe : Internet haut débit, climatisation, sécurité 24h/24',
    ],
    specs: {
      totalArea: '1 820 m²',
      commonArea: '-',
      rentalArea: '-',
      floors: '-',
      units: '-',
    },
  },

  polyclinic: {
    name: 'Clinique (Big Box 3)',
    subtitle: 'La santé au cœur de Cosmos Angré',
    description:
      'Avec sa clinique moderne, Cosmos Angré va au-delà du shopping et des loisirs, en offrant des services médicaux de qualité dans un cadre pratique et accessible.',
    features: [
      'Spécialités variées : Médecine générale, pédiatrie, gynécologie, cardiologie, dermatologie',
      'Équipements de pointe : Technologies modernes pour des diagnostics précis',
      "Service rapide et fluide : Organisation optimisée pour réduire les temps d'attente",
      'Horaires flexibles : Consultations en semaine et le week-end',
    ],
    specs: {
      totalArea: '500 m²',
      commonArea: '-',
      rentalArea: '0',
      floors: '0',
      units: '0',
    },
  },

  hotels: {
    ibisStyles: {
      name: 'Ibis Styles',
      subtitle: 'Confort et modernité',
      features: [
        'Design coloré et convivial : Des espaces modernes et inspirants',
        'Chambres tout confort : Literie de qualité et équipements modernes',
        'Services inclus : Petit-déjeuner et Wi-Fi gratuits',
        'Accès direct : Relié au centre commercial',
      ],
    },
    adagio: {
      name: 'Adagio Aparthotel',
      subtitle: 'Liberté et autonomie',
      features: [
        'Appartements équipés : Spacieux, avec cuisine pour les séjours prolongés',
        'Services premium : Ménage, réception 24h/24',
        'Emplacement stratégique : Au cœur de Cosmos Angré',
      ],
    },
  },

  parking: {
    name: 'Parkings',
    subtitle: 'Votre confort, notre priorité',
    description:
      'Chez Cosmos Angré, nous mettons à votre disposition deux zones de parking pratiques et sécurisées pour une visite fluide et agréable.',
    underground: {
      name: 'Parking Souterrain',
      capacity: '100 places',
      description:
        "À l'abri des intempéries, il offre tranquillité, commodité et accès direct au centre",
    },
    outdoor: {
      name: 'Parking Ouvert',
      capacity: '300 places',
      description:
        "Spacieux et facile d'accès, il est idéal pour les familles et les visiteurs pressés",
    },
    total: '400 places (100 souterraines + 300 extérieures)',
  },
};

export const SUSTAINABILITY = {
  name: 'Certification EDGE',
  fullName: 'Excellence in Design for Greater Efficiencies',
  status: "En voie d'obtention",
  description:
    "Cosmos Angré est fier d'être en voie d'obtention de la certification EDGE, une reconnaissance internationale valorisant les bâtiments à haute efficacité énergétique et environnementale.",
  commitment:
    "Cette certification, fondée sur des standards rigoureux, témoigne de notre engagement à réduire l'impact écologique du centre tout en offrant une expérience exceptionnelle.",
  features: [
    "Réduction de l'impact écologique grâce à des technologies innovantes",
    "Limitation de la consommation d'énergie et d'eau",
    "Minimisation de l'empreinte carbone",
    'Pratiques écoresponsables',
  ],
  message:
    "Choisir Cosmos Angré, c'est soutenir un projet alliant innovation, respect de l'environnement et bien-être.",
};

export const WHY_CHOOSE = {
  title: 'Pourquoi choisir Cosmos Angré ?',
  subtitle: "Parce que Cosmos Angré est bien plus qu'un centre commercial",
  description:
    "c'est une destination unique qui réunit tout ce que vous cherchez au quotidien : shopping, gastronomie, divertissement et services, le tout dans un cadre moderne, convivial et écoresponsable.",
  reasons: [
    {
      title: 'Une expérience complète',
      description:
        "Que vous soyez là pour faire du shopping, déguster des saveurs locales et internationales, ou passer un moment en famille, Cosmos Angré offre une diversité d'expériences pour tous les goûts et tous les âges.",
    },
    {
      title: 'Un emplacement idéal',
      description:
        "Situé au cœur du quartier prestigieux d'Angré Château, à Cocody, Cosmos Angré bénéficie d'une accessibilité optimale et d'un cadre de vie agréable, alliant tranquillité et dynamisme.",
    },
    {
      title: 'Un engagement écoresponsable',
      description:
        "En voie d'obtention de la certification EDGE, Cosmos Angré s'engage pour un avenir durable en réduisant son impact environnemental grâce à des technologies innovantes et des pratiques respectueuses de la planète.",
    },
    {
      title: 'Des services haut de gamme',
      description:
        'Parking sécurisé, espaces familiaux, services personnalisés… Tout est pensé pour rendre votre visite agréable et sans stress.',
    },
    {
      title: 'Un lieu de vie et de convergence',
      description:
        "Cosmos Angré est conçu pour être un carrefour des rencontres et des émotions. Avec une programmation culturelle et événementielle riche, c'est un lieu où l'on vient pour faire ses achats, mais où l'on reste pour vivre des moments inoubliables.",
    },
  ],
  conclusion:
    "Cosmos Angré, c'est l'alliance parfaite entre modernité, convivialité et responsabilité. Venez découvrir un lieu où chaque détail est conçu pour vous inspirer, vous divertir et vous simplifier la vie.",
};

export const KEY_FIGURES = {
  title: 'Les Chiffres Clés Qui Font Toute la Différence',
  description:
    'Le Centre Commercial Cosmos Angré se distingue par des performances impressionnantes et des données stratégiques qui en font un acteur incontournable du commerce à Angré.',
  figures: [
    {
      title: 'Affluence exceptionnelle',
      value: 'X visiteurs mensuels',
      description: 'Plus de X visiteurs mensuels attirés par une offre variée',
    },
    {
      title: 'Emplacement stratégique',
      value: 'X grandes artères',
      description:
        'Accès direct à X grandes artères, proche des zones résidentielles et professionnelles',
    },
    {
      title: 'Espaces modernes',
      value: 'X m²',
      description:
        'Plus de X m² de surfaces commerciales modulables pour grandes enseignes et entrepreneurs',
    },
    {
      title: 'Parking pratique',
      value: '400 places',
      description:
        '400 places sécurisées pour un confort optimal des visiteurs (100 souterraines + 300 extérieures)',
    },
    {
      title: 'Clientèle fidèle et variée',
      value: 'Familles & Actifs',
      description:
        'Familles, jeunes actifs et visiteurs réguliers au fort potentiel de consommation',
    },
  ],
  conclusion:
    "Implantez-vous à Cosmos Angré pour une visibilité maximale et un environnement commercial dynamique. Plus qu'un centre, c'est une opportunité de croissance unique.",
};

export const SERVICES_PREMIUM = [
  {
    name: 'Parking sécurisé',
    description: '400 places dont 100 en souterrain',
  },
  {
    name: 'Espaces familiaux',
    description: 'Aires de jeux et zones de repos',
  },
  {
    name: 'Services personnalisés',
    description: 'Conciergerie et assistance',
  },
  {
    name: 'Sécurité 24/7',
    description: "Surveillance et contrôle d'accès",
  },
  {
    name: 'Wi-Fi gratuit',
    description: 'Connexion haut débit dans tout le centre',
  },
  {
    name: 'Services médicaux',
    description: 'Polyclinique avec spécialités variées',
  },
];
