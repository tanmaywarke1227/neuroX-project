import { motion } from 'framer-motion';
import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';
import {
  Users,
  Thermometer,
  Wind,
  Snowflake,
  Zap,
  TrendingDown,
  Brain,
  Activity,
  TrendingUp,
  Minus,
} from 'lucide-react';
import type { KPIData } from '../../types';

const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  Users,
  Thermometer,
  Wind,
  Snowflake,
  Zap,
  TrendingDown,
  Brain,
  Activity,
};

interface Props {
  data: KPIData;
  index: number;
}

export default function KPICard({ data, index }: Props) {
  const numValue = typeof data.value === 'number' ? data.value : 0;
  const isNumeric = typeof data.value === 'number';
  const decimals = isNumeric && numValue % 1 !== 0 ? 1 : 0;
  const animated = useAnimatedCounter(numValue, 1200 + index * 100, decimals);

  const Icon = iconMap[data.icon] || Activity;

  const statusColor =
    data.status === 'good'
      ? 'var(--color-success)'
      : data.status === 'warning'
      ? 'var(--color-warning)'
      : data.status === 'critical'
      ? 'var(--color-danger)'
      : 'var(--color-text-tertiary)';

  const changeColor =
    data.changeDirection === 'up'
      ? data.label.includes('Energy') || data.label.includes('Cooling')
        ? 'var(--color-warning)'
        : 'var(--color-success)'
      : data.changeDirection === 'down'
      ? data.label.includes('Energy')
        ? 'var(--color-success)'
        : 'var(--color-text-secondary)'
      : 'var(--color-text-tertiary)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="card p-5 flex flex-col gap-3 cursor-default"
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${statusColor}12`, color: statusColor }}
        >
          <Icon size={20} strokeWidth={1.8} />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="status-dot status-dot-active" />
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
            Live
          </span>
        </div>
      </div>

      {/* Value */}
      <div>
        <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-tertiary)' }}>
          {data.label}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span
            className="text-2xl font-bold tabular-nums"
            style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)' }}
          >
            {isNumeric ? animated : data.value}
          </span>
          {data.unit && (
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
              {data.unit}
            </span>
          )}
        </div>
      </div>

      {/* Change */}
      {data.change !== 0 && (
        <div className="flex items-center gap-1">
          {data.changeDirection === 'up' ? (
            <TrendingUp size={13} style={{ color: changeColor }} />
          ) : data.changeDirection === 'down' ? (
            <TrendingDown size={13} style={{ color: changeColor }} />
          ) : (
            <Minus size={13} style={{ color: changeColor }} />
          )}
          <span className="text-xs font-semibold" style={{ color: changeColor }}>
            {Math.abs(data.change)}%
          </span>
          <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            vs last hour
          </span>
        </div>
      )}
    </motion.div>
  );
}
