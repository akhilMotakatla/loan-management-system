import { useEffect, useState } from 'react';
import api from '../../utils/api.js';
import ApplicationTable from '../../components/admin/ApplicationTable.jsx';
import Select from '../../components/ui/Select.jsx';

const statusOpts = [{ value: '', label: 'All Statuses' }, { value: 'submitted', label: 'Submitted' }, { value: 'under_review', label: 'Under Review' }, { value: 'approved', label: 'Approved' }, { value: 'rejected', label: 'Rejected' }, { value: 'disbursed', label: 'Disbursed' }];
const typeOpts   = [{ value: '', label: 'All Types' }, { value: 'personal', label: 'Personal' }, { value: 'home', label: 'Home' }, { value: 'auto', label: 'Auto' }, { value: 'other', label: 'Other' }];

export default function AllApplicationsPage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', loanType: '' });

  const load = async () => {
    setLoading(true);
    const q = new URLSearchParams(filters).toString();
    const r = await api.get(`/admin/applications?${q}`).catch(() => ({ data: { data: { apps: [] } } }));
    setApps(r.data.data.apps);
    setLoading(false);
  };

  useEffect(() => { load(); }, [filters]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-display text-3xl font-bold text-platinum">All <span className="gold-text">Applications</span></h1>
        <div className="flex gap-3">
          <Select value={filters.status}   onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}   options={statusOpts} className="text-sm py-2" />
          <Select value={filters.loanType} onChange={(e) => setFilters(f => ({ ...f, loanType: e.target.value }))} options={typeOpts}   className="text-sm py-2" />
        </div>
      </div>
      <div className="glass-card rounded-sm p-4">
        <ApplicationTable data={apps} loading={loading} />
      </div>
    </div>
  );
}
