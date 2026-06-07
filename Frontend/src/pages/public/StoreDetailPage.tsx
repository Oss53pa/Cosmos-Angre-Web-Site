import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

/**
 * La fiche enseigne est désormais un MODAL sur l'annuaire (/boutiques), pas une
 * page dédiée. On conserve l'URL /boutiques/:id (liens partagés / SEO) en
 * redirigeant vers l'annuaire avec ouverture automatique du modal via ?store=.
 */
const StoreDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/boutiques?store=${encodeURIComponent(id ?? '')}`} replace />;
};

export default StoreDetailPage;
