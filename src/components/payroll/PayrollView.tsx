'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Printer,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  CreditCard,
  Building2,
  Phone,
  Wrench,
  Sparkles,
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
  onOpenAddStaffModal?: () => void;
  onGoToEstimator: () => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  staff,
  metrics,
  onOpenPayModal,
  onOpenSlipModal,
  onGoToEstimator,
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
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-700 to-indigo-900 text-white shadow-sm">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Press Payroll & Labor Ledger (মেশিন মাস্টার ও স্টাফ বেতন খাতা)
              </h1>
              <span className="rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-xs font-bold text-purple-800">
                {metrics.headcount} Press Workers
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Machine masters, helpers, cutting operators, CTP technicians, overtime hours, advance (দাদন) deductions, and monthly salary disbursement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="h-4 w-4 text-slate-400" />
            <span>Print Payroll Sheet</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Monthly Payroll (মোট পে-রোল)
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">{fmt(metrics.totalPayroll)}</p>
          <p className="text-xs text-slate-500 mt-1">Gross salaries + overtime + bonuses</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Salaries Disbursed (পরিশোধিত)
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-600 font-mono mt-2">{fmt(metrics.totalDisbursed)}</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">{metrics.paidCount} staff settled</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Salary Dues (বকেয়া)
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-rose-700 font-mono mt-2">{fmt(metrics.totalPending)}</p>
          <p className="text-xs text-rose-700 mt-1 font-medium">{metrics.pendingCount} staff pending disbursement</p>
        </div>

        <div className="rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-gradient-to-br from-purple-50 to-indigo-50/40 dark:from-purple-950/60 dark:to-indigo-950/40 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-900 dark:text-purple-300 uppercase tracking-wider">
              Factory Headcount (মোট কর্মী)
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600 text-white shadow-xs">
              <Users className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-purple-900 dark:text-purple-100 font-mono mt-2">{metrics.headcount} Operators</p>
          <p className="text-xs text-purple-700 dark:text-purple-300 mt-1 font-semibold">Across press, pre-press & post-press</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search worker name, machine, role..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-purple-600 focus:outline-none transition-colors"
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
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
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
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending (বকেয়া)</option>
            <option value="paid">Paid (পরিশোধিত)</option>
            <option value="partial">Partial (আংশিক)</option>
          </select>
        </div>
      </div>

      {/* Staff & Salary Ledger Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200/80">
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
            <tbody className="divide-y divide-slate-100">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    No press staff match this filter.
                  </td>
                </tr>
              ) : (
                filteredStaff.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Staff & ID */}
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-bold font-mono text-xs">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{member.name}</p>
                          <p className="text-[11px] text-purple-700 font-medium">{member.nameBn}</p>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{member.phone}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role & Unit */}
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{member.roleLabel}</p>
                      <p className="text-[11px] text-slate-500">{member.department}</p>
                      {member.assignedMachine && (
                        <p className="text-[10px] text-indigo-600 font-medium mt-0.5 flex items-center gap-1">
                          <Wrench className="h-2.5 w-2.5" />
                          <span>{member.assignedMachine}</span>
                        </p>
                      )}
                    </td>

                    {/* Base Salary */}
                    <td className="p-4 text-right font-mono font-semibold text-slate-700">
                      {fmt(member.baseSalary)}
                    </td>

                    {/* Overtime */}
                    <td className="p-4 text-right">
                      {member.overtimeHours > 0 ? (
                        <div>
                          <p className="font-mono font-semibold text-emerald-600">
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
                        <span className="font-mono font-semibold text-emerald-600">
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
                          <span className="font-mono font-bold text-rose-700">
                            -{fmt(member.advanceDeduction)}
                          </span>
                          <p className="text-[10px] text-slate-400">অগ্রিম কর্তন</p>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-mono">—</span>
                      )}
                    </td>

                    {/* Net Payable */}
                    <td className="p-4 text-right font-mono font-black text-slate-900 text-sm">
                      {fmt(member.netPayable)}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                          member.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : member.status === 'partial'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
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
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => onOpenSlipModal(member)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                        title="Print official salary pay slip"
                      >
                        <FileText className="h-3 w-3 text-slate-400" />
                        <span>Pay Slip</span>
                      </button>

                      {member.status !== 'paid' && (
                        <button
                          onClick={() => onOpenPayModal(member)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#881337] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#700f2e] transition-colors shadow-2xs"
                          title="Disburse salary payment"
                        >
                          <CreditCard className="h-3 w-3" />
                          <span>Disburse</span>
                        </button>
                      )}
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
