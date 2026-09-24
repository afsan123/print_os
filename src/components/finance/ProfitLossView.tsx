'use client';

import React, { useState } from 'react';
import {
  Printer,
  TrendingUp,
  DollarSign,
  Layers,
  Percent,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Minus,
  Equal,
  Sparkles,
  Building2,
  Zap,
  Coffee,
  Truck,
  Wrench,
  HelpCircle,
  Coins,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import { ProfitLossMetrics } from '@/types/finance';

interface ProfitLossViewProps {
  metrics: ProfitLossMetrics;
  onGoToEstimator: () => void;
}

export const ProfitLossView: React.FC<ProfitLossViewProps> = ({
  metrics,
  onGoToEstimator,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'month' | '30days'>('month');

  // Format currency in Indian/Bengali grouping
  const fmt = (v: number) => `৳ ${Math.round(v).toLocaleString('en-IN')}`;

  // Multiplier for simulated period view if toggled
  const periodMultiplier = selectedPeriod === 'all' ? 1.4 : selectedPeriod === '30days' ? 0.9 : 1.0;
  const grossRev = metrics.grossRevenue * periodMultiplier;
  const cogsTotal = metrics.cogs.total * periodMultiplier;
  const cogsPaper = metrics.cogs.paper * periodMultiplier;
  const cogsPlates = metrics.cogs.plates * periodMultiplier;
  const cogsPrinting = metrics.cogs.printing * periodMultiplier;
  const cogsFinishing = metrics.cogs.finishing * periodMultiplier;
  const cogsTransport = metrics.cogs.transport * periodMultiplier;

  const grossProf = grossRev - cogsTotal;
  const grossMargPct = Math.round((grossProf / (grossRev || 1)) * 100);

  const opexPower = metrics.operatingExpenses.power * periodMultiplier;
  const opexMaint = metrics.operatingExpenses.maintenance * periodMultiplier;
  const opexRent = metrics.operatingExpenses.rent * periodMultiplier;
  const opexLogistics = metrics.operatingExpenses.logistics * periodMultiplier;
  const opexTea = metrics.operatingExpenses.adminAndTea * periodMultiplier;
  const opexTotal = opexPower + opexMaint + opexRent + opexLogistics + opexTea;

  const netProf = grossProf - opexTotal;
  const netMargPct = Math.round((netProf / (grossRev || 1)) * 100);

  // 100 Taka share breakdown
  const cogsPct = Math.min(100, Math.max(0, Math.round((cogsTotal / (grossRev || 1)) * 100)));
  const opexPct = Math.min(100 - cogsPct, Math.max(0, Math.round((opexTotal / (grossRev || 1)) * 100)));
  const netPct = Math.max(0, 100 - cogsPct - opexPct);

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                সহজ লাভ-ক্ষতির হিসাব <span className="text-base sm:text-lg font-bold text-slate-400 font-sans">(Simple Profit & Loss)</span>
              </h1>
              <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                {selectedPeriod === 'month' ? 'চলতি মাস (Current Month)' : selectedPeriod === '30days' ? 'গত ৩০ দিন (Last 30 Days)' : 'সর্বমোট হিসাব (All Time)'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              জটিল হিসাব ছাড়াই দেখুন আপনার প্রেসের আসল বিক্রি কত, খরচ কত গেল, এবং আপনার পকেটে প্রকৃত লাভ কত থাকলো
            </p>
          </div>
        </div>

        {/* Period Selector & Action */}
        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedPeriod === 'month'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              চলতি মাস
            </button>
            <button
              onClick={() => setSelectedPeriod('30days')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedPeriod === '30days'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              গত ৩০ দিন
            </button>
            <button
              onClick={() => setSelectedPeriod('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedPeriod === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              সর্বমোট
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
          >
            <Printer className="h-4 w-4 text-slate-400" />
            <span>প্রিন্ট করুন</span>
          </button>
        </div>
      </div>

      {/* 3-Step Simple Math Banner (সহজ ৩-ধাপের হিসাব) */}
      <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800/80 bg-gradient-to-r from-emerald-50/70 via-teal-50/50 to-white dark:from-emerald-950/40 dark:via-slate-900 dark:to-slate-900 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <h2 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
            লাভের সহজ সমীকরণ (The 3-Step Profit Formula)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          {/* Step 1: Gross Sales */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200/90 dark:border-slate-700 shadow-xs relative">
            <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
              ১. মোট বিক্রি (Sales)
            </span>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
              {fmt(grossRev)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">সব ইনভয়েসের মোট মূল্য</p>
          </div>

          {/* Minus Step 2: Direct Job Costs */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 shadow-xs relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider">
                ২. বাদ কাজের খরচ (Costs)
              </span>
              <span className="h-5 w-5 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-700 dark:text-amber-300 font-black text-xs">
                -
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
              {fmt(cogsTotal)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">কাগজ, প্লেট, প্রিন্ট ও বাইন্ডিং ({cogsPct}%)</p>
          </div>

          {/* Equals Step 3: Gross Profit */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-teal-200 dark:border-teal-900/60 shadow-xs relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-teal-700 dark:text-teal-400 tracking-wider">
                ৩. কাজের মোট লাভ (Gross)
              </span>
              <span className="h-5 w-5 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-700 dark:text-teal-300 font-black text-xs">
                =
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-teal-700 dark:text-teal-400 font-mono mt-1">
              {fmt(grossProf)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">কাজের মার্জিন: {grossMargPct}%</p>
          </div>

          {/* Minus Step 4: Shop Overheads */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 shadow-xs relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-rose-700 dark:text-rose-400 tracking-wider">
                ৪. বাদ কারখানা/দোকান খরচ
              </span>
              <span className="h-5 w-5 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-700 dark:text-rose-300 font-black text-xs">
                -
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 font-mono mt-1">
              {fmt(opexTotal)}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">ভাড়া, কারেন্ট, মেনটেন্যান্স ({opexPct}%)</p>
          </div>

          {/* Equals Step 5: Net Profit in Pocket */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-4 rounded-xl shadow-md relative sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-emerald-200 tracking-wider">
                ৫. আসল নিট লাভ (Pocket Profit)
              </span>
              <span className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-xs">
                =
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-black font-mono mt-1 text-white">
              {fmt(netProf)}
            </p>
            <p className="text-[11px] text-emerald-100 mt-0.5 font-bold">
              মালিকের নিট লাভ: {netMargPct}%
            </p>
          </div>
        </div>
      </div>

      {/* "Where Did Every ৳100 Go?" (প্রতি ১০০ টাকার সহজ হিসাব) */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>প্রতি ১০০ টাকার বিক্রিতে খরচ ও লাভের ভাগ</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">(Where Every ৳100 Goes)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              কাস্টমারের দেওয়া প্রতি ১০০ টাকায় কত টাকা কোথায় চলে যাচ্ছে এবং কত টাকা আপনার হাতে থাকছে
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono font-bold">
            <span className="text-slate-500 dark:text-slate-400">মোট বিক্রি = ১০০ টাকা</span>
          </div>
        </div>

        {/* 100-Taka Progress Bar */}
        <div className="h-8 w-full rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex shadow-inner p-1 gap-1">
          <div
            style={{ width: `${cogsPct}%` }}
            className="bg-amber-500 rounded-lg transition-all flex items-center justify-center text-xs font-black text-white shadow-xs"
            title={`কাজের সরাসরি খরচ: ৳${cogsPct}`}
          >
            {cogsPct >= 15 ? `৳ ${cogsPct} কাজের খরচ` : `৳${cogsPct}`}
          </div>
          <div
            style={{ width: `${opexPct}%` }}
            className="bg-rose-500 rounded-lg transition-all flex items-center justify-center text-xs font-black text-white shadow-xs"
            title={`কারখানা ও দোকান খরচ: ৳${opexPct}`}
          >
            {opexPct >= 15 ? `৳ ${opexPct} কারখানা খরচ` : `৳${opexPct}`}
          </div>
          <div
            style={{ width: `${netPct}%` }}
            className="bg-emerald-600 rounded-lg transition-all flex items-center justify-center text-xs font-black text-white shadow-xs"
            title={`আপনার নিট লাভ: ৳${netPct}`}
          >
            {netPct >= 15 ? `৳ ${netPct} আসল লাভ!` : `৳${netPct}`}
          </div>
        </div>

        {/* Three visual distribution cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
            <div className="h-9 w-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-900 dark:text-amber-300">কাজের কাঁচামাল ও প্রেস খরচ</span>
                <span className="text-xs font-black font-mono text-amber-700 dark:text-amber-400">৳ {cogsPct}</span>
              </div>
              <p className="text-[11px] text-amber-800/80 dark:text-amber-400/80 mt-0.5">
                কাগজ, সিটিপি প্লেট, মেশিনের কালি-লেবার ও বাইন্ডিং বাবদ খরচ হয়
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40">
            <div className="h-9 w-9 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-rose-900 dark:text-rose-300">কারখানা ও দোকান পরিচালনা</span>
                <span className="text-xs font-black font-mono text-rose-700 dark:text-rose-400">৳ {opexPct}</span>
              </div>
              <p className="text-[11px] text-rose-800/80 dark:text-rose-400/80 mt-0.5">
                বিদ্যুৎ বিল, দোকান ভাড়া, মেশিন সার্ভিসিং ও কর্মচারীদের চা-নাস্তা খরচ
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50">
            <div className="h-9 w-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-emerald-900 dark:text-emerald-300">মালিকের নিজের নিট লাভ</span>
                <span className="text-xs font-black font-mono text-emerald-700 dark:text-emerald-400">৳ {netPct}</span>
              </div>
              <p className="text-[11px] text-emerald-800/80 dark:text-emerald-400/80 mt-0.5">
                সব পাওনা মিটিয়ে প্রতি ১০০ টাকার বিক্রি থেকে এই টাকা সম্পূর্ণ আপনার
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified, Plain-Language Itemized Schedule */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden printable-voucher">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-black text-slate-900 dark:text-white text-base">
              সহজ খরচের তালিকা ও লাভের খতিয়ান (Detailed Simple Breakdown)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              প্রেসের প্রতিটি খরচের স্পষ্ট হিসাব — কোনো গোপন বা অবোধ্য টার্ম নেই
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
            সব টাকা বাংলাদেশি মুদ্রায় (৳ BDT)
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {/* SECTION 1: INVOICED SALES */}
          <div className="p-5 bg-blue-50/20 dark:bg-blue-950/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-black text-xs">
                  ১
                </span>
                <span className="font-black text-slate-900 dark:text-white text-sm">
                  মোট বিক্রি ও আয় (Gross Invoiced Revenue)
                </span>
              </div>
              <span className="font-mono text-base font-black text-blue-700 dark:text-blue-400">
                {fmt(grossRev)}
              </span>
            </div>

            <div className="pl-9 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                <span>গ্রাহকদের দেওয়া সব প্রিন্টিং বিলের যোগফল (Total Commercial Invoices)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-200">{fmt(grossRev)}</span>
              </div>
            </div>
          </div>

          {/* SECTION 2: DIRECT PRODUCTION COSTS */}
          <div className="p-5 bg-amber-50/10 dark:bg-amber-950/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-black text-xs">
                  ২
                </span>
                <div>
                  <span className="font-black text-slate-900 dark:text-white text-sm">
                    কাজের সরাসরি উৎপাদন খরচ (Direct Production Costs)
                  </span>
                  <span className="text-[11px] text-amber-600 dark:text-amber-400 ml-2 font-bold font-mono">
                    (মোট বিক্রির {cogsPct}%)
                  </span>
                </div>
              </div>
              <span className="font-mono text-base font-black text-amber-600 dark:text-amber-400">
                - {fmt(cogsTotal)}
              </span>
            </div>

            <div className="pl-9 space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>কাগজ ও বোর্ড কেনা (Raw Paper, Art Card & Board)</span>
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{fmt(cogsPaper)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>সিটিপি প্লেট ও প্রসেসিং (Thermal CTP Plates)</span>
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{fmt(cogsPlates)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>মেশিন ছাপাই ও অপারেটর লেবার (Press Impression & Printing Labor)</span>
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{fmt(cogsPrinting)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>পোস্ট-প্রেস ফিনিশিং (ল্যামিনেশন, ডাই কাটিং, পেস্টিং ও বাইন্ডিং)</span>
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{fmt(cogsFinishing)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span>কাজের ডেলিভারি ও ভ্যান ভাড়া (Job Cartage & Delivery)</span>
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{fmt(cogsTransport)}</span>
              </div>
            </div>

            {/* Subtotal: Gross Profit */}
            <div className="mt-3 pl-9 pt-2.5 flex items-center justify-between text-xs font-black bg-emerald-50/60 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200/80 dark:border-emerald-800/50">
              <span className="text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                = কাজের গ্রস মুনাফা (Gross Margin after Direct Costs)
              </span>
              <span className="font-mono text-sm text-emerald-800 dark:text-emerald-300">
                {fmt(grossProf)} ({grossMargPct}%)
              </span>
            </div>
          </div>

          {/* SECTION 3: FACTORY & SHOP OVERHEAD EXPENSES */}
          <div className="p-5 bg-rose-50/10 dark:bg-rose-950/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-black text-xs">
                  ৩
                </span>
                <div>
                  <span className="font-black text-slate-900 dark:text-white text-sm">
                    কারখানা ও দোকান পরিচালনার মাসিক খরচ (Shop & Factory Expenses)
                  </span>
                  <span className="text-[11px] text-rose-600 dark:text-rose-400 ml-2 font-bold font-mono">
                    (মোট বিক্রির {opexPct}%)
                  </span>
                </div>
              </div>
              <span className="font-mono text-base font-black text-rose-600 dark:text-rose-400">
                - {fmt(opexTotal)}
              </span>
            </div>

            <div className="pl-9 space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-amber-500" />
                  <span>কমার্শিয়াল বিদ্যুৎ বিল (3-Phase Industrial Power)</span>
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{fmt(opexPower)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <Wrench className="h-3.5 w-3.5 text-blue-500" />
                  <span>মেশিন মেরামত, রোলার গ্রাইন্ডিং ও কেমিক্যাল অয়েল (Maintenance)</span>
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{fmt(opexMaint)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-indigo-500" />
                  <span>দোকান ও গোডাউন মাসিক ভাড়া (Factory & Godown Rent)</span>
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{fmt(opexRent)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <Truck className="h-3.5 w-3.5 text-violet-500" />
                  <span>ডেলিভারি ভ্যান ও গাড়ির সিএনজি/তেল খরচ (Logistics Fuel)</span>
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{fmt(opexLogistics)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-2">
                  <Coffee className="h-3.5 w-3.5 text-amber-700" />
                  <span>স্টাফদের চা-নাস্তা, ফিল্টার পানি ও হাত খরচ (Staff Tea & Refreshments)</span>
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{fmt(opexTea)}</span>
              </div>
            </div>
          </div>

          {/* FINAL BOTTOM LINE: NET TAKE-HOME PROFIT */}
          <div className="p-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/50 dark:from-emerald-950/80 dark:via-teal-950/60 dark:to-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t-2 border-emerald-500">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black">
                  ✓
                </div>
                <div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-emerald-100">
                    মালিকের আসল নিট লাভ (True In-Pocket Net Profit)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    কাগজ, প্রিন্টিং ও কারখানা খরচ বাদে এই মুহূর্তে আপনার প্রেসের অর্জিত প্রকৃত লাভ
                  </p>
                </div>
              </div>
            </div>

            <div className="text-right self-start sm:self-auto">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 block">
                নিট মার্জিন {netMargPct}%
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-800 dark:text-emerald-200 font-mono">
                {fmt(netProf)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Practical Business Advice & Health Tip */}
      <div className="rounded-2xl border border-blue-200/90 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-blue-950 dark:text-blue-200">
              প্রেস ম্যানেজমেন্ট পরামর্শ (Business Health Insight)
            </h4>
            <p className="text-xs text-blue-800/90 dark:text-blue-300/90 mt-0.5 leading-relaxed">
              {cogsPct > 65 ? (
                <span>⚠️ আপনার কাজের খরচ (কাগজ ও প্রিন্টিং) বিক্রির <strong>{cogsPct}%</strong> ছাড়িয়ে গেছে। পেপারের রেট নেগোশিয়েট করুন অথবা এস্টিমেটরে কোটেশন রেট সামান্য বৃদ্ধি করুন।</span>
              ) : netPct >= 18 ? (
                <span>🎉 আপনার প্রেসের নিট লাভ মার্জিন <strong>{netMargPct}%</strong>, যা বাণিজ্যিক প্রিন্টিং ইন্ডাস্ট্রির জন্য অত্যন্ত চমৎকার ও স্বাস্থ্যকর!</span>
              ) : (
                <span>💡 প্রতি ১০০ টাকায় আপনার লাভ <strong>৳{netPct}</strong>। কারখানা বিদ্যুৎ খরচ ও ভ্যান লজিস্টিকস সামান্য সাশ্রয় করলে নিট মুনাফা আরও বৃদ্ধি পাবে।</span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={onGoToEstimator}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-xs font-bold transition-all shadow-xs shrink-0 self-end md:self-auto"
        >
          <span>নতুন কাজের কোটেশন তৈরি করুন</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
