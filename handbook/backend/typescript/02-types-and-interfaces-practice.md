# Практика: Типы и интерфейсы

## Задача 1: Модели данных для блога

Создайте типы для системы блога.

```typescript
// TODO:
// 1. Interface User: id, username, email, avatar (optional)
// 2. Interface Post: id, title, content, authorId, createdAt, tags (массив строк)
// 3. Interface Comment: id, postId, authorId, content, createdAt
// 4. Создайте по одному экземпляру каждого типа
```

<details>
<summary>Решение</summary>

```typescript
interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  createdAt: Date;
  tags: string[];
}

interface Comment {
  id: number;
  postId: number;
  authorId: number;
  content: string;
  createdAt: Date;
}

// Экземпляры
const user: User = {
  id: 1,
  username: "alice",
  email: "alice@example.com",
  avatar: "avatar.jpg"
};

const post: Post = {
  id: 1,
  title: "Getting Started with TypeScript",
  content: "TypeScript is a typed superset of JavaScript...",
  authorId: 1,
  createdAt: new Date(),
  tags: ["typescript", "javascript", "tutorial"]
};

const comment: Comment = {
  id: 1,
  postId: 1,
  authorId: 1,
  content: "Great article!",
  createdAt: new Date()
};

console.log({ user, post, comment });
```
</details>

---

## Задача 2: API Response Types

Создайте типы для различных API ответов.

```typescript
// TODO:
// 1. Создайте Discriminated Union для ApiResponse:
//    - Success: { status: "success"; data: T }
//    - Error: { status: "error"; message: string; code: number }
//    - Loading: { status: "loading" }
// 2. Создайте функцию handleResponse, которая обрабатывает каждый случай
```

<details>
<summary>Решение</summary>

```typescript
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; message: string; code: number }
  | { status: "loading" };

interface User {
  id: number;
  name: string;
}

function handleResponse(response: ApiResponse<User>): void {
  switch (response.status) {
    case "success":
      console.log("User data:", response.data);
      break;
    case "error":
      console.error(`Error ${response.code}: ${response.message}`);
      break;
    case "loading":
      console.log("Loading...");
      break;
  }
}

// Тесты
handleResponse({
  status: "success",
  data: { id: 1, name: "Alice" }
});

handleResponse({
  status: "error",
  message: "User not found",
  code: 404
});

handleResponse({
  status: "loading"
});

// Более практичный пример с async
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  try {
    // Симуляция API запроса
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (id === 1) {
      return {
        status: "success",
        data: { id: 1, name: "Alice" }
      };
    } else {
      return {
        status: "error",
        message: "User not found",
        code: 404
      };
    }
  } catch (e) {
    return {
      status: "error",
      message: "Network error",
      code: 500
    };
  }
}
```
</details>

---

## Задача 3: Intersection Types для миксинов

Создайте миксины для добавления функциональности.

```typescript
// TODO:
// 1. Создайте type Timestamped: createdAt, updatedAt
// 2. Создайте type Identifiable: id (readonly)
// 3. Создайте type User: name, email
// 4. Объедините все через intersection
```

<details>
<summary>Решение</summary>

```typescript
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type Identifiable = {
  readonly id: number;
};

type User = {
  name: string;
  email: string;
};

type TimestampedUser = User & Timestamped & Identifiable;

const user: TimestampedUser = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date()
};

// user.id = 2; // ❌ Error: readonly

console.log(user);

// Функция-хелпер для создания timestamped объектов
function withTimestamps<T extends object>(obj: T): T & Timestamped {
  return {
    ...obj,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

const product = withTimestamps({
  name: "Laptop",
  price: 999
});

console.log(product);
// { name: "Laptop", price: 999, createdAt: Date, updatedAt: Date }
```
</details>

---

## Задача 4: Type Guards

Создайте custom type guards для проверки типов.

```typescript
// TODO:
// 1. Interface Admin: id, name, role: "admin", permissions: string[]
// 2. Interface User: id, name, role: "user"
// 3. Type Person = Admin | User
// 4. Создайте type guard isAdmin(person: Person): person is Admin
// 5. Функция getPermissions(person: Person): string[]
```

<details>
<summary>Решение</summary>

