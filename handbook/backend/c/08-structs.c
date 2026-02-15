#include <stdio.h>

struct Point {

    int x;
    int y;
    
};

int sum_of_x_and_y(struct Point p) {
    return p.x + p.y;
}

int main(void) {
    struct Point p1;
    p1.x = 10;
    p1.y = 20;

    struct Point p2 = {10, 20};

    struct Point p3 = {.x = 10, .y = 20};

    int xy = sum_of_x_and_y(p1);   


    printf("Point: (%d, %d)\n", p1.x, p1.y);
    printf("Sum of x and y: %d\n", xy);

    printf ("Point 2: (%d, %d)\n", p2.x, p2.y);
    printf ("Point 3: (%d, %d)\n", p3.x, p3.y);

    
    return 0;
}