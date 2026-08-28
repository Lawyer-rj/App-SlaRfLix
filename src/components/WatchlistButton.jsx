import { useState, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useWatchlist } from '../hooks/useWatchlist'
import '../styles/watchlist-button.css'

function WatchlistButton({ movie, onStatusChange }) {
  const { user } = useContext(AuthContext)
  const { addToWatchlist, removeFromWatchlist } = useWatchlist()
  const [status, setStatus] = useState(null) // null, want_to_watch, watched
  const [loading, setLoading] = useState(false)

  const handleToggle = async (newStatus) => {
    if (!user) {
      alert('Faça login para adicionar à watchlist!')
      return
    }

    setLoading(true)

    try {
      if (status === newStatus) {
        // Se clica no mesmo status, remove
        await removeFromWatchlist(movie.id)
        setStatus(null)
      } else {
        // Adiciona com novo status
        await addToWatchlist(movie.id, movie.title, movie.poster_path, newStatus)
        setStatus(newStatus)
      }
      onStatusChange?.(movie.id, status === newStatus ? null : newStatus)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="watchlist-button-group">
      <button
        className={`watchlist-btn want-to-watch ${status === 'want_to_watch' ? 'active' : ''}`}
        onClick={() => handleToggle('want_to_watch')}
        disabled={loading || !user}
        title="Quer assistir"
      >
        📺
      </button>
      <button
        className={`watchlist-btn watched ${status === 'watched' ? 'active' : ''}`}
        onClick={() => handleToggle('watched')}
        disabled={loading || !user}
        title="Já assistiu"
      >
        ✅
      </button>
    </div>
  )
}

export default WatchlistButton
