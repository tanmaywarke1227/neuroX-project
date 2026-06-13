import gymnasium as gym
from stable_baselines3 import TD3
from stable_baselines3.common.env_checker import check_env
from stable_baselines3.common.noise import NormalActionNoise
import numpy as np

# Import your custom environment class
from hvac_env import SmartHVACEnv

def main():
    print("1. Initializing Environment...")
    env = SmartHVACEnv()
    
    # Optional but highly recommended: Verify your environment architecture is valid
    check_env(env, warn=True)
    
    # 2. Add Action Noise for TD3
    # TD3 is deterministic. To make it explore during training, we inject Gaussian noise.
    n_actions = env.action_space.shape[-1]
    action_noise = NormalActionNoise(mean=np.zeros(n_actions), sigma=0.1 * np.ones(n_actions))
    
    print("2. Building the TD3 Agent...")
    # Initialize the TD3 model with the Multi-Layer Perceptron (MLP) policy
    model = TD3("MlpPolicy", 
                env, 
                action_noise=action_noise, 
                verbose=1,
                learning_rate=0.001,
                buffer_size=100000)
    
    print("3. Starting Training Phase...")
    # Train the agent (100,000 steps is a good baseline to see it start learning)
    model.learn(total_timesteps=100000, log_interval=10)
    
    print("4. Saving the Trained Model...")
    model.save("td3_hvac_agent")
    
    print("Training Complete! Model saved as 'td3_hvac_agent.zip'")

if __name__ == "__main__":
    main()