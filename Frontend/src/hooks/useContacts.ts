import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Contact, ContactInsert } from '../types/database';

interface ContactFilters {
  isRead?: boolean;
}

export function useContacts(filters?: ContactFilters) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from('contacts').select('*').order('created_at', { ascending: false });

      if (filters?.isRead !== undefined) {
        query = query.eq('is_read', filters.isRead);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setContacts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [filters?.isRead]);

  const submitContact = useCallback(
    async (data: ContactInsert) => {
      setError(null);

      try {
        const { error: insertError } = await supabase.from('contacts').insert(data);

        if (insertError) throw insertError;
        await fetchContacts();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    [fetchContacts]
  );

  const markAsRead = useCallback(
    async (id: string) => {
      setError(null);

      try {
        const { error: updateError } = await supabase
          .from('contacts')
          .update({ is_read: true })
          .eq('id', id);

        if (updateError) throw updateError;
        await fetchContacts();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    [fetchContacts]
  );

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    contacts,
    isLoading,
    error,
    fetchContacts,
    submitContact,
    markAsRead,
  };
}
