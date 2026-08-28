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

// Adicionar aos favoritos
router.post('/add', authenticateToken, (req, res) => {
  const { movieId, title, posterPath } = req.body

  if (!movieId || !title) {
    return res.status(400).json({ error: 'movieId e title são obrigatórios' })
  }

  db.run(
    'INSERT INTO favorites (user_id, movie_id, title, poster_path) VALUES (?, ?, ?, ?)',
    [req.userId, movieId, title, posterPath],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Filme já está nos favoritos' })
        }
        return res.status(500).json({ error: 'Erro ao adicionar favorito' })
      }

      res.status(201).json({
        message: 'Adicionado aos favoritos!',
        favorite: { id: this.lastID, movieId, title }
      })
    }
  )
})

// Remover dos favoritos
router.delete('/:movieId', authenticateToken, (req, res) => {
  const { movieId } = req.params

  db.run(
    'DELETE FROM favorites WHERE user_id = ? AND movie_id = ?',
    [req.userId, movieId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao remover favorito' })
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Filme não encontrado nos favoritos' })
      }

      res.json({ message: 'Removido dos favoritos!' })
    }
  )
})

// Listar favoritos do usuário
router.get('/', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM favorites WHERE user_id = ? ORDER BY added_at DESC',
    [req.userId],
    (err, favorites) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar favoritos' })
      }

      res.json({ favorites })
    }
  )
})

// Verificar se um filme é favorito
router.get('/check/:movieId', authenticateToken, (req, res) => {
  const { movieId } = req.params

  db.get(
    'SELECT id FROM favorites WHERE user_id = ? AND movie_id = ?',
    [req.userId, movieId],
    (err, favorite) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao verificar favorito' })
      }

      res.json({ isFavorite: !!favorite })
    }
  )
})

export default router
