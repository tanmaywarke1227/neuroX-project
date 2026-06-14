// =============================================
// API Service Layer
// Combines mock data for pages not yet connected
// with REAL Flask backend calls for AI/HVAC data.
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

// Base URL for Flask backend
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Simulate network latency (for mock data)
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Generic fetch wrapper for Flask backend
async function backendFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `Backend error (HTTP ${res.status})`);
  }
  return res.json();
}

// =============================================
// REAL Backend Calls (Flask API)
// =============================================

/** POST /predict — Get AI prediction for HVAC action */
export async function getAIPrediction(data: {
  indoor_temp: number;
  outdoor_temp: number;
  occupancy: number;
}): Promise<{ hvac_action: number; logged: boolean; log_id: number }> {
  return backendFetch('/predict', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/** GET /history — Fetch prediction logs from database */
export async function fetchHVACHistory(limit: number = 50): Promise<{
  logs: Array<{
    id: number;
    timestamp: string;
    indoor_temp: number;
    outdoor_temp: number;
    occupancy: number;
    hvac_action: number;
  }>;
}> {
  return backendFetch(`/history?limit=${limit}`);
}

/** GET /dataset — Paginated AI training data */
export async function fetchDataset(params: {
  page?: number;
  per_page?: number;
  hours?: number;
} = {}): Promise<{
  data: Array<{ timestamp: string; outdoor_temp: number; occupancy: number }>;
  total_rows: number;
  page?: number;
  per_page?: number;
  total_pages?: number;
  hours?: number;
}> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.per_page) searchParams.set('per_page', String(params.per_page));
  if (params.hours) searchParams.set('hours', String(params.hours));
  return backendFetch(`/dataset?${searchParams.toString()}`);
}

/** GET /dataset/stats — Dataset summary statistics */
export async function fetchDatasetStats(): Promise<{
  total_rows: number;
  columns: string[];
  outdoor_temp: { min: number; max: number; mean: number; std: number };
  occupancy: { min: number; max: number; mean: number };
  time_range: { start: string; end: string };
}> {
  return backendFetch('/dataset/stats');
}

/** GET /health — Backend health check */
export async function checkBackendHealth(): Promise<{
  status: string;
  model_loaded: boolean;
  dataset_loaded: boolean;
  dataset_rows: number;
  database: string;
}> {
  return backendFetch('/health');
}

/** GET /rl/state — Full RL engine state (current state, action, reward, history, distribution) */
export async function fetchRLState(): Promise<{
  currentState: {
    occupancy: number;
    temperature: number;
    hvacStatus: boolean;
    timeOfDay: number;
    outdoorTemp: number;
  };
  currentAction: 'increase_cooling' | 'decrease_cooling' | 'maintain_cooling';
  currentReward: {
    totalReward: number;
    energyPenalty: number;
    comfortPenalty: number;
  };
  decisionHistory: Array<{
    timestamp: string;
    action: string;
    reward: { totalReward: number; energyPenalty: number; comfortPenalty: number };
    state: { indoor_temp: number; outdoor_temp: number; occupancy: number };
  }>;
  actionDistribution: Array<{
    action: string;
    count: number;
    percentage: number;
  }>;
  policyVersion: string;
  totalDecisions: number;
  avgReward: number;
  agentConfidence: number;
}> {
  return backendFetch('/rl/state');
}

/** GET /dashboard — Dashboard KPI summary from real data */
export async function fetchDashboardSummary(): Promise<{
  total_decisions: number;
  avg_action: number;
  avg_indoor_temp: number;
  avg_outdoor_temp: number;
  avg_reward: number;
  model_version: string;
  model_loaded: boolean;
  current_action: string;
  agent_confidence: number;
  latest_prediction: {
    id: number;
    timestamp: string;
    indoor_temp: number;
    outdoor_temp: number;
    occupancy: number;
    hvac_action: number;
  } | null;
}> {
  return backendFetch('/dashboard');
}

// =============================================
// Mock Data Functions (existing pages)
// =============================================

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
}

export async function startSimulation(_config: Record<string, unknown>): Promise<void> {
  await delay(200);
}

export async function exportReport(_format: 'pdf' | 'csv' | 'excel'): Promise<Blob> {
  await delay(500);
  return new Blob(['Mock report data'], { type: 'text/plain' });
}

// Generic fetch (kept for compatibility)
async function _apiFetch<T>(endpoint: string): Promise<ApiResponse<T>> {
  void endpoint;
  throw new Error('Not implemented — use specific functions');
}

export { _apiFetch };
