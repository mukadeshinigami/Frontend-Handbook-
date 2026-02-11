#include <stdio.h>
#include <unistd.h>
#include <sys/types.h>
#include <stdlib.h>

int main(void) {
    printf("Starting daemon...\n");
    pid_t pid_process = fork();
    if (pid_process < 0) {
        printf("Fork failed\n");
        perror("fork");
        return EXIT_FAILURE;
    }
    if (pid_process > 0) {
        printf("Daemon started with PID: %d\n", pid_process);
        return EXIT_SUCCESS;
    }
    return EXIT_SUCCESS; //
}