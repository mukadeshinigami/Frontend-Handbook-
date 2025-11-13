// Number
var age = 25;
var price = 99.99;
var hex = 0xf00d;
// String
var userName = "Alice"; // Изменил name на userName
var message = "Hello, ".concat(userName, "!");
// Boolean
var isDone = false;
var isActive = true;
// Null и Undefined
var n = null;
var u = undefined;
// Symbol (требует настройки tsconfig)
// let sym: symbol = Symbol("key");
// BigInt (ES2020+) (требует настройки tsconfig)
// let big: bigint = 100n;
console.log(age, price, hex, userName, message, isDone, isActive, n, u);
