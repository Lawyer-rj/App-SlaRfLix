import { useState, useEffect, useContext } from 'react'
import { AuthContext } from './contexts/AuthContext'
import MovieGrid from './components/MovieGrid'
import Header from './components/Header'
import HeroBanner from './components/HeroBanner'
import MovieSection from './components/MovieSection'
import LoginRegister from './components/LoginRegister'
import UserProfile from './components/UserProfile'
import HomeTabs from './components/HomeTabs'
import './styles/app.css'

function App() {
  const { user } = useContext(AuthContext)
  const [currentPage, setCurrentPage] = useState('home')
  const [homeTab, setHomeTab] = useState('popular') // popular, want-to-watch, watched
  const [popularMovies, setPopularMovies] = useState([])
  const [newMovies, setNewMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [wantToWatch, setWantToWatch] = useState([])
  const [watched, setWatched] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [searchResults, setSearchResults] = useState([])
  const [showLogin, setShowLogin] = useState(false)

  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
  const API_BASE_URL = 'https://api.themoviedb.org/3'

  useEffect(() => {
    if (searchQuery.trim()) {
      searchMovies()
    } else {
      fetchAllMovies()
    }
  }, [searchQuery])

  const fetchWithProviders = async (movies) => {
    return Promise.all(
      movies.map(async (movie) => {
        try {
          const providersUrl = `${API_BASE_URL}/movie/${movie.id}/watch/providers?api_key=${TMDB_API_KEY}`
          const provRes = await fetch(providersUrl)
          const provData = await provRes.json()
          return {
            ...movie,
            providers: provData.results?.BR || {}
          }
        } catch {
          return { ...movie, providers: {} }
        }
      })
    )
  }

  const fetchAllMovies = async () => {
    setLoading(true)
    setError(null)

    try {
      // Populares
      const popularUrl = `${API_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR&sort_by=popularity.desc&page=1`
      const popularRes = await fetch(popularUrl)
      const popularData = await popularRes.json()
      const popularWithProviders = await fetchWithProviders(popularData.results.slice(0, 10))
      setPopularMovies(popularWithProviders)

      // Novos lançamentos
      const newUrl = `${API_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR&sort_by=release_date.desc&page=1`
      const newRes = await fetch(newUrl)
      const newData = await newRes.json()
      const newWithProviders = await fetchWithProviders(newData.results.slice(0, 10))
      setNewMovies(newWithProviders)

      // Top Rated
      const topUrl = `${API_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR&sort_by=vote_average.desc&vote_count.gte=1000&page=1`
      const topRes = await fetch(topUrl)
      const topData = await topRes.json()
      const topWithProviders = await fetchWithProviders(topData.results.slice(0, 10))
      setTopRatedMovies(topWithProviders)
    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const searchMovies = async () => {
    setLoading(true)
    setError(null)

    try {
      const url = `${API_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${searchQuery}&language=pt-BR&page=1`
      const response = await fetch(url)
      const data = await response.json()
      const resultsWithProviders = await fetchWithProviders(data.results)
      setSearchResults(resultsWithProviders)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!TMDB_API_KEY) {
    return (
      <div className="app error-container">
        <h1>⚠️ Erro de Configuração</h1>
        <p>É preciso configurar a chave da API do TMDB!</p>
        <p>Crie um arquivo <code>.env.local</code> com:</p>
        <pre>VITE_TMDB_API_KEY=sua_chave_aqui</pre>
        <p><a href="https://www.themoviedb.org/settings/api" target="_blank">Obtenha sua chave aqui</a></p>
      </div>
    )
  }

  const heroBannerMovie = searchResults.length > 0 ? searchResults[0] : popularMovies[0]

  return (
    <div className="app">
      {showLogin && (
        <LoginRegister
          onClose={() => setShowLogin(false)}
          onSuccess={() => setShowLogin(false)}
        />
      )}

      <Header
        onSearch={setSearchQuery}
        onGenreChange={setSelectedGenre}
        onLoginClick={() => setShowLogin(true)}
        onProfileClick={() => setCurrentPage(currentPage === 'profile' ? 'home' : 'profile')}
        currentPage={currentPage}
      />

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando filmes...</p>
        </div>
      )}

      {!loading && (
        <div className="content">
          {currentPage === 'profile' ? (
            <UserProfile />
          ) : (
            <>
              {searchQuery && searchResults.length > 0 && (
                <>
                  <h2 className="search-title">Resultados para "{searchQuery}"</h2>
                  <MovieGrid movies={searchResults} />
                </>
              )}

              {searchQuery && searchResults.length === 0 && (
                <div className="no-results">
                  <p>Nenhum filme encontrado para "{searchQuery}"</p>
                </div>
              )}

              {!searchQuery && (
                <>
                  {homeTab === 'popular' && heroBannerMovie && (
                    <HeroBanner movie={heroBannerMovie} />
                  )}

                  <HomeTabs
                    currentTab={homeTab}
                    onTabChange={setHomeTab}
                    popularMovies={popularMovies}
                    newMovies={newMovies}
                    topRatedMovies={topRatedMovies}
                    loading={loading}
                  />
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default App
