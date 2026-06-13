import KPICard from '../components/dashboard/KPICard';
import EnergyOverviewChart from '../components/dashboard/EnergyOverviewChart';
import OccupancyMiniChart from '../components/dashboard/OccupancyMiniChart';
import SystemStatusPanel from '../components/dashboard/SystemStatusPanel';
import { mockKPIData, mockEnergyMetrics, mockOccupancyData } from '../data/mockData';
import { motion } from 'framer-motion';
import { Calendar, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            NeuroX HQ Tower · Real-time Overview
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-xs py-1.5 px-3">
            <Calendar size={14} />
            Today
          </button>
          <button className="btn-secondary text-xs py-1.5 px-3">
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockKPIData.map((kpi, i) => (
          <KPICard key={kpi.label} data={kpi} index={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <EnergyOverviewChart data={mockEnergyMetrics.timeline} />
        <OccupancyMiniChart data={mockOccupancyData.floorWise} />
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SystemStatusPanel />

        {/* RL Quick Insight */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="card p-5"
        >
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            RL Agent Summary
          </h3>
          <p className="text-xs mb-5" style={{ color: 'var(--color-text-tertiary)' }}>
            Latest decision cycle
          </p>

          <div className="space-y-4">
            {[
              { label: 'Current Action', value: 'Increase Cooling', badge: 'primary' },
              { label: 'Confidence', value: '87%', badge: 'success' },
              { label: 'Today\'s Decisions', value: '342', badge: 'primary' },
              { label: 'Avg Reward', value: '2.14 pts', badge: 'success' },
              { label: 'Policy Version', value: 'DQN v3.2.1', badge: 'primary' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.06 }}
                className="flex items-center justify-between py-2 px-3 rounded-xl"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-surface-1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {item.label}
                </span>
                <span
                  className={`badge badge-${item.badge}`}
                >
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
