# Практика: Создание и удаление элементов (Dynamic DOM)

## Введение

В этом уроке вы создадите **три практических проекта**, которые демонстрируют динамическое создание, добавление и удаление элементов:

1. **Динамическая галерея изображений**
2. **Список покупок** с добавлением/удалением
3. **Генератор карточек** из массива данных

**Время выполнения:** 30-40 минут  
**Сложность:** Начинающий-Средний

---

## Проект 1: Динамическая галерея изображений

### HTML

Создайте файл `gallery.html`:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Динамическая галерея</title>
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
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      padding: 40px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    h1 {
      color: #667eea;
      margin-bottom: 30px;
      text-align: center;
    }

    .controls {
      display: flex;
      gap: 15px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }

    .controls input {
      flex: 1;
      min-width: 200px;
      padding: 12px;
      border: 2px solid #667eea;
      border-radius: 8px;
      font-size: 1rem;
    }

    .controls button {
      padding: 12px 30px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.3s;
    }

    .controls button:hover {
      background: #764ba2;
    }

    .gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }

    .gallery-item {
      position: relative;
      border-radius: 15px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s;
    }

    .gallery-item:hover {
      transform: translateY(-5px);
    }

    .gallery-item img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      display: block;
    }

    .gallery-item .caption {
      padding: 15px;
      background: #f8f9fa;
      font-size: 0.9rem;
      color: #333;
    }

    .gallery-item .delete-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 8px 16px;
      background: #ff4757;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .gallery-item:hover .delete-btn {
      opacity: 1;
    }

    .gallery-item .delete-btn:hover {
      background: #ee5a6f;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #999;
      font-size: 1.2rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📸 Динамическая галерея</h1>
    
    <div class="controls">
      <input type="text" id="imageUrl" placeholder="URL изображения">
      <input type="text" id="imageCaption" placeholder="Подпись">
      <button id="addImageBtn">Добавить изображение</button>
    </div>

    <div class="gallery" id="gallery">
      <!-- Изображения будут добавляться сюда -->
    </div>
  </div>

  <script src="gallery.js"></script>
</body>
</html>
```

### JavaScript

Создайте файл `gallery.js`:

```javascript
// Получаем элементы
const gallery = document.getElementById('gallery');
const imageUrlInput = document.getElementById('imageUrl');
const imageCaptionInput = document.getElementById('imageCaption');
const addImageBtn = document.getElementById('addImageBtn');

// Начальные изображения (можно удалить после тестирования)
const initialImages = [
  { url: 'https://picsum.photos/400/300?random=1', caption: 'Природа 1' },
  { url: 'https://picsum.photos/400/300?random=2', caption: 'Архитектура' },
  { url: 'https://picsum.photos/400/300?random=3', caption: 'Город' }
];

// Функция создания элемента галереи
function createGalleryItem(url, caption) {
  // Создаём контейнер
  const item = document.createElement('div');
  item.className = 'gallery-item';
  
  // Создаём изображение
  const img = document.createElement('img');
  img.src = url;
  img.alt = caption;
  
  // Создаём подпись
  const captionEl = document.createElement('div');
  captionEl.className = 'caption';
  captionEl.textContent = caption;
  
  // Создаём кнопку удаления
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = 'Удалить';
  
  // Обработчик удаления
  deleteBtn.addEventListener('click', () => {
    item.remove();
    checkEmptyState();
  });
  
  // Собираем элемент
  item.append(img, captionEl, deleteBtn);
  
  return item;
}

// Функция добавления изображения
function addImage(url, caption) {
  if (!url || !caption) {
    alert('Заполните оба поля!');
    return;
  }
  
  const item = createGalleryItem(url, caption);
  gallery.appendChild(item);
  
  // Очищаем инпуты
  imageUrlInput.value = '';
  imageCaptionInput.value = '';
  imageUrlInput.focus();
  
  checkEmptyState();
}

// Проверка пустого состояния
function checkEmptyState() {
  if (gallery.children.length === 0) {
    gallery.innerHTML = '<div class="empty-state">Галерея пуста. Добавьте изображения!</div>';
  }
}

// Обработчик кнопки добавления
addImageBtn.addEventListener('click', () => {
  addImage(imageUrlInput.value, imageCaptionInput.value);
});

// Добавление по Enter
imageCaptionInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addImage(imageUrlInput.value, imageCaptionInput.value);
  }
});

