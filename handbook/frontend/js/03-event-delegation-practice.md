# Практика: Делегирование событий

## Введение

В этой практике вы создадите **полноценное приложение Todo List** с использованием делегирования событий. Вы научитесь:
- Обрабатывать клики на динамически созданных элементах
- Использовать `event.target` и `closest()`
- Эффективно работать с множеством элементов через одного родителя
- Создавать интерактивные интерфейсы

**Время выполнения:** 40-50 минут  
**Сложность:** Средний

---

## Что мы будем делать

Создадим **Todo List приложение** с функциями:
1. ➕ Добавление задач
2. ✅ Отметка задачи как выполненной
3. ✏️ Редактирование задачи
4. 🗑️ Удаление задачи
5. 🔢 Счётчик активных задач
6. 🎨 Категории задач (работа, личное, покупки)

**Всё через делегирование — один обработчик для всех действий!**

---

## Шаг 1: Создайте HTML-файл

Создайте файл `event-delegation-practice.html`:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Todo List — Делегирование событий</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 40px 20px;
    }

    .container {
      max-width: 700px;
      margin: 0 auto;
    }

    h1 {
      color: white;
      text-align: center;
      margin-bottom: 30px;
      font-size: 2.5rem;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .app {
      background: white;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    /* Форма добавления */
    .add-task-form {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .task-input {
      flex: 1;
      padding: 12px;
      font-size: 1rem;
      border: 2px solid #ddd;
      border-radius: 8px;
      transition: border 0.3s;
    }

    .task-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .category-select {
      padding: 12px;
      font-size: 1rem;
      border: 2px solid #ddd;
      border-radius: 8px;
      background: white;
      cursor: pointer;
    }

    .add-btn {
      padding: 12px 24px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .add-btn:hover {
      background: #5568d3;
      transform: translateY(-2px);
    }

    /* Счётчик */
    .stats {
      display: flex;
      justify-content: space-between;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 0.9rem;
      color: #666;
    }

    .stats span {
      font-weight: bold;
      color: #667eea;
    }

    /* Список задач */
    .task-list {
      list-style: none;
    }

    .task-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 10px;
      transition: all 0.3s;
    }

    .task-item:hover {
      background: #e9ecef;
      transform: translateX(5px);
    }

    .task-item.completed {
      opacity: 0.6;
    }

    .task-item.completed .task-text {
      text-decoration: line-through;
      color: #999;
    }

    /* Чекбокс */
    .task-checkbox {
      width: 20px;
      height: 20px;
      cursor: pointer;
    }

    /* Категория */
    .task-category {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .task-category.work {
      background: #ffeaa7;
      color: #d63031;
    }

    .task-category.personal {
      background: #dfe6e9;
      color: #2d3436;
    }

    .task-category.shopping {
      background: #a29bfe;
      color: #6c5ce7;
    }

    /* Текст задачи */
    .task-text {
      flex: 1;
      font-size: 1rem;
      color: #333;
      word-break: break-word;
    }

    /* Кнопки действий */
    .task-actions {
      display: flex;
      gap: 8px;
    }

    .task-btn {
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .edit-btn {
      background: #74b9ff;
      color: white;
    }

    .edit-btn:hover {
      background: #0984e3;
    }

    .delete-btn {
      background: #ff7675;
      color: white;
    }

    .delete-btn:hover {
      background: #d63031;
    }

    /* Редактирование */
    .task-item.editing .task-text {
      display: none;
    }

    .task-item.editing .task-actions {
      display: none;
    }

    .edit-form {
      display: none;
      flex: 1;
      gap: 8px;
    }

    .task-item.editing .edit-form {
      display: flex;
    }

    .edit-input {
      flex: 1;
      padding: 8px;
      font-size: 0.9rem;
      border: 2px solid #667eea;
      border-radius: 6px;
    }

    .save-btn {
      padding: 6px 12px;
      background: #00b894;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
    }

    .cancel-btn {
      padding: 6px 12px;
      background: #636e72;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
    }

    /* Пустое состояние */
    .empty-state {
      text-align: center;
      padding: 40px;
      color: #999;
    }

    .empty-state.hidden {
      display: none;
    }

    /* Информация */
    .info {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      padding: 15px;
      border-radius: 5px;
      margin-top: 20px;
      font-size: 0.9rem;
      color: #0d47a1;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📝 Todo List</h1>

    <div class="app">
      <!-- Форма добавления -->
      <form class="add-task-form" id="addTaskForm">
        <input 
          type="text" 
          class="task-input" 
          id="taskInput" 
          placeholder="Введите задачу..."
          required
        >
        <select class="category-select" id="categorySelect">
          <option value="work">Работа</option>
          <option value="personal">Личное</option>
          <option value="shopping">Покупки</option>
        </select>
        <button type="submit" class="add-btn">Добавить</button>
      </form>

      <!-- Статистика -->
      <div class="stats">
        <div>Всего задач: <span id="totalCount">0</span></div>
        <div>Активных: <span id="activeCount">0</span></div>
        <div>Выполнено: <span id="completedCount">0</span></div>
      </div>

      <!-- Список задач -->
      <ul class="task-list" id="taskList">
        <!-- Задачи добавляются сюда динамически -->
      </ul>

      <!-- Пустое состояние -->
      <div class="empty-state" id="emptyState">
        <p>📭 Нет задач. Добавьте первую!</p>
      </div>
    </div>

    <!-- Информация -->
    <div class="info">
      <strong>💡 Делегирование:</strong> Все кнопки обрабатываются через один обработчик на родителе!
      Откройте консоль (F12) и посмотрите, как работает event.target.
    </div>
  </div>

  <script>
    // ============================================
    // Получаем элементы
    // ============================================
    const addTaskForm = document.getElementById('addTaskForm');
    const taskInput = document.getElementById('taskInput');
    const categorySelect = document.getElementById('categorySelect');
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const totalCount = document.getElementById('totalCount');
    const activeCount = document.getElementById('activeCount');
    const completedCount = document.getElementById('completedCount');

    // ============================================
    // Состояние приложения
    // ============================================
    let tasks = [];
    let nextId = 1;

    // ============================================
    // Добавление задачи
    // ============================================
    addTaskForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const text = taskInput.value.trim();
      if (text === '') return;

      const task = {
        id: nextId++,
        text: text,
        category: categorySelect.value,
        completed: false
      };

      tasks.push(task);
      renderTasks();
      updateStats();

      taskInput.value = '';
      taskInput.focus();

      console.log('✅ Задача добавлена:', task);
    });

    // ============================================
    // Делегирование событий (ГЛАВНОЕ!)
    // ============================================
    taskList.addEventListener('click', (event) => {
      const target = event.target;

      // 1. Удаление задачи
      if (target.classList.contains('delete-btn')) {
        const taskItem = target.closest('.task-item');
        const taskId = parseInt(taskItem.dataset.id);

        tasks = tasks.filter(task => task.id !== taskId);
        renderTasks();
        updateStats();

        console.log('🗑️ Задача удалена, ID:', taskId);
      }

      // 2. Редактирование задачи
      if (target.classList.contains('edit-btn')) {
        const taskItem = target.closest('.task-item');
        taskItem.classList.add('editing');

        const editInput = taskItem.querySelector('.edit-input');
        editInput.focus();

        console.log('✏️ Режим редактирования');
      }

      // 3. Сохранение редактирования
      if (target.classList.contains('save-btn')) {
        const taskItem = target.closest('.task-item');
        const taskId = parseInt(taskItem.dataset.id);
        const editInput = taskItem.querySelector('.edit-input');
        const newText = editInput.value.trim();

        if (newText !== '') {
          const task = tasks.find(t => t.id === taskId);
          if (task) {
            task.text = newText;
            renderTasks();
            console.log('💾 Задача сохранена:', task);
          }
        }
      }

      // 4. Отмена редактирования
      if (target.classList.contains('cancel-btn')) {
        const taskItem = target.closest('.task-item');
        taskItem.classList.remove('editing');

        console.log('❌ Отмена редактирования');
      }
    });

    // ============================================
    // Изменение чекбокса (change событие)
    // ============================================
    taskList.addEventListener('change', (event) => {
      if (event.target.classList.contains('task-checkbox')) {
        const taskItem = event.target.closest('.task-item');
        const taskId = parseInt(taskItem.dataset.id);
        const task = tasks.find(t => t.id === taskId);

        if (task) {
          task.completed = event.target.checked;
          renderTasks();
          updateStats();

          console.log(task.completed ? '✅ Задача выполнена' : '⏳ Задача активна', task);
        }
      }
    });

    // ============================================
    // Рендеринг задач
    // ============================================
    function renderTasks() {
      taskList.innerHTML = '';

      if (tasks.length === 0) {
        emptyState.classList.remove('hidden');
        return;
      }

      emptyState.classList.add('hidden');

      tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        li.innerHTML = `
          <input 
            type="checkbox" 
            class="task-checkbox" 
            ${task.completed ? 'checked' : ''}
          >
          <span class="task-category ${task.category}">${getCategoryName(task.category)}</span>
          <div class="task-text">${task.text}</div>
          <div class="task-actions">
            <button class="task-btn edit-btn">Редактировать</button>
            <button class="task-btn delete-btn">Удалить</button>
          </div>
          <div class="edit-form">
            <input type="text" class="edit-input" value="${task.text}">
            <button class="save-btn">Сохранить</button>
            <button class="cancel-btn">Отмена</button>
          </div>
        `;

        taskList.appendChild(li);
      });
    }

    // ============================================
    // Обновление статистики
    // ============================================
    function updateStats() {
      const total = tasks.length;
      const active = tasks.filter(t => !t.completed).length;
      const completed = tasks.filter(t => t.completed).length;

      totalCount.textContent = total;
      activeCount.textContent = active;
      completedCount.textContent = completed;
    }

    // ============================================
    // Вспомогательная функция
    // ============================================
    function getCategoryName(category) {
      const names = {
        work: 'Работа',
        personal: 'Личное',
        shopping: 'Покупки'
      };
      return names[category] || category;
    }

    // ============================================
    // Инициализация
    // ============================================
    renderTasks();
    updateStats();
    console.log('✅ Todo List загружен — используется делегирование событий!');
  </script>
</body>
</html>
```

---

## Шаг 2: Откройте файл в браузере

1. Сохраните файл как `event-delegation-practice.html`
2. Откройте его в браузере (двойной клик или Live Server)
3. Откройте консоль разработчика (F12) для просмотра логов

---

## Шаг 3: Разбор кода

### 🎯 Делегирование событий (главное!)

```javascript
taskList.addEventListener('click', (event) => {
  const target = event.target;

  // Удаление
  if (target.classList.contains('delete-btn')) {
    const taskItem = target.closest('.task-item');
    const taskId = parseInt(taskItem.dataset.id);
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
  }

  // Редактирование
  if (target.classList.contains('edit-btn')) {
    const taskItem = target.closest('.task-item');
    taskItem.classList.add('editing');
  }
  
  // ... остальные проверки
});
```

**Что происходит:**
1. Один обработчик на `taskList` (родитель)
2. Проверяем `event.target` — на что кликнули
3. `closest('.task-item')` находит ближайший родительский элемент задачи
4. `dataset.id` получает ID задачи из `data-id` атрибута

**Преимущества:**
- ✅ Работает для всех задач (даже добавленных позже)
- ✅ Один обработчик вместо N обработчиков
- ✅ Меньше памяти
- ✅ Проще код

---

### 📝 Добавление задачи

```javascript
addTaskForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Отменяем отправку формы

  const text = taskInput.value.trim();
  if (text === '') return;

  const task = {
    id: nextId++,
    text: text,
    category: categorySelect.value,
    completed: false
  };

  tasks.push(task);
  renderTasks();
  updateStats();
});
```

**Пояснения:**
- `event.preventDefault()` — отменяем стандартную отправку формы
- Создаём объект задачи с уникальным `id`
- Добавляем в массив `tasks`
- Перерисовываем список

---

### ✅ Изменение чекбокса

```javascript
taskList.addEventListener('change', (event) => {
  if (event.target.classList.contains('task-checkbox')) {
    const taskItem = event.target.closest('.task-item');
    const taskId = parseInt(taskItem.dataset.id);
    const task = tasks.find(t => t.id === taskId);

    if (task) {
      task.completed = event.target.checked;
      renderTasks();
      updateStats();
    }
  }
});
```

**Пояснения:**
- Используем событие `change` (срабатывает при изменении чекбокса)
- `event.target.checked` — состояние чекбокса (true/false)
- Обновляем состояние задачи в массиве

---

### 🎨 Рендеринг списка

```javascript
function renderTasks() {
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id; // Важно: сохраняем ID в data-атрибуте

    li.innerHTML = `...`; // HTML разметка задачи

    taskList.appendChild(li);
  });
}
```

**Важно:**
- `dataset.id` сохраняет ID задачи в `data-id` атрибуте
- Это позволяет найти задачу при клике на кнопку
- `innerHTML` безопасен здесь, т.к. данные контролируемы

---

## Задания для самостоятельной работы

### Задание 1: Фильтрация задач

Добавьте кнопки фильтрации: **Все**, **Активные**, **Выполненные**.

**Подсказка:**

```javascript
let currentFilter = 'all'; // all, active, completed

