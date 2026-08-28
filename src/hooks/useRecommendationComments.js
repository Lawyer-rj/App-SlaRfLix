import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useRecommendationComments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addComment = useCallback(async (recommendationId, comment, userName) => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { error: err } = await supabase.from('recommendation_comments').insert({
        recommendation_id: recommendationId,
        user_id: user.id,
        user_name: userName || 'Usuário',
        comment,
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

  const getComments = useCallback(async (recommendationId) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: err } = await supabase
        .from('recommendation_comments')
        .select('id, user_name, comment, created_at')
        .eq('recommendation_id', recommendationId)
        .order('created_at', { ascending: true });

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
    addComment,
    getComments,
    loading,
    error,
  };
}
