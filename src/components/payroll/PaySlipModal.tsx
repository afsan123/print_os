'use client';

import React from 'react';
import { X, Printer, CheckCircle2, Building2 } from 'lucide-react';
import { StaffMember } from '@/types/payroll';

interface PaySlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
}

export const PaySlipModal: React.FC<PaySlipModalProps> = ({
  isOpen,
  onClose,
  staff,
}) => {
  if (!isOpen || !staff) return null;

  const fmt = (v: number) => `৳ ${Math.round(v).toLocaleString('en-IN')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Official Salary Voucher / Pay Slip
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Voucher Area */}
        <div id="printable-area" className="mt-4 space-y-6 text-slate-900">
          {/* Header */}
          <div className="text-center pb-4 border-b-2 border-slate-900">
            <h2 className="text-2xl font-black uppercase tracking-wider text-slate-900">
              PrintOS Commercial Press Ltd.
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              128/A Arambagh, Fakirapool Press Zone, Motijheel, Dhaka-1000, Bangladesh
            </p>
            <p className="text-xs font-mono text-slate-500">
              Phone: +880 1711-234567 • Factory BIN: 001294821-0101
            </p>
            <div className="inline-block mt-3 px-4 py-1 rounded bg-slate-100 border border-slate-300 font-bold text-xs uppercase tracking-widest">
              Staff Salary Pay Slip (বেতন রসিদ)
            </div>
          </div>

          {/* Employee & Pay Period Details */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="space-y-1">
              <p><span className="text-slate-500">Employee ID:</span> <strong className="font-mono">{staff.id}</strong></p>
              <p><span className="text-slate-500">Staff Name:</span> <strong>{staff.name}</strong> ({staff.nameBn})</p>
              <p><span className="text-slate-500">Designation:</span> <strong>{staff.roleLabel}</strong></p>
              <p><span className="text-slate-500">Department:</span> <strong>{staff.department}</strong></p>
            </div>
            <div className="space-y-1 text-right sm:text-left">
              <p><span className="text-slate-500">Assigned Machine:</span> <strong>{staff.assignedMachine || 'General Workshop'}</strong></p>
              <p><span className="text-slate-500">Contact No:</span> <strong className="font-mono">{staff.phone}</strong></p>
              <p><span className="text-slate-500">Date of Joining:</span> <strong className="font-mono">{staff.joinedDate}</strong></p>
              <p><span className="text-slate-500">Pay Status:</span> <strong className="uppercase text-emerald-700">{staff.status}</strong></p>
            </div>
          </div>

          {/* Earnings & Deductions Table */}
          <div className="grid grid-cols-2 gap-4">
            {/* Earnings Column */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-100 px-3.5 py-2 font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200">
                Earnings (আয়)
              </div>
              <div className="p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Basic Monthly Salary:</span>
                  <span className="font-mono font-semibold">{fmt(staff.baseSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Overtime ({staff.overtimeHours} hrs):</span>
                  <span className="font-mono font-semibold">{fmt(staff.overtimeAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Production Bonus:</span>
                  <span className="font-mono font-semibold">{fmt(staff.productionBonus)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold">
                  <span>Gross Earnings:</span>
                  <span className="font-mono">{fmt(staff.baseSalary + staff.overtimeAmount + staff.productionBonus)}</span>
                </div>
              </div>
            </div>

            {/* Deductions Column */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-100 px-3.5 py-2 font-bold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200">
                Deductions (কর্তন)
              </div>
              <div className="p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>Advance Taken (দাদন কর্তন):</span>
                  <span className="font-mono font-semibold text-rose-700">{fmt(staff.advanceDeduction)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Other Deductions:</span>
                  <span className="font-mono text-slate-400">—</span>
                </div>
                <div className="flex justify-between pt-7 border-t border-slate-200 font-bold text-rose-800">
                  <span>Total Deductions:</span>
                  <span className="font-mono">{fmt(staff.advanceDeduction)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Payable Highlight */}
          <div className="rounded-xl border-2 border-slate-900 bg-slate-50 p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Net Disbursed Salary (প্রদেয় বেতন)</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Paid via {staff.paymentMethod ? staff.paymentMethod.toUpperCase() : 'CASH TILL'} on {staff.paymentDate || 'Pending Settlement'}
              </p>
            </div>
            <p className="text-2xl font-black font-mono text-slate-900">{fmt(staff.netPayable)}</p>
          </div>

          {/* Signatures */}
          <div className="pt-12 grid grid-cols-3 gap-8 text-center text-xs">
            <div className="border-t border-slate-400 pt-2">
              <p className="font-semibold text-slate-700">Staff Signature</p>
              <p className="text-[10px] text-slate-400 mt-0.5">গ্রহণকারীর স্বাক্ষর</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="font-semibold text-slate-700">Accountant / Cashier</p>
              <p className="text-[10px] text-slate-400 mt-0.5">হিসাবরক্ষক</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="font-semibold text-slate-700">Managing Director</p>
              <p className="text-[10px] text-slate-400 mt-0.5">কর্তৃপক্ষের অনুমোদন</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
