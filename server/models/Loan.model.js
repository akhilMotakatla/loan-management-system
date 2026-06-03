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
    repaymentSchedule: parse(row.repaymentSchedule, []),
    payments:          parse(row.payments, []),
  };
};

const Loan = {
  findById: (id) => fmt(db.prepare('SELECT * FROM loans WHERE id = ?').get(id)),

  find: ({ borrowerId, status, page = 1, limit = 50 } = {}) => {
    let sql = 'SELECT * FROM loans WHERE 1=1';
    const vals = [];
    if (borrowerId) { sql += ' AND borrowerId = ?'; vals.push(borrowerId); }
    if (status) {
      if (Array.isArray(status)) {
        const p = status.map(() => '?').join(',');
        sql += ` AND status NOT IN (${p})`;
        vals.push(...status);
      } else { sql += ' AND status = ?'; vals.push(status); }
    }
    sql += ' ORDER BY createdAt DESC';
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as c');
    const total = db.prepare(countSql).get(...vals)?.c || 0;
    const offset = (page - 1) * limit;
    sql += ' LIMIT ? OFFSET ?';
    return { rows: db.prepare(sql).all(...vals, limit, offset).map(fmt), total };
  },

  findAll: ({ status, page = 1, limit = 20 } = {}) => {
    let sql = `
      SELECT l.*, u.firstName, u.lastName, u.email
      FROM loans l LEFT JOIN users u ON u.id = l.borrowerId
      WHERE 1=1
    `;
    const vals = [];
    if (status) { sql += ' AND l.status = ?'; vals.push(status); }
    sql += ' ORDER BY l.createdAt DESC';
    const countSql = sql.replace(/SELECT l\.\*.*FROM/, 'SELECT COUNT(*) as c FROM').replace(/ORDER.*$/, '');
    const total = db.prepare(countSql).get(...vals)?.c || 0;
    const offset = (page - 1) * limit;
    sql += ' LIMIT ? OFFSET ?';
    const rows = db.prepare(sql).all(...vals, limit, offset);
    return {
      rows: rows.map(r => ({
        ...fmt(r),
        borrower: { _id: r.borrowerId, id: r.borrowerId, firstName: r.firstName, lastName: r.lastName, email: r.email },
      })),
      total,
    };
  },

  create: (data) => {
    const id    = uuidv4();
    const count = db.prepare('SELECT COUNT(*) as c FROM loans').get()?.c || 0;
    const loanNum = `LN-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
    const now   = new Date().toISOString();

    db.prepare(`
      INSERT INTO loans (id, loanNumber, applicationId, borrowerId, loanType,
        principalAmount, outstandingBalance, interestRate, tenure, emiAmount,
        processingFee, disbursementDate, nextDueDate, maturityDate,
        repaymentSchedule, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, loanNum,
      data.applicationId || data.application,
      data.borrowerId    || data.borrower,
      data.loanType,
      data.principalAmount,
      data.outstandingBalance,
      data.interestRate,
      data.tenure,
      data.emiAmount,
      data.processingFee || 0,
      data.disbursementDate instanceof Date ? data.disbursementDate.toISOString() : data.disbursementDate,
      data.nextDueDate    instanceof Date ? data.nextDueDate.toISOString()    : data.nextDueDate,
      data.maturityDate   instanceof Date ? data.maturityDate.toISOString()   : data.maturityDate,
      JSON.stringify(data.repaymentSchedule || []),
      now, now,
    );
    return Loan.findById(id);
  },

  update: (id, data) => {
    const jsonFields = ['repaymentSchedule','payments'];
    const cols       = ['outstandingBalance','totalPaid','overdueAmount','lastPaymentDate',
                        'nextDueDate','status','borrowerId'];
    const sets = [];
    const vals = [];
    for (const [k, v] of Object.entries(data)) {
      if (jsonFields.includes(k)) { sets.push(`${k} = ?`); vals.push(JSON.stringify(v)); }
      else if (cols.includes(k))  { sets.push(`${k} = ?`); vals.push(v instanceof Date ? v.toISOString() : v); }
    }
    if (!sets.length) return Loan.findById(id);
    sets.push('updatedAt = ?');
    vals.push(new Date().toISOString());
    vals.push(id);
    db.prepare(`UPDATE loans SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
    return Loan.findById(id);
  },

  countDocuments: (where = {}) => {
    if (where.status) return db.prepare('SELECT COUNT(*) as c FROM loans WHERE status = ?').get(where.status)?.c || 0;
    return db.prepare('SELECT COUNT(*) as c FROM loans').get()?.c || 0;
  },

  sumOutstanding: () => db.prepare("SELECT SUM(outstandingBalance) as total FROM loans WHERE status = 'active'").get()?.total || 0,

  groupByType: () => db.prepare('SELECT loanType as _id, COUNT(*) as count, SUM(principalAmount) as totalAmount FROM loans GROUP BY loanType').all(),

  monthlyDisbursements: () => db.prepare(`
    SELECT strftime('%m', disbursementDate) as _id, COUNT(*) as count, SUM(principalAmount) as amount
    FROM loans WHERE status = 'active'
    GROUP BY strftime('%m', disbursementDate)
    ORDER BY _id
  `).all(),
};

export default Loan;
