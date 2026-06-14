import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockHVACState, mockHVACRuntimeData } from '../data/mockData';
import { useAIPrediction, useHVACHistory, useDataset, useBackendHealth } from '../hooks/useDataHooks';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
  Gauge, Clock, Zap, Settings, Shield, Brain, Send, Database,
  Loader2, CheckCircle2, AlertCircle, Thermometer, Users, Wind,
} from 'lucide-react';

const statusColors: Record<string, string> = {
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

  // --- Real backend hooks ---
  const prediction = useAIPrediction();
  const { data: historyData, isLoading: historyLoading } = useHVACHistory(30);
  const { data: datasetData, isLoading: datasetLoading } = useDataset({ hours: 6 });
  const { data: healthData } = useBackendHealth();

  // --- AI Prediction form state ---
  const [indoorTemp, setIndoorTemp] = useState(24.5);
  const [outdoorTemp, setOutdoorTemp] = useState(32.0);
  const [occupancy, setOccupancy] = useState(2);

  const handlePredict = () => {
    prediction.mutate({
      indoor_temp: indoorTemp,
      outdoor_temp: outdoorTemp,
      occupancy: occupancy,
    });
  };

  // Format the dataset for the chart (sample every 10th point for performance)
  const datasetChartData = datasetData?.data
    ? datasetData.data
        .filter((_: unknown, i: number) => i % 10 === 0)
        .map((row: { timestamp: string; outdoor_temp: number; occupancy: number }) => ({
          time: row.timestamp.split(' ')[1]?.slice(0, 5) || row.timestamp,
          outdoor_temp: Math.round(row.outdoor_temp * 100) / 100,
          occupancy: row.occupancy,
        }))
    : [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            Zone-level HVAC monitoring with RL-driven cooling adjustments
          </p>
          {/* Backend Status Indicator */}
          <div className="flex items-center gap-1.5">
            {healthData ? (
              <>
                <span className="status-dot status-dot-active" />
                <span className="text-[10px] font-medium" style={{ color: 'var(--color-success)' }}>
                  Backend Connected
                  {healthData.model_loaded ? ' · Model Ready' : ' · Model Error'}
                </span>
              </>
            ) : (
              <>
                <span className="status-dot" style={{ background: 'var(--color-danger)' }} />
                <span className="text-[10px] font-medium" style={{ color: 'var(--color-danger)' }}>
                  Backend Offline
                </span>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* AI Prediction Panel — REAL BACKEND CALL */}
      {/* ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="card p-5"
        style={{ borderLeft: '3px solid var(--color-primary)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain size={18} style={{ color: 'var(--color-primary)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            AI Agent — Live Prediction
          </h3>
          <span className="badge badge-primary text-[9px]">TD3 Model</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Indoor Temp */}
          <div>
            <label className="flex items-center gap-1 text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              <Thermometer size={12} /> Indoor Temp (°C)
            </label>
            <input
              type="number" step="0.5" value={indoorTemp}
              onChange={(e) => setIndoorTemp(Number(e.target.value))}
              className="input"
            />
          </div>
          {/* Outdoor Temp */}
          <div>
            <label className="flex items-center gap-1 text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              <Wind size={12} /> Outdoor Temp (°C)
            </label>
            <input
              type="number" step="0.5" value={outdoorTemp}
              onChange={(e) => setOutdoorTemp(Number(e.target.value))}
              className="input"
            />
          </div>
          {/* Occupancy */}
          <div>
            <label className="flex items-center gap-1 text-xs font-medium mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
              <Users size={12} /> Occupancy Level
            </label>
            <input
              type="number" min={0} max={10} value={occupancy}
              onChange={(e) => setOccupancy(Number(e.target.value))}
              className="input"
            />
          </div>
          {/* Submit */}
          <button
            onClick={handlePredict}
            disabled={prediction.isPending}
            className="btn-primary py-2.5"
            style={{ opacity: prediction.isPending ? 0.7 : 1 }}
          >
            {prediction.isPending ? (
              <><Loader2 size={14} className="animate-spin" /> Predicting...</>
            ) : (
              <><Send size={14} /> Get AI Action</>
            )}
          </button>
        </div>

        {/* Prediction Result */}
        <AnimatePresence>
          {prediction.isSuccess && prediction.data && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-xl flex items-center justify-between"
              style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 size={20} style={{ color: 'var(--color-success)' }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    HVAC Action: <span style={{ color: prediction.data.hvac_action > 0 ? 'var(--color-danger)' : 'var(--color-primary)' }}>
                      {prediction.data.hvac_action > 0 ? '🔥 Heating' : '❄️ Cooling'} ({prediction.data.hvac_action.toFixed(4)})
                    </span>
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                    Logged to database · ID #{prediction.data.log_id}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold font-mono" style={{
                  color: prediction.data.hvac_action > 0 ? 'var(--color-danger)' : 'var(--color-primary)',
                }}>
                  {prediction.data.hvac_action.toFixed(4)}
                </p>
                <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>
                  Range: -1.0 (cool) → +1.0 (heat)
                </p>
              </div>
            </motion.div>
          )}
          {prediction.isError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 p-3 rounded-xl flex items-center gap-2"
              style={{ background: 'var(--color-danger-light)', border: '1px solid var(--color-danger)' }}
            >
              <AlertCircle size={16} style={{ color: 'var(--color-danger)' }} />
              <p className="text-xs" style={{ color: 'var(--color-danger)' }}>
                {prediction.error?.message || 'Prediction failed. Is the backend running?'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ============================================================ */}
      {/* AI Dataset Visualization */}
      {/* ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }} className="card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database size={16} style={{ color: 'var(--color-primary)' }} />
            <div>
              <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                AI Training Dataset
              </h3>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                Last 6 hours · Outdoor temperature & occupancy from sensor data
              </p>
            </div>
          </div>
          {datasetData && (
            <span className="badge" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-secondary)' }}>
              {datasetData.total_rows.toLocaleString()} data points
            </span>
          )}
        </div>
        <div style={{ height: 280 }}>
          {datasetLoading ? (
            <div className="flex items-center justify-center h-full gap-2" style={{ color: 'var(--color-text-tertiary)' }}>
              <Loader2 size={16} className="animate-spin" /> Loading dataset...
            </div>
          ) : datasetChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datasetChartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} interval={Math.floor(datasetChartData.length / 8)} />
                <YAxis yAxisId="temp" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="occ" orientation="right" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} domain={[0, 5]} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)', borderRadius: '0.85rem', fontSize: 12 }} />
                <Line yAxisId="temp" type="monotone" dataKey="outdoor_temp" stroke="var(--color-warning)" strokeWidth={1.5} dot={false} name="Outdoor Temp (°C)" />
                <Line yAxisId="occ" type="stepAfter" dataKey="occupancy" stroke="var(--color-primary)" strokeWidth={1.5} dot={false} name="Occupancy" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full gap-2" style={{ color: 'var(--color-text-tertiary)' }}>
              <AlertCircle size={16} /> No dataset available. Is the backend running?
            </div>
          )}
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* Prediction History — REAL DATABASE LOGS */}
      {/* ============================================================ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }} className="card p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Clock size={16} style={{ color: 'var(--color-primary)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Prediction History
          </h3>
          <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            Last {historyData?.logs?.length || 0} predictions from database
          </span>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center py-8 gap-2" style={{ color: 'var(--color-text-tertiary)' }}>
            <Loader2 size={16} className="animate-spin" /> Loading history...
          </div>
        ) : historyData?.logs && historyData.logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  {['#', 'Timestamp', 'Indoor °C', 'Outdoor °C', 'Occupancy', 'HVAC Action'].map((h) => (
                    <th key={h} className="text-left py-2 px-3 font-semibold" style={{ color: 'var(--color-text-tertiary)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {historyData.logs.map((log, i) => (
                  <motion.tr
                    key={log.id}
                    initial={i === 0 ? { opacity: 0, background: 'var(--color-primary-light)' } : {}}
                    animate={{ opacity: 1, background: 'transparent' }}
                    transition={{ duration: 0.5 }}
                    style={{ borderBottom: '1px solid var(--color-border-subtle)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td className="py-2 px-3 font-mono" style={{ color: 'var(--color-text-tertiary)' }}>{log.id}</td>
                    <td className="py-2 px-3" style={{ color: 'var(--color-text-secondary)' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2 px-3 font-mono font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                      {log.indoor_temp}°C
                    </td>
                    <td className="py-2 px-3 font-mono font-semibold" style={{ color: 'var(--color-warning)' }}>
                      {log.outdoor_temp}°C
                    </td>
                    <td className="py-2 px-3 font-mono" style={{ color: 'var(--color-text-primary)' }}>
                      {log.occupancy}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className="badge font-mono text-[10px]"
                        style={{
                          background: log.hvac_action > 0 ? 'var(--color-danger-light, #fde8ee)' : 'var(--color-primary-light)',
                          color: log.hvac_action > 0 ? 'var(--color-danger)' : 'var(--color-primary)',
                        }}
                      >
                        {log.hvac_action > 0 ? '🔥' : '❄️'} {log.hvac_action.toFixed(4)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Database size={32} className="mx-auto mb-2" style={{ color: 'var(--color-text-tertiary)', opacity: 0.5 }} />
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              No predictions yet. Use the AI panel above to make your first prediction!
            </p>
          </div>
        )}
      </motion.div>

      {/* ============================================================ */}
      {/* Existing: Top Controls */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cooling Slider */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-5">
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
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card p-5">
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
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
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

      {/* ============================================================ */}
      {/* Existing: Zone Grid */}
      {/* ============================================================ */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <h3 className="text-base font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>
          Zone Activity
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hvac.zones.map((zone, i) => (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
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

      {/* ============================================================ */}
      {/* Existing: Runtime Chart */}
      {/* ============================================================ */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card p-5">
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
