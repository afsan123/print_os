'use client';

import React from 'react';
import { Truck } from 'lucide-react';
import { AdditionalExpenses } from '@/types/estimator';

interface AdditionalExpensesCardProps {
  expenses: AdditionalExpenses;
  onUpdate: (patch: Partial<AdditionalExpenses>) => void;
}

export const AdditionalExpensesCard: React.FC<AdditionalExpensesCardProps> = ({
  expenses,
  onUpdate,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs transition-all hover:border-slate-300">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {/* Circular Badge 5 (Purple) */}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7c3aed] text-xs font-bold text-white shadow-2xs">
            5
          </span>
          <Truck className="h-4 w-4 text-slate-500" />
          <h2 className="text-base font-bold text-slate-900">Additional Expenses</h2>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Transport and other costs
        </span>
      </div>

      {/* 3-Column Fields Grid */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-4">
        {/* Transport */}
        <div className="sm:col-span-3 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Transport (৳)</label>
          <input
            type="number"
            min={0}
            step={100}
            value={expenses.transport || ''}
            onChange={(e) => onUpdate({ transport: parseFloat(e.target.value) || 0 })}
            placeholder="2,000"
            className="w-full h-10.5 px-3.5 rounded-xl border border-slate-300 bg-white text-sm font-medium font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all shadow-2xs"
          />
        </div>

        {/* Other Expenses */}
        <div className="sm:col-span-3 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Other Expenses (৳)</label>
          <input
            type="number"
            min={0}
            step={100}
            value={expenses.otherExpenses || ''}
            onChange={(e) => onUpdate({ otherExpenses: parseFloat(e.target.value) || 0 })}
            placeholder="1,000"
            className="w-full h-10.5 px-3.5 rounded-xl border border-slate-300 bg-white text-sm font-medium font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all shadow-2xs"
          />
        </div>

        {/* Notes (Optional) */}
        <div className="sm:col-span-6 space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Notes (Optional)</label>
          <input
            type="text"
            value={expenses.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Any special instructions or notes..."
            className="w-full h-10.5 px-3.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};
