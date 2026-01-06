# Блок 14: Строки (продвинутая работа)

## Цель

Эффективно работать со строками и текстом, реализовывать строковые функции и безопасно обрабатывать строковые данные.

---

## 1. Реализация строковых функций

### strlen() — длина строки

```c
#include <stdio.h>

size_t my_strlen(const char* str) {
    size_t len = 0;
    while (str[len] != '\0') {
        len++;
    }
    return len;
}

int main(void) {
    const char* text = "Hello";
    printf("Length: %zu\n", my_strlen(text));  // 5
    return 0;
}
```

### strcpy() — копирование строки

```c
#include <stdio.h>

char* my_strcpy(char* dest, const char* src) {
    int i = 0;
    while (src[i] != '\0') {
        dest[i] = src[i];
        i++;
    }
    dest[i] = '\0';
    return dest;
}

int main(void) {
    char dest[20];
    my_strcpy(dest, "Hello");
    printf("Copied: %s\n", dest);
    return 0;
}
```

### strcmp() — сравнение строк

```c
#include <stdio.h>

int my_strcmp(const char* str1, const char* str2) {
    int i = 0;
    while (str1[i] != '\0' && str2[i] != '\0') {
        if (str1[i] != str2[i]) {
            return str1[i] - str2[i];
        }
        i++;
    }
    return str1[i] - str2[i];
}

int main(void) {
    printf("%d\n", my_strcmp("abc", "abc"));  // 0
    printf("%d\n", my_strcmp("abc", "abd"));  // отрицательное
    printf("%d\n", my_strcmp("abd", "abc"));  // положительное
    return 0;
}
```

### strcat() — конкатенация строк

```c
#include <stdio.h>

char* my_strcat(char* dest, const char* src) {
    int dest_len = 0;
    while (dest[dest_len] != '\0') {
        dest_len++;
    }
    
    int i = 0;
    while (src[i] != '\0') {
        dest[dest_len + i] = src[i];
        i++;
    }
    dest[dest_len + i] = '\0';
    return dest;
}

int main(void) {
    char buffer[50] = "Hello";
    my_strcat(buffer, " World");
    printf("%s\n", buffer);  // "Hello World"
    return 0;
}
```

---

## 2. Безопасное копирование

### strncpy() vs snprintf()

**strncpy() — проблемы:**
```c
char dest[10];
strncpy(dest, "Hello World", sizeof(dest));
// ❌ Может не добавить завершающий нуль, если строка длиннее!
```

**Безопасная альтернатива — snprintf():**
```c
#include <stdio.h>

char dest[10];
snprintf(dest, sizeof(dest), "%s", "Hello World");
// ✅ Всегда добавляет завершающий нуль
```

**strncpy() — правильное использование:**
```c
char dest[10];
strncpy(dest, "Hello World", sizeof(dest) - 1);
dest[sizeof(dest) - 1] = '\0';  // ✅ Гарантируем завершающий нуль
```

### strncat() — безопасная конкатенация

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char buffer[20] = "Hello";
    strncat(buffer, " World!!!", sizeof(buffer) - strlen(buffer) - 1);
    printf("%s\n", buffer);
    return 0;
}
```

---

## 3. Поиск в строках

### strchr() — поиск символа

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    const char* str = "Hello World";
    char* found = strchr(str, 'o');
    
    if (found != NULL) {
        printf("Found at position: %ld\n", found - str);  // 4
        printf("Substring: %s\n", found);  // "o World"
    }
    
    return 0;
}
```

### strstr() — поиск подстроки

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    const char* str = "Hello World";
    char* found = strstr(str, "World");
    
    if (found != NULL) {
        printf("Found at position: %ld\n", found - str);  // 6
        printf("Substring: %s\n", found);  // "World"
    }
    
    return 0;
}
```

---

## 4. Преобразование строк

### atoi(), atof() — строки в числа

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    const char* str1 = "123";
    const char* str2 = "45.67";
    
    int num = atoi(str1);
    double dbl = atof(str2);
    
    printf("Integer: %d\n", num);
    printf("Double: %.2f\n", dbl);
    
    return 0;
}
```

**Более безопасные альтернативы (C99):**
```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    const char* str = "123";
    char* endptr;
    long num = strtol(str, &endptr, 10);
    
    if (*endptr != '\0') {
        printf("Invalid number\n");
    } else {
        printf("Number: %ld\n", num);
    }
    
    return 0;
}
```

### sprintf() и snprintf() — числа в строки

```c
#include <stdio.h>

int main(void) {
    char buffer[50];
    int num = 42;
    double dbl = 3.14;
    
    sprintf(buffer, "Number: %d, Double: %.2f", num, dbl);
    printf("%s\n", buffer);
    
    // Безопасная версия
    snprintf(buffer, sizeof(buffer), "Number: %d", num);
    printf("%s\n", buffer);
    
    return 0;
}
```

---

## 5. Токенизация (разделение строки)

### strtok() — разделение по разделителям

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char str[] = "apple,banana,cherry";
    char* token = strtok(str, ",");
    
    while (token != NULL) {
        printf("Token: %s\n", token);
        token = strtok(NULL, ",");
    }
    
    return 0;
}
```

**Важно:** `strtok()` изменяет исходную строку!

### Безопасная токенизация

```c
#include <stdio.h>
#include <string.h>

