# 🎬 SlaRFlix - Guia Completo

**Um clone do Netflix para descobrir filmes e séries em streaming no Brasil!**

---

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Tecnologias](#tecnologias)
3. [Instalação](#instalação)
4. [Como Rodar](#como-rodar)
5. [Arquitetura](#arquitetura)
6. [Features](#features)
7. [Guia de Uso](#guia-de-uso)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)
10. [Próximas Features](#próximas-features)

---

## 🎯 Visão Geral

**SlaRFlix** é uma plataforma moderna para descobrir filmes e séries que estão disponíveis em streaming no Brasil. 

Você pode:
- ✅ Buscar filmes em tempo real
- ✅ Ver onde assistir (Netflix, Prime Video, Disney+, etc)
- ✅ Criar conta e salvar favoritos
- ✅ Adicionar filmes à watchlist
- ✅ Ver seu perfil com todos os seus filmes

---

## 💻 Tecnologias

### Frontend
- **React 18** - Interface moderna
- **Vite** - Bundler rápido
- **CSS3** - Estilos responsivos

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **SQLite** - Banco de dados local
- **JWT** - Autenticação segura
- **bcryptjs** - Hash de senhas

### APIs
- **TMDB API** - Dados de filmes

---

## 🛠️ Instalação

### Pré-requisitos
- Node.js v16+ ([Baixar](https://nodejs.org/))
- Git (opcional)

### Clone/Download do Projeto

```bash
# Se tiver git
git clone <seu-repositorio> slarflix
cd slarflix

# Ou simplesmente use a pasta já criada
cd "i:\Dev\GitHub\App SlaRfLix"
```

### Configurar Frontend

```bash
# Não precisa instalar (já foi feito)
# Mas se precisar:
npm install
```

### Configurar Backend

```bash
cd backend
npm install
```

### Configurar Variáveis de Ambiente

**Frontend** - Arquivo `.env.local`:
```
VITE_TMDB_API_KEY=sua_chave_tmdb_aqui
```

**Backend** - Arquivo `.env`:
```
PORT=3001
NODE_ENV=development
JWT_SECRET=sua_chave_secreta_super_segura_aqui_123456789
DATABASE_PATH=./database.db
```

---

## 🚀 Como Rodar

### Opção 1: Dois Terminais (Recomendado)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Você verá:
```
╔════════════════════════════════════╗
║  🎬 SlaRFlix Backend               ║
║  🚀 Rodando na porta 3001          ║
║  📍 http://localhost:3001          ║
╚════════════════════════════════════╝
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Você verá:
```
VITE v4.5.0  ready in 241 ms

  ➜  Local:   http://localhost:3000/
```

### Acessar

Abra: **http://localhost:3000**

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
SlaRfLix/
├── src/                      # Código React
│   ├── components/           # Componentes reutilizáveis
│   │   ├── Header.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieSection.jsx
│   │   ├── HeroBanner.jsx
│   │   ├── LoginRegister.jsx
│   │   └── UserProfile.jsx
│   ├── contexts/             # Context API
│   │   └── AuthContext.jsx
│   ├── hooks/                # Custom Hooks
│   │   ├── useFavorites.js
│   │   └── useWatchlist.js
│   ├── styles/               # CSS
│   │   ├── global.css
│   │   ├── header.css
│   │   ├── movie-card.css
│   │   └── ...
│   ├── App.jsx               # App principal
│   └── main.jsx              # Entry point
├── backend/                  # API Node.js
│   ├── server.js             # Servidor principal
│   ├── database.js           # Config SQLite
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   ├── favorites.js
│   │   └── watchlist.js
│   └── package.json
├── public/                   # Arquivos estáticos
│   └── images/
│       └── surf-logo.png
└── ...
```

### Fluxo de Dados

```
Frontend (React)
    ↓
AuthContext (Login/Logout)
    ↓
useFavorites/useWatchlist (Hooks)
    ↓
Fetch API
    ↓
Backend (Express)
    ↓
JWT Verification
    ↓
SQLite Database
    ↓
Response JSON
```

---

## ✨ Features

### 🏠 Home Page
- Hero banner com filme destaque
- 3 seções: Populares, Novos Lançamentos, Top Rated
- Busca em tempo real
- Layout responsivo

### 🎬 Filmes
- Exibição em grid/carousel
- Informações: título, nota, ano
- Donde assistir (badges de streaming)
- Sinopse ao clicar em "Detalhes"

### 👤 Autenticação
- Register com email e senha
- Login seguro com JWT
- Sessão persistida (localStorage)
- Logout

### ❤️ Favoritos
- Salvar/remover favoritos
- Visualizar lista de favoritos
- Persistência no banco

### 📺 Watchlist
- Adicionar à watchlist
- Status: quer assistir, assistindo, assistido
- Gerenciar watchlist

### 👥 Perfil
- Ver informações do usuário
- Abas de Favoritos e Watchlist
- Atualizar dados

---

## 📖 Guia de Uso

### 1. Criar Conta

1. Clique em **"Entrar"** (canto superior direito)
2. Clique em **"Registre-se"**
3. Preencha:
   - **Nome** - Seu nome completo
   - **Email** - Email válido
   - **Senha** - Mínimo 6 caracteres
4. Clique em **"Registrar"**

### 2. Fazer Login

1. Clique em **"Entrar"**
2. Digite seu **email** e **senha**
3. Clique em **"Entrar"**

### 3. Buscar Filmes

1. Digite o nome do filme na barra de busca
2. Resultados aparecem automaticamente
3. Clique em **"Detalhes"** para mais informações

### 4. Adicionar aos Favoritos

1. Passe o mouse no pôster
2. Clique no botão **🤍** (coração vazio)
3. Agora está **❤️** (vermelho) = adicionado

### 5. Adicionar à Watchlist

1. Passe o mouse no pôster
2. Clique no botão **📋** (lista vazia)
3. Agora está **📺** (ativo) = adicionado

### 6. Ver Seu Perfil

1. Clique no seu **nome** (canto superior direito)
2. Você verá suas abas:
   - **❤️ Favoritos** - Filmes que marcou como favorito
   - **📺 Watchlist** - Filmes que quer assistir

### 7. Sair da Conta

1. Clique em **"Sair"** (canto superior direito)

---

## 🚀 Deployment

### Deploy Frontend (Vercel)

**Vercel é gratuito e fácil!**

1. **Instale Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Siga as instruções**

4. **Configure variáveis de ambiente** no painel Vercel:
   - `VITE_TMDB_API_KEY` = sua chave TMDB

### Deploy Backend (Railway ou Render)

**Railway.app (Recomendado):**

1. Vá para https://railway.app/
2. Clique em **"Deploy from GitHub"**
3. Conecte seu repositório
4. Railway faz deploy automaticamente
5. Configure variáveis de ambiente no painel

**Variáveis necessárias:**
```
PORT=3001
NODE_ENV=production
JWT_SECRET=uma_chave_muito_segura_aqui
DATABASE_PATH=./database.db
```

### Conectar Frontend com Backend em Produção

No arquivo `src/contexts/AuthContext.jsx`, mude:

```javascript
const API_URL = 'http://localhost:3001/api'
```

Para:

```javascript
const API_URL = 'https://seu-backend-em-producao.com/api'
```

---

## 🐛 Troubleshooting

### "Failed to fetch" ao fazer login

**Problema:** Backend não está rodando

**Solução:**
```bash
cd backend
npm install
npm run dev
```

### "Cannot find module 'express'"

**Problema:** Dependências não instaladas

**Solução:**
```bash
cd backend
npm install
```

### Banco de dados vazio

**Problema:** SQLite ainda não criou as tabelas

**Solução:** Reinicie o backend:
```bash
npm run dev
```

### TMDB API key inválida

**Problema:** Chave expirada ou incorreta

**Solução:**
1. Vá para https://www.themoviedb.org/settings/api
2. Gere uma nova chave
3. Atualize em `.env.local`
4. Recarregue o navegador

### Porta 3000/3001 já em uso

**Problema:** Outra aplicação usando a mesma porta

**Solução:**
- Mate o processo anterior
- Ou configure outra porta em `vite.config.js` e `.env`

---

## 🎯 Próximas Features

### Curto Prazo (1-2 semanas)
- [ ] Sistema de ratings/avaliações
- [ ] Comentários em filmes
- [ ] Recomendações personalizadas
- [ ] Dark/Light theme toggle
- [ ] Notificações de novos filmes

### Médio Prazo (1-2 meses)
- [ ] App Mobile (React Native)
- [ ] Integração com player de vídeo
- [ ] Social features (compartilhar)
- [ ] Sistema de seguir usuários
- [ ] Histórico de assistidos

### Longo Prazo (3+ meses)
- [ ] Sistema de assinatura
- [ ] Recomendações com IA
- [ ] Integração com todas plataformas
- [ ] App Desktop (Electron)
- [ ] Sistema de notificações push

---

## 📚 Documentação Adicional

- [README.md](README.md) - Visão geral do projeto
- [backend/README.md](backend/README.md) - Documentação da API
- [ARQUITETURA.md](ARQUITETURA.md) - Detalhes técnicos
- [APRENDA_JAVASCRIPT.md](APRENDA_JAVASCRIPT.md) - Tutorial JavaScript

---

## 🤝 Contribuindo

Quer melhorar o projeto?

1. Fork o repositório
2. Crie uma branch: `git checkout -b minha-feature`
3. Commit: `git commit -m "Adicionei X"`
4. Push: `git push origin minha-feature`
5. Abra um Pull Request

---

## 📞 Suporte

- 🐛 Encontrou um bug? Abra uma [Issue](https://github.com/seu-usuario/slarflix/issues)
- 💬 Tem uma sugestão? Deixe nos [Discussions](https://github.com/seu-usuario/slarflix/discussions)
- 📧 Email: seu-email@exemplo.com

---

## 📄 Licença

MIT - Você é livre para usar, modificar e distribuir este projeto.

---

**Desenvolvido com ❤️ para descobrir os melhores filmes do Brasil**

🎬 **SlaRFlix** - Assista onde quiser!

---

## 🎓 Recursos para Aprender

- [React Docs](https://react.dev)
- [Node.js Docs](https://nodejs.org/en/docs/)
- [TMDB API](https://developer.themoviedb.org/)
- [Express.js](https://expressjs.com/)
- [SQLite](https://www.sqlite.org/)

---

**Última atualização:** 27 de Agosto de 2026

**Versão:** 1.0.0

**Status:** ✅ Pronto para usar!
