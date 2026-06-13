import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  data: { floor: number; name: string; current: number; max: number }[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; current: number; max: number } }> }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="card p-3 text-xs" style={{ border: '1px solid var(--color-border)' }}>
      <p className="font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
        {d.name}
      </p>
      <p style={{ color: 'var(--color-text-secondary)' }}>
        {d.current} / {d.max} people ({Math.round((d.current / d.max) * 100)}%)
      </p>
    </div>
  );
}

export default function OccupancyMiniChart({ data }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="card p-5"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          Floor Occupancy
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
          Current occupancy by floor
        </p>
      </div>

      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -15, bottom: 0 }} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-surface-2)', radius: 6 }} />
            <Bar
              dataKey="current"
              fill="var(--color-primary)"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
