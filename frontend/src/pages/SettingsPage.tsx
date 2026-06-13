import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { Moon, Sun, Bell, Globe, User, Key, Server } from 'lucide-react';

export default function SettingsPage() {
  const { isDark, toggle } = useThemeStore();

  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
          Platform configuration and preferences
        </p>
      </motion.div>

      {/* Appearance */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          {isDark ? <Moon size={16} style={{ color: 'var(--color-primary)' }} /> : <Sun size={16} style={{ color: 'var(--color-warning)' }} />}
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Appearance</h3>
        </div>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>Dark Mode</p>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Toggle between light and dark themes</p>
          </div>
          <button
            onClick={toggle}
            className="relative w-12 h-6 rounded-full cursor-pointer border-0 transition-colors"
            style={{
              background: isDark ? 'var(--color-primary)' : 'var(--color-surface-3)',
            }}
          >
            <motion.div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white"
              animate={{ left: isDark ? 26 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={16} style={{ color: 'var(--color-primary)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Notifications</h3>
        </div>
        {[
          { label: 'System Alerts', desc: 'HVAC faults, sensor failures', defaultOn: true },
          { label: 'Energy Thresholds', desc: 'Peak load warnings', defaultOn: true },
          { label: 'RL Agent Updates', desc: 'Policy changes, training milestones', defaultOn: false },
          { label: 'Occupancy Anomalies', desc: 'Unusual patterns detected', defaultOn: true },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{item.label}</p>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{item.desc}</p>
            </div>
            <div
              className="w-12 h-6 rounded-full cursor-pointer transition-colors"
              style={{ background: item.defaultOn ? 'var(--color-primary)' : 'var(--color-surface-3)' }}
            >
              <div
                className="w-5 h-5 rounded-full bg-white mt-0.5 transition-all"
                style={{ marginLeft: item.defaultOn ? 26 : 2 }}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* API Configuration */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Server size={16} style={{ color: 'var(--color-primary)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>API Configuration</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Backend URL</label>
            <input type="text" className="input" defaultValue="http://localhost:5000" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>API Key</label>
            <input type="password" className="input" defaultValue="nx_sk_demo_key_xxxxx" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Polling Interval</label>
            <input type="text" className="input" defaultValue="5000ms" />
          </div>
          <button className="btn-primary mt-2">Save Configuration</button>
        </div>
      </motion.div>

      {/* Profile */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <User size={16} style={{ color: 'var(--color-primary)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Profile</h3>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: 'var(--color-primary)', color: 'white' }}>
            NX
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>NeuroX Admin</p>
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>admin@neurox.io · Enterprise License</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Display Name</label>
            <input type="text" className="input" defaultValue="NeuroX Admin" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Email</label>
            <input type="email" className="input" defaultValue="admin@neurox.io" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
