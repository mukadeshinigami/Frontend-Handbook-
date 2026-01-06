# Блок 13: Работа с памятью (продвинутая)

## Цель

Глубоко понять управление памятью в C, научиться находить и исправлять ошибки, связанные с памятью, и использовать инструменты для отладки.

---

## 1. Структура памяти программы

### Сегменты памяти

```
┌─────────────────────┐
│   Код (Code)        │  Исполняемый код программы
├─────────────────────┤
│   Данные (Data)     │  Глобальные инициализированные переменные
├─────────────────────┤
│   BSS (Block)       │  Глобальные неинициализированные переменные
├─────────────────────┤
│   Куча (Heap)       │  Динамическая память (malloc, free)
│       ↑             │
│       │ растёт      │
├─────────────────────┤
│       │             │
│       │ растёт      │
│   Стек (Stack)      │  Локальные переменные, вызовы функций
│       ↓             │
└─────────────────────┘
```

### Стек (Stack)

```c
void function1(void) {
    int x = 10;  // В стеке
    function2();
}

void function2(void) {
    int y = 20;  // В стеке
}
```

**Характеристики:**
- Быстрый доступ
- Автоматическое управление
- Ограниченный размер
- Локальные переменные

### Куча (Heap)

```c
int* ptr = malloc(sizeof(int) * 10);  // В куче
// Использование...
free(ptr);  // Освобождение
```

**Характеристики:**
- Гибкий размер
- Ручное управление
- Медленнее стека
- Динамические данные

---

## 2. Утечки памяти (Memory Leaks)

### Что такое утечка памяти?

Память выделена, но не освобождена, и указатель на неё потерян.

```c
#include <stdlib.h>

void memory_leak_example(void) {
    int* ptr = malloc(sizeof(int) * 100);
    // Использование ptr...
    // ❌ Забыли free(ptr) - утечка памяти!
    // После выхода из функции указатель потерян, память недоступна
}
```

### Примеры утечек

```c
// Пример 1: Забыли free
void example1(void) {
    char* str = malloc(100);
    // Использование...
    // Забыли free(str);
}

// Пример 2: Перезапись указателя
void example2(void) {
    int* ptr = malloc(sizeof(int) * 10);
    ptr = malloc(sizeof(int) * 20);  // ❌ Старая память потеряна!
    free(ptr);  // Освобождаем только новую память
}

// Пример 3: Выход без освобождения
int* example3(void) {
    int* ptr = malloc(sizeof(int) * 10);
    if (some_condition) {
        return NULL;  // ❌ Память не освобождена!
    }
    return ptr;
}
```

---

## 3. Висячие указатели (Dangling Pointers)

### Что такое висячий указатель?

Указатель, который указывает на освобождённую память.

```c
#include <stdlib.h>

int* create_array(int size) {
    int* arr = malloc(sizeof(int) * size);
    return arr;
}

void dangling_pointer_example(void) {
    int* ptr = create_array(10);
    free(ptr);  // Память освобождена
    
    // ❌ ptr теперь висячий указатель!
    *ptr = 42;  // Неопределённое поведение!
}
```

### Примеры висячих указателей

```c
// Пример 1: Использование после free
void example1(void) {
    int* ptr = malloc(sizeof(int));
    *ptr = 10;
    free(ptr);
    *ptr = 20;  // ❌ Висячий указатель!
}

// Пример 2: Возврат указателя на локальную переменную
int* example2(void) {
    int local = 42;
    return &local;  // ❌ local уничтожится после выхода из функции!
}

// Пример 3: Два указателя на одну память
void example3(void) {
    int* ptr1 = malloc(sizeof(int));
    int* ptr2 = ptr1;
    free(ptr1);
    *ptr2 = 10;  // ❌ ptr2 висячий!
}
```

**Решение:** После `free()` устанавливайте указатель в `NULL`:

```c
free(ptr);
ptr = NULL;  // ✅ Теперь безопасно
```

---

## 4. Double Free и другие ошибки

### Double Free

Попытка освободить уже освобождённую память:

```c
int* ptr = malloc(sizeof(int));
free(ptr);
free(ptr);  // ❌ Double free - неопределённое поведение!
```

**Решение:**
```c
int* ptr = malloc(sizeof(int));
free(ptr);
ptr = NULL;  // ✅
if (ptr != NULL) {
    free(ptr);  // Теперь безопасно
}
```

### Use After Free

Использование памяти после освобождения:

```c
int* ptr = malloc(sizeof(int) * 10);
free(ptr);
ptr[0] = 42;  // ❌ Use after free!
```

### Переполнение буфера (Buffer Overflow)

```c
char buffer[10];
strcpy(buffer, "This string is too long!");  // ❌ Переполнение!
```

**Безопасная альтернатива:**
```c
char buffer[10];
strncpy(buffer, "This string is too long!", sizeof(buffer) - 1);
buffer[sizeof(buffer) - 1] = '\0';  // Гарантируем завершающий нуль
```

---

## 5. Инструменты для обнаружения ошибок памяти

### Valgrind

**Установка (Linux):**
```bash
sudo apt-get install valgrind  # Ubuntu/Debian
```

**Использование:**
```bash
gcc -g program.c -o program
valgrind --leak-check=full ./program
```

