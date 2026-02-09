#include <stdio.h>

void power_up(int *hp, int amount) {

    *hp += amount;
}

int main(void) {

    int player_health = 100;

    power_up(&player_health, 50);
    printf("Player health: %d\n", player_health);

    return 0;
}