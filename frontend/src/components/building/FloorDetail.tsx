import { motion } from 'framer-motion';
import type { FloorData } from '../../types';
import { Users, Thermometer, Wind, Cpu } from 'lucide-react';

interface Props {
  floor: FloorData;
}

export default function FloorDetail({ floor }: Props) {
  const occupancyPct = Math.round((floor.totalOccupancy / floor.maxOccupancy) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="card p-5 overflow-hidden"
    >
      {/* Floor Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {floor.name}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
            Floor {floor.floorNumber} · {floor.zones.length} zones
          </p>
        </div>
        <div className="badge badge-primary">{occupancyPct}% occupied</div>
      </div>

      {/* Floor Metrics */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { icon: Users, label: 'Occupancy', value: `${floor.totalOccupancy}/${floor.maxOccupancy}`, color: 'var(--color-primary)' },
          { icon: Thermometer, label: 'Avg Temp', value: `${floor.averageTemperature}°C`, color: 'var(--color-warning)' },
          { icon: Wind, label: 'HVAC Zones', value: `${floor.activeHvacZones}/${floor.hvacZones}`, color: 'var(--color-success)' },
          { icon: Cpu, label: 'Cooling', value: `${floor.coolingIntensity}%`, color: 'var(--color-primary)' },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="p-3 rounded-xl text-center"
            style={{ background: 'var(--color-surface-1)' }}
          >
            <metric.icon size={16} className="mx-auto mb-1.5" style={{ color: metric.color }} />
            <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{metric.value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Zone Details */}
      <div>
        <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
          Zone Details
        </p>
        <div className="space-y-1.5">
          {floor.zones.map((zone, i) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="flex items-center justify-between py-2 px-3 rounded-lg transition-colors"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-surface-1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="status-dot"
                  style={{
                    background: zone.hvacActive ? 'var(--color-success)' : 'var(--color-text-tertiary)',
                  }}
                />
                <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
                  {zone.name}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-tertiary)' }}>
                  {zone.type.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  {zone.occupancy}/{zone.maxOccupancy}
                </span>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  {zone.temperature}°C
                </span>
                <span
                  className="font-semibold"
                  style={{ color: zone.hvacActive ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }}
                >
                  {zone.coolingIntensity}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
