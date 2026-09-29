'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Printer,
  Sparkles,
  Sun,
  Moon,
  LogOut,
  SlidersHorizontal,
  Compass,
  Building2,
  Shield,
  Check,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { NavItemKey } from '@/components/layout/Sidebar';
import { UserRole } from '@/types/auth';

interface TopNavProps {
  onToggleMobileSidebar: () => void;
  onOpenCommandPalette: () => void;
  breadcrumbSection?: string;
  breadcrumbPage?: string;
  activeTabLabel?: string;
  onNavigateTab?: (tab: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onToggleMobileSidebar,
  onOpenCommandPalette,
  breadcrumbSection = 'Jobs & Estimates',
  breadcrumbPage = 'Smart Estimator',
  onNavigateTab,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, resetOnboarding, switchRole, isAppwriteConnected } = useAuth();
  const { unreadCount } = useNotifications();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name?: string) => {
    if (!name) return 'OS';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getRoleLabel = (role?: UserRole) => {
    switch (role) {
      case 'owner':
        return 'মালিক (Owner)';
      case 'manager':
        return 'ম্যানেজার (Manager)';
      case 'operator':
        return 'অপারেটর (Operator)';
      case 'accountant':
        return 'হিসাবরক্ষক (Accountant)';
      default:
        return 'ব্যবহারকারী';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex flex-col bg-white dark:bg-[#071A3D] border-b border-[#E8EDF5] dark:border-[#162E63] shadow-2xs transition-colors duration-200">
      {/* Primary Top Bar */}
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-4">
        {/* Left: Hamburger, Mobile Logo & Search */}
        <div className="flex items-center gap-2.5 sm:gap-4 flex-1 max-w-xl">
          <button
            onClick={onToggleMobileSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8EDF5] dark:border-[#162E63] text-slate-600 dark:text-[#D8E3FF] hover:bg-[#F5F7FA] dark:hover:bg-[#0B224F] hover:text-[#1D5DFF] transition-colors lg:hidden shrink-0"
            title="Toggle Navigation Menu"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile Logo Mark */}
          <div className="flex items-center lg:hidden shrink-0">
            <Image
              src="/logo-icon.png"
              alt="PrintOS"
              width={28}
              height={28}
              priority
              className="h-7 w-7 object-contain"
            />
          </div>

          {/* Search Trigger */}
          <div
            onClick={onOpenCommandPalette}
            className="flex flex-1 items-center gap-2.5 rounded-xl border border-[#E8EDF5] dark:border-[#162E63] bg-[#F5F7FA]/80 dark:bg-[#0B224F]/70 px-3 py-1.5 text-sm text-slate-400 hover:border-[#1D5DFF]/40 dark:hover:border-[#23A8FF]/40 hover:bg-white dark:hover:bg-[#0B224F] cursor-pointer transition-all shadow-2xs"
          >
            <Search className="h-4 w-4 text-[#1D5DFF] shrink-0" />
            <span className="truncate text-[13px] text-slate-500 dark:text-[#D8E3FF]/70">
              Search clients, invoices, jobs...
            </span>
            <span className="ml-auto hidden sm:inline-flex items-center gap-0.5 rounded border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#071A3D] px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:text-[#D8E3FF]/60 shadow-2xs">
              Ctrl K
            </span>
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick status pills */}
          <div
            className="hidden lg:flex items-center gap-1.5 rounded-full bg-[#071A3D] dark:bg-[#051430] border border-[#162E63] px-2.5 py-1 text-xs font-medium text-[#D8E3FF]"
            title={isAppwriteConnected ? 'Cloud Synchronization Active (Secured)' : 'Local Offline Resilience Mode Active'}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isAppwriteConnected ? 'bg-emerald-400' : 'bg-[#FF008C]'} animate-pulse`} />
            <span className="text-[11px] font-medium">{isAppwriteConnected ? 'Cloud Synced' : 'Offline Mode'}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-800 px-2.5 py-1 text-xs font-medium text-[#1D5DFF] dark:text-[#23A8FF]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1D5DFF] animate-pulse" />
            <span>Offset Press Active</span>
          </div>

          {/* Theme Toggle (Dark / Light Mode) */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8EDF5] dark:border-[#162E63] text-slate-600 dark:text-[#D8E3FF] hover:bg-[#F5F7FA] dark:hover:bg-[#0B224F] hover:text-[#1D5DFF] transition-colors shadow-2xs"
            title={theme === 'dark' ? 'Switch to Light Mode (লাইট মোড)' : 'Switch to Dark Mode (ডার্ক মোড)'}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="h-4.5 w-4.5 text-[#FFD400]" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-[#071A3D]" />
            )}
          </button>

          {/* Bell Notifications (CMYK Magenta Badge) */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen((prev) => !prev)}
              className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                isNotifOpen
                  ? 'bg-[#1D5DFF]/10 text-[#1D5DFF] dark:text-[#23A8FF]'
                  : 'text-slate-500 hover:bg-[#F5F7FA] dark:hover:bg-[#0B224F] hover:text-[#1D5DFF] dark:hover:text-[#23A8FF]'
              }`}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4.5 min-w-[18px] px-1 items-center justify-center rounded-full bg-[#FF008C] text-[10px] font-black text-white shadow-xs animate-in zoom-in duration-150">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover Dropdown */}
            <NotificationDropdown
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              onNavigateTab={(tab) => {
                if (onNavigateTab) onNavigateTab(tab);
              }}
            />
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2.5 pl-2 border-l border-[#E8EDF5] dark:border-[#162E63] hover:opacity-90 transition-opacity focus:outline-none"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#23A8FF] to-[#1D5DFF] text-xs font-black text-white shadow-sm ring-2 ring-[#1D5DFF]/30">
                {getInitials(user?.name || user?.pressProfile?.ownerName)}
              </div>
              <div className="hidden sm:block text-left max-w-[130px]">
                <p className="text-xs font-bold leading-none text-slate-800 dark:text-white truncate">
                  {user?.name || 'এডমিন'}
                </p>
                <p className="mt-0.5 text-[10px] leading-none text-slate-500 dark:text-[#D8E3FF]/70 truncate">
                  {user?.pressProfile?.pressName || 'PrintOS Press'}
                </p>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Modal */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Header Profile Summary */}
                <div className="p-3 rounded-xl bg-[#F5F7FA] dark:bg-[#071A3D] border border-[#E8EDF5] dark:border-[#162E63] mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#23A8FF] to-[#1D5DFF] text-white font-black text-xs shrink-0 shadow-sm">
                      {getInitials(user?.name || user?.pressProfile?.ownerName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {user?.name || 'অফিসার'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-[#D8E3FF]/70 truncate">
                        {user?.email || 'user@example.com'}
                      </p>
                      <span className="inline-block mt-1 text-[9px] font-bold bg-blue-50 dark:bg-blue-950/60 text-[#1D5DFF] dark:text-[#23A8FF] px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900/60">
                        {getRoleLabel(user?.role)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-[#E8EDF5] dark:border-[#162E63] flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-[#D8E3FF]/80">
                    <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{user?.pressProfile?.pressName || 'PrintOS Press'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      resetOnboarding();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-[#D8E3FF] hover:bg-[#F5F7FA] dark:hover:bg-[#071A3D] transition-colors text-left"
                  >
                    <Compass className="h-4 w-4 text-emerald-600" />
                    <span>প্রেস সেটআপ উইজার্ড চালান (Setup Wizard)</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigateTab?.('settings');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-[#D8E3FF] hover:bg-[#F5F7FA] dark:hover:bg-[#071A3D] transition-colors text-left"
                  >
                    <SlidersHorizontal className="h-4 w-4 text-[#1D5DFF]" />
                    <span>সিস্টেম ও প্রেস সেটিংস (Settings)</span>
                  </button>

                  {/* Role Switcher for preview */}
                  <div className="pt-2 pb-1 px-3 border-t border-[#E8EDF5] dark:border-[#162E63]">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      ভূমিকা পরিবর্তন (Switch Role)
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {(['owner', 'manager', 'operator', 'accountant'] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => switchRole(r)}
                          className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all flex items-center justify-between ${
                            user?.role === r
                              ? 'bg-[#1D5DFF] text-white shadow-2xs'
                              : 'bg-[#F5F7FA] dark:bg-[#071A3D] text-slate-700 dark:text-[#D8E3FF] hover:bg-slate-200 dark:hover:bg-[#122A59]'
                          }`}
                        >
                          <span className="capitalize">{r}</span>
                          {user?.role === r && <Check className="h-2.5 w-2.5" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-1 border-t border-[#E8EDF5] dark:border-[#162E63]">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[#FF008C] hover:bg-[#FF008C]/10 transition-colors text-left font-bold"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>লগআউট (Log Out)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Bar: Breadcrumb Navigation & Date */}
      <div className="flex h-9 items-center justify-between px-4 sm:px-6 bg-[#F5F7FA]/90 dark:bg-[#051430]/70 border-t border-[#E8EDF5] dark:border-[#162E63] text-xs text-slate-500 dark:text-[#D8E3FF]/70">
        <div className="flex items-center gap-1.5">
          <span className="hover:text-[#1D5DFF] dark:hover:text-[#23A8FF] transition-colors cursor-pointer font-medium">
            {breadcrumbSection}
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800 dark:text-white">{breadcrumbPage}</span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>
    </header>
  );
};
