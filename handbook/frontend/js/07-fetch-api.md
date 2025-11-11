# Блок 7: Fetch API и async/await

## Введение

**Fetch API** — современный способ выполнения HTTP-запросов в JavaScript. Он основан на промисах и предоставляет более гибкий и мощный интерфейс по сравнению с устаревшим `XMLHttpRequest`.

**async/await** — синтаксический сахар над промисами, позволяющий писать асинхронный код в стиле синхронного.

---

## Fetch API

### Базовый синтаксис

```javascript
fetch(url, options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Ошибка:', error));
```

**Параметры:**
- `url` — адрес ресурса
- `options` (необязательно) — объект с настройками запроса

### Простой GET запрос

```javascript
fetch('https://jsonplaceholder.typicode.com/users')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(users => {
    console.log('Пользователи:', users);
  })
  .catch(error => {
    console.error('Ошибка:', error);
  });
```

**Важно:** `fetch` отклоняет промис только при сетевой ошибке. Статус 404 или 500 — это **не ошибка** для `fetch`, нужно проверять `response.ok`.

### Объект Response

```javascript
fetch('/api/data')
  .then(response => {
    console.log('Статус:', response.status); // 200, 404, 500...
    console.log('OK:', response.ok); // true если 200-299
    console.log('Заголовки:', response.headers.get('Content-Type'));
    
    return response.json(); // или .text(), .blob(), .arrayBuffer()
  });
```

**Методы Response:**
- `response.json()` — парсит JSON
- `response.text()` — возвращает текст
- `response.blob()` — возвращает Blob (для изображений, файлов)
- `response.arrayBuffer()` — возвращает ArrayBuffer
- `response.formData()` — парсит FormData

### POST запрос

```javascript
const newUser = {
  name: 'Алексей',
  email: 'alex@example.com',
  age: 25
};

fetch('https://jsonplaceholder.typicode.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newUser)
})
  .then(response => response.json())
  .then(data => {
    console.log('Создан пользователь:', data);
  })
  .catch(error => {
    console.error('Ошибка:', error);
  });
```

### Другие HTTP методы

```javascript
// PUT (полное обновление)
fetch('/api/users/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Новое имя', email: 'new@email.com' })
});

// PATCH (частичное обновление)
fetch('/api/users/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Новое имя' })
});

// DELETE
fetch('/api/users/1', {
  method: 'DELETE'
})
  .then(response => {
    if (response.ok) {
      console.log('Пользователь удалён');
    }
  });
```

### Отправка FormData

```javascript
const formData = new FormData();
formData.append('name', 'Алексей');
formData.append('avatar', fileInput.files[0]);

fetch('/api/upload', {
  method: 'POST',
  body: formData // Content-Type автоматически установится
})
  .then(response => response.json())
  .then(data => console.log('Загружено:', data));
```

### Заголовки запроса

```javascript
fetch('/api/data', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer TOKEN',
    'Accept': 'application/json',
    'X-Custom-Header': 'value'
  }
})
  .then(response => response.json());
```

### Режим CORS

```javascript
fetch('https://api.example.com/data', {
  mode: 'cors', // 'no-cors', 'same-origin'
  credentials: 'include' // Отправка cookies
})
  .then(response => response.json());
```

**Режимы:**
- `cors` (по умолчанию) — разрешены CORS запросы
- `no-cors` — только простые запросы, ограниченный доступ к ответу
- `same-origin` — только запросы на тот же домен

### Отмена запроса (AbortController)

```javascript
const controller = new AbortController();
const signal = controller.signal;

fetch('/api/data', { signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Запрос отменён');
    }
  });

// Отмена через 5 секунд
setTimeout(() => controller.abort(), 5000);
```

---

## async/await

### Базовый синтаксис

```javascript
async function fetchData() {
  const response = await fetch('/api/data');
  const data = await response.json();
  return data;
}

// Вызов
fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

**Правила:**
- `async` функция **всегда** возвращает промис
- `await` можно использовать **только** внутри `async` функции
- `await` приостанавливает выполнение до завершения промиса

### Преобразование Promise в async/await

**Было (Promise):**

```javascript
function getUser(id) {
  return fetch(`/api/users/${id}`)
    .then(response => response.json())
    .then(user => {
      console.log('Пользователь:', user);
      return fetch(`/api/users/${id}/posts`);
    })
    .then(response => response.json())
    .then(posts => {
      console.log('Посты:', posts);
      return posts;
    });
}
```

**Стало (async/await):**

```javascript
async function getUser(id) {
  const userResponse = await fetch(`/api/users/${id}`);
  const user = await userResponse.json();
  console.log('Пользователь:', user);
  
  const postsResponse = await fetch(`/api/users/${id}/posts`);
  const posts = await postsResponse.json();
  console.log('Посты:', posts);
  
  return posts;
}
```

### Обработка ошибок с try/catch

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Данные:', data);
    return data;
  } catch (error) {
    console.error('Ошибка:', error.message);
    throw error; // Пробрасываем дальше
  }
}

// Использование
fetchData()
  .then(data => {
    // Успех
  })
  .catch(error => {
    // Ошибка
  });
```

### Параллельные запросы с Promise.all

**Плохо (последовательно):**

```javascript
async function loadData() {
  const users = await fetch('/api/users').then(r => r.json());
  const posts = await fetch('/api/posts').then(r => r.json());
  const comments = await fetch('/api/comments').then(r => r.json());
  
  return { users, posts, comments };
}
// Время: 1с + 1с + 1с = 3с
```

**Хорошо (параллельно):**

