# Блок 8: Структуры (Structs)

## Цель

Научиться создавать собственные составные типы данных с помощью структур. Структуры позволяют объединять несколько переменных разных типов в один объект.

---

## 1. Определение структур

### Базовый синтаксис

```c
struct имя_структуры {
    тип поле1;
    тип поле2;
    // ...
};
```

### Простая структура

```c
#include <stdio.h>

// Определение структуры Point
struct Point {
    int x;
    int y;
};

int main(void) {
    // Создание переменной типа struct Point
    struct Point p1;
    p1.x = 10;
    p1.y = 20;
    
    printf("Point: (%d, %d)\n", p1.x, p1.y);
    
    return 0;
}
```

### Инициализация при создании

```c
#include <stdio.h>

struct Point {
    int x;
    int y;
};

int main(void) {
    // Инициализация при объявлении
    struct Point p1 = {10, 20};
    struct Point p2 = {.x = 5, .y = 15};  // Именованная инициализация (C99)
    
    printf("p1: (%d, %d)\n", p1.x, p1.y);
    printf("p2: (%d, %d)\n", p2.x, p2.y);
    
    return 0;
}
```

---

## 2. Доступ к полям структуры

### Оператор `.` (точка)

Используется для доступа к полям структуры:

```c
#include <stdio.h>

struct Student {
    char name[50];
    int age;
    float gpa;
};

int main(void) {
    struct Student student;
    
    // Присваивание значений
    strcpy(student.name, "Ivan");
    student.age = 20;
    student.gpa = 4.5;
    
    // Чтение значений
    printf("Name: %s\n", student.name);
    printf("Age: %d\n", student.age);
    printf("GPA: %.2f\n", student.gpa);
    
    return 0;
}
```

---

## 3. Указатели на структуры

### Оператор `->` (стрелка)

Когда у нас есть указатель на структуру, используем `->` вместо `.`:

```c
#include <stdio.h>
#include <stdlib.h>

struct Point {
    int x;
    int y;
};

int main(void) {
    struct Point p = {10, 20};
    struct Point* ptr = &p;  // Указатель на структуру
    
    // Доступ через указатель
    printf("x: %d\n", (*ptr).x);  // Разыменование + точка
    printf("y: %d\n", ptr->y);     // Стрелка (более удобно)
    
    // Изменение через указатель
    ptr->x = 100;
    ptr->y = 200;
    
    printf("New point: (%d, %d)\n", p.x, p.y);
    
    return 0;
}
```

**Важно:**
- `(*ptr).x` и `ptr->x` — эквивалентны
- `ptr->x` — более читаемый и идиоматичный способ

---

## 4. Структуры как параметры функций

### Передача по значению

```c
#include <stdio.h>
#include <math.h>

struct Point {
    double x;
    double y;
};

// Функция принимает структуру по значению (копия)
double distance(struct Point p1, struct Point p2) {
    double dx = p2.x - p1.x;
    double dy = p2.y - p1.y;
    return sqrt(dx * dx + dy * dy);
}

int main(void) {
    struct Point p1 = {0.0, 0.0};
    struct Point p2 = {3.0, 4.0};
    
    double dist = distance(p1, p2);
    printf("Distance: %.2f\n", dist);  // 5.00
    
    return 0;
}
```

**⚠️ Передача по значению создаёт копию структуры!** Для больших структур это неэффективно.

### Передача по указателю (рекомендуется)

```c
#include <stdio.h>
#include <math.h>

struct Point {
    double x;
    double y;
};

// Функция принимает указатель (эффективнее)
double distance(const struct Point* p1, const struct Point* p2) {
    double dx = p2->x - p1->x;
    double dy = p2->y - p1->y;
    return sqrt(dx * dx + dy * dy);
}

// Функция, изменяющая структуру
void move_point(struct Point* p, double dx, double dy) {
    p->x += dx;
    p->y += dy;
}

int main(void) {
    struct Point p1 = {0.0, 0.0};
    struct Point p2 = {3.0, 4.0};
    
    double dist = distance(&p1, &p2);
    printf("Distance: %.2f\n", dist);
    
    move_point(&p1, 1.0, 1.0);
    printf("Moved p1: (%.1f, %.1f)\n", p1.x, p1.y);
    
    return 0;
}
```

