import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useFavorites } from '../hooks/useFavorites'
import { useWatchlist } from '../hooks/useWatchlist'
import '../styles/movie-details-page.css'

function MovieDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const { addToWatchlist, removeFromWatchlist } = useWatchlist()

  const [movie, setMovie] = useState(null)
  const [details, setDetails] = useState(null)
  const [isFav, setIsFav] = useState(false)
  const [watchStatus, setWatchStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [favLoading, setFavLoading] = useState(false)
  const [watchLoading, setWatchLoading] = useState(false)

  const API_BASE_URL = 'https://api.themoviedb.org/3'
  const tmdbApiKey = import.meta.env.VITE_TMDB_API_KEY

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        // Tenta buscar como filme primeiro
        let url = `${API_BASE_URL}/movie/${id}?api_key=${tmdbApiKey}&language=pt-BR&append_to_response=credits`
        let res = await fetch(url)
        let data = await res.json()

        // Se não encontrar, tenta como série
        if (data.status_code === 34 || !data.id) {
          url = `${API_BASE_URL}/tv/${id}?api_key=${tmdbApiKey}&language=pt-BR&append_to_response=credits`
          res = await fetch(url)
          data = await res.json()
          data.media_type = 'tv'
        } else {
          data.media_type = 'movie'
        }

        if (data.id) {
          setDetails(data)
          setMovie(data)
        }

        if (user && data.id) {
          const isFav = await isFavorite(id)
          setIsFav(isFav)
        }
      } finally {
        setLoading(false)
      }
    }

    if (tmdbApiKey) {
      fetchMovie()
    }
  }, [id, tmdbApiKey])

  const handleFavorite = async () => {
    if (!user) {
      alert('Faça login!')
      return
    }

    setFavLoading(true)
    try {
      if (isFav) {
        await removeFavorite(id)
        setIsFav(false)
      } else {
        await addFavorite(id, movie.title || movie.name, movie.poster_path)
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
        await removeFromWatchlist(id)
        setWatchStatus(null)
      } else {
        await addToWatchlist(id, movie.title || movie.name, movie.poster_path, newStatus)
        setWatchStatus(newStatus)
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setWatchLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="details-page">
        <button className="back-btn" onClick={() => navigate(-1)}>← Voltar</button>
        <div className="details-page-loading">
          <div className="spinner"></div>
          <p>Carregando detalhes do filme...</p>
        </div>
      </div>
    )
  }

  if (!movie || !details) {
    return (
      <div className="details-page">
        <button className="back-btn" onClick={() => navigate(-1)}>← Voltar</button>
        <div className="details-page-error">
          <p>Não conseguimos carregar os detalhes do filme.</p>
          <p>ID: {id}</p>
          <button onClick={() => window.location.reload()}>Tentar novamente</button>
        </div>
      </div>
    )
  }

  const year = new Date(movie.release_date || movie.first_air_date).getFullYear()
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=Sem+Pôster'

  return (
    <div className="details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Voltar</button>

      <div className="details-page-container">
        <div className="details-page-poster">
          <img src={posterUrl} alt={movie.title || movie.name} />
        </div>

        <div className="details-page-info">
          <h1>{movie.title || movie.name}</h1>
          <p className="details-page-year">{year}</p>

          <div className="details-page-rating">
            ⭐ {movie.vote_average.toFixed(1)}/10
          </div>

          {details?.genres && (
            <div className="details-page-genres">
              {details.genres.map(g => (
                <span key={g.id} className="genre-badge">{g.name}</span>
              ))}
            </div>
          )}

          {details?.runtime && movie.media_type === 'movie' && (
            <p className="details-page-runtime">⏱️ {details.runtime} minutos</p>
          )}

          {details?.number_of_seasons && movie.media_type === 'tv' && (
            <p className="details-page-seasons">📺 {details.number_of_seasons} temporada(s)</p>
          )}

          <div className="details-page-synopsis">
            <h3>Sinopse</h3>
            <p>{movie.overview || 'Sem descrição disponível'}</p>
          </div>

          {details?.credits?.cast?.slice(0, 6) && (
            <div className="details-page-cast">
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

          <div className="details-page-actions">
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
  )
}

export default MovieDetailsPage
