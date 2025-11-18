# Практика: Функции и методы

## Задача 1: Типизированный калькулятор

```typescript
// TODO: Создайте тип Operation и функцию calculate
type Operation = "add" | "subtract" | "multiply" | "divide";

function calculate(a: number, b: number, op: Operation): number {
  // Реализация
}
```

<details><summary>Решение</summary>

```typescript
type Operation = "add" | "subtract" | "multiply" | "divide";

function calculate(a: number, b: number, op: Operation): number {
  switch (op) {
    case "add": return a + b;
    case "subtract": return a - b;
    case "multiply": return a * b;
    case "divide": 
      if (b === 0) throw new Error("Division by zero");
      return a / b;
  }
}

console.log(calculate(10, 5, "add")); // 15
```
</details>

---

## Задача 2: Retry функция

```typescript
// TODO: async retry с типизацией
async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3
): Promise<T> {
  // Реализация
}
```

---

## Задача 3: Валидаторы

```typescript
type Validator<T> = (value: T) => string | null;

const minLength = (min: number): Validator<string> => {
  return (value) => value.length >= min ? null : `Min ${min}`;
};

// TODO: создайте maxLength, hasNumber, hasUpperCase
```

---

## Задача 4: Higher-order functions

```typescript
// TODO: pipe функция
function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
  return (value: T) => fns.reduce((acc, fn) => fn(acc), value);
}

const double = (n: number) => n * 2;
const increment = (n: number) => n + 1;
const square = (n: number) => n ** 2;

const transform = pipe(double, increment, square);
console.log(transform(3)); // ((3 * 2) + 1) ** 2 = 49
```

**Следующий урок:** Классы и ООП 🚀
