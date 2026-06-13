import { useThemeStore } from '../../store/themeStore';
import { Moon, Sun, Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Executive Command Center',
  '/building': 'Digital Building Twin',
  '/occupancy': 'Occupancy Intelligence',
  '/rl-engine': 'RL Control Engine',
  '/hvac': 'HVAC Operations Center',
  '/energy': 'Energy Analytics Lab',
  '/training': 'RL Training Monitor',
  '/simulation': 'Simulation Center',
  '/architecture': 'System Architecture',
  '/reports': 'Reports & Insights',
  '/settings': 'Settings',
};

export default function Topbar() {
  const { isDark, toggle } = useThemeStore();
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b shrink-0"
      style={{
        background: 'var(--color-surface-0)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Page Title */}
      <div>
        <h1
          className="text-xl font-semibold tracking-tight"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {title}
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer"
          style={{
            background: 'var(--color-surface-1)',
            border: '1px solid var(--color-border)',
          }}
        >
          <Search size={15} style={{ color: 'var(--color-text-tertiary)' }} />
          <span
            className="text-sm hidden sm:inline"
            style={{ color: 'var(--color-text-tertiary)' }}
          >
            Search...
          </span>
          <kbd
            className="text-xs px-1.5 py-0.5 rounded hidden sm:inline"
            style={{
              background: 'var(--color-surface-2)',
              color: 'var(--color-text-tertiary)',
              fontSize: '10px',
            }}
          >
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button
          className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors cursor-pointer border-0"
          style={{ background: 'transparent', color: 'var(--color-text-secondary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-surface-2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          title="Notifications"
        >
          <Bell size={18} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: 'var(--color-danger)' }}
          />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggle}
          className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors cursor-pointer border-0"
          style={{ background: 'transparent', color: 'var(--color-text-secondary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-surface-2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* User Avatar */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer ml-1"
          style={{
            background: 'var(--color-primary)',
            color: 'white',
          }}
        >
          NX
        </div>
      </div>
    </header>
  );
}
