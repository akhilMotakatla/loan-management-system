import { Router } from 'express';
import { getMyNotifications, markAsRead, markAllRead, deleteNotification } from '../controllers/notification.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();
router.use(verifyJWT);
router.get('/', getMyNotifications);
router.put('/read-all', markAllRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);
export default router;
