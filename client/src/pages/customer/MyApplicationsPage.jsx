import { useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useLoanStore } from '../../store/loanStore.js';
import Badge from '../../components/ui/Badge.jsx';
import { formatCurrency, formatDate } from '../../utils/formatters.js';
import { APPLICATION_STATUSES } from '../../config/constants.js';

const ApplicationTrack3D = lazy(() => import('../../components/three/ApplicationTrack3D.jsx'));

const statusToStep = { submitted: 0, under_review: 1, docs_required: 1, approved: 2, disbursed: 3 };

export default function MyApplicationsPage() {
  const { applications, fetchApplications, isLoading } = useLoanStore();
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchApplications(); }, []);

  const app = selected ? applications.find(a => a._id === selected) : null;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-display text-3xl font-bold text-platinum">My <span className="gold-text">Applications</span></h1>
          <p className="text-muted mt-1">{applications.length} total applications</p>
        </div>
        <Link to="/apply" className="btn-gold">New Application</Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {isLoading && <p className="text-muted">Loading...</p>}
          {applications.map((a) => (
            <div key={a._id} onClick={() => setSelected(a._id)}
              className={`glass-card rounded-sm p-5 cursor-pointer transition-all duration-300 ${selected === a._id ? 'shadow-gold border-gold-primary/50' : 'hover:shadow-gold/50'} border border-transparent`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-gold-primary font-mono text-sm">{a.applicationNumber}</p>
                  <p className="text-platinum capitalize mt-1">{a.loanType} Loan</p>
                </div>
                <Badge status={a.status} />
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div><p className="text-muted">Amount</p><p className="text-silver">{formatCurrency(a.loanDetails?.requestedAmount)}</p></div>
                <div><p className="text-muted">Tenure</p><p className="text-silver">{a.loanDetails?.requestedTenure} mo.</p></div>
                <div><p className="text-muted">Applied</p><p className="text-silver">{formatDate(a.createdAt)}</p></div>
              </div>
            </div>
          ))}
          {!isLoading && applications.length === 0 && (
            <div className="glass-card rounded-sm p-12 text-center">
              <p className="text-muted">No applications yet.</p>
              <Link to="/apply" className="btn-gold mt-4 inline-block">Apply Now</Link>
            </div>
          )}
        </div>

        <div>
          {app ? (
            <div className="glass-card rounded-sm p-6 sticky top-24">
              <h3 className="text-gold-primary text-sm font-mono mb-4">{app.applicationNumber}</h3>
              <Suspense fallback={null}>
                <ApplicationTrack3D currentStep={statusToStep[app.status] ?? 0} className="w-full h-72" />
              </Suspense>
              {app.rejectionReason && <p className="text-ruby text-xs mt-4">Reason: {app.rejectionReason}</p>}
              {app.approvalDetails?.approvedAmount && (
                <div className="mt-4 space-y-2 text-sm">
                  <p className="text-emerald">Approved: {formatCurrency(app.approvalDetails.approvedAmount)}</p>
                  <p className="text-silver">Rate: {app.approvalDetails.interestRate}% p.a.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card rounded-sm p-8 text-center">
              <p className="text-muted text-sm">Select an application to view status</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
