import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.model.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const existing = await User.findOne({ role: 'admin' });
  if (existing) { console.log('Admin already exists:', existing.email); process.exit(0); }
  const admin = await User.create({
    firstName: 'Admin', lastName: 'User',
    email: 'admin@premierbank.com',
    password: 'Admin@1234',
    phone: '1234567890',
    role: 'admin',
    isVerified: true,
    kycStatus: 'verified',
  });
  console.log('Admin created:', admin.email, '| Password: Admin@1234');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
