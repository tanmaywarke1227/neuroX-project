// =============================================
// NeuroX — Mock Data Layer (V4 Hardware-Aligned)
// Structured to match Raspberry Pi Pico W sensor payloads.
// No random values — all data derived from realistic patterns.
// =============================================

import type {
  RoomState,
  EdgeDeviceStatus,
  SensorTimePoint,
  HVACActivityEvent,
  RLEngineState,
  TrainingMetrics,
  KPIData,
} from '../types';

// --- Helper ---
const timeLabel = (h: number) => `${h.toString().padStart(2, '0')}:00`;

// ========================
// ROOM STATE (Bedroom 1)
// ========================
export const mockRoomState: RoomState = {
  room_id: 'bedroom-1',
  room_name: 'Bedroom 1',
  temperature: 26.3,
  humidity: 58.2,
  pressure: 1013.25,
  occupied: true,
  power_watts: 1450,
  current_amps: 6.3,
  hvac_mode: 'cooling',
  target_temperature: 24.0,
  rl_action: -0.72,
  rl_reward: -1.84,
  last_updated: new Date().toISOString(),
};

// ========================
// EDGE DEVICE STATUS
// ========================
export const mockEdgeDevice: EdgeDeviceStatus = {
  connected: true,
  ip_address: '192.168.1.42',
  uptime_seconds: 86400,
  wifi_rssi: -42,
  last_heartbeat: new Date().toISOString(),
  firmware_version: 'v1.2.0',
  sensors: {
    bme280: { connected: true, last_reading: new Date().toISOString() },
    pir: { connected: true, last_reading: new Date().toISOString() },
    sct013: { connected: true, last_reading: new Date().toISOString() },
    relay: { connected: true, last_command: new Date().toISOString() },
  },
};

// ========================
// SENSOR HISTORY (6 hours, per-minute = 360 points, sampled to 72)
// Realistic bedroom patterns: temp rises during afternoon, drops at night
// ========================
const generateSensorHistory = (): SensorTimePoint[] => {
  const now = new Date();
  const points: SensorTimePoint[] = [];

  for (let i = 0; i < 72; i++) {
    const t = new Date(now.getTime() - (72 - i) * 5 * 60 * 1000);
    const hour = t.getHours();
    const minuteFrac = i / 72;

    // Temperature: rises during day, stable at night with HVAC cooling effect
    const baseTemp = 24 + 4 * Math.sin((hour - 6) / 24 * Math.PI * 2);
    const hvacEffect = hour >= 10 && hour <= 22 ? -1.5 : 0;
    const temp = baseTemp + hvacEffect + (Math.sin(i * 0.3) * 0.3);

    // Humidity: inversely correlated with temp
    const humidity = 65 - (temp - 24) * 2 + (Math.sin(i * 0.5) * 1.5);

    // Pressure: very stable, slight diurnal variation
    const pressure = 1013.25 + Math.sin(minuteFrac * Math.PI * 2) * 0.8;

    // Occupancy: bedroom pattern — occupied at night & morning, empty during day
    const occupied = (hour >= 22 || hour <= 7) || (hour >= 12 && hour <= 14);

    // Power: high when HVAC running, low when idle
    const power = occupied && (temp > 25 || temp < 20) ? 1200 + Math.sin(i * 0.2) * 200 : 50 + Math.sin(i * 0.1) * 20;

    points.push({
      timestamp: t.toISOString(),
      temperature: Math.round(temp * 10) / 10,
      humidity: Math.round(humidity * 10) / 10,
      pressure: Math.round(pressure * 100) / 100,
      occupied,
      power_watts: Math.round(power),
    });
  }

  return points;
};

export const mockSensorHistory: SensorTimePoint[] = generateSensorHistory();

// ========================
// HVAC ACTIVITY TIMELINE (Gantt-style events)
// ========================
export const mockHVACActivity: HVACActivityEvent[] = [
  { start: '2026-06-19T00:00:00', end: '2026-06-19T01:30:00', mode: 'cooling', duration_minutes: 90 },
  { start: '2026-06-19T01:30:00', end: '2026-06-19T06:00:00', mode: 'idle', duration_minutes: 270 },
  { start: '2026-06-19T06:00:00', end: '2026-06-19T07:15:00', mode: 'cooling', duration_minutes: 75 },
  { start: '2026-06-19T07:15:00', end: '2026-06-19T10:00:00', mode: 'idle', duration_minutes: 165 },
  { start: '2026-06-19T10:00:00', end: '2026-06-19T13:30:00', mode: 'cooling', duration_minutes: 210 },
  { start: '2026-06-19T13:30:00', end: '2026-06-19T15:00:00', mode: 'idle', duration_minutes: 90 },
  { start: '2026-06-19T15:00:00', end: '2026-06-19T18:00:00', mode: 'cooling', duration_minutes: 180 },
];

