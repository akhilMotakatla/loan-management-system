import { APPLICATION_STATUSES } from '../../config/constants.js';

export default function Badge({ status, children, className = '' }) {
  const s = APPLICATION_STATUSES[status] || { label: status, color: 'text-silver', bg: 'bg-navy-mid' };
  return (
    <span className={`${s.bg} ${s.color} text-xs px-3 py-1 rounded-full font-medium tracking-wide ${className}`}>
      {children || s.label}
    </span>
  );
}
