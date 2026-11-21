import { LEAD_SOURCES, LEAD_STATUSES } from '../constants.js';

const sqlList = (values) => values.map((v) => `'${v}'`).join(', ');

export const schema = `
  CREATE TABLE IF NOT EXISTS leads (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    email       TEXT    NOT NULL,
    phone       TEXT,
    company     TEXT,
    source      TEXT    NOT NULL CHECK (source IN (${sqlList(LEAD_SOURCES)})),
    status      TEXT    NOT NULL DEFAULT 'New' CHECK (status IN (${sqlList(LEAD_STATUSES)})),
    created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
  CREATE INDEX IF NOT EXISTS idx_leads_name   ON leads (name COLLATE NOCASE);
`;