// ========================
// RL ENGINE STATE (kept for fallback when backend is offline)
// ========================
export const mockRLEngineState: RLEngineState = {
  currentState: {
    occupancy: 1,
    temperature: 26.3,
    hvacStatus: true,
    timeOfDay: 14,
    outdoorTemp: 34,
  },
  currentAction: 'increase_cooling',
  currentReward: {
    energyPenalty: -1.44,
    comfortPenalty: -1.55,
    totalReward: -2.99,
  },
  agentConfidence: 0.87,
  policyVersion: 'TD3-v3.2.1',
  totalDecisions: 0,
  avgReward: 0,
  decisionHistory: Array.from({ length: 24 }, (_, i) => {
    const actions: Array<'increase_cooling' | 'decrease_cooling' | 'maintain_cooling'> = ['increase_cooling', 'decrease_cooling', 'maintain_cooling'];
    const hour = i;
    // Realistic pattern: more cooling during afternoon, maintain at night
    const actionIdx = hour >= 10 && hour <= 18 ? 0 : hour >= 22 || hour <= 6 ? 2 : 1;
    const action = actions[actionIdx];
    const baseTemp = 24 + 4 * Math.sin((hour - 6) / 24 * Math.PI * 2);
    const occupied = (hour >= 22 || hour <= 7) || (hour >= 12 && hour <= 14);
    const comfort = Math.abs(baseTemp - 24);
    const energy = actionIdx === 0 ? 0.8 : actionIdx === 1 ? 0.3 : 0.05;
    return {
      timestamp: timeLabel(hour),
      state: {
        occupancy: occupied ? 1 : 0,
        temperature: Math.round(baseTemp * 10) / 10,
        hvacStatus: actionIdx !== 2,
        timeOfDay: hour,
        outdoorTemp: Math.round((28 + Math.sin(hour / 24 * Math.PI * 2) * 6) * 10) / 10,
      },
      action,
      reward: {
        energyPenalty: Math.round(-0.4 * energy * 5 * 100) / 100,
        comfortPenalty: Math.round(-0.6 * comfort * 100) / 100,
        totalReward: Math.round(-(0.6 * comfort + 0.4 * energy * 5) * 100) / 100,
      },
      confidence: 0.75 + (occupied ? 0.15 : 0),
      qValues: [
        { action: 'increase_cooling' as const, value: actionIdx === 0 ? 2.1 : -0.5 },
        { action: 'decrease_cooling' as const, value: actionIdx === 1 ? 1.8 : -0.3 },
        { action: 'maintain_cooling' as const, value: actionIdx === 2 ? 1.5 : -0.1 },
      ],
    };
  }),
  actionDistribution: [
    { action: 'increase_cooling', count: 9, percentage: 37.5 },
    { action: 'decrease_cooling', count: 6, percentage: 25.0 },
    { action: 'maintain_cooling', count: 9, percentage: 37.5 },
  ],
};

// ========================
// TRAINING METRICS (pre-trained TD3)
// ========================
export const mockTrainingMetrics: TrainingMetrics = {
  totalEpisodes: 50000,
  currentEpisode: 50000,
  bestReward: 4.82,
  avgReward: 3.24,
  explorationRate: 0.01,
  learningRate: 0.001,
  convergenceScore: 94,
  isTraining: false,
  modelVersion: 'TD3-v3.2.1',
  episodes: Array.from({ length: 100 }, (_, i) => ({
    episode: i * 500,
    reward: -2 + (4.5 * (1 - Math.exp(-i / 30))) + (Math.sin(i * 0.2) * 0.3),
    loss: 2.5 * Math.exp(-i / 25) + Math.sin(i * 0.3) * 0.05,
    explorationRate: Math.max(0.01, 1.0 * Math.exp(-i / 20)),
    steps: 1440,
  })),
  rewardProgression: Array.from({ length: 100 }, (_, i) => ({
    episode: i * 500,
    reward: -2 + (4.5 * (1 - Math.exp(-i / 30))) + (Math.sin(i * 0.2) * 0.3),
  })),
  lossProgression: Array.from({ length: 100 }, (_, i) => ({
    episode: i * 500,
    loss: 2.5 * Math.exp(-i / 25) + Math.sin(i * 0.3) * 0.05,
  })),
};

// ========================
// DASHBOARD KPI DATA (hardware-aligned)
// ========================
export const mockKPIData: KPIData[] = [
  { label: 'Temperature', value: 26.3, unit: '°C', change: 0.8, changeDirection: 'up', status: 'warning', icon: 'Thermometer' },
  { label: 'Humidity', value: 58.2, unit: '%', change: -2.1, changeDirection: 'down', status: 'good', icon: 'Droplets' },
  { label: 'Occupancy', value: 'Occupied', unit: '', change: 0, changeDirection: 'neutral', status: 'good', icon: 'UserCheck' },
  { label: 'Power Usage', value: 1450, unit: 'W', change: 12.3, changeDirection: 'up', status: 'warning', icon: 'Zap' },
  { label: 'HVAC Status', value: 'Cooling', unit: '', change: 0, changeDirection: 'neutral', status: 'good', icon: 'Wind' },
  { label: 'RL Reward', value: -2.99, unit: 'pts', change: -5.2, changeDirection: 'down', status: 'warning', icon: 'Brain' },
];

// ========================
// ENERGY COMPARISON (room-level, realistic Wh values)
// ========================
export const mockEnergyComparison = [
  { period: 'Week 1', optimized: 18200, nonOptimized: 24500 },
  { period: 'Week 2', optimized: 17800, nonOptimized: 23800 },
  { period: 'Week 3', optimized: 16500, nonOptimized: 22100 },
  { period: 'Week 4', optimized: 15900, nonOptimized: 21600 },
];
