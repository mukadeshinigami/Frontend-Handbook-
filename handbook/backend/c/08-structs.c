#include <assert.h>

#include <stdio.h>

struct Point {

  int x;
  int y;
};

int sum_of_x_and_y(struct Point p) { return p.x + p.y; }

typedef struct {

  int x;
  int y;
} Point2;

Point2 p2 = {10, 20};
int sum_of_x_and_y2(Point2 p) { return p.x + p.y; }

int main(void) {
  struct Point p1;
  p1.x = 10;
  p1.y = 20;

  Point2 p4 = {10, 20};

  struct Point p3 = {.x = 10, .y = 20};

  int xy = sum_of_x_and_y(p1);
  int xy2 = sum_of_x_and_y2(p4);

  printf("Point: (%d, %d)\n", p1.x, p1.y);
  printf("Sum of x and y: %d\n", xy);

  printf("Point 2: (%d, %d)\n", p4.x, p4.y);
  printf("Point 3: (%d, %d)\n", p3.x, p3.y);
  printf("Sum of x and y: %d\n", sum_of_x_and_y(p3));
  printf("Sum of x and y: %d\n", xy2);


  return 0;
}