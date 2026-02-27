# 🚀 TaskFlow — Projeto de Treinamento React + TypeScript

> Um gerenciador de tarefas que evolui fase a fase, ensinando os principais hooks do React de forma prática e progressiva.

---

## 📋 Visão Geral do Projeto

**TaskFlow** é um aplicativo de gerenciamento de tarefas construído em dois estágios. O objetivo não é apenas aprender a sintaxe dos hooks — é desenvolver o **modelo mental** de como o React funciona.

Cada fase apresenta um conceito, cria uma dor real, e então oferece a solução. Esse ciclo de *sentir o problema antes de ver a resposta* é o que transforma sintaxe em entendimento.

---

## 🛠️ Stack

- **React 18+** com Vite
- **TypeScript** (strict mode)
- **CSS Modules** ou **Tailwind CSS** (à escolha)
- **localStorage** para persistência de dados

---

## ⚙️ Setup Inicial

```bash
npm create vite@latest taskflow -- --template react-ts
cd taskflow
npm install
npm run dev
```

Habilite o `strict mode` no `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

## 🗺️ Mapa de Fases

### 🟢 Stage 1 — Task App (fundação)

| Fase | Conceito | Funcionalidade |
|------|----------|----------------|
| 0.5 | Re-render debug | Sentir o ciclo de vida antes de tudo |
| 1 | `useState` + Derived State | CRUD básico de tarefas |
| 2 | `useEffect` | Persistência no localStorage + bug proposital |
| 3 | Custom Hooks | `useTasks`, `useLocalStorage` |
| 3.5 | Async State Pattern (`useFetch`) | Buscar sugestões de uma API pública |
| 4 | `useRef` | Foco automático + contador de commits |

### 🔵 Stage 2 — Productivity App (escala)

| Fase | Conceito | Funcionalidade |
|------|----------|----------------|
| 5 | `useContext` | Tema global dark/light |
| 6 | `useMemo` + `useCallback` + `useDebounce` | Filtros, busca performática e `React.memo` |

> **Por que dividir em dois estágios?**
> O Stage 1 constrói o modelo mental. O Stage 2 escala a aplicação. Misturar tudo desde o início faz o desenvolvedor "codar para sobreviver" em vez de entender.

---

## 📋 Checklist de PR — use em toda revisão de fase

Antes de considerar qualquer fase concluída, o código deve passar por este checklist. Cole no PR ou na revisão de código:

```
[ ] Não existe estado que pode ser derivado de outro estado
[ ] Nenhum .push(), .splice() ou mutação direta de objeto/array
[ ] useEffect só conversa com o mundo externo (API, DOM, timer, storage)
[ ] Dependências do useEffect estão corretas — sem suprimir warnings
[ ] Hooks customizados não retornam JSX
[ ] Nenhum tipo TypeScript falso (any implícito, type assertion sem validação)
[ ] Context value é estável (não recria objeto a cada render) — Fase 5+
```

---

---

## 📦 FASE 0.5 — Re-render Debug: Sentindo o React

### 🎯 Objetivo
Antes de aprender qualquer hook, o desenvolvedor precisa **sentir** o ciclo de re-render. Quem não sente o re-render nunca vai entender `useMemo` ou `useCallback`.

### 📖 Conceito
O React re-renderiza um componente toda vez que seu estado ou suas props mudam. Entender *quando* e *por que* isso acontece é a base de tudo.

### ✅ O que fazer

Crie um componente simples com um contador e adicione logs estratégicos:

```typescript
function Counter() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');

  console.log('🔄 Counter renderizou');

  return (
    <div>
      <input value={name} onChange={e => setName(e.target.value)} />
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
    </div>
  );
}
```

Agora responda **antes de testar**, depois confira no console:

1. Digitar no input causa re-render?
2. Clicar no botão causa re-render?
3. Se criar um componente filho `<Display count={count} />`, ele re-renderiza quando o input muda?

### 🔥 StrictMode Double Render

No `main.tsx`, o React envolve a aplicação com `<StrictMode>`. Em desenvolvimento, isso faz cada componente renderizar **duas vezes** propositalmente.

```typescript
// main.tsx — isso já vem por padrão no Vite
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Experimento:** remova o `StrictMode` e compare os logs. Depois coloque de volta e entenda por que ele existe (detectar side effects acidentais).

