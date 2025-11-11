# Практика: Работа с формами

## Введение

В этом уроке вы создадите **многошаговую форму регистрации** с валидацией, динамическими полями и превью загруженного файла.

**Проект:** Форма регистрации пользователя с тремя шагами:
1. Личные данные
2. Контактная информация
3. Дополнительные настройки и аватар

**Время выполнения:** 40-50 минут  
**Сложность:** Средний

---

## HTML

Создайте файл `registration-form.html`:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Форма регистрации</title>
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
      color: #667eea;
      margin-bottom: 10px;
      text-align: center;
    }

    .progress-bar {
      height: 6px;
      background: #e0e0e0;
      border-radius: 10px;
      margin: 20px 0 30px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      width: 33.33%;
      transition: width 0.3s;
    }

    .step-indicator {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
    }

    .step {
      flex: 1;
      text-align: center;
      padding: 10px;
      color: #999;
      font-size: 0.9rem;
      position: relative;
    }

    .step.active {
      color: #667eea;
      font-weight: bold;
    }

    .step.completed {
      color: #28a745;
    }

    .form-step {
      display: none;
    }

    .form-step.active {
      display: block;
      animation: fadeIn 0.3s;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 12px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-group .error {
      color: #ff4757;
      font-size: 0.85rem;
      margin-top: 5px;
      display: none;
    }

    .form-group.has-error input,
    .form-group.has-error select {
      border-color: #ff4757;
    }

    .form-group.has-error .error {
      display: block;
    }

    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .checkbox-group input[type="checkbox"] {
      width: auto;
    }

    .avatar-preview {
      margin-top: 15px;
      text-align: center;
    }

    .avatar-preview img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #667eea;
      display: none;
    }

    .avatar-preview img.show {
      display: inline-block;
    }

    .dynamic-fields {
      margin-top: 20px;
    }

    .hobby-field {
      display: flex;
      gap: 10px;
      margin-bottom: 10px;
    }

    .hobby-field input {
      flex: 1;
    }

    .hobby-field button {
      padding: 10px 20px;
      background: #ff4757;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    .hobby-field button:hover {
      background: #ee5a6f;
    }

    .add-hobby-btn {
      padding: 10px 20px;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      margin-bottom: 20px;
    }

    .add-hobby-btn:hover {
      background: #218838;
    }

    .form-buttons {
      display: flex;
      gap: 15px;
      margin-top: 30px;
    }

    .form-buttons button {
      flex: 1;
      padding: 15px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-prev {
      background: #e0e0e0;
      color: #333;
    }

    .btn-prev:hover {
      background: #d0d0d0;
    }

    .btn-next,
    .btn-submit {
      background: #667eea;
      color: white;
    }

    .btn-next:hover,
    .btn-submit:hover {
      background: #764ba2;
    }

    .btn-prev:disabled,
    .btn-next:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .summary {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      margin-bottom: 20px;
    }

    .summary h3 {
      color: #667eea;
      margin-bottom: 15px;
    }

    .summary-item {
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
      border-bottom: 1px solid #e0e0e0;
    }

    .summary-item:last-child {
      border-bottom: none;
    }

    .summary-item strong {
      color: #333;
    }

    .success-message {
      display: none;
      text-align: center;
      padding: 40px;
    }

    .success-message.show {
      display: block;
    }

    .success-message h2 {
      color: #28a745;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>📝 Регистрация</h1>
    
    <!-- Прогресс-бар -->
    <div class="progress-bar">
      <div class="progress-bar-fill" id="progressBarFill"></div>
    </div>

    <!-- Индикаторы шагов -->
    <div class="step-indicator">
      <div class="step active" data-step="1">Личные данные</div>
      <div class="step" data-step="2">Контакты</div>
      <div class="step" data-step="3">Настройки</div>
    </div>

    <!-- Форма -->
    <form id="registrationForm">
      
      <!-- Шаг 1: Личные данные -->
      <div class="form-step active" data-step="1">
        <div class="form-group">
          <label for="firstName">Имя *</label>
          <input type="text" id="firstName" name="firstName" required>
          <span class="error">Введите имя (минимум 2 символа)</span>
        </div>

        <div class="form-group">
          <label for="lastName">Фамилия *</label>
          <input type="text" id="lastName" name="lastName" required>
          <span class="error">Введите фамилию (минимум 2 символа)</span>
        </div>

        <div class="form-group">
          <label for="birthDate">Дата рождения *</label>
          <input type="date" id="birthDate" name="birthDate" required>
          <span class="error">Вам должно быть не менее 18 лет</span>
        </div>

        <div class="form-group">
          <label for="gender">Пол *</label>
          <select id="gender" name="gender" required>
            <option value="">Выберите...</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
            <option value="other">Другой</option>
          </select>
          <span class="error">Выберите пол</span>
        </div>
      </div>

      <!-- Шаг 2: Контакты -->
      <div class="form-step" data-step="2">
        <div class="form-group">
          <label for="email">Email *</label>
          <input type="email" id="email" name="email" required>
          <span class="error">Введите корректный email</span>
        </div>

        <div class="form-group">
          <label for="phone">Телефон *</label>
          <input type="tel" id="phone" name="phone" placeholder="+7 (999) 123-45-67" required>
          <span class="error">Введите телефон в формате +7 (999) 123-45-67</span>
        </div>

        <div class="form-group">
          <label for="city">Город *</label>
          <input type="text" id="city" name="city" required>
          <span class="error">Введите город</span>
        </div>

        <div class="form-group">
          <label for="address">Адрес</label>
          <textarea id="address" name="address" rows="3"></textarea>
        </div>
      </div>

      <!-- Шаг 3: Настройки -->
      <div class="form-step" data-step="3">
        <div class="form-group">
          <label for="username">Имя пользователя *</label>
          <input type="text" id="username" name="username" required>
          <span class="error">Введите имя пользователя (минимум 4 символа)</span>
        </div>

        <div class="form-group">
          <label for="password">Пароль *</label>
          <input type="password" id="password" name="password" required>
          <span class="error">Пароль должен содержать минимум 8 символов, цифры и буквы</span>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Подтвердите пароль *</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required>
          <span class="error">Пароли не совпадают</span>
        </div>

        <div class="form-group">
          <label for="avatar">Фото профиля (необязательно)</label>
          <input type="file" id="avatar" name="avatar" accept="image/*">
          <div class="avatar-preview">
            <img id="avatarPreview" alt="Preview">
          </div>
        </div>

        <div class="dynamic-fields">
          <label>Увлечения (необязательно)</label>
          <button type="button" class="add-hobby-btn" id="addHobbyBtn">+ Добавить увлечение</button>
          <div id="hobbiesContainer"></div>
        </div>

        <div class="form-group checkbox-group">
          <input type="checkbox" id="newsletter" name="newsletter">
          <label for="newsletter">Подписаться на рассылку</label>
        </div>

        <div class="form-group checkbox-group">
          <input type="checkbox" id="terms" name="terms" required>
          <label for="terms">Я согласен с условиями *</label>
        </div>
      </div>

      <!-- Кнопки навигации -->
      <div class="form-buttons">
        <button type="button" class="btn-prev" id="prevBtn" disabled>Назад</button>
        <button type="button" class="btn-next" id="nextBtn">Далее</button>
        <button type="submit" class="btn-submit" id="submitBtn" style="display: none;">Отправить</button>
      </div>
    </form>

    <!-- Сообщение об успехе -->
    <div class="success-message" id="successMessage">
      <h2>✅ Регистрация успешна!</h2>
      <p>Ваши данные были успешно отправлены.</p>
    </div>
  </div>

  <script src="registration-form.js"></script>
</body>
</html>
```

---

## JavaScript

Создайте файл `registration-form.js`:

```javascript
// Элементы
const form = document.getElementById('registrationForm');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const progressBarFill = document.getElementById('progressBarFill');
const addHobbyBtn = document.getElementById('addHobbyBtn');
const hobbiesContainer = document.getElementById('hobbiesContainer');
const avatarInput = document.getElementById('avatar');
const avatarPreview = document.getElementById('avatarPreview');
const successMessage = document.getElementById('successMessage');

// Состояние
let currentStep = 1;
const totalSteps = 3;

// Инициализация
updateButtons();

// Функция обновления кнопок
function updateButtons() {
  prevBtn.disabled = currentStep === 1;
  
  if (currentStep === totalSteps) {
    nextBtn.style.display = 'none';
    submitBtn.style.display = 'block';
  } else {
    nextBtn.style.display = 'block';
    submitBtn.style.display = 'none';
  }
  
  // Обновление прогресс-бара
  const progress = (currentStep / totalSteps) * 100;
  progressBarFill.style.width = `${progress}%`;
  
  // Обновление индикаторов шагов
  document.querySelectorAll('.step').forEach((step, index) => {
    const stepNumber = index + 1;
    step.classList.remove('active', 'completed');
    
    if (stepNumber === currentStep) {
      step.classList.add('active');
    } else if (stepNumber < currentStep) {
      step.classList.add('completed');
    }
  });
}

// Функция показа шага
function showStep(step) {
  document.querySelectorAll('.form-step').forEach(formStep => {
    formStep.classList.remove('active');
  });
  
  document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
}

// Функция валидации шага
function validateStep(step) {
  const currentStepEl = document.querySelector(`.form-step[data-step="${step}"]`);
  const inputs = currentStepEl.querySelectorAll('input[required], select[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('has-error');
    
    if (!validateField(input)) {
      formGroup.classList.add('has-error');
      isValid = false;
    }
  });
  
  return isValid;
}

// Функция валидации поля
function validateField(field) {
  const value = field.value.trim();
  const name = field.name;
  
  switch (name) {
    case 'firstName':
    case 'lastName':
      return value.length >= 2;
      
    case 'birthDate':
      if (!value) return false;
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18;
      
    case 'gender':
      return value !== '';
      
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      
    case 'phone':
      return /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(value);
      
    case 'city':
      return value.length >= 2;
      
    case 'username':
      return value.length >= 4;
      
    case 'password':
      return value.length >= 8 && /[a-zA-Z]/.test(value) && /\d/.test(value);
      
    case 'confirmPassword':
      const password = document.getElementById('password').value;
      return value === password;
      
    case 'terms':
      return field.checked;
      
    default:
      return field.checkValidity();
  }
}

// Обработчик "Далее"
nextBtn.addEventListener('click', () => {
  if (validateStep(currentStep)) {
    currentStep++;
    showStep(currentStep);
    updateButtons();
    window.scrollTo(0, 0);
  }
});

// Обработчик "Назад"
prevBtn.addEventListener('click', () => {
  currentStep--;
  showStep(currentStep);
  updateButtons();
  window.scrollTo(0, 0);
});

// Валидация в реальном времени
form.addEventListener('blur', (event) => {
  if (event.target.matches('input, select')) {
    const formGroup = event.target.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('has-error');
      if (!validateField(event.target)) {
        formGroup.classList.add('has-error');
      }
    }
  }
}, true);

