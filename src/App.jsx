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
      // Populares (Filmes + Séries)
      const popularMovieUrl = `${API_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR&sort_by=popularity.desc&page=1`
      const popularTvUrl = `${API_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=pt-BR&sort_by=popularity.desc&page=1`

      const [popularMovieRes, popularTvRes] = await Promise.all([
        fetch(popularMovieUrl),
        fetch(popularTvUrl)
      ])
      const popularMovieData = await popularMovieRes.json()
      const popularTvData = await popularTvRes.json()

      const moviesWithType = popularMovieData.results.slice(0, 10).map(m => ({ ...m, media_type: 'movie' }))
      const tvWithType = popularTvData.results.slice(0, 10).map(t => ({ ...t, media_type: 'tv', release_date: t.first_air_date }))
      const mixed = [...moviesWithType, ...tvWithType].sort(() => Math.random() - 0.5)

      const popularWithProviders = await fetchWithProviders(mixed)
      setPopularMovies(popularWithProviders)

      // Novos lançamentos (Filmes + Séries)
      const newMovieUrl = `${API_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR&sort_by=release_date.desc&page=1`
      const newTvUrl = `${API_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=pt-BR&sort_by=first_air_date.desc&page=1`

      const [newMovieRes, newTvRes] = await Promise.all([
        fetch(newMovieUrl),
        fetch(newTvUrl)
      ])
      const newMovieData = await newMovieRes.json()
      const newTvData = await newTvRes.json()

      const newMoviesWithType = newMovieData.results.slice(0, 10).map(m => ({ ...m, media_type: 'movie' }))
      const newTvWithType = newTvData.results.slice(0, 10).map(t => ({ ...t, media_type: 'tv', release_date: t.first_air_date }))
      const mixedNew = [...newMoviesWithType, ...newTvWithType].sort(() => Math.random() - 0.5)

      const newWithProviders = await fetchWithProviders(mixedNew)
      setNewMovies(newWithProviders)

      // Top Rated (Filmes + Séries)
      const topMovieUrl = `${API_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&region=BR&sort_by=vote_average.desc&vote_count.gte=1000&page=1`
      const topTvUrl = `${API_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=pt-BR&sort_by=vote_average.desc&vote_count.gte=100&page=1`

      const [topMovieRes, topTvRes] = await Promise.all([
        fetch(topMovieUrl),
        fetch(topTvUrl)
      ])
      const topMovieData = await topMovieRes.json()
      const topTvData = await topTvRes.json()

      const topMoviesWithType = topMovieData.results.slice(0, 10).map(m => ({ ...m, media_type: 'movie' }))
      const topTvWithType = topTvData.results.slice(0, 10).map(t => ({ ...t, media_type: 'tv', release_date: t.first_air_date }))
      const mixedTop = [...topMoviesWithType, ...topTvWithType].sort(() => Math.random() - 0.5)

      const topWithProviders = await fetchWithProviders(mixedTop)
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
      const movieUrl = `${API_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${searchQuery}&language=pt-BR&page=1`
      const tvUrl = `${API_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${searchQuery}&language=pt-BR&page=1`

      const [movieRes, tvRes] = await Promise.all([
        fetch(movieUrl),
        fetch(tvUrl)
      ])
      const movieData = await movieRes.json()
      const tvData = await tvRes.json()

      const moviesWithType = movieData.results.map(m => ({ ...m, media_type: 'movie' }))
      const tvWithType = tvData.results.map(t => ({ ...t, media_type: 'tv', release_date: t.first_air_date }))
      const mixed = [...moviesWithType, ...tvWithType]
        .filter(item => item.poster_path)
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 20)

      const resultsWithProviders = await fetchWithProviders(mixed)
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
