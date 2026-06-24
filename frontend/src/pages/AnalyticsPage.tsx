import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { mockSensorHistory, mockHVACActivity, mockEnergyComparison, mockRLEngineState } from '../data/mockData';
import { useHVACHistory } from '../hooks/useDataHooks';
import {
  Thermometer, Droplets, UserCheck, Zap, Clock, Brain, TrendingDown,
  Target, Activity,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { data: historyData } = useHVACHistory(50);

  // Prepare chart data from sensor history
  const tempHumData = mockSensorHistory.map((p) => ({
    time: new Date(p.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    temperature: p.temperature,
    pressure: p.pressure,
  }));

  const occupancyData = mockSensorHistory.map((p) => ({
    time: new Date(p.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    occupied: p.occupied ? 1 : 0,
  }));

  const energyData = mockSensorHistory.map((p) => ({
    time: new Date(p.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    power: p.power_watts,
  }));

  // RL Reward progression from decision history
  const rewardData = mockRLEngineState.decisionHistory.map((d) => ({
    time: d.timestamp,
    reward: d.reward.totalReward,
    energy: d.reward.energyPenalty,
    comfort: d.reward.comfortPenalty,
  }));

  // Comfort score (how close to target temp)
  const targetTemp = 24;
  const avgTemp = mockSensorHistory.reduce((s, p) => s + p.temperature, 0) / mockSensorHistory.length;
  const comfortScore = Math.max(0, Math.round(100 - Math.abs(avgTemp - targetTemp) * 10));

  // Total energy today (estimated from power readings)
  const avgPower = mockSensorHistory.reduce((s, p) => s + p.power_watts, 0) / mockSensorHistory.length;
  const estDailyKwh = Math.round(avgPower * 24 / 1000 * 10) / 10;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
          Room-Level Analytics · Bedroom 1 — Sensor Data Trends
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Comfort Score', value: `${comfortScore}/100`, icon: Target, color: comfortScore > 80 ? 'var(--color-success)' : 'var(--color-warning)' },
          { label: 'Est. Daily Energy', value: `${estDailyKwh} kWh`, icon: Zap, color: 'var(--color-warning)' },
          { label: 'Avg Temperature', value: `${avgTemp.toFixed(1)}°C`, icon: Thermometer, color: 'var(--color-primary)' },
          { label: 'HVAC Runtime', value: `${mockHVACActivity.filter(e => e.mode !== 'idle').reduce((s, e) => s + e.duration_minutes, 0)} min`, icon: Clock, color: 'var(--color-primary)' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.04 }} className="card p-4 text-center">
            <card.icon size={18} className="mx-auto mb-1.5" style={{ color: card.color }} />
            <p className="text-lg font-bold" style={{ color: card.color }}>{card.value}</p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Row 1: Temperature & Pressure + Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Temperature & Pressure Trend */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer size={16} style={{ color: 'var(--color-warning)' }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Temperature & Pressure</h3>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Last 6 hours · BMP280 sensor</p>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempHumData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} interval={Math.floor(tempHumData.length / 8)} />
                <YAxis yAxisId="t" tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <YAxis yAxisId="h" orientation="right" tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)', borderRadius: '0.85rem', fontSize: 11 }} />
                <Line yAxisId="t" type="monotone" dataKey="temperature" stroke="var(--color-warning)" strokeWidth={2} dot={false} name="Temp °C" />
                <Line yAxisId="h" type="monotone" dataKey="pressure" stroke="var(--color-primary)" strokeWidth={1.5} dot={false} name="Pressure atm" strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Occupancy Trend */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <UserCheck size={16} style={{ color: 'var(--color-success)' }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Occupancy Trend</h3>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Last 6 hours · PIR motion sensor (1 = occupied, 0 = empty)</p>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} interval={Math.floor(occupancyData.length / 8)} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} domain={[0, 1.2]} ticks={[0, 1]} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)', borderRadius: '0.85rem', fontSize: 11 }} formatter={(v: number) => [v === 1 ? 'Occupied' : 'Empty', 'Status']} />
                <Area type="stepAfter" dataKey="occupied" stroke="var(--color-success)" strokeWidth={2} fill="url(#occGrad)" dot={false} name="Occupancy" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Row 2: Energy + HVAC Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Energy Consumption */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} style={{ color: 'var(--color-warning)' }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Energy Consumption</h3>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Last 6 hours · SCT-013 current clamp (Watts)</p>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-warning)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--color-warning)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} interval={Math.floor(energyData.length / 8)} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)', borderRadius: '0.85rem', fontSize: 11 }} formatter={(v: number) => [`${v}W`, 'Power']} />
                <Area type="monotone" dataKey="power" stroke="var(--color-warning)" strokeWidth={2} fill="url(#energyGrad)" dot={false} name="Power (W)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* RL Reward Progression */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Brain size={16} style={{ color: 'var(--color-primary)' }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>RL Reward Progression</h3>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Reward per decision step (comfort + energy penalty)</p>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rewardData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} interval={3} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)', borderRadius: '0.85rem', fontSize: 11 }} />
                <Line type="monotone" dataKey="reward" stroke="var(--color-success)" strokeWidth={2} dot={false} name="Total Reward" />
                <Line type="monotone" dataKey="energy" stroke="var(--color-danger)" strokeWidth={1} dot={false} name="Energy Penalty" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="comfort" stroke="var(--color-warning)" strokeWidth={1} dot={false} name="Comfort Penalty" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Row 3: Energy Savings Comparison */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-5">
        <div className="flex items-center gap-2 mb-1">
          <TrendingDown size={16} style={{ color: 'var(--color-success)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Energy Savings Comparison</h3>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
          RL-optimized vs non-optimized HVAC energy (Wh per week)
        </p>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockEnergyComparison} margin={{ top: 5, right: 10, left: -15, bottom: 0 }} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="period" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)', borderRadius: '0.85rem', fontSize: 11 }} formatter={(v: number) => [`${(v / 1000).toFixed(1)}k Wh`, '']} />
              <Bar dataKey="nonOptimized" fill="var(--color-text-tertiary)" radius={[4, 4, 0, 0]} name="Without RL" opacity={0.4} />
              <Bar dataKey="optimized" fill="var(--color-success)" radius={[4, 4, 0, 0]} name="With RL" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ background: 'var(--color-text-tertiary)', opacity: 0.4 }} />
            <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Without RL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ background: 'var(--color-success)' }} />
            <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>With RL (TD3)</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
