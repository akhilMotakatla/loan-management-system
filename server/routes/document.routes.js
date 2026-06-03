import { Router } from 'express';
import { uploadDocument, getMyDocuments, getDocumentById, deleteDocument, attachToApplication } from '../controllers/document.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();
router.use(verifyJWT);
router.post('/upload', upload.single('file'), uploadDocument);
router.get('/', getMyDocuments);
router.get('/:id', getDocumentById);
router.delete('/:id', deleteDocument);
router.post('/:appId/attach/:docId', attachToApplication);
export default router;
