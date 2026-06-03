import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import { Menu } from 'lucide-react';
import { useUIStore } from '../../store/uiStore.js';

export default function DashboardLayout() {
  const { toggleSidebar } = useUIStore();
  return (
    <div className="flex min-h-screen bg-navy-deep">
      <Sidebar />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="glass-card border-b border-navy-mid px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
          <button onClick={toggleSidebar} className="lg:hidden text-muted hover:text-platinum transition-colors"><Menu size={20} /></button>
          <div className="h-px flex-1 bg-gold-primary/10" />
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
