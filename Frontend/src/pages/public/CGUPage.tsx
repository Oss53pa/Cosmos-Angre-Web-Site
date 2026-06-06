import React from 'react';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';

const CGUPage: React.FC = () => (
  <main className="bg-cosmos-warm min-h-screen">
    <Seo
      title="Conditions Générales d'Utilisation"
      description="CGU du site Cosmos Angré : règles d'utilisation, comptes, contenus, responsabilités."
      jsonLd={breadcrumbJsonLd([
        { name: 'Accueil', url: '/' },
        { name: 'CGU', url: '/cgu' },
      ])}
    />
    <article className="max-w-3xl mx-auto px-6 py-24 prose prose-lg font-inter font-light text-text-primary">
      <h1 className="font-cormorant text-4xl md:text-5xl font-light mb-2 text-cosmos-night">
        Conditions Générales d'Utilisation
      </h1>
      <p className="text-sm text-text-secondary mb-12">Dernière mise à jour : 1ᵉʳ avril 2026</p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">1. Objet</h2>
      <p>
        Les présentes CGU régissent l'utilisation du site cosmos-angre.com et de ses services associés. En accédant au
        site, vous acceptez sans réserve les présentes conditions.
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">2. Accès au service</h2>
      <p>
        Le site est accessible 24h/24, 7j/7, sauf interruptions pour maintenance ou cas de force majeure. New Heaven SA
        ne saurait être tenue responsable d'une indisponibilité temporaire.
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">3. Création de compte</h2>
      <p>
        L'inscription est gratuite et requiert un email valide. Vous êtes responsable de la confidentialité de vos
        identifiants. New Heaven SA se réserve le droit de suspendre tout compte en cas de non-respect des CGU.
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">4. Contenu utilisateur</h2>
      <p>
        En publiant du contenu (avis, photos, messages enseigne), vous garantissez en détenir les droits et accordez à
        Cosmos Angré une licence non exclusive, gratuite, mondiale, pour les diffuser dans le cadre du service.
      </p>
      <p>Sont strictement interdits :</p>
      <ul>
        <li>Tout contenu illégal, injurieux, discriminatoire, diffamatoire, ou portant atteinte à la vie privée.</li>
        <li>L'usurpation d'identité, le spam, l'envoi de logiciels malveillants.</li>
        <li>Toute tentative d'accès non autorisé, scraping massif, ou contournement de sécurité.</li>
      </ul>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">5. Responsabilité</h2>
      <p>
        Les informations publiées (horaires, événements, promotions des enseignes) sont fournies à titre indicatif. Les
        conditions définitives relèvent des partenaires concernés. New Heaven SA ne saurait être tenue responsable de
        décisions prises sur la seule base du site.
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">6. Liens externes</h2>
      <p>
        Le site peut contenir des liens vers des sites tiers. New Heaven SA n'exerce aucun contrôle sur ces sites et
        décline toute responsabilité quant à leur contenu.
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">7. Propriété intellectuelle</h2>
      <p>
        Voir <a href="/mentions-legales" className="underline">mentions légales</a>.
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">8. Données personnelles</h2>
      <p>
        Voir <a href="/confidentialite" className="underline">politique de confidentialité</a>.
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">9. Modification des CGU</h2>
      <p>
        New Heaven SA peut modifier les CGU à tout moment. La version applicable est celle en vigueur au moment de votre
        connexion. En cas de modification substantielle, un avis sera affiché.
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">10. Droit applicable</h2>
      <p>
        Les présentes CGU sont soumises au droit ivoirien. Tout litige sera de la compétence exclusive des tribunaux
        d'Abidjan, sauf disposition légale impérative contraire.
      </p>
    </article>
  </main>
);

export default CGUPage;
