import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../utils/api.js';
import { formatCurrency } from '../../utils/formatters.js';
import { colors } from '../../config/theme.js';

const PIE_COLORS = [colors.goldPrimary, colors.sapphire, colors.emerald, colors.ruby];

export default function ReportsPage() {
  const [reports, setReports] = useState(null);

  useEffect(() => {
    api.get('/admin/reports/summary').then(r => setReports(r.data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-display text-3xl font-bold text-platinum mb-8">Reports & <span className="gold-text">Analytics</span></h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-sm p-6">
          <h3 className="text-platinum font-semibold mb-4 text-sm tracking-widest uppercase">Portfolio by Loan Type</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={reports?.byType || []}>
              <XAxis dataKey="_id" stroke={colors.muted} tick={{ fontSize: 11 }} />
              <YAxis stroke={colors.muted} tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ background: colors.navyMid, border: `1px solid ${colors.glassBorder}`, borderRadius: 4 }} />
              <Bar dataKey="totalAmount" fill={colors.goldPrimary} radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-sm p-6">
          <h3 className="text-platinum font-semibold mb-4 text-sm tracking-widest uppercase">Applications by Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={reports?.byStatus || []} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={90} label={({ _id, count }) => `${_id}: ${count}`}>
                {(reports?.byStatus || []).map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: colors.navyMid, border: `1px solid ${colors.glassBorder}` }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
