import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, CreditCard, Wallet, Upload, User, Bell, Settings, Users, BarChart3, Shield, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';
import { useUIStore } from '../../store/uiStore.js';
import { APP_NAME } from '../../config/constants.js';

const customerLinks = [
  { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/apply',        label: 'Apply Loan',   icon: FileText },
  { to: '/applications', label: 'Applications', icon: FileText },
  { to: '/loans/active', label: 'My Loans',     icon: CreditCard },
  { to: '/payments/new', label: 'Payments',     icon: Wallet },
  { to: '/documents',    label: 'Documents',    icon: Upload },
  { to: '/profile',      label: 'Profile',      icon: User },
  { to: '/notifications',label: 'Notifications',icon: Bell },
];

const adminLinks = [
  { to: '/admin',              label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/admin/applications', label: 'Applications', icon: FileText },
  { to: '/admin/loans',        label: 'Loans',        icon: CreditCard },
  { to: '/admin/users',        label: 'Users',        icon: Users },
  { to: '/admin/reports',      label: 'Reports',      icon: BarChart3 },
];

export default function Sidebar() {
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();
  const links = user?.role !== 'customer' ? adminLinks : customerLinks;

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={toggleSidebar} />}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-obsidian border-r border-navy-mid z-30 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between p-6 border-b border-navy-mid">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gold-gradient rounded-sm flex items-center justify-center">
              <span className="text-navy-deep font-bold text-xs">P</span>
            </div>
            <span className="text-display text-lg font-bold gold-text">{APP_NAME}</span>
          </Link>
          <button onClick={toggleSidebar} className="lg:hidden text-muted hover:text-platinum"><X size={18} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {links.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <li key={to}>
                  <Link to={to} onClick={() => { if (sidebarOpen) toggleSidebar(); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm transition-all duration-200
                      ${active ? 'bg-gold-primary/15 text-gold-primary border-l-2 border-gold-primary' : 'text-muted hover:text-silver hover:bg-navy-mid'}`}>
                    <Icon size={17} />
                    <span className="tracking-wide">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-navy-mid">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-gold-gradient rounded-full flex items-center justify-center text-navy-deep text-xs font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <p className="text-platinum text-xs font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-muted text-xs capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
