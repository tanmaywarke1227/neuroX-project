import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { mockOccupancyData } from '../data/mockData';
import { Clock, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

const heatmapColors = ['#eef6fd', '#c3e0f7', '#7cbde8', '#1e9df1', '#0d7dd6', '#0a5ea0'];

function getHeatmapColor(value: number) {
  if (value < 10) return heatmapColors[0];
  if (value < 25) return heatmapColors[1];
  if (value < 45) return heatmapColors[2];
  if (value < 65) return heatmapColors[3];
  if (value < 80) return heatmapColors[4];
  return heatmapColors[5];
}

export default function OccupancyPage() {
  const data = mockOccupancyData;
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
          Occupancy patterns, peak detection, and behavioral analysis
        </p>
      </motion.div>

      {/* Occupancy Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }} className="card p-5"
      >
        <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
          Weekly Occupancy Heatmap
        </h3>
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
          Hour × Day occupancy density
        </p>
        <div className="overflow-x-auto">
          <div style={{ minWidth: 700 }}>
            {/* Header row */}
            <div className="flex items-center gap-0.5 mb-1">
              <div style={{ width: 40 }} />
              {hours.map((h) => (
                <div
                  key={h}
                  className="flex-1 text-center text-[9px]"
                  style={{ color: 'var(--color-text-tertiary)', minWidth: 24 }}
                >
                  {h % 3 === 0 ? `${h}h` : ''}
                </div>
              ))}
            </div>
            {/* Rows */}
            {days.map((day) => (
              <div key={day} className="flex items-center gap-0.5 mb-0.5">
                <div
                  className="text-xs font-medium"
                  style={{ width: 40, color: 'var(--color-text-secondary)' }}
                >
                  {day}
                </div>
                {hours.map((h) => {
                  const point = data.heatmap.find((p) => p.day === day && p.hour === h);
                  const val = point?.occupancy ?? 0;
                  return (
                    <motion.div
                      key={h}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + (days.indexOf(day) * 24 + h) * 0.002 }}
                      className="flex-1 rounded-sm cursor-crosshair"
                      style={{
                        background: getHeatmapColor(val),
                        height: 24,
                        minWidth: 24,
                      }}
                      title={`${day} ${h}:00 — ${val}% occupancy`}
                    />
                  );
                })}
              </div>
            ))}
            {/* Legend */}
            <div className="flex items-center gap-2 mt-3 ml-10">
              <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Low</span>
              {heatmapColors.map((c, i) => (
                <div key={i} className="w-6 h-3 rounded-sm" style={{ background: c }} />
              ))}
              <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>High</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Hourly Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }} className="card p-5"
        >
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Today's Occupancy Timeline
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
            Hourly occupancy percentage
          </p>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.hourly} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="occGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="timestamp" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} interval={3} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-surface-0)', border: '1px solid var(--color-border)',
                    borderRadius: '0.85rem', fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2} fill="url(#occGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Floor-wise Occupancy */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }} className="card p-5"
        >
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Floor-wise Distribution
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
            Current vs maximum capacity
          </p>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.floorWise} margin={{ top: 5, right: 10, left: -15, bottom: 0 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-surface-0)', border: '1px solid var(--color-border)',
                    borderRadius: '0.85rem', fontSize: 12,
                  }}
                />
                <Bar dataKey="max" fill="var(--color-surface-3)" radius={[4, 4, 0, 0]} maxBarSize={30} name="Max Capacity" />
                <Bar dataKey="current" fill="var(--color-primary)" radius={[4, 4, 0, 0]} maxBarSize={30} name="Current" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Behavioral Patterns */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
          Behavioral Patterns
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.patterns.map((pattern, i) => (
            <motion.div
              key={pattern.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.06 }}
              className="card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                {pattern.trend === 'increasing' ? (
                  <TrendingUp size={14} style={{ color: 'var(--color-success)' }} />
                ) : pattern.trend === 'decreasing' ? (
                  <TrendingDown size={14} style={{ color: 'var(--color-danger)' }} />
                ) : (
                  <Minus size={14} style={{ color: 'var(--color-text-tertiary)' }} />
                )}
                <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {pattern.label}
                </span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                {pattern.description}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1">
                  <Clock size={11} style={{ color: 'var(--color-text-tertiary)' }} />
                  <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                    Peak: {pattern.peakHour}:00
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <AlertCircle size={11} style={{ color: 'var(--color-text-tertiary)' }} />
                  <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                    Avg: {pattern.avgOccupancy}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
