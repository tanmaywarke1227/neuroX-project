import { motion } from 'framer-motion';
import { FileBarChart, Download, Zap, Users, Wind, Brain, Calendar, FileText, FileSpreadsheet, File } from 'lucide-react';

const reportSections = [
  {
    id: 'energy', title: 'Energy Savings Report', icon: Zap, color: 'var(--color-primary)',
    desc: 'Monthly energy consumption analysis, cost savings breakdown, and peak load reduction metrics.',
    metrics: [
      { label: 'Total Saved', value: '12,840 kWh' },
      { label: 'Cost Savings', value: '₹2,88,000' },
      { label: 'Peak Reduction', value: '23%' },
    ],
  },
  {
    id: 'occupancy', title: 'Occupancy Trends', icon: Users, color: 'var(--color-success)',
    desc: 'Weekly occupancy patterns, floor utilization rates, and behavioral insights for space optimization.',
    metrics: [
      { label: 'Avg Occupancy', value: '62%' },
      { label: 'Peak Hours', value: '9AM-11AM' },
      { label: 'Underutilized', value: '2 floors' },
    ],
  },
  {
    id: 'hvac', title: 'HVAC Performance', icon: Wind, color: 'var(--color-warning)',
    desc: 'Zone-level HVAC efficiency analysis, runtime distribution, and maintenance recommendations.',
    metrics: [
      { label: 'Avg Efficiency', value: '87%' },
      { label: 'Total Runtime', value: '14.5h/day' },
      { label: 'Zones Active', value: '6/8' },
    ],
  },
  {
    id: 'rl', title: 'RL Agent Performance', icon: Brain, color: 'var(--color-danger)',
    desc: 'Reinforcement learning agent decision analysis, reward progression, and policy evaluation.',
    metrics: [
      { label: 'Avg Reward', value: '2.14' },
      { label: 'Confidence', value: '87%' },
      { label: 'Decisions', value: '14,832' },
    ],
  },
];

const exportFormats = [
  { format: 'pdf' as const, label: 'PDF Report', icon: FileText, color: 'var(--color-danger)' },
  { format: 'csv' as const, label: 'CSV Data', icon: FileSpreadsheet, color: 'var(--color-success)' },
  { format: 'excel' as const, label: 'Excel Workbook', icon: File, color: 'var(--color-primary)' },
];

export default function ReportsPage() {
  const handleExport = (format: string) => {
    // Future: POST /api/reports/export?format={format}
    alert(`Export as ${format.toUpperCase()} — Backend integration ready`);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
          Generate and download comprehensive building intelligence reports
        </p>
      </motion.div>

      {/* Export Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Download size={16} style={{ color: 'var(--color-primary)' }} />
            <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Export Reports</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={13} style={{ color: 'var(--color-text-tertiary)' }} />
            <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Report Period: Last 30 days</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {exportFormats.map((fmt, i) => (
            <motion.button
              key={fmt.format}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              onClick={() => handleExport(fmt.format)}
              className="flex items-center gap-3 p-4 rounded-xl cursor-pointer border transition-all"
              style={{
                background: 'var(--color-surface-1)',
                borderColor: 'var(--color-border)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = fmt.color;
                e.currentTarget.style.background = `${fmt.color}08`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)';
                e.currentTarget.style.background = 'var(--color-surface-1)';
              }}
              whileTap={{ scale: 0.98 }}
            >
              <fmt.icon size={20} style={{ color: fmt.color }} />
              <div className="text-left">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{fmt.label}</p>
                <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>Download {fmt.format.toUpperCase()}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Report Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {reportSections.map((section, i) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="card p-5"
            style={{ borderLeft: `3px solid ${section.color}` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <section.icon size={16} style={{ color: section.color }} />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {section.title}
              </h3>
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              {section.desc}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {section.metrics.map((m) => (
                <div key={m.label} className="text-center p-2 rounded-lg" style={{ background: 'var(--color-surface-1)' }}>
                  <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>{m.value}</p>
                  <p className="text-[9px]" style={{ color: 'var(--color-text-tertiary)' }}>{m.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
