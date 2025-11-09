# Реакция на действия (События)

## Введение

**События (Events)** — это реакция браузера на действия пользователя или изменения состояния страницы. JavaScript позволяет "слушать" эти события и выполнять код в ответ.

События делают веб-страницы **интерактивными**: клики по кнопкам, наведение мыши, ввод текста, отправка форм — всё это события, на которые можно реагировать.

---

## Что такое событие?

Событие — это любое действие пользователя или браузера:
- Клик мышью
- Наведение курсора
- Нажатие клавиши
- Отправка формы
- Прокрутка страницы
- Загрузка изображения

Браузер **генерирует событие**, а JavaScript **слушает** его и **реагирует**.

---

## Прослушивание событий

### `element.addEventListener('событие', обработчик)`

Это **основной и рекомендуемый** способ работы с событиями.

**Синтаксис:**
```javascript
element.addEventListener('событие', функция-обработчик);
```

**Пример:**
```javascript
const button = document.getElementById('myButton');

button.addEventListener('click', function() {
  console.log('Кнопка нажата!');
});
```

**Что происходит:**
1. Находим элемент `button`
2. Добавляем слушатель события `'click'`
3. Когда пользователь кликает на кнопку, выполняется функция-обработчик

---

### Отдельная функция-обработчик

Для переиспользования и читаемости кода лучше выносить обработчик в отдельную функцию:

```javascript
function handleClick() {
  console.log('Кнопка нажата!');
}

button.addEventListener('click', handleClick);
```

**Важно:** передаём функцию **без скобок** `()` — иначе она выполнится сразу!

```javascript
// ❌ Неправильно — функция выполнится сразу
button.addEventListener('click', handleClick());

// ✅ Правильно — функция выполнится при клике
button.addEventListener('click', handleClick);
```

---

### Удаление обработчика событий

Чтобы удалить обработчик, используйте `removeEventListener()`:

```javascript
button.removeEventListener('click', handleClick);
```

**Важно:** для удаления нужна **ссылка на ту же функцию**, поэтому анонимные функции удалить нельзя.

```javascript
// ❌ Нельзя удалить — нет ссылки на функцию
button.addEventListener('click', function() {
  console.log('Клик');
});

// ✅ Можно удалить — есть ссылка
function handleClick() {
  console.log('Клик');
}
button.addEventListener('click', handleClick);
button.removeEventListener('click', handleClick); // удаление
```

---

## Основные типы событий

### 1. События мыши

| Событие | Описание |
|---------|----------|
| `click` | Клик по элементу |
| `dblclick` | Двойной клик |
| `mouseover` | Курсор наведён на элемент |
| `mouseout` | Курсор ушёл с элемента |
| `mouseenter` | Курсор вошёл в элемент (не всплывает) |
| `mouseleave` | Курсор покинул элемент (не всплывает) |
| `mousemove` | Курсор движется над элементом |
| `mousedown` | Кнопка мыши нажата |
| `mouseup` | Кнопка мыши отпущена |

**Пример:**
```javascript
const box = document.querySelector('.box');

box.addEventListener('mouseover', function() {
  box.style.backgroundColor = 'lightblue';
});

box.addEventListener('mouseout', function() {
  box.style.backgroundColor = 'white';
});
```

---

### 2. События клавиатуры

| Событие | Описание |
|---------|----------|
| `keydown` | Клавиша нажата (срабатывает постоянно при удержании) |
| `keyup` | Клавиша отпущена |
| `keypress` | Клавиша нажата (устарело, не используйте) |

**Пример:**
```javascript
const input = document.getElementById('myInput');

input.addEventListener('keydown', function(event) {
  console.log('Нажата клавиша:', event.key);
});
```

**Полезные свойства объекта события:**
- `event.key` — название клавиши (`"Enter"`, `"a"`, `"ArrowUp"`)
- `event.code` — физический код клавиши (`"KeyA"`, `"Space"`)
- `event.ctrlKey`, `event.shiftKey`, `event.altKey` — зажаты ли модификаторы

---

### 3. События формы

| Событие | Описание |
|---------|----------|
| `submit` | Форма отправлена |
| `input` | Значение поля изменилось (срабатывает при каждом изменении) |
| `change` | Значение поля изменилось и элемент потерял фокус |
| `focus` | Элемент получил фокус |
| `blur` | Элемент потерял фокус |

**Пример:**
```javascript
const form = document.getElementById('myForm');

form.addEventListener('submit', function(event) {
  event.preventDefault(); // отменяем стандартную отправку
  console.log('Форма отправлена!');
});
```

---

### 4. Другие полезные события

| Событие | Описание |
|---------|----------|
| `load` | Ресурс загружен (изображение, страница) |
| `DOMContentLoaded` | HTML загружен и распарсен (на `document`) |
| `scroll` | Страница прокручена |
| `resize` | Окно браузера изменило размер |

**Пример:**
```javascript
window.addEventListener('scroll', function() {
  console.log('Страница прокручена на:', window.scrollY, 'px');
});
```

---

## Объект события (Event)

В обработчик **автоматически передаётся объект события** — обычно называется `event` или сокращённо `e`:

```javascript
button.addEventListener('click', function(event) {
  console.log(event); // объект события
});
```

### Основные свойства объекта события

#### 1. `event.target` — элемент, на котором произошло событие

```javascript
button.addEventListener('click', function(event) {
  console.log('Кликнули на:', event.target);
  // <button id="myButton">Нажми</button>
});
```

**Важно:** `event.target` — это элемент, на который **реально кликнули**, а не элемент, на который повесили обработчик (это `event.currentTarget`).

