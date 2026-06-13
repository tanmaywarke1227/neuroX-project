// =============================================
// NeuroX — Mock Data Layer
// All charts/components consume this data.
// Structured to match future Flask API responses.
// =============================================

import type {
  BuildingState,
  OccupancyData,
  HVACState,
  EnergyMetrics,
  RLEngineState,
  TrainingMetrics,
  KPIData,
} from '../types';

// --- Helper ---
const timeLabel = (h: number) => `${h.toString().padStart(2, '0')}:00`;
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ========================
// BUILDING STATE
// ========================
export const mockBuildingState: BuildingState = {
  id: 'bldg-001',
  name: 'NeuroX HQ Tower',
  totalFloors: 6,
  totalOccupancy: 847,
  maxOccupancy: 1400,
  averageTemperature: 23.4,
  outdoorTemperature: 34,
  weatherCondition: 'sunny',
  systemHealth: 94,
  lastUpdated: new Date().toISOString(),
  floors: [
    {
      id: 'f1', floorNumber: 1, name: 'Ground — Lobby & Reception',
      totalOccupancy: 62, maxOccupancy: 150, averageTemperature: 22.8,
      hvacZones: 3, activeHvacZones: 2, coolingIntensity: 55,
      zones: [
        { id: 'f1-z1', name: 'Main Lobby', type: 'lobby', occupancy: 28, maxOccupancy: 60, temperature: 22.5, targetTemperature: 22, hvacActive: true, coolingIntensity: 60 },
        { id: 'f1-z2', name: 'Reception Area', type: 'office', occupancy: 18, maxOccupancy: 40, temperature: 23.0, targetTemperature: 22, hvacActive: true, coolingIntensity: 50 },
        { id: 'f1-z3', name: 'Visitor Lounge', type: 'meeting_room', occupancy: 16, maxOccupancy: 50, temperature: 23.1, targetTemperature: 23, hvacActive: false, coolingIntensity: 0 },
      ],
    },
    {
      id: 'f2', floorNumber: 2, name: 'Floor 2 — Engineering',
      totalOccupancy: 186, maxOccupancy: 250, averageTemperature: 23.2,
      hvacZones: 4, activeHvacZones: 4, coolingIntensity: 72,
      zones: [
        { id: 'f2-z1', name: 'Dev Bay A', type: 'office', occupancy: 52, maxOccupancy: 70, temperature: 23.0, targetTemperature: 22, hvacActive: true, coolingIntensity: 75 },
        { id: 'f2-z2', name: 'Dev Bay B', type: 'office', occupancy: 48, maxOccupancy: 70, temperature: 23.5, targetTemperature: 22, hvacActive: true, coolingIntensity: 70 },
        { id: 'f2-z3', name: 'Meeting Pod 1', type: 'meeting_room', occupancy: 12, maxOccupancy: 20, temperature: 22.8, targetTemperature: 22, hvacActive: true, coolingIntensity: 65 },
        { id: 'f2-z4', name: 'Server Room', type: 'server_room', occupancy: 2, maxOccupancy: 5, temperature: 18.5, targetTemperature: 18, hvacActive: true, coolingIntensity: 95 },
      ],
    },
    {
      id: 'f3', floorNumber: 3, name: 'Floor 3 — Product & Design',
      totalOccupancy: 164, maxOccupancy: 230, averageTemperature: 23.6,
      hvacZones: 4, activeHvacZones: 3, coolingIntensity: 65,
      zones: [
        { id: 'f3-z1', name: 'Design Studio', type: 'office', occupancy: 44, maxOccupancy: 60, temperature: 23.2, targetTemperature: 22, hvacActive: true, coolingIntensity: 68 },
        { id: 'f3-z2', name: 'Product Area', type: 'office', occupancy: 56, maxOccupancy: 70, temperature: 23.8, targetTemperature: 22, hvacActive: true, coolingIntensity: 72 },
        { id: 'f3-z3', name: 'Conference Room A', type: 'meeting_room', occupancy: 14, maxOccupancy: 30, temperature: 23.5, targetTemperature: 23, hvacActive: true, coolingIntensity: 55 },
        { id: 'f3-z4', name: 'Breakout Space', type: 'cafeteria', occupancy: 50, maxOccupancy: 70, temperature: 24.2, targetTemperature: 23, hvacActive: false, coolingIntensity: 0 },
      ],
    },
    {
      id: 'f4', floorNumber: 4, name: 'Floor 4 — Operations',
      totalOccupancy: 198, maxOccupancy: 280, averageTemperature: 23.1,
      hvacZones: 5, activeHvacZones: 4, coolingIntensity: 70,
      zones: [
        { id: 'f4-z1', name: 'Ops Center', type: 'office', occupancy: 62, maxOccupancy: 80, temperature: 22.9, targetTemperature: 22, hvacActive: true, coolingIntensity: 74 },
        { id: 'f4-z2', name: 'Support Team', type: 'office', occupancy: 48, maxOccupancy: 60, temperature: 23.2, targetTemperature: 22, hvacActive: true, coolingIntensity: 68 },
        { id: 'f4-z3', name: 'Training Room', type: 'meeting_room', occupancy: 30, maxOccupancy: 50, temperature: 23.0, targetTemperature: 22, hvacActive: true, coolingIntensity: 65 },
        { id: 'f4-z4', name: 'HR Suite', type: 'office', occupancy: 22, maxOccupancy: 40, temperature: 23.4, targetTemperature: 23, hvacActive: true, coolingIntensity: 58 },
        { id: 'f4-z5', name: 'Quiet Zone', type: 'office', occupancy: 36, maxOccupancy: 50, temperature: 23.1, targetTemperature: 22, hvacActive: false, coolingIntensity: 0 },
      ],
    },
    {
      id: 'f5', floorNumber: 5, name: 'Floor 5 — Executive',
      totalOccupancy: 124, maxOccupancy: 200, averageTemperature: 22.6,
      hvacZones: 4, activeHvacZones: 3, coolingIntensity: 60,
      zones: [
        { id: 'f5-z1', name: 'C-Suite Offices', type: 'office', occupancy: 18, maxOccupancy: 30, temperature: 22.2, targetTemperature: 22, hvacActive: true, coolingIntensity: 55 },
        { id: 'f5-z2', name: 'Board Room', type: 'meeting_room', occupancy: 16, maxOccupancy: 40, temperature: 22.5, targetTemperature: 22, hvacActive: true, coolingIntensity: 62 },
        { id: 'f5-z3', name: 'Executive Lounge', type: 'cafeteria', occupancy: 32, maxOccupancy: 50, temperature: 22.8, targetTemperature: 22, hvacActive: true, coolingIntensity: 58 },
        { id: 'f5-z4', name: 'Private Meeting', type: 'meeting_room', occupancy: 8, maxOccupancy: 15, temperature: 23.0, targetTemperature: 23, hvacActive: false, coolingIntensity: 0 },
      ],
    },
    {
      id: 'f6', floorNumber: 6, name: 'Floor 6 — Rooftop & Utilities',
      totalOccupancy: 113, maxOccupancy: 290, averageTemperature: 24.8,
      hvacZones: 3, activeHvacZones: 2, coolingIntensity: 45,
      zones: [
        { id: 'f6-z1', name: 'Cafeteria', type: 'cafeteria', occupancy: 85, maxOccupancy: 200, temperature: 24.5, targetTemperature: 23, hvacActive: true, coolingIntensity: 50 },
        { id: 'f6-z2', name: 'Terrace Lounge', type: 'lobby', occupancy: 22, maxOccupancy: 60, temperature: 26.0, targetTemperature: 24, hvacActive: true, coolingIntensity: 40 },
        { id: 'f6-z3', name: 'Utility Room', type: 'server_room', occupancy: 6, maxOccupancy: 30, temperature: 20.5, targetTemperature: 18, hvacActive: false, coolingIntensity: 0 },
      ],
    },
  ],
};

