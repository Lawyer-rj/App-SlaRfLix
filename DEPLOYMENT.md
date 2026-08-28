# 🚀 Guia de Deployment - SlaRFlix

Deploy seu app em produção em 30 minutos!

---

## 📋 Plano de Deployment

```
Frontend (React)      Backend (Node.js)
    ↓                      ↓
 Vercel              Railway/Render
    ↓                      ↓
 Produção            Produção
```

---

## 🌐 Deploy Frontend (Vercel)

### Passo 1: Preparar Repositório Git

```bash
cd "i:\Dev\GitHub\App SlaRfLix"
git init
git add .
git commit -m "Initial commit: SlaRFlix full-stack app"
```

### Passo 2: Criar Repositório GitHub

1. Vá para https://github.com/new
2. Crie repositório: `slarflix`
3. Copie commands:

```bash
git remote add origin https://github.com/seu-usuario/slarflix.git
git branch -M main
git push -u origin main
```

### Passo 3: Deploy com Vercel

1. Vá para https://vercel.com/
2. Clique em **"Import Project"**
3. Selecione seu repositório GitHub
4. Configure:
   - **Framework:** Vite
   - **Root Directory:** `.`
5. Adicione variáveis de ambiente:
   - `VITE_TMDB_API_KEY` = sua chave TMDB
   - `VITE_API_URL` = `https://seu-backend.herokuapp.com/api`
6. Clique em **"Deploy"**

✅ **Pronto!** Seu frontend está em produção!

URL: `https://seu-projeto.vercel.app`

---

## 🖥️ Deploy Backend (Railway)

### Opção A: Railway (Recomendado)

1. Vá para https://railway.app
2. Clique em **"Deploy from GitHub"**
3. Conecte sua conta GitHub
4. Selecione repositório `slarflix`
5. Railway faz deploy automático
6. Adicione variáveis de ambiente:
   - `PORT` = 3001
   - `JWT_SECRET` = chave segura aleatória
   - `NODE_ENV` = production

✅ URL: `https://seu-projeto-railway.up.railway.app`

### Opção B: Render

1. Vá para https://render.com
2. Clique em **"New +"** → **"Web Service"**
3. Conecte GitHub
4. Configure:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
5. Adicione variáveis de ambiente

---

## 🔗 Conectar Frontend com Backend

No arquivo `src/contexts/AuthContext.jsx`, altere:

```javascript
// De:
const API_URL = 'http://localhost:3001/api'

// Para:
const API_URL = process.env.VITE_API_URL || 'https://seu-backend.railway.app/api'
```

Atualizar todos os hooks também:
- `src/hooks/useFavorites.js`
- `src/hooks/useWatchlist.js`
- `src/components/RatingSystem.jsx`
- `mobile/screens/LoginScreen.js`

---

## 🔒 Variáveis de Ambiente

### Frontend (`.env.production`)
```
VITE_TMDB_API_KEY=sua_chave_tmdb
VITE_API_URL=https://seu-backend.railway.app/api
```

### Backend (`backend/.env.production`)
```
PORT=3001
NODE_ENV=production
JWT_SECRET=gerar-chave-super-segura-random-aqui-123456789
DATABASE_PATH=./database.db
```

---

## 📊 Monitorar Produção

### Vercel
- Dashboard: https://vercel.com/dashboard
- Logs: Clique no projeto → "Deployments" → "Runtime Logs"

### Railway
- Dashboard: https://railway.app
- Logs: Clique no projeto → "Runtime Logs"

---

## 🐛 Troubleshooting

### "Failed to fetch"
**Problema:** Backend URL incorreta

**Solução:** Verificar variável `VITE_API_URL` no Vercel

### Database não inicializa
**Problema:** Railway usando diretório temporário

**Solução:** Usar banco PostgreSQL gratuito do Railway

### CORS error
**Problema:** Domínio frontend não autorizado

**Solução:** Verificar CORS no `backend/server.js`:

```javascript
app.use(cors({
  origin: 'https://seu-frontend.vercel.app',
  credentials: true
}))
```

---

## 📱 Deploy Mobile (Opcional)

### Gerar APK para Android

```bash
cd mobile
eas build --platform android
```

### Gerar IPA para iOS

```bash
cd mobile
eas build --platform ios
```

Requer conta Expo Paid (~$99/ano)

---

## ✅ Checklist Final

- [ ] Frontend deployd em Vercel
- [ ] Backend deployd em Railway
- [ ] Variáveis de ambiente configuradas
- [ ] CORS habilitado
- [ ] Database funcionando
- [ ] JWT_SECRET seguro
- [ ] TMDB API key válida
- [ ] Testar login em produção
- [ ] Testar busca de filmes
- [ ] Testar favoritos

---

## 🎉 Resultado

```
Frontend: https://seu-projeto.vercel.app
Backend:  https://seu-projeto-railway.app
```

**Seu app está VIVO na internet!** 🎊

---

## 📈 Próximos Passos

1. **Monitorar performance** com Vercel Analytics
2. **Configurar CI/CD** no GitHub Actions
3. **Adicionar SSL** (automático em Vercel/Railway)
4. **Escalar banco de dados** se necessário
5. **Implementar CDN** para imagens

---

## 🔗 Links Úteis

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)

---

**Parabéns! Seu app está em produção!** 🚀
