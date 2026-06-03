import { Link } from 'react-router-dom';
import Table from '../ui/Table.jsx';
import { formatDate } from '../../utils/formatters.js';

export default function UserTable({ data, loading }) {
  const columns = [
    { key: 'firstName', label: 'Name', render: (v, r) => `${v} ${r.lastName}` },
    { key: 'email',     label: 'Email' },
    { key: 'phone',     label: 'Phone' },
    { key: 'kycStatus', label: 'KYC', render: (v) => <span className={`text-xs capitalize ${v === 'verified' ? 'text-emerald' : v === 'rejected' ? 'text-ruby' : 'text-amber'}`}>{v}</span> },
    { key: 'createdAt', label: 'Joined', render: (v) => formatDate(v) },
    { key: '_id', label: 'View', render: (v) => <Link to={`/admin/users/${v}`} className="text-gold-primary text-xs hover:underline">View →</Link> },
  ];
  return <Table columns={columns} data={data} loading={loading} emptyText="No users found" />;
}
