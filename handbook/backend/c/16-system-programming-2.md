# Блок 16: Системное программирование (часть 2)

## Цель

Углубиться в системное программирование: работать с процессами, потоками, сокетами и межпроцессным взаимодействием.

**Примечание:** Этот блок требует знаний POSIX API (Linux, macOS). На Windows используются другие функции.

---

## 1. Процессы

### fork() — создание процесса

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    printf("Parent process (PID: %d)\n", getpid());
    
    pid_t pid = fork();
    
    if (pid == 0) {
        // Дочерний процесс
        printf("Child process (PID: %d, Parent PID: %d)\n", 
               getpid(), getppid());
        sleep(2);
        printf("Child exiting\n");
    } else if (pid > 0) {
        // Родительский процесс
        printf("Parent: Created child with PID: %d\n", pid);
        wait(NULL);  // Ждём завершения дочернего процесса
        printf("Parent: Child finished\n");
    } else {
        // Ошибка
        perror("fork");
        return 1;
    }
    
    return 0;
}
```

### exec() — замена образа процесса

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    
    if (pid == 0) {
        // Дочерний процесс запускает другую программу
        execl("/bin/ls", "ls", "-l", NULL);
        perror("execl");  // Выполнится только при ошибке
        return 1;
    } else if (pid > 0) {
        wait(NULL);
        printf("Parent: Child finished\n");
    }
    
    return 0;
}
```

### wait() и waitpid() — ожидание завершения

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
#include <stdlib.h>

int main(void) {
    pid_t pid = fork();
    
    if (pid == 0) {
        // Дочерний процесс
        printf("Child: PID = %d\n", getpid());
        exit(42);  // Завершаем с кодом 42
    } else if (pid > 0) {
        // Родительский процесс
        int status;
        waitpid(pid, &status, 0);
        
        if (WIFEXITED(status)) {
            printf("Child exited with code: %d\n", WEXITSTATUS(status));
        }
    }
    
    return 0;
}
```

---

## 2. Потоки (Threads) — pthread

### Создание потока

```c
#include <stdio.h>
#include <pthread.h>
#include <unistd.h>

void* thread_function(void* arg) {
    int thread_num = *(int*)arg;
    printf("Thread %d: Starting\n", thread_num);
    
    for (int i = 0; i < 5; i++) {
        printf("Thread %d: %d\n", thread_num, i);
        sleep(1);
    }
    
    printf("Thread %d: Finished\n", thread_num);
    return NULL;
}

int main(void) {
    pthread_t thread1, thread2;
    int num1 = 1, num2 = 2;
    
    pthread_create(&thread1, NULL, thread_function, &num1);
    pthread_create(&thread2, NULL, thread_function, &num2);
    
    pthread_join(thread1, NULL);
    pthread_join(thread2, NULL);
    
    printf("All threads finished\n");
    return 0;
}
```

**Компиляция:**
```bash
gcc program.c -pthread -o program
```

### Мьютексы (Mutexes) — синхронизация

```c
#include <stdio.h>
#include <pthread.h>

int counter = 0;
pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;

void* increment(void* arg) {
    for (int i = 0; i < 100000; i++) {
        pthread_mutex_lock(&mutex);
        counter++;
        pthread_mutex_unlock(&mutex);
    }
    return NULL;
}

int main(void) {
    pthread_t thread1, thread2;
    
    pthread_create(&thread1, NULL, increment, NULL);
    pthread_create(&thread2, NULL, increment, NULL);
    
    pthread_join(thread1, NULL);
    pthread_join(thread2, NULL);
    
    printf("Counter: %d (expected: 200000)\n", counter);
    
    pthread_mutex_destroy(&mutex);
    return 0;
}
```

---

## 3. Сокеты (Sockets) — введение

### TCP Сервер

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define PORT 8080
#define BUFFER_SIZE 1024

int main(void) {
    int server_fd, client_fd;
    struct sockaddr_in address;
    int addrlen = sizeof(address);
    char buffer[BUFFER_SIZE] = {0};
    
    // Создание сокета
    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        perror("socket failed");
        exit(EXIT_FAILURE);
    }
    
    // Настройка адреса
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);
    
    // Привязка сокета
    if (bind(server_fd, (struct sockaddr*)&address, sizeof(address)) < 0) {
        perror("bind failed");
        exit(EXIT_FAILURE);
    }
    
    // Прослушивание
    if (listen(server_fd, 3) < 0) {
        perror("listen");
        exit(EXIT_FAILURE);
    }
    
    printf("Server listening on port %d\n", PORT);
    
    // Принятие соединения
    if ((client_fd = accept(server_fd, (struct sockaddr*)&address, 
                            (socklen_t*)&addrlen)) < 0) {
        perror("accept");
        exit(EXIT_FAILURE);
    }
    
    // Чтение данных
    read(client_fd, buffer, BUFFER_SIZE);
    printf("Received: %s\n", buffer);
    
    // Отправка ответа
    const char* response = "Hello from server";
    send(client_fd, response, strlen(response), 0);
    
    close(client_fd);
    close(server_fd);
    
    return 0;
}
```

### TCP Клиент

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>

#define PORT 8080
#define BUFFER_SIZE 1024

