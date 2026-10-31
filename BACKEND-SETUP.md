# JR Auto — Turn On the Leads Database (one-time, ~2 minutes)

**ACTIVATION STATUS (Oct 31, 2026):** `jr-leads` database CREATED by Tariq (Oct 31, 7:48 AM) and the `leads` table created via console ("Query successfully executed"). Database UUID starts `70e060fc-7562-4e39-…` (list view truncated it). **Still needed: the FULL database UUID** — Tariq pastes it, Koda drops it into `wrangler.toml`, pushes, auto-deploy turns storage on. Do NOT push while `wrangler.toml` still has the placeholder ID.

The website already sends every contact-form message, booking and chat
phone number to a small backend (`/api/lead`). Until the database below is
created and bound, those leads are **not stored** — the site works exactly
as before, the forms just don't save anything yet. This one-time setup
turns storage on.

You need to be signed in to the Cloudflare account that hosts
`jr-auto-lawrence` (the same account used for the site uploads).

## Step 1 — Create the database

1. In the Cloudflare dashboard, open **Storage & databases → D1**.
2. Click **Create database**, name it exactly: `jr-leads`
3. After it is created, open it and copy its **Database ID**
   (a long code like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).

## Step 2 — Create the leads table

1. Still in the D1 database view, open the **Console** tab.
2. Paste the contents of `schema.sql` (in this repo) and run it.
   It creates one table called `leads`. Nothing else is touched.

## Step 3 — Connect the database to the website (pick ONE path)

### Path A — via `wrangler.toml` (already in this repo)

1. Open `wrangler.toml` and replace `REPLACE_AFTER_CREATION` with the
   Database ID from Step 1.
2. Done — the next GitHub push / deployment activates it.

> ⚠️ Do not deploy while `wrangler.toml` still says
> `REPLACE_AFTER_CREATION` — either finish this step first, or use
> Path B and delete the `[[d1_databases]]` block from `wrangler.toml`.

### Path B — via the dashboard (no file edits)

1. Delete the `[[d1_databases]]` block at the bottom of `wrangler.toml`
   (or delete the file).
2. In the dashboard: **Workers & Pages → jr-auto-lawrence → Settings →
   Bindings → Add → D1 database**.
3. Variable name: `DB` — select the `jr-leads` database — **Save**.
4. Redeploy once (the next GitHub push does it) for the binding to apply.

## Step 4 — Set the admin key (for reading leads back)

1. **Workers & Pages → jr-auto-lawrence → Settings → Variables and
   secrets → Add**.
2. Name: `ADMIN_KEY` — Value: a password you choose — encrypt it — Save.
3. Reading leads later: `GET https://jr-auto-lawrence.pages.dev/api/leads`
   with header `x-admin-key: <that password>` returns the newest 100
   leads as JSON. (Koda can pull them for you with this key.)

## Step 5 — Verify

1. Open the live site, send a test message from the **Send Us a Message**
   form (use your own name/number).
2. Back in **D1 → jr-leads → leads table** (or the Console:
   `SELECT * FROM leads;`) — your test lead should be there.
3. Delete the test row if you like: `DELETE FROM leads WHERE name = '...'`.

---

**Files involved**

| File | What it does |
|---|---|
| `functions/api/lead.js` | Receives form/booking/chat leads and stores them |
| `functions/api/leads.js` | Owner-only read-back of recent leads (admin key) |
| `schema.sql` | Creates the `leads` table |
| `wrangler.toml` | Project config + D1 binding (Path A) |
