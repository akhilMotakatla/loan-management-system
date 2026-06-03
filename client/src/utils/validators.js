import { z } from 'zod';

export const loginSchema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'Min 2 characters'),
  lastName:  z.string().min(2, 'Min 2 characters'),
  email:     z.string().email('Invalid email'),
  password:  z.string().min(8, 'Min 8 characters'),
  phone:     z.string().min(10, 'Min 10 digits'),
});

export const loanApplicationSchema = z.object({
  loanType: z.enum(['personal','home','auto','other']),
  loanDetails: z.object({
    requestedAmount: z.number().min(1000, 'Minimum $1,000'),
    requestedTenure: z.number().min(3).max(360),
    purpose:         z.string().min(5),
  }),
});
