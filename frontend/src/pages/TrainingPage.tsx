import { motion } from 'framer-motion';
import {
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { mockTrainingMetrics } from '../data/mockData';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';
import { GraduationCap, TrendingUp, Target, Zap, Activity, CheckCircle2 } from 'lucide-react';

export default function TrainingPage() {
  const data = mockTrainingMetrics;
  const episodes = useAnimatedCounter(data.currentEpisode, 1500, 0);
  const convergence = useAnimatedCounter(data.convergenceScore, 1200, 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
          Stable-Baselines3 model training progress and convergence
        </p>
      </motion.div>

      {/* Training KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Episodes', value: episodes.toLocaleString(), icon: GraduationCap, color: 'var(--color-primary)' },
          { label: 'Best Reward', value: data.bestReward.toFixed(2), icon: TrendingUp, color: 'var(--color-success)' },
          { label: 'Avg Reward', value: data.avgReward.toFixed(2), icon: Target, color: 'var(--color-primary)' },
          { label: 'Exploration', value: `${(data.explorationRate * 100).toFixed(1)}%`, icon: Zap, color: 'var(--color-warning)' },
          { label: 'Learning Rate', value: data.learningRate.toExponential(1), icon: Activity, color: 'var(--color-text-secondary)' },
          { label: 'Convergence', value: `${convergence}%`, icon: CheckCircle2, color: data.convergenceScore > 80 ? 'var(--color-success)' : 'var(--color-warning)' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="card p-4 text-center"
          >
            <item.icon size={16} className="mx-auto mb-1.5" style={{ color: item.color }} />
            <p className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{item.value}</p>
            <p className="text-[10px]" style={{ color: 'var(--color-text-tertiary)' }}>{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Model Info */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="badge badge-primary">{data.modelVersion}</span>
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {data.isTraining ? '🔄 Training in progress...' : '✓ Training complete'}
          </span>
          <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
            {data.currentEpisode.toLocaleString()} / {data.totalEpisodes.toLocaleString()} episodes
          </span>
          {/* Progress bar */}
          <div className="flex-1 min-w-32">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(data.currentEpisode / data.totalEpisodes) * 100}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}
                style={{ background: 'var(--color-success)' }}
              />
            </div>
          </div>
          <span className="text-xs font-semibold" style={{ color: 'var(--color-success)' }}>
            {((data.currentEpisode / data.totalEpisodes) * 100).toFixed(1)}%
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Reward Progression */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card p-5">
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Reward Progression</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Episode reward over training</p>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.rewardProgression} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="rwdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="episode" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)', borderRadius: '0.85rem', fontSize: 12 }} formatter={(v: number) => v.toFixed(2)} />
                <Area type="monotone" dataKey="reward" stroke="var(--color-success)" strokeWidth={2} fill="url(#rwdGrad)" dot={false} name="Reward" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Training Loss */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card p-5">
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Training Loss</h3>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>Loss convergence over episodes</p>
          <div style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.lossProgression} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="episode" tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--color-text-tertiary)' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)', borderRadius: '0.85rem', fontSize: 12 }} formatter={(v: number) => v.toFixed(4)} />
                <Line type="monotone" dataKey="loss" stroke="var(--color-danger)" strokeWidth={2} dot={false} name="Loss" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Convergence Indicator */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card p-5">
        <h3 className="text-base font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Convergence Analysis</h3>
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-surface-2)" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke={data.convergenceScore > 80 ? 'var(--color-success)' : 'var(--color-warning)'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - data.convergenceScore / 100) }}
                transition={{ duration: 1.5, delay: 0.6 }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{convergence}%</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              The model has reached <strong>{data.convergenceScore}%</strong> convergence. 
              Reward variance has decreased significantly over the last 10,000 episodes, 
              and the exploration rate has settled at {(data.explorationRate * 100).toFixed(1)}%.
            </p>
            <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
              Ready for production deployment with Stable-Baselines3.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
