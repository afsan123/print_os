'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Printer,
  DollarSign,
  CheckCircle2,
  Clock,
  FileText,
  CreditCard,
  Wrench,
  UserPlus,
  Trash2,
  Pencil,
  RotateCcw,
} from 'lucide-react';
import { StaffMember } from '@/types/payroll';

interface PayrollViewProps {
  staff: StaffMember[];
  metrics: {
    totalPayroll: number;
    totalDisbursed: number;
    totalPending: number;
    headcount: number;
    paidCount: number;
    pendingCount: number;
  };
  onOpenPayModal: (member: StaffMember) => void;
  onOpenSlipModal: (member: StaffMember) => void;
  onOpenAddStaffModal: () => void;
  onEditStaff: (member: StaffMember) => void;
  onRequestDeleteStaff: (member: StaffMember) => void;
  onGoToEstimator: () => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  staff,
  metrics,
  onOpenPayModal,
  onOpenSlipModal,
  onOpenAddStaffModal,
  onEditStaff,
  onRequestDeleteStaff,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const fmt = (v: number) => `৳ ${Math.round(v).toLocaleString('en-IN')}`;

  const departments = ['all', 'Press Floor', 'Pre-Press', 'Post-Press', 'Logistics'];

  const filteredStaff = staff.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nameBn.includes(searchQuery) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.roleLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.assignedMachine && s.assignedMachine.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = deptFilter === 'all' || s.department === deptFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
      {/* Header Card */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-700 to-indigo-900 text-white shadow-sm">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold font-heading text-slate-900 dark:text-white tracking-tight">
                Press Payroll & Labor Ledger (মেশিন মাস্টার ও স্টাফ বেতন খাতা)
              </h1>
              <span className="rounded-full bg-blue-50 dark:bg-[#0B224F] border border-blue-200 dark:border-blue-900/60 px-2.5 py-0.5 text-xs font-bold text-[#1D5DFF] dark:text-[#23A8FF]">
                {metrics.headcount} Press Workers
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Machine masters, helpers, cutting operators, CTP technicians, overtime hours, advance (দাদন) deductions, and monthly salary disbursement
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          {/* Print Payroll Sheet */}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
          >
            <Printer className="h-4 w-4 text-slate-400" />
            <span>Print Payroll Sheet</span>
          </button>

          {/* Add Employee Button */}
          <button
            onClick={onOpenAddStaffModal}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1D5DFF] hover:bg-[#154cdb] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add Employee (নতুন কর্মী)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Monthly Payroll (মোট পে-রোল)
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-2">{fmt(metrics.totalPayroll)}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gross salaries + overtime + bonuses</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Salaries Disbursed (পরিশোধিত)
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono mt-2">{fmt(metrics.totalDisbursed)}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">{metrics.paidCount} staff settled</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Pending Salary Dues (বকেয়া)
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-rose-700 dark:text-rose-400 font-mono mt-2">{fmt(metrics.totalPending)}</p>
          <p className="text-xs text-rose-700 dark:text-rose-400 mt-1 font-medium">{metrics.pendingCount} staff pending disbursement</p>
        </div>

        <div className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-blue-50 to-indigo-50/40 dark:from-[#0B224F] dark:to-[#071A3D] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
              Factory Headcount (মোট কর্মী)
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1D5DFF] text-white shadow-xs">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-blue-950 dark:text-white font-mono mt-2">{metrics.headcount} Operators</p>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 font-semibold">Across press, pre-press & post-press</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search worker name, machine, role..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-[#1D5DFF] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Department Filter */}
          <div className="flex items-center gap-1">
            {departments.map((d) => (
              <button
                key={d}
                onClick={() => setDeptFilter(d)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition-colors ${
                  deptFilter === d
                    ? 'bg-[#1D5DFF] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700'
                }`}
              >
                {d === 'all' ? 'All Units' : d}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending (বকেয়া)</option>
            <option value="paid">Paid (পরিশোধিত)</option>
            <option value="partial">Partial (আংশিক)</option>
          </select>
        </div>
      </div>

      {/* Staff & Salary Ledger Table */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-4">Staff & ID</th>
                <th className="p-4">Role & Assigned Unit</th>
                <th className="p-4 text-right">Base Salary</th>
                <th className="p-4 text-right">Overtime (OT)</th>
                <th className="p-4 text-right">Bonus</th>
                <th className="p-4 text-right">Advance (দাদন)</th>
                <th className="p-4 text-right font-black">Net Payable</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-12 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-blue-50 dark:bg-[#0B224F] text-[#1D5DFF] dark:text-[#23A8FF]">
                        <Users className="h-6 w-6" />
                      </div>
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                        {staff.length === 0
                          ? 'পে-রোল খাতায় কোনো কর্মী নেই (No Employees)'
                          : 'কোনো কর্মী খুঁজে পাওয়া যায়নি'}
                      </p>
                      <p className="text-xs text-slate-400">
                        {staff.length === 0
                          ? 'প্রেসের মেশিন মাস্টার, হেল্পার, অপারেটরদের যুক্ত করে বেতন ও ওভারটাইম হিসাব শুরু করুন।'
                          : 'অনুসন্ধানের সাথে মিল রেখে কোনো কর্মী পাওয়া যায়নি। ফিল্টার রিসেট করুন।'}
                      </p>
                      {staff.length === 0 ? (
                        <button
                          onClick={onOpenAddStaffModal}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[#1D5DFF] hover:bg-[#154cdb] px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors"
                        >
                          <UserPlus className="h-4 w-4" />
                          <span>Add First Employee</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setDeptFilter('all');
                            setStatusFilter('all');
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          <span>Reset Filters</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Staff & ID */}
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold font-mono text-xs">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{member.name}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{member.nameBn}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{member.phone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role & Unit */}
                    <td className="p-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{member.roleLabel}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{member.department}</p>
                      {member.assignedMachine && (
                        <p className="text-[10px] text-[#1D5DFF] dark:text-[#23A8FF] font-medium mt-0.5 flex items-center gap-1">
                          <Wrench className="h-2.5 w-2.5" />
                          <span>{member.assignedMachine}</span>
                        </p>
                      )}
                    </td>

                    {/* Base Salary */}
                    <td className="p-4 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">
                      {fmt(member.baseSalary)}
                    </td>

                    {/* Overtime */}
                    <td className="p-4 text-right">
                      {member.overtimeHours > 0 ? (
                        <div>
                          <p className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                            +{fmt(member.overtimeAmount)}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {member.overtimeHours}h × ৳{member.overtimeRate}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono">—</span>
                      )}
                    </td>

                    {/* Bonus */}
                    <td className="p-4 text-right">
                      {member.productionBonus > 0 ? (
                        <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          +{fmt(member.productionBonus)}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">—</span>
                      )}
                    </td>

                    {/* Advance / Dadan Deduction */}
                    <td className="p-4 text-right">
                      {member.advanceDeduction > 0 ? (
                        <div>
                          <span className="font-mono font-bold text-rose-700 dark:text-rose-400">
                            -{fmt(member.advanceDeduction)}
                          </span>
                          <p className="text-[10px] text-slate-400">অগ্রিম কর্তন</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono">—</span>
                      )}
                    </td>

                    {/* Net Payable */}
                    <td className="p-4 text-right font-mono font-black text-slate-900 dark:text-white text-sm">
                      {fmt(member.netPayable)}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                          member.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                            : member.status === 'partial'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                        }`}
                      >
                        {member.status === 'paid'
                          ? `Paid (${member.paymentMethod?.toUpperCase()})`
                          : member.status === 'partial'
                          ? `Partial (${fmt(member.paidAmount)})`
                          : 'Pending (বকেয়া)'}
                      </span>
                      {member.paymentDate && (
                        <p className="text-[9px] text-slate-400 mt-0.5 font-mono">{member.paymentDate}</p>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Pay Slip */}
                        <button
                          onClick={() => onOpenSlipModal(member)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                          title="Print official salary pay slip"
                        >
                          <FileText className="h-3 w-3 text-slate-400" />
                          <span>Slip</span>
                        </button>

                        {/* Disburse */}
                        {member.status !== 'paid' && (
                          <button
                            onClick={() => onOpenPayModal(member)}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#1D5DFF] hover:bg-[#154cdb] px-2.5 py-1.5 text-[11px] font-bold text-white transition-colors shadow-2xs"
                            title="Disburse salary payment"
                          >
                            <CreditCard className="h-3 w-3" />
                            <span>Disburse</span>
                          </button>
                        )}

                        {/* Edit Employee */}
                        <button
                          onClick={() => onEditStaff(member)}
                          className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-[#1D5DFF] dark:hover:text-[#23A8FF] hover:border-blue-300 transition-colors shadow-2xs"
                          title="Edit employee details and salary"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        {/* Remove / Delete Employee */}
                        <button
                          onClick={() => onRequestDeleteStaff(member)}
                          className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-800 transition-colors shadow-2xs"
                          title="Remove employee from ledger"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
