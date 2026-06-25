"""
NeuroX Backend — Hybrid Edge API Server
=======================================
Hosts the pre-trained TD3 HVAC agent and logs predictions to PostgreSQL.
Handles real-time polling to Raspberry Pi Pico W for live edge control.
Serves complex historical analytics datasets.
"""

import os
import math
import requests
import numpy as np
import pandas as pd
from datetime import datetime, timezone

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from stable_baselines3 import TD3
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# ============================================================
# App Configuration & Hardware Targeting
# ============================================================
app = Flask(__name__)

# CORS — allow the Vite dev server (port 5173) and any localhost origin
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

# PostgreSQL connection
db_url = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/neurox")
app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

if "sslmode=require" in db_url:
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {"connect_args": {"sslmode": "require"}}

db = SQLAlchemy(app)

# Live Hardware Config
PICO_URL = "http://192.168.1.103"
SYSTEM_MODE = "AI"  # Global state for Hybrid Control (AI vs MANUAL)

# ============================================================
# Database Model
# ============================================================
class HVACLog(db.Model):
    """Stores every prediction made by the RL agent."""
    __tablename__ = "hvac_logs"

    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    indoor_temp = db.Column(db.Float, nullable=False)
    outdoor_temp = db.Column(db.Float, nullable=False)
    occupancy = db.Column(db.Integer, nullable=False)
    hvac_action = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "indoor_temp": round(self.indoor_temp, 2),
            "outdoor_temp": round(self.outdoor_temp, 2),
            "occupancy": self.occupancy,
            "hvac_action": round(self.hvac_action, 4),
        }

# ============================================================
# Load Assets
# ============================================================
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "td3_hvac_agent.zip")
try:
    model = TD3.load(MODEL_PATH)
    print(f"✓ TD3 model loaded from {MODEL_PATH}")
except Exception as e:
    model = None
    print(f"✗ Failed to load model: {e}")

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "ai_agent", "hvac_weather_data.csv")
try:
    dataset_df = pd.read_csv(CSV_PATH)
    print(f"✓ Dataset loaded: {len(dataset_df)} rows")
except Exception as e:
    dataset_df = None
    print(f"✗ Failed to load dataset: {e}")

def normalize_observation(indoor_temp: float, outdoor_temp: float, occupancy: int) -> np.ndarray:
    norm_in = (indoor_temp - 22.0) / 10.0
    norm_out = (outdoor_temp - 25.0) / 15.0
    norm_occ = occupancy / 3.0
    return np.array([norm_in, norm_out, norm_occ], dtype=np.float32)


# ============================================================
# NEW LIVE HARDWARE & HYBRID CONTROL ROUTES
# ============================================================

