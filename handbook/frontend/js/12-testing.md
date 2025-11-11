# Блок 12: Тестирование JavaScript

## Введение

**Тестирование** — процесс проверки, что код работает корректно. Unit-тесты проверяют отдельные функции, интеграционные — взаимодействие компонентов.

**Зачем тестировать:**
- ✅ Находить баги до production
- ✅ Уверенность при рефакторинге
- ✅ Документация кода (тесты показывают, как использовать функции)
- ✅ Меньше ручного тестирования

---

## Jest — фреймворк для тестирования

**Jest** — самый популярный фреймворк для тестирования JavaScript.

### Установка

```bash
npm install --save-dev jest
```

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

---

## Базовый синтаксис

```javascript
// math.js
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}
```

```javascript
// math.test.js
import { add, multiply } from './math.js';

describe('Math functions', () => {
  test('add 2 + 3 equals 5', () => {
    expect(add(2, 3)).toBe(5);
  });
  
  test('multiply 4 * 5 equals 20', () => {
    expect(multiply(4, 5)).toBe(20);
  });
});
```

**Запуск:**

```bash
npm test
```

---

## Матчеры (Matchers)

```javascript
// Равенство
expect(value).toBe(5); // Строгое (===)
expect(value).toEqual({a: 1}); // Глубокое сравнение объектов

// Правдивость
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeDefined();

// Числа
expect(value).toBeGreaterThan(3);
expect(value).toBeLessThan(5);
expect(value).toBeCloseTo(0.3); // Для float

// Строки
expect(str).toMatch(/pattern/);
expect(str).toContain('substring');

// Массивы
expect(arr).toContain('item');
expect(arr).toHaveLength(3);

// Объекты
expect(obj).toHaveProperty('key');
expect(obj).toMatchObject({a: 1});

// Исключения
expect(() => throwError()).toThrow();
expect(() => throwError()).toThrow('Error message');
```

---

## Группировка тестов

```javascript
describe('User validation', () => {
  describe('email validation', () => {
    test('valid email passes', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });
    
    test('invalid email fails', () => {
      expect(validateEmail('invalid')).toBe(false);
    });
  });
  
  describe('password validation', () => {
    test('strong password passes', () => {
      expect(validatePassword('Abc123!@')).toBe(true);
    });
  });
});
```

---

## Setup и Teardown

```javascript
// Выполняется перед каждым тестом
beforeEach(() => {
  database.connect();
});

// Выполняется после каждого теста
afterEach(() => {
  database.disconnect();
});

// Выполняется один раз перед всеми тестами
beforeAll(() => {
  server.start();
});

// Выполняется один раз после всех тестов
afterAll(() => {
  server.stop();
});
```

---

## Тестирование асинхронного кода

### Promises

```javascript
test('fetches data', () => {
  return fetchData().then(data => {
    expect(data).toEqual({name: 'Alex'});
  });
});

// Или с async/await
test('fetches data async', async () => {
  const data = await fetchData();
  expect(data).toEqual({name: 'Alex'});
});

// Проверка на ошибку
test('handles error', async () => {
  await expect(fetchData()).rejects.toThrow('Error');
});
```

---

## Моки (Mocks)

### Мокирование функций

```javascript
const mockFn = jest.fn();

mockFn('arg1', 'arg2');
mockFn('arg3');

expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
expect(mockFn).toHaveBeenLastCalledWith('arg3');
```

### Мокирование возвращаемых значений

```javascript
const mockFn = jest.fn();
mockFn.mockReturnValue(42);
expect(mockFn()).toBe(42);

mockFn.mockReturnValueOnce(1).mockReturnValueOnce(2);
expect(mockFn()).toBe(1);
expect(mockFn()).toBe(2);
```

### Мокирование модулей

```javascript
// api.js
export function fetchUser(id) {
  return fetch(`/api/users/${id}`).then(r => r.json());
}

// user.test.js
import { fetchUser } from './api.js';

jest.mock('./api.js');

test('gets user data', async () => {
  fetchUser.mockResolvedValue({name: 'Alex', age: 25});
  
  const user = await fetchUser(1);
  expect(user.name).toBe('Alex');
});
```

