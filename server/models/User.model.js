import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  firstName:   { type: String, required: true, trim: true },
  lastName:    { type: String, required: true, trim: true },
  email:       { type: String, required: true, unique: true, lowercase: true },
  password:    { type: String, required: true, select: false },
  phone:       { type: String, required: true },
  dateOfBirth: Date,
  address: {
    street: String, city: String, state: String,
    zipCode: String, country: { type: String, default: 'US' },
  },
  employmentInfo: {
    status:        { type: String, enum: ['employed','self-employed','unemployed','retired'] },
    employerName:  String,
    annualIncome:  Number,
    yearsEmployed: Number,
  },
  creditScore:  { type: Number, min: 300, max: 850 },
  role:         { type: String, enum: ['customer','admin','officer'], default: 'customer' },
  isVerified:   { type: Boolean, default: false },
  isActive:     { type: Boolean, default: true },
  avatar:       String,
  kycStatus:    { type: String, enum: ['pending','verified','rejected'], default: 'pending' },
  refreshToken: { type: String, select: false },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model('User', userSchema);
