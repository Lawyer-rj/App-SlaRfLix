import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useRecommendations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addRecommendation = useCallback(async (movieId, mediaType = 'movie', comment = '') => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error: err } = await supabase.from('recommendations').insert({
        user_id: user.id,
        movie_id: movieId,
        media_type: mediaType,
        comment: comment || null,
      });

      if (err) throw err;
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeRecommendation = useCallback(async (movieId) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error: err } = await supabase
        .from('recommendations')
        .delete()
        .eq('user_id', user.id)
        .eq('movie_id', movieId);

      if (err) throw err;
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecommendations = useCallback(async (movieId) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('recommendations')
        .select('id, user_id, comment, created_at')
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false });

      if (err) throw err;
      return data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const hasRecommended = useCallback(async (movieId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error: err } = await supabase
        .from('recommendations')
        .select('id')
        .eq('user_id', user.id)
        .eq('movie_id', movieId)
        .single();

      if (err && err.code !== 'PGRST116') throw err;
      return !!data;
    } catch (err) {
      return false;
    }
  }, []);

  return {
    addRecommendation,
    removeRecommendation,
    getRecommendations,
    hasRecommended,
    loading,
    error,
  };
}
