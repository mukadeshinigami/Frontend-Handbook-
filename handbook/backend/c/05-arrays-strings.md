# Блок 5: Массивы и строки

## Цель

Научиться работать с массивами (коллекциями однотипных элементов) и строками (массивами символов) в C.

---

## 1. Массивы

### Объявление и инициализация массивов

Массив — это последовательность элементов одного типа.

```c
#include <stdio.h>

int main(void) {
    // Объявление массива из 5 целых чисел
    int numbers[5];
    
    // Инициализация при объявлении
    int arr1[5] = {1, 2, 3, 4, 5};
    
    // Автоматическое определение размера
    int arr2[] = {10, 20, 30};  // Размер = 3
    
    // Частичная инициализация (остальные элементы = 0)
    int arr3[5] = {1, 2};  // {1, 2, 0, 0, 0}
    
    // Все элементы = 0
    int arr4[5] = {0};  // {0, 0, 0, 0, 0}
    
    return 0;
}
```

### Доступ к элементам массива

Индексация начинается с **0**:

```c
#include <stdio.h>

int main(void) {
    int arr[5] = {10, 20, 30, 40, 50};
    
    printf("First element: %d\n", arr[0]);   // 10
    printf("Second element: %d\n", arr[1]);  // 20
    printf("Last element: %d\n", arr[4]);    // 50
    
    // Изменение элемента
    arr[2] = 99;
    printf("Third element: %d\n", arr[2]);   // 99
    
    return 0;
}
```

### ⚠️ Выход за границы массива

C **не проверяет границы массива**! Выход за пределы приводит к неопределённому поведению:

```c
int arr[5] = {1, 2, 3, 4, 5};
printf("%d\n", arr[10]);  // ⚠️ Неопределённое поведение! Может сработать, может упасть
```

**Всегда проверяйте индексы!**

### Размер массива

```c
#include <stdio.h>

int main(void) {
    int arr[] = {1, 2, 3, 4, 5};
    int size = sizeof(arr) / sizeof(arr[0]);  // Количество элементов
    
    printf("Size of array: %zu bytes\n", sizeof(arr));
    printf("Size of one element: %zu bytes\n", sizeof(arr[0]));
    printf("Number of elements: %d\n", size);
    
    return 0;
}
```

**Вывод:**
```
Size of array: 20 bytes
Size of one element: 4 bytes
Number of elements: 5
```

---

## 2. Перебор массивов

### Цикл for

```c
#include <stdio.h>

int main(void) {
    int arr[5] = {10, 20, 30, 40, 50};
    int size = sizeof(arr) / sizeof(arr[0]);
    
    // Вывод всех элементов
    for (int i = 0; i < size; i++) {
        printf("arr[%d] = %d\n", i, arr[i]);
    }
    
    // Изменение всех элементов
    for (int i = 0; i < size; i++) {
        arr[i] *= 2;
    }
    
    // Вывод после изменения
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
    
    return 0;
}
```

### Поиск элемента

```c
#include <stdio.h>
#include <stdbool.h>

bool contains(int arr[], int size, int value) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == value) {
            return true;
        }
    }
    return false;
}

int main(void) {
    int arr[] = {10, 20, 30, 40, 50};
    int size = sizeof(arr) / sizeof(arr[0]);
    
    if (contains(arr, size, 30)) {
        printf("Found!\n");
    } else {
        printf("Not found\n");
    }
    
    return 0;
}
```

### Поиск максимума/минимума

```c
#include <stdio.h>

int find_max(int arr[], int size) {
    int max = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

int find_min(int arr[], int size) {
    int min = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] < min) {
            min = arr[i];
        }
    }
    return min;
}

int main(void) {
    int arr[] = {5, 2, 8, 1, 9, 3};
    int size = sizeof(arr) / sizeof(arr[0]);
    
    printf("Max: %d\n", find_max(arr, size));
    printf("Min: %d\n", find_min(arr, size));
    
    return 0;
}
```

---

## 3. Массивы как параметры функций

### Передача массива в функцию

Массивы передаются **по указателю** (адресу), не по значению. Размер массива нужно передавать отдельно:

```c
#include <stdio.h>

// Размер массива передаётся отдельно
void print_array(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

// Эквивалентная запись с указателем (будет в уроке 6)
void print_array2(int *arr, int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

// Функция может изменять массив (так как передаётся по указателю)
void double_array(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        arr[i] *= 2;
    }
}

int main(void) {
    int arr[] = {1, 2, 3, 4, 5};
    int size = sizeof(arr) / sizeof(arr[0]);
    
    print_array(arr, size);
    double_array(arr, size);
    print_array(arr, size);
    
    return 0;
}
```

**Вывод:**
```
1 2 3 4 5
2 4 6 8 10
```

