import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// Mock import.meta.env pour les tests
vi.stubEnv('VITE_SUPABASE_URL', 'https://test.supabase.co');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key');
vi.stubEnv('VITE_APP_URL', 'https://www.cosmos-angre.com');

// Polyfills pour jsdom
if (typeof window !== 'undefined') {
  // matchMedia
  if (!window.matchMedia) {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  }

  // IntersectionObserver
  if (!window.IntersectionObserver) {
    class IO {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
      takeRecords = vi.fn(() => []);
      root = null;
      rootMargin = '';
      thresholds: number[] = [];
    }
    // @ts-expect-error — polyfill pour test
    window.IntersectionObserver = IO;
  }

  // ResizeObserver
  if (!window.ResizeObserver) {
    class RO {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
    }
    // @ts-expect-error — polyfill pour test
    window.ResizeObserver = RO;
  }

  // scrollTo
  if (!window.scrollTo) {
    window.scrollTo = vi.fn();
  }
}
