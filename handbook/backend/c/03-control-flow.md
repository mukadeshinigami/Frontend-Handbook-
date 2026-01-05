# Блок 3: Управление потоком выполнения

## Цель

Освоить условные операторы (`if`, `else`, `switch`), циклы (`while`, `do-while`, `for`) и операторы управления потоком (`break`, `continue`, `goto`) для контроля выполнения программы.

---

## 1. Условные операторы: if, else if, else

### Базовый if

Выполняет код, если условие истинно (не равно 0):

```c
#include <stdio.h>

int main(void) {
    int age = 20;
    
    if (age >= 18) {
        printf("You are an adult\n");
    }
    
    return 0;
}
```

### if-else

Две ветви выполнения:

```c
int age = 15;

if (age >= 18) {
    printf("You are an adult\n");
} else {
    printf("You are a minor\n");
}
```

### if-else if-else

Множественные условия:

```c
int score = 85;

if (score >= 90) {
    printf("Grade: A\n");
} else if (score >= 80) {
    printf("Grade: B\n");
} else if (score >= 70) {
    printf("Grade: C\n");
} else if (score >= 60) {
    printf("Grade: D\n");
} else {
    printf("Grade: F\n");
}
```

### Вложенные if

```c
int age = 25;
int has_license = 1;  // 1 = true, 0 = false

if (age >= 18) {
    if (has_license) {
        printf("You can drive\n");
    } else {
        printf("You need a license\n");
    }
} else {
    printf("You are too young to drive\n");
}
```

### Одна инструкция без фигурных скобок

Если тело `if` содержит только одну инструкцию, фигурные скобки можно опустить (но это не рекомендуется для читаемости и избежания ошибок):

```c
int x = 5;

if (x > 0)
    printf("Positive\n");  // Работает, но лучше использовать {}

// Рекомендуется всегда использовать фигурные скобки!
if (x > 0) {
    printf("Positive\n");
}
```

### ⚠️ Точка с запятой после if

```c
int x = 5;

if (x > 0);  // ❌ ОШИБКА: точка с запятой создаёт пустое тело!
{
    printf("This always executes!\n");  // Выполнится всегда!
}
```

---

## 2. Тернарный оператор (условный оператор)

Краткая форма if-else: `condition ? value_if_true : value_if_false`

```c
#include <stdio.h>

int main(void) {
    int a = 5, b = 10;
    
    // Найти максимум
    int max = (a > b) ? a : b;
    printf("Max: %d\n", max);
    
    // Абсолютное значение
    int x = -5;
    int abs_x = (x < 0) ? -x : x;
    printf("Abs: %d\n", abs_x);
    
    // В выражении
    printf("The larger number is %d\n", (a > b) ? a : b);
    
    return 0;
}
```

**Используйте тернарный оператор для простых условий, но предпочитайте if-else для сложной логики.**

---

## 3. Оператор switch

`switch` позволяет выбирать между несколькими вариантами на основе значения переменной.

### Базовый синтаксис

```c
#include <stdio.h>

int main(void) {
    int choice = 2;
    
    switch (choice) {
        case 1:
            printf("You chose option 1\n");
            break;
        case 2:
            printf("You chose option 2\n");
            break;
        case 3:
            printf("You chose option 3\n");
            break;
        default:
            printf("Invalid choice\n");
            break;
    }
    
    return 0;
}
```

### Правила switch

1. Выражение в `switch` должно быть целочисленного типа (`int`, `char`, `enum`)
2. Каждый `case` должен быть константным выражением
3. `break` обязателен (иначе выполнение "провалится" в следующий case)
4. `default` выполняется, если ни один `case` не совпал (необязателен)

### Fall-through (проваливание)

Если `break` отсутствует, выполнение продолжается в следующем `case`:

```c
int day = 2;

switch (day) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
        printf("Weekday\n");
        break;  // Важно! Иначе выполнится и "Weekend"
    case 6:
    case 7:
        printf("Weekend\n");
        break;
    default:
        printf("Invalid day\n");
}
```

**Иногда fall-through намеренный, но обычно это ошибка!**

