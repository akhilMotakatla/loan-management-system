import Notification from '../models/Notification.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getMyNotifications = (req, res, next) => {
  try {
    const notifications = Notification.find({ recipientId: req.user.id });
    res.json(new ApiResponse(200, notifications));
  } catch (err) { next(err); }
};

export const markAsRead = (req, res, next) => {
  try {
    Notification.markRead(req.params.id, req.user.id);
    res.json(new ApiResponse(200, null, 'Marked as read'));
  } catch (err) { next(err); }
};

export const markAllRead = (req, res, next) => {
  try {
    Notification.markAllRead(req.user.id);
    res.json(new ApiResponse(200, null, 'All marked as read'));
  } catch (err) { next(err); }
};

export const deleteNotification = (req, res, next) => {
  try {
    Notification.delete(req.params.id, req.user.id);
    res.json(new ApiResponse(200, null, 'Deleted'));
  } catch (err) { next(err); }
};
