'use client';

import React from 'react';
import {
  Package,
  Layers,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import { StockItem } from '@/types/inventory';

interface ProcurementDashboardProps {
  isInventoryEnabled: boolean;
  onToggleInventory: () => void;
  stockItems: StockItem[];
  onNavigateToInventory?: () => void;
}

export const ProcurementDashboard: React.FC<ProcurementDashboardProps> = ({
  isInventoryEnabled,
  onToggleInventory,
  stockItems,
  onNavigateToInventory,
}) => {
  if (!isInventoryEnabled) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-6 sm:p-8 text-center space-y-3">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200/80 text-slate-600">
          <Package className="h-6 w-6" />
        </div>
        <div className="max-w-xl mx-auto space-y-1">
          <h3 className="text-base font-bold text-slate-900">
            Small Press Just-In-Time Mode (Direct Buy per Job)
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Your press is currently set to direct job-by-job paper purchasing. Paper is bought directly from vendors when orders are booked without tracking godown stock.
          </p>
        </div>
        <button
          type="button"
          onClick={onToggleInventory}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-xs"
        >
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>Activate Godown Stock Ledgers</span>
        </button>
      </div>
    );
  }

  const lowStockCount = stockItems.filter(
    (item) => item.reamsAvailable <= item.minThresholdReams
  ).length;

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-2xs">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Godown Warehouse Stock</h3>
              <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.2 text-[10px] font-bold uppercase">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500">Live reams & sheets available in press godowns</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onNavigateToInventory && (
            <button
              type="button"
              onClick={onNavigateToInventory}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1D5DFF] hover:bg-[#154cdb] text-white px-3 py-1.5 text-xs font-bold transition-all shadow-2xs active:scale-[0.98]"
            >
              <Package className="h-3.5 w-3.5" />
              <span>Manage Godown Stock (গুদাম দেখুন ➔)</span>
            </button>
          )}

          {lowStockCount > 0 && (
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-bold text-amber-800">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span>{lowStockCount} Items Low Stock</span>
            </div>
          )}
        </div>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stockItems.map((item) => {
          const isLow = item.reamsAvailable <= item.minThresholdReams;

          return (
            <div
              key={item.id}
              className={`rounded-xl p-4 border transition-all space-y-2.5 ${
                isLow
                  ? 'border-amber-300 bg-amber-50/40 ring-1 ring-amber-300/40'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {item.godownName.split(' - ')[0]}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                    {item.paperType}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {item.gsm} GSM • {item.fullSheetSize}
                  </p>
                </div>
                <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                  {item.gsm} GSM
                </span>
              </div>

              {/* Quantity */}
              <div className="pt-2 border-t border-slate-200/60 flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-black font-mono text-slate-900">
                    {item.reamsAvailable}
                  </span>
                  <span className="text-xs text-slate-500 ml-1">Reams</span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {item.sheetsAvailable.toLocaleString()} sheets
                </span>
              </div>

              {/* Threshold warning or normal */}
              <div className="flex items-center justify-between text-[10px] pt-1">
                <span className="text-slate-400">Avg Cost: ৳ {item.averageUnitCost}/ream</span>
                {isLow ? (
                  <span className="font-bold text-amber-700 bg-amber-100/70 px-1.5 py-0.2 rounded">
                    Below {item.minThresholdReams} R threshold
                  </span>
                ) : (
                  <span className="font-semibold text-emerald-700">Healthy stock</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
