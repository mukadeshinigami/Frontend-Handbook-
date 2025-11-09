---
title: "05 — Формы и поля ввода"
description: "Полный урок по HTML-формам: типы инпутов, валидация, доступность, стилизация состояний и лучшие практики для современных веб-форм."
---

# Формы и поля ввода

В этом уроке разберём, как создавать доступные и удобные формы: структура, типы полей, HTML5-валидация, ARIA-атрибуты и практические рекомендации.

## Базовая структура формы

Форма оборачивается в `<form>` и содержит поля ввода, кнопки и группирующие элементы.

```html
<form action="/submit" method="POST">
  <label for="username">Имя пользователя</label>
  <input type="text" id="username" name="username" required>
  
  <button type="submit">Отправить</button>
</form>
```

Ключевые атрибуты `<form>`:

- `action` — URL для отправки данных.
- `method` — HTTP-метод (`GET` или `POST`).
- `novalidate` — отключает встроенную валидацию браузера (если валидируете через JS).

## Поля ввода (`<input>`)

HTML5 предлагает множество типов инпутов для разных данных:

### Текстовые поля

```html
<!-- Обычный текст -->
<input type="text" id="name" name="name" placeholder="Введите имя">

<!-- Email с встроенной валидацией -->
<input type="email" id="email" name="email" required>

<!-- Пароль (скрывает символы) -->
<input type="password" id="password" name="password" minlength="8">

<!-- Многострочный текст -->
<textarea id="message" name="message" rows="5" required></textarea>

<!-- URL -->
<input type="url" id="website" name="website">

<!-- Телефон -->
<input type="tel" id="phone" name="phone" pattern="[0-9]{10}">

<!-- Поиск -->
<input type="search" id="search" name="search">
```

### Числовые и диапазоны

```html
<!-- Число -->
<input type="number" id="age" name="age" min="18" max="100" step="1">

<!-- Диапазон (слайдер) -->
<input type="range" id="volume" name="volume" min="0" max="100" value="50">
```

### Дата и время

```html
<!-- Дата -->
<input type="date" id="birthday" name="birthday">

<!-- Время -->
<input type="time" id="meeting" name="meeting">

<!-- Дата и время -->
<input type="datetime-local" id="appointment" name="appointment">

<!-- Месяц -->
<input type="month" id="month" name="month">

<!-- Неделя -->
<input type="week" id="week" name="week">
```

### Выбор и чекбоксы

```html
<!-- Чекбокс -->
<input type="checkbox" id="subscribe" name="subscribe" value="yes">
<label for="subscribe">Подписаться на рассылку</label>

<!-- Радио-кнопки (выбор одного из группы) -->
<input type="radio" id="plan-free" name="plan" value="free">
<label for="plan-free">Бесплатный</label>

<input type="radio" id="plan-pro" name="plan" value="pro">
<label for="plan-pro">Профессиональный</label>
```

### Файлы и цвета

```html
<!-- Загрузка файла -->
<input type="file" id="avatar" name="avatar" accept="image/*">

<!-- Выбор цвета -->
<input type="color" id="theme-color" name="theme-color" value="#0ea5a0">
```

### Скрытые поля

```html
<!-- Скрытое поле (не отображается) -->
<input type="hidden" name="user_id" value="12345">
```

## Лейблы (`<label>`)

Каждое поле ввода должно иметь связанный `<label>` для доступности:

```html
<!-- Явная связь через for и id -->
<label for="email">Email</label>
<input type="email" id="email" name="email">

<!-- Неявная связь (обёртка) -->
<label>
  Email
  <input type="email" name="email">
</label>
```

Преимущества `<label>`:

- Увеличивает область клика (клик по тексту = клик по полю).
- Скринридеры озвучивают связь между текстом и полем.

## Группировка полей (`<fieldset>` и `<legend>`)

Для логической группировки используйте `<fieldset>` с `<legend>`:

