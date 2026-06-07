import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, type RouteObject } from 'react-router-dom';

// Auth
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import LanguageGate from '../lib/i18n/LanguageGate';
import PageVisibilityGate from '../components/common/PageVisibilityGate';

// Layouts (chargés tout de suite — partagés)
import PublicLayout from '../layouts/PublicLayout';

// Import lazy résilient : si le chunk d'une page échoue à charger (cas fréquent
// après un nouveau déploiement — l'index.html en cache pointe vers d'anciens
// noms de chunks), on force UN rechargement complet pour récupérer l'index
// frais, au lieu d'afficher l'ErrorBoundary. Évite les pages blanches post-deploy.
function lazyWithRetry<T extends React.ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    const KEY = 'cosmos_chunk_reload';
    try {
      const mod = await factory();
      try {
        sessionStorage.removeItem(KEY);
      } catch {
        /* ignore */
      }
      return mod;
    } catch (err) {
      let reloaded = false;
      try {
        reloaded = sessionStorage.getItem(KEY) === '1';
      } catch {
        /* ignore */
      }
      if (!reloaded) {
        try {
          sessionStorage.setItem(KEY, '1');
        } catch {
          /* ignore */
        }
        window.location.reload();
        // Stoppe le rendu le temps du rechargement.
        return new Promise<{ default: T }>(() => {});
      }
      throw err;
    }
  });
}

// Lazy layouts (chargés à la demande)
const AdminLayout = lazyWithRetry(() => import('../layouts/AdminLayout'));
const StoreLayout = lazyWithRetry(() => import('../layouts/StoreLayout'));
const SuperAdminLayout = lazyWithRetry(() => import('../layouts/SuperAdminLayout'));

// Public Pages — bundle public (premier paint)
import HomePage from '../pages/public/HomePage';
import NotFoundPage from '../pages/public/NotFoundPage';

// Lazy public pages (moins critiques que la home)
const AboutPage = lazyWithRetry(() => import('../pages/public/AboutPage'));
const SpacesPage = lazyWithRetry(() => import('../pages/public/SpacesPage'));
const StoresPage = lazyWithRetry(() => import('../pages/public/StoresPage'));
const StoreDetailPage = lazyWithRetry(() => import('../pages/public/StoreDetailPage'));
const EventsPage = lazyWithRetry(() => import('../pages/public/EventsPage'));
const EventDetailPage = lazyWithRetry(() => import('../pages/public/EventDetailPage'));
const ServicesPage = lazyWithRetry(() => import('../pages/public/ServicesPage'));
const BlogPage = lazyWithRetry(() => import('../pages/public/BlogPage'));
const BlogPostPage = lazyWithRetry(() => import('../pages/public/BlogPostPage'));
const ContactPage = lazyWithRetry(() => import('../pages/public/ContactPage'));
const ARNavigationPage = lazyWithRetry(() => import('../pages/public/ARNavigationPage'));
const PremiumServicesPage = lazyWithRetry(() => import('../pages/public/PremiumServicesPage'));
const InteractiveMapPage = lazyWithRetry(() => import('../pages/public/InteractiveMapPage'));
const GastronomiePage = lazyWithRetry(() => import('../pages/public/GastronomiePage'));
const LoisirsPage = lazyWithRetry(() => import('../pages/public/LoisirsPage'));
const HotelPage = lazyWithRetry(() => import('../pages/public/HotelPage'));
const RetailParkPage = lazyWithRetry(() => import('../pages/public/RetailParkPage'));
const PreparerVisitePage = lazyWithRetry(() => import('../pages/public/PreparerVisitePage'));
const FidelitePage = lazyWithRetry(() => import('../pages/public/FidelitePage'));
const CustomPage = lazyWithRetry(() => import('../pages/public/CustomPage'));
const MentionsLegalesPage = lazyWithRetry(() => import('../pages/public/MentionsLegalesPage'));
const ConfidentialitePage = lazyWithRetry(() => import('../pages/public/ConfidentialitePage'));
const CGUPage = lazyWithRetry(() => import('../pages/public/CGUPage'));
const DevenirEnseignePage = lazyWithRetry(() => import('../pages/public/pro/DevenirEnseignePage'));
const AnnonceursPage = lazyWithRetry(() => import('../pages/public/pro/AnnonceursPage'));
const InvestisseursPage = lazyWithRetry(() => import('../pages/public/pro/InvestisseursPage'));
const PressePage = lazyWithRetry(() => import('../pages/public/pro/PressePage'));
const MupiPage = lazyWithRetry(() => import('../pages/public/MupiPage'));
const PreLaunchPage = lazyWithRetry(() => import('../pages/public/PreLaunchPage'));
const MockupsPage = lazyWithRetry(() => import('../pages/public/MockupsPage'));
const SupportsCommunicationPage = lazy(
  () => import('../pages/public/SupportsCommunicationPage')
);

