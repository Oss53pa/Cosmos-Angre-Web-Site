import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import { useStores } from '../../hooks/useStores';
import { type StoreData } from '../../components/features/stores/StoreCard';
import StoreDetailModal from '../../components/features/stores/StoreDetailModal';
import PageHero from '../../components/common/PageHero';
import Reveal from '../../components/common/Reveal';
import GrainOverlay from '../../components/features/galaxy/GrainOverlay';
import CosmicDivider from '../../components/features/galaxy/CosmicDivider';
import { useContent } from '../../lib/content/SiteContentProvider';

import galleryInterior from '../../assets/images/branding/gallery-interior.jpg';

interface Brand {
  slug: string;
  name: string;
  category: string;
  categoryKey: string;
  zone: string;
  zoneKey: string;
  logo?: string;
  image?: string;
  description: string;
  hours: string;
  phone: string;
  website?: string;
  photos?: string[];
  locationCode: string;
  rating: number;
}

const StoresPage: React.FC = () => {
  const { c } = useContent();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'cat' | 'az'>('cat');
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);
  const pillsRef = useRef<HTMLDivElement>(null);
  const scrollPills = (dir: -1 | 1) =>
    pillsRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });

  const { stores: supabaseStores } = useStores({ status: 'active' });

  const brands: Brand[] = useMemo(
    () =>
      supabaseStores.map((s) => {
        const sx = s as typeof s & {
          gallery?: { url?: string }[] | null;
          website?: string | null;
        };
        const photos = [
          s.cover_image ?? undefined,
          ...((sx.gallery ?? []).map((g) => g?.url).filter(Boolean) as string[]),
        ].filter(Boolean) as string[];
        return {
          slug: s.slug ?? s.id,
          name: s.name,
          category: s.category ?? '',
          categoryKey: s.category_key ?? 'all',
          zone: s.zone ?? '',
          zoneKey: s.zone_key ?? 'gallery',
          logo: s.logo ?? undefined,
          image: s.cover_image ?? undefined,
          description: s.description ?? '',
          hours: s.hours ?? '',
          phone: s.phone ?? '',
          website: sx.website ?? undefined,
          photos,
          locationCode: s.location_code ?? '',
          rating: s.rating ?? 0,
        };
      }),
    [supabaseStores]
  );

  // Catégories dérivées des données réelles
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    for (const b of brands) if (b.categoryKey && b.category) map.set(b.categoryKey, b.category);
    return Array.from(map, ([key, label]) => ({ key, label })).sort((a, b) =>
      a.label.localeCompare(b.label)
    );
  }, [brands]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return brands
      .filter((b) => selectedCategory === 'all' || b.categoryKey === selectedCategory)
      .filter((b) => q === '' || b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [brands, selectedCategory, searchTerm]);

  // Regroupement par catégorie (rendu annuaire éditorial quand "Toutes" est actif)
  const groups = useMemo(() => {
    const map = new Map<string, { label: string; items: Brand[] }>();
    for (const b of filtered) {
      const key = b.categoryKey || 'autres';
      if (!map.has(key)) map.set(key, { label: b.category || 'Autres', items: [] });
      map.get(key)!.items.push(b);
    }
    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [filtered]);

  // Vue A–Z : regroupement par première lettre (chiffres/symboles → #)
  const azGroups = useMemo(() => {
    const map = new Map<string, Brand[]>();
    for (const b of filtered) {
      const ch = (b.name.trim()[0] || '#').toUpperCase();
      const letter = /[A-Z]/.test(ch) ? ch : '#';
      (map.get(letter) ?? map.set(letter, []).get(letter)!).push(b);
    }
    return Array.from(map.entries())
      .map(([letter, items]) => ({ letter, items: items.sort((a, b) => a.name.localeCompare(b.name)) }))
      .sort((a, b) => a.letter.localeCompare(b.letter));
  }, [filtered]);

  // « À la une » : sélection mise en avant (logos d'abord, puis note, puis nom)
  const featured = useMemo(
    () =>
      [...brands]
        .sort(
          (a, b) =>
            (b.logo ? 1 : 0) - (a.logo ? 1 : 0) ||
            (b.rating ?? 0) - (a.rating ?? 0) ||
            a.name.localeCompare(b.name)
        )
        .slice(0, 6),
    [brands]
  );

  const browseMode = selectedCategory === 'all' && searchTerm.trim() === '';

  // Ouverture auto du modal depuis ?store=slug (liens directs / anciennes URLs /boutiques/:id)
  const [searchParams, setSearchParams] = useSearchParams();
  const autoOpenedRef = useRef<string | null>(null);
  useEffect(() => {
    const slug = searchParams.get('store');
    if (!slug || autoOpenedRef.current === slug || brands.length === 0) return;
    const b = brands.find((x) => x.slug === slug);
    if (b) {
      autoOpenedRef.current = slug;
      openBrand(b);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, brands]);

  const closeModal = () => {
    setSelectedStore(null);
    if (searchParams.get('store')) {
      const next = new URLSearchParams(searchParams);
      next.delete('store');
      setSearchParams(next, { replace: true });
    }
  };

  const openBrand = (b: Brand) =>
    setSelectedStore({
      id: b.slug,
      name: b.name,
      categoryKey: b.categoryKey,
      category: b.category,
      zone: b.zone,
      zoneKey: b.zoneKey,
      locationCode: b.locationCode,
      hours: b.hours,
      phone: b.phone,
      description: b.description,
      rating: b.rating,
      image: b.image ?? '',
      logo: b.logo,
      website: b.website,
      photos: b.photos,
    });

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title="Les Enseignes"
        description="Les enseignes signées de Cosmos Angré : mode, beauté, restaurants, high-tech, services et plus, au cœur d'Angré, Cocody."
        keywords={['enseignes Cosmos Angré', 'boutiques Cocody', 'marques Abidjan', 'shopping Angré']}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Enseignes', url: '/boutiques' },
        ])}
      />

      <PageHero
        image={c('stores.hero.image') || galleryInterior}
        alt="Les enseignes de Cosmos Angré"
        overline={c('stores.hero.overline', 'Les Enseignes')}
        title={c('stores.hero.title', 'Vos marques,')}
        titleAccent={c('stores.hero.accent', 'réunies.')}
        subtitle={c(
          'stores.hero.subtitle',
          `${brands.length} enseignes signées : mode, beauté, restaurants, high-tech et bien plus.`
        )}
      />

      {/* Barre de filtres */}
      <section className="sticky top-16 md:top-20 z-20 bg-cosmos-warm/95 backdrop-blur-md border-b border-cosmos-night/10 shadow-[0_8px_24px_-20px_rgb(var(--cosmos-night)/0.4)]">
        <div className="container-cosmos py-4 space-y-3">
          {/* Ligne 1 : recherche + compteur */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cosmos-night/40" strokeWidth={1.5} />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une enseigne…"
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-white border border-cosmos-night/10 focus:outline-none focus:border-cosmos-gold/50 focus:ring-2 focus:ring-cosmos-gold/15 font-inter font-light text-sm transition"
              />
            </div>
            <span className="hidden md:block text-xs uppercase tracking-[0.18em] text-cosmos-night/45 font-inter whitespace-nowrap">
              {filtered.length} {filtered.length > 1 ? 'enseignes' : 'enseigne'}
            </span>
            {/* Bascule de vue (façon Westfield / Aventura) */}
            <div className="flex items-center rounded-full border border-cosmos-night/10 bg-white p-0.5 flex-shrink-0">
              <button
                onClick={() => setView('cat')}
                className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.12em] font-inter transition-colors ${
                  view === 'cat' ? 'bg-cosmos-night text-cosmos-cream' : 'text-cosmos-night/55 hover:text-cosmos-night'
                }`}
              >
                Catégories
              </button>
              <button
                onClick={() => setView('az')}
                className={`px-3 py-1.5 rounded-full text-[10px] uppercase tracking-[0.12em] font-inter transition-colors ${
                  view === 'az' ? 'bg-cosmos-night text-cosmos-cream' : 'text-cosmos-night/55 hover:text-cosmos-night'
                }`}
              >
                A–Z
              </button>
            </div>
          </div>

          {/* Ligne 2 : catégories — carrousel (flèches + fondus) */}
          <div className="relative">
            {/* fondus latéraux */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-r from-cosmos-warm to-transparent" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 z-10 bg-gradient-to-l from-cosmos-warm to-transparent" />
            {/* flèches (desktop) */}
            <button
              type="button"
              onClick={() => scrollPills(-1)}
              aria-label="Précédent"
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center rounded-full bg-white border border-cosmos-night/10 shadow-sm text-cosmos-night/60 hover:text-cosmos-night hover:border-cosmos-gold/50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scrollPills(1)}
              aria-label="Suivant"
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 w-8 h-8 items-center justify-center rounded-full bg-white border border-cosmos-night/10 shadow-sm text-cosmos-night/60 hover:text-cosmos-night hover:border-cosmos-gold/50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
            <div
              ref={pillsRef}
              className="flex items-center gap-2 overflow-x-auto flex-nowrap px-1 md:px-10 pb-0.5 scroll-smooth [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none' }}
            >
              <FilterPill active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')}>
                Toutes
              </FilterPill>
              {categories.map((cat) => (
                <FilterPill
                  key={cat.key}
                  active={selectedCategory === cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                >
                  {cat.label}
                </FilterPill>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Annuaire des enseignes */}
      <section className="section bg-cosmos-warm pt-10">
        <div className="container-cosmos">
          {/* À la une — sélection mise en avant (façon Aventura) */}
          {browseMode && featured.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="font-cormorant text-2xl md:text-3xl text-cosmos-night font-light whitespace-nowrap">
                  À la une
                </h2>
                <span className="flex-1 h-px bg-cosmos-gold/30" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                {featured.map((b, i) => (
                  <Reveal key={b.slug} delay={Math.min(i, 6) * 40}>
                    <BrandTile brand={b} onOpen={() => openBrand(b)} />
                  </Reveal>
                ))}
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <p className="text-center text-cosmos-night/50 font-inter font-light py-20">
              Aucune enseigne pour ce filtre.
            </p>
          ) : browseMode && view === 'cat' ? (
            // Vue annuaire : sections par catégorie
            <div className="space-y-16">
              {groups.map((g) => (
                <div key={g.label}>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="font-cormorant text-2xl md:text-3xl text-cosmos-night font-light whitespace-nowrap">
                      {g.label}
                    </h2>
                    <span className="text-[11px] text-cosmos-night/40 font-inter">{g.items.length}</span>
                    <span className="flex-1 h-px bg-cosmos-night/10" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                    {g.items.map((b, i) => (
                      <Reveal key={b.slug} delay={Math.min(i, 10) * 30}>
                        <BrandTile brand={b} onOpen={() => openBrand(b)} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : browseMode && view === 'az' ? (
            // Vue A–Z : sections par lettre avec en-tête sticky
            <div className="space-y-12">
              {azGroups.map((g) => (
                <div key={g.letter}>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-cormorant text-4xl md:text-5xl text-cosmos-gold/80 font-light leading-none w-12">
                      {g.letter}
                    </span>
                    <span className="flex-1 h-px bg-cosmos-night/10" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                    {g.items.map((b, i) => (
                      <Reveal key={b.slug} delay={Math.min(i, 10) * 25}>
                        <BrandTile brand={b} onOpen={() => openBrand(b)} />
                      </Reveal>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Vue filtrée / recherche : grille simple
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {filtered.map((b, i) => (
                <Reveal key={b.slug} delay={Math.min(i, 14) * 25}>
                  <BrandTile brand={b} onOpen={() => openBrand(b)} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <StoreDetailModal store={selectedStore} onClose={closeModal} />

      {/* CTA leasing */}
      <section className="section-dark relative overflow-hidden">
        <GrainOverlay opacity={0.05} />
        <div className="container-cosmos relative z-10 text-center">
          <CosmicDivider variant="dark" className="mb-10" />
          <span className="overline mb-4 block">{c('stores.pro.overline', 'Espace Pro')}</span>
          <h2 className="section-title-light">
            {c('stores.pro.title', 'Vous voulez ouvrir une enseigne ?')}
          </h2>
          <p className="section-subtitle-light max-w-lg mx-auto">
            {c(
              'stores.pro.subtitle',
              "Rejoignez la destination qui fait déjà parler tout Angré. Notre équipe leasing vous accompagne, de l'emplacement à l'ouverture."
            )}
          </p>
          <Link to="/professionnels/devenir-enseigne" className="btn-primary">
            {c('stores.pro.cta', 'Devenir enseigne')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </div>
  );
};

const BrandTile: React.FC<{ brand: Brand; onOpen: () => void }> = ({ brand: b, onOpen }) => {
  const initial = (b.name.trim().charAt(0) || '·').toUpperCase();
  const [logoOk, setLogoOk] = useState(!!b.logo);
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative w-full h-full bg-white rounded-2xl border border-cosmos-night/[0.07] px-4 py-6 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-1.5 hover:border-cosmos-gold/45 hover:shadow-[0_26px_54px_-28px_rgb(var(--cosmos-night)/0.5)]"
    >
      {/* Médaillon : logo si dispo (repli monogramme si l'image échoue) */}
      <div className="relative w-16 h-16 mb-4 rounded-full flex items-center justify-center bg-cosmos-cream/60 ring-1 ring-cosmos-gold/20 group-hover:ring-cosmos-gold/55 transition-all duration-500 overflow-hidden">
        {b.logo && logoOk ? (
          <img
            src={b.logo}
            alt={b.name}
            className="max-h-10 max-w-[78%] object-contain"
            loading="lazy"
            onError={() => setLogoOk(false)}
          />
        ) : (
          <span className="font-cormorant text-2xl text-cosmos-gold font-light leading-none select-none">
            {initial}
          </span>
        )}
      </div>

      <h3 className="font-cormorant text-base md:text-lg text-cosmos-night font-light leading-tight line-clamp-2 group-hover:text-cosmos-gold transition-colors">
        {b.name}
      </h3>

      <span className="mt-1.5 text-[9px] uppercase tracking-[0.16em] text-cosmos-night/40 font-inter line-clamp-1">
        {b.category}
      </span>
      {b.zone && (
        <span className="mt-1 inline-flex items-center gap-1 text-[9px] text-cosmos-night/30 font-inter line-clamp-1">
          <MapPin className="w-2.5 h-2.5" strokeWidth={1.5} />
          {b.zone}
        </span>
      )}

      {/* Révélé au survol */}
      <span className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-cosmos-gold opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        Découvrir <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
      </span>
    </button>
  );
};

const FilterPill: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex-shrink-0 px-4 py-2 rounded-full text-xs uppercase tracking-[0.12em] font-inter whitespace-nowrap transition-all ${
      active
        ? 'bg-cosmos-night text-cosmos-cream'
        : 'bg-white text-cosmos-night/60 border border-cosmos-night/10 hover:border-cosmos-gold/40 hover:text-cosmos-night'
    }`}
  >
    {children}
  </button>
);

export default StoresPage;
