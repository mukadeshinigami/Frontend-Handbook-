# Блок 5: Enums и литералы

## Numeric Enums

```typescript
enum Status {
  Pending,    // 0
  Approved,   // 1
  Rejected    // 2
}

let orderStatus: Status = Status.Pending;
console.log(orderStatus); // 0

// С кастомными значениями
enum HttpStatus {
  OK = 200,
  BadRequest = 400,
  NotFound = 404,
  InternalError = 500
}

console.log(HttpStatus.OK); // 200
```

---

## String Enums

```typescript
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}

function move(direction: Direction): void {
  console.log(`Moving ${direction}`);
}

move(Direction.Up); // "Moving UP"
```

---

## Const Enums

```typescript
const enum Color {
  Red = "#FF0000",
  Green = "#00FF00",
  Blue = "#0000FF"
}

// Компилируется в простое значение
const red = Color.Red; // "#FF0000"
```

---

## Literal Types

```typescript
// String literals
type Status = "pending" | "approved" | "rejected";

let status: Status = "pending";
// status = "unknown"; // ❌ Error

// Number literals
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

// Boolean literals
type YesNo = true | false;

// Mixed literals
type Mixed = "yes" | 42 | true;
```

---

## Template Literal Types

```typescript
type EventName = "click" | "scroll" | "mousemove";
type Handler = `on${Capitalize<EventName>}`;

// Handler = "onClick" | "onScroll" | "onMousemove"

type Color = "red" | "blue";
type Size = "small" | "large";
type Style = `${Color}-${Size}`;

// Style = "red-small" | "red-large" | "blue-small" | "blue-large"
```

---

## Практический пример: User Roles

```typescript
enum Role {
  Admin = "ADMIN",
  User = "USER",
  Guest = "GUEST"
}

interface User {
  id: number;
  name: string;
  role: Role;
}

function hasPermission(user: User, action: string): boolean {
  if (user.role === Role.Admin) {
    return true;
  }
  
  if (user.role === Role.User && action === "read") {
    return true;
  }
  
  return false;
}

const admin: User = { id: 1, name: "Alice", role: Role.Admin };
const user: User = { id: 2, name: "Bob", role: Role.User };

console.log(hasPermission(admin, "delete")); // true
console.log(hasPermission(user, "delete"));  // false
```

---

## Резюме

✅ Numeric и String enums  
✅ Const enums  
✅ Literal types  
✅ Template literal types

**Следующий урок:** Generics 🚀
