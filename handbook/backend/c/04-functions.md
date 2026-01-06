# Блок 4: Функции

## Цель

Научиться создавать и использовать функции для организации кода, повторного использования и модульности программы.

---

## 1. Определение функций

### Базовый синтаксис

```c
тип_возврата имя_функции(параметры) {
    // тело функции
    return значение;  // если тип_возврата не void
}
```

### Простая функция

```c
#include <stdio.h>

// Объявление функции (прототип)
int add(int a, int b);

// Определение функции
int add(int a, int b) {
    return a + b;
}

int main(void) {
    int result = add(5, 3);
    printf("5 + 3 = %d\n", result);
    return 0;
}
```

### Функция без параметров

```c
void greet(void) {
    printf("Hello, World!\n");
}

int main(void) {
    greet();
    return 0;
}
```

### Функция без возвращаемого значения

```c
// void означает "ничего не возвращает"
// Функция просто выполняет действие (печатает число), но не возвращает результат
void print_number(int n) {
    printf("Number: %d\n", n);
    // return не нужен (можно написать просто return;)
    // Функция автоматически завершится в конце
}

int main(void) {
    print_number(42);  // Вызываем функцию, но не получаем значение обратно
    return 0;  // main возвращает int, поэтому здесь return обязателен
}
```

**Объяснение:**

1. **`void` в начале** = функция ничего не возвращает
   - Нельзя написать: `int result = print_number(42);` ❌
   - Можно только: `print_number(42);` ✅

2. **Почему `return` не нужен?**
   - В `void` функциях `return` необязателен
   - Функция просто завершится в конце
   - Если нужен досрочный выход, можно написать `return;` (без значения)

3. **Сравнение с функцией, которая возвращает значение:**

```c
// Функция БЕЗ возвращаемого значения (void)
void print_number(int n) {
    printf("Number: %d\n", n);
    // return не нужен
}

// Функция С возвращаемым значением (int)
int add(int a, int b) {
    return a + b;  // return ОБЯЗАТЕЛЕН!
}

int main(void) {
    print_number(42);        // Просто вызываем, ничего не получаем
    
    int result = add(5, 3);  // Получаем результат обратно
    printf("Result: %d\n", result);
    
    return 0;
}
```

---

## 2. Прототипы функций (объявления)

Прототип функции сообщает компилятору о сигнатуре функции до её использования.

### Порядок объявления

```c
#include <stdio.h>

// Прототипы (объявления)
int add(int a, int b);
void greet(void);
int factorial(int n);

int main(void) {
    printf("%d\n", add(5, 3));
    greet();
    printf("Factorial of 5: %d\n", factorial(5));
    return 0;
}

// Определения функций
int add(int a, int b) {
    return a + b;
}

void greet(void) {
    printf("Hello!\n");
}

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}
```

### Зачем нужны прототипы?

1. Компилятор проверяет правильность вызова функции
2. Позволяет вызывать функцию до её определения
3. Помогает избежать ошибок типов

---

## 3. Параметры функций

### Передача по значению

В C параметры передаются **по значению** (копия значения):

```c
void increment(int x) {
    x++;  // Изменяется только локальная копия
    printf("Inside function: x = %d\n", x);
}

int main(void) {
    int num = 5;
    increment(num);
    printf("Outside function: num = %d\n", num);  // num остаётся 5
    return 0;
}
```

**Вывод:**
```
Inside function: x = 6
Outside function: num = 5
```

### Множественные параметры

```c
int multiply(int a, int b, int c) {
    return a * b * c;
}

int main(void) {
    int result = multiply(2, 3, 4);
    printf("2 * 3 * 4 = %d\n", result);
    return 0;
}
```

### Без параметров: void

```c
// Явно указываем, что параметров нет
void function1(void) {
    // ...
}

// Неявно - может принимать любое количество аргументов (устаревший стиль)
void function2() {
    // ...
}

// ✅ Всегда используйте void для функций без параметров!
```

---

## 4. Возвращаемые значения

### return

```c
int get_max(int a, int b) {
    if (a > b) {
        return a;
    } else {
        return b;
    }
}

// Можно упростить
int get_max2(int a, int b) {
    return (a > b) ? a : b;
}
```

### Множественные return

```c
int sign(int x) {
    if (x > 0) {
        return 1;
    } else if (x < 0) {
        return -1;
    } else {
        return 0;
    }
}
```

### void функции

