# ⚡ Quick Start - SlaRFlix em 5 Minutos

## 1️⃣ Abra 2 Terminais

### Terminal 1 - Backend
```bash
cd "i:\Dev\GitHub\App SlaRfLix\backend"
npm run dev
```

Espere ver:
```
🎬 SlaRFlix Backend
🚀 Rodando na porta 3001
```

### Terminal 2 - Frontend
```bash
cd "i:\Dev\GitHub\App SlaRfLix"
npm run dev
```

Espere ver:
```
http://localhost:3000/
```

---

## 2️⃣ Abra no Navegador

```
http://localhost:3000
```

---

## 3️⃣ Teste

1. **Clique em "Entrar"**
2. **Clique em "Registre-se"**
3. **Preencha:**
   - Nome: `Seu Nome`
   - Email: `teste@teste.com`
   - Senha: `123456`
4. **Clique em "Registrar"**
5. **Busque um filme** (ex: "Matrix")
6. **Clique em ❤️** para favoritar
7. **Clique no seu nome** para ver perfil

---

## 4️⃣ Pronto! 🎉

Seu app está rodando com:
- ✅ Autenticação funcionando
- ✅ Catálogo de filmes
- ✅ Favoritos salvos
- ✅ Watchlist

---

## 📁 Arquivos Importantes

| Arquivo | O quê? |
|---------|--------|
| `.env.local` | Chave TMDB (frontend) |
| `backend/.env` | JWT_SECRET e config |
| `src/App.jsx` | App principal |
| `backend/server.js` | Servidor API |

---

## 🔗 Dados de Teste

**Email:** `teste@teste.com`
**Senha:** `123456`

---

## ❓ Problemas?

- Backend não roda? → `npm install` na pasta `backend/`
- "Failed to fetch"? → Certifique-se que backend está rodando
- Chave TMDB? → Vá para https://www.themoviedb.org/settings/api

---

**Próximo:** Leia [GUIA_COMPLETO.md](GUIA_COMPLETO.md) para mais detalhes
