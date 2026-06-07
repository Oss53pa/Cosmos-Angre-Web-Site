import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, Users, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd, eventJsonLd } from '../../lib/seo/jsonLd';
import Reveal from '../../components/common/Reveal';
import galaEvent from '../../assets/images/branding/gala-event.jpg';
import fashionShow from '../../assets/images/branding/fashion-show.jpg';
import christmasMarket from '../../assets/images/branding/christmas-market.jpg';

const EventDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const events = [
    {
      id: '1',
      title: 'Soiree de Lancement',
      date: '15 Decembre 2025',
      time: '18h00 - 22h00',
      location: 'Galerie Principale',
      attendees: '500+',
      category: 'Evenement Corporate',
      description: 'Celebrez avec nous l\'ouverture officielle de Cosmos Angre. Une soiree exclusive avec cocktail, performances live et decouverte des espaces du centre.',
      image: galaEvent,
    },
    {
      id: '2',
      title: 'Fashion Week Abidjan',
      date: '20-22 Janvier 2026',
      time: '14h00 - 21h00',
      location: 'Espace Evenementiel',
      attendees: '1000+',
      category: 'Mode',
      description: 'Trois jours dedies a la mode africaine et internationale. Defiles, expositions et rencontres avec les createurs.',
      image: fashionShow,
    },
    {
      id: '3',
      title: 'Marche de Noel',
      date: '1-24 Decembre 2025',
      time: '10h00 - 20h00',
      location: 'Promenade Exterieure',
      attendees: 'Ouvert a tous',
      category: 'Festival',
      description: 'Artisanat local, saveurs de fete et animations pour toute la famille dans un cadre feerique.',
      image: christmasMarket,
    },
  ];

  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <div className="min-h-screen bg-cosmos-night flex items-center justify-center">
        <Seo title={t('eventDetail.notFound', 'Événement introuvable')} noindex />
        <div className="text-center px-6">
          <h1 className="font-cormorant text-3xl text-cosmos-cream font-light mb-4">{t('eventDetail.notFound')}</h1>
          <Link to="/evenements" className="btn-primary">{t('eventDetail.backToEvents')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title={event.title}
        description={event.description.slice(0, 160)}
        image={event.image}
        type="article"
        keywords={[event.title, event.category, 'événement Abidjan', 'Cosmos Angré']}
        jsonLd={[
          breadcrumbJsonLd([
            { name: 'Accueil', url: '/' },
            { name: 'Événements', url: '/evenements' },
            { name: event.title, url: `/evenements/${event.id}` },
          ]),
          eventJsonLd({
            title: event.title,
            slug: event.id,
            description: event.description,
            image: event.image,
            location: event.location,
            organizer: 'Cosmos Angré',
          }),
        ]}
      />
      {/* Hero */}
      <section className="relative h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 animate-ken-burns" style={{ backgroundImage: `url(${event.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-cosmos-night via-cosmos-night/60 to-transparent" />
        <div className="container-cosmos relative z-10 pb-12">
          <Link to="/evenements" className="inline-flex items-center gap-2 text-cosmos-cream/60 hover:text-cosmos-cream font-inter text-xs mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> {t('eventDetail.allEvents')}
          </Link>
          <span className="text-[10px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium block mb-3">{event.category}</span>
          <h1 className="font-cormorant text-4xl md:text-6xl text-cosmos-cream font-light">{event.title}</h1>
        </div>
      </section>

      {/* Details */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos max-w-4xl">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Calendar, label: t('eventDetail.date'), value: event.date },
              { icon: Clock, label: t('eventDetail.time'), value: event.time },
              { icon: MapPin, label: t('eventDetail.location'), value: event.location },
              { icon: Users, label: t('eventDetail.capacity'), value: event.attendees },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 70} className="card p-5 text-center">
                <item.icon className="w-5 h-5 text-cosmos-gold mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-[10px] uppercase tracking-[0.15em] text-text-secondary font-inter mb-1">{item.label}</p>
                <p className="text-sm font-inter font-medium text-cosmos-night">{item.value}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="card p-6 sm:p-10">
            <h2 className="font-cormorant text-2xl text-cosmos-night font-light mb-6">{t('eventDetail.about')}</h2>
            <p className="text-sm text-text-secondary font-inter font-light leading-relaxed mb-8">{event.description}</p>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary">
                {t('eventDetail.register')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </button>
              <button className="btn-secondary">
                <Share2 className="w-4 h-4" strokeWidth={1.5} /> {t('eventDetail.share')}
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default EventDetailPage;
