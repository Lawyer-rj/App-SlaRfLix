# 🏗️ Arquitetura do SlaFlix

Este documento descreve como o projeto é estruturado e como tudo funciona junto.

## 📊 Visão Geral

```
┌─────────────────────────────────────────────────────────────────────┐
│                         NAVEGADOR (Frontend)                         │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ React App (index.html → main.jsx → App.jsx)                 │   │
│  │                                                               │   │
│  │  App.jsx (Lógica Principal)                                 │   │
│  │  ├── Busca dados da API TMDB                                │   │
│  │  ├── Gerencia estado (filmes, busca, etc)                  │   │
│  │  └── Passa dados para componentes filhos                    │   │
│  │                                                               │   │
│  │  Componentes:                                               │   │
│  │  ├── Header (Busca e Filtros)                              │   │
│  │  ├── MovieGrid (Grade de filmes)                           │   │
│  │  ├── MovieCard (Cartão individual)                         │   │
│  │  └── StreamingBadges (Ícones de plataformas)              │   │
│  │                                                               │   │
│  │  Estilos CSS:                                              │   │
│  │  ├── global.css (Estilos globais)                          │   │
│  │  ├── header.css (Estilo do header)                         │   │
│  │  ├── movie-grid.css (Grade responsiva)                     │   │
│  │  ├── movie-card.css (Cartão do filme)                      │   │
│  │  └── streaming-badges.css (Badges de streaming)            │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ HTTP Request
                    (fetch dados de filmes)
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         TMDB API (Externa)                           │
│                                                                       │
│  • /discover/movie - Lista filmes                                    │
│  • /movie/{id}/watch/providers - Dados de streaming                  │
└─────────────────────────────────────────────────────────────────────┘
```

## 📁 Estrutura de Pastas

```
SlaFlix/
│
├── src/                          # Código-fonte
│   ├── components/               # Componentes React reutilizáveis
│   │   ├── Header.jsx           # Barra superior (busca + filtros)
│   │   ├── MovieGrid.jsx        # Container da grade de filmes
│   │   ├── MovieCard.jsx        # Cartão individual de filme
│   │   └── StreamingBadges.jsx  # Mostra plataformas de streaming
│   │
│   ├── styles/                   # Arquivos CSS
│   │   ├── global.css           # Estilos globais (cores, fonte, etc)
│   │   ├── app.css              # Estilos da página principal
│   │   ├── header.css           # Estilos do header
│   │   ├── movie-grid.css       # Layout responsivo
│   │   ├── movie-card.css       # Estilos de cada cartão
│   │   └── streaming-badges.css # Estilos dos badges
│   │
│   ├── App.jsx                   # Componente raiz
│   └── main.jsx                  # Entrada da aplicação
│
├── index.html                    # HTML principal (template)
├── package.json                  # Dependências e scripts
├── vite.config.js               # Configuração do bundler (Vite)
├── .env.example                  # Template de variáveis (sem valores)
├── .env                          # Variáveis reais (não commitar!)
├── .gitignore                    # Arquivos para ignorar no Git
│
├── README.md                     # Documentação completa
├── COMECE_AQUI.md               # Guia de início rápido
├── APRENDA_JAVASCRIPT.md        # Tutorial JavaScript para iniciantes
└── ARQUITETURA.md               # Este arquivo

```

## 🔄 Fluxo de Dados

### 1. Quando o App Carrega

```javascript
// App.jsx
useEffect(() => {
  fetchMovies();  // Executa ao carregar
}, []);
```

**Passo a passo:**
1. Navegador carrega `index.html`
2. React renderiza `App.jsx`
3. `useEffect` dispara (pois a dependência `[]` é vazia)
4. `fetchMovies()` busca dados da API TMDB
5. Filmes são armazenados em `state` (useState)
6. Componentes filhos recebem dados via `props`
7. Interface é renderizada

