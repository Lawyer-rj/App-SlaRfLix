import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useUsers() {
  const [error, setError] = useState(null);

  const getAllUsers = async () => {
    setError(null);

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error('Usuário não autenticado');

      const { data, error: err } = await supabase
        .from('users')
        .select('id, full_name')
        .neq('id', currentUser.id)
        .order('full_name');

      if (err) throw err;
      return data || [];
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  return { getAllUsers, error };
}
