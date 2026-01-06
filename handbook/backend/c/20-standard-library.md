# Блок 20: Стандартная библиотека C (STD)

## Цель

Использовать возможности стандартной библиотеки C. Стандартная библиотека предоставляет множество полезных функций для работы с данными, строками, математикой и временем.

---

## 1. <stdio.h> — ввод-вывод

### Основные функции

```c
#include <stdio.h>

int main(void) {
    // Форматированный вывод
    printf("Integer: %d\n", 42);
    printf("Float: %.2f\n", 3.14);
    printf("String: %s\n", "Hello");
    
    // Форматированный ввод
    int num;
    printf("Enter a number: ");
    scanf("%d", &num);
    
    // Работа с файлами
    FILE* file = fopen("data.txt", "w");
    fprintf(file, "Data: %d\n", num);
    fclose(file);
    
    return 0;
}
```

---

## 2. <stdlib.h> — утилиты

### Управление памятью

```c
#include <stdlib.h>

int main(void) {
    // Выделение памяти
    int* arr = malloc(sizeof(int) * 10);
    int* zeros = calloc(10, sizeof(int));  // Инициализация нулями
    
    // Изменение размера
    arr = realloc(arr, sizeof(int) * 20);
    
    // Освобождение
    free(arr);
    free(zeros);
    
    return 0;
}
```

### Преобразование строк

```c
#include <stdlib.h>
#include <stdio.h>

int main(void) {
    // Строка в число
    int num = atoi("123");
    double dbl = atof("45.67");
    long lng = atol("1000000");
    
    printf("Integer: %d\n", num);
    printf("Double: %.2f\n", dbl);
    printf("Long: %ld\n", lng);
    
    return 0;
}
```

### Случайные числа

```c
#include <stdlib.h>
#include <stdio.h>
#include <time.h>

int main(void) {
    // Инициализация генератора
    srand(time(NULL));
    
    // Генерация случайного числа от 0 до RAND_MAX
    int random = rand();
    printf("Random: %d\n", random);
    
    // Генерация в диапазоне [0, 99]
    int range = rand() % 100;
    printf("Range [0-99]: %d\n", range);
    
    // Генерация в диапазоне [min, max]
    int min = 10, max = 20;
    int value = min + rand() % (max - min + 1);
    printf("Range [10-20]: %d\n", value);
    
    return 0;
}
```

### Выход из программы

```c
#include <stdlib.h>

int main(void) {
    // Успешное завершение
    exit(EXIT_SUCCESS);
    // или
    return 0;
    
    // Ошибка
    exit(EXIT_FAILURE);
    // или
    return 1;
}
```

---

## 3. <string.h> — строковые функции

### Основные функции

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char str1[50] = "Hello";
    char str2[50] = "World";
    char buffer[100];
    
    // Длина строки
    printf("Length: %zu\n", strlen(str1));
    
    // Копирование
    strcpy(buffer, str1);
    printf("Copied: %s\n", buffer);
    
    // Конкатенация
    strcat(buffer, " ");
    strcat(buffer, str2);
    printf("Concatenated: %s\n", buffer);
    
    // Сравнение
    if (strcmp(str1, str2) == 0) {
        printf("Strings are equal\n");
    } else {
        printf("Strings are different\n");
    }
    
    // Поиск символа
    char* found = strchr(str1, 'l');
    if (found != NULL) {
        printf("Found 'l' at position: %ld\n", found - str1);
    }
    
    return 0;
}
```

---

## 4. <math.h> — математические функции

```c
#include <stdio.h>
#include <math.h>

int main(void) {
    double x = 2.0;
    
    printf("sqrt(%.1f) = %.2f\n", x, sqrt(x));
    printf("pow(%.1f, 3) = %.2f\n", x, pow(x, 3));
    printf("sin(%.1f) = %.2f\n", x, sin(x));
    printf("cos(%.1f) = %.2f\n", x, cos(x));
    printf("exp(%.1f) = %.2f\n", x, exp(x));
    printf("log(%.1f) = %.2f\n", x, log(x));
    printf("fabs(-%.1f) = %.2f\n", x, fabs(-x));
    printf("ceil(%.1f) = %.2f\n", x + 0.3, ceil(x + 0.3));
    printf("floor(%.1f) = %.2f\n", x + 0.3, floor(x + 0.3));
    
    return 0;
}
```

**Компиляция:**
```bash
gcc program.c -lm -o program  # -lm для линковки математической библиотеки
```

---

## 5. <time.h> — работа со временем

```c
#include <stdio.h>
#include <time.h>

