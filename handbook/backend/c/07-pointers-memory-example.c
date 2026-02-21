#include <stdlib.h>
#include <stdio.h>
int* create_array(int size) {
    return calloc(size, sizeof(int));  // Проще и понятнее
}

int* create_array_with_pattern(int size) {
    int* arr = malloc(size * sizeof(int));
    for (int i = 0; i < size; i++) {
        arr[i] = i * 2;  
    }
    if (arr == NULL) {
        printf("Memory allocation failed!\n");
        return NULL;
    }
    return arr;
}
int main(void) {
    int* numbers = create_array_with_pattern(10);
    if (numbers == NULL) {
        printf("Memory allocation failed!\n");
        return 1;
    }
    for (int i = 0; i < 10; i++) {
        printf("numbers[%d] = %d\n", i, numbers[i]);
    }
    free(numbers);
    return 0;
}

