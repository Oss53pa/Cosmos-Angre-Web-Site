import React from 'react';
import { Store, TrendingUp, Users, Award, Headphones, BarChart3 } from 'lucide-react';
import Seo from '../../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../../lib/seo/jsonLd';
import ProPageLayout, { type ProBenefit } from '../../../components/features/pro/ProPageLayout';
import { useEditableContent } from '../../../hooks/useEditableContent';
import luxuryBoutique from '../../../assets/images/branding/luxury-boutique.jpg';

// Bénéfices, raisons et étapes restent codés ici car structurels.
// Hero / Stats / CTA sont éditables depuis /admin/contenu (page "Pro — Devenir enseigne").
const BENEFITS: ProBenefit[] = [
  { icon: TrendingUp, title: 'Trafic qualifié', description: 'Une clientèle premium et internationale, cœur de cible Cocody-Angré.' },
  { icon: Users, title: 'Communauté fidèle', description: 'Un programme de fidélité actif et une newsletter à forte audience.' },
  { icon: Award, title: 'Cadre prestigieux', description: 'Architecture EDGE Advanced, finitions premium, ambiance signature.' },
  { icon: Headphones, title: 'Accompagnement dédié', description: 'Un account manager pour faciliter votre installation et votre opération.' },
  { icon: BarChart3, title: 'Analytics intégrés', description: 'Tableau de bord en temps réel : trafic, conversions, KPI clés.' },
  { icon: Store, title: 'Vitrine 360°', description: 'Boutique physique + page dédiée site + relais réseaux sociaux.' },
];

const STEPS = [
  { number: '01', title: 'Prise de contact', description: 'Soumettez votre dossier via notre formulaire ou contact direct.' },
  { number: '02', title: 'Étude & visite', description: 'Présentation des espaces disponibles, étude de votre concept.' },
  { number: '03', title: 'Contractualisation', description: 'Bail commercial sur-mesure, accompagnement juridique.' },
  { number: '04', title: 'Aménagement', description: 'Installation, formation, lancement officiel et communication.' },
];

const REASONS = [
  { title: 'Localisation stratégique', description: 'Au cœur de Cocody-Angré, accessible depuis tout Abidjan.' },
  { title: 'Mix tenant unique', description: "Sélection d'enseignes complémentaires, pas de concurrence directe." },
  { title: 'Marketing partagé', description: 'Campagnes mensuelles, événementiel, presse, relayés sur tous les canaux.' },
  { title: 'Services premium', description: 'Conciergerie, parking, sécurité 24/7, climatisation, Wi-Fi gratuit.' },
];

const DevenirEnseignePage: React.FC = () => {
  const get = useEditableContent('pro-devenir-enseigne');

  const stats = [
    { value: get('stat1_value', '17 400 m²'), label: get('stat1_label', 'Surface totale') },
    { value: get('stat2_value', '80+'), label: get('stat2_label', 'Enseignes') },
    { value: get('stat3_value', '2M+'), label: get('stat3_label', 'Visiteurs/an') },
    { value: get('stat4_value', '500'), label: get('stat4_label', 'Places de parking') },
  ];

  return (
    <>
      <Seo
        title="Devenir enseigne — Espaces commerciaux disponibles"
        description="Implantez votre marque à Cosmos Angré : 80+ enseignes, 2M+ visiteurs/an, accompagnement dédié pour développer votre business à Cocody-Angré."
        keywords={['louer boutique Abidjan', 'centre commercial Cocody', 'devenir enseigne', 'bail commercial Angré', 'franchise Cosmos']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Professionnels', url: '/professionnels' },
          { name: 'Devenir enseigne', url: '/professionnels/devenir-enseigne' },
        ])}
      />
      <ProPageLayout
        overline={get('overline', 'Professionnels')}
        title={get('title', 'Devenir enseigne à Cosmos Angré')}
        subtitle={get(
          'subtitle',
          'Rejoignez la destination shopping premium de Cocody-Angré et développez votre marque dans un cadre exceptionnel.'
        )}
        heroImage={luxuryBoutique}
        heroAlt="Espace commercial Cosmos Angré"
        intro={get(
          'intro',
          "Plus qu'une simple location, une plateforme commerciale complète conçue pour faire grandir votre marque."
        )}
        stats={stats}
        benefits={BENEFITS}
        reasons={REASONS}
        steps={STEPS}
        ctaTitle={get('cta_title', 'Implantez votre enseigne')}
        ctaDescription={get('cta_description', 'Notre équipe Leasing étudie votre dossier sous 7 jours.')}
        ctaLabel={get('cta_label', 'Demander un dossier')}
        ctaTo="/contact"
        contactEmail={get('cta_email', 'leasing@cosmos-angre.com')}
      />
    </>
  );
};

export default DevenirEnseignePage;
