# Практика: Взаимодействие со страницей (DOM)

## Введение

В этом практическом уроке вы создадите **интерактивную страницу**, которая демонстрирует все основные операции с DOM:
- Поиск элементов
- Изменение текста и HTML
- Манипуляция стилями
- Управление классами

**Время выполнения:** 20-30 минут  
**Сложность:** Начинающий

---

## Что мы будем делать

Создадим страницу с:
1. **Заголовком**, который меняется при загрузке
2. **Абзацем**, у которого меняется цвет
3. **Кнопкой**, которая переключает класс у абзаца (показать/скрыть)
4. **Полем ввода**, которое обновляет текст в реальном времени
5. **Счётчиком кликов**

---

## Шаг 1: Создайте HTML-файл

Создайте файл `dom-practice.html` и скопируйте код:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DOM Практика</title>
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
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    h1 {
      color: #333;
      margin-bottom: 10px;
      font-size: 2rem;
    }

    .subtitle {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 30px;
    }

    .section {
      margin-bottom: 25px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 10px;
      border-left: 4px solid #667eea;
    }

    .section h2 {
      color: #667eea;
      font-size: 1.2rem;
      margin-bottom: 10px;
    }

    .text {
      color: #333;
      line-height: 1.6;
      margin-bottom: 10px;
    }

    /* Класс для подсветки */
    .highlight {
      background: #ffd700;
      padding: 5px 10px;
      border-radius: 5px;
      font-weight: bold;
      transition: all 0.3s ease;
    }

    /* Класс для скрытия */
    .hidden {
      display: none;
    }

    /* Класс для изменения цвета */
    .blue-text {
      color: #0066cc;
      font-weight: bold;
    }

    button {
      background: #667eea;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 600;
      transition: all 0.3s ease;
      margin: 5px;
    }

    button:hover {
      background: #5568d3;
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    button:active {
      transform: translateY(0);
    }

    input[type="text"] {
      width: 100%;
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      margin-bottom: 10px;
      transition: border 0.3s ease;
    }

    input[type="text"]:focus {
      outline: none;
      border-color: #667eea;
    }

    .output {
      padding: 15px;
      background: white;
      border-radius: 8px;
      margin-top: 10px;
      min-height: 50px;
      border: 2px dashed #ddd;
    }

    .counter {
      font-size: 3rem;
      font-weight: bold;
      color: #667eea;
      text-align: center;
      margin: 20px 0;
    }

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
    <!-- Заголовок (будет изменён через JS) -->
    <h1 id="main-title">Старый заголовок</h1>
    <p class="subtitle">Этот текст появится при загрузке страницы</p>

    <!-- Секция 1: Изменение текста и цвета -->
    <div class="section">
      <h2>Секция 1: Изменение текста</h2>
      <p id="paragraph" class="text">
        Это обычный абзац. Нажмите кнопки ниже, чтобы изменить его.
      </p>
      <button id="btn-change-text">Изменить текст</button>
      <button id="btn-toggle-color">Переключить цвет</button>
    </div>

    <!-- Секция 2: Показать/Скрыть -->
    <div class="section">
      <h2>Секция 2: Показать/Скрыть элемент</h2>
      <p id="toggle-text" class="text">
        Этот текст можно скрыть и показать снова!
      </p>
      <button id="btn-toggle">Переключить видимость</button>
    </div>

    <!-- Секция 3: Интерактивный ввод -->
    <div class="section">
      <h2>Секция 3: Динамическое обновление</h2>
      <input 
        type="text" 
        id="name-input" 
        placeholder="Введите своё имя..."
      >
      <div class="output">
        <p id="greeting">Здесь появится приветствие...</p>
      </div>
    </div>

    <!-- Секция 4: Счётчик кликов -->
    <div class="section">
      <h2>Секция 4: Счётчик</h2>
      <div class="counter" id="counter">0</div>
      <button id="btn-increment">Увеличить (+1)</button>
      <button id="btn-reset">Сбросить</button>
    </div>

    <!-- Информация -->
    <div class="info">
      <strong>💡 Совет:</strong> Откройте консоль разработчика (F12) 
      и посмотрите, как изменяются элементы при взаимодействии!
    </div>
  </div>

  <!-- JavaScript -->
  <script>
    // ============================================
    // Секция 1: Поиск элементов
    // ============================================
    
    // Находим элементы по ID
    const mainTitle = document.getElementById('main-title');
    const paragraph = document.getElementById('paragraph');
    const toggleText = document.getElementById('toggle-text');
    const nameInput = document.getElementById('name-input');
    const greeting = document.getElementById('greeting');
    const counterDisplay = document.getElementById('counter');

    // Находим кнопки
    const btnChangeText = document.getElementById('btn-change-text');
    const btnToggleColor = document.getElementById('btn-toggle-color');
    const btnToggle = document.getElementById('btn-toggle');
    const btnIncrement = document.getElementById('btn-increment');
    const btnReset = document.getElementById('btn-reset');


    // ============================================
    // Секция 2: Изменение контента при загрузке
    // ============================================
    
    // Меняем заголовок при загрузке страницы
    mainTitle.textContent = '🎉 Добро пожаловать в DOM!';
    
    // Меняем подзаголовок
    document.querySelector('.subtitle').textContent = 
      'Эта страница была изменена с помощью JavaScript!';


    // ============================================
    // Секция 3: Изменение текста по клику
    // ============================================
    
    btnChangeText.addEventListener('click', function() {
      paragraph.textContent = 
        '✅ Текст изменён! Это было сделано через textContent.';
    });


    // ============================================
    // Секция 4: Переключение класса (цвет)
    // ============================================
    
    btnToggleColor.addEventListener('click', function() {
      // Переключаем класс .blue-text
      paragraph.classList.toggle('blue-text');
      
      // Проверяем, есть ли класс
      if (paragraph.classList.contains('blue-text')) {
        console.log('Класс .blue-text добавлен');
      } else {
        console.log('Класс .blue-text удалён');
      }
    });


    // ============================================
    // Секция 5: Показать/Скрыть элемент
    // ============================================
    
    btnToggle.addEventListener('click', function() {
      // Переключаем класс .hidden
      toggleText.classList.toggle('hidden');
      
      // Меняем текст кнопки в зависимости от состояния
      if (toggleText.classList.contains('hidden')) {
        btnToggle.textContent = 'Показать текст';
      } else {
        btnToggle.textContent = 'Скрыть текст';
      }
    });


    // ============================================
    // Секция 6: Динамическое обновление ввода
    // ============================================
    
    nameInput.addEventListener('input', function() {
      // Получаем значение из поля ввода
      const name = nameInput.value;
      
      // Если поле пустое, показываем сообщение по умолчанию
      if (name.trim() === '') {
        greeting.textContent = 'Здесь появится приветствие...';
        greeting.classList.remove('highlight');
      } else {
        // Иначе показываем приветствие с именем
        greeting.textContent = `👋 Привет, ${name}!`;
        greeting.classList.add('highlight');
      }
    });


    // ============================================
    // Секция 7: Счётчик кликов
    // ============================================
    
    let count = 0; // Переменная для хранения счётчика

    btnIncrement.addEventListener('click', function() {
      count++; // Увеличиваем на 1
      counterDisplay.textContent = count; // Обновляем отображение
      
      // Добавляем анимацию через временное изменение стиля
      counterDisplay.style.transform = 'scale(1.2)';
      setTimeout(() => {
        counterDisplay.style.transform = 'scale(1)';
      }, 200);
    });

    btnReset.addEventListener('click', function() {
      count = 0; // Сбрасываем счётчик
      counterDisplay.textContent = count; // Обновляем отображение
    });


    // ============================================
    // Дополнительно: Вывод в консоль
    // ============================================
    
    console.log('🚀 Страница загружена!');
    console.log('Заголовок:', mainTitle.textContent);
    console.log('Параграф:', paragraph.textContent);
  </script>
</body>
</html>
```

---

## Шаг 2: Откройте файл в браузере

1. Сохраните файл как `dom-practice.html`
2. Откройте его в браузере (двойной клик по файлу)
3. Откройте консоль разработчика (F12 или Ctrl+Shift+I)

---

## Шаг 3: Разбор кода

### 🔍 Поиск элементов (строки 167-180)

```javascript
const mainTitle = document.getElementById('main-title');
const paragraph = document.getElementById('paragraph');
const nameInput = document.getElementById('name-input');
```

**Что происходит:**
- `getElementById()` ищет элемент по уникальному ID
- Сохраняем ссылку на элемент в переменную
- Теперь можем работать с этим элементом через переменную

---

### 📝 Изменение контента при загрузке (строки 187-192)

```javascript
mainTitle.textContent = '🎉 Добро пожаловать в DOM!';
```

**Что происходит:**
- Используем `textContent` для изменения текста
- Выполняется сразу при загрузке страницы
- Безопасный способ (HTML-теги интерпретируются как текст)

---

### 🎨 Переключение класса (строки 208-218)

```javascript
btnToggleColor.addEventListener('click', function() {
  paragraph.classList.toggle('blue-text');
  
  if (paragraph.classList.contains('blue-text')) {
    console.log('Класс добавлен');
  }
});
```

**Что происходит:**
1. `addEventListener('click', ...)` — слушаем клик по кнопке
2. `classList.toggle('blue-text')` — добавляет класс, если его нет, удаляет, если есть
3. `classList.contains('blue-text')` — проверяет наличие класса
4. Класс `.blue-text` определён в CSS (строка 90)

---

### 👁️ Показать/Скрыть (строки 225-236)

```javascript
btnToggle.addEventListener('click', function() {
  toggleText.classList.toggle('hidden');
  
  if (toggleText.classList.contains('hidden')) {
    btnToggle.textContent = 'Показать текст';
  } else {
    btnToggle.textContent = 'Скрыть текст';
  }
});
```

**Что происходит:**
1. Переключаем класс `.hidden` (в CSS: `display: none`)
2. Проверяем, скрыт ли элемент
3. Меняем текст кнопки в зависимости от состояния

---

### ⌨️ Динамическое обновление (строки 243-256)

```javascript
nameInput.addEventListener('input', function() {
  const name = nameInput.value;
  
  if (name.trim() === '') {
    greeting.textContent = 'Здесь появится приветствие...';
  } else {
    greeting.textContent = `👋 Привет, ${name}!`;
    greeting.classList.add('highlight');
  }
});
```

**Что происходит:**
1. `addEventListener('input', ...)` — срабатывает при каждом изменении в поле ввода
2. `nameInput.value` — получаем текущее значение поля
3. `name.trim() === ''` — проверяем, не пустое ли поле (trim удаляет пробелы)
4. Используем **шаблонные строки** (\`...\${name}...\`) для вставки имени
5. Добавляем класс `.highlight` для подсветки

---

### 🔢 Счётчик (строки 263-278)

```javascript
let count = 0;

btnIncrement.addEventListener('click', function() {
  count++;
  counterDisplay.textContent = count;
  
  // Анимация
  counterDisplay.style.transform = 'scale(1.2)';
  setTimeout(() => {
    counterDisplay.style.transform = 'scale(1)';
  }, 200);
});
```

**Что происходит:**
1. Переменная `count` хранит текущее значение счётчика
2. `count++` увеличивает значение на 1
3. Обновляем отображение через `textContent`
4. Добавляем временную анимацию через `style.transform`
5. `setTimeout()` возвращает масштаб через 200 мс

---

## Задания для самостоятельной работы

### Задание 1: Добавьте кнопку "Уменьшить" для счётчика

**Подсказка:**
```javascript
btnDecrement.addEventListener('click', function() {
  count--;
  counterDisplay.textContent = count;
});
```

---

### Задание 2: Измените цвет фона при клике

Добавьте кнопку, которая меняет цвет фона `body`:

```javascript
const btnChangeBg = document.getElementById('btn-change-bg');

btnChangeBg.addEventListener('click', function() {
  document.body.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
});
```

---

### Задание 3: Добавьте валидацию для имени

Проверяйте, чтобы имя содержало только буквы:

```javascript
nameInput.addEventListener('input', function() {
  const name = nameInput.value;
  
  // Проверка на буквы (регулярное выражение)
  const isValid = /^[a-zA-Zа-яА-ЯёЁ\s]*$/.test(name);
  
  if (!isValid) {
    nameInput.style.borderColor = 'red';
    greeting.textContent = '❌ Используйте только буквы!';
  } else {
    nameInput.style.borderColor = '#667eea';
    greeting.textContent = `👋 Привет, ${name}!`;
  }
});
```

---

### Задание 4: Создайте список задач

Добавьте:
- Поле ввода для новой задачи
- Кнопку "Добавить"
- При клике — добавляйте задачу в список (`<ul>`)

**Подсказка (создание нового элемента):**
```javascript
const li = document.createElement('li');
li.textContent = taskInput.value;
taskList.appendChild(li);
```

---

## Итоги практики

### Что вы сделали:

✅ Нашли элементы с помощью `getElementById()`  
✅ Изменили текст через `textContent`  
✅ Управляли классами через `classList.add()`, `.remove()`, `.toggle()`  
✅ Получили значение поля ввода через `input.value`  
✅ Создали интерактивные элементы с обработчиками событий  
✅ Применили стили через CSS-классы (лучшая практика)  

---

## Что дальше?

В следующих уроках вы изучите:
- **События** — разные типы событий (hover, keypress, submit)
- **Создание и удаление элементов** — динамическое добавление контента
- **Работа с формами** — валидация, отправка данных
- **Делегирование событий** — оптимизация для больших списков

---

## Дополнительные ресурсы

- [MDN: Введение в DOM](https://developer.mozilla.org/ru/docs/Web/API/Document_Object_Model/Introduction)
- [MDN: Document.querySelector()](https://developer.mozilla.org/ru/docs/Web/API/Document/querySelector)
- [MDN: Element.classList](https://developer.mozilla.org/ru/docs/Web/API/Element/classList)

**Удачи в изучении JavaScript! 🚀**
