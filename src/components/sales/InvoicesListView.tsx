'use client';

import React, { useState } from 'react';
import {
  Receipt,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  DollarSign,
  Plus,
  ArrowUpRight,
  ChevronRight,
  Building2,
  Calendar,
  CreditCard,
} from 'lucide-react';
import { SalesInvoice } from '@/types/sales';

interface InvoicesListViewProps {
  invoices: SalesInvoice[];
  onOpenPaymentModal: (invoice: SalesInvoice) => void;
  onOpenPrintModal: (invoice: SalesInvoice) => void;
  onGoToEstimator: () => void;
}

export const InvoicesListView: React.FC<InvoicesListViewProps> = ({
  invoices,
  onOpenPaymentModal,
  onOpenPrintModal,
  onGoToEstimator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid'>('all');

  const fmt = (v: number) => `৳ ${Math.round(v).toLocaleString('en-IN')}`;

  // Metrics
  const totalInvoiced = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.advancePaid, 0);
  const totalDue = invoices.reduce((acc, i) => acc + i.dueAmount, 0);
  const unpaidCount = invoices.filter((i) => i.paymentStatus !== 'paid').length;

  // Filtered
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.jobId && inv.jobId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#881337] to-[#700f2e] text-white shadow-sm">
            <Receipt className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Commercial Sales Invoices</h1>
              <span className="rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-xs font-bold text-[#881337]">
                {invoices.length} Registered
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage client billing, VAT statements, partial advance payments, and printable invoices
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={onGoToEstimator}
            className="inline-flex items-center gap-2 rounded-xl bg-[#881337] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#700f2e] transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Estimate & Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Invoiced
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <DollarSign className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">{fmt(totalInvoiced)}</p>
          <p className="text-xs text-slate-500 mt-1">{invoices.length} total commercial invoices</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Collected Revenue
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-600 font-mono mt-2">{fmt(totalCollected)}</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">
            {Math.round((totalCollected / (totalInvoiced || 1)) * 100)}% recovery rate
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Outstanding Dues
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-[#881337]">
              <AlertCircle className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-rose-700 font-mono mt-2">{fmt(totalDue)}</p>
          <p className="text-xs text-slate-500 mt-1">Pending client collections</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Bills
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">{unpaidCount}</p>
          <p className="text-xs text-amber-600 mt-1 font-medium">Require full/partial payment</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice #, client, job..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#881337] focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['all', 'unpaid', 'partial', 'paid'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-[#881337] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {st === 'all' ? 'All Invoices' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="p-4">Invoice # & Date</th>
                <th className="p-4">Client & Job Card</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Advance Paid</th>
                <th className="p-4">Due Balance</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No commercial invoices match your search query.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <p className="font-mono font-bold text-[#881337] text-sm">{inv.id}</p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        <span>{inv.invoiceDate}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900 text-xs">{inv.clientName}</p>
                      <p className="text-[11px] text-slate-500 truncate max-w-xs">{inv.jobTitle}</p>
                      {inv.jobId && (
                        <span className="inline-block rounded bg-slate-100 text-slate-600 px-1.5 py-0.5 text-[9px] font-mono mt-0.5">
                          {inv.jobId}
                        </span>
                      )}
                    </td>

                    <td className="p-4 font-mono font-semibold text-slate-700">
                      {inv.quantity.toLocaleString('en-IN')} pcs
                    </td>

                    <td className="p-4 font-mono font-bold text-slate-900 text-sm">
                      {fmt(inv.totalAmount)}
                    </td>

                    <td className="p-4 font-mono font-semibold text-emerald-600">
                      {fmt(inv.advancePaid)}
                    </td>

                    <td className="p-4 font-mono font-bold text-rose-700">
                      {fmt(inv.dueAmount)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                          inv.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : inv.paymentStatus === 'partial'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {inv.paymentStatus === 'paid' && <CheckCircle2 className="h-3 w-3" />}
                        {inv.paymentStatus === 'partial' && <Clock className="h-3 w-3" />}
                        {inv.paymentStatus === 'unpaid' && <AlertCircle className="h-3 w-3" />}
                        {inv.paymentStatus}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      {inv.dueAmount > 0 && (
                        <button
                          onClick={() => onOpenPaymentModal(inv)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                        >
                          <CreditCard className="h-3 w-3" />
                          <span>Record Payment</span>
                        </button>
                      )}
                      <button
                        onClick={() => onOpenPrintModal(inv)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                      >
                        <Printer className="h-3 w-3 text-slate-400" />
                        <span>Print</span>
                      </button>
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
