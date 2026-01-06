# Блок 18: Тестирование и отладка

## Цель

Научиться тестировать и отлаживать код на C. Правильное тестирование и отладка критичны для создания надёжного программного обеспечения.

---

## 1. Отладчик GDB

### Базовые команды GDB

**Компиляция с отладочной информацией:**
```bash
gcc -g program.c -o program
```

**Запуск GDB:**
```bash
gdb ./program
```

### Основные команды

```gdb
(gdb) break main          # Установить точку останова в main
(gdb) break 10            # Установить точку останова на строке 10
(gdb) run                 # Запустить программу
(gdb) next                # Следующая строка (не заходя в функции)
(gdb) step                # Следующая строка (заходя в функции)
(gdb) continue            # Продолжить выполнение
(gdb) print variable      # Вывести значение переменной
(gdb) print arr[0]        # Вывести элемент массива
(gdb) display variable    # Автоматически выводить переменную на каждом шаге
(gdb) backtrace           # Показать стек вызовов
(gdb) info locals         # Показать все локальные переменные
(gdb) quit                # Выйти из GDB
```

### Пример использования

```c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main(void) {
    int x = 10;
    int y = 20;
    int result = add(x, y);
    printf("Result: %d\n", result);
    return 0;
}
```

**Сессия GDB:**
```bash
$ gcc -g program.c -o program
$ gdb ./program
(gdb) break main
(gdb) run
(gdb) print x
$1 = 10
(gdb) step
(gdb) print a
$2 = 10
(gdb) continue
```

---

## 2. Assert макросы

### assert() — проверка условий

```c
#include <stdio.h>
#include <assert.h>

int divide(int a, int b) {
    assert(b != 0);  // Проверка: делитель не должен быть нулём
    return a / b;
}

int main(void) {
    printf("%d\n", divide(10, 2));  // OK
    printf("%d\n", divide(10, 0));  // Assertion failed!
    return 0;
}
```

**Отключение assert в release:**
```bash
gcc -DNDEBUG program.c  # assert() будут игнорироваться
```

### Кастомные assert макросы

```c
#include <stdio.h>
#include <stdlib.h>

#define ASSERT(condition, message) \
    do { \
        if (!(condition)) { \
            fprintf(stderr, "Assertion failed: %s at %s:%d\n", \
                    message, __FILE__, __LINE__); \
            abort(); \
        } \
    } while(0)

int main(void) {
    int x = 10;
    ASSERT(x > 0, "x must be positive");
    ASSERT(x < 5, "x must be less than 5");  // Упадёт здесь
    return 0;
}
```

---

## 3. Unit тестирование

### Простая система тестирования

```c
#include <stdio.h>
#include <string.h>

// Макросы для тестирования
#define TEST_START() \
    int tests_passed = 0; \
    int tests_failed = 0;

#define ASSERT_EQ(actual, expected, test_name) \
    do { \
        if ((actual) == (expected)) { \
            printf("✓ %s\n", test_name); \
            tests_passed++; \
        } else { \
            printf("✗ %s: expected %d, got %d\n", \
                   test_name, (expected), (actual)); \
            tests_failed++; \
        } \
    } while(0)

#define TEST_SUMMARY() \
    do { \
        printf("\nTests passed: %d\n", tests_passed); \
        printf("Tests failed: %d\n", tests_failed); \
        return tests_failed == 0 ? 0 : 1; \
    } while(0)

// Функция для тестирования
int add(int a, int b) {
    return a + b;
}

int main(void) {
    TEST_START();
    
    ASSERT_EQ(add(2, 3), 5, "add(2, 3) == 5");
    ASSERT_EQ(add(0, 0), 0, "add(0, 0) == 0");
    ASSERT_EQ(add(-1, 1), 0, "add(-1, 1) == 0");
    
    TEST_SUMMARY();
}
```

### Более продвинутая система

