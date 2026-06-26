import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadialBarChart, RadialBar, Legend,
} from 'recharts';
import { useLiveHardware, type DashboardState } from '../hooks/useLiveHardware';
import {
  Thermometer, Zap, Brain, TrendingDown, BarChart3, Gauge, Activity,
  Timer, Percent, ArrowUpDown,
} from 'lucide-react';

// Chart tooltip style (reusable)
const ttStyle = {
  background: 'var(--color-surface-0)',
  border: '1px solid var(--color-border)',
  borderRadius: '0.85rem',
  fontSize: 11,
};

export default function AnalyticsPage() {
  const { data, isOffline } = useLiveHardware();
  const [history, setHistory] = useState<DashboardState[]>([]);

  useEffect(() => {
    if (data && !isOffline) {
      setHistory((prev) => [...prev, data].slice(-200));
    }
  }, [data, isOffline]);

  const targetTemp = 24;

  // ── Derived metrics ──────────────────────────────────────────
  const stats = useMemo(() => {
    if (!history.length) return null;
    const temps = history.map((p) => p.temperature);
    const temps2 = history.map((p) => (p as any).temperature_2 ?? p.temperature);
    const powers = history.map((p) => p.power_draw_w || 0);
    const occupancies = history.map((p) => p.occupancy);
    const relays = history.map((p) => p.relay_cool);

    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const min = (arr: number[]) => Math.min(...arr);
    const max = (arr: number[]) => Math.max(...arr);
    const std = (arr: number[]) => {
      const m = avg(arr);
      return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
    };

    const avgT = avg(temps);
    const avgP = avg(powers);
    const hvacOnCount = relays.filter((r) => r === 1).length;
    const occupiedCount = occupancies.filter((o) => o === 1).length;
    const totalPoints = history.length;

    return {
      avgTemp: avgT, minTemp: min(temps), maxTemp: max(temps), stdTemp: std(temps),
      avgTemp2: avg(temps2), minTemp2: min(temps2), maxTemp2: max(temps2),
      avgPower: avgP, maxPower: max(powers), totalEnergy: (avgP * totalPoints * 2) / 3600, // kWh approx
      hvacDuty: totalPoints > 0 ? (hvacOnCount / totalPoints) * 100 : 0,
      occupancyRate: totalPoints > 0 ? (occupiedCount / totalPoints) * 100 : 0,
      comfortScore: Math.max(0, Math.round(100 - Math.abs(avgT - targetTemp) * 10)),
      efficiency: avgP > 0 ? Math.max(0, Math.round(100 - (avgP / 2000) * 100)) : 100,
      tempDelta: avgT - avg(temps2),
      totalPoints,
    };
  }, [history]);

  // ── Chart Data ───────────────────────────────────────────────

  // 1. Temperature distribution (histogram buckets)
  const tempDistribution = useMemo(() => {
    if (history.length < 5) return [];
    const temps = history.map((p) => p.temperature);
    const lo = Math.floor(Math.min(...temps));
    const hi = Math.ceil(Math.max(...temps));
    const bucketSize = Math.max(0.5, (hi - lo) / 10);
    const buckets: { range: string; count: number; mid: number }[] = [];
    for (let b = lo; b < hi; b += bucketSize) {
      const count = temps.filter((t) => t >= b && t < b + bucketSize).length;
      buckets.push({ range: `${b.toFixed(1)}`, count, mid: b + bucketSize / 2 });
    }
    return buckets;
  }, [history]);

  // 2. Temp vs Power scatter (correlation)
  const tempVsPower = useMemo(() => {
    return history.map((p) => ({
      temp: p.temperature,
      power: p.power_draw_w || 0,
    }));
  }, [history]);

  // 3. HVAC duty cycle over sliding windows (every 10 data points)
  const dutyCycleTimeline = useMemo(() => {
    const windowSize = 10;
    const result: { window: number; duty: number; avgTemp: number }[] = [];
    for (let i = 0; i <= history.length - windowSize; i += windowSize) {
      const slice = history.slice(i, i + windowSize);
      const onCount = slice.filter((p) => p.relay_cool === 1).length;
      const avgT = slice.reduce((s, p) => s + p.temperature, 0) / slice.length;
      result.push({
        window: Math.floor(i / windowSize),
        duty: (onCount / windowSize) * 100,
        avgTemp: parseFloat(avgT.toFixed(1)),
      });
    }
    return result;
  }, [history]);

  // 4. RL reward decomposition over time
  const rewardTimeline = useMemo(() => {
    return history.map((p, i) => {
      const comfortPen = Math.abs(p.temperature - targetTemp) * 1.5;
      const energyPen = (p.power_draw_w || 0) / 500;
      return {
        index: i,
        net: parseFloat((10 - comfortPen - energyPen).toFixed(2)),
        comfort: -parseFloat(comfortPen.toFixed(2)),
        energy: -parseFloat(energyPen.toFixed(2)),
      };
    });
  }, [history]);

  // 5. Cumulative energy over time
  const cumulativeEnergy = useMemo(() => {
    let cum = 0;
    return history.map((p, i) => {
      cum += (p.power_draw_w || 0) * 2 / 3600; // Wh per 2-second sample
      return { index: i, energy_wh: parseFloat(cum.toFixed(2)) };
    });
  }, [history]);

  // 6. Radial gauge data for KPIs
  const gaugeData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: 'Comfort', value: stats.comfortScore, fill: stats.comfortScore > 70 ? '#22c55e' : '#f59e0b' },
      { name: 'Efficiency', value: stats.efficiency, fill: stats.efficiency > 60 ? '#3b82f6' : '#ef4444' },
      { name: 'Occupancy', value: Math.round(stats.occupancyRate), fill: '#a855f7' },
    ];
  }, [stats]);

  // ── Render ───────────────────────────────────────────────────

  if (!data && history.length === 0) {
    return (
      <div className="p-6 text-center opacity-50 font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
        Collecting sensor data for analytics... Connect hardware to begin.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
          Session Analytics · {history.length} samples collected · {stats ? `Δt = ${stats.tempDelta.toFixed(1)}°C indoor-outdoor spread` : 'Warming up...'}
        </p>
      </motion.div>

      {/* ── KPI Stats Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: 'Avg Temp', value: stats ? `${stats.avgTemp.toFixed(1)}°C` : '--', icon: Thermometer, color: 'var(--color-warning)' },
          { label: 'Temp Range', value: stats ? `${stats.minTemp.toFixed(1)}–${stats.maxTemp.toFixed(1)}°C` : '--', icon: ArrowUpDown, color: 'var(--color-primary)' },
          { label: 'Std Dev', value: stats ? `±${stats.stdTemp.toFixed(2)}°C` : '--', icon: Activity, color: '#a855f7' },
          { label: 'Outdoor Avg', value: stats ? `${stats.avgTemp2.toFixed(1)}°C` : '--', icon: Thermometer, color: '#3b82f6' },
          { label: 'Peak Power', value: stats ? `${stats.maxPower.toFixed(0)}W` : '--', icon: Zap, color: 'var(--color-danger)' },
          { label: 'Energy Used', value: stats ? `${stats.totalEnergy.toFixed(1)} Wh` : '--', icon: Gauge, color: 'var(--color-warning)' },
          { label: 'HVAC Duty', value: stats ? `${stats.hvacDuty.toFixed(0)}%` : '--', icon: Timer, color: 'var(--color-primary)' },
          { label: 'Occupancy', value: stats ? `${stats.occupancyRate.toFixed(0)}%` : '--', icon: Percent, color: '#22c55e' },
        ].map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * i }} className="card p-3 text-center">
            <card.icon size={14} className="mx-auto mb-1" style={{ color: card.color }} />
            <p className="text-sm font-bold" style={{ color: card.color }}>{card.value}</p>
            <p className="text-[9px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Row 1: Radial Gauges + Temperature Distribution ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Radial Performance Gauges */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={16} style={{ color: 'var(--color-primary)' }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Performance Scores</h3>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-tertiary)' }}>Comfort · Efficiency · Occupancy</p>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="25%" outerRadius="90%" data={gaugeData} startAngle={180} endAngle={0} barSize={14}>
                <RadialBar dataKey="value" cornerRadius={8} background={{ fill: 'var(--color-surface-1)' }}>
                  {gaugeData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </RadialBar>
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10, color: 'var(--color-text-tertiary)', bottom: 0 }} />
                <Tooltip contentStyle={ttStyle} formatter={(v: any) => [`${v}%`, '']} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Temperature Distribution Histogram */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }} className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={16} style={{ color: 'var(--color-warning)' }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Temperature Distribution</h3>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-tertiary)' }}>Frequency histogram of indoor readings</p>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tempDistribution} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={ttStyle} formatter={(v: any) => [`${v} samples`, 'Count']} labelFormatter={(l) => `${l}°C`} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                  {tempDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.mid < targetTemp - 2 ? '#3b82f6' : entry.mid > targetTemp + 2 ? '#ef4444' : '#22c55e'} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Temp vs Power Scatter */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Activity size={16} style={{ color: '#a855f7' }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Temp vs Power Correlation</h3>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-tertiary)' }}>Does higher temp = more power draw?</p>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="temp" type="number" tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} name="Temp" unit="°C" domain={['dataMin - 1', 'dataMax + 1']} />
                <YAxis dataKey="power" type="number" tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} name="Power" unit="W" />
                <Tooltip contentStyle={ttStyle} cursor={{ strokeDasharray: '3 3' }} formatter={(v: any, name: string) => [name === 'temp' ? `${v}°C` : `${v}W`, name === 'temp' ? 'Temperature' : 'Power']} />
                <Scatter data={tempVsPower} fill="#a855f7" opacity={0.6} isAnimationActive={false} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ── Row 2: HVAC Duty Cycle + RL Reward Decomposition ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* HVAC Duty Cycle Timeline */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Timer size={16} style={{ color: 'var(--color-primary)' }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>HVAC Duty Cycle vs Temperature</h3>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
            AC on-time % per window (10 samples each) overlaid with avg temperature
          </p>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dutyCycleTimeline} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="window" tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="d" tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <YAxis yAxisId="t" orientation="right" tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip contentStyle={ttStyle} labelFormatter={() => ''} />
                <Bar yAxisId="d" dataKey="duty" fill="var(--color-primary)" opacity={0.3} radius={[3, 3, 0, 0]} isAnimationActive={false} name="Duty %" />
                <Line yAxisId="t" type="monotone" dataKey="avgTemp" stroke="var(--color-warning)" strokeWidth={2} dot={{ r: 2 }} isAnimationActive={false} name="Avg Temp °C" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-5 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ background: 'var(--color-primary)', opacity: 0.3 }} />
              <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>HVAC On-Time %</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded" style={{ background: 'var(--color-warning)' }} />
              <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Temperature °C</span>
            </div>
          </div>
        </motion.div>

        {/* RL Reward Decomposition (stacked area) */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.23 }} className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Brain size={16} style={{ color: 'var(--color-primary)' }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>RL Reward Decomposition</h3>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
            Net reward = Base(10) − comfort penalty − energy penalty
          </p>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rewardTimeline} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="index" tick={false} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={ttStyle} labelFormatter={() => ''} />
                <Area type="monotone" dataKey="net" stroke="#22c55e" strokeWidth={2} fill="url(#netGrad)" dot={false} isAnimationActive={false} name="Net Reward" />
                <Line type="monotone" dataKey="comfort" stroke="var(--color-warning)" strokeWidth={1} strokeDasharray="3 3" dot={false} isAnimationActive={false} name="Comfort Penalty" />
                <Line type="monotone" dataKey="energy" stroke="var(--color-danger)" strokeWidth={1} strokeDasharray="3 3" dot={false} isAnimationActive={false} name="Energy Penalty" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded" style={{ background: '#22c55e', opacity: 0.5 }} />
              <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Net Reward</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded" style={{ background: 'var(--color-warning)' }} />
              <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Comfort Penalty</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 rounded" style={{ background: 'var(--color-danger)' }} />
              <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Energy Penalty</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Row 3: Cumulative Energy + Energy Savings Projection ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cumulative Energy Consumption */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.26 }} className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={16} style={{ color: 'var(--color-warning)' }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Cumulative Energy Consumption</h3>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
            Total energy used since session start (Wh)
          </p>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeEnergy} margin={{ top: 5, right: 10, left: -5, bottom: 0 }}>
                <defs>
                  <linearGradient id="cumGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-warning)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--color-warning)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="index" tick={false} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v} Wh`} />
                <Tooltip contentStyle={ttStyle} formatter={(v: any) => [`${v} Wh`, 'Cumulative']} labelFormatter={() => ''} />
                <Area type="monotone" dataKey="energy_wh" stroke="var(--color-warning)" strokeWidth={2} fill="url(#cumGrad)" dot={false} isAnimationActive={false} name="Energy (Wh)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Energy Savings Projection */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.29 }} className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={16} style={{ color: 'var(--color-success)' }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Weekly Savings Projection</h3>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
            Estimated savings: RL agent vs always-on thermostat
          </p>
          <div style={{ height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    label: 'Weekly Projection',
                    baseline: stats ? Math.round((stats.avgPower === 0 ? 1500 : stats.avgPower * 1.4) * 24 * 7 / 1000) : 0,
                    optimized: stats ? Math.round(stats.avgPower * 24 * 7 / 1000) : 0,
                  },
                ]}
                margin={{ top: 5, right: 10, left: -5, bottom: 0 }}
                barCategoryGap="30%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v} kWh`} />
                <Tooltip contentStyle={ttStyle} formatter={(v: any) => [`${v} kWh`, '']} />
                <Bar dataKey="baseline" fill="var(--color-text-tertiary)" radius={[6, 6, 0, 0]} name="Standard AC" opacity={0.35} isAnimationActive={false} />
                <Bar dataKey="optimized" fill="var(--color-success)" radius={[6, 6, 0, 0]} name="TD3 Agent" isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ background: 'var(--color-text-tertiary)', opacity: 0.35 }} />
              <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Standard Thermostat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ background: 'var(--color-success)' }} />
              <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Your TD3 Agent</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
