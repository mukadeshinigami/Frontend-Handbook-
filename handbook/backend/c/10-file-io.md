# Блок 10: Работа с файлами

## Цель

Научиться читать и писать данные в файлы. Файловый ввод-вывод необходим для сохранения данных между запусками программы и работы с внешними данными.

---

## 1. Файловые потоки

### FILE* и fopen()

В C работа с файлами происходит через указатель на структуру `FILE*`:

```c
#include <stdio.h>

int main(void) {
    FILE* file = fopen("example.txt", "r");  // Открыть для чтения
    if (file == NULL) {
        perror("Error opening file");
        return 1;
    }
    
    // Работа с файлом...
    
    fclose(file);  // Закрыть файл
    return 0;
}
```

### Режимы открытия файла

```c
"r"   // Чтение (read) - файл должен существовать
"w"   // Запись (write) - создаёт файл или перезаписывает существующий
"a"   // Добавление (append) - добавляет в конец файла
"r+"  // Чтение и запись - файл должен существовать
"w+"  // Чтение и запись - создаёт или перезаписывает файл
"a+"  // Чтение и добавление - добавляет в конец

// Для бинарных файлов добавляем 'b':
"rb"  // Бинарное чтение
"wb"  // Бинарная запись
"ab"  // Бинарное добавление
```

---

## 2. Текстовый ввод-вывод

### fprintf() и fscanf()

Аналоги `printf()` и `scanf()`, но для файлов:

```c
#include <stdio.h>

int main(void) {
    FILE* file = fopen("data.txt", "w");
    if (file == NULL) {
        perror("Error opening file");
        return 1;
    }
    
    // Запись в файл
    fprintf(file, "Hello, World!\n");
    fprintf(file, "Number: %d\n", 42);
    fprintf(file, "Float: %.2f\n", 3.14);
    
    fclose(file);
    
    // Чтение из файла
    file = fopen("data.txt", "r");
    if (file == NULL) {
        perror("Error opening file");
        return 1;
    }
    
    char buffer[100];
    int number;
    float value;
    
    fscanf(file, "%s", buffer);
    fscanf(file, "Number: %d\n", &number);
    fscanf(file, "Float: %f\n", &value);
    
    printf("Read: %s\n", buffer);
    printf("Number: %d\n", number);
    printf("Float: %.2f\n", value);
    
    fclose(file);
    return 0;
}
```

### fgets() и fputs()

Для построчного чтения и записи:

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    FILE* file = fopen("lines.txt", "w");
    if (file == NULL) {
        perror("Error opening file");
        return 1;
    }
    
    // Запись строк
    fputs("First line\n", file);
    fputs("Second line\n", file);
    fputs("Third line\n", file);
    
    fclose(file);
    
    // Чтение построчно
    file = fopen("lines.txt", "r");
    if (file == NULL) {
        perror("Error opening file");
        return 1;
    }
    
    char line[100];
    while (fgets(line, sizeof(line), file) != NULL) {
        // Удаляем символ новой строки, если есть
        line[strcspn(line, "\n")] = '\0';
        printf("Line: %s\n", line);
    }
    
    fclose(file);
    return 0;
}
```

**Важно:**
- `fgets()` читает до `\n` или до конца буфера
- `fgets()` включает `\n` в строку (если помещается)
- `fputs()` не добавляет `\n` автоматически

---

## 3. Бинарный ввод-вывод

### fread() и fwrite()

Для работы с бинарными данными (структуры, массивы):

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int id;
    char name[50];
    float salary;
} Employee;

int main(void) {
    // Запись структуры в бинарный файл
    Employee emp = {1, "Ivan", 50000.0};
    
    FILE* file = fopen("employee.bin", "wb");
    if (file == NULL) {
        perror("Error opening file");
        return 1;
    }
    
    fwrite(&emp, sizeof(Employee), 1, file);
    fclose(file);
    
    // Чтение структуры из бинарного файла
    Employee emp_read;
    
    file = fopen("employee.bin", "rb");
    if (file == NULL) {
        perror("Error opening file");
        return 1;
    }
    
    fread(&emp_read, sizeof(Employee), 1, file);
    fclose(file);
    
    printf("ID: %d\n", emp_read.id);
    printf("Name: %s\n", emp_read.name);
    printf("Salary: %.2f\n", emp_read.salary);
    
    return 0;
}
```

### Запись массива структур

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int x;
    int y;
} Point;

