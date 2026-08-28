# 🚀 COMECE AQUI - Guia do Iniciante

Bem-vindo ao SlaFlix! Este guia vai te levar pela mão para colocar o app funcionando.

## ⏱️ Tempo Total: ~15 minutos

## 📋 Pré-Requisitos (2 minutos)

Você precisa ter instalado:

### 1. Node.js

**Windows:**
1. Vá para https://nodejs.org/
2. Baixe a versão **LTS** (a recomendada)
3. Abra o instalador e clique "Next" até terminar
4. Reinicie o computador

**Verificar instalação:**
- Abra o PowerShell ou Cmd
- Digite: `node --version`
- Se aparecer um número (ex: v18.0.0), está instalado!

### 2. Editor de Código (VS Code)

1. Vá para https://code.visualstudio.com/
2. Baixe e instale
3. (Opcional) Instale a extensão "ES7+ React/Redux/React-Native snippets"

---

## 🔑 Passo 1: Obter Chave da API TMDB (3 minutos)

Sem essa chave, o app não funciona.

### Seguir estes passos:

1. Acesse https://www.themoviedb.org/signup
2. Preencha o formulário de cadastro:
   - Email
   - Senha (anote!)
   - Nome
   - Aceite os termos
3. Clique em "Create an account"
4. Verifique seu email (pode entrar no spam)
5. Faça login em https://www.themoviedb.org/
6. Vá para: **Settings > API** (canto superior direito)
7. Copie a **API Key** (a longa sequência de números e letras)

✅ **Pronto!** Você tem sua chave.

---

## 🛠️ Passo 2: Preparar o Projeto (5 minutos)

### 2.1 Criar Arquivo de Configuração

1. Abra a pasta do projeto no VS Code
   - Clique em "File" → "Open Folder"
   - Selecione: `i:\Dev\GitHub\App SlaRfLix`

2. Você vai ver a estrutura:
   ```
   📁 App SlaRfLix
   ├── src/
   ├── .env.example
   ├── package.json
   ├── README.md
   └── ... (outros arquivos)
   ```

3. Crie um novo arquivo chamado `.env`
   - Clique com botão direito em "SlaRfLix" (na árvore esquerda)
   - Clique em "New File"
   - Escreva: `.env` (com ponto no início)

4. Copie o conteúdo abaixo e cole no arquivo `.env`:
   ```
   VITE_TMDB_API_KEY=SUA_CHAVE_AQUI
   ```

5. Substitua `SUA_CHAVE_AQUI` pela chave que você copiou (Passo 1)
   - **Importante:** Remova as aspas se houver
   - **Resultado final:** `VITE_TMDB_API_KEY=a1b2c3d4e5f6...`

6. Salve (Ctrl+S)

### 2.2 Instalar Dependências

1. Abra o terminal do VS Code:
   - Clique em "Terminal" (na barra superior)
   - Clique em "New Terminal"

2. Digite este comando:
   ```bash
   npm install
   ```

3. Espere terminar (pode levar 2-3 minutos)
   - Você vai ver: `added XXX packages`

✅ **Pronto!** Dependências instaladas.

---

## ▶️ Passo 3: Rodar o App (2 minutos)

1. No terminal, digite:
   ```bash
   npm run dev
   ```

2. Você vai ver algo como:
   ```
   > vite

   VITE v4.4.0  ready in 123 ms

   ➜  Local:   http://localhost:3000/
   ➜  press h to show help
   ```

3. Clique no link `http://localhost:3000/` ou copie na barra de endereços

✅ **Pronto!** O app está rodando! 🎉

---

## 🎬 O Que Você Vai Ver

1. **Header Azul** no topo com o logo "🎬 SlaFlix"
2. **Barra de Busca** para procurar filmes
3. **Grade de Filmes** com pôsteres, títulos e notas
4. **Loading** (se estiver carregando) com um spinner

## 🧪 Testando o App

### Procurar um Filme

1. Clique na barra de busca (onde escreve "Buscar filmes...")
2. Escreva: `Matrix`
3. Os filmes devem filtrar automaticamente

### Ver Detalhes de um Filme

1. Passe o mouse em qualquer pôster
2. Clique no botão "Detalhes"
3. Você verá:
   - Sinopse
   - Onde assistir (Netflix, Prime Video, etc)

✅ **Tudo funcionando?** Parabéns! 🎉

---

## ❌ Problemas Comuns

### "Erro: VITE_TMDB_API_KEY is not defined"

**Causa:** Faltou criar o arquivo `.env`

**Solução:**
1. Verifique se o arquivo `.env` existe (não `.env.example`)
2. Verifique se tem sua chave dentro
3. Salve o arquivo (Ctrl+S)
4. Saia do app (Ctrl+C) e rode `npm run dev` novamente

### "Failed to fetch"

**Causa:** Chave API inválida ou internet offline

**Solução:**
1. Verifique se sua chave está correta (sem espaços extras)
2. Verifique sua conexão de internet
3. Tente recarregar a página (F5)

### "Filmes não aparecem"

**Causa:** O app está carregando (viu o spinner?)

**Solução:**
1. Espere 3-5 segundos
2. Se continuar: abra o DevTools (F12) → Console
3. Procure por mensagens de erro (texto vermelho)
4. Me mostre o erro!

---

## 📚 Próximos Passos

Agora que o app está funcionando:

### Curto Prazo (Hoje)
- [ ] Ler [APRENDA_JAVASCRIPT.md](APRENDA_JAVASCRIPT.md)
- [ ] Explorar a interface do app
- [ ] Tentar modificar uma cor em `src/styles/header.css`

### Médio Prazo (Esta semana)
- [ ] Adicionar novo filtro
- [ ] Customizar cores e logo
- [ ] Fazer suas primeiras mudanças de código

### Longo Prazo (Próximas semanas)
- [ ] Ler [README.md](README.md) completo
- [ ] Começar backend (Node.js + Express)
- [ ] Implementar autenticação

---

## 💡 Dicas Úteis

### 1. DevTools (F12)
Seu melhor amigo! Abre um painel onde você pode:
- Ver erros no "Console"
- Inspecionar HTML
- Ver requisições de rede

### 2. Parar o App
- Pressione `Ctrl+C` no terminal

### 3. Recarregar Página
- Se mudar código e não ver mudança: `Ctrl+R` (ou F5)
- Hot reload geralmente funciona sozinho

### 4. Limpar Terminal
- `clear` (macOS/Linux) ou `cls` (Windows)

---

## ✅ Checklist Final

Antes de passar para próximos passos, certifique-se:

- [ ] Node.js instalado (`node --version` funciona)
- [ ] Arquivo `.env` criado com chave API
- [ ] `npm install` rodou com sucesso
- [ ] `npm run dev` roda sem erros
- [ ] App aparece em `http://localhost:3000/`
- [ ] Filmes aparecem na tela
- [ ] Busca funciona
- [ ] Detalhes de um filme aparecem ao clicar

---

## 🆘 Precisa de Ajuda?

1. **Releia este guia** - 90% dos problemas está aqui
2. **Verifique DevTools** (F12 → Console) - veja qual é o erro exato
3. **Google o erro** - provavelmente alguém já teve o mesmo problema
4. **Me pergunte** - estou aqui para ajudar!

---

## 🎉 Parabéns!

Você fez! Você tem um app de filmes rodando no seu computador.

**Próximo:** Leia [APRENDA_JAVASCRIPT.md](APRENDA_JAVASCRIPT.md) para entender como o código funciona.

---

**Bora codar!** 🚀
