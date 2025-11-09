const MAX_POINTS: u32 = 100_000;
const PI: f64 = 3.14159265359;

fn main() {

    println!("Hello, world!");
    
    let x = 5;
    let y = 10;

    println!("The sum of {} and {} is {}.", x, y, x + y);


    println!("Десятичное: {}", 255);

    println!("Бинарное: {:b}", 255);

    println!("Шестнадцатеричное: {:x}", 255);

    println!("С двумя знаками после запятой: {:.2}", 3.14159);

    eprint!("Ошибка в stderr");

    eprintln!("Ошибка в stderr с переносом");

    println!("MAX_POINTS = {}", MAX_POINTS);
    println!("PI = {}", PI);
    println!();
    
    let a = 20;
    let b = 6;

    let sum = a + b;
    let difference = a - b;
    let product = a * b;
    let quotient = a / b;        
    let remainder = a % b;       

    println!("=== Калькулятор ===");
    println!("Числа: a = {}, b = {}", a, b);
    println!();
    println!("Сложение: {} + {} = {}", a, b, sum);
    println!("Вычитание: {} - {} = {}", a, b, difference);
    println!("Умножение: {} * {} = {}", a, b, product);
    println!("Деление: {} / {} = {}", a, b, quotient);
    println!("Остаток: {} % {} = {}", a, b, remainder);

    println!();
    println!("Конвертер температуры");

    let temp_celsius = [0.0, 20.0, 37.0, 100.0];

    println!("Celsius\tFahrenheit");
    for temp in temp_celsius.iter() {
        let fahrenheit = temp * 9.0 / 5.0 + 32.0;
        println!("{:>6.1}°C{:>6.1}°F", temp, fahrenheit);
    }

    println!();
    println!("Конвертер валют");
    let usd = 120.0;
    let usd_to_eur_rate = 0.92;  
    let eur = usd * usd_to_eur_rate;
    
    println!("{} USD = {:.2} EUR", usd, eur);


    println!();
    println!("Индекс массы тела (ИМТ)");
    
    let weight_kg: f64 = 70.0;
    let height_m: f64 = 1.75;
    
    let bmi = weight_kg / (height_m * height_m);
    
    println!("Вес: {} кг", weight_kg);
    println!("Рост: {} м", height_m);
    println!("ИМТ: {:.2}", bmi);
}

