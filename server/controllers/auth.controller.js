import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import db from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';

const setRefreshCookie = (res, token) =>
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   7 * 24 * 60 * 60 * 1000,
  });

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    if (User.findOne({ email })) throw new ApiError(409, 'Email already registered');

    const user = await User.create({ firstName, lastName, email, password, phone });
    const accessToken  = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    User.update(user.id, { refreshToken });
    setRefreshCookie(res, refreshToken);

    res.status(201).json(new ApiResponse(201, {
      user: { _id: user.id, firstName, lastName, email, role: user.role },
      accessToken,
    }, 'Registration successful'));
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Include password column (normally hidden from User.findOne)
    const raw = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!raw) throw new ApiError(401, 'Invalid credentials');
    if (!raw.isActive) throw new ApiError(403, 'Account deactivated');

    const match = await User.comparePassword(password, raw.password);
    if (!match) throw new ApiError(401, 'Invalid credentials');

    const accessToken  = generateAccessToken(raw.id);
    const refreshToken = generateRefreshToken(raw.id);
    User.update(raw.id, { refreshToken });
    setRefreshCookie(res, refreshToken);

    res.json(new ApiResponse(200, {
      user: { _id: raw.id, firstName: raw.firstName, lastName: raw.lastName,
              email: raw.email, role: raw.role, avatar: raw.avatar },
      accessToken,
    }, 'Login successful'));
  } catch (err) { next(err); }
};

export const logout = (req, res, next) => {
  try {
    User.update(req.user.id, { refreshToken: null });
    res.clearCookie('refreshToken');
    res.json(new ApiResponse(200, null, 'Logged out'));
  } catch (err) { next(err); }
};

export const refreshToken = (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) throw new ApiError(401, 'No refresh token');
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const raw = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.id);
    if (!raw || raw.refreshToken !== token) throw new ApiError(401, 'Invalid token');
    const accessToken = generateAccessToken(raw.id);
    res.json(new ApiResponse(200, { accessToken }, 'Token refreshed'));
  } catch (err) { next(new ApiError(401, err.message)); }
};

export const forgotPassword = (req, res, next) => {
  res.json(new ApiResponse(200, null, 'If that email exists, a reset link was sent'));
};

export const resetPassword = (req, res, next) => {
  res.json(new ApiResponse(200, null, 'Password reset — please use profile page to change password'));
};
