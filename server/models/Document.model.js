import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const fmt = (row) => (row ? { ...row, _id: row.id } : null);

const Document = {
  findById: (id) => fmt(db.prepare('SELECT * FROM documents WHERE id = ?').get(id)),

  find: ({ ownerId, applicationId } = {}) => {
    let sql = 'SELECT * FROM documents WHERE 1=1';
    const vals = [];
    if (ownerId)       { sql += ' AND ownerId = ?';       vals.push(ownerId); }
    if (applicationId) { sql += ' AND applicationId = ?'; vals.push(applicationId); }
    sql += ' ORDER BY createdAt DESC';
    return db.prepare(sql).all(...vals).map(fmt);
  },

  create: (data) => {
    const id  = uuidv4();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO documents (id, ownerId, documentType, documentName, description, fileUrl, fileName, fileType, fileSize, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.ownerId, data.documentType, data.documentName, data.description || null,
           data.fileUrl, data.fileName || null, data.fileType || null, data.fileSize || null, now, now);
    return Document.findById(id);
  },

  update: (id, data) => {
    const allowed = ['verificationStatus','verifiedById','rejectionNote','applicationId'];
    const sets = [];
    const vals = [];
    for (const [k, v] of Object.entries(data)) {
      if (!allowed.includes(k)) continue;
      sets.push(`${k} = ?`); vals.push(v);
    }
    if (!sets.length) return Document.findById(id);
    sets.push('updatedAt = ?');
    vals.push(new Date().toISOString());
    vals.push(id);
    db.prepare(`UPDATE documents SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
    return Document.findById(id);
  },

  delete: (id) => db.prepare('DELETE FROM documents WHERE id = ?').run(id),
};

export default Document;
