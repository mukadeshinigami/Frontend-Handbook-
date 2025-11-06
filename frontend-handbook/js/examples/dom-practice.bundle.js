const mainTitle = document.getElementById('main-title');
if (mainTitle) mainTitle.textContent = "🎉 Добро пожаловать в DOM!";

// Все элементы, используемые на странице
const paragraph = document.getElementById('paragraph');
const toggleText = document.getElementById('toggle-text');
const nameInput = document.getElementById('name-input');
const greeting = document.getElementById('greeting');
const counterDisplay = document.getElementById('counter');

// Кнопки
const btnChangeText = document.getElementById('btn-change-text');
const btnToggleColor = document.getElementById('btn-toggle-color');
const btnToggle = document.getElementById('btn-toggle');
const btnIncrement = document.getElementById('btn-increment');
const btnReset = document.getElementById('btn-reset');         

const output = document.querySelector('.output');

if (btnChangeText && paragraph) {
  btnChangeText.addEventListener('click', () => {
    paragraph.textContent = "Вы изменили текст параграфа!";
  });
}

if (btnToggle && toggleText) {
  btnToggle.addEventListener('click', () => {
    toggleText.classList.toggle('hidden');
    if (toggleText.classList.contains('hidden')) {
      btnToggle.textContent = "Показать текст";
    } else {
      btnToggle.textContent = "Скрыть текст";
    }
  });
}

nameInput.addEventListener('input', () => {
  const name = nameInput.value;

  if (name === '') {
    greeting.textContent = `Привет, Гость!`;
  }
  else {
    greeting.textContent = `Привет, ${name}!`;
    output.classList.add('highlight');
  }
});
  
let count = 0;

btnIncrement.addEventListener('click', () => {
  count++;
  if (counterDisplay) {
    counterDisplay.textContent = `${count}`;
  }
});

btnReset.addEventListener('click', () => {
  count--;
  if (counterDisplay) {
    counterDisplay.textContent = `${count}`;
  }
});