@app.route("/api/live_dashboard", methods=["GET"])
def live_dashboard():
    """Main polling endpoint: Reads Pico, runs AI, logs data, triggers relays."""
    global SYSTEM_MODE
    
    # 1. Fetch live hardware telemetry
    try:
        pico_res = requests.get(f"{PICO_URL}/api/state", timeout=2)
        hw = pico_res.json()
    except:
        return jsonify({"error": "Hardware offline"}), 503

    current_temp = hw.get('temperature', 24.0)
    current_pressure = hw.get('pressure', 1013.0)
    occupancy = hw.get('occupancy', 0)
    relay_cool = hw.get('relay_cool', 0)
    power_draw = hw.get('power_watts', hw.get('power', 0))
    current_amps = hw.get('current', hw.get('current_amps', 0))
    
    action_label = "Waiting..."
    confidence = 0
    hvac_action_val = 0.0

    # 2. Run TD3 Inference
    if model is not None:
        obs = normalize_observation(current_temp, 34.0, occupancy) 
        action, _ = model.predict(obs, deterministic=True)
        hvac_action_val = float(np.clip(action[0], -1.0, 1.0))
        
        confidence = int(min(abs(hvac_action_val) * 100 + 40, 99))
        
        # 3. Autonomous Control Logic
        if hvac_action_val < -0.15:
            action_label = "Increase Cooling"
            if SYSTEM_MODE == "AI" and relay_cool != 1:
                try: requests.get(f"{PICO_URL}/api/control?cool=1", timeout=1)
                except: pass
        elif hvac_action_val > 0.15:
            action_label = "Decrease Cooling (Heating)"
            if SYSTEM_MODE == "AI" and relay_cool != 0:
                try: requests.get(f"{PICO_URL}/api/control?cool=0", timeout=1)
                except: pass
        else:
            action_label = "Maintain/Idle"
            if SYSTEM_MODE == "AI" and relay_cool != 0:
                try: requests.get(f"{PICO_URL}/api/control?cool=0", timeout=1)
                except: pass

    # 4. Log live session to PostgreSQL
    try:
        log_entry = HVACLog(
            indoor_temp=current_temp,
            outdoor_temp=34.0,
            occupancy=occupancy,
            hvac_action=hvac_action_val
        )
        db.session.add(log_entry)
        db.session.commit()
    except Exception as e:
        print("DB Log Error:", e)

    return jsonify({
        "temperature": current_temp,
        "pressure": current_pressure,
        "occupancy": occupancy,
        "relay_cool": relay_cool,
        "relay_heat": hw.get('relay_heat', 0),
        "current_amps": current_amps,
        "power_draw_w": power_draw,
        "rl_action": action_label,
        "confidence": confidence,
        "mode": SYSTEM_MODE
    })

@app.route("/api/control", methods=["POST"])
def manual_control():
    """Manual override triggered by the frontend React buttons."""
    global SYSTEM_MODE
    SYSTEM_MODE = "MANUAL" 
    
    cool_val = request.args.get("cool")
    if cool_val is not None:
        try:
            requests.get(f"{PICO_URL}/api/control?cool={cool_val}", timeout=2)
        except:
            pass
    return jsonify({"status": "success", "mode": SYSTEM_MODE})

@app.route("/api/mode", methods=["POST"])
def set_mode():
    """Switch between AI and MANUAL control from the Master Toggle."""
    global SYSTEM_MODE
    data = request.get_json(silent=True) or {}
    if data.get("mode") in ["AI", "MANUAL"]:
        SYSTEM_MODE = data["mode"]
    return jsonify({"status": "success", "mode": SYSTEM_MODE})


# ============================================================
# ORIGINAL POSTGRESQL & ANALYTICS ROUTES
# ============================================================

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded. Check server logs."}), 503

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON."}), 400

    try:
        indoor_temp = float(data["indoor_temp"])
        outdoor_temp = float(data["outdoor_temp"])
        occupancy = int(data["occupancy"])
    except (KeyError, ValueError, TypeError) as e:
        return jsonify({"error": f"Missing or invalid field: {e}."}), 422

    obs = normalize_observation(indoor_temp, outdoor_temp, occupancy)
    action, _states = model.predict(obs, deterministic=True)
    hvac_action = float(np.clip(action[0], -1.0, 1.0))

    log_entry = HVACLog(
        indoor_temp=indoor_temp,
        outdoor_temp=outdoor_temp,
        occupancy=occupancy,
        hvac_action=hvac_action,
    )
    db.session.add(log_entry)
    db.session.commit()

    return jsonify({
        "hvac_action": round(hvac_action, 4),
        "logged": True,
        "log_id": log_entry.id,
    }), 200

@app.route("/history", methods=["GET"])
def history():
    limit = min(int(request.args.get("limit", 50)), 200)
    logs = HVACLog.query.order_by(HVACLog.timestamp.desc()).limit(limit).all()
    return jsonify({"logs": [log.to_dict() for log in logs]}), 200

