# 07 — Медиа-галерея с лайтбоксом

## Введение

В этом уроке мы разберём, как сделать **адаптивную галерею фото** с:
- **CSS Grid** для отзывчивой раскладки без медиа-запросов
- **Ленивой загрузкой** (`loading="lazy"`) для оптимизации
- **Доступным лайтбоксом** (модалом) с клавиатурной навигацией
- **ARIA атрибутами** для скринридеров

Полный пример смотри в файле: **`03-media-gallery.html`**

---

## Часть 1: CSS переменные и дизайн-система

### Зачем CSS переменные?

```css
:root {
  --bg:     #f6f7fb;    /* фон страницы */
  --card:   #fff;       /* фон карточек */
  --muted:  #6b7280;    /* серый текст (подписи) */
  --accent: #0ea5a0;    /* цвет акцента (резервный для будущего) */
}
```

**Преимущества:**
1. **Централизованное управление** — если нужно изменить цвет, редактируешь одно место
2. **Скалируемость** — легко добавить dark mode: `@media (prefers-color-scheme: dark) { :root { --bg: #1a1a1a; } }`
3. **Читаемость** — `background: var(--bg)` понятнее, чем `background: #f6f7fb`

**Использование:**
```css
body { background: var(--bg); }
.photo { background: var(--card); }
.lead { color: var(--muted); }
```

---

## Часть 2: Галерея как CSS Grid

### Волшебное свойство `auto-fit`

```css
.gallery {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}
```

**Расшифровка по словам:**
- `display: grid` — включаем Grid раскладку
- `grid-template-columns` — параметры для **колонок**
- `repeat(auto-fit, ...)` — **повторяй** колонку сколько раз влезет в контейнер
- `minmax(200px, 1fr)` — каждая колонка:
  - **минимум 200px** (размер карточки фото)
  - **максимум 1fr** (равная часть от оставшегося места)

### Как это работает на разных экранах?

```
📱 Мобильный (375px):
  375 ÷ 200 = 1.87 → влезает 1 колонка
  Результат: 1 фото в ряд

💻 Планшет (768px):
  768 ÷ 200 = 3.84 → влезают 3 колонки
  Результат: 3 фото в ряд (каждая ≈256px)

🖥️ Десктоп (1200px):
  1200 ÷ 200 = 6 → влезают 6 колонок
  Результат: 6 фото в ряд (каждая ≈200px)
```

**Без `auto-fit` пришлось бы писать медиа-запросы:**
```css
/* Вот так НЕ надо делать: */
@media (min-width: 768px) { grid-template-columns: repeat(3, 1fr); }
@media (min-width: 1024px) { grid-template-columns: repeat(4, 1fr); }
@media (min-width: 1200px) { grid-template-columns: repeat(6, 1fr); }

/* С auto-fit всё работает автоматически! */
```

---

## Часть 3: Карточка фото с интерактивностью

### HTML структура

```html
<figure class="photo" data-index="0">
  <button aria-label="Открыть изображение: Мост на рассвете"
          data-src="https://picsum.photos/id/1015/1200/800"
          data-alt="Мост на рассвете">
    <img src="https://picsum.photos/id/1015/600/400" 
         alt="Мост на рассвете" 
         loading="lazy" />
  </button>
  <figcaption>Мост на рассвете — атмосфера и туман</figcaption>
</figure>
```

**Каждая часть имеет назначение:**

| Элемент | Назначение |
|---------|-----------|
| `<figure>` | Семантический тег для медиа-контента (фото + подпись) |
| `<button>` | Клик по фото открывает лайтбокс (доступность!) |
| `data-index="0"` | Номер фото для JS (какое это по счёту) |
| `data-src="...1200/800"` | URL **большой версии** для модала |
| `data-alt="..."` | Текст для слабовидящих |
| `<img loading="lazy">` | Браузер загружает только при прокрутке |
| `<figcaption>` | Подпись под фото |

### CSS для карточки

