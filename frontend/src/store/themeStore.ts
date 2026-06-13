// =============================================
// Theme Store — Light/Dark mode with localStorage persistence
// =============================================

import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
  setDark: (dark: boolean) => void;
}

const getInitialTheme = (): boolean => {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('neurox-theme');
  if (stored) return stored === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: getInitialTheme(),
  toggle: () =>
    set((state) => {
      const next = !state.isDark;
      localStorage.setItem('neurox-theme', next ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', next);
      return { isDark: next };
    }),
  setDark: (dark: boolean) => {
    localStorage.setItem('neurox-theme', dark ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', dark);
    set({ isDark: dark });
  },
}));
