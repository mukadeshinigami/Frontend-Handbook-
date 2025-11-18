# Блок 1: Основы TypeScript

## Что такое TypeScript?

TypeScript — это типизированное надмножество JavaScript, которое компилируется в чистый JavaScript. Разработан Microsoft в 2012 году.

### Ключевые преимущества

```typescript
// JavaScript - ошибка только в runtime
function add(a, b) {
  return a + b;
}
add(5, "10"); // "510" - неожиданный результат

// TypeScript - ошибка на этапе компиляции
function add(a: number, b: number): number {
  return a + b;
}
add(5, "10"); // ❌ Error: Argument of type 'string' is not assignable to parameter of type 'number'
```

**Почему TypeScript?**
- 🛡️ Раннее обнаружение ошибок (compile-time вместо runtime)
- 📖 Самодокументируемый код через типы
- 🔧 Лучший autocomplete и intellisense
- 🏗️ Упрощает рефакторинг больших кодовых баз
- 👥 Облегчает командную разработку

---

## Установка и настройка

### Установка TypeScript

```bash
# Глобальная установка
npm install -g typescript

# Проверка версии
tsc --version
```

### Инициализация проекта

```bash
# Создание package.json
npm init -y

# Установка TypeScript локально
npm install --save-dev typescript

# Создание tsconfig.json
npx tsc --init
```

### Базовая конфигурация tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",                    // Целевая версия JavaScript
    "module": "commonjs",                  // Система модулей
    "outDir": "./dist",                    // Папка для скомпилированных файлов
    "rootDir": "./src",                    // Корневая папка исходников
    "strict": true,                        // Включить все строгие проверки
    "esModuleInterop": true,              // Совместимость с CommonJS
    "skipLibCheck": true,                 // Пропуск проверки .d.ts файлов
    "forceConsistentCasingInFileNames": true // Чувствительность к регистру
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Компиляция

```bash
# Компиляция одного файла
tsc main.ts

# Компиляция всего проекта
tsc

# Watch mode (автоматическая перекомпиляция)
tsc --watch

# Или через npm script в package.json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  }
}
```

---

## Основные типы

### Примитивные типы

```typescript
// Number
let age: number = 25;
let price: number = 99.99;
let hex: number = 0xf00d;

// String
let name: string = "Alice";
let message: string = `Hello, ${name}!`;

// Boolean
let isDone: boolean = false;
let isActive: boolean = true;

// Null и Undefined
let n: null = null;
let u: undefined = undefined;

// Symbol
let sym: symbol = Symbol("key");

// BigInt (ES2020+)
let big: bigint = 100n;
```

### Массивы

```typescript
// Способ 1: Type[]
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ["Alice", "Bob", "Charlie"];

// Способ 2: Array<Type>
let scores: Array<number> = [95, 87, 92];

// Многомерные массивы
let matrix: number[][] = [
  [1, 2, 3],
  [4, 5, 6]
];

// Массив разных типов (union)
let mixed: (number | string)[] = [1, "two", 3, "four"];
```

### Tuple (кортежи)

Массив фиксированной длины с известными типами на каждой позиции:

```typescript
// Tuple: [string, number]
let person: [string, number] = ["Alice", 25];

// Доступ по индексу
console.log(person[0]); // "Alice"
console.log(person[1]); // 25

// Деструктуризация
let [name, age] = person;

// Tuple с optional элементами
let point: [number, number, number?] = [10, 20]; // z необязателен

// Readonly tuple
let readonlyTuple: readonly [string, number] = ["Alice", 25];
// readonlyTuple[0] = "Bob"; // ❌ Error

// Labeled tuples (TypeScript 4.0+)
type Range = [start: number, end: number];
let range: Range = [0, 100];
```

---

## Type Inference (Вывод типов)

TypeScript автоматически определяет типы, если они не указаны явно:

```typescript
// Type inference работает
let message = "Hello"; // type: string
let count = 42;        // type: number
let isValid = true;    // type: boolean

// Автоматический вывод для массивов
let numbers = [1, 2, 3]; // type: number[]
let mixed = [1, "two"];  // type: (number | string)[]

// Вывод типа возвращаемого значения
function add(a: number, b: number) {
  return a + b; // return type: number (автоматически)
}

// Вывод типа для объектов
let user = {
  name: "Alice",
  age: 25
}; // type: { name: string; age: number }

// Когда нужно явно указывать тип
let data; // type: any (нежелательно)
data = "text";
data = 42;

// Лучше:
let data: string;
data = "text";
// data = 42; // ❌ Error
```

### Best Practice: когда указывать типы

```typescript
// ✅ Хорошо: TypeScript выводит тип
const count = 42;
const message = "Hello";

// ✅ Хорошо: явная типизация для параметров функции
function greet(name: string): string {
  return `Hello, ${name}`;
}

// ✅ Хорошо: явная типизация для сложных объектов
interface User {
  id: number;
  name: string;
}
const user: User = { id: 1, name: "Alice" };

// ❌ Плохо: избыточная типизация
const count: number = 42; // тип и так очевиден
```

---

## Any, Unknown и Never

### Any - "любой тип" (избегайте!)

```typescript
let value: any = 42;
value = "text";    // OK
value = true;      // OK
value.anything();  // OK (но может упасть в runtime)

// any отключает проверку типов
function processData(data: any) {
  data.doSomething(); // ❌ Нет проверки
}
```

