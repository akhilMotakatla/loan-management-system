import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  status:    String,
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  note:      String,
  timestamp: { type: Date, default: Date.now },
});

const loanApplicationSchema = new mongoose.Schema({
  applicationNumber: { type: String, unique: true },
  applicant:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  loanType:   { type: String, enum: ['personal','home','auto','other'], required: true },

  loanDetails: {
    requestedAmount: { type: Number, required: true },
    requestedTenure: { type: Number, required: true },
    purpose:         { type: String, required: true },
    collateral:      String,
    propertyAddress: String,
    vehicleMake:     String,
    vehicleModel:    String,
    vehicleYear:     Number,
  },

  financialSnapshot: {
    declaredIncome: Number, existingLoans: Number,
    monthlyExpenses: Number, creditScore: Number,
  },

  status: {
    type: String,
    enum: ['draft','submitted','under_review','docs_required','approved','rejected','disbursed','cancelled'],
    default: 'draft',
  },

  statusHistory:   [statusHistorySchema],

  approvalDetails: {
    approvedAmount: Number, approvedTenure: Number,
    interestRate: Number, processingFee: Number,
    conditions: [String], approvedAt: Date,
  },

  rejectionReason: String,
  internalNotes:   String,
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  submittedAt: Date,
}, { timestamps: true });

loanApplicationSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('LoanApplication').countDocuments();
    const year  = new Date().getFullYear();
    this.applicationNumber = `APP-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

export default mongoose.model('LoanApplication', loanApplicationSchema);
