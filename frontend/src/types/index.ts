// =============================================
// NeuroX Smart Building Energy Intelligence Platform
// Type Definitions
// =============================================

// --- Building & Floor ---
export interface FloorZone {
  id: string;
  name: string;
  type: 'office' | 'meeting_room' | 'lobby' | 'server_room' | 'cafeteria' | 'restroom';
  occupancy: number;
  maxOccupancy: number;
  temperature: number;
  targetTemperature: number;
  hvacActive: boolean;
  coolingIntensity: number; // 0-100
}

export interface FloorData {
  id: string;
  floorNumber: number;
  name: string;
  totalOccupancy: number;
  maxOccupancy: number;
  averageTemperature: number;
  hvacZones: number;
  activeHvacZones: number;
  zones: FloorZone[];
  coolingIntensity: number;
}

export interface BuildingState {
  id: string;
  name: string;
  totalFloors: number;
  floors: FloorData[];
  totalOccupancy: number;
  maxOccupancy: number;
  averageTemperature: number;
  outdoorTemperature: number;
  weatherCondition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  systemHealth: number; // 0-100
  lastUpdated: string;
}

// --- Occupancy ---
export interface OccupancyDataPoint {
  hour: number;
  day: string;
  occupancy: number;
}

export interface OccupancyTrend {
  timestamp: string;
  value: number;
  floor?: number;
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

// --- HVAC ---
export interface HVACZone {
  id: string;
  name: string;
  floor: number;
  status: 'active' | 'idle' | 'maintenance' | 'emergency';
  coolingLevel: number; // 0-100
  targetTemp: number;
  currentTemp: number;
  runtime: number; // hours today
  efficiency: number; // percentage
  mode: 'cooling' | 'heating' | 'fan_only' | 'auto';
}

export interface HVACState {
  currentCoolingLevel: number;
  zones: HVACZone[];
  totalRuntime: number;
  overrideActive: boolean;
  emergencyMode: boolean;
  avgEfficiency: number;
  energyUsage: number; // kWh
}

// --- Energy ---
export interface EnergyDataPoint {
  timestamp: string;
  consumption: number;
  optimized: number;
  savings: number;
  label?: string;
}

export interface EnergyMetrics {
  currentConsumption: number; // kW
  dailyConsumption: number; // kWh
  monthlySavings: number; // kWh
  costSavings: number; // $
  peakLoad: number; // kW
  peakLoadReduction: number; // percentage
  hvacEfficiency: number; // percentage
  carbonReduction: number; // kg CO2
  timeline: EnergyDataPoint[];
  comparison: { period: string; optimized: number; nonOptimized: number }[];
  forecast: EnergyDataPoint[];
}

// --- Reinforcement Learning ---
export interface RLState {
  occupancy: number;
  temperature: number;
  hvacStatus: boolean;
  timeOfDay: number;
  outdoorTemp: number;
  dayOfWeek: number;
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

// --- Simulation ---
export interface SimulationConfig {
  occupancyLevel: number; // 0-100
  temperatureBase: number;
  weekendMode: boolean;
  peakHourMode: boolean;
  weatherCondition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  timeOfDay: number; // 0-23
  isRunning: boolean;
}

// --- KPI ---
export interface KPIData {
  label: string;
  value: number | string;
  unit: string;
  change: number; // percentage change
  changeDirection: 'up' | 'down' | 'neutral';
  status: 'good' | 'warning' | 'critical' | 'neutral';
  icon: string;
}

// --- Reports ---
export interface ReportSection {
  id: string;
  title: string;
  description: string;
  data: Record<string, unknown>;
  chartType: 'area' | 'bar' | 'line' | 'pie';
}

export interface Report {
  id: string;
  title: string;
  generatedAt: string;
  period: string;
  sections: ReportSection[];
}

// --- Navigation ---
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: number;
}

// --- API Response ---
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
}
