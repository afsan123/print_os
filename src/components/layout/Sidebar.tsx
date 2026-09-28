'use client';

import React from 'react';
import {
  LayoutDashboard,
  Calculator,
  FileText,
  Layers,
  Receipt,
  Truck,
  Users,
  Building2,
  FileSpreadsheet,
  Wallet,
  ArrowLeftRight,
  TrendingDown,
  UserCheck,
  LineChart,
  Scale,
  BarChart3,
  Settings,
  Boxes,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export type NavItemKey =
  | 'dashboard'
  | 'estimator'
  | 'job_cards'
  | 'production_queue'
  | 'invoices'
  | 'delivery_chalans'
  | 'clients'
  | 'suppliers'
  | 'purchase_bills'
  | 'cash_book'
  | 'transactions'
  | 'expenses'
  | 'payroll'
  | 'profit_loss'
  | 'debtors'
  | 'sales_reports'
  | 'settings';

interface SidebarProps {
  activeTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { user, logout } = useAuth();
  const sections = [
    {
      title: null,
      items: [
        { key: 'dashboard' as NavItemKey, label: 'Dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'JOBS & PRODUCTION',
      items: [
        { key: 'estimator' as NavItemKey, label: 'Smart Estimator', icon: Calculator },
        { key: 'job_cards' as NavItemKey, label: 'Job Cards', icon: FileText },
        { key: 'production_queue' as NavItemKey, label: 'Production Queue', icon: Layers },
      ],
    },
    {
      title: 'SALES',
      items: [
        { key: 'invoices' as NavItemKey, label: 'Invoices', icon: Receipt },
        { key: 'delivery_chalans' as NavItemKey, label: 'Delivery Chalans', icon: Truck },
        { key: 'clients' as NavItemKey, label: 'Clients', icon: Users },
      ],
    },
    {
      title: 'PURCHASES',
      items: [
        { key: 'suppliers' as NavItemKey, label: 'Suppliers', icon: Building2 },
        { key: 'purchase_bills' as NavItemKey, label: 'Purchase Bills', icon: FileSpreadsheet },
      ],
    },
    {
      title: 'FINANCE',
      items: [
        { key: 'cash_book' as NavItemKey, label: 'Cash Book', icon: Wallet },
        { key: 'transactions' as NavItemKey, label: 'Transactions', icon: ArrowLeftRight },
        { key: 'expenses' as NavItemKey, label: 'Expenses', icon: TrendingDown },
        { key: 'payroll' as NavItemKey, label: 'Payroll', icon: UserCheck },
      ],
    },
    {
      title: 'REPORTS',
      items: [
        { key: 'profit_loss' as NavItemKey, label: 'Profit & Loss', icon: LineChart },
        { key: 'debtors' as NavItemKey, label: 'Debtors', icon: Scale },
        { key: 'sales_reports' as NavItemKey, label: 'Sales Reports', icon: BarChart3 },
      ],
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#0f172a] text-slate-300 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-rose-900 shadow-md shadow-rose-950/40">
            {/* Layered Paper Sheets Icon */}
            <div className="relative w-5 h-5">
              <span className="printos-logo-sheet absolute inset-0 block rounded-sm bg-rose-400/80 -rotate-6 transform origin-bottom-left" />
              <span className="printos-logo-sheet absolute inset-0 block rounded-sm bg-rose-200/90 rotate-3 transform origin-bottom-left" />
              <span className="printos-logo-sheet absolute inset-0 block rounded-sm bg-white shadow" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                PrintOS
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">
              Manage. Print. Grow.
            </p>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <nav aria-label="Primary navigation" className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              {sec.title && (
                <div className="px-3 pb-1 pt-2 text-[10px] font-bold tracking-wider text-slate-400/80 uppercase">
                  {sec.title}
                </div>
              )}
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const isActive = activeTab === item.key;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        onSelectTab(item.key);
                        onCloseMobile?.();
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
                        isActive
                          ? 'bg-[#881337] text-white shadow-sm font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Settings Section */}
          <div className="pt-2 border-t border-slate-800/60">
            <button
              onClick={() => {
                onSelectTab('settings');
                onCloseMobile?.();
              }}
              aria-current={activeTab === 'settings' ? 'page' : undefined}
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#881337] text-white'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <Settings
                className={`h-4 w-4 shrink-0 ${
                  activeTab === 'settings' ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        {/* Footer Area with User Profile & Location Tag */}
        <div className="p-3 border-t border-slate-800/80 bg-[#0c1322] space-y-2">
          {user && (
            <div className="flex items-center justify-between rounded-xl bg-slate-900/90 border border-slate-800 p-2.5 shadow-inner">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-600/90 text-white font-black text-xs shrink-0">
                  {user.name?.[0]?.toUpperCase() || 'P'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-rose-300/80 truncate capitalize">
                    {user.role} • {user.pressProfile?.pressName || 'PrintOS'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => logout()}
                title="লগআউট (Log Out)"
                className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors shrink-0"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 border border-slate-800/60 px-3 py-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-rose-950/60 border border-rose-800/40 text-rose-400">
              <Boxes className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-300">PrintOS v1.0.0</span>
              <span className="text-[10px] text-slate-500">Dhaka</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
