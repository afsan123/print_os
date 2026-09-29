'use client';

import React, { useState } from 'react';
import { X, CreditCard, DollarSign, Calendar, CheckCircle2 } from 'lucide-react';
import { StaffMember, SalaryPaymentPayload } from '@/types/payroll';

interface PaySalaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
  onDisburseSalary: (payload: SalaryPaymentPayload) => void;
  onSuccessToast?: (msg: string) => void;
}

export const PaySalaryModal: React.FC<PaySalaryModalProps> = ({
  isOpen,
  onClose,
  staff,
  onDisburseSalary,
  onSuccessToast,
}) => {
  const dueAmount = staff ? staff.netPayable - staff.paidAmount : 0;

  const [amount, setAmount] = useState<number>(dueAmount);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank' | 'bkash'>('cash');
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('');

  if (!isOpen || !staff) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    onDisburseSalary({
      staffId: staff.id,
      amount,
      paymentMethod,
      paymentDate,
      notes,
    });

    if (onSuccessToast) {
      onSuccessToast(`Salary of ৳${amount.toLocaleString()} paid to ${staff.name} via ${paymentMethod.toUpperCase()}`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#1D5DFF]">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-slate-900">
                Disburse Salary (বেতন পরিশোধ)
              </h3>
              <p className="text-xs text-slate-500">
                {staff.name} ({staff.nameBn}) • {staff.roleLabel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Salary Breakdown Summary Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Base Monthly Salary:</span>
              <span className="font-mono font-semibold">৳ {staff.baseSalary.toLocaleString()}</span>
            </div>
            {staff.overtimeAmount > 0 && (
              <div className="flex items-center justify-between text-emerald-700">
                <span>Overtime Pay ({staff.overtimeHours} hrs):</span>
                <span className="font-mono font-semibold">+৳ {staff.overtimeAmount.toLocaleString()}</span>
              </div>
            )}
            {staff.productionBonus > 0 && (
              <div className="flex items-center justify-between text-emerald-700">
                <span>Production Run Bonus:</span>
                <span className="font-mono font-semibold">+৳ {staff.productionBonus.toLocaleString()}</span>
              </div>
            )}
            {staff.advanceDeduction > 0 && (
              <div className="flex items-center justify-between text-rose-700">
                <span>Advance Deduction (দাদন কর্তন):</span>
                <span className="font-mono font-semibold">-৳ {staff.advanceDeduction.toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-bold text-slate-900 text-sm">
              <span>Total Net Payable:</span>
              <span className="font-mono text-[#1D5DFF]">৳ {staff.netPayable.toLocaleString()}</span>
            </div>
            {staff.paidAmount > 0 && (
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Already Paid:</span>
                <span className="font-mono">৳ {staff.paidAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center justify-between pt-1 font-bold text-rose-700">
              <span>Outstanding Due:</span>
              <span className="font-mono">৳ {dueAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Amount to Disburse */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Disbursement Amount (৳) *
            </label>
            <input
              type="number"
              min="1"
              max={dueAmount}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-sm font-mono font-bold text-slate-900 focus:border-[#1D5DFF] focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Method *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cash', label: 'Cash Till (ক্যাশ)' },
                { id: 'bank', label: 'Bank (ব্যাংক)' },
                { id: 'bkash', label: 'bKash (বিকাশ)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as 'cash' | 'bank' | 'bkash')}
                  className={`rounded-xl border py-2 text-xs font-bold transition-all ${
                    paymentMethod === m.id
                      ? 'border-[#1D5DFF] bg-blue-50 text-[#1D5DFF]'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Date *
            </label>
            <input
              type="date"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs font-medium text-slate-900 focus:border-[#1D5DFF] focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20"
            />
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notes / Voucher Reference (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., September 2025 salary disbursed via Cash counter"
              className="w-full rounded-xl border border-slate-300 bg-white py-2 px-3 text-xs font-medium text-slate-900 focus:border-[#1D5DFF] focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-[#1D5DFF] px-5 py-2 text-xs font-bold text-white hover:bg-[#154cdb] transition-colors shadow-sm"
            >
              Confirm Disbursement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
