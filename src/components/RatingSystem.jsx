import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import '../styles/rating-system.css'

function RatingSystem({ movieId, movieTitle }) {
  const { token, user } = useContext(AuthContext)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [myRating, setMyRating] = useState(null)
  const [allRatings, setAllRatings] = useState([])
  const [averageRating, setAverageRating] = useState(0)
  const [loading, setLoading] = useState(false)

  const API_URL = 'http://localhost:3001/api'

  useEffect(() => {
    fetchRatings()
    if (user) fetchMyRating()
  }, [movieId, user])

  const fetchRatings = async () => {
    try {
      const res = await fetch(`${API_URL}/ratings/movie/${movieId}`)
      const data = await res.json()
      setAllRatings(data.ratings)
      setAverageRating(data.averageRating)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchMyRating = async () => {
    if (!token) return

    try {
      const res = await fetch(`${API_URL}/ratings/movie/${movieId}/my-rating`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.rating) {
        setMyRating(data.rating)
        setRating(data.rating.rating)
        setComment(data.rating.comment || '')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async () => {
    if (!token) {
      alert('Faça login para avaliar!')
      return
    }

    if (rating === 0) {
      alert('Escolha uma nota!')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/ratings/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ movieId, rating, comment })
      })

      if (res.ok) {
        alert('Avaliação salva!')
        setComment('')
        fetchRatings()
        fetchMyRating()
      }
    } catch (err) {
      alert('Erro ao salvar avaliação')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rating-system">
      <h3>⭐ Avaliações</h3>

      {allRatings.length > 0 && (
        <div className="rating-stats">
          <div className="average-rating">
            <span className="big-rating">{averageRating}</span>
            <span className="rating-count">({allRatings.length} avaliações)</span>
          </div>
        </div>
      )}

      <div className="rating-input">
        <h4>Sua Avaliação:</h4>
        <div className="stars">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
            <button
              key={star}
              className={`star ${rating >= star ? 'active' : ''}`}
              onClick={() => setRating(star)}
              disabled={!user}
            >
              ⭐
            </button>
          ))}
        </div>
        <span className="rating-value">
          {rating > 0 ? `${rating}/10` : 'Clique nas estrelas'}
        </span>

        <textarea
          className="comment-input"
          placeholder="Deixe um comentário (opcional)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={!user || loading}
        />

        <button
          className="submit-rating-btn"
          onClick={handleSubmit}
          disabled={!user || rating === 0 || loading}
        >
          {loading ? 'Salvando...' : 'Salvar Avaliação'}
        </button>
      </div>

      <div className="ratings-list">
        {allRatings.length > 0 ? (
          allRatings.map((r) => (
            <div key={r.id} className="rating-item">
              <div className="rating-header">
                <span className="reviewer-name">{r.name}</span>
                <span className="rating-stars">{'⭐'.repeat(r.rating)}</span>
              </div>
              {r.comment && <p className="rating-comment">{r.comment}</p>}
            </div>
          ))
        ) : (
          <p className="no-ratings">Nenhuma avaliação ainda</p>
        )}
      </div>
    </div>
  )
}

export default RatingSystem
