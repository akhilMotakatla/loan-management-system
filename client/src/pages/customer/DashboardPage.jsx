import { useEffect, Suspense, lazy } from 'react';
import { useAuthStore } from '../../store/authStore.js';
import { useLoanStore } from '../../store/loanStore.js';
import LoanSummaryCard from '../../components/dashboard/LoanSummaryCard.jsx';
import QuickActions from '../../components/dashboard/QuickActions.jsx';
import RecentActivity from '../../components/dashboard/RecentActivity.jsx';

const ParticleNetwork = lazy(() => import('../../components/three/ParticleNetwork.jsx'));

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { activeLoans, applications, fetchLoans, fetchApplications, isLoading } = useLoanStore();

  useEffect(() => {
    fetchLoans();
    fetchApplications();
  }, []);

  return (
    <div className="relative min-h-screen">
      <Suspense fallback={null}>
        <ParticleNetwork className="absolute inset-0 opacity-20 pointer-events-none" />
      </Suspense>

      <div className="relative z-10">
        <div className="mb-8">
          <h1 className="text-display text-3xl font-bold text-platinum">
            Welcome, <span className="gold-text">{user?.firstName}</span>
          </h1>
          <p className="text-muted mt-1">Here's your financial overview</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <QuickActions />
          </div>
          <div className="glass-card rounded-sm p-6">
            <h3 className="text-platinum font-semibold mb-4 text-sm tracking-widest uppercase">Account Status</h3>
            <div className="space-y-3">
              {[
                { label: 'KYC Status', value: user?.kycStatus || 'pending', color: user?.kycStatus === 'verified' ? 'text-emerald' : 'text-amber' },
                { label: 'Active Loans', value: activeLoans.length, color: 'text-gold-primary' },
                { label: 'Applications', value: applications.length, color: 'text-sapphire' },
              ].map((s) => (
                <div key={s.label} className="flex justify-between py-2 border-b border-navy-mid last:border-0">
                  <span className="text-muted text-sm">{s.label}</span>
                  <span className={`text-sm font-semibold capitalize ${s.color}`}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {activeLoans.length > 0 && (
          <div className="mb-8">
            <h2 className="text-platinum font-semibold mb-4 text-sm tracking-widest uppercase">Active Loans</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeLoans.map((loan) => <LoanSummaryCard key={loan._id} loan={loan} />)}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <RecentActivity applications={applications} />
        </div>
      </div>
    </div>
  );
}
