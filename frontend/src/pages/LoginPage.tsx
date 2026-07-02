import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import { useAuth } from '../hooks/useAuth';
import { Moon, Sun, Hexagon, Eye, EyeOff, ArrowRight, User, Mail, Lock, Globe } from 'lucide-react';

type AuthView = 'login' | 'register';

export default function LoginPage() {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isDark, toggle } = useThemeStore();
  const { login, register, loginWithGoogle } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch {
      setError('Google sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchView = (v: AuthView) => {
    setView(v);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 0.75rem 0.75rem 2.75rem',
    borderRadius: '0.75rem',
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface-0)',
    color: 'var(--color-text-primary)',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-surface-1)' }}>
      {/* Left Panel — Animated Building */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden"
        style={{ background: 'var(--color-surface-0)' }}
      >
        <div className="relative w-full max-w-lg px-12">
          <svg viewBox="0 0 400 500" className="w-full" xmlns="http://www.w3.org/2000/svg">
            <motion.rect initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
              x="20" y="460" width="360" height="4" rx="2" fill="var(--color-border)" style={{ transformOrigin: '200px 462px' }} />
            <motion.rect initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              x="80" y="80" width="160" height="380" rx="6" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" style={{ transformOrigin: '160px 460px' }} />
            <motion.rect initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.6, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              x="240" y="180" width="100" height="280" rx="6" fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth="1.5" style={{ transformOrigin: '290px 460px' }} />
            {Array.from({ length: 8 }, (_, row) =>
              Array.from({ length: 3 }, (_, col) => (
                <motion.rect key={`w-${row}-${col}`} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.6, 1] }}
                  transition={{ delay: 1.0 + row * 0.08 + col * 0.05, duration: 0.5, repeat: Infinity, repeatDelay: Math.random() * 8 + 6 }}
                  x={100 + col * 44} y={105 + row * 42} width="28" height="24" rx="3" fill="var(--color-primary)" opacity={Math.random() > 0.3 ? 0.7 : 0.15} />
              ))
            )}
            {Array.from({ length: 5 }, (_, row) =>
              Array.from({ length: 2 }, (_, col) => (
                <motion.rect key={`sw-${row}-${col}`} initial={{ opacity: 0 }} animate={{ opacity: [0, 0.7] }}
                  transition={{ delay: 1.4 + row * 0.1 + col * 0.05, duration: 0.4 }}
                  x={258 + col * 38} y={205 + row * 48} width="24" height="20" rx="3" fill="var(--color-primary)" opacity={Math.random() > 0.4 ? 0.6 : 0.15} />
              ))
            )}
            <motion.line initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 1.2, duration: 0.4 }}
              x1="160" y1="80" x2="160" y2="50" stroke="var(--color-text-tertiary)" strokeWidth="2" style={{ transformOrigin: '160px 80px' }} />
            <motion.circle initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, duration: 0.3 }} cx="160" cy="46" r="4" fill="var(--color-primary)" />
            {[12, 20, 28].map((r, i) => (
              <motion.circle key={`signal-${i}`} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1, 1.5] }}
                transition={{ delay: 2 + i * 0.3, duration: 2, repeat: Infinity, repeatDelay: 1 }}
                cx="160" cy="46" r={r} fill="none" stroke="var(--color-primary)" strokeWidth="1" />
            ))}
            <motion.rect initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.9, duration: 0.4 }}
              x="140" y="420" width="40" height="40" rx="4" fill="var(--color-primary)" opacity={0.3} style={{ transformOrigin: '160px 460px' }} />
          </svg>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.5 }} className="text-center mt-4">
            <p className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Smart Room Optimization</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Phase 2 · Live Hardware Integration</p>
          </motion.div>
        </div>
        <button onClick={toggle}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl border cursor-pointer transition-colors"
          style={{ background: 'var(--color-surface-1)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </motion.div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
              <Hexagon size={24} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Neuro</span>
                <span className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>X</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Smart Room Energy Optimization</p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex mb-6 rounded-xl overflow-hidden" style={{ background: 'var(--color-surface-0)', border: '1px solid var(--color-border)' }}>
            {(['login', 'register'] as AuthView[]).map((v) => (
              <button key={v} onClick={() => switchView(v)}
                className="flex-1 py-2.5 text-sm font-semibold transition-all border-0 cursor-pointer"
                style={{
                  background: view === v ? 'var(--color-primary)' : 'transparent',
                  color: view === v ? 'white' : 'var(--color-text-tertiary)',
                }}
              >
                {v === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mb-4 px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--color-danger)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <AnimatePresence mode="wait">
            {view === 'login' ? (
              <motion.form key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }} onSubmit={handleLogin} className="space-y-4"
              >
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-tertiary)' }} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required
                    style={inputStyle} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-tertiary)' }} />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" required style={{ ...inputStyle, paddingRight: '2.75rem' }}
                    onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none'; }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer"
                    style={{ color: 'var(--color-text-tertiary)' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: 'var(--color-text-secondary)' }}>
                    <input type="checkbox" className="w-4 h-4 rounded accent-[var(--color-primary)]" /> Remember me
                  </label>
                  <button type="button" className="text-xs font-medium border-0 bg-transparent cursor-pointer" style={{ color: 'var(--color-primary)' }}>
                    Forgot password?
                  </button>
                </div>
                <motion.button type="submit" className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2"
                  disabled={isLoading} whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : ( <> Sign In <ArrowRight size={16} /> </> )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }} onSubmit={handleRegister} className="space-y-4"
              >
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-tertiary)' }} />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required
                    style={inputStyle} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-tertiary)' }} />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required
                    style={inputStyle} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-tertiary)' }} />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 chars)" required
                    style={inputStyle} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-text-tertiary)' }} />
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" required
                    style={inputStyle} onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)'; }}
                    onBlur={(e) => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <motion.button type="submit" className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2"
                  disabled={isLoading} whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : ( <> Create Account <ArrowRight size={16} /> </> )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
          </div>

          {/* Google OAuth Button */}
          <motion.button onClick={handleGoogleLogin} disabled={isLoading} whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 cursor-pointer transition-all"
            style={{
              background: 'var(--color-surface-0)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-primary)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <Globe size={18} style={{ color: '#4285F4' }} />
            Sign in with Google
          </motion.button>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>NeuroX Smart Room Energy Optimization · v3.2</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Phase 2 · Powered by TD3 Reinforcement Learning</p>
          </div>

          {/* Mobile theme toggle */}
          <div className="lg:hidden flex justify-center mt-6">
            <button onClick={toggle} className="w-10 h-10 flex items-center justify-center rounded-xl border cursor-pointer"
              style={{ background: 'var(--color-surface-0)', borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
