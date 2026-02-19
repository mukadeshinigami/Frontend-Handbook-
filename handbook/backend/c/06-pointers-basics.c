#include <stdlib.h>
#include <stdio.h>

void good_function(int **ptr) {

    *ptr = malloc(sizeof(int));
    if (*ptr == NULL) {
        printf("Memory allocation failed\n");
        exit(1);
    }
}

int main() {
    int *zero = NULL;
    good_function(&zero);
    if (zero != NULL) {
        *zero = 100;
    }
    printf("zero: %d\n", *zero);
    free(zero);
    return 0;
}