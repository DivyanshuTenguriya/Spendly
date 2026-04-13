import { useEffect, useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, CartesianGrid
} from 'recharts';
import { formatCurrency } from '../utils/helpers';

const CustomTooltip = ({ active, payload, label, theme = 'dark' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-xl px-4 py-3 shadow-2xl ${theme === 'dark' ? 'bg-slate-card border border-slate-muted/40' : 'bg-white border border-gray-300'}`}>
      <p className={`text-xs font-mono mb-1 ${theme === 'dark' ? 'text-slate-300/50' : 'text-gray-500'}`}>{label}</p>
      <p className="text-sm font-medium text-ink-300">{formatCurrency(payload[0].value)}</p>
    </div>
  );
};

export default function WeeklyTrendChart({ data = [], theme = 'dark' }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use provided data or show placeholder
  const chartData = data.length > 0 ? data : [
    { day: 'Mon', amount: 0 },
    { day: 'Tue', amount: 0 },
    { day: 'Wed', amount: 0 },
    { day: 'Thu', amount: 0 },
    { day: 'Fri', amount: 0 },
    { day: 'Sat', amount: 0 },
    { day: 'Sun', amount: 0 },
  ];

  return (
    <div className="card p-6 fade-up" style={{ animationDelay: '400ms' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Weekly Spending</h2>
          <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>Current week</p>
        </div>
        <div className="chip bg-ink-500/10 text-ink-300 border border-ink-500/20">
          This Week
        </div>
      </div>

      {mounted ? (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={theme === 'dark' ? '#d0b880' : '#a8803a'} stopOpacity={0.3} />
                <stop offset="95%" stopColor={theme === 'dark' ? '#d0b880' : '#a8803a'} stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? 'rgba(61,74,99,0.3)' : 'rgba(0,0,0,0.2)'} vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.6)', fontSize: 11, fontFamily: 'DM Mono' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.6)', fontSize: 11, fontFamily: 'DM Mono' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `₹${v / 1000}k`}
            />
            <Tooltip content={<CustomTooltip theme={theme} />} cursor={{ stroke: theme === 'dark' ? 'rgba(208,184,128,0.3)' : 'rgba(168,128,58,0.3)', strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke={theme === 'dark' ? '#d0b880' : '#a8803a'}
              strokeWidth={2}
              fill="url(#spendGrad)"
              dot={{ fill: theme === 'dark' ? '#d0b880' : '#a8803a', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: theme === 'dark' ? '#d0b880' : '#a8803a', strokeWidth: 2, stroke: theme === 'dark' ? '#2d3548' : '#ffffff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[180px] flex items-center justify-center text-slate-300/60">Loading chart...</div>
      )}
    </div>
  );
}
