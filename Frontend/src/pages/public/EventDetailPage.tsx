import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin, Users, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import Seo from '../../lib/seo/Seo';
import { breadcrumbJsonLd, eventJsonLd } from '../../lib/seo/jsonLd';
import Reveal from '../../components/common/Reveal';
import { supabase } from '../../lib/supabase';
import galaEvent from '../../assets/images/branding/gala-event.jpg';

interface EventRow {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  image: string | null;
  start_date: string | null;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  category: string | null;
  max_participants: number | null;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function formatRange(start?: string | null, end?: string | null): string {
  if (!start) return '—';
  const o: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  const s = new Date(start).toLocaleDateString('fr-FR', o);
  if (end && end !== start) return `${s} – ${new Date(end).toLocaleDateString('fr-FR', o)}`;
  return s;
}

const EventDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const db = supabase as unknown as {
          from: (t: string) => {
            select: (c: string) => {
              eq: (c: string, v: string) => { limit: (n: number) => Promise<{ data: EventRow[] | null }> };
            };
          };
        };
        // Recherche par slug, puis par id (uuid)
        let row: EventRow | null = null;
        const bySlug = await db.from('events').select('*').eq('slug', id ?? '').limit(1);
        row = bySlug.data?.[0] ?? null;
        if (!row && id && UUID_RE.test(id)) {
          const byId = await db.from('events').select('*').eq('id', id).limit(1);
          row = byId.data?.[0] ?? null;
        }
        if (active) setEvent(row);
      } catch {
        if (active) setEvent(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cosmos-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-cosmos-night flex items-center justify-center">
        <Seo title={t('eventDetail.notFound', 'Événement introuvable')} noindex />
        <div className="text-center px-6">
          <h1 className="font-cormorant text-3xl text-cosmos-cream font-light mb-4">{t('eventDetail.notFound', 'Événement introuvable')}</h1>
          <Link to="/evenements" className="btn-primary">{t('eventDetail.backToEvents', 'Retour aux événements')}</Link>
        </div>
      </div>
    );
  }

  const image = event.image || galaEvent;
  const description = event.description || '';
  const dateLabel = formatRange(event.start_date, event.end_date);
  const timeLabel = event.start_time
    ? `${event.start_time}${event.end_time ? ` - ${event.end_time}` : ''}`
    : '—';
  const capacityLabel =
    typeof event.max_participants === 'number' && event.max_participants > 0
      ? `${event.max_participants} places`
      : 'Entrée libre';

  return (
    <div className="bg-cosmos-warm">
      <Seo
        title={event.title}
        description={description.slice(0, 160)}
        image={image}
        type="article"
        keywords={[event.title, event.category || 'événement', 'événement Abidjan', 'Cosmos Angré']}
        jsonLd={[
          breadcrumbJsonLd([
            { name: 'Accueil', url: '/' },
            { name: 'Événements', url: '/evenements' },
            { name: event.title, url: `/evenements/${event.slug ?? event.id}` },
          ]),
          eventJsonLd({
            title: event.title,
            slug: event.slug ?? event.id,
            description,
            image,
            location: event.location || '',
            organizer: 'Cosmos Angré',
          }),
        ]}
      />
      {/* Hero */}
      <section className="relative h-[50vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 animate-ken-burns" style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-cosmos-night via-cosmos-night/60 to-transparent" />
        <div className="container-cosmos relative z-10 pb-12">
          <Link to="/evenements" className="inline-flex items-center gap-2 text-cosmos-cream/60 hover:text-cosmos-cream font-inter text-xs mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> {t('eventDetail.allEvents')}
          </Link>
          {event.category && (
            <span className="text-[10px] uppercase tracking-[0.15em] text-cosmos-gold font-inter font-medium block mb-3">{event.category}</span>
          )}
          <h1 className="font-cormorant text-4xl md:text-6xl text-cosmos-cream font-light">{event.title}</h1>
        </div>
      </section>

      {/* Details */}
      <section className="section bg-cosmos-warm">
        <div className="container-cosmos max-w-4xl">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Calendar, label: t('eventDetail.date'), value: dateLabel },
              { icon: Clock, label: t('eventDetail.time'), value: timeLabel },
              { icon: MapPin, label: t('eventDetail.location'), value: event.location || '—' },
              { icon: Users, label: t('eventDetail.capacity'), value: capacityLabel },
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
            <p className="text-sm text-text-secondary font-inter font-light leading-relaxed mb-8 whitespace-pre-line">{description}</p>
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
