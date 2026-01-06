# Блок 12: Модули и организация кода

## Цель

Научиться организовывать большой проект на несколько файлов. Правильная организация кода делает проект поддерживаемым и масштабируемым.

---

## 1. Заголовочные файлы (.h) и исходные файлы (.c)

### Разделение интерфейса и реализации

**math_utils.h** (заголовочный файл — объявления):
```c
#ifndef MATH_UTILS_H
#define MATH_UTILS_H

// Объявления функций
int add(int a, int b);
int multiply(int a, int b);
double power(double base, int exponent);

#endif
```

**math_utils.c** (исходный файл — определения):
```c
#include "math_utils.h"

// Определения функций
int add(int a, int b) {
    return a + b;
}

int multiply(int a, int b) {
    return a * b;
}

double power(double base, int exponent) {
    double result = 1.0;
    for (int i = 0; i < exponent; i++) {
        result *= base;
    }
    return result;
}
```

**main.c** (использование):
```c
#include <stdio.h>
#include "math_utils.h"

int main(void) {
    printf("Sum: %d\n", add(5, 3));
    printf("Product: %d\n", multiply(4, 7));
    printf("Power: %.2f\n", power(2, 8));
    return 0;
}
```

---

## 2. extern: объявление внешних переменных и функций

### Внешние переменные

**globals.h:**
```c
#ifndef GLOBALS_H
#define GLOBALS_H

extern int global_counter;  // Объявление (не определение!)

#endif
```

**globals.c:**
```c
#include "globals.h"

int global_counter = 0;  // Определение (выделяется память)
```

**main.c:**
```c
#include <stdio.h>
#include "globals.h"

int main(void) {
    global_counter = 10;
    printf("Counter: %d\n", global_counter);
    return 0;
}
```

**Важно:**
- `extern` — только объявление, не выделяет память
- Определение должно быть только в одном `.c` файле
- Все файлы, использующие переменную, включают `.h` с `extern`

---

## 3. static: ограничение области видимости

### Статические функции

Функция видна только в текущем файле:

**utils.c:**
```c
#include <stdio.h>

// Публичная функция
void public_function(void) {
    printf("This is public\n");
    helper_function();  // Может вызвать статическую функцию
}

// Приватная функция (видна только в этом файле)
static void helper_function(void) {
    printf("This is helper\n");
}
```

**main.c:**
```c
#include "utils.h"  // Только public_function объявлена

int main(void) {
    public_function();  // ✅ Можно вызвать
    // helper_function();  // ❌ Ошибка компиляции - не видна
    return 0;
}
```

### Статические глобальные переменные

Переменная видна только в текущем файле:

**counter.c:**
```c
#include "counter.h"

static int internal_counter = 0;  // Видна только в этом файле

void increment(void) {
    internal_counter++;
}

int get_count(void) {
    return internal_counter;
}
```

---

## 4. Компиляция нескольких файлов

### Ручная компиляция

```bash
# Компиляция всех .c файлов в объектные файлы
gcc -c math_utils.c -o math_utils.o
gcc -c main.c -o main.o

# Линковка объектных файлов в исполняемый файл
gcc math_utils.o main.o -o program

# Или одной командой
gcc math_utils.c main.c -o program
```

### Структура проекта

```
project/
├── src/
│   ├── main.c
│   ├── math_utils.c
│   └── string_utils.c
├── include/
│   ├── math_utils.h
│   └── string_utils.h
└── Makefile
```

**Компиляция с указанием директории заголовочных файлов:**
```bash
gcc -Iinclude src/main.c src/math_utils.c src/string_utils.c -o program
```

---

## 5. Makefile: базовая система сборки

### Простой Makefile

```makefile
# Компилятор
CC = gcc

# Флаги компиляции
CFLAGS = -Wall -Wextra -std=c11

# Имя исполняемого файла
TARGET = program

# Исходные файлы
SOURCES = main.c math_utils.c string_utils.c

# Объектные файлы (заменяем .c на .o)
OBJECTS = $(SOURCES:.c=.o)

# Правило по умолчанию
$(TARGET): $(OBJECTS)
	$(CC) $(OBJECTS) -o $(TARGET)

# Правило для объектных файлов
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

# Очистка
clean:
	rm -f $(OBJECTS) $(TARGET)

# Запуск
run: $(TARGET)
	./$(TARGET)

.PHONY: clean run
```

**Использование:**
```bash
make          # Сборка проекта
make clean    # Удаление скомпилированных файлов
make run      # Сборка и запуск
```

### Улучшенный Makefile с директориями

```makefile
CC = gcc
CFLAGS = -Wall -Wextra -std=c11 -Iinclude
TARGET = program

SRC_DIR = src
INC_DIR = include
OBJ_DIR = obj

SOURCES = $(wildcard $(SRC_DIR)/*.c)
OBJECTS = $(SOURCES:$(SRC_DIR)/%.c=$(OBJ_DIR)/%.o)

$(TARGET): $(OBJECTS)
	$(CC) $(OBJECTS) -o $(TARGET)

$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c | $(OBJ_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

$(OBJ_DIR):
	mkdir -p $(OBJ_DIR)

clean:
	rm -rf $(OBJ_DIR) $(TARGET)

.PHONY: clean
```

---

## 6. Создание библиотек

### Статическая библиотека (.a)

```bash
# Создание объектных файлов
gcc -c math_utils.c -o math_utils.o
gcc -c string_utils.c -o string_utils.o

# Создание статической библиотеки
ar rcs libutils.a math_utils.o string_utils.o

# Использование библиотеки
gcc main.c -L. -lutils -o program
```

