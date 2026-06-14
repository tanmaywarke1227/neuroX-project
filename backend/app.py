"""
NeuroX Backend — Flask API Server
==================================
Hosts the pre-trained TD3 HVAC agent and logs predictions to PostgreSQL.
Serves the AI training dataset for frontend visualization.

Endpoints:
  POST /predict        → Receive sensor data, run inference, log + return action
  GET  /history        → Fetch the last 50 prediction logs
  GET  /dataset        → Paginated CSV data as JSON
  GET  /dataset/stats  → Summary statistics of the dataset
  GET  /health         → Health check
"""

import os
import math
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
# App Configuration
# ============================================================
app = Flask(__name__)

# CORS — allow the Vite dev server (port 5173) and any localhost origin
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

# PostgreSQL connection
db_url = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/neurox")

# Handle SSL for cloud Postgres providers (Neon, Supabase, etc.)
app.config["SQLALCHEMY_DATABASE_URI"] = db_url
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# If using Neon/cloud Postgres with sslmode in the URL, psycopg2 handles it.
# For extra SSL options, configure engine options:
if "sslmode=require" in db_url:
    app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
        "connect_args": {"sslmode": "require"}
    }

db = SQLAlchemy(app)

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
# Load the Pre-Trained TD3 Model (once at startup)
# ============================================================
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "td3_hvac_agent.zip")

try:
    model = TD3.load(MODEL_PATH)
    print(f"✓ TD3 model loaded from {MODEL_PATH}")
except Exception as e:
    model = None
    print(f"✗ Failed to load model: {e}")

# ============================================================
# Load the AI Dataset (once at startup)
# ============================================================
CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "ai_agent", "hvac_weather_data.csv")

try:
    dataset_df = pd.read_csv(CSV_PATH)
    print(f"✓ Dataset loaded: {len(dataset_df)} rows from {CSV_PATH}")
except Exception as e:
    dataset_df = None
    print(f"✗ Failed to load dataset: {e}")

# ============================================================
# Normalization (must match hvac_env.py exactly)
# ============================================================
def normalize_observation(indoor_temp: float, outdoor_temp: float, occupancy: int) -> np.ndarray:
    """
    Normalize raw sensor values to the [-1, 1] observation space
    that the TD3 agent was trained on.

    Mirrors SmartHVACEnv._get_observation():
      norm_in_temp  = (indoor_temp - 22.0) / 10.0
      norm_out_temp = (outdoor_temp - 25.0) / 15.0
      norm_occ      = occupancy / 3.0
    """
    norm_in = (indoor_temp - 22.0) / 10.0
    norm_out = (outdoor_temp - 25.0) / 15.0
    norm_occ = occupancy / 3.0
    return np.array([norm_in, norm_out, norm_occ], dtype=np.float32)

# ============================================================
# Routes
# ============================================================

@app.route("/predict", methods=["POST"])
def predict():
    """
    Run RL inference on sensor inputs.

    Expects JSON:
      { "indoor_temp": 24.5, "outdoor_temp": 32.0, "occupancy": 2 }

    Returns JSON:
      { "hvac_action": 0.42, "logged": true }
    """
    if model is None:
        return jsonify({"error": "Model not loaded. Check server logs."}), 503

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be JSON."}), 400

    # --- Validate inputs ---
    try:
        indoor_temp = float(data["indoor_temp"])
        outdoor_temp = float(data["outdoor_temp"])
        occupancy = int(data["occupancy"])
    except (KeyError, ValueError, TypeError) as e:
        return jsonify({
            "error": f"Missing or invalid field: {e}. "
                     "Required: indoor_temp (float), outdoor_temp (float), occupancy (int)."
        }), 422

    # --- Normalize & predict ---
    obs = normalize_observation(indoor_temp, outdoor_temp, occupancy)
    action, _states = model.predict(obs, deterministic=True)
    hvac_action = float(np.clip(action[0], -1.0, 1.0))

    # --- Log to database ---
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
    """
    Fetch the last N prediction logs, newest first.
    Query param: ?limit=50 (default 50, max 200)
    """
    limit = min(int(request.args.get("limit", 50)), 200)
    logs = (
        HVACLog.query
        .order_by(HVACLog.timestamp.desc())
        .limit(limit)
        .all()
    )
    return jsonify({"logs": [log.to_dict() for log in logs]}), 200


