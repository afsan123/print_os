'use client';

import React from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  Volume2,
  VolumeX,
  Printer,
  Boxes,
  Receipt,
  Users,
  Info,
  ChevronRight,
  X,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { NotificationCategory, NotificationFilter, PrintOSNotification } from '@/types/notification';
import { NavItemKey } from '@/components/layout/Sidebar';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavItemKey) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const {
    notifications,
    unreadCount,
    activeFilter,
    setActiveFilter,
    filteredNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    soundEnabled,
    toggleSound,
  } = useNotifications();

  if (!isOpen) return null;

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'production':
        return <Printer className="h-4 w-4 text-[#1D5DFF]" />;
      case 'inventory':
        return <Boxes className="h-4 w-4 text-amber-500" />;
      case 'finance':
        return <Receipt className="h-4 w-4 text-emerald-500" />;
      case 'payroll':
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <Info className="h-4 w-4 text-[#00C8FF]" />;
    }
  };

  const getCategoryBadgeClass = (cat: NotificationCategory) => {
    switch (cat) {
      case 'production':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'inventory':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'finance':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'payroll':
        return 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffSecs < 60) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const handleNotificationClick = (item: PrintOSNotification) => {
    markAsRead(item.id);
    if (item.targetTab) {
      onNavigateTab(item.targetTab);
      onClose();
    }
  };

  const filters: { id: NotificationFilter; label: string; count?: number }[] = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'production', label: 'Jobs', count: notifications.filter(n => n.category === 'production').length },
    { id: 'inventory', label: 'Godown', count: notifications.filter(n => n.category === 'inventory').length },
    { id: 'finance', label: 'Finance', count: notifications.filter(n => n.category === 'finance').length },
    { id: 'payroll', label: 'Payroll', count: notifications.filter(n => n.category === 'payroll').length },
  ];

  return (
    <>
      {/* Backdrop for click-away */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Dropdown Container */}
      <div className="absolute right-0 top-12 z-50 w-84 sm:w-[410px] rounded-2xl border border-slate-200 dark:border-[#162E63] bg-white dark:bg-[#071A3D] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 pb-3 border-b border-slate-100 dark:border-[#10244C] flex items-center justify-between bg-slate-50/70 dark:bg-[#0B224F]/70">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1D5DFF]/10 text-[#1D5DFF] dark:text-[#23A8FF]">
              <Bell className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#FF008C] text-[10px] font-extrabold text-white">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#D8E3FF]/70">
                Press alerts & live activity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Sound Toggle */}
            <button
              onClick={toggleSound}
              className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors ${
                soundEnabled ? 'text-[#1D5DFF] dark:text-[#23A8FF]' : ''
              }`}
              title={soundEnabled ? 'Mute alert sounds' : 'Enable alert sounds'}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Mark All Read */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-[11px] font-semibold text-[#1D5DFF] dark:text-[#23A8FF] hover:underline px-2 py-1 rounded-md"
                title="Mark all as read"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span>Mark read</span>
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-100 dark:border-[#10244C] overflow-x-auto scrollbar-none bg-white dark:bg-[#071A3D]">
          {filters.map((f) => {
            const isActive = activeFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1D5DFF] text-white shadow-2xs'
                    : 'text-slate-600 dark:text-[#D8E3FF]/80 hover:bg-slate-100 dark:hover:bg-[#0B224F]'
                }`}
              >
                <span>{f.label}</span>
                {typeof f.count === 'number' && f.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-[#162E63] text-slate-600 dark:text-[#D8E3FF]'
                    }`}
                  >
                    {f.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notification Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-[#10244C] max-h-[380px]">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-[#0B224F] text-slate-400 mb-3">
                <CheckCheck className="h-6 w-6 text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">
                All caught up!
              </p>
              <p className="text-xs text-slate-500 dark:text-[#D8E3FF]/70 mt-1">
                No active notifications matching this filter.
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const isUrgent = item.priority === 'urgent';
              const isHigh = item.priority === 'high';

              return (
                <div
                  key={item.id}
                  className={`p-3.5 transition-colors relative group hover:bg-slate-50/80 dark:hover:bg-[#0B224F]/50 ${
                    !item.read
                      ? 'bg-blue-50/30 dark:bg-[#0B224F]/20'
                      : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Category Icon Badge */}
                    <div className="mt-0.5 flex-shrink-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-[#10244C] border border-slate-200/60 dark:border-[#162E63]">
                        {getCategoryIcon(item.category)}
                      </div>
                    </div>

                    {/* Notification Content */}
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleNotificationClick(item)}
                    >
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Unread indicator dot */}
                        {!item.read && (
                          <span className="h-2 w-2 rounded-full bg-[#FF008C] ring-2 ring-white dark:ring-[#071A3D] animate-pulse shrink-0" />
                        )}

                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getCategoryBadgeClass(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>

                        {isUrgent && (
                          <span className="flex items-center gap-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                            <AlertTriangle className="h-3 w-3" />
                            Urgent
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400 dark:text-[#D8E3FF]/60 ml-auto flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelativeTime(item.timestamp)}
                        </span>
                      </div>

                      <h4
                        className={`text-xs mt-1.5 font-bold truncate ${
                          !item.read
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-700 dark:text-[#D8E3FF]/90'
                        }`}
                      >
                        {item.title}
                      </h4>

                      <p className="text-[11.5px] text-slate-600 dark:text-[#D8E3FF]/75 mt-0.5 line-clamp-2 leading-relaxed">
                        {item.message}
                      </p>

                      {/* Action Link */}
                      {item.targetTab && (
                        <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[#1D5DFF] dark:text-[#23A8FF] group-hover:translate-x-0.5 transition-transform">
                          <span>{item.actionText || 'Take Action'}</span>
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      )}
                    </div>

                    {/* Dismiss Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(item.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white transition-opacity"
                      title="Dismiss"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-100 dark:border-[#10244C] bg-slate-50/70 dark:bg-[#0B224F]/70 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500 dark:text-[#D8E3FF]/70">
              Total {notifications.length} alerts recorded
            </span>
            <button
              onClick={clearAll}
              className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear all</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};
