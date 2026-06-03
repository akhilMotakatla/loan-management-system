import Joi from 'joi';

export const createPaymentSchema = Joi.object({
  loanId:        Joi.string().required(),
  amount:        Joi.number().min(1).required(),
  paymentMethod: Joi.string().valid('bank_transfer','card','upi','check').required(),
  transactionId: Joi.string().optional(),
  remarks:       Joi.string().optional(),
});
