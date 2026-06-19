import { motion } from 'framer-motion';
import {
  Cpu, Thermometer, Radio, Zap, CircleDot, Wifi,
  Server, Brain, BarChart3, Monitor, ArrowRight,
  Database, GitBranch, Layers,
} from 'lucide-react';

const architectureLayers = [
  {
    title: 'Hardware Layer',
    subtitle: 'Physical Sensors & Actuators',
    color: 'var(--color-success)',
    items: [
      { name: 'Raspberry Pi Pico W', desc: 'Edge MCU · WiFi-enabled · MicroPython', icon: Cpu },
      { name: 'BME280 Sensor', desc: 'Temperature / Humidity / Pressure · I²C', icon: Thermometer },
      { name: 'PIR Motion Sensor', desc: 'Binary occupancy detection · GPIO', icon: Radio },
      { name: 'SCT-013 Current Clamp', desc: 'Non-invasive AC current · ADC', icon: Zap },
      { name: '2-Channel Relay', desc: 'Heating + Cooling HVAC control · GPIO', icon: CircleDot },
    ],
  },
  {
    title: 'Communication Layer',
    subtitle: 'Data Transport & API',
    color: 'var(--color-primary)',
    items: [
      { name: 'MQTT / REST API', desc: 'Pico W → Backend via WiFi', icon: Wifi },
      { name: 'Flask Backend', desc: 'Python REST API · CORS · JSON', icon: Server },
      { name: 'PostgreSQL (Neon)', desc: 'Cloud-hosted relational database', icon: Database },
      { name: 'SQLAlchemy ORM', desc: 'Python ORM · migration · models', icon: GitBranch },
    ],
  },
  {
    title: 'AI / RL Layer',
    subtitle: 'Decision Intelligence',
    color: 'var(--color-warning)',
    items: [
      { name: 'TD3 Agent', desc: 'Twin Delayed DDPG · Stable-Baselines3', icon: Brain },
      { name: 'Reward Calculator', desc: 'Comfort (0.6) + Energy (0.4) penalty', icon: BarChart3 },
      { name: 'State Normalizer', desc: 'Indoor/Outdoor temp · Occupancy → [0,1]', icon: Layers },
      { name: 'Action Space', desc: 'Continuous [-1, +1] → Relay control', icon: CircleDot },
    ],
  },
  {
    title: 'Frontend Layer',
    subtitle: 'Visualization & Monitoring',
    color: 'var(--color-danger)',
    items: [
      { name: 'React + Vite', desc: 'TypeScript · SPA · Hot reload', icon: Monitor },
      { name: 'Recharts', desc: 'Sensor data visualization · real-time', icon: BarChart3 },
      { name: 'React Query', desc: 'Server state · auto-refetch · caching', icon: GitBranch },
      { name: 'Framer Motion', desc: 'Micro-animations · transitions', icon: Layers },
    ],
  },
];

const dataFlowSteps = [
  { label: 'Sensors', desc: 'BME280 + PIR + SCT-013 read physical environment', color: 'var(--color-success)' },
  { label: 'Pico W', desc: 'Normalizes readings → sends via REST/MQTT', color: 'var(--color-success)' },
  { label: 'Flask API', desc: 'Receives payload → feeds to TD3 model', color: 'var(--color-primary)' },
  { label: 'TD3 Agent', desc: 'Observes state → selects action [-1, +1]', color: 'var(--color-warning)' },
  { label: 'Relay', desc: 'Translates action → switches heating/cooling relay', color: 'var(--color-danger)' },
  { label: 'Dashboard', desc: 'Displays state, action, reward in real-time', color: 'var(--color-primary)' },
];

export default function ArchitecturePage() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
          System Architecture · Hardware-in-the-Loop RL HVAC Control
        </p>
      </motion.div>

      {/* Data Flow Pipeline */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-5">
        <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
          RL Decision Pipeline
        </h3>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {dataFlowSteps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-1 shrink-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="rounded-xl p-3 text-center min-w-[110px]"
                style={{ background: `${step.color}10`, border: `1.5px solid ${step.color}30` }}
              >
                <p className="text-[10px] font-bold" style={{ color: step.color }}>{step.label}</p>
                <p className="text-[8px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{step.desc}</p>
              </motion.div>
              {i < dataFlowSteps.length - 1 && (
                <ArrowRight size={14} style={{ color: 'var(--color-text-tertiary)' }} className="shrink-0" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Architecture Layers */}
      <div className="space-y-4">
        {architectureLayers.map((layer, layerIdx) => (
          <motion.div
            key={layer.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + layerIdx * 0.08 }}
            className="card p-5"
            style={{ borderLeft: `3px solid ${layer.color}` }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: `${layer.color}15` }}
              >
                <span className="text-xs font-bold" style={{ color: layer.color }}>L{layerIdx + 1}</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{layer.title}</h3>
                <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{layer.subtitle}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {layer.items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl"
                  style={{ background: 'var(--color-surface-1)' }}
                >
                  <item.icon size={14} style={{ color: layer.color }} className="shrink-0" />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>{item.name}</p>
                    <p className="text-[9px]" style={{ color: 'var(--color-text-tertiary)' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reward Formula */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-5">
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
          Reward Function
        </h3>
        <div className="p-4 rounded-xl font-mono text-sm" style={{ background: 'var(--color-surface-1)', color: 'var(--color-text-primary)' }}>
          <p><span style={{ color: 'var(--color-primary)' }}>R(s, a)</span> = -(</p>
          <p className="pl-4"><span style={{ color: 'var(--color-warning)' }}>0.6</span> × |T<sub>indoor</sub> - T<sub>target</sub>| <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>← comfort penalty</span></p>
          <p className="pl-4">+ <span style={{ color: 'var(--color-danger)' }}>0.4</span> × |a| × 5.0 <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>← energy penalty</span></p>
          <p>)</p>
        </div>
        <p className="text-[10px] mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
          The agent maximizes this reward by minimizing temperature deviation from 24°C while using minimal energy (HVAC action magnitude).
        </p>
      </motion.div>
    </div>
  );
}
