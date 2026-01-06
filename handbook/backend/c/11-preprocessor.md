# Блок 11: Препроцессор

## Цель

Изучить директивы препроцессора C для управления компиляцией, создания макросов и условной компиляции. Препроцессор обрабатывает код до компиляции.

---

## 1. #include: подключение заголовочных файлов

### Базовое использование

```c
#include <stdio.h>    // Системные заголовочные файлы (из стандартной библиотеки)
#include "myheader.h"  // Пользовательские заголовочные файлы (из текущей директории)
```

**Разница:**
- `<file.h>` — ищет в системных директориях
- `"file.h"` — сначала ищет в текущей директории, затем в системных

### Пример структуры проекта

```
project/
├── main.c
├── utils.h
└── utils.c
```

**utils.h:**
```c
#ifndef UTILS_H
#define UTILS_H

int add(int a, int b);
void print_hello(void);

#endif
```

**main.c:**
```c
#include <stdio.h>
#include "utils.h"

int main(void) {
    print_hello();
    printf("Sum: %d\n", add(5, 3));
    return 0;
}
```

---

## 2. #define: макросы и константы

### Простые константы

```c
#include <stdio.h>

#define PI 3.14159
#define MAX_SIZE 100
#define PROGRAM_NAME "My Program"

int main(void) {
    double radius = 5.0;
    double area = PI * radius * radius;
    
    printf("Area: %.2f\n", area);
    printf("Program: %s\n", PROGRAM_NAME);
    
    return 0;
}
```

**Важно:** Препроцессор заменяет `PI` на `3.14159` до компиляции. Это не переменная!

### Функциональные макросы

```c
#include <stdio.h>

#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define MIN(a, b) ((a) < (b) ? (a) : (b))
#define SQUARE(x) ((x) * (x))

int main(void) {
    int a = 10, b = 20;
    printf("Max: %d\n", MAX(a, b));        // 20
    printf("Square of 5: %d\n", SQUARE(5));  // 25
    
    return 0;
}
```

**⚠️ Критически важно использовать скобки!**

```c
// ❌ ПЛОХО - без скобок
#define BAD_SQUARE(x) x * x
int result = BAD_SQUARE(3 + 2);  // Раскрывается в: 3 + 2 * 3 + 2 = 11 (неправильно!)

// ✅ ХОРОШО - со скобками
#define GOOD_SQUARE(x) ((x) * (x))
int result = GOOD_SQUARE(3 + 2);  // Раскрывается в: ((3 + 2) * (3 + 2)) = 25 (правильно!)
```

### Многострочные макросы

```c
#include <stdio.h>

#define PRINT_SUM(a, b) \
    do { \
        int sum = (a) + (b); \
        printf("Sum: %d\n", sum); \
    } while(0)

int main(void) {
    PRINT_SUM(5, 3);
    return 0;
}
```

**Почему `do { ... } while(0)`?**
- Позволяет использовать макрос как обычный оператор
- Требует точку с запятой после макроса
- Избегает проблем с `if-else`

---

## 3. Проблемы макросов

### Множественные вычисления

```c
#define MAX(a, b) ((a) > (b) ? (a) : (b))

int get_value(void) {
    static int count = 0;
    return ++count;
}

int main(void) {
    int result = MAX(get_value(), 10);
    // get_value() вызывается ДВА раза! (один раз для сравнения, один раз для возврата)
    printf("Result: %d\n", result);
    return 0;
}
```

**Решение:** Используйте inline функции (C99) или функции для сложных случаев.

### Проблемы с побочными эффектами

```c
#define INCREMENT(x) ((x)++)

int main(void) {
    int a = 5;
    int b = INCREMENT(a) + INCREMENT(a);
    // a инкрементируется дважды, результат неопределён!
    return 0;
}
```

---

## 4. #undef: отмена определения

```c
#include <stdio.h>

#define DEBUG 1

#ifdef DEBUG
    printf("Debug mode\n");
#endif

#undef DEBUG

#ifdef DEBUG
    printf("This won't print\n");
#endif
```

---

## 5. Условная компиляция

### #if, #ifdef, #ifndef, #else, #endif

```c
#include <stdio.h>

#define DEBUG 1
#define VERSION 2

int main(void) {
    #if DEBUG
        printf("Debug mode is ON\n");
    #else
        printf("Debug mode is OFF\n");
    #endif
    
    #if VERSION == 1
        printf("Version 1\n");
    #elif VERSION == 2
        printf("Version 2\n");
    #else
        printf("Unknown version\n");
    #endif
    
    return 0;
}
```

### #ifdef и #ifndef

```c
#include <stdio.h>

#define LINUX

#ifdef LINUX
    printf("Compiling for Linux\n");
#endif

#ifndef WINDOWS
    printf("Not Windows\n");
#endif
```

### Защита заголовочных файлов (Include Guards)

**myheader.h:**
```c
#ifndef MYHEADER_H
#define MYHEADER_H

// Содержимое заголовочного файла
int my_function(int x);

#endif  // MYHEADER_H
```

**Почему это нужно?**
- Предотвращает повторное включение заголовочного файла
- Избегает ошибок переопределения

**Альтернатива (C23):**
```c
#pragma once

// Содержимое заголовочного файла
int my_function(int x);
```

---

## 6. Предопределённые макросы