// Форматирование телефона
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', (event) => {
  let value = event.target.value.replace(/\D/g, '');
  
  if (value.length > 0) {
    if (value[0] === '7') {
      value = value.slice(1);
    }
    
    let formatted = '+7';
    if (value.length > 0) formatted += ` (${value.slice(0, 3)}`;
    if (value.length >= 4) formatted += `) ${value.slice(3, 6)}`;
    if (value.length >= 7) formatted += `-${value.slice(6, 8)}`;
    if (value.length >= 9) formatted += `-${value.slice(8, 10)}`;
    
    event.target.value = formatted;
  }
});

// Превью аватара
avatarInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.src = e.target.result;
      avatarPreview.classList.add('show');
    };
    reader.readAsDataURL(file);
  }
});

// Динамические поля (увлечения)
let hobbyCount = 0;

addHobbyBtn.addEventListener('click', () => {
  const hobbyField = document.createElement('div');
  hobbyField.className = 'hobby-field';
  
  const input = document.createElement('input');
  input.type = 'text';
  input.name = `hobby${hobbyCount++}`;
  input.placeholder = 'Например: Чтение';
  
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.textContent = 'Удалить';
  removeBtn.addEventListener('click', () => hobbyField.remove());
  
  hobbyField.append(input, removeBtn);
  hobbiesContainer.appendChild(hobbyField);
});

