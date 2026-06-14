import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { mockEnergyMetrics } from '../data/mockData';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { Zap, TrendingDown, Leaf, BarChart3, Lightbulb } from 'lucide-react';

export default function EnergyPage() {
  const data = mockEnergyMetrics;
  const savings = useAnimatedCounter(data.costSavings, 1500, 0);
  const carbon = useAnimatedCounter(data.carbonReduction, 1500, 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
          Energy consumption, savings analysis, and optimization metrics
        </p>
      </motion.div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Current Load', value: `${data.currentConsumption}`, unit: 'kW', icon: Zap, color: 'var(--color-primary)' },
          { label: 'Monthly Savings', value: `₹${savings}`, unit: '', icon: TrendingDown, color: 'var(--color-success)' },
          { label: 'Peak Reduction', value: `${data.peakLoadReduction}%`, unit: '', icon: BarChart3, color: 'var(--color-warning)' },
          { label: 'CO₂ Reduced', value: `${carbon}`, unit: 'kg', icon: Leaf, color: 'var(--color-success)' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            className="card p-4 text-center"
          >
            <item.icon size={18} className="mx-auto mb-2" style={{ color: item.color }} />
            <p className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              {item.value}
              {item.unit && <span className="text-sm font-normal ml-1" style={{ color: 'var(--color-text-tertiary)' }}>{item.unit}</span>}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Energy Timeline */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
        <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Energy Consumption Timeline</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Standard vs RL-Optimized · Today</p>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.timeline} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="eGradStd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-text-tertiary)" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="var(--color-text-tertiary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="eGradOpt" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="timestamp" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)', borderRadius: '0.85rem', fontSize: 12 }} />
              <Area type="monotone" dataKey="consumption" stroke="var(--color-text-tertiary)" strokeWidth={1.5} fill="url(#eGradStd)" strokeOpacity={0.5} dot={false} name="Standard" />
              <Area type="monotone" dataKey="optimized" stroke="var(--color-primary)" strokeWidth={2} fill="url(#eGradOpt)" dot={false} name="Optimized" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Comparison */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-5">
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Monthly Comparison</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Optimized vs Non-Optimized (kWh)</p>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.comparison} margin={{ top: 5, right: 10, left: -15, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="period" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)', borderRadius: '0.85rem', fontSize: 12 }} formatter={(v: number) => `${(v / 1000).toFixed(1)}k kWh`} />
                <Bar dataKey="nonOptimized" fill="var(--color-surface-3)" radius={[4, 4, 0, 0]} maxBarSize={30} name="Non-Optimized" />
                <Bar dataKey="optimized" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={30} name="RL-Optimized" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Forecast */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-5">
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>7-Day Forecast</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Predicted consumption & savings</p>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.forecast} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="timestamp" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)', borderRadius: '0.85rem', fontSize: 12 }} />
                <Line type="monotone" dataKey="consumption" stroke="var(--color-text-tertiary)" strokeWidth={1.5} strokeDasharray="5 3" dot={{ r: 3 }} name="Standard" />
                <Line type="monotone" dataKey="optimized" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 3 }} name="Optimized" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={16} style={{ color: 'var(--color-warning)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Executive Insights</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { title: 'Peak Shaving', desc: 'RL agent reduced peak load by 23% during afternoon hours by pre-cooling zones before occupancy peaks.' },
            { title: 'Off-Hours Savings', desc: 'Automatic HVAC throttling during 10PM–6AM saves approximately ₹35,000/month with zero comfort impact.' },
            { title: 'Predictive Cooling', desc: 'Agent anticipates Monday morning rush by initiating gradual cooling at 6:30 AM, reducing startup energy by 15%.' },
          ].map((insight, i) => (
            <div key={i} className="p-3 rounded-xl" style={{ background: 'var(--color-surface-1)' }}>
              <p className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{insight.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{insight.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
