import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockRoomState, mockHVACActivity } from '../data/mockData';
import { useAIPrediction, useHVACHistory, useBackendHealth } from '../hooks/useDataHooks';
import {
  Wind, Snowflake, Flame, Power, Brain, Send, Loader2, CheckCircle2, AlertCircle,
  Thermometer, Users, Gauge, Clock, Zap, Database, Activity,
} from 'lucide-react';

export default function HVACPage() {
  const room = mockRoomState;

  // Real backend hooks
  const prediction = useAIPrediction();
  const { data: historyData, isLoading: historyLoading } = useHVACHistory(30);
  const { data: healthData } = useBackendHealth();

  // AI Prediction form
  const [indoorTemp, setIndoorTemp] = useState(room.temperature);
  const [outdoorTemp, setOutdoorTemp] = useState(34.0);
  const [occupancy, setOccupancy] = useState(room.occupied ? 1 : 0);

  const handlePredict = () => {
    prediction.mutate({ indoor_temp: indoorTemp, outdoor_temp: outdoorTemp, occupancy });
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            HVAC Control · Bedroom 1 — 2-Channel Relay System
          </p>
          <div className="flex items-center gap-1.5">
            {healthData ? (
              <><Activity size={10} style={{ color: 'var(--color-success)' }} /><span className="text-[10px] font-medium" style={{ color: 'var(--color-success)' }}>Backend Connected</span></>
            ) : (
              <><Activity size={10} style={{ color: 'var(--color-danger)' }} /><span className="text-[10px] font-medium" style={{ color: 'var(--color-danger)' }}>Backend Offline</span></>
            )}
          </div>
        </div>
      </motion.div>

      {/* Relay Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cooling Relay */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Snowflake size={16} style={{ color: room.hvac_mode === 'cooling' ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Cooling Relay (CH1)</span>
          </div>
          <div className="text-center py-4">
            <div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl"
              style={{
                background: room.hvac_mode === 'cooling' ? 'var(--color-primary-light)' : 'var(--color-surface-2)',
                border: `2px solid ${room.hvac_mode === 'cooling' ? 'var(--color-primary)' : 'var(--color-border)'}`,
              }}
            >
              <Power size={20} style={{ color: room.hvac_mode === 'cooling' ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }} />
              <span className="text-lg font-bold" style={{ color: room.hvac_mode === 'cooling' ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }}>
                {room.hvac_mode === 'cooling' ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-center" style={{ color: 'var(--color-text-tertiary)' }}>
            Controls AC compressor via GPIO relay
          </p>
        </motion.div>

        {/* Heating Relay */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Flame size={16} style={{ color: room.hvac_mode === 'heating' ? 'var(--color-danger)' : 'var(--color-text-tertiary)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Heating Relay (CH2)</span>
          </div>
          <div className="text-center py-4">
            <div
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl"
              style={{
                background: room.hvac_mode === 'heating' ? 'var(--color-danger-light, #fde8ee)' : 'var(--color-surface-2)',
                border: `2px solid ${room.hvac_mode === 'heating' ? 'var(--color-danger)' : 'var(--color-border)'}`,
              }}
            >
              <Power size={20} style={{ color: room.hvac_mode === 'heating' ? 'var(--color-danger)' : 'var(--color-text-tertiary)' }} />
              <span className="text-lg font-bold" style={{ color: room.hvac_mode === 'heating' ? 'var(--color-danger)' : 'var(--color-text-tertiary)' }}>
                {room.hvac_mode === 'heating' ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-center" style={{ color: 'var(--color-text-tertiary)' }}>
            Controls heater via GPIO relay
          </p>
        </motion.div>

        {/* Overall HVAC State */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Wind size={16} style={{ color: 'var(--color-primary)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>System State</span>
          </div>
          <div className="space-y-3 mt-2">
            {[
              { label: 'Mode', value: room.hvac_mode === 'cooling' ? '❄️ Cooling' : room.hvac_mode === 'heating' ? '🔥 Heating' : '⏸ Idle' },
              { label: 'Room Temp', value: `${room.temperature}°C` },
              { label: 'Target', value: `${room.target_temperature}°C` },
              { label: 'Power Draw', value: `${room.power_watts}W` },
              { label: 'RL Action', value: `${room.rl_action.toFixed(3)}` },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{item.label}</span>
                <span className="text-xs font-mono font-semibold" style={{ color: 'var(--color-text-primary)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* HVAC Activity Timeline (Gantt-style) */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} style={{ color: 'var(--color-primary)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>HVAC Activity Timeline</h3>
          <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Today's relay activity</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-3">
          {[
            { label: 'Cooling', color: 'var(--color-primary)' },
            { label: 'Heating', color: 'var(--color-danger)' },
            { label: 'Idle', color: 'var(--color-surface-2)' },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ background: l.color, border: '1px solid var(--color-border)' }} />
              <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Timeline bar */}
        <div className="relative h-12 rounded-xl overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
          {mockHVACActivity.map((event, i) => {
            const startHour = new Date(event.start).getHours() + new Date(event.start).getMinutes() / 60;
            const endHour = new Date(event.end).getHours() + new Date(event.end).getMinutes() / 60;
            const left = (startHour / 24) * 100;
            const width = ((endHour - startHour) / 24) * 100;
            const color = event.mode === 'cooling' ? 'var(--color-primary)' : event.mode === 'heating' ? 'var(--color-danger)' : 'transparent';

            return (
              <motion.div
                key={i}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3 + i * 0.05, duration: 0.4 }}
                className="absolute top-0 bottom-0 origin-left"
                style={{ left: `${left}%`, width: `${width}%`, background: color, opacity: event.mode === 'idle' ? 0 : 0.8 }}
                title={`${event.mode}: ${new Date(event.start).toLocaleTimeString()} - ${new Date(event.end).toLocaleTimeString()} (${event.duration_minutes}min)`}
              />
            );
          })}
        </div>
        {/* Hour markers */}
        <div className="flex justify-between mt-1">
          {[0, 4, 8, 12, 16, 20, 24].map((h) => (
            <span key={h} className="text-[9px]" style={{ color: 'var(--color-text-tertiary)' }}>{h.toString().padStart(2, '0')}:00</span>
          ))}
        </div>
      </motion.div>

      {/* AI Prediction Panel */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="card p-5" style={{ borderLeft: '3px solid var(--color-primary)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain size={18} style={{ color: 'var(--color-primary)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>AI Agent — Live Prediction</h3>
          <span className="badge badge-primary text-[9px]">TD3 Model</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="flex items-center gap-1 text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              <Thermometer size={12} /> Indoor Temp (°C)
            </label>
            <input type="number" step="0.5" value={indoorTemp} onChange={(e) => setIndoorTemp(Number(e.target.value))} className="input" />
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              <Wind size={12} /> Outdoor Temp (°C)
            </label>
            <input type="number" step="0.5" value={outdoorTemp} onChange={(e) => setOutdoorTemp(Number(e.target.value))} className="input" />
          </div>
          <div>
            <label className="flex items-center gap-1 text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              <Users size={12} /> Occupancy
            </label>
            <input type="number" min={0} max={1} value={occupancy} onChange={(e) => setOccupancy(Number(e.target.value))} className="input" />
          </div>
          <button onClick={handlePredict} disabled={prediction.isPending} className="btn-primary py-2.5" style={{ opacity: prediction.isPending ? 0.7 : 1 }}>
            {prediction.isPending ? <><Loader2 size={14} className="animate-spin" /> Predicting...</> : <><Send size={14} /> Get AI Action</>}
          </button>
        </div>

        <AnimatePresence>
          {prediction.isSuccess && prediction.data && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-xl flex items-center justify-between"
              style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} style={{ color: 'var(--color-success)' }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    HVAC Action: <span style={{ color: prediction.data.hvac_action > 0 ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                      {prediction.data.hvac_action > 0.15 ? '🔥 Heating' : prediction.data.hvac_action < -0.15 ? '❄️ Cooling' : '⏸ Maintain'} ({prediction.data.hvac_action.toFixed(4)})
                    </span>
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Logged to database · ID #{prediction.data.log_id}</p>
                </div>
              </div>
              <p className="text-2xl font-bold font-mono" style={{ color: prediction.data.hvac_action > 0 ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                {prediction.data.hvac_action.toFixed(4)}
              </p>
            </motion.div>
          )}
          {prediction.isError && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 rounded-xl flex items-center gap-2" style={{ background: 'var(--color-danger-light, #fde8ee)' }}>
              <AlertCircle size={16} style={{ color: 'var(--color-danger)' }} />
              <p className="text-xs" style={{ color: 'var(--color-danger)' }}>{prediction.error?.message || 'Prediction failed.'}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Prediction History Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Database size={16} style={{ color: 'var(--color-primary)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Prediction History</h3>
          <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{historyData?.logs?.length || 0} records</span>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center py-8 gap-2" style={{ color: 'var(--color-text-tertiary)' }}>
            <Loader2 size={16} className="animate-spin" /> Loading...
          </div>
        ) : historyData?.logs && historyData.logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['#', 'Timestamp', 'Indoor °C', 'Outdoor °C', 'Occ.', 'HVAC Action'].map((h) => (
                    <th key={h} className="text-left py-2 px-3 font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {historyData.logs.map((log, i) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td className="py-2 px-3 font-mono" style={{ color: 'var(--color-text-tertiary)' }}>{log.id}</td>
                    <td className="py-2 px-3" style={{ color: 'var(--color-text-secondary)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-2 px-3 font-mono font-semibold" style={{ color: 'var(--color-text-primary)' }}>{log.indoor_temp}°C</td>
                    <td className="py-2 px-3 font-mono font-semibold" style={{ color: 'var(--color-warning)' }}>{log.outdoor_temp}°C</td>
                    <td className="py-2 px-3 font-mono" style={{ color: 'var(--color-text-primary)' }}>{log.occupancy}</td>
                    <td className="py-2 px-3">
                      <span className="badge font-mono text-[10px]" style={{
                        background: log.hvac_action > 0.15 ? 'var(--color-danger-light, #fde8ee)' : log.hvac_action < -0.15 ? 'var(--color-primary-light)' : 'var(--color-surface-2)',
                        color: log.hvac_action > 0.15 ? 'var(--color-danger)' : log.hvac_action < -0.15 ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      }}>
                        {log.hvac_action > 0.15 ? '🔥' : log.hvac_action < -0.15 ? '❄️' : '⏸'} {log.hvac_action.toFixed(4)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Database size={32} className="mx-auto mb-2" style={{ color: 'var(--color-text-tertiary)', opacity: 0.5 }} />
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>No predictions yet. Use the AI panel above to make your first prediction.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
