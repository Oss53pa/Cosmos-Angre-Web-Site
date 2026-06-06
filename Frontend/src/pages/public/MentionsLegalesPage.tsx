import React from 'react';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';

const MentionsLegalesPage: React.FC = () => (
  <main className="bg-cosmos-warm min-h-screen">
    <Seo
      title="Mentions légales"
      description="Mentions légales du site Cosmos Angré : éditeur, hébergeur, propriété intellectuelle."
      jsonLd={breadcrumbJsonLd([
        { name: 'Accueil', url: '/' },
        { name: 'Mentions légales', url: '/mentions-legales' },
      ])}
    />

    <article className="max-w-3xl mx-auto px-6 py-24 prose prose-lg font-inter font-light text-text-primary">
      <h1 className="font-cormorant text-4xl md:text-5xl font-light mb-2 text-cosmos-night">Mentions légales</h1>
      <p className="text-sm text-text-secondary mb-12">Dernière mise à jour : 1ᵉʳ avril 2026</p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">Éditeur</h2>
      {/*
        TODO[legal]: avant mise en ligne — vérifier auprès du service juridique :
        - Numéro RCCM officiel (format Abidjan-CI-AAA-NNNN-NNNNN)
        - Forme juridique exacte (SA / SARL / autre) et capital social
        - Numéro CC (compte contribuable)
        Pour l'instant : valeurs placeholder, à remplacer par les valeurs officielles.
      */}
      <p>
        <strong>New Heaven SA</strong>
        <br />
        Boulevard Mitterrand, Cocody-Angré
        <br />
        08 BP, Abidjan, Côte d'Ivoire
        <br />
        RCCM : <em>(à compléter par le service juridique)</em>
        <br />
        Tél. : +225 27 22 00 00 00
        <br />
        Email :{' '}
        <a href="mailto:contact@cosmos-angre.com" className="underline">
          contact@cosmos-angre.com
        </a>
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">Directeur de la publication</h2>
      <p>Le directeur de la publication est le représentant légal de New Heaven SA.</p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">Hébergement</h2>
      <p>
        <strong>Vercel Inc.</strong>
        <br />
        340 S Lemon Ave #4133, Walnut, CA 91789, USA
        <br />
        <a href="https://vercel.com" className="underline" target="_blank" rel="noopener noreferrer">
          vercel.com
        </a>
      </p>
      <p>
        <strong>Supabase Inc.</strong> (BaaS, base de données, authentification)
        <br />
        970 Toa Payoh North #07-04, Singapore
        <br />
        <a href="https://supabase.com" className="underline" target="_blank" rel="noopener noreferrer">
          supabase.com
        </a>
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">Propriété intellectuelle</h2>
      <p>
        L'ensemble du contenu de ce site (textes, images, vidéos, logos, charte graphique, code source) est la propriété
        exclusive de New Heaven SA ou de ses partenaires. Toute reproduction, représentation, modification, publication,
        adaptation, totale ou partielle, est interdite sauf autorisation écrite préalable.
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">Crédits</h2>
      <p>
        Conception &amp; développement : Pratium Tech
        <br />
        Photographies : © New Heaven SA / partenaires identifiés
        <br />
        Typographies : Cormorant Garamond &amp; Inter (open source — SIL Open Font License)
      </p>

      <h2 className="font-cormorant text-2xl mt-12 mb-4">Contact</h2>
      <p>
        Pour toute question relative à ces mentions, écrire à{' '}
        <a href="mailto:contact@cosmos-angre.com" className="underline">
          contact@cosmos-angre.com
        </a>
        .
      </p>
    </article>
  </main>
);

export default MentionsLegalesPage;
