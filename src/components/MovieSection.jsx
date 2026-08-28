import MovieCard from './MovieCard'
import '../styles/movie-section.css'

function MovieSection({ title, movies }) {
  if (!movies || movies.length === 0) return null

  return (
    <div className="movie-section">
      <h2 className="section-title">{title}</h2>
      <div className="movies-carousel">
        {movies.map(movie => (
          <div key={movie.id} className="carousel-item">
            <MovieCard movie={movie} compact={true} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MovieSection