// ========================
// OCCUPANCY DATA
// ========================
const generateHourlyOccupancy = () => {
  const base = [5, 3, 2, 2, 3, 8, 22, 48, 72, 85, 88, 82, 65, 78, 86, 84, 76, 58, 35, 22, 15, 12, 8, 6];
  return base.map((v, i) => ({
    timestamp: timeLabel(i),
    value: v + Math.floor(Math.random() * 6 - 3),
  }));
};

const generateWeeklyHeatmap = (): { hour: number; day: string; occupancy: number }[] => {
  const data: { hour: number; day: string; occupancy: number }[] = [];
  const weekdayPattern = [3, 2, 1, 1, 2, 5, 18, 42, 68, 82, 85, 78, 60, 72, 80, 78, 70, 52, 30, 18, 12, 8, 5, 4];
  const weekendPattern = [2, 1, 1, 1, 1, 2, 4, 8, 12, 15, 18, 20, 18, 16, 14, 12, 10, 8, 5, 4, 3, 2, 2, 2];
  days.forEach((day) => {
    const isWeekend = day === 'Sat' || day === 'Sun';
    const pattern = isWeekend ? weekendPattern : weekdayPattern;
    for (let h = 0; h < 24; h++) {
      data.push({
        hour: h,
        day,
        occupancy: pattern[h] + Math.floor(Math.random() * 8 - 4),
      });
    }
  });
  return data;
};