⚠️ **Изменения в функции отражаются на исходном массиве!**

---

## 4. Многомерные массивы

### Двумерные массивы (матрицы)

```c
#include <stdio.h>

int main(void) {
    // Двумерный массив 3x4
    int matrix[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };
    
    // Доступ к элементам
    printf("matrix[0][0] = %d\n", matrix[0][0]);  // 1
    printf("matrix[1][2] = %d\n", matrix[1][2]);  // 7
    
    // Перебор всех элементов
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 4; j++) {
            printf("%3d ", matrix[i][j]);
        }
        printf("\n");
    }
    
    return 0;
}
```

### Трёхмерные массивы

```c
int cube[2][3][4];  // 2 слоя, 3 строки, 4 столбца

// Инициализация
int cube[2][3][4] = {
    {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    },
    {
        {13, 14, 15, 16},
        {17, 18, 19, 20},
        {21, 22, 23, 24}
    }
};
```

---

## 5. Строки как массивы символов

### Объявление строк

В C строки — это массивы символов, заканчивающиеся нулевым символом `'\0'`:

```c
#include <stdio.h>

int main(void) {
    // Строка как массив символов
    char str1[6] = {'H', 'e', 'l', 'l', 'o', '\0'};
    
    // Строковый литерал (автоматически добавляет '\0')
    char str2[] = "Hello";  // Размер = 6 (5 символов + '\0')
    
    // Явное указание размера
    char str3[20] = "Hello";  // Остальные элементы = '\0'
    
    printf("%s\n", str1);  // %s для вывода строк
    printf("%s\n", str2);
    printf("%s\n", str3);
    
    return 0;
}
```

### Нулевой символ '\0'

`'\0'` (нулевой символ) — маркер конца строки. Размер строки должен включать место для `'\0'`:

```c
char str[5] = "Hello";  // ⚠️ Ошибка! Не хватает места для '\0'
char str2[6] = "Hello"; // ✅ Правильно
```

### Доступ к символам строки

```c
#include <stdio.h>

int main(void) {
    char str[] = "Hello";
    
    printf("First character: %c\n", str[0]);  // H
    printf("Second character: %c\n", str[1]); // e
    printf("Last character: %c\n", str[4]);   // o
    
    // Изменение символа
    str[0] = 'h';
    printf("%s\n", str);  // hello
    
    return 0;
}
```

---

## 6. Функции работы со строками (<string.h>)

### strlen() — длина строки

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char str[] = "Hello";
    int len = strlen(str);  // 5 (не считая '\0')
    printf("Length: %d\n", len);
    return 0;
}
```

### strcpy() — копирование строки

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char src[] = "Hello";
    char dest[20];
    
    strcpy(dest, src);  // Копирует src в dest
    printf("dest: %s\n", dest);
    
    return 0;
}
```

⚠️ **Проблема:** `strcpy()` не проверяет размер буфера! Может произойти переполнение.

### strncpy() — безопасное копирование

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char src[] = "Hello, World!";
    char dest[10];
    
    strncpy(dest, src, sizeof(dest) - 1);  // Копирует максимум 9 символов
    dest[sizeof(dest) - 1] = '\0';  // Гарантируем завершающий '\0'
    
    printf("dest: %s\n", dest);  // "Hello, Wo"
    
    return 0;
}
```

### strcat() — объединение строк

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char str1[20] = "Hello";
    char str2[] = ", World!";
    
    strcat(str1, str2);  // Добавляет str2 к str1
    printf("%s\n", str1);  // "Hello, World!"
    
    return 0;
}
```

### strncat() — безопасное объединение

```c
char str1[20] = "Hello";
char str2[] = ", World!";
strncat(str1, str2, sizeof(str1) - strlen(str1) - 1);
```

### strcmp() — сравнение строк

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char str1[] = "apple";
    char str2[] = "banana";
    
    int result = strcmp(str1, str2);
    
    if (result < 0) {
        printf("'%s' comes before '%s'\n", str1, str2);
    } else if (result > 0) {
        printf("'%s' comes after '%s'\n", str1, str2);
    } else {
        printf("Strings are equal\n");
    }
    
    return 0;
}
```

**Возвращает:**
- `< 0` если str1 < str2 (лексикографически)
- `0` если str1 == str2
- `> 0` если str1 > str2

### strchr() — поиск символа

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char str[] = "Hello, World!";
    char *ptr = strchr(str, 'o');  // Находит первое вхождение 'o'
    
    if (ptr != NULL) {
        printf("Found at position: %ld\n", ptr - str);  // 4
        printf("Substring: %s\n", ptr);  // "o, World!"
    }
    
    return 0;
}
```

