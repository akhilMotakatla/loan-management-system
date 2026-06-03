import LoanApplication from '../models/LoanApplication.model.js';
import Loan from '../models/Loan.model.js';
import User from '../models/User.model.js';
import Document from '../models/Document.model.js';
import Payment from '../models/Payment.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { calculateEMI, generateAmortizationSchedule } from '../services/loan.service.js';
import { createNotification } from '../services/notification.service.js';
import { sendEmail, applicationStatusEmail } from '../services/email.service.js';
import { INTEREST_RATES, PROCESSING_FEE_PERCENT } from '../config/constants.js';
import { addMonths } from 'date-fns';

export const getDashboard = async (req, res, next) => {
  try {
    const [totalApps, pendingApps, activeLoans, totalUsers, overdueLoans] = await Promise.all([
      LoanApplication.countDocuments(),
      LoanApplication.countDocuments({ status: { $in: ['submitted','under_review'] } }),
      Loan.countDocuments({ status: 'active' }),
      User.countDocuments({ role: 'customer' }),
      Loan.countDocuments({ overdueAmount: { $gt: 0 } }),
    ]);
    const portfolioValue = await Loan.aggregate([{ $match: { status: 'active' } }, { $group: { _id: null, total: { $sum: '$outstandingBalance' } } }]);
    res.json(new ApiResponse(200, { totalApps, pendingApps, activeLoans, totalUsers, overdueLoans, portfolioValue: portfolioValue[0]?.total || 0 }));
  } catch (err) { next(err); }
};

export const getAllApplications = async (req, res, next) => {
  try {
    const { status, loanType, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (loanType) filter.loanType = loanType;
    const skip = (page - 1) * limit;
    const [apps, total] = await Promise.all([
      LoanApplication.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)).populate('applicant', 'firstName lastName email'),
      LoanApplication.countDocuments(filter),
    ]);
    res.json(new ApiResponse(200, { apps, total, page: Number(page), pages: Math.ceil(total / limit) }));
  } catch (err) { next(err); }
};

export const getApplicationDetail = async (req, res, next) => {
  try {
    const app = await LoanApplication.findById(req.params.id)
      .populate('applicant').populate('documents').populate('statusHistory.changedBy', 'firstName lastName role');
    if (!app) throw new ApiError(404, 'Not found');
    res.json(new ApiResponse(200, app));
  } catch (err) { next(err); }
};

export const approveApplication = async (req, res, next) => {
  try {
    const { approvedAmount, approvedTenure, interestRate, conditions } = req.body;
    const app = await LoanApplication.findById(req.params.id).populate('applicant');
    if (!app) throw new ApiError(404, 'Not found');
    if (!['submitted','under_review','docs_required'].includes(app.status)) throw new ApiError(400, 'Cannot approve at this stage');
    const processingFee = (approvedAmount * PROCESSING_FEE_PERCENT) / 100;
    app.status = 'approved';
    app.reviewedBy = req.user._id;
    app.approvalDetails = { approvedAmount, approvedTenure, interestRate, processingFee, conditions: conditions || [], approvedAt: new Date() };
    app.statusHistory.push({ status: 'approved', changedBy: req.user._id, note: `Approved at ${interestRate}%` });
    await app.save();
    await createNotification({ recipient: app.applicant._id, type: 'application_approved', title: 'Loan Approved!', message: `Congratulations! Your application ${app.applicationNumber} has been approved.`, link: `/applications/${app._id}` });
    await sendEmail({ to: app.applicant.email, subject: 'Loan Application Approved', html: applicationStatusEmail(app.applicant.firstName, 'approved', app.applicationNumber) });
    res.json(new ApiResponse(200, app, 'Application approved'));
  } catch (err) { next(err); }
};

export const rejectApplication = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const app = await LoanApplication.findById(req.params.id).populate('applicant');
    if (!app) throw new ApiError(404, 'Not found');
    app.status = 'rejected';
    app.rejectionReason = rejectionReason;
    app.reviewedBy = req.user._id;
    app.statusHistory.push({ status: 'rejected', changedBy: req.user._id, note: rejectionReason });
    await app.save();
    await createNotification({ recipient: app.applicant._id, type: 'application_rejected', title: 'Application Update', message: `Your application ${app.applicationNumber} was not approved. Reason: ${rejectionReason}`, link: `/applications/${app._id}` });
    res.json(new ApiResponse(200, app, 'Application rejected'));
  } catch (err) { next(err); }
};

