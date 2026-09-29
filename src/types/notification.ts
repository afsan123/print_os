import { NavItemKey } from '@/components/layout/Sidebar';

export type NotificationCategory = 'production' | 'inventory' | 'finance' | 'payroll' | 'system';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface PrintOSNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  timestamp: string; // ISO date string or formatted time
  read: boolean;
  targetTab?: NavItemKey;
  actionText?: string;
  entityId?: string;
}

export type NotificationFilter = 'all' | 'unread' | 'production' | 'inventory' | 'finance' | 'payroll';