```c
void print_hello(void) {
    printf("Hello!\n");
    return;  // Необязательно, но можно использовать для досрочного выхода
}

void print_numbers(int n) {
    if (n <= 0) {
        return;  // Досрочный выход
    }
    for (int i = 1; i <= n; i++) {
        printf("%d ", i);
    }
    printf("\n");
}
```

---

## 5. Область видимости (scope)

### Локальные переменные

Переменные, объявленные внутри функции, видны только в этой функции:

```c
void function1(void) {
    int x = 10;  // Локальная переменная
    printf("x in function1: %d\n", x);
}

void function2(void) {
    int x = 20;  // Другая локальная переменная
    printf("x in function2: %d\n", x);
    // printf("%d\n", function1_x);  // ❌ Ошибка: не существует
}

int main(void) {
    function1();
    function2();
    // printf("%d\n", x);  // ❌ Ошибка: x не существует в main
    return 0;
}
```

### Глобальные переменные

Переменные, объявленные вне функций, видны во всех функциях:

```c
#include <stdio.h>

int global_var = 100;  // Глобальная переменная

void function1(void) {
    global_var = 200;  // Может изменять глобальную переменную
    printf("global_var in function1: %d\n", global_var);
}

void function2(void) {
    printf("global_var in function2: %d\n", global_var);
}

int main(void) {
    printf("global_var in main: %d\n", global_var);
    function1();
    function2();
    printf("global_var in main after function1: %d\n", global_var);
    return 0;
}
```

**⚠️ Избегайте глобальных переменных, когда возможно!** Они усложняют понимание кода и могут привести к ошибкам.

### Затенение (shadowing)

Локальная переменная может скрывать глобальную с тем же именем:

```c
#include <stdio.h>

int x = 10;  // Глобальная

void function(void) {
    int x = 20;  // Локальная (скрывает глобальную)
    printf("Local x: %d\n", x);  // 20
}

int main(void) {
    printf("Global x: %d\n", x);  // 10
    function();
    printf("Global x after function: %d\n", x);  // 10 (не изменилась)
    return 0;
}
```

---

## 6. Время жизни переменных

### Автоматические переменные (по умолчанию)

Создаются при входе в функцию, уничтожаются при выходе:

```c
void function(void) {
    int x = 10;  // Автоматическая переменная
    // x уничтожается при выходе из функции
}
```

### Статические переменные (static)

Сохраняют значение между вызовами функции:

```c
#include <stdio.h>

void counter(void) {
    static int count = 0;  // Инициализируется только один раз
    count++;
    printf("Count: %d\n", count);
}

int main(void) {
    counter();  // Count: 1
    counter();  // Count: 2
    counter();  // Count: 3
    return 0;
}
```

**Использование static:**
- Сохраняет значение между вызовами
- Инициализируется только один раз
- Видима только в функции, где объявлена

---

## 7. Рекурсия

Функция может вызывать сама себя:

### Факториал

```c
#include <stdio.h>

int factorial(int n) {
    // Базовый случай
    if (n <= 1) {
        return 1;
    }
    // Рекурсивный случай
    return n * factorial(n - 1);
}

int main(void) {
    printf("Factorial of 5: %d\n", factorial(5));
    return 0;
}
```

**Как это работает:**
```
factorial(5)
  = 5 * factorial(4)
  = 5 * (4 * factorial(3))
  = 5 * (4 * (3 * factorial(2)))
  = 5 * (4 * (3 * (2 * factorial(1))))
  = 5 * (4 * (3 * (2 * 1)))
  = 120
```

### Числа Фибоначчи

```c
#include <stdio.h>

int fibonacci(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main(void) {
    for (int i = 0; i < 10; i++) {
        printf("fibonacci(%d) = %d\n", i, fibonacci(i));
    }
    return 0;
}
```

**⚠️ Рекурсия может быть неэффективной** (как в случае с Фибоначчи выше). Иногда лучше использовать итерацию.

---

## 8. Функции с переменным количеством аргументов

C поддерживает функции с переменным числом аргументов через `<stdarg.h>`:

```c
#include <stdio.h>
#include <stdarg.h>

// Функция, которая суммирует произвольное количество чисел
int sum(int count, ...) {
    va_list args;           // Список аргументов
    va_start(args, count);  // Инициализация (count - последний именованный параметр)
    
    int total = 0;
    for (int i = 0; i < count; i++) {
        int value = va_arg(args, int);  // Получить следующий аргумент типа int
        total += value;
    }
    
    va_end(args);  // Очистка
    return total;
}

int main(void) {
    printf("Sum: %d\n", sum(3, 10, 20, 30));        // 60
    printf("Sum: %d\n", sum(5, 1, 2, 3, 4, 5));     // 15
    return 0;
}
```

