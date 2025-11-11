# Блок 13: TypeScript

## Введение

**TypeScript** — язык программирования, надстройка над JavaScript с системой типов. Код на TypeScript компилируется в обычный JavaScript.

**Зачем TypeScript:**
- ✅ Находит ошибки на этапе разработки
- ✅ Автодополнение и подсказки в IDE
- ✅ Легче рефакторить большие проекты
- ✅ Документация через типы

**Минусы:**
- ❌ Нужна компиляция
- ❌ Дополнительный синтаксис
- ❌ Кривая обучения

---

## Установка и настройка

```bash
npm install -g typescript
tsc --version
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

**Компиляция:**

```bash
tsc               # Компилирует все файлы
tsc app.ts        # Компилирует конкретный файл
tsc --watch       # Режим watch
```

---

## Базовые типы

```typescript
// Примитивы
let age: number = 25;
let name: string = "Alex";
let isActive: boolean = true;

// Массивы
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Alex", "Bob"];

// Кортежи (Tuples)
let person: [string, number] = ["Alex", 25];

// Enum
enum Color {
  Red,
  Green,
  Blue
}
let color: Color = Color.Red;

// Any (избегайте!)
let data: any = 42;
data = "string"; // OK

// Unknown (безопаснее any)
let value: unknown = 10;
// value.toFixed(); // Ошибка!
if (typeof value === "number") {
  value.toFixed(2); // OK
}

// Void (для функций без возврата)
function log(message: string): void {
  console.log(message);
}

// Null и Undefined
let u: undefined = undefined;
let n: null = null;

// Never (функции, которые никогда не возвращают значение)
function throwError(message: string): never {
  throw new Error(message);
}
```

---

## Union и Intersection Types

```typescript
// Union (или)
function printId(id: number | string) {
  console.log(id);
}

printId(101);     // OK
printId("AB123"); // OK

// Type narrowing
function format(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else {
    return value.toFixed(2);
  }
}

// Intersection (и)
type Person = { name: string };
type Employee = { employeeId: number };

type Staff = Person & Employee;

const worker: Staff = {
  name: "Alex",
  employeeId: 123
};
```

---

## Интерфейсы

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;         // Опциональное поле
  readonly createdAt: Date; // Только чтение
}

const user: User = {
  id: 1,
  name: "Alex",
  email: "alex@example.com",
  createdAt: new Date()
};

// user.createdAt = new Date(); // Ошибка!

// Расширение интерфейсов
interface Admin extends User {
  role: "admin" | "superadmin";
  permissions: string[];
}

const admin: Admin = {
  id: 1,
  name: "Admin",
  email: "admin@example.com",
  createdAt: new Date(),
  role: "admin",
  permissions: ["read", "write", "delete"]
};
```

---

## Type Aliases

```typescript
type ID = number | string;
type Status = "pending" | "approved" | "rejected";

type Product = {
  id: ID;
  name: string;
  price: number;
  status: Status;
};

const product: Product = {
  id: 123,
  name: "Laptop",
  price: 1000,
  status: "approved"
};

// Type vs Interface
// Interface можно расширить, Type — нельзя напрямую
// Используйте interface для объектов, type — для unions/aliases
```

---

## Функции

```typescript
// Типизация параметров и возврата
function add(a: number, b: number): number {
  return a + b;
}

// Опциональные параметры
function greet(name: string, greeting?: string): string {
  return `${greeting || "Hello"}, ${name}`;
}

// Параметры по умолчанию
function multiply(a: number, b: number = 1): number {
  return a * b;
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

// Function type
type MathOperation = (a: number, b: number) => number;

const subtract: MathOperation = (a, b) => a - b;

// Стрелочные функции
const divide = (a: number, b: number): number => {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
};
```

---

## Классы

```typescript
class Person {
  // Модификаторы доступа
  public name: string;
  private age: number;
  protected address: string;
  readonly id: number;
  
  constructor(name: string, age: number, address: string) {
    this.name = name;
    this.age = age;
    this.address = address;
    this.id = Date.now();
  }
  
  public greet(): string {
    return `Hello, I'm ${this.name}`;
  }
  
  private getAge(): number {
    return this.age;
  }
}

// Сокращённый синтаксис
class User {
  constructor(
    public name: string,
    private email: string,
    public readonly id: number
  ) {}
}

