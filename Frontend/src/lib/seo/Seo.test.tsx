import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Seo from './Seo';

// Mock useTranslation pour ne pas dépendre d'i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ i18n: { language: 'fr' }, t: (k: string, d?: string) => d ?? k }),
}));

const renderInRouter = (ui: React.ReactElement, path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <HelmetProvider>{ui}</HelmetProvider>
    </MemoryRouter>
  );

describe('<Seo>', () => {
  it('met à jour le document.title', async () => {
    renderInRouter(<Seo title="Boutiques" />);
    await waitFor(() => {
      expect(document.title).toBe('Boutiques — Cosmos Angré');
    });
  });

  it('utilise titleTemplate si fourni', async () => {
    renderInRouter(<Seo titleTemplate="Custom Full Title" />);
    await waitFor(() => {
      expect(document.title).toBe('Custom Full Title');
    });
  });

  it('injecte une meta description', async () => {
    renderInRouter(<Seo description="Description test" />);
    await waitFor(() => {
      const meta = document.querySelector('meta[name="description"]');
      expect(meta?.getAttribute('content')).toBe('Description test');
    });
  });

  it('injecte un canonical absolu basé sur le path', async () => {
    renderInRouter(<Seo />, '/boutiques');
    await waitFor(() => {
      const link = document.querySelector('link[rel="canonical"]');
      expect(link?.getAttribute('href')).toBe('https://www.cosmos-angre.com/boutiques');
    });
  });

  it('génère hreflang FR + EN automatiquement', async () => {
    renderInRouter(<Seo />, '/blog');
    await waitFor(() => {
      const fr = document.querySelector('link[rel="alternate"][hreflang="fr"]');
      const en = document.querySelector('link[rel="alternate"][hreflang="en"]');
      expect(fr?.getAttribute('href')).toBe('https://www.cosmos-angre.com/blog');
      expect(en?.getAttribute('href')).toBe('https://www.cosmos-angre.com/en/blog');
    });
  });

  it('respecte noindex', async () => {
    renderInRouter(<Seo noindex />);
    await waitFor(() => {
      const meta = document.querySelector('meta[name="robots"]');
      expect(meta?.getAttribute('content')).toContain('noindex');
    });
  });

  it('injecte les scripts JSON-LD fournis', async () => {
    renderInRouter(<Seo jsonLd={{ '@context': 'https://schema.org', '@type': 'Test' }} />);
    await waitFor(() => {
      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
      expect(JSON.parse(script!.textContent ?? '{}')['@type']).toBe('Test');
    });
  });
});
