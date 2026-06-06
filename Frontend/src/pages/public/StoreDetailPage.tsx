import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  Star,
  Users,
  Package,
  Calendar,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

import OptimizedImage from '../../components/common/OptimizedImage';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd, storeJsonLd } from '../../lib/seo/jsonLd';
import storePlaceholder from '../../assets/images/branding/gallery-interior.jpg';

interface Store {
  id: string;
  name: string;
  category: string;
  owner: string;
  email: string;
  phone: string;
  location: string;
  zone: string;
  plan: 'Silver' | 'Gold' | 'Platinum';
  status: 'active' | 'pending' | 'suspended';
  joinedDate: string;
  views: number;
  rating: number;
  description: string;
  openingHours: string;
  website?: string;
  employees: number;
  products: number;
  image?: string;
}

const StoreDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const stores: Store[] = [
    {
      id: '1',
      name: 'Nike Store',
      category: t('storeDetail.stores.nike.category'),
      owner: 'Jean Kouassi',
      email: 'jean@nikestore.com',
      phone: '+225 27 22 XX XX XX',
      location: 'C1 \u2014 85 m\u00B2',
      zone: t('storeDirectory.zones.gallery'),
      plan: 'Platinum',
      status: 'active',
      joinedDate: '2024-01-15',
      views: 12500,
      rating: 4.8,
      description: t('storeDetail.stores.nike.description'),
      openingHours: 'Lun-Dim: 9h00-21h00',
      website: 'https://nike.com',
      employees: 12,
      products: 850,
      image: storePlaceholder,
    },
    {
      id: '2',
      name: 'Zara Fashion',
      category: t('storeDetail.stores.zara.category'),
      owner: 'Marie Diabate',
      email: 'marie@zara.com',
      phone: '+225 27 22 YY YY YY',
      location: 'C2 \u2014 120 m\u00B2',
      zone: t('storeDirectory.zones.gallery'),
      plan: 'Gold',
      status: 'active',
      joinedDate: '2024-02-20',
      views: 9800,
      rating: 4.6,
      description: t('storeDetail.stores.zara.description'),
      openingHours: 'Lun-Dim: 9h00-21h00',
      website: 'https://zara.com',
      employees: 8,
      products: 1200,
      image: storePlaceholder,
    },
    {
      id: '3',
      name: 'Tech Paradise',
      category: t('storeDetail.stores.techParadise.category'),
      owner: 'Yao Kouadio',
      email: 'yao@techparadise.com',
      phone: '+225 27 22 ZZ ZZ ZZ',
      location: 'C8 \u2014 148 m\u00B2',
      zone: t('storeDirectory.zones.gallery'),
      plan: 'Silver',
      status: 'active',
      joinedDate: '2024-03-10',
      views: 5200,
      rating: 4.3,
      description: t('storeDetail.stores.techParadise.description'),
      openingHours: 'Lun-Sam: 10h00-20h00',
      website: 'https://techparadise.ci',
      employees: 3,
      products: 450,
      image: storePlaceholder,
    },
  ];

  const store = stores.find((s) => s.id === id);

  if (!store) {
    return (
      <div className="min-h-screen bg-cosmos-night flex items-center justify-center">
        <Seo title={t('storeDetail.notFound', 'Boutique introuvable')} noindex />
        <div className="text-center px-6">
          <div className="font-cormorant text-8xl text-cosmos-cream/10 font-light mb-4">404</div>
          <h1 className="font-cormorant text-3xl text-cosmos-cream font-light mb-4">{t('storeDetail.notFound')}</h1>
          <Link to="/boutiques" className="btn-primary">
            {t('storeDetail.backToStores')}
          </Link>
        </div>
      </div>
    );
  }

  const planColors: Record<string, string> = {
    Platinum: 'bg-cosmos-night text-cosmos-cream',
    Gold: 'bg-cosmos-gold text-cosmos-night',
    Silver: 'bg-cosmos-cream text-cosmos-night',
  };

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title={`${store.name} — ${store.category}`}
        description={store.description.slice(0, 160)}
        image={store.image}
        keywords={[store.name, store.category, 'Cosmos Angré', 'boutique', 'shopping', 'Cocody']}
        jsonLd={[
          breadcrumbJsonLd([
            { name: 'Accueil', url: '/' },
            { name: 'Boutiques', url: '/boutiques' },
            { name: store.name, url: `/boutiques/${store.id}` },
          ]),
          storeJsonLd({
            name: store.name,
            slug: store.id,
            description: store.description,
            cover_image: store.image,
            category: store.category,
            phone: store.phone,
            email: store.email,
            website: store.website,
            hours: store.openingHours,
            rating: store.rating,
          }),
        ]}
      />
      {/* Breadcrumb */}
      <section className="bg-cosmos-night py-4">
        <div className="container-cosmos">
          <Link to="/boutiques" className="inline-flex items-center gap-2 text-cosmos-cream/60 hover:text-cosmos-cream font-inter text-xs transition-colors">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> {t('storeDetail.backToStores')}
          </Link>
        </div>
      </section>

      {/* Hero */}
      <section className="relative py-20 bg-cosmos-night">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cosmos-gold/5 to-transparent" />
        <div className="container-cosmos relative z-10">
          <div className="grid md:grid-cols-2 gap-4 md:gap-12 items-center">
            <div className="relative rounded-lg">
              <OptimizedImage src={store.image} alt={store.name} containerClassName="w-full rounded-lg" aspectRatio="4/3" />
              <div className="absolute top-4 right-4 z-10">
                <span className={`inline-block px-3 py-1 text-[10px] uppercase tracking-[0.15em] font-inter font-medium rounded-sm ${planColors[store.plan]}`}>
                  {store.plan}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium block mb-3">{store.category}</span>
              <h1 className="font-cormorant text-4xl md:text-5xl text-cosmos-cream font-light mb-4">{store.name}</h1>

              {store.rating > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-sm">
                    <Star className="w-4 h-4 text-cosmos-gold" strokeWidth={1.5} />
                    <span className="text-sm font-inter text-cosmos-cream">{store.rating}</span>
                  </div>
                  <span className="text-xs text-cosmos-cream/60 font-inter font-light">{store.views.toLocaleString()} {t('storeDetail.views')}</span>
                </div>
              )}

              <p className="text-sm text-cosmos-cream/60 font-inter font-light leading-relaxed">{store.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="text-center mb-12">
            <span className="overline mb-4 block">{t('storeDetail.practicalOverline')}</span>
            <h2 className="section-title">{t('storeDetail.infoTitle')}</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {[
              { icon: MapPin, label: t('storeDetail.location'), value: `${store.zone} \u2014 ${store.location}` },
              { icon: Clock, label: t('storeDetail.openingHours'), value: store.openingHours },
              { icon: Phone, label: t('storeDetail.phone'), value: store.phone },
              { icon: Mail, label: t('storeDetail.email'), value: store.email },
            ].map((item, i) => (
              <div key={i} className="card p-6">
                <item.icon className="w-6 h-6 text-cosmos-gold mb-3" strokeWidth={1.5} />
                <p className="text-[10px] uppercase tracking-[0.15em] text-text-secondary font-inter mb-1">{item.label}</p>
                <p className="text-sm font-inter font-light text-cosmos-night break-all">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-cosmos-night">
        <div className="container-cosmos">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: Users, value: store.employees, label: t('storeDetail.employees') },
              { icon: Package, value: store.products, label: t('storeDetail.products') },
              { icon: TrendingUp, value: store.views.toLocaleString(), label: t('storeDetail.views') },
              { icon: Calendar, value: new Date(store.joinedDate).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' }), label: t('storeDetail.memberSince') },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 bg-white/5 border border-white/5 rounded-md">
                <item.icon className="w-6 h-6 text-cosmos-gold mx-auto mb-3" strokeWidth={1.5} />
                <div className="font-cormorant text-2xl text-cosmos-cream mb-1">{item.value}</div>
                <span className="text-[10px] uppercase tracking-[0.15em] text-cosmos-cream/60 font-inter">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Links */}
      {store.website && (
        <section className="section bg-cosmos-warm">
          <div className="container-cosmos">
            <a href={store.website} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <Globe className="w-4 h-4" strokeWidth={1.5} /> {t('storeDetail.visitWebsite')}
            </a>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-cosmos-night">
        <div className="container-cosmos text-center">
          <span className="overline mb-4 block">{t('storeDetail.ctaOverline')}</span>
          <h2 className="font-cormorant text-3xl md:text-5xl text-cosmos-cream font-light mb-4">{t('storeDetail.ctaTitle')}</h2>
          <p className="text-sm text-cosmos-cream/60 font-inter font-light mb-10 max-w-lg mx-auto">
            {t('storeDetail.ctaSubtitle', { storeName: store.name })}
          </p>
          <Link to="/contact" className="btn-primary">
            {t('common.contactUs')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default StoreDetailPage;
