"""
NeuroX Backend — Flask API Server
==================================
Hosts the pre-trained TD3 HVAC agent and logs predictions to PostgreSQL.

Endpoints:
  POST /predict   → Receive sensor data, run inference, log + return action
  GET  /history   → Fetch the last 50 prediction logs
"""

import os
import numpy as np
from datetime import datetime, timezone

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from stable_baselines3 import TD3

# ============================================================
# App Configuration
# ============================================================
app = Flask(__name__)

# CORS — allow the Vite dev server (port 5173) and any localhost origin
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

# PostgreSQL connection
# Override with env var: DATABASE_URL=postgresql://user:pass@host:port/dbname
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/neurox"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

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
            "indoor_temp": self.indoor_temp,
            "outdoor_temp": self.outdoor_temp,
            "occupancy": self.occupancy,
            "hvac_action": self.hvac_action,
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
    Fetch the last 50 prediction logs, newest first.

    Returns JSON:
      { "logs": [ { id, timestamp, indoor_temp, outdoor_temp, occupancy, hvac_action }, ... ] }
    """
    logs = (
        HVACLog.query
        .order_by(HVACLog.timestamp.desc())
        .limit(50)
        .all()
    )
    return jsonify({"logs": [log.to_dict() for log in logs]}), 200


@app.route("/health", methods=["GET"])
def health():
    """Simple health check."""
    return jsonify({
        "status": "ok",
        "model_loaded": model is not None,
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
