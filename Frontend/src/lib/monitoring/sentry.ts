import * as Sentry from '@sentry/react';

const DSN = import.meta.env.VITE_SENTRY_DSN;
const ENV =
  import.meta.env.VITE_SENTRY_ENVIRONMENT ?? (import.meta.env.PROD ? 'production' : 'development');
const SAMPLE_RATE_RAW = import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE;
const SAMPLE_RATE = typeof SAMPLE_RATE_RAW === 'string' ? Number.parseFloat(SAMPLE_RATE_RAW) : 0.1;

let initialized = false;

/**
 * Initialise Sentry une seule fois côté client.
 * No-op si VITE_SENTRY_DSN absent (dev local sans monitoring).
 */
export function initSentry(): void {
  if (initialized) return;
  if (!DSN) {
    if (import.meta.env.DEV) {
      console.info('[Sentry] DSN absent, monitoring désactivé.');
    }
    return;
  }

  Sentry.init({
    dsn: DSN,
    environment: ENV,
    release: `cosmos-angre@${__APP_VERSION__}`,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: Number.isFinite(SAMPLE_RATE) ? SAMPLE_RATE : 0.1,
    replaysSessionSampleRate: 0.05,
    replaysOnErrorSampleRate: 1.0,
    sendDefaultPii: false,
    beforeSend(event) {
      // Ne pas envoyer les erreurs si DEV local
      if (import.meta.env.DEV) return null;
      return event;
    },
  });

  initialized = true;
}

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (!initialized) {
    if (import.meta.env.DEV) console.error('[Sentry not init]', error, context);
    return;
  }
  Sentry.captureException(error, { extra: context });
}

export function setUserContext(user: { id?: string; email?: string; role?: string } | null): void {
  if (!initialized) return;
  if (!user) {
    Sentry.setUser(null);
    return;
  }
  Sentry.setUser({ id: user.id, email: user.email, role: user.role });
}
