# Работа с формами в JavaScript

## Введение

Формы — это основной способ получения данных от пользователей. JavaScript позволяет:
- Получать доступ к элементам формы
- Валидировать данные перед отправкой
- Отправлять данные асинхронно (без перезагрузки страницы)
- Создавать динамические формы

В этом уроке вы изучите всё необходимое для профессиональной работы с формами.

---

## Доступ к элементам формы

### Получение формы

```javascript
// По ID
const form = document.getElementById('myForm');

// По селектору
const form = document.querySelector('form');
const form = document.querySelector('.login-form');
```

### Доступ к полям формы

**Через `form.elements`:**

```html
<form id="myForm">
  <input type="text" name="username">
  <input type="email" name="email">
</form>
```

```javascript
const form = document.getElementById('myForm');

// Доступ к полям по имени
const username = form.elements.username;
const email = form.elements.email;

console.log(username.value); // значение поля
```

**Через `querySelector`:**

```javascript
const username = form.querySelector('[name="username"]');
const email = form.querySelector('#email');
```

---

## Получение значений полей

### Text inputs

```javascript
const input = document.querySelector('#username');

// Получить значение
console.log(input.value);

// Установить значение
input.value = 'Новое значение';

// Очистить
input.value = '';
```

### Checkbox

```javascript
const checkbox = document.querySelector('#agree');

// Проверить, отмечен ли
if (checkbox.checked) {
  console.log('Галочка стоит');
}

// Установить/снять галочку
checkbox.checked = true;
checkbox.checked = false;
```

### Radio buttons

```html
<input type="radio" name="gender" value="male"> Мужской
<input type="radio" name="gender" value="female"> Женский
```

```javascript
// Получить выбранное значение
const selectedGender = document.querySelector('input[name="gender"]:checked');
if (selectedGender) {
  console.log(selectedGender.value);
}
```

### Select (выпадающий список)

```html
<select id="country">
  <option value="ru">Россия</option>
  <option value="us">США</option>
  <option value="uk">Великобритания</option>
</select>
```

```javascript
const select = document.querySelector('#country');

// Получить выбранное значение
console.log(select.value); // 'ru'

// Получить текст выбранной опции
console.log(select.options[select.selectedIndex].text); // 'Россия'

// Установить значение
select.value = 'us';
```

### Multiple select

```javascript
const select = document.querySelector('#multiple-select');

// Получить все выбранные значения
const selectedOptions = Array.from(select.selectedOptions);
const values = selectedOptions.map(option => option.value);
console.log(values);
```

---

## События форм

### `submit` — отправка формы

Срабатывает при отправке формы (клик на кнопку или Enter):

```javascript
const form = document.querySelector('#myForm');

form.addEventListener('submit', (event) => {
  event.preventDefault(); // Предотвращаем перезагрузку страницы
  
  console.log('Форма отправлена!');
  
  // Получаем данные
  const formData = new FormData(form);
  console.log(Object.fromEntries(formData));
});
```

**Важно:** `event.preventDefault()` — обязательно, чтобы страница не перезагружалась!

---

### `input` — изменение значения в реальном времени

Срабатывает при каждом вводе символа:

```javascript
const input = document.querySelector('#search');

input.addEventListener('input', (event) => {
  console.log('Текущее значение:', event.target.value);
  // Можно делать поиск в реальном времени
});
```

---

### `change` — изменение значения (после потери фокуса)

Для `<input>`, `<select>`, `<textarea>`:

```javascript
const input = document.querySelector('#username');

input.addEventListener('change', (event) => {
  console.log('Значение изменилось:', event.target.value);
});
```

**Разница между `input` и `change`:**
- `input` — срабатывает при каждом символе
- `change` — срабатывает только после потери фокуса (или выбора в select)

---

### `focus` и `blur`

```javascript
const input = document.querySelector('#email');

// Получение фокуса
input.addEventListener('focus', () => {
  console.log('Поле получило фокус');
  input.style.borderColor = 'blue';
});

// Потеря фокуса
input.addEventListener('blur', () => {
  console.log('Поле потеряло фокус');
  input.style.borderColor = '';
});
```

