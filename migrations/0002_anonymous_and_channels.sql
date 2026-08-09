-- Run this ONLY if you already initialized the database with the old schema.
-- wrangler d1 execute donation_db --remote --file=./migrations/0002_anonymous_and_channels.sql

ALTER TABLE donations ADD COLUMN is_anonymous INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS channels (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

INSERT OR IGNORE INTO channels (name) VALUES ('微信支付'), ('支付宝'), ('爱发电');
