# Практика: ES6 Modules

## Модульное приложение Todo

Создайте приложение с разделением на модули.

**Структура:**
```
app/
├── index.html
├── js/
│   ├── app.js (главный)
│   ├── components/
│   │   ├── TodoForm.js
│   │   └── TodoList.js
│   ├── services/
│   │   └── storage.js
│   └── utils/
│       └── helpers.js
```

---

## index.html

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Модульное Todo App</title>
  <style>
    body { font-family: Arial; max-width: 600px; margin: 50px auto; }
    .form { display: flex; gap: 10px; margin-bottom: 20px; }
    .form input { flex: 1; padding: 10px; }
    .form button { padding: 10px 20px; }
    .todo { padding: 10px; background: #f0f0f0; margin-bottom: 5px; display: flex; gap: 10px; }
  </style>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

---

## js/utils/helpers.js

```javascript
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatDate(date) {
  return new Date(date).toLocaleString('ru-RU');
}

export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

---

## js/services/storage.js

```javascript
const STORAGE_KEY = 'todos';

export function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function loadTodos() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function clearTodos() {
  localStorage.removeItem(STORAGE_KEY);
}
```

---

## js/components/TodoForm.js

```javascript
export default class TodoForm {
  constructor(onSubmit) {
    this.onSubmit = onSubmit;
    this.element = this.create();
  }
  
  create() {
    const div = document.createElement('div');
    div.className = 'form';
    div.innerHTML = `
      <input type="text" id="todoInput" placeholder="Новая задача...">
      <button id="addBtn">Добавить</button>
    `;
    
    const input = div.querySelector('#todoInput');
    const btn = div.querySelector('#addBtn');
    
    btn.addEventListener('click', () => {
      const text = input.value.trim();
      if (text) {
        this.onSubmit(text);
        input.value = '';
      }
    });
    
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') btn.click();
    });
    
    return div;
  }
  
  render(container) {
    container.appendChild(this.element);
  }
}
```

---

## js/components/TodoList.js

```javascript
import { escapeHtml, formatDate } from '../utils/helpers.js';

export default class TodoList {
  constructor(todos, onToggle, onDelete) {
    this.todos = todos;
    this.onToggle = onToggle;
    this.onDelete = onDelete;
    this.element = this.create();
  }
  
  create() {
    const div = document.createElement('div');
    div.className = 'todo-list';
    return div;
  }
  
  render(container) {
    container.appendChild(this.element);
    this.update();
  }
  
  update() {
    this.element.innerHTML = this.todos.map(todo => `
      <div class="todo" style="${todo.completed ? 'opacity: 0.6; text-decoration: line-through;' : ''}">
        <input type="checkbox" ${todo.completed ? 'checked' : ''} 
               onchange="app.toggleTodo('${todo.id}')">
        <div style="flex: 1;">
          <div>${escapeHtml(todo.text)}</div>
          <small style="color: #999;">${formatDate(todo.createdAt)}</small>
        </div>
        <button onclick="app.deleteTodo('${todo.id}')">Удалить</button>
      </div>
    `).join('');
  }
}
```

---

## js/app.js

```javascript
import TodoForm from './components/TodoForm.js';
import TodoList from './components/TodoList.js';
import { loadTodos, saveTodos } from './services/storage.js';
import { generateId } from './utils/helpers.js';

class App {
  constructor() {
    this.todos = loadTodos();
    this.init();
  }
  
  init() {
    const container = document.getElementById('app');
    
    this.form = new TodoForm((text) => this.addTodo(text));
    this.form.render(container);
    
    this.list = new TodoList(
      this.todos,
      (id) => this.toggleTodo(id),
      (id) => this.deleteTodo(id)
    );
    this.list.render(container);
  }
  
  addTodo(text) {
    const todo = {
      id: generateId(),
      text,
      completed: false,
      createdAt: Date.now()
    };
    
    this.todos.push(todo);
    this.save();
  }
  
  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.save();
    }
  }
  
  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.save();
  }
  
  save() {
    saveTodos(this.todos);
    this.list.todos = this.todos;
    this.list.update();
  }
}

window.app = new App();
```

---

## Задания

1. Добавьте модуль `filters.js` с фильтрацией (все/активные/завершённые)
2. Создайте модуль `validators.js` для проверки ввода
3. Добавьте модуль `api.js` для работы с JSON Placeholder
4. Реализуйте динамический импорт для статистики

**Отличная работа!** 🚀
