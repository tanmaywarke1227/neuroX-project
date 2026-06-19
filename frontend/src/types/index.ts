// =============================================
// NeuroX Smart Room Energy Intelligence Platform
// Type Definitions — Hardware-Aligned (V4)
// =============================================

// --- Hardware Sensors ---

/** BME280 Sensor Reading */
export interface BME280Reading {
  temperature: number;    // °C
  humidity: number;       // %
  pressure: number;       // hPa
  timestamp: string;
}

/** PIR Motion Sensor Reading */
export interface PIRReading {
  occupied: boolean;      // true = motion detected
  timestamp: string;
}

/** SCT-013 Current Clamp Reading */
export interface SCT013Reading {
  current_amps: number;   // A
  power_watts: number;    // W (calculated)
  timestamp: string;
}

/** 2-Channel Relay State */
export interface RelayState {
  heating_relay: boolean; // true = relay ON
  cooling_relay: boolean; // true = relay ON
  hvac_mode: 'heating' | 'cooling' | 'idle';
  timestamp: string;
}

/** Raspberry Pi Pico W Edge Device Status */
export interface EdgeDeviceStatus {
  connected: boolean;
  ip_address: string;
  uptime_seconds: number;
  wifi_rssi: number;      // dBm (signal strength)
  last_heartbeat: string;
  firmware_version: string;
  sensors: {
    bme280: { connected: boolean; last_reading: string | null };
    pir: { connected: boolean; last_reading: string | null };
    sct013: { connected: boolean; last_reading: string | null };
    relay: { connected: boolean; last_command: string | null };
  };
}

// --- Room State ---

/** Current state of the monitored bedroom */
export interface RoomState {
  room_id: string;
  room_name: string;
  temperature: number;        // °C (from BME280)
  humidity: number;            // % (from BME280)
  pressure: number;            // hPa (from BME280)
  occupied: boolean;           // from PIR
  power_watts: number;         // from SCT-013
  current_amps: number;        // from SCT-013
  hvac_mode: 'heating' | 'cooling' | 'idle';  // from relay state
  target_temperature: number;  // user-defined comfort target
  rl_action: number;           // latest TD3 action [-1, 1]
  rl_reward: number;           // latest computed reward
  last_updated: string;
}

// --- Sensor History (for charts) ---

export interface SensorTimePoint {
  timestamp: string;
  temperature: number;
  humidity: number;
  pressure: number;
  occupied: boolean;
  power_watts: number;
}

export interface HVACActivityEvent {
  start: string;
  end: string;
  mode: 'heating' | 'cooling' | 'idle';
  duration_minutes: number;
}

// --- Reinforcement Learning ---

export interface RLState {
  occupancy: number;      // 0 or 1 (binary for single room)
  temperature: number;
  hvacStatus: boolean;
  timeOfDay: number;
  outdoorTemp: number;
  dayOfWeek?: number;
}

export type RLAction = 'increase_cooling' | 'decrease_cooling' | 'maintain_cooling';

export interface RLReward {
  energyPenalty: number;
  comfortPenalty: number;
  totalReward: number;
}

export interface RLDecision {
  timestamp: string;
  state: RLState;
  action: RLAction;
  reward: RLReward;
  confidence: number;
  qValues: { action: RLAction; value: number }[];
}

export interface RLEngineState {
  currentState: RLState;
  currentAction: RLAction;
  currentReward: RLReward;
  agentConfidence: number;
  policyVersion: string;
  totalDecisions: number;
  avgReward: number;
  decisionHistory: RLDecision[];
  actionDistribution: { action: RLAction; count: number; percentage: number }[];
}

// --- Training ---

export interface TrainingEpisode {
  episode: number;
  reward: number;
  loss: number;
  explorationRate: number;
  steps: number;
}

export interface TrainingMetrics {
  totalEpisodes: number;
  currentEpisode: number;
  bestReward: number;
  avgReward: number;
  explorationRate: number;
  learningRate: number;
  convergenceScore: number; // 0-100
  isTraining: boolean;
  modelVersion: string;
  episodes: TrainingEpisode[];
  rewardProgression: { episode: number; reward: number }[];
  lossProgression: { episode: number; loss: number }[];
}

// --- KPI ---

export interface KPIData {
  label: string;
  value: number | string;
  unit: string;
  change: number;
  changeDirection: 'up' | 'down' | 'neutral';
  status: 'good' | 'warning' | 'critical' | 'neutral' | 'no-data';
  icon: string;
}

// --- API Response ---

export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
}

// --- Legacy types kept for compatibility ---
// These are used by remaining mock-data consumers that haven't been fully migrated.

export interface OccupancyDataPoint {
  hour: number;
  day: string;
  occupancy: number;
}

export interface OccupancyTrend {
  timestamp: string;
  value: number;
}

export interface OccupancyPattern {
  label: string;
  description: string;
  peakHour: number;
  avgOccupancy: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface OccupancyData {
  hourly: OccupancyTrend[];
  weekly: OccupancyDataPoint[];
  heatmap: OccupancyDataPoint[];
  floorWise: { floor: number; name: string; current: number; max: number }[];
  patterns: OccupancyPattern[];
  peakHours: { start: number; end: number; avgOccupancy: number }[];
}

export interface HVACZone {
  id: string;
  name: string;
  floor: number;
  status: 'active' | 'idle' | 'maintenance' | 'emergency';
  coolingLevel: number;
  targetTemp: number;
  currentTemp: number;
  runtime: number;
  efficiency: number;
  mode: 'cooling' | 'heating' | 'fan_only' | 'auto';
}

export interface HVACState {
  currentCoolingLevel: number;
  zones: HVACZone[];
  totalRuntime: number;
  overrideActive: boolean;
  emergencyMode: boolean;
  avgEfficiency: number;
  energyUsage: number;
}

export interface EnergyDataPoint {
  timestamp: string;
  consumption: number;
  optimized: number;
  savings: number;
  label?: string;
}

export interface EnergyMetrics {
  currentConsumption: number;
  dailyConsumption: number;
  monthlySavings: number;
  costSavings: number;
  peakLoad: number;
  peakLoadReduction: number;
  hvacEfficiency: number;
  carbonReduction: number;
  timeline: EnergyDataPoint[];
  comparison: { period: string; optimized: number; nonOptimized: number }[];
  forecast: EnergyDataPoint[];
}

export interface BuildingState {
  id: string;
  name: string;
  totalFloors: number;
  floors: unknown[];
  totalOccupancy: number;
  maxOccupancy: number;
  averageTemperature: number;
  outdoorTemperature: number;
  weatherCondition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  systemHealth: number;
  lastUpdated: string;
}

export interface SimulationConfig {
  occupancyLevel: number;
  temperatureBase: number;
  weekendMode: boolean;
  peakHourMode: boolean;
  weatherCondition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  timeOfDay: number;
  isRunning: boolean;
}
