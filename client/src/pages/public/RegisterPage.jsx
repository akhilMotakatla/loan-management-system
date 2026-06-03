import { lazy, Suspense, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';
import { registerSchema } from '../../utils/validators.js';
import toast from 'react-hot-toast';
import { APP_NAME } from '../../config/constants.js';

const AtmosphericBg = lazy(() => import('../../components/three/AtmosphericBg.jsx'));

const benefits = ['No account opening fees', 'Instant EMI calculator access', 'Track applications in real time', 'Secure document vault', '48-hour loan decision'];

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success('Account created! Welcome to Premier Bank.');
      navigate('/dashboard');
    } catch (e) { toast.error(e.response?.data?.message || 'Registration failed'); }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#03020A' }}>

      {/* Left — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(212,175,55,0.04),transparent_65%)] pointer-events-none" />

        <motion.div className="w-full max-w-lg relative z-10"
          initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}>

          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-sm flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#8B6914,#D4AF37)' }}>
              <span className="text-navy-deep font-bold font-display">P</span>
            </div>
            <span className="text-display text-xl font-bold gold-text">{APP_NAME}</span>
          </div>

          <div className="mb-8">
            <p className="text-gold-primary text-[11px] tracking-[0.25em] uppercase mb-2">Free Account</p>
            <h1 className="text-display text-3xl font-bold text-platinum mb-1">Open Your Account</h1>
            <p className="text-silver text-sm">Join 50,000+ customers — takes under 2 minutes</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-silver tracking-[0.12em] uppercase mb-1.5">First Name</label>
                <div className="relative">
                  <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input {...register('firstName')} placeholder="John" className={`input-luxury pl-9 ${errors.firstName ? 'border-ruby' : ''}`} />
                </div>
                {errors.firstName && <p className="text-ruby text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-[11px] text-silver tracking-[0.12em] uppercase mb-1.5">Last Name</label>
                <div className="relative">
                  <User size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input {...register('lastName')} placeholder="Smith" className={`input-luxury pl-9 ${errors.lastName ? 'border-ruby' : ''}`} />
                </div>
                {errors.lastName && <p className="text-ruby text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-silver tracking-[0.12em] uppercase mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input type="email" {...register('email')} placeholder="john@email.com" className={`input-luxury pl-9 ${errors.email ? 'border-ruby' : ''}`} />
              </div>
              {errors.email && <p className="text-ruby text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] text-silver tracking-[0.12em] uppercase mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input type="tel" {...register('phone')} placeholder="+1 555 000 0000" className={`input-luxury pl-9 ${errors.phone ? 'border-ruby' : ''}`} />
              </div>
              {errors.phone && <p className="text-ruby text-xs mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] text-silver tracking-[0.12em] uppercase mb-1.5">Password</label>
              <div className="relative">
                <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input type={showPwd ? 'text' : 'password'} {...register('password')} placeholder="Min 8 characters" className={`input-luxury pl-9 pr-9 ${errors.password ? 'border-ruby' : ''}`} />
                <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-silver transition-colors">
                  {showPwd ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
              {errors.password && <p className="text-ruby text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-gold w-full justify-center py-4 shadow-gold mt-2">
              {isLoading
                ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-navy-deep border-t-transparent rounded-full animate-spin" />Creating account…</span>
                : <span className="flex items-center gap-2">Create Account <ArrowRight size={14} /></span>}
            </button>
          </form>

          <p className="text-center mt-5 text-sm">
            <span className="text-muted">Already have an account? </span>
            <Link to="/login" className="text-gold-primary hover:text-gold-bright transition-colors font-medium">Sign in</Link>
          </p>

          <p className="text-center text-muted text-[10px] mt-4">
            By creating an account you agree to our <Link to="/" className="text-gold-dark hover:text-gold-primary transition-colors">Terms</Link> and consent to a credit check.
          </p>
        </motion.div>
      </div>

      {/* Right — benefits panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] relative overflow-hidden p-12"
        style={{ background: 'linear-gradient(145deg,#0e1035 0%,#070515 100%)' }}>
        <Suspense fallback={null}><AtmosphericBg className="absolute inset-0 opacity-35" /></Suspense>
        <div className="absolute inset-0 bg-gradient-to-bl from-[#070515]/80 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_70%_80%,rgba(212,175,55,0.1),transparent_70%)] pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3 justify-end">
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
            Everything You <br />Need, <span className="gold-text">Right Here</span>
          </h2>
          <p className="text-silver text-sm leading-relaxed mb-8 max-w-xs">
            A complete banking experience designed around you — fast, transparent, and always secure.
          </p>
          <ul className="space-y-4">
            {benefits.map(b => (
              <li key={b} className="flex items-center gap-3 text-sm text-silver">
                <CheckCircle size={15} className="text-emerald flex-shrink-0" />{b}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 glass-card rounded-sm p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-gold-gradient rounded-full flex items-center justify-center text-navy-deep text-xs font-bold">SJ</div>
            <div>
              <p className="text-platinum text-xs font-semibold">Sarah Johnson</p>
              <p className="text-muted text-[10px]">Home Loan Customer</p>
            </div>
          </div>
          <p className="text-silver text-xs italic">"Easiest loan application I've ever done. Approved in 36 hours."</p>
        </div>
      </div>
    </div>
  );
}
