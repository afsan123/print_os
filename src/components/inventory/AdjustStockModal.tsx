'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowDownRight, ArrowUpRight, Package, AlertTriangle, Layers, Building2, CheckCircle2 } from 'lucide-react';
import { StockItem } from '@/types/inventory';

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockItem: StockItem | null;
  onAdjust: (stockId: string, type: 'in' | 'out', reams: number, sheets: number, reason: string) => void;
}

export const AdjustStockModal: React.FC<AdjustStockModalProps> = ({
  isOpen,
  onClose,
  stockItem,
  onAdjust,
}) => {
  const [adjustType, setAdjustType] = useState<'in' | 'out'>('out');
  const [reams, setReams] = useState<number>(1);
  const [sheets, setSheets] = useState<number>(0);
  const [reason, setReason] = useState<string>('Issue to Press Machine (মেশিনে প্রিন্টের জন্য)');
  const [jobRef, setJobRef] = useState<string>('');

  useEffect(() => {
    if (adjustType === 'out') {
      setReason('Issue to Press Machine (মেশিনে প্রিন্টের জন্য)');
    } else {
      setReason('Received from Supplier / Restock (নতুন ডেলিভারি রিসিভ)');
    }
  }, [adjustType]);

  if (!isOpen || !stockItem) return null;

  const currentTotalSheets = Math.round(stockItem.reamsAvailable * 500) + (stockItem.sheetsAvailable % 500);
  const adjustTotalSheets = Math.round((Number(reams) || 0) * 500) + (Number(sheets) || 0);
  
  const projectedTotalSheets = adjustType === 'in' 
    ? currentTotalSheets + adjustTotalSheets 
    : Math.max(0, currentTotalSheets - adjustTotalSheets);

  const projectedReams = +(projectedTotalSheets / 500).toFixed(2);
  const isBelowMin = projectedReams < stockItem.minThresholdReams;
  const isInsufficient = adjustType === 'out' && adjustTotalSheets > currentTotalSheets;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isInsufficient) return;
    const finalReason = jobRef.trim() ? `${reason} (Job: ${jobRef.trim()})` : reason;
    onAdjust(stockItem.id, adjustType, Number(reams) || 0, Number(sheets) || 0, finalReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0B224F] border border-[#E8EDF5] dark:border-[#162E63] shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8EDF5] dark:border-[#162E63] bg-slate-50/70 dark:bg-[#071A3D]">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              adjustType === 'in'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
            }`}>
              {adjustType === 'in' ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                Stock Adjustment (স্টক সমন্বয়)
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#D8E3FF]/70">
                Log paper movement in or out of your godown
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#122A59] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selected Paper Item Summary */}
        <div className="p-6 border-b border-[#E8EDF5] dark:border-[#162E63] bg-slate-50/40 dark:bg-[#081b40]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#D8E3FF]/50">
                Selected Stock Item
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {stockItem.paperType}
              </h4>
              <p className="text-xs text-slate-600 dark:text-[#D8E3FF]/80 mt-0.5">
                {stockItem.gsm} GSM • {stockItem.fullSheetSize} • <span className="font-medium text-[#1D5DFF] dark:text-[#23A8FF]">{stockItem.godownName}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#D8E3FF]/50">
                Current Available
              </span>
              <div className="font-mono font-bold text-slate-900 dark:text-white text-base">
                {stockItem.reamsAvailable} Reams
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#D8E3FF]/70">
                ≈ {stockItem.sheetsAvailable.toLocaleString()} sheets
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Action Type Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-[#D8E3FF] mb-2 uppercase tracking-wider">
              Movement Type (লেনদেনের ধরন)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAdjustType('out')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  adjustType === 'out'
                    ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-[#162E63] bg-white dark:bg-[#081B40] text-slate-700 dark:text-[#D8E3FF] hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-lg ${adjustType === 'out' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-xs">Stock Out / Issue</div>
                  <div className="text-[11px] text-slate-500 dark:text-[#D8E3FF]/60">মেশিনে কাগজ ইস্যু / খরচ</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAdjustType('in')}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                  adjustType === 'in'
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-[#162E63] bg-white dark:bg-[#081B40] text-slate-700 dark:text-[#D8E3FF] hover:border-slate-300'
                }`}
              >
                <div className={`p-2 rounded-lg ${adjustType === 'in' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                  <ArrowDownRight className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-xs">Stock In / Receive</div>
                  <div className="text-[11px] text-slate-500 dark:text-[#D8E3FF]/60">গুদামে কাগজ জমা / ফেরত</div>
                </div>
              </button>
            </div>
          </div>

          {/* Quantity Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8E3FF] mb-1.5">
                Reams (রিম) <span className="text-[#FF008C]">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={reams}
                  onChange={(e) => setReams(parseFloat(e.target.value) || 0)}
                  className="w-full rounded-xl border border-slate-200 dark:border-[#162E63] bg-white dark:bg-[#071A3D] px-3.5 py-2.5 text-sm font-mono font-bold text-slate-900 dark:text-white focus:border-[#1D5DFF] focus:outline-hidden"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-sans font-medium">
                  Reams
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8E3FF] mb-1.5">
                Loose Sheets (তা / শিট)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="499"
                  value={sheets}
                  onChange={(e) => setSheets(parseInt(e.target.value, 10) || 0)}
                  className="w-full rounded-xl border border-slate-200 dark:border-[#162E63] bg-white dark:bg-[#071A3D] px-3.5 py-2.5 text-sm font-mono text-slate-900 dark:text-white focus:border-[#1D5DFF] focus:outline-hidden"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-sans font-medium">
                  Sheets
                </span>
              </div>
            </div>
          </div>

          {/* Reason & Job Reference */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8E3FF] mb-1.5">
                Reason / Note (বিবরণ / কারণ)
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Issue to Heidelberg 4-Color, Damage, Supplier delivery"
                className="w-full rounded-xl border border-slate-200 dark:border-[#162E63] bg-white dark:bg-[#071A3D] px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-[#1D5DFF] focus:outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#D8E3FF] mb-1.5">
                Job Card Reference (ঐচ্ছিক জব নম্বর)
              </label>
              <input
                type="text"
                value={jobRef}
                onChange={(e) => setJobRef(e.target.value)}
                placeholder="e.g. JC-2026-0034"
                className="w-full rounded-xl border border-slate-200 dark:border-[#162E63] bg-white dark:bg-[#071A3D] px-3.5 py-2.5 text-xs font-mono text-slate-900 dark:text-white focus:border-[#1D5DFF] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Projected Live Balance Card */}
          <div className={`p-4 rounded-xl border transition-all ${
            isInsufficient
              ? 'border-rose-300 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200'
              : isBelowMin
              ? 'border-amber-300 bg-amber-50/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
              : 'border-[#1D5DFF]/20 bg-[#1D5DFF]/5 dark:bg-[#1D5DFF]/10 text-slate-900 dark:text-white'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold">
                {isInsufficient ? (
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                ) : isBelowMin ? (
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-[#1D5DFF]" />
                )}
                <span>Projected New Balance (পরবর্তী সম্ভাব্য স্টক)</span>
              </div>
              <div className="font-mono font-bold text-sm">
                {projectedReams} Reams ({projectedTotalSheets.toLocaleString()} sheets)
              </div>
            </div>

            {isInsufficient && (
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-2 font-medium">
                ⚠️ গুদামে পর্যাপ্ত স্টক নেই! বর্তমান উপলব্ধ {stockItem.reamsAvailable} রিমের চেয়ে বেশি ইস্যু করা যাবে না।
              </p>
            )}

            {!isInsufficient && isBelowMin && (
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
                ⚠️ এই ইস্যুর পর স্টক ন্যূনতম লেভেলের ({stockItem.minThresholdReams} রিম) নিচে নেমে যাবে। নতুন কাগজ ক্রয়ের অর্ডার দিন।
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-[#162E63] px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-[#D8E3FF] hover:bg-slate-50 dark:hover:bg-[#122A59] transition-colors"
            >
              Cancel (বাতিল)
            </button>
            <button
              type="submit"
              disabled={isInsufficient || (reams <= 0 && sheets <= 0)}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                adjustType === 'in'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-[#1D5DFF] hover:bg-[#154cdb]'
              }`}
            >
              <span>{adjustType === 'in' ? 'Confirm Stock In (জমা করুন)' : 'Confirm Issue Out (ইস্যু করুন)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
