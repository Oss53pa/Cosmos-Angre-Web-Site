import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { AuditLog, AuditLogInsert, AuditLogStatus } from '../types/database';

interface AuditLogFilters {
  action?: string;
  status?: AuditLogStatus;
  search?: string;
}

export function useAuditLog(filters?: AuditLogFilters) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from('audit_logs').select('*').order('created_at', { ascending: false });

      if (filters?.action) {
        query = query.eq('action', filters.action);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.search) {
        query = query.or(`action.ilike.%${filters.search}%,details.ilike.%${filters.search}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setLogs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [filters?.action, filters?.status, filters?.search]);

  const createLog = useCallback(
    async (data: AuditLogInsert) => {
      setError(null);

      try {
        const { error: insertError } = await supabase.from('audit_logs').insert(data);

        if (insertError) throw insertError;
        await fetchLogs();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err;
      }
    },
    [fetchLogs]
  );

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    isLoading,
    error,
    fetchLogs,
    createLog,
  };
}
