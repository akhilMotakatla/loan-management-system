import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  paymentReference: { type: String, unique: true },
  loan:     { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount:         { type: Number, required: true },
  principalPaid:  Number,
  interestPaid:   Number,
  lateFee:        { type: Number, default: 0 },
  paymentMethod:  { type: String, enum: ['bank_transfer','card','upi','check'] },
  transactionId:  String,
  bankReference:  String,
  status: { type: String, enum: ['pending','processing','completed','failed','reversed'], default: 'pending' },
  installmentsCovered: [Number],
  remarks: String,
}, { timestamps: true });

paymentSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Payment').countDocuments();
    const year  = new Date().getFullYear();
    this.paymentReference = `PAY-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

export default mongoose.model('Payment', paymentSchema);
