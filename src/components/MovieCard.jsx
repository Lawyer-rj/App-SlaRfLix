import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useFavorites } from '../hooks/useFavorites'
import { useWatchlist } from '../hooks/useWatchlist'
import { useRecommendations } from '../hooks/useRecommendations'
import StreamingBadges from './StreamingBadges'
import { RecommendationSection } from './RecommendationSection'
import { RecommendDialog } from './RecommendDialog'
import '../styles/movie-card.css'
import '../styles/recommendation-section.css'
import '../styles/recommend-dialog.css'

function MovieCard({ movie, compact }) {
  const [showDetails, setShowDetails] = useState(false)
  const [showRecommendDialog, setShowRecommendDialog] = useState(false)
  const [isFav, setIsFav] = useState(false)
  const [watchStatus, setWatchStatus] = useState(null)
  const [favLoading, setFavLoading] = useState(false)
  const [watchLoading, setWatchLoading] = useState(false)

  const { user } = useContext(AuthContext)
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const { addToWatchlist, removeFromWatchlist } = useWatchlist()

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

  const handleWatchStatus = async (newStatus) => {
    if (!user) {
      alert('Faça login para adicionar à watchlist!')
      return
    }

    setWatchLoading(true)
    try {
      if (watchStatus === newStatus) {
        await removeFromWatchlist(movie.id)
        setWatchStatus(null)
      } else {
        await addToWatchlist(movie.id, movie.title, movie.poster_path, newStatus)
        setWatchStatus(newStatus)
      }
    } catch (err) {
      alert(err.message)
    } finally {
      setWatchLoading(false)
    }
  }

  const handleRecommend = () => {
    if (!user) {
      alert('Faça login para recomendar!')
      return
    }
    setShowRecommendDialog(true)
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

        <p className="movie-synopsis-preview">
          {movie.overview ? movie.overview.substring(0, 100) + '...' : 'Sem descrição'}
        </p>

        <div className="action-buttons">
          <button
            className={`action-btn ${isFav ? 'active' : ''}`}
            onClick={handleFavorite}
            disabled={favLoading}
            title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
          <button
            className="action-btn"
            onClick={handleRecommend}
            title="Recomendar para usuários"
          >
            👍
          </button>
          <button
            className={`action-btn ${watchStatus === 'want_to_watch' ? 'active' : ''}`}
            onClick={() => handleWatchStatus('want_to_watch')}
            disabled={watchLoading || !user}
            title="Quer assistir"
          >
            📺
          </button>
          <button
            className={`action-btn ${watchStatus === 'watched' ? 'active' : ''}`}
            onClick={() => handleWatchStatus('watched')}
            disabled={watchLoading || !user}
            title="Já assistiu"
          >
            ✅
          </button>
        </div>

        {showDetails && (
          <div className="movie-details">
            <p className="synopsis">{movie.overview || 'Sem descrição'}</p>

            <div className="streaming-info">
              <h4>Onde assistir:</h4>
              <StreamingBadges providers={movie.providers} />
            </div>

            <RecommendationSection movieId={movie.id} />
          </div>
        )}
      </div>

      {showRecommendDialog && (
        <RecommendDialog
          movie={movie}
          onClose={() => setShowRecommendDialog(false)}
        />
      )}
    </div>
  )
}

export default MovieCard
