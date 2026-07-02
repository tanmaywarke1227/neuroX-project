import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';
import { useNotifications, type AlertSeverity } from '../../hooks/useNotifications';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon, Sun, Bell, Search, X, LogOut, AlertTriangle, WifiOff, Info,
  LayoutDashboard, Thermometer, Brain, Sliders, BarChart3, GraduationCap,
  Network, FileText, Settings, Home,
} from 'lucide-react';

// ─── Page Titles ───────────────────────────────────────────────────
const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/room': 'Room Digital Twin',
  '/rl-engine': 'RL Control Engine',
  '/hvac': 'HVAC Control',
  '/analytics': 'Analytics',
  '/training': 'Training Monitor',
  '/architecture': 'System Architecture',
  '/settings': 'Settings',
  '/reports': 'Reports',
};

// ─── Search Dictionary ────────────────────────────────────────────
interface SearchEntry {
  keywords: string[];
  route: string;
  label: string;
  icon: typeof LayoutDashboard;
  hash?: string;
}

const searchIndex: SearchEntry[] = [
  { keywords: ['dashboard', 'home', 'overview', 'kpi', 'live'], route: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { keywords: ['room', 'twin', 'digital', 'bedroom', 'layout', 'sensor', 'placement'], route: '/room', label: 'Room Digital Twin', icon: Home },
  { keywords: ['rl', 'engine', 'reinforcement', 'learning', 'reward', 'action', 'state', 'td3', 'agent', 'ai'], route: '/rl-engine', label: 'RL Control Engine', icon: Brain },
  { keywords: ['hvac', 'manual', 'override', 'relay', 'cooling', 'heating', 'light', 'control', 'on', 'off'], route: '/hvac', label: 'HVAC Control', icon: Sliders },
  { keywords: ['analytics', 'statistics', 'histogram', 'scatter', 'correlation', 'distribution', 'duty', 'cycle'], route: '/analytics', label: 'Analytics', icon: BarChart3 },
  { keywords: ['temperature', 'temp', 'indoor', 'outdoor', 'bmp280', 'heat'], route: '/dashboard', label: 'Temperature Charts', icon: Thermometer, hash: 'temperature' },
  { keywords: ['pressure', 'barometric', 'hpa', 'atmospheric'], route: '/dashboard', label: 'Pressure Chart', icon: BarChart3, hash: 'pressure' },
  { keywords: ['power', 'energy', 'watt', 'sct', 'current', 'consumption', 'kwh'], route: '/analytics', label: 'Energy Analytics', icon: BarChart3, hash: 'energy' },
  { keywords: ['training', 'episode', 'loss', 'hyperparameter', 'train', 'model'], route: '/training', label: 'Training Monitor', icon: GraduationCap },
  { keywords: ['architecture', 'system', 'diagram', 'flow', 'stack'], route: '/architecture', label: 'Architecture', icon: Network },
  { keywords: ['report', 'export', 'session', 'log', 'history'], route: '/reports', label: 'Reports', icon: FileText },
  { keywords: ['settings', 'config', 'pico', 'ip', 'polling', 'target'], route: '/settings', label: 'Settings', icon: Settings },
];

// ─── Severity Styles ──────────────────────────────────────────────
const severityConfig: Record<AlertSeverity, { color: string; bg: string; Icon: typeof AlertTriangle }> = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', Icon: WifiOff },
  warning:  { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', Icon: AlertTriangle },
  info:     { color: '#22c55e', bg: 'rgba(34,197,94,0.08)', Icon: Info },
};

// ─── Component ────────────────────────────────────────────────────
export default function Topbar() {
  const { isDark, toggle } = useThemeStore();
  const { user, logout } = useAuth();
  const { alerts, unreadCount, markAllRead, clearAlerts } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Dashboard';

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Profile dropdown state
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowSearchResults(false);
        setShowNotifications(false);
        setShowProfile(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) setShowSearchResults(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Search results (fuzzy match)
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return searchIndex.filter((entry) =>
      entry.keywords.some((kw) => kw.includes(q)) || entry.label.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [searchQuery]);

  const handleSearchNavigate = (entry: SearchEntry) => {
    const path = entry.hash ? `${entry.route}#${entry.hash}` : entry.route;
    navigate(path);
    setSearchQuery('');
    setShowSearchResults(false);

    // Smooth scroll to hash target after navigation
    if (entry.hash) {
      setTimeout(() => {
        const el = document.getElementById(entry.hash!);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      handleSearchNavigate(searchResults[0]);
    }
  };

  const handleBellClick = () => {
    setShowNotifications((prev) => !prev);
    setShowProfile(false);
  };

  const userInitials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2)
    : 'NX';

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b shrink-0 transition-colors relative z-50"
      style={{ background: 'var(--color-surface-0)', borderColor: 'var(--color-border)' }}
    >
      <div>
        <h1 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">

        {/* ─── Search ─────────────────────────────────────── */}
        <div ref={searchContainerRef} className="relative">
          <form onSubmit={handleSearchSubmit}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all"
            style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)', maxWidth: '260px', width: '100%' }}
          >
            <Search size={15} style={{ color: 'var(--color-text-tertiary)' }} />
            <input ref={searchInputRef} type="text" placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full bg-transparent border-none focus:outline-none text-sm placeholder-gray-500"
              style={{ color: 'var(--color-text-primary)' }}
            />
            {searchQuery ? (
              <button type="button" onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}
                className="bg-transparent border-0 cursor-pointer p-0" style={{ color: 'var(--color-text-tertiary)' }}>
                <X size={14} />
              </button>
            ) : (
              <kbd className="text-xs px-1.5 py-0.5 rounded hidden sm:inline font-mono font-bold cursor-pointer"
                onClick={() => searchInputRef.current?.focus()}
                style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-tertiary)', fontSize: '10px' }}>
                ⌘K
              </kbd>
            )}
          </form>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {showSearchResults && searchResults.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 right-0 w-72 rounded-xl overflow-hidden shadow-2xl z-50"
                style={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)' }}
              >
                <div className="p-2">
                  <p className="text-[10px] font-semibold px-2.5 py-1 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
                    Navigate to
                  </p>
                  {searchResults.map((entry) => (
                    <button key={entry.label + (entry.hash || '')} onClick={() => handleSearchNavigate(entry)}
                      className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm cursor-pointer border-0 transition-colors text-left"
                      style={{ background: 'transparent', color: 'var(--color-text-primary)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <entry.icon size={16} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                      <div>
                        <span className="font-medium">{entry.label}</span>
                        {entry.hash && (
                          <span className="text-[10px] ml-1.5 px-1.5 py-0.5 rounded-md"
                            style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-tertiary)' }}>
                            #{entry.hash}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Notification Bell ──────────────────────────── */}
        <div ref={notifRef} className="relative">
          <button onClick={handleBellClick}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-colors cursor-pointer border-0"
            style={{ background: showNotifications ? 'var(--color-surface-2)' : 'transparent', color: 'var(--color-text-secondary)' }}
            onMouseEnter={(e) => { if (!showNotifications) e.currentTarget.style.background = 'var(--color-surface-2)'; }}
            onMouseLeave={(e) => { if (!showNotifications) e.currentTarget.style.background = 'transparent'; }}
            title="System Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-white text-[9px] font-bold px-1"
                style={{ background: 'var(--color-danger)', boxShadow: '0 0 8px rgba(239,68,68,0.5)' }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </button>

          {/* Notification Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 right-0 w-80 rounded-xl overflow-hidden shadow-2xl z-50"
                style={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)' }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Notifications</span>
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-[10px] font-medium bg-transparent border-0 cursor-pointer"
                        style={{ color: 'var(--color-primary)' }}>Mark all read</button>
                    )}
                    {alerts.length > 0 && (
                      <button onClick={clearAlerts} className="text-[10px] font-medium bg-transparent border-0 cursor-pointer"
                        style={{ color: 'var(--color-text-tertiary)' }}>Clear</button>
                    )}
                  </div>
                </div>

                {/* Alert List */}
                <div className="max-h-80 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                  {alerts.length === 0 ? (
                    <div className="py-10 text-center">
                      <Bell size={24} className="mx-auto mb-2 opacity-20" style={{ color: 'var(--color-text-tertiary)' }} />
                      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>No notifications yet</p>
                    </div>
                  ) : (
                    alerts.slice(0, 20).map((alert) => {
                      const cfg = severityConfig[alert.severity];
                      return (
                        <div key={alert.id}
                          className="flex items-start gap-3 px-4 py-3 transition-colors"
                          style={{
                            background: alert.read ? 'transparent' : cfg.bg,
                            borderBottom: '1px solid var(--color-border)',
                          }}
                        >
                          <div className="mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: cfg.bg }}>
                            <cfg.Icon size={14} style={{ color: cfg.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
                              {alert.message}
                            </p>
                            <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                              {alert.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </p>
                          </div>
                          {!alert.read && (
                            <span className="w-2 h-2 rounded-full mt-1 flex-shrink-0" style={{ background: cfg.color }} />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ─── Theme Toggle ──────────────────────────────── */}
        <button onClick={toggle}
          className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors cursor-pointer border-0"
          style={{ background: 'transparent', color: 'var(--color-text-secondary)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* ─── User Avatar + Profile Dropdown ────────────── */}
        <div ref={profileRef} className="relative">
          <div onClick={() => { setShowProfile((p) => !p); setShowNotifications(false); }}
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer ml-1 transition-transform hover:scale-105 shadow-md"
            title={user?.name || 'Profile'}
            style={{ background: 'var(--color-primary)', color: 'white' }}
          >
            {userInitials}
          </div>

          <AnimatePresence>
            {showProfile && (
              <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-2 right-0 w-56 rounded-xl overflow-hidden shadow-2xl z-50"
                style={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)' }}
              >
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{user?.name || 'NeuroX User'}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{user?.email || 'admin@neurox.io'}</p>
                </div>
                <div className="p-2">
                  <button onClick={() => { navigate('/settings'); setShowProfile(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer border-0 transition-colors text-left"
                    style={{ background: 'transparent', color: 'var(--color-text-primary)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <Settings size={15} style={{ color: 'var(--color-text-tertiary)' }} /> Settings
                  </button>
                  <button onClick={() => { logout(); navigate('/'); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer border-0 transition-colors text-left"
                    style={{ background: 'transparent', color: 'var(--color-danger)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.06)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}