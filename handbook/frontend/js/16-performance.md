# Блок 16: Производительность (Performance)

## Введение

**Производительность веб-приложения** влияет на:
- 📈 Конверсию (медленный сайт = потеря пользователей)
- 🔍 SEO (Google учитывает скорость)
- 💰 Расходы (меньше трафика и серверных ресурсов)
- 😊 Пользовательский опыт

**Core Web Vitals:**
- **LCP** (Largest Contentful Paint) — время загрузки основного контента (< 2.5s)
- **FID** (First Input Delay) — время до первого взаимодействия (< 100ms)
- **CLS** (Cumulative Layout Shift) — стабильность макета (< 0.1)

---

## Измерение производительности

### Chrome DevTools

**Performance tab:**
1. Откройте DevTools (F12)
2. Вкладка **Performance**
3. Нажмите **Record** (●)
4. Выполните действия на странице
5. Остановите запись
6. Анализируйте timeline

**Lighthouse:**
1. DevTools → **Lighthouse** tab
2. Выберите категории (Performance, Accessibility, SEO)
3. **Analyze page load**
4. Смотрите рекомендации

### Web Vitals API

```javascript
// Измерение Core Web Vitals
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log); // Cumulative Layout Shift
getFID(console.log); // First Input Delay
getLCP(console.log); // Largest Contentful Paint
```

### Performance API

```javascript
// Измерение времени выполнения
const t0 = performance.now();

// Ваш код
heavyOperation();

const t1 = performance.now();
console.log(`Execution time: ${t1 - t0}ms`);

// Navigation Timing
const perfData = performance.getEntriesByType('navigation')[0];
console.log('DOM Content Loaded:', perfData.domContentLoadedEventEnd);
console.log('Load Complete:', perfData.loadEventEnd);

// Resource Timing
const resources = performance.getEntriesByType('resource');
resources.forEach(resource => {
  console.log(`${resource.name}: ${resource.duration}ms`);
});
```

---

## Оптимизация JavaScript

### 1. Debounce и Throttle

```javascript
// Debounce - выполняется только после паузы
function debounce(func, delay) {
  let timeoutId;
  
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Использование
const search = debounce((query) => {
  fetch(`/api/search?q=${query}`)
    .then(res => res.json())
    .then(data => console.log(data));
}, 300);

input.addEventListener('input', (e) => search(e.target.value));

// Throttle - выполняется не чаще N раз в секунду
function throttle(func, limit) {
  let inThrottle;
  
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Использование
const handleScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 100);

window.addEventListener('scroll', handleScroll);
```

### 2. Lazy Loading (изображения)

```html
<!-- Native lazy loading -->
<img src="image.jpg" loading="lazy" alt="Description">

<!-- Intersection Observer API -->
<img data-src="image.jpg" class="lazy" alt="Description">
```

```javascript
// Intersection Observer для lazy loading
const images = document.querySelectorAll('img.lazy');

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      observer.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));
```

### 3. Code Splitting (динамический импорт)

```javascript
// До (всё загружается сразу)
import { heavyModule } from './heavy-module.js';

// После (загружается по требованию)
button.addEventListener('click', async () => {
  const { heavyModule } = await import('./heavy-module.js');
  heavyModule.doSomething();
});
```

### 4. Web Workers (тяжёлые вычисления)

```javascript
// main.js
const worker = new Worker('worker.js');

worker.postMessage({ data: largeArray });

worker.onmessage = (event) => {
  console.log('Result from worker:', event.data);
};

// worker.js
self.onmessage = (event) => {
  const data = event.data.data;
  
  // Тяжёлые вычисления
  const result = data.map(item => item * 2);
  
  self.postMessage(result);
};
```

### 5. Мемоизация

```javascript
function memoize(fn) {
  const cache = new Map();
  
  return function (...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Использование
const fibonacci = memoize((n) => {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(40)); // Быстро благодаря кешу
```

---

## Оптимизация DOM

### 1. DocumentFragment

```javascript
// Медленно (много reflow/repaint)
const list = document.getElementById('list');
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  list.appendChild(li); // Reflow на каждой итерации
}

// Быстро (один reflow)
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const li = document.createElement('li');
  li.textContent = `Item ${i}`;
  fragment.appendChild(li);
}
list.appendChild(fragment); // Один reflow
```

### 2. Виртуальный скроллинг

```javascript
class VirtualScroll {
  constructor(container, items, rowHeight) {
    this.container = container;
    this.items = items;
    this.rowHeight = rowHeight;
    this.visibleRows = Math.ceil(container.clientHeight / rowHeight);
    
    this.render();
    container.addEventListener('scroll', () => this.render());
  }
  
  render() {
    const scrollTop = this.container.scrollTop;
    const startIndex = Math.floor(scrollTop / this.rowHeight);
    const endIndex = startIndex + this.visibleRows;
    
    const visibleItems = this.items.slice(startIndex, endIndex);
    
    this.container.innerHTML = `
      <div style="height: ${this.items.length * this.rowHeight}px; position: relative;">
        ${visibleItems.map((item, i) => `
          <div style="position: absolute; top: ${(startIndex + i) * this.rowHeight}px; height: ${this.rowHeight}px;">
            ${item}
          </div>
        `).join('')}
      </div>
    `;
  }
}

// Использование
const container = document.getElementById('list');
const items = Array.from({ length: 10000 }, (_, i) => `Item ${i}`);
new VirtualScroll(container, items, 50);
```

