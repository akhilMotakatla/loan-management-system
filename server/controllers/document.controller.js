import Document from '../models/Document.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinary.service.js';
import LoanApplication from '../models/LoanApplication.model.js';

export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, 'No file provided');
    const { documentType, documentName, description } = req.body;
    const folder = `loan-mgmt/${req.user._id}/documents/${documentType || 'other'}`;
    const result = await uploadToCloudinary(req.file.buffer, folder, req.file.mimetype);
    const doc = await Document.create({
      owner: req.user._id, documentType, documentName, description,
      fileUrl: result.secure_url, publicId: result.public_id,
      fileType: req.file.mimetype, fileSize: req.file.size,
    });
    res.status(201).json(new ApiResponse(201, doc, 'Document uploaded'));
  } catch (err) { next(err); }
};

export const getMyDocuments = async (req, res, next) => {
  try {
    const docs = await Document.find({ owner: req.user._id }).sort('-createdAt');
    res.json(new ApiResponse(200, docs));
  } catch (err) { next(err); }
};

export const getDocumentById = async (req, res, next) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, owner: req.user._id });
    if (!doc) throw new ApiError(404, 'Document not found');
    res.json(new ApiResponse(200, doc));
  } catch (err) { next(err); }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findOne({ _id: req.params.id, owner: req.user._id });
    if (!doc) throw new ApiError(404, 'Document not found');
    if (doc.publicId) await deleteFromCloudinary(doc.publicId).catch(() => {});
    await doc.deleteOne();
    res.json(new ApiResponse(200, null, 'Document deleted'));
  } catch (err) { next(err); }
};

export const attachToApplication = async (req, res, next) => {
  try {
    const { appId, docId } = req.params;
    const app = await LoanApplication.findOne({ _id: appId, applicant: req.user._id });
    if (!app) throw new ApiError(404, 'Application not found');
    const doc = await Document.findOne({ _id: docId, owner: req.user._id });
    if (!doc) throw new ApiError(404, 'Document not found');
    if (!app.documents.includes(docId)) app.documents.push(docId);
    doc.application = appId;
    await Promise.all([app.save(), doc.save()]);
    res.json(new ApiResponse(200, null, 'Document attached'));
  } catch (err) { next(err); }
};
