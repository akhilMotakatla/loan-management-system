import { Router } from 'express';
import { initiatePayment, confirmPayment, getMyPayments, getPaymentById } from '../controllers/payment.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();
router.use(verifyJWT);
router.post('/', initiatePayment);
router.get('/', getMyPayments);
router.get('/:id', getPaymentById);
router.post('/:id/confirm', confirmPayment);
export default router;
