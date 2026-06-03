import { lazy, Suspense, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore.js';
import { registerSchema } from '../../utils/validators.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import toast from 'react-hot-toast';
import { APP_NAME } from '../../config/constants.js';

const AtmosphericBg = lazy(() => import('../../components/three/AtmosphericBg.jsx'));

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success('Account created! Welcome to Premier Bank.');
      navigate('/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 bg-navy-deep">
      <Suspense fallback={null}>
        <AtmosphericBg className="absolute inset-0" />
      </Suspense>

      <motion.div className="relative z-10 w-full max-w-lg"
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gold-gradient rounded-sm flex items-center justify-center">
              <span className="text-navy-deep font-bold">P</span>
            </div>
            <span className="text-display text-2xl font-bold gold-text">{APP_NAME}</span>
          </Link>
          <h1 className="text-display text-3xl text-platinum font-bold">Create Account</h1>
          <p className="text-silver mt-2">Start your loan application today</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-sm p-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" {...register('firstName')} error={errors.firstName?.message} placeholder="John" />
            <Input label="Last Name"  {...register('lastName')}  error={errors.lastName?.message}  placeholder="Smith" />
          </div>
          <Input label="Email"    type="email"    {...register('email')}    error={errors.email?.message}    placeholder="john@email.com" />
          <Input label="Phone"    type="tel"      {...register('phone')}    error={errors.phone?.message}    placeholder="+1 555 000 0000" />
          <Input label="Password" type="password" {...register('password')} error={errors.password?.message} placeholder="Min 8 characters" />
          <Button type="submit" loading={isLoading} className="w-full mt-2">Create Account</Button>
          <p className="text-center text-muted text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-gold-primary hover:underline">Sign in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
