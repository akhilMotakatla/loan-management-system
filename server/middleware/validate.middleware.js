import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map((d) => d.message);
    return next(new ApiError(400, 'Validation error', errors));
  }
  next();
};