// Инициализация с начальными изображениями
initialImages.forEach(img => {
  const item = createGalleryItem(img.url, img.caption);
  gallery.appendChild(item);
});
```

---

## Проект 2: Список покупок

### HTML

Создайте файл `shopping-list.html`:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Список покупок</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    h1 {
      color: #11998e;
      margin-bottom: 30px;
      text-align: center;
    }

    .add-form {
      display: flex;
      gap: 10px;
      margin-bottom: 30px;
    }

    .add-form input {
      flex: 1;
      padding: 12px;
      border: 2px solid #11998e;
      border-radius: 8px;
      font-size: 1rem;
    }

    .add-form button {
      padding: 12px 24px;
      background: #11998e;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .add-form button:hover {
      background: #38ef7d;
    }

    .shopping-list {
      list-style: none;
    }

    .shopping-item {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px;
      margin-bottom: 10px;
      background: #f8f9fa;
      border-radius: 10px;
      transition: all 0.3s;
    }

    .shopping-item:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .shopping-item.purchased {
      opacity: 0.6;
      text-decoration: line-through;
    }

    .shopping-item input[type="checkbox"] {
      width: 24px;
      height: 24px;
      cursor: pointer;
    }

    .shopping-item span {
      flex: 1;
      font-size: 1.1rem;
    }

    .shopping-item button {
      padding: 8px 16px;
      background: #ff4757;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .shopping-item button:hover {
      background: #ee5a6f;
    }

    .stats {
      margin-top: 20px;
      padding: 20px;
      background: #e3f2fd;
      border-radius: 10px;
      text-align: center;
      color: #11998e;
      font-weight: bold;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #999;
      font-size: 1.1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🛒 Список покупок</h1>
    
    <form class="add-form" id="addForm">
      <input type="text" id="itemInput" placeholder="Добавить товар..." required>
      <button type="submit">Добавить</button>
    </form>

    <ul class="shopping-list" id="shoppingList">
      <!-- Товары будут добавляться сюда -->
    </ul>

    <div class="stats">
      Всего товаров: <span id="totalItems">0</span> | 
      Куплено: <span id="purchasedItems">0</span>
    </div>
  </div>

  <script src="shopping-list.js"></script>
</body>
</html>
```

### JavaScript

Создайте файл `shopping-list.js`:

```javascript
// Получаем элементы
const addForm = document.getElementById('addForm');
const itemInput = document.getElementById('itemInput');
const shoppingList = document.getElementById('shoppingList');
const totalItemsEl = document.getElementById('totalItems');
const purchasedItemsEl = document.getElementById('purchasedItems');

// Функция создания элемента списка
function createShoppingItem(name) {
  const li = document.createElement('li');
  li.className = 'shopping-item';
  
  // Чекбокс
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.addEventListener('change', () => {
    li.classList.toggle('purchased');
    updateStats();
  });
  
  // Название товара
  const span = document.createElement('span');
  span.textContent = name;
  
  // Кнопка удаления
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Удалить';
  deleteBtn.addEventListener('click', () => {
    li.remove();
    updateStats();
  });
  
  // Собираем элемент
  li.append(checkbox, span, deleteBtn);
  
  return li;
}

// Функция добавления товара
function addItem(name) {
  if (!name.trim()) return;
  
  const item = createShoppingItem(name);
  shoppingList.appendChild(item);
  
  updateStats();
}

// Обновление статистики
function updateStats() {
  const total = shoppingList.children.length;
  const purchased = document.querySelectorAll('.shopping-item.purchased').length;
  
  totalItemsEl.textContent = total;
  purchasedItemsEl.textContent = purchased;
}

// Обработчик формы
addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addItem(itemInput.value);
  itemInput.value = '';
  itemInput.focus();
});

// Начальные товары (можно удалить)
['Молоко', 'Хлеб', 'Яйца'].forEach(item => addItem(item));
```

---

## Проект 3: Генератор карточек пользователей

### HTML

