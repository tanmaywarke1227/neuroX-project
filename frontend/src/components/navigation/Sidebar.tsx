import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Building2,
  Users,
  Brain,
  Wind,
  Zap,
  GraduationCap,
  FlaskConical,
  Network,
  FileBarChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Hexagon,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { id: 'building', label: 'Building Twin', path: '/building', icon: Building2 },
  { id: 'occupancy', label: 'Occupancy', path: '/occupancy', icon: Users },
  { id: 'rl-engine', label: 'RL Engine', path: '/rl-engine', icon: Brain },
  { id: 'hvac', label: 'HVAC', path: '/hvac', icon: Wind },
  { id: 'energy', label: 'Energy Analytics', path: '/energy', icon: Zap },
  { id: 'training', label: 'Training Monitor', path: '/training', icon: GraduationCap },
  { id: 'simulation', label: 'Simulation', path: '/simulation', icon: FlaskConical },
  { id: 'architecture', label: 'Architecture', path: '/architecture', icon: Network },
  { id: 'reports', label: 'Reports', path: '/reports', icon: FileBarChart },
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col border-r"
      style={{
        background: 'var(--color-surface-0)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 h-16 border-b shrink-0"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'var(--color-primary)' }}
        >
          <Hexagon size={20} color="white" strokeWidth={2.5} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span
                className="text-lg font-bold tracking-tight"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Neuro
              </span>
              <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                X
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5">
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.path);

            return (
              <li key={item.id}>
                <NavLink
                  to={item.path}
                  className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 no-underline"
                  style={{
                    background: isActive ? 'var(--color-primary-light)' : 'transparent',
                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--color-surface-2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                      style={{ background: 'var(--color-primary)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className="shrink-0"
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden whitespace-nowrap text-sm font-medium"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div
        className="flex items-center justify-center h-12 border-t shrink-0 cursor-pointer transition-colors"
        style={{ borderColor: 'var(--color-border)' }}
        onClick={() => setCollapsed(!collapsed)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--color-surface-2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        {collapsed ? (
          <ChevronRight size={18} style={{ color: 'var(--color-text-tertiary)' }} />
        ) : (
          <ChevronLeft size={18} style={{ color: 'var(--color-text-tertiary)' }} />
        )}
      </div>
    </motion.aside>
  );
}
