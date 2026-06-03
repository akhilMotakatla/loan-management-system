import { useState } from 'react';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import api from '../../utils/api.js';
import toast from 'react-hot-toast';

export default function ReviewPanel({ application, onUpdate }) {
  const [approveForm, setApproveForm] = useState({ approvedAmount: application?.loanDetails?.requestedAmount || '', approvedTenure: application?.loanDetails?.requestedTenure || '', interestRate: '', conditions: '' });
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(false);

  const approve = async () => {
    setLoading(true);
    try {
      await api.put(`/admin/applications/${application._id}/approve`, { ...approveForm, approvedAmount: Number(approveForm.approvedAmount), approvedTenure: Number(approveForm.approvedTenure), interestRate: Number(approveForm.interestRate) });
      toast.success('Application approved!');
      onUpdate?.();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
    setLoading(false);
  };

  const reject = async () => {
    setLoading(true);
    try {
      await api.put(`/admin/applications/${application._id}/reject`, { rejectionReason: rejectReason });
      toast.success('Application rejected');
      onUpdate?.();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
    setLoading(false);
  };

  const disburse = async () => {
    setLoading(true);
    try {
      await api.post(`/admin/applications/${application._id}/disburse`);
      toast.success('Loan disbursed!');
      onUpdate?.();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
    setLoading(false);
  };

  if (!['submitted','under_review','docs_required','approved'].includes(application?.status)) return null;

  return (
    <div className="glass-card rounded-sm p-6 space-y-6">
      <h3 className="text-gold-primary font-semibold text-sm tracking-widest uppercase">Review Actions</h3>

      {application.status !== 'approved' && (
        <div className="space-y-4">
          <h4 className="text-silver text-sm">Approve Application</h4>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Amount ($)" type="number" value={approveForm.approvedAmount} onChange={(e) => setApproveForm({ ...approveForm, approvedAmount: e.target.value })} />
            <Input label="Tenure (months)" type="number" value={approveForm.approvedTenure} onChange={(e) => setApproveForm({ ...approveForm, approvedTenure: e.target.value })} />
            <Input label="Interest Rate (%)" type="number" step="0.1" value={approveForm.interestRate} onChange={(e) => setApproveForm({ ...approveForm, interestRate: e.target.value })} />
          </div>
          <Button onClick={approve} loading={loading} className="w-full">Approve</Button>
        </div>
      )}

      {application.status === 'approved' && (
        <Button onClick={disburse} loading={loading} className="w-full">Disburse Loan</Button>
      )}

      {application.status !== 'approved' && (
        <div className="space-y-3">
          <h4 className="text-silver text-sm">Reject Application</h4>
          <Input label="Rejection Reason" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
          <Button variant="danger" onClick={reject} loading={loading} className="w-full">Reject</Button>
        </div>
      )}
    </div>
  );
}
