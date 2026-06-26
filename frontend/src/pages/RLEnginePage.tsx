import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { useRLState } from '../hooks/useDataHooks';
import {
  Brain, Thermometer, Users, Clock, Sun, ChevronRight,
  TrendingUp, Gauge, ArrowUpCircle, ArrowDownCircle, MinusCircle, Zap, Heart,
  Loader2, AlertCircle, Wifi, Database
} from 'lucide-react';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

export default function RLEnginePage() {
  const { data: rl, isLoading, isError } = useRLState();

  // Handle loading states
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
        <p className="text-sm font-mono text-gray-400">Fetching live TD3 Engine state from backend...</p>
      </div>
    );
  }

  // Handle true offline states
  if (isError || !rl) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle size={32} style={{ color: 'var(--color-danger)' }} />
        <p className="text-sm font-mono text-gray-400">Backend offline. Please ensure Python app.py is running.</p>
      </div>
    );
  }

  // CRITICAL FIX: Handle the "Empty Database" response gracefully!
  if ((rl as any).error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
        <Database size={48} style={{ color: 'var(--color-warning)', opacity: 0.8 }} />
        <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Awaiting First Telemetry</h3>
        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
          The RL Engine is connected, but the database is currently empty.<br/>
          Turn on your Pico W hardware to start logging decisions!
        </p>
      </div>
    );
  }

  // Safe fallback values using Optional Chaining (?.) to prevent crashes
  const confidenceVal = (rl?.agentConfidence || 0) * 100;
  const rewardVal = rl?.currentReward?.totalReward || 0;
  
  const confidence = useAnimatedCounter(confidenceVal, 1500, 1);
  const totalReward = useAnimatedCounter(rewardVal, 1200, 2);

  const actionConfig: Record<string, { label: string; icon: typeof ArrowUpCircle; color: string }> = {
    increase_cooling: { label: 'Increase Cooling', icon: ArrowUpCircle, color: 'var(--color-primary)' },
    decrease_cooling: { label: 'Decrease Cooling', icon: ArrowDownCircle, color: 'var(--color-warning)' },
    maintain_cooling: { label: 'Maintain Cooling', icon: MinusCircle, color: 'var(--color-success)' },
  };

  const currentActionCfg = actionConfig[rl?.currentAction] || actionConfig.maintain_cooling;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            Real-time RL decision-making process visualization
          </p>
          {/* Data Source Indicator */}
          <div className="flex items-center gap-1.5">
            <Wifi size={12} style={{ color: 'var(--color-success)' }} />
            <span className="text-[10px] font-medium" style={{ color: 'var(--color-success)' }}>
              Live Data · {rl?.totalDecisions || 0} decisions
            </span>
          </div>
        </div>
      </motion.div>

      {/* State → Action → Reward Flow */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }} className="card p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Decision Flow
          </h3>
          <span className="badge badge-success text-[9px]">LIVE</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {/* STATE */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-xl p-4"
            style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-primary-light)' }}>
                <Brain size={14} style={{ color: 'var(--color-primary)' }} />
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Current State</span>
            </div>
            <div className="space-y-2">
              {[
                { icon: Users, label: 'Occupancy', value: `${(rl?.currentState?.occupancy || 0) === 1 ? 'Yes' : 'No'}` },
                { icon: Thermometer, label: 'Temperature', value: `${typeof rl?.currentState?.temperature === 'number' ? rl.currentState.temperature.toFixed(1) : (rl?.currentState?.temperature || '--')}°C` },
                { icon: Zap, label: 'HVAC', value: rl?.currentState?.hvacStatus ? 'Active' : 'Idle' },
                { icon: Clock, label: 'Time', value: `${rl?.currentState?.timeOfDay || '00'}:00` },
                { icon: Sun, label: 'Outdoor', value: `${rl?.currentState?.outdoorTemp || '--'}°C` },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-1.5">
                    <s.icon size={12} style={{ color: 'var(--color-text-tertiary)' }} />
                    <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{s.label}</span>
                  </div>
                  <span className="text-xs font-semibold font-mono" style={{ color: 'var(--color-text-primary)' }}>{s.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Arrow + ACTION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center justify-center"
          >
            <ChevronRight size={24} style={{ color: 'var(--color-text-tertiary)' }} className="hidden md:block" />
            <div
              className="rounded-xl p-4 w-full text-center mt-2"
              style={{ background: `${currentActionCfg.color}10`, border: `2px solid ${currentActionCfg.color}30` }}
            >
              <currentActionCfg.icon size={28} className="mx-auto mb-2" style={{ color: currentActionCfg.color }} />
              <p className="text-sm font-bold" style={{ color: currentActionCfg.color }}>
                {currentActionCfg.label}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
                Selected Action
              </p>
              <div className="mt-3 flex items-center justify-center gap-1">
                <Gauge size={12} style={{ color: 'var(--color-text-tertiary)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {confidence}% confident
                </span>
              </div>
            </div>
            <ChevronRight size={24} style={{ color: 'var(--color-text-tertiary)' }} className="hidden md:block mt-2" />
          </motion.div>

          {/* REWARD */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-xl p-4"
            style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-success-light)' }}>
                <Heart size={14} style={{ color: 'var(--color-success)' }} />
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Reward</span>
            </div>
            <div className="text-center py-3">
              <p className="text-3xl font-bold" style={{ color: (rl?.currentReward?.totalReward || 0) > 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {totalReward > 0 ? '+' : ''}{totalReward}
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Total Reward</p>
            </div>
            <div className="space-y-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Energy Penalty</span>
                <span className="text-xs font-mono font-semibold" style={{ color: 'var(--color-danger)' }}>
                  {rl?.currentReward?.energyPenalty?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Comfort Penalty</span>
                <span className="text-xs font-mono font-semibold" style={{ color: 'var(--color-warning)' }}>
                  {rl?.currentReward?.comfortPenalty?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Decision Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }} className="card p-5"
        >
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Reward Timeline
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
            Total reward per decision step (live DB logs)
          </p>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rl?.decisionHistory || []} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="timestamp" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} interval={3} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)', borderRadius: '0.85rem', fontSize: 12 }}
                  formatter={(value: any) => [Number(value).toFixed(2), 'Total Reward']}
                />
                <Line
                  type="monotone" dataKey="reward.totalReward" stroke="var(--color-success)"
                  strokeWidth={2} dot={false} activeDot={{ r: 4 }} name="Reward"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Action Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }} className="card p-5"
        >
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>
            Action Distribution
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
            How the agent distributes its decisions (from database)
          </p>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={(rl?.actionDistribution || []).map((d: any) => ({
                  ...d,
                  label: actionConfig[d.action]?.label || d.action,
                }))}
                margin={{ top: 5, right: 10, left: -15, bottom: 0 }}
                barCategoryGap="30%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)', borderRadius: '0.85rem', fontSize: 12 }}
                />
                <Bar dataKey="percentage" fill="var(--color-primary)" radius={[6, 6, 0, 0]} maxBarSize={60} name="Distribution %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Agent Info */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { label: 'Policy Version', value: rl?.policyVersion || 'TD3-v3', icon: Brain },
          { label: 'Total Decisions', value: (rl?.totalDecisions || 0).toLocaleString(), icon: TrendingUp },
          { label: 'Avg Reward', value: (rl?.avgReward || 0).toFixed(2), icon: Heart },
          { label: 'Agent Confidence', value: `${((rl?.agentConfidence || 0) * 100).toFixed(1)}%`, icon: Gauge },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.05 }}
            className="card p-4 text-center"
          >
            <item.icon size={18} className="mx-auto mb-2" style={{ color: 'var(--color-primary)' }} />
            <p className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{item.value}</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{item.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}