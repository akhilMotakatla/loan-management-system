import { useEffect, useState, lazy, Suspense } from 'react';
import { useLoanStore } from '../../store/loanStore.js';
import LoanSummaryCard from '../../components/dashboard/LoanSummaryCard.jsx';
import RepaymentChart from '../../components/dashboard/RepaymentChart.jsx';
import api from '../../utils/api.js';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

export default function ActiveLoansPage() {
  const { activeLoans, fetchLoans, isLoading } = useLoanStore();
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => { fetchLoans(); }, []);

  const loadSchedule = async (id) => {
    const { data } = await api.get(`/loans/${id}/schedule`);
    setSchedule(data.data);
    setSelectedLoan(id);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-display text-3xl font-bold text-platinum">Active <span className="gold-text">Loans</span></h1>
        <p className="text-muted mt-1">{activeLoans.length} active loan{activeLoans.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {activeLoans.map((l) => (
          <div key={l._id} onClick={() => loadSchedule(l._id)} className="cursor-pointer">
            <LoanSummaryCard loan={l} />
          </div>
        ))}
        {!isLoading && activeLoans.length === 0 && (
          <div className="col-span-3 glass-card rounded-sm p-12 text-center text-muted">No active loans.</div>
        )}
      </div>

      {schedule.length > 0 && (
        <>
          <RepaymentChart schedule={schedule} />
          <div className="glass-card rounded-sm p-6 mt-6">
            <h3 className="text-platinum font-semibold mb-4 text-sm tracking-widest uppercase">Repayment Schedule</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="border-b border-navy-light text-muted">
                  {['#','Due Date','EMI','Principal','Interest','Balance','Status'].map(h => <th key={h} className="text-left py-2 px-3">{h}</th>)}
                </tr></thead>
                <tbody>
                  {schedule.slice(0, 24).map((s) => (
                    <tr key={s.installmentNo} className={`border-b border-navy-mid ${s.status === 'paid' ? 'opacity-50' : ''}`}>
                      <td className="py-2 px-3 text-muted">{s.installmentNo}</td>
                      <td className="py-2 px-3 text-silver">{formatDate(s.dueDate)}</td>
                      <td className="py-2 px-3 text-platinum">{formatCurrency(s.emiAmount)}</td>
                      <td className="py-2 px-3 text-sapphire">{formatCurrency(s.principal)}</td>
                      <td className="py-2 px-3 text-ruby">{formatCurrency(s.interest)}</td>
                      <td className="py-2 px-3 text-silver">{formatCurrency(s.balance)}</td>
                      <td className="py-2 px-3"><span className={`capitalize ${s.status === 'paid' ? 'text-emerald' : s.status === 'overdue' ? 'text-ruby' : 'text-amber'}`}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
