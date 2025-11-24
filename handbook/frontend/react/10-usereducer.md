# Блок 10 — useReducer Hook

## Что такое Reducer?

Reducer — это функция, которая принимает текущее состояние и действие (action), и возвращает новое состояние:

```typescript
(state, action) => newState
```

Концепция заимствована из Redux и функционального программирования.

---

## Когда использовать useReducer?

### useState vs useReducer

| Случай | useState | useReducer |
|--------|----------|-----------|
| Простой state (счётчик, флаг) | ✅ | ❌ |
| Сложный state (объект с несколькими полями) | ❌ | ✅ |
| Много связанных обновлений | ❌ | ✅ |
| Логика обновления зависит от предыдущего state | ⚠️ | ✅ |
| Нужно передавать dispatch вниз | ❌ | ✅ |

```jsx
// ❌ Плохо: useState для сложного state
function TodoList() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  
  // Много setState вызовов
  const addTodo = (text) => {
    setLoading(true);
    setTodos([...todos, { id: Date.now(), text, done: false }]);
    setLoading(false);
  };
}

// ✅ Хорошо: useReducer для сложного state
function TodoList() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  
  const addTodo = (text) => {
    dispatch({ type: 'ADD_TODO', payload: text });
  };
}
```

---

## Базовый синтаксис useReducer

```jsx
import { useReducer } from 'react';

// 1. Reducer function
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    default:
      return state;
  }
}

// 2. Initial state
const initialState = { count: 0 };

// 3. Component
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, initialState);
  
  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
    </div>
  );
}
```

---

## Пример: Todo List с useReducer

```jsx
import { useReducer } from 'react';

// Типы действий
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const DELETE_TODO = 'DELETE_TODO';

// Reducer
function todoReducer(state, action) {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: Date.now(), text: action.payload, done: false }
        ]
      };
    
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, done: !todo.done }
            : todo
        )
      };
    
    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    
    default:
      return state;
  }
}

// Initial state
const initialState = {
  todos: []
};

// Component
function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [input, setInput] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      dispatch({ type: ADD_TODO, payload: input });
      setInput('');
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="New todo..."
        />
        <button type="submit">Add</button>
      </form>
      
      <ul>
        {state.todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => dispatch({ type: TOGGLE_TODO, payload: todo.id })}
            />
            <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => dispatch({ type: DELETE_TODO, payload: todo.id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## useReducer + useContext

Комбинация для глобального state management без Redux:

```jsx
import { createContext, useContext, useReducer } from 'react';

// Context
const TodoContext = createContext(null);

// Reducer
function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, { id: Date.now(), text: action.payload, done: false }];
    case 'TOGGLE_TODO':
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, done: !todo.done } : todo
      );
    default:
      return state;
  }
}

// Provider
export function TodoProvider({ children }) {
  const [todos, dispatch] = useReducer(todoReducer, []);
  
  return (
    <TodoContext.Provider value={{ todos, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
}

// Custom hook для удобства
export function useTodos() {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within TodoProvider');
  }
  return context;
}

// Использование в компонентах
function TodoList() {
  const { todos, dispatch } = useTodos();
  
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
}

function AddTodo() {
  const { dispatch } = useTodos();
  const [text, setText] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch({ type: 'ADD_TODO', payload: text });
      setText('');
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button>Add</button>
    </form>
  );
}

// App
function App() {
  return (
    <TodoProvider>
      <AddTodo />
      <TodoList />
    </TodoProvider>
  );
}
```

---

## Lazy Initialization

Для дорогих вычислений начального state:

```jsx
function init(initialCount) {
  // Дорогие вычисления
  return { count: initialCount };
}

function Counter({ initialCount }) {
  // Третий аргумент - функция инициализации
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  
  return <div>Count: {state.count}</div>;
}
```

---

## Best Practices

### ✅ Хорошо

```jsx
// Константы для action types
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

// Типизированные action creators (с TypeScript)
const addTodo = (text: string) => ({ type: ADD_TODO, payload: text });

// Иммутабельные обновления
case ADD_TODO:
  return [...state, newItem]; // ✅
```

### ❌ Плохо

```jsx
// Строки вместо констант
dispatch({ type: 'add_todo' }); // ❌ опечатки

// Мутации state
case ADD_TODO:
  state.push(newItem); // ❌ мутация!
  return state;

// Слишком простой state для useReducer
const [count, dispatch] = useReducer(reducer, 0); // ❌ useState проще
```

---

## Практика

Задания в `10-usereducer-practice.md`.
