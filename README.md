<div align="center">

# 🧠 NeuroX

### **AI-Powered Smart Room HVAC Optimization System**

*Reinforcement Learning meets Edge Computing — Real hardware, real savings.*

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Flask](https://img.shields.io/badge/Flask-3.x-000000?logo=flask)](https://flask.palletsprojects.com)
[![Stable-Baselines3](https://img.shields.io/badge/SB3-TD3-orange)](https://stable-baselines3.readthedocs.io)
[![MicroPython](https://img.shields.io/badge/MicroPython-Pico_W-2B2728?logo=micropython)](https://micropython.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql&logoColor=white)](https://neon.tech)

</div>

---

## 📋 Overview

**NeuroX** is a full-stack smart room HVAC optimization platform that uses a **Twin Delayed DDPG (TD3)** reinforcement learning agent to autonomously control air conditioning and lighting in a single bedroom. The system reads live sensor data from physical hardware (Raspberry Pi Pico W), makes intelligent cooling/lighting decisions via a trained RL model, and presents everything through a premium React dashboard.

### Key Highlights

- 🤖 **TD3 RL Agent** — Trained on 50,000+ simulated weather/occupancy data points
- 📡 **Live Hardware** — Pico W reads BMP280 (temp), PIR (motion), SCT-013 (power), SG90 (vent servo)
- ⚡ **Hybrid Control** — AI Autonomous mode + Manual Override via the dashboard
- 📊 **10-Page Dashboard** — Real-time charts, Room Twin, RL Engine visualization, Analytics
- 🗄️ **PostgreSQL Logging** — Every RL decision logged with timestamps for analysis
- 🏠 **Single Room Focus** — Bedroom 1 demo environment (not enterprise/multi-floor)

---

## 🏗️ Architecture

```
neurox/                                   ← Monorepo Root
│
├── 📂 frontend/                          ← React + Vite + TypeScript (UI Layer)
│   ├── public/                           ← Static assets
│   ├── src/
│   │   ├── api/
│   │   │   └── hvacService.js            ← API utility functions for backend calls
│   │   ├── components/
│   │   │   └── navigation/
│   │   │       ├── Sidebar.tsx           ← Collapsible sidebar with nav links
│   │   │       └── Topbar.tsx            ← Search bar, notifications, profile
│   │   ├── hooks/
│   │   │   ├── useAnimatedCounter.ts     ← Smooth number animation hook
│   │   │   ├── useDataHooks.ts           ← React Query hooks (legacy endpoints)
│   │   │   └── useLiveHardware.ts        ← ⭐ Core hook: polls /api/live_dashboard
│   │   ├── layouts/
│   │   │   └── DashboardLayout.tsx       ← Main shell: Sidebar + Topbar + Outlet
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx         ← Live KPIs, Temp/Pressure/Occupancy charts
│   │   │   ├── RoomTwinPage.tsx          ← Top-view bedroom layout with sensor markers
│   │   │   ├── RLEnginePage.tsx          ← RL state/action/reward visualization
│   │   │   ├── HVACPage.tsx              ← ⭐ AI vs Manual toggle, relay controls
│   │   │   ├── AnalyticsPage.tsx         ← Statistical analysis, histograms, scatter
│   │   │   ├── TrainingPage.tsx          ← Training monitor (episodes, loss curves)
│   │   │   ├── ArchitecturePage.tsx      ← System architecture diagram
│   │   │   ├── ReportsPage.tsx           ← Session reports and export
│   │   │   ├── SettingsPage.tsx          ← Pico IP, target temp, polling config
│   │   │   └── LoginPage.tsx             ← Authentication page
│   │   ├── services/
│   │   │   └── api.ts                    ← Typed API service layer (fetch wrappers)
│   │   ├── store/
│   │   │   ├── simulationStore.ts        ← Zustand store for simulation state
│   │   │   └── themeStore.ts             ← Dark/light theme toggle
│   │   ├── types/
│   │   │   └── index.ts                  ← TypeScript interfaces and types
│   │   ├── App.tsx                       ← Router setup (React Router v6)
│   │   ├── main.tsx                      ← Vite entry point
│   │   └── index.css                     ← Global design system (CSS variables)
│   ├── index.html                        ← HTML shell with meta tags
│   ├── package.json                      ← Dependencies (React, Recharts, Framer, etc.)
│   ├── vite.config.ts                    ← Vite bundler config
│   ├── tsconfig.json                     ← TypeScript config
│   └── eslint.config.js                  ← Linting rules
│
├── 📂 backend/                           ← Flask API Server (Brain Layer)
│   ├── app.py                            ← ⭐ Core: endpoints, TD3 inference, Pico polling
│   ├── models/
│   │   └── td3_hvac_agent.zip            ← Pre-trained TD3 model (Stable-Baselines3)
│   ├── requirements.txt                  ← Python deps (Flask, SB3, SQLAlchemy, etc.)
│   └── .env                              ← DATABASE_URL for PostgreSQL (not committed)
│
├── 📂 ai_agent/                          ← RL Training Pipeline
│   ├── generate_csv.py                   ← Synthetic weather/occupancy dataset generator
│   ├── hvac_env.py                       ← Custom Gymnasium environment for HVAC
│   ├── train.py                          ← TD3 training script (SB3)
│   ├── hvac_weather_data.csv             ← 50,000-row training dataset
│   ├── td3_hvac_agent.zip               ← Trained model output (copied to backend/)
│   └── requirements.txt                  ← Training-specific deps
│
├── 📂 hardware/                          ← Raspberry Pi Pico W (Edge Layer)
│   ├── main.py                           ← ⭐ MicroPython firmware (flash via Thonny)
│   └── bmp280.py                         ← BMP280 I2C driver library
│
├── .gitignore
└── README.md                             ← You are here
```

---

## 🔁 System Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      BEDROOM 1 (Physical)                       │
│                                                                 │
│   [BMP280 #1] ──┐                                              │
│   [BMP280 #2] ──┤                                              │
│   [PIR Sensor]──┤──► [Raspberry Pi Pico W] ◄──[USB 5V/2A]     │
│   [SCT-013]  ──┘      │      │           │                     │
│                     [SG90]  [Level Shifter]│                    │
│                     (Vent)      │     WiFi │ REST API           │
│                            [2-CH Relay]   │ (port 80)          │
│                                 │         │                     │
│                            [AC Unit]      │                     │
│                         [Room Light]      │                     │
└───────────────────────────────────────────│─────────────────────┘
                                            │
                                       Local WiFi
                                            │
┌───────────────────────────────────────────▼─────────────────────┐
│                    LAPTOP / SERVER                               │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Flask Backend (app.py:5000)                │   │
│   │                                                         │   │
│   │   GET http://192.168.1.50/api/state                     │   │
│   │   → Reads sensors every 2 seconds                       │   │
│   │                                                         │   │
│   │   Normalizes → Feeds to TD3 Model → Gets action [-1,1]  │   │
│   │                                                         │   │
│   │   GET http://192.168.1.50/api/control?cool=1&angle=90   │   │
│   │   → Sends relay + servo commands back to Pico           │   │
│   │                                                         │   │
│   │   Logs every decision to PostgreSQL (Neon)              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                           │                                     │
│                      Port 5000                                  │
│                           │                                     │
│   ┌───────────────────────▼─────────────────────────────────┐   │
│   │          React Frontend (Vite, port 5173)               │   │
│   │                                                         │   │
│   │   Dashboard   ← Live KPIs, temp/pressure/occupancy     │   │
│   │   Room Twin   ← Bedroom layout with sensor markers     │   │
│   │   RL Engine   ← State/action/reward flow               │   │
│   │   HVAC Control← AI/Manual toggle, relay buttons        │   │
│   │   Analytics   ← Histograms, scatter plots, gauges      │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Hardware Components

| # | Component | Qty | Pin / Bus | Purpose |
|---|---|---|---|---|
| 1 | Raspberry Pi Pico W | 1 | — | WiFi microcontroller (brain) |
| 2 | BMP280 Sensor | 2 | I2C0 (GP4/5), I2C1 (GP2/3) | Indoor + outdoor temperature & pressure |
| 3 | PIR Motion Sensor (HC-SR501) | 1 | GP16 | Occupancy detection |
| 4 | SCT-013 Current Clamp | 1 | GP26 (ADC0) | AC power consumption monitoring |
| 5 | TowerPro SG90 Servo | 1 | GP13 (PWM) | AC vent/damper position control |
| 6 | 2-Channel 5V Relay Module | 1 | GP14, GP15 (via Level Shifter) | AC unit + room light switching |
| 7 | Logic Level Shifter | 1 | — | 3.3V → 5V for relay signals |
| 8 | 10kΩ Resistors, 22Ω, 10µF Cap | — | — | DC bias circuit for SCT-013 |

> **Relay Logic:** Active LOW (pin=0 → relay ON, pin=1 → relay OFF). Handled by software abstraction layer.

> **Static IP:** Pico W is configured with `192.168.1.50` so the Flask backend always knows where to find it.

---

## 🚀 Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL (or [Neon](https://neon.tech) free tier)
- Raspberry Pi Pico W with MicroPython firmware
- [Thonny IDE](https://thonny.org) for flashing Pico

### 1. Clone the Repo

```bash
git clone https://github.com/YOUR_USERNAME/neurox.git
cd neurox
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt
```

Create a `.env` file:
```env
DATABASE_URL=postgresql://user:pass@host:5432/neurox
```

Run the server:
```bash
python app.py
# Flask starts on http://localhost:5000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# Vite starts on http://localhost:5173
```

### 4. Flash Pico W (Hardware)

1. Open **Thonny** → Select interpreter: **MicroPython (Raspberry Pi Pico)**
2. Upload `hardware/bmp280.py` to the Pico
3. Upload `hardware/main.py` to the Pico (rename `pico_main.py` → `main.py`)
4. Edit WiFi credentials and static IP in the config section
5. Press **Run** — the Pico will print its IP address in the terminal

### 5. Train the RL Agent (Optional)

The repo includes a pre-trained model. To retrain:

```bash
cd ai_agent
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

python generate_csv.py    # Generate 50,000-row dataset
python train.py           # Train TD3 agent (~10 min)
# Output: td3_hvac_agent.zip → copy to backend/models/
```

---

## 📡 API Reference

### Flask Backend (port 5000)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/live_dashboard` | Main polling endpoint — reads Pico, runs AI, returns full state |
| `POST` | `/api/control?cool=1&heat=0` | Manual relay override (switches to MANUAL mode) |
| `POST` | `/api/mode` | Set system mode: `{"mode": "AI"}` or `{"mode": "MANUAL"}` |
| `POST` | `/predict` | Manual TD3 prediction: `{"indoor_temp", "outdoor_temp", "occupancy"}` |
| `GET` | `/history` | Fetch all logged predictions from PostgreSQL |
| `GET` | `/dashboard` | Legacy dashboard KPIs |
| `GET` | `/rl/state` | Current RL state, action, reward breakdown |
| `GET` | `/health` | Backend + model health check |
| `GET` | `/dataset/summary` | Training dataset statistics |
| `GET` | `/dataset/sample` | Sample rows from training CSV |

### Pico W REST API (port 80)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/state` | Returns all sensor readings + relay/servo state as JSON |
| `GET` | `/api/control?cool=1&heat=0&angle=90` | Set relay states and servo angle |
| `GET` | `/api/info` | Device info, firmware version, sensor health |

---

## 🧠 RL Agent Details

| Parameter | Value |
|---|---|
| **Algorithm** | TD3 (Twin Delayed DDPG) |
| **Library** | Stable-Baselines3 |
| **Observation Space** | `[indoor_temp, outdoor_temp, occupancy]` (normalized) |
| **Action Space** | Continuous `[-1, +1]` → mapped to cooling intensity |
| **Reward Function** | `R = -α|T_indoor - T_target| - β·P_energy + γ·comfort_bonus` |
| **Training Episodes** | 100,000 timesteps |
| **Target Temperature** | 24°C |
| **Decision Logic** | `action < -0.15 → cool=1` (AC ON), `else → cool=0` (AC OFF) |

### Hybrid Control Rules

1. **CH1 (AC Cooling):** If temp > 25°C → forced ON. Otherwise → TD3 decides.
2. **CH2 (Lighting):** Strictly follows PIR occupancy (with 5-min presence hold filter).
3. **Manual Override:** Dashboard toggle bypasses all AI — direct relay control.

---

## 🖥️ Frontend Pages

| Page | Description |
|---|---|
| **Dashboard** | Live KPI cards, temperature chart (both BMP280s), pressure chart, occupancy, power draw, RL penalty tracking, energy savings projection |
| **Room Twin** | Top-view bedroom blueprint with sensor placement markers, live temperature overlays, AC/door/window indicators |
| **RL Engine** | Real-time state → action → reward flow visualization, decision history timeline, model confidence |
| **HVAC Control** | AI/Manual mode toggle, individual relay ON/OFF buttons for CH1 (cooling) and CH2 (lighting), servo angle display |
| **Analytics** | Performance gauges, temperature distribution histogram, temp-vs-power scatter, HVAC duty cycle timeline, RL reward decomposition, cumulative energy, weekly savings projection |
| **Training Monitor** | Episode reward curves, loss tracking, hyperparameter display |
| **Architecture** | Interactive system architecture diagram |
| **Reports** | Session summaries with export capability |
| **Settings** | Pico IP config, target temperature, polling interval |

---

## 🔌 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Recharts, Framer Motion, Zustand, Lucide Icons |
| **Backend** | Flask 3.x, Flask-CORS, Flask-SQLAlchemy, Stable-Baselines3, NumPy, Pandas |
| **Database** | PostgreSQL (Neon serverless) |
| **RL Training** | Gymnasium, Stable-Baselines3 (TD3), custom HVAC environment |
| **Hardware** | Raspberry Pi Pico W, MicroPython, BMP280, PIR, SCT-013, SG90, 2-CH Relay |
| **Communication** | REST API over WiFi (Pico ↔ Flask), HTTP polling (Flask ↔ React) |

---

## 📁 Environment Variables

| Variable | Location | Description |
|---|---|---|
| `DATABASE_URL` | `backend/.env` | PostgreSQL connection string |
| `PICO_URL` | `backend/app.py` | Static IP of Pico W (default: `http://192.168.1.50`) |
| `WIFI_SSID` | `hardware/main.py` | Your WiFi network name |
| `WIFI_PASSWORD` | `hardware/main.py` | Your WiFi password |
| `STATIC_IP` | `hardware/main.py` | Fixed IP for Pico (default: `192.168.1.50`) |

---

## 🛡️ Safety Notes

- ⚡ **220V AC Warning:** The relay module switches mains-voltage appliances. All 220V wiring should be inside a junction box. If unsure, consult a qualified electrician.
- 🔌 **Power Supply:** Use a **5V/2A USB adapter** (not a laptop USB port) — the SG90 servo can draw up to 700mA when stalling.
- 🌡️ **BMP280 Limitation:** BMP280 measures temperature + pressure only. For humidity, upgrade to BME280.

---

## 📄 License

This project is developed as a personal/academic project. All rights reserved.

---

<div align="center">

**Built with 🧠 by Tanmay**

*NeuroX — Where Reinforcement Learning meets the real world.*

</div>
