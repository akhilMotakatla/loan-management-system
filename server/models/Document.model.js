import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'LoanApplication' },
  documentType: {
    type: String,
    enum: ['identity','address_proof','income_proof','bank_statement',
           'property_document','vehicle_document','tax_return','other'],
  },
  documentName: { type: String, required: true },
  description:  String,
  fileUrl:      { type: String, required: true },
  publicId:     String,
  fileType:     String,
  fileSize:     Number,
  verificationStatus: { type: String, enum: ['pending','verified','rejected'], default: 'pending' },
  verifiedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rejectionNote: String,
}, { timestamps: true });

export default mongoose.model('Document', documentSchema);
