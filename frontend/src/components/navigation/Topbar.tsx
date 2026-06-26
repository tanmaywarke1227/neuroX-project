import { useState, useEffect, useRef } from 'react';
import { useThemeStore } from '../../store/themeStore';
import { Moon, Sun, Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/room': 'Room Digital Twin',
  '/rl-engine': 'RL Control Engine',
  '/hvac': 'HVAC Control',
  '/analytics': 'Analytics',
  '/training': 'Training Monitor',
  '/architecture': 'System Architecture',
  '/settings': 'Settings',
  '/reports': 'Reports', // Added the missing reports route
};

export default function Topbar() {
  const { isDark, toggle } = useThemeStore();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  // State and Refs for functional search
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Implement the Cmd+K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault(); // Prevent default browser search
        searchInputRef.current?.focus(); // Focus our custom input
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // In a full production app, this would filter your logs or routes.
    // For the demo, we show a clean alert to prove interactivity.
    alert(`System indexing lookup executed for: "${searchQuery}"`);
    setSearchQuery(''); // Clear after search
    searchInputRef.current?.blur(); // Unfocus
  };

  // Handle Notifications Click
  const handleNotificationsClick = () => {
    alert("System Alerts: TD3 Agent operating optimally. No hardware faults detected.");
  };

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b shrink-0 transition-colors"
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
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Functional Interactive Search Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all"
          style={{
            background: 'var(--color-surface-1)',
            border: '1px solid var(--color-border)',
            maxWidth: '250px',
            width: '100%',
          }}
        >
          <Search size={15} style={{ color: 'var(--color-text-tertiary)' }} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none focus:outline-none text-sm placeholder-gray-500"
            style={{ color: 'var(--color-text-primary)' }}
          />
          <kbd
            className="text-xs px-1.5 py-0.5 rounded hidden sm:inline font-mono font-bold cursor-pointer hover:opacity-80"
            onClick={() => searchInputRef.current?.focus()}
            style={{
              background: 'var(--color-surface-2)',
              color: 'var(--color-text-tertiary)',
              fontSize: '10px',
            }}
          >
            ⌘K
          </kbd>
        </form>

        {/* Functional Notifications */}
        <button
          onClick={handleNotificationsClick}
          className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors cursor-pointer border-0"
          style={{ background: 'transparent', color: 'var(--color-text-secondary)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-surface-2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          title="System Notifications"
        >
          <Bell size={18} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"
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
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer ml-1 transition-transform hover:scale-105 shadow-md"
          title="NeuroX Admin Profile"
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