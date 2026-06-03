import { useEffect, useState } from 'react';
import { useLoanStore } from '../../store/loanStore.js';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Button from '../../components/ui/Button.jsx';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

const methods = [{ value: 'bank_transfer', label: 'Bank Transfer' }, { value: 'card', label: 'Credit/Debit Card' }, { value: 'upi', label: 'UPI' }, { value: 'check', label: 'Check' }];

export default function PaymentPage() {
  const { activeLoans, fetchLoans } = useLoanStore();
  const [form, setForm] = useState({ loanId: '', amount: '', paymentMethod: 'bank_transfer', transactionId: '' });
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchLoans();
    api.get('/payments').then(r => setHistory(r.data.data)).catch(() => {});
  }, []);

  const loan = activeLoans.find(l => l._id === form.loanId);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/payments', { ...form, amount: Number(form.amount) });
      await api.post(`/payments/${data.data._id}/confirm`);
      toast.success('Payment confirmed successfully!');
      setForm({ loanId: '', amount: '', paymentMethod: 'bank_transfer', transactionId: '' });
      fetchLoans();
      const r = await api.get('/payments');
      setHistory(r.data.data);
    } catch (e) { toast.error(e.response?.data?.message || 'Payment failed'); }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-display text-3xl font-bold text-platinum mb-8">Make a <span className="gold-text">Payment</span></h1>

      <div className="grid lg:grid-cols-2 gap-8 mb-10">
        <form onSubmit={submit} className="glass-card rounded-sm p-6 space-y-5">
          <Select label="Select Loan" value={form.loanId} onChange={(e) => { setForm({ ...form, loanId: e.target.value, amount: activeLoans.find(l=>l._id===e.target.value)?.emiAmount || '' }); }}
            options={activeLoans.map(l => ({ value: l._id, label: `${l.loanNumber} — EMI: ${formatCurrency(l.emiAmount)}` }))} placeholder="Choose a loan" required />
          {loan && (
            <div className="p-4 bg-navy-mid rounded-sm text-sm space-y-1">
              <p className="text-muted">Outstanding: <span className="text-gold-primary">{formatCurrency(loan.outstandingBalance)}</span></p>
              <p className="text-muted">Next Due: <span className="text-silver">{formatDate(loan.nextDueDate)}</span></p>
            </div>
          )}
          <Input label="Amount ($)" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          <Select label="Payment Method" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} options={methods} />
          <Input label="Transaction Reference" value={form.transactionId} onChange={(e) => setForm({ ...form, transactionId: e.target.value })} placeholder="Optional" />
          <Button type="submit" loading={loading} className="w-full">Confirm Payment</Button>
        </form>

        <div className="glass-card rounded-sm p-6">
          <h3 className="text-platinum font-semibold mb-4 text-sm tracking-widest uppercase">Payment History</h3>
          {history.length === 0 && <p className="text-muted text-sm">No payments yet.</p>}
          <ul className="space-y-3">
            {history.slice(0, 8).map((p) => (
              <li key={p._id} className="flex justify-between items-center py-2 border-b border-navy-mid last:border-0 text-sm">
                <div>
                  <p className="text-platinum font-mono text-xs">{p.paymentReference}</p>
                  <p className="text-muted text-xs">{formatDate(p.createdAt)} · {p.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="text-gold-primary">{formatCurrency(p.amount)}</p>
                  <span className={`text-xs capitalize ${p.status === 'completed' ? 'text-emerald' : 'text-amber'}`}>{p.status}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
