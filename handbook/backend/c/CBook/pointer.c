#include <stdio.h>

int main(void) {

    int x = 10;
    int *pointer_x = &x;
    int a = 20;
    int *pointer_a = &a;
    int temp = *pointer_x;
    *pointer_x = *pointer_a;
    *pointer_a = temp;

    if (pointer_x == NULL) {
        printf("pointer_x is NULL\n");
    }
    if (pointer_a == NULL) {
        printf("pointer_a is NULL\n");
    }

    int asd[] = {1, 2, 3, 4, 5};
    int ads = *(asd + 4);
    printf("ads: %d\n", ads);
    printf("asd[1]: %d\n", asd[1]);
    printf("asd[2]: %d\n", asd[2]);
    printf("asd[3]: %d\n", asd[3]);
    printf("asd[4]: %d\n", asd[4]);       
    
    long values[] = {100, 200, 300};
    long *p = values;

    for (int i = 0; i < 3; i++) {
        printf("values[%d]: %ld\n", i, *(p + i));
    }

    return 0;
}   