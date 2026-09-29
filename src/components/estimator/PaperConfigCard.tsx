'use client';

import React, { useState } from 'react';
import { Layers, Info, Sparkles, Plus, X, Maximize2 } from 'lucide-react';
import { PaperConfig } from '@/types/estimator';
import { useCustomSpecs } from '@/hooks/useCustomSpecs';

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
  const { paperTypes, sheetSizes, addPaperType, addSheetSize } = useCustomSpecs();

  // Modal / Add New State
  const [isAddingPaperType, setIsAddingPaperType] = useState(false);
  const [newPaperLabel, setNewPaperLabel] = useState('');
  const [newPaperGsm, setNewPaperGsm] = useState<number>(150);
  const [newPaperPrice, setNewPaperPrice] = useState<number>(3500);

  const [isAddingSheetSize, setIsAddingSheetSize] = useState(false);
  const [newWidthInch, setNewWidthInch] = useState<string>('24');
  const [newHeightInch, setNewHeightInch] = useState<string>('36');
  const [customSizeText, setCustomSizeText] = useState<string>('');

  const handlePaperTypeChange = (typeName: string) => {
    if (typeName === '__add_new_paper_type__') {
      setIsAddingPaperType(true);
      return;
    }
    const found = paperTypes.find((p) => p.label === typeName);
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

  const handleSheetSizeChange = (sizeVal: string) => {
    if (sizeVal === '__add_new_sheet_size__') {
      setIsAddingSheetSize(true);
      return;
    }
    onUpdate({ fullSheetSize: sizeVal });
  };

  const handleSaveNewPaperType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaperLabel.trim()) return;

    const created = addPaperType({
      label: newPaperLabel.trim(),
      defaultGsm: Number(newPaperGsm) || 120,
      defaultReamPrice: Number(newPaperPrice) || 3000,
    });

    if (created) {
      onUpdate({
        paperType: created.label,
        gsm: created.defaultGsm,
        pricePerReam: created.defaultReamPrice,
        pricePerSheet: +(created.defaultReamPrice / 500).toFixed(2),
      });
    }

    setNewPaperLabel('');
    setNewPaperGsm(150);
    setNewPaperPrice(3500);
    setIsAddingPaperType(false);
  };

  const handleSaveNewSheetSize = (e: React.FormEvent) => {
    e.preventDefault();
    let sizeStr = customSizeText.trim();
    if (!sizeStr && newWidthInch && newHeightInch) {
      sizeStr = `${newWidthInch} × ${newHeightInch} inch`;
    }
    if (!sizeStr) return;

    const added = addSheetSize(sizeStr);
    if (added) {
      onUpdate({ fullSheetSize: added });
    }

    setCustomSizeText('');
    setNewWidthInch('24');
    setNewHeightInch('36');
    setIsAddingSheetSize(false);
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
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Paper Type</label>
                <button
                  type="button"
                  onClick={() => setIsAddingPaperType(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  <span>New Paper</span>
                </button>
              </div>
              <select
                value={config.paperType}
                onChange={(e) => handlePaperTypeChange(e.target.value)}
                className="w-full h-10.5 px-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all shadow-2xs cursor-pointer truncate"
              >
                {paperTypes.map((pt) => (
                  <option key={pt.id} value={pt.label}>
                    {pt.label}
                  </option>
                ))}
                <option value="__add_new_paper_type__" className="font-bold text-emerald-700">
                  + Add New Paper Type...
                </option>
              </select>
            </div>

            {/* Full Sheet Size */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Full Sheet Size</label>
                <button
                  type="button"
                  onClick={() => setIsAddingSheetSize(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                >
                  <Plus className="h-3 w-3" />
                  <span>New Size</span>
                </button>
              </div>
              <select
                value={config.fullSheetSize}
                onChange={(e) => handleSheetSizeChange(e.target.value)}
                className="w-full h-10.5 px-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all shadow-2xs cursor-pointer truncate"
              >
                {sheetSizes.map((sz) => (
                  <option key={sz} value={sz}>
                    {sz}
                  </option>
                ))}
                <option value="__add_new_sheet_size__" className="font-bold text-emerald-700">
                  + Add Custom Sheet Size...
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Visual Box: Paper Ream Stack Graphic with GSM Badge */}
        <div className="sm:col-span-4 flex flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-gradient-to-b from-slate-50 to-slate-100/70 p-3 text-center shadow-2xs">
          <div className="relative my-1 flex flex-col items-center justify-center">
            <div className="relative w-24 h-12">
              <div className="absolute inset-x-2 bottom-0 h-9 rounded-sm bg-slate-300 shadow-sm transform -skew-x-12" />
              <div className="absolute inset-x-2 bottom-1 h-9 rounded-sm bg-slate-200 transform -skew-x-12" />
              <div className="absolute inset-x-2 bottom-2 h-9 rounded-sm bg-white border border-slate-300 shadow transform -skew-x-12" />
              <div className="absolute inset-y-1 left-9 w-6 bg-[#1D5DFF]/80 rounded-2xs transform -skew-x-12 opacity-80" />
            </div>

            <div className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-[#059669] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-2xs">
              <span>{config.gsm} GSM</span>
            </div>
            <p className="mt-1 text-[11px] font-semibold text-slate-600 truncate max-w-[130px]">
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
              className="h-4.5 w-4.5 text-[#1D5DFF] focus:ring-[#1D5DFF] border-slate-300 accent-[#1D5DFF]"
            />
            <span className="text-slate-800 font-medium">Per Ream (রিম)</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="radio"
              name="paperPriceMode"
              checked={config.priceMode === 'sheet'}
              onChange={() => onUpdate({ priceMode: 'sheet' })}
              className="h-4.5 w-4.5 text-[#1D5DFF] focus:ring-[#1D5DFF] border-slate-300 accent-[#1D5DFF]"
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
            className="w-full h-10.5 px-3.5 rounded-xl border border-slate-300 bg-white text-sm font-medium font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all shadow-2xs"
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
            className="w-full h-10.5 px-3.5 rounded-xl border border-slate-300 bg-white text-sm font-medium font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Helper Banner */}
      <div className="mt-5 flex items-center justify-between rounded-xl bg-sky-50 border border-sky-200/80 px-4 py-2.5 text-xs text-sky-900">
        <div className="flex items-center gap-2.5">
          <Info className="h-4 w-4 text-sky-600 shrink-0" />
          <span>Auto 5% wastage buffer will be added to ensure safe production yield.</span>
        </div>
        <span className="rounded-md bg-sky-100 border border-sky-300 px-2.5 py-0.5 text-[11px] font-mono font-bold text-sky-800">
          +5%
        </span>
      </div>

      {/* Modal: Add New Paper Type */}
      {isAddingPaperType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Layers className="h-4 w-4" />
                </span>
                <h3 className="font-bold text-sm text-slate-900">নতুন কাগজের ধরন যুক্ত করুন (Add Paper Type)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingPaperType(false)}
                className="text-slate-400 hover:text-slate-600 rounded p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPaperType} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Paper Name (কাগজের নাম ও বর্ণনা) *
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Kraft Paper (ক্রাফট), Sticker Sheet, Ivory Board"
                  value={newPaperLabel}
                  onChange={(e) => setNewPaperLabel(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Standard GSM (গ্রাম)
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={600}
                    value={newPaperGsm}
                    onChange={(e) => setNewPaperGsm(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Default Ream Price (৳)
                  </label>
                  <input
                    type="number"
                    min={100}
                    step={50}
                    value={newPaperPrice}
                    onChange={(e) => setNewPaperPrice(Number(e.target.value))}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingPaperType(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPaperLabel.trim()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  Save & Select Paper
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New Sheet Size */}
      {isAddingSheetSize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Maximize2 className="h-4 w-4" />
                </span>
                <h3 className="font-bold text-sm text-slate-900">নতুন শিট সাইজ যুক্ত করুন (Add Sheet Size)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingSheetSize(false)}
                className="text-slate-400 hover:text-slate-600 rounded p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewSheetSize} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sheet Dimensions (ইঞ্চিতে সাইজ)
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      step={0.5}
                      min={1}
                      placeholder="Width"
                      value={newWidthInch}
                      onChange={(e) => {
                        setNewWidthInch(e.target.value);
                        setCustomSizeText('');
                      }}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm font-mono text-slate-800 focus:outline-none focus:border-emerald-600 text-center"
                    />
                    <span className="text-[10px] text-slate-400 text-center block mt-0.5">Width (ইঞ্চি)</span>
                  </div>
                  <span className="font-bold text-slate-400 text-base">×</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      step={0.5}
                      min={1}
                      placeholder="Height"
                      value={newHeightInch}
                      onChange={(e) => {
                        setNewHeightInch(e.target.value);
                        setCustomSizeText('');
                      }}
                      className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm font-mono text-slate-800 focus:outline-none focus:border-emerald-600 text-center"
                    />
                    <span className="text-[10px] text-slate-400 text-center block mt-0.5">Height (ইঞ্চি)</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Or Custom Size Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24 × 36 inch or 610 × 860 mm"
                  value={customSizeText}
                  onChange={(e) => setCustomSizeText(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingSheetSize(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!customSizeText.trim() && (!newWidthInch || !newHeightInch)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  Add Sheet Size
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
