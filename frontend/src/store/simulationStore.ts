// =============================================
// Simulation Store — Controls building simulation parameters
// =============================================

import { create } from 'zustand';
import type { SimulationConfig } from '../types';

interface SimulationState extends SimulationConfig {
  setOccupancy: (level: number) => void;
  setTemperature: (temp: number) => void;
  toggleWeekendMode: () => void;
  togglePeakHour: () => void;
  setWeather: (w: SimulationConfig['weatherCondition']) => void;
  setTimeOfDay: (h: number) => void;
  toggleRunning: () => void;
  reset: () => void;
}

const defaults: SimulationConfig = {
  occupancyLevel: 60,
  temperatureBase: 34,
  weekendMode: false,
  peakHourMode: false,
  weatherCondition: 'sunny',
  timeOfDay: 14,
  isRunning: false,
};

export const useSimulationStore = create<SimulationState>((set) => ({
  ...defaults,
  setOccupancy: (level) => set({ occupancyLevel: level }),
  setTemperature: (temp) => set({ temperatureBase: temp }),
  toggleWeekendMode: () => set((s) => ({ weekendMode: !s.weekendMode })),
  togglePeakHour: () => set((s) => ({ peakHourMode: !s.peakHourMode })),
  setWeather: (w) => set({ weatherCondition: w }),
  setTimeOfDay: (h) => set({ timeOfDay: h }),
  toggleRunning: () => set((s) => ({ isRunning: !s.isRunning })),
  reset: () => set(defaults),
}));
