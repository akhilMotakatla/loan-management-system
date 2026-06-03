import { Router } from 'express';
import { getMe, updateMe, changePassword, uploadAvatar } from '../controllers/user.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();
router.use(verifyJWT);
router.get('/me', getMe);
router.put('/me', updateMe);
router.put('/me/password', changePassword);
router.put('/me/avatar', upload.single('avatar'), uploadAvatar);
export default router;
