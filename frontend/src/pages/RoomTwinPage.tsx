import { motion } from 'framer-motion';
import { useLiveHardware } from '../hooks/useLiveHardware';
import {
  Thermometer, Gauge, UserCheck, UserX, Zap, Wind,
  Brain, Snowflake, Cpu, Activity,
} from 'lucide-react';

export default function RoomTwinPage() {
  const { data, isOffline } = useLiveHardware();

  // Fallback safe data before the first live fetch
  const safeData = data || {
    temperature: 0, pressure: 0, occupancy: 0, power_draw_w: 0, relay_cool: 0, relay_heat: 0, rl_action: 'Waiting...', confidence: 0
  };

  // Live status derivatives
  const isCooling = safeData.relay_cool === 1;
  const isOccupied = safeData.occupancy === 1;
  const hvacLabel = isCooling ? 'Cooling ON' : 'System IDLE';
  const hvacColor = isCooling ? 'var(--color-primary)' : 'var(--color-text-tertiary)';
  
  // Base physics for the live room
  const targetTemp = 24.0;
  const tempDeviation = safeData.temperature - targetTemp;
  const estAmps = ((safeData.power_draw_w || 0) / 230).toFixed(2); // Assuming 230V standard Indian mains

  // Live Reward Calculation (Replicating the backend logic visually)
  const comfortPenalty = Math.abs(safeData.temperature - targetTemp) * 1.5;
  const energyPenalty = (safeData.power_draw_w || 0) / 500;
  const liveReward = 10 - comfortPenalty - energyPenalty;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              Live Digital Twin · Physical Room Architecture
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'var(--color-surface-1)' }}>
            <Cpu size={12} style={{ color: !isOffline ? 'var(--color-success)' : 'var(--color-danger)' }} />
            <span className="text-[10px] font-medium" style={{ color: !isOffline ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {!isOffline ? `Pico W · 192.168.1.105` : 'Hardware Offline'}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ============================================================ */}
        {/* SVG Bedroom Top-View Layout - Bound to Live Hardware */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 lg:col-span-2"
        >
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Room Layout — Live Architectural Plan
          </h3>

          <div className="relative" style={{ aspectRatio: '16/10' }}>
            <svg viewBox="0 0 640 400" className="w-full h-full" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.1))' }}>
              {/* Room Outline */}
              <rect x="20" y="20" width="600" height="360" rx="4"
                fill="var(--color-surface-1)" stroke="var(--color-border)" strokeWidth="2.5" />

              {/* Grid lines (subtle architectural) */}
              {Array.from({ length: 11 }, (_, i) => (
                <line key={`vg-${i}`} x1={20 + i * 60} y1="20" x2={20 + i * 60} y2="380"
                  stroke="var(--color-border)" strokeWidth="0.3" strokeDasharray="4 8" />
              ))}
              {Array.from({ length: 7 }, (_, i) => (
                <line key={`hg-${i}`} x1="20" y1={20 + i * 60} x2="620" y2={20 + i * 60}
                  stroke="var(--color-border)" strokeWidth="0.3" strokeDasharray="4 8" />
              ))}

              {/* DOOR (bottom left) */}
              <g>
                <rect x="20" y="300" width="8" height="70" fill="var(--color-text-tertiary)" rx="1" />
                <path d="M 28 370 A 40 40 0 0 1 68 370" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1" strokeDasharray="3 3" />
                <text x="52" y="358" fontSize="9" fill="var(--color-text-tertiary)" textAnchor="middle" fontFamily="Inter, sans-serif">Door</text>
              </g>

              {/* WINDOW (top wall, center) */}
              <g>
                <rect x="200" y="18" width="120" height="6" fill="var(--color-primary)" rx="2" opacity="0.5" />
                <line x1="200" y1="21" x2="320" y2="21" stroke="var(--color-primary)" strokeWidth="2" />
                <text x="260" y="40" fontSize="9" fill="var(--color-primary)" textAnchor="middle" fontFamily="Inter, sans-serif" opacity="0.7">Window</text>
              </g>

              {/* BED (center-right) */}
              <g>
                <rect x="360" y="60" width="220" height="160" rx="8" fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" />
                <rect x="368" y="68" width="204" height="144" rx="6" fill="var(--color-surface-2)" />
                <rect x="380" y="78" width="80" height="40" rx="12" fill="var(--color-border)" />
                <rect x="480" y="78" width="80" height="40" rx="12" fill="var(--color-border)" />
                <text x="470" y="160" fontSize="11" fill="var(--color-text-tertiary)" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="500">Bed</text>
              </g>

              {/* STUDY TABLE (bottom right) */}
              <g>
                <rect x="420" y="270" width="160" height="80" rx="4" fill="var(--color-surface-2)" stroke="var(--color-text-secondary)" strokeWidth="1" />
                <circle cx="500" cy="365" r="14" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1" />
                <text x="500" y="316" fontSize="9" fill="var(--color-text-tertiary)" textAnchor="middle" fontFamily="Inter, sans-serif">Study Table</text>
              </g>

              {/* WARDROBE (left wall) */}
              <g>
                <rect x="40" y="60" width="70" height="130" rx="4" fill="var(--color-surface-2)" stroke="var(--color-text-secondary)" strokeWidth="1" />
                <line x1="75" y1="60" x2="75" y2="190" stroke="var(--color-text-tertiary)" strokeWidth="0.5" />
                <text x="75" y="130" fontSize="9" fill="var(--color-text-tertiary)" textAnchor="middle" fontFamily="Inter, sans-serif">Wardrobe</text>
              </g>

              {/* LIVE AC UNIT (top right corner) */}
              <g>
                <rect x="500" y="24" width="100" height="20" rx="4"
                  fill={isCooling ? 'var(--color-primary)' : 'var(--color-surface-2)'}
                  stroke={isCooling ? 'var(--color-primary)' : 'var(--color-text-tertiary)'}
                  strokeWidth="1.5" opacity={isCooling ? 1 : 0.5} />
                {/* Physical representation of relay activation */}
                {isCooling && (
                  <>
                    <line x1="510" y1="44" x2="510" y2="56" stroke="var(--color-primary)" strokeWidth="1" opacity="0.4" />
                    <line x1="530" y1="44" x2="530" y2="60" stroke="var(--color-primary)" strokeWidth="1" opacity="0.3" />
                    <line x1="550" y1="44" x2="550" y2="56" stroke="var(--color-primary)" strokeWidth="1" opacity="0.4" />
                    <line x1="570" y1="44" x2="570" y2="58" stroke="var(--color-primary)" strokeWidth="1" opacity="0.3" />
                    <line x1="590" y1="44" x2="590" y2="54" stroke="var(--color-primary)" strokeWidth="1" opacity="0.4" />
                  </>
                )}
                <text x="550" y="37" fontSize="8" fill={isCooling ? 'white' : 'var(--color-text-tertiary)'} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600">
                  AC Unit
                </text>
              </g>

              {/* ============================================================ */}
              {/* LIVE SENSOR MARKERS */}
              {/* ============================================================ */}

              {/* LIVE BMP280 Sensor */}
              <g>
                <motion.circle
                  cx="390" cy="340" r="18"
                  fill="var(--color-success)" opacity={0.15}
                  animate={{ r: [16, 22, 16], opacity: [0.15, 0.08, 0.15] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <circle cx="390" cy="340" r="10" fill="var(--color-success)" opacity="0.9" />
                <text x="390" y="344" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold" fontFamily="Inter, sans-serif">T</text>
                <text x="390" y="365" fontSize="8" fill="var(--color-success)" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600">BMP280</text>
                {/* Live Temperature Label */}
                <rect x="330" y="300" width="60" height="22" rx="4" fill="var(--color-surface-0)" stroke="var(--color-success)" strokeWidth="0.8" />
                <text x="360" y="314" fontSize="8" fill="var(--color-success)" textAnchor="middle" fontFamily="monospace" fontWeight="600">
                  {safeData.temperature.toFixed(1)}°C
                </text>
              </g>

              {/* LIVE PIR Sensor */}
              <g>
                <motion.circle
                  cx="120" cy="310" r="18"
                  fill="var(--color-warning)" opacity={0.15}
                  animate={{ r: [16, 28, 16], opacity: [0.15, 0.05, 0.15] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <circle cx="120" cy="310" r="10" fill={isOccupied ? 'var(--color-warning)' : 'var(--color-text-tertiary)'} opacity="0.9" />
                <text x="120" y="314" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold" fontFamily="Inter, sans-serif">M</text>
                <text x="120" y="335" fontSize="8" fill="var(--color-warning)" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600">PIR</text>
                {/* Physical representation of PIR detection zone (lights up when motion detected) */}
                <path d="M 80 310 A 40 40 0 0 1 120 270" fill="none" stroke={isOccupied ? "var(--color-warning)" : "var(--color-border)"} strokeWidth="1" strokeDasharray="2 4" opacity={isOccupied ? 1 : 0.4} />
                <path d="M 120 350 A 40 40 0 0 1 160 310" fill="none" stroke={isOccupied ? "var(--color-warning)" : "var(--color-border)"} strokeWidth="1" strokeDasharray="2 4" opacity={isOccupied ? 1 : 0.4} />
              </g>

              {/* LIVE SCT-013 Power Sensor */}
              <g>
                <circle cx="480" cy="34" r="8" fill="var(--color-primary)" opacity="0.9" />
                <text x="480" y="38" fontSize="7" fill="white" textAnchor="middle" fontWeight="bold" fontFamily="Inter, sans-serif">⚡</text>
                <text x="480" y="55" fontSize="7" fill="var(--color-primary)" textAnchor="middle" fontFamily="Inter, sans-serif">SCT-013</text>
              </g>
            </svg>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* Room Monitoring Panel - Live Data Feed */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Live Sensor Telemetry
          </h3>

          <div className="space-y-2">
            {[
              { label: 'Occupancy Status', value: isOccupied ? 'Occupied' : 'Empty', icon: isOccupied ? UserCheck : UserX, color: isOccupied ? 'var(--color-warning)' : 'var(--color-text-tertiary)', source: 'PIR Motion' },
              { label: 'Air Temperature', value: `${safeData.temperature.toFixed(1)}°C`, icon: Thermometer, color: safeData.temperature > 26 ? 'var(--color-warning)' : 'var(--color-success)', source: 'BMP280' },
              { label: 'Atm. Pressure', value: `${safeData.pressure.toFixed(1)} hPa`, icon: Gauge, color: 'var(--color-text-secondary)', source: 'BMP280' },
              { label: 'Power Draw', value: `${safeData.power_draw_w}W / ${estAmps}A`, icon: Zap, color: safeData.power_draw_w > 1000 ? 'var(--color-warning)' : 'var(--color-primary)', source: 'SCT-013' },
              { label: 'Relay (CH1)', value: hvacLabel, icon: isCooling ? Snowflake : Wind, color: hvacColor, source: '2-CH Module' },
              { label: 'TD3 Thought', value: safeData.rl_action, icon: Brain, color: 'var(--color-primary)', source: `Agent (${safeData.confidence}%)` },
              { label: 'Live Penalty Math', value: `${liveReward.toFixed(2)} pts`, icon: Activity, color: liveReward > 0 ? 'var(--color-success)' : 'var(--color-danger)', source: 'Backend Compute' },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.04 }}
                className="flex items-center justify-between py-2.5 px-3 rounded-xl"
                style={{ background: 'var(--color-surface-1)' }}
              >
                <div className="flex items-center gap-2">
                  <metric.icon size={14} style={{ color: metric.color }} />
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>{metric.label}</p>
                    <p className="text-[8px]" style={{ color: 'var(--color-text-tertiary)' }}>{metric.source}</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold" style={{ color: metric.color }}>
                  {metric.value}
                </span>
              </motion.div>
            ))}
          </div>

          {/* AI Target Objective */}
          <div className="pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Agent Target Temp</span>
              <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{targetTemp.toFixed(1)}°C</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Current Deviation</span>
              <span className="text-sm font-bold" style={{ color: Math.abs(tempDeviation) > 2 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                {tempDeviation > 0 ? '+' : ''}{tempDeviation.toFixed(1)}°C
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}