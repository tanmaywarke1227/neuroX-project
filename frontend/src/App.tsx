import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';

import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BuildingTwinPage from './pages/BuildingTwinPage';
import OccupancyPage from './pages/OccupancyPage';
import RLEnginePage from './pages/RLEnginePage';
import HVACPage from './pages/HVACPage';
import EnergyPage from './pages/EnergyPage';
import TrainingPage from './pages/TrainingPage';
import SimulationPage from './pages/SimulationPage';
import ArchitecturePage from './pages/ArchitecturePage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
      retry: 1,
    },
  },
});

function ThemeInitializer() {
  const { isDark } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return null;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeInitializer />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/building" element={<BuildingTwinPage />} />
            <Route path="/occupancy" element={<OccupancyPage />} />
            <Route path="/rl-engine" element={<RLEnginePage />} />
            <Route path="/hvac" element={<HVACPage />} />
            <Route path="/energy" element={<EnergyPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/simulation" element={<SimulationPage />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