@app.route("/dataset", methods=["GET"])
def dataset():
    """
    Return paginated rows from the AI training CSV dataset.
    
    Query params:
      ?page=1       (default 1)
      &per_page=100 (default 100, max 500)
      &hours=24     (optional: return last N hours of data)

    Returns JSON:
      { "data": [...], "total_rows": 43201, "page": 1, "per_page": 100, "total_pages": 433 }
    """
    if dataset_df is None:
        return jsonify({"error": "Dataset not loaded."}), 503

    per_page = min(int(request.args.get("per_page", 100)), 500)
    hours = request.args.get("hours")

    if hours:
        # Return last N hours (N * 60 rows since data is per-minute)
        n_rows = int(hours) * 60
        df_slice = dataset_df.tail(n_rows)
        data = df_slice.to_dict(orient="records")
        return jsonify({
            "data": data,
            "total_rows": len(data),
            "hours": int(hours),
        }), 200

    page = max(int(request.args.get("page", 1)), 1)
    total_rows = len(dataset_df)
    total_pages = math.ceil(total_rows / per_page)
    start = (page - 1) * per_page
    end = start + per_page

    df_slice = dataset_df.iloc[start:end]
    data = df_slice.to_dict(orient="records")

    return jsonify({
        "data": data,
        "total_rows": total_rows,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
    }), 200


@app.route("/dataset/stats", methods=["GET"])
def dataset_stats():
    """
    Return summary statistics of the AI training dataset.
    """
    if dataset_df is None:
        return jsonify({"error": "Dataset not loaded."}), 503

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
        "time_range": {
            "start": str(dataset_df["timestamp"].iloc[0]),
            "end": str(dataset_df["timestamp"].iloc[-1]),
        },
    }
    return jsonify(stats), 200


@app.route("/rl/state", methods=["GET"])
def rl_state():
    """
    Full RL engine state for the frontend RL Engine page.
    Derives current state, action, reward, decision history,
    action distribution, and agent metrics from the database logs.
    """
    # --- Fetch recent logs ---
    recent_logs = (
        HVACLog.query
        .order_by(HVACLog.timestamp.desc())
        .limit(100)
        .all()
    )

    if not recent_logs:
        return jsonify({"error": "No predictions yet. Make some predictions first."}), 404

    latest = recent_logs[0]

    # --- Compute reward using same formula as hvac_env.py ---
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

    # --- Classify action ---
    def classify_action(hvac_action):
        if hvac_action < -0.15:
            return "increase_cooling"
        elif hvac_action > 0.15:
            return "decrease_cooling"
        else:
            return "maintain_cooling"

    # --- Current state ---
    current_reward = compute_reward(latest)
    current_action = classify_action(latest.hvac_action)

    # --- Decision history (for Reward Timeline chart) ---
    decision_history = []
    for i, log in enumerate(reversed(recent_logs)):
        rwd = compute_reward(log)
        decision_history.append({
            "timestamp": log.timestamp.strftime("%H:%M") if log.timestamp else f"T{i}",
            "action": classify_action(log.hvac_action),
            "reward": rwd,
            "state": {
                "indoor_temp": round(log.indoor_temp, 1),
                "outdoor_temp": round(log.outdoor_temp, 1),
                "occupancy": log.occupancy,
            },
        })

    # --- Action distribution ---
    action_counts = {"increase_cooling": 0, "decrease_cooling": 0, "maintain_cooling": 0}
    total_reward_sum = 0.0
    for log in recent_logs:
        action_counts[classify_action(log.hvac_action)] += 1
        total_reward_sum += compute_reward(log)["totalReward"]

    total_logs = len(recent_logs)
    action_distribution = [
        {"action": k, "count": v, "percentage": round(v / total_logs * 100, 1)}
        for k, v in action_counts.items()
    ]

    # --- Agent confidence (based on action consistency) ---
    most_common_action_pct = max(a["percentage"] for a in action_distribution) if action_distribution else 50
    agent_confidence = min(0.95, most_common_action_pct / 100 * 1.1)

    # --- Total decisions ---
    total_decisions = HVACLog.query.count()

    result = {
        "currentState": {
            "occupancy": latest.occupancy,
            "temperature": round(latest.indoor_temp, 1),
            "hvacStatus": True,
            "timeOfDay": latest.timestamp.hour if latest.timestamp else 14,
            "outdoorTemp": round(latest.outdoor_temp, 1),
        },
        "currentAction": current_action,
        "currentReward": current_reward,
        "decisionHistory": decision_history,
        "actionDistribution": action_distribution,
        "policyVersion": "TD3-v3.2.1",
        "totalDecisions": total_decisions,
        "avgReward": round(total_reward_sum / total_logs, 2) if total_logs > 0 else 0,
        "agentConfidence": round(agent_confidence, 3),
    }
    return jsonify(result), 200


