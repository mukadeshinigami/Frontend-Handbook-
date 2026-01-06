# Блок 17: Алгоритмы и сортировка

## Цель

Реализовать базовые алгоритмы поиска и сортировки. Понимание алгоритмов критично для написания эффективного кода.

---

## 1. Поиск

### Линейный поиск

```c
#include <stdio.h>

int linear_search(int arr[], int size, int target) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) {
            return i;  // Найдено
        }
    }
    return -1;  // Не найдено
}

int main(void) {
    int arr[] = {5, 2, 8, 1, 9, 3};
    int size = sizeof(arr) / sizeof(arr[0]);
    
    int index = linear_search(arr, size, 8);
    if (index != -1) {
        printf("Found at index: %d\n", index);
    } else {
        printf("Not found\n");
    }
    
    return 0;
}
```

**Сложность:** O(n)

### Бинарный поиск (для отсортированных массивов)

```c
#include <stdio.h>

int binary_search(int arr[], int size, int target) {
    int left = 0;
    int right = size - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;  // Не найдено
}

int main(void) {
    int arr[] = {1, 2, 3, 5, 8, 9};  // Отсортирован
    int size = sizeof(arr) / sizeof(arr[0]);
    
    int index = binary_search(arr, size, 5);
    if (index != -1) {
        printf("Found at index: %d\n", index);
    } else {
        printf("Not found\n");
    }
    
    return 0;
}
```

**Сложность:** O(log n)

---

## 2. Сортировка пузырьком (Bubble Sort)

```c
#include <stdio.h>

void bubble_sort(int arr[], int size) {
    for (int i = 0; i < size - 1; i++) {
        for (int j = 0; j < size - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Обмен
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}

void print_array(int arr[], int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
}

int main(void) {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int size = sizeof(arr) / sizeof(arr[0]);
    
    printf("Before: ");
    print_array(arr, size);
    
    bubble_sort(arr, size);
    
    printf("After: ");
    print_array(arr, size);
    
    return 0;
}
```

**Сложность:** O(n²)

---

## 3. Сортировка выбором (Selection Sort)

```c
#include <stdio.h>

void selection_sort(int arr[], int size) {
    for (int i = 0; i < size - 1; i++) {
        int min_idx = i;
        
        // Находим минимальный элемент
        for (int j = i + 1; j < size; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        
        // Обмен
        if (min_idx != i) {
            int temp = arr[i];
            arr[i] = arr[min_idx];
            arr[min_idx] = temp;
        }
    }
}

int main(void) {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int size = sizeof(arr) / sizeof(arr[0]);
    
    selection_sort(arr, size);
    
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
    
    return 0;
}
```

**Сложность:** O(n²)

---

## 4. Сортировка вставками (Insertion Sort)

```c
#include <stdio.h>

void insertion_sort(int arr[], int size) {
    for (int i = 1; i < size; i++) {
        int key = arr[i];
        int j = i - 1;
        
        // Сдвигаем элементы больше key
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        arr[j + 1] = key;
    }
}

int main(void) {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int size = sizeof(arr) / sizeof(arr[0]);
    
    insertion_sort(arr, size);
    
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
    
    return 0;
}
```

**Сложность:** O(n²), но эффективна для небольших массивов

---

## 5. Быстрая сортировка (Quicksort)

```c
#include <stdio.h>

void swap(int* a, int* b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(&arr[i], &arr[j]);
        }
    }
    
    swap(&arr[i + 1], &arr[high]);
    return i + 1;
}

void quicksort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        
        quicksort(arr, low, pi - 1);
        quicksort(arr, pi + 1, high);
    }
}

int main(void) {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int size = sizeof(arr) / sizeof(arr[0]);
    
    quicksort(arr, 0, size - 1);
    
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
    
    return 0;
}
```

**Сложность:** O(n log n) в среднем, O(n²) в худшем случае

---

## 6. Сортировка слиянием (Merge Sort)

