# Блок 14 — Redux Toolkit

## Что такое Redux?

Redux — библиотека для управления глобальным состоянием приложения.

**Redux Toolkit (RTK)** — официальный, упрощённый способ использования Redux.

### Когда использовать Redux?

| Случай | Нужен ли Redux? |
|--------|----------------|
| Много компонентов делятся state | ✅ |
| State обновляется из разных мест | ✅ |
| Сложная логика обновления state | ✅ |
| Нужна history/undo | ✅ |
| Простое приложение (2-3 компонента) | ❌ (useContext достаточно) |

---

## Установка

```bash
npm install @reduxjs/toolkit react-redux
```

---

## Ключевые концепции

### Redux vs Redux Toolkit

| Понятие | Redux | Redux Toolkit |
|---------|-------|---------------|
| Store | `createStore` | `configureStore` |
| Reducer | Вручную | `createSlice` |
| Actions | Вручную | Автогенерация |
| Async | redux-thunk вручную | `createAsyncThunk` |
| Immutability | Осторожно! | Immer (встроен) |

---

## Базовая настройка

### 1. Создание Slice

```jsx
// features/counter/counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: (state) => {
      state.value += 1; // Immer позволяет "мутации"
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    reset: (state) => {
      state.value = 0;
    }
  }
});

export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;
export default counterSlice.reducer;
```

### 2. Создание Store

```jsx
// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
});
```

### 3. Подключение к React

```jsx
// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

### 4. Использование в компонентах

```jsx
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, reset } from './features/counter/counterSlice';

function Counter() {
  // Чтение state
  const count = useSelector((state) => state.counter.value);
  
  // Dispatch actions
  const dispatch = useDispatch();
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(reset())}>Reset</button>
    </div>
  );
}
```

---

## Асинхронные действия (Thunks)

### createAsyncThunk

```jsx
// features/users/usersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    return response.json();
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default usersSlice.reducer;
```

### Использование Thunk

```jsx
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers } from './features/users/usersSlice';

function UserList() {
  const dispatch = useDispatch();
  const { list: users, loading, error } = useSelector(state => state.users);
  
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

---

## Пример: Todo App с Redux Toolkit

```jsx
// features/todos/todosSlice.js
import { createSlice, nanoid } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    addTodo: {
      reducer: (state, action) => {
        state.push(action.payload);
      },
      prepare: (text) => ({
        payload: {
          id: nanoid(),
          text,
          completed: false
        }
      })
    },
    toggleTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action) => {
      return state.filter(t => t.id !== action.payload);
    }
  }
});

export const { addTodo, toggleTodo, deleteTodo } = todosSlice.actions;
export default todosSlice.reducer;
```

```jsx
// TodoApp.jsx
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, toggleTodo, deleteTodo } from './features/todos/todosSlice';

function TodoApp() {
  const [text, setText] = useState('');
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(addTodo(text));
      setText('');
    }
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input value={text} onChange={e => setText(e.target.value)} />
        <button>Add</button>
      </form>
      
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch(toggleTodo(todo.id))}
            />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
            <button onClick={() => dispatch(deleteTodo(todo.id))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Селекторы (Selectors)

### Простые селекторы

```jsx
// Встроенный селектор
const count = useSelector(state => state.counter.value);

// Вынесенный селектор
export const selectCount = state => state.counter.value;
export const selectIsPositive = state => state.counter.value > 0;

// Использование
const count = useSelector(selectCount);
const isPositive = useSelector(selectIsPositive);
```

### Мемоизированные селекторы (Reselect)

```jsx
import { createSelector } from '@reduxjs/toolkit';

// Входные селекторы
const selectTodos = state => state.todos;
const selectFilter = state => state.filter;

// Мемоизированный селектор
export const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }
);

// Пересчитывается только при изменении todos или filter
```

---

## RTK Query (API fetching)

Встроенный инструмент для API запросов:

```jsx
// services/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users'
    }),
    getUserById: builder.query({
      query: (id) => `/users/${id}`
    }),
    createPost: builder.mutation({
      query: (newPost) => ({
        url: '/posts',
        method: 'POST',
        body: newPost
      })
    })
  })
});

export const { useGetUsersQuery, useGetUserByIdQuery, useCreatePostMutation } = api;
```

```jsx
// Использование
function Users() {
  const { data: users, isLoading, error } = useGetUsersQuery();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;
  
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

---

## Best Practices

### ✅ Хорошо

```jsx
// 1. Slice per feature
features/
  users/
    usersSlice.js
  posts/
    postsSlice.js

// 2. Используйте Immer mutations
reducer: (state, action) => {
  state.value += 1; // ✅ Читается как обычный код
}

// 3. Selector functions
export const selectUser = state => state.users.current;
```

### ❌ Плохо

```jsx
// ❌ Ручные immutable updates (не нужно с RTK)
return {
  ...state,
  value: state.value + 1 // ❌ Не нужно
};

// ❌ Inline селекторы с вычислениями
const filtered = useSelector(state => 
  state.todos.filter(t => !t.completed) // ❌ Каждый рендер
);

// ❌ Огромный монолитный store
const initialState = { /* 100 полей */ }; // ❌ Разбить на slices
```

---

## Практика

Задания в `14-redux-toolkit-practice.md`.
