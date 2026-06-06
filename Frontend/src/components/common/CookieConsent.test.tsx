import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CookieConsent from './CookieConsent';

vi.mock('../../lib/analytics/plausible', () => ({
  loadPlausible: vi.fn(),
}));

describe('CookieConsent', () => {
  let getItemSpy: ReturnType<typeof vi.spyOn>;
  let setItemSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  });

  it('Affiche le banner si pas de consent stored', () => {
    getItemSpy.mockReturnValue(null);
    render(<CookieConsent />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it("Cache si stored = 'accepted'", () => {
    getItemSpy.mockReturnValue('accepted');
    render(<CookieConsent />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it("Cache si stored = 'rejected'", () => {
    getItemSpy.mockReturnValue('rejected');
    render(<CookieConsent />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it("Click 'Accepter' persiste 'accepted', 'Refuser' persiste 'rejected'", () => {
    getItemSpy.mockReturnValue(null);
    const { unmount } = render(<CookieConsent />);
    fireEvent.click(screen.getByRole('button', { name: /accepter/i }));
    expect(setItemSpy).toHaveBeenCalledWith('cosmos_consent_v1', 'accepted');
    unmount();

    setItemSpy.mockClear();
    getItemSpy.mockReturnValue(null);
    render(<CookieConsent />);
    fireEvent.click(screen.getByRole('button', { name: /refuser/i }));
    expect(setItemSpy).toHaveBeenCalledWith('cosmos_consent_v1', 'rejected');
  });
});