function renderTasks() {
  let filteredTasks = tasks;

  if (currentFilter === 'active') {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(t => t.completed);
  }

  // Рендерим filteredTasks вместо tasks
}
```

---

### Задание 2: Сохранение в LocalStorage

Сохраняйте задачи в `localStorage`, чтобы они не пропадали при перезагрузке.

**Подсказка:**

```javascript
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem('tasks');
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

// Вызывать loadTasks() при инициализации
// Вызывать saveTasks() после любого изменения
```

---

### Задание 3: Drag & Drop для изменения порядка

Добавьте возможность перетаскивания задач для изменения порядка.

**Подсказка:**

```javascript
li.draggable = true;

li.addEventListener('dragstart', (e) => {
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.target.innerHTML);
});
```

---

### Задание 4: Приоритет задач

Добавьте приоритет (высокий, средний, низкий) и сортировку по приоритету.

**Подсказка:**

```javascript
const task = {
  id: nextId++,
  text: text,
  category: categorySelect.value,
  priority: prioritySelect.value, // 'high', 'medium', 'low'
  completed: false
};

// Сортировка
tasks.sort((a, b) => {
  const priorities = { high: 3, medium: 2, low: 1 };
  return priorities[b.priority] - priorities[a.priority];
});
```

---

### Задание 5: Поиск задач

Добавьте поле поиска, которое фильтрует задачи в реальном времени.

**Подсказка:**

```javascript
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = tasks.filter(task => 
    task.text.toLowerCase().includes(query)
  );
  renderFilteredTasks(filtered);
});
```

---

## Итоги практики

### Что вы сделали:

✅ Использовали **делегирование событий** для обработки множества кнопок  
✅ Применили `event.target` для определения, на что кликнули  
✅ Использовали `closest()` для поиска родительского элемента  
✅ Создали динамический список с добавлением/удалением  
✅ Реализовали редактирование задач  
✅ Обработали чекбоксы через событие `change`  
✅ Обновили статистику в реальном времени  

### Ключевые техники:

- **Один обработчик для всех кнопок** — эффективность
- **`data-*` атрибуты** — хранение ID элементов
- **`event.target`** — определение источника события
- **`closest()`** — поиск родителя
- **`classList.contains()`** — проверка класса

---

## Что дальше?

В следующем уроке:
- **Создание элементов** (`createElement`, `appendChild`)
- **Шаблоны** (Template literals, `<template>`)
- **Клонирование** (`cloneNode`)
- **Вставка элементов** (`insertBefore`, `insertAdjacentHTML`)

---

## Дополнительные ресурсы

- [MDN: Event delegation](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation)
- [JavaScript.info: Event delegation](https://learn.javascript.ru/event-delegation)
- [MDN: Element.closest()](https://developer.mozilla.org/ru/docs/Web/API/Element/closest)

**Отличная работа! 🎉 Вы создали полноценное приложение с делегированием событий!**
