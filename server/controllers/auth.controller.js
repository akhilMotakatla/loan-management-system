import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import redis from '../config/redis.js';
import { sendEmail } from '../services/email.service.js';
import crypto from 'crypto';

const setRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    const exists = await User.findOne({ email });
    if (exists) throw new ApiError(409, 'Email already registered');
    const user = await User.create({ firstName, lastName, email, password, phone });
    const accessToken  = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    setRefreshCookie(res, refreshToken);
    res.status(201).json(new ApiResponse(201, { user: { _id: user._id, firstName, lastName, email, role: user.role }, accessToken }, 'Registration successful'));
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password +refreshToken');
    if (!user || !(await user.comparePassword(password))) throw new ApiError(401, 'Invalid credentials');
    if (!user.isActive) throw new ApiError(403, 'Account deactivated');
    const accessToken  = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    setRefreshCookie(res, refreshToken);
    res.json(new ApiResponse(200, {
      user: { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, avatar: user.avatar },
      accessToken,
    }, 'Login successful'));
  } catch (err) { next(err); }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token && redis) await redis.set(`bl:${token}`, '1', 'EX', 7 * 24 * 60 * 60);
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    res.clearCookie('refreshToken');
    res.json(new ApiResponse(200, null, 'Logged out'));
  } catch (err) { next(err); }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) throw new ApiError(401, 'No refresh token');
    if (redis) {
      const blacklisted = await redis.get(`bl:${token}`);
      if (blacklisted) throw new ApiError(401, 'Token expired');
    }
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) throw new ApiError(401, 'Invalid token');
    const accessToken = generateAccessToken(user._id);
    res.json(new ApiResponse(200, { accessToken }, 'Token refreshed'));
  } catch (err) { next(new ApiError(401, err.message)); }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.json(new ApiResponse(200, null, 'If that email exists, a reset link was sent'));
    const token = crypto.randomBytes(32).toString('hex');
    if (redis) await redis.set(`pwd:${token}`, user._id.toString(), 'EX', 3600);
    const link = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendEmail({ to: user.email, subject: 'Password Reset', html: `<p>Click <a href="${link}">here</a> to reset your password. Link expires in 1 hour.</p>` });
    res.json(new ApiResponse(200, null, 'Reset link sent'));
  } catch (err) { next(err); }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!redis) throw new ApiError(500, 'Password reset unavailable');
    const userId = await redis.get(`pwd:${token}`);
    if (!userId) throw new ApiError(400, 'Invalid or expired token');
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');
    user.password = req.body.password;
    await user.save();
    await redis.del(`pwd:${token}`);
    res.json(new ApiResponse(200, null, 'Password reset successful'));
  } catch (err) { next(err); }
};