export const requestDocs = async (req, res, next) => {
  try {
    const { note } = req.body;
    const app = await LoanApplication.findById(req.params.id).populate('applicant');
    if (!app) throw new ApiError(404, 'Not found');
    app.status = 'docs_required';
    app.statusHistory.push({ status: 'docs_required', changedBy: req.user._id, note });
    await app.save();
    await createNotification({ recipient: app.applicant._id, type: 'docs_required', title: 'Documents Required', message: `Additional documents needed for ${app.applicationNumber}: ${note}`, link: `/documents` });
    res.json(new ApiResponse(200, app, 'Docs requested'));
  } catch (err) { next(err); }
};

export const disburseApplication = async (req, res, next) => {
  try {
    const app = await LoanApplication.findById(req.params.id).populate('applicant');
    if (!app) throw new ApiError(404, 'Not found');
    if (app.status !== 'approved') throw new ApiError(400, 'Application must be approved first');
    const { approvedAmount, approvedTenure, interestRate, processingFee } = app.approvalDetails;
    const emi = calculateEMI(approvedAmount, interestRate, approvedTenure);
    const disbursementDate = new Date();
    const schedule = generateAmortizationSchedule(approvedAmount, interestRate, approvedTenure, disbursementDate);
    const loan = await Loan.create({
      application: app._id, borrower: app.applicant._id, loanType: app.loanType,
      principalAmount: approvedAmount, outstandingBalance: approvedAmount,
      interestRate, tenure: approvedTenure, emiAmount: emi, processingFee,
      disbursementDate, nextDueDate: addMonths(disbursementDate, 1),
      maturityDate: addMonths(disbursementDate, approvedTenure),
      repaymentSchedule: schedule,
    });
    app.status = 'disbursed';
    app.statusHistory.push({ status: 'disbursed', changedBy: req.user._id, note: `Loan ${loan.loanNumber} created` });
    await app.save();
    await createNotification({ recipient: app.applicant._id, type: 'loan_disbursed', title: 'Loan Disbursed', message: `Your loan ${loan.loanNumber} of $${approvedAmount} has been disbursed.`, link: `/loans/${loan._id}` });
    res.json(new ApiResponse(201, loan, 'Loan disbursed'));
  } catch (err) { next(err); }
};

export const getAllLoans = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const skip = (page - 1) * limit;
    const [loans, total] = await Promise.all([
      Loan.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)).populate('borrower', 'firstName lastName email'),
      Loan.countDocuments(filter),
    ]);
    res.json(new ApiResponse(200, { loans, total }));
  } catch (err) { next(err); }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role = 'customer' } = req.query;
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find({ role }).sort('-createdAt').skip(skip).limit(Number(limit)),
      User.countDocuments({ role }),
    ]);
    res.json(new ApiResponse(200, { users, total }));
  } catch (err) { next(err); }
};

export const getUserDetail = async (req, res, next) => {
  try {
    const [user, loans, apps] = await Promise.all([
      User.findById(req.params.id),
      Loan.find({ borrower: req.params.id }).sort('-createdAt'),
      LoanApplication.find({ applicant: req.params.id }).sort('-createdAt'),
    ]);
    if (!user) throw new ApiError(404, 'User not found');
    res.json(new ApiResponse(200, { user, loans, applications: apps }));
  } catch (err) { next(err); }
};

export const updateUserKYC = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { kycStatus: req.body.kycStatus }, { new: true });
    if (!user) throw new ApiError(404, 'User not found');
    res.json(new ApiResponse(200, user, 'KYC updated'));
  } catch (err) { next(err); }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    if (!user) throw new ApiError(404, 'User not found');
    res.json(new ApiResponse(200, user, 'Role updated'));
  } catch (err) { next(err); }
};

export const verifyDocument = async (req, res, next) => {
  try {
    const { verificationStatus, rejectionNote } = req.body;
    const doc = await Document.findByIdAndUpdate(req.params.id, { verificationStatus, rejectionNote, verifiedBy: req.user._id }, { new: true });
    if (!doc) throw new ApiError(404, 'Document not found');
    res.json(new ApiResponse(200, doc, 'Document updated'));
  } catch (err) { next(err); }
};

export const getReports = async (req, res, next) => {
  try {
    const [byType, byStatus, monthlyDisbursements] = await Promise.all([
      Loan.aggregate([{ $group: { _id: '$loanType', count: { $sum: 1 }, totalAmount: { $sum: '$principalAmount' } } }]),
      LoanApplication.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Loan.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: { $month: '$disbursementDate' }, count: { $sum: 1 }, amount: { $sum: '$principalAmount' } } },
        { $sort: { '_id': 1 } },
      ]),
    ]);
    res.json(new ApiResponse(200, { byType, byStatus, monthlyDisbursements }));
  } catch (err) { next(err); }
};
