# Практика: Асинхронность в JavaScript

## Введение

В этом уроке вы создадите **приложение для загрузки постов** с таймером, имитацией API запросов и обработкой ошибок.

**Проекты:**
1. Таймер с прогрессом
2. Загрузчик постов с пагинацией
3. Гонка промисов (Promise.race)

**Время выполнения:** 40-50 минут  
**Сложность:** Средний

---

## Проект 1: Таймер обратного отсчёта

### HTML

Создайте файл `timer.html`:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Таймер обратного отсчёта</title>
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
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      text-align: center;
    }

    h1 {
      color: #667eea;
      margin-bottom: 30px;
    }

    .timer-display {
      font-size: 4rem;
      font-weight: bold;
      color: #333;
      margin: 30px 0;
      font-family: 'Courier New', monospace;
    }

    .progress-bar {
      width: 100%;
      height: 20px;
      background: #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 30px;
    }

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      width: 0%;
      transition: width 1s linear;
    }

    .controls {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .controls input {
      flex: 1;
      padding: 15px;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      font-size: 1.1rem;
      text-align: center;
    }

    .buttons {
      display: flex;
      gap: 10px;
    }

    .buttons button {
      flex: 1;
      padding: 15px;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-start {
      background: #28a745;
      color: white;
    }

    .btn-start:hover {
      background: #218838;
    }

    .btn-pause {
      background: #ffc107;
      color: white;
    }

    .btn-pause:hover {
      background: #e0a800;
    }

    .btn-reset {
      background: #dc3545;
      color: white;
    }

    .btn-reset:hover {
      background: #c82333;
    }

    .btn-start:disabled,
    .btn-pause:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .alarm {
      font-size: 2rem;
      color: #dc3545;
      margin-top: 20px;
      opacity: 0;
      transition: opacity 0.3s;
    }

    .alarm.show {
      opacity: 1;
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>⏰ Таймер обратного отсчёта</h1>
    
    <div class="timer-display" id="timerDisplay">00:00</div>
    
    <div class="progress-bar">
      <div class="progress-bar-fill" id="progressBarFill"></div>
    </div>
    
    <div class="controls">
      <input type="number" id="minutesInput" placeholder="Минуты" min="0" max="60" value="1">
      <input type="number" id="secondsInput" placeholder="Секунды" min="0" max="59" value="30">
    </div>
    
    <div class="buttons">
      <button class="btn-start" id="startBtn">Старт</button>
      <button class="btn-pause" id="pauseBtn" disabled>Пауза</button>
      <button class="btn-reset" id="resetBtn">Сброс</button>
    </div>
    
    <div class="alarm" id="alarm">🔔 Время вышло!</div>
  </div>

  <script src="timer.js"></script>
</body>
</html>
```

### JavaScript

Создайте файл `timer.js`:

```javascript
// Элементы
const timerDisplay = document.getElementById('timerDisplay');
const progressBarFill = document.getElementById('progressBarFill');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const alarm = document.getElementById('alarm');

// Состояние
let totalSeconds = 0;
let remainingSeconds = 0;
let intervalId = null;
let isPaused = false;

// Функция форматирования времени
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Функция обновления отображения
function updateDisplay() {
  timerDisplay.textContent = formatTime(remainingSeconds);
  
  // Обновление прогресс-бара
  const progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  progressBarFill.style.width = `${progress}%`;
}

// Функция запуска таймера
function startTimer() {
  if (intervalId !== null) return;
  
  // Получаем значения из инпутов (только при первом запуске)
  if (remainingSeconds === 0) {
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    totalSeconds = minutes * 60 + seconds;
    remainingSeconds = totalSeconds;
    
    if (totalSeconds === 0) {
      alert('Установите время!');
      return;
    }
  }
  
  // Отключаем инпуты
  minutesInput.disabled = true;
  secondsInput.disabled = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  alarm.classList.remove('show');
  
  // Запускаем интервал
  intervalId = setInterval(() => {
    remainingSeconds--;
    updateDisplay();
    
    if (remainingSeconds === 0) {
      stopTimer();
      alarm.classList.add('show');
      
      // Звуковое уведомление (если поддерживается)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('⏰ Таймер', {
          body: 'Время вышло!',
          icon: '⏰'
        });
      }
    }
  }, 1000);
  
  isPaused = false;
}

