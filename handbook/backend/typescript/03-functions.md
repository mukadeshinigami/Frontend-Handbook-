# Блок 3: Функции и методы

## Типизация функций

### Базовый синтаксис

```typescript
// Типизация параметров и возвращаемого значения
function add(a: number, b: number): number {
  return a + b;
}

// Type inference для return type
function multiply(a: number, b: number) {
  return a * b; // TypeScript выводит number
}

// Arrow functions
const subtract = (a: number, b: number): number => a - b;

// Function type
let calculate: (a: number, b: number) => number;

calculate = add;      // OK
calculate = multiply; // OK
// calculate = (a: string) => a; // ❌ Error
```

### Function Type Expressions

```typescript
// Type alias для функции
type MathOperation = (a: number, b: number) => number;

const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;

// Массив функций
const operations: MathOperation[] = [add, subtract, multiply, divide];

// Функция высшего порядка
function applyOperation(
  a: number,
  b: number,
  operation: MathOperation
): number {
  return operation(a, b);
}

console.log(applyOperation(10, 5, add)); // 15
```

---

## Optional и Default параметры

### Optional параметры

```typescript
function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}!`;
}

console.log(greet("Alice"));           // "Hello, Alice!"
console.log(greet("Bob", "Hi"));       // "Hi, Bob!"

// Optional параметры должны быть в конце
function createUser(
  name: string,
  age?: number,
  email?: string
): void {
  console.log({ name, age, email });
}
```

### Default параметры

```typescript
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

console.log(greet("Alice"));           // "Hello, Alice!"
console.log(greet("Bob", "Hi"));       // "Hi, Bob!"

// Default + type inference
function power(base: number, exponent = 2) {
  return base ** exponent; // exponent имеет тип number
}

console.log(power(5));    // 25
console.log(power(5, 3)); // 125
```

---

## Rest параметры

```typescript
// Rest parameters с типизацией
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

console.log(sum(1, 2, 3));       // 6
console.log(sum(1, 2, 3, 4, 5)); // 15

// Rest + обычные параметры
function logMessage(level: string, ...messages: string[]): void {
  console.log(`[${level}]`, messages.join(" "));
}

logMessage("INFO", "Application", "started", "successfully");
// [INFO] Application started successfully

// Rest с tuple
function createPerson(
  name: string,
  ...details: [age: number, email?: string]
): object {
  const [age, email] = details;
  return { name, age, email };
}

const person1 = createPerson("Alice", 25);
const person2 = createPerson("Bob", 30, "bob@example.com");
```

---

## Function Overloads

Несколько сигнатур для одной функции:

```typescript
// Overload signatures
function format(value: string): string;
function format(value: number): string;
function format(value: boolean): string;

// Implementation signature
function format(value: string | number | boolean): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else if (typeof value === "number") {
    return value.toFixed(2);
  } else {
    return value ? "YES" : "NO";
  }
}

console.log(format("hello"));  // "HELLO"
console.log(format(3.14159));  // "3.14"
console.log(format(true));     // "YES"

// Практический пример: DOM query
function query(selector: string): HTMLElement | null;
function query(selector: string, all: true): NodeListOf<HTMLElement>;
function query(selector: string, all: false): HTMLElement | null;

function query(
  selector: string,
  all?: boolean
): HTMLElement | NodeListOf<HTMLElement> | null {
  if (all) {
    return document.querySelectorAll(selector);
  } else {
    return document.querySelector(selector);
  }
}

const element = query("#app");        // HTMLElement | null
const elements = query(".item", true); // NodeListOf<HTMLElement>
```

### Когда использовать overloads

```typescript
// ✅ Хорошо: разные типы параметров
function createElement(tag: "div"): HTMLDivElement;
function createElement(tag: "span"): HTMLSpanElement;
function createElement(tag: "a"): HTMLAnchorElement;
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

// ❌ Плохо: лучше использовать union
function processValue(value: string | number): string {
  return String(value);
}
```

---

## this typing

Явная типизация контекста `this`:

```typescript
interface User {
  name: string;
  age: number;
}

function greet(this: User): string {
  return `Hello, I'm ${this.name}, ${this.age} years old`;
}

const user: User = {
  name: "Alice",
  age: 25
};

// Используем call/apply/bind
console.log(greet.call(user)); // "Hello, I'm Alice, 25 years old"

// ❌ Error: без правильного контекста
// greet(); // Error: The 'this' context is missing

// Практический пример: метод в объекте
interface Counter {
  count: number;
  increment(this: Counter, amount?: number): void;
  reset(this: Counter): void;
}

const counter: Counter = {
  count: 0,
  increment(amount = 1) {
    this.count += amount;
  },
  reset() {
    this.count = 0;
  }
};

counter.increment();
counter.increment(5);
console.log(counter.count); // 6
```

### Стрелочные функции и this

```typescript
class Handler {
  message = "Hello";

  // Regular function - this может измениться
  regularMethod() {
    setTimeout(function() {
      // console.log(this.message); // ❌ Error
    }, 100);
  }

  // Arrow function - this сохраняется
  arrowMethod() {
    setTimeout(() => {
      console.log(this.message); // ✅ OK
    }, 100);
  }
}
```

---

## Void, Never, Unknown возвраты

### void

Функция ничего не возвращает:

```typescript
function logMessage(message: string): void {
  console.log(message);
  // return undefined; // неявно
}

