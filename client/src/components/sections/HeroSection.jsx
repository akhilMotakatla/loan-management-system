import { Suspense, lazy, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Clock, TrendingUp, ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';

const BankEntranceScene = lazy(() => import('../three/BankEntranceScene.jsx'));

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18 } },
};
const item = {
  hidden: { opacity: 0, y: 50 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] } },
};

export default function HeroSection() {
  const lineRef = useRef(null);

  useEffect(() => {
    if (lineRef.current) {
      gsap.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.4, delay: 0.5, ease: 'power3.inOut', transformOrigin: 'left' });
    }
  }, []);

  return (
    <section id="hero-section" className="relative min-h-screen flex items-center overflow-hidden bg-[#04030f]">

      {/* 3D Bank Entrance — full screen */}
      <Suspense fallback={null}>
        <div className="absolute inset-0">
          <BankEntranceScene className="w-full h-full" />
        </div>
      </Suspense>

      {/* Deep gradient overlay so text is always readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#04030f]/95 via-[#04030f]/75 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#04030f]/80 via-transparent to-[#04030f]/30 pointer-events-none" />

      {/* Horizontal gold accent line */}
      <div ref={lineRef} className="absolute top-[28%] left-0 w-48 h-px bg-gold-gradient opacity-60 origin-left" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 w-full">
        <motion.div className="max-w-xl" variants={container} initial="hidden" animate="show">

          <motion.p variants={item} className="flex items-center gap-3 text-gold-primary text-xs font-semibold tracking-[0.35em] uppercase mb-5">
            <span className="w-8 h-px bg-gold-primary inline-block" />
            Trusted Banking Excellence Since 1985
          </motion.p>

          <motion.h1 variants={item} className="text-display font-bold leading-[1.05] mb-5">
            <span className="block text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-lg">
              Your Dreams,
            </span>
            <span className="block text-5xl md:text-6xl lg:text-7xl">
              <span className="gold-text" style={{ textShadow: '0 0 60px rgba(212,175,55,0.5), 0 0 120px rgba(212,175,55,0.2)' }}>
                Our Commitment
              </span>
            </span>
          </motion.h1>

          <motion.p variants={item} className="text-[#a0a8c0] text-lg leading-relaxed mb-10 max-w-md">
            Experience world-class banking with tailored loan solutions — Personal, Home, Auto and beyond. Transparent rates, human service.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-4 mb-14">
            <Link to="/apply"
              className="group flex items-center gap-2.5 bg-gold-gradient text-navy-deep font-bold px-8 py-4 rounded-sm text-sm tracking-wider uppercase hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all duration-300">
              Apply for a Loan
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/calculator"
              className="flex items-center gap-2 border border-gold-primary/50 text-gold-pale px-8 py-4 rounded-sm text-sm tracking-wider uppercase hover:border-gold-primary hover:bg-gold-primary/10 hover:text-gold-bright transition-all duration-300">
              Calculate EMI
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div variants={item} className="grid grid-cols-3 gap-4 max-w-sm">
            {[
              { icon: Shield,     label: 'Secure & Licensed', value: 'RBI Regulated' },
              { icon: Clock,      label: 'Fast Approval',     value: '48 Hours' },
              { icon: TrendingUp, label: 'Best Rates',        value: 'From 7.5% p.a.' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center text-center p-3 rounded-sm border border-white/5 bg-white/3 backdrop-blur-sm hover:border-gold-primary/30 transition-all">
                <Icon size={18} className="text-gold-primary mb-1.5" />
                <p className="text-white text-xs font-semibold">{label}</p>
                <p className="text-[#6070a0] text-[10px] mt-0.5">{value}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}>
        <span className="text-muted text-[10px] tracking-[0.3em] uppercase">Explore</span>
        <div className="w-5 h-8 border border-gold-primary/30 rounded-full flex justify-center pt-1.5">
          <motion.div className="w-0.5 h-2 bg-gold-primary rounded-full"
            animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity }} />
        </div>
      </motion.div>
    </section>
  );
}