// Функция паузы таймера
function pauseTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
    isPaused = true;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  }
}

// Функция остановки таймера
function stopTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
  
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

// Функция сброса таймера
function resetTimer() {
  stopTimer();
  remainingSeconds = 0;
  totalSeconds = 0;
  updateDisplay();
  progressBarFill.style.width = '0%';
  minutesInput.disabled = false;
  secondsInput.disabled = false;
  alarm.classList.remove('show');
  isPaused = false;
}

// Обработчики
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Запрос разрешения на уведомления
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

// Инициализация
updateDisplay();
```

---

## Проект 2: Загрузчик постов

### HTML

Создайте файл `posts-loader.html`:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Загрузчик постов</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #f5f5f5;
      padding: 20px;
    }

    .container {
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      color: #667eea;
      margin-bottom: 30px;
      text-align: center;
    }

    .controls {
      background: white;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 20px;
      display: flex;
      gap: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .controls button {
      flex: 1;
      padding: 15px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-load {
      background: #667eea;
      color: white;
    }

    .btn-load:hover {
      background: #764ba2;
    }

    .btn-load:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .btn-clear {
      background: #dc3545;
      color: white;
    }

    .btn-clear:hover {
      background: #c82333;
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

    .posts {
      display: grid;
      gap: 20px;
    }

    .post {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      animation: fadeIn 0.3s;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .post-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 15px;
    }

    .post-avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 1.2rem;
    }

    .post-info h3 {
      color: #333;
      margin-bottom: 5px;
    }

    .post-info .post-date {
      color: #999;
      font-size: 0.9rem;
    }

    .post-content {
      color: #555;
      line-height: 1.6;
    }

    .error {
      background: #fff3cd;
      border: 1px solid #ffc107;
      color: #856404;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 20px;
      display: none;
    }

    .error.show {
      display: block;
    }

    .pagination {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 30px;
    }

    .pagination button {
      padding: 10px 20px;
      border: 2px solid #667eea;
      background: white;
      color: #667eea;
      border-radius: 8px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s;
    }

    .pagination button:hover:not(:disabled) {
      background: #667eea;
      color: white;
    }

    .pagination button:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .pagination .page-info {
      padding: 10px 20px;
      display: flex;
      align-items: center;
      font-weight: bold;
      color: #667eea;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📰 Загрузчик постов</h1>
    
    <div class="controls">
      <button class="btn-load" id="loadBtn">Загрузить посты</button>
      <button class="btn-load" id="loadAllBtn">Загрузить все сразу</button>
      <button class="btn-clear" id="clearBtn">Очистить</button>
    </div>
    
    <div class="error" id="error"></div>
    
    <div class="loader" id="loader">
      <div class="spinner"></div>
      <p>Загрузка постов...</p>
    </div>
    
    <div class="posts" id="postsContainer"></div>
    
    <div class="pagination" id="pagination" style="display: none;">
      <button id="prevBtn" disabled>← Назад</button>
      <div class="page-info">
        Страница <span id="currentPage">1</span> из <span id="totalPages">1</span>
      </div>
      <button id="nextBtn">Вперёд →</button>
    </div>
  </div>

  <script src="posts-loader.js"></script>
</body>
</html>
```

### JavaScript

Создайте файл `posts-loader.js`:

