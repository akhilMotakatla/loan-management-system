import '../config/db.js';         // ensures DB file + tables are created
import { initDB } from '../config/db.js';
import User from '../models/User.model.js';
import dotenv from 'dotenv';

dotenv.config();
initDB();

const seed = async () => {
  const existing = User.findOne({ email: 'admin@premierbank.com' });
  if (existing) {
    console.log('Admin already exists:', existing.email);
    process.exit(0);
  }
  const admin = await User.create({
    firstName: 'Admin',
    lastName:  'User',
    email:     'admin@premierbank.com',
    password:  'Admin@1234',
    phone:     '1234567890',
    role:      'admin',
  });
  // Mark as verified
  User.update(admin.id, { isVerified: 1, kycStatus: 'verified' });
  console.log('Admin created:', admin.email);
  console.log('Password: Admin@1234');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
