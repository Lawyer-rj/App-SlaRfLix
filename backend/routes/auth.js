import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../database.js'

const router = express.Router()

// Register - Criar nova conta
router.post('/register', (req, res) => {
  const { email, password, name } = req.body

  // Validações
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, senha e nome são obrigatórios' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Senha deve ter no mínimo 6 caracteres' })
  }

  // Hash da senha
  const hashedPassword = bcrypt.hashSync(password, 10)

  // Inserir usuário no banco
  db.run(
    'INSERT INTO users (email, password, name) VALUES (?, ?, ?)',
    [email, hashedPassword, name],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email já cadastrado' })
        }
        return res.status(500).json({ error: 'Erro ao registrar' })
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: this.lastID, email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.status(201).json({
        message: 'Usuário registrado com sucesso!',
        user: { id: this.lastID, email, name },
        token
      })
    }
  )
})

// Login - Entrar na conta
router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' })
  }

  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao fazer login' })
      }

      if (!user) {
        return res.status(401).json({ error: 'Email ou senha incorretos' })
      }

      // Verificar senha
      const passwordMatch = bcrypt.compareSync(password, user.password)

      if (!passwordMatch) {
        return res.status(401).json({ error: 'Email ou senha incorretos' })
      }

      // Gerar token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )

      res.json({
        message: 'Login realizado com sucesso!',
        user: { id: user.id, email: user.email, name: user.name },
        token
      })
    }
  )
})

// Logout (apenas remove token no frontend)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout realizado com sucesso!' })
})

// Verificar token
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    db.get(
      'SELECT id, email, name FROM users WHERE id = ?',
      [decoded.id],
      (err, user) => {
        if (err || !user) {
          return res.status(401).json({ error: 'Usuário não encontrado' })
        }

        res.json({ user })
      }
    )
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' })
  }
})

export default router
