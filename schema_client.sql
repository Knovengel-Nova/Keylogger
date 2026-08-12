CREATE TABLE events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp_s INTEGER NOT NULL,
    timestamp_us INTEGER NOT NULL,
    event_code INTEGER NOT NULL,
    event_value INTEGER NOT NULL,
    event_name TEXT NOT NULL,
    status INTEGER NOT NULL DEFAULT 0
);