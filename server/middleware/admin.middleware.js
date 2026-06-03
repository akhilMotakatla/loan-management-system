import { ApiError } from '../utils/ApiError.js';

export const requireAdmin = (req, res, next) => {
  if (!['admin','officer'].includes(req.user?.role)) {
    return next(new ApiError(403, 'Access denied'));
  }
  next();
};

export const requireSuperAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') return next(new ApiError(403, 'Access denied'));
  next();
};
