const clickableElement = document.getElementById('colorButton');
// Сбор всех элементов по id
const colorButton = document.getElementById('colorButton');
const hoverCard = document.getElementById('hoverCard');
const keyInput = document.getElementById('keyInput');
const keyDisplay = document.getElementById('keyDisplay');
const userForm = document.getElementById('userForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const successMessage = document.getElementById('successMessage');
const counterDisplay = document.getElementById('counterDisplay');
const incrementButton = document.getElementById('incrementButton');
const resetButton = document.getElementById('resetButton');


if (clickableElement) {
  clickableElement.addEventListener('click', () => {

    clickableElement.classList.remove('color-button');

    clickableElement.classList.add('highlight');
  });
}       


if (hoverCard) {
  hoverCard.addEventListener('mouseover', () => {
    hoverCard.classList.add('active');
  });
  hoverCard.addEventListener('mouseout', () => {
    hoverCard.classList.remove('active');
  });
} 

if (keyInput && keyDisplay) {
  keyInput.addEventListener('keydown', (event) => {
    keyDisplay.textContent = `Нажата клавиша: "${event.key}" (код: ${event.code})`;

    // Специальная реакция на Enter
    if (event.key === 'Enter') {
      keyDisplay.textContent = '✅ Нажат Enter!';
      keyDisplay.style.backgroundColor = '#d4edda';
      setTimeout(() => (keyDisplay.style.backgroundColor = ''), 500);
    }
  });
} else {
  console.warn('keyInput or keyDisplay not found');
}

// --------------------------------------------
// Секция 4: Валидация формы (production-ready)
// --------------------------------------------

// Regex для валидации email (базовый, но достаточный для продакшена)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Константы для валидации
const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 50;
const MAX_EMAIL_LENGTH = 100;

/**
 * Показывает сообщение об ошибке для поля формы и отмечает поле как невалидное.
 * @param {HTMLElement|null} errorElement - Элемент, в который выводится текст ошибки (span.role=alert).
 * @param {HTMLInputElement|null} inputElement - Поле ввода, к которому относится ошибка.
 * @param {string} message - Текст сообщения об ошибке.
 *
 * Побочный эффект: меняет DOM — вставляет текст ошибки, показывает элемент и ставит
 * aria-invalid="true" и красную рамку у поля.
 */
function showError(errorElement, inputElement, message) {
  if (errorElement && inputElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    inputElement.setAttribute('aria-invalid', 'true');
    inputElement.style.borderColor = '#dc3545';
  }
}

/**
 * Скрывает сообщение об ошибке и возвращает поле в нормальное состояние.
 * @param {HTMLElement|null} errorElement - Элемент с сообщением об ошибке.
 * @param {HTMLInputElement|null} inputElement - Поле ввода, к которому применялся класс ошибки.
 *
 * Побочный эффект: скрывает текст ошибки, устанавливает aria-invalid="false" и удаляет красную рамку.
 */
function hideError(errorElement, inputElement) {
  if (errorElement && inputElement) {
    errorElement.style.display = 'none';
    inputElement.setAttribute('aria-invalid', 'false');
    inputElement.style.borderColor = '';
  }
}

/**
 * Валидирует значение поля имени.
 * @param {string} value - Введённое пользователем значение.
 * @returns {{valid: boolean, error?: string, value?: string}} - Объект с флагом валидности, сообщением об ошибке и очищённым значением.
 *
 * Проверки:
 *  - обрезает пробелы (trim)
 *  - не пустое значение
 *  - минимальная/максимальная длина
 *  - содержит буквы (русские/латинские)
 */
function validateName(value) {
  const trimmed = value.trim();
  
  if (trimmed === '') {
    return { valid: false, error: 'Имя обязательно для заполнения' };
  }
  
  if (trimmed.length < MIN_NAME_LENGTH) {
    return { valid: false, error: `Имя должно содержать минимум ${MIN_NAME_LENGTH} символа` };
  }
  
  if (trimmed.length > MAX_NAME_LENGTH) {
    return { valid: false, error: `Имя не должно превышать ${MAX_NAME_LENGTH} символов` };
  }
  
  // Проверка на только пробелы или специальные символы
  if (!/[а-яА-ЯёЁa-zA-Z]/.test(trimmed)) {
    return { valid: false, error: 'Имя должно содержать буквы' };
  }
  
  return { valid: true, value: trimmed };
}

/**
 * Валидирует email пользователя.
 * @param {string} value - Введённый email.
 * @returns {{valid: boolean, error?: string, value?: string}} - Результат валидации и нормализованный email (lowercase, trimmed).
 *
 * Проверки:
 *  - не пустой
 *  - максимальная длина
 *  - простая, но надёжная regex-валидация
 *  - проверка на распространённые опечатки
 */
function validateEmail(value) {
  const trimmed = value.trim().toLowerCase();
  
  if (trimmed === '') {
    return { valid: false, error: 'Email обязателен для заполнения' };
  }
  
  if (trimmed.length > MAX_EMAIL_LENGTH) {
    return { valid: false, error: `Email не должен превышать ${MAX_EMAIL_LENGTH} символов` };
  }
  
  if (!EMAIL_REGEX.test(trimmed)) {
    return { valid: false, error: 'Введите корректный email (example@domain.com)' };
  }
  
  // Дополнительная проверка на популярные опечатки
  const commonTypos = ['@gmail,com', '@yandex,ru', '@mail,ru'];
  if (commonTypos.some(typo => trimmed.includes(typo))) {
    return { valid: false, error: 'Проверьте правильность email (возможно опечатка)' };
  }
  
  return { valid: true, value: trimmed };
}

if (userForm && usernameInput && emailInput) {
  const submitButton = userForm.querySelector('button[type="submit"]');
  
  // Real-time валидация при вводе (опционально, для лучшего UX)
  usernameInput.addEventListener('input', () => {
    if (usernameInput.value.trim() !== '') {
      hideError(nameError, usernameInput);
    }
  });
  
  emailInput.addEventListener('input', () => {
    if (emailInput.value.trim() !== '') {
      hideError(emailError, emailInput);
    }
  });
  
  // Обработка отправки формы
  userForm.addEventListener('submit', (event) => {
    event.preventDefault(); // КРИТИЧНО: отменяем стандартную отправку
    
    console.log('🔄 Форма отправлена, начинается валидация...');
    
    // Сброс всех предыдущих ошибок
    hideError(nameError, usernameInput);
    hideError(emailError, emailInput);
    if (successMessage) successMessage.style.display = 'none';
    
    // Блокируем кнопку отправки на время валидации
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Проверка...';
    }
    
    // Валидация имени
    const nameValidation = validateName(usernameInput.value);
    if (!nameValidation.valid) {
      showError(nameError, usernameInput, nameValidation.error);
      usernameInput.focus(); // Фокус на первое поле с ошибкой
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Отправить';
      }
      console.error('❌ Ошибка валидации имени:', nameValidation.error);
      return;
    }
    
    // Валидация email
    const emailValidation = validateEmail(emailInput.value);
    if (!emailValidation.valid) {
      showError(emailError, emailInput, emailValidation.error);
      emailInput.focus();
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Отправить';
      }
      console.error('❌ Ошибка валидации email:', emailValidation.error);
      return;
    }
    
    // Все проверки пройдены — форма валидна
    console.log('✅ Валидация успешна!', {
      name: nameValidation.value,
      email: emailValidation.value,
      timestamp: new Date().toISOString()
    });
    
    // Показываем сообщение об успехе
    if (successMessage) {
      successMessage.style.display = 'block';
      successMessage.textContent = `✅ Форма успешно отправлена! Добро пожаловать, ${nameValidation.value}!`;
    }
    
    // Разблокируем кнопку
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Отправить';
    }
    
    // Очищаем форму через 2 секунды
    setTimeout(() => {
      userForm.reset();
      if (successMessage) successMessage.style.display = 'none';
      hideError(nameError, usernameInput);
      hideError(emailError, emailInput);
      console.log('🔄 Форма очищена');
    }, 2000);
  });
} else {
  console.warn('⚠️ Form elements not found (userForm, usernameInput, or emailInput)');
}

// --------------------------------------------
// Секция 5: Счётчик
// --------------------------------------------
let count = 0;
if (counterDisplay) counterDisplay.textContent = count;

if (incrementButton && counterDisplay) {
  incrementButton.addEventListener('click', () => {
    count++;
    counterDisplay.textContent = count;
    counterDisplay.style.transform = 'scale(1.1)';
    setTimeout(() => (counterDisplay.style.transform = ''), 180);
    console.log('➕ Счётчик увеличен:', count);
  });
} else {
  console.warn('incrementButton or counterDisplay not found');
}

if (resetButton && counterDisplay) {
  resetButton.addEventListener('click', () => {
    count = 0;
    counterDisplay.textContent = count;
    console.log('🔄 Счётчик сброшен');
  });
} else {
  console.warn('resetButton or counterDisplay not found');
}

console.log('✅ 02-events-practice.js loaded — all handlers initialized');