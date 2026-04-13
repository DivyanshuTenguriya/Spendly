import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

export default function StatsCard({ title, value, sub, trend, trendValue, icon: Icon, accent, delay = 0 }) {
  const isPositive = trend === 'up';

  return (
    <div
      className="card p-5 fade-up flex flex-col gap-4 transition-colors cursor-default group"
      style={{
        animationDelay: `${delay}ms`,
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="flex items-start justify-between">
        <p className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          {title}
        </p>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            backgroundColor: `${accent}18`,
            border: `1px solid ${accent}30`,
          }}
        >
          <Icon size={16} style={{ color: accent }} />
        </div>
      </div>

      <div>
        <p className="font-display text-3xl font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
          {typeof value === 'number' ? formatCurrency(value, true) : value}
        </p>
        {sub && (
          <p className="text-xs mt-1.5 font-mono" style={{ color: 'var(--text-secondary)' }}>
            {sub}
          </p>
        )}
      </div>

      {trendValue !== undefined && (
        <div className="flex items-center gap-1.5">
          {isPositive ? (
            <TrendingUp size={13} style={{ color: 'var(--success)' }} />
          ) : (
            <TrendingDown size={13} style={{ color: 'var(--danger)' }} />
          )}
          <span
            className="text-xs font-medium"
            style={{ color: isPositive ? 'var(--success)' : 'var(--danger)' }}
          >
            {trendValue}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}
