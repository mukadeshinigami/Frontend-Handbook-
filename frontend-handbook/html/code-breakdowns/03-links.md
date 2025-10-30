# 03 — Ссылки, изображения и медиа

## Введение

В этом уроке разберём, как правильно использовать **ссылки**, **изображения**, **аудио** и **видео** с учётом доступности, SEO и производительности.

Полный пример смотри в файле: **`examples/03-media-gallery.html`**

---

## Часть 1: Ссылки — `<a>`

### Базовая ссылка

```html
<a href="https://example.com">Посетить сайт</a>
```

**Атрибуты:**
- `href` — **куда** ведёт ссылка
- `title` — подсказка при наведении (опционально)
- `target="_blank"` — открыть в новой вкладке

### Типы ссылок

```html
<!-- Абсолютная ссылка (внешняя) -->
<a href="https://example.com">Внешний сайт</a>

<!-- Относительная ссылка (на свой сайт) -->
<a href="/pages/about.html">О нас</a>
<a href="../index.html">На главную</a>

<!-- Якорь на этой странице -->
<a href="#section1">Перейти к разделу 1</a>

<!-- Email -->
<a href="mailto:info@example.com">Написать</a>

<!-- Телефон -->
<a href="tel:+79991234567">Позвонить</a>
```

### Правильный текст ссылки

```html
<!-- ❌ Плохо: невнятный текст -->
Нажми <a href="/about">сюда</a> для подробнее.
Подробнее <a href="/about">читай тут</a>.

<!-- ✅ Хорошо: описательный текст -->
<a href="/about">Подробнее о компании</a>
<a href="/contact">Свяжитесь с нами</a>
```

**Почему это важно?**
- Скринридер читает текст ссылки отдельно (без контекста)
- Пользователь должен понять, куда ведёт, не читая всё вокруг
- Поисковики анализируют текст ссылок (SEO)

### Атрибут `rel` — отношение к ссылке

```html
<!-- Небезопасная внешняя ссылка -->
<a href="https://untrusted.com" rel="noopener noreferrer">
  Ненадёжный источник
</a>

<!-- Спама нет, не передавай авторитет -->
<a href="https://comment-spam.com" rel="nofollow">
  Комментарий с ссылкой
</a>

<!-- Альтернативная версия страницы (для поисковиков) -->
<link rel="alternate" hreflang="en" href="https://example.com/en/" />
```

**Частые `rel` значения:**
- `nofollow` — не передавай авторитет (комментарии, пользовательский контент)
- `noopener` — не даёшь доступ к `window.opener` (безопасность)
- `noreferrer` — не отправляй HTTP Referer
- `external` — это внешняя ссылка

---

## Часть 2: Изображения — `<img>`

### Базовое изображение

```html
<img src="photo.jpg" alt="Описание фото" />
```

**Обязательные атрибуты:**
- `src` — путь к файлу
- `alt` — описание (для доступности и SEO!)

### Полный набор атрибутов

```html
<img 
  src="image.jpg" 
  alt="Человек работает за компьютером"
  width="800"
  height="600"
  loading="lazy"
  srcset="image-small.jpg 600w, image-large.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 800px"
  decoding="async"
/>
```

### Атрибут `alt` — критически важен!

```html
<!-- ❌ Плохо: без alt -->
<img src="sunset.jpg" />

<!-- ❌ Плохо: alt = "фото" (не информативен) -->
<img src="sunset.jpg" alt="фото" />

<!-- ✅ Хорошо: описание того, что видно -->
<img src="sunset.jpg" alt="Закат над морем, оранжевое небо" />

<!-- ✅ Если фото декоративное, alt="" (пустой) -->
<img src="decoration.jpg" alt="" aria-hidden="true" />
```

**Без правильного `alt`:**
- Слабовидящие не понимают, что на картинке
- Если картинка не загрузилась — текста не видно
- Поисковики не индексируют содержимое фото

### `width` и `height` — зарезервировать место

```html
<img 
  src="image.jpg" 
  alt="..."
  width="800"
  height="600"
/>
```

**Зачем?**
- Браузер знает размер ещё до загрузки
- Не будет "прыганья" контента (layout shift)
- Улучшает Core Web Vitals (показатель Google)

### `loading="lazy"` — ленивая загрузка

```html
<!-- Загружается только когда видна в окне -->
<img src="photo.jpg" alt="..." loading="lazy" />

<!-- Загружается сразу (по умолчанию) -->
<img src="hero.jpg" alt="..." loading="eager" />
```

**Результат:**
- Быстрее загружается страница
- Экономит трафик (если пользователь не прокручивает до конца)

### `srcset` и `sizes` — адаптивные изображения

```html
<img 
  src="image-medium.jpg"
  alt="Пейзаж"
  srcset="
    image-small.jpg 600w,
    image-medium.jpg 1024w,
    image-large.jpg 1920w
  "
  sizes="
    (max-width: 600px) 100vw,
    (max-width: 1024px) 90vw,
    1024px
  "
/>
```

**Как работает:**
- Браузер выбирает нужное изображение в зависимости от ширины экрана
- Мобильный получает маленькую версию, десктоп — большую
- Экономит трафик на мобилке, поднимает качество на десктопе