```javascript
// Элементы
const loadBtn = document.getElementById('loadBtn');
const loadAllBtn = document.getElementById('loadAllBtn');
const clearBtn = document.getElementById('clearBtn');
const loader = document.getElementById('loader');
const errorEl = document.getElementById('error');
const postsContainer = document.getElementById('postsContainer');
const pagination = document.getElementById('pagination');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const currentPageEl = document.getElementById('currentPage');
const totalPagesEl = document.getElementById('totalPages');

// Состояние
let currentPage = 1;
const postsPerPage = 5;
let allPosts = [];

// Имитация API
function fetchPosts(page) {
  return new Promise((resolve, reject) => {
    // Симуляция задержки сети
    const delay = Math.random() * 2000 + 1000; // 1-3 секунды
    
    setTimeout(() => {
      // Симуляция ошибки (10% вероятность)
      if (Math.random() < 0.1) {
        reject(new Error('Ошибка сети. Попробуйте ещё раз.'));
        return;
      }
      
      // Генерация постов
      const posts = [];
      const startId = (page - 1) * postsPerPage + 1;
      
      for (let i = 0; i < postsPerPage; i++) {
        const id = startId + i;
        posts.push({
          id,
          title: `Пост №${id}`,
          content: `Это содержимое поста номер ${id}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
          author: `Автор ${Math.ceil(id / 3)}`,
          date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')
        });
      }
      
      resolve({
        posts,
        totalPages: 10,
        currentPage: page
      });
    }, delay);
  });
}

// Функция отображения постов
function displayPosts(posts) {
  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.className = 'post';
    
    const initials = post.author.split(' ').map(word => word[0]).join('');
    
    postEl.innerHTML = `
      <div class="post-header">
        <div class="post-avatar">${initials}</div>
        <div class="post-info">
          <h3>${post.title}</h3>
          <div class="post-date">${post.author} • ${post.date}</div>
        </div>
      </div>
      <div class="post-content">${post.content}</div>
    `;
    
    postsContainer.appendChild(postEl);
  });
}

// Функция показа ошибки
function showError(message) {
  errorEl.textContent = message;
  errorEl.classList.add('show');
  
  setTimeout(() => {
    errorEl.classList.remove('show');
  }, 5000);
}

// Функция загрузки постов
function loadPosts(page) {
  loader.classList.add('show');
  loadBtn.disabled = true;
  loadAllBtn.disabled = true;
  errorEl.classList.remove('show');
  
  fetchPosts(page)
    .then(data => {
      displayPosts(data.posts);
      allPosts.push(...data.posts);
      
      // Обновление пагинации
      currentPage = data.currentPage;
      currentPageEl.textContent = currentPage;
      totalPagesEl.textContent = data.totalPages;
      
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === data.totalPages;
      
      pagination.style.display = 'flex';
    })
    .catch(error => {
      showError(error.message);
    })
    .finally(() => {
      loader.classList.remove('show');
      loadBtn.disabled = false;
      loadAllBtn.disabled = false;
    });
}

// Функция загрузки всех постов параллельно (Promise.all)
function loadAllPosts() {
  loader.classList.add('show');
  loadBtn.disabled = true;
  loadAllBtn.disabled = true;
  errorEl.classList.remove('show');
  postsContainer.innerHTML = '';
  
  const promises = [];
  for (let i = 1; i <= 3; i++) {
    promises.push(fetchPosts(i));
  }
  
  Promise.all(promises)
    .then(results => {
      results.forEach(data => {
        displayPosts(data.posts);
      });
      pagination.style.display = 'none';
    })
    .catch(error => {
      showError('Не удалось загрузить все посты: ' + error.message);
    })
    .finally(() => {
      loader.classList.remove('show');
      loadBtn.disabled = false;
      loadAllBtn.disabled = false;
    });
}

// Функция очистки
function clearPosts() {
  postsContainer.innerHTML = '';
  allPosts = [];
  currentPage = 1;
  pagination.style.display = 'none';
  errorEl.classList.remove('show');
}

