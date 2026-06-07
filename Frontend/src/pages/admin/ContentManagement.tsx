import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Video,
  Save,
  Eye,
  Edit,
  XCircle,
  Calendar,
  ChevronDown,
  ChevronRight,
  Type,
  Layout,
  Layers,
  LayoutGrid,
  Star,
  MapPin,
  Utensils,
  ShoppingBag,
  Hotel,
  Ticket,
  Heart,
  BookOpen,
  Phone,
  Settings,
  Check,
  AlertCircle,
  Fingerprint,
  PanelRightOpen,
  PanelRightClose,
  ExternalLink,
  Monitor,
  Smartphone,
  X,
  Briefcase,
  Megaphone,
  TrendingUp,
  Newspaper,
  Upload,
} from 'lucide-react';
import PageEditor from '../../components/admin/PageEditor';
import { supabase } from '../../lib/supabase';
import { useContent } from '../../lib/content/SiteContentProvider';

// ========================================
// Types
// ========================================

type FieldType =
  | 'text'
  | 'textarea'
  | 'richtext'
  | 'image'
  | 'video'
  | 'url'
  | 'number'
  | 'list'
  | 'color';

interface ContentField {
  key: string;
  label: string;
  type: FieldType;
  value: string;
  placeholder?: string;
  help?: string;
}

interface ContentSection {
  id: string;
  name: string;
  description: string;
  fields: ContentField[];
  isExpanded?: boolean;
}

interface PageDefinition {
  value: string;
  label: string;
  icon: React.ElementType;
  description: string;
  sections: ContentSection[];
}

// ========================================
// Page Definitions with Structured Sections
// ========================================

// Map page value to public URL for preview
const pageUrlMap: Record<string, string> = {
  'site-identity': '/',
  homepage: '/',
  about: '/a-propos',
  stores: '/boutiques',
  gastronomie: '/gastronomie',
  loisirs: '/loisirs',
  events: '/evenements',
  hotel: '/hotel',
  'preparer-visite': '/preparer-visite',
  fidelite: '/fidelite',
  blog: '/blog',
  services: '/preparer-visite',
  spaces: '/a-propos',
  contact: '/contact',
  'pro-devenir-enseigne': '/professionnels/devenir-enseigne',
  'pro-annonceurs': '/professionnels/annonceurs',
  'pro-investisseurs': '/professionnels/investisseurs',
  'pro-presse': '/professionnels/presse',
  footer: '/',
};

