# Блок 6: Generics (Дженерики)

## Что такое дженерики?

Дженерики позволяют создавать переиспользуемый код, работающий с разными типами.

```typescript
// Без дженериков
function identityNumber(value: number): number {
  return value;
}

function identityString(value: string): string {
  return value;
}

// С дженериками
function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(42);
const str = identity<string>("hello");
const bool = identity(true); // Type inference
```

---

## Generic Functions

```typescript
// Функция первого элемента
function first<T>(array: T[]): T | undefined {
  return array[0];
}

const numbers = [1, 2, 3];
const firstNum = first(numbers); // number | undefined

const strings = ["a", "b", "c"];
const firstStr = first(strings); // string | undefined

// Map функция
function map<T, U>(array: T[], fn: (item: T) => U): U[] {
  return array.map(fn);
}

const doubled = map([1, 2, 3], n => n * 2);        // number[]
const lengths = map(["a", "bb", "ccc"], s => s.length); // number[]
```

---

## Generic Interfaces

```typescript
interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 42 };
const stringBox: Box<string> = { value: "hello" };

// Generic с методами
interface Repository<T> {
  items: T[];
  add(item: T): void;
  findById(id: number): T | undefined;
}

class UserRepository implements Repository<User> {
  items: User[] = [];

  add(user: User): void {
    this.items.push(user);
  }

  findById(id: number): User | undefined {
    return this.items.find(u => u.id === id);
  }
}
```

---

## Generic Classes

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }
}

const numberStack = new Stack<number>();
numberStack.push(1);
numberStack.push(2);
console.log(numberStack.pop()); // 2

const stringStack = new Stack<string>();
stringStack.push("a");
stringStack.push("b");
```

---

## Constraints (ограничения)

```typescript
// Ограничение: T должен иметь length
interface Lengthy {
  length: number;
}

function logLength<T extends Lengthy>(value: T): void {
  console.log(value.length);
}

logLength("hello");      // OK: string has length
logLength([1, 2, 3]);    // OK: array has length
// logLength(42);        // ❌ Error: number doesn't have length

// Constraint с keyof
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Alice", age: 25 };
const name = getProperty(user, "name");   // string
const age = getProperty(user, "age");     // number
// getProperty(user, "unknown"); // ❌ Error
```

---

## Multiple Type Parameters

```typescript
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const p1 = pair(1, "one");      // [number, string]
const p2 = pair(true, { x: 10 }); // [boolean, { x: number }]

// Практический пример: Map
class Dictionary<K, V> {
  private items: Map<K, V> = new Map();

  set(key: K, value: V): void {
    this.items.set(key, value);
  }

  get(key: K): V | undefined {
    return this.items.get(key);
  }

  has(key: K): boolean {
    return this.items.has(key);
  }
}

const dict = new Dictionary<string, number>();
dict.set("one", 1);
dict.set("two", 2);
console.log(dict.get("one")); // 1
```

---

## Default Type Parameters

```typescript
interface Response<T = unknown> {
  data: T;
  status: number;
}

const response1: Response = { data: "anything", status: 200 };
const response2: Response<User> = { data: { id: 1, name: "Alice" }, status: 200 };
```

---

## Практический пример: API Client

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

class ApiClient {
  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await fetch(url);
    const data = await response.json();
    
    return {
      data,
      status: response.status
    };
  }

  async post<T, U>(url: string, body: T): Promise<ApiResponse<U>> {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" }
    });
    
    const data = await response.json();
    
    return {
      data,
      status: response.status
    };
  }
}

// Использование
const client = new ApiClient();

interface User {
  id: number;
  name: string;
}

const userResponse = await client.get<User>("/api/users/1");
console.log(userResponse.data.name);
```

---

## Резюме

✅ Generic functions, classes, interfaces  
✅ Type constraints (extends)  
✅ keyof constraint  
✅ Multiple type parameters  
✅ Default type parameters

**Следующий урок:** Utility Types 🚀