// Обработчики
loadBtn.addEventListener('click', () => loadPosts(currentPage));
loadAllBtn.addEventListener('click', loadAllPosts);
clearBtn.addEventListener('click', clearPosts);
prevBtn.addEventListener('click', () => {
  postsContainer.innerHTML = '';
  loadPosts(currentPage - 1);
});
nextBtn.addEventListener('click', () => {
  postsContainer.innerHTML = '';
  loadPosts(currentPage + 1);
});
```

---

## Проект 3: Гонка промисов (Promise.race)

Создайте файл `promise-race-demo.html`:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Promise.race Demo</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
    }
    
    .server {
      padding: 20px;
      margin: 10px 0;
      border: 2px solid #ddd;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .server.winner {
      border-color: #28a745;
      background: #d4edda;
    }
    
    button {
      padding: 15px 30px;
      font-size: 1.1rem;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      margin: 20px 0;
    }
    
    button:hover {
      background: #0056b3;
    }
    
    .result {
      margin-top: 20px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      display: none;
    }
    
    .result.show {
      display: block;
    }
  </style>
</head>
<body>
  <h1>🏁 Гонка серверов (Promise.race)</h1>
  <p>Запросим данные с трёх серверов. Используем ответ самого быстрого!</p>
  
  <div class="server" id="server1">
    <span>Сервер 1 (Быстрый)</span>
    <span class="time">~1 сек</span>
  </div>
  
  <div class="server" id="server2">
    <span>Сервер 2 (Средний)</span>
    <span class="time">~2 сек</span>
  </div>
  
  <div class="server" id="server3">
    <span>Сервер 3 (Медленный)</span>
    <span class="time">~3 сек</span>
  </div>
  
  <button onclick="startRace()">Начать гонку</button>
  
  <div class="result" id="result"></div>
  
  <script>
    function fetchFromServer(serverName, delay) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ serverName, delay, data: `Данные с ${serverName}` });
        }, delay);
      });
    }
    
    function startRace() {
      // Сброс
      document.querySelectorAll('.server').forEach(s => s.classList.remove('winner'));
      document.getElementById('result').classList.remove('show');
      
      const server1 = fetchFromServer('Сервер 1', 1000);
      const server2 = fetchFromServer('Сервер 2', 2000);
      const server3 = fetchFromServer('Сервер 3', 3000);
      
      Promise.race([server1, server2, server3])
        .then(winner => {
          console.log('Победитель:', winner);
          
          // Подсветка победителя
          if (winner.serverName === 'Сервер 1') {
            document.getElementById('server1').classList.add('winner');
          } else if (winner.serverName === 'Сервер 2') {
            document.getElementById('server2').classList.add('winner');
          } else {
            document.getElementById('server3').classList.add('winner');
          }
          
          // Показ результата
          const resultEl = document.getElementById('result');
          resultEl.innerHTML = `
            <h3>🏆 Победитель: ${winner.serverName}</h3>
            <p>Время ответа: ${winner.delay}ms</p>
            <p>Данные: ${winner.data}</p>
          `;
          resultEl.classList.add('show');
        });
    }
  </script>
</body>
</html>
```

---

## Задания для улучшения

### Таймер:
1. Добавьте возможность установки будильника (выбор времени)
2. Реализуйте несколько предустановок (5 мин, 10 мин, 25 мин - Pomodoro)
3. Добавьте звуковой сигнал при окончании

### Загрузчик постов:
1. Реализуйте `Promise.allSettled()` для обработки частичных ошибок
2. Добавьте кэширование загруженных постов
3. Реализуйте retry механизм при ошибке (3 попытки)
4. Добавьте фильтрацию постов по автору

### Promise.race:
1. Добавьте таймаут для всех запросов (отклонение через 5 секунд)
2. Реализуйте визуализацию прогресса каждого сервера
3. Используйте `Promise.any()` для получения первого успешного ответа

**Отличная работа! Переходите к следующему уроку.** 🚀