int main(void) {
    // Текущее время
    time_t now = time(NULL);
    printf("Current time: %ld\n", now);
    
    // Преобразование в строку
    char* time_str = ctime(&now);
    printf("Time string: %s", time_str);
    
    // Структурированное время
    struct tm* local = localtime(&now);
    printf("Year: %d\n", local->tm_year + 1900);
    printf("Month: %d\n", local->tm_mon + 1);
    printf("Day: %d\n", local->tm_mday);
    printf("Hour: %d\n", local->tm_hour);
    printf("Minute: %d\n", local->tm_min);
    
    // Форматированное время
    char buffer[100];
    strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", local);
    printf("Formatted: %s\n", buffer);
    
    // Измерение времени выполнения
    clock_t start = clock();
    // Какая-то работа...
    clock_t end = clock();
    double cpu_time = ((double)(end - start)) / CLOCKS_PER_SEC;
    printf("CPU time: %f seconds\n", cpu_time);
    
    return 0;
}
```

---

## 6. <ctype.h> — функции для символов

```c
#include <stdio.h>
#include <ctype.h>

int main(void) {
    char ch = 'A';
    
    printf("isalpha('%c'): %d\n", ch, isalpha(ch));
    printf("isdigit('%c'): %d\n", ch, isdigit(ch));
    printf("isalnum('%c'): %d\n", ch, isalnum(ch));
    printf("isspace('%c'): %d\n", ch, isspace(ch));
    printf("isupper('%c'): %d\n", ch, isupper(ch));
    printf("islower('%c'): %d\n", ch, islower(ch));
    
    printf("tolower('%c'): %c\n", ch, tolower(ch));
    printf("toupper('%c'): %c\n", 'a', toupper('a'));
    
    return 0;
}
```

---

## 7. <stdbool.h> — булев тип

```c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    bool flag = true;
    
    if (flag) {
        printf("Flag is true\n");
    }
    
    bool result = (5 > 3);
    printf("5 > 3: %s\n", result ? "true" : "false");
    
    return 0;
}
```

---

## 8. <stdint.h> — типы фиксированной ширины

```c
#include <stdio.h>
#include <stdint.h>

int main(void) {
    int8_t small = 127;
    int16_t medium = 32767;
    int32_t large = 2147483647;
    int64_t huge = 9223372036854775807LL;
    
    uint8_t u_small = 255;
    uint16_t u_medium = 65535;
    uint32_t u_large = 4294967295U;
    uint64_t u_huge = 18446744073709551615ULL;
    
    printf("int8_t: %d\n", small);
    printf("uint64_t: %llu\n", u_huge);
    
    return 0;
}
```

---

## 9. <limits.h> и <float.h> — константы типов

```c
#include <stdio.h>
#include <limits.h>
#include <float.h>

int main(void) {
    printf("INT_MAX: %d\n", INT_MAX);
    printf("INT_MIN: %d\n", INT_MIN);
    printf("UINT_MAX: %u\n", UINT_MAX);
    printf("LONG_MAX: %ld\n", LONG_MAX);
    
    printf("FLT_MAX: %e\n", FLT_MAX);
    printf("FLT_MIN: %e\n", FLT_MIN);
    printf("DBL_MAX: %e\n", DBL_MAX);
    printf("DBL_MIN: %e\n", DBL_MIN);
    
    return 0;
}
```

---

## 10. <errno.h> — коды ошибок

```c
#include <stdio.h>
#include <errno.h>
#include <string.h>

int main(void) {
    FILE* file = fopen("nonexistent.txt", "r");
    
    if (file == NULL) {
        printf("Error code: %d\n", errno);
        printf("Error message: %s\n", strerror(errno));
        
        // Константы ошибок
        if (errno == ENOENT) {
            printf("File not found\n");
        } else if (errno == EACCES) {
            printf("Permission denied\n");
        }
    }
    
    return 0;
}
```

---

## Резюме Блока 20

### Что мы изучили:

✅ `<stdio.h>` — ввод-вывод и файлы  
✅ `<stdlib.h>` — память, преобразования, случайные числа  
✅ `<string.h>` — строковые функции  
✅ `<math.h>` — математические функции  
✅ `<time.h>` — работа со временем  
✅ `<ctype.h>` — функции для символов  
✅ `<stdbool.h>` — булев тип  
✅ `<stdint.h>` — типы фиксированной ширины  
✅ `<limits.h>`, `<float.h>` — константы типов  
✅ `<errno.h>` — коды ошибок  

### Следующие шаги:

Поздравляем! Вы изучили основы стандартной библиотеки C. Теперь вы готовы к созданию реальных проектов!

---

## Полезные ресурсы

- Изучите документацию стандартной библиотеки
- Используйте правильные функции для задач
- Проверяйте возвращаемые значения
- Обрабатывайте ошибки через `errno`

---

## Типичные ошибки

1. **Забыли -lm для математических функций**
   ```bash
   gcc program.c  # ❌ Ошибка линковки
   gcc program.c -lm  # ✅ Правильно
   ```

2. **Не проверили возвращаемое значение**
   ```c
   FILE* file = fopen("file.txt", "r");
   fprintf(file, "data");  // ❌ file может быть NULL
   ```

3. **Использование atoi() без проверки**
   ```c
   int num = atoi("abc");  // ❌ Вернёт 0, но это ошибка
   // Используйте strtol() для проверки
   ```