```css
figure.photo {
  background: var(--card);
  border-radius: 10px;
  overflow: hidden;           /* срезаем углы изображению */
  margin: 0;
  box-shadow: 0 4px 10px rgba(16,24,40,0.06);
  transition: transform .28s cubic-bezier(.2,.9,.25,1),
              box-shadow .28s ease;
}

figure.photo:hover {
  transform: translateY(-8px);              /* поднимаем на 8px */
  box-shadow: 0 14px 26px rgba(16,24,40,0.12);  /* тень сильнее */
}
```

**Как работает hover-эффект:**

1. **По умолчанию** — карточка на месте с мягкой тенью
2. **Наводишь курсор** — карточка поднимается на 8px, тень становится объёмнее
3. **Уходишь** — плавно возвращается на место (280ms)

**Важный момент:** `transition` написан на **базовом состоянии** (не на `:hover`). Это значит, что **оба направления** (в и из hover) будут плавные.

```css
/* Неправильно: переход только туда, обратно моментально */
figure.photo:hover { transition: transform .28s; }

/* Правильно: переход туда и обратно */
figure.photo { transition: transform .28s; }
figure.photo:hover { transform: translateY(-8px); }
```

### `cubic-bezier(.2,.9,.25,1)` — что это?

Это **функция кривой** для более естественной анимации. Вместо линейной скорости:

```
Линейная (скучная):
┌─────────────────────  конец
│
│ скорость
│
└─────────────────────  начало
```

```
Cubic-bezier (пружинистая):
    ╱╲
   ╱  ╲    быстро в начале, замедление в конце
  ╱    ╲   как отскок мяча
 ╱      ╲
```

Предзагруженные примеры:
- `ease` — медленно, быстро, медленно
- `ease-out` — быстро, потом замедление
- `cubic-bezier(.17,.67,.83,.67)` — пружина

---

## Часть 4: Переиспользование кнопок

### Проблема

```html
<!-- Вариант 1: <div> — не семантичен, не фокусируется -->
<div class="gallery-item" @click="openModal">
  <img src="..." />
</div>

<!-- Вариант 2: <a href="#"> — путает браузер (это ссылка?) -->
<a href="#">
  <img src="..." />
</a>
```

### Решение: использовать `<button>`

```html
<button aria-label="Открыть изображение: Мост на рассвете"
        data-src="https://picsum.photos/id/1015/1200/800"
        data-alt="Мост на рассвете">
  <img src="https://picsum.photos/id/1015/600/400" alt="Мост на рассвете" />
</button>
```

**Почему `<button>`?**
1. **Семантика** — скринридер говорит: "это кнопка, нужно нажать"
2. **Доступность из коробки** — работает с клавиатурой (Tab, Enter, Space)
3. **Стили** — можно убрать через `all: unset` и добавить свои

### CSS для кнопки

```css
figure.photo button {
  all: unset;           /* убираем все стили по умолчанию */
  display: block;       /* блочный элемент */
  cursor: pointer;      /* курсор меняется на указатель */
  width: 100%;
  height: 100%;         /* занимает всю карточку */
}
```

**`all: unset` — что это убирает:**
- Границы (border)
- Фон (background)
- Шрифт и текст
- Padding и margin
- Все стили браузера по умолчанию

---

## Часть 5: Лайтбокс — модальное окно

### HTML структура

```html
<div class="lightbox" 
     role="dialog" 
     aria-hidden="true" 
     aria-label="Просмотр изображения" 
     id="lightbox">
  
  <div class="lightbox__panel">
    <img class="lightbox__img" id="lightboxImg" src="" alt="" />
    <div class="lightbox__meta" id="lightboxCaption"></div>
  </div>
  
  <div class="lightbox__controls">
    <button id="prevBtn" aria-label="Предыдущее">◀</button>
    <button id="nextBtn" aria-label="Следующее">▶</button>
  </div>
</div>
```

**Атрибуты для доступности (ARIA):**
- `role="dialog"` — скринридер знает, что это модальное окно
- `aria-hidden="true"` — по умолчанию скрыто от программ чтения
- `aria-label="..."` — описание для скринридера

### CSS для лайтбокса

