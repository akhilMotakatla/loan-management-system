export default function ProgressBar({ value = 0, max = 100, label, className = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={className}>
      {label && <div className="flex justify-between text-xs text-silver mb-1"><span>{label}</span><span>{Math.round(pct)}%</span></div>}
      <div className="h-2 bg-navy-light rounded-full overflow-hidden">
        <div className="h-full bg-gold-gradient rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
