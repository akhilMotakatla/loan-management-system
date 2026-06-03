import path from 'path';
import fs from 'fs';
import Document from '../models/Document.model.js';
import LoanApplication from '../models/LoanApplication.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const uploadDocument = (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, 'No file provided');
    const { documentType, documentName, description } = req.body;

    // req.file.path is the absolute path on disk; build a URL-accessible path
    const fileUrl = `/uploads/${req.user.id}/${req.file.filename}`;

    const doc = Document.create({
      ownerId:      req.user.id,
      documentType: documentType || 'other',
      documentName: documentName || req.file.originalname,
      description:  description || null,
      fileUrl,
      fileName:     req.file.filename,
      fileType:     req.file.mimetype,
      fileSize:     req.file.size,
    });

    res.status(201).json(new ApiResponse(201, doc, 'Document uploaded'));
  } catch (err) { next(err); }
};

export const getMyDocuments = (req, res, next) => {
  try {
    const docs = Document.find({ ownerId: req.user.id });
    res.json(new ApiResponse(200, docs));
  } catch (err) { next(err); }
};

export const getDocumentById = (req, res, next) => {
  try {
    const doc = Document.findById(req.params.id);
    if (!doc || doc.ownerId !== req.user.id) throw new ApiError(404, 'Document not found');
    res.json(new ApiResponse(200, doc));
  } catch (err) { next(err); }
};

export const deleteDocument = (req, res, next) => {
  try {
    const doc = Document.findById(req.params.id);
    if (!doc || doc.ownerId !== req.user.id) throw new ApiError(404, 'Document not found');

    // Delete physical file
    const fullPath = path.join(process.cwd(), doc.fileUrl);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);

    Document.delete(doc.id);
    res.json(new ApiResponse(200, null, 'Document deleted'));
  } catch (err) { next(err); }
};

export const attachToApplication = (req, res, next) => {
  try {
    const { appId, docId } = req.params;
    const app = LoanApplication.findById(appId);
    if (!app || app.applicantId !== req.user.id) throw new ApiError(404, 'Application not found');

    const doc = Document.findById(docId);
    if (!doc || doc.ownerId !== req.user.id) throw new ApiError(404, 'Document not found');

    const docs = [...new Set([...(app.documents || []), docId])];
    LoanApplication.update(appId, { documents: docs });
    Document.update(docId, { applicationId: appId });

    res.json(new ApiResponse(200, null, 'Document attached'));
  } catch (err) { next(err); }
};
