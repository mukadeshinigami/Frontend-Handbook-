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

let numbers: number[] = [1, 2, 3, 4, 5]; // Массив чисел
let names: string[] = ["Alice", "Bob", "Charlie"]; // Массив строк

let scores: Array<number> = [10, 20, 30]; // Альтернативный синтаксис массива

let matrix: number[][] = [

    [1,2,3],
    [4,6,7]

];

let mix: (number | string)[] = [1, "two", 3, "four"]

let user: {name: string; age: number} = {
    name: "A",
    age: 123
}
console.log(user.age)
console.log(age, price, hex, userName, message, isDone, isActive);