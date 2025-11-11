# Практика: Fetch API и async/await

## Введение

В этом уроке вы создадите **приложение для управления задачами (Todo)** с использованием реального REST API.

**API:** [JSONPlaceholder](https://jsonplaceholder.typicode.com/) — бесплатное тестовое API

**Функции приложения:**
- Загрузка задач (GET)
- Создание задачи (POST)
- Обновление статуса (PATCH)
- Удаление задачи (DELETE)
- Фильтрация и поиск
- Обработка ошибок

**Время выполнения:** 50-60 минут  
**Сложность:** Продвинутый

---

## HTML

Создайте файл `todo-app.html`:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo App с API</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    h1 {
      color: #667eea;
      margin-bottom: 30px;
      text-align: center;
    }

    .api-info {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 20px;
      font-size: 0.9rem;
      color: #666;
    }

    .api-info a {
      color: #667eea;
      text-decoration: none;
    }

    .add-form {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .add-form input {
      flex: 1;
      padding: 15px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 1rem;
    }

    .add-form input:focus {
      outline: none;
      border-color: #667eea;
    }

    .add-form button {
      padding: 15px 30px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s;
    }

    .add-form button:hover {
      background: #764ba2;
    }

    .add-form button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .filters {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .filters button {
      flex: 1;
      padding: 10px;
      border: 2px solid #e0e0e0;
      background: white;
      color: #333;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s;
    }

    .filters button.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .search-box {
      margin-bottom: 20px;
    }

    .search-box input {
      width: 100%;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 1rem;
    }

    .loader {
      text-align: center;
      padding: 40px;
      display: none;
    }

    .loader.show {
      display: block;
    }

    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error {
      background: #f8d7da;
      color: #721c24;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 20px;
      display: none;
    }

    .error.show {
      display: block;
    }

    .todo-list {
      display: grid;
      gap: 10px;
    }

    .todo-item {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 15px;
      transition: all 0.3s;
      animation: fadeIn 0.3s;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .todo-item.completed {
      opacity: 0.6;
    }

    .todo-item input[type="checkbox"] {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    .todo-item .todo-text {
      flex: 1;
      font-size: 1.1rem;
      color: #333;
    }

    .todo-item.completed .todo-text {
      text-decoration: line-through;
      color: #999;
    }

    .todo-item .todo-id {
      font-size: 0.8rem;
      color: #999;
      background: white;
      padding: 5px 10px;
      border-radius: 5px;
    }

    .todo-item button {
      padding: 8px 15px;
      background: #dc3545;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s;
    }

    .todo-item button:hover {
      background: #c82333;
    }

    .todo-item button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .stats {
      margin-top: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 10px;
      display: flex;
      justify-content: space-around;
      text-align: center;
    }

    .stat {
      flex: 1;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #667eea;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #666;
      margin-top: 5px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #999;
    }

    .empty-state h2 {
      font-size: 3rem;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>✅ Todo App с API</h1>
    
    <div class="api-info">
      📡 Используется API: <a href="https://jsonplaceholder.typicode.com" target="_blank">JSONPlaceholder</a>
      <br>Данные сохраняются только в сессии (имитация)
    </div>
    
    <!-- Форма добавления -->
    <div class="add-form">
      <input type="text" id="todoInput" placeholder="Введите новую задачу...">
      <button id="addBtn">Добавить</button>
    </div>
    
    <!-- Фильтры -->
    <div class="filters">
      <button class="active" data-filter="all">Все</button>
      <button data-filter="active">Активные</button>
      <button data-filter="completed">Завершённые</button>
    </div>
    
    <!-- Поиск -->
    <div class="search-box">
      <input type="text" id="searchInput" placeholder="🔍 Поиск задач...">
    </div>
    
    <!-- Ошибка -->
    <div class="error" id="error"></div>
    
    <!-- Загрузка -->
    <div class="loader" id="loader">
      <div class="spinner"></div>
      <p>Загрузка задач...</p>
    </div>
    
    <!-- Список задач -->
    <div class="todo-list" id="todoList"></div>
    
    <!-- Статистика -->
    <div class="stats" id="stats" style="display: none;">
      <div class="stat">
        <div class="stat-value" id="totalCount">0</div>
        <div class="stat-label">Всего</div>
      </div>
      <div class="stat">
        <div class="stat-value" id="activeCount">0</div>
        <div class="stat-label">Активных</div>
      </div>
      <div class="stat">
        <div class="stat-value" id="completedCount">0</div>
        <div class="stat-label">Завершено</div>
      </div>
    </div>
  </div>

  <script src="todo-app.js"></script>
</body>
</html>
```

---

## JavaScript

Создайте файл `todo-app.js`:

```javascript
// API Configuration
const API_URL = 'https://jsonplaceholder.typicode.com';
const USER_ID = 1; // ID пользователя для фильтрации

// Элементы
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const searchInput = document.getElementById('searchInput');
const loader = document.getElementById('loader');
const errorEl = document.getElementById('error');
const stats = document.getElementById('stats');
const totalCountEl = document.getElementById('totalCount');
const activeCountEl = document.getElementById('activeCount');
const completedCountEl = document.getElementById('completedCount');

// Состояние
let todos = [];
let currentFilter = 'all';
let searchQuery = '';

// API функции
async function fetchTodos() {
  showLoader();
  hideError();
  
  try {
    const response = await fetch(`${API_URL}/todos?userId=${USER_ID}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    todos = data.slice(0, 10); // Ограничиваем 10 задачами
    renderTodos();
    updateStats();
  } catch (error) {
    showError('Не удалось загрузить задачи: ' + error.message);
    console.error('Error:', error);
  } finally {
    hideLoader();
  }
}

async function createTodo(title) {
  try {
    addBtn.disabled = true;
    
    const response = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: USER_ID,
        title: title,
        completed: false
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const newTodo = await response.json();
    
    // JSONPlaceholder возвращает id=201, заменяем на уникальный
    newTodo.id = Date.now();
    
    todos.unshift(newTodo); // Добавляем в начало
    renderTodos();
    updateStats();
    
    todoInput.value = '';
    showSuccess('Задача добавлена!');
  } catch (error) {
    showError('Не удалось создать задачу: ' + error.message);
  } finally {
    addBtn.disabled = false;
  }
}

async function updateTodo(id, completed) {
  try {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Обновляем локально
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.completed = completed;
      renderTodos();
      updateStats();
    }
  } catch (error) {
    showError('Не удалось обновить задачу: ' + error.message);
    // Откатываем изменение
    renderTodos();
  }
}

async function deleteTodo(id) {
  if (!confirm('Удалить эту задачу?')) return;
  
  try {
    const response = await fetch(`${API_URL}/todos/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Удаляем локально
    todos = todos.filter(t => t.id !== id);
    renderTodos();
    updateStats();
    showSuccess('Задача удалена!');
  } catch (error) {
    showError('Не удалось удалить задачу: ' + error.message);
  }
}

// UI функции
function renderTodos() {
  let filteredTodos = todos;
  
  // Фильтрация
  if (currentFilter === 'active') {
    filteredTodos = todos.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTodos = todos.filter(t => t.completed);
  }
  
  // Поиск
  if (searchQuery) {
    filteredTodos = filteredTodos.filter(t =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Отображение
  if (filteredTodos.length === 0) {
    todoList.innerHTML = `
      <div class="empty-state">
        <h2>📭</h2>
        <p>Задач не найдено</p>
      </div>
    `;
  } else {
    todoList.innerHTML = filteredTodos.map(todo => `
      <div class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
        <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="handleToggle(${todo.id})">
        <div class="todo-text">${escapeHtml(todo.title)}</div>
        <div class="todo-id">ID: ${todo.id}</div>
        <button onclick="handleDelete(${todo.id})">Удалить</button>
      </div>
    `).join('');
  }
  
  stats.style.display = 'flex';
}

function updateStats() {
  totalCountEl.textContent = todos.length;
  activeCountEl.textContent = todos.filter(t => !t.completed).length;
  completedCountEl.textContent = todos.filter(t => t.completed).length;
}

function showLoader() {
  loader.classList.add('show');
  todoList.innerHTML = '';
}

function hideLoader() {
  loader.classList.remove('show');
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.classList.add('show');
  
  setTimeout(() => hideError(), 5000);
}

function hideError() {
  errorEl.classList.remove('show');
}

function showSuccess(message) {
  // Можно добавить toast уведомление
  console.log('✅', message);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Event handlers (глобальные для onclick)
function handleToggle(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    updateTodo(id, !todo.completed);
  }
}

function handleDelete(id) {
  deleteTodo(id);
}

// Обработчики событий
addBtn.addEventListener('click', () => {
  const title = todoInput.value.trim();
  
  if (!title) {
    showError('Введите текст задачи');
    return;
  }
  
  if (title.length < 3) {
    showError('Задача должна содержать минимум 3 символа');
    return;
  }
  
  createTodo(title);
});

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});

// Фильтры
document.querySelectorAll('.filters button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

// Поиск с debounce
let searchTimeout;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimeout);
  
  searchTimeout = setTimeout(() => {
    searchQuery = e.target.value.trim();
    renderTodos();
  }, 300);
});

// Инициализация
fetchTodos();
```

---

## Что вы изучили

✅ **Fetch API:**
- GET запросы для получения данных
- POST для создания
- PATCH для обновления
- DELETE для удаления

✅ **async/await:**
- Обработка асинхронных операций
- try/catch для ошибок

✅ **REST API:**
- Работа с реальным API
- Правильная структура запросов
- Обработка ответов

✅ **UX паттерны:**
- Loader при загрузке
- Обработка ошибок
- Debounce для поиска
- Оптимистичные обновления

---

## Задания для улучшения

### Уровень 1 (Базовый):
1. Добавьте возможность редактирования текста задачи (двойной клик)
2. Реализуйте сортировку (по дате, по алфавиту)
3. Добавьте счётчик символов при вводе

### Уровень 2 (Средний):
1. Реализуйте пагинацию (10 задач на страницу)
2. Добавьте кэширование запросов в localStorage
3. Реализуйте offline режим (сохранение в localStorage, синхронизация при появлении сети)
4. Добавьте retry механизм при ошибке

### Уровень 3 (Продвинутый):
1. Реализуйте оптимистичные обновления с rollback при ошибке
2. Добавьте drag-and-drop для изменения порядка
3. Реализуйте массовые операции (отметить все, удалить завершённые)
4. Добавьте анимации переходов между состояниями

---

## Дополнительные API для практики

1. **[ReqRes](https://reqres.in/)** — пользователи, аутентификация
2. **[Dog API](https://dog.ceo/dog-api/)** — случайные фото собак
3. **[OpenWeatherMap](https://openweathermap.org/api)** — погода (требуется регистрация)
4. **[GitHub API](https://api.github.com)** — данные репозиториев

**Отличная работа! Переходите к следующему уроку.** 🚀
