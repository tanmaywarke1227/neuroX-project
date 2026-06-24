/**
 * NeuroX — HVAC AI Service
 * =========================
 * Utility functions for communicating with the Flask backend.
 * Import these into your existing React components as needed.
 *
 * Usage:
 *   import { getAIPrediction, fetchLogHistory } from './api/hvacService';
 *
 *   const result = await getAIPrediction({ indoor_temp: 24.5, outdoor_temp: 32, occupancy: 2 });
 *   console.log(result.hvac_action); // e.g. 0.42
 *
 *   const history = await fetchLogHistory();
 *   console.log(history.logs); // [ { id, timestamp, indoor_temp, ... }, ... ]
 */

const BASE_URL = "http://localhost:5050";

/**
 * Send sensor readings to the RL agent and get back an HVAC action.
 *
 * @param {Object} data - Sensor inputs
 * @param {number} data.indoor_temp  - Current indoor temperature (°C)
 * @param {number} data.outdoor_temp - Current outdoor temperature (°C)
 * @param {number} data.occupancy    - Current occupancy level (integer)
 *
 * @returns {Promise<{ hvac_action: number, logged: boolean, log_id: number }>}
 *
 * @example
 *   const result = await getAIPrediction({
 *     indoor_temp: 24.5,
 *     outdoor_temp: 32.0,
 *     occupancy: 2,
 *   });
 *   // result.hvac_action → 0.42 (positive = heating, negative = cooling)
 */
export async function getAIPrediction(data) {
  const response = await fetch(`${BASE_URL}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      indoor_temp: data.indoor_temp,
      outdoor_temp: data.outdoor_temp,
      occupancy: data.occupancy,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Prediction failed (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Fetch the last 50 prediction logs from the database.
 *
 * @returns {Promise<{ logs: Array<{ id: number, timestamp: string, indoor_temp: number, outdoor_temp: number, occupancy: number, hvac_action: number }> }>}
 *
 * @example
 *   const { logs } = await fetchLogHistory();
 *   logs.forEach(log => console.log(log.timestamp, log.hvac_action));
 */
export async function fetchLogHistory() {
  const response = await fetch(`${BASE_URL}/history`);

  if (!response.ok) {
    throw new Error(`Failed to fetch history (HTTP ${response.status})`);
  }

  return response.json();
}
