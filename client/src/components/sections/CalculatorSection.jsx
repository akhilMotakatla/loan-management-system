import { useState, useMemo, useCallback, useEffect, lazy, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateEMI, getTotalPayment, getTotalInterest } from '../../utils/loanCalculator.js';
import { formatCurrency, formatPercent } from '../../utils/formatters.js';
import { LOAN_TYPES } from '../../config/constants.js';

const BankAdvisor3D = lazy(() => import('../three/BankAdvisor3D.jsx'));

/* ── Smooth animated number ──────────────────────────────── */
function AnimatedValue({ value, format }) {
  const [disp, setDisp] = useState(value);
  const animRef = useRef(null);
  const prevRef = useRef(value);
  useEffect(() => {
    const start = prevRef.current;
    const end   = value;
    const diff  = end - start;
    let step    = 0;
    const steps = 30;
    clearInterval(animRef.current);
    animRef.current = setInterval(() => {
      step++;
      const ease = 1 - Math.pow(1 - step / steps, 3);
      setDisp(start + diff * ease);
      if (step >= steps) { setDisp(end); prevRef.current = end; clearInterval(animRef.current); }
    }, 14);
    return () => clearInterval(animRef.current);
  }, [value]);
  return <>{format(Math.max(0, disp))}</>;
}

/* ── Precision slider with inline input ──────────────────── */
function PrecisionSlider({ label, value, min, max, step, onChange, format }) {
  const [editing, setEditing] = useState(false);
  const pct = ((value - min) / (max - min)) * 100;

  const commit = useCallback((raw) => {
    const n = parseFloat(String(raw).replace(/[^0-9.]/g, ''));
    if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
    setEditing(false);
  }, [min, max, onChange]);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] text-silver tracking-[0.14em] uppercase font-medium">{label}</label>
        {editing ? (
          <input autoFocus defaultValue={value}
            onBlur={e => commit(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') commit(e.currentTarget.value); if (e.key === 'Escape') setEditing(false); }}
            className="w-32 text-right border border-gold-primary rounded-sm px-2 py-1 text-gold-bright text-sm font-mono outline-none"
            style={{ background: 'rgba(26,32,96,0.9)' }} />
        ) : (
          <button onClick={() => setEditing(true)}
            className="w-32 text-right rounded-sm px-2 py-1 text-gold-primary text-sm font-mono transition-all hover:text-gold-bright border border-transparent hover:border-gold-primary/40"
            style={{ background: 'rgba(26,32,96,0.5)' }} title="Click to enter exact value">
            {format(value)}
          </button>
        )}
      </div>

      {/* Custom slider track */}
      <div className="relative h-4 flex items-center group">
        <div className="absolute inset-x-0 h-2 my-1 rounded-full" style={{ background: 'rgba(26,32,96,0.9)' }} />
        <div className="absolute left-0 h-2 my-1 rounded-full transition-[width] duration-75"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#8B6914,#D4AF37,#FFD700)', boxShadow: '0 0 8px rgba(212,175,55,0.4)' }} />
        <div className="absolute w-5 h-5 -translate-x-1/2 rounded-full border-2 pointer-events-none transition-[left] duration-75 group-active:scale-110"
          style={{ left: `${pct}%`, background: 'linear-gradient(135deg,#D4AF37,#FFD700)', borderColor: '#03020A', boxShadow: '0 0 14px rgba(212,175,55,0.8), 0 2px 8px rgba(0,0,0,0.6)' }} />
        <input type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
      </div>

      <div className="flex justify-between text-[9px] text-muted/50">
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  );
}

/* ── SVG donut ────────────────────────────────────────────── */
function DonutRing({ principalPct }) {
  const r     = 52;
  const circ  = 2 * Math.PI * r;
  const pLen  = (principalPct / 100) * circ;
  const iLen  = circ - pLen;
  return (
    <div className="relative flex-shrink-0" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(26,32,96,0.8)" strokeWidth="16" />
        <motion.circle cx="70" cy="70" r={r} fill="none"
          stroke="url(#gGold)" strokeWidth="16" strokeLinecap="round"
          strokeDasharray={`${pLen} ${iLen}`}
          initial={{ strokeDasharray: `0 ${circ}` }} animate={{ strokeDasharray: `${pLen} ${iLen}` }}
          transition={{ duration: 0.75, ease: 'easeOut' }} />
        <motion.circle cx="70" cy="70" r={r} fill="none"
          stroke="rgba(176,26,58,0.75)" strokeWidth="16" strokeLinecap="round"
          strokeDashoffset={-pLen} strokeDasharray={`${iLen} ${pLen}`}
          initial={{ strokeDasharray: `0 ${circ}` }} animate={{ strokeDasharray: `${iLen} ${pLen}` }}
          transition={{ duration: 0.75, ease: 'easeOut', delay: 0.12 }} />
        <defs>
          <linearGradient id="gGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B6914" /><stop offset="50%" stopColor="#D4AF37" /><stop offset="100%" stopColor="#FFD700" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-gold-primary text-lg font-bold font-mono leading-tight">{Math.round(principalPct)}%</p>
        <p className="text-muted text-[9px] uppercase tracking-wider">Principal</p>
      </div>
    </div>
  );
}

