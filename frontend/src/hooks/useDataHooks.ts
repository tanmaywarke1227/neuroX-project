// =============================================
// React Query Hooks — Data fetching with caching & auto-refetch
// =============================================

import { useQuery } from '@tanstack/react-query';
import {
  fetchBuildingState,
  fetchOccupancyData,
  fetchHVACState,
  fetchEnergyMetrics,
  fetchRLEngineState,
  fetchTrainingMetrics,
} from '../services/api';

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
