import mongoose from 'mongoose';

const installmentSchema = new mongoose.Schema({
  installmentNo: Number, dueDate: Date,
  emiAmount: Number, principal: Number, interest: Number, balance: Number,
  status:   { type: String, enum: ['pending','paid','overdue'], default: 'pending' },
  paidDate: Date, paidAmount: Number,
});

const loanSchema = new mongoose.Schema({
  loanNumber:         { type: String, unique: true },
  application:        { type: mongoose.Schema.Types.ObjectId, ref: 'LoanApplication', required: true },
  borrower:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  loanType:           { type: String, enum: ['personal','home','auto','other'] },
  principalAmount:    { type: Number, required: true },
  outstandingBalance: { type: Number, required: true },
  interestRate:       { type: Number, required: true },
  tenure:             { type: Number, required: true },
  emiAmount:          { type: Number, required: true },
  processingFee:      { type: Number, default: 0 },
  disbursementDate:   { type: Date, required: true },
  nextDueDate:        { type: Date, required: true },
  maturityDate:       { type: Date, required: true },
  lastPaymentDate:    Date,
  status:             { type: String, enum: ['active','closed','defaulted','foreclosed'], default: 'active' },
  repaymentSchedule:  [installmentSchema],
  overdueAmount:      { type: Number, default: 0 },
  totalPaid:          { type: Number, default: 0 },
  payments:           [{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }],
}, { timestamps: true });

loanSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Loan').countDocuments();
    const year  = new Date().getFullYear();
    this.loanNumber = `LN-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

export default mongoose.model('Loan', loanSchema);
