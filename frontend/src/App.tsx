import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';

import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RoomTwinPage from './pages/RoomTwinPage';
import RLEnginePage from './pages/RLEnginePage';
import HVACPage from './pages/HVACPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TrainingPage from './pages/TrainingPage';
import ArchitecturePage from './pages/ArchitecturePage';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from './pages/ReportsPage'; // <-- Imported the new Reports Page

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
            <Route path="/room" element={<RoomTwinPage />} />
            <Route path="/rl-engine" element={<RLEnginePage />} />
            <Route path="/hvac" element={<HVACPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/architecture" element={<ArchitecturePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/reports" element={<ReportsPage />} /> {/* <-- Registered the new Route */}
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}