### Пример: калькулятор

```c
#include <stdio.h>

int main(void) {
    float a, b, result;
    char operator;
    
    printf("Enter expression (e.g., 10 + 5): ");
    scanf("%f %c %f", &a, &operator, &b);
    
    switch (operator) {
        case '+':
            result = a + b;
            break;
        case '-':
            result = a - b;
            break;
        case '*':
            result = a * b;
            break;
        case '/':
            if (b != 0) {
                result = a / b;
            } else {
                printf("Error: Division by zero\n");
                return 1;
            }
            break;
        default:
            printf("Error: Unknown operator\n");
            return 1;
    }
    
    printf("%.2f %c %.2f = %.2f\n", a, operator, b, result);
    
    return 0;
}
```

---

## 4. Цикл while

Цикл `while` повторяет код, пока условие истинно.

### Базовый синтаксис

```c
#include <stdio.h>

int main(void) {
    int count = 0;
    
    while (count < 5) {
        printf("Count: %d\n", count);
        count++;
    }
    
    return 0;
}
```

**Вывод:**
```
Count: 0
Count: 1
Count: 2
Count: 3
Count: 4
```

### Важно: условие должно изменяться!

```c
int count = 0;

while (count < 5) {
    printf("Count: %d\n", count);
    // count++;  // ❌ ОШИБКА: бесконечный цикл!
}
```

### Пример: ввод до правильного значения

```c
#include <stdio.h>

int main(void) {
    int number;
    
    printf("Enter a positive number: ");
    scanf("%d", &number);
    
    while (number <= 0) {
        printf("Invalid! Enter a positive number: ");
        scanf("%d", &number);
    }
    
    printf("You entered: %d\n", number);
    
    return 0;
}
```

### Бесконечный цикл

```c
while (1) {  // Или while (true) с #include <stdbool.h>
    // Код, который должен выполняться бесконечно
    // Обычно используется с break для выхода
    if (some_condition) {
        break;
    }
}
```

---

## 5. Цикл do-while

Цикл `do-while` выполняет код хотя бы один раз, затем проверяет условие.

### Синтаксис

```c
#include <stdio.h>

int main(void) {
    int count = 0;
    
    do {
        printf("Count: %d\n", count);
        count++;
    } while (count < 5);
    
    return 0;
}
```

### Разница между while и do-while

```c
// while - проверка ДО выполнения
int x = 10;
while (x < 5) {
    printf("This won't print\n");  // Не выполнится
}

// do-while - проверка ПОСЛЕ выполнения
int y = 10;
do {
    printf("This will print once\n");  // Выполнится один раз!
} while (y < 5);
```

### Пример: меню

```c
#include <stdio.h>

int main(void) {
    int choice;
    
    do {
        printf("\nMenu:\n");
        printf("1. Option 1\n");
        printf("2. Option 2\n");
        printf("3. Exit\n");
        printf("Enter choice: ");
        scanf("%d", &choice);
        
        switch (choice) {
            case 1:
                printf("You chose option 1\n");
                break;
            case 2:
                printf("You chose option 2\n");
                break;
            case 3:
                printf("Goodbye!\n");
                break;
            default:
                printf("Invalid choice\n");
        }
    } while (choice != 3);
    
    return 0;
}
```

---

## 6. Цикл for

Цикл `for` — компактный способ записи циклов с инициализацией, условием и инкрементом.

### Базовый синтаксис

```c
for (инициализация; условие; инкремент) {
    // тело цикла
}
```

### Пример

```c
#include <stdio.h>

int main(void) {
    for (int i = 0; i < 5; i++) {
        printf("i = %d\n", i);
    }
    
    return 0;
}
```

**Вывод:**
```
i = 0
i = 1
i = 2
i = 3
i = 4
```

### Разбор цикла for

```c
for (int i = 0; i < 5; i++) {
    // 1. Инициализация: int i = 0 (выполняется один раз)
    // 2. Проверка условия: i < 5 (перед каждой итерацией)
    // 3. Тело цикла: выполняется, если условие true
    // 4. Инкремент: i++ (после каждой итерации)
    // 5. Возврат к шагу 2
}
```

