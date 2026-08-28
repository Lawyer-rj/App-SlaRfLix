# 📚 Guia Rápido de JavaScript para SlaFlix

Como você não tem experiência de programação, aqui estão os conceitos principais que você precisa entender para trabalhar com este projeto.

## 🎯 Conceitos Básicos

### 1. Variáveis

Variáveis são "caixas" que guardam valores:

```javascript
// var, let, const - formas de declarar variáveis
const nome = "João";        // Constante (não muda)
let idade = 25;             // Variável que pode mudar
var cidade = "São Paulo";   // Antigas (evite usar)

// Tipos de dados
const numero = 42;          // Número
const texto = "Olá";        // String (texto)
const verdade = true;       // Boolean (verdadeiro/falso)
const lista = [1, 2, 3];    // Array (lista)
const objeto = {            // Objeto (dados estruturados)
  nome: "João",
  idade: 25
};
```

### 2. Funções

Funções são blocos de código reutilizáveis:

```javascript
// Função simples
function saudacao(nome) {
  console.log("Olá, " + nome);
}
saudacao("Maria");  // Imprime: Olá, Maria

// Função com retorno
function soma(a, b) {
  return a + b;  // Retorna o resultado
}
const resultado = soma(5, 3);  // resultado = 8

// Arrow functions (mais modernas)
const multiplicar = (a, b) => a * b;
console.log(multiplicar(5, 3));  // 15
```

### 3. Arrays e Loops

```javascript
// Array (lista)
const filmes = ["Inception", "Interstellar", "The Matrix"];

// For - percorre cada item
for (let i = 0; i < filmes.length; i++) {
  console.log(filmes[i]);
}

// forEach - forma mais moderna
filmes.forEach(filme => {
  console.log(filme);
});

// map - transforma cada item
const filmesEmMaiuscula = filmes.map(filme => filme.toUpperCase());

// filter - filtra itens
const nomesCurtos = filmes.filter(filme => filme.length < 10);
```

### 4. Objetos

```javascript
// Criar um objeto
const filme = {
  titulo: "Inception",
  ano: 2010,
  nota: 8.8
};

// Acessar propriedades
console.log(filme.titulo);      // "Inception"
console.log(filme["ano"]);      // 2010

// Modificar propriedades
filme.nota = 9.0;

// Adicionar novas propriedades
filme.diretor = "Christopher Nolan";
```

### 5. Condicionais (if/else)

```javascript
// If / else
const idade = 20;

if (idade >= 18) {
  console.log("Maior de idade");
} else {
  console.log("Menor de idade");
}

// Operadores de comparação
const numero = 5;
numero === 5      // true (igual)
numero !== 5      // false (diferente)
numero > 3        // true (maior que)
numero < 10       // true (menor que)
numero >= 5       // true (maior ou igual)

// Operadores lógicos
const idade = 25;
const temCarteira = true;

if (idade >= 18 && temCarteira) {
  console.log("Pode dirigir");
}

if (idade < 18 || temCarteira === false) {
  console.log("Não pode dirigir");
}
```

---

## ⚛️ React - O Que Você Precisa Saber

React é uma biblioteca JavaScript para criar interfaces interativas.

### 1. Componentes

Um componente é uma função que retorna HTML:

```javascript
// Componente simples
function MeuComponente() {
  return (
    <div>
      <h1>Olá, Mundo!</h1>
      <p>Este é um componente</p>
    </div>
  );
}

// Componente com props (propriedades)
function Filme(props) {
  return (
    <div>
      <h2>{props.titulo}</h2>
      <p>Ano: {props.ano}</p>
    </div>
  );
}

// Usando o componente
<Filme titulo="Inception" ano={2010} />
```

### 2. JSX (JavaScript + HTML)

Você pode escrever HTML dentro do JavaScript:

```javascript
function App() {
  const nome = "João";
  
  return (
    <div>
      <h1>Olá, {nome}!</h1>  {/* Coloque JS entre {} */}
      <p>Bem-vindo ao SlaFlix</p>
    </div>
  );
}
```

### 3. State (Estado) - Dados que Mudam

State é usado quando dados precisam mudar:

```javascript
import { useState } from 'react';

function Contador() {
  // useState retorna [valor, função para mudar]
  const [contador, setContador] = useState(0);
  
  return (
    <div>
      <p>Contagem: {contador}</p>
      <button onClick={() => setContador(contador + 1)}>
        Incrementar
      </button>
    </div>
  );
}
```

