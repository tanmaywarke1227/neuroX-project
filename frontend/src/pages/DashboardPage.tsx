import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import { mockRoomState, mockEdgeDevice, mockSensorHistory, mockKPIData } from '../data/mockData';
import { useDashboardSummary, useBackendHealth } from '../hooks/useDataHooks';
import {
  Thermometer, Droplets, UserCheck, UserX, Zap, Wind, Brain, Gauge,
  Wifi, WifiOff, Cpu, Activity, Radio, CircleDot, RefreshCw,
} from 'lucide-react';

const sensorIcons: Record<string, typeof Thermometer> = {
  Thermometer, Droplets, UserCheck, Zap, Wind, Brain,
};

export default function DashboardPage() {
  const { data: dashData } = useDashboardSummary();
  const { data: healthData } = useBackendHealth();
  const room = mockRoomState;
  const edge = mockEdgeDevice;

  // Prepare mini chart data (last 2 hours = last 24 points from sensor history)
  const recentSensor = mockSensorHistory.slice(-24);
  const tempChartData = recentSensor.map((p) => ({
    time: new Date(p.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    temp: p.temperature,
    pressure: p.pressure,
  }));
  const powerChartData = recentSensor.map((p) => ({
    time: new Date(p.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    power: p.power_watts,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            Bedroom 1 · Phase 1 Demonstration Environment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'var(--color-surface-1)' }}>
            {edge.connected ? (
              <><Wifi size={12} style={{ color: 'var(--color-success)' }} /><span className="text-[10px] font-medium" style={{ color: 'var(--color-success)' }}>Pico W Online</span></>
            ) : (
              <><WifiOff size={12} style={{ color: 'var(--color-danger)' }} /><span className="text-[10px] font-medium" style={{ color: 'var(--color-danger)' }}>Pico W Offline</span></>
            )}
          </div>
          <button className="btn-secondary text-xs py-1.5 px-3">
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </motion.div>

      {/* Room Status Cards — 6 hardware-aligned metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Temperature', value: `${room.temperature}°C`, icon: Thermometer, color: room.temperature > 26 ? 'var(--color-warning)' : 'var(--color-primary)', sub: 'BMP280' },
          { label: 'Pressure', value: `${room.pressure}atm`, icon: Droplets, color: 'var(--color-primary)', sub: 'BMP280' },
          { label: 'Occupancy', value: room.occupied ? 'Occupied' : 'Empty', icon: room.occupied ? UserCheck : UserX, color: room.occupied ? 'var(--color-success)' : 'var(--color-text-tertiary)', sub: 'PIR Sensor' },
          { label: 'Power Usage', value: `${room.power_watts}W`, icon: Zap, color: room.power_watts > 1000 ? 'var(--color-warning)' : 'var(--color-success)', sub: 'SCT-013' },
          { label: 'HVAC', value: room.hvac_mode === 'idle' ? 'Idle' : room.hvac_mode === 'cooling' ? 'Cooling' : 'Heating', icon: Wind, color: room.hvac_mode === 'idle' ? 'var(--color-text-tertiary)' : 'var(--color-primary)', sub: '2-CH Relay' },
          { label: 'RL Reward', value: `${room.rl_reward.toFixed(2)}`, icon: Brain, color: room.rl_reward > 0 ? 'var(--color-success)' : 'var(--color-warning)', sub: 'TD3 Agent' },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.04 }}
            className="card p-4"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <card.icon size={14} style={{ color: card.color }} />
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-tertiary)' }}>
                {card.label}
              </span>
            </div>
            <p className="text-xl font-bold font-mono" style={{ color: card.color }}>
              {card.value}
            </p>
            <p className="text-[9px] mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
              {card.sub}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Temperature & Pressure Mini Chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5 lg:col-span-2">
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Temperature & Pressure
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Last 2 hours · BMP280 sensor</p>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tempChartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} interval={4} />
                <YAxis yAxisId="temp" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                <YAxis yAxisId="hum" orientation="right" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)', borderRadius: '0.85rem', fontSize: 12 }} />
                <Line yAxisId="temp" type="monotone" dataKey="temp" stroke="var(--color-warning)" strokeWidth={2} dot={false} name="Temp °C" />
                <Line yAxisId="pre" type="monotone" dataKey="pressure" stroke="var(--color-primary)" strokeWidth={1.5} dot={false} name="Pressure atm" strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Edge Device Panel */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cpu size={16} style={{ color: 'var(--color-primary)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Edge Device</h3>
            <span
              className="badge text-[9px]"
              style={{
                background: edge.connected ? 'var(--color-success-light)' : 'var(--color-danger-light, #fde8ee)',
                color: edge.connected ? 'var(--color-success)' : 'var(--color-danger)',
              }}
            >
              {edge.connected ? 'Online' : 'Offline'}
            </span>
          </div>

          <div className="space-y-3">
            {/* Device Info */}
            <div className="space-y-1.5">
              {[
                { label: 'Device', value: 'Raspberry Pi Pico W' },
                { label: 'IP Address', value: edge.ip_address },
                { label: 'Firmware', value: edge.firmware_version },
                { label: 'WiFi Signal', value: `${edge.wifi_rssi} dBm` },
                { label: 'Uptime', value: `${Math.round(edge.uptime_seconds / 3600)}h` },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center">
                  <span className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{item.label}</span>
                  <span className="text-[10px] font-mono font-semibold" style={{ color: 'var(--color-text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Sensor Status */}
            <div className="pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-tertiary)' }}>
                Sensor Status
              </p>
              <div className="space-y-1.5">
                {[
                  { name: 'BMP280', desc: 'Temp / Pressure', connected: edge.sensors.bmp280.connected, icon: Thermometer },
                  { name: 'PIR Motion', desc: 'Occupancy Detection', connected: edge.sensors.pir.connected, icon: Radio },
                  { name: 'SCT-013', desc: 'Current Clamp (Energy)', connected: edge.sensors.sct013.connected, icon: Zap },
                  { name: '2-CH Relay', desc: 'HVAC Control', connected: edge.sensors.relay.connected, icon: CircleDot },
                ].map((sensor) => (
                  <div key={sensor.name} className="flex items-center justify-between py-1 px-2 rounded-lg"
                    style={{ background: 'var(--color-surface-1)' }}
                  >
                    <div className="flex items-center gap-1.5">
                      <sensor.icon size={10} style={{ color: 'var(--color-text-tertiary)' }} />
                      <div>
                        <span className="text-[10px] font-semibold" style={{ color: 'var(--color-text-primary)' }}>{sensor.name}</span>
                        <p className="text-[8px]" style={{ color: 'var(--color-text-tertiary)' }}>{sensor.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: sensor.connected ? 'var(--color-success)' : 'var(--color-danger)' }}
                      />
                      <span className="text-[9px] font-medium" style={{ color: sensor.connected ? 'var(--color-success)' : 'var(--color-danger)' }}>
                        {sensor.connected ? 'Active' : 'N/A'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Power Chart + RL Agent Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Power Usage Chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card p-5">
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Power Consumption
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Last 2 hours · SCT-013 current clamp</p>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={powerChartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-warning)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--color-warning)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)', borderRadius: '0.85rem', fontSize: 12 }} formatter={(v: number) => [`${v}W`, 'Power']} />
                <Area type="monotone" dataKey="power" stroke="var(--color-warning)" strokeWidth={2} fill="url(#powerGrad)" dot={false} name="Power (W)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* RL Agent Summary (wired to backend) */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              RL Agent Summary
            </h3>
            {dashData ? (
              <div className="flex items-center gap-1">
                <Activity size={10} style={{ color: 'var(--color-success)' }} />
                <span className="text-[9px] font-medium" style={{ color: 'var(--color-success)' }}>LIVE</span>
              </div>
            ) : (
              <span className="text-[9px] font-medium" style={{ color: 'var(--color-warning)' }}>MOCK</span>
            )}
          </div>
          <p className="text-xs mb-5" style={{ color: 'var(--color-text-tertiary)' }}>
            {dashData ? 'Live from Flask backend' : 'No backend data — showing defaults'}
          </p>

          <div className="space-y-3">
            {(dashData ? [
              { label: 'Current Action', value: dashData.current_action, badge: 'primary' },
              { label: 'Confidence', value: `${dashData.agent_confidence}%`, badge: 'success' },
              { label: 'Total Decisions', value: dashData.total_decisions.toLocaleString(), badge: 'primary' },
              { label: 'Avg Reward', value: `${dashData.avg_reward} pts`, badge: dashData.avg_reward > 0 ? 'success' : 'primary' },
              { label: 'Model', value: dashData.model_version, badge: 'primary' },
            ] : [
              { label: 'Current Action', value: 'No Data Available', badge: 'primary' },
              { label: 'Confidence', value: 'No Data', badge: 'primary' },
              { label: 'Total Decisions', value: '0', badge: 'primary' },
              { label: 'Avg Reward', value: 'No Data', badge: 'primary' },
              { label: 'Model', value: 'TD3-v3.2.1', badge: 'primary' },
            ]).map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.04 }}
                className="flex items-center justify-between py-2 px-3 rounded-xl"
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item.label}</span>
                <span className={`badge badge-${item.badge}`}>{item.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
