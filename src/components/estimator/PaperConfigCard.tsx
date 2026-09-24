'use client';

import React from 'react';
import { Layers, Info, Package, Sparkles } from 'lucide-react';
import { PaperConfig } from '@/types/estimator';
import { PAPER_TYPES, FULL_SHEET_SIZES } from '@/lib/constants';

interface PaperConfigCardProps {
  config: PaperConfig;
  onUpdate: (patch: Partial<PaperConfig>) => void;
}

const PRESS_PAPER_PRESETS = [
  {
    name: 'Leaflet (লিফলেট)',
    paperType: 'Art Paper',
    gsm: 150,
    fullSheetSize: '23" × 36"',
    piecesPerFullSheet: 8,
    pricePerReam: 4100,
  },
  {
    name: 'Visiting Card (কার্ড)',
    paperType: 'Art Card',
    gsm: 300,
    fullSheetSize: '22" × 28"',
    piecesPerFullSheet: 24,
    pricePerReam: 5400,
  },
  {
    name: 'Brochure (ব্রোশিওর)',
    paperType: 'Art Paper',
    gsm: 150,
    fullSheetSize: '25" × 37"',
    piecesPerFullSheet: 4,
    pricePerReam: 4300,
  },
  {
    name: 'Book/Pad (বই/প্যাড)',
    paperType: 'Offset Paper',
    gsm: 80,
    fullSheetSize: '23" × 36"',
    piecesPerFullSheet: 16,
    pricePerReam: 2600,
  },
  {
    name: 'Box Carton (কার্টন)',
    paperType: 'Duplex Board',
    gsm: 350,
    fullSheetSize: '28" × 40"',
    piecesPerFullSheet: 6,
    pricePerReam: 6800,
  },
];