const createPageDefinitions = (): PageDefinition[] => [
  {
    value: 'site-identity',
    label: 'Identite du Site',
    icon: Fingerprint,
    description: 'Logo, favicon, nom du site, couleurs',
    sections: [
      {
        id: 'logo',
        name: 'Logo',
        description: 'Logo principal affiche dans le header et le footer',
        fields: [
          {
            key: 'logo_main',
            label: 'Logo principal (clair, pour header sombre)',
            type: 'image',
            value: '',
            placeholder: 'URL du logo principal (SVG ou PNG transparent)',
            help: 'Format recommande: SVG ou PNG transparent, hauteur 40-60px',
          },
          {
            key: 'logo_dark',
            label: 'Logo sombre (pour fond clair)',
            type: 'image',
            value: '',
            placeholder: 'URL du logo version sombre',
            help: 'Utilise sur les fonds clairs (ex: page admin)',
          },
          {
            key: 'logo_icon',
            label: 'Icone / Favicon',
            type: 'image',
            value: '',
            placeholder: 'URL du favicon (32x32 ou 64x64)',
            help: "Icone affichee dans l'onglet du navigateur",
          },
        ],
      },
      {
        id: 'brand',
        name: 'Marque',
        description: 'Nom, slogan et identite textuelle du site',
        fields: [
          {
            key: 'site_name',
            label: 'Nom du site',
            type: 'text',
            value: 'Cosmos Angre',
            placeholder: 'Cosmos Angre',
          },
          {
            key: 'tagline',
            label: 'Slogan',
            type: 'text',
            value: 'Un monde a part',
            placeholder: 'Un monde a part',
          },
          {
            key: 'description',
            label: 'Description SEO',
            type: 'textarea',
            value:
              'Destination urbaine premium au coeur de Cocody-Angre, Abidjan. Shopping, gastronomie, loisirs, hotel.',
            placeholder: 'Description pour les moteurs de recherche (max 160 caracteres)',
          },
        ],
      },
      {
        id: 'colors',
        name: 'Couleurs Principales',
        description: "Couleurs de l'identite visuelle (reference)",
        fields: [
          {
            key: 'color_primary',
            label: 'Couleur principale (Night)',
            type: 'color',
            value: '#0B1929',
            placeholder: '#0B1929',
          },
          {
            key: 'color_accent',
            label: 'Couleur accent (Gold)',
            type: 'color',
            value: '#C4A676',
            placeholder: '#C4A676',
          },
          {
            key: 'color_background',
            label: 'Couleur de fond (Cream)',
            type: 'color',
            value: '#F5F0E8',
            placeholder: '#F5F0E8',
          },
        ],
      },
    ],
  },
  {
    value: 'homepage',
    label: "Page d'Accueil",
    icon: Layout,
    description: 'Hero, chiffres cles, services, marques, CTA',
    sections: [
      {
        id: 'hero',
        name: 'Hero Principal',
        description: 'Banniere principale avec titre et image de fond',
        fields: [
          {
            key: 'overline',
            label: 'Sur-titre (overline)',
            type: 'text',
            value: 'Bienvenue a',
            placeholder: 'Ex: Bienvenue a',
          },
          {
            key: 'title',
            label: 'Titre principal',
            type: 'text',
            value: 'Un monde a part',
            placeholder: 'Titre hero',
          },
          {
            key: 'subtitle',
            label: 'Sous-titre',
            type: 'textarea',
            value: 'Destination urbaine premium au coeur de Cocody-Angre',
            placeholder: 'Description',
          },
          {
            key: 'cta_text',
            label: 'Texte du bouton CTA',
            type: 'text',
            value: 'Decouvrir Cosmos',
            placeholder: 'Texte du bouton',
          },
          {
            key: 'cta_link',
            label: 'Lien du bouton CTA',
            type: 'url',
            value: '/a-propos',
            placeholder: '/chemin',
          },
          {
            key: 'bg_image',
            label: 'Image de fond',
            type: 'image',
            value: '',
            placeholder: 'URL image 1920x1080',
          },
          {
            key: 'bg_video',
            label: 'Video de fond (optionnel)',
            type: 'video',
            value: '',
            placeholder: 'URL video MP4',
          },
        ],
      },
      {
        id: 'key_figures',
        name: 'Chiffres Cles',
        description: 'Statistiques affichees avec compteurs animes',
        fields: [
          {
            key: 'stat_1_value',
            label: 'Chiffre 1 - Valeur',
            type: 'number',
            value: '200',
            placeholder: 'Ex: 200',
          },
          {
            key: 'stat_1_suffix',
            label: 'Chiffre 1 - Suffixe',
            type: 'text',
            value: '+',
            placeholder: '+',
          },
          {
            key: 'stat_1_label',
            label: 'Chiffre 1 - Label',
            type: 'text',
            value: 'Boutiques & Enseignes',
            placeholder: 'Label',
          },
          {
            key: 'stat_2_value',
            label: 'Chiffre 2 - Valeur',
            type: 'number',
            value: '50',
            placeholder: 'Ex: 50',
          },
          {
            key: 'stat_2_suffix',
            label: 'Chiffre 2 - Suffixe',
            type: 'text',
            value: '+',
            placeholder: '+',
          },
          {
            key: 'stat_2_label',
            label: 'Chiffre 2 - Label',
            type: 'text',
            value: 'Restaurants & Cafes',
            placeholder: 'Label',
          },
          {
            key: 'stat_3_value',
            label: 'Chiffre 3 - Valeur',
            type: 'number',
            value: '5000',
            placeholder: 'Ex: 5000',
          },
          {
            key: 'stat_3_label',
            label: 'Chiffre 3 - Label',
            type: 'text',
            value: 'Places de parking',
            placeholder: 'Label',
          },
          {
            key: 'stat_4_value',
            label: 'Chiffre 4 - Valeur',
            type: 'number',
            value: '2',
            placeholder: 'Ex: 2',
          },
          {
            key: 'stat_4_suffix',
            label: 'Chiffre 4 - Suffixe',
            type: 'text',
            value: 'M+',
            placeholder: 'M+',
          },
          {
            key: 'stat_4_label',
            label: 'Chiffre 4 - Label',
            type: 'text',
            value: 'Visiteurs par an',
            placeholder: 'Label',
          },
        ],
      },
      {
        id: 'services_highlight',
        name: 'Services en Avant',
        description: 'Apercu des services principaux',
        fields: [
          {
            key: 'title',
            label: 'Titre de section',
            type: 'text',
            value: 'Une experience integrale',
            placeholder: 'Titre',
          },
          {
            key: 'subtitle',
            label: 'Sous-titre',
            type: 'textarea',
            value: "Bien plus qu'un centre commercial",
            placeholder: 'Sous-titre',
          },
        ],
      },
      {
        id: 'cta_bottom',
        name: "Appel a l'Action (CTA)",
        description: 'Section CTA en bas de page',
        fields: [
          {
            key: 'title',
            label: 'Titre CTA',
            type: 'text',
            value: "Vivez l'exception",
            placeholder: 'Titre CTA',
          },
          {
            key: 'subtitle',
            label: 'Sous-titre CTA',
            type: 'textarea',
            value: 'Planifiez votre visite',
            placeholder: 'Sous-titre',
          },
          {
            key: 'cta_text',
            label: 'Texte du bouton',
            type: 'text',
            value: 'Preparer ma visite',
            placeholder: 'Texte bouton',
          },
          {
            key: 'cta_link',
            label: 'Lien du bouton',
            type: 'url',
            value: '/preparer-visite',
            placeholder: '/chemin',
          },
          {
            key: 'bg_image',
            label: 'Image de fond',
            type: 'image',
            value: '',
            placeholder: 'URL image',
          },
        ],
      },
    ],
  },
  {
    value: 'about',
    label: 'A Propos',
    icon: Star,
    description: 'Histoire, mission, valeurs, chiffres',
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        description: 'Banniere de la page A propos',
        fields: [
          {
            key: 'overline',
            label: 'Sur-titre',
            type: 'text',
            value: 'A propos',
            placeholder: 'Sur-titre',
          },
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: 'Decouvrez Cosmos Angre',
            placeholder: 'Titre',
          },
          {
            key: 'subtitle',
            label: 'Sous-titre',
            type: 'textarea',
            value: 'Un projet ambitieux par New Heaven SA',
            placeholder: 'Sous-titre',
          },
          {
            key: 'bg_image',
            label: 'Image de fond',
            type: 'image',
            value: '',
            placeholder: 'URL image',
          },
        ],
      },
      {
        id: 'introduction',
        name: 'Introduction',
        description: 'Texte de presentation du projet',
        fields: [
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: 'Un projet visionnaire',
            placeholder: 'Titre',
          },
          {
            key: 'content',
            label: 'Contenu',
            type: 'richtext',
            value: '',
            placeholder: 'Texte de presentation...',
          },
          {
            key: 'image',
            label: 'Image illustrative',
            type: 'image',
            value: '',
            placeholder: 'URL image',
          },
        ],
      },
      {
        id: 'why_choose',
        name: 'Pourquoi Cosmos',
        description: 'Arguments de valeur',
        fields: [
          {
            key: 'title',
            label: 'Titre de section',
            type: 'text',
            value: 'Pourquoi choisir Cosmos ?',
            placeholder: 'Titre',
          },
          {
            key: 'arguments',
            label: 'Arguments (un par ligne)',
            type: 'textarea',
            value:
              'Architecture premium\nEmplacement strategique\nExperience complete\nEngagement RSE',
            placeholder: 'Un argument par ligne',
          },
        ],
      },
      {
        id: 'location',
        name: 'Localisation',
        description: 'Informations geographiques',
        fields: [
          {
            key: 'address',
            label: 'Adresse complete',
            type: 'text',
            value: 'Angre Chateau, Cocody, Abidjan',
            placeholder: 'Adresse',
          },
          {
            key: 'description',
            label: 'Description acces',
            type: 'textarea',
            value: '',
            placeholder: 'Comment acceder...',
          },
          {
            key: 'map_embed',
            label: 'Code embed carte (Google Maps)',
            type: 'textarea',
            value: '',
            placeholder: '<iframe src="..."></iframe>',
          },
        ],
      },
      {
        id: 'sustainability',
        name: 'Developpement Durable',
        description: 'Engagement EDGE et RSE',
        fields: [
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: 'Certification EDGE',
            placeholder: 'Titre',
          },
          {
            key: 'content',
            label: 'Contenu',
            type: 'richtext',
            value: '',
            placeholder: 'Details certification...',
          },
          {
            key: 'certifications',
            label: 'Certifications (une par ligne)',
            type: 'textarea',
            value: 'EDGE Certified\nGestion des eaux\nEnergie solaire',
            placeholder: 'Certifications...',
          },
        ],
      },
      {
        id: 'key_figures',
        name: 'Chiffres Cles',
        description: 'Statistiques de la page A propos',
        fields: [
          {
            key: 'figures',
            label: 'Chiffres cles (format: valeur|label, un par ligne)',
            type: 'textarea',
            value: '18 000 m²|Surface totale\n200+|Enseignes\n5 000|Places parking\n500+|Employes',
            placeholder: '18000|Surface totale',
          },
        ],
      },
    ],
  },
  {
    value: 'stores',
    label: 'Boutiques',
    icon: ShoppingBag,
    description: 'Repertoire des enseignes, categories, filtres',
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        description: 'Banniere de la page Boutiques',
        fields: [
          {
            key: 'overline',
            label: 'Sur-titre',
            type: 'text',
            value: 'Shopping',
            placeholder: 'Sur-titre',
          },
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: "L'Art du Shopping",
            placeholder: 'Titre',
          },
          {
            key: 'subtitle',
            label: 'Sous-titre',
            type: 'textarea',
            value: 'Plus de 200 enseignes prestigieuses',
            placeholder: 'Sous-titre',
          },
          {
            key: 'bg_image',
            label: 'Image de fond',
            type: 'image',
            value: '',
            placeholder: 'URL image',
          },
        ],
      },
      {
        id: 'categories',
        name: 'Categories',
        description: 'Filtres et categories de boutiques',
        fields: [
          {
            key: 'categories',
            label: 'Categories (une par ligne, format: nom|icone)',
            type: 'textarea',
            value:
              'Mode & Accessoires|shirt\nElectronique|monitor\nMaison & Deco|sofa\nBeaute|sparkles\nSport|dumbbell\nEnfants|baby',
            placeholder: 'Mode|shirt',
          },
        ],
      },
      {
        id: 'cta',
        name: 'Section CTA',
        description: "Appel a l'action devenir enseigne",
        fields: [
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: 'Rejoignez Cosmos',
            placeholder: 'Titre',
          },
          {
            key: 'subtitle',
            label: 'Sous-titre',
            type: 'textarea',
            value: 'Vous etes une enseigne et souhaitez nous rejoindre ?',
            placeholder: 'Sous-titre',
          },
          {
            key: 'cta_text',
            label: 'Texte bouton',
            type: 'text',
            value: 'Devenir Enseigne',
            placeholder: 'Texte bouton',
          },
          {
            key: 'cta_link',
            label: 'Lien bouton',
            type: 'url',
            value: '/professionnels/devenir-enseigne',
            placeholder: '/chemin',
          },
        ],
      },
    ],
  },
  {
    value: 'gastronomie',
    label: 'Gastronomie',
    icon: Utensils,
    description: 'Restaurants, food court, reservation',
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        description: 'Banniere gastronomie',
        fields: [
          {
            key: 'overline',
            label: 'Sur-titre',
            type: 'text',
            value: 'Gastronomie',
            placeholder: 'Sur-titre',
          },
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: "L'Art Culinaire",
            placeholder: 'Titre',
          },
          {
            key: 'subtitle',
            label: 'Sous-titre',
            type: 'textarea',
            value: 'Une palette gastronomique exceptionnelle',
            placeholder: 'Sous-titre',
          },
          {
            key: 'bg_image',
            label: 'Image de fond',
            type: 'image',
            value: '',
            placeholder: 'URL image',
          },
        ],
      },
      {
        id: 'intro',
        name: 'Introduction',
        description: "Texte de presentation de l'offre gastronomique",
        fields: [
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: 'Un voyage culinaire unique',
            placeholder: 'Titre',
          },
          {
            key: 'content',
            label: 'Contenu',
            type: 'richtext',
            value: '',
            placeholder: 'Presentation...',
          },
        ],
      },
      {
        id: 'categories',
        name: 'Categories de Restaurants',
        description: 'Types de restaurants affiches',
        fields: [
          {
            key: 'categories',
            label: 'Categories (une par ligne, format: nom|description)',
            type: 'textarea',
            value:
              'Gastronomie Africaine|Saveurs du continent\nCuisine Internationale|Tour du monde culinaire\nFast Food Premium|Restauration rapide de qualite\nCafes & Salons de The|Pauses gourmandes',
            placeholder: 'Nom|Description',
          },
        ],
      },
      {
        id: 'food_court',
        name: 'Food Court',
        description: 'Section espace restauration',
        fields: [
          { key: 'title', label: 'Titre', type: 'text', value: 'Food Court', placeholder: 'Titre' },
          {
            key: 'description',
            label: 'Description',
            type: 'textarea',
            value: 'Un espace convivial de plus de 2 000 m²',
            placeholder: 'Description',
          },
          {
            key: 'capacity',
            label: 'Capacite',
            type: 'text',
            value: '500 places assises',
            placeholder: 'Ex: 500 places',
          },
          { key: 'image', label: 'Image', type: 'image', value: '', placeholder: 'URL image' },
        ],
      },
      {
        id: 'reservation',
        name: 'Reservation',
        description: 'Section prise de reservation',
        fields: [
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: 'Reservez votre table',
            placeholder: 'Titre',
          },
          {
            key: 'description',
            label: 'Description',
            type: 'textarea',
            value: '',
            placeholder: 'Instructions de reservation...',
          },
          {
            key: 'phone',
            label: 'Telephone reservation',
            type: 'text',
            value: '+225 27 22 XX XX XX',
            placeholder: 'Numero',
          },
          {
            key: 'email',
            label: 'Email reservation',
            type: 'text',
            value: 'reservation@cosmosangre.com',
            placeholder: 'Email',
          },
        ],
      },
    ],
  },
  {
    value: 'loisirs',
    label: 'Loisirs',
    icon: Ticket,
    description: 'Activites, divertissements, famille',
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        description: 'Banniere loisirs',
        fields: [
          {
            key: 'overline',
            label: 'Sur-titre',
            type: 'text',
            value: 'Loisirs & Detente',
            placeholder: 'Sur-titre',
          },
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: 'Vivez des Moments Uniques',
            placeholder: 'Titre',
          },
          {
            key: 'subtitle',
            label: 'Sous-titre',
            type: 'textarea',
            value: 'Divertissement, bien-etre et culture',
            placeholder: 'Sous-titre',
          },
          {
            key: 'bg_image',
            label: 'Image de fond',
            type: 'image',
            value: '',
            placeholder: 'URL image',
          },
        ],
      },
      {
        id: 'activities',
        name: "Categories d'Activites",
        description: 'Types de loisirs proposes',
        fields: [
          {
            key: 'categories',
            label: 'Activites (une par ligne, format: nom|description|icone)',
            type: 'textarea',
            value:
              "Cinema|Ecrans derniere generation|film\nBowling|Pistes professionnelles|target\nSpa & Bien-etre|Detente absolue|heart\nSalle de Sport|Equipements premium|dumbbell\nEspace Enfants|Aire de jeux securisee|baby\nGalerie d'Art|Expositions temporaires|palette",
            placeholder: 'Nom|Description|icone',
          },
        ],
      },
      {
        id: 'family',
        name: 'Espace Famille',
        description: 'Activites familiales',
        fields: [
          { key: 'title', label: 'Titre', type: 'text', value: 'En famille', placeholder: 'Titre' },
          {
            key: 'description',
            label: 'Description',
            type: 'textarea',
            value: '',
            placeholder: 'Activites famille...',
          },
          { key: 'image', label: 'Image', type: 'image', value: '', placeholder: 'URL image' },
        ],
      },
    ],
  },
  {
    value: 'events',
    label: 'Evenements',
    icon: Calendar,
    description: 'Calendrier, espaces evenementiels',
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        description: 'Banniere evenements',
        fields: [
          {
            key: 'overline',
            label: 'Sur-titre',
            type: 'text',
            value: 'Evenements',
            placeholder: 'Sur-titre',
          },
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: 'Calendrier des Evenements',
            placeholder: 'Titre',
          },
          {
            key: 'subtitle',
            label: 'Sous-titre',
            type: 'textarea',
            value: 'Defiles, concerts, expositions et plus',
            placeholder: 'Sous-titre',
          },
          {
            key: 'bg_image',
            label: 'Image de fond',
            type: 'image',
            value: '',
            placeholder: 'URL image',
          },
        ],
      },
      {
        id: 'event_spaces',
        name: 'Espaces Evenementiels',
        description: 'Salles et espaces disponibles a la location',
        fields: [
          {
            key: 'title',
            label: 'Titre de section',
            type: 'text',
            value: 'Nos espaces',
            placeholder: 'Titre',
          },
          {
            key: 'spaces',
            label: 'Espaces (un par ligne, format: nom|capacite|surface)',
            type: 'textarea',
            value:
              'Salle Cosmos|500 pers.|800 m²\nRooftop Terrace|200 pers.|400 m²\nAtrium Central|1000 pers.|1200 m²',
            placeholder: 'Nom|Capacite|Surface',
          },
        ],
      },
      {
        id: 'cta',
        name: 'CTA Organisation',
        description: "Appel a l'action pour organiser un evenement",
        fields: [
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: 'Organisez votre evenement',
            placeholder: 'Titre',
          },
          {
            key: 'subtitle',
            label: 'Sous-titre',
            type: 'textarea',
            value: 'Contactez notre equipe evenementielle',
            placeholder: 'Sous-titre',
          },
          {
            key: 'cta_text',
            label: 'Texte bouton',
            type: 'text',
            value: 'Nous contacter',
            placeholder: 'Texte bouton',
          },
          {
            key: 'cta_link',
            label: 'Lien bouton',
            type: 'url',
            value: '/contact',
            placeholder: '/chemin',
          },
        ],
      },
    ],
  },
  {
    value: 'hotel',
    label: 'Hotel',
    icon: Hotel,
    description: 'Chambres, services hoteliers, reservation',
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        description: 'Banniere hotel',
        fields: [
          {
            key: 'overline',
            label: 'Sur-titre',
            type: 'text',
            value: 'Hotel',
            placeholder: 'Sur-titre',
          },
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: "L'Excellence de l'Hospitalite",
            placeholder: 'Titre',
          },
          {
            key: 'subtitle',
            label: 'Sous-titre',
            type: 'textarea',
            value: "Sejournez au coeur de l'experience Cosmos",
            placeholder: 'Sous-titre',
          },
          {
            key: 'bg_image',
            label: 'Image de fond',
            type: 'image',
            value: '',
            placeholder: 'URL image',
          },
        ],
      },
      {
        id: 'rooms',
        name: 'Types de Chambres',
        description: 'Categories de chambres proposees',
        fields: [
          {
            key: 'rooms',
            label: 'Chambres (un par ligne, format: nom|prix|description)',
            type: 'textarea',
            value:
              'Chambre Standard|85 000 FCFA|Confort essentiel\nSuite Junior|150 000 FCFA|Espace et elegance\nSuite Premium|250 000 FCFA|Luxe absolu\nPenthouse|500 000 FCFA|Experience ultime',
            placeholder: 'Type|Prix|Description',
          },
        ],
      },
      {
        id: 'amenities',
        name: 'Services & Equipements',
        description: "Les services de l'hotel",
        fields: [
          {
            key: 'amenities',
            label: 'Services (un par ligne)',
            type: 'textarea',
            value:
              'Room Service 24/7\nPiscine a debordement\nSpa & Centre de bien-etre\nSalle de fitness\nConciergerie personnalisee\nParking prive',
            placeholder: 'Un service par ligne',
          },
        ],
      },
      {
        id: 'booking',
        name: 'Reservation',
        description: 'Informations de reservation',
        fields: [
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: 'Reservez votre sejour',
            placeholder: 'Titre',
          },
          {
            key: 'phone',
            label: 'Telephone',
            type: 'text',
            value: '+225 27 22 XX XX XX',
            placeholder: 'Numero',
          },
          {
            key: 'email',
            label: 'Email',
            type: 'text',
            value: 'hotel@cosmosangre.com',
            placeholder: 'Email',
          },
          {
            key: 'booking_url',
            label: 'Lien reservation externe',
            type: 'url',
            value: '',
            placeholder: 'URL booking',
          },
        ],
      },
    ],
  },
  {
    value: 'preparer-visite',
    label: 'Preparer ma Visite',
    icon: MapPin,
    description: 'Infos pratiques, parking, horaires, FAQ',
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        description: 'Banniere page visite',
        fields: [
          {
            key: 'overline',
            label: 'Sur-titre',
            type: 'text',
            value: 'Votre visite',
            placeholder: 'Sur-titre',
          },
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: 'Preparez votre Visite',
            placeholder: 'Titre',
          },
          {
            key: 'subtitle',
            label: 'Sous-titre',
            type: 'textarea',
            value: "Tout ce qu'il faut savoir avant de venir",
            placeholder: 'Sous-titre',
          },
          {
            key: 'bg_image',
            label: 'Image de fond',
            type: 'image',
            value: '',
            placeholder: 'URL image',
          },
        ],
      },
      {
        id: 'horaires',
        name: "Horaires d'Ouverture",
        description: 'Horaires du centre et des services',
        fields: [
          {
            key: 'hours_weekday',
            label: 'Horaires semaine',
            type: 'text',
            value: 'Lun - Sam : 9h - 21h',
            placeholder: 'Ex: Lun - Sam : 9h - 21h',
          },
          {
            key: 'hours_weekend',
            label: 'Horaires dimanche/ferie',
            type: 'text',
            value: 'Dim : 10h - 20h',
            placeholder: 'Ex: Dim : 10h - 20h',
          },
          {
            key: 'hours_special',
            label: 'Horaires speciaux (optionnel)',
            type: 'textarea',
            value: '',
            placeholder: 'Jours feries, evenements...',
          },
        ],
      },
      {
        id: 'parking',
        name: 'Parking',
        description: 'Informations parking',
        fields: [
          { key: 'title', label: 'Titre', type: 'text', value: 'Parking', placeholder: 'Titre' },
          {
            key: 'capacity',
            label: 'Capacite',
            type: 'text',
            value: '5 000 places',
            placeholder: 'Ex: 5000 places',
          },
          {
            key: 'tarifs',
            label: 'Tarifs (un par ligne)',
            type: 'textarea',
            value: 'Gratuit pour tous les visiteurs\nPlaces PMR\nBornes de recharge electrique',
            placeholder: 'Tarif par ligne',
          },
          {
            key: 'info',
            label: 'Informations complementaires',
            type: 'textarea',
            value: '',
            placeholder: 'Informations sur le parking...',
          },
        ],
      },
      {
        id: 'access',
        name: 'Acces & Transport',
        description: 'Comment venir au centre',
        fields: [
          {
            key: 'address',
            label: 'Adresse',
            type: 'text',
            value: 'Angre Chateau, Cocody, Abidjan',
            placeholder: 'Adresse',
          },
          {
            key: 'transport',
            label: 'Transports (un par ligne, format: mode|details)',
            type: 'textarea',
            value:
              "Voiture|Depuis Plateau : 25 min via Boulevard Latrille\nBus|Lignes 23, 45 - Arret Cosmos\nTaxi|Station taxi a l'entree principale",
            placeholder: 'Mode|Details',
          },
          {
            key: 'map_embed',
            label: 'Embed Google Maps',
            type: 'textarea',
            value: '',
            placeholder: '<iframe...>',
          },
        ],
      },
      {
        id: 'faq',
        name: 'FAQ',
        description: 'Questions frequentes',
        fields: [
          {
            key: 'questions',
            label: 'Questions/Reponses (format: Q|R, une par ligne)',
            type: 'textarea',
            value:
              'Le parking est-il gratuit ?|Oui, le parking est entierement gratuit pour tous les visiteurs.\nY a-t-il un service de conciergerie ?|Oui, notre conciergerie est a votre disposition au rez-de-chaussee.\nPuis-je organiser un evenement ?|Oui, contactez notre equipe evenementielle via le formulaire de contact.',
            placeholder: 'Question|Reponse',
          },
        ],
      },
    ],
  },
  {
    value: 'fidelite',
    label: 'Fidelite',
    icon: Heart,
    description: 'Programme Cosmos Club, avantages, carte cadeau',
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        description: 'Banniere programme fidelite',
        fields: [
          {
            key: 'overline',
            label: 'Sur-titre',
            type: 'text',
            value: 'Fidelite',
            placeholder: 'Sur-titre',
          },
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: 'Cosmos Club',
            placeholder: 'Titre',
          },
          {
            key: 'subtitle',
            label: 'Sous-titre',
            type: 'textarea',
            value: "L'excellence a chaque visite",
            placeholder: 'Sous-titre',
          },
          {
            key: 'bg_image',
            label: 'Image de fond',
            type: 'image',
            value: '',
            placeholder: 'URL image',
          },
        ],
      },
      {
        id: 'tiers',
        name: 'Niveaux du Programme',
        description: 'Paliers de fidelite',
        fields: [
          {
            key: 'tiers',
            label: 'Paliers (un par ligne, format: nom|condition|couleur)',
            type: 'textarea',
            value:
              "Silver|Des l'inscription|#C0C0C0\nGold|A partir de 500 000 FCFA d'achats|#C4A676\nPlatinum|A partir de 2 000 000 FCFA d'achats|#E5E4E2\nBlack|Sur invitation uniquement|#1a1a1a",
            placeholder: 'Nom|Condition|Couleur hex',
          },
        ],
      },
      {
        id: 'benefits',
        name: 'Avantages',
        description: 'Liste des avantages du programme',
        fields: [
          {
            key: 'benefits',
            label: 'Avantages (un par ligne)',
            type: 'textarea',
            value:
              "Remises exclusives chez nos partenaires\nAcces prioritaire aux evenements\nParking VIP gratuit\nService conciergerie dedie\nCadeaux d'anniversaire\nInvitations privees",
            placeholder: 'Un avantage par ligne',
          },
        ],
      },
      {
        id: 'gift_card',
        name: 'Carte Cadeau',
        description: 'Section carte cadeau',
        fields: [
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: 'Carte Cadeau Cosmos',
            placeholder: 'Titre',
          },
          {
            key: 'description',
            label: 'Description',
            type: 'textarea',
            value: "Offrez l'experience Cosmos",
            placeholder: 'Description...',
          },
          {
            key: 'amounts',
            label: 'Montants proposes (separes par virgule)',
            type: 'text',
            value: '25 000, 50 000, 100 000, 200 000',
            placeholder: '25000, 50000...',
          },
          {
            key: 'image',
            label: 'Image carte cadeau',
            type: 'image',
            value: '',
            placeholder: 'URL image',
          },
        ],
      },
    ],
  },
  {
    value: 'blog',
    label: 'Blog / Journal',
    icon: BookOpen,
    description: "Page du journal, parametres d'affichage",
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        description: 'Banniere blog',
        fields: [
          {
            key: 'overline',
            label: 'Sur-titre',
            type: 'text',
            value: 'Journal',
            placeholder: 'Sur-titre',
          },
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: 'Journal Cosmos',
            placeholder: 'Titre',
          },
          {
            key: 'subtitle',
            label: 'Sous-titre',
            type: 'textarea',
            value: 'Actualites, tendances et inspirations',
            placeholder: 'Sous-titre',
          },
          {
            key: 'bg_image',
            label: 'Image de fond',
            type: 'image',
            value: '',
            placeholder: 'URL image',
          },
        ],
      },
      {
        id: 'settings',
        name: "Parametres d'Affichage",
        description: 'Configuration de la page blog',
        fields: [
          {
            key: 'articles_per_page',
            label: 'Articles par page',
            type: 'number',
            value: '9',
            placeholder: 'Ex: 9',
          },
          {
            key: 'categories',
            label: 'Categories (une par ligne)',
            type: 'textarea',
            value: 'Actualites\nMode & Tendances\nGastronomie\nEvenements\nLifestyle\nPartenaires',
            placeholder: 'Une categorie par ligne',
          },
          {
            key: 'show_newsletter_cta',
            label: 'Afficher CTA Newsletter (oui/non)',
            type: 'text',
            value: 'oui',
            placeholder: 'oui ou non',
          },
        ],
      },
    ],
  },
  {
    value: 'services',
    label: 'Services',
    icon: Settings,
    description: 'Conciergerie, services aux visiteurs',
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        description: 'Banniere services',
        fields: [
          {
            key: 'overline',
            label: 'Sur-titre',
            type: 'text',
            value: 'Services',
            placeholder: 'Sur-titre',
          },
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: 'A Votre Service',
            placeholder: 'Titre',
          },
          {
            key: 'subtitle',
            label: 'Sous-titre',
            type: 'textarea',
            value: 'Une gamme de services premium',
            placeholder: 'Sous-titre',
          },
          {
            key: 'bg_image',
            label: 'Image de fond',
            type: 'image',
            value: '',
            placeholder: 'URL image',
          },
        ],
      },
      {
        id: 'service_list',
        name: 'Liste des Services',
        description: 'Tous les services proposes',
        fields: [
          {
            key: 'services',
            label: 'Services (un par ligne, format: nom|description|icone)',
            type: 'textarea',
            value:
              "Conciergerie|Service personnalise pour tous vos besoins|bell\nWi-Fi Gratuit|Connexion haut debit dans tout le centre|wifi\nConsigne|Deposez vos achats et profitez|package\nPersonal Shopper|Accompagnement shopping sur mesure|heart\nVoiturier|Service de voiturier a l'entree VIP|car\nNurserie|Espace dedie aux jeunes parents|baby\nChange Devises|Bureau de change en partenariat bancaire|banknote\nLivraison|Service de livraison de vos achats|truck",
            placeholder: 'Nom|Description|icone',
          },
        ],
      },
    ],
  },
  {
    value: 'spaces',
    label: 'Espaces',
    icon: LayoutGrid,
    description: 'Plan du centre, etages, zones',
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        description: 'Banniere espaces',
        fields: [
          {
            key: 'overline',
            label: 'Sur-titre',
            type: 'text',
            value: 'Nos Espaces',
            placeholder: 'Sur-titre',
          },
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: 'Explorez Cosmos',
            placeholder: 'Titre',
          },
          {
            key: 'subtitle',
            label: 'Sous-titre',
            type: 'textarea',
            value: 'Decouvrez chaque recoin de notre univers',
            placeholder: 'Sous-titre',
          },
          {
            key: 'bg_image',
            label: 'Image de fond',
            type: 'image',
            value: '',
            placeholder: 'URL image',
          },
        ],
      },
      {
        id: 'floors',
        name: 'Etages & Zones',
        description: 'Organisation du centre par niveaux',
        fields: [
          {
            key: 'floors',
            label: 'Etages (un par ligne, format: niveau|nom|description)',
            type: 'textarea',
            value:
              "RDC|Le Grand Hall|Shopping, accueil, conciergerie\nEtage 1|L'Avenue|Mode, accessoires, beaute\nEtage 2|Le Jardin|Gastronomie, food court\nEtage 3|Le Club|Loisirs, cinema, bowling\nRooftop|La Terrasse|Bar, restaurant panoramique, evenements",
            placeholder: 'Niveau|Nom|Description',
          },
        ],
      },
      {
        id: 'parking_info',
        name: 'Parking',
        description: 'Informations stationnement',
        fields: [
          {
            key: 'levels',
            label: 'Niveaux de parking',
            type: 'text',
            value: '3 niveaux souterrains',
            placeholder: 'Ex: 3 niveaux',
          },
          {
            key: 'capacity',
            label: 'Capacite totale',
            type: 'text',
            value: '5 000 places',
            placeholder: 'Ex: 5000 places',
          },
          {
            key: 'features',
            label: 'Equipements (un par ligne)',
            type: 'textarea',
            value:
              "Places PMR reservees\nBornes de recharge electrique\nVideo-surveillance 24/7\nNavettes vers l'entree",
            placeholder: 'Un equipement par ligne',
          },
        ],
      },
    ],
  },
  {
    value: 'contact',
    label: 'Contact',
    icon: Phone,
    description: 'Formulaire, coordonnees, horaires',
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        description: 'Banniere contact',
        fields: [
          {
            key: 'overline',
            label: 'Sur-titre',
            type: 'text',
            value: 'Contact',
            placeholder: 'Sur-titre',
          },
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: 'Contactez-Nous',
            placeholder: 'Titre',
          },
          {
            key: 'subtitle',
            label: 'Sous-titre',
            type: 'textarea',
            value: 'Notre equipe est a votre ecoute',
            placeholder: 'Sous-titre',
          },
          {
            key: 'bg_image',
            label: 'Image de fond',
            type: 'image',
            value: '',
            placeholder: 'URL image',
          },
        ],
      },
      {
        id: 'info',
        name: 'Coordonnees',
        description: 'Informations de contact',
        fields: [
          {
            key: 'address',
            label: 'Adresse',
            type: 'text',
            value: 'Angre Chateau, Cocody, Abidjan',
            placeholder: 'Adresse',
          },
          {
            key: 'phone',
            label: 'Telephone',
            type: 'text',
            value: '+225 27 22 XX XX XX',
            placeholder: 'Numero',
          },
          {
            key: 'email',
            label: 'Email',
            type: 'text',
            value: 'info@cosmosangre.com',
            placeholder: 'Email',
          },
          {
            key: 'hours',
            label: "Horaires d'accueil",
            type: 'text',
            value: 'Lun - Dim : 9h - 21h',
            placeholder: 'Horaires',
          },
        ],
      },
      {
        id: 'form',
        name: 'Formulaire de Contact',
        description: 'Configuration du formulaire',
        fields: [
          {
            key: 'subjects',
            label: 'Sujets du formulaire (un par ligne)',
            type: 'textarea',
            value:
              "Information generale\nService client\nLocation d'espaces\nPartenariat\nReclamation\nAutre",
            placeholder: 'Un sujet par ligne',
          },
          {
            key: 'recipient_email',
            label: 'Email de reception',
            type: 'text',
            value: 'contact@cosmosangre.com',
            placeholder: 'Email',
          },
        ],
      },
      {
        id: 'socials',
        name: 'Reseaux Sociaux',
        description: 'Liens reseaux sociaux',
        fields: [
          {
            key: 'instagram',
            label: 'Instagram',
            type: 'url',
            value: '',
            placeholder: 'URL Instagram',
          },
          {
            key: 'facebook',
            label: 'Facebook',
            type: 'url',
            value: '',
            placeholder: 'URL Facebook',
          },
          {
            key: 'linkedin',
            label: 'LinkedIn',
            type: 'url',
            value: '',
            placeholder: 'URL LinkedIn',
          },
          { key: 'youtube', label: 'YouTube', type: 'url', value: '', placeholder: 'URL YouTube' },
          { key: 'tiktok', label: 'TikTok', type: 'url', value: '', placeholder: 'URL TikTok' },
        ],
      },
    ],
  },
  // ============================================================
  // PROFESSIONNELS — 4 pages Pro éditables
  // (Hero + Stats + CTA. Les blocs Benefits/Reasons/Steps restent
  // codés dans le composant car structurels.)
  // ============================================================
  {
    value: 'pro-devenir-enseigne',
    label: 'Pro — Devenir enseigne',
    icon: Briefcase,
    description: 'Page bailleur : louer un espace commercial à Cosmos',
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        description: 'Bandeau de tête de page',
        fields: [
          { key: 'overline', label: 'Sur-titre', type: 'text', value: 'Professionnels' },
          { key: 'title', label: 'Titre principal', type: 'text', value: 'Devenir enseigne à Cosmos Angré' },
          { key: 'subtitle', label: 'Sous-titre', type: 'textarea', value: 'Rejoignez la destination shopping premium de Cocody-Angré et développez votre marque dans un cadre exceptionnel.' },
          { key: 'intro', label: 'Intro (citation)', type: 'textarea', value: "Plus qu'une simple location, une plateforme commerciale complète conçue pour faire grandir votre marque." },
        ],
      },
      {
        id: 'stats',
        name: 'Statistiques (4 KPI)',
        description: 'Chiffres clés affichés en bandeau',
        fields: [
          { key: 'stat1_value', label: 'KPI 1 — valeur', type: 'text', value: '17 400 m²' },
          { key: 'stat1_label', label: 'KPI 1 — libellé', type: 'text', value: 'Surface totale' },
          { key: 'stat2_value', label: 'KPI 2 — valeur', type: 'text', value: '80+' },
          { key: 'stat2_label', label: 'KPI 2 — libellé', type: 'text', value: 'Enseignes' },
          { key: 'stat3_value', label: 'KPI 3 — valeur', type: 'text', value: '2M+' },
          { key: 'stat3_label', label: 'KPI 3 — libellé', type: 'text', value: 'Visiteurs/an' },
          { key: 'stat4_value', label: 'KPI 4 — valeur', type: 'text', value: '500' },
          { key: 'stat4_label', label: 'KPI 4 — libellé', type: 'text', value: 'Places de parking' },
        ],
      },
      {
        id: 'cta',
        name: 'CTA bas de page',
        description: 'Appel à action principal',
        fields: [
          { key: 'cta_title', label: 'Titre CTA', type: 'text', value: 'Implantez votre enseigne' },
          { key: 'cta_description', label: 'Description CTA', type: 'textarea', value: 'Notre équipe Leasing étudie votre dossier sous 7 jours.' },
          { key: 'cta_label', label: 'Texte du bouton', type: 'text', value: 'Demander un dossier' },
          { key: 'cta_email', label: 'Email de contact dédié', type: 'text', value: 'leasing@cosmos-angre.com' },
        ],
      },
    ],
  },
  {
    value: 'pro-annonceurs',
    label: 'Pro — Annonceurs',
    icon: Megaphone,
    description: 'Page médias : espaces publicitaires premium',
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        description: 'Bandeau de tête de page',
        fields: [
          { key: 'overline', label: 'Sur-titre', type: 'text', value: 'Professionnels' },
          { key: 'title', label: 'Titre principal', type: 'text', value: 'Espaces publicitaires premium' },
          { key: 'subtitle', label: 'Sous-titre', type: 'textarea', value: 'Donnez de la visibilité à votre marque au cœur de Cosmos Angré, sur des supports physiques et digitaux à fort impact.' },
          { key: 'intro', label: 'Intro (citation)', type: 'textarea', value: 'Une plateforme média intégrée, du LED HD au digital ciblé, pour atteindre une audience premium qualifiée.' },
        ],
      },
      {
        id: 'stats',
        name: 'Statistiques (4 KPI)',
        description: 'Chiffres clés audience / supports',
        fields: [
          { key: 'stat1_value', label: 'KPI 1 — valeur', type: 'text', value: '2M+' },
          { key: 'stat1_label', label: 'KPI 1 — libellé', type: 'text', value: 'Visiteurs annuels' },
          { key: 'stat2_value', label: 'KPI 2 — valeur', type: 'text', value: '12' },
          { key: 'stat2_label', label: 'KPI 2 — libellé', type: 'text', value: 'Écrans LED stratégiques' },
          { key: 'stat3_value', label: 'KPI 3 — valeur', type: 'text', value: '15K+' },
          { key: 'stat3_label', label: 'KPI 3 — libellé', type: 'text', value: 'Abonnés newsletter' },
          { key: 'stat4_value', label: 'KPI 4 — valeur', type: 'text', value: '85%' },
          { key: 'stat4_label', label: 'KPI 4 — libellé', type: 'text', value: 'Notoriété locale' },
        ],
      },
      {
        id: 'cta',
        name: 'CTA bas de page',
        description: 'Appel à action principal',
        fields: [
          { key: 'cta_title', label: 'Titre CTA', type: 'text', value: 'Lançons votre campagne' },
          { key: 'cta_description', label: 'Description CTA', type: 'textarea', value: 'Recevez notre media kit et nos tarifs sous 48 heures.' },
          { key: 'cta_label', label: 'Texte du bouton', type: 'text', value: 'Demander le media kit' },
          { key: 'cta_email', label: 'Email de contact dédié', type: 'text', value: 'advertising@cosmos-angre.com' },
        ],
      },
    ],
  },
  {
    value: 'pro-investisseurs',
    label: 'Pro — Investisseurs',
    icon: TrendingUp,
    description: 'Page Relations Investisseurs',
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        description: 'Bandeau de tête de page',
        fields: [
          { key: 'overline', label: 'Sur-titre', type: 'text', value: 'Relations investisseurs' },
          { key: 'title', label: 'Titre principal', type: 'text', value: 'Investir dans Cosmos Angré' },
          { key: 'subtitle', label: 'Sous-titre', type: 'textarea', value: "Un actif immobilier commercial premium, dans un marché ouest-africain en pleine croissance, certifié EDGE." },
          { key: 'intro', label: 'Intro (citation)', type: 'textarea', value: "Une opportunité d'investissement responsable, alliant performance financière et impact environnemental positif." },
        ],
      },
      {
        id: 'stats',
        name: 'Statistiques (4 KPI)',
        description: 'Performance financière et certifications',
        fields: [
          { key: 'stat1_value', label: 'KPI 1 — valeur', type: 'text', value: '+18%' },
          { key: 'stat1_label', label: 'KPI 1 — libellé', type: 'text', value: 'Croissance annuelle' },
          { key: 'stat2_value', label: 'KPI 2 — valeur', type: 'text', value: 'EDGE' },
          { key: 'stat2_label', label: 'KPI 2 — libellé', type: 'text', value: 'Certification durable' },
          { key: 'stat3_value', label: 'KPI 3 — valeur', type: 'text', value: 'AAA' },
          { key: 'stat3_label', label: 'KPI 3 — libellé', type: 'text', value: 'Notation crédit' },
          { key: 'stat4_value', label: 'KPI 4 — valeur', type: 'text', value: '92%' },
          { key: 'stat4_label', label: 'KPI 4 — libellé', type: 'text', value: "Taux d'occupation" },
        ],
      },
      {
        id: 'cta',
        name: 'CTA bas de page',
        description: 'Appel à action principal',
        fields: [
          { key: 'cta_title', label: 'Titre CTA', type: 'text', value: 'Découvrez le dossier complet' },
          { key: 'cta_description', label: 'Description CTA', type: 'textarea', value: "Notre équipe Relations Investisseurs vous accompagne en toute confidentialité." },
          { key: 'cta_label', label: 'Texte du bouton', type: 'text', value: 'Demander la data room' },
          { key: 'cta_email', label: 'Email de contact dédié', type: 'text', value: 'investors@cosmos-angre.com' },
        ],
      },
    ],
  },
  {
    value: 'pro-presse',
    label: 'Pro — Presse',
    icon: Newspaper,
    description: 'Salle de presse : journalistes & médias',
    sections: [
      {
        id: 'hero',
        name: 'Hero',
        description: 'Bandeau de tête de page',
        fields: [
          { key: 'overline', label: 'Sur-titre', type: 'text', value: 'Espace presse' },
          { key: 'title', label: 'Titre principal', type: 'text', value: 'Salle de presse Cosmos Angré' },
          { key: 'subtitle', label: 'Sous-titre', type: 'textarea', value: 'Tous les outils dont vous avez besoin pour parler de Cosmos Angré : visuels, communiqués, interviews et accréditations.' },
          { key: 'intro', label: 'Intro (citation)', type: 'textarea', value: 'Une salle de presse complète, pensée pour faciliter votre travail de journaliste.' },
        ],
      },
      {
        id: 'stats',
        name: 'Statistiques (4 KPI)',
        description: 'Chiffres clés presse',
        fields: [
          { key: 'stat1_value', label: 'KPI 1 — valeur', type: 'text', value: '120+' },
          { key: 'stat1_label', label: 'KPI 1 — libellé', type: 'text', value: 'Articles de presse' },
          { key: 'stat2_value', label: 'KPI 2 — valeur', type: 'text', value: '15' },
          { key: 'stat2_label', label: 'KPI 2 — libellé', type: 'text', value: 'Médias partenaires' },
          { key: 'stat3_value', label: 'KPI 3 — valeur', type: 'text', value: '50K' },
          { key: 'stat3_label', label: 'KPI 3 — libellé', type: 'text', value: 'Photos & visuels HD' },
          { key: 'stat4_value', label: 'KPI 4 — valeur', type: 'text', value: '24h' },
          { key: 'stat4_label', label: 'KPI 4 — libellé', type: 'text', value: 'Délai de réponse' },
        ],
      },
      {
        id: 'cta',
        name: 'CTA bas de page',
        description: 'Appel à action principal',
        fields: [
          { key: 'cta_title', label: 'Titre CTA', type: 'text', value: 'Une demande presse ?' },
          { key: 'cta_description', label: 'Description CTA', type: 'textarea', value: 'Notre attachée de presse vous répond sous 24 heures ouvrées.' },
          { key: 'cta_label', label: 'Texte du bouton', type: 'text', value: 'Contacter le service presse' },
          { key: 'cta_email', label: 'Email de contact dédié', type: 'text', value: 'presse@cosmos-angre.com' },
        ],
      },
    ],
  },
  {
    value: 'footer',
    label: 'Pied de Page',
    icon: Layers,
    description: 'Newsletter, liens, legal, reseaux',
    sections: [
      {
        id: 'newsletter',
        name: 'Newsletter',
        description: 'Section newsletter du pied de page',
        fields: [
          {
            key: 'overline',
            label: 'Sur-titre',
            type: 'text',
            value: 'Newsletter',
            placeholder: 'Sur-titre',
          },
          {
            key: 'title',
            label: 'Titre',
            type: 'text',
            value: "Recevez l'exception dans votre boite mail",
            placeholder: 'Titre',
          },
          {
            key: 'subtitle',
            label: 'Sous-titre',
            type: 'textarea',
            value: 'Offres exclusives, evenements, nouveautes — soyez les premiers informes.',
            placeholder: 'Sous-titre',
          },
          {
            key: 'placeholder',
            label: 'Placeholder email',
            type: 'text',
            value: 'Votre adresse email',
            placeholder: 'Placeholder',
          },
        ],
      },
      {
        id: 'brand',
        name: 'Colonne Marque',
        description: 'Logo, tagline, description',
        fields: [
          {
            key: 'tagline',
            label: 'Tagline',
            type: 'text',
            value: 'Un monde a part',
            placeholder: 'Slogan',
          },
          {
            key: 'description',
            label: 'Description',
            type: 'textarea',
            value: 'Destination urbaine premium au coeur de Cocody-Angre, Abidjan.',
            placeholder: 'Description courte',
          },
        ],
      },
      {
        id: 'contact_bar',
        name: 'Barre de Contact',
        description: 'Adresse, telephone, email, horaires',
        fields: [
          {
            key: 'address',
            label: 'Adresse',
            type: 'text',
            value: 'Angre Chateau, Cocody, Abidjan',
            placeholder: 'Adresse',
          },
          {
            key: 'phone',
            label: 'Telephone',
            type: 'text',
            value: '+225 27 22 XX XX XX',
            placeholder: 'Numero',
          },
          {
            key: 'email',
            label: 'Email',
            type: 'text',
            value: 'info@cosmosangre.com',
            placeholder: 'Email',
          },
          {
            key: 'hours_week',
            label: 'Horaires semaine',
            type: 'text',
            value: '9h - 21h',
            placeholder: 'Ex: 9h - 21h',
          },
          {
            key: 'hours_sunday',
            label: 'Horaires dimanche',
            type: 'text',
            value: '10h - 20h',
            placeholder: 'Ex: 10h - 20h',
          },
        ],
      },
      {
        id: 'legal',
        name: 'Liens Legaux',
        description: 'Copyright et liens de conformite',
        fields: [
          {
            key: 'copyright',
            label: 'Texte copyright',
            type: 'text',
            value: 'Cosmos Angre — New Heaven SA. Tous droits reserves.',
            placeholder: 'Copyright',
          },
        ],
      },
    ],
  },
];

