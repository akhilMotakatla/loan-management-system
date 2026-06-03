import { lazy, Suspense } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore.js';
import { loginSchema } from '../../utils/validators.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import toast from 'react-hot-toast';
import { APP_NAME } from '../../config/constants.js';

const AtmosphericBg = lazy(() => import('../../components/three/AtmosphericBg.jsx'));

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.firstName}!`);
      navigate(user.role !== 'customer' ? '/admin' : '/dashboard');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 bg-navy-deep">
      <Suspense fallback={null}>
        <AtmosphericBg className="absolute inset-0" />
      </Suspense>

      <motion.div className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gold-gradient rounded-sm flex items-center justify-center">
              <span className="text-navy-deep font-bold">P</span>
            </div>
            <span className="text-display text-2xl font-bold gold-text">{APP_NAME}</span>
          </Link>
          <h1 className="text-display text-3xl text-platinum font-bold">Welcome Back</h1>
          <p className="text-silver mt-2">Sign in to access your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card rounded-sm p-8 space-y-5">
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} placeholder="you@email.com" />
          <Input label="Password" type="password" {...register('password')} error={errors.password?.message} placeholder="••••••••" />
          <div className="text-right">
            <Link to="/forgot-password" className="text-gold-primary text-xs hover:underline">Forgot password?</Link>
          </div>
          <Button type="submit" loading={isLoading} className="w-full">Sign In</Button>
          <p className="text-center text-muted text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-gold-primary hover:underline">Create one</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
