var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var User = /** @class */ (function () {
    function User(id, name, email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
    User.prototype.getInfo = function () {
        return "User [ID: ".concat(this.id, ", Name: ").concat(this.name, ", Email: ").concat(this.email, "]");
    };
    return User;
}());
var user = new User(1, "Alice", "alice@example.com");
console.log(user.getInfo());
var Animal = /** @class */ (function () {
    function Animal(id, age, type) {
        this.id = id;
        this.age = age;
        this.type = type;
    }
    Animal.prototype.getDetails = function () {
        return "Animal [ID: ".concat(this.id, ", Age: ").concat(this.age, ", Type: ").concat(this.type, "]");
    };
    return Animal;
}());
var animal = new Animal(1, 5, "Dog");
console.log(animal.getDetails());
var BankAccount = /** @class */ (function () {
    function BankAccount(accountNumber, ownerName, initialBalance) {
        if (initialBalance === void 0) { initialBalance = 0; }
        this.accountNumber = accountNumber;
        this.ownerName = ownerName;
        this.balance = initialBalance;
    }
    BankAccount.prototype.deposit = function (amount) {
        if (amount > 0) {
            this.balance += amount;
            console.log("Deposited: $".concat(amount, ". New Balance: $").concat(this.balance));
        }
        else {
            console.log("Deposit amount must be positive.");
        }
    };
    BankAccount.prototype.getBalance = function () {
        return this.balance;
    };
    BankAccount.prototype.log = function (message) {
        console.log("[Account ".concat(this.accountNumber, "]: ").concat(message));
    };
    return BankAccount;
}());
var account = new BankAccount("123456789", "Alice", 1000);
console.log("Initial Balance:", account.getBalance());
account.deposit(500);
console.log("Current Balance:", account.getBalance());
//Abstract Classes and Inheritance
var Shape = /** @class */ (function () {
    function Shape() {
    }
    Shape.prototype.describe = function () {
        return "This shape has an area of ".concat(this.area());
    };
    return Shape;
}());
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(width, height) {
        var _this = _super.call(this) || this;
        _this.width = width;
        _this.height = height;
        return _this;
    }
    Rectangle.prototype.area = function () {
        return this.width * this.height;
    };
    return Rectangle;
}(Shape));
console.log(new Rectangle(5, 10).describe());
var Person = /** @class */ (function () {
    function Person() {
        this._age = 0;
    }
    Object.defineProperty(Person.prototype, "age", {
        // Getter - для чтения значения
        get: function () {
            return this._age;
        },
        // Setter - для установки значения
        set: function (value) {
            if (value >= 0 && value <= 150) {
                this._age = value;
            }
            else {
                throw new Error("Invalid age");
            }
        },
        enumerable: false,
        configurable: true
    });
    return Person;
}());
var person = new Person();
person.age = 1; // Вызов сеттера
console.log("Person's age:", person.age); // Вызов геттера
