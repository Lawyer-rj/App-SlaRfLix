import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useRecommendations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const recommendToUser = useCallback(async (toUserId, movieId, mediaType = 'movie', message = '', fromUserName = '') => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error: err } = await supabase.from('recommendations').insert({
        from_user_id: user.id,
        to_user_id: toUserId,
        movie_id: movieId,
        media_type: mediaType,
        message: message || null,
        from_user_name: fromUserName || null,
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

  const removeRecommendation = useCallback(async (recommendationId) => {
    try {
      setLoading(true);
      setError(null);

      const { error: err } = await supabase
        .from('recommendations')
        .delete()
        .eq('id', recommendationId);

      if (err) throw err;
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getReceivedRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error: err } = await supabase
        .from('recommendations')
        .select('id, from_user_id, movie_id, message, created_at')
        .eq('to_user_id', user.id)
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

  const getMovieRecommendations = useCallback(async (movieId) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('recommendations')
        .select('id, from_user_id, message, created_at')
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

  return {
    recommendToUser,
    removeRecommendation,
    getReceivedRecommendations,
    getMovieRecommendations,
    loading,
    error,
  };
}
