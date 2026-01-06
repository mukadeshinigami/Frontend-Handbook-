# Блок 9: Динамические структуры данных

## Цель

Реализовать базовые структуры данных: связные списки, стеки, очереди и бинарные деревья. Эти структуры данных являются основой для многих алгоритмов и приложений.

---

## 1. Связные списки (Linked Lists)

### Односвязный список

Каждый узел содержит данные и указатель на следующий узел:

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node* next;
} Node;

// Создание нового узла
Node* create_node(int data) {
    Node* node = malloc(sizeof(Node));
    if (node == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        exit(1);
    }
    node->data = data;
    node->next = NULL;
    return node;
}

// Добавление в начало списка
void push_front(Node** head, int data) {
    Node* new_node = create_node(data);
    new_node->next = *head;
    *head = new_node;
}

// Добавление в конец списка
void push_back(Node** head, int data) {
    Node* new_node = create_node(data);
    
    if (*head == NULL) {
        *head = new_node;
        return;
    }
    
    Node* current = *head;
    while (current->next != NULL) {
        current = current->next;
    }
    current->next = new_node;
}

// Печать списка
void print_list(Node* head) {
    Node* current = head;
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\n");
}

// Поиск элемента
Node* find(Node* head, int data) {
    Node* current = head;
    while (current != NULL) {
        if (current->data == data) {
            return current;
        }
        current = current->next;
    }
    return NULL;
}

// Удаление элемента
void delete_node(Node** head, int data) {
    if (*head == NULL) return;
    
    // Если удаляем первый элемент
    if ((*head)->data == data) {
        Node* temp = *head;
        *head = (*head)->next;
        free(temp);
        return;
    }
    
    // Ищем элемент для удаления
    Node* current = *head;
    while (current->next != NULL) {
        if (current->next->data == data) {
            Node* temp = current->next;
            current->next = current->next->next;
            free(temp);
            return;
        }
        current = current->next;
    }
}

// Освобождение всего списка
void free_list(Node* head) {
    Node* current = head;
    while (current != NULL) {
        Node* temp = current;
        current = current->next;
        free(temp);
    }
}

int main(void) {
    Node* head = NULL;
    
    push_back(&head, 10);
    push_back(&head, 20);
    push_back(&head, 30);
    push_front(&head, 5);
    
    print_list(head);  // 5 -> 10 -> 20 -> 30 -> NULL
    
    delete_node(&head, 20);
    print_list(head);  // 5 -> 10 -> 30 -> NULL
    
    free_list(head);
    return 0;
}
```

### Двусвязный список

Каждый узел содержит указатели на предыдущий и следующий узлы:

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct DNode {
    int data;
    struct DNode* prev;
    struct DNode* next;
} DNode;

DNode* create_dnode(int data) {
    DNode* node = malloc(sizeof(DNode));
    if (node == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        exit(1);
    }
    node->data = data;
    node->prev = NULL;
    node->next = NULL;
    return node;
}

// Добавление в конец
void append(DNode** head, int data) {
    DNode* new_node = create_dnode(data);
    
    if (*head == NULL) {
        *head = new_node;
        return;
    }
    
    DNode* current = *head;
    while (current->next != NULL) {
        current = current->next;
    }
    
    current->next = new_node;
    new_node->prev = current;
}

// Печать в прямом направлении
void print_forward(DNode* head) {
    DNode* current = head;
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->next;
    }
    printf("NULL\n");
}

// Печать в обратном направлении
void print_backward(DNode* head) {
    if (head == NULL) return;
    
    // Находим последний узел
    DNode* current = head;
    while (current->next != NULL) {
        current = current->next;
    }
    
    // Печатаем в обратном порядке
    while (current != NULL) {
        printf("%d -> ", current->data);
        current = current->prev;
    }
    printf("NULL\n");
}

int main(void) {
    DNode* head = NULL;
    
    append(&head, 10);
    append(&head, 20);
    append(&head, 30);
    
    print_forward(head);   // 10 -> 20 -> 30 -> NULL
    print_backward(head);  // 30 -> 20 -> 10 -> NULL
    
    return 0;
}
```

---

## 2. Стек (Stack) — LIFO

Стек работает по принципу "последний пришёл — первый ушёл" (LIFO).

### Реализация через массив

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_SIZE 100

typedef struct {
    int data[MAX_SIZE];
    int top;
} Stack;

void init_stack(Stack* s) {
    s->top = -1;
}

