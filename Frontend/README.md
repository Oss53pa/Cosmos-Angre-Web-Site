# 🎨 Frontend - Cosmos Angré

Application React moderne pour la plateforme Cosmos Angré.

## 🛠️ Stack Technique

- **Framework**: React 18+ avec TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit + RTK Query
- **Styling**: Tailwind CSS + Styled Components
- **UI Components**: Material-UI / Ant Design
- **Animation**: Framer Motion
- **Routing**: React Router v6
- **Forms**: React Hook Form + Yup
- **Internationalisation**: react-i18next
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier

## 📁 Structure du Projet

```
src/
├── assets/              # Images, fonts, icônes
├── components/          # Composants réutilisables
│   ├── common/         # Composants génériques (Button, Input, Card, etc.)
│   ├── layout/         # Composants de mise en page (Header, Footer, Sidebar)
│   └── features/       # Composants métier spécifiques
├── pages/               # Pages de l'application
│   ├── public/         # Pages publiques (Home, Boutiques, etc.)
│   ├── admin/          # Pages admin centre commercial
│   ├── store/          # Pages enseigne
│   └── superadmin/     # Pages super admin
├── features/            # Features Redux
│   ├── auth/           # Authentification
│   ├── stores/         # Gestion boutiques
│   ├── events/         # Événements
│   └── ...
├── services/            # Services API (RTK Query)
│   ├── api.ts          # Configuration de base
│   ├── authApi.ts      # Endpoints auth
│   ├── storesApi.ts    # Endpoints stores
│   └── ...
├── hooks/               # Custom hooks
│   ├── useAuth.ts
│   ├── useLocalStorage.ts
│   └── ...
├── utils/               # Utilitaires
│   ├── constants.ts    # Constantes
│   ├── helpers.ts      # Fonctions helper
│   └── validators.ts   # Validateurs
├── types/               # Types TypeScript
│   ├── models.ts       # Types des modèles
│   ├── api.ts          # Types API
│   └── ...
├── styles/              # Styles globaux
│   ├── globals.css     # Styles CSS globaux
│   └── tailwind.css    # Configuration Tailwind
├── i18n/                # Traductions
│   ├── fr/             # Traductions françaises
│   │   ├── common.json
│   │   ├── home.json
│   │   └── ...
│   └── en/             # Traductions anglaises
│       ├── common.json
│       ├── home.json
│       └── ...
├── layouts/             # Layouts
│   ├── PublicLayout.tsx
│   ├── AdminLayout.tsx
│   ├── StoreLayout.tsx
│   └── SuperAdminLayout.tsx
├── App.tsx              # Composant racine
├── main.tsx             # Point d'entrée
└── vite-env.d.ts        # Types Vite
```

## 🎨 Design System

### Palette de Couleurs

```typescript
// tailwind.config.js
export const colors = {
  cosmos: {
    blue: '#231F54',      // Couleur dominante
    red: '#EB3737',       // Call-to-action & alertes
    teal: '#00B6AA',      // Accents premium
    yellow: '#FFD500',    // Énergie & dynamisme
    purple: '#A31EB4',    // Modernité & innovation
    pink: '#E61E73',      // Animation, lifestyle
  },
  background: '#FAFAFA',  // Blanc cassé
  white: '#FFFFFF',
  black: '#000000',
}
```

### Typographie

- **Titres**: Poppins SemiBold
- **Textes**: Inter Regular

```css
/* Exemples d'utilisation */
.heading-1 { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 3rem; }
.heading-2 { font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 2.5rem; }
.body-text { font-family: 'Inter', sans-serif; font-weight: 400; font-size: 1rem; }
```

## 🚀 Installation

### Prérequis

- Node.js 18+
- npm ou yarn

### Commandes

```bash
# Installation des dépendances
npm install

# Développement
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview

# Tests
npm run test
npm run test:watch
npm run test:coverage

# Linting
npm run lint
npm run lint:fix

# Type checking
npm run type-check
```

## 🌐 Configuration

### Variables d'Environnement

Créer un fichier `.env` à la racine du projet Frontend :

