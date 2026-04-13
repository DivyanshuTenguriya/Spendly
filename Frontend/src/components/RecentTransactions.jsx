import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { categories } from '../data/mockData';
import { formatCurrency, formatDate, getCategoryMeta } from '../utils/helpers';

function TransactionRow({ tx }) {
  const meta    = getCategoryMeta(categories, tx.category);
  const isDebit = tx.type === 'expense';

  return (
    <div className="flex items-center gap-4 py-3 dark:border-slate-muted/15 border-slate-600/20 last:border-0 dark:hover:bg-slate-muted/10 hover:bg-slate-300/10 -mx-2 px-2 rounded-lg transition-colors cursor-default group">
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
        style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}25` }}
      >
        {meta.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{tx.description || tx.desc}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className="chip py-0.5 text-[10px]"
            style={{ background: `${meta.color}12`, color: meta.color, border: `1px solid ${meta.color}20` }}
          >
            {tx.category}
          </span>
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{formatDate(tx.date)}</span>
        </div>
      </div>

      {/* Amount */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {isDebit
          ? <ArrowDownLeft size={13} className="text-red-400" />
          : <ArrowUpRight  size={13} className="text-emerald-400" />
        }
        <span className={`text-sm font-mono font-semibold ${isDebit ? 'text-red-400' : 'text-emerald-400'}`}>
          {isDebit ? '-' : '+'}{formatCurrency(Math.abs(tx.amount))}
        </span>
      </div>
    </div>
  );
}

export default function RecentTransactions({ data = [], onNavigate }) {
  if (data.length === 0) {
    return (
      <div className="card p-6 fade-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Transactions</h2>
          <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>Latest activity</p>
        </div>
        </div>
        <div className="flex items-center justify-center h-40" style={{ color: 'var(--text-muted)' }}>
          <p className="text-sm">No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 fade-up" style={{ animationDelay: '300ms' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Transactions</h2>
          <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>Latest activity</p>
        </div>
        <button
          onClick={() => onNavigate?.('transactions')}
          className="text-xs text-ink-600 dark:text-ink-400 hover:text-ink-700 dark:hover:text-ink-300 transition-colors font-medium"
        >
          View all →
        </button>
      </div>

      <div>
        {data.slice(0, 5).map((tx, i) => (
          <TransactionRow key={i} tx={tx} />
        ))}
      </div>
    </div>
  );
}
