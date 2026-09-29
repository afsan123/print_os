'use client';

import React, { useState, useEffect } from 'react';
import { X, Package, Plus, Building2, Layers, AlertCircle, Sparkles, Check, ChevronDown } from 'lucide-react';
import { StockItem } from '@/types/inventory';

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStock: (item: Omit<StockItem, 'id' | 'sheetsAvailable'> & { sheetsAvailable?: number }) => void;
}

const DEFAULT_PAPERS = [
  'Art Paper (আর্ট পেপার)',
  'Art Card (আর্ট কার্ড)',
  'Offset Paper (অফসেট পেপার)',
  'Duplex Board (ডুপ্লেক্স বোর্ড)',
  'Newsprint (নিউজপ্রিন্ট)',
  'Kraft Paper (ক্রাফট পেপার)',
  'Sticker Paper (স্টিকার শিট)',
  'Box Board (বক্স বোর্ড)',
  'Swedish Board (সুইডিশ বোর্ড)',
  'Ivory Card (আইভরি কার্ড)',
  'NCR Carbonless (এনসিআর ক্যাশ মেমো পেপার)',
];

const DEFAULT_SIZES = [
  '23 × 36 inch',
  '25 × 37 inch',
  '20 × 30 inch',
  '24 × 36 inch',
  '22 × 28 inch',
  '28 × 40 inch',
  '18 × 23 inch',
  '20 × 26 inch',
];

const DEFAULT_GODOWNS = [
  'Main Godown (প্রধান গুদাম)',
  'Press Floor Buffer (মেশিন ফ্লোর)',
  'Cutting Section (কাটিং সেকশন)',
  'Arambagh Storage (আরামবাগ গোডাউন)',
  'Fakirapool Warehouse (ফকিরাপুল গোডাউন)',
];

const CUSTOM_VALUE_TRIGGER = '__CUSTOM__';

