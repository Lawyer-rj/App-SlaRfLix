# 🤖 Sistema de Recomendações com IA - SlaRFlix

Adicione recomendações personalizadas usando IA!

---

## 📊 Estratégias de Recomendação

### 1. Filtragem Colaborativa (Simples)

**Como funciona:** Recomenda filmes que usuários similares assistiram

```javascript
// Exemplo: Se user A curte Action e SciFi
// E user B curte os mesmos gêneros
// Então recomenda filmes que B curtiu para A
```

### 2. Filtragem por Conteúdo

**Como funciona:** Recomenda filmes similares aos que o usuário já viu

```javascript
// Se user curtiu "Matrix"
// Recomenda outros filmes de Sci-Fi, Thriller, etc
```

### 3. IA com Claude API

**Mais preciso:** Use IA real da Anthropic

---

## 🔧 Implementação Rápida

### Opção A: Filtragem Colaborativa Simples

Arquivo: `backend/routes/recommendations.js`

```javascript
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

// Obter recomendações personalizadas
router.get('/personalized', authenticateToken, (req, res) => {
  // 1. Obter gêneros que o usuário curte
  db.all(
    `SELECT DISTINCT genre FROM user_movie_genres 
     WHERE user_id = ? LIMIT 10`,
    [req.userId],
    (err, genres) => {
      if (err || !genres.length) {
        return res.json({ recommendations: [] })
      }

      // 2. Buscar filmes similares
      const genreList = genres.map(g => `'${g.genre}'`).join(',')
      
      db.all(
        `SELECT DISTINCT m.* FROM movies m
         WHERE m.genre IN (${genreList})
         AND m.id NOT IN (SELECT movie_id FROM favorites WHERE user_id = ?)
         ORDER BY m.vote_average DESC
         LIMIT 10`,
        [req.userId],
        (err, recommendations) => {
          if (err) return res.status(500).json({ error: 'Erro ao buscar' })
          res.json({ recommendations })
        }
      )
    }
  )
})

export default router
```

---

### Opção B: IA com Claude

#### 1. Instalar SDK

```bash
npm install @anthropic-ai/sdk
```

#### 2. Criar Rota de Recomendações

Arquivo: `backend/routes/ai-recommendations.js`

```javascript
import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import jwt from 'jsonwebtoken'
import db from '../database.js'

const router = express.Router()
const client = new Anthropic()

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

router.get('/ai-suggestions', authenticateToken, async (req, res) => {
  try {
    // 1. Obter filmes favoritos do usuário
    db.all(
      'SELECT movie_id, title FROM favorites WHERE user_id = ? LIMIT 5',
      [req.userId],
      async (err, favorites) => {
        if (err || !favorites.length) {
          return res.json({ suggestions: [] })
        }

        const favoritesList = favorites.map(f => f.title).join(', ')

        // 2. Usar Claude para gerar recomendações
        const message = await client.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: `O usuário gostou dos seguintes filmes: ${favoritesList}
              
              Baseado nisso, recomende 5 filmes similares que ele provavelmente gostaria.
              Formato da resposta:
              1. Título do Filme - Breve descrição
              2. Título do Filme - Breve descrição
              ...
              
              Seja conciso e recomende filmes reais.`
            }
          ]
        })

        const suggestions = message.content[0].text

        res.json({ suggestions })
      }
    )
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao gerar sugestões' })
  }
})

export default router
```

#### 3. Adicionar ao Backend

No `backend/server.js`:

```javascript
import aiRecommendationsRoutes from './routes/ai-recommendations.js'

app.use('/api/recommendations', aiRecommendationsRoutes)
```

#### 4. Configurar Chave de API

No `backend/.env`:

```
ANTHROPIC_API_KEY=sua_chave_aqui
```

Obter chave: https://console.anthropic.com/

---

## 📱 Frontend - Componente de Recomendações

Arquivo: `src/components/RecommendationsWidget.jsx`

```javascript
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import '../styles/recommendations.css'

function RecommendationsWidget() {
  const { token } = useContext(AuthContext)
  const [suggestions, setSuggestions] = useState('')
  const [loading, setLoading] = useState(false)

  const API_URL = 'http://localhost:3001/api'

  const fetchRecommendations = async () => {
    if (!token) return

    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/recommendations/ai-suggestions`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setSuggestions(data.suggestions)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="recommendations-widget">
      <h3>🤖 Recomendações com IA</h3>
      
      <button
        className="get-recommendations-btn"
        onClick={fetchRecommendations}
        disabled={loading || !token}
      >
        {loading ? 'Gerando...' : 'Obter Sugestões'}
      </button>

      {suggestions && (
        <div className="suggestions">
          <p className="suggestions-text">{suggestions}</p>
        </div>
      )}
    </div>
  )
}

export default RecommendationsWidget
```

---

## 📈 Métricas de Recomendação

```javascript
// Rastrear quais recomendações o usuário clica
db.run(
  `INSERT INTO recommendation_clicks (user_id, movie_id, recommendation_type)
   VALUES (?, ?, ?)`,
  [userId, movieId, 'ai']
)

// Calcular Taxa de Clique = Cliques / Recomendações Mostradas
```

---

## 🎯 Próximos Passos

### Curto Prazo
- [ ] Filtragem colaborativa simples
- [ ] Sistema de gêneros
- [ ] Recomendações por favoritos

### Médio Prazo
- [ ] Integração Claude API
- [ ] Rastreamento de CTR
- [ ] Feedback do usuário

### Longo Prazo
- [ ] Machine Learning próprio
- [ ] Recomendações em tempo real
- [ ] A/B testing de algoritmos

---

## 💰 Custos

| Opção | Custo |
|-------|-------|
| Filtragem Colaborativa | Grátis |
| Claude API | ~$0.01-0.10 por requisição |
| ML próprio | Variável (hospedagem) |

---

## 📚 Recursos

- [Anthropic API Docs](https://docs.anthropic.com/)
- [Claude Models](https://docs.anthropic.com/claude/reference/models-overview)
- [Filtrage Colaborativa](https://en.wikipedia.org/wiki/Collaborative_filtering)

---

**Adicione IA ao seu app! 🚀**
