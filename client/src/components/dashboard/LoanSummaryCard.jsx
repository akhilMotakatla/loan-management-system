import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Badge from '../ui/Badge.jsx';
import ProgressBar from '../ui/ProgressBar.jsx';
import { formatCurrency, formatDate } from '../../utils/formatters.js';

export default function LoanSummaryCard({ loan }) {
  const paid = loan.principalAmount - loan.outstandingBalance;
  return (
    <div className="glass-card rounded-sm p-6 hover:shadow-gold transition-all duration-500">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gold-primary text-xs font-mono tracking-wider">{loan.loanNumber}</p>
          <h3 className="text-platinum font-semibold capitalize mt-1">{loan.loanType} Loan</h3>
        </div>
        <Badge status="active">{loan.status}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div><p className="text-muted text-xs">Principal</p><p className="text-platinum">{formatCurrency(loan.principalAmount)}</p></div>
        <div><p className="text-muted text-xs">Outstanding</p><p className="text-gold-primary">{formatCurrency(loan.outstandingBalance)}</p></div>
        <div><p className="text-muted text-xs">Monthly EMI</p><p className="text-platinum">{formatCurrency(loan.emiAmount)}</p></div>
        <div><p className="text-muted text-xs">Next Due</p><p className="text-platinum">{formatDate(loan.nextDueDate)}</p></div>
      </div>
      <ProgressBar value={paid} max={loan.principalAmount} label="Repaid" className="mb-4" />
      <Link to={`/loans/${loan._id}`} className="text-gold-primary text-xs flex items-center gap-1 hover:gap-2 transition-all">
        View Details <ArrowRight size={12} />
      </Link>
    </div>
  );
}
