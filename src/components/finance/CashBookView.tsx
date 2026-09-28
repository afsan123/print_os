'use client';

import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Plus,
  Printer,
  Calendar,
  DollarSign,
  Receipt,
  CheckCircle2,
  Clock,
  Layers,
  Coins,
  Copy,
  RotateCcw,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CashBookEntry, CashCategory } from '@/types/finance';

interface CashBookViewProps {
  cashEntries: CashBookEntry[];
  openingBalance: number;
  closingBalance: number;
  todayInflows: number;
  todayOutflows: number;
  onOpenCashEntryModal: () => void;
  onGoToEstimator: () => void;
}

export const CashBookView: React.FC<CashBookViewProps> = ({
  cashEntries,
  openingBalance,
  closingBalance,
  todayInflows,
  todayOutflows,
  onOpenCashEntryModal,
  onGoToEstimator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'inflow' | 'outflow'>('all');
  const [isDenominationOpen, setIsDenominationOpen] = useState(true);
  const [copiedTally, setCopiedTally] = useState(false);

  // Denominations state (BDT notes)
  const [noteCounts, setNoteCounts] = useState<{ [denom: number]: number }>({
    1000: 0,
    500: 0,
    200: 0,
    100: 0,
    50: 0,
    20: 0,
    10: 0,
  });

  const DENOMINATIONS = [1000, 500, 200, 100, 50, 20, 10];

  const handleNoteCountChange = (denom: number, count: number) => {
    setNoteCounts((prev) => ({
      ...prev,
      [denom]: Math.max(0, count || 0),
    }));
  };

  const handleIncrement = (denom: number, delta: number) => {
    setNoteCounts((prev) => ({
      ...prev,
      [denom]: Math.max(0, (prev[denom] || 0) + delta),
    }));
  };

  const resetTally = () => {
    setNoteCounts({
      1000: 0,
      500: 0,
      200: 0,
      100: 0,
      50: 0,
      20: 0,
      10: 0,
    });
  };

  const totalCountedCash = DENOMINATIONS.reduce(
    (acc, denom) => acc + denom * (noteCounts[denom] || 0),
    0
  );

  const cashVariance = totalCountedCash - closingBalance;

  const copyTallyBreakdown = () => {
    const lines = [
      `*PrintOS Press — Evening Cash Till Tally (${new Date().toLocaleDateString('en-GB')})*`,
      `Opening Float: ${fmt(openingBalance)}`,
      `Today Inflows: ${fmt(todayInflows)}`,
      `Today Outflows: ${fmt(todayOutflows)}`,
      `Expected Till Balance: ${fmt(closingBalance)}`,
      `----------------------------`,
      `*Physical Notes Count:*`,
      ...DENOMINATIONS.map(
        (d) => `৳${d} × ${noteCounts[d] || 0} = ${fmt(d * (noteCounts[d] || 0))}`
      ),
      `----------------------------`,
      `*Total Physical Cash: ${fmt(totalCountedCash)}*`,
      `*Variance: ${cashVariance === 0 ? '✓ EXACT MATCH (মিলে গেছে)' : cashVariance > 0 ? `+${fmt(cashVariance)} EXCESS (বেশি)` : `${fmt(cashVariance)} SHORTAGE (ঘাটতি)`}*`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedTally(true);
    setTimeout(() => setCopiedTally(false), 2500);
  };

  const fmt = (v: number) => `৳ ${Math.round(v).toLocaleString('en-IN')}`;

  const filteredEntries = cashEntries.filter((entry) => {
    const matchesSearch =
      entry.particulars.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entry.voucherNo && entry.voucherNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (entry.linkedJobId && entry.linkedJobId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === 'all' || entry.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getCategoryLabel = (cat: CashCategory) => {
    switch (cat) {
      case 'client_advance':
        return 'Client Advance';
      case 'debtor_collection':
        return 'Debtor Collection';
      case 'cash_sale':
        return 'Spot Cash Sale';
      case 'paper_purchase':
        return 'Paper Purchase';
      case 'transport_fare':
        return 'Transport / Van';
      case 'worker_food':
        return 'Worker Meals / Tea';
      case 'maintenance':
        return 'Machine Maintenance';
      case 'utility':
        return 'Power / Utility';
      case 'petty_cash':
        return 'Petty Cash Outflow';
      default:
        return cat;
    }
  };

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
      {/* Header Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-sm">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Daily Factory Cash Book (ক্যাশ খাতা)
              </h1>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                Physical Till Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cash advance deposits, delivery collections, spot paper purchases, logistics fares, and daily physical till reconciliation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Printer className="h-4 w-4 text-slate-400" />
            <span>Print Day Book</span>
          </button>
          <button
            onClick={onOpenCashEntryModal}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Record Cash In / Out</span>
          </button>
        </div>
      </div>

      {/* KPI Till Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Opening Cash in Till
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-800 font-mono mt-2">{fmt(openingBalance)}</p>
          <p className="text-xs text-slate-500 mt-1">Starting daily cash float</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today&apos;s Cash Inflow
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ArrowDownLeft className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-600 font-mono mt-2">{fmt(todayInflows)}</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">Customer advances & spot cash</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today&apos;s Cash Outflow
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-rose-700 font-mono mt-2">{fmt(todayOutflows)}</p>
          <p className="text-xs text-slate-500 mt-1">Paper, transport & petty cash</p>
        </div>

        <div className="rounded-2xl border border-emerald-300 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50 to-teal-50/40 dark:from-emerald-950/60 dark:to-teal-950/40 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
              Closing Physical Cash
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
              <Wallet className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-900 dark:text-emerald-100 font-mono mt-2">{fmt(closingBalance)}</p>
          <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1 font-semibold">Physical cash available in till</p>
        </div>
      </div>

      {/* Evening Cash Till Note Denomination Counter (নোট গণনা ক্যালকুলেটর) */}
      <div className="rounded-2xl border border-emerald-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Evening Cash Drawer Count (সন্ধ্যার ক্যাশ ড্রয়ার নোট গণনা)
                </h3>
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Denomination Tally
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Count physical Bangladesh Taka notes in drawer at close of business to verify against expected till balance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={copyTallyBreakdown}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
              title="Copy formatted note tally for WhatsApp accounts group"
            >
              <Copy className="h-3.5 w-3.5 text-slate-500" />
              <span>{copiedTally ? 'Copied to Clipboard!' : 'Copy Tally'}</span>
            </button>
            <button
              onClick={resetTally}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
              title="Reset note counts"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={() => setIsDenominationOpen(!isDenominationOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {isDenominationOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {isDenominationOpen && (
          <div className="mt-5 space-y-5">
            {/* Currency Note Inputs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {DENOMINATIONS.map((denom) => {
                const count = noteCounts[denom] || 0;
                const subtotal = denom * count;
                return (
                  <div
                    key={denom}
                    className={`rounded-xl border p-3 flex flex-col justify-between transition-all ${
                      count > 0
                        ? 'border-emerald-300 bg-emerald-50/40 shadow-2xs'
                        : 'border-slate-200/80 bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 font-mono">
                        ৳ {denom}
                      </span>
                      <span className="text-[10px] text-slate-400">Note</span>
                    </div>

                    <div className="mt-2 space-y-1.5">
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          value={count === 0 ? '' : count}
                          onChange={(e) => handleNoteCountChange(denom, parseInt(e.target.value) || 0)}
                          placeholder="0 pcs"
                          className="w-full text-center rounded-lg border border-slate-300 bg-white py-1.5 px-2 text-xs font-mono font-bold text-slate-900 focus:border-emerald-600 focus:outline-none shadow-2xs"
                        />
                      </div>

                      {/* Quick +1 +5 buttons */}
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleIncrement(denom, 1)}
                          className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-100"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleIncrement(denom, 5)}
                          className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-100"
                        >
                          +5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleIncrement(denom, 10)}
                          className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-100"
                        >
                          +10
                        </button>
                      </div>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-200/60 text-right">
                      <span className="text-[11px] font-mono font-bold text-slate-700">
                        {fmt(subtotal)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reconciliation Summary Bar */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    Physical Cash Counted
                  </span>
                  <p className="text-xl font-black text-slate-900 font-mono mt-0.5">
                    {fmt(totalCountedCash)}
                  </p>
                </div>

                <div className="hidden sm:block text-slate-300 font-light text-xl">−</div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    Expected System Till Balance
                  </span>
                  <p className="text-xl font-black text-slate-700 font-mono mt-0.5">
                    {fmt(closingBalance)}
                  </p>
                </div>

                <div className="hidden sm:block text-slate-300 font-light text-xl">=</div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    Drawer Variance (কম/বেশি)
                  </span>
                  <p
                    className={`text-xl font-black font-mono mt-0.5 ${
                      cashVariance === 0
                        ? 'text-emerald-700'
                        : cashVariance > 0
                        ? 'text-blue-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {cashVariance > 0 ? `+${fmt(cashVariance)}` : fmt(cashVariance)}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="self-start md:self-auto">
                {cashVariance === 0 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 border border-emerald-300 px-3.5 py-2 text-xs font-bold text-emerald-900 shadow-2xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    <span>✓ Exact Match (ক্যাশ হুবহু মিলেছে)</span>
                  </span>
                ) : cashVariance > 0 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-300 px-3.5 py-2 text-xs font-bold text-blue-900 shadow-2xs">
                    <AlertCircle className="h-4 w-4 text-blue-700" />
                    <span>Excess Cash (+৳{cashVariance.toLocaleString()} ড্রয়ারে বেশি)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-300 px-3.5 py-2 text-xs font-bold text-rose-900 shadow-2xs">
                    <AlertCircle className="h-4 w-4 text-rose-700" />
                    <span>Shortage Detected (-৳{Math.abs(cashVariance).toLocaleString()} ঘাটতি রয়েছে)</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search & Inflow/Outflow Filter Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search particulars, voucher, job..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['all', 'inflow', 'outflow'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-xl px-4 py-2 text-xs font-bold capitalize transition-colors ${
                typeFilter === t
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {t === 'all' ? 'All Cash Entries' : t === 'inflow' ? 'Cash In (জমা)' : 'Cash Out (খরচ)'}
            </button>
          ))}
        </div>
      </div>

      {/* Cash Book Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="p-4">Entry ID & Date</th>
                <th className="p-4">Voucher / Ref</th>
                <th className="p-4">Particulars / Transaction Details</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Cash In (৳)</th>
                <th className="p-4 text-right">Cash Out (৳)</th>
                <th className="p-4 text-right">Till Balance (৳)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No cash transactions recorded for this period.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <p className="font-mono font-bold text-slate-900 text-xs">{e.id}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{e.date}</p>
                    </td>

                    <td className="p-4">
                      <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold">
                        {e.voucherNo || 'N/A'}
                      </span>
                      {e.linkedJobId && (
                        <p className="text-[10px] text-rose-800 font-mono font-bold mt-1">
                          {e.linkedJobId}
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-slate-800 text-xs">{e.particulars}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Recorded by: {e.recordedBy}</p>
                    </td>

                    <td className="p-4">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                        {getCategoryLabel(e.category)}
                      </span>
                    </td>

                    <td className="p-4 text-right font-mono font-bold text-emerald-600 text-sm">
                      {e.type === 'inflow' ? `+ ${fmt(e.amount)}` : '—'}
                    </td>

                    <td className="p-4 text-right font-mono font-bold text-rose-700 text-sm">
                      {e.type === 'outflow' ? `- ${fmt(e.amount)}` : '—'}
                    </td>

                    <td className="p-4 text-right font-mono font-black text-slate-900 text-sm">
                      {fmt(e.balanceAfter)}
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
