import { Router } from 'express';
import { getMyLoans, getLoanById, getLoanSchedule, getLoanPayments } from '../controllers/loan.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router();
router.use(verifyJWT);
router.get('/', getMyLoans);
router.get('/:id', getLoanById);
router.get('/:id/schedule', getLoanSchedule);
router.get('/:id/payments', getLoanPayments);
export default router;
