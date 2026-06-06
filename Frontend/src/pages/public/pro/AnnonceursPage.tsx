import React from 'react';
import { Megaphone, Eye, MousePointerClick, Calendar, Sparkles, Target } from 'lucide-react';
import Seo from '../../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../../lib/seo/jsonLd';
import ProPageLayout, { type ProBenefit } from '../../../components/features/pro/ProPageLayout';
import { useEditableContent } from '../../../hooks/useEditableContent';
import galleryEscalators from '../../../assets/images/branding/gallery-escalators.jpg';

const BENEFITS: ProBenefit[] = [
  { icon: Eye, title: 'Visibilité maximale', description: 'Écrans LED full HD aux points de passage stratégiques, totems digitaux et signalétique premium.' },
  { icon: MousePointerClick, title: 'Digital intégré', description: 'Sponsoring de pages, native ads dans le magazine, push notifications app fidélité.' },
  { icon: Calendar, title: 'Événementiel', description: "Animation de zone, pop-up store, distribution d'échantillons, conférences partenaires." },
  { icon: Target, title: 'Ciblage précis', description: 'Audience CSP+, segmentée par horaires, jours, et zones du centre.' },
  { icon: Sparkles, title: 'Création sur-mesure', description: 'Notre studio créatif conçoit vos visuels et campagnes adaptés au contexte Cosmos.' },
  { icon: Megaphone, title: 'Reporting transparent', description: "Métriques d'impressions, dwell-time, engagement et ROI livrés mensuellement." },
];

const REASONS = [
  { title: 'Audience premium', description: "Visiteurs urbains, familles aisées, expatriés et touristes d'affaires." },
  { title: 'Mix media puissant', description: 'OOH digital + print + événementiel + social media = 360° intégré.' },
  { title: 'Tarification flexible', description: 'Forfaits hebdomadaires, mensuels, saisonniers ou campagnes sur-mesure.' },
  { title: 'Production studio interne', description: "Pas besoin d'agence externe : nous concevons et diffusons." },
];

const STEPS = [
  { number: '01', title: 'Brief & objectifs', description: 'Cadrage de votre besoin (notoriété, trafic, conversion, lancement).' },
  { number: '02', title: 'Plan media', description: 'Recommandation de supports + dates + ciblage + budget.' },
  { number: '03', title: 'Création', description: 'Visuels, vidéos, copy adaptés à chaque support.' },
  { number: '04', title: 'Diffusion & reporting', description: 'Lancement de la campagne et analytics post-campagne.' },
];

const AnnonceursPage: React.FC = () => {
  const get = useEditableContent('pro-annonceurs');

  const stats = [
    { value: get('stat1_value', '2M+'), label: get('stat1_label', 'Visiteurs annuels') },
    { value: get('stat2_value', '12'), label: get('stat2_label', 'Écrans LED stratégiques') },
    { value: get('stat3_value', '15K+'), label: get('stat3_label', 'Abonnés newsletter') },
    { value: get('stat4_value', '85%'), label: get('stat4_label', 'Notoriété locale') },
  ];

  return (
    <>
      <Seo
        title="Espaces publicitaires — Annoncez à Cosmos Angré"
        description="LED, totems digitaux, native ads, événementiel : touchez 2M+ visiteurs CSP+ à Cocody-Angré. Solutions publicitaires premium et sur-mesure."
        keywords={['publicité centre commercial Abidjan', 'écrans LED Cocody', 'OOH premium', "media planning Côte d'Ivoire"]}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Professionnels', url: '/professionnels' },
          { name: 'Espaces publicitaires', url: '/professionnels/annonceurs' },
        ])}
      />
      <ProPageLayout
        overline={get('overline', 'Professionnels')}
        title={get('title', 'Espaces publicitaires premium')}
        subtitle={get(
          'subtitle',
          'Donnez de la visibilité à votre marque au cœur de Cosmos Angré, sur des supports physiques et digitaux à fort impact.'
        )}
        heroImage={galleryEscalators}
        heroAlt="Galerie marchande Cosmos Angré"
        intro={get(
          'intro',
          'Une plateforme média intégrée, du LED HD au digital ciblé, pour atteindre une audience premium qualifiée.'
        )}
        stats={stats}
        benefits={BENEFITS}
        reasons={REASONS}
        steps={STEPS}
        ctaTitle={get('cta_title', 'Lançons votre campagne')}
        ctaDescription={get('cta_description', 'Recevez notre media kit et nos tarifs sous 48 heures.')}
        ctaLabel={get('cta_label', 'Demander le media kit')}
        ctaTo="/contact"
        contactEmail={get('cta_email', 'advertising@cosmos-angre.com')}
      />
    </>
  );
};

export default AnnonceursPage;
