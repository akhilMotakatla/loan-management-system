import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { colors } from '../../config/theme.js';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-sm px-4 py-3 text-xs">
      <p className="text-silver mb-1">{label}</p>
      <p className="text-gold-primary">Balance: ${payload[0]?.value?.toLocaleString()}</p>
    </div>
  );
};

export default function RepaymentChart({ schedule = [] }) {
  const data = schedule.filter((_, i) => i % 6 === 0 || i === schedule.length - 1).map((s) => ({
    month: `M${s.installmentNo}`, balance: s.balance,
  }));

  return (
    <div className="glass-card rounded-sm p-6">
      <h3 className="text-platinum font-semibold mb-4 text-sm tracking-widest uppercase">Repayment Progress</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.goldPrimary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors.goldPrimary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" stroke={colors.muted} tick={{ fontSize: 10 }} />
          <YAxis stroke={colors.muted} tick={{ fontSize: 10 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="balance" stroke={colors.goldPrimary} fill="url(#goldGrad)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