---

## Валидация форм

### Встроенная HTML5 валидация

HTML5 предоставляет встроенные атрибуты:

```html
<form>
  <!-- Обязательное поле -->
  <input type="text" name="username" required>
  
  <!-- Email -->
  <input type="email" name="email" required>
  
  <!-- Минимальная длина -->
  <input type="password" name="password" minlength="8" required>
  
  <!-- Паттерн (регулярное выражение) -->
  <input type="tel" name="phone" pattern="[0-9]{10}" 
         title="Введите 10 цифр">
  
  <!-- Диапазон чисел -->
  <input type="number" name="age" min="18" max="100">
  
  <button type="submit">Отправить</button>
</form>
```

**Браузер автоматически проверит эти поля!**

---

### Кастомная JavaScript валидация

Для более сложной логики:

```javascript
const form = document.querySelector('#registrationForm');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  // Получаем значения
  const username = form.elements.username.value.trim();
  const email = form.elements.email.value.trim();
  const password = form.elements.password.value;
  
  // Валидация
  const errors = [];
  
  if (username.length < 3) {
    errors.push('Имя должно быть не менее 3 символов');
  }
  
  if (!email.includes('@')) {
    errors.push('Неверный формат email');
  }
  
  if (password.length < 8) {
    errors.push('Пароль должен быть не менее 8 символов');
  }
  
  // Если есть ошибки — показываем
  if (errors.length > 0) {
    alert(errors.join('\n'));
    return;
  }
  
  // Всё ок — отправляем
  console.log('Форма валидна!', { username, email, password });
});
```

---

### Показ ошибок под полями

```html
<form id="myForm">
  <div class="form-group">
    <input type="text" id="username" name="username">
    <span class="error" id="username-error"></span>
  </div>
  
  <div class="form-group">
    <input type="email" id="email" name="email">
    <span class="error" id="email-error"></span>
  </div>
  
  <button type="submit">Отправить</button>
</form>
```

```javascript
function showError(fieldId, message) {
  const errorEl = document.querySelector(`#${fieldId}-error`);
  errorEl.textContent = message;
  errorEl.style.color = 'red';
}

function clearError(fieldId) {
  const errorEl = document.querySelector(`#${fieldId}-error`);
  errorEl.textContent = '';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  // Очищаем предыдущие ошибки
  clearError('username');
  clearError('email');
  
  const username = form.elements.username.value.trim();
  const email = form.elements.email.value.trim();
  
  let hasErrors = false;
  
  if (username.length < 3) {
    showError('username', 'Минимум 3 символа');
    hasErrors = true;
  }
  
  if (!email.includes('@')) {
    showError('email', 'Неверный email');
    hasErrors = true;
  }
  
  if (!hasErrors) {
    console.log('Форма отправлена!');
  }
});
```

---

## FormData API

`FormData` — современный способ сбора данных формы:

```javascript
const form = document.querySelector('#myForm');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  // Создаём объект FormData
  const formData = new FormData(form);
  
  // Получить одно значение
  console.log(formData.get('username'));
  
  // Получить все значения (для полей с одинаковым name)
  console.log(formData.getAll('hobby'));
  
  // Перебрать все поля
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  
  // Конвертировать в объект
  const data = Object.fromEntries(formData);
  console.log(data);
  // { username: 'Иван', email: 'ivan@example.com' }
});
```

**Добавление данных вручную:**

```javascript
const formData = new FormData();
formData.append('username', 'Иван');
formData.append('age', 25);
formData.append('file', fileInput.files[0]); // Файл
```

---

## Динамическое добавление/удаление полей

### Добавление полей

```html
<form id="myForm">
  <div id="fields-container">
    <input type="text" name="item[]" placeholder="Товар">
  </div>
  <button type="button" id="addFieldBtn">Добавить ещё</button>
  <button type="submit">Отправить</button>
