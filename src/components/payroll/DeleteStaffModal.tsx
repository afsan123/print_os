'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { StaffMember } from '@/types/payroll';

interface DeleteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
  onConfirmDelete: (staffId: string) => void;
  onSuccessToast?: (msg: string) => void;
}

export const DeleteStaffModal: React.FC<DeleteStaffModalProps> = ({
  isOpen,
  onClose,
  staff,
  onConfirmDelete,
  onSuccessToast,
}) => {
  if (!isOpen || !staff) return null;

  const handleDelete = () => {
    onConfirmDelete(staff.id);
    if (onSuccessToast) {
      onSuccessToast(`Employee "${staff.name}" removed from payroll ledger.`);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#111827] shadow-2xl border border-rose-200 dark:border-rose-900/60 overflow-hidden p-6 space-y-5">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              কর্মী অপসারণ নিশ্চিত করুন (Remove Employee)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Are you sure you want to remove <strong className="text-slate-800 dark:text-slate-200">{staff.name}</strong> ({staff.nameBn || staff.roleLabel}) from the payroll ledger?
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-500">Role / Designation:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{staff.roleLabel}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Department:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{staff.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Base Salary:</span>
            <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">৳ {staff.baseSalary.toLocaleString()}</span>
          </div>
        </div>

        <p className="text-[11px] text-rose-600 dark:text-rose-400">
          ⚠️ This will remove the employee record, overtime tracking, and pending payroll dues from this month&apos;s ledger.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition-colors shadow-2xs"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Yes, Remove Employee</span>
          </button>
        </div>
      </div>
    </div>
  );
};
