# Блок 15: Системное программирование (часть 1)

## Цель

Взаимодействовать с операционной системой: работать с аргументами командной строки, переменными окружения, обрабатывать ошибки и сигналы.

---

## 1. Аргументы командной строки

### argc и argv

```c
#include <stdio.h>

int main(int argc, char* argv[]) {
    printf("Number of arguments: %d\n", argc);
    
    for (int i = 0; i < argc; i++) {
        printf("argv[%d]: %s\n", i, argv[i]);
    }
    
    return 0;
}
```

**Пример использования:**
```bash
./program arg1 arg2 arg3
# argc = 4
# argv[0] = "./program"
# argv[1] = "arg1"
# argv[2] = "arg2"
# argv[3] = "arg3"
```

### Пример: Простой калькулятор

```c
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char* argv[]) {
    if (argc != 4) {
        fprintf(stderr, "Usage: %s <num1> <operator> <num2>\n", argv[0]);
        return 1;
    }
    
    double num1 = atof(argv[1]);
    char op = argv[2][0];
    double num2 = atof(argv[3]);
    double result = 0;
    
    switch (op) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            if (num2 == 0) {
                fprintf(stderr, "Error: Division by zero\n");
                return 1;
            }
            result = num1 / num2;
            break;
        default:
            fprintf(stderr, "Error: Unknown operator\n");
            return 1;
    }
    
    printf("%.2f %c %.2f = %.2f\n", num1, op, num2, result);
    return 0;
}
```

### envp: Переменные окружения

```c
#include <stdio.h>

int main(int argc, char* argv[], char* envp[]) {
    printf("Environment variables:\n");
    
    for (int i = 0; envp[i] != NULL; i++) {
        printf("%s\n", envp[i]);
    }
    
    return 0;
}
```

---

## 2. Переменные окружения

### getenv() — получение переменной

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    char* path = getenv("PATH");
    if (path != NULL) {
        printf("PATH: %s\n", path);
    } else {
        printf("PATH not set\n");
    }
    
    char* home = getenv("HOME");
    if (home != NULL) {
        printf("HOME: %s\n", home);
    }
    
    return 0;
}
```

### setenv() и unsetenv() — установка и удаление

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    // Установка переменной окружения
    if (setenv("MY_VAR", "my_value", 1) == 0) {
        printf("MY_VAR set successfully\n");
    }
    
    // Получение
    char* value = getenv("MY_VAR");
    if (value != NULL) {
        printf("MY_VAR = %s\n", value);
    }
    
    // Удаление
    unsetenv("MY_VAR");
    
    value = getenv("MY_VAR");
    if (value == NULL) {
        printf("MY_VAR is unset\n");
    }
    
    return 0;
}
```

**Примечание:** `setenv()` и `unsetenv()` доступны в POSIX системах (Linux, macOS). На Windows используйте `_putenv()` и `_getenv()`.

---

## 3. Выход из программы

### exit() и коды возврата

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int result = some_operation();
    
    if (result < 0) {
        fprintf(stderr, "Error occurred\n");
        exit(EXIT_FAILURE);  // Код ошибки
    }
    
    printf("Success\n");
    exit(EXIT_SUCCESS);  // Успешное завершение
    // или просто: return 0;
}
```

**Коды возврата:**
- `EXIT_SUCCESS` (обычно 0) — успешное завершение
- `EXIT_FAILURE` (обычно 1) — ошибка
- Можно использовать любые числа: `exit(2)`, `exit(3)`, и т.д.

**Разница между `return` и `exit()`:**
- `return` — завершает только текущую функцию
- `exit()` — завершает всю программу немедленно

---

## 4. Обработка ошибок

### errno и perror()

```c
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>

int main(void) {
    FILE* file = fopen("nonexistent.txt", "r");
    
    if (file == NULL) {
        // errno автоматически устанавливается при ошибке
        perror("Error opening file");
        // Выведет: Error opening file: No such file or directory
        
        // Или вручную:
        fprintf(stderr, "Error: %s\n", strerror(errno));
    }
    
    return 0;
}
```

### strerror() — текстовое описание ошибки

```c
#include <stdio.h>
#include <errno.h>
#include <string.h>

int main(void) {
    FILE* file = fopen("nonexistent.txt", "r");
    if (file == NULL) {
        printf("Error code: %d\n", errno);
        printf("Error message: %s\n", strerror(errno));
    }
    return 0;
}
```

### Проверка возвращаемых значений

```c
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

int main(void) {
    // Всегда проверяйте возвращаемые значения!
    
    FILE* file = fopen("data.txt", "r");
    if (file == NULL) {
        perror("fopen");
        return 1;
    }
    
    int* ptr = malloc(sizeof(int) * 100);
    if (ptr == NULL) {
        perror("malloc");
        fclose(file);
        return 1;
    }
    
    // Использование...
    
    free(ptr);
    fclose(file);
    return 0;
}
```

---

## 5. Обработка сигналов

### signal() — установка обработчика

```c
#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <unistd.h>

void signal_handler(int sig) {
    printf("\nReceived signal %d\n", sig);
    printf("Exiting gracefully...\n");
    exit(0);
}

int main(void) {
    // Установка обработчика для SIGINT (Ctrl+C)
    signal(SIGINT, signal_handler);
    
    printf("Press Ctrl+C to test signal handling\n");
    printf("PID: %d\n", getpid());
    
    // Бесконечный цикл
    while (1) {
        printf("Running...\n");
        sleep(1);
    }
    
    return 0;
}
```

### Основные сигналы

```c
SIGINT   // Прерывание (Ctrl+C)
SIGTERM  // Завершение процесса
SIGSEGV  // Нарушение сегментации (segmentation fault)
SIGKILL  // Немедленное завершение (нельзя перехватить)
SIGALRM  // Будильник (alarm)
```

### Пример: Обработка SIGSEGV

```c
#include <stdio.h>
#include <signal.h>
#include <stdlib.h>

