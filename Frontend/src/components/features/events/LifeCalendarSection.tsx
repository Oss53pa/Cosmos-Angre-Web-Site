import React, { useMemo, useState } from 'react';
import {
  Sparkles,
  Heart,
  ShoppingBag,
  PartyPopper,
  Calendar,
  Gift,
  Star,
  Sun,
  Music,
  Camera,
  Trophy,
  Leaf,
  type LucideIcon,
} from 'lucide-react';

// Liste blanche des icônes proposées par l'admin (cf. ICON_SUGGESTIONS).
// Évite le barrel import de toute la librairie (~700 Ko) : seules ces icônes sont bundlées.
const HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Heart,
  ShoppingBag,
  PartyPopper,
  Calendar,
  Gift,
  Star,
  Sun,
  Music,
  Camera,
  Trophy,
  Leaf,
};
import {
  useLifeCalendar,
  type LifeCalendarCategory,
  type LifeCalendarEvent,
} from '../../../hooks/useLifeCalendar';
import { MOCK_LIFE_CALENDAR_2026 } from '../../../data/mockLifeCalendar';

// ============================================================
// Constantes design : couleurs / icônes par catégorie
// ------------------------------------------------------------
// 100% theme-aware via tokens cosmos. Échelle de luminance :
//   commercial (le + dark) → famille → communautaire → partenaires (le + clair)
//
//   Token         Premium             Proximité
//   ─────────────────────────────────────────────────────────
//   cosmos-night  Bleu nuit profond   Vert profond
//   cosmos-accent Champagne (or vif)  Terracotta artisanale
//   cosmos-bronze Bronze patiné       Bronze patiné (partagé)
//   cosmos-gold   Or mat              Raphia tressé
// ============================================================
const CATEGORY_META: Record<
  LifeCalendarCategory,
  { label: string; bg: string; ring: string; dot: string; text: string; onBg: string }
> = {
  commercial: {
    label: 'Commercial',
    bg: 'bg-cosmos-night',
    ring: 'ring-cosmos-night',
    dot: 'bg-cosmos-night',
    text: 'text-cosmos-night',
    onBg: 'text-cosmos-cream', // texte sur fond commercial (dark)
  },
  famille: {
    label: 'Famille',
    bg: 'bg-cosmos-accent',
    ring: 'ring-cosmos-accent',
    dot: 'bg-cosmos-accent',
    text: 'text-cosmos-accent',
    onBg: 'text-cosmos-night', // texte sur fond accent (clair-moyen)
  },
  communautaire: {
    label: 'Communautaire',
    bg: 'bg-cosmos-bronze',
    ring: 'ring-cosmos-bronze',
    dot: 'bg-cosmos-bronze',
    text: 'text-cosmos-bronze',
    onBg: 'text-cosmos-cream', // texte sur fond bronze (moyen-dark)
  },
  partenaires: {
    label: 'Partenaires',
    bg: 'bg-cosmos-gold',
    ring: 'ring-cosmos-gold',
    dot: 'bg-cosmos-gold',
    text: 'text-cosmos-gold',
    onBg: 'text-cosmos-night', // texte sur fond gold (clair)
  },
};

const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
const WEEK_DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

const QUARTERS: { id: 'T1' | 'T2' | 'T3' | 'T4'; label: string; months: number[] }[] = [
  { id: 'T1', label: 'Janvier — Mars', months: [0, 1, 2] },
  { id: 'T2', label: 'Avril — Juin', months: [3, 4, 5] },
  { id: 'T3', label: 'Juillet — Septembre', months: [6, 7, 8] },
  { id: 'T4', label: 'Octobre — Décembre', months: [9, 10, 11] },
];

// ============================================================
// Helpers
// ============================================================

