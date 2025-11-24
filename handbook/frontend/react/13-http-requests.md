# Блок 13 — HTTP запросы и работа с API

## Fetch API (встроенный)

### Базовый GET запрос

```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);
  
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

## POST, PUT, DELETE запросы

### POST - создание

```jsx
function CreatePost() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, body: 'Content', userId: 1 })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      
      const data = await response.json();
      console.log('Created:', data);
      setTitle('');
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={e => setTitle(e.target.value)} />
      <button disabled={loading}>
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
```

### PUT/PATCH - обновление

```jsx
async function updateUser(userId, updates) {
  const response = await fetch(`https://api.example.com/users/${userId}`, {
    method: 'PATCH', // или 'PUT' для полной замены
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });
  
  return response.json();
}
```

### DELETE - удаление

```jsx
function UserItem({ user, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (!confirm('Delete user?')) return;
    
    setDeleting(true);
    try {
      const response = await fetch(`https://api.example.com/users/${user.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        onDelete(user.id);
      }
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeleting(false);
    }
  };
  
  return (
    <div>
      {user.name}
      <button onClick={handleDelete} disabled={deleting}>
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
}
```

---

## AbortController - отмена запросов

Предотвращение утечек памяти при размонтировании:

```jsx
function SearchUsers() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (!query) return;
    
    const controller = new AbortController();
    
    fetch(`https://api.github.com/search/users?q=${query}`, {
      signal: controller.signal
    })
      .then(res => res.json())
      .then(data => setResults(data.items))
      .catch(error => {
        if (error.name !== 'AbortError') {
          console.error('Fetch error:', error);
        }
      });
    
    return () => {
      controller.abort(); // Отменить запрос при размонтировании
    };
  }, [query]);
  
  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <ul>
        {results.map(user => (
          <li key={user.id}>{user.login}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Axios (популярная библиотека)

### Установка

```bash
npm install axios
```

### Преимущества над fetch

| Функция | Fetch | Axios |
|---------|-------|-------|
| Автоматический JSON parse | ❌ | ✅ |
| Request/Response interceptors | ❌ | ✅ |
| Timeout | ❌ (нужен AbortController) | ✅ |
| HTTP error handling | Нужно проверять `response.ok` | ✅ Автоматически |
| Отмена запроса | AbortController | CancelToken / signal |

### Базовое использование

```jsx
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setUsers(response.data); // данные сразу распарсены
      })
      .catch(error => {
        console.error('Error:', error.message);
      });
  }, []);
  
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

### Axios Instance - конфигурация

```jsx
// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Редирект на логин
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Использование
import api from './api';

function fetchUsers() {
  return api.get('/users'); // baseURL автоматически добавляется
}

function createPost(data) {
  return api.post('/posts', data);
}
```

---

## Паттерны обработки состояния

### Unified State Pattern

```jsx
function useApi(apiFunc) {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null
  });
  
  const execute = async (...args) => {
    setState({ data: null, loading: true, error: null });
    
    try {
      const result = await apiFunc(...args);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      setState({ data: null, loading: false, error: error.message });
      throw error;
    }
  };
  
  return { ...state, execute };
}

// Использование
function UserProfile({ userId }) {
  const { data: user, loading, error, execute } = useApi(fetchUserById);
  
  useEffect(() => {
    execute(userId);
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return null;
  
  return <div>{user.name}</div>;
}
```

### SWR / React Query (рекомендуется для production)

Библиотеки для data fetching с кешированием:

```bash
npm install @tanstack/react-query
# или
npm install swr
```

**React Query пример:**

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function Users() {
  // useQuery автоматически управляет loading, error, refetch
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json())
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// Mutation (POST/PUT/DELETE)
function CreateUser() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: (newUser) => axios.post('/api/users', newUser),
    onSuccess: () => {
      // Инвалидировать кеш users для перезагрузки
      queryClient.invalidateQueries(['users']);
    }
  });
  
  return (
    <button onClick={() => mutation.mutate({ name: 'New User' })}>
      Add User
    </button>
  );
}
```

---

## Best Practices

### ✅ Хорошо

```jsx
// 1. Отмена запросов при размонтировании
useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal });
  return () => controller.abort(); // ✅
}, [url]);

// 2. Централизованная обработка ошибок
api.interceptors.response.use(
  response => response,
  error => {
    handleGlobalError(error); // ✅
    return Promise.reject(error);
  }
);

// 3. Loading и error states
if (loading) return <Spinner />;
if (error) return <ErrorMessage error={error} />;
```

### ❌ Плохо

```jsx
// ❌ Забыли отменить запрос
useEffect(() => {
  fetch(url).then(data => setState(data));
  // Нет cleanup! Утечка памяти
}, [url]);

// ❌ Не проверяем response.ok с fetch
fetch(url)
  .then(res => res.json()) // ❌ может быть 404
  .then(data => setData(data));

// ❌ Дублирование логики везде
function Component1() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  // ... одинаковая логика
}
```

---

## Практика

Задания в `13-http-requests-practice.md`.
