'use client';

import React from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Receipt,
  Users,
  Layers,
  Printer,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  BarChart3,
  Activity,
  Package,
} from 'lucide-react';
import { NavItemKey } from '@/components/layout/Sidebar';
import { ClientRecord } from '@/types/estimator';
import { BRAND } from '@/lib/brand';

interface ERPViewsProps {
  activeTab: NavItemKey;
  onGoToEstimator: () => void;
  clients: ClientRecord[];
  isInventoryEnabled?: boolean;
}

export const ERPViews: React.FC<ERPViewsProps> = ({
  activeTab,
  onGoToEstimator,
  clients,
  isInventoryEnabled = false,
}) => {
  // Format currency
  const fmt = (v: number) => `৳ ${v.toLocaleString('en-IN')}`;

  if (activeTab === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Production (Cyan Blue #23A8FF) */}
          <div className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] p-5 shadow-2xs hover:border-[#23A8FF]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-[#D8E3FF]/70 uppercase tracking-wider">
                Active Production
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#23A8FF]/10 text-[#23A8FF] border border-[#23A8FF]/20">
                <Printer className="h-4.5 w-4.5" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">18</span>
              <p className="text-xs text-[#10B981] mt-1 flex items-center gap-1 font-semibold">
                <ArrowUpRight className="h-3 w-3" /> +4 new jobs today
              </p>
            </div>
          </div>

          {/* Card 2: Press Revenue (PrintOS Blue #1D5DFF) */}
          <div className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] p-5 shadow-2xs hover:border-[#1D5DFF]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-[#D8E3FF]/70 uppercase tracking-wider">
                Monthly Press Revenue
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1D5DFF]/10 text-[#1D5DFF] border border-[#1D5DFF]/20">
                <DollarSign className="h-4.5 w-4.5" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">৳ 1,485,200</span>
              <p className="text-xs text-[#10B981] mt-1 flex items-center gap-1 font-semibold">
                <ArrowUpRight className="h-3 w-3" /> 18.4% vs last month
              </p>
            </div>
          </div>

          {/* Card 3: Inventory / On-Demand Paper Procurement (Optional) */}
          <div className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] p-5 shadow-2xs hover:border-[#8B5CF6]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-[#D8E3FF]/70 uppercase tracking-wider">
                {isInventoryEnabled ? 'Paper Godown Stock' : 'Paper Procurement'}
              </span>
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isInventoryEnabled ? 'bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20' : 'bg-[#23A8FF]/10 text-[#23A8FF] border border-[#23A8FF]/20'}`}>
                {isInventoryEnabled ? <Layers className="h-4.5 w-4.5" /> : <Package className="h-4.5 w-4.5" />}
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {isInventoryEnabled ? '420 Reams' : 'On-Demand'}
              </span>
              <p className="text-xs text-slate-500 dark:text-[#D8E3FF]/70 mt-1 font-medium">
                {isInventoryEnabled ? 'Art Paper, Card & Board' : 'Direct Buy per Job (ঐচ্ছিক স্টক)'}
              </p>
            </div>
          </div>

          {/* Card 4: Client Accounts (Cyan / Deep Navy Accent) */}
          <div className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] p-5 shadow-2xs hover:border-[#00C8FF]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-[#D8E3FF]/70 uppercase tracking-wider">
                Commercial Accounts
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#00C8FF]/10 text-[#00C8FF] border border-[#00C8FF]/20">
                <Users className="h-4.5 w-4.5" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {clients.length + 24}
              </span>
              <p className="text-xs text-slate-500 dark:text-[#D8E3FF]/70 mt-1 font-medium">Dhaka Commercial District</p>
            </div>
          </div>
        </div>

        {/* Data Visualization Analytics Breakdown Banner */}
        <div className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] p-6 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="h-4.5 w-4.5 text-[#1D5DFF]" />
                <span>Printing Operations & Job Health</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#D8E3FF]/70">
                Real-time job distribution across the offset printing pipeline
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-[#071A3D] text-[#1D5DFF] dark:text-[#23A8FF] font-semibold border border-[#1D5DFF]/20">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1D5DFF] animate-pulse" />
                Live Telemetry
              </span>
            </div>
          </div>

          {/* Visual Progress Stacked Bar */}
          <div className="space-y-2">
            <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-[#071A3D] overflow-hidden flex shadow-inner">
              <div style={{ width: '42%', backgroundColor: '#10B981' }} title="Completed Jobs (42%)" />
              <div style={{ width: '28%', backgroundColor: '#23A8FF' }} title="In Production (28%)" />
              <div style={{ width: '18%', backgroundColor: '#FFD400' }} title="Pending Jobs (18%)" />
              <div style={{ width: '7%', backgroundColor: '#FF008C' }} title="Delayed Jobs (7%)" />
              <div style={{ width: '5%', backgroundColor: '#8B5CF6' }} title="Awaiting Inventory (5%)" />
            </div>

            {/* Legend with exact specified Data Visualization Colors */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#1D5DFF] shrink-0" />
                <span className="text-slate-600 dark:text-[#D8E3FF]/80 font-medium">Revenue (৳1.48M)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#23A8FF] shrink-0" />
                <span className="text-slate-600 dark:text-[#D8E3FF]/80 font-medium">Production (28%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#10B981] shrink-0" />
                <span className="text-slate-600 dark:text-[#D8E3FF]/80 font-medium">Completed (42%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFD400] shrink-0" />
                <span className="text-slate-600 dark:text-[#D8E3FF]/80 font-medium">Pending (18%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FF008C] shrink-0" />
                <span className="text-slate-600 dark:text-[#D8E3FF]/80 font-medium">Delayed (7%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#8B5CF6] shrink-0" />
                <span className="text-slate-600 dark:text-[#D8E3FF]/80 font-medium">
                  {isInventoryEnabled ? 'Inventory (5%)' : 'Procurement (5%)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Estimator CTA Card - Primary Brand Gradient */}
        <div
          style={{ background: 'linear-gradient(135deg, #23A8FF 0%, #1D5DFF 50%, #071A3D 100%)' }}
          className="rounded-2xl p-6 sm:p-7 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-5 ring-1 ring-white/10"
        >
          <div className="space-y-1.5 max-w-2xl">
            <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white border border-white/20 inline-flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-[#FFD400]" />
              PrintOS Smart Estimator Engine
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Commercial Print Cost Estimator & Quotations
            </h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
              Calculate live paper yield, CTP plates, machine impressions, lamination, die cutting, and create instant commercial invoices with CMYK precision.
            </p>
          </div>
          <button
            onClick={onGoToEstimator}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-[#1D5DFF] px-6 py-3 text-xs sm:text-sm font-extrabold hover:bg-[#F5F7FA] transition-all shadow-md active:scale-[0.98] shrink-0"
          >
            Open Smart Estimator
          </button>
        </div>

        {/* Recent Active Production Jobs Table */}
        <div className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8EDF5] dark:border-[#162E63]">
            <h3 className="font-bold text-slate-900 dark:text-white">Current Press Jobs</h3>
            <span className="text-xs font-mono text-slate-500 dark:text-[#D8E3FF]/70">Auto-refreshed</span>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F5F7FA] dark:bg-[#071A3D] text-slate-500 dark:text-[#D8E3FF]/70 uppercase text-[10px] font-semibold border-b border-[#E8EDF5] dark:border-[#162E63]">
                <tr>
                  <th className="p-3">Job ID</th>
                  <th className="p-3">Client & Title</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3">Total (৳)</th>
                  <th className="p-3">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8EDF5] dark:divide-[#162E63]">
                <tr className="hover:bg-slate-50/60 dark:hover:bg-[#122A59]/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#1D5DFF] dark:text-[#23A8FF]">#JC-2025-0842</td>
                  <td className="p-3">
                    <p className="font-bold text-slate-900 dark:text-white">ABC Pharma Ltd.</p>
                    <p className="text-[11px] text-slate-500 dark:text-[#D8E3FF]/70">Company Leaflet (150 GSM Art)</p>
                  </td>
                  <td className="p-3 font-mono font-semibold text-slate-800 dark:text-[#D8E3FF]">10,000 pcs</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 text-[10px] font-bold text-[#1D5DFF] dark:text-[#23A8FF]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#1D5DFF] animate-pulse" />
                      Offset Printing
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">৳ 52,125</td>
                  <td className="p-3 text-slate-600 dark:text-[#D8E3FF]/80">19 Sep 2025</td>
                </tr>
                <tr className="hover:bg-slate-50/60 dark:hover:bg-[#122A59]/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#1D5DFF] dark:text-[#23A8FF]">#JC-2025-0839</td>
                  <td className="p-3">
                    <p className="font-bold text-slate-900 dark:text-white">Beximco Consumer Brands</p>
                    <p className="text-[11px] text-slate-500 dark:text-[#D8E3FF]/70">Executive Visiting Cards (Art Card 300)</p>
                  </td>
                  <td className="p-3 font-mono font-semibold text-slate-800 dark:text-[#D8E3FF]">1,000 pcs</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 text-[10px] font-bold text-[#F59E0B]">
                      Die Cutting
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">৳ 12,450</td>
                  <td className="p-3 text-slate-600 dark:text-[#D8E3FF]/80">18 Sep 2025</td>
                </tr>
                <tr className="hover:bg-slate-50/60 dark:hover:bg-[#122A59]/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#1D5DFF] dark:text-[#23A8FF]">#JC-2025-0835</td>
                  <td className="p-3">
                    <p className="font-bold text-slate-900 dark:text-white">Square Healthcare</p>
                    <p className="text-[11px] text-slate-500 dark:text-[#D8E3FF]/70">Corporate Tri-Fold Brochure</p>
                  </td>
                  <td className="p-3 font-mono font-semibold text-slate-800 dark:text-[#D8E3FF]">5,000 pcs</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-[10px] font-bold text-[#10B981]">
                      Completed & Ready
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">৳ 48,600</td>
                  <td className="p-3 text-slate-600 dark:text-[#D8E3FF]/80">16 Sep 2025</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Generic secondary tables for other tabs
  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    job_cards: { title: 'Job Cards Registry', subtitle: 'Manage active press dockets and job cards' },
    production_queue: { title: 'Machine Production Queue', subtitle: 'Real-time schedule for 4-color offset and CTP units' },
    invoices: { title: 'Commercial Invoices', subtitle: 'Billing, VAT invoices, and accounts receivable' },
    delivery_chalans: { title: 'Delivery Chalans', subtitle: 'Goods delivery notes and gate passes' },
    clients: { title: 'Client Directory', subtitle: 'Commercial press accounts and credit limits' },
    suppliers: { title: 'Paper & Plate Suppliers', subtitle: 'Paper mills, ink distributors, and CTP suppliers' },
    purchase_bills: { title: 'Purchase Bills', subtitle: 'Ream and raw material purchase register' },
    cash_book: { title: 'Cash Book', subtitle: 'Daily press cash inflows and factory petty cash' },
    transactions: { title: 'Transactions Ledger', subtitle: 'Bank and mobile financial service reconciliations' },
    expenses: { title: 'Factory & Operational Expenses', subtitle: 'Power, plate chemical, maintenance, and logistics' },
    payroll: { title: 'Press Payroll & Labor', subtitle: 'Machine masters, helpers, and binderies salary ledger' },
    profit_loss: { title: 'Profit & Loss Statement', subtitle: 'Net margin and gross printing revenue summary' },
    debtors: { title: 'Debtors & Receivables', subtitle: 'Aging report of unpaid commercial printing accounts' },
    sales_reports: { title: 'Sales Analytics Reports', subtitle: 'Monthly volume and order size breakdown' },
    settings: { title: 'System Settings & Press Profile', subtitle: 'Default rates, plate dimensions, and company BIN' },
  };

  const currentMeta = tabTitles[activeTab] || {
    title: 'PrintOS Enterprise Module',
    subtitle: 'Module overview and records',
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{currentMeta.title}</h2>
          <p className="text-xs text-slate-500 dark:text-[#D8E3FF]/70">{currentMeta.subtitle}</p>
        </div>
        <button
          onClick={onGoToEstimator}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#1D5DFF] hover:bg-[#154cdb] px-4 py-2.5 text-xs font-bold text-white transition-colors shadow-2xs self-start active:scale-[0.98]"
        >
          <span>Open Smart Estimator</span>
        </button>
      </div>

      {activeTab === 'clients' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] p-4 shadow-2xs space-y-2 hover:border-[#1D5DFF]/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{c.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-[#D8E3FF]/70">{c.company}</p>
                </div>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-semibold">
                  Active
                </span>
              </div>
              <div className="text-xs space-y-0.5 text-slate-600 dark:text-[#D8E3FF]/80 pt-2 border-t border-[#E8EDF5] dark:border-[#162E63]">
                <p>Phone: {c.phone}</p>
                <p>Email: {c.email}</p>
                <p className="truncate">Address: {c.address}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] p-8 text-center shadow-2xs space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-[#071A3D] text-[#1D5DFF]">
            <Layers className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-white">{currentMeta.title}</h3>
            <p className="text-xs text-slate-500 dark:text-[#D8E3FF]/70 leading-relaxed">
              This module is synchronized with the Smart Estimator engine. You can create new estimates, convert them directly into job cards, and generate invoices immediately.
            </p>
          </div>
          <button
            onClick={onGoToEstimator}
            className="rounded-xl bg-[#1D5DFF] hover:bg-[#154cdb] px-4 py-2.5 text-xs font-bold text-white transition-colors shadow-2xs"
          >
            Go to Smart Print Cost Estimator
          </button>
        </div>
      )}
    </div>
  );
};
