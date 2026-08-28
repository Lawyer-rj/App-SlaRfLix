import express from 'express'
import jwt from 'jsonwebtoken'
import db from '../database.js'

const router = express.Router()

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'Token não fornecido' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' })
  }
}

// Adicionar rating
router.post('/add', authenticateToken, (req, res) => {
  const { movieId, rating, comment } = req.body

  if (!movieId || !rating || rating < 1 || rating > 10) {
    return res.status(400).json({ error: 'Dados inválidos' })
  }

  db.run(
    `INSERT OR REPLACE INTO ratings (user_id, movie_id, rating, comment, created_at)
     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [req.userId, movieId, rating, comment || null],
    function (err) {
      if (err) return res.status(500).json({ error: 'Erro ao salvar rating' })
      res.json({ message: 'Rating salvo!', ratingId: this.lastID })
    }
  )
})

// Obter ratings de um filme
router.get('/movie/:movieId', (req, res) => {
  const { movieId } = req.params

  db.all(
    `SELECT r.*, u.name FROM ratings r
     JOIN users u ON r.user_id = u.id
     WHERE r.movie_id = ? ORDER BY r.created_at DESC`,
    [movieId],
    (err, ratings) => {
      if (err) return res.status(500).json({ error: 'Erro ao buscar ratings' })

      const avgRating = ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : 0

      res.json({ ratings, averageRating: avgRating, totalRatings: ratings.length })
    }
  )
})

// Obter meu rating de um filme
router.get('/movie/:movieId/my-rating', authenticateToken, (req, res) => {
  const { movieId } = req.params

  db.get(
    'SELECT * FROM ratings WHERE user_id = ? AND movie_id = ?',
    [req.userId, movieId],
    (err, rating) => {
      if (err) return res.status(500).json({ error: 'Erro ao buscar rating' })
      res.json({ rating: rating || null })
    }
  )
})

// Deletar rating
router.delete('/:movieId', authenticateToken, (req, res) => {
  const { movieId } = req.params

  db.run(
    'DELETE FROM ratings WHERE user_id = ? AND movie_id = ?',
    [req.userId, movieId],
    function (err) {
      if (err) return res.status(500).json({ error: 'Erro ao deletar rating' })
      if (this.changes === 0) return res.status(404).json({ error: 'Rating não encontrado' })
      res.json({ message: 'Rating deletado!' })
    }
  )
})

export default router
