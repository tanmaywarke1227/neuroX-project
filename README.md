# NeuroX — Smart Building Energy Intelligence Platform

<div align="center">

![NeuroX](https://img.shields.io/badge/NeuroX-Smart%20Building%20Intelligence-1e9df1?style=for-the-badge&logo=hexo&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3-000000?style=flat-square&logo=flask&logoColor=white)
![Stable Baselines3](https://img.shields.io/badge/SB3-RL%20Agent-FF6F00?style=flat-square&logo=pytorch&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**An enterprise-grade platform for Reinforcement Learning powered Smart Building Energy Optimization.**

Built to rival platforms like Johnson Controls, Siemens Building X, Honeywell Forge, and Schneider EcoStruxure.

</div>

---

## Repository Structure

```
neurox/
├── frontend/       → React + TypeScript dashboard (fully built)
├── backend/        → Flask API server (planned)
└── rl-agent/       → Stable-Baselines3 RL agent (planned)
```

| Folder | Status | Description |
|--------|--------|-------------|
| [`frontend/`](./frontend) | ✅ Complete | 12-page enterprise dashboard with interactive Building Twin, RL visualization, and energy analytics |
| [`backend/`](./backend) | 🚧 Planned | Flask REST API for building data, HVAC control, and model inference |
| [`rl-agent/`](./rl-agent) | 🚧 Planned | DQN agent using Stable-Baselines3 for HVAC optimization |

---

## Overview

NeuroX is a premium SaaS-style platform for managing smart building operations through **Reinforcement Learning (RL)**-driven HVAC optimization. It provides real-time monitoring of building occupancy, temperature, energy consumption, and HVAC performance — all controlled by an intelligent RL agent that learns to minimize energy usage while maintaining occupant comfort.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    frontend/                            │
│  React + TypeScript + TailwindCSS + Recharts            │
│  12 pages · Building Twin · RL Visualization            │
└──────────────────────┬──────────────────────────────────┘
                       │ REST API calls
┌──────────────────────▼──────────────────────────────────┐
│                    backend/                             │
│  Flask · SQLAlchemy · PostgreSQL · Redis                │
│  /api/building · /api/hvac · /api/energy · /api/rewards │
└──────────────────────┬──────────────────────────────────┘
                       │ Model inference + training data
┌──────────────────────▼──────────────────────────────────┐
│                    rl-agent/                            │
│  Stable-Baselines3 · Gymnasium · PyTorch               │
│  DQN Agent · Building Environment · Reward Engine       │
└─────────────────────────────────────────────────────────┘
```

## Frontend Features

### 12 Fully Functional Pages

| Page | Description |
|------|-------------|
| **Login** | Enterprise authentication with animated building silhouette |
| **Executive Command Center** | Real-time KPI dashboard with 8 animated metric cards |
| **Digital Building Twin** | Interactive SVG building with floor-level heatmaps |
| **Occupancy Intelligence** | Heatmaps, timelines, floor charts, and behavioral analysis |
| **RL Control Engine** | State → Action → Reward flow visualization |
| **HVAC Operations** | Zone-level monitoring with cooling slider and override controls |
| **Energy Analytics** | Consumption analysis, savings comparison, and forecasts |
| **RL Training Monitor** | Episode metrics, reward/loss charts, convergence indicator |
| **Simulation Center** | Scenario builder with real-time preview |
| **System Architecture** | Animated 4-layer architecture diagram |
| **Reports & Insights** | Export-ready reports (PDF/CSV/Excel) |
| **Settings** | Theme, notifications, API config, and profile |

### Key Highlights

- 🎨 **Twitter/X-inspired clean enterprise aesthetic** — no neon, no clutter
- 🌗 **Full Light & Dark mode** with localStorage persistence
- 📊 **Interactive charts** powered by Recharts with custom tooltips
- 🏢 **SVG Building Twin** with click/hover interactions and 3 heatmap modes
- 🤖 **RL Decision Visualization** — makes reinforcement learning understandable to non-technical users
- ⚡ **Animated counters** and Framer Motion micro-interactions throughout
- 🔌 **Mock API layer** structured for seamless Flask backend integration

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite](https://vite.dev/) | Build tool & dev server |
| [TailwindCSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Recharts](https://recharts.org/) | Data visualization |
| [Zustand](https://github.com/pmndrs/zustand) | State management |
| [TanStack React Query](https://tanstack.com/query) | Data fetching |
| [Lucide Icons](https://lucide.dev/) | Icon system |

### Backend (Planned)
| Technology | Purpose |
|---|---|
| Flask | REST API |
| SQLAlchemy | ORM |
| PostgreSQL | Database |
| Redis | Caching |

### RL Agent (Planned)
| Technology | Purpose |
|---|---|
| Stable-Baselines3 | RL algorithms |
| Gymnasium | Environment interface |
| PyTorch | Neural networks |

## Getting Started

### Frontend (Ready)

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173/**

### Backend (Coming Soon)

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### RL Agent (Coming Soon)

```bash
cd rl-agent
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python train.py
```

## Design System

| Token | Value | Usage |
|---|---|---|
| Primary | `#1e9df1` | Actions, links, active states |
| Success | `#00b87a` | Positive metrics, operational |
| Warning | `#f7b928` | Caution, medium priority |
| Danger | `#e0245e` | Alerts, critical states |

- **Fonts**: Inter · Open Sans · IBM Plex Mono
- **Dark mode**: Pure black with Twitter/X-inspired card surfaces
- **Border radius**: 1.3rem

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/building` | Building state, floor data |
| GET | `/api/occupancy` | Occupancy patterns |
| GET | `/api/hvac` | HVAC zone status |
| POST | `/api/hvac/override` | Manual HVAC override |
| GET | `/api/energy` | Energy metrics |
| GET | `/api/rewards` | RL decision log |
| GET | `/api/training` | Training progress |
| POST | `/api/simulation/start` | Start simulation |
| GET | `/api/reports/export` | Export reports |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ by [Tanmay Warke](https://github.com/tanmaywarke1227)**

</div>