void segfault_handler(int sig) {
    fprintf(stderr, "Segmentation fault occurred!\n");
    fprintf(stderr, "Signal: %d\n", sig);
    exit(1);
}

int main(void) {
    signal(SIGSEGV, segfault_handler);
    
    int* ptr = NULL;
    *ptr = 10;  // Вызовет SIGSEGV, но будет обработан
    
    return 0;
}
```

### Игнорирование сигналов

```c
#include <stdio.h>
#include <signal.h>
#include <unistd.h>

int main(void) {
    // Игнорировать SIGINT
    signal(SIGINT, SIG_IGN);
    
    printf("SIGINT is now ignored. Press Ctrl+C (won't work)\n");
    sleep(5);
    
    // Вернуть обработку по умолчанию
    signal(SIGINT, SIG_DFL);
    printf("SIGINT restored. Press Ctrl+C to exit\n");
    sleep(5);
    
    return 0;
}
```

---

## 6. Практические примеры

### Пример 1: CLI утилита с аргументами

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void print_usage(const char* program_name) {
    printf("Usage: %s [OPTIONS] FILE\n", program_name);
    printf("Options:\n");
    printf("  -h, --help     Show this help message\n");
    printf("  -v, --version  Show version information\n");
    printf("  -n, --lines N  Show first N lines\n");
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        print_usage(argv[0]);
        return 1;
    }
    
    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "-h") == 0 || strcmp(argv[i], "--help") == 0) {
            print_usage(argv[0]);
            return 0;
        } else if (strcmp(argv[i], "-v") == 0 || strcmp(argv[i], "--version") == 0) {
            printf("Version 1.0.0\n");
            return 0;
        } else if (strcmp(argv[i], "-n") == 0 || strcmp(argv[i], "--lines") == 0) {
            if (i + 1 < argc) {
                int lines = atoi(argv[++i]);
                printf("Lines: %d\n", lines);
            } else {
                fprintf(stderr, "Error: -n requires a number\n");
                return 1;
            }
        } else {
            printf("Processing file: %s\n", argv[i]);
        }
    }
    
    return 0;
}
```

### Пример 2: Программа с обработкой ошибок

```c
#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>

int read_file(const char* filename) {
    FILE* file = fopen(filename, "r");
    if (file == NULL) {
        fprintf(stderr, "Error opening %s: %s\n", filename, strerror(errno));
        return -1;
    }
    
    char line[256];
    int line_count = 0;
    
    while (fgets(line, sizeof(line), file) != NULL) {
        line_count++;
        printf("%d: %s", line_count, line);
    }
    
    if (ferror(file)) {
        fprintf(stderr, "Error reading file: %s\n", strerror(errno));
        fclose(file);
        return -1;
    }
    
    fclose(file);
    return line_count;
}

int main(int argc, char* argv[]) {
    if (argc != 2) {
        fprintf(stderr, "Usage: %s <filename>\n", argv[0]);
        return EXIT_FAILURE;
    }
    
    int lines = read_file(argv[1]);
    if (lines < 0) {
        return EXIT_FAILURE;
    }
    
    printf("\nTotal lines: %d\n", lines);
    return EXIT_SUCCESS;
}
```

### Пример 3: Обработка Ctrl+C

```c
#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <unistd.h>
#include <stdbool.h>

static volatile bool running = true;

void signal_handler(int sig) {
    if (sig == SIGINT) {
        printf("\nReceived SIGINT. Shutting down gracefully...\n");
        running = false;
    }
}

int main(void) {
    signal(SIGINT, signal_handler);
    
    printf("Press Ctrl+C to stop\n");
    printf("PID: %d\n", getpid());
    
    int counter = 0;
    while (running) {
        printf("Counter: %d\n", counter++);
        sleep(1);
    }
    
    printf("Cleanup completed. Exiting.\n");
    return 0;
}
```

---

## Резюме Блока 15

### Что мы изучили:

✅ Аргументы командной строки: `argc`, `argv`, `envp`  
✅ Переменные окружения: `getenv()`, `setenv()`, `unsetenv()`  
✅ Выход из программы: `exit()`, `EXIT_SUCCESS`, `EXIT_FAILURE`  
✅ Обработка ошибок: `errno`, `perror()`, `strerror()`  
✅ Обработка сигналов: `signal()`, основные сигналы  
✅ Практические примеры: CLI утилиты, обработка ошибок  

### Следующие шаги:

Переходите к `16-system-programming-2.md` для изучения процессов, потоков и сокетов!

---

## Полезные ресурсы

- Всегда проверяйте возвращаемые значения системных функций
- Используйте `errno` и `perror()` для диагностики ошибок
- Обрабатывайте сигналы для корректного завершения программы
- Проверяйте аргументы командной строки перед использованием

---

## Типичные ошибки

1. **Не проверили argc перед доступом к argv**
   ```c
   printf("%s\n", argv[1]);  // ❌ Может быть NULL, если argc < 2
   ```

2. **Игнорирование возвращаемых значений**
   ```c
   fopen("file.txt", "r");  // ❌ Не проверили результат
   ```

3. **Неправильная обработка сигналов**
   ```c
   signal(SIGINT, handler);
   // Использование не-volatile переменных в обработчике
   ```

4. **Забыли установить errno перед вызовом perror()**
   ```c
   errno = 0;
   // Операция...
   if (error) {
       errno = EINVAL;  // ✅ Установить errno
       perror("Error");
   }
   ```

