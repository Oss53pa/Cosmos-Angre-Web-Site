import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

// Mock du client supabase
const getSession = vi.fn();
const onAuthStateChange = vi.fn();
const signInWithPassword = vi.fn();
const signUp = vi.fn();
const signOut = vi.fn();
const resetPasswordForEmail = vi.fn();
const fromMock = vi.fn();

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: () => getSession(),
      onAuthStateChange: (cb: unknown) => onAuthStateChange(cb),
      signInWithPassword: (args: unknown) => signInWithPassword(args),
      signUp: (args: unknown) => signUp(args),
      signOut: () => signOut(),
      resetPasswordForEmail: (...args: unknown[]) => resetPasswordForEmail(...args),
    },
    from: (table: string) => fromMock(table),
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSession.mockResolvedValue({ data: { session: null } });
    onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
  });

  it('démarre en isLoading puis bascule en non-authentifié', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
  });

  it('charge le profile quand une session existe', async () => {
    const session = { user: { id: 'u1', email: 'a@b.c' } };
    const profile = { id: 'u1', email: 'a@b.c', role: 'SUPER_ADMIN' };
    getSession.mockResolvedValue({ data: { session } });

    fromMock.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: profile, error: null }),
        }),
      }),
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.profile?.role).toBe('SUPER_ADMIN');
  });

  it('hasRole retourne true uniquement pour les rôles correspondants', async () => {
    const session = { user: { id: 'u1', email: 'a@b.c' } };
    getSession.mockResolvedValue({ data: { session } });
    fromMock.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({
              data: { id: 'u1', email: 'a@b.c', role: 'MALL_ADMIN' },
              error: null,
            }),
        }),
      }),
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.hasRole('MALL_ADMIN')).toBe(true);
    expect(result.current.hasRole('SUPER_ADMIN')).toBe(false);
    expect(result.current.hasRole('MALL_ADMIN', 'SUPER_ADMIN')).toBe(true);
  });

  it('signIn retourne une erreur si Supabase la renvoie', async () => {
    signInWithPassword.mockResolvedValue({ error: { message: 'Invalid creds' } });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const res = await act(() => result.current.signIn('a@b.c', 'wrong'));
    expect(res.error).toBe('Invalid creds');
  });

  it("signOut nettoie l'état local", async () => {
    signOut.mockResolvedValue({ error: null });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(() => result.current.signOut());
    expect(result.current.user).toBeNull();
    expect(result.current.profile).toBeNull();
  });
});
