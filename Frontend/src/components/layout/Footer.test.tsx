import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from './Footer';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string, d?: string | Record<string, unknown>) => (typeof d === 'string' ? d : k),
    i18n: { language: 'fr', changeLanguage: vi.fn() },
  }),
}));

const subscribeMock = vi.fn();
vi.mock('../../lib/api/contact', () => ({
  subscribeNewsletter: (...args: unknown[]) => subscribeMock(...args),
}));

const toastErrorMock = vi.fn();
const toastSuccessMock = vi.fn();
vi.mock('../../lib/ui/toast', () => ({
  toast: {
    error: (...args: unknown[]) => toastErrorMock(...args),
    success: (...args: unknown[]) => toastSuccessMock(...args),
  },
}));

const renderFooter = () =>
  render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>
  );

describe('Footer', () => {
  beforeEach(() => {
    subscribeMock.mockReset();
    toastErrorMock.mockReset();
    toastSuccessMock.mockReset();
  });

  it('rendu avec liens légaux (mentions, confidentialite, cgu)', () => {
    renderFooter();
    const links = screen.getAllByRole('link');
    const hrefs = links.map((l) => l.getAttribute('href'));
    expect(hrefs).toContain('/mentions-legales');
    expect(hrefs).toContain('/confidentialite');
    expect(hrefs).toContain('/cgu');
  });

  it('Newsletter form avec honeypot caché', () => {
    const { container } = renderFooter();
    const honeypot = container.querySelector('input[name="website"]') as HTMLInputElement;
    expect(honeypot).toBeTruthy();
    expect(honeypot.getAttribute('aria-hidden')).toBe('true');
    expect(honeypot.tabIndex).toBe(-1);
  });

  it('Email invalide → toast error appelé', async () => {
    renderFooter();
    const emailInput = screen.getByLabelText(/votre email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'pas-un-email' } });
    const form = emailInput.closest('form')!;
    fireEvent.submit(form);
    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalled();
    });
    expect(subscribeMock).not.toHaveBeenCalled();
  });

  it('Email valide → subscribeNewsletter appelé', async () => {
    subscribeMock.mockResolvedValue({ ok: true });
    renderFooter();
    const emailInput = screen.getByLabelText(/votre email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'foo@bar.com' } });
    const form = emailInput.closest('form')!;
    fireEvent.submit(form);
    await waitFor(() => {
      expect(subscribeMock).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'foo@bar.com', source: 'footer' })
      );
    });
  });
});
