import Loan from '../models/Loan.model.js';
import Payment from '../models/Payment.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getMyLoans = (req, res, next) => {
  try {
    const { rows } = Loan.find({ borrowerId: req.user.id });
    res.json(new ApiResponse(200, rows));
  } catch (err) { next(err); }
};

export const getLoanById = (req, res, next) => {
  try {
    const loan = Loan.findById(req.params.id);
    if (!loan || loan.borrowerId !== req.user.id) throw new ApiError(404, 'Loan not found');
    res.json(new ApiResponse(200, loan));
  } catch (err) { next(err); }
};

export const getLoanSchedule = (req, res, next) => {
  try {
    const loan = Loan.findById(req.params.id);
    if (!loan || loan.borrowerId !== req.user.id) throw new ApiError(404, 'Not found');
    res.json(new ApiResponse(200, loan.repaymentSchedule || []));
  } catch (err) { next(err); }
};

export const getLoanPayments = (req, res, next) => {
  try {
    const loan = Loan.findById(req.params.id);
    if (!loan || loan.borrowerId !== req.user.id) throw new ApiError(404, 'Not found');
    const { rows } = Payment.find({ loanId: loan.id });
    res.json(new ApiResponse(200, rows));
  } catch (err) { next(err); }
};
