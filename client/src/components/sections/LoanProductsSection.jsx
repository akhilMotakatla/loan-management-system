import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';
import { LOAN_TYPES } from '../../config/constants.js';
import { formatCurrency } from '../../utils/formatters.js';

const FloatingCards3D = lazy(() => import('../three/FloatingCards3D.jsx'));

const glowColors = {
  personal: 'rgba(212,175,55,0.4)',
  home:     'rgba(26,91,171,0.4)',
  auto:     'rgba(15,155,110,0.4)',
  other:    'rgba(176,26,58,0.4)',
};
const borderColors = {
  personal: '#D4AF37',
  home:     '#1A5BAB',
  auto:     '#0F9B6E',
  other:    '#B01A3A',
};

export default function LoanProductsSection() {
  const titleRef = useScrollAnimation('fadeUp');

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#070515 0%,#0e1035 50%,#070515 100%)' }}>
      {/* Decorative diagonal lines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #D4AF37 0, #D4AF37 1px, transparent 0, transparent 50%)', backgroundSize: '40px 40px' }} />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <p className="flex items-center justify-center gap-3 text-gold-primary text-xs font-semibold tracking-[0.3em] uppercase mb-4">
            <span className="w-8 h-px bg-gold-primary" /> Our Products <span className="w-8 h-px bg-gold-primary" />
          </p>
          <h2 className="section-title text-platinum mb-3">
            Loan <span className="gold-text">Solutions</span>
          </h2>
          <p className="section-subtitle max-w-md mx-auto">Customized financing for every milestone in your life</p>
          <div className="gold-divider mt-6" />
        </div>

        {/* 3D floating cards preview */}
        <Suspense fallback={<div className="h-72" />}>
          <FloatingCards3D className="w-full h-72 mb-14" />
        </Suspense>

        {/* Product cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {LOAN_TYPES.map((lt, i) => (
            <motion.div
              key={lt.value}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group relative rounded-sm overflow-hidden cursor-pointer"
              style={{ background: 'linear-gradient(145deg,#0e1035,#070515)', border: `1px solid ${borderColors[lt.value]}22` }}>

              {/* Hover glow overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${glowColors[lt.value]} 0%, transparent 70%)` }} />

              {/* Top accent border */}
              <div className="absolute top-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ background: `linear-gradient(90deg, ${borderColors[lt.value]}, transparent)` }} />

              <div className="relative p-7">
                {/* Icon */}
                <div className="text-4xl mb-5 transform group-hover:scale-110 transition-transform duration-300">{lt.icon}</div>

                <h3 className="text-display text-xl font-bold text-platinum mb-2 group-hover:text-gold-pale transition-colors">
                  {lt.label}
                </h3>
                <p className="text-silver text-sm leading-relaxed mb-5">{lt.description}</p>

                {/* Rate & amount badges */}
                <div className="flex gap-2 mb-6">
                  <span className="text-xs px-2 py-1 rounded-sm border"
                    style={{ borderColor: `${borderColors[lt.value]}44`, color: borderColors[lt.value], background: `${borderColors[lt.value]}11` }}>
                    {lt.minRate}% – {lt.maxRate}%
                  </span>
                  <span className="text-xs px-2 py-1 rounded-sm bg-navy-light/50 text-muted border border-navy-light">
                    Up to {formatCurrency(lt.maxAmount)}
                  </span>
                </div>

                <Link to="/apply"
                  className="flex items-center gap-2 text-sm font-semibold transition-all duration-300 group-hover:gap-3"
                  style={{ color: borderColors[lt.value] }}>
                  Apply Now <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
