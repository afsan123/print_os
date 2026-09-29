'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Search,
  Printer,
  Calendar,
  DollarSign,
  Banknote,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Receipt,
  Users,
  Package,
  Layers,
  ArrowUpRight,
  Filter,
  Sparkles,
} from 'lucide-react';
import { SalesInvoice, ClientPaymentRecord } from '@/types/sales';

interface SalesReportViewProps {
  invoices: SalesInvoice[];
  paymentRecords: ClientPaymentRecord[];
  onOpenPaymentModal: (invoice: SalesInvoice) => void;
  onGoToEstimator: () => void;
}

export const SalesReportView: React.FC<SalesReportViewProps> = ({
  invoices,
  paymentRecords,
  onOpenPaymentModal,
  onGoToEstimator,
}) => {
  const [periodFilter, setPeriodFilter] = useState<'all' | '30days' | '7days'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid'>('all');

  const fmt = (v: number) => `৳ ${Math.round(v).toLocaleString('en-IN')}`;

  // Filter invoices by time period
  const periodInvoices = useMemo(() => {
    const now = Date.now();
    return invoices.filter((inv) => {
      const invDate = new Date(inv.invoiceDate).getTime();
      const diffDays = (now - invDate) / (1000 * 60 * 60 * 24);

      if (periodFilter === '7days') return diffDays <= 7;
      if (periodFilter === '30days') return diffDays <= 30;
      return true;
    });
  }, [invoices, periodFilter]);

  // Overall Totals
  const totalSales = useMemo(
    () => periodInvoices.reduce((acc, i) => acc + i.totalAmount, 0),
    [periodInvoices]
  );
  const totalPaid = useMemo(
    () => periodInvoices.reduce((acc, i) => acc + i.advancePaid, 0),
    [periodInvoices]
  );
  const totalDue = useMemo(
    () => periodInvoices.reduce((acc, i) => acc + i.dueAmount, 0),
    [periodInvoices]
  );
  const averageTicket = useMemo(
    () => (periodInvoices.length > 0 ? Math.round(totalSales / periodInvoices.length) : 0),
    [periodInvoices, totalSales]
  );

  const collectionRate = totalSales > 0 ? Math.min(100, Math.round((totalPaid / totalSales) * 100)) : 100;
  const dueRate = 100 - collectionRate;

  // Top Clients by Sales
  const topClients = useMemo(() => {
    const map = new Map<string, { name: string; sales: number; orders: number; due: number }>();
    periodInvoices.forEach((inv) => {
      const existing = map.get(inv.clientName) || {
        name: inv.clientName,
        sales: 0,
        orders: 0,
        due: 0,
      };
      existing.sales += inv.totalAmount;
      existing.orders += 1;
      existing.due += inv.dueAmount;
      map.set(inv.clientName, existing);
    });

    return Array.from(map.values())
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);
  }, [periodInvoices]);

  // Sales by Job Categories
  const categoryStats = useMemo(() => {
    const map = new Map<string, { category: string; sales: number; count: number }>();

    periodInvoices.forEach((inv) => {
      let cat = 'Commercial Printing';
      const title = inv.jobTitle.toLowerCase();
      if (title.includes('leaflet') || title.includes('flyer')) cat = 'Leaflets & Flyers';
      else if (title.includes('visiting card') || title.includes('card')) cat = 'Visiting Cards';
      else if (title.includes('brochure') || title.includes('pamphlet')) cat = 'Brochures & Catalogs';
      else if (title.includes('carton') || title.includes('packaging') || title.includes('box')) cat = 'Packaging Cartons';
      else if (title.includes('book') || title.includes('report') || title.includes('magazine')) cat = 'Books & Publications';
      else if (title.includes('pad') || title.includes('memo') || title.includes('chalan')) cat = 'Pads & Stationery';

      const cur = map.get(cat) || { category: cat, sales: 0, count: 0 };
      cur.sales += inv.totalAmount;
      cur.count += 1;
      map.set(cat, cur);
    });

    return Array.from(map.values()).sort((a, b) => b.sales - a.sales);
  }, [periodInvoices]);

  // Filtered list for detailed table
  const filteredList = useMemo(() => {
    return periodInvoices.filter((inv) => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        inv.id.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        inv.jobTitle.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'all' || inv.paymentStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [periodInvoices, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 sm:p-6 lg:px-7 shadow-xs">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-[#1D5DFF] text-white shadow-sm shadow-[#1D5DFF]/20">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
                Commercial Press Sales Reports (বিক্রয় ও আদায় রিপোর্ট)
              </h1>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs px-2.5 py-0.5">
                {periodInvoices.length} Orders
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
              Simplified sales analytics: total billing, cash advances collected, market dues, and top accounts.
            </p>
          </div>
        </div>

        {/* Period Selector & Print */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Period Filter Tabs */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => setPeriodFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                periodFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Time (সব সময়)
            </button>
            <button
              onClick={() => setPeriodFilter('30days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                periodFilter === '30days'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Last 30 Days (গত ৩০ দিন)
            </button>
            <button
              onClick={() => setPeriodFilter('7days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                periodFilter === '7days'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Last 7 Days (গত ৭ দিন)
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 px-3.5 py-2 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Printer className="h-4 w-4 text-slate-400" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* 4 Core Financial KPI Cards (Answers to Press Owner's Questions) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Sales */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Invoiced Sales (মোট বিক্রয়)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black font-mono text-slate-900 dark:text-white">
            {fmt(totalSales)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Total sales value for {periodInvoices.length} jobs
          </p>
        </div>

        {/* Card 2: Cash & Advances Collected */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Cash & Advances (মোট জমা/আদায়)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Banknote className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">
            {fmt(totalPaid)}
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            {collectionRate}% collected in cash / bank
          </p>
        </div>

        {/* Card 3: Market Due */}
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
              Market Credit Due (মার্কেটে বাকি)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black font-mono text-rose-700 dark:text-rose-400">
            {fmt(totalDue)}
          </p>
          <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400">
            {totalDue > 0 ? `${dueRate}% pending collection from clients` : 'All invoices fully settled'}
          </p>
        </div>

        {/* Card 4: Average Ticket Size */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Average Order Value (গড় কাজের মূল্য)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black font-mono text-slate-900 dark:text-white">
            {fmt(averageTicket)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Average billing per printing job
          </p>
        </div>
      </div>

      {/* Cash Collection vs Market Due Visual Progress Bar */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Sales Recovery Ratio (বিক্রয় আদায় অনুপাত)
          </span>
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-bold">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Collected: {fmt(totalPaid)} ({collectionRate}%)
            </span>
            <span className="text-rose-700 dark:text-rose-400 flex items-center gap-1 font-bold">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              Due: {fmt(totalDue)} ({dueRate}%)
            </span>
          </div>
        </div>

        <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${collectionRate}%` }}
            className="bg-emerald-600 transition-all duration-500 flex items-center justify-center text-[9px] font-bold text-white"
          >
            {collectionRate > 15 ? `${collectionRate}% Paid` : ''}
          </div>
          <div
            style={{ width: `${dueRate}%` }}
            className="bg-rose-500 transition-all duration-500 flex items-center justify-center text-[9px] font-bold text-white"
          >
            {dueRate > 15 ? `${dueRate}% Due` : ''}
          </div>
        </div>
      </div>

      {/* 2-Column Analytics: Top Clients & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Top Clients */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <Users className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Top Revenue Clients (সেরা খদ্দের)
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">By Sales Volume</span>
          </div>

          <div className="space-y-3.5">
            {topClients.map((c, idx) => {
              const clientShare = totalSales > 0 ? Math.round((c.sales / totalSales) * 100) : 0;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {c.name}
                      </span>
                      <span className="text-[10px] text-slate-400">({c.orders} orders)</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {fmt(c.sales)}
                      </span>
                      {c.due > 0 && (
                        <span className="ml-2 font-mono text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                          (Due: {fmt(c.due)})
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${clientShare}%` }}
                      className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Category Breakdown */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Package className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Sales by Print Product Category (পণ্যের ধরন অনুযায়ী সেল)
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">{categoryStats.length} Categories</span>
          </div>

          <div className="space-y-3.5">
            {categoryStats.map((cat, idx) => {
              const catShare = totalSales > 0 ? Math.round((cat.sales / totalSales) * 100) : 0;
              return (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {cat.category}
                      </span>
                      <span className="text-[10px] text-slate-400">({cat.count} jobs)</span>
                    </div>
                    <div className="text-right font-mono font-bold text-slate-900 dark:text-white">
                      {fmt(cat.sales)} ({catShare}%)
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      style={{ width: `${catShare}%` }}
                      className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Invoices Registry Table */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoices by client, job title, or ID..."
              className="w-full h-9.5 pl-10 pr-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1D5DFF]"
            />
          </div>

          <div className="flex items-center gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All ({periodInvoices.length})
            </button>
            <button
              onClick={() => setStatusFilter('paid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'paid'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setStatusFilter('partial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'partial'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-600'
              }`}
            >
              Partial
            </button>
            <button
              onClick={() => setStatusFilter('unpaid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                statusFilter === 'unpaid'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
              }`}
            >
              Unpaid
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="p-4 sm:p-6 overflow-x-auto">
          {filteredList.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              No sales invoices found matching your criteria.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="pb-3 pr-4">Invoice ID</th>
                  <th className="pb-3 px-4">Date</th>
                  <th className="pb-3 px-4">Client Name</th>
                  <th className="pb-3 px-4">Job Description</th>
                  <th className="pb-3 px-4 text-right">Quantity</th>
                  <th className="pb-3 px-4 text-right">Total Bill</th>
                  <th className="pb-3 px-4 text-right">Collected Advance</th>
                  <th className="pb-3 px-4 text-right">Market Due</th>
                  <th className="pb-3 px-4 text-center">Status</th>
                  <th className="pb-3 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredList.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 pr-4 font-mono font-bold text-slate-900 dark:text-white">
                      {inv.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                      {inv.invoiceDate}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-200">
                      {inv.clientName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300 max-w-[200px] truncate">
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
                          onClick={() => onOpenPaymentModal(inv)}
                          className="rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 text-[11px] font-bold shadow-2xs"
                        >
                          Collect Due
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-semibold">Cleared</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
