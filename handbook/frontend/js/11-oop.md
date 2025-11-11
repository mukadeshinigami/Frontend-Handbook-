# Блок 11: ООП в JavaScript (Классы)

## Введение

**ООП (Объектно-ориентированное программирование)** — парадигма программирования, основанная на концепции объектов.

**Принципы ООП:**
- **Инкапсуляция** — сокрытие данных
- **Наследование** — переиспользование кода
- **Полиморфизм** — разное поведение одного метода
- **Абстракция** — упрощение сложности

---

## Классы

```javascript
class User {
  // Конструктор
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  
  // Методы
  greet() {
    console.log(`Привет, я ${this.name}`);
  }
  
  isAdult() {
    return this.age >= 18;
  }
}

// Создание экземпляра
const user = new User('Алексей', 25);
user.greet(); // Привет, я Алексей
console.log(user.isAdult()); // true
```

---

## Геттеры и сеттеры

```javascript
class User {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
  
  // Геттер
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
  
  // Сеттер
  set fullName(value) {
    [this.firstName, this.lastName] = value.split(' ');
  }
}

const user = new User('Иван', 'Иванов');
console.log(user.fullName); // Иван Иванов
user.fullName = 'Пётр Петров';
console.log(user.firstName); // Пётр
```

---

## Приватные поля

```javascript
class BankAccount {
  #balance = 0; // Приватное поле
  
  constructor(owner) {
    this.owner = owner;
  }
  
  deposit(amount) {
    if (amount > 0) {
      this.#balance += amount;
    }
  }
  
  withdraw(amount) {
    if (amount > 0 && amount <= this.#balance) {
      this.#balance -= amount;
    }
  }
  
  get balance() {
    return this.#balance;
  }
}

const account = new BankAccount('Алексей');
account.deposit(1000);
console.log(account.balance); // 1000
// console.log(account.#balance); // Ошибка! Приватное поле
```

---

## Статические методы

```javascript
class MathHelper {
  static PI = 3.14159;
  
  static square(x) {
    return x * x;
  }
  
  static cube(x) {
    return x * x * x;
  }
}

console.log(MathHelper.PI); // 3.14159
console.log(MathHelper.square(5)); // 25
// const helper = new MathHelper(); // Не нужен экземпляр
```

---

## Наследование

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(`${this.name} издаёт звук`);
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name); // Вызов конструктора родителя
    this.breed = breed;
  }
  
  speak() {
    console.log(`${this.name} лает: Гав!`);
  }
  
  fetch() {
    console.log(`${this.name} приносит мяч`);
  }
}

const dog = new Dog('Бобик', 'Овчарка');
dog.speak(); // Бобик лает: Гав!
dog.fetch(); // Бобик приносит мяч
```

---

## Переопределение методов

```javascript
class Shape {
  area() {
    return 0;
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }
  
  area() {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }
  
  area() {
    return Math.PI * this.radius ** 2;
  }
}

const rect = new Rectangle(10, 5);
const circle = new Circle(7);
console.log(rect.area()); // 50
console.log(circle.area()); // 153.93...
```

---

## Композиция

```javascript
// Миксины
const canEat = {
  eat(food) {
    console.log(`Ем ${food}`);
  }
};

const canWalk = {
  walk() {
    console.log('Иду');
  }
};

class Person {
  constructor(name) {
    this.name = name;
  }
}

// Добавление методов
Object.assign(Person.prototype, canEat, canWalk);

const person = new Person('Иван');
person.eat('яблоко'); // Ем яблоко
person.walk(); // Иду
```

---

## Пример: Система пользователей

```javascript
class User {
  static #idCounter = 0;
  #password;
  
  constructor(username, password, email) {
    this.id = ++User.#idCounter;
    this.username = username;
    this.#password = password;
    this.email = email;
    this.createdAt = new Date();
  }
  
  verifyPassword(password) {
    return this.#password === password;
  }
  
  changePassword(oldPassword, newPassword) {
    if (this.verifyPassword(oldPassword)) {
      this.#password = newPassword;
      return true;
    }
    return false;
  }
  
  get info() {
    return {
      id: this.id,
      username: this.username,
      email: this.email
    };
  }
}

class Admin extends User {
  constructor(username, password, email) {
    super(username, password, email);
    this.role = 'admin';
    this.permissions = ['read', 'write', 'delete'];
  }
  
  hasPermission(action) {
    return this.permissions.includes(action);
  }
  
  deleteUser(user) {
    if (this.hasPermission('delete')) {
      console.log(`Удалён пользователь ${user.username}`);
    }
  }
}

const user = new User('john', '12345', 'john@example.com');
const admin = new Admin('admin', 'admin123', 'admin@example.com');

console.log(user.info);
console.log(admin.hasPermission('delete')); // true
```

---

## instanceof и typeof

```javascript
class User {}
class Admin extends User {}

const user = new User();
const admin = new Admin();

console.log(user instanceof User); // true
console.log(admin instanceof Admin); // true
console.log(admin instanceof User); // true (наследование)

console.log(typeof user); // object
console.log(typeof User); // function
```

---

## Пример: Магазин

```javascript
class Product {
  constructor(name, price, quantity) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
  }
  
  get totalPrice() {
    return this.price * this.quantity;
  }
}

class ShoppingCart {
  #items = [];
  
  addItem(product) {
    this.#items.push(product);
  }
  
  removeItem(productName) {
    this.#items = this.#items.filter(item => item.name !== productName);
  }
  
  get total() {
    return this.#items.reduce((sum, item) => sum + item.totalPrice, 0);
  }
  
  get items() {
    return [...this.#items]; // Копия массива
  }
  
  checkout() {
    console.log(`Итого: ${this.total} руб.`);
    console.log('Товары:');
    this.#items.forEach(item => {
      console.log(`  ${item.name} x${item.quantity} = ${item.totalPrice} руб.`);
    });
    this.#items = [];
  }
}

const cart = new ShoppingCart();
cart.addItem(new Product('Яблоки', 50, 3));
cart.addItem(new Product('Молоко', 80, 2));
cart.checkout();
// Итого: 310 руб.
// Товары:
//   Яблоки x3 = 150 руб.
//   Молоко x2 = 160 руб.
```

---

## Цепочка вызовов (Chaining)

```javascript
class QueryBuilder {
  #query = '';
  
  select(...fields) {
    this.#query += `SELECT ${fields.join(', ')} `;
    return this;
  }
  
  from(table) {
    this.#query += `FROM ${table} `;
    return this;
  }
  
  where(condition) {
    this.#query += `WHERE ${condition} `;
    return this;
  }
  
  build() {
    return this.#query.trim();
  }
}

const query = new QueryBuilder()
  .select('id', 'name', 'email')
  .from('users')
  .where('age > 18')
  .build();

console.log(query);
// SELECT id, name, email FROM users WHERE age > 18
```

---

## Рекомендации

✅ Используйте классы для сложной логики  
✅ Приватные поля для инкапсуляции  
✅ Статические методы для утилит  
✅ Геттеры для вычисляемых свойств  
✅ Наследование для общей логики  

❌ Не злоупотребляйте наследованием (композиция > наследование)  
❌ Не делайте слишком большие классы  
❌ Не забывайте `super()` в конструкторе наследника  

**Переходите к практике!** 🚀
