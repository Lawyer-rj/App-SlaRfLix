import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useFavorites } from '../hooks/useFavorites'
import { useWatchlist } from '../hooks/useWatchlist'
import '../styles/movie-details.css'

function MovieDetails({ movie, onClose, tmdbApiKey }) {
  const { user } = useContext(AuthContext)
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const { addToWatchlist, removeFromWatchlist } = useWatchlist()
  const [isFav, setIsFav] = useState(false)
  const [watchStatus, setWatchStatus] = useState(null)
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [favLoading, setFavLoading] = useState(false)
  const [watchLoading, setWatchLoading] = useState(false)

  const API_BASE_URL = 'https://api.themoviedb.org/3'
  const isMovie = movie.media_type === 'movie'

  useEffect(() => {
    let mounted = true

    const fetchDetails = async () => {
      try {
        const endpoint = isMovie ? 'movie' : 'tv'
        const url = `${API_BASE_URL}/${endpoint}/${movie.id}?api_key=${tmdbApiKey}&language=pt-BR&append_to_response=credits,videos`
        const res = await fetch(url)
        const data = await res.json()
        if (mounted) {
          setDetails(data)
          setLoading(false)
        }
      } catch (err) {
        console.error('Erro ao buscar detalhes:', err)
        if (mounted) setLoading(false)
      }
    }

    fetchDetails()

    return () => {
      mounted = false
    }
  }, [])

  const handleFavorite = async () => {
    if (!user) {
      alert('Faça login!')
      return
    }

    setFavLoading(true)
    try {
      if (isFav) {
        await removeFavorite(movie.id)
        setIsFav(false)
      } else {
        await addFavorite(movie.id, movie.title || movie.name, movie.poster_path)
        setIsFav(true)
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setFavLoading(false)
    }
  }

  const handleWatchStatus = async (newStatus) => {
    if (!user) {
      alert('Faça login!')
      return
    }

    setWatchLoading(true)
    try {
      if (watchStatus === newStatus) {
        await removeFromWatchlist(movie.id)
        setWatchStatus(null)
      } else {
        await addToWatchlist(movie.id, movie.title || movie.name, movie.poster_path, newStatus)
        setWatchStatus(newStatus)
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setWatchLoading(false)
    }
  }

  const year = new Date(movie.release_date || movie.first_air_date).getFullYear()
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=Sem+Pôster'

  if (loading) {
    return (
      <div className="movie-details-overlay" onClick={onClose}>
        <div className="movie-details-modal" onClick={e => e.stopPropagation()}>
          <p>Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="movie-details-overlay" onClick={onClose}>
      <div className="movie-details-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="details-container">
          <div className="details-poster">
            <img src={posterUrl} alt={movie.title || movie.name} />
          </div>

          <div className="details-info">
            <h1>{movie.title || movie.name}</h1>
            <p className="details-year">{year}</p>

            <div className="details-rating">
              ⭐ {movie.vote_average.toFixed(1)}/10
            </div>

            {details?.genres && (
              <div className="details-genres">
                {details.genres.map(g => (
                  <span key={g.id} className="genre-badge">{g.name}</span>
                ))}
              </div>
            )}

            {details?.runtime && isMovie && (
              <p className="details-runtime">⏱️ {details.runtime} minutos</p>
            )}

            {details?.number_of_seasons && !isMovie && (
              <p className="details-seasons">📺 {details.number_of_seasons} temporada(s)</p>
            )}

            <div className="details-synopsis">
              <h3>Sinopse</h3>
              <p>{movie.overview || 'Sem descrição disponível'}</p>
            </div>

            {details?.credits?.cast?.slice(0, 6) && (
              <div className="details-cast">
                <h3>Elenco Principal</h3>
                <div className="cast-list">
                  {details.credits.cast.slice(0, 6).map(actor => (
                    <div key={actor.id} className="cast-item">
                      <div className="cast-photo">
                        {actor.profile_path ? (
                          <img src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`} alt={actor.name} />
                        ) : (
                          <div className="cast-placeholder">Sem foto</div>
                        )}
                      </div>
                      <p className="cast-name">{actor.name}</p>
                      <p className="cast-character">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="details-actions">
              <button
                className={`action-btn-large ${isFav ? 'active' : ''}`}
                onClick={handleFavorite}
                disabled={favLoading}
              >
                {isFav ? '❤️ Nos Favoritos' : '🤍 Adicionar aos Favoritos'}
              </button>
              <button
                className={`action-btn-large ${watchStatus === 'want_to_watch' ? 'active' : ''}`}
                onClick={() => handleWatchStatus('want_to_watch')}
                disabled={watchLoading || !user}
              >
                📺 Quer Assistir
              </button>
              <button
                className={`action-btn-large ${watchStatus === 'watched' ? 'active' : ''}`}
                onClick={() => handleWatchStatus('watched')}
                disabled={watchLoading || !user}
              >
                ✅ Já Assistiu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MovieDetails
