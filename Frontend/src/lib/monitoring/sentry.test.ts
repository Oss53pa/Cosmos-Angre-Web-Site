import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@sentry/react', () => ({
  init: vi.fn(),
  captureException: vi.fn(),
  setUser: vi.fn(),
  browserTracingIntegration: vi.fn(() => ({})),
  replayIntegration: vi.fn(() => ({})),
}));

describe('sentry monitoring', () => {
  let originalDsn: string | undefined;

  beforeEach(() => {
    originalDsn = import.meta.env.VITE_SENTRY_DSN;
    vi.stubEnv('VITE_SENTRY_DSN', '');
    vi.resetModules();
  });

  afterEach(() => {
    if (originalDsn !== undefined) {
      vi.stubEnv('VITE_SENTRY_DSN', originalDsn);
    }
    vi.restoreAllMocks();
  });

  it('initSentry() no-op si VITE_SENTRY_DSN absent', async () => {
    vi.stubEnv('VITE_SENTRY_DSN', '');
    const Sentry = await import('@sentry/react');
    const mod = await import('./sentry');
    mod.initSentry();
    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it('captureException() log en console.error en DEV si pas init', async () => {
    vi.stubEnv('VITE_SENTRY_DSN', '');
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mod = await import('./sentry');
    mod.captureException(new Error('boom'), { foo: 'bar' });
    // En DEV (vitest), import.meta.env.DEV est true
    expect(errSpy).toHaveBeenCalled();
  });

  it('setUserContext(null) ne crashe pas si pas init', async () => {
    vi.stubEnv('VITE_SENTRY_DSN', '');
    const mod = await import('./sentry');
    expect(() => mod.setUserContext(null)).not.toThrow();
  });
});
