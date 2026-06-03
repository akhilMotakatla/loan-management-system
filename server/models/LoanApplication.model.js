import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const parse = (v, d = null) => {
  if (v == null) return d;
  if (typeof v === 'object') return v;
  try { return JSON.parse(v); } catch { return d; }
};

const fmt = (row) => {
  if (!row) return null;
  return {
    ...row,
    _id: row.id,
    loanDetails:       parse(row.loanDetails, {}),
    financialSnapshot: parse(row.financialSnapshot, {}),
    statusHistory:     parse(row.statusHistory, []),
    approvalDetails:   parse(row.approvalDetails, {}),
    documents:         parse(row.documents, []),
  };
};

// Attach applicant/reviewedBy user objects onto a formatted application
const withApplicant = (app) => {
  if (!app) return null;
  const applicant = db.prepare('SELECT id, firstName, lastName, email, phone, kycStatus FROM users WHERE id = ?').get(app.applicantId);
  return { ...app, applicant: applicant ? { ...applicant, _id: applicant.id } : null };
};

const LoanApplication = {
  findById: (id, { populate } = {}) => {
    const row = db.prepare('SELECT * FROM loan_applications WHERE id = ?').get(id);
    const app = fmt(row);
    return populate ? withApplicant(app) : app;
  },

  findOne: (where) => {
    if (where._id || where.id) {
      const id = where._id || where.id;
      return fmt(db.prepare('SELECT * FROM loan_applications WHERE id = ?').get(id));
    }
    return null;
  },

  find: ({ applicantId, status, loanType, page = 1, limit = 50 } = {}) => {
    const offset = (page - 1) * limit;
    let sql = 'SELECT * FROM loan_applications WHERE 1=1';
    const vals = [];
    if (applicantId) { sql += ' AND applicantId = ?'; vals.push(applicantId); }
    if (status)      { sql += ' AND status = ?';      vals.push(status); }
    if (loanType)    { sql += ' AND loanType = ?';    vals.push(loanType); }
    sql += ' ORDER BY createdAt DESC';

    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as c');
    const total = db.prepare(countSql).get(...vals)?.c || 0;

    sql += ' LIMIT ? OFFSET ?';
    const rows = db.prepare(sql).all(...vals, limit, offset);
    return { rows: rows.map(fmt), total };
  },

  findAllAdmin: ({ status, loanType, page = 1, limit = 20 } = {}) => {
    let sql = `
      SELECT la.*, u.firstName, u.lastName, u.email
      FROM loan_applications la
      LEFT JOIN users u ON u.id = la.applicantId
      WHERE 1=1
    `;
    const vals = [];
    if (status)   { sql += ' AND la.status = ?';   vals.push(status); }
    if (loanType) { sql += ' AND la.loanType = ?'; vals.push(loanType); }
    sql += ' ORDER BY la.createdAt DESC';

    const countSql = sql.replace(/SELECT la\.\*.*FROM/, 'SELECT COUNT(*) as c FROM').replace(/ORDER.*$/, '');
    const total = db.prepare(countSql).get(...vals)?.c || 0;

    const offset = (page - 1) * limit;
    sql += ' LIMIT ? OFFSET ?';
    const rows = db.prepare(sql).all(...vals, limit, offset);

    return {
      rows: rows.map(r => ({
        ...fmt(r),
        applicant: { _id: r.applicantId, id: r.applicantId, firstName: r.firstName, lastName: r.lastName, email: r.email },
      })),
      total,
    };
  },

  create: (data) => {
    const id    = uuidv4();
    const count = db.prepare('SELECT COUNT(*) as c FROM loan_applications').get()?.c || 0;
    const appNum = `APP-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
    const now   = new Date().toISOString();

    db.prepare(`
      INSERT INTO loan_applications (id, applicationNumber, applicantId, loanType, loanDetails, financialSnapshot, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, 'draft', ?, ?)
    `).run(
      id, appNum, data.applicantId || data.applicant,
      data.loanType,
      JSON.stringify(data.loanDetails || {}),
      JSON.stringify(data.financialSnapshot || {}),
      now, now,
    );
    return LoanApplication.findById(id);
  },

  update: (id, data) => {
    const jsonFields  = ['loanDetails','financialSnapshot','statusHistory','approvalDetails','documents'];
    const textFields  = ['status','rejectionReason','internalNotes','reviewedById','submittedAt'];
    const sets = [];
    const vals = [];

    for (const [k, v] of Object.entries(data)) {
      if (jsonFields.includes(k)) { sets.push(`${k} = ?`); vals.push(JSON.stringify(v)); }
      else if (textFields.includes(k)) { sets.push(`${k} = ?`); vals.push(v); }
    }
    if (!sets.length) return LoanApplication.findById(id);
    sets.push('updatedAt = ?');
    vals.push(new Date().toISOString());
    vals.push(id);
    db.prepare(`UPDATE loan_applications SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
    return LoanApplication.findById(id);
  },

  countDocuments: (where = {}) => {
    if (where.status) {
      if (Array.isArray(where.status)) {
        const placeholders = where.status.map(() => '?').join(',');
        return db.prepare(`SELECT COUNT(*) as c FROM loan_applications WHERE status IN (${placeholders})`).get(...where.status)?.c || 0;
      }
      return db.prepare('SELECT COUNT(*) as c FROM loan_applications WHERE status = ?').get(where.status)?.c || 0;
    }
    return db.prepare('SELECT COUNT(*) as c FROM loan_applications').get()?.c || 0;
  },
};

export default LoanApplication;