**Преимущества передачи по указателю:**
- Не создаётся копия (экономия памяти)
- Можно изменять структуру
- Быстрее для больших структур

---

## 5. Вложенные структуры

Структуры могут содержать другие структуры:

```c
#include <stdio.h>

struct Date {
    int day;
    int month;
    int year;
};

struct Person {
    char name[50];
    struct Date birth_date;
    int age;
};

int main(void) {
    struct Person person = {
        .name = "Ivan",
        .birth_date = {15, 3, 2000},
        .age = 24
    };
    
    printf("Name: %s\n", person.name);
    printf("Birth date: %d/%d/%d\n", 
           person.birth_date.day,
           person.birth_date.month,
           person.birth_date.year);
    printf("Age: %d\n", person.age);
    
    return 0;
}
```

---

## 6. Массивы структур

```c
#include <stdio.h>

struct Student {
    char name[50];
    int age;
    float gpa;
};

int main(void) {
    // Массив из 3 студентов
    struct Student students[3] = {
        {"Alice", 20, 4.5},
        {"Bob", 21, 3.8},
        {"Charlie", 19, 4.2}
    };
    
    // Перебор массива
    for (int i = 0; i < 3; i++) {
        printf("Student %d: %s, age %d, GPA %.2f\n",
               i + 1, students[i].name, students[i].age, students[i].gpa);
    }
    
    return 0;
}
```

---

## 7. typedef: создание псевдонимов

`typedef` позволяет создать короткое имя для типа:

```c
#include <stdio.h>

// Без typedef
struct Point {
    int x;
    int y;
};

// С typedef
typedef struct {
    int x;
    int y;
} Point;

// Теперь можно использовать просто Point вместо struct Point
int main(void) {
    Point p1 = {10, 20};  // Вместо struct Point p1
    Point* ptr = &p1;
    
    printf("Point: (%d, %d)\n", p1.x, p1.y);
    
    return 0;
}
```

**Преимущества typedef:**
- Более короткий синтаксис
- Удобнее для указателей: `Point*` вместо `struct Point*`

### Пример с именованной структурой

```c
typedef struct Point {
    int x;
    int y;
} Point;

// Теперь можно использовать и struct Point, и Point
```

---

## 8. Размер структуры и выравнивание

### sizeof структуры

```c
#include <stdio.h>

struct Example1 {
    char a;   // 1 байт
    int b;    // 4 байта
    char c;   // 1 байт
};

struct Example2 {
    int b;    // 4 байта
    char a;   // 1 байт
    char c;   // 1 байт
};

int main(void) {
    printf("Size of Example1: %zu bytes\n", sizeof(struct Example1));
    printf("Size of Example2: %zu bytes\n", sizeof(struct Example2));
    
    return 0;
}
```

**Вывод (на 64-битной системе):**
```
Size of Example1: 12 bytes  (не 6!)
Size of Example2: 8 bytes
```

**Почему?** Компилятор выравнивает данные для эффективности доступа к памяти. Это называется **alignment** (выравнивание).

### Выравнивание (Alignment)

Компилятор добавляет "пустые" байты (padding) для выравнивания:

```c
struct Example1 {
    char a;      // 1 байт
    // 3 байта padding (пустые)
    int b;       // 4 байта (должен быть на границе 4 байт)
    char c;      // 1 байт
    // 3 байта padding
};  // Итого: 12 байт

struct Example2 {
    int b;       // 4 байта
    char a;      // 1 байт
    char c;      // 1 байт
    // 2 байта padding
};  // Итого: 8 байт
```

**Совет:** Группируйте поля по размеру для минимизации padding.

---

## 9. Практические примеры

### Пример 1: Структура Point с функциями

```c
#include <stdio.h>
#include <math.h>

typedef struct {
    double x;
    double y;
} Point;

double distance(const Point* p1, const Point* p2) {
    double dx = p2->x - p1->x;
    double dy = p2->y - p1->y;
    return sqrt(dx * dx + dy * dy);
}

void print_point(const Point* p) {
    printf("(%.2f, %.2f)", p->x, p->y);
}

int main(void) {
    Point p1 = {0.0, 0.0};
    Point p2 = {3.0, 4.0};
    
    printf("Distance between ");
    print_point(&p1);
    printf(" and ");
    print_point(&p2);
    printf(": %.2f\n", distance(&p1, &p2));
    
    return 0;
}
```

