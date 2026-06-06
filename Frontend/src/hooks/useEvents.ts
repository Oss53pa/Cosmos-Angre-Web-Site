import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  type Event,
  type EventInsert,
  type EventUpdate,
  type EventStatus,
} from '../types/database';

interface EventFilters {
  status?: EventStatus;
  category?: string;
  search?: string;
}

interface UseEventsReturn {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  createEvent: (event: EventInsert) => Promise<void>;
  updateEvent: (id: string, event: EventUpdate) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEvents = (filters: EventFilters = {}): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from('events').select('*');

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      query = query.order('start_date', { ascending: false });

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (event: EventInsert) => {
    setError(null);

    try {
      const { error: insertError } = await supabase.from('events').insert(event);

      if (insertError) {
        throw insertError;
      }

      await fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateEvent = async (id: string, event: EventUpdate) => {
    setError(null);

    try {
      const { error: updateError } = await supabase.from('events').update(event).eq('id', id);

      if (updateError) {
        throw updateError;
      }

      await fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    setError(null);

    try {
      const { error: deleteError } = await supabase.from('events').delete().eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      await fetchEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters.status, filters.category, filters.search]);

  return {
    events,
    isLoading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