### Различные варианты for

```c
// Обычный счётчик
for (int i = 0; i < 10; i++) {
    printf("%d ", i);
}

// Обратный счёт
for (int i = 10; i > 0; i--) {
    printf("%d ", i);
}

// С шагом больше 1
for (int i = 0; i < 20; i += 2) {
    printf("%d ", i);  // 0, 2, 4, 6, ...
}

// Множественные переменные (C99+)
for (int i = 0, j = 10; i < j; i++, j--) {
    printf("i=%d j=%d\n", i, j);
}

// Без инициализации (переменная объявлена ранее)
int i = 0;
for (; i < 10; i++) {
    printf("%d ", i);
}

// Бесконечный цикл
for (;;) {
    // Бесконечный цикл
    if (condition) break;
}
```

### Пример: таблица умножения

```c
#include <stdio.h>

int main(void) {
    int n = 5;
    
    printf("Multiplication table for %d:\n", n);
    for (int i = 1; i <= 10; i++) {
        printf("%d x %d = %d\n", n, i, n * i);
    }
    
    return 0;
}
```

---

## 7. Вложенные циклы

Циклы могут быть вложенными:

```c
#include <stdio.h>

int main(void) {
    // Таблица умножения
    for (int i = 1; i <= 5; i++) {
        for (int j = 1; j <= 5; j++) {
            printf("%3d ", i * j);
        }
        printf("\n");
    }
    
    return 0;
}
```

**Вывод:**
```
  1   2   3   4   5
  2   4   6   8  10
  3   6   9  12  15
  4   8  12  16  20
  5  10  15  20  25
```

### Пример: вывод треугольника

```c
#include <stdio.h>

int main(void) {
    int rows = 5;
    
    for (int i = 1; i <= rows; i++) {
        for (int j = 1; j <= i; j++) {
            printf("* ");
        }
        printf("\n");
    }
    
    return 0;
}
```

**Вывод:**
```
*
* *
* * *
* * * *
* * * * *
```

---

## 8. Оператор break

`break` немедленно выходит из цикла или `switch`.

### break в switch

Уже видели выше — `break` предотвращает fall-through.

### break в циклах

```c
#include <stdio.h>

int main(void) {
    for (int i = 0; i < 10; i++) {
        if (i == 5) {
            break;  // Выход из цикла при i == 5
        }
        printf("%d ", i);
    }
    printf("\nLoop ended\n");
    
    return 0;
}
```

**Вывод:** `0 1 2 3 4 Loop ended`

### break во вложенных циклах

`break` выходит только из ближайшего цикла:

```c
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 5; j++) {
        if (j == 2) {
            break;  // Выход только из внутреннего цикла
        }
        printf("i=%d j=%d ", i, j);
    }
    printf("\n");
}
```

**Вывод:**
```
i=0 j=0 i=0 j=1
i=1 j=0 i=1 j=1
i=2 j=0 i=2 j=1
```

---

## 9. Оператор continue

`continue` пропускает оставшуюся часть итерации и переходит к следующей.

### Пример

```c
#include <stdio.h>

int main(void) {
    for (int i = 0; i < 10; i++) {
        if (i % 2 == 0) {
            continue;  // Пропустить чётные числа
        }
        printf("%d ", i);  // Выведет только нечётные
    }
    printf("\n");
    
    return 0;
}
```

**Вывод:** `1 3 5 7 9`

### continue vs break

```c
// continue - пропустить текущую итерацию
for (int i = 0; i < 5; i++) {
    if (i == 2) continue;  // Пропустить итерацию с i=2
    printf("%d ", i);  // 0 1 3 4
}

// break - выйти из цикла
for (int i = 0; i < 5; i++) {
    if (i == 2) break;  // Выйти из цикла при i=2
    printf("%d ", i);  // 0 1
}
```

---

## 10. Оператор goto (избегайте!)

`goto` позволяет перепрыгнуть в другую часть кода. **Рекомендуется избегать**, кроме редких случаев.

### Синтаксис

