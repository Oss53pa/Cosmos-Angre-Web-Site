import React from 'react';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';

const ConfidentialitePage: React.FC = () => (
  <main className="bg-cosmos-warm min-h-screen">
    <Seo
      title="Politique de confidentialité"
      description="Politique de confidentialité Cosmos Angré : données personnelles, cookies, droits RGPD."
      jsonLd={breadcrumbJsonLd([
        { name: 'Accueil', url: '/' },
        { name: 'Confidentialité', url: '/confidentialite' },
      ])}
    />

    <article className="max-w-3xl mx-auto px-6 py-24 prose prose-lg font-inter font-light text-text-primary">
      <h1 className="font-cormorant text-4xl md:text-5xl font-light mb-2 text-cosmos-night">
        Politique de confidentialité
      </h1>
      <p className="text-sm text-text-secondary mb-12">Dernière mise à jour : 1ᵉʳ avril 2026</p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">1. Responsable du traitement</h2>
      <p>
        New Heaven SA, exploitante de Cosmos Angré, est responsable du traitement des données personnelles collectées
        sur ce site, conformément au RGPD et à la loi ivoirienne n° 2013-450 sur la protection des données à caractère
        personnel.
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">2. Données collectées</h2>
      <ul>
        <li>
          <strong>Compte utilisateur</strong> : email, prénom, nom, téléphone (optionnel), rôle.
        </li>
        <li>
          <strong>Formulaire contact</strong> : nom, email, téléphone (optionnel), sujet, message.
        </li>
        <li>
          <strong>Newsletter</strong> : email, prénom (optionnel), source d'inscription.
        </li>
        <li>
          <strong>Mesure d'audience</strong> : aucune donnée personnelle. Plausible Analytics fonctionne sans cookies et
          n'enregistre que des statistiques agrégées (pages vues, navigateur, pays).
        </li>
      </ul>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">3. Finalités</h2>
      <ul>
        <li>Gestion du compte et accès aux fonctionnalités réservées.</li>
        <li>Réponse à vos demandes de contact.</li>
        <li>Envoi d'informations commerciales (newsletter, avec consentement).</li>
        <li>Mesure de fréquentation anonymisée, sécurité, prévention de la fraude.</li>
      </ul>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">4. Base légale</h2>
      <p>
        Selon le traitement : <em>exécution du contrat</em> (compte utilisateur), <em>consentement</em> (newsletter,
        cookies analytiques), <em>intérêt légitime</em> (sécurité, prévention de fraude), <em>obligation légale</em>{' '}
        (conservation comptable).
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">5. Durée de conservation</h2>
      <ul>
        <li>Compte actif : durée de vie du compte + 3 ans après dernière connexion.</li>
        <li>Messages contact : 3 ans après le dernier échange.</li>
        <li>Newsletter : jusqu'à désinscription.</li>
        <li>Logs de sécurité : 12 mois.</li>
      </ul>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">6. Destinataires</h2>
      <p>
        Vos données sont traitées par les équipes habilitées de New Heaven SA et nos sous-traitants techniques :
        Supabase (hébergement BDD/auth), Vercel (hébergement web), Resend (envoi d'emails), Sentry (monitoring
        d'erreurs), Plausible (analytics anonymisée). Aucune donnée n'est vendue.
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">7. Transferts hors UE</h2>
      <p>
        Certains sous-traitants étant situés hors UE, les transferts sont encadrés par les Clauses Contractuelles Types
        de la Commission Européenne ou par décisions d'adéquation.
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">8. Vos droits</h2>
      <p>
        Vous disposez d'un droit d'accès, de rectification, d'effacement, d'opposition, de limitation, de portabilité,
        et de définir des directives post-mortem. Pour exercer ces droits, écrivez à{' '}
        <a href="mailto:dpo@cosmos-angre.com" className="underline">
          dpo@cosmos-angre.com
        </a>
        . Réponse sous 30 jours maximum.
      </p>
      <p>
        Vous pouvez également déposer une réclamation auprès de l'<strong>ARTCI</strong> (Autorité de Régulation des
        Télécommunications de Côte d'Ivoire) ou, si vous résidez dans l'UE, auprès de votre autorité nationale (CNIL en
        France).
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">9. Cookies &amp; mesure d'audience</h2>
      <p>
        Nous utilisons <strong>Plausible Analytics</strong>, une solution sans cookies, qui n'identifie pas les
        visiteurs et ne croise aucune donnée. Aucun cookie tiers (Google, Facebook, etc.) n'est posé sans votre
        consentement explicite.
      </p>
      <p>
        Cookies techniques strictement nécessaires : authentification (Supabase), préférences de langue/thème
        (localStorage). Aucun cookie publicitaire.
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">10. Sécurité</h2>
      <p>
        Communications chiffrées TLS 1.2+, authentification PKCE, Row-Level Security en base, mots de passe hachés
        (bcrypt). Audits réguliers et monitoring 24/7.
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">11. Contact DPO</h2>
      <p>
        Délégué à la protection des données :{' '}
        <a href="mailto:dpo@cosmos-angre.com" className="underline">
          dpo@cosmos-angre.com
        </a>
      </p>
    </article>
  </main>
);

export default ConfidentialitePage;