/* ── Year bar chart ───────────────────────────────────────── */
function YearChart({ data, maxVal }) {
  return (
    <div className="space-y-2">
      {data.slice(0, 8).map((yr, i) => (
        <motion.div key={yr.year} className="flex items-center gap-3"
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
          <span className="text-[9px] text-muted w-9 text-right flex-shrink-0">Yr {yr.year}</span>
          <div className="flex-1 h-3 rounded-full overflow-hidden relative" style={{ background: 'rgba(26,32,96,0.6)' }}>
            <motion.div className="absolute left-0 top-0 h-full rounded-full"
              style={{ background: 'linear-gradient(90deg,#8B6914,#D4AF37)' }}
              initial={{ width: 0 }}
              animate={{ width: `${(yr.principal / maxVal) * 100}%` }}
              transition={{ delay: i * 0.05 + 0.15, duration: 0.55, ease: 'easeOut' }} />
            <motion.div className="absolute top-0 h-full rounded-full"
              style={{ background: 'rgba(176,26,58,0.75)', left: `${(yr.principal / maxVal) * 100}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${(yr.interest / maxVal) * 100}%` }}
              transition={{ delay: i * 0.05 + 0.3, duration: 0.55, ease: 'easeOut' }} />
          </div>
          <span className="text-[9px] text-muted w-20 flex-shrink-0 font-mono">{formatCurrency(yr.balance)}</span>
        </motion.div>
      ))}
      <div className="flex gap-5 mt-2 pt-2 border-t border-navy-light/30">
        {[{ c: 'linear-gradient(90deg,#8B6914,#D4AF37)', l: 'Principal' }, { c: 'rgba(176,26,58,0.75)', l: 'Interest' }].map(s => (
          <div key={s.l} className="flex items-center gap-1.5">
            <div className="w-3 h-1.5 rounded-full" style={{ background: s.c }} />
            <span className="text-[9px] text-muted">{s.l}</span>
          </div>
        ))}
        <span className="text-[9px] text-muted ml-auto">Balance remaining →</span>
      </div>
    </div>
  );
}

/* ── Advisor message logic ────────────────────────────────── */
const getAdvice = (amount, rate, tenure, emi, totalInterest) => {
  const ratio = totalInterest / amount;
  const yrs   = (tenure / 12).toFixed(1);
  if (rate > 16)       return { mood: 'warning',   text: `At ${rate}% p.a., interest alone totals ${formatCurrency(totalInterest)} — ${Math.round(ratio*100)}% of principal. Boosting your credit score above 750 could drop your rate by 3–5% and save significantly.` };
  if (ratio > 0.9)     return { mood: 'concerned', text: `Over ${yrs} years, you'll pay ${formatCurrency(totalInterest)} in interest. Consider shortening tenure or making annual prepayments — even one extra EMI/year saves months.` };
  if (tenure > 240)    return { mood: 'concerned', text: `A ${yrs}-year tenure keeps EMI low at ${formatCurrency(emi)}, but total interest is ${formatCurrency(totalInterest)}. Even ₹500 extra/month reduces tenure by over a year.` };
  if (rate < 8.5 && ratio < 0.4) return { mood: 'happy', text: `Excellent! At ${rate}% over ${tenure} months, interest is only ${Math.round(ratio*100)}% of principal. EMI of ${formatCurrency(emi)} is very competitive. Outstanding financial decision!` };
  if (ratio < 0.5)     return { mood: 'happy',    text: `Solid choice! EMI of ${formatCurrency(emi)} keeps interest to just ${Math.round(ratio*100)}% of the loan. Total cost: ${formatCurrency(amount + totalInterest)}.` };
  return { mood: 'neutral', text: `Your EMI is ${formatCurrency(emi)}/month for ${tenure} months. Total interest: ${formatCurrency(totalInterest)} (${Math.round(ratio*100)}% of principal). Adjust the sliders to explore better scenarios.` };
};