### 4. Effects (Efeitos) - Executar Código

useEffect executa código quando o componente carrega:

```javascript
import { useEffect, useState } from 'react';

function MinhaAPI() {
  const [dados, setDados] = useState([]);
  
  useEffect(() => {
    // Este código roda quando o componente carrega
    fetch('https://api.example.com/dados')
      .then(res => res.json())
      .then(data => setDados(data));
  }, []);  // [] = executar só uma vez
  
  return <div>{dados.length} itens carregados</div>;
}
```

### 5. Renderização Condicional

```javascript
function App({ isLogado }) {
  if (!isLogado) {
    return <p>Faça login</p>;
  }
  
  return <p>Bem-vindo!</p>;
}

// Ou usando operador ternário
function App({ isLogado }) {
  return isLogado ? <p>Bem-vindo!</p> : <p>Faça login</p>;
}
```

### 6. Listas (map)

```javascript
function ListaFilmes({ filmes }) {
  return (
    <ul>
      {filmes.map((filme, index) => (
        <li key={index}>{filme.titulo}</li>
      ))}
    </ul>
  );
}
```

---

## 🌐 Fetch - Buscar Dados da Internet

```javascript
// Fetch básico
fetch('https://api.example.com/dados')
  .then(response => response.json())  // Converte para JSON
  .then(data => console.log(data))     // Usa os dados
  .catch(error => console.log('Erro:', error));

// Com async/await (mais moderno)
async function carregarDados() {
  try {
    const response = await fetch('https://api.example.com/dados');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log('Erro:', error);
  }
}
```

---

## 💡 Dicas e Boas Práticas

### Console.log - Seu Melhor Amigo

Use para ver valores:

```javascript
const filme = { titulo: "Inception", nota: 8.8 };
console.log(filme);        // Imprime o objeto
console.log(filme.titulo); // Imprime: Inception
```

Abra o DevTools (F12) → Console para ver.

### Comentários

```javascript
// Isto é um comentário (uma linha)

/* 
   Isto é um comentário
   de várias linhas
*/
```

### Template Literals

```javascript
// Antigas
const msg = "Olá " + nome + "!";

// Modernas (usam backticks)
const msg = `Olá ${nome}!`;
```

### Arrow Functions

```javascript
// Longa
const dobrar = function(numero) {
  return numero * 2;
};

// Curta (arrow function)
const dobrar = (numero) => numero * 2;

// Sem parâmetros
const saudacao = () => "Olá!";

// Múltiplas linhas
const calcular = (a, b) => {
  const soma = a + b;
  return soma * 2;
};
```

---

## 🔍 Entendendo o Código do SlaFlix

### App.jsx - A Lógica Principal

```javascript
// 1. Estado para guardar filmes
const [movies, setMovies] = useState([]);

// 2. Função para buscar de uma API
const fetchMovies = async () => {
  const response = await fetch(url);
  const data = await response.json();
  setMovies(data.results);  // Atualiza o estado
};

// 3. Executar ao carregar
useEffect(() => {
  fetchMovies();
}, []);

// 4. Renderizar com os dados
return (
  <MovieGrid movies={movies} />
);
```

### MovieCard.jsx - Um Filme Individual

```javascript
function MovieCard({ movie }) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Alternar entre mostrar/ocultar detalhes
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  return (
    <div>
      <img src={posterUrl} />
      <button onClick={toggleDetails}>
        {showDetails ? 'Ocultar' : 'Mostrar'} Detalhes
      </button>
      {showDetails && <p>{movie.overview}</p>}
    </div>
  );
}
```

---

## 📚 Recursos para Aprender Mais

- **JavaScript Básico:** https://developer.mozilla.org/pt-BR/docs/Web/JavaScript
- **React Tutorial:** https://react.dev
- **Tutorial Interativo:** https://scrimba.com/learn/learnreact

---

## ✅ Exercício Prático

Tente fazer isso no seu projeto:

1. Abra `src/components/Header.jsx`
2. Adicione um novo botão de filtro:
   ```javascript
   <button className="filter-btn">Meu Filtro</button>
   ```
3. Abra o DevTools (F12) e teste

**Desafio:** Faça esse botão imprimir "Clicado!" no console quando for clicado.

**Dica:** Use `onClick={() => console.log('Clicado!')}`

---

**Pronto para começar?** 🚀 Boa sorte!
