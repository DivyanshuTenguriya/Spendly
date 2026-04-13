import { useEffect, useState } from 'react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip
} from 'recharts';
import { formatCurrency, pct } from '../utils/helpers';

const CustomTooltip = ({ active, payload, total = 0 }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl px-4 py-3 shadow-2xl" style={{ backgroundColor: 'var(--bg-tertiary)', border: `1px solid var(--border-color)` }}>
      <p className="text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>{d.name}</p>
      <p className="text-sm font-medium text-white">{formatCurrency(d.value)}</p>
      <p className="text-xs" style={{ color: d.color }}>{pct(d.value, total)}% of total</p>
    </div>
  );
};

export default function CategoryChart({ data = [] }) {
  const [mounted, setMounted] = useState(false);
  const total = data.reduce((s, d) => s + (d.value || 0), 0);

  // Assign colors to categories
  const colors = ['#d0b880', '#6e9ed4', '#c084d4', '#6dc7a4', '#f09070', '#f0c060', '#80c4e0', '#8090a8'];
  const categoryData = data.map((cat, i) => ({
    name: cat.name || 'Unknown',
    value: cat.value || 0,
    color: colors[i % colors.length]
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  if (categoryData.length === 0) {
    return (
      <div className="card p-6 fade-up" style={{ animationDelay: '300ms' }}>
        <div className="mb-5">
        <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>By Category</h2>
        <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>No data available</p>
        </div>
        <div className="flex items-center justify-center h-40" style={{ color: 'var(--text-muted)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 fade-up" style={{ animationDelay: '300ms' }}>
      <div className="mb-5">
        <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>By Category</h2>
        <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>This month's breakdown</p>
      </div>

      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
        {/* Donut */}
        <div className="relative flex-shrink-0 w-full max-w-[180px]">
          {mounted ? (
            <PieChart width={150} height={150}>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {categoryData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip total={total} />} />
            </PieChart>
          ) : (
            <div className="w-[150px] h-[150px] rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>Loading...</div>
          )}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[10px] font-mono uppercase" style={{ color: 'var(--text-muted)' }}>Total</p>
            <p className="text-sm font-display font-bold gold-text">{formatCurrency(total, true)}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          {categoryData.slice(0, 5).map(d => (
            <div key={d.name} className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
              <span className="text-xs flex-1 truncate" style={{ color: 'var(--text-muted)' }}>{d.name}</span>
              <span className="text-xs font-mono font-medium text-white">{pct(d.value, total)}%</span>
            </div>
          ))}
          {categoryData.length > 5 && <p className="text-[10px] font-mono mt-1" style={{ color: 'var(--text-muted)' }}>+{categoryData.length - 5} more</p>}
        </div>
      </div>
    </div>
  );
}