```typescript
interface Admin {
  id: number;
  name: string;
  role: "admin";
  permissions: string[];
}

interface User {
  id: number;
  name: string;
  role: "user";
}

type Person = Admin | User;

// Type guard
function isAdmin(person: Person): person is Admin {
  return person.role === "admin";
}

// Использование type guard
function getPermissions(person: Person): string[] {
  if (isAdmin(person)) {
    return person.permissions;
  } else {
    return ["read"];
  }
}

// Тесты
const admin: Admin = {
  id: 1,
  name: "Alice",
  role: "admin",
  permissions: ["read", "write", "delete"]
};

const user: User = {
  id: 2,
  name: "Bob",
  role: "user"
};

console.log(getPermissions(admin)); // ["read", "write", "delete"]
console.log(getPermissions(user));  // ["read"]

// Альтернативный type guard через discriminated union
function logPerson(person: Person): void {
  switch (person.role) {
    case "admin":
      console.log(`Admin ${person.name} has ${person.permissions.length} permissions`);
      break;
    case "user":
      console.log(`User ${person.name}`);
      break;
  }
}

logPerson(admin); // "Admin Alice has 3 permissions"
logPerson(user);  // "User Bob"
```
</details>

---

## Задача 5: Extending Interfaces

Создайте иерархию интерфейсов для разных типов пользователей.

```typescript
// TODO:
// 1. Interface Person: name, age
// 2. Interface Employee extends Person: employeeId, department
// 3. Interface Manager extends Employee: teamSize
// 4. Создайте экземпляр Manager
```

<details>
<summary>Решение</summary>

```typescript
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: number;
  department: string;
}

interface Manager extends Employee {
  teamSize: number;
  reports: Employee[];
}

const employee1: Employee = {
  name: "Bob",
  age: 28,
  employeeId: 1001,
  department: "Engineering"
};

const employee2: Employee = {
  name: "Charlie",
  age: 25,
  employeeId: 1002,
  department: "Engineering"
};

const manager: Manager = {
  name: "Alice",
  age: 35,
  employeeId: 2001,
  department: "Engineering",
  teamSize: 5,
  reports: [employee1, employee2]
};

console.log(manager);

// Функции для работы с иерархией
function printInfo(person: Person): void {
  console.log(`${person.name}, ${person.age} years old`);
}

function printEmployeeInfo(employee: Employee): void {
  console.log(`Employee #${employee.employeeId} - ${employee.name} (${employee.department})`);
}

function printManagerInfo(manager: Manager): void {
  console.log(`Manager ${manager.name} leads a team of ${manager.teamSize}`);
  manager.reports.forEach(emp => {
    console.log(`  - ${emp.name}`);
  });
}

printInfo(manager);
printEmployeeInfo(manager);
printManagerInfo(manager);
```
</details>

---

## Задача 6: Index Signatures

Создайте типизированный словарь.

```typescript
// TODO:
// 1. Interface Translation: [key: string]: string
// 2. Создайте объект translations с переводами
// 3. Функция translate(key: string, translations: Translation): string
// 4. Функция addTranslation(key: string, value: string, translations: Translation): void
```

<details>
<summary>Решение</summary>

```typescript
interface Translation {
  [key: string]: string;
}

const translations: Translation = {
  hello: "привет",
  goodbye: "до свидания",
  thanks: "спасибо",
  welcome: "добро пожаловать"
};

function translate(key: string, translations: Translation): string {
  return translations[key] || key;
}

function addTranslation(
  key: string,
  value: string,
  translations: Translation
): void {
  translations[key] = value;
}

// Тесты
console.log(translate("hello", translations));    // "привет"
console.log(translate("unknown", translations));  // "unknown"

addTranslation("yes", "да", translations);
console.log(translate("yes", translations));      // "да"

// Более сложный пример: мультиязычный словарь
interface MultiLanguageTranslation {
  [language: string]: {
    [key: string]: string;
  };
}

const multiLang: MultiLanguageTranslation = {
  ru: {
    hello: "привет",
    goodbye: "до свидания"
  },
  en: {
    hello: "hello",
    goodbye: "goodbye"
  },
  es: {
    hello: "hola",
    goodbye: "adiós"
  }
};

function translateMulti(
  key: string,
  language: string,
  translations: MultiLanguageTranslation
): string {
  return translations[language]?.[key] || key;
}

console.log(translateMulti("hello", "ru", multiLang)); // "привет"
console.log(translateMulti("hello", "es", multiLang)); // "hola"
```
</details>

---

## Задача 7: Union Types для форм

Создайте типы для разных полей формы.

```typescript
// TODO:
// Создайте discriminated union для FormField:
// - TextField: type: "text", value: string, placeholder?: string
// - NumberField: type: "number", value: number, min?: number, max?: number
// - CheckboxField: type: "checkbox", checked: boolean, label: string
// Функция renderField(field: FormField): string
```

<details>
<summary>Решение</summary>

```typescript
type TextField = {
  type: "text";
  value: string;
  placeholder?: string;
};

