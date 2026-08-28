import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import favoritesRoutes from './routes/favorites.js'
import watchlistRoutes from './routes/watchlist.js'

// Carregar variáveis de ambiente
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

// Rotas de autenticação
app.use('/api/auth', authRoutes)

// Rotas de favoritos
app.use('/api/favorites', favoritesRoutes)

// Rotas de watchlist
app.use('/api/watchlist', watchlistRoutes)

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Backend rodando!' })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════╗
║  🎬 SlaRFlix Backend               ║
║  🚀 Rodando na porta ${PORT}         ║
║  📍 http://localhost:${PORT}         ║
╚════════════════════════════════════╝
  `)
})
