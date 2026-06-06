import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  type BlogPost,
  type BlogPostInsert,
  type BlogPostUpdate,
  type BlogStatus,
} from '../types/database';

interface UseBlogFilters {
  status?: BlogStatus;
  category?: string;
  search?: string;
}

interface UseBlogReturn {
  posts: BlogPost[];
  isLoading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  getPostBySlug: (slug: string) => Promise<BlogPost | null>;
  createPost: (post: BlogPostInsert) => Promise<BlogPost | null>;
  updatePost: (id: string, post: BlogPostUpdate) => Promise<BlogPost | null>;
  deletePost: (id: string) => Promise<boolean>;
}

export function useBlog(filters: UseBlogFilters = {}): UseBlogReturn {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('publish_date', { ascending: false, nullsFirst: false });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      setPosts(data || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while fetching posts';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while fetching post';
      setError(errorMessage);
      return null;
    }
  };

  const createPost = async (post: BlogPostInsert): Promise<BlogPost | null> => {
    try {
      const { data, error: createError } = await supabase
        .from('blog_posts')
        .insert(post)
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      await fetchPosts();
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while creating post';
      setError(errorMessage);
      return null;
    }
  };

  const updatePost = async (id: string, post: BlogPostUpdate): Promise<BlogPost | null> => {
    try {
      const { data, error: updateError } = await supabase
        .from('blog_posts')
        .update(post)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      await fetchPosts();
      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while updating post';
      setError(errorMessage);
      return null;
    }
  };

  const deletePost = async (id: string): Promise<boolean> => {
    try {
      const { error: deleteError } = await supabase.from('blog_posts').delete().eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      await fetchPosts();
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while deleting post';
      setError(errorMessage);
      return false;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filters.status, filters.category, filters.search]);

  return {
    posts,
    isLoading,
    error,
    fetchPosts,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost,
  };
}
