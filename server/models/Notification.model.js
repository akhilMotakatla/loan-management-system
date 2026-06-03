import db from '../config/db.js';
import { v4 as uuidv4 } from 'uuid';

const fmt = (row) => (row ? { ...row, _id: row.id, isRead: Boolean(row.isRead) } : null);

const Notification = {
  findById: (id) => fmt(db.prepare('SELECT * FROM notifications WHERE id = ?').get(id)),

  find: ({ recipientId, limit = 50 } = {}) => {
    if (recipientId) {
      return db.prepare('SELECT * FROM notifications WHERE recipientId = ? ORDER BY createdAt DESC LIMIT ?')
        .all(recipientId, limit).map(fmt);
    }
    return db.prepare('SELECT * FROM notifications ORDER BY createdAt DESC LIMIT ?').all(limit).map(fmt);
  },

  create: (data) => {
    const id  = uuidv4();
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO notifications (id, recipientId, type, title, message, link, isRead, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, 0, ?)
    `).run(id, data.recipientId || data.recipient?.toString(), data.type, data.title, data.message, data.link || null, now);
    return Notification.findById(id);
  },

  markRead: (id, recipientId) => {
    db.prepare('UPDATE notifications SET isRead = 1 WHERE id = ? AND recipientId = ?').run(id, recipientId);
  },

  markAllRead: (recipientId) => {
    db.prepare('UPDATE notifications SET isRead = 1 WHERE recipientId = ? AND isRead = 0').run(recipientId);
  },

  delete: (id, recipientId) => {
    db.prepare('DELETE FROM notifications WHERE id = ? AND recipientId = ?').run(id, recipientId);
  },
};

export default Notification;
