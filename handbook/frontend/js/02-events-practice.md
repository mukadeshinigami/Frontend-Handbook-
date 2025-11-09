# Практика: Реакция на действия (События)

## Введение

В этом практическом уроке вы создадите **интерактивную страницу** с различными типами событий:
- Клик мыши
- Наведение курсора
- Нажатие клавиш
- Отправка формы
- Динамическое обновление

**Время выполнения:** 30-40 минут  
**Сложность:** Начинающий

---

## Что мы будем делать

Создадим страницу с:
1. **Кнопкой**, которая меняет цвет при клике
2. **Карточкой**, которая реагирует на наведение мыши
3. **Полем ввода**, которое отслеживает нажатия клавиш
4. **Формой** с валидацией и отменой отправки
5. **Счётчиком кликов** с кнопкой сброса

---

## Шаг 1: Создайте HTML-файл

Создайте файл `events-practice.html` и скопируйте код:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>События - Практика</title>
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
      max-width: 800px;
      margin: 0 auto;
    }

    h1 {
      color: white;
      text-align: center;
      margin-bottom: 40px;
      font-size: 2.5rem;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .section {
      background: white;
      border-radius: 12px;
      padding: 30px;
      margin-bottom: 20px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    }

    .section h2 {
      color: #667eea;
      font-size: 1.5rem;
      margin-bottom: 20px;
    }

    /* Секция 1: Кнопка с изменением цвета */
    .color-button {
      background: #667eea;
      color: white;
      border: none;
      padding: 15px 30px;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: block;
      margin: 0 auto;
    }

    .color-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }

    .color-button:active {
      transform: translateY(0);
    }

    /* Секция 2: Карточка с наведением */
    .hover-card {
      background: #f8f9fa;
      padding: 30px;
      border-radius: 8px;
      border: 2px dashed #ddd;
      text-align: center;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .hover-card.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
      transform: scale(1.05);
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    /* Секция 3: Отслеживание клавиш */
    .key-input {
      width: 100%;
      padding: 15px;
      font-size: 1.1rem;
      border: 2px solid #ddd;
      border-radius: 8px;
      transition: border 0.3s ease;
    }

    .key-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .key-display {
      margin-top: 15px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      text-align: center;
      font-size: 1.2rem;
      font-weight: bold;
      color: #667eea;
      min-height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Секция 4: Форма */
    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    label {
      font-weight: 600;
      color: #333;
    }

    input[type="text"],
    input[type="email"] {
      width: 100%;
      padding: 12px;
      font-size: 1rem;
      border: 2px solid #ddd;
      border-radius: 8px;
      transition: border 0.3s ease;
    }

    input[type="text"]:focus,
    input[type="email"]:focus {
      outline: none;
      border-color: #667eea;
    }

    .submit-button {
      background: #667eea;
      color: white;
      border: none;
      padding: 15px;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-button:hover {
      background: #5568d3;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.9rem;
      display: none;
      margin-top: 5px;
    }

    .success-message {
      background: #d4edda;
      color: #155724;
      padding: 15px;
      border-radius: 8px;
      display: none;
      margin-top: 15px;
      border: 1px solid #c3e6cb;
    }

    /* Секция 5: Счётчик */
    .counter-display {
      font-size: 4rem;
      font-weight: bold;
      color: #667eea;
      text-align: center;
      margin: 20px 0;
    }

    .counter-buttons {
      display: flex;
      gap: 10px;
    }

    .counter-buttons button {
      flex: 1;
      background: #667eea;
      color: white;
      border: none;
      padding: 15px;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .counter-buttons button:hover {
      background: #5568d3;
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
    <h1>🎯 Практика: События</h1>

    <!-- Секция 1: Клик по кнопке -->
    <div class="section">
      <h2>Секция 1: Клик по кнопке</h2>
      <p>Нажмите на кнопку, чтобы изменить её цвет!</p>
      <button class="color-button" id="colorButton">Нажми меня!</button>
    </div>

    <!-- Секция 2: Наведение мыши -->
    <div class="section">
      <h2>Секция 2: Наведение мыши</h2>
      <p>Наведите курсор на карточку:</p>
      <div class="hover-card" id="hoverCard">
        Наведи на меня курсор! 🖱️
      </div>
    </div>

    <!-- Секция 3: Отслеживание клавиш -->
    <div class="section">
      <h2>Секция 3: Нажатие клавиш</h2>
      <p>Нажимайте клавиши на клавиатуре:</p>
      <input 
        type="text" 
        class="key-input" 
        id="keyInput" 
        placeholder="Нажмите любую клавишу..."
      >
      <div class="key-display" id="keyDisplay">
        Нажмите клавишу...
      </div>
    </div>

    <!-- Секция 4: Валидация формы -->
    <div class="section">
      <h2>Секция 4: Отправка формы</h2>
      <form id="userForm">
        <label for="username">Имя:</label>
        <input 
          type="text" 
          id="username" 
          placeholder="Введите ваше имя"
          required
        >
        <span class="error-message" id="nameError">Имя обязательно!</span>

        <label for="email">Email:</label>
        <input 
          type="email" 
          id="email" 
          placeholder="example@mail.com"
          required
        >
        <span class="error-message" id="emailError">Email должен содержать @</span>

        <button type="submit" class="submit-button">Отправить</button>
      </form>
      <div class="success-message" id="successMessage">
        ✅ Форма успешно отправлена!
      </div>
    </div>

    <!-- Секция 5: Счётчик кликов -->
    <div class="section">
      <h2>Секция 5: Счётчик кликов</h2>
      <div class="counter-display" id="counterDisplay">0</div>
      <div class="counter-buttons">
        <button id="incrementButton">Увеличить (+1)</button>
        <button id="resetButton">Сбросить</button>
      </div>
    </div>

    <!-- Информация -->
    <div class="info">
      <strong>💡 Совет:</strong> Откройте консоль разработчика (F12) 
      и посмотрите логи событий!
    </div>
  </div>

  <!-- JavaScript -->
  <script>
    // ============================================
    // Секция 1: Клик по кнопке (изменение цвета)
    // ============================================

    const colorButton = document.getElementById('colorButton');
    const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
    let colorIndex = 0;

    colorButton.addEventListener('click', function() {
      colorIndex = (colorIndex + 1) % colors.length;
      colorButton.style.backgroundColor = colors[colorIndex];
      console.log('Кнопка нажата! Новый цвет:', colors[colorIndex]);
    });


    // ============================================
    // Секция 2: Наведение мыши
    // ============================================

    const hoverCard = document.getElementById('hoverCard');

    hoverCard.addEventListener('mouseenter', function() {
      hoverCard.classList.add('active');
      console.log('Курсор наведён на карточку');
    });

    hoverCard.addEventListener('mouseleave', function() {
      hoverCard.classList.remove('active');
      console.log('Курсор ушёл с карточки');
    });


    // ============================================
    // Секция 3: Отслеживание клавиш
    // ============================================

    const keyInput = document.getElementById('keyInput');
    const keyDisplay = document.getElementById('keyDisplay');

    keyInput.addEventListener('keydown', function(event) {
      keyDisplay.textContent = `Нажата клавиша: "${event.key}" (код: ${event.code})`;
      console.log('Клавиша:', event.key, 'Код:', event.code);

      // Специальная реакция на Enter
      if (event.key === 'Enter') {
        keyDisplay.textContent = '✅ Нажат Enter!';
        keyDisplay.style.backgroundColor = '#d4edda';
        setTimeout(() => {
          keyDisplay.style.backgroundColor = '#f8f9fa';
        }, 500);
      }
    });


    // ============================================
    // Секция 4: Валидация и отправка формы
    // ============================================

    const userForm = document.getElementById('userForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const successMessage = document.getElementById('successMessage');

    userForm.addEventListener('submit', function(event) {
      event.preventDefault(); // отменяем стандартную отправку

      // Сбрасываем предыдущие ошибки
      nameError.style.display = 'none';
      emailError.style.display = 'none';
      successMessage.style.display = 'none';

      let isValid = true;

      // Валидация имени
      if (usernameInput.value.trim() === '') {
        nameError.style.display = 'block';
        isValid = false;
      }

      // Валидация email
      if (!emailInput.value.includes('@')) {
        emailError.style.display = 'block';
        isValid = false;
      }

      // Если всё валидно — показываем успех
      if (isValid) {
        successMessage.style.display = 'block';
        console.log('Форма отправлена!', {
          name: usernameInput.value,
          email: emailInput.value
        });

        // Очищаем форму через 2 секунды
        setTimeout(() => {
          userForm.reset();
          successMessage.style.display = 'none';
        }, 2000);
      }
    });


    // ============================================
    // Секция 5: Счётчик кликов
    // ============================================

    const counterDisplay = document.getElementById('counterDisplay');
    const incrementButton = document.getElementById('incrementButton');
    const resetButton = document.getElementById('resetButton');

    let count = 0;

    incrementButton.addEventListener('click', function() {
      count++;
      counterDisplay.textContent = count;
      console.log('Счётчик увеличен:', count);

      // Анимация
      counterDisplay.style.transform = 'scale(1.2)';
      setTimeout(() => {
        counterDisplay.style.transform = 'scale(1)';
      }, 200);
    });

    resetButton.addEventListener('click', function() {
      count = 0;
      counterDisplay.textContent = count;
      console.log('Счётчик сброшен');
    });


    // ============================================
    // Дополнительно: Логирование загрузки
    // ============================================

    console.log('🚀 Страница загружена! События готовы к использованию.');
  </script>
</body>
</html>
```

---

## Шаг 2: Откройте файл в браузере

1. Сохраните файл как `events-practice.html`
2. Откройте его в браузере (двойной клик или через локальный сервер)
3. Откройте консоль разработчика (F12 или Ctrl+Shift+I)

---

## Шаг 3: Разбор кода

### 🎨 Секция 1: Клик по кнопке (строки 227-235)

```javascript
const colorButton = document.getElementById('colorButton');
const colors = ['#667eea', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
let colorIndex = 0;

colorButton.addEventListener('click', function() {
  colorIndex = (colorIndex + 1) % colors.length;
  colorButton.style.backgroundColor = colors[colorIndex];
  console.log('Кнопка нажата! Новый цвет:', colors[colorIndex]);
});
```

**Что происходит:**
- `addEventListener('click', ...)` — слушаем клик по кнопке
- `(colorIndex + 1) % colors.length` — циклически переключаем индекс цвета
- `style.backgroundColor` — меняем цвет фона кнопки
- `console.log()` — логируем событие в консоль

---

### 🖱️ Секция 2: Наведение мыши (строки 242-251)

```javascript
const hoverCard = document.getElementById('hoverCard');

hoverCard.addEventListener('mouseenter', function() {
  hoverCard.classList.add('active');
  console.log('Курсор наведён на карточку');
});

hoverCard.addEventListener('mouseleave', function() {
  hoverCard.classList.remove('active');
  console.log('Курсор ушёл с карточки');
});
```

**Что происходит:**
- `mouseenter` — событие наведения курсора
- `mouseleave` — событие ухода курсора
- `classList.add('active')` — добавляем класс для стилизации
- CSS-переход делает анимацию плавной

---

### ⌨️ Секция 3: Отслеживание клавиш (строки 258-272)

```javascript
keyInput.addEventListener('keydown', function(event) {
  keyDisplay.textContent = `Нажата клавиша: "${event.key}" (код: ${event.code})`;
  console.log('Клавиша:', event.key, 'Код:', event.code);

  if (event.key === 'Enter') {
    keyDisplay.textContent = '✅ Нажат Enter!';
    keyDisplay.style.backgroundColor = '#d4edda';
    setTimeout(() => {
      keyDisplay.style.backgroundColor = '#f8f9fa';
    }, 500);
  }
});
```

**Что происходит:**
- `keydown` — событие нажатия клавиши
- `event.key` — название клавиши (`"a"`, `"Enter"`, `"ArrowUp"`)
- `event.code` — физический код клавиши (`"KeyA"`, `"Enter"`)
- Специальная обработка для клавиши Enter с анимацией

---

### 📝 Секция 4: Валидация формы (строки 279-318)

```javascript
userForm.addEventListener('submit', function(event) {
  event.preventDefault(); // ВАЖНО: отменяем стандартную отправку

  // Сбрасываем предыдущие ошибки
  nameError.style.display = 'none';
  emailError.style.display = 'none';
  successMessage.style.display = 'none';

  let isValid = true;

  // Валидация имени
  if (usernameInput.value.trim() === '') {
    nameError.style.display = 'block';
    isValid = false;
  }

  // Валидация email
  if (!emailInput.value.includes('@')) {
    emailError.style.display = 'block';
    isValid = false;
  }

  // Если всё валидно — показываем успех
  if (isValid) {
    successMessage.style.display = 'block';
    console.log('Форма отправлена!', {
      name: usernameInput.value,
      email: emailInput.value
    });
  }
});
```

**Что происходит:**
1. `event.preventDefault()` — **обязательно!** Отменяем стандартную отправку формы
2. Проверяем, заполнены ли поля
3. Проверяем, содержит ли email символ `@`
4. Показываем сообщения об ошибках или успехе
5. Логируем данные в консоль

---

### 🔢 Секция 5: Счётчик кликов (строки 325-343)

```javascript
let count = 0;

incrementButton.addEventListener('click', function() {
  count++;
  counterDisplay.textContent = count;
  console.log('Счётчик увеличен:', count);

  // Анимация
  counterDisplay.style.transform = 'scale(1.2)';
  setTimeout(() => {
    counterDisplay.style.transform = 'scale(1)';
  }, 200);
});

resetButton.addEventListener('click', function() {
  count = 0;
  counterDisplay.textContent = count;
  console.log('Счётчик сброшен');
});
```

**Что происходит:**
- Переменная `count` хранит текущее значение
- `count++` увеличивает значение на 1
- `setTimeout()` создаёт временную анимацию масштабирования
- Кнопка сброса возвращает счётчик к 0

---

## Задания для самостоятельной работы

### Задание 1: Добавьте двойной клик

Сделайте так, чтобы при двойном клике (`dblclick`) на карточку появлялось сообщение:

```javascript
hoverCard.addEventListener('dblclick', function() {
  alert('Двойной клик!');
});
```

---

### Задание 2: Отслеживание модификаторов клавиш

Добавьте проверку, зажата ли клавиша Ctrl при нажатии:

```javascript
keyInput.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault(); // отменяем Ctrl+S (сохранение)
    console.log('Ctrl+S перехвачено!');
  }
});
```

---

### Задание 3: Счётчик с кнопкой "Уменьшить"

Добавьте кнопку для уменьшения счётчика:

```javascript
const decrementButton = document.getElementById('decrementButton');

decrementButton.addEventListener('click', function() {
  if (count > 0) {
    count--;
    counterDisplay.textContent = count;
  }
});
```

---

### Задание 4: Валидация длины имени

Проверяйте, что имя содержит минимум 3 символа:

```javascript
if (usernameInput.value.trim().length < 3) {
  nameError.textContent = 'Имя должно быть не менее 3 символов!';
  nameError.style.display = 'block';
  isValid = false;
}
```

---

### Задание 5: Отслеживание прокрутки

Добавьте событие прокрутки страницы:

```javascript
window.addEventListener('scroll', function() {
  console.log('Прокрутка:', window.scrollY, 'px');
});
```

---

## Итоги практики

### Что вы сделали:

✅ Обработали **клик** (`click`) по кнопке  
✅ Использовали **наведение мыши** (`mouseenter`, `mouseleave`)  
✅ Отследили **нажатие клавиш** (`keydown`) и получили `event.key`  
✅ Создали **форму с валидацией** и использовали `event.preventDefault()`  
✅ Реализовали **счётчик кликов** с анимацией  
✅ Логировали события в консоль для отладки  

---

## Что дальше?

В следующих уроках вы изучите:
- **Делегирование событий** — эффективная работа с большим количеством элементов
- **Всплытие и погружение событий** — понимание распространения событий
- **Создание собственных событий** — `CustomEvent`
- **Асинхронные события** — `setTimeout`, промисы, `async/await`

---

## Дополнительные ресурсы

- [MDN: Введение в события](https://developer.mozilla.org/ru/docs/Learn/JavaScript/Building_blocks/Events)
- [MDN: addEventListener()](https://developer.mozilla.org/ru/docs/Web/API/EventTarget/addEventListener)
- [MDN: Event reference](https://developer.mozilla.org/ru/docs/Web/Events)

**Отличная работа! 🎉 Вы освоили основы работы с событиями!**