export const mockOccupancyData: OccupancyData = {
  hourly: generateHourlyOccupancy(),
  weekly: generateWeeklyHeatmap(),
  heatmap: generateWeeklyHeatmap(),
  floorWise: [
    { floor: 1, name: 'Ground', current: 62, max: 150 },
    { floor: 2, name: 'Engineering', current: 186, max: 250 },
    { floor: 3, name: 'Product & Design', current: 164, max: 230 },
    { floor: 4, name: 'Operations', current: 198, max: 280 },
    { floor: 5, name: 'Executive', current: 124, max: 200 },
    { floor: 6, name: 'Rooftop', current: 113, max: 290 },
  ],
  patterns: [
    { label: 'Morning Rush', description: 'Peak inflow between 8:00–9:30 AM with 85% average occupancy', peakHour: 9, avgOccupancy: 85, trend: 'stable' },
    { label: 'Lunch Dip', description: 'Occupancy drops 18% between 12:00–1:30 PM as employees move to cafeteria', peakHour: 12, avgOccupancy: 65, trend: 'stable' },
    { label: 'Afternoon Peak', description: 'Secondary peak at 2:30 PM with cross-floor meeting activity', peakHour: 14, avgOccupancy: 86, trend: 'increasing' },
    { label: 'Weekend Quiet', description: 'Weekend occupancy averages 12% — mostly security and maintenance', peakHour: 11, avgOccupancy: 12, trend: 'decreasing' },
  ],
  peakHours: [
    { start: 9, end: 11, avgOccupancy: 86 },
    { start: 14, end: 16, avgOccupancy: 82 },
  ],
};

// ========================
// HVAC STATE
// ========================
export const mockHVACState: HVACState = {
  currentCoolingLevel: 68,
  totalRuntime: 14.5,
  overrideActive: false,
  emergencyMode: false,
  avgEfficiency: 87,
  energyUsage: 342.8,
  zones: [
    { id: 'hvac-1', name: 'Zone A — Ground', floor: 1, status: 'active', coolingLevel: 55, targetTemp: 22, currentTemp: 22.8, runtime: 12.3, efficiency: 91, mode: 'cooling' },
    { id: 'hvac-2', name: 'Zone B — Engineering', floor: 2, status: 'active', coolingLevel: 72, targetTemp: 22, currentTemp: 23.2, runtime: 14.1, efficiency: 88, mode: 'cooling' },
    { id: 'hvac-3', name: 'Zone C — Product', floor: 3, status: 'active', coolingLevel: 65, targetTemp: 22, currentTemp: 23.6, runtime: 13.8, efficiency: 85, mode: 'cooling' },
    { id: 'hvac-4', name: 'Zone D — Operations', floor: 4, status: 'active', coolingLevel: 70, targetTemp: 22, currentTemp: 23.1, runtime: 14.5, efficiency: 89, mode: 'cooling' },
    { id: 'hvac-5', name: 'Zone E — Executive', floor: 5, status: 'active', coolingLevel: 60, targetTemp: 22, currentTemp: 22.6, runtime: 11.2, efficiency: 92, mode: 'cooling' },
    { id: 'hvac-6', name: 'Zone F — Server Room', floor: 2, status: 'active', coolingLevel: 95, targetTemp: 18, currentTemp: 18.5, runtime: 24.0, efficiency: 94, mode: 'cooling' },
    { id: 'hvac-7', name: 'Zone G — Cafeteria', floor: 6, status: 'idle', coolingLevel: 45, targetTemp: 23, currentTemp: 24.5, runtime: 8.6, efficiency: 78, mode: 'auto' },
    { id: 'hvac-8', name: 'Zone H — Terrace', floor: 6, status: 'maintenance', coolingLevel: 0, targetTemp: 24, currentTemp: 26.0, runtime: 0, efficiency: 0, mode: 'fan_only' },
  ],
};

