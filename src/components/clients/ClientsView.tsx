'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Building2,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Printer,
  FileSpreadsheet,
  Banknote,
  TrendingUp,
  Sparkles,
  Layers,
  Truck,
  ArrowUpRight,
} from 'lucide-react';
import { ClientRecord } from '@/types/estimator';
import { SalesInvoice, ClientPaymentRecord, DeliveryChalan } from '@/types/sales';
import { ProductionJob } from '@/types/production';

interface ClientsViewProps {
  clients: ClientRecord[];
  invoices: SalesInvoice[];
  paymentRecords: ClientPaymentRecord[];
  productionJobs: ProductionJob[];
  chalans: DeliveryChalan[];
  onOpenNewClientModal: () => void;
  onOpenPaymentForInvoice: (inv: SalesInvoice) => void;
  onOpenStatementModal: (clientName: string) => void;
  onStartJobForClient: (clientName: string) => void;
  onGoToEstimator: () => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  invoices,
  paymentRecords,
  productionJobs,
  chalans,
  onOpenNewClientModal,
  onOpenPaymentForInvoice,
  onOpenStatementModal,
  onStartJobForClient,
  onGoToEstimator,
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDueStatus, setFilterDueStatus] = useState<'all' | 'due' | 'clear'>('all');
  const [sortBy, setSortBy] = useState<'due_desc' | 'sales_desc' | 'name' | 'orders_desc'>('due_desc');
  const [activeHistoryTab, setActiveHistoryTab] = useState<'invoices' | 'payments' | 'jobs' | 'chalans' | 'ledger'>('invoices');

  // Format currency helper
  const fmt = (val: number) => `৳ ${Math.round(val).toLocaleString('en-IN')}`;

  // Helper to compute stats for any client
  const getClientStats = (clientName: string, clientCompany?: string) => {
    const cInvoices = invoices.filter(
      (i) => i.clientName.toLowerCase() === clientName.toLowerCase() ||
             (clientCompany && i.clientName.toLowerCase() === clientCompany.toLowerCase())
    );
    const cPayments = paymentRecords.filter(
      (p) => p.clientName.toLowerCase() === clientName.toLowerCase() ||
             (clientCompany && p.clientName.toLowerCase() === clientCompany.toLowerCase())
    );
    const cJobs = productionJobs.filter(
      (j) => j.client.toLowerCase() === clientName.toLowerCase() ||
             (clientCompany && j.client.toLowerCase() === clientCompany.toLowerCase())
    );
    const cChalans = chalans.filter(
      (c) => c.clientName.toLowerCase() === clientName.toLowerCase() ||
             (clientCompany && c.clientName.toLowerCase() === clientCompany.toLowerCase())
    );

    const totalBilled = cInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
    const totalAdvance = cInvoices.reduce((acc, inv) => acc + inv.advancePaid, 0);
    const directPayments = cPayments.reduce((acc, p) => acc + p.amount, 0);
    const totalDue = cInvoices.reduce((acc, inv) => acc + inv.dueAmount, 0);
    const totalCollected = totalAdvance + directPayments;

    return {
      invoices: cInvoices,
      payments: cPayments,
      jobs: cJobs,
      chalans: cChalans,
      totalBilled,
      totalCollected,
      totalDue,
      invoiceCount: cInvoices.length,
      jobCount: cJobs.length,
    };
  };

  // Grand totals across all clients
  const totalCommercialInvoiced = useMemo(
    () => invoices.reduce((acc, i) => acc + i.totalAmount, 0),
    [invoices]
  );
  const totalCommercialDue = useMemo(
    () => invoices.reduce((acc, i) => acc + i.dueAmount, 0),
    [invoices]
  );
  const totalCommercialCollected = useMemo(() => {
    const adv = invoices.reduce((acc, i) => acc + i.advancePaid, 0);
    const pay = paymentRecords.reduce((acc, p) => acc + p.amount, 0);
    return adv + pay;
  }, [invoices, paymentRecords]);

  // Selected client object & its full dataset
  const selectedClient = useMemo(
    () => clients.find((c) => c.id === selectedClientId) || null,
    [clients, selectedClientId]
  );

  const selectedStats = useMemo(() => {
    if (!selectedClient) return null;
    return getClientStats(selectedClient.name, selectedClient.company);
  }, [selectedClient, invoices, paymentRecords, productionJobs, chalans]);

  // Filtered and sorted clients for Directory View
  const processedClients = useMemo(() => {
    return clients
      .map((c) => {
        const stats = getClientStats(c.name, c.company);
        return {
          ...c,
          totalBilled: stats.totalBilled,
          totalCollected: stats.totalCollected,
          totalDue: stats.totalDue,
          invoiceCount: stats.invoiceCount,
          jobCount: stats.jobCount,
        };
      })
      .filter((c) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q);

        if (!matchesSearch) return false;

        if (filterDueStatus === 'due') return c.totalDue > 0;
        if (filterDueStatus === 'clear') return c.totalDue <= 0;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'due_desc') return b.totalDue - a.totalDue;
        if (sortBy === 'sales_desc') return b.totalBilled - a.totalBilled;
        if (sortBy === 'orders_desc') return b.jobCount - a.jobCount;
        return a.name.localeCompare(b.name);
      });
  }, [clients, invoices, paymentRecords, productionJobs, searchQuery, filterDueStatus, sortBy]);

  // Chronological ledger calculation for selected client
  const chronologicalLedger = useMemo(() => {
    if (!selectedClient || !selectedStats) return [];

    type LedgerRow = {
      date: string;
      ref: string;
      type: 'invoice' | 'payment';
      particulars: string;
      debit: number;
      credit: number;
      balance: number;
    };

    const rawRows: {
      date: string;
      ref: string;
      type: 'invoice' | 'payment';
      particulars: string;
      debit: number;
      credit: number;
    }[] = [];

    selectedStats.invoices.forEach((inv) => {
      rawRows.push({
        date: inv.invoiceDate,
        ref: inv.id,
        type: 'invoice',
        particulars: `Bill: ${inv.jobTitle} (${inv.quantity.toLocaleString()} pcs)`,
        debit: inv.totalAmount,
        credit: 0,
      });
      if (inv.advancePaid > 0) {
        rawRows.push({
          date: inv.invoiceDate,
          ref: `ADV-${inv.id}`,
          type: 'payment',
          particulars: `Advance Received for ${inv.id}`,
          debit: 0,
          credit: inv.advancePaid,
        });
      }
    });

    selectedStats.payments.forEach((pay) => {
      rawRows.push({
        date: pay.paymentDate,
        ref: pay.id,
        type: 'payment',
        particulars: `Payment (${pay.paymentMethod.toUpperCase()}${
          pay.referenceNumber ? ` - ${pay.referenceNumber}` : ''
        })`,
        debit: 0,
        credit: pay.amount,
      });
    });

    rawRows.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let running = 0;
    const finalRows: LedgerRow[] = rawRows.map((r) => {
      running += r.debit - r.credit;
      return {
        ...r,
        balance: running,
      };
    });

    return finalRows;
  }, [selectedClient, selectedStats]);

  // Color generator for avatar initials
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-600 text-white',
      'bg-rose-600 text-white',
      'bg-amber-600 text-white',
      'bg-emerald-600 text-white',
      'bg-purple-600 text-white',
      'bg-indigo-600 text-white',
      'bg-teal-600 text-white',
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  // -------------------------------------------------------------
  // VIEW 1: SELECTED CLIENT HISTORY & DRILLDOWN VIEW
  // -------------------------------------------------------------
  if (selectedClient && selectedStats) {
    const firstDueInvoice = selectedStats.invoices.find((i) => i.dueAmount > 0);
    const recoveryRate =
      selectedStats.totalBilled > 0
        ? Math.min(100, Math.round((selectedStats.totalCollected / selectedStats.totalBilled) * 100))
        : 100;

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Sticky Back Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setSelectedClientId(null)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#881337] dark:hover:text-rose-400 transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>← Back to All Clients (সকল গ্রাহকের তালিকায় ফিরুন)</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Account ID: {selectedClient.id}
            </span>
          </div>
        </div>

        {/* Client Profile Hero Banner */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Avatar & Details */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-bold text-xl shadow-md ${getAvatarColor(
                  selectedClient.name
                )}`}
              >
                {selectedClient.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {selectedClient.name}
                  </h2>
                  {selectedStats.totalDue > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 px-2.5 py-0.5 text-xs font-bold text-rose-800 dark:text-rose-300">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>বকেয়া: {fmt(selectedStats.totalDue)}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>পরিশোধিত (No Due)</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  <span>{selectedClient.company || selectedClient.name}</span>
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-slate-400" />
                    <a
                      href={`tel:${selectedClient.phone}`}
                      className="hover:underline font-mono text-slate-700 dark:text-slate-300 font-semibold"
                    >
                      {selectedClient.phone}
                    </a>
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-slate-400" />
                    <span>{selectedClient.email}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span>{selectedClient.address}</span>
                  </span>
                  {selectedClient.bin && (
                    <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      BIN: {selectedClient.bin}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Quick Business Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => onStartJobForClient(selectedClient.name)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#881337] hover:bg-[#700f2e] text-white px-4 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-xs"
              >
                <Sparkles className="h-4 w-4" />
                <span>New Estimate / Job (নতুন কাজ)</span>
              </button>

              {firstDueInvoice && (
                <button
                  onClick={() => onOpenPaymentForInvoice(firstDueInvoice)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-xs"
                >
                  <Banknote className="h-4 w-4" />
                  <span>Take Payment (বকেয়া জমা)</span>
                </button>
              )}

              <button
                onClick={() => onOpenStatementModal(selectedClient.name)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all shadow-2xs"
              >
                <Printer className="h-4 w-4 text-slate-400" />
                <span>Statement (খতিয়ান প্রিন্ট)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Financial Performance Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Total Invoiced (মোট বিল)
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Receipt className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
              {fmt(selectedStats.totalBilled)}
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Across {selectedStats.invoiceCount} commercial invoices
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Total Collected (মোট জমা)
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Banknote className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">
              {fmt(selectedStats.totalCollected)}
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Advances + {selectedStats.payments.length} payment receipts
            </p>
          </div>

          <div className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
                Current Due Balance (বকেয়া)
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black font-mono text-rose-700 dark:text-rose-400">
              {fmt(selectedStats.totalDue)}
            </p>
            <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400">
              {selectedStats.totalDue > 0 ? 'Pending payment settlement' : 'Account is fully cleared'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Payment Recovery Rate
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black font-mono text-indigo-700 dark:text-indigo-300">
              {recoveryRate}%
            </p>
            <div className="mt-2 w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  recoveryRate >= 80 ? 'bg-emerald-500' : recoveryRate >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${recoveryRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* History Navigation Tabs */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs overflow-hidden">
          {/* Tabs Bar */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 pt-3 overflow-x-auto bg-slate-50/70 dark:bg-slate-900/60">
            <button
              onClick={() => setActiveHistoryTab('invoices')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeHistoryTab === 'invoices'
                  ? 'border-[#881337] text-[#881337] dark:text-rose-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Receipt className="h-4 w-4" />
              <span>Invoices (চালান ও বিলসমূহ)</span>
              <span className="rounded-full bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold">
                {selectedStats.invoices.length}
              </span>
            </button>

            <button
              onClick={() => setActiveHistoryTab('payments')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeHistoryTab === 'payments'
                  ? 'border-[#881337] text-[#881337] dark:text-rose-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Banknote className="h-4 w-4" />
              <span>Payment Receipts (জমার রসিদ)</span>
              <span className="rounded-full bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold">
                {selectedStats.payments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveHistoryTab('jobs')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeHistoryTab === 'jobs'
                  ? 'border-[#881337] text-[#881337] dark:text-rose-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Press Job Orders (কাজের অর্ডার)</span>
              <span className="rounded-full bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold">
                {selectedStats.jobs.length}
              </span>
            </button>

            <button
              onClick={() => setActiveHistoryTab('chalans')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeHistoryTab === 'chalans'
                  ? 'border-[#881337] text-[#881337] dark:text-rose-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Truck className="h-4 w-4" />
              <span>Delivery Chalans (গেটপাস)</span>
              <span className="rounded-full bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold">
                {selectedStats.chalans.length}
              </span>
            </button>

            <button
              onClick={() => setActiveHistoryTab('ledger')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeHistoryTab === 'ledger'
                  ? 'border-[#881337] text-[#881337] dark:text-rose-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Full Account Ledger (পূর্ণাঙ্গ খতিয়ান)</span>
            </button>
          </div>

          {/* Tab 1: Invoices */}
          {activeHistoryTab === 'invoices' && (
            <div className="p-4 sm:p-6">
              {selectedStats.invoices.length === 0 ? (
                <div className="py-12 text-center">
                  <Receipt className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto" />
                  <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                    No Invoices Generated Yet
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Create an estimate or job card for this client to issue sales invoices.
                  </p>
                  <button
                    onClick={() => onStartJobForClient(selectedClient.name)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#881337] text-white px-4 py-2 text-xs font-bold shadow-xs hover:bg-[#700f2e]"
                  >
                    Create Job & Invoice
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                        <th className="pb-3 pr-4">Invoice ID</th>
                        <th className="pb-3 px-4">Date</th>
                        <th className="pb-3 px-4">Job Title</th>
                        <th className="pb-3 px-4 text-right">Quantity</th>
                        <th className="pb-3 px-4 text-right">Total Bill</th>
                        <th className="pb-3 px-4 text-right">Advance Paid</th>
                        <th className="pb-3 px-4 text-right">Due Balance</th>
                        <th className="pb-3 px-4 text-center">Status</th>
                        <th className="pb-3 pl-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {selectedStats.invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 pr-4 font-mono font-bold text-slate-900 dark:text-white">
                            {inv.id}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                            {inv.invoiceDate}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-200 max-w-[220px] truncate">
                            {inv.jobTitle}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                            {inv.quantity.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                            {fmt(inv.totalAmount)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                            {fmt(inv.advancePaid)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold">
                            {inv.dueAmount > 0 ? (
                              <span className="text-rose-700 dark:text-rose-400">{fmt(inv.dueAmount)}</span>
                            ) : (
                              <span className="text-slate-400">৳ 0</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                inv.paymentStatus === 'paid'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                  : inv.paymentStatus === 'partial'
                                  ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                                  : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                              }`}
                            >
                              {inv.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3.5 pl-4 text-right">
                            {inv.dueAmount > 0 ? (
                              <button
                                onClick={() => onOpenPaymentForInvoice(inv)}
                                className="rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 text-[11px] font-bold shadow-2xs transition-all"
                              >
                                Take Payment
                              </button>
                            ) : (
                              <span className="text-[11px] text-emerald-600 font-semibold">Cleared</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Payments */}
          {activeHistoryTab === 'payments' && (
            <div className="p-4 sm:p-6">
              {selectedStats.payments.length === 0 ? (
                <div className="py-12 text-center">
                  <Banknote className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto" />
                  <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                    No Direct Payment Receipts Recorded
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    When the client pays via Cash, bKash, or Bank, record the voucher here.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                        <th className="pb-3 pr-4">Receipt ID</th>
                        <th className="pb-3 px-4">Date</th>
                        <th className="pb-3 px-4">Invoice Ref</th>
                        <th className="pb-3 px-4">Payment Method</th>
                        <th className="pb-3 px-4">Reference / Cheque #</th>
                        <th className="pb-3 px-4 text-right">Amount Received</th>
                        <th className="pb-3 pl-4 text-right">Recorded By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {selectedStats.payments.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 pr-4 font-mono font-bold text-slate-900 dark:text-white">
                            {p.id}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                            {p.paymentDate}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-800 dark:text-slate-200">
                            {p.invoiceId}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                              {p.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                            {p.referenceNumber || p.bankName || '—'}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                            {fmt(p.amount)}
                          </td>
                          <td className="py-3.5 pl-4 text-right text-slate-500 text-[11px]">
                            {p.recordedBy || 'Accounts'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Production Jobs */}
          {activeHistoryTab === 'jobs' && (
            <div className="p-4 sm:p-6">
              {selectedStats.jobs.length === 0 ? (
                <div className="py-12 text-center">
                  <Layers className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto" />
                  <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                    No Printing Press Jobs Queued
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Schedule printing jobs for this client using the Smart Estimator or Job Card modal.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                        <th className="pb-3 pr-4">Job No</th>
                        <th className="pb-3 px-4">Job Title</th>
                        <th className="pb-3 px-4">Paper & GSM</th>
                        <th className="pb-3 px-4">Machine</th>
                        <th className="pb-3 px-4 text-right">Target Qty</th>
                        <th className="pb-3 px-4">Stage</th>
                        <th className="pb-3 pl-4 text-right">Delivery Due</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {selectedStats.jobs.map((j) => (
                        <tr key={j.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 pr-4 font-mono font-bold text-slate-900 dark:text-white">
                            {j.id}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-200 max-w-[200px] truncate">
                            {j.jobTitle}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                            {j.paperSpec || 'Art Paper'}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-medium">
                            {j.assignedMachineId || 'Offset Press'}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                            {j.quantity.toLocaleString()} pcs
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="rounded bg-rose-100 dark:bg-rose-950/80 text-[#881337] dark:text-rose-300 font-bold px-2 py-0.5 text-[10px] uppercase">
                              {j.currentStage}
                            </span>
                          </td>
                          <td className="py-3.5 pl-4 text-right font-mono text-slate-600 dark:text-slate-400">
                            {j.dueDate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Delivery Chalans */}
          {activeHistoryTab === 'chalans' && (
            <div className="p-4 sm:p-6">
              {selectedStats.chalans.length === 0 ? (
                <div className="py-12 text-center">
                  <Truck className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto" />
                  <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                    No Delivery Chalans Dispatched
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Generate delivery chalans with vehicle gate passes from the Delivery Chalans view.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                        <th className="pb-3 pr-4">Chalan No</th>
                        <th className="pb-3 px-4">Gate Pass</th>
                        <th className="pb-3 px-4">Job / Product</th>
                        <th className="pb-3 px-4 text-right">Delivered Qty</th>
                        <th className="pb-3 px-4">Packages</th>
                        <th className="pb-3 px-4">Transport & Driver</th>
                        <th className="pb-3 pl-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {selectedStats.chalans.map((ch) => (
                        <tr key={ch.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 pr-4 font-mono font-bold text-slate-900 dark:text-white">
                            {ch.id}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                            {ch.gatePassNo}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-200">
                            {ch.jobTitle}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                            {ch.deliveredQuantity.toLocaleString()} pcs
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-[11px]">
                            {ch.packageCount} Bundles
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-[11px]">
                            {ch.vehicleNumber || ch.transportMode}
                          </td>
                          <td className="py-3.5 pl-4 text-right">
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                                ch.status === 'delivered'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                              }`}
                            >
                              {ch.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 5: Chronological Ledger */}
          {activeHistoryTab === 'ledger' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Chronological Client Ledger (খতিয়ান বিবরণী)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Running account balance of bills debited and payments credited.
                  </p>
                </div>
                <button
                  onClick={() => onOpenStatementModal(selectedClient.name)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-400" />
                  <span>Print Formal Statement</span>
                </button>
              </div>

              {chronologicalLedger.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  No transactions recorded for this client ledger yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider font-sans">
                        <th className="pb-3 pr-4">Date</th>
                        <th className="pb-3 px-4">Ref No.</th>
                        <th className="pb-3 px-4 font-sans">Particulars (বিবরণ)</th>
                        <th className="pb-3 px-4 text-right">Debit (বিল)</th>
                        <th className="pb-3 px-4 text-right">Credit (জমা)</th>
                        <th className="pb-3 pl-4 text-right">Balance (বকেয়া)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {chronologicalLedger.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">{row.date}</td>
                          <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{row.ref}</td>
                          <td className="py-3 px-4 font-sans text-slate-800 dark:text-slate-300 max-w-[280px] truncate">
                            {row.particulars}
                          </td>
                          <td className="py-3 px-4 text-right text-rose-700 dark:text-rose-400 font-bold">
                            {row.debit > 0 ? fmt(row.debit) : '—'}
                          </td>
                          <td className="py-3 px-4 text-right text-emerald-700 dark:text-emerald-400 font-bold">
                            {row.credit > 0 ? fmt(row.credit) : '—'}
                          </td>
                          <td className="py-3 pl-4 text-right font-black text-slate-900 dark:text-white">
                            {fmt(row.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: CLIENTS DIRECTORY & KPI OVERVIEW (DEFAULT VIEW)
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 sm:p-6 lg:px-7 shadow-xs">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-[#881337] text-white shadow-sm shadow-rose-950/20">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Client Accounts & Ledgers (গ্রাহক খতিয়ান)
              </h1>
              <span className="rounded-full bg-rose-100 dark:bg-rose-950/80 text-[#881337] dark:text-rose-300 font-bold text-xs px-2.5 py-0.5">
                {clients.length} Clients
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
              Commercial press client accounts, order history, billing ledger, and live receivables.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenNewClientModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#881337] hover:bg-[#700f2e] text-white px-5 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Client (নতুন গ্রাহক)</span>
          </button>

          <button
            onClick={onGoToEstimator}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Open Smart Estimator</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Accounts (গ্রাহক সংখ্যা)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black font-mono text-slate-900 dark:text-white">
            {clients.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Registered commercial press buyers
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Billed (মোট বিল)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black font-mono text-slate-900 dark:text-white">
            {fmt(totalCommercialInvoiced)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Total lifetime billed value
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Collected (মোট জমা)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Banknote className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">
            {fmt(totalCommercialCollected)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Advances + cleared payment vouchers
          </p>
        </div>

        <div className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
              Total Outstanding Due (মোট বাকি)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black font-mono text-rose-700 dark:text-rose-400">
            {fmt(totalCommercialDue)}
          </p>
          <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400">
            Pending collection from clients
          </p>
        </div>
      </div>

      {/* Search, Filter & Sorting Bar */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, company, phone, address..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#881337] shadow-2xs"
          />
        </div>

        {/* Filter Tabs & Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Pills */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => setFilterDueStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterDueStatus === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All ({clients.length})
            </button>
            <button
              onClick={() => setFilterDueStatus('due')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterDueStatus === 'due'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
              }`}
            >
              Has Due (বাকি আছে)
            </button>
            <button
              onClick={() => setFilterDueStatus('clear')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterDueStatus === 'clear'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
              }`}
            >
              Settled (পরিশোধিত)
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            aria-label="Sort clients by"
            className="h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#881337]"
          >
            <option value="due_desc">Sort: Highest Due First</option>
            <option value="sales_desc">Sort: Highest Billing</option>
            <option value="orders_desc">Sort: Most Orders</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Clients Cards Grid */}
      {processedClients.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-12 text-center space-y-3 shadow-xs">
          <Users className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Clients Match Your Query
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or filter selection, or register a new client account.
          </p>
          <button
            onClick={onOpenNewClientModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#881337] text-white px-4 py-2 text-xs font-bold shadow-xs hover:bg-[#700f2e]"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Client</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {processedClients.map((client) => {
            return (
              <div
                key={client.id}
                className="group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs hover:border-[#881337]/50 dark:hover:border-rose-500/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Avatar & Due Status Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold text-sm shadow-sm ${getAvatarColor(
                          client.name
                        )}`}
                      >
                        {client.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4
                          onClick={() => setSelectedClientId(client.id)}
                          className="font-bold text-slate-900 dark:text-white text-sm hover:text-[#881337] dark:hover:text-rose-400 cursor-pointer transition-colors line-clamp-1"
                          title="Click to view full client history"
                        >
                          {client.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {client.company || client.name}
                        </p>
                      </div>
                    </div>

                    {client.totalDue > 0 ? (
                      <span className="shrink-0 rounded-md bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 px-2 py-0.5 text-[10px] font-bold">
                        বাকি: {fmt(client.totalDue)}
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-md bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                        পরিশোধিত
                      </span>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <p className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <a
                        href={`tel:${client.phone}`}
                        className="hover:underline font-mono text-slate-800 dark:text-slate-200 font-semibold"
                      >
                        {client.phone}
                      </a>
                    </p>
                    <p className="flex items-center gap-2 truncate">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{client.address}</span>
                    </p>
                  </div>

                  {/* Financial Metrics Strip */}
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2.5 text-center font-mono border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[9px] font-sans text-slate-400 uppercase font-bold block">
                        Billed
                      </span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {fmt(client.totalBilled)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-sans text-emerald-600 dark:text-emerald-400 uppercase font-bold block">
                        Paid
                      </span>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        {fmt(client.totalCollected)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-sans text-rose-600 dark:text-rose-400 uppercase font-bold block">
                        Due
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          client.totalDue > 0 ? 'text-rose-700 dark:text-rose-400' : 'text-slate-400'
                        }`}
                      >
                        {fmt(client.totalDue)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedClientId(client.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-[#881337] dark:hover:bg-rose-900 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-2xs flex-1 justify-center"
                  >
                    <span>View History (হিস্ট্রি)</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenStatementModal(client.name)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    title="Print Account Statement"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onStartJobForClient(client.name)}
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                    title="Start New Estimate / Job"
                  >
                    <Sparkles className="h-4 w-4 text-amber-500" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
