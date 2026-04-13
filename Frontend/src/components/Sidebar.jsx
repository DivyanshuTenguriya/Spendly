import { BookOpen, LayoutDashboard, ArrowLeftRight, PieChart, Target, Settings, TrendingUp, Calendar, Bell } from 'lucide-react';

const navItems = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight   },
  { id: 'analytics',    label: 'Analytics',    icon: TrendingUp       },
  { id: 'budgets',      label: 'Budgets',      icon: Target           },
  { id: 'reports',      label: 'Reports',      icon: PieChart         },
  { id: 'notifications', label: 'Notifications', icon: Bell         },
  { id: 'monthlySettings', label: 'Monthly Settings', icon: Calendar   },
  { id: 'settings',     label: 'Settings',     icon: Settings         },
];

export default function Sidebar({ active, open, onNavigate, userInfo }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 w-80 max-w-[20rem] overflow-y-auto transform transition-transform duration-300 border-r bg-[var(--bg-secondary)] px-4 py-6 flex flex-col md:static md:translate-x-0 ${open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}
      style={{
        borderColor: 'var(--border-color)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-2 mb-10">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg flex-shrink-0" style={{ backgroundColor: 'var(--accent-primary)' }}>
          <BookOpen size={16} style={{ color: 'var(--text-primary)' }} />
        </div>
        <div className="flex flex-col leading-tight">
          <p className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>Spendly</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1">
        <p className="text-[10px] font-mono font-medium uppercase tracking-widest px-3 mb-2" style={{ color: 'var(--text-muted)' }}>
          Navigation
        </p>
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left"
              style={{
                backgroundColor: isActive ? 'var(--bg-hover)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--accent-primary)' : '1px solid transparent',
              }}
            >
              <Icon
                size={17}
                style={{
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                }}
              />
              {label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--text-primary)' }}>
            {userInfo?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{userInfo?.fullName || 'User'}</p>
            <p className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{localStorage.getItem('userEmail') || 'user@example.com'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