export const PaperConfigCard: React.FC<PaperConfigCardProps> = ({
  config,
  onUpdate,
}) => {
  const handlePaperTypeChange = (typeName: string) => {
    const found = PAPER_TYPES.find((p) => p.label === typeName);
    if (found) {
      onUpdate({
        paperType: found.label,
        gsm: found.defaultGsm,
        pricePerReam: found.defaultReamPrice,
        pricePerSheet: +(found.defaultReamPrice / 500).toFixed(2),
      });
    } else {
      onUpdate({ paperType: typeName });
    }
  };

  const handleApplyPreset = (p: typeof PRESS_PAPER_PRESETS[0]) => {
    onUpdate({
      paperType: p.paperType,
      gsm: p.gsm,
      fullSheetSize: p.fullSheetSize,
      piecesPerFullSheet: p.piecesPerFullSheet,
      pricePerReam: p.pricePerReam,
      pricePerSheet: +(p.pricePerReam / 500).toFixed(2),
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs transition-all hover:border-slate-300">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {/* Circular Badge 2 (Emerald) */}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#059669] text-xs font-bold text-white shadow-2xs">
            2
          </span>
          <Layers className="h-4 w-4 text-slate-500" />
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Paper Configuration (কাগজের হিসাব ও নির্বাচন)
            </h2>
          </div>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Select paper and calculate yield
        </span>
      </div>

      {/* Quick Press Presets Row */}
      <div className="mt-4 pt-1 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 mr-1">
          <Sparkles className="h-3 w-3 text-emerald-600" />
          <span>Quick Presets:</span>
        </span>
        {PRESS_PAPER_PRESETS.map((preset) => {
          const isActive =
            config.paperType === preset.paperType &&
            config.fullSheetSize === preset.fullSheetSize &&
            config.piecesPerFullSheet === preset.piecesPerFullSheet;
          return (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all shadow-2xs ${
                isActive
                  ? 'bg-[#059669] text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {preset.name}
            </button>
          );
        })}
      </div>

      {/* Row 1: Paper Type, Full Sheet Size, and 3D Visual Box */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Paper Type & Sheet Size Dropdowns */}
        <div className="sm:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Paper Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Paper Type</label>
              <select
                value={config.paperType}
                onChange={(e) => handlePaperTypeChange(e.target.value)}
                className="w-full h-10.5 px-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all shadow-2xs cursor-pointer truncate"
              >
                {PAPER_TYPES.map((pt) => (
                  <option key={pt.id} value={pt.label}>
                    {pt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Full Sheet Size */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Full Sheet Size</label>
              <select
                value={config.fullSheetSize}
                onChange={(e) => onUpdate({ fullSheetSize: e.target.value })}
                className="w-full h-10.5 px-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all shadow-2xs cursor-pointer truncate"
              >
                {FULL_SHEET_SIZES.map((sz) => (
                  <option key={sz} value={sz}>
                    {sz}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Visual Box: Paper Ream Stack Graphic with GSM Badge */}
        <div className="sm:col-span-4 flex flex-col items-center justify-center rounded-xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-slate-50 to-slate-100/70 dark:from-slate-900 dark:to-slate-950 dark:bg-slate-900 p-3 text-center shadow-2xs">
          {/* Isometric Paper Ream Graphic */}
          <div className="relative my-1 flex flex-col items-center justify-center">
            <div className="relative w-24 h-12">
              <div className="absolute inset-x-2 bottom-0 h-9 rounded-sm bg-slate-300 dark:bg-slate-700 shadow-sm transform -skew-x-12" />
              <div className="absolute inset-x-2 bottom-1 h-9 rounded-sm bg-slate-200 dark:bg-slate-600 transform -skew-x-12" />
              <div className="absolute inset-x-2 bottom-2 h-9 rounded-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 shadow transform -skew-x-12" />
              <div className="absolute inset-y-1 left-9 w-6 bg-rose-800/80 rounded-2xs transform -skew-x-12 opacity-80" />
            </div>

            {/* GSM Pill Badge */}
            <div className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-[#059669] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-2xs">
              <span>{config.gsm} GSM</span>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[130px]">
              {config.paperType.split(' ')[0]} Paper
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Paper Price Mode Toggle (Radio) */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <label className="block text-xs font-semibold text-slate-700 mb-2.5">Paper Price</label>
        <div className="flex flex-wrap items-center gap-7 text-sm">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="radio"
              name="paperPriceMode"
              checked={config.priceMode === 'ream'}
              onChange={() => onUpdate({ priceMode: 'ream' })}
              className="h-4.5 w-4.5 text-[#881337] focus:ring-rose-500 border-slate-300 accent-[#881337]"
            />
            <span className="text-slate-800 font-medium">Per Ream (রিম)</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="radio"
              name="paperPriceMode"
              checked={config.priceMode === 'sheet'}
              onChange={() => onUpdate({ priceMode: 'sheet' })}
              className="h-4.5 w-4.5 text-[#881337] focus:ring-rose-500 border-slate-300 accent-[#881337]"
            />
            <span className="text-slate-800 font-medium">Per Full Sheet (শিট)</span>
          </label>
        </div>
      </div>

      {/* Row 3: Price Input & Pieces Per Full Sheet */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            {config.priceMode === 'ream' ? 'Price per Ream (৳)' : 'Price per Sheet (৳)'}
          </label>
          <input
            type="number"
            min={0}
            step={config.priceMode === 'ream' ? 50 : 0.5}
            value={config.priceMode === 'ream' ? config.pricePerReam || '' : config.pricePerSheet || ''}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0;
              if (config.priceMode === 'ream') {
                onUpdate({ pricePerReam: val, pricePerSheet: +(val / 500).toFixed(2) });
              } else {
                onUpdate({ pricePerSheet: val, pricePerReam: Math.round(val * 500) });
              }
            }}
            placeholder="3,500"
            className="w-full h-10.5 px-3.5 rounded-xl border border-slate-300 bg-white text-sm font-medium font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all shadow-2xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Pieces Per Full Sheet</label>
          <input
            type="number"
            min={1}
            value={config.piecesPerFullSheet || ''}
            onChange={(e) => onUpdate({ piecesPerFullSheet: Math.max(1, parseInt(e.target.value) || 1) })}
            placeholder="24"
            className="w-full h-10.5 px-3.5 rounded-xl border border-slate-300 bg-white text-sm font-medium font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Helper Banner: Auto 5% wastage buffer */}
      <div className="mt-5 flex items-center justify-between rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-900/50 px-4 py-2.5 text-xs text-sky-900 dark:text-sky-200">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 text-sky-600 dark:text-sky-400 shrink-0" />
          <span>Auto 5% wastage buffer will be added to ensure safe production yield.</span>
        </div>
        <span className="rounded-md bg-sky-100 dark:bg-sky-900/70 border border-sky-300 dark:border-sky-800 px-2.5 py-0.5 text-[11px] font-mono font-bold text-sky-800 dark:text-sky-200">
          +5%
        </span>
      </div>
    </div>
  );
};
