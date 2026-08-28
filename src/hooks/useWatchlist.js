import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export function useWatchlist() {
  const { user } = useContext(AuthContext)

  const addToWatchlist = async (movieId, title, posterPath, status = 'want_to_watch') => {
    if (!user) throw new Error('Você precisa estar logado')

    const { data, error } = await supabase
      .from('watchlist')
      .insert([{
        user_id: user.id,
        movie_id: movieId,
        title,
        poster_path: posterPath,
        status
      }])
      .select()

    if (error) throw new Error(error.message)
    return data[0]
  }

  const removeFromWatchlist = async (movieId) => {
    if (!user) throw new Error('Você precisa estar logado')

    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('user_id', user.id)
      .eq('movie_id', movieId)

    if (error) throw new Error(error.message)
  }

  const getWatchlist = async () => {
    if (!user) throw new Error('Você precisa estar logado')

    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', user.id)

    if (error) throw new Error(error.message)
    return data
  }

  const updateWatchlistStatus = async (movieId, status) => {
    if (!user) throw new Error('Você precisa estar logado')

    const { error } = await supabase
      .from('watchlist')
      .update({ status })
      .eq('user_id', user.id)
      .eq('movie_id', movieId)

    if (error) throw new Error(error.message)
  }

  return { addToWatchlist, removeFromWatchlist, getWatchlist, updateWatchlistStatus }
}
