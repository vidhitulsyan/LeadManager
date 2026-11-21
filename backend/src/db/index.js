import fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import { schema } from './schema.js';

const dbFile = process.env.DB_FILE || path.resolve('data/leads.db');

if (dbFile !== ':memory:') {
  fs.mkdirSync(path.dirname(dbFile), { recursive: true });
}

const db = new Database(dbFile);
db.pragma('journal_mode = WAL');
db.exec(schema);

export default db;