### ✅ Definition of Done
- [ ] Você consegue prever, sem rodar, se um componente vai re-renderizar dado um evento
- [ ] Você entende por que o StrictMode causa double render só em desenvolvimento
- [ ] Você consegue explicar em uma frase: "re-render" ≠ "atualização de DOM"

### 🔎 Perguntas para reflexão
1. O que exatamente faz o React decidir re-renderizar um componente?
2. Um re-render sempre significa que o DOM foi atualizado?
3. Por que o StrictMode renderiza duas vezes só em desenvolvimento?

---

---

## 📦 FASE 1 — `useState` + Derived State

### 🎯 Objetivo
Aprender a gerenciar estado local — e mais importante: **aprender o que NÃO deve ser estado**.

### 📖 Conceito: A Regra do Derived State

> ❗ **Regra fundamental:** Nunca salve no estado algo que pode ser calculado a partir de outro estado.

Esse é um dos erros mais comuns em React. Se você quebrar essa regra, vai criar inconsistências, bugs difíceis de rastrear e código desnecessariamente complexo.

**❌ Errado:**
```typescript
const [tasks, setTasks] = useState<Task[]>([]);
const [completedCount, setCompletedCount] = useState(0); // ← NUNCA FAÇA ISSO

// Agora você precisa manter os dois sincronizados manualmente. É uma bomba-relógio.
```

**✅ Correto:**
```typescript
const [tasks, setTasks] = useState<Task[]>([]);

// Derived state — calculado, não armazenado
const completedCount = tasks.filter(t => t.completed).length;
const pendingCount = tasks.length - completedCount;
```

O `completedCount` sempre estará correto porque é calculado a partir da fonte da verdade (`tasks`). Não há como desincronizar.

**Pergunte sempre:** *"Esse valor pode ser calculado a partir de algo que já está no estado?"* Se sim, não crie outro `useState`.

### 🧱 Estrutura de Tipos

Crie `src/types/task.ts`:

```typescript
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number; // timestamp — use Date.now()
}
```

> ⚠️ **Por que `number` e não `Date`?**
> Quando você salva no `localStorage`, `Date` é serializado como string. Quando carrega, ele **não volta a ser `Date` automaticamente** — continua string. Isso cria um tipo "mentiroso": o TypeScript acha que é `Date`, mas em runtime é `string`. Bugs sutis garantidos.
>
> Com `number` (timestamp), não há surpresa: `JSON.stringify` e `JSON.parse` preservam números sem conversão.
>
> Na hora de exibir: `new Date(task.createdAt).toLocaleDateString()`.

### ✅ O que construir

Uma lista de tarefas com:
- Campo de texto para digitar uma nova tarefa
- Botão para adicionar
- Lista de tarefas renderizadas
- Toggle de concluída / pendente
- Botão para deletar
- Contador de pendentes no header (derived state — não use `useState` para isso)

### 💡 Dicas
- Use `crypto.randomUUID()` para IDs
- Para atualizar um item no array, use `.map()` — **nunca mute o estado diretamente**
- Para remover, use `.filter()`
- O `pendingCount` no header deve ser uma variável comum, não um `useState`

### ✅ Definition of Done
- [ ] Recarregar a página perde os dados (isso é esperado — persistência vem na Fase 2)
- [ ] Não existe nenhum `useState` para valor derivável de `tasks`
- [ ] Adicionar, completar e deletar funcionam sem bugs
- [ ] Nenhum `.push()` ou mutação direta de array

### 🔎 Perguntas para reflexão
1. O que acontece se você tentar fazer `tasks.push(newTask)` sem usar `setTasks`?
2. Qual é a "fonte da verdade" (source of truth) no seu componente agora?
3. Identifique três valores na sua UI que poderiam ser derived state. Eles estão sendo tratados corretamente?

---

---

## 📦 FASE 2 — `useEffect`: Side Effects e uma Armadilha

