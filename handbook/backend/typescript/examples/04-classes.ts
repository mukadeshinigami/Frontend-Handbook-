class User {
    id: number; // Explicit property declarations
    name: string;
    email: string;

    constructor(id: number, name: string, email: string) { // Конструктор класса
        this.id = id;
        this.name = name;
        this.email = email;
    }

    getInfo(): string {
        return `User [ID: ${this.id}, Name: ${this.name}, Email: ${this.email}]`;
    }
}

const user = new User(1, "Alice", "alice@example.com");
console.log(user.getInfo());

class Animal {
    constructor(
        public id: number,
        public age: number,
        public type: string
    ) {}

    getDetails(): string {
        return `Animal [ID: ${this.id}, Age: ${this.age}, Type: ${this.type}]`;
    }
}

const animal = new Animal(1, 5, "Dog");
console.log(animal.getDetails());

class BankAccount {
    public readonly accountNumber: string;
    private balance: number;
    protected ownerName: string;

    constructor(accountNumber: string, ownerName: string, initialBalance: number = 0) {
        this.accountNumber = accountNumber;
        this.ownerName = ownerName;
        this.balance = initialBalance;
    }

    public deposit(amount: number): void {
        if (amount > 0) {
            this.balance += amount;
            console.log(`Deposited: $${amount}. New Balance: $${this.balance}`);
        } else {
            console.log("Deposit amount must be positive.");
        }
    }

    public getBalance(): number {
        return this.balance;
    }

    private log(message: string): void {
        console.log(`[Account ${this.accountNumber}]: ${message}`);
    }
}

const account = new BankAccount("123456789", "Alice", 1000);
console.log("Initial Balance:", account.getBalance());
account.deposit(500);
console.log("Current Balance:", account.getBalance());

//Abstract Classes and Inheritance

abstract class Shape {
    abstract area(): number;

    describe(): string {
        return `This shape has an area of ${this.area()}`;
    }
}

class Rectangle extends Shape {
    constructor(private width: number, private height: number) {
        super();
    }

    area(): number {
        return this.width * this.height;
    }
}

console.log(new Rectangle(5, 10).describe());

class Person {
    private _age: number = 0;

    // Getter - для чтения значения
    get age(): number {
        return this._age;
    }

    // Setter - для установки значения
    set age(value: number) {
        if (value >= 0 && value <= 150) {
            this._age = value;
        } else {
            throw new Error("Invalid age");
        }
    }
}

const person = new Person();
person.age = 1; // Вызов сеттера
console.log("Person's age:", person.age); // Вызов геттера