import Loan from '../models/Loan.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getMyLoans = async (req, res, next) => {
  try {
    const loans = await Loan.find({ borrower: req.user._id, status: { $ne: 'closed' } }).sort('-createdAt');
    res.json(new ApiResponse(200, loans));
  } catch (err) { next(err); }
};

export const getLoanById = async (req, res, next) => {
  try {
    const loan = await Loan.findOne({ _id: req.params.id, borrower: req.user._id })
      .populate('application', 'applicationNumber loanType');
    if (!loan) throw new ApiError(404, 'Loan not found');
    res.json(new ApiResponse(200, loan));
  } catch (err) { next(err); }
};

export const getLoanSchedule = async (req, res, next) => {
  try {
    const loan = await Loan.findOne({ _id: req.params.id, borrower: req.user._id }).select('repaymentSchedule emiAmount');
    if (!loan) throw new ApiError(404, 'Not found');
    res.json(new ApiResponse(200, loan.repaymentSchedule));
  } catch (err) { next(err); }
};

export const getLoanPayments = async (req, res, next) => {
  try {
    const loan = await Loan.findOne({ _id: req.params.id, borrower: req.user._id }).populate('payments');
    if (!loan) throw new ApiError(404, 'Not found');
    res.json(new ApiResponse(200, loan.payments));
  } catch (err) { next(err); }
};