**Использование:**
- `va_list` — тип для списка аргументов
- `va_start(va_list, last_param)` — инициализация
- `va_arg(va_list, type)` — получение следующего аргумента
- `va_end(va_list)` — очистка

**Пример из стандартной библиотеки:** `printf()` использует переменное количество аргументов!

---

## 9. Практические примеры

### Пример 1: Математические функции

```c
#include <stdio.h>
#include <math.h>

// Найти максимум двух чисел
int max(int a, int b) {
    return (a > b) ? a : b;
}

// Найти минимум двух чисел
int min(int a, int b) {
    return (a < b) ? a : b;
}

// Абсолютное значение
int abs(int x) {
    return (x < 0) ? -x : x;
}

// Наибольший общий делитель (НОД)
int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

int main(void) {
    printf("max(10, 5) = %d\n", max(10, 5));
    printf("min(10, 5) = %d\n", min(10, 5));
    printf("abs(-10) = %d\n", abs(-10));
    printf("gcd(48, 18) = %d\n", gcd(48, 18));
    return 0;
}
```

### Пример 2: Проверка простого числа

```c
#include <stdio.h>
#include <stdbool.h>

bool is_prime(int n) {
    if (n < 2) return false;
    if (n == 2) return true;
    if (n % 2 == 0) return false;
    
    for (int i = 3; i * i <= n; i += 2) {
        if (n % i == 0) {
            return false;
        }
    }
    return true;
}

int main(void) {
    int number;
    printf("Enter a number: ");
    scanf("%d", &number);
    
    if (is_prime(number)) {
        printf("%d is prime\n", number);
    } else {
        printf("%d is not prime\n", number);
    }
    
    return 0;
}
```

### Пример 3: Возведение в степень

```c
#include <stdio.h>

// Итеративная версия
double power_iterative(double base, int exponent) {
    if (exponent < 0) {
        return 1.0 / power_iterative(base, -exponent);
    }
    
    double result = 1.0;
    for (int i = 0; i < exponent; i++) {
        result *= base;
    }
    return result;
}

// Рекурсивная версия
double power_recursive(double base, int exponent) {
    if (exponent == 0) return 1.0;
    if (exponent < 0) {
        return 1.0 / power_recursive(base, -exponent);
    }
    return base * power_recursive(base, exponent - 1);
}

int main(void) {
    printf("2^10 = %.0f\n", power_iterative(2, 10));
    printf("2^-3 = %.3f\n", power_iterative(2, -3));
    return 0;
}
```

---

## Резюме Блока 4

### Что мы изучили:

✅ Определение функций: синтаксис, параметры, возвращаемые значения  
✅ Прототипы функций (объявления)  
✅ Передача параметров по значению  
✅ Область видимости: локальные и глобальные переменные  
✅ Время жизни: автоматические и статические переменные  
✅ Рекурсия: функции, вызывающие сами себя  
✅ Функции с переменным количеством аргументов (`va_list`)  
✅ Практические примеры: математические функции, проверка простых чисел  

### Следующие шаги:

Переходите к `04-functions-practice.md` для выполнения практических заданий!

---

## Полезные ресурсы

- Функции — основа модульности программы
- Рекурсия vs итерация: когда что использовать
- Best practices: короткие функции, одна ответственность

---

## Типичные ошибки

1. **Забыли return в функции с возвращаемым значением**
   ```c
   int add(int a, int b) {
       a + b;  // ❌ Ошибка: нет return
   }
   int add2(int a, int b) {
       return a + b;  // ✅ Правильно
   }
   ```

2. **Использование переменной до объявления (в пределах функции)**
   ```c
   int x = y;  // ❌ y ещё не объявлена
   int y = 10;
   ```

3. **Изменение параметра, ожидая изменения в вызывающей функции**
   ```c
   void increment(int x) {
       x++;  // ❌ Не изменит значение в main
   }
   // Нужны указатели (будет в уроке 6)
   ```

4. **Забыли прототип функции**
   ```c
   int main(void) {
       foo();  // ❌ Компилятор не знает о функции foo
   }
   void foo(void) { }  // Определение после использования
   ```