bool is_empty(Stack* s) {
    return s->top == -1;
}

bool is_full(Stack* s) {
    return s->top == MAX_SIZE - 1;
}

void push(Stack* s, int value) {
    if (is_full(s)) {
        fprintf(stderr, "Stack overflow\n");
        return;
    }
    s->data[++s->top] = value;
}

int pop(Stack* s) {
    if (is_empty(s)) {
        fprintf(stderr, "Stack underflow\n");
        return -1;
    }
    return s->data[s->top--];
}

int peek(Stack* s) {
    if (is_empty(s)) {
        fprintf(stderr, "Stack is empty\n");
        return -1;
    }
    return s->data[s->top];
}

int main(void) {
    Stack s;
    init_stack(&s);
    
    push(&s, 10);
    push(&s, 20);
    push(&s, 30);
    
    printf("Top: %d\n", peek(&s));  // 30
    
    while (!is_empty(&s)) {
        printf("%d ", pop(&s));  // 30 20 10
    }
    printf("\n");
    
    return 0;
}
```

### Реализация через связный список

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct StackNode {
    int data;
    struct StackNode* next;
} StackNode;

typedef struct {
    StackNode* top;
} Stack;

void init_stack(Stack* s) {
    s->top = NULL;
}

bool is_empty(Stack* s) {
    return s->top == NULL;
}

void push(Stack* s, int value) {
    StackNode* node = malloc(sizeof(StackNode));
    if (node == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        return;
    }
    node->data = value;
    node->next = s->top;
    s->top = node;
}

int pop(Stack* s) {
    if (is_empty(s)) {
        fprintf(stderr, "Stack underflow\n");
        return -1;
    }
    StackNode* temp = s->top;
    int value = temp->data;
    s->top = s->top->next;
    free(temp);
    return value;
}

int peek(Stack* s) {
    if (is_empty(s)) {
        fprintf(stderr, "Stack is empty\n");
        return -1;
    }
    return s->top->data;
}

void free_stack(Stack* s) {
    while (!is_empty(s)) {
        pop(s);
    }
}

int main(void) {
    Stack s;
    init_stack(&s);
    
    push(&s, 10);
    push(&s, 20);
    push(&s, 30);
    
    printf("Top: %d\n", peek(&s));  // 30
    
    while (!is_empty(&s)) {
        printf("%d ", pop(&s));
    }
    printf("\n");
    
    free_stack(&s);
    return 0;
}
```

### Пример: Проверка скобок

```c
#include <stdio.h>
#include <stdbool.h>
#include <string.h>

// Используем реализацию стека из предыдущего примера
// (предполагаем, что Stack уже определён)

bool is_balanced(const char* expression) {
    Stack s;
    init_stack(&s);
    
    for (int i = 0; expression[i] != '\0'; i++) {
        char ch = expression[i];
        
        if (ch == '(' || ch == '[' || ch == '{') {
            push(&s, ch);
        } else if (ch == ')' || ch == ']' || ch == '}') {
            if (is_empty(&s)) {
                free_stack(&s);
                return false;
            }
            
            char top = pop(&s);
            if ((ch == ')' && top != '(') ||
                (ch == ']' && top != '[') ||
                (ch == '}' && top != '{')) {
                free_stack(&s);
                return false;
            }
        }
    }
    
    bool result = is_empty(&s);
    free_stack(&s);
    return result;
}

int main(void) {
    printf("%s\n", is_balanced("()") ? "Balanced" : "Not balanced");
    printf("%s\n", is_balanced("([{}])") ? "Balanced" : "Not balanced");
    printf("%s\n", is_balanced("([)]") ? "Balanced" : "Not balanced");
    
    return 0;
}
```

---

## 3. Очередь (Queue) — FIFO

Очередь работает по принципу "первый пришёл — первый ушёл" (FIFO).

### Реализация через массив (циклическая очередь)

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#define MAX_SIZE 100

typedef struct {
    int data[MAX_SIZE];
    int front;
    int rear;
    int size;
} Queue;

void init_queue(Queue* q) {
    q->front = 0;
    q->rear = -1;
    q->size = 0;
}

bool is_empty(Queue* q) {
    return q->size == 0;
}

bool is_full(Queue* q) {
    return q->size == MAX_SIZE;
}

void enqueue(Queue* q, int value) {
    if (is_full(q)) {
        fprintf(stderr, "Queue overflow\n");
        return;
    }
    q->rear = (q->rear + 1) % MAX_SIZE;
    q->data[q->rear] = value;
    q->size++;
}

