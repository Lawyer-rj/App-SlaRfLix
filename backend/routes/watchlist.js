import express from 'express'
import jwt from 'jsonwebtoken'
import db from '../database.js'

const router = express.Router()

// Middleware para verificar token
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' })
  }
}

// Adicionar à watchlist
router.post('/add', authenticateToken, (req, res) => {
  const { movieId, title, posterPath, status } = req.body

  if (!movieId || !title) {
    return res.status(400).json({ error: 'movieId e title são obrigatórios' })
  }

  db.run(
    'INSERT INTO watchlist (user_id, movie_id, title, poster_path, status) VALUES (?, ?, ?, ?, ?)',
    [req.userId, movieId, title, posterPath, status || 'want_to_watch'],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Filme já está na watchlist' })
        }
        return res.status(500).json({ error: 'Erro ao adicionar à watchlist' })
      }

      res.status(201).json({
        message: 'Adicionado à watchlist!',
        watchlistItem: { id: this.lastID, movieId, title, status: status || 'want_to_watch' }
      })
    }
  )
})

// Remover da watchlist
router.delete('/:movieId', authenticateToken, (req, res) => {
  const { movieId } = req.params

  db.run(
    'DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?',
    [req.userId, movieId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao remover da watchlist' })
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Filme não encontrado na watchlist' })
      }

      res.json({ message: 'Removido da watchlist!' })
    }
  )
})

// Listar watchlist do usuário
router.get('/', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM watchlist WHERE user_id = ? ORDER BY added_at DESC',
    [req.userId],
    (err, watchlist) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar watchlist' })
      }

      res.json({ watchlist })
    }
  )
})

// Atualizar status na watchlist
router.patch('/:movieId/status', authenticateToken, (req, res) => {
  const { movieId } = req.params
  const { status } = req.body

  if (!status) {
    return res.status(400).json({ error: 'Status é obrigatório' })
  }

  db.run(
    'UPDATE watchlist SET status = ? WHERE user_id = ? AND movie_id = ?',
    [status, req.userId, movieId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao atualizar status' })
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Filme não encontrado na watchlist' })
      }

      res.json({ message: 'Status atualizado!', status })
    }
  )
})

export default router