// ========================
// ENERGY METRICS
// ========================
export const mockEnergyMetrics: EnergyMetrics = {
  currentConsumption: 284.6,
  dailyConsumption: 4218,
  monthlySavings: 12840,
  costSavings: 3462,
  peakLoad: 520,
  peakLoadReduction: 23,
  hvacEfficiency: 87,
  carbonReduction: 8420,
  timeline: Array.from({ length: 24 }, (_, i) => ({
    timestamp: timeLabel(i),
    consumption: [120, 105, 95, 88, 85, 92, 145, 210, 285, 340, 365, 380, 350, 360, 375, 370, 345, 310, 260, 220, 185, 165, 148, 130][i],
    optimized: [110, 95, 85, 80, 78, 85, 130, 185, 248, 295, 315, 328, 302, 310, 325, 318, 298, 268, 225, 192, 162, 145, 132, 118][i],
    savings: [10, 10, 10, 8, 7, 7, 15, 25, 37, 45, 50, 52, 48, 50, 50, 52, 47, 42, 35, 28, 23, 20, 16, 12][i],
  })),
  comparison: [
    { period: 'Jan', optimized: 95000, nonOptimized: 118000 },
    { period: 'Feb', optimized: 88000, nonOptimized: 112000 },
    { period: 'Mar', optimized: 92000, nonOptimized: 115000 },
    { period: 'Apr', optimized: 102000, nonOptimized: 128000 },
    { period: 'May', optimized: 115000, nonOptimized: 142000 },
    { period: 'Jun', optimized: 125000, nonOptimized: 158000 },
  ],
  forecast: Array.from({ length: 7 }, (_, i) => ({
    timestamp: `Day ${i + 1}`,
    consumption: 4200 + Math.floor(Math.random() * 400 - 200),
    optimized: 3600 + Math.floor(Math.random() * 300 - 150),
    savings: 580 + Math.floor(Math.random() * 100),
  })),
};

// ========================
// RL ENGINE STATE
// ========================
const generateRLHistory = (): RLEngineState['decisionHistory'] => {
  const actions: Array<'increase_cooling' | 'decrease_cooling' | 'maintain_cooling'> = ['increase_cooling', 'decrease_cooling', 'maintain_cooling'];
  return Array.from({ length: 24 }, (_, i) => {
    const action = actions[Math.floor(Math.random() * 3)];
    return {
      timestamp: timeLabel(i),
      state: {
        occupancy: [5, 3, 2, 2, 3, 8, 22, 48, 72, 85, 88, 82, 65, 78, 86, 84, 76, 58, 35, 22, 15, 12, 8, 6][i],
        temperature: 22 + Math.random() * 3,
        hvacStatus: true,
        timeOfDay: i,
        outdoorTemp: 28 + Math.sin(i / 24 * Math.PI * 2) * 6,
        dayOfWeek: 2,
      },
      action,
      reward: {
        energyPenalty: -(Math.random() * 2),
        comfortPenalty: -(Math.random() * 1.5),
        totalReward: Math.random() * 4 - 1.5,
      },
      confidence: 0.65 + Math.random() * 0.3,
      qValues: [
        { action: 'increase_cooling' as const, value: Math.random() * 3 - 1 },
        { action: 'decrease_cooling' as const, value: Math.random() * 3 - 1 },
        { action: 'maintain_cooling' as const, value: Math.random() * 3 - 1 },
      ],
    };
  });
};