// Auth Pages
const LoginPage = lazyWithRetry(() => import('../pages/auth/LoginPage'));

// Admin Pages
const AdminDashboard = lazyWithRetry(() => import('../pages/admin/AdminDashboard'));
const StoresManagement = lazyWithRetry(() => import('../pages/admin/StoresManagement'));
const EventsManagement = lazyWithRetry(() => import('../pages/admin/EventsManagement'));
const ModerationPage = lazyWithRetry(() => import('../pages/admin/ModerationPage'));
const BillingManagement = lazyWithRetry(() => import('../pages/admin/BillingManagement'));
const ContentManagement = lazyWithRetry(() => import('../pages/admin/ContentManagement'));
const NewsletterManagement = lazyWithRetry(() => import('../pages/admin/NewsletterManagement'));
const ContactsManagement = lazyWithRetry(() => import('../pages/admin/ContactsManagement'));
const BlogManagement = lazyWithRetry(() => import('../pages/admin/BlogManagement'));
const LifeCalendarManagement = lazyWithRetry(() => import('../pages/admin/LifeCalendarManagement'));
const UsersManagement = lazyWithRetry(() => import('../pages/admin/UsersManagement'));
const SettingsPage = lazyWithRetry(() => import('../pages/admin/SettingsPage'));
const MediaManagement = lazyWithRetry(() => import('../pages/admin/MediaManagement'));
const SiteContentManagement = lazyWithRetry(() => import('../pages/admin/SiteContentManagement'));
const ClubManagement = lazyWithRetry(() => import('../pages/admin/ClubManagement'));
const WayfindingManagement = lazyWithRetry(() => import('../pages/admin/WayfindingManagement'));
const PagesManagement = lazyWithRetry(() => import('../pages/admin/PagesManagement'));
const BlocksManagement = lazyWithRetry(() => import('../pages/admin/BlocksManagement'));

// Store Pages
const StoreDashboard = lazyWithRetry(() => import('../pages/store/StoreDashboard'));
const StoreShowcase = lazyWithRetry(() => import('../pages/store/StoreShowcase'));
const StoreAnalytics = lazyWithRetry(() => import('../pages/store/StoreAnalytics'));
const StorePublications = lazyWithRetry(() => import('../pages/store/StorePublications'));
const StorePromotions = lazyWithRetry(() => import('../pages/store/StorePromotions'));
const StoreSettings = lazyWithRetry(() => import('../pages/store/StoreSettings'));

// Super Admin Pages
const SuperAdminDashboard = lazyWithRetry(() => import('../pages/superadmin/SuperAdminDashboard'));
const SubscriptionsManagement = lazyWithRetry(() => import('../pages/superadmin/SubscriptionsManagement'));
const AdminsManagement = lazyWithRetry(() => import('../pages/superadmin/AdminsManagement'));
const SystemSettings = lazyWithRetry(() => import('../pages/superadmin/SystemSettings'));
const AuditLogs = lazyWithRetry(() => import('../pages/superadmin/AuditLogs'));

// Demo (uniquement en dev)
const ComponentsDemo = lazyWithRetry(() => import('../pages/ComponentsDemo'));
const ReduxDemo = lazyWithRetry(() => import('../pages/ReduxDemo'));

const RouteFallback: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div
      role="status"
      aria-label="Chargement"
      className="w-8 h-8 border-2 border-cosmos-gold border-t-transparent rounded-full animate-spin"
    />
  </div>
);

