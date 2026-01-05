#include <stdio.h>
#include <limits.h>
#include <float.h>

int main() {

    printf("INT_MIN %d\n", INT_MIN);
    printf("INT_MAX %d\n", INT_MAX);
    printf("UINT_MAX %u\n", UINT_MAX);
    printf("LONG_MIN %ld\n", LONG_MIN);
    printf("LONG_MAX %ld\n", LONG_MAX);
    printf("ULONG_MAX %lu\n", ULONG_MAX);
    printf("LLONG_MIN %lld\n", LLONG_MIN);
    printf("LLONG_MAX %lld\n", LLONG_MAX);
    printf("ULLONG_MAX %llu\n", ULLONG_MAX);
    printf("FLT_DIG = %d\n", FLT_DIG);         // Точность float
    printf("DBL_DIG = %d\n", DBL_DIG);         // Точность double
    printf("LDBL_DIG = %d\n", LDBL_DIG);       // Точность long double
    float f = 0.1f + 0.2f;
    printf("0.1 + 0.2 = %.1f\n", f);

    int a = 10;
    int b = 3;
    printf("a + b = %d\n", a + b);  // 13   
    printf("a++ = %d\n", a++);      // 10
    printf("a-- = %d\n", a--);      // 11
    printf("++a = %d\n", ++a);      // 12
    printf("--a = %d\n", --a);      // 11
    printf("a = %d\n", a);          // 11
    printf("b = %d\n", b);          // 3
    printf("a + b = %d\n", a + b);  // 14
    printf("a - b = %d\n", a - b);  // 8
    printf("a * b = %d\n", a * b);  // 33
    printf("a / b = %d\n", a / b);  // 3
    printf("a % b = %d\n", a % b);  // 0

    return 0;
} 
