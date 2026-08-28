import MovieCard from './MovieCard'
import '../styles/movie-grid.css'

function MovieGrid({ movies }) {
  return (
    <div className="movie-grid-container">
      <div className="container">
        <div className="movie-grid">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MovieGrid
