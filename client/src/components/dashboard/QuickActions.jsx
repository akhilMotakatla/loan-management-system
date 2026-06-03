import { Link } from 'react-router-dom';
import { FilePlus, CreditCard, Upload, Calculator } from 'lucide-react';

const actions = [
  { to: '/apply',        icon: FilePlus,   label: 'Apply for Loan',  color: 'text-gold-primary' },
  { to: '/payments/new', icon: CreditCard, label: 'Make Payment',    color: 'text-emerald' },
  { to: '/documents',    icon: Upload,     label: 'Upload Docs',     color: 'text-sapphire' },
  { to: '/calculator',   icon: Calculator, label: 'EMI Calculator',  color: 'text-amber' },
];

export default function QuickActions() {
  return (
    <div className="glass-card rounded-sm p-6">
      <h3 className="text-platinum font-semibold mb-4 text-sm tracking-widest uppercase">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ to, icon: Icon, label, color }) => (
          <Link key={to} to={to} className="flex flex-col items-center gap-2 p-4 bg-navy-mid rounded-sm hover:bg-navy-light transition-colors group">
            <Icon size={22} className={`${color} group-hover:scale-110 transition-transform`} />
            <span className="text-muted text-xs text-center group-hover:text-silver transition-colors">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
