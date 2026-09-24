'use client';

import React, { useState } from 'react';
import { X, Wallet, ArrowDownLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { CashEntryType, CashCategory, CashBookEntry } from '@/types/finance';

interface CashEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEntry: (entry: {
    type: CashEntryType;
    category: CashCategory;
    particulars: string;
    amount: number;
    linkedJobId?: string;
    voucherNo?: string;
  }) => CashBookEntry;
  onSuccessToast: (msg: string) => void;
}

export const CashEntryModal: React.FC<CashEntryModalProps> = ({
  isOpen,
  onClose,
  onAddEntry,
  onSuccessToast,
}) => {
  const [type, setType] = useState<CashEntryType>('inflow');
  const [category, setCategory] = useState<CashCategory>('client_advance');
  const [particulars, setParticulars] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [linkedJobId, setLinkedJobId] = useState('');
  const [voucherNo, setVoucherNo] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !particulars.trim()) {
      alert('Please enter a valid amount and transaction particulars.');
      return;
    }

    const created = onAddEntry({
      type,
      category,
      particulars,
      amount,
      linkedJobId: linkedJobId || undefined,
      voucherNo: voucherNo || undefined,
    });

    onSuccessToast(
      `${type === 'inflow' ? 'Cash Received (+)' : 'Cash Outflow (-)'} of ৳ ${amount.toLocaleString(
        'en-IN'
      )} recorded.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Wallet className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Record Till Cash Transaction</h3>
              <p className="text-xs text-slate-500">Daily physical cash flow in / out</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Type Selector (Inflow vs Outflow) */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setType('inflow');
                setCategory('client_advance');
              }}
              className={`rounded-xl border py-2.5 flex items-center justify-center gap-2 font-bold transition-all ${
                type === 'inflow'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ArrowDownLeft className="h-4 w-4 text-emerald-600" />
              <span>Cash In / Received (জমা)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('outflow');
                setCategory('petty_cash');
              }}
              className={`rounded-xl border py-2.5 flex items-center justify-center gap-2 font-bold transition-all ${
                type === 'outflow'
                  ? 'border-rose-600 bg-rose-50 text-rose-800'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <ArrowUpRight className="h-4 w-4 text-rose-600" />
              <span>Cash Out / Paid (খরচ)</span>
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Transaction Amount (৳) *</label>
            <input
              type="number"
              min={1}
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="e.g. 5000"
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-base font-bold font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as CashCategory)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
            >
              {type === 'inflow' ? (
                <>
                  <option value="client_advance">Customer Advance Booking Deposit</option>
                  <option value="debtor_collection">Debtor Invoice Collection</option>
                  <option value="cash_sale">Instant Spot Cash Sale</option>
                  <option value="other">Other Inflow</option>
                </>
              ) : (
                <>
                  <option value="paper_purchase">Emergency Paper Buying from Wholesale</option>
                  <option value="transport_fare">Rickshaw Van / Courier Delivery Fare</option>
                  <option value="worker_food">Worker Overtime Food & Daily Tea</option>
                  <option value="maintenance">Immediate Machine Spare / Repair</option>
                  <option value="petty_cash">General Factory Petty Cash</option>
                  <option value="utility">Utility / Emergency Bill</option>
                </>
              )}
            </select>
          </div>

          {/* Particulars */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Particulars / Description *</label>
            <input
              type="text"
              placeholder="e.g. Advance paid for 5,000 Leaflets by ABC Pharma"
              value={particulars}
              onChange={(e) => setParticulars(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
              required
            />
          </div>

          {/* Linked Job ID & Voucher */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">Job Card ID (Optional)</label>
              <input
                type="text"
                placeholder="JC-2025-0842"
                value={linkedJobId}
                onChange={(e) => setLinkedJobId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600">Voucher / Memo #</label>
              <input
                type="text"
                placeholder="MR-2025-092"
                value={voucherNo}
                onChange={(e) => setVoucherNo(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-mono"
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Save Cash Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
