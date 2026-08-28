# 🎬 SlaRFlix Backend API

Backend Node.js + Express com autenticação JWT e banco SQLite.

## 🚀 Como Começar

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o `.env` e mude a `JWT_SECRET` para algo seguro.

### 3. Rodar o Servidor

**Modo desenvolvimento** (com auto-reload):
```bash
npm run dev
```

**Modo produção**:
```bash
npm start
```

Servidor rodará em `http://localhost:3001`

---

## 📚 API Endpoints

### 🔐 Autenticação

#### Register - Criar conta
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senha123",
  "name": "Seu Nome"
}

// Response:
{
  "message": "Usuário registrado com sucesso!",
  "user": { "id": 1, "email": "usuario@email.com", "name": "Seu Nome" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login - Entrar
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "senha123"
}

// Response:
{
  "message": "Login realizado com sucesso!",
  "user": { "id": 1, "email": "usuario@email.com", "name": "Seu Nome" },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Verificar Token
```
GET /api/auth/me
Authorization: Bearer seu_token_aqui

// Response:
{
  "user": { "id": 1, "email": "usuario@email.com", "name": "Seu Nome" }
}
```

#### Logout
```
POST /api/auth/logout

// Response:
{
  "message": "Logout realizado com sucesso!"
}
```

---

### ⭐ Favoritos

#### Adicionar aos Favoritos
```
POST /api/favorites/add
Authorization: Bearer seu_token_aqui
Content-Type: application/json

{
  "movieId": 550,
  "title": "Fight Club",
  "posterPath": "/path.jpg"
}
```

#### Remover dos Favoritos
```
DELETE /api/favorites/123
Authorization: Bearer seu_token_aqui
```

#### Listar Favoritos
```
GET /api/favorites
Authorization: Bearer seu_token_aqui

// Response:
{
  "favorites": [
    {
      "id": 1,
      "user_id": 1,
      "movie_id": 550,
      "title": "Fight Club",
      "poster_path": "/path.jpg",
      "added_at": "2026-08-27T10:30:00"
    }
  ]
}
```

#### Verificar se é Favorito
```
GET /api/favorites/check/550
Authorization: Bearer seu_token_aqui

// Response:
{
  "isFavorite": true
}
```

---

### 📺 Watchlist

#### Adicionar à Watchlist
```
POST /api/watchlist/add
Authorization: Bearer seu_token_aqui
Content-Type: application/json

{
  "movieId": 550,
  "title": "Fight Club",
  "posterPath": "/path.jpg",
  "status": "want_to_watch"  // want_to_watch, watching, watched
}
```

#### Remover da Watchlist
```
DELETE /api/watchlist/550
Authorization: Bearer seu_token_aqui
```

#### Listar Watchlist
```
GET /api/watchlist
Authorization: Bearer seu_token_aqui

// Response:
{
  "watchlist": [
    {
      "id": 1,
      "user_id": 1,
      "movie_id": 550,
      "title": "Fight Club",
      "poster_path": "/path.jpg",
      "status": "want_to_watch",
      "added_at": "2026-08-27T10:30:00"
    }
  ]
}
```

#### Atualizar Status
```
PATCH /api/watchlist/550/status
Authorization: Bearer seu_token_aqui
Content-Type: application/json

{
  "status": "watched"  // want_to_watch, watching, watched
}
```

---

## 🔒 Autenticação

Todas as rotas exceto login e register precisam do header:

```
Authorization: Bearer seu_token_jwt_aqui
```

O token é retornado ao fazer login/register e expira em 7 dias.

---

## 💾 Banco de Dados

SQLite com 3 tabelas:

- **users** - Usuários registrados
- **favorites** - Filmes favoritos
- **watchlist** - Lista para assistir

Banco criado automaticamente na primeira execução em `database.db`

---

## 🧪 Testar com cURL

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"senha123","name":"Teste"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"senha123"}'

# Adicionar favorito (use seu token)
curl -X POST http://localhost:3001/api/favorites/add \
  -H "Authorization: Bearer seu_token_aqui" \
  -H "Content-Type: application/json" \
  -d '{"movieId":550,"title":"Fight Club","posterPath":"/path.jpg"}'
```

---

## 📝 Estrutura de Pastas

```
backend/
├── server.js          # Arquivo principal
├── database.js        # Configuração SQLite
├── routes/
│   ├── auth.js       # Autenticação
│   ├── favorites.js  # Favoritos
│   └── watchlist.js  # Watchlist
├── package.json
├── .env.example
├── .gitignore
└── database.db       # Criado automaticamente
```

---

## 🚨 Variáveis de Ambiente

```
PORT=3001                    # Porta do servidor
NODE_ENV=development         # Ambiente
JWT_SECRET=sua_chave_secreta # Chave para assinar JWT
DATABASE_PATH=./database.db  # Caminho do banco
```

---

## 🔗 Próximos Passos

1. ✅ Backend rodando
2. ⏳ Conectar Frontend com Backend
3. ⏳ Criar tela de Login/Register
4. ⏳ Implementar Favoritos no Frontend
5. ⏳ Implementar Watchlist no Frontend

---

**Backend pronto! 🚀**
