import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const parse = (v, d = null) => {
  if (v == null) return d;
  try { return typeof v === 'object' ? v : JSON.parse(v); } catch { return d; }
};

const fmt = (row) => {
  if (!row) return null;
  return { ...row, _id: row.id, installmentsCovered: parse(row.installmentsCovered, []) };
};

const Payment = {
  findById: (id) => fmt(db.prepare('SELECT * FROM payments WHERE id = ?').get(id)),

  find: ({ borrowerId, loanId, page = 1, limit = 50 } = {}) => {
    let sql = 'SELECT * FROM payments WHERE 1=1';
    const vals = [];
    if (borrowerId) { sql += ' AND borrowerId = ?'; vals.push(borrowerId); }
    if (loanId)     { sql += ' AND loanId = ?';     vals.push(loanId); }
    sql += ' ORDER BY createdAt DESC';
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as c');
    const total = db.prepare(countSql).get(...vals)?.c || 0;
    const offset = (page - 1) * limit;
    sql += ' LIMIT ? OFFSET ?';
    return { rows: db.prepare(sql).all(...vals, limit, offset).map(fmt), total };
  },

  create: (data) => {
    const id    = uuidv4();
    const count = db.prepare('SELECT COUNT(*) as c FROM payments').get()?.c || 0;
    const ref   = `PAY-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
    const now   = new Date().toISOString();

    db.prepare(`
      INSERT INTO payments (id, paymentReference, loanId, borrowerId, amount, paymentMethod, transactionId, remarks, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'processing', ?, ?)
    `).run(id, ref, data.loanId, data.borrowerId, data.amount, data.paymentMethod, data.transactionId || null, data.remarks || null, now, now);

    return Payment.findById(id);
  },

  update: (id, data) => {
    const allowed = ['status','principalPaid','interestPaid','lateFee','installmentsCovered'];
    const sets = [];
    const vals = [];
    for (const [k, v] of Object.entries(data)) {
      if (!allowed.includes(k)) continue;
      sets.push(`${k} = ?`);
      vals.push(Array.isArray(v) ? JSON.stringify(v) : v);
    }
    if (!sets.length) return Payment.findById(id);
    sets.push('updatedAt = ?');
    vals.push(new Date().toISOString());
    vals.push(id);
    db.prepare(`UPDATE payments SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
    return Payment.findById(id);
  },
};

export default Payment;