// ========================================
// Component
// ========================================

const CONTENT_STORAGE_PREFIX = 'cosmos-content-';

// Helper to load saved content for a given page from localStorage
function loadPageContent(pageValue: string): Record<string, string> {
  try {
    const raw = localStorage.getItem(CONTENT_STORAGE_PREFIX + pageValue);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // Ignore parse errors
  }
  return {};
}

// Helper to save content for a given page to localStorage
function savePageContent(pageValue: string, data: Record<string, string>) {
  localStorage.setItem(CONTENT_STORAGE_PREFIX + pageValue, JSON.stringify(data));
}

// ----------------------------------------------------------------------------
// Persistance Supabase (cosmos.site_content)
// Clé composite stable : `<page>.<section>.<field>`. Lue côté public par
// SiteContentProvider / useEditableContent. localStorage reste un cache offline.
// ----------------------------------------------------------------------------
interface ContentRow {
  key: string;
  value: string;
  type: string;
  group_label: string;
  label: string;
}

async function upsertContentRows(rows: ContentRow[]): Promise<boolean> {
  if (rows.length === 0) return true;
  try {
    const { error } = await (
      supabase as unknown as {
        from: (t: string) => {
          upsert: (
            values: ContentRow[],
            opts: { onConflict: string }
          ) => Promise<{ error: unknown }>;
        };
      }
    )
      .from('site_content')
      .upsert(rows, { onConflict: 'key' });
    return !error;
  } catch {
    // silencieux — la valeur reste dans localStorage
    return false;
  }
}

