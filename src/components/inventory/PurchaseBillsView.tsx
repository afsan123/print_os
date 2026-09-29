'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
  Filter,
  Plus,
  Printer,
  DollarSign,
  Package,
  Layers,
} from 'lucide-react';
import { PurchaseBill, StockItem } from '@/types/inventory';
import { ProcurementDashboard } from './ProcurementDashboard';

interface PurchaseBillsViewProps {
  bills: PurchaseBill[];
  isInventoryEnabled: boolean;
  onToggleInventory: () => void;
  stockItems: StockItem[];
  onRecordPayment: (billId: string, amount: number) => void;
  onGoToEstimator: () => void;
  onNavigateToInventory?: () => void;
}

export const PurchaseBillsView: React.FC<PurchaseBillsViewProps> = ({
  bills,
  isInventoryEnabled,
  onToggleInventory,
  stockItems,
  onRecordPayment,
  onGoToEstimator,
  onNavigateToInventory,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [paymentModalBill, setPaymentModalBill] = useState<PurchaseBill | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const filteredBills = bills.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(search.toLowerCase()) ||
      b.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      (b.linkedJobId && b.linkedJobId.toLowerCase().includes(search.toLowerCase())) ||
      b.paperType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || b.paymentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalPurchases = bills.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalPaid = bills.reduce((sum, b) => sum + b.paidAmount, 0);
  const totalDue = totalPurchases - totalPaid;

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalBill || paymentAmount <= 0) return;

    onRecordPayment(paymentModalBill.id, paymentAmount);
    setPaymentModalBill(null);
    setPaymentAmount(0);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1D5DFF] text-white shadow-sm shadow-[#1D5DFF]/20">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-heading">
                Paper Purchase Bills & Procurement
              </h1>
              <span className="rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-xs font-bold font-mono">
                {bills.length} Bills
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
              Direct job paper buying ledger & optional warehouse stock tracking
            </p>
          </div>
        </div>

        {/* Action Controls & On-Demand Inventory Toggle */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isInventoryEnabled && onNavigateToInventory && (
            <button
              type="button"
              onClick={onNavigateToInventory}
              className="inline-flex items-center gap-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 px-3.5 py-2.5 text-xs font-bold transition-all shadow-2xs active:scale-[0.98]"
            >
              <Package className="h-4 w-4 text-purple-600" />
              <span>Godown Stock (গুদাম দেখুন ➔)</span>
            </button>
          )}

          {/* On-Demand Godown Inventory Toggle Button */}
          <button
            type="button"
            onClick={onToggleInventory}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold border transition-all ${
              isInventoryEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Package className={`h-4 w-4 ${isInventoryEnabled ? 'text-emerald-600' : 'text-slate-500'}`} />
            <span>
              {isInventoryEnabled ? 'Stock: ACTIVE' : 'Enable Godown Stock'}
            </span>
          </button>

          <button
            onClick={onGoToEstimator}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1D5DFF] hover:bg-[#154cdb] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Buy Paper for New Job</span>
          </button>
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Paper Purchased</span>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">
            ৳ {totalPurchases.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Lifetime volume</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Paid to Suppliers</span>
          <p className="text-2xl font-black text-emerald-700 font-mono mt-2">
            ৳ {totalPaid.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Cleared via Cash/Bank</span>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase">Outstanding Supplier Due</span>
          <p className="text-2xl font-black text-rose-800 font-mono mt-2">
            ৳ {totalDue.toLocaleString()}
          </p>
          <span className="text-[11px] text-rose-600 font-medium mt-1 block">Payable on credit</span>
        </div>
      </div>

      {/* Optional Godown Inventory Dashboard (Rendered when toggled on) */}
      <ProcurementDashboard
        isInventoryEnabled={isInventoryEnabled}
        onToggleInventory={onToggleInventory}
        stockItems={stockItems}
        onNavigateToInventory={onNavigateToInventory}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
        <div className="flex items-center gap-2 w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Bill ID, vendor, or Job Card..."
            className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Bills</option>
            <option value="paid">Paid Bills</option>
            <option value="partial">Partial Paid</option>
            <option value="due">Unpaid / Due</option>
          </select>
        </div>
      </div>

      {/* Bills Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Bill ID</th>
                <th className="py-3 px-4">Supplier / Vendor</th>
                <th className="py-3 px-4">Linked Job Order</th>
                <th className="py-3 px-4">Paper Specs & Yield</th>
                <th className="py-3 px-4 text-right">Reams</th>
                <th className="py-3 px-4 text-right">Total (৳)</th>
                <th className="py-3 px-4 text-center">Payment Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBills.map((b) => {
                const isPaid = b.paymentStatus === 'paid';
                const isPartial = b.paymentStatus === 'partial';
                const isDue = b.paymentStatus === 'due';

                return (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-rose-900">
                      {b.id}
                      <span className="block text-[10px] text-slate-400 font-sans font-normal">
                        {b.purchaseDate}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {b.supplierName}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {b.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {b.linkedJobId ? (
                        <div>
                          <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                            {b.linkedJobId}
                          </span>
                          <p className="text-[11px] text-slate-500 truncate max-w-[150px] mt-0.5">
                            {b.linkedJobTitle}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Godown Stock Purchase</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800">
                        {b.paperType} ({b.gsm} GSM)
                      </span>
                      <span className="block text-[10px] text-slate-500 font-mono">
                        {b.fullSheetSize} @ ৳ {b.ratePerReam.toLocaleString()}/ream
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      {b.reams} Reams
                      <span className="block text-[10px] text-slate-400 font-normal">
                        {b.sheets} sheets
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 text-sm">
                      ৳ {b.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          isPaid
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isPartial
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {isPaid && <CheckCircle2 className="h-3 w-3" />}
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {!isPaid && (
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentModalBill(b);
                            setPaymentAmount(b.totalAmount - b.paidAmount);
                          }}
                          className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 text-[11px] font-bold transition-colors shadow-2xs"
                        >
                          Pay Due
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Due Modal */}
      {paymentModalBill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Record Payment to Vendor</h3>
              <button
                onClick={() => setPaymentModalBill(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            <div className="text-xs space-y-1">
              <p className="font-bold text-slate-800">{paymentModalBill.supplierName}</p>
              <p className="text-slate-500">Bill #{paymentModalBill.id}</p>
              <p className="text-rose-800 font-mono font-bold">
                Due Amount: ৳ {(paymentModalBill.totalAmount - paymentModalBill.paidAmount).toLocaleString()}
              </p>
            </div>
            <form onSubmit={handlePaymentSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Payment Amount (৳)</label>
                <input
                  type="number"
                  min="1"
                  max={paymentModalBill.totalAmount - paymentModalBill.paidAmount}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 font-mono text-sm font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalBill(null)}
                  className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white shadow-2xs"
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
