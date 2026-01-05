#include <stdio.h>

int main(void) {
    int day = 2;

    switch (day) {
        case 1:
            printf("Monday\n");
            break;
    
    default:
        printf("Invalid day\n");
        break;
    }

    float a, b, result;
    char operator;
    
    while (1) {
        printf("Enter expression (e.g., 10 + 5) or 'q' to quit: ");
        
        // Проверяем результат scanf (вызываем ОДИН раз!)
        int items_read = scanf("%f %c %f", &a, &operator, &b);
        
        if (items_read != 3) {
            // Если не удалось прочитать 3 значения, проверяем на 'q'
            char ch;
            // Очищаем буфер перед чтением символа
            while (getchar() != '\n');  // Очищаем остатки
            
            // Пробуем прочитать 'q'
            printf("Enter 'q' to quit or try again: ");
            if (scanf(" %c", &ch) == 1 && ch == 'q') {
                printf("Goodbye!\n");
                break;
            }
            
            // Очищаем буфер снова
            while (getchar() != '\n');
            printf("Invalid input! Please use format: number operator number\n");
            continue;
        }
        
        // Проверяем на 'q' в операторе
        if (operator == 'q') {
            printf("Goodbye!\n");
            break;
        }
        
        switch (operator) {
            case '+':
                result = a + b;
                break;
            case '-':
                result = a - b;
                break;  
            case '*':
                result = a * b;
                break;
            case '/':
                if (b != 0) {
                    result = a / b;
                } else {
                    printf("Error: Division by zero!\n");
                    continue;
                }
                break;
            default:
                printf("Invalid operator! Use +, -, *, or /\n");
                continue;
        }
        
        printf("%.2f %c %.2f = %.2f\n\n", a, operator, b, result);
    }
    
    return 0;
}