const wrap = (node: React.ReactNode, scope: 'public' | 'admin' = 'public') => (
  <ErrorBoundary scope={scope}>
    <Suspense fallback={<RouteFallback />}>{node}</Suspense>
  </ErrorBoundary>
);

// Enveloppe une page publique avec le contrôle de visibilité (admin show/hide).
const gate = (path: string, node: React.ReactNode) => (
  <PageVisibilityGate path={path}>{node}</PageVisibilityGate>
);

const isDev = import.meta.env.DEV;

// Routes publiques (FR), réutilisées telles quelles pour /en/* via alias.
const publicChildren: RouteObject[] = [
  { index: true, element: <HomePage /> },
  { path: 'a-propos', element: gate('/a-propos', wrap(<AboutPage />)) },
  { path: 'nos-espaces', element: wrap(<SpacesPage />) },
  { path: 'boutiques', element: gate('/boutiques', wrap(<StoresPage />)) },
  { path: 'boutiques/:id', element: wrap(<StoreDetailPage />) },
  { path: 'evenements', element: gate('/evenements', wrap(<EventsPage />)) },
  { path: 'evenements/:id', element: wrap(<EventDetailPage />) },
  { path: 'services', element: gate('/services', wrap(<ServicesPage />)) },
  { path: 'blog', element: gate('/blog', wrap(<BlogPage />)) },
  { path: 'blog/:slug', element: wrap(<BlogPostPage />) },
  { path: 'contact', element: gate('/contact', wrap(<ContactPage />)) },
  { path: 'navigation-ar', element: wrap(<ARNavigationPage />) },
  { path: 'services-premium', element: wrap(<PremiumServicesPage />) },
  { path: 'plan-interactif', element: wrap(<InteractiveMapPage />) },
  { path: 'gastronomie', element: gate('/gastronomie', wrap(<GastronomiePage />)) },
  { path: 'loisirs', element: gate('/loisirs', wrap(<LoisirsPage />)) },
  { path: 'hotel', element: gate('/hotel', wrap(<HotelPage />)) },
  { path: 'retail-park', element: wrap(<RetailParkPage />) },
  { path: 'preparer-visite', element: gate('/preparer-visite', wrap(<PreparerVisitePage />)) },
  { path: 'fidelite', element: gate('/fidelite', wrap(<FidelitePage />)) },
  { path: 'mentions-legales', element: wrap(<MentionsLegalesPage />) },
  { path: 'confidentialite', element: wrap(<ConfidentialitePage />) },
  { path: 'cgu', element: wrap(<CGUPage />) },
  { path: 'professionnels/devenir-enseigne', element: wrap(<DevenirEnseignePage />) },
  { path: 'professionnels/annonceurs', element: wrap(<AnnonceursPage />) },
  { path: 'professionnels/investisseurs', element: wrap(<InvestisseursPage />) },
  { path: 'professionnels/presse', element: wrap(<PressePage />) },
  ...(isDev
    ? [
        { path: 'design-system', element: wrap(<ComponentsDemo />) },
        { path: 'redux-demo', element: wrap(<ReduxDemo />) },
      ]
    : []),
  // Pages personnalisées créées via l'admin (slug à un segment). Doit rester en
  // dernier : les routes statiques ci-dessus ont priorité.
  { path: ':customSlug', element: wrap(<CustomPage />) },
];