### 2. Quando Usuário Busca

```
Usuário digita "Inception" 
        ↓
onChange do input (Header.jsx)
        ↓
setSearchQuery("Inception")
        ↓
State atualiza em App.jsx
        ↓
filteredMovies = movies.filter(...)
        ↓
MovieGrid renderiza filmes filtrados
        ↓
Interface atualiza instantaneamente
```

### 3. Quando Usuário Clica em "Detalhes"

```
Usuário clica botão "Detalhes" (MovieCard)
        ↓
onClick dispara setShowDetails(!showDetails)
        ↓
State do MovieCard muda
        ↓
Renderização condicional mostra/esconde detalhes
        ↓
{showDetails && <div>Detalhes do filme</div>}
```

## 🔌 Conexão com TMDB API

### O que Fazemos:

```javascript
// App.jsx - fetchMovies()

// 1. Buscar lista de filmes
const url = `${API_BASE_URL}/discover/movie?...`;
const response = await fetch(url);
const data = await response.json();

// 2. Para CADA filme, buscar dados de streaming
const moviesWithProviders = await Promise.all(
  data.results.map(async (movie) => {
    const provUrl = `${API_BASE_URL}/movie/${movie.id}/watch/providers?...`;
    const provRes = await fetch(provUrl);
    const provData = await provRes.json();
    return { ...movie, providers: provData.results?.BR };
  })
);

// 3. Guardar no state
setMovies(moviesWithProviders);
```

**O que vem de volta:**

```json
{
  "id": 550,
  "title": "Fight Club",
  "poster_path": "/xxx.jpg",
  "vote_average": 8.8,
  "overview": "Um homem anônimo insone...",
  "release_date": "1999-10-15",
  "providers": {
    "flatrate": ["netflix", "prime_video"],
    "rent": ["apple_tv"],
    "buy": ["amazon"]
  }
}
```

## 🎨 Fluxo de Renderização

```
App.jsx (Componente Pai)
│
├── <Header />
│   ├── Input de busca
│   ├── Botões de filtro
│   └── Logo
│
└── <MovieGrid movies={filteredMovies} />
    └── {movies.map(movie => (
         <MovieCard movie={movie} />
         ├── <img poster />
         ├── <h3 title />
         ├── <p rating />
         └── {showDetails && (
              <div details>
              ├── <p synopsis />
              └── <StreamingBadges providers={movie.providers} />
                  └── Badges Netflix, Prime, etc
         )}
       ))}
```

## 🚦 Estados e Props

### App.jsx - States (Dados que Mudam)

```javascript
const [movies, setMovies] = useState([]);           // Lista de filmes
const [loading, setLoading] = useState(true);       // Carregando?
const [error, setError] = useState(null);           // Erro?
const [searchQuery, setSearchQuery] = useState('');  // Busca do usuário
const [selectedGenre, setSelectedGenre] = useState('all');  // Gênero
```

### MovieCard.jsx - State Individual

```javascript
const [showDetails, setShowDetails] = useState(false);  // Mostrar detalhes?
```

### Fluxo de Props

```
App.jsx
├── Passa para Header:
│   └── onSearch={setSearchQuery}
│       onGenreChange={setSelectedGenre}
│
└── Passa para MovieGrid:
    └── movies={filteredMovies}
        └── MovieCard recebe:
            └── movie={{ id, title, poster_path, ... }}
                └── StreamingBadges recebe:
                    └── providers={movie.providers}
```

## 🔐 Variáveis de Ambiente

A chave da API fica segura usando variáveis de ambiente:

```javascript
// Em App.jsx
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
```

```
// No arquivo .env
VITE_TMDB_API_KEY=sua_chave_aqui
```

**Por quê?**
- A chave nunca aparece no código-fonte
- Cada desenvolvedor tem sua própria chave
- Git ignora o arquivo `.env` (`.gitignore`)
- Em produção, variáveis são configuradas no servidor