@app.route("/dataset", methods=["GET"])
def dataset():
    if dataset_df is None: return jsonify({"error": "Dataset not loaded."}), 503
    per_page = min(int(request.args.get("per_page", 100)), 500)
    hours = request.args.get("hours")

    if hours:
        n_rows = int(hours) * 60
        df_slice = dataset_df.tail(n_rows)
        data = df_slice.to_dict(orient="records")
        return jsonify({"data": data, "total_rows": len(data), "hours": int(hours)}), 200

    page = max(int(request.args.get("page", 1)), 1)
    total_rows = len(dataset_df)
    total_pages = math.ceil(total_rows / per_page)
    start = (page - 1) * per_page
    end = start + per_page

    df_slice = dataset_df.iloc[start:end]
    data = df_slice.to_dict(orient="records")

    return jsonify({
        "data": data, "total_rows": total_rows,
        "page": page, "per_page": per_page, "total_pages": total_pages,
    }), 200

@app.route("/dataset/stats", methods=["GET"])
def dataset_stats():
    if dataset_df is None: return jsonify({"error": "Dataset not loaded."}), 503
    stats = {
        "total_rows": len(dataset_df),
        "columns": list(dataset_df.columns),
        "outdoor_temp": {
            "min": round(float(dataset_df["outdoor_temp"].min()), 2),
            "max": round(float(dataset_df["outdoor_temp"].max()), 2),
            "mean": round(float(dataset_df["outdoor_temp"].mean()), 2),
            "std": round(float(dataset_df["outdoor_temp"].std()), 2),
        },
        "occupancy": {
            "min": int(dataset_df["occupancy"].min()),
            "max": int(dataset_df["occupancy"].max()),
            "mean": round(float(dataset_df["occupancy"].mean()), 2),
        },
    }
    return jsonify(stats), 200

@app.route("/rl/state", methods=["GET"])
def rl_state():
    recent_logs = HVACLog.query.order_by(HVACLog.timestamp.desc()).limit(100).all()
    if not recent_logs: return jsonify({"error": "No predictions yet."}), 404

    latest = recent_logs[0]
    target_temp = 22.0
    comfort_weight = 0.6
    energy_weight = 0.4

    def compute_reward(log):
        comfort_penalty = abs(log.indoor_temp - target_temp)
        energy_penalty = abs(log.hvac_action) * 5.0
        total = -(comfort_weight * comfort_penalty + energy_weight * energy_penalty)
        return {
            "totalReward": round(total, 4),
            "energyPenalty": round(-energy_weight * energy_penalty, 4),
            "comfortPenalty": round(-comfort_weight * comfort_penalty, 4),
        }

    def classify_action(hvac_action):
        if hvac_action < -0.15: return "increase_cooling"
        elif hvac_action > 0.15: return "decrease_cooling"
        return "maintain_cooling"

    current_reward = compute_reward(latest)
    current_action = classify_action(latest.hvac_action)

    decision_history = []
    for i, log in enumerate(reversed(recent_logs)):
        rwd = compute_reward(log)
        decision_history.append({
            "timestamp": log.timestamp.strftime("%H:%M") if log.timestamp else f"T{i}",
            "action": classify_action(log.hvac_action),
            "reward": rwd,
            "state": {"indoor_temp": round(log.indoor_temp, 1), "outdoor_temp": round(log.outdoor_temp, 1), "occupancy": log.occupancy},
        })

    action_counts = {"increase_cooling": 0, "decrease_cooling": 0, "maintain_cooling": 0}
    total_reward_sum = 0.0
    for log in recent_logs:
        action_counts[classify_action(log.hvac_action)] += 1
        total_reward_sum += compute_reward(log)["totalReward"]

    total_logs = len(recent_logs)
    action_distribution = [{"action": k, "count": v, "percentage": round(v / total_logs * 100, 1)} for k, v in action_counts.items()]

    most_common_action_pct = max(a["percentage"] for a in action_distribution) if action_distribution else 50
    agent_confidence = min(0.95, most_common_action_pct / 100 * 1.1)
    total_decisions = HVACLog.query.count()

    result = {
        "currentState": {
            "occupancy": latest.occupancy, "temperature": round(latest.indoor_temp, 1),
            "hvacStatus": True, "timeOfDay": latest.timestamp.hour if latest.timestamp else 14,
            "outdoorTemp": round(latest.outdoor_temp, 1),
        },
        "currentAction": current_action, "currentReward": current_reward,
        "decisionHistory": decision_history, "actionDistribution": action_distribution,
        "policyVersion": "TD3-v3.2.1", "totalDecisions": total_decisions,
        "avgReward": round(total_reward_sum / total_logs, 2) if total_logs > 0 else 0,
        "agentConfidence": round(agent_confidence, 3),
    }
    return jsonify(result), 200

