# Блок 2: Типы и интерфейсы

## Object Types

TypeScript позволяет описывать форму объектов через типы объектов.

### Inline типы

```typescript
// Inline object type
let user: { name: string; age: number } = {
  name: "Alice",
  age: 25
};

// С методами
let calculator: {
  add: (a: number, b: number) => number;
  subtract: (a: number, b: number) => number;
} = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

console.log(calculator.add(5, 3)); // 8
```

### Type Aliases

Создание переиспользуемых типов:

```typescript
// Type alias для объекта
type User = {
  id: number;
  name: string;
  email: string;
};

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

// Type alias для примитивов
type ID = number | string;
type Status = "active" | "inactive" | "pending";

let userId: ID = 123;
userId = "abc-123"; // OK

let userStatus: Status = "active";
// userStatus = "deleted"; // ❌ Error
```

---

## Interfaces

Interface — способ описания структуры объектов.

### Базовый синтаксис

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
};

// С методами
interface Calculator {
  add(a: number, b: number): number;
  subtract(a: number, b: number): number;
}

const calc: Calculator = {
  add(a, b) { return a + b; },
  subtract(a, b) { return a - b; }
};
```

### Interfaces vs Type Aliases

```typescript
// Interface
interface UserInterface {
  name: string;
  age: number;
}

// Type
type UserType = {
  name: string;
  age: number;
};

// Оба работают одинаково для объектов
const user1: UserInterface = { name: "Alice", age: 25 };
const user2: UserType = { name: "Bob", age: 30 };
```

**Ключевые различия:**

| Feature | Interface | Type |
|---------|-----------|------|
| Extends | `extends` | `&` (intersection) |
| Declaration merging | ✅ | ❌ |
| Union types | ❌ | ✅ |
| Primitives | ❌ | ✅ |
| Tuples | ❌ | ✅ |

```typescript
// ✅ Interface: extends
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

// ✅ Type: intersection
type AnimalType = {
  name: string;
};

type DogType = AnimalType & {
  breed: string;
};

// ✅ Type: union
type Status = "success" | "error" | "loading";

// ✅ Type: primitives
type ID = number | string;

// ✅ Type: tuple
type Point = [number, number];

// ✅ Interface: declaration merging
interface Window {
  title: string;
}

interface Window {
  width: number;
}

// Результат: Window = { title: string; width: number }
```

**Рекомендация:**
- Используйте `interface` для публичных API и расширяемых структур
- Используйте `type` для union, primitives, tuples и сложных трансформаций

---

## Optional и Readonly свойства

### Optional properties

```typescript
interface User {
  id: number;
  name: string;
  email?: string; // опциональное
  phone?: string;
}

const user1: User = {
  id: 1,
  name: "Alice"
  // email и phone опциональны
};

const user2: User = {
  id: 2,
  name: "Bob",
  email: "bob@example.com"
};

// Проверка optional свойства
function sendEmail(user: User): void {
  if (user.email) {
    console.log(`Sending email to ${user.email}`);
  } else {
    console.log("No email provided");
  }
}
```

### Readonly properties

```typescript
interface User {
  readonly id: number;
  name: string;
}

const user: User = {
  id: 1,
  name: "Alice"
};

user.name = "Bob"; // OK
// user.id = 2; // ❌ Error: Cannot assign to 'id' because it is a read-only property

// Readonly для массивов
interface Config {
  readonly ports: readonly number[];
}

const config: Config = {
  ports: [8080, 3000]
};

// config.ports.push(4000); // ❌ Error
// config.ports[0] = 9000; // ❌ Error

// Readonly utility type
type ReadonlyUser = Readonly<User>;
const readonlyUser: ReadonlyUser = {
  id: 1,
  name: "Alice"
};
// readonlyUser.name = "Bob"; // ❌ Error
```

---

## Intersection Types

Объединение нескольких типов в один:

```typescript
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: number;
  department: string;
};

// Intersection: объединяем свойства
type EmployeePerson = Person & Employee;

const emp: EmployeePerson = {
  name: "Alice",
  age: 25,
  employeeId: 12345,
  department: "IT"
};

// Практический пример: миксины
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type User = {
  id: number;
  name: string;
};

type TimestampedUser = User & Timestamped;

const user: TimestampedUser = {
  id: 1,
  name: "Alice",
  createdAt: new Date(),
  updatedAt: new Date()
};
```

---

## Union Types

Значение может быть одним из нескольких типов:

```typescript
// Union примитивов
type ID = number | string;

let userId: ID;
userId = 123;      // OK
userId = "abc-123"; // OK
// userId = true;   // ❌ Error

// Union объектов
type SuccessResponse = {
  status: "success";
  data: any;
};

type ErrorResponse = {
  status: "error";
  message: string;
};

type ApiResponse = SuccessResponse | ErrorResponse;

function handleResponse(response: ApiResponse): void {
  if (response.status === "success") {
    console.log("Data:", response.data);
  } else {
    console.error("Error:", response.message);
  }
}

// Discriminated unions (tagged unions)
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "rectangle"; width: number; height: number }
  | { kind: "square"; size: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "rectangle":
      return shape.width * shape.height;
    case "square":
      return shape.size ** 2;
  }
}

const circle: Shape = { kind: "circle", radius: 5 };
console.log(getArea(circle)); // 78.54
```

---

## Type Guards

Проверка типов во время выполнения:

### typeof guard

```typescript
function processValue(value: string | number): string {
  if (typeof value === "string") {
    return value.toUpperCase();
  } else {
    return value.toFixed(2);
  }
}

