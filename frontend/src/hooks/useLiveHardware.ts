import { useState, useEffect } from 'react';

export interface DashboardState {
  temperature: number;
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
  
  // Pointing strictly to your Python Brain (Tier 2), not the Pico
  const PYTHON_BACKEND_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchLiveState = async () => {
      try {
        const response = await fetch(`${PYTHON_BACKEND_URL}/api/live_dashboard`);
        if (!response.ok) throw new Error('Backend response was not ok');
        
        const jsonData: DashboardState = await response.json();
        setData(jsonData);
        setIsOffline(false);
      } catch (error) {
        console.error("Failed to fetch from Python backend:", error);
        setIsOffline(true);
      }
    };

    fetchLiveState(); 
    const interval = setInterval(fetchLiveState, 2000); // Poll every 2 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Send manual commands to the Python backend to route to the hardware
  const sendCommand = async (endpoint: string, payload: Record<string, any> = {}) => {
    try {
      await fetch(`${PYTHON_BACKEND_URL}/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error(`Failed to send command to ${endpoint}:`, error);
    }
  };

  return { data, isOffline, sendCommand };
};