```c
#include <stdio.h>

int main(void) {
    int i = 0;
    
loop_start:
    if (i >= 5) {
        goto loop_end;
    }
    printf("%d ", i);
    i++;
    goto loop_start;
    
loop_end:
    printf("\nDone\n");
    
    return 0;
}
```

### Когда можно использовать goto

1. **Выход из вложенных циклов** (когда `break` недостаточно):
   ```c
   for (int i = 0; i < 10; i++) {
       for (int j = 0; j < 10; j++) {
           if (some_condition) {
               goto exit_loops;  // Выход из обоих циклов
           }
       }
   }
   exit_loops:
   ```

2. **Очистка ресурсов при ошибках**:
   ```c
   if (error1) goto cleanup;
   if (error2) goto cleanup;
   
   cleanup:
       // Освобождение ресурсов
   ```

**Но обычно лучше использовать функции и структурированный код!**

---

## 11. Практические примеры

### Пример 1: FizzBuzz

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 100; i++) {
        if (i % 3 == 0 && i % 5 == 0) {
            printf("FizzBuzz\n");
        } else if (i % 3 == 0) {
            printf("Fizz\n");
        } else if (i % 5 == 0) {
            printf("Buzz\n");
        } else {
            printf("%d\n", i);
        }
    }
    
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

### Пример 3: Калькулятор с меню

```c
#include <stdio.h>

int main(void) {
    int choice;
    float a, b, result;
    
    do {
        printf("\n=== Calculator ===\n");
        printf("1. Add\n");
        printf("2. Subtract\n");
        printf("3. Multiply\n");
        printf("4. Divide\n");
        printf("5. Exit\n");
        printf("Enter choice: ");
        scanf("%d", &choice);
        
        if (choice >= 1 && choice <= 4) {
            printf("Enter two numbers: ");
            scanf("%f %f", &a, &b);
            
            switch (choice) {
                case 1:
                    result = a + b;
                    printf("Result: %.2f\n", result);
                    break;
                case 2:
                    result = a - b;
                    printf("Result: %.2f\n", result);
                    break;
                case 3:
                    result = a * b;
                    printf("Result: %.2f\n", result);
                    break;
                case 4:
                    if (b != 0) {
                        result = a / b;
                        printf("Result: %.2f\n", result);
                    } else {
                        printf("Error: Division by zero\n");
                    }
                    break;
            }
        } else if (choice != 5) {
            printf("Invalid choice!\n");
        }
    } while (choice != 5);
    
    printf("Goodbye!\n");
    return 0;
}
```

---

## Резюме Блока 3

### Что мы изучили:

✅ Условные операторы: `if`, `else if`, `else`  
✅ Тернарный оператор: `condition ? true : false`  
✅ Оператор `switch`/`case`/`break`/`default`  
✅ Fall-through в switch  
✅ Цикл `while`  
✅ Цикл `do-while`  
✅ Цикл `for`  
✅ Вложенные циклы  
✅ Оператор `break` для выхода из цикла  
✅ Оператор `continue` для пропуска итерации  
✅ Оператор `goto` (и когда его избегать)  

### Следующие шаги:

Переходите к `03-control-flow-practice.md` для выполнения практических заданий!

---

## Полезные ресурсы

- Структурированное программирование — избегайте `goto` где возможно
- Алгоритмы и структуры данных для практики циклов

---

## Типичные ошибки

1. **Точка с запятой после if/while/for**
   ```c
   if (x > 0); { }  // ❌ Пустое тело if
   while (x > 0); { }  // ❌ Бесконечный цикл или пустое тело
   ```

2. **Забыли break в switch**
   ```c
   switch (x) {
       case 1:
           printf("One\n");
           // ❌ Забыли break - выполнится и case 2!
       case 2:
           printf("Two\n");
   }
   ```

3. **Бесконечный цикл**
   ```c
   while (x > 0) {
       // ❌ x не изменяется - бесконечный цикл!
   }
   ```

4. **Использование = вместо == в условиях**
   ```c
   if (x = 5) { }  // ❌ Присваивание вместо сравнения
   if (x == 5) { } // ✅ Правильно
   ```

