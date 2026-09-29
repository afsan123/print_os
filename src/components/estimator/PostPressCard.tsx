'use client';

import React from 'react';
import { Settings, Plus, Trash2, Sparkles, Layers } from 'lucide-react';
import { FinishingConfig, LaminationType, BindingType, CustomFinishingItem } from '@/types/estimator';
import { LAMINATION_TYPES, BINDING_TYPES, CUSTOM_FINISHING_PRESETS } from '@/lib/constants';

interface PostPressCardProps {
  config: FinishingConfig;
  onUpdate: (patch: Partial<FinishingConfig>) => void;
}

export const PostPressCard: React.FC<PostPressCardProps> = ({
  config,
  onUpdate,
}) => {
  const customFinishings = config.customFinishings || [];

  const handleAddCustomFinishing = (preset?: { name: string; defaultSetup: number; defaultRate: number }) => {
    const newItem: CustomFinishingItem = {
      id: `custom-finish-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: preset ? preset.name : '',
      enabled: true,
      setupCharge: preset ? preset.defaultSetup : 0,
      ratePerPcs: preset ? preset.defaultRate : 0,
    };
    onUpdate({
      customFinishings: [...customFinishings, newItem],
    });
  };

  const handleUpdateCustomItem = (id: string, patch: Partial<CustomFinishingItem>) => {
    const updated = customFinishings.map((item) =>
      item.id === id ? { ...item, ...patch } : item
    );
    onUpdate({ customFinishings: updated });
  };

  const handleRemoveCustomItem = (id: string) => {
    const updated = customFinishings.filter((item) => item.id !== id);
    onUpdate({ customFinishings: updated });
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs transition-all hover:border-slate-300">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {/* Circular Badge 4 (Amber) */}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d97706] text-xs font-bold text-white shadow-2xs">
            4
          </span>
          <Settings className="h-4 w-4 text-slate-500" />
          <h2 className="text-base font-bold text-slate-900">Post-Press & Finishing</h2>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Add finishing options
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {/* Row 1: Lamination */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 transition-colors">
          <label className="flex items-center gap-2.5 min-w-[130px] shrink-0 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.lamination.enabled}
              onChange={(e) =>
                onUpdate({
                  lamination: {
                    ...config.lamination,
                    enabled: e.target.checked,
                  },
                })
              }
              className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-700 text-[#1D5DFF] focus:ring-[#1D5DFF] accent-[#1D5DFF]"
            />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Lamination</span>
          </label>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7">
              <select
                disabled={!config.lamination.enabled}
                value={config.lamination.type}
                onChange={(e) =>
                  onUpdate({
                    lamination: {
                      ...config.lamination,
                      type: e.target.value as LaminationType,
                    },
                  })
                }
                className="w-full h-10.5 px-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 disabled:opacity-50 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all shadow-2xs cursor-pointer truncate"
              >
                {LAMINATION_TYPES.map((lt) => (
                  <option key={lt} value={lt}>
                    {lt}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-5 relative">
              <input
                type="number"
                step="0.05"
                min={0}
                disabled={!config.lamination.enabled}
                value={config.lamination.ratePerPcs ?? ''}
                onChange={(e) =>
                  onUpdate({
                    lamination: {
                      ...config.lamination,
                      ratePerPcs: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                placeholder="Rate (৳ per Pcs)"
                className="w-full h-10.5 px-3.5 pr-11 rounded-xl border border-slate-300 bg-white text-sm font-mono text-slate-800 disabled:opacity-50 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all shadow-2xs"
              />
              <span className="absolute right-3 top-3 text-[11px] font-medium text-slate-400 pointer-events-none">
                ৳/pc
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Die Cutting */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 transition-colors">
          <label className="flex items-center gap-2.5 min-w-[130px] shrink-0 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.dieCutting.enabled}
              onChange={(e) =>
                onUpdate({
                  dieCutting: {
                    ...config.dieCutting,
                    enabled: e.target.checked,
                  },
                })
              }
              className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-700 text-[#1D5DFF] focus:ring-[#1D5DFF] accent-[#1D5DFF]"
            />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Die Cutting</span>
          </label>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative">
              <input
                type="number"
                min={0}
                step={100}
                disabled={!config.dieCutting.enabled}
                value={config.dieCutting.dieSetupCharge ?? ''}
                onChange={(e) =>
                  onUpdate({
                    dieCutting: {
                      ...config.dieCutting,
                      dieSetupCharge: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                placeholder="Die Setup Charge (৳)"
                className="w-full h-10.5 px-3.5 pr-14 rounded-xl border border-slate-300 bg-white text-sm font-mono text-slate-800 disabled:opacity-50 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all shadow-2xs"
              />
              <span className="absolute right-3 top-3 text-[11px] font-medium text-slate-400 pointer-events-none">
                Setup ৳
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                step="0.05"
                min={0}
                disabled={!config.dieCutting.enabled}
                value={config.dieCutting.punchRatePerPcs ?? ''}
                onChange={(e) =>
                  onUpdate({
                    dieCutting: {
                      ...config.dieCutting,
                      punchRatePerPcs: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                placeholder="Punch Rate (৳ per Pcs)"
                className="w-full h-10.5 px-3.5 pr-14 rounded-xl border border-slate-300 bg-white text-sm font-mono text-slate-800 disabled:opacity-50 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all shadow-2xs"
              />
              <span className="absolute right-3 top-3 text-[11px] font-medium text-slate-400 pointer-events-none">
                ৳/punch
              </span>
            </div>
          </div>
        </div>

        {/* Row 3: Binding */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 transition-colors">
          <label className="flex items-center gap-2.5 min-w-[130px] shrink-0 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.binding.enabled}
              onChange={(e) =>
                onUpdate({
                  binding: {
                    ...config.binding,
                    enabled: e.target.checked,
                  },
                })
              }
              className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-700 text-[#1D5DFF] focus:ring-[#1D5DFF] accent-[#1D5DFF]"
            />
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Binding</span>
          </label>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-7">
              <select
                disabled={!config.binding.enabled}
                value={config.binding.type}
                onChange={(e) =>
                  onUpdate({
                    binding: {
                      ...config.binding,
                      type: e.target.value as BindingType,
                    },
                  })
                }
                className="w-full h-10.5 px-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 disabled:opacity-50 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all shadow-2xs cursor-pointer truncate"
              >
                {BINDING_TYPES.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-5 relative">
              <input
                type="number"
                step="0.05"
                min={0}
                disabled={!config.binding.enabled}
                value={config.binding.ratePerPcs ?? ''}
                onChange={(e) =>
                  onUpdate({
                    binding: {
                      ...config.binding,
                      ratePerPcs: parseFloat(e.target.value) || 0,
                    },
                  })
                }
                placeholder="Rate (৳ per Pcs)"
                className="w-full h-10.5 px-3.5 pr-11 rounded-xl border border-slate-300 bg-white text-sm font-mono text-slate-800 disabled:opacity-50 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all shadow-2xs"
              />
              <span className="absolute right-3 top-3 text-[11px] font-medium text-slate-400 pointer-events-none">
                ৳/pc
              </span>
            </div>
          </div>
        </div>

        {/* Custom Post-Press & Finishing Section */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#1D5DFF]" />
              <label className="text-xs font-bold text-slate-900">
                Custom Finishing Operations <span className="text-slate-400 font-normal">(কাস্টম ফিনিশিং)</span>
              </label>
            </div>
            <button
              type="button"
              onClick={() => handleAddCustomFinishing()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1D5DFF]/10 text-[#1D5DFF] hover:bg-[#1D5DFF]/20 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Custom Finishing</span>
            </button>
          </div>

          {/* Quick Preset Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium text-slate-400 mr-1">Quick Add:</span>
            {CUSTOM_FINISHING_PRESETS.slice(0, 5).map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleAddCustomFinishing(preset)}
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors"
                title={`Add ${preset.name}`}
              >
                <Plus className="h-2.5 w-2.5 text-slate-500" />
                <span>{preset.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* List of Custom Finishing Items */}
          {customFinishings.length > 0 && (
            <div className="space-y-3 pt-1">
              <datalist id="custom-finishing-options">
                {CUSTOM_FINISHING_PRESETS.map((p) => (
                  <option key={p.name} value={p.name} />
                ))}
              </datalist>

              {customFinishings.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-white transition-all shadow-2xs group"
                >
                  {/* Enable checkbox & Name input */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) =>
                        handleUpdateCustomItem(item.id, { enabled: e.target.checked })
                      }
                      className="h-4.5 w-4.5 rounded border-slate-300 text-[#1D5DFF] focus:ring-[#1D5DFF] accent-[#1D5DFF] cursor-pointer"
                    />
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        list="custom-finishing-options"
                        value={item.name}
                        disabled={!item.enabled}
                        onChange={(e) =>
                          handleUpdateCustomItem(item.id, { name: e.target.value })
                        }
                        placeholder={`Custom Operation ${idx + 1} (e.g. Foil Stamping)`}
                        className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm font-medium text-slate-800 disabled:opacity-50 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all"
                      />
                    </div>
                  </div>

                  {/* Setup & Rate Inputs */}
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:w-[280px]">
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        step={100}
                        disabled={!item.enabled}
                        value={item.setupCharge || ''}
                        onChange={(e) =>
                          handleUpdateCustomItem(item.id, {
                            setupCharge: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="Setup (৳)"
                        className="w-full h-10 pl-2.5 pr-14 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm font-mono text-slate-800 disabled:opacity-50 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all"
                      />
                      <span className="absolute right-2.5 top-2.5 text-[10px] font-medium text-slate-400 pointer-events-none">
                        Setup ৳
                      </span>
                    </div>

                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        step={0.05}
                        disabled={!item.enabled}
                        value={item.ratePerPcs || ''}
                        onChange={(e) =>
                          handleUpdateCustomItem(item.id, {
                            ratePerPcs: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="Rate (৳/pc)"
                        className="w-full h-10 pl-2.5 pr-11 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm font-mono text-slate-800 disabled:opacity-50 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all"
                      />
                      <span className="absolute right-2.5 top-2.5 text-[10px] font-medium text-slate-400 pointer-events-none">
                        ৳/pc
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomItem(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors self-end sm:self-center"
                    title="Remove custom finishing"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
