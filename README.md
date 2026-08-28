# 🎬 SlaFlix - Catálogo de Filmes em Streaming

Um aplicativo moderno para descobrir filmes e séries que estão disponíveis nas principais plataformas de streaming do Brasil.

## ✨ Features

- 🔍 **Busca de Filmes** - Procure por títulos
- 🎯 **Filtros Inteligentes** - Filtre por popularidade, novos lançamentos, etc
- 📱 **Onde Assistir** - Veja em qual plataforma cada filme está disponível (Netflix, Prime Video, Disney+, etc)
- ⭐ **Ratings** - Confira as notas dos filmes
- 📺 **Responsive** - Funciona em web, mobile e desktop
- 🌙 **Dark Mode** - Interface escura otimizada para noite

## 🚀 Como Começar

### Pré-requisitos

- **Node.js** (versão 16+) - [Baixe aqui](https://nodejs.org/)
- **Conta TMDB** (gratuita) - [Crie aqui](https://www.themoviedb.org/signup)

### Passo 1: Obter Chave da API TMDB

1. Vá para [themoviedb.org](https://www.themoviedb.org/)
2. Crie uma conta (é grátis!)
3. Vá para [Settings > API](https://www.themoviedb.org/settings/api)
4. Crie uma aplicação e copie a **API Key**

### Passo 2: Clonar/Baixar o Projeto

```bash
# Se estiver em uma pasta vazia, inicializar git
git init
git remote add origin <seu-repositorio>

# Ou só descompacte os arquivos no seu diretório
```

### Passo 3: Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` e renomeie para `.env`
   ```bash
   cp .env.example .env
   ```

2. Abra o arquivo `.env` e coloque sua chave da API TMDB:
   ```
   VITE_TMDB_API_KEY=cole_sua_chave_aqui
   ```

### Passo 4: Instalar Dependências

```bash
npm install
```

Isso vai baixar React, Vite e outras dependências necessárias.

### Passo 5: Rodar o App

```bash
npm run dev
```

A aplicação vai abrir em `http://localhost:3000`

🎉 **Pronto!** Você deve ver a lista de filmes populares!

## 📁 Estrutura do Projeto

```
SlaFlix/
├── src/
│   ├── components/        # Componentes React
│   │   ├── Header.jsx
│   │   ├── MovieGrid.jsx
│   │   ├── MovieCard.jsx
│   │   └── StreamingBadges.jsx
│   ├── styles/            # CSS dos componentes
│   ├── App.jsx            # Componente principal
│   └── main.jsx           # Entrada da aplicação
├── .env.example           # Template de variáveis
├── package.json           # Dependências
├── vite.config.js         # Configuração do Vite
└── index.html             # HTML principal
```

## 🔧 Como o Código Funciona

### 1. **App.jsx** - O Coração da Aplicação

Este é o componente principal que:
- Busca filmes da API TMDB
- Gerencia estado (filmes carregados, erros, etc)
- Busca informações de streaming para cada filme
- Passa dados para os componentes filhos

```javascript
// Exemplo: Buscar filmes
const fetchMovies = async () => {
  const url = `${API_BASE_URL}/discover/movie?...`
  const response = await fetch(url)
  const data = await response.json()
  setMovies(data.results)
}
```

### 2. **Header.jsx** - Barra de Busca

Permite que o usuário:
- Digite para buscar filmes
- Mude os filtros

### 3. **MovieGrid.jsx** - Grade de Filmes

Mostra todos os filmes em uma grade responsiva.

### 4. **MovieCard.jsx** - Cartão Individual

Cada filme é um cartão que mostra:
- Pôster
- Título
- Nota
- Ao clicar, mostra detalhes e onde assistir

### 5. **StreamingBadges.jsx** - Ícones de Streaming

Mostra em quais plataformas o filme está disponível com ícones coloridos.

## 📊 Entendendo a API TMDB

### Endpoints Usados

1. **Descobrir Filmes**
   ```
   GET /discover/movie?watch_region=BR
   ```
   Retorna filmes com dados de streaming do Brasil.

2. **Detalhes de Streaming**
   ```
   GET /movie/{id}/watch/providers
   ```
   Retorna em quais plataformas o filme está disponível.

### Exemplo de Resposta

```json
{
  "results": [
    {
      "id": 550,
      "title": "Fight Club",
      "poster_path": "/path.jpg",
      "vote_average": 8.8,
      "overview": "Um funcionário...",
      "providers": {
        "flatrate": ["netflix", "prime_video"],
        "rent": ["apple_tv"],
        "buy": ["amazon"]
      }
    }
  ]
}
```

## 🎨 Personalizações

### Mudar Cores

Abra `src/styles/header.css` e procure por:
```css
.logo {
  background: linear-gradient(135deg, #00a8ff 0%, #00d9ff 100%);
}
```

Modifique os valores HEX para suas cores preferidas.

### Mudar Filtros

Em `src/components/Header.jsx`, adicione novos botões de filtro:
```javascript
<button className="filter-btn">Meu Filtro</button>
```

### Adicionar Mais Plataformas

Em `src/components/StreamingBadges.jsx`, adicione no `PROVIDER_INFO`:
```javascript
'minha_plataforma': { name: 'Minha Plataforma', icon: '🎬', color: '#FF0000' }
```

## 🐛 Troubleshooting

### Erro: "VITE_TMDB_API_KEY is not defined"

**Solução:** Você esqueceu de criar o arquivo `.env`. Siga o Passo 3 novamente.

### Erro: "Failed to fetch"

**Solução:** 
- Verifique se sua chave API está correta
- Certifique-se de que sua conexão de internet funciona
- Tente acessar a API TMDB diretamente (pode estar em manutenção)

### Filmes aparecendo sem pôster

**Solução:** Normal! Alguns filmes mais antigos não têm pôster. O app mostra um placeholder.

### App rodando mas não mostra filmes

**Solução:**
1. Abra o DevTools (F12)
2. Vá para a aba "Console"
3. Procure por erros vermelhos
4. Copie o erro e procure no Google

## 📚 Próximos Passos

Agora que você tem o MVP funcionando, você pode:

### Fase 1: Melhorias Rápidas
- [ ] Adicionar mais filtros (gênero, ano)
- [ ] Adicionar ordenação (novos, populares, melhores)
- [ ] Melhorar o design

### Fase 2: Backend (Node.js + Express)
- [ ] Criar API própria para cachear dados
- [ ] Implementar sistema de autenticação (login)
- [ ] Adicionar watchlist pessoal

### Fase 3: Banco de Dados (PostgreSQL)
- [ ] Armazenar usuários
- [ ] Guardar favoritos do usuário
- [ ] Sincronizar entre dispositivos

### Fase 4: Mobile (React Native)
- [ ] Converter para React Native
- [ ] Publicar na App Store / Google Play

## 🤝 Contribuindo

Quer melhorar o projeto? Ótimo!

1. Crie uma branch: `git checkout -b minha-feature`
2. Commit suas mudanças: `git commit -m "Adicionei X"`
3. Push para a branch: `git push origin minha-feature`
4. Abra um Pull Request

## 📝 Licença

MIT - Você é livre para usar, modificar e distribuir.

## ❓ Dúvidas?

- 📖 Documentação TMDB: https://developer.themoviedb.org/docs
- 💬 Comunidade React: https://react.dev
- 🤔 Stack Overflow: https://stackoverflow.com

## 🎯 Roadmap

- [ ] Sistema de favoritos
- [ ] Watchlist persistente
- [ ] Push notifications
- [ ] Integração com Google Calendar
- [ ] App mobile (React Native)
- [ ] Recomendações personalizadas
- [ ] Trailers integrados
- [ ] Social sharing

---

**Divirta-se codando!** 🚀

Desenvolvido com ❤️ para descobrir os melhores filmes do Brasil
