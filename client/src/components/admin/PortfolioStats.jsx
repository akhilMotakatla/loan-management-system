import { TrendingUp, Users, FileText, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters.js';

export default function PortfolioStats({ stats }) {
  const cards = [
    { label: 'Portfolio Value',   value: formatCurrency(stats?.portfolioValue || 0), icon: TrendingUp, color: 'text-gold-primary' },
    { label: 'Total Customers',   value: stats?.totalUsers || 0,     icon: Users,         color: 'text-sapphire' },
    { label: 'Pending Review',    value: stats?.pendingApps || 0,    icon: FileText,      color: 'text-amber' },
    { label: 'Overdue Loans',     value: stats?.overdueLoans || 0,   icon: AlertTriangle, color: 'text-ruby' },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="glass-card rounded-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-muted text-xs tracking-wider uppercase">{label}</p>
            <Icon size={16} className={color} />
          </div>
          <p className={`text-display text-2xl font-bold ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}
