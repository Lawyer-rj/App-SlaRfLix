import { useState, useEffect } from 'react'
import '../styles/hero-banner.css'

function HeroBanner({ movie, tmdbApiKey }) {
  if (!movie) return null

  const [trailer, setTrailer] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = 'https://api.themoviedb.org/3'
  const isMovie = movie.media_type === 'movie'

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const endpoint = isMovie ? 'movie' : 'tv'
        const url = `${API_BASE_URL}/${endpoint}/${movie.id}?api_key=${tmdbApiKey}&language=pt-BR&append_to_response=videos`
        const res = await fetch(url)
        const data = await res.json()

        // Procurar por trailer em português ou inglês
        const videos = data.videos?.results || []
        const trailerVideo = videos.find(v =>
          v.type === 'Trailer' && (v.site === 'YouTube')
        ) || videos.find(v => v.site === 'YouTube')

        if (trailerVideo) {
          setTrailer(trailerVideo)
        }
      } catch (err) {
        console.error('Erro ao buscar trailer:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrailer()
  }, [movie.id, tmdbApiKey])

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null

  const year = new Date(movie.release_date || movie.first_air_date).getFullYear()

  return (
    <div className="hero-banner">
      {trailer ? (
        <div className="hero-video-container">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailer.key}`}
            frameBorder="0"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0 }}
          ></iframe>
        </div>
      ) : (
        <div style={{
          backgroundImage: `url(${backdropUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}></div>
      )}

      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">{movie.title || movie.name}</h1>
        <p className="hero-description">{movie.overview}</p>

        <div className="hero-info">
          <span className="hero-rating">⭐ {movie.vote_average.toFixed(1)}/10</span>
          <span className="hero-year">{year}</span>
        </div>

        <div className="hero-buttons">
          <button className="btn btn-play">▶ Assistir</button>
          <button className="btn btn-info">ℹ Mais Informações</button>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner
