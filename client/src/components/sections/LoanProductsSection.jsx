import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';
import { LOAN_TYPES } from '../../config/constants.js';
import { formatCurrency } from '../../utils/formatters.js';

const FloatingCards3D = lazy(() => import('../three/FloatingCards3D.jsx'));

export default function LoanProductsSection() {
  const titleRef = useScrollAnimation('fadeUp');

  return (
    <section className="py-28 bg-section">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-16">
          <p className="text-gold-primary text-sm tracking-[0.3em] uppercase mb-3">Our Products</p>
          <h2 className="section-title text-platinum mb-4">Loan <span className="gold-text">Solutions</span></h2>
          <p className="section-subtitle max-w-xl mx-auto">Customized financing for every milestone in your journey</p>
        </div>

        <Suspense fallback={<div className="h-96 flex items-center justify-center text-muted">Loading 3D preview...</div>}>
          <FloatingCards3D className="w-full h-80 mb-12" />
        </Suspense>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {LOAN_TYPES.map((lt, i) => (
            <div key={lt.value} className="glass-card rounded-sm p-6 hover:shadow-gold transition-all duration-500 group border border-transparent hover:border-gold-primary/30">
              <div className="text-4xl mb-4">{lt.icon}</div>
              <h3 className="text-display text-xl text-platinum mb-2 group-hover:text-gold-primary transition-colors">{lt.label}</h3>
              <p className="text-muted text-sm mb-4 leading-relaxed">{lt.description}</p>
              <div className="flex justify-between text-xs mb-5">
                <span className="text-silver">Rate: <span className="text-gold-primary">{lt.minRate}% - {lt.maxRate}%</span></span>
                <span className="text-silver">Up to <span className="text-gold-primary">{formatCurrency(lt.maxAmount)}</span></span>
              </div>
              <Link to="/apply" className="btn-outline-gold w-full text-center block text-xs py-2">
                Apply Now <ArrowRight size={12} className="inline" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
