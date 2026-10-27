#include <sqlite3.h>
#include <unistd.h>
#include <stdio.h>

#include "cnslib.h"


//  DB related fxn
//  Inserted Memory data to DB
int insertBatch(sqlite3 *db, struct KeyEvent *buffer, int batchSize)
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

    for (int idx = 0; idx < batchSize; idx++)
    {
        sqlite3_bind_int64(stmt, 1, buffer[idx].tv_sec);
        sqlite3_bind_int64(stmt, 2, buffer[idx].tv_usec);
        sqlite3_bind_int(stmt, 3, buffer[idx].code);
        sqlite3_bind_int(stmt, 4, buffer[idx].value);

        char eventName[32];

        snprintf(eventName, sizeof(eventName),
                 "TEST_EVENT_%u_%u",
                 buffer[idx].code,
                 buffer[idx].value);

        sqlite3_bind_text(stmt, 5, eventName, -1, SQLITE_TRANSIENT);

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