</form>
```

```javascript
const addFieldBtn = document.querySelector('#addFieldBtn');
const container = document.querySelector('#fields-container');

addFieldBtn.addEventListener('click', () => {
  const newField = document.createElement('input');
  newField.type = 'text';
  newField.name = 'item[]';
  newField.placeholder = 'Товар';
  
  container.appendChild(newField);
});
```

### Удаление полей

```javascript
addFieldBtn.addEventListener('click', () => {
  const wrapper = document.createElement('div');
  wrapper.className = 'field-wrapper';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'item[]';
  
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.textContent = 'Удалить';
  removeBtn.addEventListener('click', () => wrapper.remove());
  
  wrapper.append(input, removeBtn);
  container.appendChild(wrapper);
});
```

---

## Debouncing для input событий

Когда нужно делать поиск при вводе, но не хотим отправлять запрос на каждый символ:

```javascript
let timeout;
const searchInput = document.querySelector('#search');

searchInput.addEventListener('input', (event) => {
  // Отменяем предыдущий таймер
  clearTimeout(timeout);
  
  // Ставим новый таймер на 500мс
  timeout = setTimeout(() => {
    const query = event.target.value;
    console.log('Ищем:', query);
    // Здесь делаем fetch запрос
  }, 500);
});
```

**Результат:** запрос отправляется только через 500мс после того, как пользователь перестал печатать.

---

## Работа с файлами

### Загрузка файлов

```html
<input type="file" id="fileInput">
<img id="preview" width="200">
```

```javascript
const fileInput = document.querySelector('#fileInput');
const preview = document.querySelector('#preview');

fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  
  if (file) {
    console.log('Имя файла:', file.name);
    console.log('Размер:', file.size, 'байт');
    console.log('Тип:', file.type);
    
    // Превью изображения
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});
```

### Multiple файлы

```html
<input type="file" id="fileInput" multiple>
```

```javascript
fileInput.addEventListener('change', (event) => {
  const files = Array.from(event.target.files);
  
  files.forEach(file => {
    console.log(file.name);
  });
});
```

---

## Отключение и активация полей

```javascript
const input = document.querySelector('#username');
const submitBtn = document.querySelector('#submitBtn');

// Отключить
input.disabled = true;
submitBtn.disabled = true;

// Включить
input.disabled = false;
submitBtn.disabled = false;
```

**Условное отключение кнопки:**

```javascript
const emailInput = document.querySelector('#email');
const submitBtn = document.querySelector('#submitBtn');

emailInput.addEventListener('input', () => {
  // Кнопка активна только если email не пустой
  submitBtn.disabled = emailInput.value.trim() === '';
});
```

---

## Сброс формы

```javascript
const form = document.querySelector('#myForm');

// Программный сброс
form.reset();

// Или через кнопку
<button type="reset">Очистить</button>
```

---

## Практические советы

✅ **Всегда используйте:**
- `event.preventDefault()` в обработчике `submit`
- `trim()` для текстовых полей (убирает пробелы)
- Валидацию на клиенте И на сервере (клиентская — для UX, серверная — для безопасности)

✅ **Для лучшего UX:**
- Показывайте ошибки под полями
- Валидируйте в реальном времени (`input` или `blur`)
- Отключайте кнопку отправки во время процесса
- Используйте placeholder для подсказок

❌ **Избегайте:**
- Валидации только на клиенте (небезопасно!)
- Агрессивной валидации (не показывайте ошибки, пока пользователь не начал вводить)

---

## Заключение

Теперь вы умеете:
- ✅ Получать доступ к элементам формы
- ✅ Обрабатывать события (`submit`, `input`, `change`, `focus`, `blur`)
- ✅ Валидировать данные
- ✅ Использовать `FormData` API
- ✅ Работать с файлами
- ✅ Динамически добавлять/удалять поля
- ✅ Применять debouncing

**Следующий шаг:** Попрактикуйтесь в создании форм с валидацией!