```css
.lightbox {
  position: fixed;          /* прикреплена к экрану (не прокручивается) */
  inset: 0;                 /* занимает весь экран (top/right/bottom/left = 0) */
  display: none;            /* по умолчанию невидима */
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.6);  /* полупрозрачный чёрный фон */
  z-index: 9999;            /* над всем остальным на странице */
}

/* Показываем, только если aria-hidden="false" */
.lightbox[aria-hidden="false"] {
  display: flex;
}
```

**Почему использовать селектор `[aria-hidden="false"]` вместо класса?**

```javascript
// Вариант 1: с классом (дублируем информацию)
lightbox.classList.add('is-open');
// CSS: .lightbox.is-open { display: flex; }

// Вариант 2: с aria-hidden (одна истина для всех)
lightbox.setAttribute('aria-hidden', 'false');
// CSS: .lightbox[aria-hidden="false"] { display: flex; }
// Плюс: доступность работает автоматически!
```

**Преимущество варианта 2:**
- Стили и доступность **синхронизированы**
- Когда изменяешь `aria-hidden`, сразу видны и стили, и доступность

---

## Часть 6: JavaScript — управление лайтбоксом

### Инициализация переменных

```javascript
const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightboxImg');
const lbCaption = document.getElementById('lightboxCaption');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const figures = Array.from(gallery.querySelectorAll('figure.photo'));
let current = -1;  // индекс текущей открытой картинки
```

**Почему `let current = -1` (не 0)?**
- Пока пользователь ничего не нажал, модал закрыт
- `-1` — сигнал, что модал закрыт (или используй флаг `let isOpen = false`)

### Функция `open(index)` — открыть фото

```javascript
function open(index) {
  const fig = figures[index];
  if (!fig) return;  // защита от ошибки индекса
  
  const btn = fig.querySelector('button');
  const src = btn.getAttribute('data-src');    // большая версия
  const alt = btn.getAttribute('data-alt');    // для скринридера
  const caption = fig.querySelector('figcaption')?.textContent || '';
  
  // Вставляем данные в элементы модала
  lbImg.src = src;
  lbImg.alt = alt;
  lbCaption.textContent = caption;
  
  // Показываем модал
  lightbox.setAttribute('aria-hidden', 'false');
  current = index;
  
  // Даём фокус кнопке "Следующее" для удобства клавиатурной навигации
  nextBtn.focus();
}
```

**`fig.querySelector('figcaption')?.textContent || ''`**
- `?.` (optional chaining) — если элемент не найден, вернёшься `undefined`
- `|| ''` (логический OR) — если `undefined`, вернёшься пустую строку
- Без этой защиты код бы упал с ошибкой

### Функция `close()` — закрыть лайтбокс

```javascript
function close() {
  lightbox.setAttribute('aria-hidden', 'true');
  lbImg.src = '';
  lbCaption.textContent = '';
  current = -1;
}
```

**Зачем очищать `src` и `textContent`?**
- Память: не держим в памяти большие изображения, когда модал закрыт
- Безопасность: если вернёшься на страницу, старые данные не видны

### Циклическая навигация с модулем

```javascript
function showNext() {
  open((current + 1) % figures.length);
}

function showPrev() {
  open((current - 1 + figures.length) % figures.length);
}
```

**Оператор `%` (modulo) — остаток от деления:**

```
Если у нас 6 фото (индексы 0-5):

showNext() из фото 4:
  (4 + 1) % 6 = 5 % 6 = 5  → фото 5 (следующее)

showNext() из фото 5:
  (5 + 1) % 6 = 6 % 6 = 0  → фото 0 (циклим в начало! 🔄)

showPrev() из фото 0:
  (0 - 1 + 6) % 6 = 5 % 6 = 5  → фото 5 (циклим в конец!)
```

**Почему `+ figures.length` в `showPrev`?**
- В JS `-1 % 6 = -1` (отрицательный результат!)
- Добавляем длину массива: `-1 + 6 = 5`, потом `5 % 6 = 5` ✅

---

## Часть 7: Обработчики событий

### Клик по фото открывает лайтбокс

```javascript
gallery.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  
  const fig = btn.closest('figure.photo');
  const index = Number(fig.getAttribute('data-index'));
  open(index);
});
```

