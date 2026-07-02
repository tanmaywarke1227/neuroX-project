import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// ─── Types ─────────────────────────────────────────────────────────
export interface AuthUser {
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Storage Keys ──────────────────────────────────────────────────
const TOKEN_KEY = 'neurox_auth_token';
const USER_KEY  = 'neurox_auth_user';

// ─── Provider ──────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser  = localStorage.getItem(USER_KEY);
    if (savedToken && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
  }, []);

  const persistSession = (u: AuthUser) => {
    const mockToken = btoa(JSON.stringify({ email: u.email, exp: Date.now() + 86400000 }));
    localStorage.setItem(TOKEN_KEY, mockToken);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  };

  const login = async (email: string, _password: string): Promise<void> => {
    // Simulate API latency
    await new Promise((r) => setTimeout(r, 800));
    const name = email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    persistSession({ email, name });
  };

  const register = async (name: string, email: string, _password: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 1000));
    persistSession({ email, name });
  };

  const loginWithGoogle = async (): Promise<void> => {
    await new Promise((r) => setTimeout(r, 1200));
    persistSession({ email: 'user@gmail.com', name: 'Google User', avatar: 'G' });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
