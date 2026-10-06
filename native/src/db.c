#include <sqlite3.h>
#include <unistd.h>
#include <stdio.h>

#include "cnslib.h"


//  DB related fxn
//  Inserted Memory data to DB
int insertBatch(sqlite3 *db, struct KeyEvent *buffer, int count)
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