type NumberField = {
  type: "number";
  value: number;
  min?: number;
  max?: number;
};

type CheckboxField = {
  type: "checkbox";
  checked: boolean;
  label: string;
};

type FormField = TextField | NumberField | CheckboxField;

function renderField(field: FormField): string {
  switch (field.type) {
    case "text":
      return `<input type="text" value="${field.value}" placeholder="${field.placeholder || ''}" />`;
    case "number":
      const min = field.min !== undefined ? `min="${field.min}"` : '';
      const max = field.max !== undefined ? `max="${field.max}"` : '';
      return `<input type="number" value="${field.value}" ${min} ${max} />`;
    case "checkbox":
      const checked = field.checked ? 'checked' : '';
      return `<input type="checkbox" ${checked} /> <label>${field.label}</label>`;
  }
}

// Тесты
const nameField: TextField = {
  type: "text",
  value: "Alice",
  placeholder: "Enter your name"
};

const ageField: NumberField = {
  type: "number",
  value: 25,
  min: 0,
  max: 120
};

const subscribeField: CheckboxField = {
  type: "checkbox",
  checked: true,
  label: "Subscribe to newsletter"
};

console.log(renderField(nameField));
console.log(renderField(ageField));
console.log(renderField(subscribeField));

// Форма с валидацией
interface Form {
  fields: FormField[];
}

function validateForm(form: Form): boolean {
  return form.fields.every(field => {
    switch (field.type) {
      case "text":
        return field.value.length > 0;
      case "number":
        const { value, min, max } = field;
        if (min !== undefined && value < min) return false;
        if (max !== undefined && value > max) return false;
        return true;
      case "checkbox":
        return true;
    }
  });
}
```
</details>

---

## Задача 8: Мини-проект "E-commerce Models"

Создайте полную типизацию для интернет-магазина.

<details>
<summary>Требования</summary>

1. Product: id, name, price, category, inStock
2. Category: id, name, slug
3. Cart: items (Product + quantity), total
4. Order: id, userId, items, status, createdAt
5. Функции: addToCart, removeFromCart, calculateTotal, createOrder

</details>

<details>
<summary>Решение</summary>

```typescript
interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  inStock: boolean;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface Cart {
  items: CartItem[];
}

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
}

// Функции
function addToCart(cart: Cart, product: Product, quantity: number = 1): void {
  const existing = cart.items.find(item => item.product.id === product.id);
  
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ product, quantity });
  }
}

function removeFromCart(cart: Cart, productId: number): void {
  cart.items = cart.items.filter(item => item.product.id !== productId);
}

function calculateTotal(cart: Cart): number {
  return cart.items.reduce((sum, item) => {
    return sum + item.product.price * item.quantity;
  }, 0);
}

let orderIdCounter = 1;

function createOrder(userId: number, cart: Cart): Order {
  return {
    id: orderIdCounter++,
    userId,
    items: [...cart.items],
    total: calculateTotal(cart),
    status: "pending",
    createdAt: new Date()
  };
}

function printOrder(order: Order): void {
  console.log(`\nOrder #${order.id} (${order.status})`);
  console.log(`User ID: ${order.userId}`);
  console.log(`Date: ${order.createdAt.toLocaleDateString()}`);
  console.log("\nItems:");
  
  order.items.forEach(({ product, quantity }) => {
    const total = product.price * quantity;
    console.log(`  ${product.name} x${quantity} - $${product.price} = $${total}`);
  });
  
  console.log(`\nTotal: $${order.total}`);
}

// Использование
const electronics: Category = { id: 1, name: "Electronics", slug: "electronics" };
const laptop: Product = { id: 1, name: "Laptop", price: 999, category: electronics, inStock: true };
const mouse: Product = { id: 2, name: "Mouse", price: 29, category: electronics, inStock: true };

const cart: Cart = { items: [] };

addToCart(cart, laptop, 1);
addToCart(cart, mouse, 2);

console.log("Cart total:", calculateTotal(cart)); // 1057

const order = createOrder(123, cart);
printOrder(order);
```
</details>

---

## Проверка знаний

После выполнения всех задач вы должны уметь:
- ✅ Создавать interfaces и type aliases
- ✅ Использовать optional и readonly
- ✅ Работать с intersection и union types
- ✅ Писать type guards (typeof, instanceof, custom)
- ✅ Создавать discriminated unions
- ✅ Использовать index signatures
- ✅ Расширять интерфейсы (extends)

**Следующий урок:** Функции и методы 🚀
