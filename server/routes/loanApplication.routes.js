import { Router } from 'express';
import { createApplication, getMyApplications, getApplicationById, updateApplication, submitApplication, cancelApplication, getStatusHistory } from '../controllers/loanApplication.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createApplicationSchema } from '../validators/loanApplication.validator.js';

const router = Router();
router.use(verifyJWT);
router.post('/', validate(createApplicationSchema), createApplication);
router.get('/', getMyApplications);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);
router.post('/:id/submit', submitApplication);
router.delete('/:id', cancelApplication);
router.get('/:id/status-history', getStatusHistory);
export default router;
