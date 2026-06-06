import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export type LifeCalendarCategory = 'commercial' | 'famille' | 'communautaire' | 'partenaires';

export interface LifeCalendarEvent {
  id: string;
  year: number;
  title: string;
  description: string | null;
  category: LifeCalendarCategory;
  start_date: string; // ISO YYYY-MM-DD
  end_date: string | null;
  is_highlighted: boolean;
  highlight_label: string | null;
  highlight_icon: string | null;
  highlight_color: string | null;
  image: string | null;
  cta_url: string | null;
  display_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export type LifeCalendarEventInsert = Omit<
  LifeCalendarEvent,
  'id' | 'created_at' | 'updated_at'
>;

export type LifeCalendarEventUpdate = Partial<LifeCalendarEventInsert>;

interface UseLifeCalendarOptions {
  year?: number;
  /** Si true, ne charge que les highlights */
  highlightsOnly?: boolean;
  /** Pour l'admin : inclure les non-publiés */
  includeUnpublished?: boolean;
}

export function useLifeCalendar({
  year,
  highlightsOnly = false,
  includeUnpublished = false,
}: UseLifeCalendarOptions = {}) {
  const targetYear = year ?? new Date().getFullYear();
  const [events, setEvents] = useState<LifeCalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    let query = supabase
      .from('life_calendar_events')
      .select('*')
      .eq('year', targetYear)
      .order('display_order', { ascending: true })
      .order('start_date', { ascending: true });

    if (!includeUnpublished) query = query.eq('is_published', true);
    if (highlightsOnly) query = query.eq('is_highlighted', true);

    const { data, error: fetchError } = await query;
    if (fetchError) {
      setError(fetchError.message);
      setEvents([]);
    } else {
      setEvents((data ?? []) as LifeCalendarEvent[]);
    }
    setIsLoading(false);
  }, [targetYear, highlightsOnly, includeUnpublished]);

  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

  // Mutations admin
  const createEvent = async (data: LifeCalendarEventInsert): Promise<{ error: string | null }> => {
    const { error: insertError } = await supabase.from('life_calendar_events').insert(data);
    if (insertError) return { error: insertError.message };
    await fetchEvents();
    return { error: null };
  };

  const updateEvent = async (
    id: string,
    data: LifeCalendarEventUpdate
  ): Promise<{ error: string | null }> => {
    const { error: updateError } = await supabase
      .from('life_calendar_events')
      .update(data)
      .eq('id', id);
    if (updateError) return { error: updateError.message };
    await fetchEvents();
    return { error: null };
  };

  const deleteEvent = async (id: string): Promise<{ error: string | null }> => {
    const { error: deleteError } = await supabase
      .from('life_calendar_events')
      .delete()
      .eq('id', id);
    if (deleteError) return { error: deleteError.message };
    await fetchEvents();
    return { error: null };
  };

  return {
    events,
    isLoading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