int dequeue(Queue* q) {
    if (is_empty(q)) {
        fprintf(stderr, "Queue underflow\n");
        return -1;
    }
    int value = q->data[q->front];
    q->front = (q->front + 1) % MAX_SIZE;
    q->size--;
    return value;
}

int front(Queue* q) {
    if (is_empty(q)) {
        fprintf(stderr, "Queue is empty\n");
        return -1;
    }
    return q->data[q->front];
}

int main(void) {
    Queue q;
    init_queue(&q);
    
    enqueue(&q, 10);
    enqueue(&q, 20);
    enqueue(&q, 30);
    
    printf("Front: %d\n", front(&q));  // 10
    
    while (!is_empty(&q)) {
        printf("%d ", dequeue(&q));  // 10 20 30
    }
    printf("\n");
    
    return 0;
}
```

### Реализация через связный список

```c
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

typedef struct QueueNode {
    int data;
    struct QueueNode* next;
} QueueNode;

typedef struct {
    QueueNode* front;
    QueueNode* rear;
} Queue;

void init_queue(Queue* q) {
    q->front = NULL;
    q->rear = NULL;
}

bool is_empty(Queue* q) {
    return q->front == NULL;
}

void enqueue(Queue* q, int value) {
    QueueNode* node = malloc(sizeof(QueueNode));
    if (node == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        return;
    }
    node->data = value;
    node->next = NULL;
    
    if (is_empty(q)) {
        q->front = q->rear = node;
    } else {
        q->rear->next = node;
        q->rear = node;
    }
}

int dequeue(Queue* q) {
    if (is_empty(q)) {
        fprintf(stderr, "Queue underflow\n");
        return -1;
    }
    
    QueueNode* temp = q->front;
    int value = temp->data;
    q->front = q->front->next;
    
    if (q->front == NULL) {
        q->rear = NULL;
    }
    
    free(temp);
    return value;
}

int front(Queue* q) {
    if (is_empty(q)) {
        fprintf(stderr, "Queue is empty\n");
        return -1;
    }
    return q->front->data;
}

void free_queue(Queue* q) {
    while (!is_empty(q)) {
        dequeue(q);
    }
}

int main(void) {
    Queue q;
    init_queue(&q);
    
    enqueue(&q, 10);
    enqueue(&q, 20);
    enqueue(&q, 30);
    
    printf("Front: %d\n", front(&q));  // 10
    
    while (!is_empty(&q)) {
        printf("%d ", dequeue(&q));
    }
    printf("\n");
    
    free_queue(&q);
    return 0;
}
```

---

## 4. Бинарное дерево (Binary Tree)

### Базовое бинарное дерево

```c
#include <stdio.h>
#include <stdlib.h>

typedef struct TreeNode {
    int data;
    struct TreeNode* left;
    struct TreeNode* right;
} TreeNode;

TreeNode* create_node(int data) {
    TreeNode* node = malloc(sizeof(TreeNode));
    if (node == NULL) {
        fprintf(stderr, "Memory allocation failed\n");
        exit(1);
    }
    node->data = data;
    node->left = NULL;
    node->right = NULL;
    return node;
}

// Вставка элемента
TreeNode* insert(TreeNode* root, int data) {
    if (root == NULL) {
        return create_node(data);
    }
    
    if (data < root->data) {
        root->left = insert(root->left, data);
    } else if (data > root->data) {
        root->right = insert(root->right, data);
    }
    
    return root;
}

// Поиск элемента
TreeNode* search(TreeNode* root, int data) {
    if (root == NULL || root->data == data) {
        return root;
    }
    
    if (data < root->data) {
        return search(root->left, data);
    } else {
        return search(root->right, data);
    }
}

// Обход дерева: In-order (левый -> корень -> правый)
void inorder_traversal(TreeNode* root) {
    if (root != NULL) {
        inorder_traversal(root->left);
        printf("%d ", root->data);
        inorder_traversal(root->right);
    }
}

// Обход дерева: Pre-order (корень -> левый -> правый)
void preorder_traversal(TreeNode* root) {
    if (root != NULL) {
        printf("%d ", root->data);
        preorder_traversal(root->left);
        preorder_traversal(root->right);
    }
}

// Обход дерева: Post-order (левый -> правый -> корень)
void postorder_traversal(TreeNode* root) {
    if (root != NULL) {
        postorder_traversal(root->left);
        postorder_traversal(root->right);
        printf("%d ", root->data);
    }
}

