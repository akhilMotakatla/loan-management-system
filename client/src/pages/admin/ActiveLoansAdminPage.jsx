import { useEffect, useState } from 'react';
import api from '../../utils/api.js';
import Table from '../../components/ui/Table.jsx';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

export default function ActiveLoansAdminPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/loans?status=active').then(r => { setLoans(r.data.data.loans); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'loanNumber',  label: 'Loan #',     render: (v) => <span className="font-mono text-gold-primary text-xs">{v}</span> },
    { key: 'borrower',    label: 'Borrower',   render: (v) => v ? `${v.firstName} ${v.lastName}` : '—' },
    { key: 'loanType',    label: 'Type',       render: (v) => <span className="capitalize">{v}</span> },
    { key: 'principalAmount',    label: 'Principal',  render: (v) => formatCurrency(v) },
    { key: 'outstandingBalance', label: 'Outstanding', render: (v) => <span className="text-gold-primary">{formatCurrency(v)}</span> },
    { key: 'emiAmount',   label: 'EMI',        render: (v) => formatCurrency(v) },
    { key: 'nextDueDate', label: 'Next Due',   render: (v) => formatDate(v) },
    { key: 'status',      label: 'Status',     render: (v) => <span className="text-emerald capitalize">{v}</span> },
  ];

  return (
    <div>
      <h1 className="text-display text-3xl font-bold text-platinum mb-8">Loan <span className="gold-text">Portfolio</span></h1>
      <div className="glass-card rounded-sm p-4">
        <Table columns={columns} data={loans} loading={loading} />
      </div>
    </div>
  );
}
