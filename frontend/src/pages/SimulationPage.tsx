import { motion } from 'framer-motion';
import { useSimulationStore } from '../store/simulationStore';
import {
  Play, Pause, RotateCcw, Users, Thermometer, Cloud, Sun, CloudRain, CloudLightning,
  Clock, Calendar, Zap,
} from 'lucide-react';

const weatherOptions = [
  { value: 'sunny' as const, label: 'Sunny', icon: Sun },
  { value: 'cloudy' as const, label: 'Cloudy', icon: Cloud },
  { value: 'rainy' as const, label: 'Rainy', icon: CloudRain },
  { value: 'stormy' as const, label: 'Stormy', icon: CloudLightning },
];

export default function SimulationPage() {
  const sim = useSimulationStore();

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
          Simulate building scenarios and see immediate dashboard impact
        </p>
      </motion.div>

      {/* Control Buttons */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-3">
        <button
          onClick={sim.toggleRunning}
          className="btn-primary py-2.5 px-5"
          style={{ background: sim.isRunning ? 'var(--color-danger)' : 'var(--color-primary)' }}
        >
          {sim.isRunning ? <Pause size={16} /> : <Play size={16} />}
          {sim.isRunning ? 'Pause Simulation' : 'Start Simulation'}
        </button>
        <button onClick={sim.reset} className="btn-secondary py-2.5 px-5">
          <RotateCcw size={16} />
          Reset
        </button>
        {sim.isRunning && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 text-xs font-medium"
            style={{ color: 'var(--color-success)' }}
          >
            <span className="status-dot status-dot-active" />
            Simulation Running
          </motion.span>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls Panel */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5 space-y-6">
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Simulation Controls
          </h3>

          {/* Occupancy */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Users size={14} style={{ color: 'var(--color-primary)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Occupancy Level</span>
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{sim.occupancyLevel}%</span>
            </div>
            <input type="range" min={0} max={100} value={sim.occupancyLevel} onChange={(e) => sim.setOccupancy(Number(e.target.value))} className="w-full accent-[#1e9df1]" />
          </div>

          {/* Temperature */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Thermometer size={14} style={{ color: 'var(--color-warning)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Outdoor Temperature</span>
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--color-warning)' }}>{sim.temperatureBase}°C</span>
            </div>
            <input type="range" min={15} max={50} value={sim.temperatureBase} onChange={(e) => sim.setTemperature(Number(e.target.value))} className="w-full accent-[#f7b928]" />
          </div>

          {/* Time of Day */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Clock size={14} style={{ color: 'var(--color-text-secondary)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Time of Day</span>
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{sim.timeOfDay}:00</span>
            </div>
            <input type="range" min={0} max={23} value={sim.timeOfDay} onChange={(e) => sim.setTimeOfDay(Number(e.target.value))} className="w-full accent-[#536471]" />
          </div>

          {/* Weather */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Cloud size={14} style={{ color: 'var(--color-text-secondary)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Weather Condition</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {weatherOptions.map((w) => (
                <button
                  key={w.value}
                  onClick={() => sim.setWeather(w.value)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl text-xs cursor-pointer border transition-all"
                  style={{
                    background: sim.weatherCondition === w.value ? 'var(--color-primary-light)' : 'var(--color-surface-1)',
                    borderColor: sim.weatherCondition === w.value ? 'var(--color-primary)' : 'var(--color-border)',
                    color: sim.weatherCondition === w.value ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  }}
                >
                  <w.icon size={18} />
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode Toggles */}
          <div className="flex gap-3">
            <button
              onClick={sim.toggleWeekendMode}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium cursor-pointer border transition-all"
              style={{
                background: sim.weekendMode ? 'var(--color-primary-light)' : 'var(--color-surface-1)',
                borderColor: sim.weekendMode ? 'var(--color-primary)' : 'var(--color-border)',
                color: sim.weekendMode ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              }}
            >
              <Calendar size={14} />
              Weekend Mode
            </button>
            <button
              onClick={sim.togglePeakHour}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium cursor-pointer border transition-all"
              style={{
                background: sim.peakHourMode ? 'var(--color-warning-light)' : 'var(--color-surface-1)',
                borderColor: sim.peakHourMode ? 'var(--color-warning)' : 'var(--color-border)',
                color: sim.peakHourMode ? 'var(--color-warning)' : 'var(--color-text-secondary)',
              }}
            >
              <Zap size={14} />
              Peak Hour
            </button>
          </div>
        </motion.div>

        {/* Preview Panel */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Simulation Preview
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Predicted Occupancy', value: `${sim.occupancyLevel}%`, desc: sim.weekendMode ? 'Weekend pattern applied' : 'Weekday pattern' },
              { label: 'Expected Temperature', value: `${(sim.temperatureBase * 0.7 + 8).toFixed(1)}°C indoor`, desc: `${sim.temperatureBase}°C outdoor` },
              { label: 'RL Action Prediction', value: sim.temperatureBase > 35 ? 'Increase Cooling' : sim.temperatureBase < 25 ? 'Decrease Cooling' : 'Maintain', desc: 'Based on current parameters' },
              { label: 'Energy Impact', value: sim.peakHourMode ? 'High Load' : 'Normal Load', desc: sim.peakHourMode ? '+18% expected' : 'Standard consumption' },
              { label: 'HVAC Response', value: `${Math.min(95, Math.max(20, sim.occupancyLevel * 0.8 + (sim.temperatureBase - 22) * 3)).toFixed(0)}% cooling`, desc: 'Projected cooling intensity' },
              { label: 'Comfort Score', value: `${Math.max(60, 100 - Math.abs(sim.temperatureBase - 22) * 4 - (sim.occupancyLevel > 80 ? 10 : 0)).toFixed(0)}/100`, desc: 'Projected occupant comfort' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div>
                  <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>{item.label}</span>
                  <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{item.desc}</p>
                </div>
                <span className="badge badge-primary">{item.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
