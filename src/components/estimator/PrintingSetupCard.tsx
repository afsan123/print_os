'use client';

import React from 'react';
import { Printer } from 'lucide-react';
import { PressConfig, PrintColorMode, PrintSidesMode } from '@/types/estimator';

interface PrintingSetupCardProps {
  config: PressConfig;
  onUpdate: (patch: Partial<PressConfig>) => void;
}

export const PrintingSetupCard: React.FC<PrintingSetupCardProps> = ({
  config,
  onUpdate,
}) => {
  const colorOptions: PrintColorMode[] = ['1 Color', '2 Color', '3 Color', '4 Color (CMYK)'];
  const sidesOptions: PrintSidesMode[] = ['One Side', 'Two Side (Work & Turn)'];

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs transition-all hover:border-slate-300">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {/* Circular Badge 3 (Blue) */}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563eb] text-xs font-bold text-white shadow-2xs">
            3
          </span>
          <Printer className="h-4 w-4 text-slate-500" />
          <h2 className="text-base font-bold text-slate-900">Printing Setup</h2>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Set your printing specifications
        </span>
      </div>

      {/* Colors Radio Group */}
      <div className="mt-5 space-y-2">
        <label className="block text-xs font-semibold text-slate-700">Colors</label>
        <div className="flex flex-wrap items-center gap-6 text-sm">
          {colorOptions.map((opt) => (
            <label key={opt} className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="radio"
                name="printColors"
                checked={config.colors === opt}
                onChange={() => onUpdate({ colors: opt })}
                className="h-4.5 w-4.5 text-[#1D5DFF] focus:ring-[#1D5DFF] border-slate-300 accent-[#1D5DFF]"
              />
              <span className="text-slate-800 font-medium">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sides Radio Group */}
      <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
        <label className="block text-xs font-semibold text-slate-700">Sides</label>
        <div className="flex flex-wrap items-center gap-6 text-sm">
          {sidesOptions.map((opt) => (
            <label key={opt} className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="radio"
                name="printSides"
                checked={config.sides === opt}
                onChange={() => onUpdate({ sides: opt })}
                className="h-4.5 w-4.5 text-[#1D5DFF] focus:ring-[#1D5DFF] border-slate-300 accent-[#1D5DFF]"
              />
              <span className="text-slate-800 font-medium">{opt}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Print Bill Input */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <div className="space-y-1.5 max-w-sm">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">
              Print Bill (৳) <span className="text-slate-400 font-normal">(ছাপা খরচ / বিল)</span>
            </label>
            <span className="text-[11px] text-slate-400">Total printing charges</span>
          </div>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">৳</span>
            <input
              type="number"
              min={0}
              step={50}
              value={config.printBill ?? ''}
              onChange={(e) => onUpdate({ printBill: parseFloat(e.target.value) || 0 })}
              placeholder="3400"
              className="w-full h-10.5 pl-8 pr-3.5 rounded-xl border border-slate-300 bg-white text-sm font-medium font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all shadow-2xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
