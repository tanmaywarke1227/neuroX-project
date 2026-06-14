// =============================================
// React Query Hooks — Data fetching with caching & auto-refetch
// =============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchBuildingState,
  fetchOccupancyData,
  fetchHVACState,
  fetchEnergyMetrics,
  fetchRLEngineState,
  fetchTrainingMetrics,
  // Real backend calls
  getAIPrediction,
  fetchHVACHistory,
  fetchDataset,
  fetchDatasetStats,
  checkBackendHealth,
  fetchRLState,
  fetchDashboardSummary,
} from '../services/api';

// =============================================
// Existing mock-data hooks (unchanged)
// =============================================

export const useBuilding = () =>
  useQuery({
    queryKey: ['building'],
    queryFn: fetchBuildingState,
    refetchInterval: 10000,
  });

export const useOccupancy = () =>
  useQuery({
    queryKey: ['occupancy'],
    queryFn: fetchOccupancyData,
    refetchInterval: 15000,
  });

export const useHVAC = () =>
  useQuery({
    queryKey: ['hvac'],
    queryFn: fetchHVACState,
    refetchInterval: 8000,
  });

export const useEnergy = () =>
  useQuery({
    queryKey: ['energy'],
    queryFn: fetchEnergyMetrics,
    refetchInterval: 12000,
  });

export const useRLEngine = () =>
  useQuery({
    queryKey: ['rl-engine'],
    queryFn: fetchRLEngineState,
    refetchInterval: 5000,
  });

export const useTraining = () =>
  useQuery({
    queryKey: ['training'],
    queryFn: fetchTrainingMetrics,
    refetchInterval: 20000,
  });

// =============================================
// REAL Backend Hooks (Flask API)
// =============================================

/** Fetch prediction history from Postgres */
export const useHVACHistory = (limit: number = 50) =>
  useQuery({
    queryKey: ['hvac-history', limit],
    queryFn: () => fetchHVACHistory(limit),
    refetchInterval: 10000,
  });

/** Mutation: send sensor data → get AI prediction */
export const useAIPrediction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: getAIPrediction,
    onSuccess: () => {
      // Refetch history after a new prediction is logged
      queryClient.invalidateQueries({ queryKey: ['hvac-history'] });
    },
  });
};

/** Fetch paginated AI training dataset */
export const useDataset = (params: { page?: number; per_page?: number; hours?: number } = {}) =>
  useQuery({
    queryKey: ['dataset', params],
    queryFn: () => fetchDataset(params),
    staleTime: 60000, // dataset doesn't change often
  });

/** Fetch dataset summary statistics */
export const useDatasetStats = () =>
  useQuery({
    queryKey: ['dataset-stats'],
    queryFn: fetchDatasetStats,
    staleTime: 120000,
  });

/** Backend health check */
export const useBackendHealth = () =>
  useQuery({
    queryKey: ['backend-health'],
    queryFn: checkBackendHealth,
    refetchInterval: 30000,
    retry: 1,
  });

/** Fetch RL engine state (current state, action, reward, history, distribution) */
export const useRLState = () =>
  useQuery({
    queryKey: ['rl-state'],
    queryFn: fetchRLState,
    refetchInterval: 8000,
    retry: 1,
  });

/** Fetch dashboard summary from real backend data */
export const useDashboardSummary = () =>
  useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: fetchDashboardSummary,
    refetchInterval: 10000,
    retry: 1,
  });
