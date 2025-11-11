# Блок 10: ES6 Modules (import/export)

## Введение

**Модули** — способ организации кода в отдельные файлы с явным экспортом/импортом.

**Преимущества:**
- ✅ Изоляция кода (свой scope)
- ✅ Переиспользование
- ✅ Явные зависимости
- ✅ Tree-shaking (удаление неиспользуемого кода)

---

## Базовый синтаксис

### Export (экспорт)

```javascript
// math.js

// Named exports (именованные)
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}
export class Calculator {
  multiply(a, b) {
    return a * b;
  }
}

// Или экспорт списком
const PI = 3.14159;
function add(a, b) {
  return a + b;
}
export { PI, add };

// Default export (экспорт по умолчанию)
export default function subtract(a, b) {
  return a - b;
}
```

### Import (импорт)

```javascript
// app.js

// Именованный импорт
import { PI, add } from './math.js';
console.log(PI); // 3.14159
console.log(add(2, 3)); // 5

// Импорт с переименованием
import { add as sum } from './math.js';
console.log(sum(2, 3)); // 5

// Импорт всего модуля
import * as math from './math.js';
console.log(math.PI);
console.log(math.add(2, 3));

// Импорт default
import subtract from './math.js';
console.log(subtract(5, 3)); // 2

// Импорт default + named
import subtract, { PI, add } from './math.js';
```

---

## Named vs Default Export

```javascript
// utils.js

// Named exports (можно несколько)
export const VERSION = '1.0.0';
export function log(message) {
  console.log(message);
}
export function warn(message) {
  console.warn(message);
}

// Default export (только один в файле)
export default class Logger {
  log(message) {
    console.log('[LOG]', message);
  }
}
```

```javascript
// app.js

// Импорт default (имя можем выбрать любое)
import Logger from './utils.js';
import MyLogger from './utils.js'; // Тоже работает

// Импорт named (имя должно совпадать)
import { VERSION, log } from './utils.js';

// Оба вместе
import Logger, { VERSION, log } from './utils.js';
```

---

## Динамический импорт

```javascript
// Асинхронная загрузка модуля
async function loadMath() {
  const math = await import('./math.js');
  console.log(math.add(2, 3));
}

// Условный импорт
if (condition) {
  import('./feature.js').then(module => {
    module.init();
  });
}

// Ленивая загрузка
button.addEventListener('click', async () => {
  const { animate } = await import('./animations.js');
  animate(element);
});
```

---

## Структура проекта

```
project/
├── index.html
├── js/
│   ├── app.js          (главный файл)
│   ├── utils/
│   │   ├── math.js
│   │   └── strings.js
│   ├── components/
│   │   ├── Button.js
│   │   └── Modal.js
│   └── services/
│       ├── api.js
│       └── storage.js
```

```html
<!-- index.html -->
<script type="module" src="js/app.js"></script>
```

```javascript
// js/app.js
import { Button } from './components/Button.js';
import { api } from './services/api.js';

const button = new Button();
const data = await api.fetchData();
```

---

## Примеры модулей

### Утилиты

```javascript
// utils/math.js
export function sum(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

export function average(arr) {
  return sum(arr) / arr.length;
}

export function max(arr) {
  return Math.max(...arr);
}
```

### API клиент

```javascript
// services/api.js
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  async get(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    return response.json();
  }
  
  async post(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

export const api = new ApiClient('https://api.example.com');
```

### Компоненты

```javascript
// components/Button.js
export default class Button {
  constructor(text, onClick) {
    this.element = document.createElement('button');
    this.element.textContent = text;
    this.element.addEventListener('click', onClick);
  }
  
  render(container) {
    container.appendChild(this.element);
  }
}
```

---

## Re-export (реэкспорт)

```javascript
// components/index.js
export { Button } from './Button.js';
export { Modal } from './Modal.js';
export { Card } from './Card.js';

// Использование
import { Button, Modal, Card } from './components/index.js';
```

---

## Особенности модулей

```javascript
// 1. Модули выполняются один раз
import './module.js';
import './module.js'; // Не выполнится повторно

// 2. Модули всегда в strict mode
// Нет необходимости писать 'use strict'

// 3. this в модулях = undefined
console.log(this); // undefined

// 4. Модули асинхронны
// Код выполнится после загрузки всех зависимостей
```

---

## Совместимость

```html
<!-- Современные браузеры -->
<script type="module" src="app.js"></script>

<!-- Fallback для старых браузеров -->
<script nomodule src="app.bundle.js"></script>
```

---

## Сборщики (Webpack, Vite)

Для production используйте сборщики:

```bash
# Vite (рекомендуется)
npm create vite@latest my-app
cd my-app
npm install
npm run dev
```

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
}
```

---

## Рекомендации

✅ Один модуль = одна ответственность  
✅ Используйте named exports для утилит  
✅ Default export для классов/компонентов  
✅ Создавайте index.js для группировки  

❌ Не экспортируйте слишком много из одного файла  
❌ Не делайте циклические зависимости  

**Переходите к практике!** 🚀
