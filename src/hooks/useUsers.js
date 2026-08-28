import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useUsers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error('Usuário não autenticado');

      const { data, error: err } = await supabase
        .from('auth.users')
        .select('id, user_metadata->full_name as full_name')
        .neq('id', currentUser.id)
        .order('user_metadata->full_name');

      if (err) throw err;
      return data || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { getAllUsers, loading, error };
}
