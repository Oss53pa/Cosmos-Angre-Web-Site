import React from 'react';
import { Newspaper, Download, Camera, Mic, Calendar, Mail } from 'lucide-react';
import Seo from '../../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../../lib/seo/jsonLd';
import ProPageLayout, { type ProBenefit } from '../../../components/features/pro/ProPageLayout';
import { useEditableContent } from '../../../hooks/useEditableContent';
import galaEvent from '../../../assets/images/branding/gala-event.jpg';

const BENEFITS: ProBenefit[] = [
  { icon: Download, title: 'Press kit', description: "Logos vectoriels, photos HD, biographies, fiches techniques — téléchargement direct." },
  { icon: Camera, title: "Banque d'images", description: "Plus de 50 000 visuels haute définition libres d'utilisation pour la presse." },
  { icon: Calendar, title: 'Événements presse', description: 'Inaugurations, soirées privées, conférences : invitations dédiées aux journalistes.' },
  { icon: Mic, title: 'Interviews & expertise', description: 'Notre direction est disponible pour interviews, tables rondes et podcasts.' },
  { icon: Newspaper, title: 'Communiqués réguliers', description: 'Recevez nos news avant publication : ouvertures, partenariats, événements.' },
  { icon: Mail, title: 'Contact direct', description: 'Une attachée de presse dédiée pour vos demandes spécifiques.' },
];

const REASONS = [
  { title: 'Accès privilégié', description: 'Visites guidées, exclusivités, scoops réservés aux médias accrédités.' },
  { title: 'Réactivité 24h', description: 'Engagement de réponse sous 24h ouvrées à toute demande presse.' },
  { title: 'Contenus exclusifs', description: 'Vidéos, behind-the-scenes, témoignages clients pour vos sujets.' },
  { title: 'Réseau qualifié', description: 'Presse écrite, web, TV, radio, influenceurs — couverture multiplateforme.' },
];

const PressePage: React.FC = () => {
  const get = useEditableContent('pro-presse');

  const stats = [
    { value: get('stat1_value', '120+'), label: get('stat1_label', 'Articles de presse') },
    { value: get('stat2_value', '15'), label: get('stat2_label', 'Médias partenaires') },
    { value: get('stat3_value', '50K'), label: get('stat3_label', 'Photos & visuels HD') },
    { value: get('stat4_value', '24h'), label: get('stat4_label', 'Délai de réponse') },
  ];

  return (
    <>
      <Seo
        title="Espace Presse — Cosmos Angré"
        description="Press kit, photos HD, communiqués, interviews. L'espace presse officiel de Cosmos Angré pour journalistes et médias."
        keywords={['presse Cosmos Angré', 'communiqué presse', 'media kit Abidjan', 'photos HD centre commercial']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Professionnels', url: '/professionnels' },
          { name: 'Presse', url: '/professionnels/presse' },
        ])}
      />
      <ProPageLayout
        overline={get('overline', 'Espace presse')}
        title={get('title', 'Salle de presse Cosmos Angré')}
        subtitle={get(
          'subtitle',
          'Tous les outils dont vous avez besoin pour parler de Cosmos Angré : visuels, communiqués, interviews et accréditations.'
        )}
        heroImage={galaEvent}
        heroAlt="Événement presse Cosmos Angré"
        intro={get(
          'intro',
          'Une salle de presse complète, pensée pour faciliter votre travail de journaliste.'
        )}
        stats={stats}
        benefits={BENEFITS}
        reasons={REASONS}
        ctaTitle={get('cta_title', 'Une demande presse ?')}
        ctaDescription={get(
          'cta_description',
          'Notre attachée de presse vous répond sous 24 heures ouvrées.'
        )}
        ctaLabel={get('cta_label', 'Contacter le service presse')}
        ctaTo="/contact"
        contactEmail={get('cta_email', 'presse@cosmos-angre.com')}
      />
    </>
  );
};

export default PressePage;