```env
# API Backend
VITE_API_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws

# Configuration
VITE_APP_NAME=Cosmos Angré
VITE_DEFAULT_LANGUAGE=fr
VITE_SUPPORTED_LANGUAGES=fr,en

# Features flags
VITE_ENABLE_AR=true
VITE_ENABLE_BLOG=true
VITE_ENABLE_NEWSLETTER=true

# Services externes
VITE_GOOGLE_MAPS_API_KEY=your_key_here
VITE_STRIPE_PUBLIC_KEY=your_key_here
```

## 📦 Composants Principaux

### Composants Common

```typescript
// Button
<Button variant="primary" size="lg" onClick={handleClick}>
  Click me
</Button>

// Input
<Input
  type="text"
  placeholder="Rechercher..."
  value={search}
  onChange={handleChange}
/>

// Card
<Card>
  <CardHeader>Titre</CardHeader>
  <CardBody>Contenu</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Composants Layout

```typescript
// PublicLayout
<PublicLayout>
  <HomePage />
</PublicLayout>

// AdminLayout
<AdminLayout>
  <Dashboard />
</AdminLayout>
```

## 🌍 Internationalisation

### Utilisation

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <h1>{t('home.welcome')}</h1>
      <button onClick={() => i18n.changeLanguage('en')}>
        English
      </button>
    </div>
  );
}
```

### Structure des fichiers de traduction

```json
// i18n/fr/common.json
{
  "app_name": "Cosmos Angré",
  "welcome": "Bienvenue",
  "search": "Rechercher",
  "login": "Se connecter"
}

// i18n/en/common.json
{
  "app_name": "Cosmos Angré",
  "welcome": "Welcome",
  "search": "Search",
  "login": "Login"
}
```

## 🔄 State Management

### Redux Store

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import storesReducer from '../features/stores/storesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    stores: storesReducer,
    // ... autres reducers
  },
});
```

### RTK Query

```typescript
// services/storesApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const storesApi = createApi({
  reducerPath: 'storesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/stores/' }),
  endpoints: (builder) => ({
    getStores: builder.query({
      query: () => '',
    }),
    getStoreById: builder.query({
      query: (id) => `${id}/`,
    }),
  }),
});
```

## 🎭 Routing

### Configuration

```typescript
// App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="boutiques" element={<StoresPage />} />
          <Route path="boutiques/:id" element={<StoreDetailPage />} />
          <Route path="evenements" element={<EventsPage />} />
          <Route path="blog" element={<BlogPage />} />
        </Route>

        {/* Routes admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="boutiques" element={<StoresManagement />} />
          <Route path="moderation" element={<Moderation />} />
        </Route>

        {/* Routes enseigne */}
        <Route path="/store" element={<StoreLayout />}>
          <Route index element={<StoreDashboard />} />
          <Route path="vitrine" element={<StoreShowcase />} />
          <Route path="analytics" element={<StoreAnalytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

## 🎨 Styling

### Tailwind CSS

```typescript
// Exemple d'utilisation
<div className="bg-cosmos-blue text-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all">
  <h2 className="font-poppins font-semibold text-2xl mb-2">
    Titre
  </h2>
  <p className="font-inter text-sm">
    Contenu
  </p>
</div>
```

### Styled Components

```typescript
import styled from 'styled-components';

const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.cosmos.red};
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.5rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.cosmos.blue};
  }
`;
```

## 🧪 Tests

### Tests Unitaires

```typescript
// components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 📱 Responsive Design

Le site est développé avec une approche **mobile-first**.

### Breakpoints

```typescript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // Mobile
      'md': '768px',   // Tablet
      'lg': '1024px',  // Desktop
      'xl': '1280px',  // Large desktop
      '2xl': '1536px', // Extra large
    },
  },
}
```

## 🚀 Performance

### Optimisations

- Code splitting avec React.lazy()
- Lazy loading des images
- Compression des assets
- CDN pour les assets statiques
- Service Workers pour le cache
- Bundle size monitoring

### Lighthouse Score Cibles

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

## 📚 Documentation Additionnelle

- [Guide des Composants](./docs/COMPONENTS.md)
- [Guide du State Management](./docs/STATE_MANAGEMENT.md)
- [Guide de Styling](./docs/STYLING.md)
- [Guide d'Internationalisation](./docs/I18N.md)

## 🤝 Contribution

Voir [CONTRIBUTING.md](../CONTRIBUTING.md) pour les guidelines de contribution.

---

**Développé avec ❤️ pour Cosmos Angré**