const ContentManagement: React.FC = () => {
  const { t } = useTranslation();
  const { reload: reloadContent } = useContent();
  const [pageDefinitions] = useState<PageDefinition[]>(createPageDefinitions);
  const [selectedPageValue, setSelectedPageValue] = useState('homepage');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [editedFields, setEditedFields] = useState<Record<string, string>>({});
  const [savedFields, setSavedFields] = useState<Record<string, string>>({});
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorSection, setEditorSection] = useState<ContentSection | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const savedMessageTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedPage = pageDefinitions.find((p) => p.value === selectedPageValue)!;

  // Load all saved content from localStorage on mount
  useEffect(() => {
    const allLoaded: Record<string, string> = {};
    pageDefinitions.forEach((page) => {
      const saved = loadPageContent(page.value);
      // Merge saved values into the field key format
      page.sections.forEach((section) => {
        section.fields.forEach((field) => {
          const compositeKey = `${page.value}.${section.id}.${field.key}`;
          if (saved[compositeKey] !== undefined) {
            allLoaded[compositeKey] = saved[compositeKey];
          }
        });
      });
    });
    if (Object.keys(allLoaded).length > 0) {
      setEditedFields(allLoaded);
      setSavedFields(allLoaded);
    }
  }, [pageDefinitions]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    selectedPage.sections.forEach((s) => {
      all[s.id] = true;
    });
    setExpandedSections(all);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  const getFieldKey = (pageValue: string, sectionId: string, fieldKey: string) =>
    `${pageValue}.${sectionId}.${fieldKey}`;

  const getFieldValue = (section: ContentSection, field: ContentField) => {
    const key = getFieldKey(selectedPageValue, section.id, field.key);
    return editedFields[key] ?? field.value;
  };

  const setFieldValue = (section: ContentSection, field: ContentField, value: string) => {
    const key = getFieldKey(selectedPageValue, section.id, field.key);
    setEditedFields((prev) => ({ ...prev, [key]: value }));
  };

  const hasChanges = (section: ContentSection) => {
    return section.fields.some((f) => {
      const key = getFieldKey(selectedPageValue, section.id, f.key);
      if (!(key in editedFields)) return false;
      // Compare against saved value, or default if never saved
      const savedVal = savedFields[key] ?? f.value;
      return editedFields[key] !== savedVal;
    });
  };

  const totalFields = pageDefinitions.reduce(
    (sum, p) => sum + p.sections.reduce((s, sec) => s + sec.fields.length, 0),
    0
  );

  // Count fields that have been modified but not yet saved
  const editedCount = (() => {
    let count = 0;
    pageDefinitions.forEach((page) => {
      page.sections.forEach((section) => {
        section.fields.forEach((field) => {
          const key = `${page.value}.${section.id}.${field.key}`;
          if (key in editedFields) {
            const savedVal = savedFields[key] ?? field.value;
            if (editedFields[key] !== savedVal) {
              count++;
            }
          }
        });
      });
    });
    return count;
  })();

  // Show success banner with auto-hide
  const showSuccessBanner = useCallback((msg: string) => {
    if (savedMessageTimer.current) {
      clearTimeout(savedMessageTimer.current);
    }
    setSavedMessage(msg);
    savedMessageTimer.current = setTimeout(() => setSavedMessage(null), 3000);
  }, []);

  // Persist all edited fields for a specific page to localStorage
  const persistPageToStorage = useCallback(
    (pageValue: string) => {
      const pageData: Record<string, string> = {};
      const page = pageDefinitions.find((p) => p.value === pageValue);
      if (!page) return;
      page.sections.forEach((section) => {
        section.fields.forEach((field) => {
          const key = `${pageValue}.${section.id}.${field.key}`;
          if (key in editedFields) {
            pageData[key] = editedFields[key];
          }
        });
      });
      savePageContent(pageValue, pageData);
    },
    [editedFields, pageDefinitions]
  );

  // Construit les lignes Supabase à partir des champs édités (clé composite).
  const buildRows = useCallback(
    (filter?: { pageValue?: string; sectionId?: string }): ContentRow[] => {
      const rows: ContentRow[] = [];
      pageDefinitions.forEach((page) => {
        if (filter?.pageValue && page.value !== filter.pageValue) return;
        page.sections.forEach((section) => {
          if (filter?.sectionId && section.id !== filter.sectionId) return;
          section.fields.forEach((field) => {
            const key = `${page.value}.${section.id}.${field.key}`;
            if (key in editedFields) {
              rows.push({
                key,
                value: editedFields[key] ?? '',
                type: field.type,
                group_label: `${page.label} — ${section.name}`,
                label: field.label,
              });
            }
          });
        });
      });
      return rows;
    },
    [editedFields, pageDefinitions]
  );

  const handleSave = async () => {
    // 1) localStorage (cache offline, feedback instantané)
    pageDefinitions.forEach((page) => {
      persistPageToStorage(page.value);
    });
    setSavedFields({ ...editedFields });
    // 2) Supabase (source de vérité lue par le site public)
    const ok = await upsertContentRows(buildRows());
    reloadContent();
    showSuccessBanner(
      ok
        ? t('admin.content.savedSuccess', 'Modifications enregistrees avec succes')
        : t(
            'admin.content.savedLocalOnly',
            'Enregistre localement (base injoignable, reessayez plus tard)'
          )
    );
  };

  const handleSectionSave = async (section: ContentSection) => {
    // Persist the current page to localStorage
    const pageData: Record<string, string> = {};
    const page = pageDefinitions.find((p) => p.value === selectedPageValue);
    if (page) {
      // Collect all existing saved data for this page first
      const existingSaved = loadPageContent(selectedPageValue);
      Object.assign(pageData, existingSaved);
      // Overwrite with current edited values for this entire page
      page.sections.forEach((sec) => {
        sec.fields.forEach((field) => {
          const key = `${selectedPageValue}.${sec.id}.${field.key}`;
          if (key in editedFields) {
            pageData[key] = editedFields[key];
          }
        });
      });
    }
    savePageContent(selectedPageValue, pageData);

    // Mark saved fields for this section
    const updatedSaved = { ...savedFields };
    section.fields.forEach((f) => {
      const key = getFieldKey(selectedPageValue, section.id, f.key);
      if (key in editedFields) {
        updatedSaved[key] = editedFields[key];
      }
    });
    setSavedFields(updatedSaved);

    // Supabase : on pousse uniquement les champs de cette section.
    const ok = await upsertContentRows(
      buildRows({ pageValue: selectedPageValue, sectionId: section.id })
    );
    reloadContent();

    showSuccessBanner(
      ok
        ? t('admin.content.sectionSaved', 'Section "{{name}}" enregistree', { name: section.name })
        : t(
            'admin.content.sectionSavedLocal',
            'Section "{{name}}" enregistree localement (base injoignable)',
            { name: section.name }
          )
    );
  };

  const handleEditorSave = (content: string, _title: string) => {
    // If we have a current editor section, save the richtext field value
    if (editorSection) {
      const richtextField = editorSection.fields.find((f) => f.type === 'richtext');
      if (richtextField) {
        const key = getFieldKey(selectedPageValue, editorSection.id, richtextField.key);
        setEditedFields((prev) => ({ ...prev, [key]: content }));
      }
    }
    setShowEditor(false);
  };

  // ========================================
  // PageEditor fullscreen mode
  // ========================================
  if (showEditor) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <div className="h-full flex flex-col">
          <div className="border-b border-cosmos-cream px-6 py-4 flex items-center justify-between bg-cosmos-cream/50">
            <h2 className="text-xl font-light text-cosmos-night">
              {t('admin.content.editor', 'Editeur')} — {editorSection?.name || selectedPage.label}
            </h2>
            <button
              onClick={() => setShowEditor(false)}
              className="flex items-center gap-2 px-4 py-2 border border-cosmos-cream hover:border-gray-900 transition-colors font-light"
            >
              <XCircle className="w-4 h-4" strokeWidth={1.5} />
              {t('common.close', 'Fermer')}
            </button>
          </div>
          <div className="flex-1">
            <PageEditor
              initialContent={
                editorSection
                  ? (() => {
                      const rf = editorSection.fields.find((f) => f.type === 'richtext');
                      if (rf) {
                        const key = getFieldKey(selectedPageValue, editorSection.id, rf.key);
                        return editedFields[key] ?? rf.value;
                      }
                      return '';
                    })()
                  : ''
              }
              initialTitle={editorSection?.name || ''}
              onSave={handleEditorSave}
              page={selectedPage.label}
            />
          </div>
        </div>
      </div>
    );
  }

  // Preview URL for the selected page
  const previewUrl = pageUrlMap[selectedPageValue] || '/';

  // ========================================
  // Main Render
  // ========================================
  return (
    <div className="flex gap-0">
      {/* Main Editor Panel */}
      <div
        className={`space-y-6 transition-all duration-300 ${showPreview ? 'flex-1 min-w-0' : 'w-full'}`}
      >
        {/* Success Message */}
        {savedMessage && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-3 rounded shadow-lg flex items-center gap-2 animate-fade-in-down">
            <Check className="w-4 h-4" strokeWidth={1.5} />
            <span className="text-sm font-inter font-light">{savedMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-cosmos-night mb-2 tracking-tight">
              {t('admin.content.title', 'Gestion du Contenu')}
            </h1>
            <p className="text-text-secondary font-light">
              {t('admin.content.subtitle', 'Modifiez le contenu de toutes les pages du site')} —{' '}
              {pageDefinitions.length} {t('admin.content.stats.pages', 'pages')}, {totalFields}{' '}
              {t('admin.content.stats.editableFields', 'champs editables')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {editedCount > 0 && (
              <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-3 h-3" strokeWidth={1.5} />
                {t('admin.content.unsavedChanges', '{{count}} modification(s) non enregistree(s)', {
                  count: editedCount,
                })}
              </span>
            )}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-5 py-2.5 border font-light transition-colors ${
                showPreview
                  ? 'border-cosmos-gold bg-cosmos-gold/10 text-cosmos-night'
                  : 'border-cosmos-cream hover:border-gray-400 text-cosmos-night'
              }`}
            >
              {showPreview ? (
                <PanelRightClose className="w-4 h-4" strokeWidth={1.5} />
              ) : (
                <PanelRightOpen className="w-4 h-4" strokeWidth={1.5} />
              )}
              {t('admin.content.preview', 'Apercu')}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-cosmos-night text-white font-light hover:bg-opacity-90 transition-colors"
            >
              <Save className="w-4 h-4" strokeWidth={1.5} />
              {t('admin.content.saveAll', 'Tout Enregistrer')}
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: t('admin.content.stats.pages', 'Pages'),
              value: pageDefinitions.length,
              icon: Layout,
              color: 'text-cosmos-night',
              bg: 'bg-cosmos-gold/10',
            },
            {
              label: t('admin.content.stats.sections', 'Sections'),
              value: pageDefinitions.reduce((s, p) => s + p.sections.length, 0),
              icon: Layers,
              color: 'text-cosmos-gold',
              bg: 'bg-cosmos-gold/5',
            },
            {
              label: t('admin.content.stats.fields', 'Champs'),
              value: totalFields,
              icon: Type,
              color: 'text-blue-600',
              bg: 'bg-blue-50',
            },
            {
              label: t('admin.content.stats.modified', 'Modifies'),
              value: editedCount,
              icon: Edit,
              color: 'text-amber-600',
              bg: 'bg-amber-50',
            },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-cosmos-cream p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${stat.bg} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} strokeWidth={1.5} />
                </div>
                <div className="text-2xl font-light text-cosmos-night tracking-tight">
                  {stat.value}
                </div>
              </div>
              <div className="text-xs text-text-secondary uppercase tracking-wider font-light">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Page Selector */}
        <div className="bg-white border border-cosmos-cream p-6">
          <h2 className="text-lg font-light text-cosmos-night mb-4 tracking-tight">
            {t('admin.content.selectPage', 'Selectionner une Page')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-3">
            {pageDefinitions.map((page) => {
              const Icon = page.icon;
              const isSelected = selectedPageValue === page.value;
              return (
                <button
                  key={page.value}
                  onClick={() => {
                    setSelectedPageValue(page.value);
                    setExpandedSections({});
                  }}
                  className={`flex flex-col items-center gap-2 px-3 py-4 border text-center transition-all duration-200 ${
                    isSelected
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-cosmos-cream hover:border-gray-400 text-cosmos-night'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${isSelected ? 'text-cosmos-gold' : 'text-text-secondary'}`}
                    strokeWidth={1.5}
                  />
                  <span className="text-xs font-light leading-tight">{page.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Page Content Sections */}
        <div className="bg-white border border-cosmos-cream">
          <div className="p-6 border-b border-cosmos-cream flex items-center justify-between">
            <div className="flex items-center gap-3">
              {React.createElement(selectedPage.icon, {
                className: 'w-5 h-5 text-cosmos-gold',
                strokeWidth: 1.5,
              })}
              <div>
                <h2 className="text-lg font-light text-cosmos-night tracking-tight">
                  {selectedPage.label}
                </h2>
                <p className="text-xs text-text-secondary font-light">{selectedPage.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={expandAll}
                className="text-xs text-text-secondary hover:text-cosmos-night font-light px-3 py-1.5 border border-cosmos-cream hover:border-gray-400 transition-colors"
              >
                {t('admin.content.expandAll', 'Tout ouvrir')}
              </button>
              <button
                onClick={collapseAll}
                className="text-xs text-text-secondary hover:text-cosmos-night font-light px-3 py-1.5 border border-cosmos-cream hover:border-gray-400 transition-colors"
              >
                {t('admin.content.collapseAll', 'Tout fermer')}
              </button>
            </div>
          </div>

          {/* Sections */}
          <div className="divide-y divide-cosmos-cream">
            {selectedPage.sections.map((section) => {
              const isExpanded = expandedSections[section.id] ?? false;
              const changed = hasChanges(section);

              return (
                <div key={section.id}>
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-cosmos-cream/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-text-secondary" strokeWidth={1.5} />
                      )}
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-cosmos-night">
                            {section.name}
                          </span>
                          {changed && <span className="w-2 h-2 bg-amber-500 rounded-full" />}
                        </div>
                        <span className="text-xs text-text-secondary font-light">
                          {section.description}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-text-secondary font-light bg-cosmos-cream px-2 py-0.5">
                        {section.fields.length} {t('admin.content.stats.fields', 'champ')}
                        {section.fields.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </button>

                  {/* Section Fields */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 bg-cosmos-cream/20">
                      <div className="space-y-4">
                        {section.fields.map((field) => (
                          <div key={field.key}>
                            <label className="block text-sm text-cosmos-night font-light mb-1.5">
                              {field.label}
                              {field.help && (
                                <span className="text-xs text-text-secondary ml-2">
                                  ({field.help})
                                </span>
                              )}
                            </label>

                            {/* Text Input */}
                            {(field.type === 'text' ||
                              field.type === 'url' ||
                              field.type === 'number') && (
                              <input
                                type={field.type === 'number' ? 'number' : 'text'}
                                value={getFieldValue(section, field)}
                                onChange={(e) => setFieldValue(section, field, e.target.value)}
                                placeholder={field.placeholder}
                                className="w-full px-4 py-2.5 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-sm transition-colors"
                              />
                            )}

                            {/* Textarea */}
                            {field.type === 'textarea' && (
                              <textarea
                                value={getFieldValue(section, field)}
                                onChange={(e) => setFieldValue(section, field, e.target.value)}
                                placeholder={field.placeholder}
                                rows={4}
                                className="w-full px-4 py-2.5 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-sm resize-y transition-colors"
                              />
                            )}

                            {/* Rich Text */}
                            {field.type === 'richtext' && (
                              <div>
                                <textarea
                                  value={getFieldValue(section, field)}
                                  onChange={(e) => setFieldValue(section, field, e.target.value)}
                                  placeholder={field.placeholder}
                                  rows={4}
                                  className="w-full px-4 py-2.5 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-sm resize-y transition-colors mb-2"
                                />
                                <button
                                  onClick={() => {
                                    setEditorSection(section);
                                    setShowEditor(true);
                                  }}
                                  className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800 font-light transition-colors"
                                >
                                  <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                                  {t('admin.content.openVisualEditor', "Ouvrir l'editeur visuel")}
                                </button>
                              </div>
                            )}

                            {/* Image */}
                            {field.type === 'image' && (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={getFieldValue(section, field)}
                                  onChange={(e) => setFieldValue(section, field, e.target.value)}
                                  placeholder={field.placeholder}
                                  className="flex-1 px-4 py-2.5 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-sm transition-colors"
                                />
                                <button
                                  className="px-3 py-2.5 border border-cosmos-cream hover:border-gray-900 transition-colors"
                                  title={t('admin.content.upload', 'Upload')}
                                >
                                  <Upload
                                    className="w-4 h-4 text-text-secondary"
                                    strokeWidth={1.5}
                                  />
                                </button>
                                {getFieldValue(section, field) && (
                                  <button
                                    className="px-3 py-2.5 border border-cosmos-cream hover:border-gray-900 transition-colors"
                                    title={t('admin.content.preview', 'Previsualiser')}
                                  >
                                    <Eye
                                      className="w-4 h-4 text-text-secondary"
                                      strokeWidth={1.5}
                                    />
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Video */}
                            {field.type === 'video' && (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={getFieldValue(section, field)}
                                  onChange={(e) => setFieldValue(section, field, e.target.value)}
                                  placeholder={field.placeholder}
                                  className="flex-1 px-4 py-2.5 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-sm transition-colors"
                                />
                                <button
                                  className="px-3 py-2.5 border border-cosmos-cream hover:border-gray-900 transition-colors"
                                  title={t('admin.content.uploadVideo', 'Upload video')}
                                >
                                  <Video
                                    className="w-4 h-4 text-text-secondary"
                                    strokeWidth={1.5}
                                  />
                                </button>
                              </div>
                            )}

                            {/* Color */}
                            {field.type === 'color' && (
                              <div className="flex gap-2 items-center">
                                <input
                                  type="color"
                                  value={getFieldValue(section, field)}
                                  onChange={(e) => setFieldValue(section, field, e.target.value)}
                                  className="w-10 h-10 border border-cosmos-cream cursor-pointer rounded"
                                />
                                <input
                                  type="text"
                                  value={getFieldValue(section, field)}
                                  onChange={(e) => setFieldValue(section, field, e.target.value)}
                                  placeholder={field.placeholder}
                                  className="flex-1 px-4 py-2.5 border border-cosmos-cream focus:outline-none focus:border-gray-900 font-light text-sm font-mono transition-colors"
                                />
                                <div
                                  className="w-10 h-10 border border-cosmos-cream rounded"
                                  style={{ backgroundColor: getFieldValue(section, field) }}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Section Actions */}
                      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-cosmos-cream">
                        {section.fields.some((f) => f.type === 'richtext') && (
                          <button
                            onClick={() => {
                              setEditorSection(section);
                              setShowEditor(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 border border-purple-200 text-purple-600 hover:border-purple-400 font-light text-sm transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" strokeWidth={1.5} />
                            {t('admin.content.visualEditor', 'Editeur Visuel')}
                          </button>
                        )}
                        <button
                          onClick={() => handleSectionSave(section)}
                          className="flex items-center gap-2 px-5 py-2 bg-cosmos-night text-white font-light text-sm hover:bg-opacity-90 transition-colors"
                        >
                          <Save className="w-3.5 h-3.5" strokeWidth={1.5} />
                          {t('admin.content.saveSection', 'Enregistrer cette section')}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Page Summary */}
        <div className="bg-white border border-cosmos-cream p-6">
          <h3 className="text-sm font-medium text-cosmos-night mb-4">
            {t('admin.content.pageOverview', 'Apercu des pages')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pageDefinitions.map((page) => {
              const Icon = page.icon;
              const sectionCount = page.sections.length;
              const fieldCount = page.sections.reduce((s, sec) => s + sec.fields.length, 0);
              const hasEdits = page.sections.some((sec) =>
                sec.fields.some((f) => {
                  const key = getFieldKey(page.value, sec.id, f.key);
                  return key in editedFields;
                })
              );

              return (
                <button
                  key={page.value}
                  onClick={() => {
                    setSelectedPageValue(page.value);
                    setExpandedSections({});
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-3 p-3 border text-left transition-all hover:border-gray-400 ${
                    selectedPageValue === page.value
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-cosmos-cream'
                  }`}
                >
                  <div className="w-9 h-9 bg-cosmos-gold/5 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-cosmos-gold" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-light text-cosmos-night truncate">
                        {page.label}
                      </span>
                      {hasEdits && (
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-text-secondary font-light">
                      {sectionCount} {t('admin.content.stats.sections', 'section')}
                      {sectionCount > 1 ? 's' : ''} · {fieldCount}{' '}
                      {t('admin.content.stats.fields', 'champ')}
                      {fieldCount > 1 ? 's' : ''}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* End Main Editor Panel */}
      </div>

      {/* Preview Sidebar */}
      {showPreview && (
        <div className="w-[420px] flex-shrink-0 ml-6 sticky top-0 h-[calc(100vh-120px)]">
          <div className="bg-white border border-cosmos-cream h-full flex flex-col overflow-hidden">
            {/* Preview Header */}
            <div className="px-4 py-3 border-b border-cosmos-cream flex items-center justify-between bg-cosmos-cream/30">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cosmos-gold" strokeWidth={1.5} />
                <span className="text-sm font-light text-cosmos-night">
                  {t('admin.content.livePreview', 'Apercu en direct')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {/* Device Toggle */}
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded transition-colors ${
                    previewDevice === 'desktop'
                      ? 'bg-cosmos-night text-white'
                      : 'text-text-secondary hover:bg-cosmos-cream'
                  }`}
                  title="Desktop"
                >
                  <Monitor className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded transition-colors ${
                    previewDevice === 'mobile'
                      ? 'bg-cosmos-night text-white'
                      : 'text-text-secondary hover:bg-cosmos-cream'
                  }`}
                  title="Mobile"
                >
                  <Smartphone className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
                {/* Open in new tab */}
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-text-secondary hover:text-cosmos-night hover:bg-cosmos-cream rounded transition-colors"
                  title={t('admin.content.openInNewTab', 'Ouvrir dans un nouvel onglet')}
                >
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} />
                </a>
                {/* Close */}
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-1.5 text-text-secondary hover:text-cosmos-night hover:bg-cosmos-cream rounded transition-colors"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Page indicator */}
            <div className="px-4 py-2 border-b border-cosmos-cream bg-cosmos-cream/10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-text-secondary font-inter">
                  Page :
                </span>
                <span className="text-xs font-light text-cosmos-night">{selectedPage.label}</span>
                <span className="text-[10px] text-text-secondary font-mono ml-auto">
                  {previewUrl}
                </span>
              </div>
            </div>

            {/* Iframe Preview */}
            <div className="flex-1 bg-gray-100 flex items-start justify-center p-2 overflow-hidden">
              <div
                className={`bg-white shadow-lg transition-all duration-300 h-full overflow-hidden ${
                  previewDevice === 'mobile'
                    ? 'w-[375px] rounded-xl border-4 border-gray-800'
                    : 'w-full rounded'
                }`}
              >
                <iframe
                  src={previewUrl}
                  title={`Apercu - ${selectedPage.label}`}
                  className="w-full h-full border-0"
                  style={{
                    transform: previewDevice === 'mobile' ? 'scale(1)' : 'scale(0.55)',
                    transformOrigin: 'top left',
                    width: previewDevice === 'mobile' ? '100%' : '182%',
                    height: previewDevice === 'mobile' ? '100%' : '182%',
                  }}
                />
              </div>
            </div>

            {/* Preview Footer */}
            <div className="px-4 py-2.5 border-t border-cosmos-cream bg-cosmos-cream/20">
              <p className="text-[10px] text-text-secondary font-inter font-light text-center">
                {t(
                  'admin.content.previewNote',
                  "L'apercu montre la page actuelle. Enregistrez pour voir vos modifications."
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
