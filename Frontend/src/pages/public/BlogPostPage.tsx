import React, { useMemo, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Clock, Share2, Check, Copy } from 'lucide-react';
import OptimizedImage from '../../components/common/OptimizedImage';
import Seo from '../../lib/seo/Seo';
import { articleJsonLd, breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import { supabase } from '../../lib/supabase';
import type { BlogPost } from '../../types/database';
import galleryInterior from '../../assets/images/branding/gallery-interior.jpg';
import artisanMarket from '../../assets/images/branding/artisan-market.jpg';
import familyLifestyle from '../../assets/images/branding/family-lifestyle.jpg';

interface DisplayArticle {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  image: string;
  /** Rendered as HTML (real Supabase posts). */
  html?: string;
  /** Rendered as paragraphs (static fallback articles). */
  paragraphs?: string[];
  excerpt: string;
}

const ARTICLES: DisplayArticle[] = [
  {
    slug: 'ouverture-cosmos-angre',
    title: 'Ouverture prochaine de Cosmos Angré',
    date: '15 Nov 2025',
    author: 'Équipe Cosmos',
    category: 'Actualités',
    image: galleryInterior,
    excerpt: '',
    paragraphs: [
      'Cosmos Angré, le centre de vie de Côte d’Ivoire, ouvrira bientôt ses portes à Cocody-Angré. Avec plus de 17 400 m² de surface, ce lieu d’exception accueillera plus de 55 enseignes, des restaurants, un cinéma dernière génération, un hôtel et bien plus encore.',
      'Conçu pour offrir une expérience inégalée, Cosmos Angré est certifié EDGE Advanced, témoignant de son engagement envers le développement durable. Chaque détail a été pensé pour créer un lieu où se mêlent élégance, confort et innovation.',
      'La galerie commerciale, véritable colonne vertébrale du complexe, accueillera des marques internationales et locales soigneusement sélectionnées. Du prêt-à-porter de luxe aux créateurs ivoiriens émergents, chaque boutique a été pensée comme une destination à part entière.',
      'La Halle Gourmande, au cœur du complexe, proposera une offre culinaire variée : cuisine ivoirienne contemporaine, cuisine asiatique, brasserie parisienne et bien plus. Chaque restaurant a été conçu comme un univers sensoriel unique.',
      'Rejoignez-nous pour découvrir un monde à part. L’inauguration sera un événement exceptionnel, avec des surprises, des spectacles et des offres exclusives pour les premiers visiteurs.',
    ],
  },
  {
    slug: 'artisans-locaux',
    title: 'Les artisans locaux à l’honneur',
    date: '10 Nov 2025',
    author: 'Équipe Cosmos',
    category: 'Culture',
    image: artisanMarket,
    excerpt: '',
    paragraphs: [
      'Le Marché Artisanal de Cosmos Angré met en lumière le savoir-faire ivoirien et africain. Artisans, créateurs et designers locaux y présentent leurs œuvres dans un écrin premium.',
      'Des textiles traditionnels aux bijoux contemporains, en passant par la maroquinerie et l’art décoratif, chaque pièce raconte une histoire. C’est un voyage au cœur de la créativité africaine.',
      'Nous avons sélectionné chaque artisan pour la qualité de son travail, l’originalité de ses créations et son engagement envers des pratiques durables. Le marché n’est pas un simple espace de vente — c’est une célébration du talent local.',
      'Des ateliers découverte seront organisés régulièrement, permettant aux visiteurs de s’initier aux techniques artisanales : tissage du pagne, travail du cuir, création de bijoux en perles de verre.',
      'Venez découvrir ces talents exceptionnels et repartez avec des pièces uniques, chargées de sens et d’authenticité.',
    ],
  },
  {
    slug: 'destination-famille',
    title: 'Une destination pour toute la famille',
    date: '5 Nov 2025',
    author: 'Équipe Cosmos',
    category: 'Lifestyle',
    image: familyLifestyle,
    excerpt: '',
    paragraphs: [
      'Cosmos Angré a été conçu pour que chaque membre de la famille y trouve son bonheur. Les enfants profitent d’espaces de jeux sécurisés et d’ateliers créatifs, tandis que les parents explorent les boutiques et les restaurants.',
      'Le cinéma propose une programmation variée, l’entertainment zone offre bowling et réalité virtuelle, et La Halle Gourmande satisfait toutes les envies culinaires.',
      'Pour les plus jeunes, un espace Kids Club avec animateurs professionnels permet aux parents de profiter du centre en toute sérénité. Ateliers de dessin, jeux éducatifs et activités ludiques sont au programme chaque week-end.',
      'Les espaces de bien-être ne sont pas en reste : spa, salon de coiffure, espace fitness — chaque visiteur peut s’accorder un moment de détente dans un cadre premium.',
      'Une journée ne suffit pas pour tout découvrir — c’est la promesse d’une expérience renouvelée à chaque visite.',
    ],
  },
];

const FALLBACK_IMAGES = [galleryInterior, artisanMarket, familyLifestyle];

function formatDate(value: string | null): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function mapPost(post: BlogPost, index = 0): DisplayArticle {
  const html = post.content ?? '';
  const excerpt = post.excerpt ?? stripHtml(html).slice(0, 160);
  return {
    slug: post.slug,
    title: post.title,
    date: formatDate(post.publish_date ?? post.created_at),
    author: post.author_name ?? 'Équipe Cosmos',
    category: post.category ?? 'Actualités',
    image: post.featured_image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    html,
    excerpt,
  };
}

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [linkCopied, setLinkCopied] = useState(false);
  const [article, setArticle] = useState<DisplayArticle | null>(null);
  const [related, setRelated] = useState<DisplayArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const staticArticle = ARTICLES.find((a) => a.slug === slug) ?? null;

    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'published')
          .maybeSingle();

        if (!active) return;

        if (!error && data) {
          setArticle(mapPost(data as BlogPost));

          // Fetch a couple of related published posts (same category preferred).
          const { data: rel } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('status', 'published')
            .neq('slug', slug)
            .order('publish_date', { ascending: false, nullsFirst: false })
            .limit(2);

          if (active && rel && rel.length > 0) {
            setRelated((rel as BlogPost[]).map((p, i) => mapPost(p, i)));
          } else if (active) {
            setRelated(ARTICLES.filter((a) => a.slug !== slug).slice(0, 2));
          }
        } else {
          // No DB row — fall back to the static seed articles.
          setArticle(staticArticle);
          setRelated(ARTICLES.filter((a) => a.slug !== slug).slice(0, 2));
        }
      } catch {
        if (!active) return;
        setArticle(staticArticle);
        setRelated(ARTICLES.filter((a) => a.slug !== slug).slice(0, 2));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [slug]);

  const readingTime = useMemo(() => {
    if (!article) return 0;
    const text = article.html ? stripHtml(article.html) : (article.paragraphs ?? []).join(' ');
    const words = text.split(/\s+/).filter(Boolean).length;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-cosmos-night flex items-center justify-center">
        <Seo title="Chargement…" noindex />
        <div className="w-10 h-10 border-2 border-cosmos-gold/30 border-t-cosmos-gold rounded-full animate-spin" />
      </div>
    );
  }

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

  const articleExcerpt = article.excerpt || (article.paragraphs?.[0]?.slice(0, 160) ?? '');

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
            {article.html ? (
              <div
                className="blog-content text-base text-cosmos-night/80 font-inter font-light leading-[1.9]"
                dangerouslySetInnerHTML={{ __html: article.html }}
              />
            ) : (
              (article.paragraphs ?? []).map((paragraph, i) => (
                <p
                  key={i}
                  className={`text-base text-cosmos-night/80 font-inter font-light leading-[1.9] mb-6 last:mb-0 ${
                    i === 0 ? 'first-letter:text-4xl first-letter:font-cormorant first-letter:font-light first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-cosmos-night' : ''
                  }`}
                >
                  {paragraph}
                </p>
              ))
            )}
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
      {related.length > 0 && (
        <section className="py-16 bg-cosmos-cream">
          <div className="container-cosmos">
            <div className="text-center mb-12">
              <span className="overline mb-3 block">À lire aussi</span>
              <h2 className="section-title">Articles similaires</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {related.map((rel) => (
                <Link key={rel.slug} to={`/blog/${rel.slug}`} className="card group overflow-hidden">
                  <div className="aspect-[16/10]">
                    <OptimizedImage src={rel.image} alt={rel.title} containerClassName="w-full h-full" hoverZoom overlay="gradient-bottom" />
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium mb-2 block">
                      {rel.category}
                    </span>
                    <h3 className="font-cormorant text-xl text-cosmos-night font-light mb-2 group-hover:text-cosmos-gold transition-colors">
                      {rel.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-text-secondary font-inter font-light">
                      <Calendar className="w-3 h-3" strokeWidth={1.5} />
                      {rel.date}
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
