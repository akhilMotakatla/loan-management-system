import LoanApplication from '../models/LoanApplication.model.js';
import Loan from '../models/Loan.model.js';
import User from '../models/User.model.js';
import Document from '../models/Document.model.js';
import Payment from '../models/Payment.model.js';
import Notification from '../models/Notification.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { calculateEMI, generateAmortizationSchedule } from '../services/loan.service.js';
import { createNotification } from '../services/notification.service.js';
import { INTEREST_RATES, PROCESSING_FEE_PERCENT } from '../config/constants.js';
import { addMonths } from 'date-fns';

export const getDashboard = (req, res, next) => {
  try {
    const totalApps    = LoanApplication.countDocuments();
    const pendingApps  = LoanApplication.countDocuments({ status: ['submitted','under_review'] });
    const activeLoans  = Loan.countDocuments({ status: 'active' });
    const totalUsers   = User.countDocuments();
    const portfolioValue = Loan.sumOutstanding();

    res.json(new ApiResponse(200, { totalApps, pendingApps, activeLoans, totalUsers, portfolioValue }));
  } catch (err) { next(err); }
};

export const getAllApplications = (req, res, next) => {
  try {
    const { status, loanType, page = 1, limit = 20 } = req.query;
    const { rows: apps, total } = LoanApplication.findAllAdmin({ status, loanType, page: Number(page), limit: Number(limit) });
    res.json(new ApiResponse(200, { apps, total, page: Number(page), pages: Math.ceil(total / limit) }));
  } catch (err) { next(err); }
};

export const getApplicationDetail = (req, res, next) => {
  try {
    const app = LoanApplication.findById(req.params.id, { populate: true });
    if (!app) throw new ApiError(404, 'Not found');

    // Attach document objects
    const docIds = app.documents || [];
    const documents = docIds.map(id => Document.findById(id)).filter(Boolean);

    res.json(new ApiResponse(200, { ...app, documents }));
  } catch (err) { next(err); }
};

export const approveApplication = (req, res, next) => {
  try {
    const { approvedAmount, approvedTenure, interestRate, conditions } = req.body;
    const app = LoanApplication.findById(req.params.id, { populate: true });
    if (!app) throw new ApiError(404, 'Not found');
    if (!['submitted','under_review','docs_required'].includes(app.status))
      throw new ApiError(400, 'Cannot approve at this stage');

    const processingFee = (approvedAmount * PROCESSING_FEE_PERCENT) / 100;
    const history = [...(app.statusHistory || []), {
      status: 'approved', changedBy: req.user.id,
      note: `Approved at ${interestRate}%`, timestamp: new Date().toISOString(),
    }];

    LoanApplication.update(app.id, {
      status: 'approved',
      reviewedById: req.user.id,
      approvalDetails: { approvedAmount, approvedTenure, interestRate, processingFee, conditions: conditions || [], approvedAt: new Date().toISOString() },
      statusHistory: history,
    });

    createNotification({
      recipientId: app.applicantId,
      type: 'application_approved',
      title: 'Loan Approved!',
      message: `Your application ${app.applicationNumber} has been approved.`,
      link: `/applications/${app.id}`,
    });

    res.json(new ApiResponse(200, LoanApplication.findById(app.id), 'Application approved'));
  } catch (err) { next(err); }
};

export const rejectApplication = (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const app = LoanApplication.findById(req.params.id, { populate: true });
    if (!app) throw new ApiError(404, 'Not found');

    const history = [...(app.statusHistory || []), {
      status: 'rejected', changedBy: req.user.id, note: rejectionReason, timestamp: new Date().toISOString(),
    }];

    LoanApplication.update(app.id, {
      status: 'rejected',
      rejectionReason,
      reviewedById: req.user.id,
      statusHistory: history,
    });

    createNotification({
      recipientId: app.applicantId,
      type: 'application_rejected',
      title: 'Application Update',
      message: `Your application ${app.applicationNumber} was not approved. Reason: ${rejectionReason}`,
      link: `/applications/${app.id}`,
    });

    res.json(new ApiResponse(200, LoanApplication.findById(app.id), 'Application rejected'));
  } catch (err) { next(err); }
};

export const requestDocs = (req, res, next) => {
  try {
    const { note } = req.body;
    const app = LoanApplication.findById(req.params.id, { populate: true });
    if (!app) throw new ApiError(404, 'Not found');

    const history = [...(app.statusHistory || []), {
      status: 'docs_required', changedBy: req.user.id, note, timestamp: new Date().toISOString(),
    }];

    LoanApplication.update(app.id, { status: 'docs_required', statusHistory: history });

    createNotification({
      recipientId: app.applicantId,
      type: 'docs_required',
      title: 'Documents Required',
      message: `Additional documents needed for ${app.applicationNumber}: ${note}`,
      link: '/documents',
    });

    res.json(new ApiResponse(200, LoanApplication.findById(app.id), 'Docs requested'));
  } catch (err) { next(err); }
};