/** Renvoie la liste de tous les jours d'un mois indexés à 1, alignés sur lundi=0..dim=6 */
function getMonthGrid(year: number, monthIndex: number): (number | null)[] {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  // JS getDay() : 0=dim, 1=lundi → on convertit en lundi=0
  const offset = (firstDay.getDay() + 6) % 7;
  const cells: (number | null)[] = Array.from({ length: offset }, () => null);
  for (let d = 1; d <= lastDay.getDate(); d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

/** Pour un jour donné, renvoie la première catégorie d'event qui s'y trouve (priorité = ordre des keys) */
function eventForDay(
  events: LifeCalendarEvent[],
  year: number,
  monthIndex: number,
  day: number
): LifeCalendarEvent | undefined {
  const date = new Date(year, monthIndex, day);
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  return events.find((e) => {
    if (e.start_date === iso) return true;
    if (e.end_date && e.start_date <= iso && iso <= e.end_date) return true;
    return false;
  });
}

function eventsInMonths(events: LifeCalendarEvent[], months: number[]): LifeCalendarEvent[] {
  return events
    .filter((e) => {
      const m = new Date(e.start_date).getMonth();
      return months.includes(m);
    })
    .sort((a, b) => a.start_date.localeCompare(b.start_date));
}

function formatDateRange(event: LifeCalendarEvent): string {
  const start = new Date(event.start_date);
  const startDay = start.getDate();
  const startMonth = MONTHS_FR[start.getMonth()]?.slice(0, 4);
  if (!event.end_date || event.end_date === event.start_date) {
    return `${startDay} ${startMonth}`;
  }
  const end = new Date(event.end_date);
  const endDay = end.getDate();
  const endMonth = MONTHS_FR[end.getMonth()]?.slice(0, 4);
  if (start.getMonth() === end.getMonth()) {
    return `${startDay}-${endDay} ${startMonth}`;
  }
  return `${startDay} ${startMonth} – ${endDay} ${endMonth}`;
}

function getLucideIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Sparkles;
  return HIGHLIGHT_ICONS[name] ?? Sparkles;
}

// ============================================================
// Sub-components
// ============================================================

const HighlightCard: React.FC<{ event: LifeCalendarEvent; index: number }> = ({ event, index }) => {
  const Icon = getLucideIcon(event.highlight_icon);
  const tones = [
    // Variation 1 — accent signature (terracotta en Proximité, champagne en Premium)
    {
      gradient: 'bg-gradient-to-br from-cosmos-accent to-cosmos-gold-light',
      text: 'text-cosmos-night',
      subtext: 'text-cosmos-night/75',
    },
    // Variation 2 — surface dark de marque (vert profond / bleu nuit)
    {
      gradient: 'bg-gradient-to-br from-cosmos-night to-cosmos-night-light',
      text: 'text-cosmos-cream',
      subtext: 'text-cosmos-cream/75',
    },
    // Variation 3 — or universel (raphia / or mat)
    {
      gradient: 'bg-gradient-to-br from-cosmos-gold to-cosmos-gold-bright',
      text: 'text-cosmos-night',
      subtext: 'text-cosmos-night/75',
    },
  ] as const;
  const tone = tones[index % tones.length] ?? tones[0]!;
  return (
    <article
      className={`relative overflow-hidden rounded-2xl ${tone.gradient} ${tone.text} p-6 md:p-7 shadow-lg`}
    >
      <Icon className="w-8 h-8 mb-4 opacity-90" strokeWidth={1.5} />
      {event.highlight_label && (
        <span
          className={`text-[10px] uppercase tracking-[0.18em] font-inter font-medium ${tone.subtext} block mb-2`}
        >
          {event.highlight_label}
        </span>
      )}
      <h3
        className={`font-cormorant text-2xl md:text-3xl font-light leading-tight mb-3 ${tone.text}`}
      >
        {event.title}
      </h3>
      <p className={`text-xs uppercase tracking-wide font-inter font-medium ${tone.subtext} mb-3`}>
        {formatDateRange(event).toUpperCase()}
      </p>
      {event.description && (
        <p className={`text-sm font-inter font-light leading-relaxed ${tone.subtext}`}>
          {event.description}
        </p>
      )}
    </article>
  );
};

const MiniMonth: React.FC<{
  year: number;
  monthIndex: number;
  events: LifeCalendarEvent[];
}> = ({ year, monthIndex, events }) => {
  const grid = getMonthGrid(year, monthIndex);
  return (
    <div className="bg-cosmos-cream/40 rounded-lg border border-cosmos-text/10 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-inter text-[11px] uppercase tracking-[0.15em] font-medium text-cosmos-night">
          {MONTHS_FR[monthIndex]}
        </h4>
        <span className="text-[10px] text-cosmos-text/30 font-inter font-medium">
          {String(monthIndex + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEK_DAYS.map((d, i) => (
          <div
            key={i}
            className={`text-[9px] font-inter font-medium ${
              i === 6 ? 'text-cosmos-accent/80' : 'text-cosmos-text/40'
            }`}
          >
            {d}
          </div>
        ))}
        {grid.map((day, i) => {
          if (day === null) return <div key={i} />;
          const ev = eventForDay(events, year, monthIndex, day);
          const isSunday = i % 7 === 6;
          return (
            <div
              key={i}
              className={`relative w-6 h-6 mx-auto flex items-center justify-center text-[10px] rounded-full font-inter ${
                ev
                  ? `${CATEGORY_META[ev.category].bg} ${CATEGORY_META[ev.category].onBg} font-medium`
                  : isSunday
                    ? 'text-cosmos-accent/80'
                    : 'text-cosmos-text/70'
              }`}
              title={ev ? `${ev.title} (${CATEGORY_META[ev.category].label})` : undefined}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const QuarterList: React.FC<{ id: string; label: string; events: LifeCalendarEvent[] }> = ({
  id,
  label,
  events,
}) => (
  <div className="bg-cosmos-cream/40 rounded-lg border border-cosmos-text/10 p-5 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <span className="bg-cosmos-night text-cosmos-cream text-[10px] uppercase tracking-wider font-inter font-bold px-2.5 py-1 rounded">
        {id}
      </span>
      <h4 className="font-inter text-xs uppercase tracking-[0.15em] font-medium text-cosmos-text/70">
        {label}
      </h4>
    </div>
    {events.length === 0 ? (
      <p className="text-sm text-cosmos-text/40 font-inter font-light italic">
        Aucun événement programmé.
      </p>
    ) : (
      <ul className="space-y-2">
        {events.map((e) => (
          <li key={e.id} className="flex items-start gap-3 text-sm">
            <span
              className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${CATEGORY_META[e.category].dot}`}
              aria-hidden="true"
            />
            <span className="text-[11px] uppercase tracking-wide font-inter font-medium text-cosmos-text/60 w-20 flex-shrink-0 mt-0.5">
              {formatDateRange(e)}
            </span>
            <span className="font-inter font-light text-cosmos-text">{e.title}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const Legend: React.FC = () => (
  <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-xs font-inter">
    {(Object.keys(CATEGORY_META) as LifeCalendarCategory[]).map((cat) => (
      <span key={cat} className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${CATEGORY_META[cat].dot}`} aria-hidden="true" />
        <span className="text-cosmos-text/70 font-medium">{CATEGORY_META[cat].label}</span>
      </span>
    ))}
  </div>
);

// ============================================================
// Main component
// ============================================================
interface LifeCalendarSectionProps {
  defaultYear?: number;
}

export const LifeCalendarSection: React.FC<LifeCalendarSectionProps> = ({
  defaultYear = 2026,
}) => {
  const [year, setYear] = useState(defaultYear);
  const { events: dbEvents, isLoading } = useLifeCalendar({ year });

  const events = useMemo<LifeCalendarEvent[]>(() => {
    if (dbEvents.length > 0) return dbEvents;
    if (year === 2026) return MOCK_LIFE_CALENDAR_2026;
    return [];
  }, [dbEvents, year]);

  const highlights = useMemo(() => events.filter((e) => e.is_highlighted).slice(0, 3), [events]);
  const yearChoices = [2025, 2026, 2027];

  return (
    <section className="section bg-cosmos-warm">
      <div className="container-cosmos">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="overline mb-4 block">Calendrier annuel</span>
          <h2 className="section-title mb-3">Calendrier de la vie</h2>
          <p className="text-sm text-cosmos-text/60 font-inter font-light max-w-xl mx-auto">
            Toute l'année rythmée par nos rendez-vous : promotions, fêtes, événements communautaires
            et expériences exclusives.
          </p>

          {/* Year selector */}
          <div className="inline-flex items-center gap-1 mt-8 p-1 bg-cosmos-cream/40 rounded-full border border-cosmos-text/10 shadow-sm">
            {yearChoices.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                aria-pressed={year === y}
                className={`px-4 py-1.5 text-xs font-inter font-medium rounded-full transition-colors ${
                  year === y
                    ? 'bg-cosmos-night text-cosmos-cream'
                    : 'text-cosmos-text/60 hover:text-cosmos-text'
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {isLoading && events.length === 0 && (
          <div role="status" aria-label="Chargement du calendrier" className="text-center py-12">
            <div className="inline-block w-6 h-6 border-2 border-cosmos-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {events.length > 0 && (
          <>
            {/* Highlights */}
            {highlights.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                {highlights.map((e, i) => (
                  <HighlightCard key={e.id} event={e} index={i} />
                ))}
              </div>
            )}

            {/* Mini-month grid 12 mois */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
              {MONTHS_FR.map((_, i) => (
                <MiniMonth key={i} year={year} monthIndex={i} events={events} />
              ))}
            </div>

            {/* Quarterly lists */}
            <div className="mb-8">
              <h3 className="text-center font-cormorant text-2xl text-cosmos-night font-light mb-8">
                Tous les événements {year}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {QUARTERS.map((q) => (
                  <QuarterList
                    key={q.id}
                    id={q.id}
                    label={q.label}
                    events={eventsInMonths(events, q.months)}
                  />
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-cosmos-cream/40 rounded-lg border border-cosmos-text/10 p-5 shadow-sm">
              <Legend />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LifeCalendarSection;
