import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Leaf,
  Droplets,
  Zap,
  Award,
  MapPin,
  Star,
  Crown,
  Gift,
  Sparkles,
} from 'lucide-react';

import Seo from '../../lib/seo/Seo';
import {
  organizationJsonLd,
  shoppingCenterJsonLd,
  websiteJsonLd,
} from '../../lib/seo/jsonLd';
import AmbientMusic from '../../components/features/AmbientMusic';
import TestimonialsSection from '../../components/features/TestimonialsSection';
import OptimizedImage from '../../components/common/OptimizedImage';
import Reveal from '../../components/common/Reveal';
import { useContent } from '../../lib/content/SiteContentProvider';
import FeaturedBrands from '../../components/features/home/FeaturedBrands';
import ServicesStrip from '../../components/features/home/ServicesStrip';
import ProximityAccess from '../../components/features/home/ProximityAccess';
import InstagramUGC from '../../components/features/home/InstagramUGC';
import HeroPhoto from '../../components/features/HeroPhoto';
import ConstellationHero from '../../components/features/galaxy/ConstellationHero';
import CosmicDivider from '../../components/features/galaxy/CosmicDivider';
import GrainOverlay from '../../components/features/galaxy/GrainOverlay';

import heroImage from '../../assets/images/branding/hero-exterior.jpg';
import edgeBuilding from '../../assets/images/branding/edge-building.jpg';
import edgeLogo from '../../assets/images/branding/edge-logo.png';
import galleryInterior from '../../assets/images/branding/gallery-interior.jpg';
import galaEvent from '../../assets/images/branding/gala-event.jpg';
import christmasMarket from '../../assets/images/branding/christmas-market.jpg';

// Compteur animé déclenché à l'apparition
function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) setHasStarted(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return { count, ref };
}

