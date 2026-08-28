import '../styles/hero-banner.css'

function HeroBanner({ movie }) {
  if (!movie) return null

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`
    : null

  return (
    <div className="hero-banner" style={{
      backgroundImage: `url(${backdropUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">{movie.title}</h1>
        <p className="hero-description">{movie.overview}</p>

        <div className="hero-info">
          <span className="hero-rating">⭐ {movie.vote_average.toFixed(1)}/10</span>
          <span className="hero-year">{new Date(movie.release_date).getFullYear()}</span>
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