int main(void) {
    int sock;
    struct sockaddr_in serv_addr;
    char buffer[BUFFER_SIZE] = {0};
    
    // Создание сокета
    if ((sock = socket(AF_INET, SOCK_STREAM, 0)) < 0) {
        perror("socket creation error");
        return 1;
    }
    
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(PORT);
    
    // Преобразование IP адреса
    if (inet_pton(AF_INET, "127.0.0.1", &serv_addr.sin_addr) <= 0) {
        perror("Invalid address");
        return 1;
    }
    
    // Подключение к серверу
    if (connect(sock, (struct sockaddr*)&serv_addr, sizeof(serv_addr)) < 0) {
        perror("Connection failed");
        return 1;
    }
    
    // Отправка сообщения
    const char* message = "Hello from client";
    send(sock, message, strlen(message), 0);
    printf("Message sent\n");
    
    // Чтение ответа
    read(sock, buffer, BUFFER_SIZE);
    printf("Server response: %s\n", buffer);
    
    close(sock);
    return 0;
}
```

---

## 4. Пайпы (Pipes)

### Именованные пайпы (FIFO)

**Создание FIFO:**
```bash
mkfifo mypipe
```

**Программа 1 (запись):**
```c
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <string.h>

int main(void) {
    int fd = open("mypipe", O_WRONLY);
    if (fd < 0) {
        perror("open");
        return 1;
    }
    
    const char* message = "Hello from pipe!";
    write(fd, message, strlen(message));
    
    close(fd);
    return 0;
}
```

**Программа 2 (чтение):**
```c
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("mypipe", O_RDONLY);
    if (fd < 0) {
        perror("open");
        return 1;
    }
    
    char buffer[100];
    read(fd, buffer, sizeof(buffer));
    printf("Received: %s\n", buffer);
    
    close(fd);
    return 0;
}
```

### Анонимные пайпы

```c
#include <stdio.h>
#include <unistd.h>
#include <string.h>

int main(void) {
    int pipefd[2];
    char buffer[100];
    
    if (pipe(pipefd) == -1) {
        perror("pipe");
        return 1;
    }
    
    pid_t pid = fork();
    
    if (pid == 0) {
        // Дочерний процесс (чтение)
        close(pipefd[1]);  // Закрываем запись
        read(pipefd[0], buffer, sizeof(buffer));
        printf("Child received: %s\n", buffer);
        close(pipefd[0]);
    } else {
        // Родительский процесс (запись)
        close(pipefd[0]);  // Закрываем чтение
        const char* message = "Hello from parent!";
        write(pipefd[1], message, strlen(message));
        close(pipefd[1]);
        wait(NULL);
    }
    
    return 0;
}
```

---

## 5. Практические примеры

### Пример 1: Многопоточный сервер (базовый)

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <pthread.h>
#include <sys/socket.h>
#include <netinet/in.h>

#define PORT 8080
#define MAX_CLIENTS 10

void* handle_client(void* arg) {
    int client_fd = *(int*)arg;
    char buffer[1024];
    
    read(client_fd, buffer, sizeof(buffer));
    printf("Client said: %s\n", buffer);
    
    const char* response = "Message received";
    send(client_fd, response, strlen(response), 0);
    
    close(client_fd);
    return NULL;
}

int main(void) {
    int server_fd, client_fd;
    struct sockaddr_in address;
    int addrlen = sizeof(address);
    
    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);
    
    bind(server_fd, (struct sockaddr*)&address, sizeof(address));
    listen(server_fd, MAX_CLIENTS);
    
    printf("Server listening on port %d\n", PORT);
    
    while (1) {
        client_fd = accept(server_fd, (struct sockaddr*)&address, 
                          (socklen_t*)&addrlen);
        
        pthread_t thread;
        pthread_create(&thread, NULL, handle_client, &client_fd);
        pthread_detach(thread);
    }
    
    close(server_fd);
    return 0;
}
```

---

## Резюме Блока 16

### Что мы изучили:

✅ Процессы: `fork()`, `exec()`, `wait()`, `waitpid()`  
✅ Потоки: `pthread_create()`, `pthread_join()`, мьютексы  
✅ Сокеты: TCP сервер и клиент  
✅ Пайпы: именованные (FIFO) и анонимные  
✅ Межпроцессное взаимодействие  

### Следующие шаги:

Переходите к `17-algorithms-sorting.md` для изучения алгоритмов и сортировки!

---

## Полезные ресурсы

- POSIX API доступен на Linux и macOS
- Используйте мьютексы для синхронизации потоков
- Всегда проверяйте возвращаемые значения системных вызовов
- Закрывайте файловые дескрипторы после использования

---

## Типичные ошибки

1. **Забыли закрыть файловый дескриптор**
   ```c
   int fd = open("file.txt", O_RDONLY);
   // Использование...
   // ❌ Забыли close(fd);
   ```

2. **Race condition в потоках**
   ```c
   int counter = 0;
   // Множество потоков изменяют counter без синхронизации
   ```

3. **Неправильная обработка ошибок fork()**
   ```c
   pid_t pid = fork();
   if (pid == -1) {
       // ❌ Не обработали ошибку
   }
   ```

