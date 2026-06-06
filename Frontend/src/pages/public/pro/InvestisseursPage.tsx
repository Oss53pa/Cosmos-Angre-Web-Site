import React from 'react';
import { TrendingUp, Building2, Award, Globe, ShieldCheck, PieChart } from 'lucide-react';
import Seo from '../../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../../lib/seo/jsonLd';
import ProPageLayout, { type ProBenefit } from '../../../components/features/pro/ProPageLayout';
import { useEditableContent } from '../../../hooks/useEditableContent';
import edgeBuilding from '../../../assets/images/branding/edge-building.jpg';

const BENEFITS: ProBenefit[] = [
  { icon: TrendingUp, title: 'Performance financière', description: "Croissance soutenue du chiffre d'affaires des enseignes, taux de remplissage stable." },
  { icon: Building2, title: 'Actif tangible premium', description: '17 400 m² de surface commerciale + hôtel intégré, dans une zone à forte valorisation.' },
  { icon: Globe, title: 'Marché en croissance', description: "Cocody-Angré : démographie jeune, pouvoir d'achat en hausse, internationalisation." },
  { icon: ShieldCheck, title: 'Gouvernance robuste', description: 'Reporting trimestriel transparent, audit Big 4, conformité ARTCI.' },
  { icon: Award, title: 'Certifications durables', description: 'EDGE Advanced (IFC) — efficacité énergétique, eau, matériaux.' },
  { icon: PieChart, title: 'Diversification revenus', description: 'Loyers commerciaux + hôtel + bureaux + événementiel = mix résilient.' },
];

const REASONS = [
  { title: 'Marché ivoirien dynamique', description: 'Croissance PIB 6%+, urbanisation rapide, consommation premium en explosion.' },
  { title: 'Asset class défensive', description: "L'immobilier commercial premium offre yield stable et plus-value long terme." },
  { title: 'Équipe expérimentée', description: "Direction avec 20+ ans d'expérience retail Afrique de l'Ouest." },
  { title: 'ESG-ready', description: 'Stratégie alignée Objectifs Développement Durable, reporting GRI.' },
];

const STEPS = [
  { number: '01', title: 'NDA & data room', description: 'Signature confidentialité, accès aux documents financiers.' },
  { number: '02', title: 'Due diligence', description: 'Analyse complète : finance, juridique, ESG, opérationnel.' },
  { number: '03', title: 'Term sheet', description: 'Négociation des modalités, valorisation, gouvernance.' },
  { number: '04', title: 'Closing', description: 'Signature finale et intégration au capital.' },
];

const InvestisseursPage: React.FC = () => {
  const get = useEditableContent('pro-investisseurs');

  const stats = [
    { value: get('stat1_value', '+18%'), label: get('stat1_label', 'Croissance annuelle') },
    { value: get('stat2_value', 'EDGE'), label: get('stat2_label', 'Certification durable') },
    { value: get('stat3_value', 'AAA'), label: get('stat3_label', 'Notation crédit') },
    { value: get('stat4_value', '92%'), label: get('stat4_label', "Taux d'occupation") },
  ];

  return (
    <>
      <Seo
        title="Investisseurs — Opportunités à Cosmos Angré"
        description="Cosmos Angré : actif immobilier premium en Côte d'Ivoire. Performance, durabilité, gouvernance. Contactez notre équipe Relations Investisseurs."
        keywords={["investir Côte d'Ivoire", 'immobilier commercial Abidjan', 'investissement EDGE', 'opportunité Cocody-Angré']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Professionnels', url: '/professionnels' },
          { name: 'Investisseurs', url: '/professionnels/investisseurs' },
        ])}
      />
      <ProPageLayout
        overline={get('overline', 'Relations investisseurs')}
        title={get('title', 'Investir dans Cosmos Angré')}
        subtitle={get(
          'subtitle',
          'Un actif immobilier commercial premium, dans un marché ouest-africain en pleine croissance, certifié EDGE.'
        )}
        heroImage={edgeBuilding}
        heroAlt="Bâtiment Cosmos Angré certifié EDGE"
        intro={get(
          'intro',
          "Une opportunité d'investissement responsable, alliant performance financière et impact environnemental positif."
        )}
        stats={stats}
        benefits={BENEFITS}
        reasons={REASONS}
        steps={STEPS}
        ctaTitle={get('cta_title', 'Découvrez le dossier complet')}
        ctaDescription={get(
          'cta_description',
          'Notre équipe Relations Investisseurs vous accompagne en toute confidentialité.'
        )}
        ctaLabel={get('cta_label', 'Demander la data room')}
        ctaTo="/contact"
        contactEmail={get('cta_email', 'investors@cosmos-angre.com')}
      />
    </>
  );
};

export default InvestisseursPage;
