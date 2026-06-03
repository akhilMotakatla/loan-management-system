import { Router } from 'express';
import { register, login, logout, refreshToken, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../validators/auth.validator.js';

const router = Router();
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', verifyJWT, logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), resetPassword);
export default router;
