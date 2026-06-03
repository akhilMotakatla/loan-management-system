import { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { LOAN_TYPES } from '../../config/constants.js';
import { formatCurrency, formatPercent } from '../../utils/formatters.js';
import CTASection from '../../components/sections/CTASection.jsx';

const bgMap = { personal: '/images/loan-personal-bg.jpg', home: '/images/loan-home-bg.jpg', auto: '/images/loan-auto-bg.jpg', other: '/images/loan-other-bg.jpg' };

const features = {
  personal: ['No collateral required','Flexible tenure 12–60 months','Minimal documentation','Amount up to $50,000'],
  home:     ['Lowest interest rates','Up to 30-year tenure','Tax benefits available','Up to $500,000'],
  auto:     ['New & pre-owned vehicles','Quick 24-hour approval','Flexible down payment','Up to $100,000'],
  other:    ['Business & medical loans','Custom repayment plans','Dedicated relationship manager','Up to $200,000'],
};

export default function LoanProductsPage() {
  const [active, setActive] = useState('personal');
  const lt = LOAN_TYPES.find(t => t.value === active);

  return (
    <>
      <section className="relative min-h-[50vh] flex items-center pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-700" style={{ backgroundImage: `url('${bgMap[active]}')` }} />
        <div className="absolute inset-0 bg-navy-deep/85" />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="text-gold-primary text-sm tracking-[0.3em] uppercase mb-4">Our Products</p>
          <h1 className="text-display text-5xl font-bold text-platinum mb-4">Loan <span className="gold-text">Products</span></h1>
          <p className="text-heading text-xl text-silver">Choose the loan that fits your life</p>
        </div>
      </section>

      <section className="py-24 bg-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {LOAN_TYPES.map((t) => (
              <button key={t.value} onClick={() => setActive(t.value)}
                className={`px-6 py-3 rounded-sm text-sm transition-all duration-300 tracking-wider uppercase ${active === t.value ? 'bg-gold-primary text-navy-deep font-semibold' : 'border border-navy-light text-muted hover:border-gold-primary hover:text-silver'}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-display text-4xl font-bold text-platinum mb-4">{lt?.label}</h2>
              <p className="text-silver text-lg mb-8 leading-relaxed">{lt?.description}</p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[{ l: 'Interest Rate', v: `${lt?.minRate}% – ${lt?.maxRate}% p.a.` }, { l: 'Max Amount', v: formatCurrency(lt?.maxAmount) }, { l: 'Min Tenure', v: '3 months' }, { l: 'Processing', v: '48 hours' }].map((s) => (
                  <div key={s.l} className="glass-card rounded-sm p-4">
                    <p className="text-muted text-xs mb-1">{s.l}</p>
                    <p className="text-gold-primary font-semibold">{s.v}</p>
                  </div>
                ))}
              </div>
              <Link to="/apply" className="btn-gold flex items-center gap-2 w-fit">Apply Now <ArrowRight size={16} /></Link>
            </div>

            <div className="glass-card rounded-sm p-8">
              <h3 className="text-platinum font-semibold mb-6 text-sm tracking-widest uppercase">Key Features</h3>
              <ul className="space-y-4">
                {(features[active] || []).map((f) => (
                  <li key={f} className="flex items-center gap-3 text-silver">
                    <CheckCircle size={16} className="text-emerald flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