---

## Часть 3: Фигуры и подписи

```html
<figure>
  <img src="chart.png" alt="График продаж за 2024 год" />
  <figcaption>Рост продаж в первой половине года</figcaption>
</figure>
```

**`<figure>` и `<figcaption>`:**
- `<figure>` — это изображение + подпись как одно целое
- `<figcaption>` — подпись (обязательна для смысла)
- Скринридер читает оба элемента вместе

---

## Часть 4: Видео — `<video>`

### Базовое видео

```html
<video width="320" height="240" controls>
  <source src="movie.mp4" type="video/mp4" />
  <source src="movie.webm" type="video/webm" />
  Твой браузер не поддерживает видео.
</video>
```

**Атрибуты:**
- `controls` — показать кнопки воспроизведения
- `width` и `height` — размеры
- `<source>` — несколько форматов (браузер выбирает поддерживаемый)
- Fallback текст для старых браузеров

### Атрибуты видео

```html
<video 
  width="640" 
  height="360"
  controls
  autoplay
  muted
  loop
  poster="thumbnail.jpg"
>
  <source src="video.mp4" type="video/mp4" />
</video>
```

**Атрибуты:**
- `autoplay` — начать воспроизведение при загрузке (требует `muted`!)
- `muted` — без звука (для `autoplay`)
- `loop` — повтор с начала при завершении
- `poster` — изображение до нажатия play

### Форматы видео

```html
<video controls>
  <source src="video.mp4" type="video/mp4" />      <!-- Chrome, Safari, Edge -->
  <source src="video.webm" type="video/webm" />    <!-- Chrome, Firefox, Edge -->
  <source src="video.ogv" type="video/ogg" />      <!-- Firefox, Opera -->
</video>
```

**Форматы по приоритету:**
1. **MP4** — самый совместимый (используй всегда)
2. **WebM** — лучше сжимается, но не в Safari
3. **Ogg** — редко, для старых Firefox

---

## Часть 5: Аудио — `<audio>`

```html
<audio controls>
  <source src="song.mp3" type="audio/mpeg" />
  <source src="song.ogg" type="audio/ogg" />
  Твой браузер не поддерживает аудио.
</audio>
```

**Атрибуты те же:**
- `controls`, `autoplay`, `muted`, `loop`

```html
<!-- С плейлистом -->
<audio controls>
  <source src="track1.mp3" type="audio/mpeg" />
</audio>

<audio controls>
  <source src="track2.mp3" type="audio/mpeg" />
</audio>
```

---

## Часть 6: Встроенный контент — `<iframe>`

### Встроить видео YouTube

```html
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="Название видео"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
```

**Атрибуты:**
- `src` — ссылка на встроенный контент
- `title` — описание (для скринридеров и доступности)
- `allow` — какие разрешения (камера, микрофон и т.д.)
- `allowfullscreen` — может ли развёрнуться на весь экран

### Встроить Google Maps

```html
<iframe
  width="100%"
  height="400"
  src="https://www.google.com/maps/embed?pb=..."
  allowfullscreen=""
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade">
</iframe>
```

---

## Part 7: Best Practices для медиа

### ✅ Правильно

```html
<!-- Изображение с описанием -->
<img 
  src="photo.jpg" 
  alt="Команда разработчиков на встрече"
  width="800"
  height="600"
  loading="lazy"
/>

<!-- Ленивая загрузка для видео -->
<video width="640" height="360" controls loading="lazy">
  <source src="video.mp4" type="video/mp4" />
</video>

<!-- Фигура с подписью -->
<figure>
  <img src="chart.png" alt="..." />
  <figcaption>Описание графика</figcaption>
</figure>

<!-- Адекватный текст ссылки -->
<a href="/about">Подробнее о компании</a>
```

### ❌ Неправильно

```html
<!-- Без alt -->
<img src="photo.jpg" />

<!-- Невнятный alt -->
<img src="photo.jpg" alt="картинка" />

<!-- Плохой текст ссылки -->
<a href="/about">Нажми сюда</a>

<!-- Видео без title в iframe -->
<iframe src="..."></iframe>

<!-- Без type в source -->
<video>
  <source src="video.mp4" />
</video>
```

---

## Чек-лист

- [ ] Все ссылки имеют описательный текст?
- [ ] Все изображения имеют `alt`?
- [ ] Изображения имеют `width` и `height`?
- [ ] Используется `loading="lazy"` где нужно?
- [ ] Видео имеет `controls` и несколько форматов?
- [ ] `<figure>` с `<figcaption>` для графиков и диаграмм?
- [ ] `rel="nofollow"` для непроверенных ссылок?

---

## Домашнее задание 🏋️

1. Добавь 3 изображения с правильным `alt` и размерами
2. Встрой видео YouTube с `title`
3. Добавь ссылки с описательным текстом
4. Используй `<figure>` и `<figcaption>` для одного изображения
5. Добавь `rel="nofollow"` к подозрительной ссылке
6. Проверь: работают ли `srcset` на мобильном?

**Готов к вопросам! 🚀**