```html
<fieldset>
  <legend>Личная информация</legend>
  
  <label for="first-name">Имя</label>
  <input type="text" id="first-name" name="first-name" required>
  
  <label for="last-name">Фамилия</label>
  <input type="text" id="last-name" name="last-name" required>
</fieldset>

<fieldset>
  <legend>Выберите тариф</legend>
  
  <input type="radio" id="basic" name="plan" value="basic">
  <label for="basic">Базовый</label>
  
  <input type="radio" id="premium" name="plan" value="premium">
  <label for="premium">Премиум</label>
</fieldset>
```

## Выпадающие списки (`<select>`)

```html
<label for="country">Страна</label>
<select id="country" name="country" required>
  <option value="">Выберите страну</option>
  <option value="ru">Россия</option>
  <option value="us">США</option>
  <option value="uk">Великобритания</option>
</select>

<!-- Множественный выбор -->
<select id="skills" name="skills" multiple>
  <option value="html">HTML</option>
  <option value="css">CSS</option>
  <option value="js">JavaScript</option>
</select>

<!-- Группировка опций -->
<select id="language" name="language">
  <optgroup label="Frontend">
    <option value="html">HTML</option>
    <option value="css">CSS</option>
  </optgroup>
  <optgroup label="Backend">
    <option value="node">Node.js</option>
    <option value="python">Python</option>
  </optgroup>
</select>
```

## HTML5 валидация

Встроенные атрибуты валидации:

- `required` — поле обязательно.
- `minlength` / `maxlength` — ограничение длины текста.
- `min` / `max` — диапазон для чисел и дат.
- `pattern` — регулярное выражение для проверки формата.
- `type` — встроенная валидация для email, url, tel и т.д.

Пример:

```html
<form>
  <label for="username">Имя (2-20 символов)</label>
  <input 
    type="text" 
    id="username" 
    name="username" 
    required 
    minlength="2" 
    maxlength="20"
    pattern="[A-Za-zА-Яа-яЁё]+"
    title="Только буквы">
  
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required>
  
  <button type="submit">Отправить</button>
</form>
```

### Пользовательские сообщения об ошибках (JS)

```html
<form id="myForm">
  <label for="email">Email</label>
  <input type="email" id="email" name="email" required>
  <button type="submit">Отправить</button>
</form>

<script>
const emailInput = document.getElementById('email');

emailInput.addEventListener('invalid', (e) => {
  e.preventDefault();
  if (emailInput.validity.valueMissing) {
    emailInput.setCustomValidity('Пожалуйста, введите email');
  } else if (emailInput.validity.typeMismatch) {
    emailInput.setCustomValidity('Введите корректный email адрес');
  }
});

emailInput.addEventListener('input', () => {
  emailInput.setCustomValidity(''); // сброс при вводе
});
</script>
```

## Доступность форм

### Основные правила

1. **Всегда используйте `<label>`** — явно связывайте через `for` и `id`.
2. **Группируйте связанные поля** — `<fieldset>` + `<legend>`.
3. **Указывайте `autocomplete`** — помогает браузерам и менеджерам паролей:

```html
<input type="email" name="email" autocomplete="email">
<input type="password" name="password" autocomplete="current-password">
<input type="text" name="street" autocomplete="street-address">
```

4. **Управление фокусом** — логичный порядок табуляции (используйте правильный HTML-порядок, избегайте `tabindex` > 0).

5. **Сообщения об ошибках** — выводите рядом с полем, используйте `aria-describedby`:

```html
<label for="email">Email</label>
<input 
  type="email" 
  id="email" 
  name="email" 
  aria-describedby="email-error"
  aria-invalid="true">
<span id="email-error" role="alert">Введите корректный email</span>
```

6. **Обязательные поля** — используйте `required` и визуально обозначайте (*, цвет, текст):

```html
<label for="name">
  Имя <span aria-label="обязательное поле">*</span>
</label>
<input type="text" id="name" name="name" required>
```