// Освобождение памяти
void free_tree(TreeNode* root) {
    if (root != NULL) {
        free_tree(root->left);
        free_tree(root->right);
        free(root);
    }
}

int main(void) {
    TreeNode* root = NULL;
    
    root = insert(root, 50);
    root = insert(root, 30);
    root = insert(root, 70);
    root = insert(root, 20);
    root = insert(root, 40);
    root = insert(root, 60);
    root = insert(root, 80);
    
    printf("In-order: ");
    inorder_traversal(root);    // 20 40 30 50 60 70 80
    printf("\n");
    
    printf("Pre-order: ");
    preorder_traversal(root);    // 50 30 20 40 70 60 80
    printf("\n");
    
    printf("Post-order: ");
    postorder_traversal(root);   // 20 40 30 60 80 70 50
    printf("\n");
    
    TreeNode* found = search(root, 40);
    if (found != NULL) {
        printf("Found: %d\n", found->data);
    }
    
    free_tree(root);
    return 0;
}
```

---

## 5. Хеш-таблица (Hash Table) — базовая реализация

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define TABLE_SIZE 100

typedef struct HashNode {
    char* key;
    int value;
    struct HashNode* next;
} HashNode;

typedef struct {
    HashNode* buckets[TABLE_SIZE];
} HashTable;

// Простая хеш-функция
unsigned int hash(const char* key) {
    unsigned int hash_value = 0;
    for (int i = 0; key[i] != '\0'; i++) {
        hash_value = hash_value * 31 + key[i];
    }
    return hash_value % TABLE_SIZE;
}

HashTable* create_table(void) {
    HashTable* table = malloc(sizeof(HashTable));
    for (int i = 0; i < TABLE_SIZE; i++) {
        table->buckets[i] = NULL;
    }
    return table;
}

void insert(HashTable* table, const char* key, int value) {
    unsigned int index = hash(key);
    
    HashNode* node = malloc(sizeof(HashNode));
    node->key = malloc(strlen(key) + 1);
    strcpy(node->key, key);
    node->value = value;
    node->next = table->buckets[index];
    table->buckets[index] = node;
}

int get(HashTable* table, const char* key) {
    unsigned int index = hash(key);
    HashNode* current = table->buckets[index];
    
    while (current != NULL) {
        if (strcmp(current->key, key) == 0) {
            return current->value;
        }
        current = current->next;
    }
    
    return -1;  // Не найдено
}

void free_table(HashTable* table) {
    for (int i = 0; i < TABLE_SIZE; i++) {
        HashNode* current = table->buckets[i];
        while (current != NULL) {
            HashNode* temp = current;
            current = current->next;
            free(temp->key);
            free(temp);
        }
    }
    free(table);
}

int main(void) {
    HashTable* table = create_table();
    
    insert(table, "apple", 10);
    insert(table, "banana", 20);
    insert(table, "cherry", 30);
    
    printf("apple: %d\n", get(table, "apple"));
    printf("banana: %d\n", get(table, "banana"));
    printf("cherry: %d\n", get(table, "cherry"));
    
    free_table(table);
    return 0;
}
```

---

## Резюме Блока 9

### Что мы изучили:

✅ Связные списки (односвязные и двусвязные)  
✅ Стек (LIFO) — реализация через массив и список  
✅ Очередь (FIFO) — реализация через массив и список  
✅ Бинарное дерево — базовые операции и обходы  
✅ Хеш-таблица — базовая реализация  

### Следующие шаги:

Переходите к `10-file-io.md` для изучения работы с файлами!

---

## Полезные ресурсы

- Структуры данных — основа алгоритмов
- Выбирайте структуру данных в зависимости от задачи
- Не забывайте освобождать память
- Стек и очередь — простые, но мощные структуры

---

## Типичные ошибки

1. **Забыли освободить память**
   ```c
   Node* node = malloc(sizeof(Node));
   // Использование...
   // ❌ Забыли free(node);
   ```

2. **Доступ к NULL указателю**
   ```c
   Node* head = NULL;
   printf("%d\n", head->data);  // ❌ Segmentation fault
   ```

3. **Утечка памяти при удалении**
   ```c
   void delete_node(Node** head, int data) {
       // Нашли узел, но забыли free(temp);
   }
   ```

4. **Неправильная работа с указателями в списках**
   ```c
   current = current->next;
   free(current);  // ❌ Освободили следующий, а не текущий
   ```

