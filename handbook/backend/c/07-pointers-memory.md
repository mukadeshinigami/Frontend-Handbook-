# Блок 7: Указатели (Pointers) — часть 2: Динамическая память

## Цель

Научиться управлять динамической памятью (кучей) с помощью `malloc()`, `calloc()`, `realloc()` и `free()`. Понять разницу между стеком и кучей, научиться избегать утечек памяти.

---

## 1. Стек (Stack) vs Куча (Heap)

### Стек (Stack)

- **Автоматическое управление** — память выделяется и освобождается автоматически
- **Быстрый доступ** — выделение/освобождение очень быстрое
- **Ограниченный размер** — обычно несколько мегабайт
- **Локальные переменные** хранятся в стеке

```c
void function(void) {
    int x = 10;  // Выделяется в стеке
    // При выходе из функции память автоматически освобождается
}
```

### Куча (Heap)

- **Ручное управление** — нужно выделять и освобождать вручную
- **Медленнее** — выделение/освобождение занимает больше времени
- **Большой размер** — ограничен только доступной памятью
- **Динамические данные** выделяются в куче

```c
int* ptr = malloc(sizeof(int));  // Выделяется в куче
// Нужно вручную освободить: free(ptr);
```

### Сравнение

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    // СТЕК: автоматическое управление
    int stack_var = 10;  // Выделяется в стеке
    int stack_arr[100];  // Массив в стеке
    
    // КУЧА: ручное управление
    int* heap_var = malloc(sizeof(int));  // Выделяется в куче
    int* heap_arr = malloc(100 * sizeof(int));  // Массив в куче
    
    *heap_var = 20;
    
    // ОБЯЗАТЕЛЬНО освободить память из кучи!
    free(heap_var);
    free(heap_arr);
    
    // stack_var и stack_arr освободятся автоматически
    
    return 0;
}
```

---

## 2. malloc() — выделение памяти

`malloc()` выделяет блок памяти заданного размера в куче.

### Синтаксис

```c
void* malloc(size_t size);
```

- `size` — размер в байтах
- Возвращает указатель на выделенную память или `NULL` при ошибке
- Тип возвращаемого значения: `void*` (универсальный указатель)

### Примеры

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    // Выделение памяти для одного int
    int* ptr = malloc(sizeof(int));
    if (ptr == NULL) {
        printf("Memory allocation failed!\n");
        return 1;
    }
    
    *ptr = 42;
    printf("Value: %d\n", *ptr);
    
    free(ptr);  // Освобождаем память
    
    return 0;
}
```

### Выделение массива

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int size = 5;
    
    // Выделение памяти для массива из 5 int
    int* arr = malloc(size * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed!\n");
        return 1;
    }
    
    // Инициализация массива
    for (int i = 0; i < size; i++) {
        arr[i] = i * 10;
    }
    
    // Использование массива
    for (int i = 0; i < size; i++) {
        printf("arr[%d] = %d\n", i, arr[i]);
    }
    
    free(arr);  // Освобождаем память
    
    return 0;
}
```

**⚠️ ВАЖНО:** Всегда проверяйте результат `malloc()` на `NULL`!

---

## 3. calloc() — выделение с инициализацией

`calloc()` выделяет память и **инициализирует её нулями**.

### Синтаксис

```c
void* calloc(size_t num, size_t size);
```

- `num` — количество элементов
- `size` — размер одного элемента
- Возвращает указатель на выделенную память или `NULL`
- Вся память инициализируется нулями

### Примеры

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int size = 5;
    
    // Выделение и инициализация нулями
    int* arr = calloc(size, sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed!\n");
        return 1;
    }
    
    // Все элементы уже равны 0
    for (int i = 0; i < size; i++) {
        printf("arr[%d] = %d\n", i, arr[i]);  // Все 0
    }
    
    free(arr);
    
    return 0;
}
```

### malloc() vs calloc()

