# 🎨 Melhorias & Polimento - SlaRFlix

Guia para aprimorar seu app.

---

## 🌓 Dark/Light Theme Toggle

### Passo 1: Criar ThemeContext

Arquivo: `src/contexts/ThemeContext.jsx`

```javascript
import { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) setIsDark(saved === 'dark')
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    localStorage.setItem('theme', isDark ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
```

### Passo 2: Usar em App.jsx

```javascript
import { ThemeProvider } from './contexts/ThemeContext'

<ThemeProvider>
  <YourApp />
</ThemeProvider>
```

### Passo 3: Criar CSS Variables

Arquivo: `src/styles/theme.css`

```css
:root[data-theme="light"] {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #000000;
  --text-secondary: #666666;
  --border-color: #dddddd;
}

:root[data-theme="dark"] {
  --bg-primary: #0f0f0f;
  --bg-secondary: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #aaaaaa;
  --border-color: #333333;
}
```

---

## 📱 Otimizações Mobile

### 1. Lazy Loading de Imagens

```javascript
<img
  src={posterUrl}
  alt="poster"
  loading="lazy"
/>
```

### 2. Compressão de Imagens

Use Cloudinary ou ImageKit:

```javascript
const optimizedUrl = `https://cdn.example.com/w_200/q_80/${imageId}`
```

### 3. Paginação de Listas

```javascript
const [page, setPage] = useState(1)

const handleLoadMore = async () => {
  const newMovies = await fetchMovies(page + 1)
  setMovies([...movies, ...newMovies])
  setPage(page + 1)
}
```

### 4. Debounce na Busca

```javascript
import { useState, useCallback } from 'react'

const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

const handleSearch = useCallback(
  debounce((query) => searchMovies(query), 500),
  []
)
```

---

## ⚡ Performance

### 1. Code Splitting

```javascript
import { lazy, Suspense } from 'react'

const MovieCard = lazy(() => import('./MovieCard'))

<Suspense fallback={<Loading />}>
  <MovieCard movie={movie} />
</Suspense>
```

### 2. Memoização

```javascript
import { memo } from 'react'

const MovieCard = memo(function MovieCard({ movie }) {
  return <div>{movie.title}</div>
})
```

### 3. Virtual Lists (Grandes Listas)

```bash
npm install react-window
```

```javascript
import { FixedSizeList } from 'react-window'

<FixedSizeList
  height={600}
  itemCount={movies.length}
  itemSize={200}
  width="100%"
>
  {({ index, style }) => (
    <MovieCard movie={movies[index]} style={style} />
  )}
</FixedSizeList>
```

---

## 🔍 SEO (Web)

### 1. Meta Tags

```html
<meta name="description" content="Descubra filmes e séries em streaming no Brasil">
<meta name="keywords" content="filmes, séries, streaming, netflix">
<meta property="og:title" content="SlaRFlix">
<meta property="og:image" content="https://slarflix.com/og-image.png">
```

### 2. Sitemap

Arquivo: `public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://slarflix.vercel.app</loc>
  </url>
</urlset>
```

### 3. robots.txt

```
User-agent: *
Allow: /
Sitemap: https://slarflix.vercel.app/sitemap.xml
```

---

## 🔐 Segurança

### 1. HTTPS Only (Automático em Vercel)

### 2. Content Security Policy

```javascript
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src https:"
  )
  next()
})
```

### 3. Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})

app.use('/api/', limiter)
```

---

## 🎨 UI/UX Melhorias

### 1. Skeleton Loading

```javascript
<div className="skeleton">
  <div className="skeleton-line"></div>
  <div className="skeleton-line"></div>
</div>
```

```css
.skeleton {
  background: linear-gradient(90deg, #1a1a1a 25%, #333 50%, #1a1a1a 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### 2. Toast Notifications

```bash
npm install react-hot-toast
```

```javascript
import toast from 'react-hot-toast'

toast.success('Filme adicionado aos favoritos!')
toast.error('Erro ao carregar filmes')
```

### 3. Modal Animations

```css
.modal {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
```

---

## 📊 Analytics

### 1. Google Analytics

```bash
npm install react-ga4
```

```javascript
import ReactGA from "react-ga4"

ReactGA.initialize("G-XXXXXXXXXX")
ReactGA.send("pageview")
```

### 2. Sentry (Error Tracking)

```bash
npm install @sentry/react
```

```javascript
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "https://xxxxx@xxxxx.ingest.sentry.io/xxxxx"
})
```

---

## 🧪 Testes

### 1. Unit Tests

```bash
npm install --save-dev vitest
```

```javascript
import { describe, it, expect } from 'vitest'
import { filterMovies } from './utils'

describe('filterMovies', () => {
  it('filters by title', () => {
    const movies = [{ title: 'Matrix' }]
    expect(filterMovies(movies, 'Matrix')).toHaveLength(1)
  })
})
```

### 2. E2E Tests

```bash
npm install --save-dev cypress
```

### 3. Component Tests

```bash
npm install --save-dev @testing-library/react
```

---

## 📋 Checklist de Polimento

- [ ] Dark/Light theme implementado
- [ ] Lazy loading de imagens
- [ ] Paginação funcionando
- [ ] Debounce na busca
- [ ] Code splitting ativado
- [ ] Memoização otimizada
- [ ] SEO tags adicionadas
- [ ] Rate limiting no backend
- [ ] Skeleton loaders implementados
- [ ] Toast notifications prontas
- [ ] Analytics ativados
- [ ] Error tracking ativo
- [ ] Testes unitários escritos
- [ ] Performance <3s load time

---

**Seu app está super polido!** ✨
