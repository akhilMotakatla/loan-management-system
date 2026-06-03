import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden" style={{ background: 'linear-gradient(135deg,#0e1035 0%,#070515 50%,#0e1035 100%)' }}>
      {/* Animated gold radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.18) 0%, transparent 60%)' }}
      />

      {/* Top + bottom shimmer lines */}
      <div className="absolute top-0 left-0 right-0 h-px shimmer-line" />
      <div className="absolute bottom-0 left-0 right-0 h-px shimmer-line" />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex items-center justify-center gap-3 text-gold-primary text-xs font-semibold tracking-[0.35em] uppercase mb-5">
          <span className="w-10 h-px bg-gold-primary" /> Begin Your Journey <span className="w-10 h-px bg-gold-primary" />
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="text-display text-4xl md:text-6xl font-bold text-platinum mb-6 leading-tight">
          Ready to Make Your <br />
          <span className="gold-text" style={{ textShadow: '0 0 80px rgba(212,175,55,0.4)' }}>Dream a Reality?</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
          className="text-heading text-xl text-silver mb-12 max-w-xl mx-auto">
          Apply today and receive a decision within 48 hours. No hidden fees, no surprises — just honest banking.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4">
          <Link to="/register" className="btn-gold text-base px-10 py-4 shadow-gold hover:shadow-gold-lg flex items-center gap-2">
            Start Application <ArrowRight size={18} />
          </Link>
          <Link to="/contact" className="btn-outline-gold text-base px-10 py-4 flex items-center gap-2">
            <Phone size={16} /> Talk to an Advisor
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
