import { describe, it, expect } from 'vitest';
import { buildOgImageUrl } from './ogImage';
import { SITE_CONFIG } from './siteConfig';

describe('buildOgImageUrl', () => {
  it('génère URL correcte avec params', () => {
    const url = buildOgImageUrl({ title: 'Hello', type: 'article' });
    expect(url).toContain('/api/og?');
    expect(url).toContain('title=Hello');
    expect(url).toContain('type=article');
  });

  it('gère subtitle optionnel', () => {
    const without = buildOgImageUrl({ title: 'A' });
    expect(without).not.toContain('subtitle=');

    const withSub = buildOgImageUrl({ title: 'A', subtitle: 'B' });
    expect(withSub).toContain('subtitle=B');
  });

  it('préfixe avec SITE_CONFIG.url', () => {
    const url = buildOgImageUrl({ title: 'X' });
    const expectedBase = SITE_CONFIG.url.replace(/\/$/, '');
    expect(url.startsWith(`${expectedBase}/api/og?`)).toBe(true);
  });
});
