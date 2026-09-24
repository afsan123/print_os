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
} from 'lucide-react';
import { NavItemKey } from '@/components/layout/Sidebar';
import { ClientRecord } from '@/types/estimator';

interface ERPViewsProps {
  activeTab: NavItemKey;
  onGoToEstimator: () => void;
  clients: ClientRecord[];
}

export const ERPViews: React.FC<ERPViewsProps> = ({
  activeTab,
  onGoToEstimator,
  clients,
}) => {
  // Format currency
  const fmt = (v: number) => `৳ ${v.toLocaleString('en-IN')}`;

  if (activeTab === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Active Print Jobs
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Printer className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 font-mono">18</span>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                <ArrowUpRight className="h-3 w-3" /> +4 new jobs today
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Monthly Press Revenue
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <DollarSign className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 font-mono">৳ 1,485,200</span>
              <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
                <ArrowUpRight className="h-3 w-3" /> 18.4% vs last month
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Paper Inventory In Stock
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Layers className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 font-mono">420 Reams</span>
              <p className="text-xs text-slate-500 mt-1">Art Paper & Board</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase">
                Active Client Accounts
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                <Users className="h-4 w-4" />
              </span>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-slate-900 font-mono">
                {clients.length + 24}
              </span>
              <p className="text-xs text-slate-500 mt-1">Dhaka Commercial District</p>
            </div>
          </div>
        </div>

        {/* Quick Estimator CTA Card */}
        <div className="rounded-xl border border-rose-200 bg-gradient-to-r from-rose-900 via-rose-950 to-slate-900 p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="rounded bg-rose-800/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-200">
              FEATURED TOOL
            </span>
            <h3 className="text-xl font-bold">Smart Print Cost Estimator</h3>
            <p className="text-sm text-rose-200/80 max-w-xl">
              Calculate live paper yield, CTP plates, machine impressions, lamination, die cutting, and create instant commercial invoices.
            </p>
          </div>
          <button
            onClick={onGoToEstimator}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-[#881337] px-5 py-2.5 text-xs font-bold hover:bg-rose-50 transition-colors shadow-sm"
          >
            Open Smart Estimator
          </button>
        </div>

        {/* Recent Active Production Jobs Table */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900">Current Press Jobs</h3>
            <span className="text-xs text-slate-500">Auto-refreshed</span>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="p-3">Job ID</th>
                  <th className="p-3">Client & Title</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Stage</th>
                  <th className="p-3">Total (৳)</th>
                  <th className="p-3">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-bold text-rose-900">#JC-2025-0842</td>
                  <td className="p-3">
                    <p className="font-bold text-slate-800">ABC Pharma Ltd.</p>
                    <p className="text-[11px] text-slate-500">Company Leaflet (150 GSM Art)</p>
                  </td>
                  <td className="p-3 font-mono">10,000 pcs</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                      Offset Printing
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-900">৳ 52,125</td>
                  <td className="p-3 text-slate-600">19 Sep 2025</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-bold text-rose-900">#JC-2025-0839</td>
                  <td className="p-3">
                    <p className="font-bold text-slate-800">Beximco Consumer Brands</p>
                    <p className="text-[11px] text-slate-500">Executive Visiting Cards (Art Card 300)</p>
                  </td>
                  <td className="p-3 font-mono">1,000 pcs</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      Die Cutting
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-900">৳ 12,450</td>
                  <td className="p-3 text-slate-600">18 Sep 2025</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="p-3 font-mono font-bold text-rose-900">#JC-2025-0835</td>
                  <td className="p-3">
                    <p className="font-bold text-slate-800">Square Healthcare</p>
                    <p className="text-[11px] text-slate-500">Corporate Tri-Fold Brochure</p>
                  </td>
                  <td className="p-3 font-mono">5,000 pcs</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Completed & Ready
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-900">৳ 48,600</td>
                  <td className="p-3 text-slate-600">16 Sep 2025</td>
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
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{currentMeta.title}</h2>
          <p className="text-xs text-slate-500">{currentMeta.subtitle}</p>
        </div>
        <button
          onClick={onGoToEstimator}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#881337] px-4 py-2 text-xs font-bold text-white hover:bg-[#700f2e] transition-colors shadow-2xs self-start"
        >
          <span>Open Smart Estimator</span>
        </button>
      </div>

      {activeTab === 'clients' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2 hover:border-slate-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                  <p className="text-xs text-slate-500">{c.company}</p>
                </div>
                <span className="rounded bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 text-[10px] font-semibold">
                  Active
                </span>
              </div>
              <div className="text-xs space-y-0.5 text-slate-600 pt-2 border-t border-slate-100">
                <p>Phone: {c.phone}</p>
                <p>Email: {c.email}</p>
                <p className="truncate">Address: {c.address}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-2xs space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <Layers className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-bold text-slate-900">{currentMeta.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This module is synchronized with the Smart Estimator engine. You can create new estimates, convert them directly into job cards, and generate invoices immediately.
            </p>
          </div>
          <button
            onClick={onGoToEstimator}
            className="rounded-lg bg-[#881337] px-4 py-2 text-xs font-bold text-white hover:bg-[#700f2e] transition-colors"
          >
            Go to Smart Print Cost Estimator
          </button>
        </div>
      )}
    </div>
  );
};