/* ── Main export ─────────────────────────────────────────── */
export default function CalculatorSection() {
  const [amount,    setAmount]    = useState(500000);
  const [rate,      setRate]      = useState(8.5);
  const [tenure,    setTenure]    = useState(60);
  const [loanType,  setLoanType]  = useState('home');
  const [showTable, setShowTable] = useState(false);

  useEffect(() => {
    const lt = LOAN_TYPES.find(t => t.value === loanType);
    if (lt) { setRate(lt.minRate); setAmount(Math.min(amount, lt.maxAmount)); }
  }, [loanType]);

  const emi           = useMemo(() => calculateEMI(amount, rate, tenure), [amount, rate, tenure]);
  const totalPayment  = useMemo(() => getTotalPayment(emi, tenure), [emi, tenure]);
  const totalInterest = useMemo(() => getTotalInterest(amount, emi, tenure), [amount, emi, tenure]);
  const principalPct  = Math.max(0, Math.min(100, (amount / totalPayment) * 100));
  const advice        = useMemo(() => getAdvice(amount, rate, tenure, emi, totalInterest), [amount, rate, tenure, emi, totalInterest]);

  const lt = LOAN_TYPES.find(t => t.value === loanType);

  const yearlyData = useMemo(() => {
    const r = rate / 12 / 100;
    let bal = amount;
    return Array.from({ length: Math.min(Math.ceil(tenure / 12), 10) }, (_, i) => {
      const months = Math.min(12, tenure - i * 12);
      let yP = 0, yI = 0;
      for (let m = 0; m < months; m++) {
        const interest = bal * r;
        const principal = Math.max(0, emi - interest);
        yP += principal; yI += interest; bal -= principal;
      }
      return { year: i + 1, principal: yP, interest: yI, balance: Math.max(0, bal) };
    });
  }, [amount, rate, tenure, emi]);

  const maxYrVal = Math.max(...yearlyData.map(y => y.principal + y.interest), 1);

  return (
    <section className="py-28 relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#07051A 0%,#03020A 60%,#07051A 100%)' }}>
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-8 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle,#D4AF37,transparent)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full opacity-6 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle,#1A5BAB,transparent)' }} />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="flex items-center justify-center gap-3 text-gold-primary text-xs font-semibold tracking-[0.35em] uppercase mb-4">
            <span className="w-8 h-px bg-gold-primary" /> Smart Calculator <span className="w-8 h-px bg-gold-primary" />
          </p>
          <h2 className="section-title text-platinum mb-3">EMI <span className="gold-text">Calculator</span></h2>
          <p className="section-subtitle max-w-md mx-auto">Precision planning with real-time AI advisor analysis</p>
          <div className="gold-divider mt-5" />
        </motion.div>

        {/* Loan type tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {LOAN_TYPES.map(t => (
            <button key={t.value} onClick={() => setLoanType(t.value)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-sm text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                loanType === t.value ? 'text-navy-deep shadow-gold' : 'text-muted border border-navy-light hover:border-gold-primary/40 hover:text-silver'
              }`}
              style={loanType === t.value ? { background: 'linear-gradient(135deg,#8B6914,#D4AF37,#FFD700,#B8860B)' } : {}}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Main 3-column grid */}
        <div className="grid lg:grid-cols-3 gap-6 items-start">

          {/* Controls + results */}
          <div className="lg:col-span-2 space-y-5">

            <div className="glass-card rounded-sm p-7 space-y-8">
              <PrecisionSlider label="Loan Amount" value={amount} min={10000} max={lt?.maxAmount || 2000000} step={1000}
                onChange={setAmount} format={v => formatCurrency(Math.round(v))} />
              <PrecisionSlider label="Annual Interest Rate" value={rate} min={lt?.minRate || 5} max={lt?.maxRate || 24} step={0.05}
                onChange={v => setRate(Math.round(v * 100) / 100)} format={v => `${Number(v).toFixed(2)}% p.a.`} />
              <PrecisionSlider label="Tenure" value={tenure} min={6} max={360} step={1}
                onChange={setTenure} format={v => `${Math.round(v)} months (${(v / 12).toFixed(1)} yrs)`} />
            </div>

            {/* Result cards */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Monthly EMI',    val: emi,           col: '#D4AF37', bg: 'rgba(212,175,55,0.08)', b: 'rgba(212,175,55,0.25)' },
                { label: 'Total Interest', val: totalInterest, col: '#B01A3A', bg: 'rgba(176,26,58,0.08)',  b: 'rgba(176,26,58,0.25)' },
                { label: 'Total Payable',  val: totalPayment,  col: '#0F9B6E', bg: 'rgba(15,155,110,0.08)', b: 'rgba(15,155,110,0.25)' },
              ].map(s => (
                <motion.div key={s.label} className="rounded-sm p-4 text-center"
                  style={{ background: s.bg, border: `1px solid ${s.b}` }}
                  whileHover={{ scale: 1.04, transition: { type: 'spring', stiffness: 400 } }}>
                  <p className="text-display text-lg font-bold font-mono" style={{ color: s.col }}>
                    <AnimatedValue value={s.val} format={v => formatCurrency(v)} />
                  </p>
                  <p className="text-muted text-[10px] tracking-wider uppercase mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Donut + year chart */}
            <div className="glass-card rounded-sm p-7">
              <div className="flex flex-col sm:flex-row gap-6 items-center mb-7">
                <DonutRing principalPct={principalPct} />
                <div className="flex-1 grid grid-cols-2 gap-3">
                  {[
                    { l: 'Principal Amount',  v: formatCurrency(amount),          c: '#D4AF37' },
                    { l: 'Total Interest',    v: formatCurrency(totalInterest),   c: '#B01A3A' },
                    { l: 'Processing Fee ~',  v: formatCurrency(amount * 0.015), c: '#1A5BAB' },
                    { l: 'Effective Cost',    v: `${(rate + 0.3).toFixed(2)}%`,  c: '#C87800' },
                  ].map(s => (
                    <div key={s.l} className="rounded-sm p-3" style={{ background: 'rgba(26,32,96,0.4)', border: '1px solid rgba(26,32,96,0.8)' }}>
                      <p className="font-mono font-bold text-sm" style={{ color: s.c }}>{s.v}</p>
                      <p className="text-muted text-[9px] mt-0.5">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-silver tracking-[0.15em] uppercase mb-3 flex items-center gap-2">
                <span className="w-4 h-px bg-gold-primary/50" /> Year-by-Year Payment Breakdown
              </p>
              <YearChart data={yearlyData} maxVal={maxYrVal} />

              <button onClick={() => setShowTable(v => !v)}
                className="mt-5 text-gold-primary text-xs hover:text-gold-bright transition-colors flex items-center gap-1.5 font-medium">
                <span className={`transition-transform duration-200 ${showTable ? 'rotate-90' : ''}`}>▶</span>
                {showTable ? 'Hide' : 'Show'} full amortization schedule
              </button>

              <AnimatePresence>
                {showTable && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-4 overflow-x-auto">
                    <table className="w-full text-xs min-w-[440px]">
                      <thead><tr className="border-b border-navy-light">
                        {['Month','EMI','Principal','Interest','Balance'].map(h => (
                          <th key={h} className="text-left py-2 px-2 text-muted font-medium tracking-wide text-[10px] uppercase">{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {(() => {
                          const r = rate / 12 / 100;
                          let bal = amount;
                          return Array.from({ length: Math.min(tenure, 18) }, (_, i) => {
                            const interest  = bal * r;
                            const principal = Math.max(0, emi - interest);
                            bal = Math.max(0, bal - principal);
                            return (
                              <tr key={i} className="border-b border-navy-mid/40 hover:bg-navy-mid/30 transition-colors">
                                <td className="py-1.5 px-2 text-muted">{i + 1}</td>
                                <td className="py-1.5 px-2 text-platinum font-mono">{formatCurrency(emi)}</td>
                                <td className="py-1.5 px-2 text-gold-primary font-mono">{formatCurrency(principal)}</td>
                                <td className="py-1.5 px-2 text-ruby font-mono">{formatCurrency(interest)}</td>
                                <td className="py-1.5 px-2 text-silver font-mono">{formatCurrency(bal)}</td>
                              </tr>
                            );
                          });
                        })()}
                        {tenure > 18 && <tr><td colSpan={5} className="py-2 px-2 text-muted text-center text-[10px]">…and {tenure - 18} more months</td></tr>}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 3D Advisor */}
          <div className="glass-card rounded-sm p-5 sticky top-24">
            <Suspense fallback={<div className="h-96 flex items-center justify-center text-muted text-xs">Loading advisor…</div>}>
              <BankAdvisor3D message={advice.text} mood={advice.mood} />
            </Suspense>

            <div className="mt-4 pt-4 border-t border-navy-light/30">
              <p className="text-[10px] text-muted tracking-[0.2em] uppercase mb-3">Quick Scenarios</p>
              <div className="space-y-1.5">
                {[
                  { label: 'Minimum Monthly EMI', fn: () => { setTenure(360); } },
                  { label: 'Save Maximum Interest', fn: () => { setTenure(12); } },
                  { label: 'Best Balance (5 yr)',   fn: () => { setTenure(60); } },
                  { label: 'Reset Defaults',        fn: () => { setAmount(500000); setRate(8.5); setTenure(60); } },
                ].map(s => (
                  <button key={s.label} onClick={s.fn}
                    className="w-full text-left px-3 py-2 text-[11px] text-muted hover:text-gold-primary hover:bg-gold-primary/5 rounded-sm border border-transparent hover:border-gold-primary/20 transition-all flex items-center gap-2">
                    <span className="text-gold-dark">→</span> {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