export const mockRLEngineState: RLEngineState = {
  currentState: {
    occupancy: 85,
    temperature: 23.4,
    hvacStatus: true,
    timeOfDay: 14,
    outdoorTemp: 34,
    dayOfWeek: 2,
  },
  currentAction: 'increase_cooling',
  currentReward: {
    energyPenalty: -0.85,
    comfortPenalty: -0.32,
    totalReward: 2.14,
  },
  agentConfidence: 0.87,
  policyVersion: 'v3.2.1',
  totalDecisions: 14832,
  avgReward: 1.84,
  decisionHistory: generateRLHistory(),
  actionDistribution: [
    { action: 'increase_cooling', count: 5240, percentage: 35.3 },
    { action: 'decrease_cooling', count: 4120, percentage: 27.8 },
    { action: 'maintain_cooling', count: 5472, percentage: 36.9 },
  ],
};

// ========================
// TRAINING METRICS
// ========================
export const mockTrainingMetrics: TrainingMetrics = {
  totalEpisodes: 50000,
  currentEpisode: 48650,
  bestReward: 4.82,
  avgReward: 3.24,
  explorationRate: 0.05,
  learningRate: 0.0001,
  convergenceScore: 92,
  isTraining: false,
  modelVersion: 'DQN-v3.2.1',
  episodes: Array.from({ length: 100 }, (_, i) => ({
    episode: i * 500,
    reward: -2 + (4.5 * (1 - Math.exp(-i / 30))) + (Math.random() * 0.8 - 0.4),
    loss: 2.5 * Math.exp(-i / 25) + Math.random() * 0.15,
    explorationRate: Math.max(0.05, 1.0 * Math.exp(-i / 20)),
    steps: 150 + Math.floor(Math.random() * 50),
  })),
  rewardProgression: Array.from({ length: 100 }, (_, i) => ({
    episode: i * 500,
    reward: -2 + (4.5 * (1 - Math.exp(-i / 30))) + (Math.random() * 0.8 - 0.4),
  })),
  lossProgression: Array.from({ length: 100 }, (_, i) => ({
    episode: i * 500,
    loss: 2.5 * Math.exp(-i / 25) + Math.random() * 0.15,
  })),
};

// ========================
// KPI DASHBOARD DATA
// ========================
export const mockKPIData: KPIData[] = [
  { label: 'Current Occupancy', value: 847, unit: 'people', change: 12.4, changeDirection: 'up', status: 'good', icon: 'Users' },
  { label: 'Indoor Temperature', value: 23.4, unit: '°C', change: -0.3, changeDirection: 'down', status: 'good', icon: 'Thermometer' },
  { label: 'HVAC Status', value: 'Active', unit: '', change: 0, changeDirection: 'neutral', status: 'good', icon: 'Wind' },
  { label: 'Cooling Level', value: 68, unit: '%', change: 5.2, changeDirection: 'up', status: 'good', icon: 'Snowflake' },
  { label: 'Energy Usage', value: 284.6, unit: 'kW', change: -18.3, changeDirection: 'down', status: 'good', icon: 'Zap' },
  { label: 'Est. Savings', value: 3462, unit: '$/mo', change: 22.1, changeDirection: 'up', status: 'good', icon: 'TrendingDown' },
  { label: 'RL Reward', value: 2.14, unit: 'pts', change: 8.6, changeDirection: 'up', status: 'good', icon: 'Brain' },
  { label: 'System Health', value: 94, unit: '%', change: 1.2, changeDirection: 'up', status: 'good', icon: 'Activity' },
];

// ========================
// HVAC RUNTIME CHART DATA
// ========================
export const mockHVACRuntimeData = Array.from({ length: 24 }, (_, i) => ({
  time: timeLabel(i),
  runtime: [2, 1.5, 1, 0.8, 0.8, 1.2, 3.5, 5.2, 6.8, 7.5, 7.8, 7.2, 6.0, 6.5, 7.0, 7.2, 6.8, 5.5, 4.2, 3.5, 3.0, 2.8, 2.5, 2.2][i],
  efficiency: [92, 93, 95, 96, 96, 94, 90, 87, 84, 82, 81, 83, 85, 84, 82, 83, 84, 86, 89, 90, 91, 92, 92, 93][i],
}));