Создайте файл `user-cards.html`:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Карточки пользователей</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: white;
      text-align: center;
      margin-bottom: 40px;
      font-size: 2.5rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .controls {
      text-align: center;
      margin-bottom: 30px;
    }

    .controls button {
      padding: 15px 40px;
      background: white;
      color: #f5576c;
      border: none;
      border-radius: 30px;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s;
    }

    .controls button:hover {
      transform: translateY(-2px);
    }

    .cards-container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 25px;
    }

    .user-card {
      background: white;
      border-radius: 20px;
      padding: 30px;
      text-align: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s;
      position: relative;
    }

    .user-card:hover {
      transform: translateY(-10px);
    }

    .user-card .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      color: white;
      font-weight: bold;
    }

    .user-card h3 {
      color: #333;
      margin-bottom: 10px;
      font-size: 1.4rem;
    }

    .user-card p {
      color: #666;
      margin-bottom: 5px;
      font-size: 0.95rem;
    }

    .user-card .email {
      color: #667eea;
      font-weight: 500;
    }

    .user-card .delete-btn {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #ff4757;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      transition: background 0.3s;
    }

    .user-card .delete-btn:hover {
      background: #ee5a6f;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>👥 Карточки пользователей</h1>
    
    <div class="controls">
      <button id="loadUsersBtn">Загрузить пользователей</button>
    </div>

    <div class="cards-container" id="cardsContainer">
      <!-- Карточки будут добавляться сюда -->
    </div>
  </div>

  <script src="user-cards.js"></script>
</body>
</html>
```

### JavaScript

Создайте файл `user-cards.js`:

```javascript
const cardsContainer = document.getElementById('cardsContainer');
const loadUsersBtn = document.getElementById('loadUsersBtn');

// Функция создания карточки пользователя
function createUserCard(user) {
  const card = document.createElement('div');
  card.className = 'user-card';
  
  // Аватар с инициалами
  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = user.name.charAt(0).toUpperCase();
  
  // Имя
  const name = document.createElement('h3');
  name.textContent = user.name;
  
  // Возраст
  const age = document.createElement('p');
  age.textContent = `Возраст: ${user.age} лет`;
  
  // Город
  const city = document.createElement('p');
  city.textContent = `Город: ${user.city}`;
  
  // Email
  const email = document.createElement('p');
  email.className = 'email';
  email.textContent = user.email;
  
  // Кнопка удаления
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '×';
  deleteBtn.addEventListener('click', () => card.remove());
  
  // Собираем карточку
  card.append(avatar, name, age, city, email, deleteBtn);
  
  return card;
}

// Функция загрузки пользователей
function loadUsers() {
  // Генерируем случайных пользователей
  const names = ['Анна', 'Иван', 'Мария', 'Пётр', 'Елена', 'Дмитрий', 'Ольга', 'Сергей'];
  const cities = ['Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск', 'Екатеринбург'];
  
  const users = Array.from({ length: 8 }, (_, i) => ({
    name: names[i % names.length],
    age: 20 + Math.floor(Math.random() * 30),
    city: cities[Math.floor(Math.random() * cities.length)],
    email: `user${i + 1}@example.com`
  }));
  
  // Очищаем контейнер
  cardsContainer.innerHTML = '';
  
  // Создаём карточки через DocumentFragment (оптимизация)
  const fragment = document.createDocumentFragment();
  users.forEach(user => {
    const card = createUserCard(user);
    fragment.appendChild(card);
  });
  
  cardsContainer.appendChild(fragment);
}

// Обработчик кнопки
loadUsersBtn.addEventListener('click', loadUsers);

// Загружаем при старте
loadUsers();
```

---

## Что вы изучили

✅ **Создание элементов:**
- `document.createElement()`
- Настройка свойств элемента

✅ **Добавление в DOM:**
- `appendChild()`, `append()`, `prepend()`

✅ **Удаление:**
- `element.remove()`

✅ **Оптимизация:**
- `DocumentFragment` для множества элементов

✅ **Практические паттерны:**
- Генераторы элементов из данных
- Обработчики событий на динамических элементах

---

## Задания для самопроверки

1. Добавьте к галерее возможность изменения подписи
2. В списке покупок реализуйте кнопку "Удалить все"
3. В карточках пользователей добавьте фильтр по городу
4. Создайте динамическую таблицу с данными

**Готовы продолжить? Переходите к следующему уроку!** 🚀