void safe_tokenize(const char* str, const char* delimiter) {
    char* copy = malloc(strlen(str) + 1);
    strcpy(copy, str);
    
    char* token = strtok(copy, delimiter);
    while (token != NULL) {
        printf("Token: %s\n", token);
        token = strtok(NULL, delimiter);
    }
    
    free(copy);
}

int main(void) {
    safe_tokenize("one,two,three", ",");
    return 0;
}
```

---

## 6. Строки переменной длины (динамические)

### Создание динамической строки

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char* create_string(const char* initial) {
    size_t len = strlen(initial);
    char* str = malloc(len + 1);
    if (str == NULL) {
        return NULL;
    }
    strcpy(str, initial);
    return str;
}

char* append_string(char* str, const char* append) {
    size_t old_len = strlen(str);
    size_t append_len = strlen(append);
    
    str = realloc(str, old_len + append_len + 1);
    if (str == NULL) {
        return NULL;
    }
    
    strcat(str, append);
    return str;
}

int main(void) {
    char* str = create_string("Hello");
    str = append_string(str, " World");
    printf("%s\n", str);
    
    free(str);
    return 0;
}
```

---

## 7. String Builder Pattern

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    char* data;
    size_t length;
    size_t capacity;
} StringBuilder;

StringBuilder* sb_create(void) {
    StringBuilder* sb = malloc(sizeof(StringBuilder));
    sb->capacity = 16;
    sb->data = malloc(sb->capacity);
    sb->data[0] = '\0';
    sb->length = 0;
    return sb;
}

void sb_append(StringBuilder* sb, const char* str) {
    size_t str_len = strlen(str);
    if (sb->length + str_len + 1 >= sb->capacity) {
        sb->capacity = (sb->capacity + str_len) * 2;
        sb->data = realloc(sb->data, sb->capacity);
    }
    strcat(sb->data, str);
    sb->length += str_len;
}

char* sb_to_string(StringBuilder* sb) {
    return sb->data;
}

void sb_free(StringBuilder* sb) {
    free(sb->data);
    free(sb);
}

int main(void) {
    StringBuilder* sb = sb_create();
    sb_append(sb, "Hello");
    sb_append(sb, " ");
    sb_append(sb, "World");
    
    printf("%s\n", sb_to_string(sb));
    sb_free(sb);
    
    return 0;
}
```

---

## 8. Практические примеры

### Пример 1: Парсер CSV

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void parse_csv(const char* line) {
    char* copy = malloc(strlen(line) + 1);
    strcpy(copy, line);
    
    char* token = strtok(copy, ",");
    int field = 0;
    
    while (token != NULL) {
        printf("Field %d: %s\n", field++, token);
        token = strtok(NULL, ",");
    }
    
    free(copy);
}

int main(void) {
    parse_csv("name,age,city");
    parse_csv("Ivan,25,Moscow");
    return 0;
}
```

### Пример 2: Форматирование текста

```c
#include <stdio.h>
#include <string.h>

void format_text(const char* text, int width) {
    int current_width = 0;
    
    for (int i = 0; text[i] != '\0'; i++) {
        if (text[i] == ' ' && current_width > width) {
            printf("\n");
            current_width = 0;
        } else {
            printf("%c", text[i]);
            current_width++;
        }
    }
    printf("\n");
}

int main(void) {
    format_text("This is a long text that needs to be formatted", 15);
    return 0;
}
```

---

## Резюме Блока 14

### Что мы изучили:

✅ Реализация строковых функций: `strlen()`, `strcpy()`, `strcmp()`, `strcat()`  
✅ Безопасное копирование: `strncpy()` vs `snprintf()`  
✅ Поиск в строках: `strchr()`, `strstr()`  
✅ Преобразование: `atoi()`, `atof()`, `sprintf()`, `snprintf()`  
✅ Токенизация: `strtok()`  
✅ Динамические строки  
✅ String Builder Pattern  

### Следующие шаги:

Переходите к `15-system-programming-1.md` для изучения системного программирования!

---

## Полезные ресурсы

- Всегда проверяйте границы буферов
- Используйте безопасные функции (`snprintf` вместо `sprintf`)
- Не забывайте завершающий нуль
- Освобождайте динамически выделенную память

---

## Типичные ошибки

1. **Переполнение буфера**
   ```c
   char buffer[10];
   strcpy(buffer, "This is too long!");  // ❌ Переполнение
   ```

2. **Забыли завершающий нуль**
   ```c
   char buffer[10];
   strncpy(buffer, "Hello", 5);
   // ❌ Нет завершающего нуля
   ```

3. **Использование strtok() с константной строкой**
   ```c
   const char* str = "a,b,c";
   strtok(str, ",");  // ❌ strtok изменяет строку!
   ```

4. **Утечка памяти при динамических строках**
   ```c
   char* str = malloc(100);
   str = realloc(str, 200);  // ❌ Если realloc вернёт NULL, старая память потеряна
   ```

