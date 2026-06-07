import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContent } from '../../lib/content/SiteContentProvider';

/**
 * Masque une page publique désactivée depuis l'admin (cosmos.site_pages).
 * Tant que la table n'a pas chargé (ou si la page est inconnue), la page reste
 * visible — on ne redirige que si elle est explicitement marquée non visible.
 */
const PageVisibilityGate: React.FC<{ path: string; children: React.ReactNode }> = ({
  path,
  children,
}) => {
  const { isPathVisible } = useContent();
  if (!isPathVisible(path)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

export default PageVisibilityGate;
