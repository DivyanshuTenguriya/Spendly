import { categories } from '../data/mockData';
import { getCategoryMeta, formatCurrency, pct } from '../utils/helpers';

function BudgetRow({ goal }) {
  const meta   = getCategoryMeta(categories, goal.category);
  const percent = pct(goal.spent, goal.budget);
  const over    = goal.spent > goal.budget;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{meta.icon}</span>
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{meta.label}</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className={over ? 'text-red-400' : ''} style={{ color: over ? 'var(--danger)' : 'var(--text-secondary)' }}>
            {formatCurrency(goal.spent, true)}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>{formatCurrency(goal.budget, true)}</span>
        </div>
      </div>

      <div className="relative h-1.5 dark:bg-slate-muted/30 bg-slate-400/20 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(percent, 100)}%`,
            background: over
              ? 'linear-gradient(90deg, #f87171, #ef4444)'
              : `linear-gradient(90deg, ${meta.color}bb, ${meta.color})`,
          }}
        />
      </div>

      <div className="flex justify-between">
        <span className={`text-[10px] font-mono ${over ? 'text-red-400' : ''}`} style={{ color: over ? 'var(--danger)' : 'var(--text-muted)' }}>
          {over ? `₹${formatCurrency(goal.spent - goal.budget, true).replace('₹', '')} over budget` : `${percent}% used`}
        </span>
        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
          {over ? '⚠' : `${formatCurrency(goal.budget - goal.spent, true)} left`}
        </span>
      </div>
    </div>
  );
}

export default function BudgetProgress({ data = [], onNavigate }) {
  if (data.length === 0) {
    return (
      <div className="card p-6 fade-up" style={{ animationDelay: '500ms' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Budget Goals</h2>
            <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>No budgets set</p>
          </div>
          <button
            onClick={() => onNavigate?.('budgets')}
            className="text-xs text-ink-600 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-300 transition-colors font-medium"
          >
            Create →
          </button>
        </div>
        <div className="flex items-center justify-center h-40" style={{ color: 'var(--text-muted)' }}>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No budget goals yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 fade-up" style={{ animationDelay: '500ms' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
            <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Budget Goals</h2>
            <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>Manage your budgets</p>
        </div>
        <button
          onClick={() => onNavigate?.('budgets')}
          className="text-xs text-ink-600 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-300 transition-colors font-medium"
        >
          Manage →
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {data.map(g => (
          <BudgetRow key={g.category} goal={g} />
        ))}
      </div>
    </div>
  );
}
