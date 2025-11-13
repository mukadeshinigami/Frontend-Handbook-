// Number
let age: number = 25;
let price: number = 99.99;
let hex: number = 0xf00d;

// String
let userName: string = "Alice"; // Изменил name на userName
let message: string = `Hello, ${userName}!`;

// Boolean
let isDone: boolean = false;
let isActive: boolean = true;

// Null и Undefined
let n: null = null;
let u: undefined = undefined;

// Symbol (требует настройки tsconfig)
// let sym: symbol = Symbol("key");

// BigInt (ES2020+) (требует настройки tsconfig)
// let big: bigint = 100n;

console.log(age, price, hex, userName, message, isDone, isActive, n, u);