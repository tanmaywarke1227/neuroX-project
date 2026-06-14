import { motion } from 'framer-motion';
import { Building2, Users, Brain, Monitor, ArrowDown, Database, Cpu, BarChart3 } from 'lucide-react';

const layers = [
  {
    id: 'simulation',
    title: 'Layer 1 — Building Simulation',
    subtitle: 'Physical Environment Engine',
    icon: Building2,
    color: '#1e9df1',
    items: ['Temperature Models', 'HVAC Physics', 'Occupancy Patterns', 'Weather Integration'],
    desc: 'Simulates the physical building environment including thermal dynamics, HVAC response curves, and occupancy flows.',
  },
  {
    id: 'occupancy',
    title: 'Layer 2 — Occupancy Analysis',
    subtitle: 'Behavioral Intelligence',
    icon: Users,
    color: '#00b87a',
    items: ['Sensor Fusion', 'Pattern Detection', 'Peak Prediction', 'Floor Analytics'],
    desc: 'Processes occupancy sensor data to detect patterns, predict peak hours, and feed behavioral insights to the RL engine.',
  },
  {
    id: 'rl-engine',
    title: 'Layer 3 — RL Control Engine',
    subtitle: 'Decision Intelligence (Stable-Baselines3)',
    icon: Brain,
    color: '#f7b928',
    items: ['State Encoder', 'TD3 Agent', 'Reward Calculator', 'Policy Optimizer'],
    desc: 'Core reinforcement learning engine that observes building state and decides optimal HVAC actions to minimize energy while maintaining comfort.',
  },
  {
    id: 'dashboard',
    title: 'Layer 4 — Dashboard Visualization',
    subtitle: 'NeuroX Intelligence Platform',
    icon: Monitor,
    color: '#e0245e',
    items: ['Real-time Metrics', 'Interactive Charts', 'Building Twin', 'Control Interface'],
    desc: 'Presents all data through an enterprise-grade interface enabling operators to monitor, understand, and override RL decisions.',
  },
];

const dataFlows = [
  { from: 'simulation', to: 'occupancy', label: 'Sensor Data' },
  { from: 'occupancy', to: 'rl-engine', label: 'State Vector' },
  { from: 'rl-engine', to: 'simulation', label: 'HVAC Actions' },
  { from: 'rl-engine', to: 'dashboard', label: 'Decisions + Metrics' },
];

export default function ArchitecturePage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
          System architecture and data flow visualization
        </p>
      </motion.div>

      {/* Architecture Diagram */}
      <div className="space-y-0">
        {layers.map((layer, i) => (
          <div key={layer.id}>
            <motion.div
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
              className="card p-6"
              style={{ borderLeft: `3px solid ${layer.color}` }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${layer.color}15` }}
                >
                  <layer.icon size={22} style={{ color: layer.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {layer.title}
                    </h3>
                    <span className="badge" style={{ background: `${layer.color}15`, color: layer.color }}>
                      {layer.subtitle}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--color-text-secondary)' }}>
                    {layer.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {layer.items.map((item) => (
                      <span
                        key={item}
                        className="text-[10px] font-medium px-2 py-1 rounded-md"
                        style={{ background: 'var(--color-surface-1)', color: 'var(--color-text-secondary)' }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Arrow */}
            {i < layers.length - 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 + i * 0.15 }}
                className="flex items-center justify-center py-2"
              >
                <div className="flex flex-col items-center">
                  <ArrowDown size={18} style={{ color: 'var(--color-text-tertiary)' }} />
                  <span className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                    {dataFlows[i]?.label || ''}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* Data Flow Summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="card p-5"
      >
        <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          Technology Stack
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Database, label: 'Backend', items: ['Flask', 'Python', 'PostgreSQL'] },
            { icon: Brain, label: 'ML Engine', items: ['Stable-Baselines3', 'PyTorch', 'Gymnasium'] },
            { icon: Cpu, label: 'Simulation', items: ['NumPy', 'Custom Env', 'Occupancy Model'] },
            { icon: BarChart3, label: 'Frontend', items: ['React', 'TypeScript', 'Recharts'] },
          ].map((stack, i) => (
            <motion.div
              key={stack.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.06 }}
              className="p-4 rounded-xl text-center"
              style={{ background: 'var(--color-surface-1)' }}
            >
              <stack.icon size={20} className="mx-auto mb-2" style={{ color: 'var(--color-primary)' }} />
              <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{stack.label}</p>
              <div className="mt-2 space-y-1">
                {stack.items.map((item) => (
                  <p key={item} className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{item}</p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
