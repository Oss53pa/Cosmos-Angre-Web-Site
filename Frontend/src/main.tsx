import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { SiteContentProvider } from './lib/content/SiteContentProvider';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import CookieConsent from './components/common/CookieConsent';
import App from './App';
import { initSentry } from './lib/monitoring/sentry';

// Self-hosted fonts (variable, font-display: swap par défaut)
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/cormorant-garamond/wght.css';
import '@fontsource-variable/cormorant-garamond/wght-italic.css';

import './styles/globals.css';

// Init monitoring (no-op si VITE_SENTRY_DSN absent)
initSentry();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary scope="global">
      <HelmetProvider>
        <Provider store={store}>
          <ThemeProvider>
            <AuthProvider>
              <SiteContentProvider>
              <App />
              <Toaster
                position="top-right"
                richColors
                closeButton
                theme="dark"
                toastOptions={{
                  className: 'font-inter',
                  style: {
                    background: '#24412C',
                    color: '#F2EBDD',
                    border: '1px solid rgba(201, 148, 58, 0.3)',
                  },
                }}
              />
              <CookieConsent />
              </SiteContentProvider>
            </AuthProvider>
          </ThemeProvider>
        </Provider>
      </HelmetProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
