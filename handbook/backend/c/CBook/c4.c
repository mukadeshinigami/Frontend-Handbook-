#include <stdio.h>

int main(void) {

  int x = 42;
  char c = 'z';
  short s = 777;

  printf("size: %zu\n", sizeof(x));
  printf("size: %zu\n", sizeof(c));
  printf("size: %zu\n", sizeof(s));

  return 0;
}