```c
#include <stdio.h>
#include <string.h>

typedef struct {
    const char* name;
    void (*test_func)(void);
} TestCase;

#define MAX_TESTS 100
static TestCase tests[MAX_TESTS];
static int test_count = 0;

void register_test(const char* name, void (*func)(void)) {
    if (test_count < MAX_TESTS) {
        tests[test_count].name = name;
        tests[test_count].test_func = func;
        test_count++;
    }
}

#define TEST(name) \
    void test_##name(void); \
    __attribute__((constructor)) \
    void register_##name(void) { \
        register_test(#name, test_##name); \
    } \
    void test_##name(void)

int run_tests(void) {
    int passed = 0;
    int failed = 0;
    
    printf("Running %d tests...\n\n", test_count);
    
    for (int i = 0; i < test_count; i++) {
        printf("Test %d: %s... ", i + 1, tests[i].name);
        fflush(stdout);
        
        tests[i].test_func();
        printf("PASSED\n");
        passed++;
    }
    
    printf("\nResults: %d passed, %d failed\n", passed, failed);
    return failed == 0 ? 0 : 1;
}

// Пример использования
int add(int a, int b) {
    return a + b;
}

TEST(add_positive_numbers) {
    if (add(2, 3) != 5) {
        printf("FAILED");
        return;
    }
}

TEST(add_zero) {
    if (add(0, 0) != 0) {
        printf("FAILED");
        return;
    }
}

int main(void) {
    return run_tests();
}
```

---

## 4. Логирование

### Простое логирование

```c
#include <stdio.h>
#include <stdarg.h>
#include <time.h>

typedef enum {
    LOG_DEBUG,
    LOG_INFO,
    LOG_WARNING,
    LOG_ERROR
} LogLevel;

void log_message(LogLevel level, const char* format, ...) {
    const char* level_str[] = {"DEBUG", "INFO", "WARNING", "ERROR"};
    time_t now = time(NULL);
    char* time_str = ctime(&now);
    time_str[strlen(time_str) - 1] = '\0';  // Удалить \n
    
    printf("[%s] [%s] ", time_str, level_str[level]);
    
    va_list args;
    va_start(args, format);
    vprintf(format, args);
    va_end(args);
    
    printf("\n");
}

#define LOG_DEBUG(...) log_message(LOG_DEBUG, __VA_ARGS__)
#define LOG_INFO(...) log_message(LOG_INFO, __VA_ARGS__)
#define LOG_WARNING(...) log_message(LOG_WARNING, __VA_ARGS__)
#define LOG_ERROR(...) log_message(LOG_ERROR, __VA_ARGS__)

int main(void) {
    LOG_DEBUG("Debug message");
    LOG_INFO("Info message");
    LOG_WARNING("Warning message");
    LOG_ERROR("Error message");
    return 0;
}
```

---

## 5. Valgrind для обнаружения утечек памяти

### Использование Valgrind

```bash
# Компиляция с отладочной информацией
gcc -g program.c -o program

# Запуск с Valgrind
valgrind --leak-check=full ./program
```

### Пример программы с утечкой

```c
#include <stdlib.h>

int main(void) {
    int* ptr = malloc(sizeof(int) * 10);
    // Забыли free(ptr) - утечка памяти
    return 0;
}
```

**Вывод Valgrind:**
```
==12345== HEAP SUMMARY:
==12345==     in use at exit: 40 bytes in 1 blocks
==12345==   total heap usage: 1 allocs, 0 frees, 40 bytes allocated
==12345== 
==12345== 40 bytes in 1 blocks are definitely lost
```

---

## 6. Статический анализ

### cppcheck

```bash
# Установка
sudo apt-get install cppcheck

# Использование
cppcheck program.c
```

### clang-static-analyzer

```bash
# Компиляция с анализом
clang --analyze program.c
```

---

## Резюме Блока 18

### Что мы изучили:

✅ GDB: точки останова, пошаговое выполнение, просмотр переменных  
✅ Assert макросы для проверки условий  
✅ Unit тестирование: создание простой системы тестов  
✅ Логирование для отладки  
✅ Valgrind для обнаружения утечек памяти  
✅ Статический анализ кода  

### Следующие шаги:

Переходите к `19-performance-optimization.md` для изучения оптимизации!

---

## Полезные ресурсы

- Всегда компилируйте с `-g` для отладки
- Используйте assert для проверки инвариантов
- Пишите тесты для критичных функций
- Используйте Valgrind перед релизом

---

## Типичные ошибки

1. **Забыли -g при компиляции**
   ```bash
   gcc program.c -o program  # ❌ Нет отладочной информации
   gcc -g program.c -o program  # ✅ Правильно
   ```

2. **Использование assert для проверки пользовательского ввода**
   ```c
   assert(x > 0);  // ❌ assert можно отключить через NDEBUG
   if (x <= 0) {  // ✅ Правильно
       return ERROR;
   }
   ```

