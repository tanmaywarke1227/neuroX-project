import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveHardware } from '../hooks/useLiveHardware';
import {
  Wind, Snowflake, Flame, Power, Brain, Activity, Clock, Zap, Target
} from 'lucide-react';

export default function HVACPage() {
  const { data, isOffline, sendCommand } = useLiveHardware();
  const [isAiMode, setIsAiMode] = useState<boolean>(true); // AI controls it by default

  // Fallback safe data
  const safeData = data || {
    temperature: 0, pressure: 0, occupancy: 0, power_draw_w: 0, relay_cool: 0, relay_heat: 0, rl_action: 'Waiting...', confidence: 0
  };

  // The function to handle the manual click on the Cooling Relay button
  const handleCoolingToggle = () => {
    if (isAiMode) return; // Prevent manual clicks if AI is in charge
    const newValue = safeData.relay_cool === 1 ? 0 : 1; 
    sendCommand('control?cool=' + newValue); // Sends the command to the Flask API
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>
            HVAC Control · Physical Relay Command Center
          </p>
          <div className="flex items-center gap-1.5">
            {!isOffline ? (
              <><Activity size={10} style={{ color: 'var(--color-success)' }} /><span className="text-[10px] font-medium" style={{ color: 'var(--color-success)' }}>Backend Connected</span></>
            ) : (
              <><Activity size={10} style={{ color: 'var(--color-danger)' }} /><span className="text-[10px] font-medium" style={{ color: 'var(--color-danger)' }}>Backend Offline</span></>
            )}
          </div>
        </div>
      </motion.div>

      {/* MASTER TOGGLE SWITCH: AI vs Manual Override */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 }} className="card p-6" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)' }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>System Operation Mode</h3>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Toggle between TD3 autonomous control and direct manual override.</p>
          </div>
          <button 
            onClick={() => {
              const newMode = !isAiMode;
              setIsAiMode(newMode); 
              sendCommand('mode', { mode: newMode ? 'AI' : 'MANUAL' });
            }}
            className="px-6 py-3 rounded-full font-bold text-white transition-all shadow-md flex items-center gap-2" style={{
              background: isAiMode ? 'var(--color-primary)' : 'var(--color-warning)',
              boxShadow: isAiMode ? '0 0 15px rgba(59,130,246,0.3)' : '0 0 15px rgba(245,158,11,0.3)'
            }}
          >
            {isAiMode ? <Brain size={18} /> : <Power size={18} />}
            {isAiMode ? 'AI Autonomous Mode' : 'Manual Override Active'}
          </button>
        </div>
      </motion.div>

      {/* Relay Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cooling Relay (CH1) */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Snowflake size={16} style={{ color: safeData.relay_cool ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Cooling Relay (CH1)</span>
          </div>
          
          <div className="text-center py-4">
            <button
              onClick={handleCoolingToggle}
              disabled={isAiMode || isOffline}
              className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl transition-all duration-200 ${
                isAiMode 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'hover:scale-105 active:scale-95 cursor-pointer shadow-lg'
              }`}
              style={{
                background: safeData.relay_cool ? 'var(--color-primary-light)' : 'var(--color-surface-2)',
                border: `2px solid ${safeData.relay_cool ? 'var(--color-primary)' : 'var(--color-border)'}`,
              }}
            >
              <Power size={24} style={{ color: safeData.relay_cool ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }} />
              <span className="text-xl font-bold tracking-wide" style={{ color: safeData.relay_cool ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }}>
                {safeData.relay_cool ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
          
          <div className="h-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isAiMode ? (
                 <motion.p key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] font-semibold text-center" style={{ color: 'var(--color-primary)' }}>
                   🔒 Locked: Controlled by TD3 Agent
                 </motion.p>
              ) : (
                <motion.p key="manual" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] text-center" style={{ color: 'var(--color-text-tertiary)' }}>
                  👆 Click to physically toggle hardware
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Heating Relay (CH2) - Placeholder for future expansion */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5 opacity-70">
          <div className="flex items-center gap-2 mb-3">
            <Flame size={16} style={{ color: 'var(--color-text-tertiary)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Heating Relay (CH2)</span>
          </div>
          <div className="text-center py-4">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl" style={{ background: 'var(--color-surface-2)', border: '2px solid var(--color-border)' }}>
              <Power size={20} style={{ color: 'var(--color-text-tertiary)' }} />
              <span className="text-lg font-bold" style={{ color: 'var(--color-text-tertiary)' }}>OFF</span>
            </div>
          </div>
          <p className="text-[10px] text-center mt-2" style={{ color: 'var(--color-text-tertiary)' }}>Currently unused in Phase 1</p>
        </motion.div>

        {/* Overall HVAC State */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Wind size={16} style={{ color: 'var(--color-primary)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Live System State</span>
          </div>
          <div className="space-y-3 mt-2">
            {[
              { label: 'Control Authority', value: isAiMode ? '🤖 AI Agent' : '✋ User Manual' },
              { label: 'Room Temp', value: `${safeData.temperature.toFixed(1)}°C` },
              { label: 'Target Strategy', value: 'Comfort & Efficiency' },
              { label: 'Live Power Draw', value: `${safeData.power_draw_w}W` },
              { label: 'Current Intent', value: safeData.rl_action },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>{item.label}</span>
                <span className="text-xs font-mono font-semibold" style={{ color: 'var(--color-text-primary)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* AI Decision Explainability Panel */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="card p-5" style={{ borderLeft: '3px solid var(--color-primary)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain size={18} style={{ color: 'var(--color-primary)' }} />
          <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>Agent Decision Explainability</h3>
          <span className="badge badge-primary text-[9px]">Live Context</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           {/* Visualizing the "Why" behind the AI's action */}
           <div className="bg-[#111111] p-4 rounded-lg border border-gray-800">
             <p className="text-xs text-gray-400 mb-1">Observation 1</p>
             <h4 className="text-lg font-bold text-white flex items-center gap-2"><Target size={14}/> {safeData.temperature.toFixed(1)}°C</h4>
             <p className="text-[10px] text-gray-500 mt-1">Indoor threshold eval</p>
           </div>
           
           <div className="bg-[#111111] p-4 rounded-lg border border-gray-800">
             <p className="text-xs text-gray-400 mb-1">Observation 2</p>
             <h4 className="text-lg font-bold text-white flex items-center gap-2"><Zap size={14}/> {safeData.power_draw_w}W</h4>
             <p className="text-[10px] text-gray-500 mt-1">Current energy penalty</p>
           </div>

           <div className="bg-[#111111] p-4 rounded-lg border border-gray-800">
             <p className="text-xs text-gray-400 mb-1">Observation 3</p>
             <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity size={14}/> {safeData.occupancy === 1 ? 'Presence' : 'Empty'}
             </h4>
             <p className="text-[10px] text-gray-500 mt-1">Comfort priority weighting</p>
           </div>

           <div className="bg-[#191919] p-4 rounded-lg border border-[var(--color-primary)] shadow-[0_0_10px_rgba(59,130,246,0.2)]">
             <p className="text-xs text-[var(--color-primary)] font-bold mb-1">Final Action Taken</p>
             <h4 className="text-lg font-bold text-white">{safeData.rl_action}</h4>
             <p className="text-[10px] text-gray-400 mt-1">Confidence: {safeData.confidence}%</p>
           </div>
        </div>
      </motion.div>
    </div>
  );
}