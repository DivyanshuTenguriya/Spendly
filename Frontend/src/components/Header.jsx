import { Bell, Calendar, Menu, Sun, Moon } from 'lucide-react';

export default function Header({ pageTitle, onMenuClick, theme, onToggleTheme, onNotificationClick }) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <header
      className="relative flex flex-wrap items-center justify-between gap-4 px-4 sm:px-8 py-4 backdrop-blur-md z-10 border-b"
      style={{
        backgroundColor: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-primary)',
      }}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden inline-flex items-center justify-center rounded-xl p-2 transition-colors"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            borderColor: 'var(--border-color)',
          }}
          aria-label="Open navigation"
        >
          <Menu size={16} />
        </button>
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {pageTitle}
          </h1>
          <p className="text-xs font-mono mt-0.5 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
            <Calendar size={11} /> {today}
          </p>
        </div>
      </div>

      <div className="absolute right-4 top-4 flex items-center gap-3 md:static md:order-none">
        {/* Notifications */}
        <button
          onClick={onNotificationClick}
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
        >
          <Bell size={15} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)',
          }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>
    </header>
  );
}