---

#### 2. `event.preventDefault()` — отменить стандартное поведение

Используется для отмены:
- Отправки формы
- Перехода по ссылке
- Открытия контекстного меню

**Пример: отмена отправки формы**
```javascript
form.addEventListener('submit', function(event) {
  event.preventDefault(); // форма не отправится
  console.log('Валидируем данные...');
});
```

**Пример: отмена перехода по ссылке**
```javascript
const link = document.querySelector('a');

link.addEventListener('click', function(event) {
  event.preventDefault(); // переход не произойдёт
  console.log('Ссылка заблокирована');
});
```

---

#### 3. `event.stopPropagation()` — остановить всплытие события

События **всплывают** (bubbling) — от дочернего элемента к родительскому. Чтобы остановить всплытие:

```javascript
childElement.addEventListener('click', function(event) {
  event.stopPropagation(); // событие не дойдёт до родителя
  console.log('Клик на дочернем элементе');
});
```

---

#### 4. `event.type` — тип события

```javascript
button.addEventListener('click', function(event) {
  console.log(event.type); // "click"
});
```

---

#### 5. `event.key` и `event.code` (для клавиатуры)

```javascript
input.addEventListener('keydown', function(event) {
  console.log('Клавиша:', event.key);   // "a", "Enter", "ArrowUp"
  console.log('Код:', event.code);       // "KeyA", "Enter", "ArrowUp"
});
```

---

## Примеры комплексного использования

### Пример 1: Кнопка с изменением текста

```javascript
const button = document.getElementById('toggleButton');
let isActive = false;

button.addEventListener('click', function() {
  isActive = !isActive;
  button.textContent = isActive ? 'Активно' : 'Неактивно';
  button.classList.toggle('active');
});
```

---

### Пример 2: Валидация формы

```javascript
const form = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const errorMsg = document.getElementById('error');

form.addEventListener('submit', function(event) {
  event.preventDefault(); // отменяем отправку

  const email = emailInput.value;

  if (!email.includes('@')) {
    errorMsg.textContent = 'Введите корректный email!';
    errorMsg.style.display = 'block';
  } else {
    errorMsg.style.display = 'none';
    console.log('Форма валидна, отправляем...');
  }
});
```

---

### Пример 3: Отслеживание клавиш

```javascript
const display = document.getElementById('keyDisplay');

document.addEventListener('keydown', function(event) {
  display.textContent = `Нажата: ${event.key}`;

  if (event.key === 'Enter') {
    console.log('Нажат Enter!');
  }
});
```

---

### Пример 4: Наведение мыши

```javascript
const card = document.querySelector('.card');

card.addEventListener('mouseenter', function() {
  card.classList.add('hover');
});

card.addEventListener('mouseleave', function() {
  card.classList.remove('hover');
});
```

---

## Разница между `onclick` (атрибут) и `addEventListener()`

### ❌ Старый способ (не рекомендуется)

```html
<button onclick="handleClick()">Нажми</button>
```

**Проблемы:**
- Смешивание HTML и JavaScript
- Можно повесить только один обработчик
- Сложно управлять

---

### ✅ Современный способ (рекомендуется)

```javascript
button.addEventListener('click', handleClick);
```

**Преимущества:**
- Разделение HTML и JavaScript
- Можно повесить несколько обработчиков на одно событие
- Легко удалить обработчик

---

## Лучшие практики

### ✅ Используйте `addEventListener()`

Всегда используйте `addEventListener()`, а не атрибуты `onclick`, `onmouseover` и т.д.

---

### ✅ Выносите обработчики в отдельные функции

```javascript
// ✅ Хорошо
function handleClick() {
  console.log('Клик');
}
button.addEventListener('click', handleClick);

// ❌ Плохо (анонимная функция сложнее отладить)
button.addEventListener('click', function() {
  console.log('Клик');
});
```

---

### ✅ Используйте `event.preventDefault()` для форм и ссылок

```javascript
form.addEventListener('submit', function(event) {
  event.preventDefault(); // обязательно!
  // ваша логика
});
```

---

### ✅ Добавляйте обработчики после загрузки DOM

Убедитесь, что элементы существуют перед добавлением обработчиков:

```javascript
// Способ 1: скрипт с defer
<script src="app.js" defer></script>

// Способ 2: DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('btn');
  button.addEventListener('click', handleClick);
});
```

---

## Итоги

### Что вы изучили:

✅ **Прослушивание событий:**
- `addEventListener('событие', обработчик)`
- `removeEventListener('событие', обработчик)`

✅ **Основные события:**
- **Мышь**: `click`, `mouseover`, `mouseout`
- **Клавиатура**: `keydown`, `keyup`
- **Формы**: `submit`, `input`, `change`
- **Другие**: `load`, `DOMContentLoaded`, `scroll`

✅ **Объект события:**
- `event.target` — элемент, на котором произошло событие
- `event.preventDefault()` — отменить стандартное поведение
- `event.stopPropagation()` — остановить всплытие
- `event.key` — нажатая клавиша

---

## Что дальше?

В следующих уроках вы изучите:
- **Делегирование событий** — эффективная работа с множеством элементов
- **Создание и удаление элементов** — динамическое изменение DOM
- **Работа с формами** — продвинутая валидация и отправка данных
- **Асинхронность** — `setTimeout`, `setInterval`, промисы

---

## Практика

Переходите к практическому уроку: **`02-events-practice.md`**

Там вы создадите интерактивную страницу с различными типами событий!
