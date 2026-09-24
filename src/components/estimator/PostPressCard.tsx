'use client';

import React from 'react';
import { Settings, Sparkles } from 'lucide-react';
import { FinishingConfig, LaminationType, BindingType } from '@/types/estimator';
import { LAMINATION_TYPES, BINDING_TYPES } from '@/lib/constants';

interface PostPressCardProps {
  config: FinishingConfig;
  onUpdate: (patch: Partial<FinishingConfig>) => void;
}

export const PostPressCard: React.FC<PostPressCardProps> = ({
  config,
  onUpdate,
}) => {
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
              className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-700 text-[#881337] focus:ring-rose-500 accent-[#881337]"
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
                className="w-full h-10.5 px-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 disabled:opacity-50 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all shadow-2xs cursor-pointer truncate"
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
                className="w-full h-10.5 px-3.5 pr-11 rounded-xl border border-slate-300 bg-white text-sm font-mono text-slate-800 disabled:opacity-50 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all shadow-2xs"
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
              className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-700 text-[#881337] focus:ring-rose-500 accent-[#881337]"
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
                className="w-full h-10.5 px-3.5 pr-14 rounded-xl border border-slate-300 bg-white text-sm font-mono text-slate-800 disabled:opacity-50 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all shadow-2xs"
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
                className="w-full h-10.5 px-3.5 pr-14 rounded-xl border border-slate-300 bg-white text-sm font-mono text-slate-800 disabled:opacity-50 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all shadow-2xs"
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
              className="h-4.5 w-4.5 rounded border-slate-300 dark:border-slate-700 text-[#881337] focus:ring-rose-500 accent-[#881337]"
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
                className="w-full h-10.5 px-3 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 disabled:opacity-50 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all shadow-2xs cursor-pointer truncate"
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
                className="w-full h-10.5 px-3.5 pr-11 rounded-xl border border-slate-300 bg-white text-sm font-mono text-slate-800 disabled:opacity-50 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all shadow-2xs"
              />
              <span className="absolute right-3 top-3 text-[11px] font-medium text-slate-400 pointer-events-none">
                ৳/pc
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
