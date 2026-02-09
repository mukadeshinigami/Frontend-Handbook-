#include <stdio.h>
#include <string.h>

typedef struct {
    char name[10];
    int age;
} Person;

typedef struct {
    char c; double d; char b;
} BadPerson;

typedef struct {
    double d; char c; char b;
} GoodPerson;

int main(void) {

    Person p;
    p.age = 30;
    
    strcpy(p.name, "John");

    printf("Name: %s, Age: %d\n", p.name, p.age);

    Person *ptr = &p; 
    ptr->age = 31; 
    strcpy(ptr->name, "Jane");

    printf("Name: %s, Age: %d\n", ptr->name, ptr->age);

    printf("Size of BadPerson: %zu\n", sizeof(BadPerson));
    printf("Size of GoodPerson: %zu\n", sizeof(GoodPerson));
    return 0;
}