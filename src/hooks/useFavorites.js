import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export function useFavorites() {
  const { user } = useContext(AuthContext)

  const addFavorite = async (movieId, title, posterPath) => {
    if (!user) throw new Error('Você precisa estar logado')

    const { data, error } = await supabase
      .from('favorites')
      .insert([{
        user_id: user.id,
        movie_id: movieId,
        title,
        poster_path: posterPath
      }])
      .select()

    if (error) throw new Error(error.message)
    return data[0]
  }

  const removeFavorite = async (movieId) => {
    if (!user) throw new Error('Você precisa estar logado')

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('movie_id', movieId)

    if (error) throw new Error(error.message)
  }

  const isFavorite = async (movieId) => {
    if (!user) return false

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('movie_id', movieId)
        .single()

      if (error) return false
      return !!data
    } catch {
      return false
    }
  }

  const getFavorites = async () => {
    if (!user) throw new Error('Você precisa estar logado')

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)

    if (error) throw new Error(error.message)
    return data
  }

  return { addFavorite, removeFavorite, isFavorite, getFavorites }
}