### Пример 2: Структура Student

```c
#include <stdio.h>
#include <string.h>

typedef struct {
    char name[50];
    int age;
    float grades[5];
    float average;
} Student;

void calculate_average(Student* student) {
    float sum = 0;
    for (int i = 0; i < 5; i++) {
        sum += student->grades[i];
    }
    student->average = sum / 5.0;
}

void print_student(const Student* student) {
    printf("Name: %s\n", student->name);
    printf("Age: %d\n", student->age);
    printf("Grades: ");
    for (int i = 0; i < 5; i++) {
        printf("%.1f ", student->grades[i]);
    }
    printf("\nAverage: %.2f\n", student->average);
}

int main(void) {
    Student student;
    strcpy(student.name, "Ivan");
    student.age = 20;
    student.grades[0] = 4.5;
    student.grades[1] = 4.0;
    student.grades[2] = 5.0;
    student.grades[3] = 4.5;
    student.grades[4] = 4.0;
    
    calculate_average(&student);
    print_student(&student);
    
    return 0;
}
```

### Пример 3: Структура для даты и времени

```c
#include <stdio.h>

typedef struct {
    int day;
    int month;
    int year;
} Date;

typedef struct {
    int hour;
    int minute;
    int second;
} Time;

typedef struct {
    Date date;
    Time time;
} DateTime;

void print_datetime(const DateTime* dt) {
    printf("%02d/%02d/%04d %02d:%02d:%02d\n",
           dt->date.day, dt->date.month, dt->date.year,
           dt->time.hour, dt->time.minute, dt->time.second);
}

int main(void) {
    DateTime dt = {
        .date = {15, 3, 2024},
        .time = {14, 30, 0}
    };
    
    print_datetime(&dt);
    
    return 0;
}
```

---

## 10. Указатели на структуры в структурах (связные списки — введение)

Структуры могут содержать указатели на структуры того же типа:

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;  // Указатель на следующий узел
} Node;

int main(void) {
    // Создание узлов
    Node* node1 = malloc(sizeof(Node));
    Node* node2 = malloc(sizeof(Node));
    Node* node3 = malloc(sizeof(Node));
    
    // Заполнение данных
    node1->data = 10;
    node1->next = node2;
    
    node2->data = 20;
    node2->next = node3;
    
    node3->data = 30;
    node3->next = NULL;  // Конец списка
    
    // Перебор списка
    Node* current = node1;
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\n");
    
    // Освобождение памяти
    free(node1);
    free(node2);
    free(node3);
    
    return 0;
}
```

Это основа для связных списков (Linked Lists), которые будут подробно рассмотрены в следующем уроке.

---

## Резюме Блока 8

### Что мы изучили:

✅ Определение и создание структур  
✅ Доступ к полям: операторы `.` и `->`  
✅ Передача структур в функции (по значению и по указателю)  
✅ Вложенные структуры  
✅ Массивы структур  
✅ `typedef` для создания псевдонимов  
✅ Размер структуры и выравнивание памяти  
✅ Указатели на структуры в структурах (связные списки)  

### Следующие шаги:

Переходите к `09-data-structures.md` для изучения динамических структур данных!

---

## Полезные ресурсы

- Структуры — основа для создания сложных типов данных
- Используйте `typedef` для удобства
- Передавайте большие структуры по указателю
- Учитывайте выравнивание при оптимизации памяти

---

## Типичные ошибки

1. **Забыли `struct` при объявлении**
   ```c
   Point p;  // ❌ Ошибка, если не использован typedef
   struct Point p;  // ✅ Правильно
   ```

2. **Использование `.` вместо `->` с указателем**
   ```c
   struct Point* ptr = &p;
   ptr.x = 10;  // ❌ Ошибка
   ptr->x = 10;  // ✅ Правильно
   ```

3. **Передача большой структуры по значению**
   ```c
   void func(struct LargeStruct s);  // ❌ Создаёт копию
   void func(struct LargeStruct* s);  // ✅ Эффективнее
   ```

4. **Забыли инициализировать поля**
   ```c
   struct Point p;
   printf("%d\n", p.x);  // ❌ Неинициализированное значение
   struct Point p = {0};  // ✅ Инициализация нулями
   ```

