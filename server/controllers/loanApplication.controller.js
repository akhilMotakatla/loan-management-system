import LoanApplication from '../models/LoanApplication.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { createNotification } from '../services/notification.service.js';
import { sendEmail, applicationStatusEmail } from '../services/email.service.js';

export const createApplication = async (req, res, next) => {
  try {
    const app = await LoanApplication.create({ ...req.body, applicant: req.user._id });
    res.status(201).json(new ApiResponse(201, app, 'Application created'));
  } catch (err) { next(err); }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const apps = await LoanApplication.find({ applicant: req.user._id })
      .sort('-createdAt').populate('documents');
    res.json(new ApiResponse(200, apps));
  } catch (err) { next(err); }
};

export const getApplicationById = async (req, res, next) => {
  try {
    const app = await LoanApplication.findOne({ _id: req.params.id, applicant: req.user._id })
      .populate('documents').populate('statusHistory.changedBy', 'firstName lastName');
    if (!app) throw new ApiError(404, 'Application not found');
    res.json(new ApiResponse(200, app));
  } catch (err) { next(err); }
};

export const updateApplication = async (req, res, next) => {
  try {
    const app = await LoanApplication.findOne({ _id: req.params.id, applicant: req.user._id });
    if (!app) throw new ApiError(404, 'Application not found');
    if (app.status !== 'draft') throw new ApiError(400, 'Only draft applications can be edited');
    Object.assign(app, req.body);
    await app.save();
    res.json(new ApiResponse(200, app, 'Application updated'));
  } catch (err) { next(err); }
};

export const submitApplication = async (req, res, next) => {
  try {
    const app = await LoanApplication.findOne({ _id: req.params.id, applicant: req.user._id });
    if (!app) throw new ApiError(404, 'Application not found');
    if (app.status !== 'draft') throw new ApiError(400, 'Already submitted');
    app.status = 'submitted';
    app.submittedAt = new Date();
    app.statusHistory.push({ status: 'submitted', changedBy: req.user._id });
    await app.save();
    await createNotification({ recipient: req.user._id, type: 'application_submitted', title: 'Application Submitted', message: `Your application ${app.applicationNumber} has been submitted successfully.`, link: `/applications/${app._id}` });
    await sendEmail({ to: req.user.email, subject: 'Application Submitted', html: applicationStatusEmail(req.user.firstName, 'submitted', app.applicationNumber) });
    res.json(new ApiResponse(200, app, 'Application submitted'));
  } catch (err) { next(err); }
};

export const cancelApplication = async (req, res, next) => {
  try {
    const app = await LoanApplication.findOne({ _id: req.params.id, applicant: req.user._id });
    if (!app) throw new ApiError(404, 'Application not found');
    if (!['draft','submitted'].includes(app.status)) throw new ApiError(400, 'Cannot cancel at this stage');
    app.status = 'cancelled';
    app.statusHistory.push({ status: 'cancelled', changedBy: req.user._id });
    await app.save();
    res.json(new ApiResponse(200, app, 'Application cancelled'));
  } catch (err) { next(err); }
};

export const getStatusHistory = async (req, res, next) => {
  try {
    const app = await LoanApplication.findOne({ _id: req.params.id, applicant: req.user._id })
      .populate('statusHistory.changedBy', 'firstName lastName role');
    if (!app) throw new ApiError(404, 'Not found');
    res.json(new ApiResponse(200, app.statusHistory));
  } catch (err) { next(err); }
};
