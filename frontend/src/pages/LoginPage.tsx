import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { Moon, Sun, Hexagon, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isDark, toggle } = useThemeStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth delay — future: POST /api/auth/login
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--color-surface-1)' }}
    >
      {/* Left Panel — Building Illustration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{ background: 'var(--color-surface-0)' }}
      >
        {/* Animated Building SVG */}
        <div className="relative w-full max-w-lg px-12">
          <svg viewBox="0 0 400 500" className="w-full" xmlns="http://www.w3.org/2000/svg">
            {/* Ground */}
            <motion.rect
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              x="20" y="460" width="360" height="4" rx="2"
              fill="var(--color-border)"
              style={{ transformOrigin: '200px 462px' }}
            />

            {/* Main Building */}
            <motion.rect
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              x="80" y="80" width="160" height="380" rx="6"
              fill="var(--color-surface-2)"
              stroke="var(--color-border)"
              strokeWidth="1.5"
              style={{ transformOrigin: '160px 460px' }}
            />

            {/* Side Wing */}
            <motion.rect
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.6, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              x="240" y="180" width="100" height="280" rx="6"
              fill="var(--color-surface-2)"
              stroke="var(--color-border)"
              strokeWidth="1.5"
              style={{ transformOrigin: '290px 460px' }}
            />

            {/* Windows — Main Building */}
            {Array.from({ length: 8 }, (_, row) =>
              Array.from({ length: 3 }, (_, col) => (
                <motion.rect
                  key={`w-${row}-${col}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0.6, 1] }}
                  transition={{
                    delay: 1.0 + row * 0.08 + col * 0.05,
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: Math.random() * 8 + 6,
                  }}
                  x={100 + col * 44}
                  y={105 + row * 42}
                  width="28"
                  height="24"
                  rx="3"
                  fill="var(--color-primary)"
                  opacity={Math.random() > 0.3 ? 0.7 : 0.15}
                />
              ))
            )}

            {/* Windows — Side Wing */}
            {Array.from({ length: 5 }, (_, row) =>
              Array.from({ length: 2 }, (_, col) => (
                <motion.rect
                  key={`sw-${row}-${col}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.7] }}
                  transition={{ delay: 1.4 + row * 0.1 + col * 0.05, duration: 0.4 }}
                  x={258 + col * 38}
                  y={205 + row * 48}
                  width="24"
                  height="20"
                  rx="3"
                  fill="var(--color-primary)"
                  opacity={Math.random() > 0.4 ? 0.6 : 0.15}
                />
              ))
            )}

            {/* Roof antenna */}
            <motion.line
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              x1="160" y1="80" x2="160" y2="50"
              stroke="var(--color-text-tertiary)"
              strokeWidth="2"
              style={{ transformOrigin: '160px 80px' }}
            />
            <motion.circle
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, duration: 0.3 }}
              cx="160" cy="46" r="4"
              fill="var(--color-primary)"
            />

            {/* Signal waves */}
            {[12, 20, 28].map((r, i) => (
              <motion.circle
                key={`signal-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1, 1.5] }}
                transition={{
                  delay: 2 + i * 0.3,
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                cx="160" cy="46" r={r}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="1"
              />
            ))}

            {/* Entrance */}
            <motion.rect
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              x="140" y="420" width="40" height="40" rx="4"
              fill="var(--color-primary)"
              opacity={0.3}
              style={{ transformOrigin: '160px 460px' }}
            />
          </svg>

          {/* Floating labels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="text-center mt-4"
          >
            <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Intelligent Building Management
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
              RL-Powered Energy Optimization
            </p>
          </motion.div>
        </div>

        {/* Theme toggle on illustration side */}
        <button
          onClick={toggle}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl border cursor-pointer transition-colors"
          style={{
            background: 'var(--color-surface-1)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </motion.div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: 'var(--color-primary)' }}
            >
              <Hexagon size={24} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                  Neuro
                </span>
                <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  X
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                Smart Building Intelligence
              </p>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2
              className="text-2xl font-semibold mb-1"
              style={{ color: 'var(--color-text-primary)' }}
            >
              Welcome back
            </h2>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              Sign in to access your building intelligence dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@neurox.io"
                className="input"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="text-sm font-medium"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium border-0 bg-transparent cursor-pointer"
                  style={{ color: 'var(--color-primary)' }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input"
                  style={{ paddingRight: '2.5rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer"
                  style={{ color: 'var(--color-text-tertiary)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer accent-[var(--color-primary)]"
              />
              <label
                htmlFor="remember"
                className="text-sm cursor-pointer"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                Remember me
              </label>
            </div>

            <motion.button
              type="submit"
              className="btn-primary w-full py-3 text-base"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
              ) : (
                'Sign in'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
              NeuroX Smart Building Intelligence Platform v3.2
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>
              Enterprise License · Powered by Reinforcement Learning
            </p>
          </div>

          {/* Mobile theme toggle */}
          <div className="lg:hidden flex justify-center mt-6">
            <button
              onClick={toggle}
              className="w-10 h-10 flex items-center justify-center rounded-xl border cursor-pointer"
              style={{
                background: 'var(--color-surface-0)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
