'use client';

import React, { useState } from 'react';
import {
  TrendingDown,
  Search,
  Plus,
  Zap,
  Wrench,
  Building,
  Truck,
  Coffee,
  CheckCircle2,
  Calendar,
  CreditCard,
  Layers,
} from 'lucide-react';
import { ExpenseRecord, ExpenseCategory } from '@/types/finance';

interface ExpensesViewProps {
  expenses: ExpenseRecord[];
  onOpenLogExpenseModal: () => void;
  onGoToEstimator: () => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  onOpenLogExpenseModal,
  onGoToEstimator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const fmt = (v: number) => `৳ ${Math.round(v).toLocaleString('en-IN')}`;

  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const powerExpenses = expenses
    .filter((e) => e.category === 'electricity_power')
    .reduce((acc, e) => acc + e.amount, 0);
  const maintenanceExpenses = expenses
    .filter((e) => e.category === 'machine_maintenance' || e.category === 'ink_chemicals')
    .reduce((acc, e) => acc + e.amount, 0);
  const logisticsExpenses = expenses
    .filter((e) => e.category === 'transport_logistics')
    .reduce((acc, e) => acc + e.amount, 0);

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      e.paidTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.receiptNo && e.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'electricity_power':
        return { label: 'Electricity / Power', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'machine_maintenance':
        return { label: 'Machine Repairs', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'ink_chemicals':
        return { label: 'Ink & Chemistry', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'factory_rent':
        return { label: 'Factory Rent', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'transport_logistics':
        return { label: 'Transport / Fuel', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'refreshments_tea':
        return { label: 'Tea & Snacks', color: 'bg-orange-50 text-orange-700 border-orange-200' };
      default:
        return { label: cat.replace('_', ' '), color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-700 to-slate-900 text-white shadow-sm">
            <TrendingDown className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Factory & Operational Expenses (কারখানা খরচ)
              </h1>
              <span className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-xs font-bold text-[#881337]">
                {expenses.length} Records
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Press 3-phase electricity, offset machine maintenance, plate chemicals, ink barrels, factory rent, and staff logistics
            </p>
          </div>
        </div>

        <button
          onClick={onOpenLogExpenseModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#881337] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#700f2e] transition-colors shadow-sm self-start md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Log Factory Expense</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Factory Spend
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-[#881337]">
              <TrendingDown className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">{fmt(totalExpenses)}</p>
          <p className="text-xs text-slate-500 mt-1">Operating overhead this month</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Power & Electricity
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Zap className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-amber-600 font-mono mt-2">{fmt(powerExpenses)}</p>
          <p className="text-xs text-slate-500 mt-1">3-Phase press motors</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Repairs & Consumables
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Wrench className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-blue-600 font-mono mt-2">{fmt(maintenanceExpenses)}</p>
          <p className="text-xs text-slate-500 mt-1">Rollers, ink, fountain wash</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Transport & Delivery
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Truck className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-600 font-mono mt-2">{fmt(logisticsExpenses)}</p>
          <p className="text-xs text-slate-500 mt-1">Van CNG & driver support</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expense, vendor, receipt..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#881337] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { key: 'all', label: 'All Expenses' },
            { key: 'electricity_power', label: 'Power / Electricity' },
            { key: 'machine_maintenance', label: 'Machine Repairs' },
            { key: 'ink_chemicals', label: 'Ink & Chemicals' },
            { key: 'factory_rent', label: 'Rent' },
            { key: 'transport_logistics', label: 'Transport' },
            { key: 'refreshments_tea', label: 'Tea & Snacks' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-colors whitespace-nowrap ${
                categoryFilter === cat.key
                  ? 'bg-[#881337] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="p-4">Expense ID & Date</th>
                <th className="p-4">Category</th>
                <th className="p-4">Expense Title & Description</th>
                <th className="p-4">Payee / Vendor</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Receipt / Voucher #</th>
                <th className="p-4 text-right">Amount (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No factory expenses match this filter.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => {
                  const badge = getCategoryBadge(exp.category);
                  return (
                    <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-4">
                        <p className="font-mono font-bold text-slate-900 text-xs">{exp.id}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{exp.date}</p>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block rounded-md border px-2 py-0.5 text-[10px] font-semibold ${badge.color}`}
                        >
                          {badge.label}
                        </span>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-slate-900 text-xs">{exp.title}</p>
                        <p className="text-[11px] text-slate-500 truncate max-w-sm">{exp.description}</p>
                      </td>

                      <td className="p-4 font-semibold text-slate-800">{exp.paidTo}</td>

                      <td className="p-4">
                        <span className="capitalize font-mono font-semibold text-[11px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {exp.paymentMethod}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-slate-600 text-[11px]">
                        {exp.receiptNo || '—'}
                      </td>

                      <td className="p-4 text-right font-mono font-bold text-slate-900 text-sm">
                        {fmt(exp.amount)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