int main(void) {
    Point points[] = {{1, 2}, {3, 4}, {5, 6}};
    int count = 3;
    
    // Запись массива
    FILE* file = fopen("points.bin", "wb");
    if (file == NULL) {
        perror("Error opening file");
        return 1;
    }
    
    fwrite(&count, sizeof(int), 1, file);  // Сначала записываем количество
    fwrite(points, sizeof(Point), count, file);
    fclose(file);
    
    // Чтение массива
    file = fopen("points.bin", "rb");
    if (file == NULL) {
        perror("Error opening file");
        return 1;
    }
    
    int read_count;
    fread(&read_count, sizeof(int), 1, file);
    
    Point* read_points = malloc(sizeof(Point) * read_count);
    fread(read_points, sizeof(Point), read_count, file);
    fclose(file);
    
    for (int i = 0; i < read_count; i++) {
        printf("Point %d: (%d, %d)\n", i, read_points[i].x, read_points[i].y);
    }
    
    free(read_points);
    return 0;
}
```

---

## 4. Позиционирование в файле

### fseek(), ftell(), rewind()

```c
#include <stdio.h>

int main(void) {
    FILE* file = fopen("data.txt", "w+");
    if (file == NULL) {
        perror("Error opening file");
        return 1;
    }
    
    fprintf(file, "Hello, World!");
    
    // Получить текущую позицию
    long position = ftell(file);
    printf("Current position: %ld\n", position);
    
    // Переместиться в начало
    rewind(file);
    // или
    fseek(file, 0, SEEK_SET);
    
    // Переместиться на 5 байт от начала
    fseek(file, 5, SEEK_SET);
    
    // Переместиться на 3 байта вперёд от текущей позиции
    fseek(file, 3, SEEK_CUR);
    
    // Переместиться на 2 байта назад от конца
    fseek(file, -2, SEEK_END);
    
    fclose(file);
    return 0;
}
```

**Константы для fseek():**
- `SEEK_SET` — от начала файла
- `SEEK_CUR` — от текущей позиции
- `SEEK_END` — от конца файла

---

## 5. Проверка ошибок

### feof() и ferror()

```c
#include <stdio.h>

int main(void) {
    FILE* file = fopen("data.txt", "r");
    if (file == NULL) {
        perror("Error opening file");
        return 1;
    }
    
    char buffer[100];
    while (fgets(buffer, sizeof(buffer), file) != NULL) {
        printf("%s", buffer);
    }
    
    // Проверка, достигли ли мы конца файла
    if (feof(file)) {
        printf("Reached end of file\n");
    }
    
    // Проверка на ошибку
    if (ferror(file)) {
        perror("Error reading file");
    }
    
    fclose(file);
    return 0;
}
```

---

## 6. Стандартные потоки

### stdin, stdout, stderr

```c
#include <stdio.h>

int main(void) {
    // stdin - стандартный ввод (клавиатура)
    char name[50];
    printf("Enter your name: ");
    fgets(name, sizeof(name), stdin);
    
    // stdout - стандартный вывод (экран)
    fprintf(stdout, "Hello, %s", name);
    // Эквивалентно: printf("Hello, %s", name);
    
    // stderr - стандартный поток ошибок
    fprintf(stderr, "This is an error message\n");
    
    return 0;
}
```

**Разница между stdout и stderr:**
- `stdout` — для обычного вывода (можно перенаправить)
- `stderr` — для ошибок (обычно не перенаправляется)

---

## 7. Практические примеры

### Пример 1: Копирование файла

```c
#include <stdio.h>

int copy_file(const char* src, const char* dest) {
    FILE* src_file = fopen(src, "rb");
    if (src_file == NULL) {
        perror("Error opening source file");
        return 1;
    }
    
    FILE* dest_file = fopen(dest, "wb");
    if (dest_file == NULL) {
        perror("Error opening destination file");
        fclose(src_file);
        return 1;
    }
    
    char buffer[4096];
    size_t bytes_read;
    
    while ((bytes_read = fread(buffer, 1, sizeof(buffer), src_file)) > 0) {
        fwrite(buffer, 1, bytes_read, dest_file);
    }
    
    fclose(src_file);
    fclose(dest_file);
    
    return 0;
}

int main(void) {
    if (copy_file("source.txt", "destination.txt") == 0) {
        printf("File copied successfully\n");
    }
    return 0;
}
```

### Пример 2: Подсчёт строк, слов и символов

```c
#include <stdio.h>
#include <ctype.h>

void count_file_stats(const char* filename) {
    FILE* file = fopen(filename, "r");
    if (file == NULL) {
        perror("Error opening file");
        return;
    }
    
    int lines = 0;
    int words = 0;
    int chars = 0;
    int in_word = 0;
    
    int ch;
    while ((ch = fgetc(file)) != EOF) {
        chars++;
        
        if (ch == '\n') {
            lines++;
        }
        
        if (isspace(ch)) {
            if (in_word) {
                words++;
                in_word = 0;
            }
        } else {
            in_word = 1;
        }
    }
    
    // Последнее слово, если файл не заканчивается пробелом
    if (in_word) {
        words++;
    }
    
    fclose(file);
    
    printf("Lines: %d\n", lines);
    printf("Words: %d\n", words);
    printf("Characters: %d\n", chars);
}

