import db from '../db/index.js';

const COLUMNS = 'id, name, email, phone, company, source, status, created_at, updated_at';

export function findAll({ search, status } = {}) {
  const conditions = [];
  const params = {};

  if (search) {
    conditions.push('name LIKE @search');
    params.search = `%${search}%`;
  }
  if (status) {
    conditions.push('status = @status');
    params.status = status;
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  return db.prepare(`SELECT ${COLUMNS} FROM leads ${where} ORDER BY id DESC`).all(params);
}

export function findById(id) {
  return db.prepare(`SELECT ${COLUMNS} FROM leads WHERE id = ?`).get(id);
}

export function create(lead) {
  return db
    .prepare(
      `INSERT INTO leads (name, email, phone, company, source, status)
       VALUES (@name, @email, @phone, @company, @source, @status)
       RETURNING ${COLUMNS}`,
    )
    .get(lead);
}

export function update(id, lead) {
  return db
    .prepare(
      `UPDATE leads
       SET name = @name, email = @email, phone = @phone, company = @company,
           source = @source, status = @status, updated_at = datetime('now')
       WHERE id = @id
       RETURNING ${COLUMNS}`,
    )
    .get({ ...lead, id });
}

export function remove(id) {
  return db.prepare('DELETE FROM leads WHERE id = ?').run(id).changes > 0;
}
