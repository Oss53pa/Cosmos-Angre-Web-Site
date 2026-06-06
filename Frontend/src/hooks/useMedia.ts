import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { type MediaFile, type MediaFileInsert, type MediaType } from '../types/database';

interface UseMediaFilter {
  type?: MediaType;
}

interface UseMediaReturn {
  files: MediaFile[];
  isLoading: boolean;
  error: string | null;
  fetchFiles: () => Promise<void>;
  uploadFile: (file: File, type: MediaType, bucket?: string) => Promise<MediaFile | null>;
  deleteFile: (id: string, path: string, bucket?: string) => Promise<void>;
  setActiveLogo: (id: string) => Promise<void>;
  getActiveLogo: () => Promise<MediaFile | null>;
}

export const useMedia = (filter?: UseMediaFilter): UseMediaReturn => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from('media').select('*').order('created_at', { ascending: false });

      if (filter?.type) {
        query = query.eq('type', filter.type);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setFiles(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch files';
      setError(errorMessage);
      console.error('Error fetching files:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filter?.type]);

  const uploadFile = async (
    file: File,
    type: MediaType,
    bucket = 'media'
  ): Promise<MediaFile | null> => {
    setError(null);

    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const path = `${type}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);

      // Insert record into media table
      const mediaInsert: MediaFileInsert = {
        name: file.name,
        path: path,
        url: urlData.publicUrl,
        type: type,
        size: file.size,
        mime_type: file.type,
      };

      const { data, error: insertError } = await supabase
        .from('media')
        .insert(mediaInsert)
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Refresh files list
      await fetchFiles();

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      console.error('Error uploading file:', err);
      return null;
    }
  };

  const deleteFile = async (id: string, path: string, bucket = 'media'): Promise<void> => {
    setError(null);

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage.from(bucket).remove([path]);

      if (storageError) {
        throw storageError;
      }

      // Delete from media table
      const { error: deleteError } = await supabase.from('media').delete().eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      // Refresh files list
      await fetchFiles();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete file';
      setError(errorMessage);
      console.error('Error deleting file:', err);
      throw err;
    }
  };

  const setActiveLogo = async (id: string): Promise<void> => {
    setError(null);

    try {
      // Set all media is_active_logo to false
      const { error: resetError } = await supabase
        .from('media')
        .update({ is_active_logo: false })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all records

      if (resetError) {
        throw resetError;
      }

      // Set target media is_active_logo to true
      const { error: updateError } = await supabase
        .from('media')
        .update({ is_active_logo: true })
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      // Refresh files list
      await fetchFiles();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set active logo';
      setError(errorMessage);
      console.error('Error setting active logo:', err);
      throw err;
    }
  };

  const getActiveLogo = async (): Promise<MediaFile | null> => {
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('media')
        .select('*')
        .eq('is_active_logo', true)
        .single();

      if (fetchError) {
        // If no active logo found, don't treat it as an error
        if (fetchError.code === 'PGRST116') {
          return null;
        }
        throw fetchError;
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get active logo';
      setError(errorMessage);
      console.error('Error getting active logo:', err);
      return null;
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return {
    files,
    isLoading,
    error,
    fetchFiles,
    uploadFile,
    deleteFile,
    setActiveLogo,
    getActiveLogo,
  };
};
