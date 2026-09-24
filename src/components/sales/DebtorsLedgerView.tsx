'use client';

import React, { useState } from 'react';
import {
  Scale,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  DollarSign,
  FileSpreadsheet,
  CreditCard,
  Building2,
  Phone,
  ArrowUpRight,
  TrendingDown,
  MessageSquare,
} from 'lucide-react';
import { DebtorSummary } from '@/types/sales';

interface DebtorsLedgerViewProps {
  debtors: DebtorSummary[];
  onOpenPaymentForClient: (clientName: string) => void;
  onOpenStatementModal: (clientName: string) => void;
}

export const DebtorsLedgerView: React.FC<DebtorsLedgerViewProps> = ({
  debtors,
  onOpenPaymentForClient,
  onOpenStatementModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [agingFilter, setAgingFilter] = useState<string>('all');

  const fmt = (v: number) => `৳ ${Math.round(v).toLocaleString('en-IN')}`;

  const sendWhatsAppReminder = (d: DebtorSummary) => {
    const cleanPhone = d.phone.replace(/[^0-9]/g, '');
    const targetPhone = cleanPhone.startsWith('880')
      ? cleanPhone
      : cleanPhone.startsWith('0')
      ? `88${cleanPhone}`
      : `880${cleanPhone}`;

    const text = encodeURIComponent(
      `*PrintOS Commercial Press — Payment Reminder (বকেয়া তাগাদা)*\n\n` +
      `শ্রদ্ধেয় গ্রাহক *${d.clientName}* (${d.company}),\n` +
      `আশা করি ভালো আছেন। PrintOS Press থেকে বিনীতভাবে জানাচ্ছি যে আপনার প্রেস একাউন্টে মোট বকেয়া রয়েছে *${fmt(d.outstandingBalance)}* টাকা (${d.agingCategory})।\n\n` +
      `দয়া করে সুবিধাজনক সময়ে নগদ / ব্যাংক / বিকাশের মাধ্যমে বকেয়া পরিশোধ করে সহযোগিতা করার বিনীত অনুরোধ করছি।\n\n` +
      `ধন্যবাদান্তে,\n` +
      `*হিসাব বিভাগ, PrintOS Press*\n` +
      `আরামবাগ, ফকিরাপুল, ঢাকা`
    );

    window.open(`https://wa.me/${targetPhone}?text=${text}`, '_blank');
  };

  // Totals
  const totalReceivable = debtors.reduce((acc, d) => acc + d.outstandingBalance, 0);
  const totalInvoiced = debtors.reduce((acc, d) => acc + d.totalInvoiced, 0);
  const totalCollected = debtors.reduce((acc, d) => acc + d.totalCollected, 0);

  // Aging buckets
  const currentDues = debtors
    .filter((d) => d.agingCategory === '0-15 days')
    .reduce((acc, d) => acc + d.outstandingBalance, 0);
  const overdue1630 = debtors
    .filter((d) => d.agingCategory === '16-30 days')
    .reduce((acc, d) => acc + d.outstandingBalance, 0);
  const overdue3160 = debtors
    .filter((d) => d.agingCategory === '31-60 days')
    .reduce((acc, d) => acc + d.outstandingBalance, 0);
  const criticalOverdue = debtors
    .filter((d) => d.agingCategory === '60+ days overdue')
    .reduce((acc, d) => acc + d.outstandingBalance, 0);

  const filteredDebtors = debtors.filter((d) => {
    const matchesSearch =
      d.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery);

    const matchesAging = agingFilter === 'all' || d.agingCategory === agingFilter;
    return matchesSearch && matchesAging;
  });

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-600 to-rose-700 text-white shadow-sm">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Debtors & Accounts Receivable Ledger
              </h1>
              <span className="rounded-full bg-amber-50 border border-amber-200 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                {debtors.length} Client Accounts
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Client credit aging analysis, invoice settlements, debit/credit audit trail, and collections tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2 text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Net Receivables</span>
            <p className="text-lg font-black text-rose-700 font-mono">{fmt(totalReceivable)}</p>
          </div>
        </div>
      </div>

      {/* Aging Analysis Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Current (0-15 Days)
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-600 font-mono mt-2">{fmt(currentDues)}</p>
          <p className="text-xs text-emerald-700 mt-1 font-medium">Standard payment grace period</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Due (16-30 Days)
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-blue-600 font-mono mt-2">{fmt(overdue1630)}</p>
          <p className="text-xs text-slate-500 mt-1">Normal billing cycle dues</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Attention (31-60 Days)
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <AlertTriangle className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-amber-600 font-mono mt-2">{fmt(overdue3160)}</p>
          <p className="text-xs text-amber-700 mt-1 font-medium">Follow-up reminder required</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Critical (60+ Days)
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
              <AlertOctagon className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-rose-700 font-mono mt-2">{fmt(criticalOverdue)}</p>
          <p className="text-xs text-rose-700 mt-1 font-medium">Stop new credit deliveries</p>
        </div>
      </div>

      {/* Search & Aging Filter */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search client name, company, phone..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-amber-600 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { key: 'all', label: 'All Debtors' },
            { key: '0-15 days', label: '0-15 Days' },
            { key: '16-30 days', label: '16-30 Days' },
            { key: '31-60 days', label: '31-60 Days' },
            { key: '60+ days overdue', label: '60+ Days Overdue' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setAgingFilter(tab.key)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-colors whitespace-nowrap ${
                agingFilter === tab.key
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Debtors Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="p-4">Client / Company</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4">Total Invoiced</th>
                <th className="p-4">Total Collected</th>
                <th className="p-4">Outstanding Balance</th>
                <th className="p-4">Aging Bracket</th>
                <th className="p-4">Account Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDebtors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No client accounts match this filter.
                  </td>
                </tr>
              ) : (
                filteredDebtors.map((d) => (
                  <tr key={d.clientName} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-slate-900 text-xs">{d.clientName}</p>
                      <p className="text-[11px] text-slate-500">{d.company}</p>
                    </td>

                    <td className="p-4 font-mono text-slate-600">{d.phone}</td>

                    <td className="p-4 font-mono font-semibold text-slate-700">
                      {fmt(d.totalInvoiced)}
                    </td>

                    <td className="p-4 font-mono font-semibold text-emerald-600">
                      {fmt(d.totalCollected)}
                    </td>

                    <td className="p-4 font-mono font-bold text-rose-700 text-sm">
                      {fmt(d.outstandingBalance)}
                    </td>

                    <td className="p-4">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                        {d.agingCategory}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                          d.outstandingBalance === 0
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : d.status === 'critical'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : d.status === 'warning'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {d.outstandingBalance === 0
                          ? 'Settled'
                          : d.status === 'critical'
                          ? 'Critical Due'
                          : d.status === 'warning'
                          ? 'Overdue'
                          : 'Normal'}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => onOpenStatementModal(d.clientName)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                      >
                        <FileSpreadsheet className="h-3 w-3 text-slate-400" />
                        <span>Ledger Statement</span>
                      </button>

                      {d.outstandingBalance > 0 && (
                        <>
                          <button
                            onClick={() => sendWhatsAppReminder(d)}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs"
                            title="Send polite WhatsApp payment reminder with due details"
                          >
                            <MessageSquare className="h-3 w-3 text-emerald-600" />
                            <span>WhatsApp তাগাদা</span>
                          </button>

                          <button
                            onClick={() => onOpenPaymentForClient(d.clientName)}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#881337] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#700f2e] transition-colors shadow-2xs"
                          >
                            <CreditCard className="h-3 w-3" />
                            <span>Collect Payment</span>
                          </button>
                        </>
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
