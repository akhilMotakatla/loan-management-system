import { useState, lazy, Suspense } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';
import { calculateEMI, getTotalPayment, getTotalInterest } from '../../utils/loanCalculator.js';
import { formatCurrency, formatPercent } from '../../utils/formatters.js';
import { LOAN_TYPES } from '../../config/constants.js';

const DonutChart3D = lazy(() => import('../three/DonutChart3D.jsx'));

export default function CalculatorSection() {
  const [amount,  setAmount]  = useState(500000);
  const [rate,    setRate]    = useState(8.5);
  const [tenure,  setTenure]  = useState(60);
  const titleRef = useScrollAnimation('fadeUp');

  const emi          = calculateEMI(amount, rate, tenure);
  const totalPayment = getTotalPayment(emi, tenure);
  const totalInterest = getTotalInterest(amount, emi, tenure);

  return (
    <section className="py-28 bg-section">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="text-center mb-16">
          <p className="text-gold-primary text-sm tracking-[0.3em] uppercase mb-3">Tools</p>
          <h2 className="section-title text-platinum mb-4">EMI <span className="gold-text">Calculator</span></h2>
          <p className="section-subtitle max-w-xl mx-auto">Instantly compute your monthly installment and total cost</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="glass-card rounded-sm p-8">
            <div className="space-y-8">
              {[
                { label: `Loan Amount: ${formatCurrency(amount)}`, min: 10000, max: 2000000, step: 10000, value: amount, set: setAmount },
                { label: `Interest Rate: ${formatPercent(rate)}`,  min: 5,     max: 24,     step: 0.25,  value: rate,   set: setRate },
                { label: `Tenure: ${tenure} months`,               min: 6,     max: 360,    step: 6,     value: tenure, set: setTenure },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-silver">{s.label}</span>
                  </div>
                  <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                    onChange={(e) => s.set(Number(e.target.value))}
                    className="w-full h-2 bg-navy-mid rounded-full appearance-none cursor-pointer accent-gold-primary" />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-10">
              {[
                { label: 'Monthly EMI',     value: formatCurrency(emi),          color: 'text-gold-primary' },
                { label: 'Total Interest',  value: formatCurrency(totalInterest), color: 'text-ruby' },
                { label: 'Total Payment',   value: formatCurrency(totalPayment),  color: 'text-emerald' },
              ].map((s) => (
                <div key={s.label} className="text-center p-4 bg-navy-mid rounded-sm">
                  <p className={`text-display text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-muted text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <Suspense fallback={<div className="h-72 flex items-center justify-center text-muted">Loading chart...</div>}>
            <DonutChart3D principal={amount} totalPayment={totalPayment} className="w-full h-80" />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