// void в callbacks
function processItems(
  items: string[],
  callback: (item: string) => void
): void {
  items.forEach(callback);
}

processItems(["a", "b", "c"], (item) => {
  console.log(item);
});
```

### never

Функция никогда не завершается нормально:

```typescript
// Выбрасывает ошибку
function throwError(message: string): never {
  throw new Error(message);
}

// Бесконечный цикл
function infiniteLoop(): never {
  while (true) {}
}

// Exhaustiveness checking
type Shape = "circle" | "square" | "triangle";

function getArea(shape: Shape): number {
  switch (shape) {
    case "circle":
      return 0;
    case "square":
      return 0;
    case "triangle":
      return 0;
    default:
      // Если добавим новый Shape, TypeScript предупредит
      const _exhaustive: never = shape;
      throw new Error(`Unknown shape: ${_exhaustive}`);
  }
}
```

### unknown return

```typescript
function parseData(data: string): unknown {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

const result = parseData('{"name": "Alice"}');

// Нужна проверка типа
if (typeof result === "object" && result !== null) {
  // Безопасная работа с result
}
```

---

## Callbacks и Higher-Order Functions

```typescript
// Типизированный callback
type Callback<T> = (item: T) => void;

function forEach<T>(array: T[], callback: Callback<T>): void {
  for (const item of array) {
    callback(item);
  }
}

forEach([1, 2, 3], (n) => console.log(n * 2));
forEach(["a", "b"], (s) => console.log(s.toUpperCase()));

// Функция, возвращающая функцию
type Predicate<T> = (item: T) => boolean;

function createFilter<T>(predicate: Predicate<T>): (array: T[]) => T[] {
  return (array: T[]) => array.filter(predicate);
  }

const filterEvens = createFilter((n: number) => n % 2 === 0);
console.log(filterEvens([1, 2, 3, 4, 5])); // [2, 4]

const filterLong = createFilter((s: string) => s.length > 3);
console.log(filterLong(["hi", "hello", "bye"])); // ["hello"]
```

---

## Async Functions

```typescript
// async функция всегда возвращает Promise
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  return data;
}

// Type inference для Promise
async function getData() {
  return { id: 1, name: "Alice" }; // Promise<{ id: number; name: string }>
}

// Error handling
async function fetchData(url: string): Promise<unknown> {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

// Практический пример
interface ApiResponse<T> {
  data: T;
  status: number;
}

async function apiCall<T>(url: string): Promise<ApiResponse<T>> {
  const response = await fetch(url);
  const data = await response.json();
  
  return {
    data,
    status: response.status
  };
}

// Использование
const userResponse = await apiCall<User>("/api/users/1");
console.log(userResponse.data.name);
```

---

## Практические примеры

### Пример 1: Валидация с типизацией

```typescript
type ValidationResult = {
  valid: boolean;
  errors: string[];
};

type Validator<T> = (value: T) => string | null;

function validate<T>(value: T, ...validators: Validator<T>[]): ValidationResult {
  const errors: string[] = [];
  
  for (const validator of validators) {
    const error = validator(value);
    if (error) {
      errors.push(error);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Validators
const minLength = (min: number): Validator<string> => {
  return (value) => value.length >= min ? null : `Min length is ${min}`;
};

const maxLength = (max: number): Validator<string> => {
  return (value) => value.length <= max ? null : `Max length is ${max}`;
};

const hasUpperCase: Validator<string> = (value) => {
  return /[A-Z]/.test(value) ? null : "Must contain uppercase letter";
};

// Использование
const result = validate(
  "hello",
  minLength(6),
  maxLength(20),
  hasUpperCase
);

console.log(result);
// { valid: false, errors: ["Min length is 6", "Must contain uppercase letter"] }
```

### Пример 2: Retry mechanism

```typescript
async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      console.log(`Attempt ${attempt} failed, retrying...`);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  throw new Error("Max attempts reached");
}

// Использование
const data = await retry(() => fetch("/api/data").then(r => r.json()), 3, 1000);
```

---

## Рекомендации

### ✅ Хорошие практики

```typescript
// 1. Явно типизируйте параметры, return type можно опустить
function add(a: number, b: number) {
  return a + b; // return type выводится
}

// 2. Используйте type aliases для сложных сигнатур
type EventHandler = (event: Event) => void;

// 3. Используйте optional вместо union с undefined
function greet(name?: string) {} // Лучше чем (name: string | undefined)

// 4. Используйте rest parameters для переменного числа аргументов
function sum(...numbers: number[]) {}
```

### ❌ Плохие практики

```typescript
// 1. Не используйте any
function process(data: any) {} // ❌

// 2. Не дублируйте логику в overloads
function format(value: string): string;
function format(value: number): number; // ❌ разные return types
```

---

## Резюме

✅ Типизация параметров и return type  
✅ Optional (`?`) и default параметры  
✅ Rest parameters (`...args: T[]`)  
✅ Function overloads  
✅ `this` typing  
✅ `void`, `never`, `unknown` return types  
✅ Async functions и Promise

**Следующий урок:** Классы и ООП 🚀
