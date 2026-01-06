# Блок 19: Оптимизация и производительность

## Цель

Писать быстрый и эффективный код. Понимать, когда и как оптимизировать, и измерять производительность.

---

## 1. Флаги оптимизации компилятора

### Уровни оптимизации

```bash
# Без оптимизации (для отладки)
gcc -O0 program.c -o program

# Базовая оптимизация
gcc -O1 program.c -o program

# Полная оптимизация (рекомендуется)
gcc -O2 program.c -o program

# Агрессивная оптимизация (может увеличить размер кода)
gcc -O3 program.c -o program

# Оптимизация размера
gcc -Os program.c -o program
```

**Рекомендации:**
- Используйте `-O2` для production
- Используйте `-O0` или `-Og` для отладки

---

## 2. Профилирование

### gprof

```c
#include <stdio.h>
#include <time.h>

void slow_function(void) {
    for (int i = 0; i < 1000000; i++) {
        // Какая-то работа
    }
}

void fast_function(void) {
    // Быстрая функция
}

int main(void) {
    for (int i = 0; i < 10; i++) {
        slow_function();
        fast_function();
    }
    return 0;
}
```

**Компиляция и запуск:**
```bash
gcc -pg -O2 program.c -o program
./program
gprof ./program gmon.out > analysis.txt
```

### perf (Linux)

```bash
# Установка
sudo apt-get install linux-perf

# Профилирование
perf record ./program
perf report
```

---

## 3. Оптимизация циклов

### Кэш-локальность данных

```c
// ❌ Плохо: плохая локальность
for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
        arr[j][i] = 0;  // Прыгаем по памяти
    }
}

// ✅ Хорошо: хорошая локальность
for (int i = 0; i < SIZE; i++) {
    for (int j = 0; j < SIZE; j++) {
        arr[i][j] = 0;  // Последовательный доступ
    }
}
```

### Избегание лишних вычислений

```c
// ❌ Плохо: вычисление размера в каждой итерации
for (int i = 0; i < strlen(str); i++) {
    // ...
}

// ✅ Хорошо: вычисление один раз
int len = strlen(str);
for (int i = 0; i < len; i++) {
    // ...
}
```

---

## 4. Inline функции

```c
#include <stdio.h>

// Обычная функция
int add_normal(int a, int b) {
    return a + b;
}

// Inline функция (компилятор может встроить)
static inline int add_inline(int a, int b) {
    return a + b;
}

int main(void) {
    int x = add_normal(5, 3);      // Вызов функции
    int y = add_inline(5, 3);      // Может быть встроено
    return 0;
}
```

**Когда использовать:**
- Маленькие функции, вызываемые часто
- Функции-обёртки
- Не переусердствуйте — компилятор сам решает

---

## 5. Избегание лишних аллокаций

```c
// ❌ Плохо: аллокация в цикле
for (int i = 0; i < 1000; i++) {
    int* arr = malloc(sizeof(int) * 100);
    // Использование...
    free(arr);
}

// ✅ Хорошо: аллокация один раз
int* arr = malloc(sizeof(int) * 100);
for (int i = 0; i < 1000; i++) {
    // Использование...
}
free(arr);
```

---

## 6. Benchmarking

### Простое измерение времени

```c
#include <stdio.h>
#include <time.h>

void function_to_test(void) {
    // Код для тестирования
    for (int i = 0; i < 1000000; i++) {
        // Работа
    }
}

int main(void) {
    clock_t start = clock();
    
    function_to_test();
    
    clock_t end = clock();
    double cpu_time_used = ((double)(end - start)) / CLOCKS_PER_SEC;
    
    printf("Time taken: %f seconds\n", cpu_time_used);
    return 0;
}
```

### Более точное измерение

```c
#include <stdio.h>
#include <time.h>
#include <sys/time.h>

double get_time(void) {
    struct timeval tv;
    gettimeofday(&tv, NULL);
    return tv.tv_sec + tv.tv_usec / 1000000.0;
}

int main(void) {
    double start = get_time();
    
    // Код для тестирования
    
    double end = get_time();
    printf("Time: %f seconds\n", end - start);
    return 0;
}
```

---

## 7. Микро-оптимизации

### Когда они нужны, а когда нет

**Не нужны (преждевременная оптимизация):**
```c
// Не оптимизируйте, пока не измерили!
int x = a + b;  // Это уже достаточно быстро
```

**Нужны (после профилирования):**
```c
// Если это горячий участок кода (вызывается миллионы раз)
// Тогда можно оптимизировать
```

### Примеры микро-оптимизаций

```c
// Избегание деления (если возможно)
// Вместо: x / 2
x >> 1;  // Сдвиг вправо (быстрее)

// Избегание умножения на степень двойки
// Вместо: x * 8
x << 3;  // Сдвиг влево (быстрее)
```

**⚠️ Важно:** Современные компиляторы часто делают это автоматически!

---

## Резюме Блока 19

### Что мы изучили:

✅ Флаги оптимизации компилятора (`-O1`, `-O2`, `-O3`)  
✅ Профилирование: `gprof`, `perf`  
✅ Оптимизация циклов и кэш-локальность  
✅ Inline функции  
✅ Избегание лишних аллокаций  
✅ Benchmarking и измерение производительности  
✅ Микро-оптимизации (когда нужны)  

### Следующие шаги:

Переходите к `20-standard-library.md` для изучения стандартной библиотеки C!

---

## Полезные ресурсы

- Сначала измерьте, потом оптимизируйте
- Используйте `-O2` для production
- Профилируйте перед оптимизацией
- Не оптимизируйте преждевременно

---

## Типичные ошибки

1. **Оптимизация без измерения**
   ```c
   // ❌ Не знаете, что медленно, но уже оптимизируете
   ```

2. **Игнорирование флагов компилятора**
   ```bash
   gcc program.c  # ❌ Без оптимизации
   gcc -O2 program.c  # ✅ С оптимизацией
   ```

