import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MapPin, Clock, Phone, Mail, Globe, Star, Tag, Map, ArrowRight } from 'lucide-react';

import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd, storeJsonLd } from '../../lib/seo/jsonLd';
import Reveal from '../../components/common/Reveal';
import { useStores } from '../../hooks/useStores';

const StoreDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { stores, isLoading } = useStores({ status: 'active' });

  const store = useMemo(
    () => stores.find((s) => s.slug === id || s.id === id),
    [stores, id]
  );

  if (isLoading && !store) {
    return (
      <div className="min-h-[60vh] bg-cosmos-warm flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cosmos-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-cosmos-night flex items-center justify-center">
        <Seo title={t('storeDetail.notFound', 'Enseigne introuvable')} noindex />
        <div className="text-center px-6">
          <div className="font-cormorant text-8xl text-cosmos-cream/10 font-light mb-4">404</div>
          <h1 className="font-cormorant text-3xl text-cosmos-cream font-light mb-4">
            {t('storeDetail.notFound', 'Enseigne introuvable')}
          </h1>
          <Link to="/boutiques" className="btn-primary">
            {t('storeDetail.backToStores', 'Retour aux enseignes')}
          </Link>
        </div>
      </div>
    );
  }

  const infoCards = [
    store.zone || store.location_code
      ? {
          icon: MapPin,
          label: t('storeDetail.location', 'Localisation'),
          value: [store.zone, store.location_code].filter(Boolean).join(' — '),
        }
      : null,
    store.category ? { icon: Tag, label: t('storeDetail.segment', 'Segment'), value: store.category } : null,
    store.hours ? { icon: Clock, label: t('storeDetail.openingHours', 'Horaires'), value: store.hours } : null,
    store.phone ? { icon: Phone, label: t('storeDetail.phone', 'Téléphone'), value: store.phone } : null,
    store.email ? { icon: Mail, label: t('storeDetail.email', 'Email'), value: store.email } : null,
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[];

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title={`${store.name} — ${store.category ?? 'Enseigne'}`}
        description={(store.description ?? `${store.name} à Cosmos Angré.`).slice(0, 160)}
        keywords={[store.name, store.category ?? '', 'Cosmos Angré', 'enseigne', 'Cocody']}
        jsonLd={[
          breadcrumbJsonLd([
            { name: 'Accueil', url: '/' },
            { name: 'Enseignes', url: '/boutiques' },
            { name: store.name, url: `/boutiques/${store.slug ?? store.id}` },
          ]),
          storeJsonLd({
            name: store.name,
            slug: store.slug ?? store.id,
            description: store.description ?? '',
            cover_image: store.cover_image ?? undefined,
            category: store.category ?? '',
            phone: store.phone ?? '',
            email: store.email ?? '',
            website: store.website ?? '',
            hours: store.hours ?? '',
            rating: store.rating ?? 0,
          }),
        ]}
      />

      {/* Breadcrumb */}
      <section className="bg-cosmos-night py-4">
        <div className="container-cosmos">
          <Link
            to="/boutiques"
            className="inline-flex items-center gap-2 text-cosmos-cream/60 hover:text-cosmos-cream font-inter text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            {t('storeDetail.backToStores', 'Retour aux enseignes')}
          </Link>
        </div>
      </section>

      {/* Hero — logo (ou nom) sur fond forêt */}
      <section className="relative py-16 md:py-20 bg-cosmos-night overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(60% 80% at 50% 30%, rgb(var(--cosmos-gold) / 0.12), transparent 70%)',
          }}
        />
        <div className="container-cosmos relative z-10 text-center">
          {store.logo ? (
            <img
              src={store.logo}
              alt={store.name}
              className="max-h-20 md:max-h-24 max-w-[60%] object-contain mx-auto mb-6"
            />
          ) : null}
          <span className="overline mb-3 block">{store.category}</span>
          <h1 className="font-cormorant text-4xl md:text-6xl text-cosmos-cream font-light text-balance">
            {store.name}
          </h1>
          {store.rating && store.rating > 0 ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-sm mt-5">
              <Star className="w-4 h-4 text-cosmos-gold" strokeWidth={1.5} />
              <span className="text-sm font-inter text-cosmos-cream">{store.rating}</span>
            </div>
          ) : null}
          {store.description ? (
            <p className="text-sm text-cosmos-cream/60 font-inter font-light leading-relaxed max-w-2xl mx-auto mt-6">
              {store.description}
            </p>
          ) : null}
        </div>
      </section>

      {/* Info Cards */}
      {infoCards.length > 0 && (
        <section className="section bg-cosmos-warm">
          <div className="container-cosmos">
            <Reveal className="text-center mb-12">
              <span className="overline mb-4 block">{t('storeDetail.practicalOverline', 'Infos pratiques')}</span>
              <h2 className="section-title">{t('storeDetail.infoTitle', 'En un coup d’œil')}</h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {infoCards.map((item, i) => (
                <Reveal key={i} delay={i * 70} className="card p-6">
                  <item.icon className="w-6 h-6 text-cosmos-gold mb-3" strokeWidth={1.5} />
                  <p className="text-[10px] uppercase tracking-[0.15em] text-text-secondary font-inter mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm font-inter font-light text-cosmos-night break-words">{item.value}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Actions */}
      <section className="pb-4 bg-cosmos-warm">
        <div className="container-cosmos flex flex-wrap gap-3">
          <Link to={`/plan-interactif?store=${store.location_code ?? ''}`} className="btn-secondary">
            <Map className="w-4 h-4" strokeWidth={1.5} /> {t('storeDetail.viewOnMap', 'Voir sur le plan')}
          </Link>
          {store.website ? (
            <a href={store.website} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <Globe className="w-4 h-4" strokeWidth={1.5} /> {t('storeDetail.visitWebsite', 'Site web')}
            </a>
          ) : null}
        </div>
      </section>

      {/* CTA */}
      <section className="section-dark">
        <Reveal className="container-cosmos text-center">
          <span className="overline mb-4 block">{t('storeDetail.ctaOverline', 'Cette enseigne vous intéresse ?')}</span>
          <h2 className="section-title-light">{t('storeDetail.ctaTitle', 'Préparez votre visite')}</h2>
          <p className="section-subtitle-light max-w-lg mx-auto">
            {t('storeDetail.ctaSubtitle', { storeName: store.name, defaultValue: `Retrouvez ${store.name} et 60+ enseignes au cœur d’Angré.` })}
          </p>
          <Link to="/preparer-visite" className="btn-primary">
            {t('storeDetail.cta', 'Préparer ma visite')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </Reveal>
      </section>
    </div>
  );
};

export default StoreDetailPage;