### 🎯 Objetivo
Entender o que são efeitos colaterais, como sincronizar com sistemas externos — e reconhecer o loop infinito antes que ele aconteça em produção.

### 📖 Conceito
`useEffect` executa código **depois** que o componente renderiza. É a forma do React de se comunicar com o mundo externo: APIs, localStorage, timers, eventos do browser.

```typescript
useEffect(() => {
  // Executa após render
  return () => {
    // Cleanup — executa antes do próximo efeito ou quando o componente desmonta
  };
}, [dependencias]); // Array de dependências controla quando o efeito roda
```

> **Regra de ouro:** `useEffect` só deve conversar com o mundo externo. Se o efeito só lê e escreve estado interno do React, provavelmente ele não deveria existir. Leia [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) antes de avançar.

### 🔥 Bug Proposital — Leia antes de implementar

Antes de escrever o código, analise o trecho abaixo:

```typescript
// ⚠️ Esse código tem um bug grave. Consegue identificar antes de rodar?
useEffect(() => {
  const saved = localStorage.getItem('tasks');
  setTasks(JSON.parse(saved || '[]'));
}, [tasks]); // ← o problema está aqui
```

**Rode esse código e observe o console.** Depois responda: por que ele causa um loop infinito? Trace o ciclo passo a passo:

```
1. Componente renderiza
2. useEffect roda → chama setTasks
3. setTasks → novo estado → componente re-renderiza
4. useEffect roda novamente porque [tasks] mudou
5. → volta para o passo 2, infinitamente
```

**Agora escreva a versão correta.** A diferença é uma única mudança no array de dependências.

**Entregável obrigatório:** escreva 3–5 linhas explicando o ciclo do bug. Não avance sem conseguir explicar sem olhar para o código.

### ✅ O que construir

1. **Salvar tarefas no localStorage** — persista sempre que `tasks` mudar
2. **Carregar tarefas do localStorage** — apenas uma vez, na montagem do componente
3. **Atualizar o título da aba** — mostre quantas tarefas pendentes existem (`(3) TaskFlow`)

### 💡 Dicas

```typescript
// Salvar — dispara toda vez que tasks mudar
useEffect(() => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}, [tasks]);

// Carregar — array vazio significa "só na montagem"
useEffect(() => {
  const saved = localStorage.getItem('tasks');
  if (saved) setTasks(JSON.parse(saved));
}, []); // ← sem dependências = roda uma vez

// Título da aba
useEffect(() => {
  const pending = tasks.filter(t => !t.completed).length;
  document.title = pending > 0 ? `(${pending}) TaskFlow` : 'TaskFlow';
}, [tasks]);
```

> ⚠️ **Atenção com TypeScript:** `JSON.parse` retorna `any`. Use type assertion com cuidado ou valide os dados com uma função de parse.

### ✅ Definition of Done
- [ ] Recarregar a página preserva todas as tarefas
- [ ] O título da aba atualiza corretamente conforme tarefas são concluídas
- [ ] Não há nenhum warning no console
- [ ] O bug proposital foi explicado em 3–5 linhas com o ciclo completo descrito

### 🔎 Perguntas para reflexão
1. O que acontece se você não passar o array de dependências (deixar o segundo argumento em branco)?
2. O que o cleanup do `useEffect` faz? Quando você precisaria usá-lo no contexto de um timer?
3. Algum dos seus `useEffect` poderia ser removido seguindo o artigo [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)?

---

---

## 📦 FASE 3 — Custom Hooks: Arquitetura antes de Técnica

### 🎯 Objetivo
Extrair lógica em hooks customizados para manter componentes limpos — e internalizar a separação entre componentes **container** e **presentational**.

### 📖 Conceito

Um Custom Hook é uma função que começa com `use` e pode chamar outros hooks. Ele não retorna JSX — retorna dados e funções.

Mas o mais importante é o **princípio arquitetural** que ele habilita:

> A partir dessa fase, todo componente deve ser **ou** um container (gerencia lógica) **ou** um presentational (renderiza UI). Nunca os dois misturados.

```
Container:      lógica, estado, efeitos → passa dados via props/context
Presentational: recebe props → renderiza UI → sem lógica de negócio
```

