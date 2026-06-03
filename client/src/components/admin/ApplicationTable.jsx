import { Link } from 'react-router-dom';
import Table from '../ui/Table.jsx';
import Badge from '../ui/Badge.jsx';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

export default function ApplicationTable({ data, loading }) {
  const columns = [
    { key: 'applicationNumber', label: 'App #', render: (v, r) => <Link to={`/admin/applications/${r._id}`} className="text-gold-primary hover:underline font-mono text-xs">{v}</Link> },
    { key: 'applicant', label: 'Applicant', render: (v) => v ? `${v.firstName} ${v.lastName}` : '—' },
    { key: 'loanType',  label: 'Type',      render: (v) => <span className="capitalize">{v}</span> },
    { key: 'loanDetails', label: 'Amount',  render: (v) => formatCurrency(v?.requestedAmount) },
    { key: 'status',   label: 'Status',     render: (v) => <Badge status={v} /> },
    { key: 'createdAt', label: 'Date',      render: (v) => formatDate(v) },
    { key: '_id', label: 'Action', render: (v) => <Link to={`/admin/applications/${v}`} className="text-gold-primary text-xs hover:underline">Review →</Link> },
  ];

  return <Table columns={columns} data={data} loading={loading} emptyText="No applications found" />;
}