// Révélation au scroll
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
}

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { c } = useContent();

  const stat1 = useCountUp(17400, 2000);
  const stat2 = useCountUp(63, 2000);
  const stat3 = useCountUp(400, 2000);
  const stat4 = useCountUp(4, 2000);

  const bentoReveal = useScrollReveal();
  const edgeReveal = useScrollReveal();
  const clubReveal = useScrollReveal();

  return (
    <div className="bg-cosmos-warm">
      <Seo
        titleTemplate="Cosmos Angré · Le meilleur du quotidien, ici"
        description="Cosmos Angré, le centre de vie d'Angré (Cocody, Abidjan). Enseignes, restaurants & cafés, agenda, Cosmos Club, services et Retail Park. Tout ce qui fait vos journées, réuni au même endroit."
        keywords={[
          'Cosmos Angré',
          'centre de vie',
          'enseignes Angré',
          'restaurants Cocody',
          'agenda Abidjan',
          'Cosmos Club',
          "Côte d'Ivoire",
        ]}
        jsonLd={[organizationJsonLd(), shoppingCenterJsonLd(), websiteJsonLd()]}
      />

      <AmbientMusic />

      {/* ════════ HERO PHOTOGRAPHIQUE (direction B) ════════ */}
      <HeroPhoto />

      {/* ════════ UNIVERS EN CONSTELLATION (navigation signature) ════════ */}
      <ConstellationHero
        showSignature={false}
        overline={c('home.univers.overline', 'Explorez')}
        heading={c('home.univers.heading', 'Nos univers')}
      />

      {/* ════════ À LA UNE — Bento ════════ */}
      <section id="apres-hero" className="section bg-cosmos-warm" ref={bentoReveal.ref}>
        <div className="container-cosmos">
          <CosmicDivider className="mb-12" />
          <div className="text-center mb-16">
            <span className="overline mb-4 block">Temps forts</span>
            <h2 className="section-title">À la une</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Les ouvertures, les rendez-vous, les moments qui font parler tout Angré.
              Voici ce qu'il ne faut surtout pas manquer en ce moment.
            </p>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 ${
              bentoReveal.isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            {/* Grande carte — Temps fort */}
            <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-lg">
              <OptimizedImage
                src={galaEvent}
                alt="Cosmos Angré, grande inauguration"
                containerClassName="absolute inset-0"
                hoverZoom
                overlay="gradient-bottom"
              />
              <div className="relative z-10 flex flex-col justify-end h-full min-h-[400px] md:min-h-[500px] p-8">
                <span className="overline mb-3">Édition spéciale</span>
                <h3 className="font-cormorant text-3xl md:text-4xl text-cosmos-cream font-light mb-2">
                  Grande Inauguration
                </h3>
                <p className="text-sm text-cosmos-cream/80 font-inter font-light mb-4 max-w-md">
                  Octobre 2026, le jour où Angré change de dimension. Soyez là dès
                  la première heure, là où tout commence.
                </p>
                <Link
                  to="/evenements"
                  className="inline-flex items-center gap-2 text-cosmos-gold text-xs uppercase tracking-[0.15em] font-inter font-medium hover:gap-3 transition-all"
                >
                  En savoir plus <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
                </Link>
              </div>
            </div>

            {/* Petite carte — Nouvelle enseigne */}
            <div className="card group p-6 flex flex-col justify-between min-h-[220px]">
              <div>
                <span className="overline mb-3 block">Nouvelle enseigne</span>
                <h4 className="font-cormorant text-2xl text-cosmos-night font-light mb-2">
                  Carrefour Market
                </h4>
                <p className="text-sm text-text-secondary font-inter font-light">
                  Vos courses du quotidien, enfin au même endroit que tout le reste.
                </p>
              </div>
              <Link
                to="/boutiques"
                className="inline-flex items-center gap-2 text-cosmos-gold text-xs uppercase tracking-[0.15em] font-inter font-medium hover:gap-3 transition-all mt-4"
              >
                Voir les enseignes <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </Link>
            </div>

            {/* Petite carte — Cosmos Club (membres fondateurs) */}
            <div className="bg-cosmos-night rounded-lg p-6 flex flex-col justify-between min-h-[220px] relative overflow-hidden">
              <div
                className="absolute -right-8 -top-8 w-32 h-32 rounded-full pointer-events-none"
                style={{
                  background:
                    'radial-gradient(circle, rgb(var(--cosmos-gold) / 0.18), transparent 70%)',
                }}
              />
              <div className="relative">
                <span className="overline mb-3 block">Avant-première</span>
                <h4 className="font-cormorant text-2xl text-cosmos-cream font-light mb-2">
                  Membres fondateurs
                </h4>
                <p className="text-sm text-cosmos-cream/80 font-inter font-light">
                  Entrez dans le cercle avant tout le monde. Les premiers membres
                  gardent toujours une longueur d'avance.
                </p>
              </div>
              <Link
                to="/fidelite"
                className="relative inline-flex items-center gap-2 text-cosmos-gold text-xs uppercase tracking-[0.15em] font-inter font-medium hover:gap-3 transition-all mt-4"
              >
                Pré-inscription <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ MAISONS À LA UNE (curation) ════════ */}
      <FeaturedBrands />

      {/* ════════ EN CHIFFRES ════════ */}
      <section className="py-20 md:py-28 bg-cosmos-night relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <GrainOverlay opacity={0.05} />
        <div className="container-cosmos relative z-10">
          <div className="text-center mb-16">
            <span className="overline mb-4 block">{t('home.stats.overline')}</span>
            <h2 className="section-title-light">{t('home.stats.title')}</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px">
            {[
              { ref: stat1.ref, count: stat1.count, suffix: ' m²', label: t('home.stats.commercialArea') },
              { ref: stat2.ref, count: stat2.count, suffix: '+', label: t('home.stats.gradeAStores') },
              { ref: stat3.ref, count: stat3.count, suffix: '', label: t('home.stats.parkingSpaces') },
              { ref: stat4.ref, count: stat4.count, suffix: 'M', label: t('home.stats.visitorsPerYear') },
            ].map((stat, index) => (
              <div
                key={index}
                ref={stat.ref}
                className="bg-white/5 backdrop-blur-sm border border-white/5 p-8 md:p-12 text-center hover:bg-white/[0.08] transition-colors"
              >
                <div className="font-cormorant text-4xl md:text-5xl lg:text-6xl text-cosmos-cream font-light mb-2">
                  {stat.count.toLocaleString()}
                  <span className="text-cosmos-cream/80">{stat.suffix}</span>
                </div>
                <div className="text-[11px] text-cosmos-cream/80 uppercase tracking-[0.15em] font-inter font-light">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ PROXIMITÉ & ACCÈS ════════ */}
      <ProximityAccess />

      {/* ════════ TÉMOIGNAGES ════════ */}
      <TestimonialsSection />

      {/* ════════ CERTIFICATION EDGE ════════ */}
      <section className="section bg-cosmos-cream" ref={edgeReveal.ref}>
        <div className="container-cosmos">
          <div
            className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${
              edgeReveal.isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            <div className="relative group">
              <OptimizedImage
                src={edgeBuilding}
                alt="Cosmos Angré, architecture durable certifiée EDGE"
                containerClassName="rounded-lg"
                hoverZoom
                aspectRatio="4/3"
              />
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-white p-4 rounded-lg shadow-lg animate-float">
                <img
                  src={edgeLogo}
                  alt="Certification EDGE"
                  className="w-16 h-16 md:w-20 md:h-20 object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <div>
              <span className="overline mb-4 block">{t('home.edge.overline')}</span>
              <h2 className="section-title mb-6">{t('home.edge.title')}</h2>
              <p className="text-text-secondary font-inter font-light mb-8 leading-relaxed">
                {t('home.edge.description')}
              </p>

              <div className="space-y-5 mb-10">
                {[
                  { icon: Zap, text: t('home.edge.energy') },
                  { icon: Droplets, text: t('home.edge.water') },
                  { icon: Leaf, text: t('home.edge.materials') },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 flex items-center justify-center bg-cosmos-night/5 rounded-md flex-shrink-0">
                      <item.icon className="w-5 h-5 text-cosmos-night" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm text-text-secondary font-inter font-light pt-2.5">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              <Link to="/a-propos#edge" className="btn-secondary">
                En savoir plus
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ COSMOS CLUB ════════ */}
      <section className="section bg-cosmos-night relative overflow-hidden" ref={clubReveal.ref}>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/[0.03] to-transparent" />
        <GrainOverlay opacity={0.05} />

        <div className="container-cosmos relative z-10">
          <div
            className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${
              clubReveal.isVisible ? 'animate-fade-in-up' : 'opacity-0'
            }`}
          >
            <div>
              <span className="overline mb-4 block">{t('home.club.overline')}</span>
              <h2 className="section-title-light mb-6">{t('home.club.title')}</h2>
              <p className="text-cosmos-cream/80 font-inter font-light mb-10 leading-relaxed">
                {t('home.club.description')}
              </p>

              <div className="space-y-4 mb-10">
                {[
                  { level: t('home.club.silver.level'), desc: t('home.club.silver.desc'), icon: Star },
                  { level: t('home.club.gold.level'), desc: t('home.club.gold.desc'), icon: Crown },
                  { level: t('home.club.platinum.level'), desc: t('home.club.platinum.desc'), icon: Award },
                ].map((tier, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-white/5 rounded-md border border-white/5 hover:border-white/20 transition-colors"
                  >
                    <tier.icon className="w-5 h-5 text-cosmos-cream/80 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                    <div>
                      <span className="text-sm text-cosmos-cream font-inter font-medium">{tier.level}</span>
                      <p className="text-xs text-cosmos-cream/80 font-inter font-light mt-0.5">{tier.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/fidelite" className="btn-primary">
                {t('home.club.joinCta')}
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </div>

            {/* Carte membre flottante dans son halo */}
            <div className="flex items-center justify-center">
              <div className="relative w-80 h-48 md:w-96 md:h-56">
                <div
                  className="absolute -inset-12 rounded-full pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgb(var(--cosmos-gold) / 0.16), transparent 70%)',
                  }}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cosmos-gold via-cosmos-gold-light to-cosmos-gold shadow-gold-lg transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="font-cormorant text-lg text-cosmos-night font-medium tracking-wide">
                        COSMOS CLUB
                      </span>
                      <Crown className="w-6 h-6 text-cosmos-night/60" strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="w-10 h-7 rounded-sm bg-cosmos-night/20 mb-4" />
                      <div className="text-xs text-cosmos-night/60 font-inter tracking-[0.3em] uppercase">
                        **** **** **** 2026
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-cosmos-night/60 font-inter uppercase tracking-wider">
                        Platinum
                      </span>
                      <Gift className="w-5 h-5 text-cosmos-night/40" strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ AGENDA ════════ */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos">
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="overline mb-4 block">{t('home.upcomingEvents.overline')}</span>
              <h2 className="section-title">{t('home.upcomingEvents.title')}</h2>
            </div>
            <Link
              to="/evenements"
              className="hidden md:inline-flex items-center gap-2 text-cosmos-gold text-xs uppercase tracking-[0.15em] font-inter font-medium hover:gap-3 transition-all"
            >
              {t('home.upcomingEvents.viewAll')} <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                date: { day: '15', month: 'Oct' },
                title: t('home.upcomingEvents.softOpening.title'),
                location: t('home.upcomingEvents.softOpening.location'),
                desc: t('home.upcomingEvents.softOpening.desc'),
                image: galleryInterior,
              },
              {
                date: { day: '01', month: 'Nov' },
                title: t('home.upcomingEvents.grandInauguration.title'),
                location: t('home.upcomingEvents.grandInauguration.location'),
                desc: t('home.upcomingEvents.grandInauguration.desc'),
                image: galaEvent,
              },
              {
                date: { day: '20', month: 'Déc' },
                title: t('home.upcomingEvents.christmasMarket.title'),
                location: t('home.upcomingEvents.christmasMarket.location'),
                desc: t('home.upcomingEvents.christmasMarket.desc'),
                image: christmasMarket,
              },
            ].map((event, index) => (
              <Reveal key={index} delay={index * 110} className="card group h-full">
                <div className="relative overflow-hidden aspect-[16/10]">
                  <OptimizedImage
                    src={event.image}
                    alt={event.title}
                    containerClassName="absolute inset-0"
                    hoverZoom
                    overlay="gradient-bottom"
                  />
                  <div className="absolute top-4 left-4 bg-cosmos-night/90 backdrop-blur-sm text-cosmos-cream px-3 py-2 rounded-md text-center border border-white/10">
                    <div className="font-cormorant text-xl font-semibold leading-none">{event.date.day}</div>
                    <div className="text-[10px] uppercase tracking-wider font-inter text-cosmos-cream/80">{event.date.month}</div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-3 h-3 text-cosmos-night/40" strokeWidth={1.5} />
                    <span className="text-[11px] text-text-secondary font-inter font-light uppercase tracking-wider">{event.location}</span>
                  </div>
                  <h4 className="font-cormorant text-xl text-cosmos-night font-light mb-2">{event.title}</h4>
                  <p className="text-sm text-text-secondary font-inter font-light">{event.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="md:hidden text-center mt-8">
            <Link to="/evenements" className="btn-secondary">
              {t('home.upcomingEvents.viewAll')}
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════ SERVICES ════════ */}
      <ServicesStrip />

      {/* ════════ COMMUNAUTÉ / UGC ════════ */}
      <InstagramUGC />

      {/* ════════ NEWSLETTER ════════ */}
      <section className="py-20 bg-cosmos-night-deep relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(60% 80% at 50% 0%, rgb(var(--cosmos-gold) / 0.08), transparent 70%)',
          }}
        />
        <GrainOverlay opacity={0.05} />
        <div className="container-cosmos relative z-10 text-center">
          <CosmicDivider variant="dark" className="mb-10" />
          <Sparkles className="w-7 h-7 text-cosmos-gold/70 mx-auto mb-6" strokeWidth={1.25} />
          <span className="overline mb-4 block">{t('home.newsletter.overline')}</span>
          <h2 className="font-cormorant text-3xl md:text-5xl text-cosmos-cream font-light mb-4">
            {t('home.newsletter.title')}
          </h2>
          <p className="text-sm text-cosmos-cream/80 font-inter font-light mb-10 max-w-lg mx-auto">
            {t('home.newsletter.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('home.newsletter.emailPlaceholder')}
              className="input-dark flex-1"
              aria-label={t('home.newsletter.emailPlaceholder')}
            />
            <button className="btn-primary px-6">{t('home.newsletter.subscribe')}</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
