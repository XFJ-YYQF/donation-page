-- D1 schema for the donation leaderboard.
-- Fresh install: wrangler d1 execute donation_db --remote --file=./schema.sql
-- Already deployed before? Use migrations/0002_anonymous_and_channels.sql instead (see README).

CREATE TABLE IF NOT EXISTS donations (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  donor_name   TEXT    NOT NULL,
  channel      TEXT    NOT NULL,
  amount       REAL    NOT NULL CHECK (amount > 0),
  note         TEXT,
  is_anonymous INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_donations_donor      ON donations(donor_name);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);

CREATE TABLE IF NOT EXISTS channels (
  id   INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

INSERT OR IGNORE INTO channels (name) VALUES ('微信支付'), ('支付宝'), ('爱发电');
