import path from 'path';
import User from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { deleteLocalFile } from '../services/cloudinary.service.js';

export const getMe = (req, res, next) => {
  try {
    res.json(new ApiResponse(200, req.user));
  } catch (err) { next(err); }
};

export const updateMe = (req, res, next) => {
  try {
    const allowed = ['firstName','lastName','phone','dateOfBirth','address','employmentInfo'];
    const updates = {};
    for (const k of allowed) {
      if (req.body[k] !== undefined) updates[k] = req.body[k];
    }
    const user = User.update(req.user.id, updates);
    res.json(new ApiResponse(200, user, 'Profile updated'));
  } catch (err) { next(err); }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) throw new ApiError(400, 'Both passwords required');
    // Get raw row with password
    const { default: db } = await import('../config/db.js');
    const raw = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
    const match = await User.comparePassword(currentPassword, raw.password);
    if (!match) throw new ApiError(400, 'Wrong current password');
    await User.updatePassword(req.user.id, newPassword);
    res.json(new ApiResponse(200, null, 'Password changed'));
  } catch (err) { next(err); }
};

export const uploadAvatar = (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, 'No file provided');
    const fileUrl = `/uploads/${req.user.id}/${req.file.filename}`;
    // Delete old avatar file if it exists locally
    if (req.user.avatar && req.user.avatar.startsWith('/uploads')) {
      const oldPath = path.join(process.cwd(), req.user.avatar);
      deleteLocalFile(oldPath);
    }
    const user = User.update(req.user.id, { avatar: fileUrl });
    res.json(new ApiResponse(200, { avatar: user.avatar }, 'Avatar updated'));
  } catch (err) { next(err); }
};
