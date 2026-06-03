import Payment from '../models/Payment.model.js';
import Loan from '../models/Loan.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { createNotification } from '../services/notification.service.js';

export const initiatePayment = async (req, res, next) => {
  try {
    const { loanId, amount, paymentMethod, transactionId, remarks } = req.body;
    const loan = await Loan.findOne({ _id: loanId, borrower: req.user._id });
    if (!loan) throw new ApiError(404, 'Loan not found');
    const payment = await Payment.create({ loan: loanId, borrower: req.user._id, amount, paymentMethod, transactionId, remarks, status: 'processing' });
    res.status(201).json(new ApiResponse(201, payment, 'Payment initiated'));
  } catch (err) { next(err); }
};

export const confirmPayment = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, borrower: req.user._id });
    if (!payment) throw new ApiError(404, 'Payment not found');
    payment.status = 'completed';
    await payment.save();
    const loan = await Loan.findById(payment.loan);
    loan.totalPaid += payment.amount;
    loan.outstandingBalance = Math.max(0, loan.outstandingBalance - payment.amount);
    loan.lastPaymentDate = new Date();
    loan.payments.push(payment._id);
    const nextDue = loan.repaymentSchedule.find(s => s.status === 'pending');
    if (nextDue) { nextDue.status = 'paid'; nextDue.paidDate = new Date(); nextDue.paidAmount = payment.amount; }
    if (loan.outstandingBalance <= 0) loan.status = 'closed';
    await loan.save();
    await createNotification({ recipient: req.user._id, type: 'payment_received', title: 'Payment Confirmed', message: `Payment of $${payment.amount} received for loan ${loan.loanNumber}.`, link: `/loans/${loan._id}` });
    res.json(new ApiResponse(200, payment, 'Payment confirmed'));
  } catch (err) { next(err); }
};

export const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ borrower: req.user._id }).sort('-createdAt').populate('loan', 'loanNumber');
    res.json(new ApiResponse(200, payments));
  } catch (err) { next(err); }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, borrower: req.user._id }).populate('loan', 'loanNumber');
    if (!payment) throw new ApiError(404, 'Payment not found');
    res.json(new ApiResponse(200, payment));
  } catch (err) { next(err); }
};