```c
// malloc() - память НЕ инициализирована (содержит "мусор")
int* arr1 = malloc(5 * sizeof(int));
// arr1[0] может быть любым значением!

// calloc() - память инициализирована нулями
int* arr2 = calloc(5, sizeof(int));
// arr2[0] гарантированно равен 0
```

**Когда использовать:**
- `malloc()` — когда не нужна инициализация (быстрее)
- `calloc()` — когда нужны нули (безопаснее)

---

## 4. realloc() — изменение размера

`realloc()` изменяет размер ранее выделенного блока памяти.

### Синтаксис

```c
void* realloc(void* ptr, size_t new_size);
```

- `ptr` — указатель на ранее выделенную память (или `NULL`)
- `new_size` — новый размер в байтах
- Возвращает указатель на новый блок (может быть другим!)

### Примеры

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    // Начальное выделение
    int* arr = malloc(3 * sizeof(int));
    if (arr == NULL) return 1;
    
    arr[0] = 10;
    arr[1] = 20;
    arr[2] = 30;
    
    // Увеличение размера до 5 элементов
    int* new_arr = realloc(arr, 5 * sizeof(int));
    if (new_arr == NULL) {
        free(arr);  // Освобождаем старый блок
        return 1;
    }
    
    arr = new_arr;  // Используем новый указатель
    
    // Старые значения сохранились
    printf("arr[0] = %d\n", arr[0]);  // 10
    printf("arr[1] = %d\n", arr[1]);  // 20
    printf("arr[2] = %d\n", arr[2]);  // 30
    
    // Новые элементы не инициализированы
    arr[3] = 40;
    arr[4] = 50;
    
    free(arr);
    
    return 0;
}
```

### Важные моменты realloc()

```c
// realloc() может вернуть другой указатель!
int* arr = malloc(5 * sizeof(int));
int* new_arr = realloc(arr, 10 * sizeof(int));

if (new_arr != NULL) {
    arr = new_arr;  // ВАЖНО: использовать новый указатель
    // Старый указатель arr больше недействителен!
} else {
    // Ошибка, но старый блок arr всё ещё валиден
    free(arr);
}
```

**⚠️ ВАЖНО:** 
- `realloc()` может переместить блок в памяти
- Всегда используйте возвращаемое значение
- Старый указатель может стать недействительным

---

## 5. free() — освобождение памяти

`free()` освобождает память, выделенную через `malloc()`, `calloc()` или `realloc()`.

### Синтаксис

```c
void free(void* ptr);
```

- `ptr` — указатель на ранее выделенную память
- После `free()` указатель становится недействительным

### Примеры

```c
#include <stdlib.h>

int main(void) {
    int* ptr = malloc(sizeof(int));
    
    // Использование памяти
    *ptr = 42;
    
    // Освобождение памяти
    free(ptr);
    
    // ptr всё ещё содержит адрес, но память уже освобождена!
    // *ptr = 10;  // ❌ ОПАСНО! Use-after-free
    
    // Лучше обнулить указатель
    ptr = NULL;
    
    return 0;
}
```

**⚠️ Правила:**
1. Каждый `malloc()`/`calloc()`/`realloc()` должен иметь соответствующий `free()`
2. Не освобождайте один блок дважды (double free)
3. Не освобождайте `NULL` (безопасно, но бессмысленно)
4. После `free()` обнуляйте указатель: `ptr = NULL;`

---

## 6. Проверка успешности выделения

**Всегда проверяйте результат выделения памяти!**

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int* ptr = malloc(1000 * sizeof(int));
    
    if (ptr == NULL) {
        // Обработка ошибки
        fprintf(stderr, "Error: Memory allocation failed!\n");
        return 1;  // Выход с кодом ошибки
    }
    
    // Использование памяти
    // ...
    
    free(ptr);
    return 0;
}
```

### Макрос для безопасного выделения

