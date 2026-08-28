import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useFavorites } from '../hooks/useFavorites'
import { useWatchlist } from '../hooks/useWatchlist'
import StreamingBadges from './StreamingBadges'
import WatchlistButton from './WatchlistButton'
import '../styles/movie-card.css'
import '../styles/watchlist-button.css'

function MovieCard({ movie, compact }) {
  const [showDetails, setShowDetails] = useState(false)
  const [isFav, setIsFav] = useState(false)
  const [isWatchlist, setIsWatchlist] = useState(false)
  const [favLoading, setFavLoading] = useState(false)
  const [watchLoading, setWatchLoading] = useState(false)

  const { user } = useContext(AuthContext)
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const { addToWatchlist, removeFromWatchlist } = useWatchlist()

  // Verificar se é favorito ao carregar
  useEffect(() => {
    if (user) {
      isFavorite(movie.id).then(setIsFav)
    }
  }, [user, movie.id])

  const handleFavorite = async () => {
    if (!user) {
      alert('Faça login para adicionar favoritos!')
      return
    }

    setFavLoading(true)
    try {
      if (isFav) {
        await removeFavorite(movie.id)
        setIsFav(false)
      } else {
        await addFavorite(movie.id, movie.title, movie.poster_path)
        setIsFav(true)
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setFavLoading(false)
    }
  }

  const handleWatchlist = async () => {
    if (!user) {
      alert('Faça login para adicionar à watchlist!')
      return
    }

    setWatchLoading(true)
    try {
      if (isWatchlist) {
        await removeFromWatchlist(movie.id)
        setIsWatchlist(false)
      } else {
        await addToWatchlist(movie.id, movie.title, movie.poster_path)
        setIsWatchlist(true)
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setWatchLoading(false)
    }
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/300x450?text=Sem+Pôster'

  const year = new Date(movie.release_date).getFullYear() || 'N/A'

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img src={posterUrl} alt={movie.title} />
        <div className="movie-overlay">
          <button
            className="details-btn"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Fechar' : 'Detalhes'}
          </button>
        </div>
      </div>

      <div className="movie-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 className="movie-title">{movie.title || movie.name}</h3>
          <span className="media-badge" style={{
            background: movie.media_type === 'tv' ? '#00a8ff' : '#FF0000',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
          }}>
            {movie.media_type === 'tv' ? 'Série' : 'Filme'}
          </span>
        </div>
        <p className="movie-year">{year}</p>

        <div className="rating">
          ⭐ {movie.vote_average.toFixed(1)}/10
        </div>

        <div className="action-buttons">
          <button
            className={`action-btn favorite-btn ${isFav ? 'active' : ''}`}
            onClick={handleFavorite}
            disabled={favLoading}
            title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
          <WatchlistButton movie={movie} />
        </div>

        {showDetails && (
          <div className="movie-details">
            <p className="synopsis">{movie.overview || 'Sem descrição'}</p>

            <div className="streaming-info">
              <h4>Onde assistir:</h4>
              <StreamingBadges providers={movie.providers} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieCard
