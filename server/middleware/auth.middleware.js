import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';

export const verifyJWT = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;
    if (!token) throw new ApiError(401, 'Unauthorized');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = User.findById(decoded.id);
    if (!user || !user.isActive) throw new ApiError(401, 'Unauthorized');
    req.user = user;
    next();
  } catch (err) {
    next(new ApiError(401, err.message || 'Unauthorized'));
  }
};
