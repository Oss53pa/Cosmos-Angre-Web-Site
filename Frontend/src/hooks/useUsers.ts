import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile, ProfileUpdate, UserRole } from '../types/database';

interface UserFilters {
  role?: UserRole;
  status?: string;
  search?: string;
}

export function useUsers(filters?: UserFilters) {
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from('profiles').select('*').order('created_at', { ascending: false });

      if (filters?.role) {
        query = query.eq('role', filters.role);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.search) {
        query = query.or(
          `first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        );
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [filters?.role, filters?.status, filters?.search]);

  const updateUser = useCallback(
    async (id: string, data: ProfileUpdate) => {
      setError(null);

      try {
        const { error: updateError } = await supabase.from('profiles').update(data).eq('id', id);

        if (updateError) throw updateError;
        await fetchUsers();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    [fetchUsers]
  );

  const deleteUser = useCallback(
    async (id: string) => {
      setError(null);

      try {
        const { error: deleteError } = await supabase.from('profiles').delete().eq('id', id);

        if (deleteError) throw deleteError;
        await fetchUsers();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    [fetchUsers]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    updateUser,
    deleteUser,
  };
}
