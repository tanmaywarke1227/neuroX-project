# NeuroX — Smart Building Energy Intelligence Platform

<div align="center">

![NeuroX](https://img.shields.io/badge/NeuroX-Smart%20Building%20Intelligence-1e9df1?style=for-the-badge&logo=hexo&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**An enterprise-grade frontend prototype for a Reinforcement Learning powered Smart Building Energy Optimization System.**

Built to rival platforms like Johnson Controls, Siemens Building X, Honeywell Forge, and Schneider EcoStruxure.

[Live Demo](#getting-started) · [Features](#features) · [Architecture](#system-architecture) · [Contributing](#contributing)

</div>

---

## Overview

NeuroX is a premium SaaS-style dashboard for managing smart building operations through **Reinforcement Learning (RL)**-driven HVAC optimization. It provides real-time monitoring of building occupancy, temperature, energy consumption, and HVAC performance — all controlled by an intelligent RL agent that learns to minimize energy usage while maintaining occupant comfort.

The frontend is fully prepared for backend integration with **Flask APIs**, **Stable-Baselines3** RL models, occupancy simulators, and HVAC controllers.

## Features

### 12 Fully Functional Pages

| Page | Description |
|---|---|
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
- 📱 **Responsive design** — works on desktop and tablet

## Tech Stack

| Technology | Purpose |
|---|---|
| [React 18](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Vite](https://vite.dev/) | Build tool & dev server |
| [TailwindCSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [Recharts](https://recharts.org/) | Data visualization |
| [Zustand](https://github.com/pmndrs/zustand) | State management |
| [TanStack React Query](https://tanstack.com/query) | Data fetching & caching |
| [React Router v6](https://reactrouter.com/) | Client-side routing |
| [Lucide Icons](https://lucide.dev/) | Icon system |

## Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/tanmaywarke1227/neurox-smart-building-frontend.git
cd neurox-smart-building-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173/**

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── building/          # Digital Building Twin (SVG, FloorDetail)
│   ├── dashboard/         # KPI cards, charts, system status
│   └── navigation/        # Sidebar, Topbar
├── data/
│   └── mockData.ts        # Mock data for all dashboard views
├── hooks/
│   ├── useAnimatedCounter.ts  # Smooth number animation
│   └── useDataHooks.ts        # React Query hooks
├── layouts/
│   └── DashboardLayout.tsx    # Main layout (sidebar + topbar + content)
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── BuildingTwinPage.tsx
│   ├── OccupancyPage.tsx
│   ├── RLEnginePage.tsx
│   ├── HVACPage.tsx
│   ├── EnergyPage.tsx
│   ├── TrainingPage.tsx
│   ├── SimulationPage.tsx
│   ├── ArchitecturePage.tsx
│   ├── ReportsPage.tsx
│   └── SettingsPage.tsx
├── services/
│   └── api.ts             # API service layer (mock → Flask ready)
├── store/
│   ├── themeStore.ts       # Light/dark mode
│   └── simulationStore.ts  # Simulation parameters
├── types/
│   └── index.ts            # TypeScript interfaces
├── index.css               # Design system & global styles
├── App.tsx                 # Router & providers
└── main.tsx                # Entry point
```

## Design System

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--color-primary` | `#1e9df1` | Primary actions, links, active states |
| `--color-success` | `#00b87a` | Positive metrics, operational status |
| `--color-warning` | `#f7b928` | Caution states, medium priority |
| `--color-danger` | `#e0245e` | Alerts, critical states, errors |

### Typography

- **Inter** — Primary UI font
- **Open Sans** — Body text
- **IBM Plex Mono** — Data values, code

### Dark Mode

Pure black (`#000000`) background with card surfaces at `#0a0a0a` and `#111111`, inspired by Twitter/X's dark theme.

## System Architecture

```
┌─────────────────────────────────────┐
│   Layer 4: Dashboard Visualization  │  ← React + TypeScript (this repo)
│   Real-time Metrics, Building Twin  │
└──────────────────┬──────────────────┘
                   │ Decisions + Metrics
┌──────────────────▼──────────────────┐
│   Layer 3: RL Control Engine        │  ← Stable-Baselines3 (future)
│   DQN Agent, Reward Calculator      │
└──────────────────┬──────────────────┘
                   │ State Vector
┌──────────────────▼──────────────────┐
│   Layer 2: Occupancy Analysis       │  ← Python analytics (future)
│   Pattern Detection, Peak Predict   │
└──────────────────┬──────────────────┘
                   │ Sensor Data
┌──────────────────▼──────────────────┐
│   Layer 1: Building Simulation      │  ← Gymnasium environment (future)
│   Temperature, HVAC, Occupancy      │
└─────────────────────────────────────┘
```

## Backend Integration

The frontend is designed for seamless integration with a Flask backend. All data flows through a centralized API service layer (`src/services/api.ts`).

### API Endpoints (Ready for Connection)

| Endpoint | Method | Description |
|---|---|---|
| `/api/building` | GET | Building state, floor data, zone details |
| `/api/occupancy` | GET | Occupancy patterns, heatmap data |
| `/api/hvac` | GET | HVAC zone status, cooling levels |
| `/api/energy` | GET | Energy consumption, savings metrics |
| `/api/rewards` | GET | RL reward history, decision log |
| `/api/training` | GET | Training progress, episode metrics |
| `/api/hvac/override` | POST | Manual HVAC override |
| `/api/simulation/start` | POST | Start building simulation |
| `/api/reports/export` | GET | Export reports (PDF/CSV/Excel) |

### How to Connect

1. Set the `VITE_API_URL` environment variable to your Flask server URL
2. In `src/services/api.ts`, replace mock data returns with `fetch()` calls
3. React Query handles caching, refetching, and loading states automatically

```env
VITE_API_URL=http://localhost:5000
```

## Screenshots

> Run the project locally to explore all 12 pages with full interactivity, animations, and light/dark mode support.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Design inspired by [Johnson Controls](https://www.johnsoncontrols.com/), [Siemens Building X](https://www.siemens.com/), and [Schneider EcoStruxure](https://www.se.com/)
- RL concepts based on [Stable-Baselines3](https://stable-baselines3.readthedocs.io/)
- Icons by [Lucide](https://lucide.dev/)

---

<div align="center">

**Built with ❤️ by [Tanmay Warke](https://github.com/tanmaywarke1227)**

</div>
