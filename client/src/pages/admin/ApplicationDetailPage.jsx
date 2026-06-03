import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api.js';
import Badge from '../../components/ui/Badge.jsx';
import ReviewPanel from '../../components/admin/ReviewPanel.jsx';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const [app, setApp] = useState(null);

  const load = () => api.get(`/admin/applications/${id}`).then(r => setApp(r.data.data)).catch(() => {});
  useEffect(() => { load(); }, [id]);

  if (!app) return <div className="text-muted p-8">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-display text-3xl font-bold text-platinum">{app.applicationNumber}</h1>
          <p className="text-muted mt-1 capitalize">{app.loanType} Loan · Applied {formatDate(app.createdAt)}</p>
        </div>
        <Badge status={app.status} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-sm p-6">
            <h3 className="text-gold-primary text-sm font-semibold tracking-widest uppercase mb-4">Applicant</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { l: 'Name',  v: `${app.applicant?.firstName} ${app.applicant?.lastName}` },
                { l: 'Email', v: app.applicant?.email },
                { l: 'Phone', v: app.applicant?.phone },
                { l: 'KYC',   v: app.applicant?.kycStatus },
              ].map(s => <div key={s.l}><p className="text-muted text-xs">{s.l}</p><p className="text-platinum capitalize">{s.v}</p></div>)}
            </div>
          </div>

          <div className="glass-card rounded-sm p-6">
            <h3 className="text-gold-primary text-sm font-semibold tracking-widest uppercase mb-4">Loan Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { l: 'Requested Amount', v: formatCurrency(app.loanDetails?.requestedAmount) },
                { l: 'Tenure',           v: `${app.loanDetails?.requestedTenure} months` },
                { l: 'Purpose',          v: app.loanDetails?.purpose },
                { l: 'Annual Income',    v: formatCurrency(app.financialSnapshot?.declaredIncome) },
                { l: 'Credit Score',     v: app.financialSnapshot?.creditScore || '—' },
                { l: 'Existing Loans',   v: formatCurrency(app.financialSnapshot?.existingLoans) },
              ].map(s => <div key={s.l}><p className="text-muted text-xs">{s.l}</p><p className="text-platinum">{s.v}</p></div>)}
            </div>
          </div>

          {app.statusHistory?.length > 0 && (
            <div className="glass-card rounded-sm p-6">
              <h3 className="text-gold-primary text-sm font-semibold tracking-widest uppercase mb-4">Status History</h3>
              <ul className="space-y-3">
                {app.statusHistory.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-gold-primary mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-platinum capitalize">{s.status.replace('_', ' ')}</span>
                      {s.note && <span className="text-muted ml-2">— {s.note}</span>}
                      <p className="text-muted text-xs">{formatDate(s.timestamp)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <ReviewPanel application={app} onUpdate={load} />
        </div>
      </div>
    </div>
  );
}
