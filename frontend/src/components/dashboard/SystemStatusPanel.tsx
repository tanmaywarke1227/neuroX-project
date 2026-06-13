import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface SystemItem {
  label: string;
  status: 'operational' | 'degraded' | 'down';
  uptime: string;
}

const systems: SystemItem[] = [
  { label: 'HVAC Control System', status: 'operational', uptime: '99.97%' },
  { label: 'RL Decision Engine', status: 'operational', uptime: '99.99%' },
  { label: 'Occupancy Sensors', status: 'operational', uptime: '99.85%' },
  { label: 'Energy Meters', status: 'operational', uptime: '99.92%' },
  { label: 'Building Twin Sync', status: 'operational', uptime: '99.78%' },
  { label: 'Weather API', status: 'degraded', uptime: '98.12%' },
];

const statusConfig = {
  operational: { icon: CheckCircle2, color: 'var(--color-success)', label: 'Operational' },
  degraded: { icon: AlertTriangle, color: 'var(--color-warning)', label: 'Degraded' },
  down: { icon: XCircle, color: 'var(--color-danger)', label: 'Down' },
};

export default function SystemStatusPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            System Status
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
            Infrastructure health overview
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={13} style={{ color: 'var(--color-text-tertiary)' }} />
          <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            Updated 2s ago
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {systems.map((sys, i) => {
          const cfg = statusConfig[sys.status];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={sys.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.06 }}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-surface-1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={15} style={{ color: cfg.color }} />
                <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  {sys.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                  {sys.uptime}
                </span>
                <span
                  className="badge text-[10px] px-2 py-0.5"
                  style={{
                    background: `${cfg.color}15`,
                    color: cfg.color,
                  }}
                >
                  {cfg.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
