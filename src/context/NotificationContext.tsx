'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { PrintOSNotification, NotificationCategory, NotificationPriority, NotificationFilter } from '@/types/notification';
import { NavItemKey } from '@/components/layout/Sidebar';
import { appwriteService } from '@/lib/appwriteService';

interface NotificationContextType {
  notifications: PrintOSNotification[];
  unreadCount: number;
  activeFilter: NotificationFilter;
  setActiveFilter: (filter: NotificationFilter) => void;
  filteredNotifications: PrintOSNotification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  addNotification: (notification: Omit<PrintOSNotification, 'id' | 'timestamp' | 'read'> & { timestamp?: string }) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'printos_notifications_v1';
const SOUND_KEY = 'printos_notification_sound_v1';

const INITIAL_NOTIFICATIONS: PrintOSNotification[] = [
  {
    id: 'notif-1',
    title: 'Urgent Delivery Due Tomorrow',
    message: 'Job #JC-2025-0842 (Beximco Leaflet 10,000 pcs) is at Coating stage. Target delivery 5:00 PM.',
    category: 'production',
    priority: 'urgent',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15m ago
    read: false,
    targetTab: 'production_queue',
    actionText: 'View Queue',
    entityId: 'JC-2025-0842',
  },
  {
    id: 'notif-2',
    title: 'Low Godown Stock Alert',
    message: 'Duplex Board 250 GSM (28 × 40) is at 18 reams (below safety min 25 reams) in Main Godown.',
    category: 'inventory',
    priority: 'high',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
    read: false,
    targetTab: 'inventory',
    actionText: 'Manage Stock',
  },
  {
    id: 'notif-3',
    title: 'Overdue Client Payment',
    message: 'Square Toiletries outstanding due ৳ 45,000 exceeded 30-day payment term. Delivery Chalan #CH-2025-0104.',
    category: 'finance',
    priority: 'high',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5h ago
    read: false,
    targetTab: 'debtors',
    actionText: 'Review Ledger',
    entityId: 'Square Toiletries',
  },
  {
    id: 'notif-4',
    title: 'Monthly Staff Payroll Pending',
    message: 'Salary disbursements for 6 press machine operators and bookbinders pending review (৳ 1,42,000).',
    category: 'payroll',
    priority: 'normal',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
    targetTab: 'payroll',
    actionText: 'Open Payroll',
  },
  {
    id: 'notif-5',
    title: 'Machine CTP Output Completed',
    message: 'Heidelberg Speedmaster SM-74 plates (4 Color CMYK) ready for Pharma Carton Box run.',
    category: 'production',
    priority: 'low',
    timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
    targetTab: 'production_queue',
    actionText: 'Check Machine',
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<PrintOSNotification[]>([]);
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Initialize from LocalStorage or Defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotifications(parsed);
        } else {
          setNotifications(INITIAL_NOTIFICATIONS);
        }
      } else {
        setNotifications(INITIAL_NOTIFICATIONS);
      }

      const storedSound = localStorage.getItem(SOUND_KEY);
      if (storedSound !== null) {
        setSoundEnabled(storedSound === 'true');
      }
    } catch {
      setNotifications(INITIAL_NOTIFICATIONS);
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (notifications.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      } catch (err) {
        console.warn('Failed to save notifications to localStorage:', err);
      }
    }
  }, [notifications]);

  // Audio tone generator using Web Audio API (no external asset dependencies)
  const playNotificationSound = useCallback((priority: NotificationPriority) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;
      if (priority === 'urgent') {
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.setValueAtTime(1174.66, now + 0.1); // D6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else {
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.setValueAtTime(880, now + 0.08); // A5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch {
      // AudioContext might be blocked by browser autoplay policy until user gesture
    }
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(SOUND_KEY, String(next));
      return next;
    });
  }, []);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const addNotification = useCallback(
    (item: Omit<PrintOSNotification, 'id' | 'timestamp' | 'read'> & { timestamp?: string }) => {
      const newNotif: PrintOSNotification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: item.title,
        message: item.message,
        category: item.category,
        priority: item.priority || 'normal',
        timestamp: item.timestamp || new Date().toISOString(),
        read: false,
        targetTab: item.targetTab,
        actionText: item.actionText,
        entityId: item.entityId,
      };

      setNotifications((prev) => [newNotif, ...prev]);
      playNotificationSound(newNotif.priority);

      // Attempt background cloud sync if Appwrite connected
      appwriteService.saveNotification?.(newNotif).catch(() => {});
    },
    [playNotificationSound]
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      if (activeFilter === 'unread') return !item.read;
      if (activeFilter === 'production') return item.category === 'production';
      if (activeFilter === 'inventory') return item.category === 'inventory';
      if (activeFilter === 'finance') return item.category === 'finance';
      if (activeFilter === 'payroll') return item.category === 'payroll';
      return true;
    });
  }, [notifications, activeFilter]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activeFilter,
        setActiveFilter,
        filteredNotifications,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        addNotification,
        soundEnabled,
        toggleSound,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
