import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useFavorites } from '../hooks/useFavorites'
import { useWatchlist } from '../hooks/useWatchlist'
import MovieGrid from './MovieGrid'
import '../styles/user-profile.css'

function UserProfile() {
  const { user, logout } = useContext(AuthContext)
  const { getFavorites } = useFavorites()
  const { getWatchlist } = useWatchlist()

  const [favorites, setFavorites] = useState([])
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('favorites')
  const [error, setError] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [fav, watch] = await Promise.all([
        getFavorites(),
        getWatchlist()
      ])
      setFavorites(fav)
      setWatchlist(watch)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="profile-container">Faça login para acessar seu perfil</div>
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <h1>👤 {user.user_metadata?.full_name || 'Usuário'}</h1>
          <p>{user.email}</p>
        </div>
        <button className="logout-btn-large" onClick={logout}>Sair da Conta</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="profile-tabs">
        <button
          className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          ❤️ Favoritos ({favorites.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('watchlist')}
        >
          📺 Watchlist ({watchlist.length})
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando...</p>
        </div>
      ) : (
        <>
          {activeTab === 'favorites' && (
            <div className="tab-content">
              {favorites.length > 0 ? (
                <MovieGrid movies={favorites} />
              ) : (
                <div className="empty-state">
                  <p>Você não tem filmes favoritos ainda</p>
                  <p>Adicione alguns filmes aos favoritos para vê-los aqui!</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'watchlist' && (
            <div className="tab-content">
              {watchlist.length > 0 ? (
                <MovieGrid movies={watchlist} />
              ) : (
                <div className="empty-state">
                  <p>Sua watchlist está vazia</p>
                  <p>Adicione filmes à watchlist para assisti-los depois!</p>
                </div>
              )}
            </div>
          )}
        </>
      )}

      <button className="refresh-btn" onClick={loadData}>
        🔄 Atualizar
      </button>
    </div>
  )
}

export default UserProfile
