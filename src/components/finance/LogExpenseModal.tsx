'use client';

import React, { useState } from 'react';
import { X, TrendingDown, CheckCircle2 } from 'lucide-react';
import { ExpenseCategory, ExpensePaymentMethod, ExpenseRecord } from '@/types/finance';

interface LogExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (exp: {
    category: ExpenseCategory;
    title: string;
    description?: string;
    amount: number;
    paymentMethod: ExpensePaymentMethod;
    receiptNo?: string;
    paidTo: string;
  }) => ExpenseRecord;
  onSuccessToast: (msg: string) => void;
}

export const LogExpenseModal: React.FC<LogExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
  onSuccessToast,
}) => {
  const [category, setCategory] = useState<ExpenseCategory>('machine_maintenance');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<ExpensePaymentMethod>('cash');
  const [receiptNo, setReceiptNo] = useState('');
  const [paidTo, setPaidTo] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !title.trim() || !paidTo.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const created = onAddExpense({
      category,
      title,
      description: description || undefined,
      amount,
      paymentMethod,
      receiptNo: receiptNo || undefined,
      paidTo,
    });

    onSuccessToast(
      `Expense "${created.title}" of ৳ ${amount.toLocaleString('en-IN')} logged successfully!`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#881337] text-white">
              <TrendingDown className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Log Factory & Operating Expense</h3>
              <p className="text-xs text-slate-500">Record machine, utility, or operational costs</p>
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
          {/* Category */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Expense Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
            >
              <option value="machine_maintenance">Machine Maintenance & Repairs</option>
              <option value="electricity_power">Electricity & 3-Phase Power Bill</option>
              <option value="ink_chemicals">Printing Ink & Fountain Chemicals</option>
              <option value="factory_rent">Factory & Godown Rent</option>
              <option value="transport_logistics">Transport, Van CNG & Delivery</option>
              <option value="refreshments_tea">Staff Refreshments, Tea & Snacks</option>
              <option value="office_admin">Office Administration & Stationery</option>
              <option value="staff_welfare">Staff Welfare & Medical</option>
            </select>
          </div>

          {/* Title & Payee */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Expense Title *</label>
            <input
              type="text"
              placeholder="e.g. Komori Lithrone Gripper Bar Calibration"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Amount (৳) *</label>
              <input
                type="number"
                min={1}
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="e.g. 12500"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold font-mono text-slate-900 focus:border-[#881337] focus:outline-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Payee / Vendor *</label>
              <input
                type="text"
                placeholder="e.g. Eastern Engineering"
                value={paidTo}
                onChange={(e) => setPaidTo(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'cash', label: 'Cash (Till Outflow)' },
                { key: 'bank', label: 'Bank (BEFTN/Cheque)' },
                { key: 'bkash', label: 'bKash / Nagad' },
              ].map((m) => (
                <button
                  type="button"
                  key={m.key}
                  onClick={() => setPaymentMethod(m.key as ExpensePaymentMethod)}
                  className={`rounded-xl border py-2 text-center font-bold text-[11px] transition-all ${
                    paymentMethod === m.key
                      ? 'border-[#881337] bg-rose-50 text-[#881337]'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            {paymentMethod === 'cash' && (
              <p className="text-[10px] text-emerald-700 font-medium pt-0.5">
                • This expense will also automatically register an outflow in the Daily Cash Book.
              </p>
            )}
          </div>

          {/* Receipt No & Description */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Bill / Receipt # (Optional)</label>
            <input
              type="text"
              placeholder="e.g. INV-9842"
              value={receiptNo}
              onChange={(e) => setReceiptNo(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-600">Notes / Remarks</label>
            <input
              type="text"
              placeholder="e.g. Periodic 100,000 impression overhaul"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-800"
            />
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
              className="rounded-xl bg-[#881337] px-5 py-2.5 font-bold text-white hover:bg-[#700f2e] transition-colors shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Record Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
