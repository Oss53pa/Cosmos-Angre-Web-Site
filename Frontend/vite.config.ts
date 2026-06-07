import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  return {
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

    optimizeDeps: {
      exclude: ['lucide-react'],
      include: ['react', 'react-dom', 'react-router-dom', '@supabase/supabase-js', 'i18next', 'react-i18next'],
    },

    server: {
      port: 5173,
      strictPort: false,
      open: false,
      headers: {
        // Pre-prod : reproduire approximativement les headers Vercel
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },

    preview: {
      port: 4173,
      strictPort: false,
    },

    build: {
      target: 'es2020',
      sourcemap: mode === 'production' ? 'hidden' : true,
      cssMinify: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 600,
      // Pas de manualChunks : un découpage manuel séparait React des libs qui
      // lisent ses internals (react-dom, use-sync-external-store…), provoquant
      // "Cannot read properties of undefined (reading '__SECRET_INTERNALS…' /
      // 'useSyncExternalStore')" et une page blanche en prod. Rollup gère seul
      // le partage de React avec le bon ordre d'initialisation.
    },

    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },

    envPrefix: 'VITE_',

    // Remplace les console.log en prod
    esbuild:
      mode === 'production'
        ? { drop: ['debugger'], pure: ['console.log', 'console.debug'] }
        : undefined,
  };
});
