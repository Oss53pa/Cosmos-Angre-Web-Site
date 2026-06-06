/**
 * Données mock du Calendrier de la vie — utilisées comme fallback gracieux
 * quand Supabase est vide (env placeholder ou seed pas encore appliqué).
 * Source : visuel "Calendrier de la vie 2026" Cosmos.
 */
import type { LifeCalendarEvent } from '../hooks/useLifeCalendar';

export const MOCK_LIFE_CALENDAR_2026: LifeCalendarEvent[] = [
  // === Highlights ===
  {
    id: 'mock-h1',
    year: 2026,
    title: 'Cosmos Love Week',
    description: '2 semaines de promotions exclusives et animations romantiques.',
    category: 'commercial',
    start_date: '2026-02-01',
    end_date: '2026-02-14',
    is_highlighted: true,
    highlight_label: 'INCONTOURNABLE',
    highlight_icon: 'Heart',
    highlight_color: null,
    image: null,
    cta_url: null,
    display_order: 1,
    is_published: true,
  },
  {
    id: 'mock-h2',
    year: 2026,
    title: 'Black Friday Week',
    description: "L'évènement shopping le plus attendu de l'année.",
    category: 'commercial',
    start_date: '2026-11-27',
    end_date: '2026-11-30',
    is_highlighted: true,
    highlight_label: 'MÉGA PROMOTION',
    highlight_icon: 'ShoppingBag',
    highlight_color: null,
    image: null,
    cta_url: null,
    display_order: 2,
    is_published: true,
  },
  {
    id: 'mock-h3',
    year: 2026,
    title: 'Réveillon Cosmos',
    description: "La plus grande fête de fin d'année.",
    category: 'commercial',
    start_date: '2026-12-30',
    end_date: '2026-12-30',
    is_highlighted: true,
    highlight_label: 'EXCLUSIF',
    highlight_icon: 'PartyPopper',
    highlight_color: null,
    image: null,
    cta_url: null,
    display_order: 3,
    is_published: true,
  },

  // === T1 ===
  { id: 'mock-1', year: 2026, title: 'Fête de la Crêpe', description: null, category: 'communautaire', start_date: '2026-01-21', end_date: null, is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 10, is_published: true },
  { id: 'mock-2', year: 2026, title: 'Don de Sang', description: null, category: 'communautaire', start_date: '2026-02-21', end_date: null, is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 11, is_published: true },
  { id: 'mock-3', year: 2026, title: 'Journée de la Femme', description: null, category: 'famille', start_date: '2026-03-07', end_date: null, is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 12, is_published: true },
  { id: 'mock-4', year: 2026, title: 'Soirée Nationale', description: null, category: 'commercial', start_date: '2026-03-10', end_date: '2026-03-31', is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 13, is_published: true },
  { id: 'mock-5', year: 2026, title: 'Les Héros de Cosmos', description: null, category: 'famille', start_date: '2026-03-20', end_date: null, is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 14, is_published: true },

  // === T2 ===
  { id: 'mock-10', year: 2026, title: 'Tombola Tabaski', description: null, category: 'partenaires', start_date: '2026-04-20', end_date: null, is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 20, is_published: true },
  { id: 'mock-11', year: 2026, title: 'Ivoire Paquinou Show', description: null, category: 'famille', start_date: '2026-04-24', end_date: '2026-04-25', is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 21, is_published: true },
  { id: 'mock-12', year: 2026, title: 'Mother Karaoké', description: null, category: 'famille', start_date: '2026-05-02', end_date: null, is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 22, is_published: true },
  { id: 'mock-13', year: 2026, title: 'Reine des Épices', description: null, category: 'partenaires', start_date: '2026-05-25', end_date: null, is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 23, is_published: true },
  { id: 'mock-14', year: 2026, title: "Salon d'Orientation", description: null, category: 'communautaire', start_date: '2026-05-30', end_date: null, is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 24, is_published: true },
  { id: 'mock-15', year: 2026, title: 'Village Coupe du monde', description: null, category: 'partenaires', start_date: '2026-06-11', end_date: '2026-06-19', is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 25, is_published: true },
  { id: 'mock-16', year: 2026, title: 'Fête des Pères', description: null, category: 'famille', start_date: '2026-06-20', end_date: null, is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 26, is_published: true },

  // === T3 ===
  { id: 'mock-20', year: 2026, title: 'Village Coupe du Monde', description: null, category: 'partenaires', start_date: '2026-07-01', end_date: '2026-07-12', is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 30, is_published: true },
  { id: 'mock-21', year: 2026, title: 'Don de Sang', description: null, category: 'communautaire', start_date: '2026-07-11', end_date: null, is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 31, is_published: true },
  { id: 'mock-22', year: 2026, title: 'Soirée Nationale', description: null, category: 'commercial', start_date: '2026-08-10', end_date: '2026-08-31', is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 32, is_published: true },
  { id: 'mock-23', year: 2026, title: 'Fashion Week', description: null, category: 'partenaires', start_date: '2026-08-15', end_date: null, is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 33, is_published: true },
  { id: 'mock-24', year: 2026, title: 'Cosmos Ivoire Rap Show', description: null, category: 'partenaires', start_date: '2026-08-29', end_date: null, is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 34, is_published: true },
  { id: 'mock-25', year: 2026, title: 'Foire Rentrée Scolaire', description: null, category: 'famille', start_date: '2026-09-01', end_date: '2026-09-20', is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 35, is_published: true },
  { id: 'mock-26', year: 2026, title: 'Don Orphelinat', description: null, category: 'communautaire', start_date: '2026-09-11', end_date: null, is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 36, is_published: true },

  // === T4 ===
  { id: 'mock-30', year: 2026, title: 'Octobre Rose', description: null, category: 'communautaire', start_date: '2026-10-06', end_date: null, is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 40, is_published: true },
  { id: 'mock-31', year: 2026, title: 'Sensibilisation', description: null, category: 'communautaire', start_date: '2026-11-03', end_date: null, is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 41, is_published: true },
  { id: 'mock-32', year: 2026, title: 'Don aux Jumeaux', description: null, category: 'famille', start_date: '2026-11-22', end_date: null, is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 42, is_published: true },
  { id: 'mock-33', year: 2026, title: 'Anniversaire Cosmos', description: null, category: 'partenaires', start_date: '2026-11-28', end_date: null, is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 44, is_published: true },
  { id: 'mock-34', year: 2026, title: 'Collecte de Jouets', description: null, category: 'communautaire', start_date: '2026-12-01', end_date: null, is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 45, is_published: true },
  { id: 'mock-35', year: 2026, title: 'Marché de Noël', description: null, category: 'famille', start_date: '2026-12-14', end_date: '2026-12-20', is_highlighted: false, highlight_label: null, highlight_icon: null, highlight_color: null, image: null, cta_url: null, display_order: 46, is_published: true },
];