**Структура:**
```
project/
├── lib/
│   └── libutils.a
├── include/
│   └── utils.h
└── main.c
```

### Динамическая библиотека (.so на Linux, .dll на Windows)

**Linux:**
```bash
# Создание динамической библиотеки
gcc -shared -fPIC math_utils.c string_utils.c -o libutils.so

# Использование
gcc main.c -L. -lutils -o program

# Установка пути к библиотеке
export LD_LIBRARY_PATH=.:$LD_LIBRARY_PATH
./program
```

**Windows (MinGW):**
```bash
gcc -shared math_utils.c string_utils.c -o libutils.dll
gcc main.c -L. -lutils -o program.exe
```

---

## 7. Практические примеры

### Пример 1: Проект с несколькими модулями

**Структура:**
```
calculator/
├── include/
│   ├── calculator.h
│   └── display.h
├── src/
│   ├── calculator.c
│   ├── display.c
│   └── main.c
└── Makefile
```

**include/calculator.h:**
```c
#ifndef CALCULATOR_H
#define CALCULATOR_H

double add(double a, double b);
double subtract(double a, double b);
double multiply(double a, double b);
double divide(double a, double b);

#endif
```

**src/calculator.c:**
```c
#include "calculator.h"

double add(double a, double b) {
    return a + b;
}

double subtract(double a, double b) {
    return a - b;
}

double multiply(double a, double b) {
    return a * b;
}

double divide(double a, double b) {
    if (b == 0) {
        return 0;  // В реальности нужно обработать ошибку
    }
    return a / b;
}
```

**include/display.h:**
```c
#ifndef DISPLAY_H
#define DISPLAY_H

void print_result(double result);
void print_error(const char* message);

#endif
```

**src/display.c:**
```c
#include <stdio.h>
#include "display.h"

void print_result(double result) {
    printf("Result: %.2f\n", result);
}

void print_error(const char* message) {
    fprintf(stderr, "Error: %s\n", message);
}
```

**src/main.c:**
```c
#include <stdio.h>
#include "calculator.h"
#include "display.h"

int main(void) {
    double a = 10.0, b = 3.0;
    
    print_result(add(a, b));
    print_result(subtract(a, b));
    print_result(multiply(a, b));
    print_result(divide(a, b));
    
    return 0;
}
```

**Makefile:**
```makefile
CC = gcc
CFLAGS = -Wall -Wextra -std=c11 -Iinclude
TARGET = calculator

SRC_DIR = src
SOURCES = $(wildcard $(SRC_DIR)/*.c)
OBJECTS = $(SOURCES:.c=.o)

$(TARGET): $(OBJECTS)
	$(CC) $(OBJECTS) -o $(TARGET)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJECTS) $(TARGET)

.PHONY: clean
```

### Пример 2: Библиотека утилит

**include/utils.h:**
```c
#ifndef UTILS_H
#define UTILS_H

// Строковые утилиты
int string_length(const char* str);
void string_copy(char* dest, const char* src);
int string_compare(const char* str1, const char* str2);

// Математические утилиты
int max(int a, int b);
int min(int a, int b);
int abs_value(int x);

#endif
```

**src/utils.c:**
```c
#include "utils.h"

// Реализация строковых функций
int string_length(const char* str) {
    int len = 0;
    while (str[len] != '\0') {
        len++;
    }
    return len;
}

void string_copy(char* dest, const char* src) {
    int i = 0;
    while (src[i] != '\0') {
        dest[i] = src[i];
        i++;
    }
    dest[i] = '\0';
}

int string_compare(const char* str1, const char* str2) {
    int i = 0;
    while (str1[i] != '\0' && str2[i] != '\0') {
        if (str1[i] != str2[i]) {
            return str1[i] - str2[i];
        }
        i++;
    }
    return str1[i] - str2[i];
}

// Реализация математических функций
int max(int a, int b) {
    return (a > b) ? a : b;
}

int min(int a, int b) {
    return (a < b) ? a : b;
}

int abs_value(int x) {
    return (x < 0) ? -x : x;
}
```

---

## Резюме Блока 12

### Что мы изучили:

✅ Разделение интерфейса (.h) и реализации (.c)  
✅ `extern` для внешних переменных и функций  
✅ `static` для ограничения области видимости  
✅ Компиляция нескольких файлов  
✅ Makefile для автоматизации сборки  
✅ Создание статических и динамических библиотек  
✅ Организация проекта в модули  

### Следующие шаги:

Переходите к `13-advanced-memory.md` для изучения продвинутой работы с памятью!

---

## Полезные ресурсы

- Заголовочные файлы содержат объявления, исходные — определения
- Используйте `static` для скрытия внутренних деталей
- Makefile упрощает сборку больших проектов
- Библиотеки позволяют переиспользовать код

---

## Типичные ошибки

1. **Определение в заголовочном файле**
   ```c
   // utils.h
   int global_var = 10;  // ❌ Определение в .h файле
   // Правильно: extern int global_var;
   ```

2. **Забыли include guard**
   ```c
   // utils.h
   int func(void);  // ❌ Может быть включён несколько раз
   ```

3. **Множественные определения**
   ```c
   // file1.c
   int global = 10;
   // file2.c
   int global = 20;  // ❌ Два определения одной переменной
   ```

4. **Неправильный порядок линковки**
   ```bash
   gcc -lutils main.c  # ❌ Библиотека должна быть после файлов
   gcc main.c -lutils  # ✅ Правильно
   ```