int main(void) {
    count_file_stats("text.txt");
    return 0;
}
```

### Пример 3: Чтение и запись структурированных данных

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    int id;
    char name[50];
    float price;
} Product;

void save_products(Product* products, int count, const char* filename) {
    FILE* file = fopen(filename, "wb");
    if (file == NULL) {
        perror("Error opening file");
        return;
    }
    
    fwrite(&count, sizeof(int), 1, file);
    fwrite(products, sizeof(Product), count, file);
    
    fclose(file);
}

Product* load_products(int* count, const char* filename) {
    FILE* file = fopen(filename, "rb");
    if (file == NULL) {
        perror("Error opening file");
        return NULL;
    }
    
    fread(count, sizeof(int), 1, file);
    
    Product* products = malloc(sizeof(Product) * (*count));
    fread(products, sizeof(Product), *count, file);
    
    fclose(file);
    return products;
}

int main(void) {
    // Создание и сохранение продуктов
    Product products[] = {
        {1, "Apple", 1.50},
        {2, "Banana", 2.00},
        {3, "Cherry", 3.50}
    };
    
    save_products(products, 3, "products.bin");
    
    // Загрузка продуктов
    int count;
    Product* loaded = load_products(&count, "products.bin");
    
    if (loaded != NULL) {
        for (int i = 0; i < count; i++) {
            printf("ID: %d, Name: %s, Price: %.2f\n",
                   loaded[i].id, loaded[i].name, loaded[i].price);
        }
        free(loaded);
    }
    
    return 0;
}
```

### Пример 4: Простой текстовый редактор (базовый)

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_LINE_LENGTH 1000

void append_line(const char* filename, const char* line) {
    FILE* file = fopen(filename, "a");
    if (file == NULL) {
        perror("Error opening file");
        return;
    }
    
    fprintf(file, "%s\n", line);
    fclose(file);
}

void display_file(const char* filename) {
    FILE* file = fopen(filename, "r");
    if (file == NULL) {
        perror("Error opening file");
        return;
    }
    
    char line[MAX_LINE_LENGTH];
    int line_num = 1;
    
    while (fgets(line, sizeof(line), file) != NULL) {
        printf("%d: %s", line_num++, line);
    }
    
    fclose(file);
}

int main(void) {
    const char* filename = "notes.txt";
    char input[MAX_LINE_LENGTH];
    
    printf("Simple text editor. Type 'quit' to exit, 'show' to display file.\n");
    
    while (1) {
        printf("> ");
        if (fgets(input, sizeof(input), stdin) == NULL) {
            break;
        }
        
        // Удаляем символ новой строки
        input[strcspn(input, "\n")] = '\0';
        
        if (strcmp(input, "quit") == 0) {
            break;
        } else if (strcmp(input, "show") == 0) {
            display_file(filename);
        } else {
            append_line(filename, input);
        }
    }
    
    return 0;
}
```

---

## Резюме Блока 10

### Что мы изучили:

✅ Файловые потоки (`FILE*`) и `fopen()`/`fclose()`  
✅ Текстовый ввод-вывод: `fprintf()`, `fscanf()`, `fgets()`, `fputs()`  
✅ Бинарный ввод-вывод: `fread()`, `fwrite()`  
✅ Позиционирование: `fseek()`, `ftell()`, `rewind()`  
✅ Проверка ошибок: `feof()`, `ferror()`, `perror()`  
✅ Стандартные потоки: `stdin`, `stdout`, `stderr`  
✅ Практические примеры: копирование файлов, подсчёт статистики  

### Следующие шаги:

Переходите к `11-preprocessor.md` для изучения директив препроцессора!

---

## Полезные ресурсы

- Всегда проверяйте результат `fopen()` на `NULL`
- Не забывайте закрывать файлы через `fclose()`
- Используйте бинарный режим для структур данных
- Проверяйте ошибки после операций с файлами

---

## Типичные ошибки

1. **Забыли закрыть файл**
   ```c
   FILE* file = fopen("data.txt", "r");
   // Работа с файлом...
   // ❌ Забыли fclose(file);
   ```

2. **Не проверили результат fopen()**
   ```c
   FILE* file = fopen("data.txt", "r");
   fscanf(file, "%d", &num);  // ❌ Может быть NULL!
   ```

3. **Использование текстового режима для бинарных данных**
   ```c
   FILE* file = fopen("data.bin", "w");  // ❌ Нужно "wb"
   fwrite(&data, sizeof(data), 1, file);
   ```

4. **Переполнение буфера при чтении**
   ```c
   char buffer[10];
   fgets(buffer, sizeof(buffer), file);  // ✅ Правильно
   fscanf(file, "%s", buffer);  // ❌ Может переполнить буфер
   ```

