#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
  int data;
  struct Node *next;
} Node;

Node *create_node(int data) {
  Node *node = malloc(sizeof(Node));
  if (node == NULL) {
    fprintf(stderr, "Memory allocation failed\n");
    exit(1);
  }
  node->data = data;
  node->next = NULL;
  return node;
}

void push_front(Node **head, int data) {
  Node *new_node = create_node(data);
  new_node->next = *head;
  *head = new_node;
}

void push_back(Node **head, int data) {
  Node *new_node = create_node(data);

  if (*head == NULL) {
    *head = new_node;
    return;
  }

  Node *current = *head;
  while (current->next != NULL) {
    current = current->next;
  }
  current->next = new_node;
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

// Вывод списка
void print_list(Node* head) {
  Node* current = head;
  while (current != NULL) {
    printf("%d", current->data);
    if (current->next != NULL) {
      printf(" -> ");
    }
    current = current->next;
  }
  printf(" -> NULL\n");
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