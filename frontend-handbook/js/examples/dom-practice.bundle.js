// ============================================
// dom-practice.bundle.js — externalized script for dom-practice.html
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

// Меняем заголовок при загрузке страницы (если элемент найден)
if (mainTitle) mainTitle.textContent = '🎉 Добро пожаловать в DOM!';

// Меняем подзаголовок
const subtitleEl = document.querySelector('.subtitle');
if (subtitleEl) subtitleEl.textContent = 'Эта страница была изменена с помощью JavaScript!';

// Изменение текста по клику
if (btnChangeText && paragraph) {
  btnChangeText.addEventListener('click', function() {
    paragraph.textContent = '✅ Текст изменён! Это было сделано через textContent.';
  });
}

// Переключение класса (цвет)
if (btnToggleColor && paragraph) {
  btnToggleColor.addEventListener('click', function() {
    paragraph.classList.toggle('blue-text');
  });
}

// Показать/Скрыть элемент
if (btnToggle && toggleText) {
  btnToggle.addEventListener('click', function() {
    toggleText.classList.toggle('hidden');
    if (toggleText.classList.contains('hidden')) {
      btnToggle.textContent = 'Показать текст';
    } else {
      btnToggle.textContent = 'Скрыть текст';
    }
  });
}

// Динамическое обновление ввода
if (nameInput && greeting) {
  nameInput.addEventListener('input', function() {
    const name = nameInput.value;
    if (name.trim() === '') {
      greeting.textContent = 'Здесь появится приветствие...';
      greeting.classList.remove('highlight');
    } else {
      greeting.textContent = `👋 Привет, ${name}!`;
      greeting.classList.add('highlight');
    }
  });
}

// Счётчик кликов
let count = 0;
if (btnIncrement && counterDisplay) {
  btnIncrement.addEventListener('click', function() {
    count++;
    counterDisplay.textContent = count;
    counterDisplay.style.transform = 'scale(1.2)';
    setTimeout(() => counterDisplay.style.transform = 'scale(1)', 200);
  });
}
if (btnReset && counterDisplay) {
  btnReset.addEventListener('click', function() {
    count = 0;
    counterDisplay.textContent = count;
  });
}

console.log('🚀 dom-practice.bundle.js загружен');
