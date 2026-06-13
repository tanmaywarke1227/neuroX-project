import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BuildingVisualization from '../components/building/BuildingVisualization';
import FloorDetail from '../components/building/FloorDetail';
import { mockBuildingState } from '../data/mockData';
import type { FloorData } from '../types';
import { Thermometer, Users, Snowflake, Cloud, MapPin } from 'lucide-react';

type ViewMode = 'occupancy' | 'temperature' | 'cooling';

export default function BuildingTwinPage() {
  const [selectedFloor, setSelectedFloor] = useState<FloorData | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('occupancy');
  const building = mockBuildingState;

  const viewModes: { key: ViewMode; label: string; icon: typeof Users }[] = [
    { key: 'occupancy', label: 'Occupancy', icon: Users },
    { key: 'temperature', label: 'Temperature', icon: Thermometer },
    { key: 'cooling', label: 'Cooling', icon: Snowflake },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            Interactive building model with real-time data overlay
          </p>
        </div>

        {/* View Mode Switcher */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: 'var(--color-surface-2)' }}
        >
          {viewModes.map((mode) => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border-0"
              style={{
                background: viewMode === mode.key ? 'var(--color-surface-0)' : 'transparent',
                color: viewMode === mode.key ? 'var(--color-primary)' : 'var(--color-text-tertiary)',
                boxShadow: viewMode === mode.key ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <mode.icon size={13} />
              {mode.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Building Info Bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-4 flex flex-wrap items-center gap-6"
      >
        <div className="flex items-center gap-2">
          <MapPin size={15} style={{ color: 'var(--color-primary)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            {building.name}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          <span>{building.totalFloors} Floors</span>
          <span>·</span>
          <span>{building.totalOccupancy}/{building.maxOccupancy} Occupants</span>
          <span>·</span>
          <span>{building.averageTemperature}°C Indoor</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Cloud size={12} />
            {building.outdoorTemperature}°C Outdoor
          </span>
        </div>
        <div className="ml-auto">
          <span className="badge badge-success">
            <span className="status-dot status-dot-active" style={{ width: 6, height: 6 }} />
            System Health: {building.systemHealth}%
          </span>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Building Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="mb-4">
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Building Overview
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
              Click a floor to see details · Colored by {viewMode}
            </p>
          </div>
          <BuildingVisualization
            floors={building.floors}
            onFloorSelect={setSelectedFloor}
            selectedFloor={selectedFloor}
            viewMode={viewMode}
          />

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
            {viewMode === 'occupancy' && (
              <>
                <LegendItem color="#00b87a" label="Low (<30%)" />
                <LegendItem color="#f7b928" label="Medium (30-60%)" />
                <LegendItem color="#ff8c42" label="High (60-85%)" />
                <LegendItem color="#e0245e" label="Full (>85%)" />
              </>
            )}
            {viewMode === 'temperature' && (
              <>
                <LegendItem color="#1e9df1" label="Cool (<21°C)" />
                <LegendItem color="#00b87a" label="Optimal (21-23°C)" />
                <LegendItem color="#f7b928" label="Warm (23-25°C)" />
                <LegendItem color="#e0245e" label="Hot (>25°C)" />
              </>
            )}
            {viewMode === 'cooling' && (
              <>
                <LegendItem color="#b8d4e3" label="Low (<30%)" />
                <LegendItem color="#1e9df1" label="Medium (30-60%)" />
                <LegendItem color="#0d7dd6" label="High (60-85%)" />
                <LegendItem color="#0a5ea0" label="Max (>85%)" />
              </>
            )}
          </div>
        </motion.div>

        {/* Floor Detail / Summary */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {selectedFloor ? (
              <FloorDetail key={selectedFloor.id} floor={selectedFloor} />
            ) : (
              <motion.div
                key="summary"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="card p-5"
              >
                <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
                  Floor Summary
                </h3>
                <div className="space-y-2">
                  {building.floors.map((floor, i) => {
                    const pct = Math.round((floor.totalOccupancy / floor.maxOccupancy) * 100);
                    return (
                      <motion.div
                        key={floor.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3 py-2.5 px-3 rounded-xl cursor-pointer transition-colors"
                        onClick={() => setSelectedFloor(floor)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--color-surface-1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                        >
                          F{floor.floorNumber}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                            {floor.name.split(' — ')[1] || floor.name}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
                              <motion.div
                                className="h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ delay: 0.3 + i * 0.05, duration: 0.6 }}
                                style={{
                                  background: pct > 80 ? 'var(--color-danger)' : pct > 50 ? 'var(--color-warning)' : 'var(--color-success)',
                                }}
                              />
                            </div>
                            <span className="text-xs font-mono" style={{ color: 'var(--color-text-tertiary)' }}>
                              {pct}%
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                            {floor.averageTemperature}°C
                          </p>
                          <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                            {floor.activeHvacZones}/{floor.hvacZones} HVAC
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
      <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{label}</span>
    </div>
  );
}
