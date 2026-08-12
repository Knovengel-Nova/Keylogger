#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <linux/input.h>

#define BUFFER_SIZE 150

struct KeyEvent{
    long tv_sec;
    long tv_usec;
    unsigned short code;
    unsigned int value;
};

struct KeyEvent buffer[BUFFER_SIZE];
int buffer_count = 0;

const char *getTestEvent(struct input_event ie)
{
    if (ie.type != EV_KEY)
        return NULL;

    static char event[32];

    if (ie.value == 1)
        snprintf(event, sizeof(event), "TEST_KEY_%u_DOWN", ie.code);
    else if (ie.value == 0)
        snprintf(event, sizeof(event), "TEST_KEY_%u_UP", ie.code);
    else if (ie.value == 2)
        snprintf(event, sizeof(event), "TEST_KEY_%u_REPEAT", ie.code);
    else
        return NULL;

    return event;
}

void getKeyStrokeEvent(struct input_event ie)
{
    if (ie.type == EV_KEY)
    {
        buffer[buffer_count].tv_sec = ie.time.tv_sec;
        buffer[buffer_count].tv_usec = ie.time.tv_usec;
        buffer[buffer_count].code = ie.code;
        buffer[buffer_count].value = ie.value;

        buffer_count++;

        if(buffer_count >= BUFFER_SIZE){
            printf("Memory Buffer Full. Appending to DB\n");

            // append to DB

            buffer_count = 0;
        }

        const char *event = getTestEvent(ie);

        if (event != NULL)
        {
            printf("[%ld.%06ld] %s\n",
                   (long)ie.time.tv_sec,
                   (long)ie.time.tv_usec,
                   event);
        }
    }
}

int main(int argc, char *argv[])
{

    if (argc != 2)
    {
        printf("Usage: %s <event-file-path>\n", argv[0]);
        exit(-1);
    }

    int fd = open(argv[1], O_RDONLY, 0);

    struct input_event ie;
    while (1)
    {
        ssize_t n = read(fd, &ie, sizeof(ie));

        if (n == -1)
        {
            perror("read");
            break;
        }

        if (n != sizeof(ie))
        {
            fprintf(stderr, "Incomplete input_event read\n");
            break;
        }

        getKeyStrokeEvent(ie);
    }

    return 0;
}
