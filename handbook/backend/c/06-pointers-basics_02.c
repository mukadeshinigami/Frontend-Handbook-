#include <stdio.h>

int find_max(int *arr, int size) {

    if (size <= 0) {
        return -1; // error
    }

    int max = arr[0];
    for (int i = 1; i < size; i++) {
        if (arr[i] > max) {
            printf("arr[0]: %d\n", arr[0]);
            max = arr[i];
            printf("i: %d\n", i);
            printf("max: %d\n", max);
        }
    }
    return max;
}

int main(void) {
    int numbers[] = {3, 7, 2, 9, 1, 5};
    int size = sizeof(numbers) / sizeof(numbers[0]);
    int max = find_max(numbers, size);
    printf("Maximum: %d\n", max);
    return 0;
}