```javascript
async function loadData() {
  const [users, posts, comments] = await Promise.all([
    fetch('/api/users').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/comments').then(r => r.json())
  ]);
  
  return { users, posts, comments };
}
// Время: max(1с, 1с, 1с) = 1с
```

### Использование в циклах

```javascript
// ❌ Плохо: последовательно
async function processUsers(userIds) {
  const users = [];
  
  for (const id of userIds) {
    const response = await fetch(`/api/users/${id}`);
    const user = await response.json();
    users.push(user);
  }
  
  return users;
}

// ✅ Хорошо: параллельно
async function processUsers(userIds) {
  const promises = userIds.map(id =>
    fetch(`/api/users/${id}`).then(r => r.json())
  );
  
  return await Promise.all(promises);
}
```

### Top-level await (в модулях)

```javascript
// module.js
const response = await fetch('/api/config');
const config = await response.json();

export default config;
```

**Доступно только в ES модулях** (`<script type="module">`).

---

## Обработка ошибок

### Типы ошибок

```javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    
    // Проверка HTTP статуса
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Ресурс не найден');
      } else if (response.status === 500) {
        throw new Error('Ошибка сервера');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'TypeError') {
      // Сетевая ошибка (нет интернета, CORS, DNS)
      console.error('Сетевая ошибка:', error.message);
    } else if (error.name === 'SyntaxError') {
      // Ошибка парсинга JSON
      console.error('Неверный JSON:', error.message);
    } else {
      console.error('Другая ошибка:', error.message);
    }
    
    throw error;
  }
}
```

### Retry механизм

```javascript
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.log(`Попытка ${i + 1} не удалась, повтор через 1с...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Использование
fetchWithRetry('/api/unstable-endpoint')
  .then(data => console.log('Данные:', data))
  .catch(error => console.error('Не удалось загрузить:', error));
```

### Таймаут для запроса

```javascript
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Превышен таймаут запроса');
    }
    
    throw error;
  }
}

// Использование
fetchWithTimeout('/api/slow-endpoint', 3000)
  .then(data => console.log(data))
  .catch(error => console.error('Ошибка:', error.message));
```

---

## Практические паттерны

### API клиент

```javascript
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json'
    };
  }
  
  setAuthToken(token) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers
      }
    };
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
  
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }
  
  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Использование
const api = new ApiClient('https://api.example.com');
api.setAuthToken('your-token');

const users = await api.get('/users');
const newUser = await api.post('/users', { name: 'Алексей' });
```

### Кэширование запросов

```javascript
const cache = new Map();

async function fetchWithCache(url, cacheTime = 60000) {
  const cached = cache.get(url);
  
  if (cached && Date.now() - cached.timestamp < cacheTime) {
    console.log('Возвращаем из кэша');
    return cached.data;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  
  cache.set(url, {
    data,
    timestamp: Date.now()
  });
  
  return data;
}

// Использование
const data1 = await fetchWithCache('/api/users'); // Загрузка
const data2 = await fetchWithCache('/api/users'); // Из кэша
```

### Debounce для поиска

```javascript
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const searchInput = document.getElementById('search');

const performSearch = debounce(async (query) => {
  if (query.length < 3) return;
  
  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const results = await response.json();
    displayResults(results);
  } catch (error) {
    console.error('Ошибка поиска:', error);
  }
}, 300);

searchInput.addEventListener('input', (e) => {
  performSearch(e.target.value);
});
```

---

## Работа с JSON

```javascript
// Отправка
const data = { name: 'Алексей', age: 25 };
const jsonString = JSON.stringify(data);

fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: jsonString
});

// Получение
const response = await fetch('/api/users');
const users = await response.json(); // Парсинг JSON
```

### Обработка не-JSON ответов

```javascript
async function fetchData(url) {
  const response = await fetch(url);
  const contentType = response.headers.get('Content-Type');
  
  if (contentType.includes('application/json')) {
    return await response.json();
  } else if (contentType.includes('text')) {
    return await response.text();
  } else if (contentType.includes('image')) {
    return await response.blob();
  } else {
    throw new Error('Неизвестный тип контента');
  }
}
```

---

## Рекомендации

### ✅ Хорошие практики

```javascript
// 1. Всегда проверяйте response.ok
async function fetchData() {
  const response = await fetch('/api/data');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
}

// 2. Используйте try/catch
async function safeeFetch() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    console.error('Ошибка:', error);
    return null;
  }
}

// 3. Параллельные запросы с Promise.all
const [users, posts] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/posts').then(r => r.json())
]);

// 4. Используйте AbortController для отмены
const controller = new AbortController();
fetch('/api/data', { signal: controller.signal });
// controller.abort() для отмены
```

### ❌ Плохие практики

```javascript
// 1. Не игнорируйте ошибки
fetch('/api/data'); // ❌ Нет обработки

// 2. Не делайте последовательные запросы, если можно параллельно
const users = await fetch('/api/users').then(r => r.json());
const posts = await fetch('/api/posts').then(r => r.json()); // ❌

// 3. Не забывайте проверять response.ok
const response = await fetch('/api/data');
const data = await response.json(); // ❌ Может быть ошибка 404/500
```

---

## Резюме

**Изучено:**

✅ Fetch API: GET, POST, PUT, DELETE запросы  
✅ Работа с Response: json(), text(), blob()  
✅ async/await синтаксис  
✅ Обработка ошибок с try/catch  
✅ Параллельные запросы с Promise.all  
✅ AbortController для отмены  
✅ Практические паттерны: retry, timeout, cache, debounce  
✅ API клиент класс

**В следующем уроке:** localStorage и sessionStorage

---

**Переходите к практике!** 🚀
