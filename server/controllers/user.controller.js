import User from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinary.service.js';

export const getMe = async (req, res, next) => {
  try {
    res.json(new ApiResponse(200, req.user));
  } catch (err) { next(err); }
};

export const updateMe = async (req, res, next) => {
  try {
    const allowed = ['firstName','lastName','phone','dateOfBirth','address','employmentInfo'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json(new ApiResponse(200, user, 'Profile updated'));
  } catch (err) { next(err); }
};

export const changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(req.body.currentPassword))) throw new ApiError(400, 'Wrong current password');
    user.password = req.body.newPassword;
    await user.save();
    res.json(new ApiResponse(200, null, 'Password changed'));
  } catch (err) { next(err); }
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, 'No file provided');
    const result = await uploadToCloudinary(req.file.buffer, `loan-mgmt/${req.user._id}/avatar`, req.file.mimetype);
    if (req.user.avatar) {
      const oldId = req.user.avatar.split('/').slice(-1)[0].split('.')[0];
      await deleteFromCloudinary(oldId).catch(() => {});
    }
    const user = await User.findByIdAndUpdate(req.user._id, { avatar: result.secure_url }, { new: true });
    res.json(new ApiResponse(200, { avatar: user.avatar }, 'Avatar updated'));
  } catch (err) { next(err); }
};