export const disburseApplication = (req, res, next) => {
  try {
    const app = LoanApplication.findById(req.params.id, { populate: true });
    if (!app) throw new ApiError(404, 'Not found');
    if (app.status !== 'approved') throw new ApiError(400, 'Application must be approved first');

    const { approvedAmount, approvedTenure, interestRate, processingFee } = app.approvalDetails;
    const emi              = calculateEMI(approvedAmount, interestRate, approvedTenure);
    const disbursementDate = new Date();
    const schedule         = generateAmortizationSchedule(approvedAmount, interestRate, approvedTenure, disbursementDate);

    const loan = Loan.create({
      applicationId:    app.id,
      borrowerId:       app.applicantId,
      loanType:         app.loanType,
      principalAmount:  approvedAmount,
      outstandingBalance: approvedAmount,
      interestRate,
      tenure:           approvedTenure,
      emiAmount:        emi,
      processingFee:    processingFee || 0,
      disbursementDate,
      nextDueDate:      addMonths(disbursementDate, 1),
      maturityDate:     addMonths(disbursementDate, approvedTenure),
      repaymentSchedule: schedule,
    });

    const history = [...(app.statusHistory || []), {
      status: 'disbursed', changedBy: req.user.id,
      note: `Loan ${loan.loanNumber} created`, timestamp: new Date().toISOString(),
    }];
    LoanApplication.update(app.id, { status: 'disbursed', statusHistory: history });

    createNotification({
      recipientId: app.applicantId,
      type: 'loan_disbursed',
      title: 'Loan Disbursed',
      message: `Your loan ${loan.loanNumber} of $${approvedAmount} has been disbursed.`,
      link: `/loans/${loan.id}`,
    });

    res.json(new ApiResponse(201, loan, 'Loan disbursed'));
  } catch (err) { next(err); }
};

export const getAllLoans = (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const { rows: loans, total } = Loan.findAll({ status, page: Number(page), limit: Number(limit) });
    res.json(new ApiResponse(200, { loans, total }));
  } catch (err) { next(err); }
};

export const getAllUsers = (req, res, next) => {
  try {
    const { page = 1, limit = 20, role = 'customer' } = req.query;
    const { rows: users, count: total } = User.find({ role, page: Number(page), limit: Number(limit) });
    res.json(new ApiResponse(200, { users, total }));
  } catch (err) { next(err); }
};

export const getUserDetail = (req, res, next) => {
  try {
    const user = User.findById(req.params.id);
    if (!user) throw new ApiError(404, 'User not found');
    const { rows: loans }        = Loan.find({ borrowerId: req.params.id });
    const { rows: applications } = LoanApplication.find({ applicantId: req.params.id });
    res.json(new ApiResponse(200, { user, loans, applications }));
  } catch (err) { next(err); }
};

export const updateUserKYC = (req, res, next) => {
  try {
    const user = User.update(req.params.id, { kycStatus: req.body.kycStatus });
    if (!user) throw new ApiError(404, 'User not found');
    res.json(new ApiResponse(200, user, 'KYC updated'));
  } catch (err) { next(err); }
};

export const updateUserRole = (req, res, next) => {
  try {
    const user = User.update(req.params.id, { role: req.body.role });
    if (!user) throw new ApiError(404, 'User not found');
    res.json(new ApiResponse(200, user, 'Role updated'));
  } catch (err) { next(err); }
};

export const verifyDocument = (req, res, next) => {
  try {
    const { verificationStatus, rejectionNote } = req.body;
    const doc = Document.update(req.params.id, { verificationStatus, verifiedById: req.user.id, rejectionNote });
    if (!doc) throw new ApiError(404, 'Document not found');
    res.json(new ApiResponse(200, doc, 'Document updated'));
  } catch (err) { next(err); }
};

export const getReports = (req, res, next) => {
  try {
    const byType               = Loan.groupByType();
    const byStatus             = LoanApplication.findAllAdmin({ limit: 1000 }).rows
      .reduce((acc, a) => {
        const found = acc.find(x => x._id === a.status);
        if (found) found.count++;
        else acc.push({ _id: a.status, count: 1 });
        return acc;
      }, []);
    const monthlyDisbursements = Loan.monthlyDisbursements();
    res.json(new ApiResponse(200, { byType, byStatus, monthlyDisbursements }));
  } catch (err) { next(err); }
};