const router = createBrowserRouter([
  // FR (langue par défaut, pas de préfixe)
  {
    path: '/',
    element: (
      <LanguageGate>
        <PublicLayout />
      </LanguageGate>
    ),
    children: publicChildren,
  },

  // EN (alias /en/* avec mêmes children)
  {
    path: '/en',
    element: (
      <LanguageGate>
        <PublicLayout />
      </LanguageGate>
    ),
    children: publicChildren,
  },

  // Page de pré-lancement / teasing (standalone, immersive)
  { path: '/pre-lancement', element: wrap(<PreLaunchPage />) },

  // Affiche MUPI (standalone, sans layout public)
  { path: '/mupi', element: wrap(<MupiPage />) },
  // Mockups multi-supports
  { path: '/mockups', element: wrap(<MockupsPage />) },
  // Charte A9 · Supports de communication
  { path: '/supports-communication', element: wrap(<SupportsCommunicationPage />) },

  // Auth
  {
    path: '/auth',
    children: [
      { path: 'login', element: wrap(<LoginPage />) },
      // Auto-inscription désactivée : l'accès se fait sur invitation (admin).
      { path: 'register', element: <Navigate to="/auth/login" replace /> },
    ],
  },

  // Admin
  {
    path: '/admin',
    element: <ProtectedRoute allowedRoles={['SUPER_ADMIN', 'MALL_ADMIN', 'MALL_MODERATOR']} />,
    children: [
      {
        element: wrap(<AdminLayout />, 'admin'),
        children: [
          { index: true, element: wrap(<AdminDashboard />, 'admin') },
          { path: 'boutiques', element: wrap(<StoresManagement />, 'admin') },
          { path: 'evenements', element: wrap(<EventsManagement />, 'admin') },
          { path: 'calendrier-vie', element: wrap(<LifeCalendarManagement />, 'admin') },
          { path: 'moderation', element: wrap(<ModerationPage />, 'admin') },
          { path: 'facturation', element: wrap(<BillingManagement />, 'admin') },
          { path: 'contenu', element: wrap(<ContentManagement />, 'admin') },
          { path: 'contenu-site', element: wrap(<SiteContentManagement />, 'admin') },
          { path: 'cosmos-club', element: wrap(<ClubManagement />, 'admin') },
          { path: 'wayfinding', element: wrap(<WayfindingManagement />, 'admin') },
          { path: 'pages', element: wrap(<PagesManagement />, 'admin') },
          { path: 'blocs', element: wrap(<BlocksManagement />, 'admin') },
          { path: 'newsletter', element: wrap(<NewsletterManagement />, 'admin') },
          { path: 'messages', element: wrap(<ContactsManagement />, 'admin') },
          { path: 'blog', element: wrap(<BlogManagement />, 'admin') },
          { path: 'utilisateurs', element: wrap(<UsersManagement />, 'admin') },
          { path: 'medias', element: wrap(<MediaManagement />, 'admin') },
          { path: 'parametres', element: wrap(<SettingsPage />, 'admin') },
        ],
      },
    ],
  },

  // Mon compte → Enseigne
  { path: '/mon-compte', element: <Navigate to="/enseigne" replace /> },

  // Enseigne (Store)
  {
    path: '/enseigne',
    element: (
      <ProtectedRoute
        allowedRoles={['SUPER_ADMIN', 'MALL_ADMIN', 'STORE_ADMIN', 'STORE_EMPLOYEE']}
      />
    ),
    children: [
      {
        element: wrap(<StoreLayout />, 'admin'),
        children: [
          { index: true, element: wrap(<StoreDashboard />, 'admin') },
          { path: 'vitrine', element: wrap(<StoreShowcase />, 'admin') },
          { path: 'publications', element: wrap(<StorePublications />, 'admin') },
          { path: 'promotions', element: wrap(<StorePromotions />, 'admin') },
          { path: 'analytics', element: wrap(<StoreAnalytics />, 'admin') },
          { path: 'parametres', element: wrap(<StoreSettings />, 'admin') },
        ],
      },
    ],
  },

  // Super Admin
  {
    path: '/superadmin',
    element: <ProtectedRoute allowedRoles={['SUPER_ADMIN']} />,
    children: [
      {
        element: wrap(<SuperAdminLayout />, 'admin'),
        children: [
          { index: true, element: wrap(<SuperAdminDashboard />, 'admin') },
          { path: 'abonnements', element: wrap(<SubscriptionsManagement />, 'admin') },
          { path: 'administrateurs', element: wrap(<AdminsManagement />, 'admin') },
          { path: 'parametres', element: wrap(<SystemSettings />, 'admin') },
          { path: 'logs', element: wrap(<AuditLogs />, 'admin') },
        ],
      },
    ],
  },

  // 404
  { path: '*', element: <NotFoundPage /> },
]);

const AppRouter: React.FC = () => <RouterProvider router={router} />;

export default AppRouter;
