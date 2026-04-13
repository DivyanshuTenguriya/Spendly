import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard    from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Analytics    from './pages/Analytics';
import Budgets      from './pages/Budgets';
import Reports      from './pages/Reports';
import Settings     from './pages/Settings';
import MonthlySettings from './pages/MonthlySettings';
import Notifications from './pages/Notifications';
import { getUserInfo } from './utils/api';

const pageMeta = {
  dashboard:    { label: 'Dashboard'    },
  transactions: { label: 'Transactions' },
  analytics:    { label: 'Analytics'    },
  budgets:      { label: 'Budget Goals' },
  reports:      { label: 'Reports'      },
  notifications: { label: 'Notifications' },
  settings:     { label: 'Settings'     },
  monthlySettings: { label: 'Monthly Settings' },
};

const pages = {
  dashboard:    Dashboard,
  transactions: Transactions,
  analytics:    Analytics,
  budgets:      Budgets,
  reports:      Reports,
  notifications: Notifications,
  settings:     Settings,
  monthlySettings: MonthlySettings,
};

export default function App({ userInfo = { fullName: 'User' }, setUserInfo }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });
  const PageComponent = pages[activePage] ?? Dashboard;

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Logout detection and redirect
  useEffect(() => {
    const handleLogout = () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        // User logged out, reload page to go back to login
        window.location.href = '/';
      }
    };

    // Listen for storage changes (logout from another tab)
    window.addEventListener('storage', handleLogout);
    return () => window.removeEventListener('storage', handleLogout);
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        try {
          const response = await getUserInfo(userId);
          if (response.data.userInfo) {
            setUserInfo({ fullName: response.data.userInfo.fullName || 'User' });
            localStorage.setItem('userInfo', JSON.stringify({ fullName: response.data.userInfo.fullName || 'User' }));
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };
    fetchUserInfo();
  }, [setUserInfo]);

  const handleNavigate = (page) => {
    setActivePage(page);
    setSidebarOpen(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Sidebar active={activePage} open={sidebarOpen} onNavigate={handleNavigate} userInfo={userInfo} />
      <button
        type="button"
        className={`fixed inset-0 z-20 bg-black/40 transition-opacity md:hidden ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
        aria-label="Close navigation"
        aria-hidden={!sidebarOpen}
      />

      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <Header pageTitle={pageMeta[activePage]?.label ?? 'Dashboard'} onMenuClick={() => setSidebarOpen(true)} theme={theme} onToggleTheme={toggleTheme} onNotificationClick={() => handleNavigate('notifications')} />
        <div className="flex-1 overflow-y-auto">
          {activePage === 'settings' 
            ? <Settings theme={theme} onToggleTheme={toggleTheme} userInfo={userInfo} setUserInfo={setUserInfo} />
            : <PageComponent key={activePage} onNavigate={handleNavigate} userInfo={userInfo} setUserInfo={setUserInfo} theme={theme} />
          }
        </div>
      </main>
    </div>
  );
}
