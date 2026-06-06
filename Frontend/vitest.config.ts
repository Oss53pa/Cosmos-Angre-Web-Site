import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@i18n': path.resolve(__dirname, './src/i18n'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      // Coverage sur le NOYAU CRITIQUE : sécurité, SEO, monitoring, formulaires.
      // Les hooks CRUD Supabase admin (wrappers identiques de useStores) sont
      // exclus — leur logique est couverte par useStores + tests d'intégration.
      // Les pages, layouts, et utilitaires data sont exclus (rendu/data, pas logique).
      include: [
        'src/lib/seo/**/*.{ts,tsx}',
        'src/lib/api/**/*.{ts,tsx}',
        'src/lib/monitoring/**/*.{ts,tsx}',
        'src/lib/i18n/**/*.{ts,tsx}',
        'src/contexts/AuthContext.tsx',
        'src/components/auth/**/*.{ts,tsx}',
        'src/components/common/{ErrorBoundary,LanguageSwitcher,Skeleton,CookieConsent,Image}.tsx',
        'src/components/layout/Footer.tsx',
        'src/hooks/{useStores,useTestimonials,useNewsletter}.ts',
      ],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/**/*.d.ts',
        'src/test/**',
      ],
      thresholds: {
        lines: 80,
        functions: 75,
        branches: 65,
        statements: 80,
      },
    },
    deps: {
      optimizer: {
        web: {
          include: ['@fontsource-variable/cormorant-garamond', '@fontsource-variable/inter'],
        },
      },
    },
  },
});
