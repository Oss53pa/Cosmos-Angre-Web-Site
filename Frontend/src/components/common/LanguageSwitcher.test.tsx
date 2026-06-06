import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ i18n: { language: 'fr' }, t: (k: string) => k }),
}));

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <LanguageSwitcher />
    </MemoryRouter>
  );

describe('LanguageSwitcher', () => {
  it('génère un lien EN préfixé /en depuis une route FR', () => {
    renderAt('/boutiques');
    const en = screen.getByRole('link', { name: 'EN' });
    expect(en.getAttribute('href')).toBe('/en/boutiques');
  });

  it('génère un lien FR sans préfixe depuis une route /en', () => {
    renderAt('/en/blog');
    const fr = screen.getByRole('link', { name: 'FR' });
    expect(fr.getAttribute('href')).toBe('/blog');
  });

  it('préserve search et hash', () => {
    renderAt('/boutiques?cat=mode#section');
    const en = screen.getByRole('link', { name: 'EN' });
    expect(en.getAttribute('href')).toBe('/en/boutiques?cat=mode#section');
  });

  it('marque la langue active avec aria-current', () => {
    renderAt('/');
    const fr = screen.getByRole('link', { name: 'FR' });
    expect(fr.getAttribute('aria-current')).toBe('true');
  });
});