## 🎯 Responsividade

O app funciona em 3 tamanhos:

```css
/* Desktop (1200px+) */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));

/* Tablet (768px) */
grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));

/* Mobile (480px) */
grid-template-columns: repeat(2, 1fr);
```

## 📈 Escalabilidade - Próximos Passos

### Fase 2: Backend (Node.js + Express)

```
┌─────────────┐              ┌──────────────┐
│   Frontend  │ ←────HTTP──→ │  Backend API │
│   React     │              │  Node.js     │
└─────────────┘              └──────────────┘
                                    │
                          ┌─────────▼────────┐
                          │   PostgreSQL     │
                          │   Database       │
                          └──────────────────┘
```

**Endpoints que vamos criar:**
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Fazer login
- `POST /api/favorites` - Salvar favorito
- `GET /api/favorites` - Listar favoritos
- `POST /api/watchlist` - Adicionar à watchlist
- `GET /api/watchlist` - Listar watchlist

### Fase 3: Mobile (React Native)

```
┌─────────────────────┐
│  Código Compartilhado│  (Lógica, utils)
└─────────────────────┘
      ↓         ↓
┌─────────┐  ┌─────────┐
│  Web    │  │ Mobile  │  (UI específica)
│ React   │  │ React   │
└─────────┘  │ Native  │
             └─────────┘
```

### Fase 4: Banco de Dados

```sql
-- Usuários
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP
);

-- Favoritos
CREATE TABLE favorites (
  id INT PRIMARY KEY,
  user_id INT REFERENCES users(id),
  movie_id INT,
  added_at TIMESTAMP
);

-- Watchlist
CREATE TABLE watchlist (
  id INT PRIMARY KEY,
  user_id INT REFERENCES users(id),
  movie_id INT,
  status VARCHAR(50),  -- watching, watched, want_to_watch
  added_at TIMESTAMP
);
```

## 📚 Tecnologias Usadas

| Tecnologia | Versão | Função |
|-----------|--------|--------|
| React | 18.2.0 | Framework UI |
| Vite | 4.4.0 | Bundler (empacota código) |
| CSS | 3 | Estilos |
| Fetch API | Nativo | Requisições HTTP |
| TMDB API | - | Fonte de dados de filmes |

## 🔍 Como Debugar

### 1. DevTools (F12)
```
Console → Procure erros (texto vermelho)
Network → Veja requisições para TMDB
Elements → Inspecione HTML
```

### 2. console.log()
```javascript
// Em qualquer lugar do código
console.log('Valor:', variavel);
console.log('Tipo:', typeof variavel);
console.log('Objeto:', filme);
```

### 3. React DevTools (Extensão)
```
Chrome Extensions → React DevTools
Ajuda a ver estado (state) e props
```

## 🎓 Padrões de Código Usados

### 1. Componentes Funcionais
```javascript
// Novo (React moderna)
function Header(props) { ... }

// Antigo (evite)
class Header extends React.Component { ... }
```

### 2. Hooks (useState, useEffect)
```javascript
// State
const [count, setCount] = useState(0);

// Side effects
useEffect(() => {
  // código aqui
}, [dependências]);
```

### 3. Destructuring
```javascript
// Pegar valores de objetos
const { titulo, ano } = filme;
const { title, poster_path } = movie;
```

### 4. Arrow Functions
```javascript
const dobrar = (n) => n * 2;
const saudacao = () => "Olá";
```

## 🔗 Referências Rápidas

- **React Docs:** https://react.dev
- **TMDB API:** https://developer.themoviedb.org/
- **MDN JavaScript:** https://developer.mozilla.org/pt-BR/docs/Web/JavaScript
- **CSS Grid:** https://css-tricks.com/snippets/css/complete-guide-grid/

---

**Pronto para explorar o código?** 🚀 Abra o VS Code e comece a ler os arquivos em `src/`!