### ✅ O que construir

**1. `useLocalStorage<T>`** — abstrai leitura/escrita com TypeScript genérico:

```typescript
// src/hooks/useLocalStorage.ts
import { useState, Dispatch, SetStateAction } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Inicialização lazy — roda apenas uma vez, não a cada render
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    // Suporta tanto valor direto quanto função (prev => next)
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue];
}
```

> **Por que `Dispatch<SetStateAction<T>>` e não apenas `(value: T) => void`?**
>
> O React suporta dois formatos ao chamar um setter de estado:
> ```typescript
> setTasks([...tasks, newTask]);          // valor direto
> setTasks(prev => [...prev, newTask]);   // função (usa valor atual como base)
> ```
> A segunda forma é essencial quando o novo estado **depende do estado anterior** — especialmente em closures e callbacks que podem estar "desatualizados". Ao usar `Dispatch<SetStateAction<T>>`, seu hook tem a mesma assinatura que o `useState` nativo, e quem o usa pode empregar qualquer dos dois padrões corretamente.

**2. `useTasks`** — encapsula toda a lógica de tarefas:

```typescript
// src/hooks/useTasks.ts
function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);

  const addTask = (title: string) => {
    setTasks(prev => [...prev, {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: Date.now(),
    }]);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  // Derived state — calculado, não armazenado
  const pendingCount = tasks.filter(t => !t.completed).length;

  return { tasks, addTask, deleteTask, toggleTask, pendingCount };
}
```

Após a refatoração, o `App.tsx` deve ficar assim:

```typescript
function App() {
  const { tasks, addTask, deleteTask, toggleTask, pendingCount } = useTasks();
  // Apenas JSX aqui. Sem useState, sem useEffect, sem lógica de negócio.
}
```

### 🧱 Regra Arquitetural — aplica ao resto do projeto

Ao criar qualquer componente novo, decida antes de escrever:

- Esse componente **decide** algo? → É um container. Hooks ficam aqui.
- Esse componente apenas **exibe** algo? → É presentational. Recebe tudo via props.

```
App (container)
├── TaskForm (presentational) — recebe onAdd via prop
├── TaskList (presentational) — recebe tasks, onToggle, onDelete via props
│   └── TaskItem (presentational) — recebe task e handlers via props
└── TaskStats (presentational) — recebe pendingCount via prop
```

### ✅ Definition of Done
- [ ] `App.tsx` não tem nenhum `useState` ou `useEffect` diretamente — toda lógica está nos hooks
- [ ] `useLocalStorage` suporta o padrão `prev => next` no setter
- [ ] Todos os componentes se encaixam claramente em container ou presentational
- [ ] Hooks customizados não retornam JSX

### 🔎 Perguntas para reflexão
1. Qual a diferença entre um Custom Hook e uma função utilitária comum (sem `use`)?
2. Por que a inicialização lazy no `useState` é importante no `useLocalStorage`?
3. Olhando sua estrutura de componentes, quais são containers e quais são presentational?

---

---

## 📦 FASE 3.5 — Async State Pattern (`useFetch`)

### 🎯 Objetivo
Aprender a modelar os três estados inevitáveis de qualquer operação assíncrona — loading, erro e sucesso — e fazer cleanup correto de requests com `AbortController`.

### 📖 Conceito

Toda chamada a uma API tem exatamente três estados possíveis. Ignorar qualquer um deles é um bug esperando para acontecer:

```
loading  → dados ainda chegando  (mostre um spinner ou mensagem)
error    → algo deu errado       (mostre uma mensagem de erro)
data     → chegou com sucesso    (mostre o conteúdo)
```

> O aprendizado real desta fase não é a sintaxe do `fetch` — é **modelar estado assíncrono com segurança**, incluindo o que acontece quando o componente desmonta antes da resposta chegar.

### ✅ O que construir

**Feature:** um botão "✨ Gerar sugestão" que busca uma citação motivacional de uma API pública e exibe embaixo do campo como inspiração para o título da tarefa.

