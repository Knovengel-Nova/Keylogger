#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <sqlite3.h>
#include <linux/input.h>

#define BUFFER_SIZE 150

struct KeyEvent
{
    long tv_sec;
    long tv_usec;
    unsigned short code;
    unsigned int value;
};

struct KeyEvent buffer[BUFFER_SIZE];
int buffer_count = 0;

sqlite3 *db = NULL;

int insertBatch(struct KeyEvent *buffer, int count)
{
    const char *sql =
        "INSERT INTO events "
        "(timestamp_s, timestamp_us, event_code, event_value, event_name) "
        "VALUES (?, ?, ?, ?, ?);";

    sqlite3_stmt *stmt = NULL;

    if (sqlite3_exec(db, "BEGIN TRANSACTION;", NULL, NULL, NULL) != SQLITE_OK)
    {
        fprintf(stderr, "Failed to begin transaction: %s\n",
                sqlite3_errmsg(db));
        return -1;
    }

    if (sqlite3_prepare_v2(db, sql, -1, &stmt, NULL) != SQLITE_OK)
    {
        fprintf(stderr, "Failed to prepare statement: %s\n",
                sqlite3_errmsg(db));

        sqlite3_exec(db, "ROLLBACK;", NULL, NULL, NULL);
        return -1;
    }

    for (int i = 0; i < count; i++)
    {
        sqlite3_bind_int64(stmt, 1, buffer[i].tv_sec);
        sqlite3_bind_int64(stmt, 2, buffer[i].tv_usec);
        sqlite3_bind_int(stmt, 3, buffer[i].code);
        sqlite3_bind_int(stmt, 4, buffer[i].value);

        char event_name[32];

        snprintf(event_name, sizeof(event_name),
                 "TEST_EVENT_%u_%u",
                 buffer[i].code,
                 buffer[i].value);

        sqlite3_bind_text(stmt, 5, event_name, -1, SQLITE_TRANSIENT);

        if (sqlite3_step(stmt) != SQLITE_DONE)
        {
            fprintf(stderr, "Insert failed: %s\n",
                    sqlite3_errmsg(db));

            sqlite3_finalize(stmt);
            sqlite3_exec(db, "ROLLBACK;", NULL, NULL, NULL);
            return -1;
        }

        sqlite3_reset(stmt);
        sqlite3_clear_bindings(stmt);
    }

    sqlite3_finalize(stmt);

    if (sqlite3_exec(db, "COMMIT;", NULL, NULL, NULL) != SQLITE_OK)
    {
        fprintf(stderr, "Commit failed: %s\n",
                sqlite3_errmsg(db));

        sqlite3_exec(db, "ROLLBACK;", NULL, NULL, NULL);
        return -1;
    }

    return 0;
}

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

        if (buffer_count >= BUFFER_SIZE)
        {
            if (insertBatch(buffer, buffer_count) == 0)
            {
                printf("Successfully inserted %d events\n", buffer_count);
                buffer_count = 0;
            }
            else
            {
                printf("Database insertion failed; keeping buffer\n");
            }
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

        getKeyStrokeEvent(ie);
    }

    sqlite3_close(db);

    return 0;
}