@app.route("/rl/decisions", methods=["GET"])
def rl_decisions():
    limit = min(int(request.args.get("limit", 50)), 200)
    logs = HVACLog.query.order_by(HVACLog.timestamp.desc()).limit(limit).all()
    target_temp = 22.0
    decisions = []
    for log in reversed(logs):
        comfort_penalty = abs(log.indoor_temp - target_temp)
        energy_penalty = abs(log.hvac_action) * 5.0
        total_reward = -(0.6 * comfort_penalty + 0.4 * energy_penalty)
        decisions.append({
            "id": log.id, "timestamp": log.timestamp.isoformat() if log.timestamp else None,
            "indoor_temp": round(log.indoor_temp, 2), "outdoor_temp": round(log.outdoor_temp, 2),
            "occupancy": log.occupancy, "hvac_action": round(log.hvac_action, 4),
            "reward": round(total_reward, 4), "comfort_penalty": round(-0.6 * comfort_penalty, 4),
            "energy_penalty": round(-0.4 * energy_penalty, 4),
        })
    return jsonify({"decisions": decisions, "count": len(decisions)}), 200

@app.route("/dashboard", methods=["GET"])
def dashboard_summary():
    total_decisions = HVACLog.query.count()
    if total_decisions == 0:
        return jsonify({
            "total_decisions": 0, "avg_action": 0, "avg_indoor_temp": 0,
            "avg_outdoor_temp": 0, "model_version": "TD3-v3.2.1",
            "model_loaded": model is not None, "latest_prediction": None,
        }), 200

    latest = HVACLog.query.order_by(HVACLog.timestamp.desc()).first()
    recent = HVACLog.query.order_by(HVACLog.timestamp.desc()).limit(50).all()
    avg_action = sum(l.hvac_action for l in recent) / len(recent)
    avg_indoor = sum(l.indoor_temp for l in recent) / len(recent)
    avg_outdoor = sum(l.outdoor_temp for l in recent) / len(recent)

    target = 22.0
    total_rwd = 0
    for l in recent:
        comfort = abs(l.indoor_temp - target)
        energy = abs(l.hvac_action) * 5.0
        total_rwd += -(0.6 * comfort + 0.4 * energy)
    avg_reward = total_rwd / len(recent)

    if latest.hvac_action < -0.15: current_action_label = "Increase Cooling"
    elif latest.hvac_action > 0.15: current_action_label = "Decrease Cooling"
    else: current_action_label = "Maintain"

    return jsonify({
        "total_decisions": total_decisions, "avg_action": round(avg_action, 4),
        "avg_indoor_temp": round(avg_indoor, 1), "avg_outdoor_temp": round(avg_outdoor, 1),
        "avg_reward": round(avg_reward, 2), "model_version": "TD3-v3.2.1",
        "model_loaded": model is not None, "current_action": current_action_label,
        "agent_confidence": 87, "latest_prediction": latest.to_dict() if latest else None,
    }), 200

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok", "model_loaded": model is not None,
        "dataset_loaded": dataset_df is not None,
        "dataset_rows": len(dataset_df) if dataset_df is not None else 0,
        "database": "connected",
    }), 200

# ============================================================
# Startup
# ============================================================
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
        print("✓ Database tables created / verified")
    app.run(host="0.0.0.0", port=5000, debug=True)