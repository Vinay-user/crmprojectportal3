# CRM Portal — Database (MySQL / XAMPP version)

Converted from the original PostgreSQL schema to run on the MySQL/MariaDB
server bundled with XAMPP. Same 16 tables, same enums, same relationships —
just MySQL syntax (`AUTO_INCREMENT`, `ENUM(...)` inline, `DATETIME`,
`ON UPDATE CURRENT_TIMESTAMP` instead of a trigger, `ENGINE=InnoDB`).

## Setup (via phpMyAdmin — easiest)

1. Start **Apache** and **MySQL** in the XAMPP Control Panel.
2. Open http://localhost/phpmyadmin
3. Click **New** (left sidebar) → name the database `crm_portal` →
   collation `utf8mb4_general_ci` → **Create**.
4. Click the `crm_portal` database → **Import** tab.
5. Import `schema.sql` first (Go), then `indexes.sql`, then `seed.sql`
   (seed data is optional — skip it if you just want an empty schema).

## Setup (via command line)

From `C:\xampp\mysql\bin` (or wherever your XAMPP is installed), open a
terminal there and run:

```bash
mysql -u root -p -e "CREATE DATABASE crm_portal CHARACTER SET utf8mb4;"
mysql -u root -p crm_portal < schema.sql
mysql -u root -p crm_portal < indexes.sql
mysql -u root -p crm_portal < seed.sql
```

By default XAMPP's MySQL root user has **no password** — just press Enter
at the password prompt (or drop `-p` entirely).

## Notes on the conversion

- Postgres `ENUM` types → inline MySQL `ENUM(...)` per column (MySQL
  doesn't have standalone named enum types).
- `BIGSERIAL` → `BIGINT AUTO_INCREMENT`.
- `TIMESTAMPTZ` → `DATETIME` (MySQL has no timezone-aware timestamp type
  suited for this; store everything in one consistent timezone, e.g. UTC,
  from your application layer).
- The Postgres `set_updated_at()` trigger is replaced by
  `DATETIME ... ON UPDATE CURRENT_TIMESTAMP` on each `updated_at` column —
  MySQL updates it automatically, no trigger needed.
- `JSONB` → `JSON`.
- Every table is explicitly `ENGINE=InnoDB` (required for foreign keys —
  XAMPP's default is InnoDB anyway, but it's set explicitly to be safe).
- `pg_get_serial_sequence` / `setval` calls are removed — MySQL's
  `AUTO_INCREMENT` counter advances automatically when you insert an
  explicit id, so there's nothing to reset.

Everything else (table/column names, relationships, the polymorphic
`related_to_type` + `related_to_id` pattern on activities/tasks/calendar
events) is unchanged from the original — see the full entity overview
in the original README if you still have it.

**Passwords are stored as plain text for now** (the `users.password`
column), matching the backend's current no-hashing stage — see
`backend/README.md`. All five seeded accounts use the password
`Password123!`. Do not use plain-text passwords anywhere beyond local
development; add hashing (see the backend README) before deploying this
schema anywhere else.
