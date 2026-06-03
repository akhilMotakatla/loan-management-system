import Joi from 'joi';

export const createApplicationSchema = Joi.object({
  loanType: Joi.string().valid('personal','home','auto','other').required(),
  loanDetails: Joi.object({
    requestedAmount: Joi.number().min(1000).required(),
    requestedTenure: Joi.number().min(3).max(360).required(),
    purpose:         Joi.string().min(5).required(),
    collateral:      Joi.string().optional(),
    propertyAddress: Joi.string().optional(),
    vehicleMake:     Joi.string().optional(),
    vehicleModel:    Joi.string().optional(),
    vehicleYear:     Joi.number().min(1980).optional(),
  }).required(),
  financialSnapshot: Joi.object({
    declaredIncome:  Joi.number().optional(),
    existingLoans:   Joi.number().optional(),
    monthlyExpenses: Joi.number().optional(),
    creditScore:     Joi.number().min(300).max(850).optional(),
  }).optional(),
});
