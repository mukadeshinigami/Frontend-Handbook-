#include <stdio.h>
void print_number(int n) {
    printf("Number: %d\n", n);
    // return не нужен (можно написать просто return;)
}

int asd(int a, int b) {
    return a + b;
}

int main(void) {
    print_number(42);
    return 0;
}