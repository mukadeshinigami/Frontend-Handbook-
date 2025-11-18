# Практика: Основы TypeScript

## Задача 1: Настройка проекта

Создайте новый TypeScript проект с нуля.

**Шаги:**
1. Создайте папку `ts-basics`
2. Инициализируйте npm проект
3. Установите TypeScript
4. Создайте tsconfig.json
5. Создайте файл `src/index.ts`
6. Скомпилируйте и запустите

<details>
<summary>Решение</summary>

```bash
mkdir ts-basics
cd ts-basics
npm init -y
npm install --save-dev typescript @types/node

# Создаём tsconfig.json
npx tsc --init
```

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

`src/index.ts`:
```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}

console.log(greet("TypeScript"));
```

```bash
npx tsc
node dist/index.js
```
</details>

---

## Задача 2: Типизация примитивов

Создайте переменные всех примитивных типов и выведите их в консоль.

```typescript
// TODO: Создайте переменные
// - name (string)
// - age (number)
// - isStudent (boolean)
// - salary (number с дробной частью)
// - hobby (null или string)
```

<details>
<summary>Решение</summary>

```typescript
let name: string = "Alice";
let age: number = 25;
let isStudent: boolean = true;
let salary: number = 50000.50;
let hobby: string | null = "Programming";

console.log({ name, age, isStudent, salary, hobby });

// Type inference вариант (типы выводятся автоматически)
const name2 = "Bob";
const age2 = 30;
const isStudent2 = false;
```
</details>

---

## Задача 3: Работа с массивами

Типизируйте массивы и выполните операции.

```typescript
// TODO:
// 1. Создайте массив чисел от 1 до 10
// 2. Создайте массив имён (минимум 3)
// 3. Создайте массив, содержащий числа и строки
// 4. Найдите сумму всех чисел
// 5. Выведите имена в верхнем регистре
```

<details>
<summary>Решение</summary>

```typescript
// 1. Массив чисел
const numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 2. Массив имён
const names: string[] = ["Alice", "Bob", "Charlie", "Diana"];

// 3. Смешанный массив
const mixed: (number | string)[] = [1, "two", 3, "four", 5];

// 4. Сумма чисел
const sum: number = numbers.reduce((acc, n) => acc + n, 0);
console.log("Sum:", sum); // 55

// 5. Имена в верхнем регистре
const upperNames: string[] = names.map(name => name.toUpperCase());
console.log(upperNames); // ["ALICE", "BOB", "CHARLIE", "DIANA"]

// Бонус: фильтрация чётных чисел
const evens: number[] = numbers.filter(n => n % 2 === 0);
console.log("Evens:", evens); // [2, 4, 6, 8, 10]
```
</details>

---

## Задача 4: Tuple для данных пользователя

Создайте tuple для хранения информации о пользователе: [id, name, age, isAdmin].

```typescript
// TODO:
// 1. Создайте тип User tuple: [number, string, number, boolean]
// 2. Создайте массив users с 3 пользователями
// 3. Выведите имя и возраст каждого пользователя
// 4. Найдите всех администраторов
```

<details>
<summary>Решение</summary>

```typescript
// 1. Тип User tuple
type User = [id: number, name: string, age: number, isAdmin: boolean];

// 2. Массив пользователей
const users: User[] = [
  [1, "Alice", 25, true],
  [2, "Bob", 30, false],
  [3, "Charlie", 22, true]
];

// 3. Вывод имени и возраста
users.forEach(([id, name, age]) => {
  console.log(`${name} is ${age} years old`);
});

// 4. Фильтр администраторов
const admins: User[] = users.filter(([, , , isAdmin]) => isAdmin);
console.log("Admins:");
admins.forEach(([id, name]) => {
  console.log(`- ${name} (ID: ${id})`);
});

// Альтернативный вывод
for (const [id, name, age, isAdmin] of users) {
  const role = isAdmin ? "Admin" : "User";
  console.log(`[${role}] ${name}, ${age} years`);
}
```
</details>

---

## Задача 5: Функция с типизацией

Создайте функцию калькулятора с несколькими операциями.

```typescript
// TODO:
// Функция calculate должна:
// - Принимать два числа и операцию ('+' | '-' | '*' | '/')
// - Возвращать результат (number)
// - Обрабатывать деление на ноль
```

<details>
<summary>Решение</summary>

```typescript
type Operation = '+' | '-' | '*' | '/';

function calculate(a: number, b: number, op: Operation): number {
  switch (op) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) {
        throw new Error("Division by zero");
      }
      return a / b;
    default:
      // never тип для exhaustiveness check
      const _exhaustive: never = op;
      throw new Error(`Unknown operation: ${_exhaustive}`);
  }
}

// Тесты
console.log(calculate(10, 5, '+')); // 15
console.log(calculate(10, 5, '-')); // 5
console.log(calculate(10, 5, '*')); // 50
console.log(calculate(10, 5, '/')); // 2

// Error handling
try {
  calculate(10, 0, '/');
} catch (e) {
  console.error(e.message); // Division by zero
}
```
</details>

