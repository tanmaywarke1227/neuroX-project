import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ─── Types ─────────────────────────────────────────────────────────
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface SystemAlert {
  id: string;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationContextType {
  alerts: SystemAlert[];
  unreadCount: number;
  pushAlert: (severity: AlertSeverity, message: string) => void;
  markAllRead: () => void;
  clearAlerts: () => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

// Dedup window: don't push the same message within this many ms
const DEDUP_WINDOW_MS = 10000;

// ─── Provider ──────────────────────────────────────────────────────
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);

  const pushAlert = useCallback((severity: AlertSeverity, message: string) => {
    setAlerts((prev) => {
      // Dedup: skip if same message exists within the last 10 seconds
      const recent = prev.find(
        (a) => a.message === message && Date.now() - a.timestamp.getTime() < DEDUP_WINDOW_MS
      );
      if (recent) return prev;

      const newAlert: SystemAlert = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        severity,
        message,
        timestamp: new Date(),
        read: false,
      };
      // Keep max 50 alerts, newest first
      return [newAlert, ...prev].slice(0, 50);
    });
  }, []);

  const markAllRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <NotificationContext.Provider value={{ alerts, unreadCount, pushAlert, markAllRead, clearAlerts }}>
      {children}
    </NotificationContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────
export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
}