// Отправка формы
form.addEventListener('submit', (event) => {
  event.preventDefault();
  
  if (!validateStep(currentStep)) {
    return;
  }
  
  // Собираем данные
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  console.log('Данные формы:', data);
  
  // Показываем успешное сообщение
  form.style.display = 'none';
  document.querySelector('.progress-bar').style.display = 'none';
  document.querySelector('.step-indicator').style.display = 'none';
  successMessage.classList.add('show');
  
  // В реальном приложении здесь был бы fetch запрос:
  // fetch('/api/register', {
  //   method: 'POST',
  //   body: formData
  // });
});
```

---

## Что вы изучили

✅ **Многошаговая форма:**
- Навигация между шагами
- Прогресс-бар
- Индикаторы шагов

✅ **Валидация:**
- Валидация при переходе на следующий шаг
- Валидация в реальном времени (blur)
- Кастомные правила валидации
- Показ ошибок под полями

✅ **Динамические элементы:**
- Добавление/удаление полей
- Форматирование телефона

✅ **Работа с файлами:**
- Загрузка файла
- Превью изображения

✅ **FormData:**
- Сбор данных формы

---

## Задания для улучшения

1. Добавьте сохранение прогресса в `localStorage`
2. Реализуйте асинхронную проверку email (симуляция)
3. Добавьте индикатор силы пароля
4. Сделайте форму адаптивной для мобильных устройств
5. Добавьте возможность редактировать предыдущие шаги

**Отличная работа! Переходите к следующему уроку.** 🚀
