import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Clock, TrendingUp } from 'lucide-react';
import { APP_NAME } from '../../config/constants.js';

const VaultScene = lazy(() => import('../three/VaultScene.jsx'));

export default function HeroSection() {
  return (
    <section id="hero-section" className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.jpg')" }} />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/95 via-navy-deep/80 to-transparent" />

      <Suspense fallback={null}>
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-60">
          <VaultScene className="w-full h-full" />
        </div>
      </Suspense>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20">
        <motion.div className="max-w-2xl"
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.25,0.46,0.45,0.94] }}>
          <motion.p className="text-gold-primary text-sm font-semibold tracking-[0.3em] uppercase mb-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            Trusted Banking Excellence
          </motion.p>

          <h1 className="text-display text-5xl md:text-7xl font-bold leading-tight mb-6">
            <span className="text-platinum">Your Dreams,</span><br />
            <span className="gold-text">Our Commitment</span>
          </h1>

          <p className="text-heading text-xl text-silver mb-10 leading-relaxed">
            Premier Bank offers tailored loan solutions with competitive rates and seamless digital experience. Personal, Home, Auto and more.
          </p>

          <div className="flex flex-wrap gap-4 mb-16">
            <Link to="/apply" className="btn-gold flex items-center gap-2">
              Apply for a Loan <ArrowRight size={16} />
            </Link>
            <Link to="/calculator" className="btn-outline-gold">
              Calculate EMI
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: Shield,    label: 'Secure & Licensed', value: 'RBI Regulated' },
              { icon: Clock,     label: 'Fast Approval',     value: '48-Hour Process' },
              { icon: TrendingUp,label: 'Low Interest',      value: 'From 7.5% p.a.' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold-primary/10 rounded-sm flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-gold-primary" />
                </div>
                <div>
                  <p className="text-platinum text-sm font-medium">{label}</p>
                  <p className="text-muted text-xs">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gold-primary/40 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-gold-primary rounded-full" />
        </div>
      </div>
    </section>
  );
}
