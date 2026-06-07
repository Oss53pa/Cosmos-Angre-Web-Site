import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, MapPin, Clock, Users, ArrowRight, CalendarDays, ListChecks } from 'lucide-react';

import OptimizedImage from '../../components/common/OptimizedImage';
import PageHero from '../../components/common/PageHero';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd } from '../../lib/seo/jsonLd';
import { useContent } from '../../lib/content/SiteContentProvider';
import LifeCalendarSection from '../../components/features/events/LifeCalendarSection';
import galaEvent from '../../assets/images/branding/gala-event.jpg';
import eventHall from '../../assets/images/branding/event-hall.jpg';
import expoConvention from '../../assets/images/branding/expo-convention.jpg';

type EventsTab = 'agenda' | 'calendar';

const EventsPage: React.FC = () => {
  const { t } = useTranslation();
  const { c } = useContent();
  const [activeTab, setActiveTab] = useState<EventsTab>('agenda');

  const upcomingEvents = [
    { id: 1, key: 'event1' },
    { id: 2, key: 'event2' },
    { id: 3, key: 'event3' },
  ];

  const eventSpaces = [
    { key: 'grandeSalle', image: eventHall },
    { key: 'espaceModulable', image: expoConvention },
  ];

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title="Événements & expériences"
        description="Concerts, galas, expositions, ateliers et expériences exclusives à Cosmos Angré. Découvrez l'agenda événementiel premium de Cocody-Angré, Abidjan."
        keywords={[
          'événements Abidjan',
          'concerts Cocody',
          'gala Cosmos',
          'agenda culturel',
          'expériences premium',
          'calendrier de la vie',
        ]}
        jsonLd={breadcrumbJsonLd([
          { name: 'Accueil', url: '/' },
          { name: 'Événements', url: '/evenements' },
        ])}
      />

      <PageHero
        image={c('events.hero.image') || galaEvent}
        alt="Événements Cosmos Angré"
        overline={c('events.hero.overline', t('events.hero.overline'))}
        title={c('events.hero.title', t('events.hero.title'))}
        subtitle={c('events.hero.subtitle', t('events.hero.subtitle'))}
      />

      {/* Tabs */}
      <nav
        className="sticky top-0 z-30 bg-cosmos-warm/95 backdrop-blur-sm border-b border-cosmos-text/10"
        aria-label="Sections événements"
      >
        <div className="container-cosmos">
          <div className="flex justify-center gap-2 py-3">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'agenda'}
              onClick={() => setActiveTab('agenda')}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-[0.15em] font-inter font-medium rounded-full transition-colors ${
                activeTab === 'agenda'
                  ? 'bg-cosmos-night text-cosmos-cream'
                  : 'text-cosmos-text/60 hover:text-cosmos-text hover:bg-cosmos-cream'
              }`}
            >
              <ListChecks className="w-4 h-4" strokeWidth={1.5} />
              Agenda
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'calendar'}
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-[0.15em] font-inter font-medium rounded-full transition-colors ${
                activeTab === 'calendar'
                  ? 'bg-cosmos-night text-cosmos-cream'
                  : 'text-cosmos-text/60 hover:text-cosmos-text hover:bg-cosmos-cream'
              }`}
            >
              <CalendarDays className="w-4 h-4" strokeWidth={1.5} />
              Calendrier de la vie
            </button>
          </div>
        </div>
      </nav>

      {/* === Tab content === */}
      {activeTab === 'agenda' ? (
        <>
          {/* Upcoming Events */}
          <section className="section bg-cosmos-warm">
            <div className="container-cosmos">
              <div className="text-center mb-16">
                <span className="overline mb-4 block">{t('events.upcoming.overline')}</span>
                <h2 className="section-title">{t('events.upcoming.title')}</h2>
              </div>

              <div className="space-y-5">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="card group p-8 hover-lift">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                      <div className="flex-1">
                        <span className="text-[10px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium mb-2 block">
                          {t(`events.upcoming.${event.key}.category`)}
                        </span>
                        <h3 className="font-cormorant text-2xl text-cosmos-night font-light mb-4">
                          {t(`events.upcoming.${event.key}.title`)}
                        </h3>
                        <div className="flex flex-wrap gap-5 text-xs text-text-secondary font-inter font-light">
                          <span className="flex items-center gap-2">
                            <Calendar
                              className="w-4 h-4 text-cosmos-night/40"
                              strokeWidth={1.5}
                            />
                            {t(`events.upcoming.${event.key}.date`)}
                          </span>
                          <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-cosmos-night/40" strokeWidth={1.5} />
                            {t(`events.upcoming.${event.key}.time`)}
                          </span>
                          <span className="flex items-center gap-2">
                            <MapPin
                              className="w-4 h-4 text-cosmos-night/40"
                              strokeWidth={1.5}
                            />
                            {t(`events.upcoming.${event.key}.location`)}
                          </span>
                          <span className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-cosmos-night/40" strokeWidth={1.5} />
                            {t(`events.upcoming.${event.key}.attendees`)}
                          </span>
                        </div>
                      </div>
                      <Link
                        to={`/evenements/${event.id}`}
                        className="btn-secondary text-xs px-6 py-3 self-start sm:self-center"
                      >
                        {t('common.learnMore')}{' '}
                        <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Event Spaces */}
          <section className="section bg-cosmos-cream">
            <div className="container-cosmos">
              <div className="text-center mb-16">
                <span className="overline mb-4 block">{t('events.spaces.overline')}</span>
                <h2 className="section-title">{t('events.spaces.title')}</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {eventSpaces.map((space, index) => (
                  <div key={index} className="card group overflow-hidden">
                    <div className="aspect-[16/10]">
                      <OptimizedImage
                        src={space.image}
                        alt={t(`events.spaces.${space.key}.name`)}
                        containerClassName="w-full h-full"
                        overlay="gradient-bottom"
                        hoverZoom
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-cormorant text-2xl text-cosmos-night font-light mb-3">
                        {t(`events.spaces.${space.key}.name`)}
                      </h3>
                      <div className="flex gap-6 text-xs text-text-secondary font-inter font-light">
                        <span>
                          {t('events.spaces.capacity')} :{' '}
                          <span className="text-cosmos-night">
                            {t(`events.spaces.${space.key}.capacity`)}
                          </span>
                        </span>
                        <span>
                          {t('events.spaces.surface')} :{' '}
                          <span className="text-cosmos-night">
                            {t(`events.spaces.${space.key}.surface`)}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <LifeCalendarSection defaultYear={new Date().getFullYear()} />
      )}

      {/* CTA */}
      <section className="py-20 bg-cosmos-night">
        <div className="container-cosmos text-center">
          <span className="overline mb-4 block">{t('events.cta.overline')}</span>
          <h2 className="font-cormorant text-3xl md:text-5xl text-cosmos-cream font-light mb-4">
            {t('events.cta.title')}
          </h2>
          <p className="text-sm text-cosmos-cream/60 font-inter font-light mb-10 max-w-lg mx-auto">
            {t('events.cta.subtitle')}
          </p>
          <Link to="/contact" className="btn-primary">
            {t('common.contactUs')} <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;
