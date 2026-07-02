import { useState, useEffect } from 'react';
import { useNotifications } from './useNotifications';

export interface DashboardState {
  temperature: number;
  temperature_2?: number;
  pressure: number;
  occupancy: number;
  relay_cool: number;
  relay_heat: number;
  current_amps: number;
  power_draw_w: number;
  rl_action: string;
  confidence: number;
  mode: 'AI' | 'MANUAL';
}

export const useLiveHardware = () => {
  const [data, setData] = useState<DashboardState | null>(null);
  const [isOffline, setIsOffline] = useState<boolean>(true);
  const { pushAlert } = useNotifications();

  const PYTHON_BACKEND_URL = 'http://localhost:5000';

  useEffect(() => {
    let wasOffline = true; // Track previous state for "back online" notification

    const fetchLiveState = async () => {
      try {
        const response = await fetch(`${PYTHON_BACKEND_URL}/api/live_dashboard`);

        // Backend responded but with error (e.g., 503 = hardware offline)
        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          if (response.status === 503 || errBody?.error?.includes('offline')) {
            pushAlert('warning', 'Hardware disconnected — Pico W is not responding');
          } else {
            pushAlert('warning', `Backend error: ${response.status} ${response.statusText}`);
          }
          setIsOffline(true);
          return;
        }

        const jsonData: DashboardState = await response.json();
        setData(jsonData);
        setIsOffline(false);

        // Push "back online" notification if we recovered from offline
        if (wasOffline) {
          pushAlert('info', 'System online — Backend and hardware connected');
        }
        wasOffline = false;
      } catch (_error) {
        // Network error = backend is completely unreachable
        pushAlert('critical', 'Backend offline — Cannot reach Flask server at localhost:5000');
        setIsOffline(true);
        wasOffline = true;
      }
    };

    fetchLiveState();
    const interval = setInterval(fetchLiveState, 2000);

    return () => clearInterval(interval);
  }, [pushAlert]);

  const sendCommand = async (endpoint: string, payload: Record<string, any> = {}) => {
    try {
      await fetch(`${PYTHON_BACKEND_URL}/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (_error) {
      pushAlert('critical', `Command failed: Could not reach backend for ${endpoint}`);
    }
  };

  return { data, isOffline, sendCommand };
};