**Пример вывода:**
```
==12345== Invalid read of size 4
==12345==    at 0x400123: main (program.c:10)
==12345==  Address 0x5204040 is 0 bytes after a block of size 16 free'd
==12345== 
==12345== HEAP SUMMARY:
==12345==     in use at exit: 40 bytes in 1 blocks
==12345==   total heap usage: 2 allocs, 1 frees, 56 bytes allocated
==12345== 
==12345== 40 bytes in 1 blocks are definitely lost
```

### AddressSanitizer (ASan)

**Компиляция:**
```bash
gcc -fsanitize=address -g program.c -o program
```

**Автоматически обнаруживает:**
- Использование после освобождения
- Переполнение буфера
- Утечки памяти
- Использование неинициализированной памяти

---

## 6. Best Practices для работы с памятью

### 1. Всегда проверяйте результат malloc()

```c
int* ptr = malloc(sizeof(int) * 10);
if (ptr == NULL) {
    fprintf(stderr, "Memory allocation failed\n");
    exit(1);
}
```

### 2. Освобождайте память в том же уровне абстракции

```c
void process_data(void) {
    int* data = malloc(sizeof(int) * 10);
    // Использование...
    free(data);  // ✅ Освобождаем здесь
}
```

### 3. Используйте один указатель для одной области памяти

```c
// ❌ Плохо
int* ptr1 = malloc(sizeof(int));
int* ptr2 = ptr1;
free(ptr1);
free(ptr2);  // Double free!

// ✅ Хорошо
int* ptr = malloc(sizeof(int));
// Использование...
free(ptr);
ptr = NULL;
```

### 4. Устанавливайте указатели в NULL после free()

```c
free(ptr);
ptr = NULL;  // ✅ Защита от повторного использования
```

### 5. Используйте calloc() для инициализации нулями

```c
int* arr = calloc(10, sizeof(int));  // Все элементы = 0
// Эквивалентно:
// int* arr = malloc(10 * sizeof(int));
// memset(arr, 0, 10 * sizeof(int));
```

---

## 7. Выравнивание памяти (Alignment)

### Что такое выравнивание?

Компилятор выравнивает данные для эффективного доступа:

```c
#include <stdio.h>

struct Example {
    char a;    // 1 байт
    // 3 байта padding
    int b;     // 4 байта (должен быть на границе 4 байт)
    char c;    // 1 байт
    // 3 байта padding
};  // Итого: 12 байт

int main(void) {
    printf("Size: %zu\n", sizeof(struct Example));  // 12
    return 0;
}
```

### _Alignas и _Alignof (C11)

```c
#include <stdio.h>
#include <stdalign.h>

struct Aligned {
    alignas(16) int data;  // Выровнено по 16 байт
};

int main(void) {
    printf("Alignment: %zu\n", alignof(struct Aligned));  // 16
    return 0;
}
```

---

## 8. Практические примеры

### Пример 1: Безопасное выделение памяти

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void* safe_malloc(size_t size) {
    void* ptr = malloc(size);
    if (ptr == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        exit(1);
    }
    return ptr;
}

int main(void) {
    int* arr = safe_malloc(sizeof(int) * 10);
    
    // Использование...
    for (int i = 0; i < 10; i++) {
        arr[i] = i;
    }
    
    free(arr);
    arr = NULL;
    
    return 0;
}
```

### Пример 2: Обнаружение утечек

```c
#include <stdio.h>
#include <stdlib.h>

#ifdef DEBUG
    static int malloc_count = 0;
    static int free_count = 0;
    
    void* debug_malloc(size_t size) {
        malloc_count++;
        printf("Malloc #%d: %zu bytes\n", malloc_count, size);
        return malloc(size);
    }
    
    void debug_free(void* ptr) {
        if (ptr != NULL) {
            free_count++;
            printf("Free #%d\n", free_count);
            free(ptr);
        }
    }
    
    void check_leaks(void) {
        if (malloc_count != free_count) {
            fprintf(stderr, "Memory leak detected! %d allocs, %d frees\n",
                    malloc_count, free_count);
        }
    }
#else
    #define debug_malloc malloc
    #define debug_free free
    #define check_leaks()
#endif

int main(void) {
    int* ptr = debug_malloc(sizeof(int) * 10);
    // Забыли free...
    check_leaks();
    return 0;
}
```

---

## Резюме Блока 13

### Что мы изучили:

✅ Структура памяти программы (стек, куча, сегменты)  
✅ Утечки памяти и как их избежать  
✅ Висячие указатели и use-after-free  
✅ Double free и другие ошибки  
✅ Инструменты отладки: Valgrind, AddressSanitizer  
✅ Best practices для работы с памятью  
✅ Выравнивание памяти  

### Следующие шаги:

Переходите к `14-advanced-strings.md` для изучения продвинутой работы со строками!

---

## Полезные ресурсы

- Всегда проверяйте результат `malloc()`
- Освобождайте память в паре с выделением
- Используйте инструменты для обнаружения утечек
- Устанавливайте указатели в `NULL` после `free()`

---

## Типичные ошибки

1. **Забыли освободить память**
   ```c
   int* ptr = malloc(sizeof(int) * 10);
   // Использование...
   // ❌ Забыли free(ptr);
   ```

2. **Использование после free**
   ```c
   free(ptr);
   *ptr = 10;  // ❌ Use after free
   ```

3. **Double free**
   ```c
   free(ptr);
   free(ptr);  // ❌ Double free
   ```

4. **Не проверили результат malloc()**
   ```c
   int* ptr = malloc(sizeof(int) * 1000000);
   *ptr = 10;  // ❌ Может быть NULL!
   ```

