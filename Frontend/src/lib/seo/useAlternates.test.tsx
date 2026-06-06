import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAlternates } from './useAlternates';

const wrapper =
  (path: string) =>
  ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>
  );

describe('useAlternates', () => {
  it('génère FR canonical et /en pour la home', () => {
    const { result } = renderHook(() => useAlternates(), { wrapper: wrapper('/') });
    expect(result.current).toContainEqual({ lang: 'fr', href: 'https://www.cosmos-angre.com/' });
    expect(result.current).toContainEqual({ lang: 'en', href: 'https://www.cosmos-angre.com/en' });
  });

  it('préfixe /en pour une route FR', () => {
    const { result } = renderHook(() => useAlternates(), { wrapper: wrapper('/boutiques') });
    const en = result.current.find((a) => a.lang === 'en');
    expect(en?.href).toBe('https://www.cosmos-angre.com/en/boutiques');
  });

  it('inverse correctement depuis une route /en', () => {
    const { result } = renderHook(() => useAlternates(), { wrapper: wrapper('/en/boutiques') });
    const fr = result.current.find((a) => a.lang === 'fr');
    expect(fr?.href).toBe('https://www.cosmos-angre.com/boutiques');
  });

  it('inclut x-default pointant vers FR', () => {
    const { result } = renderHook(() => useAlternates(), { wrapper: wrapper('/blog') });
    const xDefault = result.current.find((a) => a.lang === 'x-default');
    expect(xDefault?.href).toBe('https://www.cosmos-angre.com/blog');
  });
});