```c
#include <stdio.h>
#include <stdlib.h>

#define SAFE_MALLOC(ptr, size) \
    do { \
        ptr = malloc(size); \
        if (ptr == NULL) { \
            fprintf(stderr, "Memory allocation failed at %s:%d\n", __FILE__, __LINE__); \
            exit(EXIT_FAILURE); \
        } \
    } while(0)

int main(void) {
    int* arr;
    SAFE_MALLOC(arr, 10 * sizeof(int));
    
    // Использование arr
    // ...
    
    free(arr);
    return 0;
}
```

---

## 7. Утечки памяти (Memory Leaks)

**Утечка памяти** — когда выделенная память не освобождается.

### Пример утечки

```c
void leak_example(void) {
    int* ptr = malloc(100 * sizeof(int));
    // Забыли free(ptr)!
    // Память "утекла" и недоступна до конца программы
}
```

### Как избежать

```c
#include <stdlib.h>

void no_leak_example(void) {
    int* ptr = malloc(100 * sizeof(int));
    if (ptr == NULL) return;
    
    // Использование памяти
    // ...
    
    free(ptr);  // ✅ Всегда освобождаем!
    ptr = NULL;  // ✅ Обнуляем указатель
}
```

### Инструменты для обнаружения утечек

- **Valgrind** (Linux/macOS): `valgrind --leak-check=full ./program`
- **AddressSanitizer**: `gcc -fsanitize=address program.c`

---

## 8. Висячие указатели (Dangling Pointers)

**Висячий указатель** — указатель, указывающий на освобождённую память.

```c
#include <stdlib.h>

int main(void) {
    int* ptr = malloc(sizeof(int));
    *ptr = 42;
    
    free(ptr);  // Память освобождена
    
    // ptr теперь висячий указатель!
    // *ptr = 10;  // ❌ ОПАСНО! Неопределённое поведение
    
    ptr = NULL;  // ✅ Решение: обнулить указатель
    
    return 0;
}
```

---

## 9. Двойное освобождение (Double Free)

Освобождение одного блока памяти дважды — ошибка!

```c
#include <stdlib.h>

int main(void) {
    int* ptr = malloc(sizeof(int));
    
    free(ptr);  // Первое освобождение
    free(ptr);  // ❌ ОШИБКА! Double free
    
    return 0;
}
```

**Решение:** После `free()` обнуляйте указатель:

```c
free(ptr);
ptr = NULL;  // Теперь free(ptr) безопасен (но бессмыслен)
```

---

## 10. Указатели на функции

Указатель может указывать не только на данные, но и на функции!

### Синтаксис

```c
тип_возврата (*имя_указателя)(параметры);
```

### Примеры

```c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int multiply(int a, int b) {
    return a * b;
}

int main(void) {
    // Указатель на функцию
    int (*operation)(int, int);
    
    operation = add;
    printf("5 + 3 = %d\n", operation(5, 3));  // 8
    
    operation = multiply;
    printf("5 * 3 = %d\n", operation(5, 3));  // 15
    
    return 0;
}
```

### Массив указателей на функции

```c
#include <stdio.h>

int add(int a, int b) { return a + b; }
int subtract(int a, int b) { return a - b; }
int multiply(int a, int b) { return a * b; }

int main(void) {
    // Массив указателей на функции
    int (*operations[])(int, int) = {add, subtract, multiply};
    
    int a = 10, b = 5;
    
    printf("%d + %d = %d\n", a, b, operations[0](a, b));  // 15
    printf("%d - %d = %d\n", a, b, operations[1](a, b));  // 5
    printf("%d * %d = %d\n", a, b, operations[2](a, b));  // 50
    
    return 0;
}
```

---

## 11. Массивы указателей

Массив может содержать указатели:

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    // Массив указателей на int
    int* arr[5];
    
    // Выделяем память для каждого элемента
    for (int i = 0; i < 5; i++) {
        arr[i] = malloc(sizeof(int));
        *arr[i] = i * 10;
    }
    
    // Использование
    for (int i = 0; i < 5; i++) {
        printf("arr[%d] = %d\n", i, *arr[i]);
    }
    
    // Освобождение памяти
    for (int i = 0; i < 5; i++) {
        free(arr[i]);
    }
    
    return 0;
}
```

### Массив указателей на строки

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    // Массив указателей на char (строки)
    char* words[] = {"hello", "world", "C", "programming"};
    
    for (int i = 0; i < 4; i++) {
        printf("%s\n", words[i]);
    }
    
    return 0;
}
```

