# Блок 4: Классы и ООП

## Классы в TypeScript

```typescript
class User {
  // Свойства с типами
  id: number;
  name: string;
  email: string;

  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  greet(): string {
    return `Hello, I'm ${this.name}`;
  }
}

const user = new User(1, "Alice", "alice@example.com");
console.log(user.greet());
```

### Сокращённый синтаксис

```typescript
class User {
  constructor(
    public id: number,
    public name: string,
    public email: string
  ) {}

  greet(): string {
    return `Hello, I'm ${this.name}`;
  }
}
```

---

## Модификаторы доступа

```typescript
class BankAccount {
  public accountNumber: string;    // Доступно везде
  private balance: number;          // Только внутри класса
  protected owner: string;          // Класс + наследники

  constructor(accountNumber: string, owner: string, initialBalance: number = 0) {
    this.accountNumber = accountNumber;
    this.owner = owner;
    this.balance = initialBalance;
  }

  public deposit(amount: number): void {
    if (amount > 0) {
      this.balance += amount;
    }
  }

  public getBalance(): number {
    return this.balance;
  }

  private log(message: string): void {
    console.log(`[${this.accountNumber}] ${message}`);
  }
}

const account = new BankAccount("123", "Alice", 1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
// console.log(account.balance); // ❌ Error: private
```

---

## Readonly свойства

```typescript
class User {
  readonly id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }

  rename(newName: string): void {
    this.name = newName;
    // this.id = 2; // ❌ Error: readonly
  }
}
```

---

## Abstract классы

```typescript
abstract class Shape {
  abstract getArea(): number;
  abstract getPerimeter(): number;

  describe(): string {
    return `Area: ${this.getArea()}, Perimeter: ${this.getPerimeter()}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }

  getPerimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

const circle = new Circle(5);
console.log(circle.describe());
// const shape = new Shape(); // ❌ Error: cannot instantiate abstract class
```

---

## Implements и Extends

```typescript
interface Printable {
  print(): void;
}

interface Saveable {
  save(): void;
}

class Document implements Printable, Saveable {
  constructor(public content: string) {}

  print(): void {
    console.log(this.content);
  }

  save(): void {
    console.log("Saving document...");
  }
}

// Extends
class Animal {
  constructor(public name: string) {}

  move(distance: number): void {
    console.log(`${this.name} moved ${distance}m`);
  }
}

class Dog extends Animal {
  bark(): void {
    console.log("Woof!");
  }
}

const dog = new Dog("Rex");
dog.move(10);
dog.bark();
```

---

## Static members

```typescript
class MathUtils {
  static PI = 3.14159;

  static circleArea(radius: number): number {
    return this.PI * radius ** 2;
  }

  static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

console.log(MathUtils.PI);
console.log(MathUtils.circleArea(5));
console.log(MathUtils.randomInt(1, 10));
```

---

## Getters и Setters

```typescript
class Temperature {
  private _celsius: number = 0;

  get celsius(): number {
    return this._celsius;
  }

  set celsius(value: number) {
    if (value < -273.15) {
      throw new Error("Temperature below absolute zero");
    }
    this._celsius = value;
  }

  get fahrenheit(): number {
    return (this._celsius * 9/5) + 32;
  }

  set fahrenheit(value: number) {
    this.celsius = (value - 32) * 5/9;
  }
}

const temp = new Temperature();
temp.celsius = 25;
console.log(temp.fahrenheit); // 77
```

---

## Резюме

✅ Классы с типизацией  
✅ Модификаторы: public, private, protected  
✅ Abstract классы  
✅ Implements и Extends  
✅ Static members  
✅ Getters и Setters

**Следующий урок:** Enums и литералы 🚀