```c
#include <stdio.h>

int main(void) {
    printf("File: %s\n", __FILE__);      // Имя текущего файла
    printf("Line: %d\n", __LINE__);       // Номер текущей строки
    printf("Date: %s\n", __DATE__);      // Дата компиляции
    printf("Time: %s\n", __TIME__);      // Время компиляции
    printf("Function: %s\n", __func__);  // Имя текущей функции (C99)
    
    #ifdef __STDC__
        printf("ANSI C compliant\n");
    #endif
    
    return 0;
}
```

**Пример использования для отладки:**
```c
#define DEBUG_PRINT(fmt, ...) \
    printf("[%s:%d] " fmt "\n", __FILE__, __LINE__, ##__VA_ARGS__)

int main(void) {
    int x = 42;
    DEBUG_PRINT("Value of x: %d", x);
    // Выведет: [main.c:10] Value of x: 42
    return 0;
}
```

---

## 7. #error и #warning

### #error

Останавливает компиляцию с сообщением об ошибке:

```c
#ifndef REQUIRED_DEFINE
    #error "REQUIRED_DEFINE must be defined!"
#endif
```

### #warning

Выводит предупреждение, но не останавливает компиляцию:

```c
#ifdef OLD_API
    #warning "OLD_API is deprecated, use NEW_API instead"
#endif
```

---

## 8. #pragma: директивы компилятора

### #pragma once

```c
#pragma once

// Заголовочный файл будет включён только один раз
int my_function(int x);
```

### #pragma pack

Контроль выравнивания структур:

```c
#pragma pack(1)  // Упаковать структуру (без padding)

struct Packed {
    char a;
    int b;
    char c;
};  // Размер: 6 байт (вместо 12)

#pragma pack()   // Вернуться к стандартному выравниванию
```

---

## 9. Практические примеры

### Пример 1: Макросы для отладки

```c
#include <stdio.h>

#ifdef DEBUG
    #define DBG_PRINT(fmt, ...) printf("[DEBUG] " fmt "\n", ##__VA_ARGS__)
#else
    #define DBG_PRINT(fmt, ...)  // Ничего не делать в release
#endif

int main(void) {
    int x = 10;
    DBG_PRINT("x = %d", x);
    
    #ifdef DEBUG
        printf("Debug information\n");
    #endif
    
    return 0;
}
```

**Компиляция:**
```bash
gcc -DDEBUG program.c  # С определением DEBUG
gcc program.c           # Без DEBUG
```

### Пример 2: Кросс-платформенный код

```c
#include <stdio.h>

#ifdef _WIN32
    #define PLATFORM "Windows"
    #include <windows.h>
#elif defined(__linux__)
    #define PLATFORM "Linux"
    #include <unistd.h>
#elif defined(__APPLE__)
    #define PLATFORM "macOS"
    #include <unistd.h>
#else
    #define PLATFORM "Unknown"
#endif

int main(void) {
    printf("Platform: %s\n", PLATFORM);
    return 0;
}
```

### Пример 3: Версионирование

```c
#include <stdio.h>

#define VERSION_MAJOR 1
#define VERSION_MINOR 2
#define VERSION_PATCH 3

#define VERSION_STRING "v" \
    STRINGIFY(VERSION_MAJOR) "." \
    STRINGIFY(VERSION_MINOR) "." \
    STRINGIFY(VERSION_PATCH)

#define STRINGIFY(x) #x

int main(void) {
    printf("Version: %s\n", VERSION_STRING);
    return 0;
}
```

### Пример 4: Макросы для безопасных операций

```c
#include <stdio.h>
#include <stdlib.h>

#define SAFE_MALLOC(ptr, size) \
    do { \
        ptr = malloc(size); \
        if (ptr == NULL) { \
            fprintf(stderr, "Memory allocation failed at %s:%d\n", __FILE__, __LINE__); \
            exit(1); \
        } \
    } while(0)

int main(void) {
    int* array;
    SAFE_MALLOC(array, 10 * sizeof(int));
    
    // Использование array...
    
    free(array);
    return 0;
}
```

---

## Резюме Блока 11

### Что мы изучили:

✅ `#include` — подключение заголовочных файлов  
✅ `#define` — макросы и константы  
✅ Функциональные макросы и их подводные камни  
✅ Условная компиляция: `#if`, `#ifdef`, `#ifndef`  
✅ Защита заголовочных файлов (include guards)  
✅ Предопределённые макросы: `__FILE__`, `__LINE__`, `__DATE__`  
✅ `#error` и `#warning`  
✅ `#pragma` директивы  

### Следующие шаги:

Переходите к `12-modules-organization.md` для изучения организации кода в модули!

---

## Полезные ресурсы

- Используйте скобки в макросах: `((x) * (x))`
- Избегайте побочных эффектов в макросах
- Всегда защищайте заголовочные файлы (include guards)
- Используйте условную компиляцию для кросс-платформенности

---

## Типичные ошибки

1. **Забыли скобки в макросах**
   ```c
   #define BAD_MULTIPLY(a, b) a * b
   int result = BAD_MULTIPLY(2 + 3, 4);  // ❌ 2 + 3 * 4 = 14 (неправильно!)
   ```

2. **Множественные вычисления**
   ```c
   #define MAX(a, b) ((a) > (b) ? (a) : (b))
   int x = MAX(get_value(), 10);  // ❌ get_value() вызывается дважды
   ```

3. **Забыли include guard**
   ```c
   // myheader.h
   int func(void);  // ❌ Может быть включён несколько раз
   ```

4. **Неправильное использование #ifdef**
   ```c
   #ifdef DEBUG = 1  // ❌ Неправильно
   #if DEBUG == 1    // ✅ Правильно
   ```

