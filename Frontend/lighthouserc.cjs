/**
 * Lighthouse CI — budgets de performance Cosmos Angré.
 * Lance: npm run lhci
 *
 * Prérequis:
 *   npm i -D @lhci/cli
 */
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview -- --port 4173',
      url: [
        'http://localhost:4173/',
        'http://localhost:4173/boutiques',
        'http://localhost:4173/evenements',
        'http://localhost:4173/blog',
        'http://localhost:4173/contact',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        chromeFlags: '--no-sandbox --headless',
      },
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        // Core Web Vitals
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'speed-index': ['warn', { maxNumericValue: 3400 }],

        // Score categories (0-1)
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:pwa': ['warn', { minScore: 0.7 }],

        // Désactiver les checks bruyants pour CI
        'uses-http2': 'off',
        'csp-xss': 'off',
        'unused-javascript': ['warn', { maxLength: 5 }],
        'unused-css-rules': 'off',
        'errors-in-console': ['warn', { maxLength: 0 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
