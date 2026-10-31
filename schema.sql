-- JR Auto Repair — leads table (Cloudflare D1 database "jr-leads").
-- Run once after creating the database (see BACKEND-SETUP.md):
--   npx wrangler d1 execute jr-leads --file=./schema.sql
-- or paste this statement into the D1 console in the Cloudflare dashboard.

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT DEFAULT (datetime('now')),
  type TEXT,
  name TEXT,
  phone TEXT,
  email TEXT,
  vehicle TEXT,
  services TEXT,
  message TEXT,
  lang TEXT
);
