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
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('react-dom') || id.includes('scheduler')) return 'react-dom';
            if (id.includes('react-router')) return 'router';
            if (id.includes('@supabase')) return 'supabase';
            if (id.includes('i18next') || id.includes('react-i18next')) return 'i18n';
            if (id.includes('@reduxjs') || id.includes('react-redux')) return 'redux';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('three')) return 'three';
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) return 'charts';
            if (id.includes('quill') || id.includes('react-quill')) return 'editor';
            if (id.includes('@mui')) return 'mui';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('swiper')) return 'swiper';
            return 'vendor';
          },
        },
      },
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
