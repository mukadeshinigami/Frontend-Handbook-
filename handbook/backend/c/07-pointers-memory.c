#include <stdio.h>
#include <stdlib.h>


int main(void) {


    int* pointer_a = malloc( 5 * sizeof(int)); 
    
    if (pointer_a == NULL) {
        printf("Memory allocation failed!\n");
        return 1;
    }       
    for (int i = 0; i < 5; i++) {
        pointer_a[i] = i * 10;
        printf("Value of pointer_a[%d]: %d\n", i, pointer_a[i]);
    }
    free(pointer_a);
    pointer_a = NULL;



    int* pointer_b = calloc( 5, sizeof(int)); // 5 - количество элементов, sizeof(int) - размер одного элемента
    if (pointer_b == NULL) {
        printf("Memory allocation failed!\n");
        return 1;
    }
    for (int i = 0; i < 5; i++) {
        pointer_b[i] = i * 10;
        printf("Value of pointer_b[%d]: %d\n", i, pointer_b[i]);
    }
    
    int* pointer_c = realloc(pointer_b, 10 * sizeof(int));


    pointer_b = pointer_c;
    
    if (pointer_c == NULL) {
        printf("Memory allocation failed!\n");
        return 1;
    }
    for (int i = 0; i < 10; i++) {
        pointer_c[i] = i * 10;
        printf("Value of pointer_c[%d]: %d\n", i, pointer_c[i]);
    }
    free(pointer_c);
    pointer_b = NULL;
    pointer_c = NULL;


    int size;
    printf("Enter array size: ");
    scanf("%d", &size);
    
    // Выделение памяти
    int* arr = malloc(size * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed!\n");
        return 1;
    }
    
    // Заполнение массива
    printf("Enter %d numbers: ", size);
    for (int i = 0; i < size; i++) {
        scanf("%d", &arr[i]);
    }
    
    // Вывод массива
    printf("Array: ");
    for (int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");
    
    free(arr);
    return 0;


}

