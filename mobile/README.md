# 📱 SlaRFlix Mobile - React Native

App mobile de catálogo de filmes usando React Native e Expo.

## 🚀 Começar

### Pré-requisitos
- Node.js v16+
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (macOS)
- Android: Android Studio

### Instalação

```bash
cd mobile
npm install
```

### Configurar API

Certifique-se de que o backend está rodando em `http://localhost:3001`

**Para Android (emulador):**
```bash
npm run android
```

**Para iOS (macOS):**
```bash
npm run ios
```

**Para Web:**
```bash
npm run web
```

## 📁 Estrutura

```
mobile/
├── screens/
│   ├── HomeScreen.js       - Página inicial
│   ├── SearchScreen.js     - Buscar filmes
│   ├── ProfileScreen.js    - Perfil do usuário
│   └── LoginScreen.js      - Login/Register
├── App.js                  - Roteamento e navegação
├── app.json                - Configuração Expo
└── package.json            - Dependências
```

## ✨ Features

- [x] Login/Register
- [x] Listar filmes populares
- [x] Buscar filmes
- [x] Perfil de usuário
- [x] Navegação por abas
- [ ] Favoritos persistidos
- [ ] Watchlist persistida
- [ ] Notificações

## 🔗 Conectar com Backend

O app conecta automaticamente em `http://localhost:3001/api`

**Para desenvolvimento com IP real:**
Se estiver em outro dispositivo, modifique em cada screen:
```javascript
const API_URL = 'http://SEU_IP:3001/api'
```

## 📝 Testando

1. Registre uma conta
2. Faça login
3. Veja filmes populares
4. Busque um filme
5. Veja seu perfil

## 🐛 Troubleshooting

### "Connection refused"
- Backend não está rodando
- Verifique: `http://localhost:3001/api/health`

### Emulador não conecta
- Use o IP real em vez de `localhost`
- No Android: `http://10.0.2.2:3001/api`
- No iOS: `http://localhost:3001/api`

### Dependências quebradas
```bash
rm -rf node_modules
npm install
```

## 📚 Próximas Features

- [ ] Adicionar aos favoritos
- [ ] Adicionar à watchlist
- [ ] Notificações push
- [ ] Dark/Light theme
- [ ] Offline mode
- [ ] Share com amigos

## 🔗 Links

- [React Native Docs](https://reactnative.dev)
- [Expo Docs](https://docs.expo.dev)
- [Navigation Docs](https://reactnavigation.org)

## 📄 Licença

MIT
