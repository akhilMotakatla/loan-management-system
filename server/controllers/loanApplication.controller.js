import LoanApplication from '../models/LoanApplication.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { createNotification } from '../services/notification.service.js';

export const createApplication = (req, res, next) => {
  try {
    const app = LoanApplication.create({ ...req.body, applicantId: req.user.id });
    res.status(201).json(new ApiResponse(201, app, 'Application created'));
  } catch (err) { next(err); }
};

export const getMyApplications = (req, res, next) => {
  try {
    const { rows } = LoanApplication.find({ applicantId: req.user.id });
    res.json(new ApiResponse(200, rows));
  } catch (err) { next(err); }
};

export const getApplicationById = (req, res, next) => {
  try {
    const app = LoanApplication.findById(req.params.id);
    if (!app || app.applicantId !== req.user.id) throw new ApiError(404, 'Application not found');
    res.json(new ApiResponse(200, app));
  } catch (err) { next(err); }
};

export const updateApplication = (req, res, next) => {
  try {
    const app = LoanApplication.findById(req.params.id);
    if (!app || app.applicantId !== req.user.id) throw new ApiError(404, 'Application not found');
    if (app.status !== 'draft') throw new ApiError(400, 'Only draft applications can be edited');
    const updated = LoanApplication.update(req.params.id, req.body);
    res.json(new ApiResponse(200, updated, 'Application updated'));
  } catch (err) { next(err); }
};

export const submitApplication = (req, res, next) => {
  try {
    const app = LoanApplication.findById(req.params.id);
    if (!app || app.applicantId !== req.user.id) throw new ApiError(404, 'Application not found');
    if (app.status !== 'draft') throw new ApiError(400, 'Already submitted');

    const history = [...(app.statusHistory || []), {
      status: 'submitted', changedBy: req.user.id,
      timestamp: new Date().toISOString(),
    }];

    LoanApplication.update(req.params.id, {
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      statusHistory: history,
    });

    createNotification({
      recipientId: req.user.id,
      type: 'application_submitted',
      title: 'Application Submitted',
      message: `Your application ${app.applicationNumber} has been submitted.`,
      link: `/applications/${app.id}`,
    });

    res.json(new ApiResponse(200, LoanApplication.findById(req.params.id), 'Application submitted'));
  } catch (err) { next(err); }
};

export const cancelApplication = (req, res, next) => {
  try {
    const app = LoanApplication.findById(req.params.id);
    if (!app || app.applicantId !== req.user.id) throw new ApiError(404, 'Application not found');
    if (!['draft','submitted'].includes(app.status)) throw new ApiError(400, 'Cannot cancel at this stage');

    const history = [...(app.statusHistory || []), {
      status: 'cancelled', changedBy: req.user.id, timestamp: new Date().toISOString(),
    }];

    LoanApplication.update(req.params.id, { status: 'cancelled', statusHistory: history });
    res.json(new ApiResponse(200, LoanApplication.findById(req.params.id), 'Application cancelled'));
  } catch (err) { next(err); }
};

export const getStatusHistory = (req, res, next) => {
  try {
    const app = LoanApplication.findById(req.params.id);
    if (!app || app.applicantId !== req.user.id) throw new ApiError(404, 'Not found');
    res.json(new ApiResponse(200, app.statusHistory || []));
  } catch (err) { next(err); }
};