export const AddStockModal: React.FC<AddStockModalProps> = ({
  isOpen,
  onClose,
  onAddStock,
}) => {
  // Lists with custom entries persisted in localStorage
  const [paperList, setPaperList] = useState<string[]>(DEFAULT_PAPERS);
  const [sizeList, setSizeList] = useState<string[]>(DEFAULT_SIZES);
  const [godownList, setGodownList] = useState<string[]>(DEFAULT_GODOWNS);

  // Form states
  const [paperType, setPaperType] = useState(DEFAULT_PAPERS[0]);
  const [isCustomPaper, setIsCustomPaper] = useState(false);
  const [customPaperInput, setCustomPaperInput] = useState('');

  const [gsm, setGsm] = useState<number>(150);

  const [fullSheetSize, setFullSheetSize] = useState<string>(DEFAULT_SIZES[0]);
  const [isCustomSize, setIsCustomSize] = useState(false);
  const [customSizeInput, setCustomSizeInput] = useState('');

  const [godownName, setGodownName] = useState<string>(DEFAULT_GODOWNS[0]);
  const [isCustomGodown, setIsCustomGodown] = useState(false);
  const [customGodownInput, setCustomGodownInput] = useState('');

  const [reamsAvailable, setReamsAvailable] = useState<number>(10);
  const [averageUnitCost, setAverageUnitCost] = useState<number>(3500);
  const [minThresholdReams, setMinThresholdReams] = useState<number>(4);

  // Additional custom attributes
  const [brandOrMill, setBrandOrMill] = useState<string>('');
  const [rackLocation, setRackLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [showExtraDetails, setShowExtraDetails] = useState(false);

  // Load custom persisted presets from localStorage
  useEffect(() => {
    try {
      const storedPapers = localStorage.getItem('printos_custom_papers');
      if (storedPapers) {
        const parsed = JSON.parse(storedPapers);
        setPaperList(Array.from(new Set([...DEFAULT_PAPERS, ...parsed])));
      }
      const storedSizes = localStorage.getItem('printos_custom_sizes');
      if (storedSizes) {
        const parsed = JSON.parse(storedSizes);
        setSizeList(Array.from(new Set([...DEFAULT_SIZES, ...parsed])));
      }
      const storedGodowns = localStorage.getItem('printos_custom_godowns');
      if (storedGodowns) {
        const parsed = JSON.parse(storedGodowns);
        setGodownList(Array.from(new Set([...DEFAULT_GODOWNS, ...parsed])));
      }
    } catch {
      // Ignore
    }
  }, []);

  if (!isOpen) return null;

  const handleSelectPaper = (val: string) => {
    if (val === CUSTOM_VALUE_TRIGGER) {
      setIsCustomPaper(true);
      setCustomPaperInput('');
    } else {
      setIsCustomPaper(false);
      setPaperType(val);
    }
  };

  const handleSelectSize = (val: string) => {
    if (val === CUSTOM_VALUE_TRIGGER) {
      setIsCustomSize(true);
      setCustomSizeInput('');
    } else {
      setIsCustomSize(false);
      setFullSheetSize(val);
    }
  };

  const handleSelectGodown = (val: string) => {
    if (val === CUSTOM_VALUE_TRIGGER) {
      setIsCustomGodown(true);
      setCustomGodownInput('');
    } else {
      setIsCustomGodown(false);
      setGodownName(val);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine final paper type, size, and godown
    const finalPaperType = isCustomPaper && customPaperInput.trim()
      ? customPaperInput.trim()
      : paperType;

    const finalSheetSize = isCustomSize && customSizeInput.trim()
      ? customSizeInput.trim()
      : fullSheetSize;

    const finalGodown = isCustomGodown && customGodownInput.trim()
      ? customGodownInput.trim()
      : godownName;

    // Save custom items into local storage for future reuse
    try {
      if (isCustomPaper && customPaperInput.trim()) {
        const updated = Array.from(new Set([...paperList, customPaperInput.trim()]));
        setPaperList(updated);
        localStorage.setItem('printos_custom_papers', JSON.stringify(updated.filter(p => !DEFAULT_PAPERS.includes(p))));
      }
      if (isCustomSize && customSizeInput.trim()) {
        const updated = Array.from(new Set([...sizeList, customSizeInput.trim()]));
        setSizeList(updated);
        localStorage.setItem('printos_custom_sizes', JSON.stringify(updated.filter(s => !DEFAULT_SIZES.includes(s))));
      }
      if (isCustomGodown && customGodownInput.trim()) {
        const updated = Array.from(new Set([...godownList, customGodownInput.trim()]));
        setGodownList(updated);
        localStorage.setItem('printos_custom_godowns', JSON.stringify(updated.filter(g => !DEFAULT_GODOWNS.includes(g))));
      }
    } catch {
      // Ignore
    }

    onAddStock({
      godownId: finalGodown.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      godownName: finalGodown,
      paperType: finalPaperType,
      gsm: Number(gsm) || 150,
      fullSheetSize: finalSheetSize,
      reamsAvailable: Number(reamsAvailable) || 0,
      averageUnitCost: Number(averageUnitCost) || 0,
      minThresholdReams: Number(minThresholdReams) || 3,
      lastRestocked: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      brandOrMill: brandOrMill.trim() || undefined,
      rackLocation: rackLocation.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const totalSheets = Math.round(reamsAvailable * 500);
  const totalValue = Math.round(reamsAvailable * averageUnitCost);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#0B224F] border border-[#E8EDF5] dark:border-[#162E63] shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8EDF5] dark:border-[#162E63] bg-slate-50/70 dark:bg-[#071A3D]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                Add Paper Stock Item (নতুন কাগজ স্টক এন্ট্রি)
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#D8E3FF]/70">
                Register preset or custom paper reams into factory inventory
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
          {/* Paper Type & GSM */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Paper Grade / Type *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomPaper(!isCustomPaper)}
                  className="text-[11px] font-bold text-[#1D5DFF] dark:text-[#23A8FF] hover:underline"
                >
                  {isCustomPaper ? '← Select Preset' : '+ Add Custom'}
                </button>
              </div>

              {isCustomPaper ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Enter custom paper (e.g. Swedish Board, Kraft Liner)"
                    value={customPaperInput}
                    onChange={(e) => setCustomPaperInput(e.target.value)}
                    className="w-full rounded-xl border border-[#1D5DFF] bg-blue-50/20 dark:bg-[#071A3D] px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none ring-2 ring-[#1D5DFF]/20"
                  />
                  <p className="text-[10px] text-slate-400">নতুন ধরনের কাগজ যা তালিকায় নেই</p>
                </div>
              ) : (
                <select
                  value={paperType}
                  onChange={(e) => handleSelectPaper(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071A3D] px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#1D5DFF]"
                >
                  {paperList.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                  <option value={CUSTOM_VALUE_TRIGGER} className="font-bold text-[#1D5DFF]">
                    + Add Custom Paper Grade (কাস্টম কাগজ লিখুন)...
                  </option>
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                GSM *
              </label>
              <input
                type="number"
                min={40}
                max={700}
                required
                value={gsm}
                onChange={(e) => setGsm(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071A3D] px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1D5DFF]"
              />
            </div>
          </div>

          {/* Size & Godown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Full Sheet Size *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomSize(!isCustomSize)}
                  className="text-[11px] font-bold text-[#1D5DFF] dark:text-[#23A8FF] hover:underline"
                >
                  {isCustomSize ? '← Select Preset' : '+ Custom Size'}
                </button>
              </div>

              {isCustomSize ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. 20 × 26 inch or 18 × 23 inch"
                    value={customSizeInput}
                    onChange={(e) => setCustomSizeInput(e.target.value)}
                    className="w-full rounded-xl border border-[#1D5DFF] bg-blue-50/20 dark:bg-[#071A3D] px-3 py-2 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:outline-none ring-2 ring-[#1D5DFF]/20"
                  />
                  <div className="flex flex-wrap gap-1 pt-1">
                    {['20 × 26 inch', '18 × 23 inch', '27 × 38 inch'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setCustomSizeInput(sz)}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#081B40] text-slate-600 dark:text-[#D8E3FF] hover:bg-slate-200"
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <select
                  value={fullSheetSize}
                  onChange={(e) => handleSelectSize(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071A3D] px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#1D5DFF]"
                >
                  {sizeList.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                  <option value={CUSTOM_VALUE_TRIGGER} className="font-bold text-[#1D5DFF]">
                    + Enter Custom Size (কাস্টম সাইজ)...
                  </option>
                </select>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Godown Location *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomGodown(!isCustomGodown)}
                  className="text-[11px] font-bold text-[#1D5DFF] dark:text-[#23A8FF] hover:underline"
                >
                  {isCustomGodown ? '← Select Preset' : '+ New Godown'}
                </button>
              </div>

              {isCustomGodown ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Fakirapool Godown 2, Shed B, Rack 3"
                    value={customGodownInput}
                    onChange={(e) => setCustomGodownInput(e.target.value)}
                    className="w-full rounded-xl border border-[#1D5DFF] bg-blue-50/20 dark:bg-[#071A3D] px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none ring-2 ring-[#1D5DFF]/20"
                  />
                  <p className="text-[10px] text-slate-400">নতুন গুদাম বা স্টোরেজের নাম</p>
                </div>
              ) : (
                <select
                  value={godownName}
                  onChange={(e) => handleSelectGodown(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071A3D] px-3 py-2 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#1D5DFF]"
                >
                  {godownList.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                  <option value={CUSTOM_VALUE_TRIGGER} className="font-bold text-[#1D5DFF]">
                    + Add New Godown Location (নতুন গুদাম)...
                  </option>
                </select>
              )}
            </div>
          </div>

          {/* Quantity & Unit Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Initial Stock (Reams / রিম) *
              </label>
              <input
                type="number"
                min={0}
                step="any"
                required
                value={reamsAvailable}
                onChange={(e) => setReamsAvailable(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071A3D] px-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1D5DFF]"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                = {totalSheets.toLocaleString()} full sheets
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Cost per Ream (প্রতি রিম মূল্য ৳) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400 font-mono">৳</span>
                <input
                  type="number"
                  min={0}
                  step={10}
                  required
                  value={averageUnitCost}
                  onChange={(e) => setAverageUnitCost(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071A3D] pl-8 pr-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1D5DFF]"
                />
              </div>
            </div>
          </div>

          {/* Threshold alert */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Low Stock Alert Threshold (মিনিমাম রিম সতর্কতা)
            </label>
            <input
              type="number"
              min={1}
              value={minThresholdReams}
              onChange={(e) => setMinThresholdReams(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071A3D] px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#1D5DFF]"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              স্টক এই পরিমাণের নিচে নামলে ড্যাশবোর্ডে হলুদ সতর্কতা দেখাবে।
            </p>
          </div>

          {/* Optional Custom Attributes Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowExtraDetails(!showExtraDetails)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-[#D8E3FF] hover:text-[#1D5DFF] transition-colors"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${showExtraDetails ? 'rotate-180' : ''}`} />
              <span>{showExtraDetails ? 'Hide Extra Custom Details' : '+ Add Custom Details (Brand, Rack, Lot No.)'}</span>
            </button>

            {showExtraDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Brand / Mill / Origin (কাগজের ব্র্যান্ড)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bashundhara, Partex, Korean, China"
                    value={brandOrMill}
                    onChange={(e) => setBrandOrMill(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071A3D] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1D5DFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Rack / Shelf / Lot No. (র‌্যাক / লট নং)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rack B-3, Shelf 2, Lot #94"
                    value={rackLocation}
                    onChange={(e) => setRackLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071A3D] px-3 py-2 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#1D5DFF]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Remarks / Notes (মন্তব্য)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Reserved for book printing, damp-free storage"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#071A3D] px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#1D5DFF]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Summary Preview */}
          <div className="rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-[#8B5CF6]/10 p-3.5 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300 font-medium">
              Estimated Total Asset Value:
            </span>
            <span className="font-mono font-black text-[#071A3D] dark:text-[#23A8FF] text-sm">
              ৳ {totalValue.toLocaleString()}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122A59] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1D5DFF] hover:bg-[#154cdb] text-xs font-bold text-white shadow-sm transition-all active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>Add to Godown Stock</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
