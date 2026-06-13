import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockHVACState, mockHVACRuntimeData } from '../data/mockData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Wind, AlertTriangle, Power, Gauge, Clock, Zap, Settings, Shield } from 'lucide-react';

const statusColors = {
  active: 'var(--color-success)',
  idle: 'var(--color-text-tertiary)',
  maintenance: 'var(--color-warning)',
  emergency: 'var(--color-danger)',
};

export default function HVACPage() {
  const hvac = mockHVACState;
  const [coolingLevel, setCoolingLevel] = useState(hvac.currentCoolingLevel);
  const [override, setOverride] = useState(hvac.overrideActive);
  const [emergency, setEmergency] = useState(hvac.emergencyMode);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
          Zone-level HVAC monitoring with RL-driven cooling adjustments
        </p>
      </motion.div>

      {/* Top Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cooling Slider */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Gauge size={16} style={{ color: 'var(--color-primary)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Cooling Level</span>
          </div>
          <div className="text-center py-2">
            <span className="text-4xl font-bold" style={{ color: 'var(--color-primary)' }}>{coolingLevel}</span>
            <span className="text-lg" style={{ color: 'var(--color-text-tertiary)' }}>%</span>
          </div>
          <input
            type="range" min={0} max={100} value={coolingLevel}
            onChange={(e) => setCoolingLevel(Number(e.target.value))}
            className="w-full mt-2 accent-[#1e9df1]"
          />
          <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
            <span>Off</span><span>Low</span><span>Medium</span><span>High</span><span>Max</span>
          </div>
        </motion.div>

        {/* Override Toggle */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Settings size={16} style={{ color: 'var(--color-warning)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>HVAC Override</span>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
            Manual override disables RL agent control
          </p>
          <button
            onClick={() => setOverride(!override)}
            className="w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-0 transition-all"
            style={{
              background: override ? 'var(--color-warning)' : 'var(--color-surface-2)',
              color: override ? 'white' : 'var(--color-text-secondary)',
            }}
          >
            {override ? 'Override Active' : 'Enable Override'}
          </button>
        </motion.div>

        {/* Emergency Mode */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={16} style={{ color: 'var(--color-danger)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Emergency Mode</span>
          </div>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
            Sets all zones to maximum cooling immediately
          </p>
          <button
            onClick={() => setEmergency(!emergency)}
            className="w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer border-0 transition-all"
            style={{
              background: emergency ? 'var(--color-danger)' : 'var(--color-surface-2)',
              color: emergency ? 'white' : 'var(--color-text-secondary)',
            }}
          >
            {emergency ? '⚠ Emergency Active' : 'Activate Emergency'}
          </button>
        </motion.div>
      </div>

      {/* Zone Grid */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
          Zone Activity
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hvac.zones.map((zone, i) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="card p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className="status-dot" style={{ background: statusColors[zone.status], color: statusColors[zone.status] }} />
                  <span className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {zone.name}
                  </span>
                </div>
                <span className="badge text-[9px]" style={{ background: `${statusColors[zone.status]}15`, color: statusColors[zone.status] }}>
                  {zone.status}
                </span>
              </div>
              {/* Cooling gauge */}
              <div className="relative h-2 rounded-full overflow-hidden mb-3" style={{ background: 'var(--color-surface-2)' }}>
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${zone.coolingLevel}%` }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.6 }}
                  style={{ background: 'var(--color-primary)' }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>Cooling</span>
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{zone.coolingLevel}%</p>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>Temp</span>
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{zone.currentTemp}°C → {zone.targetTemp}°C</p>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>Runtime</span>
                  <p className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{zone.runtime}h</p>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>Efficiency</span>
                  <p className="font-semibold" style={{ color: zone.efficiency > 85 ? 'var(--color-success)' : 'var(--color-warning)' }}>{zone.efficiency}%</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Runtime Chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>HVAC Runtime</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Hourly runtime & efficiency</p>
          </div>
          <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            <span className="flex items-center gap-1"><Clock size={12} /> Total: {hvac.totalRuntime}h</span>
            <span className="flex items-center gap-1"><Zap size={12} /> {hvac.energyUsage} kWh</span>
          </div>
        </div>
        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockHVACRuntimeData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="runtimeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)', borderRadius: '0.85rem', fontSize: 12 }} />
              <Area type="monotone" dataKey="runtime" stroke="var(--color-primary)" strokeWidth={2} fill="url(#runtimeGrad)" dot={false} name="Runtime (h)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
