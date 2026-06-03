import Notification from '../models/Notification.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort('-createdAt').limit(50);
    res.json(new ApiResponse(200, notifications));
  } catch (err) { next(err); }
};

export const markAsRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { isRead: true });
    res.json(new ApiResponse(200, null, 'Marked as read'));
  } catch (err) { next(err); }
};

export const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, isRead: false }, { isRead: true });
    res.json(new ApiResponse(200, null, 'All marked as read'));
  } catch (err) { next(err); }
};

export const deleteNotification = async (req, res, next) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
    res.json(new ApiResponse(200, null, 'Deleted'));
  } catch (err) { next(err); }
};