**`e.target.closest('button')`:**
- Если кликнул на `<img>`, ищет ближайшего родителя `<button>`
- Если кликнул на `<button>` — находит сам себя
- Если нет кнопки выше — возвращает `null`

**Почему `closest()` вместо просто проверки `e.target`?**
```html
<button>
  <img src="..." />    <!-- клик сюда -->
</button>
```

Если кликнешь на `<img>`, то `e.target` — это `<img>`, не `<button>`. С `closest()` находим нужный элемент.

### Кнопки "Назад" и "Вперёд"

```javascript
nextBtn.addEventListener('click', e => {
  e.stopPropagation();  // не пробиваем клик выше в lightbox
  showNext();
});

prevBtn.addEventListener('click', e => {
  e.stopPropagation();
  showPrev();
});
```

**`e.stopPropagation()`:**
- Клик на кнопке не проходит дальше вверх по DOM
- Без этого клик на `prevBtn` или `nextBtn` мог бы закрыть модал (см. ниже)

### Клик вне картинки закрывает модал

```javascript
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) close();
});
```

**`e.target === lightbox`:**
- Проверяем, что кликнули **именно** на тёмный фон
- Если кликнули на картинку или кнопку — не закрываем
- Поэтому выше нужен `stopPropagation()` на кнопках!

---

## Часть 8: Клавиатурная навигация

### Основные клавиши

```javascript
document.addEventListener('keydown', e => {
  // Если модал закрыт, не реагируем на клавиши
  if (lightbox.getAttribute('aria-hidden') === 'true') return;
  
  if (e.key === 'Escape') close();
  if (e.key === 'ArrowRight') showNext();
  if (e.key === 'ArrowLeft') showPrev();
});
```

**Стандартные клавиши в модальных окнах:**
- `Escape` — закрыть модал (де-факто стандарт)
- `ArrowRight` / `ArrowLeft` — следующее/предыдущее фото

### Управление фокусом Tab

```javascript
lightbox.addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    // Циклим фокус между двумя кнопками
    if (document.activeElement === nextBtn) {
      prevBtn.focus();
    } else {
      nextBtn.focus();
    }
  }
});
```

**Зачем?**
- При нажатии Tab не надо выходить из модала в остальную страницу
- Пользователь остаётся в контексте модального окна
- Это называется **focus trap** или **focus containment**

---

## Часть 9: Оптимизация — предзагрузка соседних фото

### Простая предзагрузка

```javascript
function preload(src) {
  const im = new Image();
  im.src = src;  // браузер начнёт загружать, но не вставляет в страницу
}
```

**Как это работает:**
1. Создаём скрытый `<img>` элемент
2. Устанавливаем `src`
3. Браузер начнёт загружать, пока мы ждём
4. Когда пользователь нажмёт "Вперёд", картинка уже в кэше

### Предзагрузка соседних фото

```javascript
function preloadNeighbors(i) {
  const next = (i + 1) % figures.length;
  const prev = (i - 1 + figures.length) % figures.length;
  
  preload(figures[next].querySelector('button').getAttribute('data-src'));
  preload(figures[prev].querySelector('button').getAttribute('data-src'));
}
```

**Результат:**
- Откроешь фото 3 → загружаются фото 2 и 4
- Откроешь фото 5 → загружаются фото 4 и 0 (циклит!)
- Клик "Вперёд" кажется **мгновенным** ⚡

---

## Часть 10: Доступность — скрыть страницу для скринридеров

### Проблема

Когда модал открыт, пользователь со скринридером может:
- Нажать Tab и "выбраться" из модала в остальную страницу
- Услышать весь контент за модалом (забуду, что они там вообще?)

### Решение: `aria-hidden` на соседних элементах

```javascript
const pageChildren = Array.from(document.body.children)
  .filter(n => n !== lightbox);

function setInert(hide) {
  pageChildren.forEach(n => {
    n.setAttribute('aria-hidden', hide ? 'true' : 'false');
  });
}

// Обновляем open и close функции
const openWrap = open;
open = function(i) {
  setInert(true);   // скрываем всю страницу
  openWrap(i);      // открываем модал
};

const closeWrap = close;
close = function() {
  setInert(false);  // показываем страницу
  closeWrap();      // закрываем модал
};
```