### strstr() — поиск подстроки

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char str[] = "Hello, World!";
    char *ptr = strstr(str, "World");
    
    if (ptr != NULL) {
        printf("Found at position: %ld\n", ptr - str);
        printf("Substring: %s\n", ptr);  // "World!"
    }
    
    return 0;
}
```

---

## 7. Преобразование строк

### atoi(), atof() — строки в числа

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    char str1[] = "123";
    char str2[] = "45.67";
    
    int num1 = atoi(str1);        // string to int
    double num2 = atof(str2);     // string to float/double
    
    printf("num1: %d\n", num1);
    printf("num2: %.2f\n", num2);
    
    return 0;
}
```

### sprintf(), snprintf() — числа в строки

```c
#include <stdio.h>

int main(void) {
    char buffer[50];
    int num = 42;
    float pi = 3.14159f;
    
    sprintf(buffer, "Number: %d, Pi: %.2f", num, pi);
    printf("%s\n", buffer);
    
    // Безопасная версия с ограничением размера
    snprintf(buffer, sizeof(buffer), "Number: %d", num);
    printf("%s\n", buffer);
    
    return 0;
}
```

---

## 8. Практические примеры

### Пример 1: Подсчёт слов в строке

```c
#include <stdio.h>
#include <stdbool.h>
#include <ctype.h>

int count_words(const char *str) {
    int count = 0;
    bool in_word = false;
    
    for (int i = 0; str[i] != '\0'; i++) {
        if (isspace(str[i])) {
            in_word = false;
        } else if (!in_word) {
            in_word = true;
            count++;
        }
    }
    
    return count;
}

int main(void) {
    char text[] = "Hello world from C";
    printf("Words: %d\n", count_words(text));
    return 0;
}
```

### Пример 2: Реверс строки

```c
#include <stdio.h>
#include <string.h>

void reverse_string(char *str) {
    int len = strlen(str);
    for (int i = 0; i < len / 2; i++) {
        char temp = str[i];
        str[i] = str[len - 1 - i];
        str[len - 1 - i] = temp;
    }
}

int main(void) {
    char str[] = "Hello";
    reverse_string(str);
    printf("%s\n", str);  // "olleH"
    return 0;
}
```

### Пример 3: Парсинг CSV

```c
#include <stdio.h>
#include <string.h>

void parse_csv(const char *line) {
    char copy[100];
    strcpy(copy, line);
    
    char *token = strtok(copy, ",");
    int field = 0;
    
    while (token != NULL) {
        printf("Field %d: %s\n", field++, token);
        token = strtok(NULL, ",");
    }
}

int main(void) {
    char csv[] = "John,25,Engineer,New York";
    parse_csv(csv);
    return 0;
}
```

---

## Резюме Блока 5

### Что мы изучили:

✅ Массивы: объявление, инициализация, доступ к элементам  
✅ Перебор массивов в циклах  
✅ Массивы как параметры функций  
✅ Многомерные массивы (2D, 3D)  
✅ Строки как массивы символов  
✅ Нулевой символ '\0'  
✅ Функции `<string.h>`: `strlen`, `strcpy`, `strcat`, `strcmp`, `strchr`, `strstr`  
✅ Преобразование строк: `atoi`, `atof`, `sprintf`  
✅ Практические примеры: подсчёт слов, реверс, парсинг  

### Следующие шаги:

Переходите к `05-arrays-strings-practice.md` для выполнения практических заданий!

---

## Полезные ресурсы

- `<string.h>` — стандартная библиотека для работы со строками
- `<ctype.h>` — функции для работы с символами (`isalpha`, `isdigit`, `tolower` и др.)
- Безопасность: всегда проверяйте размеры буферов!

---

## Типичные ошибки

1. **Выход за границы массива**
   ```c
   int arr[5];
   arr[10] = 5;  // ⚠️ Неопределённое поведение!
   ```

2. **Забыли '\0' в строке**
   ```c
   char str[5] = "Hello";  // ❌ Не хватает места для '\0'
   char str2[6] = "Hello"; // ✅ Правильно
   ```

3. **Переполнение буфера**
   ```c
   char dest[5];
   strcpy(dest, "Hello, World!");  // ❌ Переполнение!
   strncpy(dest, "Hello, World!", sizeof(dest) - 1);  // ✅ Безопасно
   dest[sizeof(dest) - 1] = '\0';
   ```

4. **Сравнение строк через ==**
   ```c
   if (str1 == str2) { }  // ❌ Сравнивает указатели, не содержимое!
   if (strcmp(str1, str2) == 0) { }  // ✅ Правильно
   ```

5. **Забыли передать размер массива в функцию**
   ```c
   void function(int arr[]) { }  // ❌ Нет размера
   void function(int arr[], int size) { }  // ✅ Правильно
   ```

