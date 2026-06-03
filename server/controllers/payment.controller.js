import Payment from '../models/Payment.model.js';
import Loan from '../models/Loan.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { createNotification } from '../services/notification.service.js';

export const initiatePayment = (req, res, next) => {
  try {
    const { loanId, amount, paymentMethod, transactionId, remarks } = req.body;
    const loan = Loan.findById(loanId);
    if (!loan || loan.borrowerId !== req.user.id) throw new ApiError(404, 'Loan not found');

    const payment = Payment.create({
      loanId, borrowerId: req.user.id, amount, paymentMethod, transactionId, remarks,
    });
    res.status(201).json(new ApiResponse(201, payment, 'Payment initiated'));
  } catch (err) { next(err); }
};

export const confirmPayment = (req, res, next) => {
  try {
    const payment = Payment.findById(req.params.id);
    if (!payment || payment.borrowerId !== req.user.id) throw new ApiError(404, 'Payment not found');

    Payment.update(payment.id, { status: 'completed' });

    const loan = Loan.findById(payment.loanId);
    const newBalance = Math.max(0, loan.outstandingBalance - payment.amount);
    const newTotal   = loan.totalPaid + payment.amount;
    const newPayments = [...(loan.payments || []), payment.id];

    // Mark next pending instalment as paid
    const schedule = loan.repaymentSchedule || [];
    const nextDue = schedule.find(s => s.status === 'pending');
    if (nextDue) {
      nextDue.status    = 'paid';
      nextDue.paidDate  = new Date().toISOString();
      nextDue.paidAmount = payment.amount;
    }

    Loan.update(loan.id, {
      outstandingBalance: newBalance,
      totalPaid:          newTotal,
      lastPaymentDate:    new Date().toISOString(),
      payments:           newPayments,
      repaymentSchedule:  schedule,
      ...(newBalance <= 0 && { status: 'closed' }),
    });

    createNotification({
      recipientId: req.user.id,
      type: 'payment_received',
      title: 'Payment Confirmed',
      message: `Payment of $${payment.amount} received for loan ${loan.loanNumber}.`,
      link: `/loans/${loan.id}`,
    });

    res.json(new ApiResponse(200, Payment.findById(payment.id), 'Payment confirmed'));
  } catch (err) { next(err); }
};

export const getMyPayments = (req, res, next) => {
  try {
    const { rows } = Payment.find({ borrowerId: req.user.id });
    res.json(new ApiResponse(200, rows));
  } catch (err) { next(err); }
};

export const getPaymentById = (req, res, next) => {
  try {
    const payment = Payment.findById(req.params.id);
    if (!payment || payment.borrowerId !== req.user.id) throw new ApiError(404, 'Payment not found');
    res.json(new ApiResponse(200, payment));
  } catch (err) { next(err); }
};