> **Por que botão e não "ao digitar"?**
> Disparar fetch a cada tecla cria barulho, consome rate limit e ensina o reflexo errado. O botão mantém o controle explícito. Na Fase 6 você vai aprender `useDebounce` — e aí vai entender *por que* ele existe quando tentar conectar o fetch à busca em tempo real.

API sugerida (gratuita, sem autenticação):
```
[dummyjson](https://dummyjson.com)

https://dummyjson.com/quotes/random
https://dummyjson.com/quotes/random/1

https://dummyjson.com/todos
https://dummyjson.com/todos/1

https://dummyjson.com/users
https://dummyjson.com/users
```

**Crie `useFetch<T>`:**

```typescript
// src/hooks/useFetch.ts
import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string | null): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!url) return; // url null = não busca nada

    const controller = new AbortController(); // Cancela o request de verdade

    setState({ data: null, loading: true, error: null });

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`);
        return res.json() as Promise<T>;
      })
      .then(data => setState({ data, loading: false, error: null }))
      .catch(err => {
        if (err.name === 'AbortError') return; // Ignorar cancelamento — não é erro
        setState({ data: null, loading: false, error: err.message });
      });

    return () => controller.abort(); // Cancela o request se o componente desmontar
  }, [url]);

  return state;
}
```

> **`AbortController` vs variável `cancelled`:**
> A variável `cancelled` impede que o estado seja atualizado após desmontagem, mas o request HTTP continua rodando até completar — desperdiçando banda e conexão. `AbortController` cancela o request de verdade na rede. É o padrão moderno e correto.

**Use no formulário:**

```typescript
function TaskForm({ onAdd }: { onAdd: (title: string) => void }) {
  const [title, setTitle] = useState('');
  const [fetchUrl, setFetchUrl] = useState<string | null>(null);

  const { data, loading, error } = useFetch<{ content: string }>(fetchUrl);

  const handleSuggest = () => {
    // Força novo fetch mesmo que a url seja a mesma usando timestamp
    setFetchUrl(`dummyjson_api`);
  };

  return (
    <div>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button type="button" onClick={handleSuggest} disabled={loading}>
        {loading ? 'Buscando...' : '✨ Gerar sugestão'}
      </button>
      {error && <p>Não foi possível carregar sugestão.</p>}
      {data && (
        <p onClick={() => setTitle(data.content)} style={{ cursor: 'pointer' }}>
          💡 {data.content} <small>(clique para usar)</small>
        </p>
      )}
      <button onClick={() => { onAdd(title); setTitle(''); }}>
        Adicionar
      </button>
    </div>
  );
}
```

### 🧪 Tipagem com TypeScript Genérico

O `<T>` permite que o mesmo hook funcione para qualquer formato de resposta:

```typescript
useFetch<{ content: string }>('/api/quote')   // data é { content: string } | null
useFetch<User[]>('/api/users')                 // data é User[] | null
useFetch<Post>('/api/post/1')                  // data é Post | null
```

O TypeScript infere o tipo de `data` automaticamente em cada caso — sem precisar de cast.

### ✅ Definition of Done
- [ ] O botão "Gerar sugestão" mostra os três estados: loading, erro e sucesso
- [ ] O `AbortController` está implementado no cleanup do `useEffect`
- [ ] Nenhum aviso de "Can't perform a React state update on an unmounted component" no console
- [ ] O tipo genérico `<T>` está sendo usado corretamente — sem `any`

### 🔎 Perguntas para reflexão
1. Por que usamos um único objeto `{ data, loading, error }` em vez de três `useState` separados?
2. O que aconteceria sem o cleanup do `AbortController` se o usuário clicar em "Gerar sugestão" rapidamente várias vezes?
3. Por que `err.name === 'AbortError'` precisa ser tratado separadamente?

---

---

## 📦 FASE 4 — `useRef`: Referências sem Re-render

### 🎯 Objetivo
Entender quando persistir um valor **sem** causar re-render, e como acessar elementos DOM diretamente.

### 📖 Conceito

`useRef` cria uma referência mutável que **não causa re-render** quando alterada. É como uma caixinha que o React não observa.

```typescript
// 1. Referenciar elemento DOM
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();

