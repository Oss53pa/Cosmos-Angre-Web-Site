import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types/database';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

const Spinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-cosmos-night">
    <div
      role="status"
      aria-label="Chargement"
      className="w-8 h-8 border-2 border-cosmos-gold border-t-transparent rounded-full animate-spin"
    />
  </div>
);

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectTo = '/auth/login',
}) => {
  const { user, profile, isLoading, profileError } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  // Si on attend une vérification de rôle mais que le profil n'est pas chargé,
  // on bloque par défaut (fail-closed) au lieu de laisser passer.
  if (allowedRoles && !profile) {
    if (profileError) {
      return <Navigate to="/" replace />;
    }
    return <Spinner />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