### Unknown - безопасная альтернатива any

```typescript
let value: unknown = 42;
value = "text";    // OK
value = true;      // OK

// ❌ Нельзя использовать без проверки типа
// console.log(value.toUpperCase()); // Error

// ✅ С type guard
if (typeof value === "string") {
  console.log(value.toUpperCase()); // OK
}

// ✅ С type assertion
let str = value as string;
console.log(str.toUpperCase());
```

### Never - тип "никогда"

Функция никогда не возвращает значение (бесконечный цикл или выброс ошибки):

```typescript
// Функция выбрасывает ошибку
function throwError(message: string): never {
  throw new Error(message);
}

// Бесконечный цикл
function infiniteLoop(): never {
  while (true) {}
}

// never в union type исчезает
type Result = string | never; // type: string
```

---

## Type Assertions (утверждения типа)

Когда вы знаете тип лучше, чем TypeScript:

```typescript
// Способ 1: as
let value: unknown = "Hello, TypeScript";
let length: number = (value as string).length;

// Способ 2: <Type> (не работает в JSX)
let length2: number = (<string>value).length;

// Пример с DOM
const input = document.getElementById("email") as HTMLInputElement;
input.value = "test@example.com";

// Non-null assertion (!)
let name: string | null = getName();
console.log(name!.toUpperCase()); // Утверждаем, что name не null

// ⚠️ Осторожно с assertions!
let value: unknown = 42;
let str = value as string;
console.log(str.toUpperCase()); // Runtime error!
```

---

## Void и Object

### Void

Тип для функций, которые ничего не возвращают:

```typescript
function logMessage(message: string): void {
  console.log(message);
  // return undefined; // неявно
}

// void vs undefined
function fn1(): void {
  // OK: можно не возвращать ничего
}

function fn2(): undefined {
  return undefined; // Нужно явно вернуть undefined
}
```

### Object

```typescript
// object - любой не-примитивный тип
let obj: object = { name: "Alice" };
obj = [1, 2, 3]; // OK (массивы - тоже объекты)
obj = () => {}; // OK (функции - тоже объекты)
// obj = 42; // ❌ Error

// Object (с большой буквы) - редко используется
let obj2: Object = { name: "Alice" };
obj2 = 42; // OK (примитивы имеют объектные обёртки)

// Лучше использовать конкретные типы
let user: { name: string; age: number } = {
  name: "Alice",
  age: 25
};
```

---

## Практические примеры

### Пример 1: Типизированная функция

```typescript
// Калькулятор
function calculate(a: number, b: number, operation: string): number {
  switch (operation) {
    case "add":
      return a + b;
    case "subtract":
      return a - b;
    case "multiply":
      return a * b;
    case "divide":
      return b !== 0 ? a / b : 0;
    default:
      return 0;
  }
}

console.log(calculate(10, 5, "add")); // 15
```

### Пример 2: Работа с массивами

```typescript
// Фильтрация и маппинг с типами
const numbers: number[] = [1, 2, 3, 4, 5];

const doubled: number[] = numbers.map((n) => n * 2);
const evens: number[] = numbers.filter((n) => n % 2 === 0);

console.log(doubled); // [2, 4, 6, 8, 10]
console.log(evens);   // [2, 4]
```

### Пример 3: Tuple для координат

```typescript
type Point = [x: number, y: number];

function distance(p1: Point, p2: Point): number {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

const pointA: Point = [0, 0];
const pointB: Point = [3, 4];

console.log(distance(pointA, pointB)); // 5
```

---

## Рекомендации

### ✅ Хорошие практики

```typescript
// 1. Включайте strict mode
// tsconfig.json: "strict": true

// 2. Избегайте any
// ❌ Плохо
function process(data: any) {}

// ✅ Хорошо
function process(data: unknown) {
  if (typeof data === "string") {
    // работаем со строкой
  }
}

// 3. Используйте type inference
// ❌ Излишне
const count: number = 42;

// ✅ Достаточно
const count = 42;

// 4. Типизируйте параметры и возвращаемые значения функций
function greet(name: string): string {
  return `Hello, ${name}`;
}
```

### ❌ Плохие практики

```typescript
// 1. Не используйте any без крайней необходимости
let data: any = fetchData(); // ❌

// 2. Не игнорируйте ошибки компилятора
// @ts-ignore // ❌
let result = someFunction();

// 3. Не злоупотребляйте type assertions
let value = something as any as MyType; // ❌
```

---

## Резюме

✅ TypeScript = JavaScript + статические типы  
✅ Основные типы: number, string, boolean, array, tuple  
✅ Type inference - автоматическое определение типов  
✅ unknown > any (безопаснее)  
✅ void для функций без возврата  
✅ Настройка через tsconfig.json

**Следующий урок:** Типы и интерфейсы

---

## Тест

1. Какой тип автоматически выведет TypeScript?
```typescript
let value = [1, 2, 3];
```
<details><summary>Ответ</summary>

`number[]`
</details>

2. В чём разница между `any` и `unknown`?

<details><summary>Ответ</summary>

`unknown` требует проверки типа перед использованием, `any` отключает проверку типов.
</details>

3. Что выведет?
```typescript
let tuple: [string, number] = ["Alice", 25];
console.log(tuple[1]);
```

<details><summary>Ответ</summary>

`25`
</details>

**Переходите к практике!** 🚀
