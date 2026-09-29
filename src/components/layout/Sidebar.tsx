'use client';

import React from 'react';
import Image from 'next/image';
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
  Package,
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
  | 'inventory'
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
  isInventoryEnabled?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  isInventoryEnabled = false,
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
      title: 'PURCHASES & STOCK',
      items: [
        { key: 'suppliers' as NavItemKey, label: 'Suppliers', icon: Building2 },
        { key: 'purchase_bills' as NavItemKey, label: 'Purchase Bills', icon: FileSpreadsheet },
        {
          key: 'inventory' as NavItemKey,
          label: isInventoryEnabled ? 'Godown Stock (গুদাম)' : 'Godown Stock (Optional)',
          icon: Package,
        },
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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#071A3D] text-[#D8E3FF] border-r border-[#10244C] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex flex-col px-6 py-5 border-b border-[#10244C]">
          <Image
            src="/logo-white.png?v=4"
            alt="PrintOS Logo"
            width={200}
            height={67}
            priority
            unoptimized
            className="h-10 sm:h-10.5 w-auto max-w-[190px] object-contain self-start"
          />
          <p className="text-[10.5px] font-medium text-[#D8E3FF]/70 mt-1.5 pl-0.5 tracking-wide">
            Manage. Print. Grow.
          </p>
        </div>

        {/* Scrollable Navigation */}
        <nav aria-label="Primary navigation" className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-[#10244C]">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              {sec.title && (
                <div className="px-3 pb-1 pt-2 text-[10px] font-bold tracking-wider text-[#D8E3FF]/50 uppercase">
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
                      className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all ${
                        isActive
                          ? 'bg-[#1D5DFF] text-white shadow-sm font-semibold'
                          : 'text-[#D8E3FF]/80 hover:bg-[#122A59] hover:text-white'
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-white'
                            : 'text-[#D8E3FF]/60 group-hover:text-white'
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
          <div className="pt-2 border-t border-[#10244C]">
            <button
              onClick={() => {
                onSelectTab('settings');
                onCloseMobile?.();
              }}
              aria-current={activeTab === 'settings' ? 'page' : undefined}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#1D5DFF] text-white font-semibold shadow-sm'
                  : 'text-[#D8E3FF]/80 hover:bg-[#122A59] hover:text-white'
              }`}
            >
              <Settings
                className={`h-4 w-4 shrink-0 ${
                  activeTab === 'settings' ? 'text-white' : 'text-[#D8E3FF]/60 group-hover:text-white'
                }`}
              />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        {/* Footer Area with User Profile & Location Tag */}
        <div className="p-3 border-t border-[#10244C] bg-[#051430] space-y-2">
          {user && (
            <div className="flex items-center justify-between rounded-xl bg-[#071A3D] border border-[#162E63] p-2.5 shadow-inner">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#23A8FF] to-[#1D5DFF] text-white font-black text-xs shrink-0">
                  {user.name?.[0]?.toUpperCase() || 'P'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate leading-tight">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-[#23A8FF] truncate capitalize">
                    {user.role} • {user.pressProfile?.pressName || 'PrintOS'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => logout()}
                title="লগআউট (Log Out)"
                className="h-7 w-7 rounded-lg flex items-center justify-center text-[#D8E3FF]/60 hover:text-[#FF008C] hover:bg-[#122A59] transition-colors shrink-0"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3 rounded-xl bg-[#071A3D]/60 border border-[#162E63]/80 px-3 py-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#0B224F] border border-[#162E63] text-[#23A8FF]">
              <Boxes className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#D8E3FF]">PrintOS v1.0.0</span>
              <span className="text-[10px] font-mono text-[#D8E3FF]/50">Dhaka</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
