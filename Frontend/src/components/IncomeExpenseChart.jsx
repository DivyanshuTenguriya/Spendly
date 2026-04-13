import { useEffect, useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend
} from 'recharts';
import { formatCurrency } from '../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-card border border-slate-muted/40 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-xs font-mono text-slate-300/50 mb-2">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-sm font-medium" style={{ color: p.fill }}>
          {p.name}: {formatCurrency(p.value, true)}
        </p>
      ))}
    </div>
  );
};

export default function IncomeExpenseChart({ data = [] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use provided data or show empty state
  const chartData = data.length > 0 ? data : [
    { month: 'No data', income: 0, expenses: 0 }
  ];

  return (
    <div className="card p-6 fade-up" style={{ animationDelay: '200ms' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Income vs Expenses</h2>
          <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>Last 12 months</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="w-2.5 h-2.5 rounded-sm bg-ink-400 inline-block" />Income
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-400/70 inline-block" />Expenses
          </span>
        </div>
      </div>

      {mounted ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barGap={4} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(61,74,99,0.3)" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'DM Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'DM Mono' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `₹${v / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="income"   name="Income"   fill="#d0b880" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" name="Expenses" fill="#6e9ed4" radius={[4, 4, 0, 0]} fillOpacity={0.8} />
        </BarChart>
      </ResponsiveContainer>
      ) : (
        <div className="h-[200px] flex items-center justify-center dark:text-slate-300/60 text-slate-500">Loading chart...</div>
      )}
    </div>
  );
}