console.log(processValue("hello")); // "HELLO"
console.log(processValue(3.14159)); // "3.14"
```

### instanceof guard

```typescript
class Dog {
  bark() {
    console.log("Woof!");
  }
}

class Cat {
  meow() {
    console.log("Meow!");
  }
}

function makeSound(animal: Dog | Cat): void {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}

makeSound(new Dog()); // "Woof!"
makeSound(new Cat()); // "Meow!"
```

### in guard

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird): void {
  if ("swim" in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}
```

### Custom type guards

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Custom type guard
function isUser(obj: any): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.id === "number" &&
    typeof obj.name === "string" &&
    typeof obj.email === "string"
  );
}

// Использование
function processData(data: unknown): void {
  if (isUser(data)) {
    // TypeScript знает, что data это User
    console.log(`User: ${data.name} (${data.email})`);
  } else {
    console.log("Not a valid user");
  }
}

processData({ id: 1, name: "Alice", email: "alice@example.com" });
processData({ id: 1 }); // "Not a valid user"
```

---

## Index Signatures

Динамические свойства объектов:

```typescript
// Простой пример
interface StringMap {
  [key: string]: string;
}

const translations: StringMap = {
  hello: "привет",
  goodbye: "до свидания",
  thanks: "спасибо"
};

// С фиксированными свойствами
interface Dictionary {
  [key: string]: number;
  count: number; // Должно быть совместимо с index signature
}

const stats: Dictionary = {
  count: 3,
  users: 100,
  posts: 250
};

// Более сложный пример
interface Cache<T> {
  [key: string]: T;
}

const userCache: Cache<User> = {
  "user1": { id: 1, name: "Alice", email: "alice@example.com" },
  "user2": { id: 2, name: "Bob", email: "bob@example.com" }
};
```

---

## Extending Interfaces

```typescript
// Базовый интерфейс
interface Entity {
  id: number;
  createdAt: Date;
}

// Расширение
interface User extends Entity {
  name: string;
  email: string;
}

interface Admin extends User {
  permissions: string[];
}

const admin: Admin = {
  id: 1,
  createdAt: new Date(),
  name: "Alice",
  email: "alice@example.com",
  permissions: ["read", "write", "delete"]
};

// Множественное наследование
interface Timestamped {
  createdAt: Date;
  updatedAt: Date;
}

interface Authored {
  author: string;
}

interface Article extends Timestamped, Authored {
  title: string;
  content: string;
}

const article: Article = {
  title: "TypeScript Guide",
  content: "...",
  author: "Alice",
  createdAt: new Date(),
  updatedAt: new Date()
};
```

---

## Практические примеры

### Пример 1: API Response типы

```typescript
interface SuccessResponse<T> {
  status: "success";
  data: T;
}

interface ErrorResponse {
  status: "error";
  message: string;
  code: number;
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

// Использование
interface User {
  id: number;
  name: string;
}

function handleUserResponse(response: ApiResponse<User>): void {
  if (response.status === "success") {
    console.log("User:", response.data.name);
  } else {
    console.error(`Error ${response.code}: ${response.message}`);
  }
}

// Тест
handleUserResponse({
  status: "success",
  data: { id: 1, name: "Alice" }
});

handleUserResponse({
  status: "error",
  message: "User not found",
  code: 404
});
```

### Пример 2: Form validation

```typescript
interface FormField {
  value: string;
  error?: string;
}

interface LoginForm {
  email: FormField;
  password: FormField;
}

function validateEmail(email: string): boolean {
  return email.includes("@");
}

function validatePassword(password: string): boolean {
  return password.length >= 8;
}

function validateForm(form: LoginForm): boolean {
  let isValid = true;

  if (!validateEmail(form.email.value)) {
    form.email.error = "Invalid email";
    isValid = false;
  }

  if (!validatePassword(form.password.value)) {
    form.password.error = "Password must be at least 8 characters";
    isValid = false;
  }

  return isValid;
}

// Использование
const form: LoginForm = {
  email: { value: "alice@example.com" },
  password: { value: "12345" }
};

if (validateForm(form)) {
  console.log("Form is valid");
} else {
  console.log("Errors:", form.email.error, form.password.error);
}
```

---

## Рекомендации

### ✅ Хорошие практики

```typescript
// 1. Используйте interface для объектов
interface User {
  id: number;
  name: string;
}

// 2. Используйте type для unions и primitives
type Status = "active" | "inactive";
type ID = number | string;

// 3. Делайте свойства readonly где возможно
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

// 4. Используйте optional для необязательных полей
interface User {
  id: number;
  name: string;
  avatar?: string;
}

// 5. Создавайте discriminated unions
type Result =
  | { success: true; data: any }
  | { success: false; error: string };
```

### ❌ Плохие практики

```typescript
// 1. Не дублируйте типы
// ❌ Плохо
interface User1 { id: number; name: string; }
interface User2 { id: number; name: string; }

// ✅ Хорошо
interface User { id: number; name: string; }
type Admin = User & { role: string };

// 2. Не используйте any в типах
// ❌ Плохо
interface Response {
  data: any;
}

// ✅ Хорошо
interface Response<T> {
  data: T;
}
```

---

## Резюме

✅ Object types, Type aliases, Interfaces  
✅ Optional (`?`) и Readonly свойства  
✅ Intersection (`&`) и Union (`|`) types  
✅ Type guards: typeof, instanceof, in, custom  
✅ Index signatures для динамических свойств  
✅ Extending interfaces

**Следующий урок:** Функции и методы 🚀
