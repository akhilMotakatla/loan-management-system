import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

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
    address:        parse(row.address, {}),
    employmentInfo: parse(row.employmentInfo, {}),
    isVerified: Boolean(row.isVerified),
    isActive:   Boolean(row.isActive),
  };
};

const User = {
  findById: (id) => fmt(db.prepare('SELECT * FROM users WHERE id = ?').get(id)),

  findByIdWithPassword: (id) => fmt(db.prepare('SELECT * FROM users WHERE id = ?').get(id)),

  findOne: (where) => {
    if (where.email) return fmt(db.prepare('SELECT * FROM users WHERE email = ?').get(where.email));
    if (where.id)    return fmt(db.prepare('SELECT * FROM users WHERE id = ?').get(where.id));
    return null;
  },

  find: ({ role, page = 1, limit = 20 } = {}) => {
    const offset = (page - 1) * limit;
    if (role) {
      const rows = db.prepare('SELECT * FROM users WHERE role = ? ORDER BY createdAt DESC LIMIT ? OFFSET ?').all(role, limit, offset);
      const count = db.prepare('SELECT COUNT(*) as c FROM users WHERE role = ?').get(role)?.c || 0;
      return { rows: rows.map(fmt), count };
    }
    const rows = db.prepare('SELECT * FROM users ORDER BY createdAt DESC LIMIT ? OFFSET ?').all(limit, offset);
    const count = db.prepare('SELECT COUNT(*) as c FROM users').get()?.c || 0;
    return { rows: rows.map(fmt), count };
  },

  create: async (data) => {
    const id = uuidv4();
    const hashed = await bcrypt.hash(data.password, 12);
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO users (id, firstName, lastName, email, password, phone, role, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, data.firstName, data.lastName, data.email, hashed, data.phone, data.role || 'customer', now, now);
    return User.findById(id);
  },

  update: (id, data) => {
    const allowed = ['firstName','lastName','phone','dateOfBirth','address','employmentInfo',
                     'creditScore','role','isVerified','isActive','avatar','kycStatus','refreshToken'];
    const sets = [];
    const vals = [];
    for (const [k, v] of Object.entries(data)) {
      if (!allowed.includes(k)) continue;
      sets.push(`${k} = ?`);
      vals.push(typeof v === 'object' && v !== null ? JSON.stringify(v) : v);
    }
    if (!sets.length) return User.findById(id);
    sets.push('updatedAt = ?');
    vals.push(new Date().toISOString());
    vals.push(id);
    db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).run(...vals);
    return User.findById(id);
  },

  updatePassword: async (id, newPassword) => {
    const hashed = await bcrypt.hash(newPassword, 12);
    db.prepare('UPDATE users SET password = ?, updatedAt = ? WHERE id = ?')
      .run(hashed, new Date().toISOString(), id);
  },

  comparePassword: async (plain, hashed) => bcrypt.compare(plain, hashed),

  countDocuments: () => db.prepare('SELECT COUNT(*) as c FROM users').get()?.c || 0,
};

export default User;
