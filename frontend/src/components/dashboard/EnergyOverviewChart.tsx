import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { EnergyDataPoint } from '../../types';

interface Props {
  data: EnergyDataPoint[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div
      className="card p-3 text-xs"
      style={{ border: '1px solid var(--color-border)', minWidth: 160 }}
    >
      <p className="font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
        {label}
      </p>
      {payload.map((p, i) => (
        <div key={i} className="flex justify-between gap-4 mb-1">
          <span style={{ color: 'var(--color-text-secondary)' }}>
            {p.dataKey === 'consumption' ? 'Standard' : 'Optimized'}
          </span>
          <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {p.value} kW
          </span>
        </div>
      ))}
    </div>
  );
}

export default function EnergyOverviewChart({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Energy Consumption
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
            Standard vs RL-Optimized · Today
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-text-tertiary)', opacity: 0.5 }} />
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Standard
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              Optimized
            </span>
          </div>
        </div>
      </div>

      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="gradConsumption" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-text-tertiary)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="var(--color-text-tertiary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradOptimized" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              vertical={false}
            />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
              tickLine={false}
              axisLine={false}
              interval={3}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="consumption"
              stroke="var(--color-text-tertiary)"
              strokeWidth={1.5}
              fill="url(#gradConsumption)"
              strokeOpacity={0.5}
              dot={false}
              activeDot={{ r: 4, fill: 'var(--color-text-tertiary)' }}
            />
            <Area
              type="monotone"
              dataKey="optimized"
              stroke="var(--color-primary)"
              strokeWidth={2}
              fill="url(#gradOptimized)"
              dot={false}
              activeDot={{ r: 4, fill: 'var(--color-primary)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