// Наследование
class Employee extends Person {
  constructor(
    name: string,
    age: number,
    address: string,
    public salary: number
  ) {
    super(name, age, address);
  }
  
  public getSalary(): number {
    return this.salary;
  }
}

// Абстрактные классы
abstract class Animal {
  abstract makeSound(): void;
  
  move(): void {
    console.log("Moving...");
  }
}

class Dog extends Animal {
  makeSound(): void {
    console.log("Woof!");
  }
}
```

---

## Дженерики (Generics)

```typescript
// Простой generic
function identity<T>(value: T): T {
  return value;
}

identity<number>(42);
identity<string>("hello");
identity(true); // Тип выводится автоматически

// Generic для массивов
function firstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

firstElement([1, 2, 3]);      // number | undefined
firstElement(["a", "b"]);     // string | undefined

// Generic интерфейсы
interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 42 };
const stringBox: Box<string> = { value: "hello" };

// Множественные generics
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

pair(1, "one");        // [number, string]
pair("key", true);     // [string, boolean]

// Constraints (ограничения)
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(item: T): void {
  console.log(item.length);
}

logLength("hello");    // OK
logLength([1, 2, 3]);  // OK
// logLength(42);      // Ошибка!

// Generic классы
class DataStore<T> {
  private data: T[] = [];
  
  add(item: T): void {
    this.data.push(item);
  }
  
  getAll(): T[] {
    return [...this.data];
  }
}

const numberStore = new DataStore<number>();
numberStore.add(1);
numberStore.add(2);
```

---

## Utility Types

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial - все поля опциональны
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number; }

// Required - все поля обязательны
type RequiredUser = Required<PartialUser>;

// Readonly - все поля только для чтения
type ReadonlyUser = Readonly<User>;

// Pick - выбрать определённые поля
type UserPreview = Pick<User, "id" | "name">;
// { id: number; name: string; }

// Omit - исключить определённые поля
type UserWithoutEmail = Omit<User, "email">;
// { id: number; name: string; age: number; }

// Record - создать объект с ключами и типом значений
type UserRoles = Record<string, string>;
// { [key: string]: string; }

// Exclude - исключить из union
type Status = "active" | "inactive" | "pending";
type ActiveStatus = Exclude<Status, "inactive">;
// "active" | "pending"

// Extract - извлечь из union
type PendingStatus = Extract<Status, "pending" | "inactive">;
// "pending" | "inactive"

// NonNullable - убрать null и undefined
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>;
// string

// ReturnType - получить тип возврата функции
function getUser() {
  return { id: 1, name: "Alex" };
}

type UserType = ReturnType<typeof getUser>;
// { id: number; name: string; }

// Parameters - получить типы параметров функции
function createUser(name: string, age: number) {}

type CreateUserParams = Parameters<typeof createUser>;
// [string, number]
```

---

## Type Guards

```typescript
// typeof
function printValue(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase());
  } else {
    console.log(value.toFixed(2));
  }
}

// instanceof
class Dog {
  bark() { console.log("Woof!"); }
}

class Cat {
  meow() { console.log("Meow!"); }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}

// in operator
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}

// Custom type guard
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function process(value: unknown) {
  if (isString(value)) {
    console.log(value.toUpperCase()); // TypeScript знает, что это string
  }
}
```

---

## Миграция с JavaScript

### Шаг 1: Переименуйте .js в .ts

```bash
mv app.js app.ts
```

### Шаг 2: Разрешите ошибки постепенно

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": false,  // Начните без строгого режима
    "noImplicitAny": false
  }
}
```

### Шаг 3: Добавляйте типы постепенно

```typescript
// До
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// После
interface Item {
  price: number;
  name: string;
}

function calculateTotal(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### Шаг 4: Включите строгий режим

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

---

## Рекомендации

✅ Используйте `strict: true` в tsconfig.json  
✅ Избегайте `any` — используйте `unknown`  
✅ Предпочитайте `interface` для объектов, `type` для unions  
✅ Используйте generics для переиспользуемого кода  
✅ Пишите type guards для сложных проверок  

❌ Не используйте `any` без крайней необходимости  
❌ Не игнорируйте ошибки через `@ts-ignore`  
❌ Не делайте типы слишком сложными  

**Переходите к практике!** 🚀
