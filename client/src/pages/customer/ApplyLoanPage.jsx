import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { LOAN_TYPES, DOCUMENT_TYPES } from '../../config/constants.js';
import { calculateEMI, getTotalPayment } from '../../utils/loanCalculator.js';
import { formatCurrency, formatPercent } from '../../utils/formatters.js';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Button from '../../components/ui/Button.jsx';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';

const STEPS = ['Loan Type', 'Loan Details', 'Financial Info', 'Review & Submit'];

export default function ApplyLoanPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    loanType: '',
    loanDetails: { requestedAmount: 100000, requestedTenure: 36, purpose: '', collateral: '' },
    financialSnapshot: { declaredIncome: '', existingLoans: '', monthlyExpenses: '', creditScore: '' },
  });

  const lt = LOAN_TYPES.find(t => t.value === form.loanType);
  const emi = form.loanType ? calculateEMI(form.loanDetails.requestedAmount, lt?.minRate || 10, form.loanDetails.requestedTenure) : 0;

  const set = (path, val) => {
    const [a, b] = path.split('.');
    if (b) setForm(f => ({ ...f, [a]: { ...f[a], [b]: val } }));
    else    setForm(f => ({ ...f, [a]: val }));
  };

  // Strip empty strings and coerce numeric strings before sending
  const buildPayload = () => {
    const toNum = (v) => (v === '' || v == null ? undefined : Number(v));
    const toStr = (v) => (v === '' || v == null ? undefined : v);

    const details = {
      requestedAmount: Number(form.loanDetails.requestedAmount),
      requestedTenure: Number(form.loanDetails.requestedTenure),
      purpose:         form.loanDetails.purpose,
      ...(form.loanDetails.collateral      && { collateral:      form.loanDetails.collateral }),
      ...(form.loanDetails.propertyAddress && { propertyAddress: form.loanDetails.propertyAddress }),
      ...(form.loanDetails.vehicleMake     && { vehicleMake:     form.loanDetails.vehicleMake }),
      ...(form.loanDetails.vehicleModel    && { vehicleModel:    form.loanDetails.vehicleModel }),
      ...(form.loanDetails.vehicleYear     && { vehicleYear:     Number(form.loanDetails.vehicleYear) }),
    };

    const snap = form.financialSnapshot;
    const financialSnapshot = {
      ...(toNum(snap.declaredIncome)  != null && { declaredIncome:  toNum(snap.declaredIncome) }),
      ...(toNum(snap.existingLoans)   != null && { existingLoans:   toNum(snap.existingLoans) }),
      ...(toNum(snap.monthlyExpenses) != null && { monthlyExpenses: toNum(snap.monthlyExpenses) }),
      ...(toNum(snap.creditScore)     != null && { creditScore:     toNum(snap.creditScore) }),
    };

    return { loanType: form.loanType, loanDetails: details, financialSnapshot };
  };

  const submit = async () => {
    setLoading(true);
    try {
      const payload = buildPayload();
      const { data } = await api.post('/applications', payload);
      const appId = data.data._id || data.data.id;
      await api.post(`/applications/${appId}/submit`);
      toast.success('Application submitted successfully!');
      navigate('/applications');
    } catch (e) {
      const msg = e.response?.data?.errors?.join(', ') || e.response?.data?.message || 'Submission failed';
      toast.error(msg);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-display text-3xl font-bold text-platinum mb-2">Apply for a <span className="gold-text">Loan</span></h1>
        <div className="flex gap-2 mt-6">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                ${i < step ? 'bg-emerald text-white' : i === step ? 'bg-gold-primary text-navy-deep' : 'bg-navy-mid text-muted'}`}>
                {i < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className={`text-xs hidden md:block ${i === step ? 'text-gold-primary' : 'text-muted'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`h-px flex-1 ${i < step ? 'bg-emerald' : 'bg-navy-mid'}`} />}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}
          className="glass-card rounded-sm p-8">

          {step === 0 && (
            <div>
              <h2 className="text-platinum font-semibold mb-6">Select Loan Type</h2>
              <div className="grid grid-cols-2 gap-4">
                {LOAN_TYPES.map((t) => (
                  <button key={t.value} onClick={() => set('loanType', t.value)}
                    className={`p-5 rounded-sm border text-left transition-all duration-300 ${form.loanType === t.value ? 'border-gold-primary bg-gold-primary/10 shadow-gold' : 'border-navy-light hover:border-gold-dark'}`}>
                    <div className="text-3xl mb-2">{t.icon}</div>
                    <p className="text-platinum font-semibold">{t.label}</p>
                    <p className="text-muted text-xs mt-1">{t.minRate}% – {t.maxRate}% p.a.</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-platinum font-semibold mb-2">Loan Details</h2>
              <div>
                <label className="text-silver text-sm block mb-2">Loan Amount: {formatCurrency(form.loanDetails.requestedAmount)}</label>
                <input type="range" min="10000" max={lt?.maxAmount || 500000} step="5000" value={form.loanDetails.requestedAmount}
                  onChange={(e) => set('loanDetails.requestedAmount', Number(e.target.value))}
                  className="w-full accent-gold-primary" />
              </div>
              <div>
                <label className="text-silver text-sm block mb-2">Tenure: {form.loanDetails.requestedTenure} months</label>
                <input type="range" min="6" max="360" step="6" value={form.loanDetails.requestedTenure}
                  onChange={(e) => set('loanDetails.requestedTenure', Number(e.target.value))}
                  className="w-full accent-gold-primary" />
              </div>
              <Input label="Purpose" value={form.loanDetails.purpose} onChange={(e) => set('loanDetails.purpose', e.target.value)} placeholder="Describe the purpose of this loan" />
              {form.loanType === 'home' && <Input label="Property Address" value={form.loanDetails.propertyAddress || ''} onChange={(e) => set('loanDetails.propertyAddress', e.target.value)} />}
              {form.loanType === 'auto' && (
                <div className="grid grid-cols-3 gap-3">
                  <Input label="Make" value={form.loanDetails.vehicleMake || ''} onChange={(e) => set('loanDetails.vehicleMake', e.target.value)} />
                  <Input label="Model" value={form.loanDetails.vehicleModel || ''} onChange={(e) => set('loanDetails.vehicleModel', e.target.value)} />
                  <Input label="Year" type="number" value={form.loanDetails.vehicleYear || ''} onChange={(e) => set('loanDetails.vehicleYear', e.target.value)} />
                </div>
              )}
              <div className="p-4 bg-navy-mid rounded-sm">
                <p className="text-muted text-xs mb-2">Estimated Monthly EMI</p>
                <p className="text-display text-2xl font-bold gold-text">{formatCurrency(emi)}</p>
                <p className="text-muted text-xs mt-1">Total: {formatCurrency(getTotalPayment(emi, form.loanDetails.requestedTenure))}</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-platinum font-semibold mb-2">Financial Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Annual Income ($)" type="number" value={form.financialSnapshot.declaredIncome} onChange={(e) => set('financialSnapshot.declaredIncome', e.target.value)} />
                <Input label="Existing Loan Debt ($)" type="number" value={form.financialSnapshot.existingLoans} onChange={(e) => set('financialSnapshot.existingLoans', e.target.value)} />
                <Input label="Monthly Expenses ($)" type="number" value={form.financialSnapshot.monthlyExpenses} onChange={(e) => set('financialSnapshot.monthlyExpenses', e.target.value)} />
                <Input label="Credit Score" type="number" min="300" max="850" value={form.financialSnapshot.creditScore} onChange={(e) => set('financialSnapshot.creditScore', e.target.value)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-platinum font-semibold mb-6">Review & Submit</h2>
              <div className="space-y-3 text-sm">
                {[
                  { l: 'Loan Type',   v: lt?.label },
                  { l: 'Amount',      v: formatCurrency(form.loanDetails.requestedAmount) },
                  { l: 'Tenure',      v: `${form.loanDetails.requestedTenure} months` },
                  { l: 'Est. Rate',   v: `${lt?.minRate}% p.a.` },
                  { l: 'Est. EMI',    v: formatCurrency(emi) },
                  { l: 'Purpose',     v: form.loanDetails.purpose },
                ].map((s) => (
                  <div key={s.l} className="flex justify-between py-2 border-b border-navy-mid">
                    <span className="text-muted">{s.l}</span>
                    <span className="text-platinum capitalize">{s.v}</span>
                  </div>
                ))}
              </div>
              <p className="text-muted text-xs mt-6">By submitting you agree to our Terms of Service and consent to a credit check.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={() => setStep(s => s - 1)} disabled={step === 0}>
          <ArrowLeft size={16} /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(s => s + 1)} disabled={step === 0 && !form.loanType}>
            Next <ArrowRight size={16} />
          </Button>
        ) : (
          <Button onClick={submit} loading={loading}>Submit Application</Button>
        )}
      </div>
    </div>
  );
}