---

## Задача 6: Type Guards

Создайте функцию, которая обрабатывает unknown тип безопасно.

```typescript
// TODO:
// Функция processValue должна:
// - Принимать unknown
// - Если string - вернуть длину
// - Если number - вернуть квадрат
// - Если boolean - вернуть инверсию
// - Иначе вернуть null
```

<details>
<summary>Решение</summary>

```typescript
function processValue(value: unknown): number | boolean | null {
  if (typeof value === "string") {
    return value.length;
  }
  
  if (typeof value === "number") {
    return value ** 2;
  }
  
  if (typeof value === "boolean") {
    return !value;
  }
  
  return null;
}

// Тесты
console.log(processValue("hello"));     // 5
console.log(processValue(5));           // 25
console.log(processValue(true));        // false
console.log(processValue(false));       // true
console.log(processValue(null));        // null
console.log(processValue([1, 2, 3]));   // null
```

**С более детальной типизацией:**

```typescript
type ProcessResult = number | boolean | null;

function processValueSafe(value: unknown): ProcessResult {
  if (typeof value === "string" && value.length > 0) {
    return value.length;
  }
  
  if (typeof value === "number" && !isNaN(value)) {
    return value ** 2;
  }
  
  if (typeof value === "boolean") {
    return !value;
  }
  
  console.warn("Unsupported value type:", typeof value);
  return null;
}
```
</details>

---

## Задача 7: Парсинг данных

Создайте функцию для безопасного парсинга JSON.

```typescript
// TODO:
// Функция parseJSON должна:
// - Принимать строку
// - Пытаться распарсить JSON
// - Возвращать unknown (не any!)
// - Обрабатывать ошибки парсинга
```

<details>
<summary>Решение</summary>

```typescript
function parseJSON(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error("Invalid JSON:", error);
    return null;
  }
}

// Type guard для проверки структуры
function isUser(value: unknown): value is { id: number; name: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "name" in value &&
    typeof (value as any).id === "number" &&
    typeof (value as any).name === "string"
  );
}

// Использование
const jsonString = '{"id": 1, "name": "Alice"}';
const parsed = parseJSON(jsonString);

if (isUser(parsed)) {
  console.log(`User: ${parsed.name} (ID: ${parsed.id})`);
} else {
  console.log("Not a valid user object");
}

// Тест с невалидным JSON
const invalid = parseJSON("{invalid json}");
console.log(invalid); // null
```
</details>

---

## Задача 8: Мини-проект "Список покупок"

Создайте типизированное приложение для списка покупок.

**Требования:**
- Тип для продукта: name, price, quantity
- Функция добавления продукта
- Функция расчёта общей стоимости
- Функция вывода списка

<details>
<summary>Решение</summary>

```typescript
type Product = {
  name: string;
  price: number;
  quantity: number;
};

class ShoppingList {
  private items: Product[] = [];

  addProduct(name: string, price: number, quantity: number): void {
    const existing = this.items.find(item => item.name === name);
    
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ name, price, quantity });
    }
  }

  removeProduct(name: string): void {
    this.items = this.items.filter(item => item.name !== name);
  }

  getTotalCost(): number {
    return this.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }

  printList(): void {
    console.log("\n=== Shopping List ===");
    
    if (this.items.length === 0) {
      console.log("Empty list");
      return;
    }

    this.items.forEach(({ name, price, quantity }) => {
      const total = price * quantity;
      console.log(`${name} x${quantity} - $${price.toFixed(2)} each = $${total.toFixed(2)}`);
    });
    
    console.log(`\nTotal: $${this.getTotalCost().toFixed(2)}`);
  }
}

// Использование
const list = new ShoppingList();

list.addProduct("Milk", 2.5, 2);
list.addProduct("Bread", 1.8, 1);
list.addProduct("Eggs", 3.2, 3);
list.addProduct("Milk", 2.5, 1); // Добавит к существующему

list.printList();
// === Shopping List ===
// Milk x3 - $2.50 each = $7.50
// Bread x1 - $1.80 each = $1.80
// Eggs x3 - $3.20 each = $9.60
// Total: $18.90

list.removeProduct("Bread");
list.printList();
```
</details>

---

## Дополнительные задачи

### Задача 9: Конвертер температур

```typescript
// Создайте функции:
// - celsiusToFahrenheit(c: number): number
// - fahrenheitToCelsius(f: number): number
// - kelvinToCelsius(k: number): number
```

### Задача 10: Валидация email

```typescript
// Создайте функцию isValidEmail(email: string): boolean
// Проверка должна включать:
// - Наличие @
// - Символы до и после @
// - Точка в домене
```

---

## Проверка знаний

После выполнения всех задач вы должны уметь:
- ✅ Настраивать TypeScript проект
- ✅ Использовать примитивные типы
- ✅ Работать с массивами и tuple
- ✅ Создавать типизированные функции
- ✅ Применять type guards для unknown
- ✅ Обрабатывать ошибки типобезопасно

**Следующий урок:** Типы и интерфейсы 🚀