---

## 12. Практические примеры

### Пример 1: Динамический массив переменного размера

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int size;
    printf("Enter array size: ");
    scanf("%d", &size);
    
    // Выделение памяти
    int* arr = malloc(size * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed!\n");
        return 1;
    }
    
    // Заполнение массива
    printf("Enter %d numbers: ", size);
    for (int i = 0; i < size; i++) {
        scanf("%d", &arr[i]);
    }
    
    // Вывод массива
    printf("Array: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
    
    free(arr);
    return 0;
}
```

### Пример 2: Функция создания динамического массива

```c
#include <stdio.h>
#include <stdlib.h>

int* create_array(int size) {
    int* arr = malloc(size * sizeof(int));
    if (arr == NULL) {
        return NULL;
    }
    
    // Инициализация
    for (int i = 0; i < size; i++) {
        arr[i] = 0;
    }
    
    return arr;
}

int main(void) {
    int* numbers = create_array(10);
    if (numbers == NULL) {
        printf("Failed to create array\n");
        return 1;
    }
    
    // Использование
    for (int i = 0; i < 10; i++) {
        numbers[i] = i * i;
    }
    
    // Вывод
    for (int i = 0; i < 10; i++) {
        printf("numbers[%d] = %d\n", i, numbers[i]);
    }
    
    free(numbers);  // Не забыть освободить!
    return 0;
}
```

### Пример 3: Изменение размера массива

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int size = 3;
    int* arr = malloc(size * sizeof(int));
    
    arr[0] = 10;
    arr[1] = 20;
    arr[2] = 30;
    
    // Увеличение размера
    size = 5;
    int* new_arr = realloc(arr, size * sizeof(int));
    if (new_arr == NULL) {
        free(arr);
        return 1;
    }
    arr = new_arr;
    
    arr[3] = 40;
    arr[4] = 50;
    
    // Вывод
    for (int i = 0; i < size; i++) {
        printf("arr[%d] = %d\n", i, arr[i]);
    }
    
    free(arr);
    return 0;
}
```

---

## Резюме Блока 7

### Что мы изучили:

✅ **Стек vs Куча** — автоматическая и ручная память  
✅ **malloc()** — выделение памяти  
✅ **calloc()** — выделение с инициализацией нулями  
✅ **realloc()** — изменение размера блока  
✅ **free()** — освобождение памяти  
✅ **Утечки памяти** — как избежать  
✅ **Висячие указатели** — опасность и защита  
✅ **Указатели на функции** — продвинутая техника  
✅ **Массивы указателей** — сложные структуры  

### Следующие шаги:

Переходите к `08-structs.md` для изучения структур данных!

---

## Типичные ошибки

1. **Забыли free()**
   ```c
   int* ptr = malloc(sizeof(int));
   // Забыли free(ptr);  // ❌ Утечка памяти!
   ```

2. **Использование после free()**
   ```c
   free(ptr);
   *ptr = 10;  // ❌ Use-after-free!
   ```

3. **Не проверили результат malloc()**
   ```c
   int* ptr = malloc(1000 * sizeof(int));
   ptr[0] = 10;  // ❌ Может быть NULL!
   ```

4. **Двойное освобождение**
   ```c
   free(ptr);
   free(ptr);  // ❌ Double free!
   ```

5. **Неправильное использование realloc()**
   ```c
   int* arr = malloc(10 * sizeof(int));
   realloc(arr, 20 * sizeof(int));  // ❌ Не сохранили результат!
   // arr может быть недействителен
   ```

---

## Полезные ресурсы

- Динамическая память — основа эффективных программ на C
- Всегда проверяйте результат выделения памяти
- Используйте инструменты (Valgrind) для поиска утечек
- Практикуйтесь с управлением памятью перед сложными проектами


