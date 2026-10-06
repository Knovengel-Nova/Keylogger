#include <sqlite3.h>

#include "cnslib.h"

#ifndef DB_H
#define DB_H

int insertBatch(sqlite3 *db, struct KeyEvent *buffer, int count);

#endif