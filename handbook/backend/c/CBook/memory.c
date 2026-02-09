#include <stdio.h>
#include <stdlib.h>

char *dynamic_string(void) {

    int length = 0;
    printf("Enter the length of the string: ");
    scanf("%d", &length);
    char *str = malloc(sizeof(*str) * (length + 1));
    if (str == NULL) {
        printf("Memory allocation failed!\n");
        return NULL;
    }
    printf("Enter the string: ");
    scanf("%s", str);
    return str;
}


int main(void) {
    int *ptr = (int *)malloc(sizeof(*ptr));
    if (ptr == NULL) {
        printf("Memory allocation failed!\n");
        return 1;
    }
    *ptr = 42;
    printf("Value: %d\n", *ptr);
    free(ptr);
    ptr = NULL;

    char *str = dynamic_string();
    if (str == NULL) {
        printf("Memory allocation failed!\n");
        return 1;
    }
    printf("String: %s\n", str);
    free(str);
    str = NULL;
    return 0;
}