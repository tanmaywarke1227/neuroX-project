import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def generate_hvac_data():
    print("Generating realistic synthetic weather and occupancy data...")
    
    # 30 days of data at 1-minute intervals
    start_date = datetime(2026, 6, 1, 0, 0, 0)
    total_minutes = 30 * 24 * 60
    
    timestamps = [start_date + timedelta(minutes=i) for i in range(total_minutes)]
    
    outdoor_temps = []
    occupancy_profile = []
    
    for ts in timestamps:
        # 1. Simulating Diurnal Temperature Cycle (Coldest at 4 AM, Warmest at 3 PM)
        hour = ts.hour + (ts.minute / 60.0)
        base_temp = 25.0  # Average summer temperature
        daily_variation = 8.0 * np.sin((hour - 9) * np.pi / 12)  # Peak at 15:00 (3 PM)
        noise = np.random.normal(0, 0.5)  # Slight random weather fluctuations
        outdoor_temps.append(base_temp + daily_variation + noise)
        
        # 2. Simulating Office/Room Occupancy Profile
        # 00:00 - 07:00 -> Empty (0)
        # 08:00 - 12:00 -> Busy (2-3 people)
        # 12:00 - 13:00 -> Lunch break (1 person)
        # 13:00 - 17:00 -> Very Busy (3 people)
        # 17:00 - 22:00 -> Winding down (1 person)
        # 22:00 - 24:00 -> Empty (0)
        if 8 <= ts.hour < 12:
            occ = np.random.choice([2, 3], p=[0.3, 0.7])
        elif 12 <= ts.hour < 13:
            occ = 1
        elif 13 <= ts.hour < 17:
            occ = 3
        elif 17 <= ts.hour < 22:
            occ = np.random.choice([0, 1], p=[0.4, 0.6])
        else:
            occ = 0
        occupancy_profile.append(occ)

    # Combine into a clean DataFrame
    df = pd.DataFrame({
        "timestamp": timestamps,
        "outdoor_temp": outdoor_temps,
        "occupancy": occupancy_profile
    })
    
    # Save to file
    df.to_csv("hvac_weather_data.csv", index=False)
    print("Success! Saved 43,200 data rows to 'hvac_weather_data.csv'.")

if __name__ == "__main__":
    generate_hvac_data()