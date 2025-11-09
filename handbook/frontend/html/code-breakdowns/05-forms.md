# 05 — Формы и валидация

## Введение

Формы — это основной способ, как пользователи отправляют данные на сервер. HTML предоставляет мощные инструменты для создания доступных и валидных форм.

Полный пример смотри в файле: **`../examples/05-contact-form.html`**

---

## Часть 1: Структура формы

```html
<form id="contactForm" action="/submit" method="POST" novalidate>
  <!-- поля формы -->
</form>
```

**Атрибуты:**
- `id` — уникальный идентификатор для JavaScript
- `action` — куда отправить данные (URL)
- `method` — метод HTTP (`GET` или `POST`)
- `novalidate` — отключить браузерную валидацию (используем свою)

---

## Часть 2: Основные типы полей

### Text Input

```html
<input type="text" name="name" id="name" placeholder="Введите имя">
```

**Атрибуты:**
- `type="text"` — текстовое поле
- `name` — имя поля (отправляется на сервер)
- `id` — уникальный идентификатор (для `<label>`)
- `placeholder` — подсказка

### Email

```html
<input type="email" name="email" id="email" placeholder="your@email.com">
```

**Особенность:** браузер автоматически проверяет формат email и показывает клавиатуру с `@` на мобилке.

### Телефон

```html
<input type="tel" name="phone" pattern="[+]?[0-9\s\-\(\)]+" placeholder="+7 (999) 123-45-67">
```

**`pattern`:** регулярное выражение для валидации.

### URL

```html
<input type="url" name="website" placeholder="https://example.com">
```

### Число

```html
<input type="number" name="age" min="18" max="120" step="1">
```

**Атрибуты:**
- `min` — минимальное значение
- `max` — максимальное значение
- `step` — шаг увеличения

### Дата

```html
<input type="date" name="birthday">
```

На мобилке показывает нативный date picker.

### Цвет

```html
<input type="color" name="favorite_color" value="#0ea5a0">
```

---

## Часть 3: Labels — обязательны!

### Правильно

```html
<label for="email">Email</label>
<input type="email" id="email" name="email">
```

**Почему `for="email"` важна:**
- Кликнув на label, фокус переходит на input
- Скринридер читает: "это поле для email"
- На мобилке увеличивается область клика

### Неправильно

```html
<!-- ❌ Без label -->
<input type="email" name="email" placeholder="Email">

<!-- ❌ Label без for -->
<label>Email</label>
<input type="email" name="email">
```

---

## Часть 4: Textarea

```html
<label for="message">Сообщение</label>
<textarea 
  id="message" 
  name="message" 
  rows="5" 
  minlength="10" 
  maxlength="1000"
  placeholder="Введите ваше сообщение..."
></textarea>
```

**Атрибуты:**
- `rows` — высота в строках
- `minlength` / `maxlength` — длина текста
- Пользователь может ресайзить (можешь отключить через CSS: `resize: none`)

---

## Часть 5: Select (выпадающий список)

```html
<label for="subject">Тема</label>
<select id="subject" name="subject" required>
  <option value="">— Выберите —</option>
  <option value="support">Техподдержка</option>
  <option value="sales">Продажи</option>
  <option value="feedback">Обратная связь</option>
</select>
```

**Правило:** первый `<option>` с пустым `value` — это плейсхолдер (не выбирается по умолчанию).

### Multiple select

```html
<select name="interests" multiple>
  <option value="js">JavaScript</option>
  <option value="py">Python</option>
  <option value="rb">Ruby</option>
</select>
```

Пользователь может выбрать несколько опций (Ctrl+click).

---

## Часть 6: Radio buttons

```html
<fieldset>
  <legend>Тип обращения</legend>
  <label>
    <input type="radio" name="type" value="question" required>
    Вопрос
  </label>
  <label>
    <input type="radio" name="type" value="complaint">
    Жалоба
  </label>
</fieldset>
```

**Ключевые моменты:**
- Все `<input type="radio">` с одинаковым `name` — это одна группа
- Только **один** может быть выбран одновременно
- `<fieldset>` и `<legend>` группируют связанные поля
- Label содержит input (легче кликать)

---

## Часть 7: Checkboxes

```html
<fieldset>
  <legend>Интересуемые услуги</legend>
  <label>
    <input type="checkbox" name="services" value="consultation">
    Консультация
  </label>
  <label>
    <input type="checkbox" name="services" value="development">
    Разработка
  </label>
</fieldset>
```

**Отличие от radio:**
- Может быть выбрано **несколько** checkbox'ов
- Не группируется как radio (но можешь иметь разные `name`)

---

## Часть 8: Валидация HTML5

### Required

```html
<input type="email" required>
```

Поле обязательно заполнить перед отправкой.

### Minlength / Maxlength

```html
<input type="text" minlength="2" maxlength="50">
```

### Min / Max (для чисел и дат)

```html
<input type="number" min="0" max="100">
<input type="date" min="2025-01-01" max="2025-12-31">
```

### Pattern (регулярное выражение)

```html
<input type="text" pattern="[A-Za-z]{3}" placeholder="3 буквы">
```

### Встроенные типы

```html
<input type="email">      <!-- валидирует формат email -->
<input type="url">        <!-- валидирует формат URL -->
<input type="number">     <!-- только цифры -->
```

---

## Часть 9: CSS для валидации

```css
/* красная граница для ошибок */
input:invalid:not(:placeholder-shown) {
  border-color: #ef4444;
}

/* зелёная граница для успеха */
input:valid:not(:placeholder-shown) {
  border-color: #22c55e;
}

/* фокус состояние */
input:focus {
  outline: 0;
  border-color: #0ea5a0;
  box-shadow: 0 0 0 3px rgba(14,165,160,0.1);
}
```