7. **Кнопки submit** — используйте `<button type="submit">` вместо `<input type="submit">` для большей гибкости стилизации.

## Стилизация форм и состояний

### Базовые стили

```css
/* Поля ввода */
input, textarea, select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.2s;
}

/* Фокус */
input:focus, textarea:focus, select:focus {
  outline: 0;
  border-color: #0ea5a0;
  box-shadow: 0 0 0 3px rgba(14, 165, 160, 0.1);
}

/* Валидное поле */
input:valid {
  border-color: #22c55e;
}

/* Невалидное поле (после взаимодействия) */
input:invalid:not(:placeholder-shown) {
  border-color: #ef4444;
}

/* Disabled */
input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Лейблы */
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

/* Группа полей */
.form-group {
  margin-bottom: 1.5rem;
}

/* Кнопки */
button[type="submit"] {
  background-color: #0ea5a0;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

button[type="submit"]:hover {
  background-color: #0d9995;
}

button[type="submit"]:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
```

### Индикация ошибок

```css
/* Сообщение об ошибке */
.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: none;
}

input:invalid:not(:placeholder-shown) + .error-message {
  display: block;
}

/* Иконка ошибки в поле */
input.has-error {
  border-color: #ef4444;
  background-image: url('data:image/svg+xml,...'); /* иконка */
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  padding-right: 2.5rem;
}
```

## Обработка отправки формы (JS)

```html
<form id="contactForm">
  <div class="form-group">
    <label for="name">Имя</label>
    <input type="text" id="name" name="name" required minlength="2">
  </div>
  
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>
  </div>
  
  <button type="submit">Отправить</button>
</form>

<script>
const form = document.getElementById('contactForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Получаем данные формы
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      alert('Форма успешно отправлена!');
      form.reset();
    } else {
      alert('Ошибка отправки. Попробуйте позже.');
    }
  } catch (error) {
    console.error('Ошибка:', error);
    alert('Произошла ошибка при отправке формы');
  }
});
</script>
```

## Типичные ошибки

- Отсутствие `<label>` для полей ввода.
- Использование `placeholder` вместо `<label>` (placeholder — подсказка, не замена лейбла).
- Игнорирование `autocomplete` — усложняет заполнение.
- Нечёткие сообщения об ошибках («Ошибка» вместо «Email введён неверно»).
- Отсутствие визуальной индикации состояний (focus, valid, invalid, disabled).
- Использование `<div>` и JS вместо семантических элементов (`<button>`, `<select>`, `<input type="...">`).

## Быстрая шпаргалка

- `<form>` + `action` + `method` — контейнер формы.
- `<label for="...">` + `<input id="...">` — связь лейбла и поля.
- `<fieldset>` + `<legend>` — группировка полей.
- `required`, `minlength`, `pattern`, `type` — HTML5 валидация.
- `aria-describedby`, `aria-invalid`, `role="alert"` — доступность ошибок.
- `autocomplete` — помощь при автозаполнении.
- `:focus`, `:valid`, `:invalid` — CSS псевдоклассы для состояний.

## Завершение

Формы — ключевой элемент интерактивности сайта. Правильная разметка, валидация и доступность делают их удобными для всех пользователей. Тестируйте формы с клавиатуры и скринридерами, чтобы убедиться в их доступности.

### Полезные ссылки

- MDN Forms: https://developer.mozilla.org/en-US/docs/Learn/Forms
- WebAIM Forms: https://webaim.org/techniques/forms/
- HTML5 Input Types: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input
- Autocomplete Values: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofill

---

Если нужно, могу добавить:
- продвинутые паттерны валидации (многошаговые формы, асинхронная валидация);
- примеры кастомных контролов (стилизованные чекбоксы/радио, datepicker);
- интеграцию с популярными библиотеками валидации.

Напишите, что предпочитаете.
