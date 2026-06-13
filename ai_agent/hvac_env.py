import gymnasium as gym
from gymnasium import spaces
import numpy as np
import pandas as pd

class SmartHVACEnv(gym.Env):
    """Custom Environment that follows the Gymnasium interface for HVAC optimization."""
    
    def __init__(self, csv_path="hvac_weather_data.csv"):
        super(SmartHVACEnv, self).__init__()
        
        # Action Space: -1.0 (Cooling) to 1.0 (Heating)
        self.action_space = spaces.Box(low=-1.0, high=1.0, shape=(1,), dtype=np.float32)
        
        # Observation Space: [Indoor Temp, Outdoor Temp, Occupancy]
        # (Fixed the float64 warnings here by specifying the numpy array dtype directly)
        self.observation_space = spaces.Box(
            low=np.array([-1.0, -1.0, -1.0], dtype=np.float32), 
            high=np.array([1.0, 1.0, 1.0], dtype=np.float32), 
            dtype=np.float32
        )
        
        # Physics Parameters
        self.target_temp = 22.0
        self.alpha_leak = 0.05    
        self.gamma_heat = 0.5     
        self.beta_hvac = 3.0      
        self.comfort_weight = 0.6
        self.energy_weight = 0.4
        
        self.current_step = 0
        self.max_steps = 24 * 60  # 1 Full Day per episode
        self.indoor_temp = 25.0
        
        # --- LOAD REAL CSV DATA ---
        self.df = pd.read_csv(csv_path)
        self.max_start_index = len(self.df) - self.max_steps

    def reset(self, seed=None, options=None):
        """Resets the environment to a random day in the dataset."""
        super().reset(seed=seed)
        
        self.episode_start_idx = np.random.randint(0, self.max_start_index)
        self.current_step = 0
        self.indoor_temp = 25.0 
        
        obs = self._get_observation()
        return obs, {}

    def step(self, action):
        """Executes one time step within the environment."""
        hvac_power = action[0]
        
        # FETCH DATA FROM CSV (This was the missing update!)
        actual_idx = self.episode_start_idx + self.current_step
        out_temp = self.df.loc[actual_idx, "outdoor_temp"]
        occ = self.df.loc[actual_idx, "occupancy"]
        
        # Physics Engine
        self.indoor_temp += (self.alpha_leak * (out_temp - self.indoor_temp) + 
                             (self.gamma_heat * occ) + 
                             (self.beta_hvac * hvac_power))
        
        # Reward Function
        comfort_penalty = abs(self.indoor_temp - self.target_temp)
        energy_penalty = abs(hvac_power) * 5.0
        
        reward = -(self.comfort_weight * comfort_penalty + self.energy_weight * energy_penalty)
        
        self.current_step += 1
        terminated = bool(self.current_step >= self.max_steps - 1)
        truncated = False
        
        obs = self._get_observation()
        info = {
            "indoor_temp": self.indoor_temp,
            "energy_used": energy_penalty
        }
        
        return obs, reward, terminated, truncated, info
        
    def _get_observation(self):
        """Helper to fetch and normalize the current state."""
        # FETCH DATA FROM CSV (This was the missing update!)
        actual_idx = self.episode_start_idx + self.current_step
        out_temp = self.df.loc[actual_idx, "outdoor_temp"]
        occ = self.df.loc[actual_idx, "occupancy"]
        
        norm_in_temp = (self.indoor_temp - 22.0) / 10.0
        norm_out_temp = (out_temp - 25.0) / 15.0
        norm_occ = occ / 3.0
        
        return np.array([norm_in_temp, norm_out_temp, norm_occ], dtype=np.float32)