**Результат:**
- Скринридер видит **только** модал и его кнопки
- Остальная страница как бы "не существует"
- Это улучшает UX для людей с нарушениями зрения

---

## Часть 11: `loading="lazy"` для оптимизации

### Без lazy-loading

```html
<!-- При загрузке страницы браузер загружает ВСЕ 6 фото -->
<img src="https://picsum.photos/id/1015/600/400" />
<img src="https://picsum.photos/id/1016/600/400" />
<img src="https://picsum.photos/id/1020/600/400" />
<!-- ... ещё 3 ... -->

<!-- Результат: 6 × 150KB = 900KB сразу -->
```

### С lazy-loading

```html
<!-- Браузер загружает только, когда фото в области видимости -->
<img src="https://picsum.photos/id/1015/600/400" loading="lazy" />
<!-- ... -->

<!-- Результат: только видимые фото (~300KB на мобильке) -->
```

**Экономия:**
- Мобилька (4G): вместо 5 сек можно 1-2 сек ⚡
- Трафик: вместо 900KB можно 300KB на первый просмотр
- Батарея: телефон экономит энергию, не загружая лишнее

**Поддержка:**
- Chrome, Firefox, Edge — поддерживают
- Safari 15+ — поддерживает
- Fallback: если браузер не поддерживает, просто загружает обычно

---

## Часть 12: Best Practices & Tips

### ✅ Как использовать этот код

1. **Скопируй структуру HTML** — используй `<figure>`, `<button>`, `data-*` атрибуты
2. **Адаптируй стили** — цвета, размеры, тени под свой дизайн
3. **Понимай JavaScript** — не просто копируй, разберись логика
4. **Тестируй на клавиатуре** — Tab, Arrow keys, Escape, Enter
5. **Проверь скринридер** — используй NVDA (Windows) или VoiceOver (Mac)

### ⚠️ Частые ошибки

```javascript
// ❌ Неправильно: забыл про currentIndex при клике на кнопки
nextBtn.addEventListener('click', showNext);  // может быть current = -1!

// ✅ Правильно: проверяй current перед открытием
function showNext() {
  if (current < 0) return;  // если модал закрыт, не делаем ничего
  open((current + 1) % figures.length);
}
```

```css
/* ❌ Неправильно: transition на :hover только */
.photo:hover { transition: transform .3s; }

/* ✅ Правильно: transition на базовом состоянии */
.photo { transition: transform .3s; }
.photo:hover { transform: translateY(-8px); }
```

```html
<!-- ❌ Неправильно: <div> вместо <button> -->
<div class="clickable" @click="open()">
  <img src="..." />
</div>

<!-- ✅ Правильно: семантичная <button> -->
<button aria-label="...">
  <img src="..." />
</button>
```

### 📚 Дополнительные ресурсы

- [MDN: CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [MDN: ARIA Dialog](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role)
- [MDN: Loading attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#loading)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) — стандарты доступности

---

## Резюме

| Концепция | Зачем | Как |
|-----------|-------|-----|
| CSS Grid `auto-fit` | Адаптивность без медиа-запросов | `grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))` |
| `loading="lazy"` | Оптимизация загрузки | `<img loading="lazy">` |
| `<button>` вместо `<div>` | Доступность и семантика | Встроенная фокусировка, поддержка клавиатуры |
| `aria-hidden` | Скринридеры видят только модал | Синхронируем с CSS через селектор атрибута |
| Клавиатурная навигация | Пользователи без мыши | `keydown` события, focus management |
| Предзагрузка соседних фото | Плавная навигация | Создаём скрытые `<img>` для предварительной загрузки |

---

## Домашнее задание 🏋️

1. Сделай свою версию галереи с твоими фото
2. Добавь кнопку "Закрыть" (✕) в правый верхний угол модала
3. Добавь счётчик фото ("3 из 6") в `lightbox__meta`
4. Протестируй с клавиатурой и скринридером
5. Улучши анимацию — измени `cubic-bezier` значения

---

**Готов к вопросам! 🚀**