// 2. Guardar valor persistente sem causar re-render
const timerIdRef = useRef<number | null>(null);
timerIdRef.current = setTimeout(...);
```

**Quando usar `useRef` vs `useState`:**

| Situação | Usar |
|----------|------|
| Valor que muda e precisa re-renderizar a UI | `useState` |
| Valor que muda mas **não** precisa re-renderizar | `useRef` |
| Referência a elemento DOM | `useRef` |
| Guardar ID de timer ou subscription | `useRef` |

### ✅ O que construir

**1. Foco automático** — ao carregar, o cursor já está no input. Após adicionar uma tarefa, o foco retorna automaticamente.

```typescript
const inputRef = useRef<HTMLInputElement>(null);

// Foco ao montar
useEffect(() => {
  inputRef.current?.focus();
}, []);

// No handler de adicionar:
const handleAdd = () => {
  onAdd(title);
  setTitle('');
  inputRef.current?.focus(); // Foco volta após adicionar
};
```

**2. Contador de commits** — um indicador mostrando quantas vezes o efeito do componente rodou.

```typescript
const commitCount = useRef(0);

useEffect(() => {
  commitCount.current += 1;
  // useRef não causa re-render — sem loop
});
```

> **Importante — "contador de renders" vs "contador de commits":**
> O local mais honesto para contar renders puros seria o corpo do componente (porque render *é* o corpo executando). Porém, incrementar `useRef` no corpo durante render pode confundir junto com o StrictMode double-render.
>
> O `useEffect` sem dependências roda após cada commit (após o React confirmar as mudanças no DOM) — ligeiramente diferente de "render". Para fins didáticos, chame de "contador de commits" e entenda essa distinção. O `console.log` no corpo do componente ainda é a forma mais direta de contar renders puros.

**3. Experimento obrigatório:** Substitua o `useRef` por `useState` no contador e observe o que acontece. Trace o ciclo completo que explica o loop.

### ✅ Definition of Done
- [ ] O foco vai automaticamente para o input ao carregar a página
- [ ] O foco retorna ao input após adicionar uma tarefa
- [ ] O contador de commits usa `useRef` — substituir por `useState` causa loop (e você consegue explicar por quê)
- [ ] Você consegue diferenciar "render" de "commit" no contexto do React

### 🔎 Perguntas para reflexão
1. Por que o contador com `useState` causa loop mas com `useRef` não?
2. Qual a diferença entre "render" e "commit" no ciclo de vida do React?
3. O que é "escape hatch" no contexto do React e por que `useRef` se encaixa nisso?

---

---

## 📦 FASE 5 — `useContext`: Estado Global

### 🎯 Objetivo
Compartilhar estado entre componentes distantes sem "prop drilling" — e entender os trade-offs da abordagem.

### 📖 Conceito

**Prop drilling** é o problema de passar props por vários componentes intermediários que não precisam delas, só para que um componente lá no fundo possa consumi-las.

```
App → TaskList → TaskItem → TaskActions → ThemeButton
       (não usa)   (não usa)   (não usa)    ← precisa do tema
```

`useContext` resolve isso disponibilizando um valor para qualquer componente da árvore, sem intermediários.

### ✅ O que construir

**Sistema de Tema (dark/light mode):**

```typescript
// src/contexts/ThemeContext.tsx
import { createContext, useContext, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'light');

  // toggleTheme é estável — setTheme vem do useLocalStorage que usa Dispatch<SetStateAction<T>>
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook helper — centraliza o erro e evita checar null em todo lugar
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme deve ser usado dentro de ThemeProvider');
  return ctx;
}
```

Crie um `ThemeToggle` presentational que usa `useTheme()` — sem passar nenhuma prop por componentes intermediários.

### ⚠️ Cuidado com re-renders de Context

Todo componente que consome um Context re-renderiza quando o valor do Provider muda. Se você colocar um objeto criado inline no `value`, ele vai recriar o objeto a cada render do Provider — causando re-renders desnecessários em todos os consumidores.

```typescript
// ❌ Errado — cria novo objeto a cada render do Provider
<ThemeContext.Provider value={{ theme, toggleTheme }}>

