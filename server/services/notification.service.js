import Notification from '../models/Notification.model.js';

export const createNotification = ({ recipient, recipientId, type, title, message, link }) => {
  try {
    Notification.create({ recipientId: recipientId || recipient?.toString(), type, title, message, link });
  } catch (err) {
    console.error('Notification error:', err.message);
  }
};
