'use client';

import React, { useState } from 'react';
import {
  Calculator,
  MessageCircle,
  FileText,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { CalculationResult } from '@/types/estimator';

interface CostSummaryCardProps {
  calc: CalculationResult;
  profitMarginPercent: number;
  onProfitMarginChange: (margin: number) => void;
  onOpenWhatsAppModal: () => void;
  onCreateInvoiceAndJobCard: (advance?: number) => void;
}

export const CostSummaryCard: React.FC<CostSummaryCardProps> = ({
  calc,
  profitMarginPercent,
  onProfitMarginChange,
  onOpenWhatsAppModal,
  onCreateInvoiceAndJobCard,
}) => {
  const [advanceAmount, setAdvanceAmount] = useState<number>(0);
  const totalSellingPrice = calc.finalSellingPrice;
  const dueAfterAdvance = Math.max(0, totalSellingPrice - advanceAmount);

  // Format numbers with commas
  const formatCurrency = (val: number) => {
    return val.toLocaleString('en-IN');
  };

  return (
    <div className="sticky top-20 rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] p-6 sm:p-7 shadow-2xs space-y-6">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E8EDF5] dark:border-[#162E63]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#23A8FF] to-[#1D5DFF] text-white shadow-xs">
            <Calculator className="h-4.5 w-4.5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Cost Summary</h2>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/70 dark:border-emerald-800/60">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live calculation
        </span>
      </div>

      {/* Itemized Production Cost Rows */}
      <div className="space-y-3 text-xs text-slate-600 dark:text-[#D8E3FF]/80">
        {/* Paper Cost */}
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-[#D8E3FF]/80">Paper Cost</span>
          <span className="font-semibold text-slate-900 dark:text-white font-mono text-[13px]">
            ৳ {formatCurrency(calc.paperCost)}
          </span>
        </div>

        {/* CTP Plates (if separate) */}
        {calc.plateCost > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-slate-600 dark:text-[#D8E3FF]/80">
              CTP Plates ({calc.plateCount})
            </span>
            <span className="font-semibold text-slate-900 dark:text-white font-mono text-[13px]">
              ৳ {formatCurrency(calc.plateCost)}
            </span>
          </div>
        )}

        {/* Print Bill */}
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-[#D8E3FF]/80">Print Bill (ছাপা খরচ)</span>
          <span className="font-semibold text-slate-900 dark:text-white font-mono text-[13px]">
            ৳ {formatCurrency(calc.printingCost)}
          </span>
        </div>

        {/* Lamination */}
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-[#D8E3FF]/80">Lamination</span>
          <span className="font-semibold text-slate-900 dark:text-white font-mono text-[13px]">
            ৳ {formatCurrency(calc.laminationCost)}
          </span>
        </div>

        {/* Die Cutting */}
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-[#D8E3FF]/80">Die Cutting</span>
          <span className="font-semibold text-slate-900 dark:text-white font-mono text-[13px]">
            ৳ {formatCurrency(calc.dieCuttingCost)}
          </span>
        </div>

        {/* Binding */}
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-[#D8E3FF]/80">Binding</span>
          <span className="font-semibold text-slate-900 dark:text-white font-mono text-[13px]">
            ৳ {formatCurrency(calc.bindingCost)}
          </span>
        </div>

        {/* Custom Finishings */}
        {calc.customFinishingsBreakdown && calc.customFinishingsBreakdown.length > 0 && (
          calc.customFinishingsBreakdown.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-[#D8E3FF]/80 truncate max-w-[200px]" title={item.name}>
                {item.name}
              </span>
              <span className="font-semibold text-slate-900 dark:text-white font-mono text-[13px]">
                ৳ {formatCurrency(item.cost)}
              </span>
            </div>
          ))
        )}

        {/* Transport */}
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-[#D8E3FF]/80">Transport</span>
          <span className="font-semibold text-slate-900 dark:text-white font-mono text-[13px]">
            ৳ {formatCurrency(calc.transportCost)}
          </span>
        </div>

        {/* Other Expenses */}
        <div className="flex items-center justify-between">
          <span className="text-slate-600 dark:text-[#D8E3FF]/80">Other Expenses</span>
          <span className="font-semibold text-slate-900 dark:text-white font-mono text-[13px]">
            ৳ {formatCurrency(calc.otherExpensesCost)}
          </span>
        </div>

        {/* Total Production Cost */}
        <div className="pt-3.5 border-t border-[#E8EDF5] dark:border-[#162E63] flex items-center justify-between text-sm">
          <span className="font-bold text-slate-900 dark:text-[#D8E3FF]">Total Production Cost</span>
          <span className="font-bold text-slate-950 dark:text-white font-mono text-base">
            ৳ {formatCurrency(calc.totalProductionCost)}
          </span>
        </div>
      </div>

      {/* Interactive Profit Margin Slider */}
      <div className="pt-3 border-t border-[#E8EDF5] dark:border-[#162E63] space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="profit-margin-slider" className="font-bold text-slate-800 dark:text-white">
            Profit Margin
          </label>
          <span className="font-extrabold text-[#1D5DFF] dark:text-[#23A8FF] font-mono text-base">
            {profitMarginPercent}%
          </span>
        </div>

        <input
          id="profit-margin-slider"
          type="range"
          min={0}
          max={60}
          step={1}
          value={profitMarginPercent}
          onChange={(e) => onProfitMarginChange(parseInt(e.target.value) || 0)}
          className="w-full h-2.5 bg-slate-200 dark:bg-[#071A3D] rounded-lg appearance-none cursor-pointer accent-[#1D5DFF]"
        />

        {/* Quick margin pill buttons */}
        <div className="flex items-center justify-between gap-1.5 pt-1">
          {[15, 20, 25, 30, 40].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onProfitMarginChange(preset)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                profitMarginPercent === preset
                  ? 'bg-blue-50 dark:bg-[#122A59] text-[#1D5DFF] dark:text-[#23A8FF] border border-[#1D5DFF]/30 dark:border-[#23A8FF]/50 shadow-2xs'
                  : 'bg-slate-100 dark:bg-[#071A3D] text-slate-600 dark:text-[#D8E3FF]/70 hover:bg-slate-200 dark:hover:bg-[#122A59]'
              }`}
            >
              {preset}%
            </button>
          ))}
        </div>

        {/* Calculated Profit Amount Row */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 dark:bg-[#071A3D] border border-blue-100/90 dark:border-[#162E63] text-xs mt-2">
          <span className="font-semibold text-[#1D5DFF] dark:text-[#23A8FF]">Profit Amount</span>
          <span className="font-bold text-[#1D5DFF] dark:text-white font-mono text-sm">
            ৳ {formatCurrency(calc.profitAmount)}
          </span>
        </div>
      </div>

      {/* Final Selling Price Highlight Box */}
      <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800/80 bg-[#f0fdf4] dark:bg-[#06261d] p-5 shadow-2xs space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
          Final Selling Price
        </div>
        <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-emerald-950 dark:text-emerald-50">
          ৳ {formatCurrency(calc.finalSellingPrice)}
        </div>
        <div className="pt-2.5 border-t border-emerald-200/80 dark:border-emerald-900/60 flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-[#D8E3FF]/80 font-medium">Per Piece Cost</span>
          <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
            ৳ {calc.perPieceCost.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Optional Advance Deposit Section */}
      <div className="rounded-xl border border-[#E8EDF5] dark:border-[#162E63] bg-[#F5F7FA] dark:bg-[#071A3D] p-3.5 space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <label className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
            <span>Advance Deposit (অগ্রিম জমা)</span>
            <span className="text-[10px] font-normal text-slate-500 dark:text-[#D8E3FF]/60 bg-slate-200/70 dark:bg-[#0B224F] px-1.5 py-0.5 rounded">
              Optional (ঐচ্ছিক)
            </span>
          </label>
          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
            ৳ {advanceAmount.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">
              ৳
            </span>
            <input
              type="number"
              min={0}
              max={totalSellingPrice}
              value={advanceAmount || ''}
              placeholder="0 (ঐচ্ছিক অগ্রিম)"
              onChange={(e) => setAdvanceAmount(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full h-8.5 pl-6 pr-3 rounded-lg border border-slate-300 dark:border-[#162E63] bg-white dark:bg-[#0B224F] font-mono font-bold text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#1D5DFF]"
            />
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setAdvanceAmount(0)}
              className={`px-2 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                advanceAmount === 0
                  ? 'bg-[#071A3D] text-white dark:bg-[#1D5DFF]'
                  : 'bg-slate-200 dark:bg-[#0B224F] text-slate-700 dark:text-[#D8E3FF] hover:bg-slate-300'
              }`}
            >
              0
            </button>
            <button
              type="button"
              onClick={() => setAdvanceAmount(Math.round(totalSellingPrice * 0.3))}
              className={`px-2 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                advanceAmount === Math.round(totalSellingPrice * 0.3)
                  ? 'bg-[#1D5DFF] text-white'
                  : 'bg-blue-50 dark:bg-[#0B224F] text-[#1D5DFF] dark:text-[#23A8FF] hover:bg-blue-100'
              }`}
            >
              30%
            </button>
            <button
              type="button"
              onClick={() => setAdvanceAmount(Math.round(totalSellingPrice * 0.5))}
              className={`px-2 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                advanceAmount === Math.round(totalSellingPrice * 0.5)
                  ? 'bg-[#1D5DFF] text-white'
                  : 'bg-blue-50 dark:bg-[#0B224F] text-[#1D5DFF] dark:text-[#23A8FF] hover:bg-blue-100'
              }`}
            >
              50%
            </button>
          </div>
        </div>

        {advanceAmount > 0 && (
          <div className="pt-1.5 border-t border-[#E8EDF5] dark:border-[#162E63] flex justify-between text-[11px]">
            <span className="text-slate-500 dark:text-[#D8E3FF]/70">Due at Delivery (বকেয়া):</span>
            <span className="font-mono font-bold text-[#FF008C]">
              ৳ {dueAfterAdvance.toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-1">
        {/* Send WhatsApp Quotation Button */}
        <button
          onClick={onOpenWhatsAppModal}
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-emerald-600 dark:border-emerald-500 bg-white dark:bg-[#071A3D] hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 py-3 text-xs sm:text-sm font-bold transition-all shadow-2xs"
        >
          <MessageCircle className="h-4.5 w-4.5 text-emerald-600" />
          <span>Send WhatsApp Quotation</span>
        </button>

        {/* Create Invoice & Job Card Button */}
        <button
          onClick={() => onCreateInvoiceAndJobCard(advanceAmount)}
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1D5DFF] hover:bg-[#154cdb] text-white py-3 text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-md hover:shadow-[#1D5DFF]/25 active:scale-[0.98]"
        >
          <FileText className="h-4.5 w-4.5" />
          <span>Create Invoice & Job Card</span>
        </button>
      </div>
    </div>
  );
};
