function add(a: number, b: number): number {
    return a + b;
}

console.log("Add 2 + 3 =", add(2, 3));

const subtract = (a: number, b: number): number => a - b; // Arrow function syntax

console.log("Subtract 5 - 2 =", subtract(5, 2));

function sum(...addNumbers: number[]): number {
    return addNumbers.reduce((total, num) => total + num, 0);
}

console.log("Sum of 1, 2, 3, 4 =", sum(1, 2, 3, 4));
console.log("Sum of 10, 20, 30 =", sum(10, 20, 30,123,23,4,5,6,7,8,9,10));

// Rest + обычные параметры
function logMessage(level: string, ...messages: string[]): void {
  console.log(`[${level}]`, messages.join(" "));
}


// call the function directly (logMessage returns void)
console.log(logMessage("INFO", "This", "is", "a", "log", "message."));

function createPerson(
    name: string,
    ...detalis: [age: number, email: string]
): object {
    const [age, email] = detalis;
    return {
        name,
        age,
        email
    };
}

const person = createPerson("Alice", 30, "alice@example.com");
console.log("Person:", person);

//Callbacks и Higher-Order Functions

type Callbacks<num> = (item: num) => void;

function forEach<num>(array: num[], callback: Callbacks<num>): void {
    for (const item of array) {
        callback(item);
    }
}

forEach<number>([1, 2, 3, 4, 5, 5], (num) => {
    console.log("Number:", num);
});

//Async Functions

// Regular function
function regularFunction(): number {
    return 42;
}

// Async function - ALWAYS returns a Promise
async function asyncFunction(): Promise<number> {
    return 42; // Automatically wrapped in Promise
}

console.log("Regular function returns:", regularFunction()); // 42
// They're equivalent!
asyncFunction().then(result => console.log("Async function returns:", result)); // 42

async function demonstrateAwait() {
    console.log("Start");
    
    async function fetchData(): Promise<string> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve("Data fetched!");
            }, 2000);
        });
    }

    // This line PAUSES this function until the Promise resolves
    const data = await fetchData();
    
    console.log("This runs ONLY after fetchData completes");
    return data;
}
console.log("Calling demonstrateAwait...");
demonstrateAwait().then(result => console.log(result));