**`:not(:placeholder-shown)`** — не показываем ошибку, пока поле пусто (плейсхолдер видна).

---

## Часть 10: JavaScript валидация

### Проверка validity

```javascript
const input = document.getElementById('email');

// Весь объект ошибок
console.log(input.validity);
// {
//   valid: false,
//   valueMissing: true,      // required не заполнен
//   typeMismatch: false,     // неправильный тип
//   patternMismatch: false,  // pattern не совпадает
//   rangeUnderflow: false,   // ниже min
//   rangeOverflow: false,    // выше max
//   stepMismatch: false,     // не совпадает с step
//   tooShort: false,         // меньше minlength
//   tooLong: false,          // больше maxlength
// }

// Простая проверка
if (input.checkValidity()) {
  console.log('✓ Валидно');
} else {
  console.log('✗ Ошибка');
}
```

### Валидация при blur (потеря фокуса)

```javascript
const form = document.getElementById('contactForm');

form.querySelectorAll('input, textarea, select').forEach(field => {
  field.addEventListener('blur', () => {
    if (!field.checkValidity() && field.value) {
      field.style.borderColor = '#ef4444';
      const errorMsg = field.nextElementSibling;
      if (errorMsg?.classList.contains('error-message')) {
        errorMsg.style.display = 'block';
      }
    }
  });
});
```

---

## Часть 11: Обработка отправки формы

### Перехват submit события

```javascript
form.addEventListener('submit', (e) => {
  e.preventDefault();  // отменяем стандартную отправку

  // Проверяем форму целиком
  if (!form.checkValidity()) {
    alert('Исправьте ошибки');
    return;
  }

  // Собираем данные
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  console.log('Отправляем:', data);
  // {
  //   name: "Иван",
  //   email: "ivan@example.com",
  //   message: "Привет!"
  // }

  // Отправляем на сервер
  fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(result => {
    console.log('✓ Успех:', result);
    form.reset();  // очищаем форму
  })
  .catch(err => console.error('✗ Ошибка:', err));
});
```

### FormData vs Object.fromEntries

```javascript
// Способ 1: FormData (отправляем файлы)
const formData = new FormData(form);
fetch('/api', { method: 'POST', body: formData });

// Способ 2: Object (отправляем JSON)
const data = Object.fromEntries(new FormData(form));
fetch('/api', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

---

## Часть 12: Обработка checkboxes и radio

### Получить значение radio

```javascript
const type = document.querySelector('input[name="type"]:checked').value;
console.log(type);  // "question"
```

### Получить все выбранные checkboxes

```javascript
const services = Array.from(
  document.querySelectorAll('input[name="services"]:checked')
).map(cb => cb.value);

console.log(services);  // ["consultation", "development"]
```

---

## Часть 13: Custom валидация

```javascript
const email = document.getElementById('email');

// Сеттим custom error message
if (!email.value.includes('@company.com')) {
  email.setCustomValidity('Email должен быть от @company.com');
}

// Очищаем ошибку
if (email.value.includes('@company.com')) {
  email.setCustomValidity('');
}
```

---

## Часть 14: Best Practices

✅ **Делай:**
- Всегда используй `<label for="...">` для полей
- Группируй связанные поля в `<fieldset>`
- Используй семантичные типы input (`email`, `tel`, `number`)
- Валидируй на клиенте (UX) и на сервере (безопасность!)
- Показывай четкие сообщения об ошибках
- Используй `placeholder` только как подсказка, не как label
- Тестируй формы с клавиатурой (Tab, Enter, Space)

❌ **Не делай:**
- Не используй `<div>` вместо `<label>`
- Не забывай про `name` атрибут (иначе данные не отправятся!)
- Не полагайся только на цвет для ошибок (добавь текст)
- Не отправляй форму без проверки на сервере
- Не используй `placeholder` вместо `<label>`

---

## Часть 15: Доступность

### ARIA для сложных форм

```html
<label for="password">Пароль</label>
<input id="password" type="password" aria-describedby="pwd-hint">
<p id="pwd-hint">Минимум 8 символов, включая цифру</p>
```

**`aria-describedby`** связывает поле с дополнительным текстом.

### Группы ошибок

```html
<div role="alert" aria-live="polite">
  Ошибки формы:
  <ul>
    <li>Имя обязательно</li>
    <li>Email неправильный</li>
  </ul>
</div>
```

### Обязательные поля

```html
<label for="name">
  Имя <span aria-label="обязательное">*</span>
</label>
```

---

## Примеры со строками

```javascript
// ✅ Правильно: собираем данные формы
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const json = Object.fromEntries(data);
  console.log(json);
});

// ✅ Правильно: валидируем при blur
form.querySelectorAll('input').forEach(field => {
  field.addEventListener('blur', validateField);
});

// ✅ Правильно: показываем ошибки
if (!field.checkValidity()) {
  field.classList.add('error');
  errorMsg.textContent = getErrorMessage(field);
}
```

---

## Тестирование

- **Клавиатура:** Tab между полями, Enter отправляет, Space для checkbox
- **Скринридер:** все поля имеют labels, ошибки объявляются
- **Мобильный:** клавиатура меняется для email/tel/number
- **Браузер:** отправка без JavaScript работает (progressive enhancement)

---

## Домашнее задание 🏋️

1. Создай форму подписки (email + кнопка)
2. Добавь HTML5 валидацию
3. Добавь CSS для состояний (focus, valid, invalid)
4. Напиши JS для обработки отправки
5. Покажи message об успехе
6. Протестируй скринридером

**Готов к вопросам! 🚀**
