-- D1 schema for the donation leaderboard.
-- Apply with: wrangler d1 execute donation_db --remote --file=./schema.sql

CREATE TABLE IF NOT EXISTS donations (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  donor_name TEXT    NOT NULL,
  channel    TEXT    NOT NULL,
  amount     REAL    NOT NULL CHECK (amount > 0),
  note       TEXT,
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_donations_donor      ON donations(donor_name);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