### 3. Event Delegation

```javascript
// Медленно (много обработчиков)
document.querySelectorAll('.button').forEach(button => {
  button.addEventListener('click', handleClick);
});

// Быстро (один обработчик)
document.getElementById('container').addEventListener('click', (e) => {
  if (e.target.matches('.button')) {
    handleClick(e);
  }
});
```

---

## Оптимизация сети

### 1. Resource Hints

```html
<!-- Preconnect - устанавливает соединение заранее -->
<link rel="preconnect" href="https://api.example.com">

<!-- DNS-prefetch - резолвит DNS заранее -->
<link rel="dns-prefetch" href="https://api.example.com">

<!-- Prefetch - загружает ресурс для следующей навигации -->
<link rel="prefetch" href="/next-page.html">

<!-- Preload - загружает критичный ресурс -->
<link rel="preload" href="/critical.css" as="style">
<link rel="preload" href="/font.woff2" as="font" type="font/woff2" crossorigin>
```

### 2. Compression

```javascript
// На сервере (Express.js)
const compression = require('compression');
app.use(compression());

// Результат: gzip/brotli сжатие текстовых файлов
```

### 3. HTTP/2 Server Push

```javascript
// На сервере (Node.js)
const http2 = require('http2');

const server = http2.createSecureServer(options);

server.on('stream', (stream, headers) => {
  if (headers[':path'] === '/') {
    // Push critical CSS
    stream.pushStream({ ':path': '/style.css' }, (err, pushStream) => {
      pushStream.respondWithFile('style.css');
    });
  }
});
```

### 4. CDN и кеширование

```html
<!-- Cache-Control headers -->
<script>
  // В production - используйте CDN
  <script src="https://cdn.example.com/lib.min.js"></script>
</script>
```

---

## Оптимизация рендеринга

### 1. CSS Containment

```css
.card {
  /* Браузер изолирует layout/paint этого элемента */
  contain: layout paint;
}
```

### 2. will-change

```css
.animated-element {
  /* Подсказываем браузеру, что элемент будет анимироваться */
  will-change: transform, opacity;
}

.animated-element:hover {
  transform: scale(1.1);
}
```

### 3. requestAnimationFrame

```javascript
// Плохо - может вызвать jank
setInterval(() => {
  element.style.left = `${position}px`;
}, 16);

// Хорошо - синхронизировано с refresh rate
function animate() {
  position += speed;
  element.style.left = `${position}px`;
  requestAnimationFrame(animate);
}

animate();
```

### 4. requestIdleCallback

```javascript
// Выполнение во время простоя браузера
requestIdleCallback((deadline) => {
  while (deadline.timeRemaining() > 0 && tasks.length > 0) {
    const task = tasks.shift();
    task();
  }
});
```

---

## Профилирование памяти

### Chrome DevTools Memory Profiler

1. DevTools → **Memory** tab
2. **Heap snapshot** → Take snapshot
3. Ищите "Detached DOM nodes" (утечки памяти)
4. **Allocation timeline** — отслеживание выделения памяти

### Поиск утечек памяти

```javascript
// Утечка памяти - closure держит ссылку
function createHandler() {
  const largeData = new Array(1000000).fill('data');
  
  return function() {
    console.log(largeData[0]); // largeData не будет удалён
  };
}

// Исправлено
function createHandler() {
  const data = 'data';
  
  return function() {
    console.log(data);
  };
}

// Утечка - event listener не удалён
const element = document.getElementById('button');
element.addEventListener('click', handleClick);
// Нужно: element.removeEventListener('click', handleClick);
```

---

## Bundle Size Optimization

### Tree Shaking

```javascript
// utils.js
export function usedFunction() { /* ... */ }
export function unusedFunction() { /* ... */ } // Будет удалена

// main.js
import { usedFunction } from './utils.js';
```

### Dynamic Imports

```javascript
// Вместо
import Chart from 'chart.js';

// Используйте
button.addEventListener('click', async () => {
  const { Chart } = await import('chart.js');
  new Chart(ctx, config);
});
```

---

## Рекомендации

✅ Используйте **Lighthouse** для аудита  
✅ Применяйте **lazy loading** для изображений  
✅ Используйте **code splitting** для больших приложений  
✅ **Debounce/throttle** для частых событий  
✅ **Web Workers** для тяжёлых вычислений  
✅ **Virtual scrolling** для длинных списков  
✅ **Мемоизация** для дорогих функций  

❌ Не игнорируйте Core Web Vitals  
❌ Не делайте синхронные запросы  
❌ Не модифицируйте DOM в цикле  
❌ Не забывайте про утечки памяти  

**Переходите к практике!** 🚀
