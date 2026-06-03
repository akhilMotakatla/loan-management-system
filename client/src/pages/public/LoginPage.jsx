import { lazy, Suspense, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Lock, Mail } from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';
import { loginSchema } from '../../utils/validators.js';
import toast from 'react-hot-toast';
import { APP_NAME } from '../../config/constants.js';

const AtmosphericBg = lazy(() => import('../../components/three/AtmosphericBg.jsx'));

const perks = ['Apply for loans in minutes', 'Real-time status tracking', 'Rates from 7.5% p.a.', 'Dedicated relationship manager'];

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from     = location.state?.from?.pathname || '/dashboard';
  const [showPwd, setShowPwd] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      const user = await login(data);
      toast.success(`Welcome back, ${user.firstName}!`);
      navigate(user.role !== 'customer' ? '/admin' : from, { replace: true });
    } catch (e) { toast.error(e.response?.data?.message || 'Invalid credentials'); }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#03020A' }}>

      {/* Left — branding panel */}
      <div className="hidden lg:flex flex-col justify-between w-[44%] relative overflow-hidden p-12"
        style={{ background: 'linear-gradient(145deg,#070515 0%,#0e1035 100%)' }}>
        <Suspense fallback={null}><AtmosphericBg className="absolute inset-0 opacity-40" /></Suspense>
        <div className="absolute inset-0 bg-gradient-to-br from-[#070515]/80 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_30%_20%,rgba(212,175,55,0.12),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#8B6914,#D4AF37,#FFD700,#B8860B)' }}>
            <span className="text-navy-deep font-bold text-lg font-display">P</span>
          </div>
          <div>
            <span className="text-display text-xl font-bold gold-text">{APP_NAME}</span>
            <p className="text-muted text-[9px] tracking-[0.25em] uppercase">Est. 1985</p>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-display text-4xl font-bold text-platinum leading-tight mb-5">
            Welcome Back<br />to <span className="gold-text">Excellence</span>
          </h2>
          <p className="text-silver text-sm leading-relaxed mb-8 max-w-xs">Your premier banking portal awaits — manage loans, track applications, and achieve your financial goals.</p>
          <ul className="space-y-3">
            {perks.map(p => (
              <li key={p} className="flex items-center gap-3 text-sm text-silver">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-primary flex-shrink-0" />{p}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 border-l-2 border-gold-primary/30 pl-4">
          <p className="text-muted text-xs italic">"Banking excellence redefined for the modern generation."</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(212,175,55,0.04),transparent_65%)] pointer-events-none" />

        <motion.div className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}>

          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#8B6914,#D4AF37)' }}>
              <span className="text-navy-deep font-bold font-display">P</span>
            </div>
            <span className="text-display text-xl font-bold gold-text">{APP_NAME}</span>
          </div>

          <div className="mb-8">
            <h1 className="text-display text-3xl font-bold text-platinum mb-1">Sign In</h1>
            <p className="text-silver text-sm">Access your Premier Bank account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-[11px] text-silver tracking-[0.12em] uppercase mb-2">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input type="email" {...register('email')} placeholder="you@email.com"
                  className={`input-luxury pl-10 ${errors.email ? 'border-ruby' : ''}`} />
              </div>
              {errors.email && <p className="text-ruby text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[11px] text-silver tracking-[0.12em] uppercase">Password</label>
                <Link to="/forgot-password" className="text-gold-primary text-xs hover:text-gold-bright transition-colors">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                <input type={showPwd ? 'text' : 'password'} {...register('password')} placeholder="••••••••"
                  className={`input-luxury pl-10 pr-10 ${errors.password ? 'border-ruby' : ''}`} />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-silver transition-colors">
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-ruby text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-gold w-full justify-center py-4 shadow-gold mt-1">
              {isLoading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-navy-deep border-t-transparent rounded-full animate-spin" />Signing in…</span>
                : <span className="flex items-center gap-2">Sign In <ArrowRight size={14} /></span>}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-navy-light" />
            <span className="text-muted text-xs">New to Premier Bank?</span>
            <div className="flex-1 h-px bg-navy-light" />
          </div>

          <Link to="/register" className="btn-outline-gold w-full block text-center py-3.5">Create Free Account</Link>

          <p className="text-center text-muted text-[10px] mt-6">
            By signing in you agree to our <Link to="/" className="text-gold-dark hover:text-gold-primary transition-colors">Terms</Link> and <Link to="/" className="text-gold-dark hover:text-gold-primary transition-colors">Privacy Policy</Link>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
