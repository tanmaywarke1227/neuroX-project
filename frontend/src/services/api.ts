// =============================================
// API Service Layer
// Returns mock data now; designed for seamless Flask API integration.
// Replace mock imports with fetch() calls when backend is ready.
// =============================================

import {
  mockBuildingState,
  mockOccupancyData,
  mockHVACState,
  mockEnergyMetrics,
  mockRLEngineState,
  mockTrainingMetrics,
} from '../data/mockData';
import type {
  BuildingState,
  OccupancyData,
  HVACState,
  EnergyMetrics,
  RLEngineState,
  TrainingMetrics,
  ApiResponse,
} from '../types';

// Base URL for future Flask backend
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Simulate network latency
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Generic fetch wrapper (for future use)
async function _apiFetch<T>(endpoint: string): Promise<ApiResponse<T>> {
  // When backend is ready, uncomment:
  // const res = await fetch(`${BASE_URL}${endpoint}`);
  // const json = await res.json();
  // return json;
  void endpoint;
  void BASE_URL;
  throw new Error('Not implemented — using mock data');
}

// --- Public API functions ---

export async function fetchBuildingState(): Promise<BuildingState> {
  await delay(300);
  return { ...mockBuildingState, lastUpdated: new Date().toISOString() };
}

export async function fetchOccupancyData(): Promise<OccupancyData> {
  await delay(250);
  return mockOccupancyData;
}

export async function fetchHVACState(): Promise<HVACState> {
  await delay(200);
  return mockHVACState;
}

export async function fetchEnergyMetrics(): Promise<EnergyMetrics> {
  await delay(350);
  return mockEnergyMetrics;
}

export async function fetchRLEngineState(): Promise<RLEngineState> {
  await delay(300);
  return mockRLEngineState;
}

export async function fetchTrainingMetrics(): Promise<TrainingMetrics> {
  await delay(250);
  return mockTrainingMetrics;
}

// --- Mutation endpoints (future) ---
export async function updateHVACOverride(_zoneId: string, _override: boolean): Promise<void> {
  await delay(200);
  // POST ${BASE_URL}/api/hvac/override
}

export async function startSimulation(_config: Record<string, unknown>): Promise<void> {
  await delay(200);
  // POST ${BASE_URL}/api/simulation/start
}

export async function exportReport(_format: 'pdf' | 'csv' | 'excel'): Promise<Blob> {
  await delay(500);
  // GET ${BASE_URL}/api/reports/export?format=${format}
  return new Blob(['Mock report data'], { type: 'text/plain' });
}

export { _apiFetch };
