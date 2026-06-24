import { motion } from 'framer-motion';
import { mockRoomState, mockEdgeDevice } from '../data/mockData';
import {
  Thermometer, Droplets, Gauge, UserCheck, UserX, Zap, Wind,
  Brain, Bed, DoorOpen, Laptop, ShirtIcon, Snowflake, Radio,
  Cpu, Activity,
} from 'lucide-react';

export default function RoomTwinPage() {
  const room = mockRoomState;
  const edge = mockEdgeDevice;

  // HVAC mode display
  const hvacLabel = room.hvac_mode === 'cooling' ? 'Cooling ON' : room.hvac_mode === 'heating' ? 'Heating ON' : 'System IDLE';
  const hvacColor = room.hvac_mode === 'idle' ? 'var(--color-text-tertiary)' : room.hvac_mode === 'cooling' ? 'var(--color-primary)' : 'var(--color-danger)';

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
              Digital Twin · Bedroom 1 — Phase 1 Demo Environment
            </p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'var(--color-surface-1)' }}>
            <Cpu size={12} style={{ color: edge.connected ? 'var(--color-success)' : 'var(--color-danger)' }} />
            <span className="text-[10px] font-medium" style={{ color: edge.connected ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {edge.connected ? `Pico W · ${edge.ip_address}` : 'Pico W Offline'}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ============================================================ */}
        {/* SVG Bedroom Top-View Layout (2 columns) */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 lg:col-span-2"
        >
          <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
            Room Layout — Architectural Plan
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
                <rect x="360" y="60" width="220" height="160" rx="8"
                  fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5" />
                <rect x="368" y="68" width="204" height="144" rx="6"
                  fill="var(--color-surface-2)" />
                {/* Pillow */}
                <rect x="380" y="78" width="80" height="40" rx="12" fill="var(--color-border)" />
                <rect x="480" y="78" width="80" height="40" rx="12" fill="var(--color-border)" />
                <text x="470" y="160" fontSize="11" fill="var(--color-text-tertiary)" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="500">Bed</text>
              </g>

              {/* STUDY TABLE (bottom right) */}
              <g>
                <rect x="420" y="270" width="160" height="80" rx="4"
                  fill="var(--color-surface-2)" stroke="var(--color-text-secondary)" strokeWidth="1" />
                {/* Chair circle */}
                <circle cx="500" cy="365" r="14" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1" />
                <text x="500" y="316" fontSize="9" fill="var(--color-text-tertiary)" textAnchor="middle" fontFamily="Inter, sans-serif">Study Table</text>
              </g>

              {/* WARDROBE (left wall) */}
              <g>
                <rect x="40" y="60" width="70" height="130" rx="4"
                  fill="var(--color-surface-2)" stroke="var(--color-text-secondary)" strokeWidth="1" />
                <line x1="75" y1="60" x2="75" y2="190" stroke="var(--color-text-tertiary)" strokeWidth="0.5" />
                <text x="75" y="130" fontSize="9" fill="var(--color-text-tertiary)" textAnchor="middle" fontFamily="Inter, sans-serif">Wardrobe</text>
              </g>

              {/* AC UNIT (top right corner) */}
              <g>
                <rect x="500" y="24" width="100" height="20" rx="4"
                  fill={room.hvac_mode !== 'idle' ? 'var(--color-primary)' : 'var(--color-surface-2)'}
                  stroke={room.hvac_mode !== 'idle' ? 'var(--color-primary)' : 'var(--color-text-tertiary)'}
                  strokeWidth="1.5" opacity={room.hvac_mode !== 'idle' ? 1 : 0.5} />
                {/* Air flow lines */}
                {room.hvac_mode !== 'idle' && (
                  <>
                    <line x1="510" y1="44" x2="510" y2="56" stroke="var(--color-primary)" strokeWidth="1" opacity="0.4" />
                    <line x1="530" y1="44" x2="530" y2="60" stroke="var(--color-primary)" strokeWidth="1" opacity="0.3" />
                    <line x1="550" y1="44" x2="550" y2="56" stroke="var(--color-primary)" strokeWidth="1" opacity="0.4" />
                    <line x1="570" y1="44" x2="570" y2="58" stroke="var(--color-primary)" strokeWidth="1" opacity="0.3" />
                    <line x1="590" y1="44" x2="590" y2="54" stroke="var(--color-primary)" strokeWidth="1" opacity="0.4" />
                  </>
                )}
                <text x="550" y="37" fontSize="8" fill={room.hvac_mode !== 'idle' ? 'white' : 'var(--color-text-tertiary)'} textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600">
                  AC Unit
                </text>
              </g>

              {/* ============================================================ */}
              {/* SENSOR MARKERS */}
              {/* ============================================================ */}

              {/* BMP280 Sensor (on wall near study table) */}
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
                {/* Data label */}
                <rect x="330" y="300" width="60" height="22" rx="4" fill="var(--color-surface-0)" stroke="var(--color-success)" strokeWidth="0.8" />
                <text x="360" y="314" fontSize="8" fill="var(--color-success)" textAnchor="middle" fontFamily="monospace" fontWeight="600">
                  {room.temperature}°C
                </text>
              </g>

              {/* PIR Sensor (near door, covers room entry) */}
              <g>
                <motion.circle
                  cx="120" cy="310"
                  r="18"
                  fill="var(--color-warning)" opacity={0.15}
                  animate={{ r: [16, 28, 16], opacity: [0.15, 0.05, 0.15] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <circle cx="120" cy="310" r="10" fill={room.occupied ? 'var(--color-warning)' : 'var(--color-text-tertiary)'} opacity="0.9" />
                <text x="120" y="314" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold" fontFamily="Inter, sans-serif">M</text>
                <text x="120" y="335" fontSize="8" fill="var(--color-warning)" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600">PIR</text>
                {/* Detection zone arc */}
                <path d="M 80 310 A 40 40 0 0 1 120 270" fill="none" stroke="var(--color-warning)" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.4" />
                <path d="M 120 350 A 40 40 0 0 1 160 310" fill="none" stroke="var(--color-warning)" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.4" />
              </g>

              {/* SCT-013 on AC power line (top right) */}
              <g>
                <circle cx="480" cy="34" r="8" fill="var(--color-primary)" opacity="0.9" />
                <text x="480" y="38" fontSize="7" fill="white" textAnchor="middle" fontWeight="bold" fontFamily="Inter, sans-serif">⚡</text>
                <text x="480" y="55" fontSize="7" fill="var(--color-primary)" textAnchor="middle" fontFamily="Inter, sans-serif">SCT-013</text>
              </g>

              {/* Room label */}
              <text x="200" y="240" fontSize="16" fill="var(--color-text-tertiary)" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="300" opacity="0.4">
                Bedroom 1
              </text>

              {/* Scale bar */}
              <g>
                <line x1="40" y1="375" x2="140" y2="375" stroke="var(--color-text-tertiary)" strokeWidth="1" />
                <line x1="40" y1="372" x2="40" y2="378" stroke="var(--color-text-tertiary)" strokeWidth="1" />
                <line x1="140" y1="372" x2="140" y2="378" stroke="var(--color-text-tertiary)" strokeWidth="1" />
                <text x="90" y="390" fontSize="8" fill="var(--color-text-tertiary)" textAnchor="middle" fontFamily="Inter, sans-serif">~3m</text>
              </g>
            </svg>
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* Room Monitoring Panel (right side) */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Room Monitoring
          </h3>

          {/* 8 metrics as specified */}
          <div className="space-y-2">
            {[
              { label: 'Occupancy Status', value: room.occupied ? 'Occupied' : 'Empty', icon: room.occupied ? UserCheck : UserX, color: room.occupied ? 'var(--color-success)' : 'var(--color-text-tertiary)', source: 'PIR Sensor' },
              { label: 'Temperature', value: `${room.temperature}°C`, icon: Thermometer, color: room.temperature > 26 ? 'var(--color-warning)' : 'var(--color-success)', source: 'BMP280' },
              { label: 'Atm. Pressure', value: `${room.pressure} hPa`, icon: Gauge, color: 'var(--color-text-secondary)', source: 'BMP280' },
              { label: 'Power Usage', value: `${room.power_watts}W / ${room.current_amps}A`, icon: Zap, color: room.power_watts > 1000 ? 'var(--color-warning)' : 'var(--color-success)', source: 'SCT-013' },
              { label: 'HVAC Status', value: hvacLabel, icon: room.hvac_mode === 'cooling' ? Snowflake : Wind, color: hvacColor, source: '2-CH Relay' },
              { label: 'RL Action', value: `${room.rl_action > 0 ? 'Heating' : room.rl_action < -0.15 ? 'Cooling' : 'Maintain'} (${room.rl_action.toFixed(2)})`, icon: Brain, color: 'var(--color-primary)', source: 'TD3 Agent' },
              { label: 'Reward Score', value: `${room.rl_reward.toFixed(2)}`, icon: Activity, color: room.rl_reward > 0 ? 'var(--color-success)' : 'var(--color-warning)', source: 'Computed' },
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

          {/* Target Temperature */}
          <div className="pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Target Temperature</span>
              <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{room.target_temperature}°C</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Deviation</span>
              <span className="text-sm font-bold" style={{ color: Math.abs(room.temperature - room.target_temperature) > 2 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                {room.temperature > room.target_temperature ? '+' : ''}{(room.temperature - room.target_temperature).toFixed(1)}°C
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
