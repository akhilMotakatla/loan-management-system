import Joi from 'joi';

// Helper: accept a number OR an empty string/null (form fields often send '' when blank)
const optionalNumber = (schema = Joi.number()) =>
  Joi.alternatives().try(schema, Joi.string().allow('').empty(''), Joi.valid(null)).optional();

export const createApplicationSchema = Joi.object({
  loanType: Joi.string().valid('personal', 'home', 'auto', 'other').required(),

  loanDetails: Joi.object({
    requestedAmount: Joi.number().min(1000).required(),
    requestedTenure: Joi.number().min(3).max(360).required(),
    purpose:         Joi.string().min(3).required(),
    collateral:      Joi.string().allow('', null).optional(),
    propertyAddress: Joi.string().allow('', null).optional(),
    vehicleMake:     Joi.string().allow('', null).optional(),
    vehicleModel:    Joi.string().allow('', null).optional(),
    vehicleYear:     optionalNumber(Joi.number().min(1980)),
  }).required(),

  financialSnapshot: Joi.object({
    declaredIncome:  optionalNumber(),
    existingLoans:   optionalNumber(),
    monthlyExpenses: optionalNumber(),
    creditScore:     optionalNumber(Joi.number().min(300).max(850)),
  }).optional(),
});
