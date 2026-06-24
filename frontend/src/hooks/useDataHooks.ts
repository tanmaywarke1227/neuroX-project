// =============================================
// React Query Hooks — Data fetching with caching & auto-refetch
// (V5 — Fully Hardware-Aligned)
// =============================================

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAIPrediction,
  fetchHVACHistory,
  fetchDataset,
  fetchDatasetStats,
  checkBackendHealth,
  fetchRLState,
  fetchDashboardSummary,
} from '../services/api';

// =============================================
// Real Backend Hooks
// =============================================

/** AI Prediction mutation — POST /predict */
export const useAIPrediction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: getAIPrediction,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hvac-history'] });
      qc.invalidateQueries({ queryKey: ['rl-state'] });
      qc.invalidateQueries({ queryKey: ['dashboard-summary'] });
    },
  });
};

/** HVAC prediction history — GET /history */
export const useHVACHistory = (limit: number = 50) =>
  useQuery({
    queryKey: ['hvac-history', limit],
    queryFn: () => fetchHVACHistory(limit),
    refetchInterval: 10000,
    retry: 1,
  });

/** AI Dataset — GET /dataset */
export const useDataset = (params: { page?: number; per_page?: number; hours?: number } = {}) =>
  useQuery({
    queryKey: ['dataset', params],
    queryFn: () => fetchDataset(params),
    retry: 1,
  });

/** Dataset stats — GET /dataset/stats */
export const useDatasetStats = () =>
  useQuery({
    queryKey: ['dataset-stats'],
    queryFn: fetchDatasetStats,
    retry: 1,
  });

/** Backend health check — GET /health */
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