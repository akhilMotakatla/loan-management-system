import Notification from '../models/Notification.model.js';

export const createNotification = async ({ recipient, type, title, message, link }) => {
  try {
    await Notification.create({ recipient, type, title, message, link });
  } catch (err) {
    console.error('Notification creation error:', err.message);
  }
};