```c
#include <stdio.h>
#include <stdlib.h>

void merge(int arr[], int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    
    int* L = malloc(n1 * sizeof(int));
    int* R = malloc(n2 * sizeof(int));
    
    for (int i = 0; i < n1; i++) {
        L[i] = arr[left + i];
    }
    for (int j = 0; j < n2; j++) {
        R[j] = arr[mid + 1 + j];
    }
    
    int i = 0, j = 0, k = left;
    
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }
    
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
    
    free(L);
    free(R);
}

void merge_sort(int arr[], int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        
        merge_sort(arr, left, mid);
        merge_sort(arr, mid + 1, right);
        
        merge(arr, left, mid, right);
    }
}

int main(void) {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int size = sizeof(arr) / sizeof(arr[0]);
    
    merge_sort(arr, 0, size - 1);
    
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
    
    return 0;
}
```

**Сложность:** O(n log n)

---

## 7. qsort() из стандартной библиотеки

```c
#include <stdio.h>
#include <stdlib.h>

// Функция сравнения для целых чисел
int compare_int(const void* a, const void* b) {
    int int_a = *(const int*)a;
    int int_b = *(const int*)b;
    
    if (int_a < int_b) return -1;
    if (int_a > int_b) return 1;
    return 0;
}

// Функция сравнения для строк
int compare_string(const void* a, const void* b) {
    return strcmp(*(const char**)a, *(const char**)b);
}

int main(void) {
    // Сортировка целых чисел
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int size = sizeof(arr) / sizeof(arr[0]);
    
    qsort(arr, size, sizeof(int), compare_int);
    
    printf("Sorted integers: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
    
    // Сортировка строк
    const char* strings[] = {"banana", "apple", "cherry", "date"};
    int str_count = sizeof(strings) / sizeof(strings[0]);
    
    qsort(strings, str_count, sizeof(const char*), compare_string);
    
    printf("Sorted strings: ");
    for (int i = 0; i < str_count; i++) {
        printf("%s ", strings[i]);
    }
    printf("\n");
    
    return 0;
}
```

---

## 8. Сложность алгоритмов (O-нотация)

### Основные классы сложности

- **O(1)** — константное время (доступ к элементу массива)
- **O(log n)** — логарифмическое (бинарный поиск)
- **O(n)** — линейное (линейный поиск)
- **O(n log n)** — линейно-логарифмическое (быстрая сортировка)
- **O(n²)** — квадратичное (пузырьковая сортировка)
- **O(2ⁿ)** — экспоненциальное (рекурсивный Фибоначчи)

### Сравнение алгоритмов сортировки

| Алгоритм | Лучший случай | Средний случай | Худший случай |
|----------|---------------|----------------|---------------|
| Bubble Sort | O(n) | O(n²) | O(n²) |
| Selection Sort | O(n²) | O(n²) | O(n²) |
| Insertion Sort | O(n) | O(n²) | O(n²) |
| Quicksort | O(n log n) | O(n log n) | O(n²) |
| Merge Sort | O(n log n) | O(n log n) | O(n log n) |

---

## Резюме Блока 17

### Что мы изучили:

✅ Линейный и бинарный поиск  
✅ Сортировка пузырьком, выбором, вставками  
✅ Быстрая сортировка (Quicksort)  
✅ Сортировка слиянием (Merge Sort)  
✅ Использование `qsort()` из стандартной библиотеки  
✅ Основы O-нотации и сложности алгоритмов  

### Следующие шаги:

Переходите к `18-testing-debugging.md` для изучения тестирования и отладки!

---

## Полезные ресурсы

- Выбирайте алгоритм в зависимости от размера данных
- Для небольших массивов простые алгоритмы могут быть быстрее
- Используйте `qsort()` для стандартных случаев
- Понимайте сложность алгоритмов для оптимизации

---

## Типичные ошибки

1. **Выход за границы массива**
   ```c
   for (int i = 0; i <= size; i++) {  // ❌ Должно быть <
       arr[i] = 0;
   }
   ```

2. **Неправильная функция сравнения для qsort()**
   ```c
   int compare(const void* a, const void* b) {
       return a - b;  // ❌ Неправильно для указателей
       return *(int*)a - *(int*)b;  // ✅ Правильно
   }
   ```

3. **Утечка памяти в Merge Sort**
   ```c
   merge_sort(...);
   // ❌ Забыли освободить временные массивы в merge()
   ```

