import React, { useMemo, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Clock, Share2, Check, Copy } from 'lucide-react';
import OptimizedImage from '../../components/common/OptimizedImage';
import Seo from '../../lib/seo/Seo';
import { articleJsonLd, breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import galleryInterior from '../../assets/images/branding/gallery-interior.jpg';
import artisanMarket from '../../assets/images/branding/artisan-market.jpg';
import familyLifestyle from '../../assets/images/branding/family-lifestyle.jpg';

const ARTICLES = [
  {
    slug: 'ouverture-cosmos-angre',
    title: 'Ouverture prochaine de Cosmos Angr\u00e9',
    date: '15 Nov 2025',
    author: '\u00c9quipe Cosmos',
    category: 'Actualit\u00e9s',
    image: galleryInterior,
    paragraphs: [
      'Cosmos Angr\u00e9, le plus grand complexe commercial et de loisirs de C\u00f4te d\u2019Ivoire, ouvrira bient\u00f4t ses portes \u00e0 Cocody-Angr\u00e9. Avec plus de 17 400 m\u00b2 de surface, ce lieu d\u2019exception accueillera plus de 55 enseignes, des restaurants gastronomiques, un cin\u00e9ma derni\u00e8re g\u00e9n\u00e9ration, un h\u00f4tel premium et bien plus encore.',
      'Con\u00e7u pour offrir une exp\u00e9rience in\u00e9gal\u00e9e, Cosmos Angr\u00e9 est certifi\u00e9 EDGE Advanced, t\u00e9moignant de son engagement envers le d\u00e9veloppement durable. Chaque d\u00e9tail a \u00e9t\u00e9 pens\u00e9 pour cr\u00e9er un lieu o\u00f9 se m\u00ealent \u00e9l\u00e9gance, confort et innovation.',
      'La galerie commerciale, v\u00e9ritable colonne vert\u00e9brale du complexe, accueillera des marques internationales et locales soigneusement s\u00e9lectionn\u00e9es. Du pr\u00eat-\u00e0-porter de luxe aux cr\u00e9ateurs ivoiriens \u00e9mergents, chaque boutique a \u00e9t\u00e9 pens\u00e9e comme une destination \u00e0 part enti\u00e8re.',
      'Le Food Court, au c\u0153ur du complexe, proposera une offre culinaire vari\u00e9e : cuisine ivoirienne contemporaine, gastronomie asiatique, brasserie parisienne et bien plus. Chaque restaurant a \u00e9t\u00e9 con\u00e7u comme un univers sensoriel unique.',
      'Rejoignez-nous pour d\u00e9couvrir un monde \u00e0 part. L\u2019inauguration sera un \u00e9v\u00e9nement exceptionnel, avec des surprises, des spectacles et des offres exclusives pour les premiers visiteurs.',
    ],
  },
  {
    slug: 'artisans-locaux',
    title: 'Les artisans locaux \u00e0 l\u2019honneur',
    date: '10 Nov 2025',
    author: '\u00c9quipe Cosmos',
    category: 'Culture',
    image: artisanMarket,
    paragraphs: [
      'Le March\u00e9 Artisanal de Cosmos Angr\u00e9 met en lumi\u00e8re le savoir-faire ivoirien et africain. Artisans, cr\u00e9ateurs et designers locaux y pr\u00e9sentent leurs \u0153uvres dans un \u00e9crin premium.',
      'Des textiles traditionnels aux bijoux contemporains, en passant par la maroquinerie et l\u2019art d\u00e9coratif, chaque pi\u00e8ce raconte une histoire. C\u2019est un voyage au c\u0153ur de la cr\u00e9ativit\u00e9 africaine.',
      'Nous avons s\u00e9lectionn\u00e9 chaque artisan pour la qualit\u00e9 de son travail, l\u2019originalit\u00e9 de ses cr\u00e9ations et son engagement envers des pratiques durables. Le march\u00e9 n\u2019est pas un simple espace de vente \u2014 c\u2019est une c\u00e9l\u00e9bration du talent local.',
      'Des ateliers d\u00e9couverte seront organis\u00e9s r\u00e9guli\u00e8rement, permettant aux visiteurs de s\u2019initier aux techniques artisanales : tissage du pagne, travail du cuir, cr\u00e9ation de bijoux en perles de verre.',
      'Venez d\u00e9couvrir ces talents exceptionnels et repartez avec des pi\u00e8ces uniques, charg\u00e9es de sens et d\u2019authenticit\u00e9.',
    ],
  },
  {
    slug: 'destination-famille',
    title: 'Une destination pour toute la famille',
    date: '5 Nov 2025',
    author: '\u00c9quipe Cosmos',
    category: 'Lifestyle',
    image: familyLifestyle,
    paragraphs: [
      'Cosmos Angr\u00e9 a \u00e9t\u00e9 con\u00e7u pour que chaque membre de la famille y trouve son bonheur. Les enfants profitent d\u2019espaces de jeux s\u00e9curis\u00e9s et d\u2019ateliers cr\u00e9atifs, tandis que les parents explorent les boutiques et les restaurants.',
      'Le cin\u00e9ma propose une programmation vari\u00e9e, l\u2019entertainment zone offre bowling et r\u00e9alit\u00e9 virtuelle, et le food court satisfait toutes les envies culinaires.',
      'Pour les plus jeunes, un espace Kids Club avec animateurs professionnels permet aux parents de profiter du centre en toute s\u00e9r\u00e9nit\u00e9. Ateliers de dessin, jeux \u00e9ducatifs et activit\u00e9s ludiques sont au programme chaque week-end.',
      'Les espaces de bien-\u00eatre ne sont pas en reste : spa, salon de coiffure, espace fitness \u2014 chaque visiteur peut s\u2019accorder un moment de d\u00e9tente dans un cadre premium.',
      'Une journ\u00e9e ne suffit pas pour tout d\u00e9couvrir \u2014 c\u2019est la promesse d\u2019une exp\u00e9rience renouvel\u00e9e \u00e0 chaque visite.',
    ],
  },
];

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [linkCopied, setLinkCopied] = useState(false);

  const article = useMemo(() => ARTICLES.find(a => a.slug === slug), [slug]);
  const relatedArticles = useMemo(
    () => ARTICLES.filter(a => a.slug !== slug).slice(0, 2),
    [slug]
  );

  const readingTime = useMemo(() => {
    if (!article) return 0;
    const words = article.paragraphs.join(' ').split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  }, [article]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-cosmos-night flex items-center justify-center">
        <Seo title="Article introuvable" noindex />
        <div className="text-center px-6">
          <h1 className="font-cormorant text-3xl text-cosmos-cream font-light mb-4">Article introuvable</h1>
          <Link to="/blog" className="btn-primary">Retour au journal</Link>
        </div>
      </div>
    );
  }

  const articleExcerpt = article.paragraphs[0]?.slice(0, 160) ?? '';

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title={article.title}
        description={articleExcerpt}
        image={article.image}
        type="article"
        author={article.author}
        keywords={[article.category, 'blog Cosmos', 'magazine Abidjan']}
        jsonLd={[
          breadcrumbJsonLd([
            { name: 'Accueil', url: '/' },
            { name: 'Magazine', url: '/blog' },
            { name: article.title, url: `/blog/${article.slug}` },
          ]),
          articleJsonLd({
            title: article.title,
            slug: article.slug,
            excerpt: articleExcerpt,
            featured_image: article.image,
            author_name: article.author,
            publish_date: article.date,
            category: article.category,
          }),
        ]}
      />
      {/* Hero */}
      <section className="relative h-[55vh] md:h-[60vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 animate-ken-burns">
          <OptimizedImage src={article.image} alt={article.title} containerClassName="w-full h-full" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-cosmos-night via-cosmos-night/60 to-cosmos-night/20" />

        <div className="container-cosmos relative z-10 pb-12 md:pb-16">
          <Link to="/blog" className="inline-flex items-center gap-2 text-cosmos-cream/60 hover:text-cosmos-cream font-inter text-xs mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> Retour au journal
          </Link>
          <span className="overline block mb-3">{article.category}</span>
          <h1 className="font-cormorant text-4xl md:text-6xl lg:text-7xl text-cosmos-cream font-light leading-[1.1] mb-6">
            {article.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-xs text-cosmos-cream/60 font-inter font-light">
            <span className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
              {article.date}
            </span>
            <span className="flex items-center gap-2">
              <User className="w-3.5 h-3.5" strokeWidth={1.5} />
              {article.author}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" strokeWidth={1.5} />
              {readingTime} min de lecture
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-cosmos-warm">
        <div className="container-cosmos max-w-3xl">
          <div className="divider-gold-center mb-12" />

          <article className="card p-8 md:p-12">
            {article.paragraphs.map((paragraph, i) => (
              <p
                key={i}
                className={`text-base text-cosmos-night/80 font-inter font-light leading-[1.9] mb-6 last:mb-0 ${
                  i === 0 ? 'first-letter:text-4xl first-letter:font-cormorant first-letter:font-light first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-cosmos-night' : ''
                }`}
              >
                {paragraph}
              </p>
            ))}
          </article>

          {/* Share */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <span className="text-[10px] uppercase tracking-[0.15em] text-cosmos-night/40 font-inter font-medium">
              Partager
            </span>
            <button
              onClick={handleCopyLink}
              className="w-9 h-9 border border-cosmos-night/10 rounded-full flex items-center justify-center text-cosmos-night/40 hover:border-cosmos-gold hover:text-cosmos-gold transition-all"
              aria-label="Copier le lien"
            >
              {linkCopied ? <Check className="w-4 h-4" strokeWidth={1.5} /> : <Copy className="w-4 h-4" strokeWidth={1.5} />}
            </button>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-cosmos-night/10 rounded-full flex items-center justify-center text-cosmos-night/40 hover:border-cosmos-gold hover:text-cosmos-gold transition-all"
              aria-label="Partager sur X"
            >
              <Share2 className="w-4 h-4" strokeWidth={1.5} />
            </a>
          </div>

          {/* Back */}
          <div className="mt-12 text-center">
            <Link to="/blog" className="btn-secondary">
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> Tous les articles
            </Link>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-cosmos-cream">
          <div className="container-cosmos">
            <div className="text-center mb-12">
              <span className="overline mb-3 block">\u00c0 lire aussi</span>
              <h2 className="section-title">Articles similaires</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedArticles.map((related) => (
                <Link key={related.slug} to={`/blog/${related.slug}`} className="card group overflow-hidden">
                  <div className="aspect-[16/10]">
                    <OptimizedImage src={related.image} alt={related.title} containerClassName="w-full h-full" hoverZoom overlay="gradient-bottom" />
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium mb-2 block">
                      {related.category}
                    </span>
                    <h3 className="font-cormorant text-xl text-cosmos-night font-light mb-2 group-hover:text-cosmos-gold transition-colors">
                      {related.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-text-secondary font-inter font-light">
                      <Calendar className="w-3 h-3" strokeWidth={1.5} />
                      {related.date}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPostPage;