// ✅ Correto para contexts que mudam pouco — aceitável aqui
// Para contexts de alta frequência, use useMemo no value
const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
<ThemeContext.Provider value={value}>
```

Para o tema, a frequência de mudança é baixa — o inline é aceitável. Mas entenda o princípio.

### 🧪 Desafio extra
Mova o `useTasks` para um `TasksContext`. O `App` vira um provider puro, sem lógica de tarefas direta.

### ⚠️ Quando NÃO usar Context
Context não é substituto para gerenciamento de estado complexo. Use-o para dados verdadeiramente globais: tema, usuário autenticado, idioma. Para estado que muda com alta frequência, Context re-renderiza todos os consumidores a cada mudança — considere Zustand ou Jotai nesses casos.

### ✅ Definition of Done
- [ ] O tema persiste ao recarregar a página
- [ ] Nenhum componente intermediário recebe prop de tema que não usa
- [ ] `useTheme()` lança erro claro se usado fora do Provider
- [ ] O `value` do Provider não recria objeto desnecessariamente (ou você entende quando isso seria problema)

### 🔎 Perguntas para reflexão
1. O que é prop drilling e por que é um problema em aplicações grandes?
2. Se você alterar o tema, quais componentes vão re-renderizar? Como minimizar isso?
3. Quando você usaria Context vs Zustand vs Redux?

---

---

## 📦 FASE 6 — `useMemo` + `useCallback` + `useDebounce` + `React.memo`

### 🎯 Objetivo
Aprender a otimizar re-renders de forma consciente — medindo antes, otimizando depois, e entendendo o custo de cada ferramenta.

### 📖 Conceito

> ⚠️ **Regra de ouro:** Não otimize prematuramente. Cada uma dessas ferramentas adiciona complexidade. Use-as quando você **medir** um problema real, não por padrão.

**`useMemo`** — memoriza o resultado de um cálculo:
```typescript
const filteredTasks = useMemo(() => expensiveFilter(tasks, search), [tasks, search]);
// Só recalcula quando 'tasks' ou 'search' mudarem
```

**`useCallback`** — memoriza uma função (estabiliza sua referência entre renders):
```typescript
const handleToggle = useCallback((id: string) => toggleTask(id), [toggleTask]);
// A referência só muda quando 'toggleTask' mudar
```

**`React.memo`** — evita re-render de componente se as props não mudaram:
```typescript
const TaskItem = React.memo(function TaskItem({ task, onToggle, onDelete }) {
  console.log('🔄 TaskItem render', task.title);
  // Só re-renderiza se task, onToggle ou onDelete mudarem
});
```

**`useDebounce`** — atrasa a atualização de um valor até o usuário parar de digitar:
```typescript
const debouncedSearch = useDebounce(search, 300);
// Só atualiza 300ms após a última tecla
```

> `useCallback(fn, deps)` é equivalente a `useMemo(() => fn, deps)`. Um memoriza função, o outro memoriza qualquer valor. Mesma mecânica, nomes diferentes por clareza de intenção.

### ✅ O que construir

**1. `useDebounce<T>` — crie o hook:**

```typescript
// src/hooks/useDebounce.ts
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // Cancela timer anterior a cada nova tecla
  }, [value, delay]);

  return debouncedValue;
}
```

**Por que o cleanup é essencial aqui:** sem ele, digitar "react" em 400ms agendaria 5 timers rodando em paralelo — todos atualizando o estado. Com o cleanup, cada nova tecla cancela o timer anterior. Apenas o último executa.

**2. Filtros e busca com `useMemo` + `useDebounce`:**

```typescript
const [search, setSearch] = useState('');
const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
const debouncedSearch = useDebounce(search, 300);

