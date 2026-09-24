'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
    <header className="sticky top-0 z-30 flex flex-col bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      {/* Primary Top Bar */}
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 gap-4">
        {/* Left: Hamburger & Search */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-xl">
          <button
            onClick={onToggleMobileSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Toggle Navigation Menu"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search Trigger */}
          <div
            onClick={onOpenCommandPalette}
            className="flex flex-1 items-center gap-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 px-3 py-1.5 text-sm text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-100/70 dark:hover:bg-slate-800 cursor-pointer transition-all shadow-2xs"
          >
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="truncate text-[13px] text-slate-500 dark:text-slate-400">
              Search clients, invoices, jobs...
            </span>
            <span className="ml-auto hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 shadow-2xs">
              Ctrl K
            </span>
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick status pills */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-slate-900 dark:bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-200">
            <span className={`h-1.5 w-1.5 rounded-full ${isAppwriteConnected ? 'bg-emerald-400' : 'bg-rose-500'} animate-pulse`} />
            <span className="font-mono text-[11px]">{isAppwriteConnected ? 'Appwrite Cloud SGP' : 'Appwrite Local Mode'}</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Offset Press Active</span>
          </div>

          {/* Theme Toggle (Dark / Light Mode) */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shadow-2xs"
            title={theme === 'dark' ? 'Switch to Light Mode (লাইট মোড)' : 'Switch to Dark Mode (ডার্ক মোড)'}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? (
              <Sun className="h-4.5 w-4.5 text-amber-400" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-slate-600" />
            )}
          </button>

          {/* Bell Notifications */}
          <div className="relative">
            <button
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                1
              </span>
            </button>
          </div>

          {/* User Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-90 transition-opacity focus:outline-none"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#881337] to-slate-900 text-xs font-black text-white shadow-sm ring-2 ring-rose-500/30">
                {getInitials(user?.name || user?.pressProfile?.ownerName)}
              </div>
              <div className="hidden sm:block text-left max-w-[130px]">
                <p className="text-xs font-bold leading-none text-slate-800 dark:text-white truncate">
                  {user?.name || 'এডমিন'}
                </p>
                <p className="mt-0.5 text-[10px] leading-none text-slate-500 dark:text-slate-400 truncate">
                  {user?.pressProfile?.pressName || 'PrintOS Press'}
                </p>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Modal */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Header Profile Summary */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#881337] text-white font-black text-xs shrink-0">
                      {getInitials(user?.name || user?.pressProfile?.ownerName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-slate-900 dark:text-white truncate">
                        {user?.name || 'অফিসার'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user?.email || 'user@example.com'}
                      </p>
                      <span className="inline-block mt-1 text-[9px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/60">
                        {getRoleLabel(user?.role)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
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
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <Compass className="h-4 w-4 text-emerald-600" />
                    <span>প্রেস সেটআপ উইজার্ড চালান (Setup Wizard)</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigateTab?.('settings');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <SlidersHorizontal className="h-4 w-4 text-slate-400" />
                    <span>সিস্টেম ও প্রেস সেটিংস (Settings)</span>
                  </button>

                  {/* Role Switcher for preview */}
                  <div className="pt-2 pb-1 px-3 border-t border-slate-100 dark:border-slate-800">
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
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          <span className="capitalize">{r}</span>
                          {user?.role === r && <Check className="h-2.5 w-2.5" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logout Button */}
                  <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left font-bold"
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
      <div className="flex h-9 items-center justify-between px-4 sm:px-6 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer">
            {breadcrumbSection}
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">{breadcrumbPage}</span>
        </div>
        <div className="text-[11px] text-slate-400 font-medium hidden sm:block">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      </div>
    </header>
  );
};
