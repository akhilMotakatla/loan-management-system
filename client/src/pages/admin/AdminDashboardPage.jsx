import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api.js';
import PortfolioStats from '../../components/admin/PortfolioStats.jsx';
import ApplicationTable from '../../components/admin/ApplicationTable.jsx';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data.data)).catch(() => {});
    api.get('/admin/applications?limit=5').then(r => setRecent(r.data.data.apps)).catch(() => {});
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-display text-3xl font-bold text-platinum">Admin <span className="gold-text">Dashboard</span></h1>
        <p className="text-muted mt-1">Bank portfolio overview</p>
      </div>

      <PortfolioStats stats={stats} />

      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-platinum font-semibold text-sm tracking-widest uppercase">Recent Applications</h2>
          <Link to="/admin/applications" className="text-gold-primary text-xs hover:underline">View all →</Link>
        </div>
        <div className="glass-card rounded-sm p-4">
          <ApplicationTable data={recent} loading={!recent.length} />
        </div>
      </div>
    </div>
  );
}