const filteredTasks = useMemo(() => {
  return tasks
    .filter(t => filter === 'all' || t.completed === (filter === 'completed'))
    .filter(t => t.title.toLowerCase().includes(debouncedSearch.toLowerCase()));
}, [tasks, filter, debouncedSearch]); // debouncedSearch, não search
```

**3. Stats memoizadas:**

```typescript
const stats = useMemo(() => ({
  total: tasks.length,
  completed: tasks.filter(t => t.completed).length,
  pending: tasks.filter(t => !t.completed).length,
}), [tasks]);
```

**4. `React.memo` + `useCallback` nos handlers:**

```typescript
// TaskItem.tsx
const TaskItem = React.memo(function TaskItem({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  console.log('🔄 TaskItem render', task.title);
  return ( /* ... */ );
});

// No componente pai — useCallback estabiliza a referência
const handleToggle = useCallback((id: string) => toggleTask(id), [toggleTask]);
const handleDelete = useCallback((id: string) => deleteTask(id), [deleteTask]);
```

### 🔥 Exercício de Performance — faça na ordem, meça cada etapa

1. Adicione `console.log('🔄 TaskItem render', task.title)` no `TaskItem`
2. Digite no campo de busca e observe quantas vezes cada TaskItem renderiza
3. Aplique `React.memo` no `TaskItem` — observe o que muda
4. Adicione `useCallback` nos handlers — observe se `React.memo` agora funciona de verdade
5. Adicione `useDebounce` na busca — compare os logs antes e depois
6. **Responda:** em qual etapa a melhoria foi mais significativa? Por quê?

> Se em alguma etapa você não viu melhoria, questione: essa otimização era realmente necessária?

### ✅ Definition of Done
- [ ] `useDebounce` está implementado e aplicado na busca
- [ ] `filteredTasks` usa `debouncedSearch`, não `search` diretamente
- [ ] `TaskItem` está envolto em `React.memo`
- [ ] Os handlers passados ao `TaskItem` usam `useCallback`
- [ ] Você consegue explicar por que `React.memo` sozinho não seria suficiente sem `useCallback`

### 🔎 Perguntas para reflexão
1. Por que `React.memo` sozinho não resolve o problema sem `useCallback` nos handlers?
2. O `useDebounce` que você criou usa `useEffect` internamente. Trace o que acontece ao digitar "r", "e", "a" em intervalos de 100ms com `delay: 300`.
3. Quando `useMemo` pode ser prejudicial em vez de benéfico?

---

---

## 🏁 Entregável Final

### Stage 1 — Task App
- ✅ CRUD completo de tarefas com `createdAt: number`
- ✅ Derived state aplicado consistentemente (zero estado redundante)
- ✅ Persistência no localStorage via `useLocalStorage` com suporte a `prev => next`
- ✅ Busca de sugestões via `useFetch` com `AbortController` e tratamento de loading/error
- ✅ Código organizado em Custom Hooks
- ✅ Arquitetura container/presentational em todos os componentes
- ✅ Todos os itens do Checklist de PR passando

### Stage 2 — Productivity App
- ✅ Dark/Light mode global via Context com `value` estável
- ✅ Busca com debounce via `useDebounce`
- ✅ Filtros por status e busca por texto com `useMemo`
- ✅ `TaskItem` otimizado com `React.memo` + `useCallback`
- ✅ TypeScript com tipagem estrita em todo o projeto — sem `any`

---

## 📚 Leitura Obrigatória por Fase

| Fase | Recurso |
|------|---------|
| 0.5 | [React StrictMode](https://react.dev/reference/react/StrictMode) |
| 1 | [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure) |
| 2 | [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) |
| 3 | [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks) |
| 3.5 | [Using the Fetch API — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch) |
| 4 | [Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs) |
| 5 | [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context) |
| 6 | [useMemo and useCallback — Kent C. Dodds](https://kentcdodds.com/blog/usememo-and-usecallback) |

---

## 🧭 Dicas para o Desenvolvedor

1. **Commit ao final de cada fase** — use branches por fase (`fase-1-usestate`, `fase-2-useeffect`, etc.)
2. **Não pule fases** — cada uma constrói sobre a anterior
3. **Leia os erros do TypeScript** — eles são informativos, não punitivos
4. **Passe pelo Checklist de PR antes de dizer que terminou** — "funcionar" e "estar correto" são coisas diferentes
5. **Se travar por mais de 30 minutos, peça ajuda** — não é fraqueza, é eficiência

---

> 💬 *"O melhor jeito de aprender React é construindo algo real, sentindo os problemas antes de ver as soluções."*