---

## Тестирование DOM

### С jsdom (встроено в Jest)

```javascript
// button.js
export function createButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}

// button.test.js
import { createButton } from './button.js';

test('button click triggers callback', () => {
  const mockCallback = jest.fn();
  const button = createButton('Click me', mockCallback);
  
  button.click();
  
  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(button.textContent).toBe('Click me');
});
```

### Тестирование с реальным DOM

```javascript
test('adds item to list', () => {
  document.body.innerHTML = `
    <ul id="list"></ul>
  `;
  
  const list = document.getElementById('list');
  const item = document.createElement('li');
  item.textContent = 'Item 1';
  list.appendChild(item);
  
  expect(list.children.length).toBe(1);
  expect(list.children[0].textContent).toBe('Item 1');
});
```

---

## Snapshot Testing

```javascript
import { render } from './render.js';

test('renders correctly', () => {
  const output = render({name: 'Alex', age: 25});
  expect(output).toMatchSnapshot();
});

// При первом запуске создаётся snapshot
// При следующих — сравнивается с сохранённым
```

---

## Coverage (Покрытие кода)

```bash
npm test -- --coverage
```

**Отчёт показывает:**
- Statements — покрытие строк
- Branches — покрытие условий (if/else)
- Functions — покрытие функций
- Lines — покрытие строк кода

```json
// package.json
{
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/**/*.test.js"
    ],
    "coverageThreshold": {
      "global": {
        "statements": 80,
        "branches": 80,
        "functions": 80,
        "lines": 80
      }
    }
  }
}
```

---

## Практический пример

```javascript
// validator.js
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePassword(password) {
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /[0-9]/.test(password);
}

export function validateAge(age) {
  return Number.isInteger(age) && age >= 18 && age <= 120;
}
```

```javascript
// validator.test.js
import { validateEmail, validatePassword, validateAge } from './validator.js';

describe('Validator', () => {
  describe('validateEmail', () => {
    test('valid emails pass', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user+tag@domain.co.uk')).toBe(true);
    });
    
    test('invalid emails fail', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('test @example.com')).toBe(false);
    });
  });
  
  describe('validatePassword', () => {
    test('strong password passes', () => {
      expect(validatePassword('Abcd1234')).toBe(true);
      expect(validatePassword('MyP@ssw0rd')).toBe(true);
    });
    
    test('weak password fails', () => {
      expect(validatePassword('abc')).toBe(false); // Короткий
      expect(validatePassword('abcdefgh')).toBe(false); // Нет цифр/заглавных
      expect(validatePassword('ABCD1234')).toBe(false); // Нет строчных
    });
  });
  
  describe('validateAge', () => {
    test('valid age passes', () => {
      expect(validateAge(18)).toBe(true);
      expect(validateAge(50)).toBe(true);
      expect(validateAge(120)).toBe(true);
    });
    
    test('invalid age fails', () => {
      expect(validateAge(17)).toBe(false); // Младше 18
      expect(validateAge(121)).toBe(false); // Старше 120
      expect(validateAge('25')).toBe(false); // Строка
      expect(validateAge(25.5)).toBe(false); // Float
    });
  });
});
```

---

## TDD (Test-Driven Development)

**Подход:** Сначала пишем тест, потом код.

```javascript
// 1. Пишем тест (он падает)
test('capitalizes first letter', () => {
  expect(capitalize('hello')).toBe('Hello');
});

// 2. Пишем минимальный код
function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

// 3. Рефакторинг (если нужно)
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
```

---

## Рекомендации

✅ Тестируйте публичные функции, не приватные  
✅ Один тест = одна проверка  
✅ Называйте тесты понятно: `test('adds two numbers', ...)`  
✅ Используйте `describe` для группировки  
✅ Стремитесь к покрытию 70-80%+  

❌ Не тестируйте внешние библиотеки  
❌ Не пишите слишком сложные тесты  
❌ Не игнорируйте упавшие тесты  

**Переходите к практике!** 🚀
