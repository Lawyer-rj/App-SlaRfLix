import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useWatchlist } from '../hooks/useWatchlist'
import MovieGrid from './MovieGrid'
import MovieSection from './MovieSection'
import '../styles/home-tabs.css'

function HomeTabs({
  currentTab,
  onTabChange,
  popularMovies,
  newMovies,
  topRatedMovies,
  loading
}) {
  const { user } = useContext(AuthContext)
  const { getWatchlist } = useWatchlist()
  const [wantToWatch, setWantToWatch] = useState([])
  const [watched, setWatched] = useState([])
  const [watchlistLoading, setWatchlistLoading] = useState(false)

  useEffect(() => {
    if (user && (currentTab === 'want-to-watch' || currentTab === 'watched')) {
      loadWatchlist()
    }
  }, [user, currentTab])

  const loadWatchlist = async () => {
    setWatchlistLoading(true)
    try {
      const data = await getWatchlist()
      setWantToWatch(data.filter(m => m.status === 'want_to_watch'))
      setWatched(data.filter(m => m.status === 'watched'))
    } catch (err) {
      console.error(err)
    } finally {
      setWatchlistLoading(false)
    }
  }

  return (
    <div className="home-tabs-container">
      <div className="tabs-header">
        <button
          className={`tab-btn ${currentTab === 'popular' ? 'active' : ''}`}
          onClick={() => onTabChange('popular')}
        >
          🔥 Populares
        </button>

        {user && (
          <>
            <button
              className={`tab-btn ${currentTab === 'want-to-watch' ? 'active' : ''}`}
              onClick={() => onTabChange('want-to-watch')}
            >
              📺 Quer Assistir ({wantToWatch.length})
            </button>

            <button
              className={`tab-btn ${currentTab === 'watched' ? 'active' : ''}`}
              onClick={() => onTabChange('watched')}
            >
              ✅ Já Assistiu ({watched.length})
            </button>
          </>
        )}
      </div>

      <div className="tabs-content">
        {currentTab === 'popular' && !loading && (
          <>
            <MovieSection title="🔥 Populares" movies={popularMovies} />
            <MovieSection title="✨ Novos Lançamentos" movies={newMovies} />
            <MovieSection title="⭐ Mais bem avaliados" movies={topRatedMovies} />
          </>
        )}

        {currentTab === 'want-to-watch' && (
          <div className="tab-content">
            {!user ? (
              <div className="login-prompt">
                <p>👤 Faça login para ver sua lista!</p>
              </div>
            ) : watchlistLoading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : wantToWatch.length > 0 ? (
              <MovieGrid movies={wantToWatch} />
            ) : (
              <div className="empty-state">
                <p>📺 Sua lista está vazia</p>
                <p>Adicione filmes que quer assistir!</p>
              </div>
            )}
          </div>
        )}

        {currentTab === 'watched' && (
          <div className="tab-content">
            {!user ? (
              <div className="login-prompt">
                <p>👤 Faça login para ver sua lista!</p>
              </div>
            ) : watchlistLoading ? (
              <div className="loading">
                <div className="spinner"></div>
              </div>
            ) : watched.length > 0 ? (
              <MovieGrid movies={watched} />
            ) : (
              <div className="empty-state">
                <p>✅ Você não marcou nenhum filme como assistido</p>
                <p>Marque os filmes que já assistiu!</p>
              </div>
            )}
          </div>
        )}

        {loading && currentTab === 'popular' && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Carregando filmes...</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default HomeTabs