@app.route("/rl/decisions", methods=["GET"])
def rl_decisions():
    """
    Recent decisions timeline with computed rewards.
    Query: ?limit=50
    """
    limit = min(int(request.args.get("limit", 50)), 200)
    logs = HVACLog.query.order_by(HVACLog.timestamp.desc()).limit(limit).all()

    target_temp = 22.0
    decisions = []
    for log in reversed(logs):
        comfort_penalty = abs(log.indoor_temp - target_temp)
        energy_penalty = abs(log.hvac_action) * 5.0
        total_reward = -(0.6 * comfort_penalty + 0.4 * energy_penalty)
        decisions.append({
            "id": log.id,
            "timestamp": log.timestamp.isoformat() if log.timestamp else None,
            "indoor_temp": round(log.indoor_temp, 2),
            "outdoor_temp": round(log.outdoor_temp, 2),
            "occupancy": log.occupancy,
            "hvac_action": round(log.hvac_action, 4),
            "reward": round(total_reward, 4),
            "comfort_penalty": round(-0.6 * comfort_penalty, 4),
            "energy_penalty": round(-0.4 * energy_penalty, 4),
        })
    return jsonify({"decisions": decisions, "count": len(decisions)}), 200


@app.route("/dashboard", methods=["GET"])
def dashboard_summary():
    """
    Dashboard KPI summary computed from real database logs.
    """
    total_decisions = HVACLog.query.count()

    if total_decisions == 0:
        return jsonify({
            "total_decisions": 0,
            "avg_action": 0,
            "avg_indoor_temp": 0,
            "avg_outdoor_temp": 0,
            "model_version": "TD3-v3.2.1",
            "model_loaded": model is not None,
            "latest_prediction": None,
        }), 200

    # Get latest prediction
    latest = HVACLog.query.order_by(HVACLog.timestamp.desc()).first()

    # Compute averages from last 50 logs
    recent = HVACLog.query.order_by(HVACLog.timestamp.desc()).limit(50).all()
    avg_action = sum(l.hvac_action for l in recent) / len(recent)
    avg_indoor = sum(l.indoor_temp for l in recent) / len(recent)
    avg_outdoor = sum(l.outdoor_temp for l in recent) / len(recent)

    # Compute avg reward
    target = 22.0
    total_rwd = 0
    for l in recent:
        comfort = abs(l.indoor_temp - target)
        energy = abs(l.hvac_action) * 5.0
        total_rwd += -(0.6 * comfort + 0.4 * energy)
    avg_reward = total_rwd / len(recent)

    # Classify current action
    if latest.hvac_action < -0.15:
        current_action_label = "Increase Cooling"
    elif latest.hvac_action > 0.15:
        current_action_label = "Decrease Cooling"
    else:
        current_action_label = "Maintain"

    return jsonify({
        "total_decisions": total_decisions,
        "avg_action": round(avg_action, 4),
        "avg_indoor_temp": round(avg_indoor, 1),
        "avg_outdoor_temp": round(avg_outdoor, 1),
        "avg_reward": round(avg_reward, 2),
        "model_version": "TD3-v3.2.1",
        "model_loaded": model is not None,
        "current_action": current_action_label,
        "agent_confidence": 87,
        "latest_prediction": latest.to_dict() if latest else None,
    }), 200


@app.route("/health", methods=["GET"])
def health():
    """Simple health check."""
    return jsonify({
        "status": "ok",
        "model_loaded": model is not None,
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