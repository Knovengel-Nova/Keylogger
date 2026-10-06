PRAGMA journal_mode=WAL;
PRAGMA busy_timeout=5000;

CREATE TABLE IF NOT EXISTS device_info (
    device_uuid TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp_s INTEGER NOT NULL,
    timestamp_us INTEGER NOT NULL,
    event_code INTEGER NOT NULL,
    event_value INTEGER NOT NULL,
    event_name TEXT NOT NULL,
    status INTEGER NOT NULL DEFAULT 0,
    batch_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_events_status
ON events(status);

CREATE INDEX IF NOT EXISTS idx_events_batch_id
ON events(batch_id);