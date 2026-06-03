import { formatDate } from '../../utils/formatters.js';
import Badge from '../ui/Badge.jsx';

export default function RecentActivity({ applications = [] }) {
  return (
    <div className="glass-card rounded-sm p-6">
      <h3 className="text-platinum font-semibold mb-4 text-sm tracking-widest uppercase">Recent Applications</h3>
      {applications.length === 0 && <p className="text-muted text-sm">No applications yet.</p>}
      <ul className="space-y-3">
        {applications.slice(0, 5).map((app) => (
          <li key={app._id} className="flex items-center justify-between py-2 border-b border-navy-mid last:border-0">
            <div>
              <p className="text-platinum text-sm font-mono">{app.applicationNumber}</p>
              <p className="text-muted text-xs capitalize">{app.loanType} · {formatDate(app.createdAt)}</p>
            </div>
            <Badge status={app.status} />
          </li>
        ))}
      </ul>
    </div>
  );
}
