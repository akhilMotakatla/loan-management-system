import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['application_submitted','application_approved','application_rejected',
           'docs_required','loan_disbursed','payment_due','payment_received',
           'payment_overdue','system'],
  },
  title:   { type: String, required: true },
  message: { type: String, required: true },
  link:    String,
  isRead:  { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
