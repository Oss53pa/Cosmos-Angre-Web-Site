import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import type { Profile } from '../../types/database';

// Mock du hook useAuth
const useAuthMock = vi.fn();
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => useAuthMock(),
}));

const renderProtected = (allowedRoles?: string[]) =>
  render(
    <MemoryRouter initialEntries={['/private']}>
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={allowedRoles as never} />}>
          <Route path="/private" element={<div>SECRET</div>} />
        </Route>
        <Route path="/" element={<div>HOME</div>} />
        <Route path="/auth/login" element={<div>LOGIN</div>} />
      </Routes>
    </MemoryRouter>
  );

const profile = (role: Profile['role']): Profile => ({
  id: 'u1',
  email: 'a@b.c',
  first_name: null,
  last_name: null,
  phone: null,
  role,
  avatar: null,
  store_id: null,
  created_at: '',
  updated_at: '',
});

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthMock.mockReset();
  });

  it('affiche un spinner pendant le chargement', () => {
    useAuthMock.mockReturnValue({ user: null, profile: null, isLoading: true, profileError: null });
    renderProtected();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('redirige vers /auth/login si user absent', () => {
    useAuthMock.mockReturnValue({
      user: null,
      profile: null,
      isLoading: false,
      profileError: null,
    });
    renderProtected();
    expect(screen.getByText('LOGIN')).toBeInTheDocument();
  });

  it('rend le contenu si user + rôle autorisé', () => {
    useAuthMock.mockReturnValue({
      user: { id: 'u1' },
      profile: profile('SUPER_ADMIN'),
      isLoading: false,
      profileError: null,
    });
    renderProtected(['SUPER_ADMIN']);
    expect(screen.getByText('SECRET')).toBeInTheDocument();
  });

  it('redirige vers / si rôle non autorisé', () => {
    useAuthMock.mockReturnValue({
      user: { id: 'u1' },
      profile: profile('VISITOR'),
      isLoading: false,
      profileError: null,
    });
    renderProtected(['SUPER_ADMIN']);
    expect(screen.getByText('HOME')).toBeInTheDocument();
  });

  it('attend (fail-closed) si user présent mais profile pas encore chargé', () => {
    useAuthMock.mockReturnValue({
      user: { id: 'u1' },
      profile: null,
      isLoading: false,
      profileError: null,
    });
    renderProtected(['SUPER_ADMIN']);
    // Pas de "SECRET" exposé tant que le profile n'est pas vérifié
    expect(screen.queryByText('SECRET')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('redirige vers / si profile errored (fail-closed)', () => {
    useAuthMock.mockReturnValue({
      user: { id: 'u1' },
      profile: null,
      isLoading: false,
      profileError: 'fetch failed',
    });
    renderProtected(['SUPER_ADMIN']);
    expect(screen.getByText('HOME')).toBeInTheDocument();
  });
});
