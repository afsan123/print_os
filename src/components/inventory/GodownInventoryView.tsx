'use client';

import React, { useState } from 'react';
import {
  Package,
  Plus,
  ArrowDownRight,
  ArrowUpRight,
  Search,
  Filter,
  AlertTriangle,
  Building2,
  Layers,
  Sparkles,
  TrendingDown,
  Trash2,
  Edit2,
  FileSpreadsheet,
  CheckCircle2,
  Info,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { StockItem } from '@/types/inventory';
import { AddStockModal } from './AddStockModal';
import { AdjustStockModal } from './AdjustStockModal';

interface GodownInventoryViewProps {
  stockItems: StockItem[];
  isInventoryEnabled: boolean;
  onToggleInventory: () => void;
  onAddStock: (item: Omit<StockItem, 'id' | 'sheetsAvailable'> & { sheetsAvailable?: number }) => void;
  onAdjustStock: (stockId: string, type: 'in' | 'out', reams: number, sheets: number, reason: string) => void;
  onDeleteStock: (stockId: string) => void;
  onNavigateToPurchaseBills?: () => void;
}

export const GodownInventoryView: React.FC<GodownInventoryViewProps> = ({
  stockItems,
  isInventoryEnabled,
  onToggleInventory,
  onAddStock,
  onAdjustStock,
  onDeleteStock,
  onNavigateToPurchaseBills,
}) => {
  const [search, setSearch] = useState('');
  const [selectedGodown, setSelectedGodown] = useState<string>('all');
  const [filterAlertsOnly, setFilterAlertsOnly] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [adjustItem, setAdjustItem] = useState<StockItem | null>(null);

  // Distinct godown locations
  const godowns = Array.from(new Set(stockItems.map((item) => item.godownName)));

  // Filter items
  const filteredItems = stockItems.filter((item) => {
    const matchesSearch =
      item.paperType.toLowerCase().includes(search.toLowerCase()) ||
      item.fullSheetSize.toLowerCase().includes(search.toLowerCase()) ||
      item.gsm.toString().includes(search) ||
      item.godownName.toLowerCase().includes(search.toLowerCase()) ||
      (item.brandOrMill && item.brandOrMill.toLowerCase().includes(search.toLowerCase())) ||
      (item.rackLocation && item.rackLocation.toLowerCase().includes(search.toLowerCase()));

    const matchesGodown = selectedGodown === 'all' || item.godownName === selectedGodown;
    const matchesAlert = !filterAlertsOnly || item.reamsAvailable <= item.minThresholdReams;

    return matchesSearch && matchesGodown && matchesAlert;
  });

  // Financial & inventory statistics
  const totalStockValue = stockItems.reduce(
    (sum, item) => sum + item.reamsAvailable * item.averageUnitCost,
    0
  );
  const totalReams = stockItems.reduce((sum, item) => sum + item.reamsAvailable, 0);
  const totalSheets = stockItems.reduce((sum, item) => sum + item.sheetsAvailable, 0);
  const lowStockCount = stockItems.filter((item) => item.reamsAvailable <= item.minThresholdReams).length;

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
      {/* If Inventory is disabled, show banner with easy 1-click activation */}
      {!isInventoryEnabled && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/90 dark:border-amber-900/60 dark:bg-amber-950/40 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                Godown Inventory is Currently Inactive (গুদাম ইনভেন্টরি মোড বন্ধ)
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed max-w-2xl">
                Small offset presses usually operate on a Just-In-Time Direct Buy model without keeping paper stock.
                Enable this module if your press maintains warehouse stock, purchases bulk reams, or tracks paper issued to machines.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleInventory}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
          >
            <Package className="h-4 w-4" />
            <span>Enable Godown Stock (গুদাম সক্রিয় করুন)</span>
          </button>
        </div>
      )}

      {/* Main Header */}
      <div className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#071A3D] p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1D5DFF] to-[#071A3D] text-white shadow-sm">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">
                Godown Paper Inventory & Stock (কাগজ গুদাম ব্যবস্থাপনা)
              </h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold flex items-center gap-1.5 ${
                isInventoryEnabled
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isInventoryEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                {isInventoryEnabled ? 'Stock Active (সক্রিয়)' : 'Optional Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#D8E3FF]/70 mt-0.5">
              Live warehouse balances, sheet counts, rate valuation, low-stock threshold alerts, and machine issue logs
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {onNavigateToPurchaseBills && (
            <button
              type="button"
              onClick={onNavigateToPurchaseBills}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-[#162E63] bg-white dark:bg-[#0B224F] px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-[#D8E3FF] hover:bg-slate-50 dark:hover:bg-[#122A59] transition-colors shadow-2xs"
            >
              <FileSpreadsheet className="h-4 w-4 text-[#1D5DFF]" />
              <span>Purchase Bills (বিলসমূহ)</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1D5DFF] hover:bg-[#154cdb] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>+ Add Paper Stock (নতুন কাগজ এন্ট্রি)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Stock Asset Valuation */}
        <div className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#071A3D] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-[#D8E3FF]/70 uppercase tracking-wider">
              Total Stock Asset Value
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-[#1D5DFF]/20 text-[#1D5DFF]">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              ৳ {Math.round(totalStockValue).toLocaleString()}
            </span>
          </div>
          <div className="mt-1 flex items-center text-[11px] text-slate-500 dark:text-[#D8E3FF]/60 font-medium">
            <span>মোট সংরক্ষিত কাগজের বর্তমান আর্থিক মূল্য</span>
          </div>
        </div>

        {/* Total Available Reams */}
        <div className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#071A3D] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-[#D8E3FF]/70 uppercase tracking-wider">
              Available Paper Stock
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {totalReams.toFixed(1)}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-[#D8E3FF]/70">Reams</span>
          </div>
          <div className="mt-1 flex items-center text-[11px] text-slate-500 dark:text-[#D8E3FF]/60 font-mono">
            <span>≈ {totalSheets.toLocaleString()} full sheets available</span>
          </div>
        </div>

        {/* Active Paper Grades */}
        <div className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#071A3D] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-[#D8E3FF]/70 uppercase tracking-wider">
              Paper Grades & Locations
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {stockItems.length}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-[#D8E3FF]/70">Grades</span>
          </div>
          <div className="mt-1 flex items-center text-[11px] text-slate-500 dark:text-[#D8E3FF]/60">
            <span>Distributed across {godowns.length || 1} godowns</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`rounded-2xl border p-5 shadow-xs transition-all ${
          lowStockCount > 0
            ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20'
            : 'border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#071A3D]'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-[#D8E3FF]/70 uppercase tracking-wider">
              Low Stock Warnings
            </span>
            <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              lowStockCount > 0
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-400'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
            }`}>
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${lowStockCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
              {lowStockCount}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-[#D8E3FF]/70">Items</span>
          </div>
          <div className="mt-1 flex items-center text-[11px] text-slate-500 dark:text-[#D8E3FF]/60">
            <span>{lowStockCount > 0 ? 'ন্যূনতম সীমার নিচে চলে গেছে (রি-অর্ডার প্রয়োজন)' : 'সকল কাগজের স্টক পর্যাপ্ত রয়েছে'}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#071A3D] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by paper grade, GSM, size, or godown..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-[#162E63] bg-slate-50 dark:bg-[#0B224F] pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-[#1D5DFF] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={selectedGodown}
              onChange={(e) => setSelectedGodown(e.target.value)}
              aria-label="Filter by godown location"
              className="rounded-xl border border-slate-200 dark:border-[#162E63] bg-slate-50 dark:bg-[#0B224F] px-3 py-2 text-xs font-medium text-slate-700 dark:text-[#D8E3FF] focus:border-[#1D5DFF] focus:outline-hidden"
            >
              <option value="all">All Godowns (সব গুদাম)</option>
              {godowns.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterAlertsOnly(!filterAlertsOnly)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              filterAlertsOnly
                ? 'bg-amber-500 text-white shadow-xs'
                : 'border border-slate-200 dark:border-[#162E63] text-slate-600 dark:text-[#D8E3FF] hover:bg-slate-50 dark:hover:bg-[#122A59]'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Low Stock Only ({lowStockCount})</span>
          </button>
        </div>
      </div>

      {/* Stock Table */}
      <div className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#071A3D] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8EDF5] dark:border-[#162E63] bg-slate-50/75 dark:bg-[#0B224F] text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#D8E3FF]/70">
                <th className="py-3.5 px-4 sm:px-6">Paper Grade & GSM</th>
                <th className="py-3.5 px-4">Sheet Size</th>
                <th className="py-3.5 px-4">Godown Location</th>
                <th className="py-3.5 px-4">Available Balance</th>
                <th className="py-3.5 px-4">Avg Rate / Unit</th>
                <th className="py-3.5 px-4">Total Asset Value</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right sm:pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#162E63] text-xs">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 dark:text-[#D8E3FF]/60">
                    <Package className="h-10 w-10 mx-auto text-slate-300 dark:text-[#162E63] mb-2" />
                    <p className="font-semibold">No paper stock items found matching your criteria</p>
                    <p className="text-[11px] mt-1">Click &quot;+ Add Paper Stock&quot; above to register paper into your warehouse</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isLow = item.reamsAvailable <= item.minThresholdReams;
                  const itemValue = Math.round(item.reamsAvailable * item.averageUnitCost);

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-[#081B40]/60 transition-colors"
                    >
                      {/* Paper Grade & GSM */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1D5DFF]/10 text-[#1D5DFF] font-bold text-xs">
                            {item.gsm}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {item.paperType}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-[#D8E3FF]/60 mt-0.5 flex flex-wrap items-center gap-1.5">
                              <span>ID: {item.id}</span>
                              <span>• Restocked: {item.lastRestocked}</span>
                              {item.brandOrMill && (
                                <span className="bg-slate-100 dark:bg-[#0B224F] px-1.5 py-0.2 rounded font-medium text-slate-700 dark:text-slate-300">
                                  {item.brandOrMill}
                                </span>
                              )}
                              {item.rackLocation && (
                                <span className="bg-blue-50 dark:bg-blue-950/60 text-[#1D5DFF] dark:text-[#23A8FF] px-1.5 py-0.2 rounded font-mono font-medium">
                                  {item.rackLocation}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Sheet Size */}
                      <td className="py-4 px-4 font-mono font-medium text-slate-700 dark:text-[#D8E3FF]">
                        {item.fullSheetSize}
                      </td>

                      {/* Godown Location */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-[#0B224F] px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-[#D8E3FF]">
                          <Building2 className="h-3 w-3 text-slate-400" />
                          <span>{item.godownName}</span>
                        </span>
                      </td>

                      {/* Available Balance */}
                      <td className="py-4 px-4">
                        <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                          {item.reamsAvailable} <span className="text-xs font-sans font-normal text-slate-500">Reams</span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-[#D8E3FF]/60">
                          {item.sheetsAvailable.toLocaleString()} sheets
                        </div>
                      </td>

                      {/* Unit Rate */}
                      <td className="py-4 px-4 font-mono font-medium text-slate-700 dark:text-[#D8E3FF]">
                        ৳ {item.averageUnitCost.toLocaleString()} <span className="text-[10px] text-slate-400">/ream</span>
                      </td>

                      {/* Total Asset Value */}
                      <td className="py-4 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        ৳ {itemValue.toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Low Stock (≤ {item.minThresholdReams} R)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>In Stock (পর্যাপ্ত)</span>
                          </span>
                        )}
                      </td>

                      {/* Quick Actions */}
                      <td className="py-4 px-4 text-right sm:pr-6">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setAdjustItem(item)}
                            title="Adjust Stock (ইস্যু / জমা)"
                            className="inline-flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-[#1D5DFF] hover:text-white dark:bg-[#0B224F] dark:hover:bg-[#1D5DFF] px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-[#D8E3FF] transition-colors shadow-2xs"
                          >
                            <ArrowUpRight className="h-3.5 w-3.5" />
                            <span>Adjust</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove ${item.paperType} (${item.gsm} GSM) from inventory?`)) {
                                onDeleteStock(item.id);
                              }
                            }}
                            title="Delete Stock Item"
                            className="rounded-xl p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddStockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddStock={onAddStock}
      />

      <AdjustStockModal
        isOpen={!!adjustItem}
        onClose={() => setAdjustItem(null)}
        stockItem={adjustItem}
        onAdjust={onAdjustStock}
      />
    </div>
  );
};
