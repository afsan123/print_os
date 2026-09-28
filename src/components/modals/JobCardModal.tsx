'use client';

import React, { useState } from 'react';
import {
  X,
  Printer,
  FileCheck,
  Scissors,
  Layers,
  CheckCircle2,
  Phone,
  Calendar,
  Clock,
  ShoppingCart,
  Send,
  Sparkles,
  Banknote,
  DollarSign,
} from 'lucide-react';
import { EstimatorState, CalculationResult } from '@/types/estimator';
import { ProductionJob } from '@/types/production';

interface JobCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  state?: EstimatorState;
  calc?: CalculationResult;
  job?: ProductionJob;
  initialAdvance?: number;
  onSendToProductionQueue?: (state: EstimatorState, calc: CalculationResult) => void;
  onBuyPaperForJob?: (state: EstimatorState, calc: CalculationResult, jobId?: string) => void;
  onCreateInvoice?: (state: EstimatorState, calc: CalculationResult, jobId: string, advancePaid?: number) => void;
  onIssueChalan?: (state: EstimatorState, calc: CalculationResult, jobId: string) => void;
}

const createDraftId = (prefix: string, seed: string) => {
  const hash = Array.from(seed).reduce((value, character) => ((value * 31) + character.charCodeAt(0)) >>> 0, 7);
  return `${prefix}-${String(1000 + (hash % 9000))}`;
};

export const JobCardModal: React.FC<JobCardModalProps> = ({
  isOpen,
  onClose,
  state,
  calc,
  job,
  initialAdvance,
  onSendToProductionQueue,
  onBuyPaperForJob,
  onCreateInvoice,
}) => {
  const [docType, setDocType] = useState<'job_card' | 'invoice'>('job_card');
  const [advancePaid, setAdvancePaid] = useState<number>(initialAdvance ?? 0);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  // Derive specs whether passed from Estimator or from an existing ProductionJob
  const draftSeed = `${state?.jobSpecs.client ?? ''}-${state?.jobSpecs.jobTitle ?? ''}-${state?.jobSpecs.targetQuantity ?? ''}`;
  const jobCardNumber = job?.id || createDraftId('JC-2026', draftSeed);
  const invoiceNumber = createDraftId('INV-2026', draftSeed);
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const clientName = job?.client || state?.jobSpecs.client || 'Walking Customer';
  const jobTitle = job?.jobTitle || state?.jobSpecs.jobTitle || 'Commercial Print Order';
  const category = job?.category || state?.jobSpecs.category || 'General';
  const quantity = job?.quantity || state?.jobSpecs.targetQuantity || 1000;
  const dueDate = job?.dueDate || 'In 3 Days';
  const notes = job?.notes || state?.additionalExpenses.notes || '';

  // Technical Paper Specs
  const paperType = state?.paperConfig.paperType || job?.paperSpec?.split('(')[0] || '150 GSM Art Paper';
  const gsm = state?.paperConfig.gsm || 150;
  const fullSheetSize = state?.paperConfig.fullSheetSize || '23 × 36 inch';
  const piecesPerSheet = state?.paperConfig.piecesPerFullSheet || 4;

  const totalSheetsRequired = calc?.totalSheetsRequired || Math.ceil((quantity / piecesPerSheet) * 1.05);
  const wastageSheets = calc?.wastageSheets || Math.ceil((quantity / piecesPerSheet) * 0.05);
  const totalReamsRequired = calc?.totalReamsRequired || (totalSheetsRequired / 500).toFixed(2);
  const reamsPart = Math.floor(totalSheetsRequired / 500);
  const sheetsRemainder = totalSheetsRequired % 500;

  // Press Specs
  const colors = job?.colors || state?.pressConfig.colors || '4 Color (CMYK)';
  const sides = state?.pressConfig.sides || 'Single Side (এক পিঠ)';
  const plateCount = job?.platesCount || calc?.plateCount || 4;
  const impressions = job?.targetImpressions || calc?.machineImpressions || totalSheetsRequired;
  const machineName = 'Heidelberg Speedmaster SM 74';

  // Finishing Specs
  const hasLamination = job ? job.hasLamination : (state?.finishingConfig.lamination.enabled ?? false);
  const laminationType = job?.laminationType || (hasLamination ? state?.finishingConfig.lamination.type : 'None (নেই)');
  const hasDieCutting = job ? job.hasDieCutting : (state?.finishingConfig.dieCutting.enabled ?? false);
  const hasBinding = job ? job.hasBinding : (state?.finishingConfig.binding.enabled ?? false);
  const bindingType = job?.bindingType || (hasBinding ? state?.finishingConfig.binding.type : 'None (নেই)');

  const finalSellingPrice = calc?.finalSellingPrice || 0;
  const perPieceCost = calc?.perPieceCost || 0;

  // Advance & Due calculations
  const totalBill = finalSellingPrice;
  const dueAmount = Math.max(0, totalBill - advancePaid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white dark:bg-[#0f172a] shadow-2xl border border-slate-200 dark:border-slate-800 my-4 sm:my-8 overflow-hidden print:border-none print:shadow-none print:my-0 print:w-full print:max-w-none">
        
        {/* Modal Top Action Bar (Hidden in Print) */}
        <div className="flex flex-col gap-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-[#090d16] px-4 sm:px-6 py-3.5 print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#881337] text-white shadow-xs">
                <FileCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Small Press Job Card (প্রেস ডকেট)
                  </h3>
                  <span className="rounded-md bg-rose-100 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-900 px-2 py-0.5 text-[10px] font-bold text-[#881337] dark:text-rose-300">
                    1-Page Slip
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Paper cutting specs, plate counts, and optional advance payment
                </p>
              </div>
            </div>

            {/* Doc Type Toggle & Actions */}
            <div className="flex items-center gap-2 flex-wrap justify-end">
              <div className="flex rounded-lg bg-slate-200/80 dark:bg-slate-800 p-0.5 text-xs font-semibold">
                <button
                  onClick={() => setDocType('job_card')}
                  className={`rounded-md px-3 py-1.5 transition-all ${
                    docType === 'job_card'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Press Slip (জব স্লিপ)
                </button>
                <button
                  onClick={() => setDocType('invoice')}
                  className={`rounded-md px-3 py-1.5 transition-all ${
                    docType === 'invoice'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Client Bill (বিল)
                </button>
              </div>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-rose-900 hover:bg-slate-800 dark:hover:bg-rose-800 px-3.5 py-2 text-xs font-bold text-white transition-all shadow-xs"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Print Slip (প্রিন্ট)</span>
              </button>

              {onCreateInvoice && state && calc && (
                <button
                  onClick={() => {
                    onCreateInvoice(state, calc, jobCardNumber, advancePaid);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                  title="Create Sales Invoice with Advance"
                >
                  <span>Save Invoice</span>
                </button>
              )}

              {onSendToProductionQueue && state && calc && (
                <button
                  onClick={() => {
                    onSendToProductionQueue(state, calc);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#881337] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#700f2e] transition-colors shadow-2xs"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Send to Queue</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Interactive Advance Payment Bar (Optional) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Banknote className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                অগ্রিম জমা (Advance Deposit - Optional):
              </span>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono">
                  ৳
                </span>
                <input
                  type="number"
                  min={0}
                  max={totalBill}
                  value={advancePaid || ''}
                  placeholder="0 (ঐচ্ছিক)"
                  onChange={(e) => setAdvancePaid(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-32 h-8 pl-6 pr-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#881337]"
                />
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setAdvancePaid(0)}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                    advancePaid === 0
                      ? 'bg-slate-900 text-white dark:bg-slate-700'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                  }`}
                >
                  নেই (0)
                </button>
                <button
                  type="button"
                  onClick={() => setAdvancePaid(Math.round(totalBill * 0.25))}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                    advancePaid === Math.round(totalBill * 0.25)
                      ? 'bg-[#881337] text-white'
                      : 'bg-rose-100 dark:bg-rose-950/80 text-[#881337] dark:text-rose-300 hover:bg-rose-200'
                  }`}
                >
                  ২৫%
                </button>
                <button
                  type="button"
                  onClick={() => setAdvancePaid(Math.round(totalBill * 0.5))}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                    advancePaid === Math.round(totalBill * 0.5)
                      ? 'bg-[#881337] text-white'
                      : 'bg-rose-100 dark:bg-rose-950/80 text-[#881337] dark:text-rose-300 hover:bg-rose-200'
                  }`}
                >
                  ৫০%
                </button>
                <button
                  type="button"
                  onClick={() => setAdvancePaid(totalBill)}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                    advancePaid === totalBill
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200'
                  }`}
                >
                  সম্পূর্ণ (Full)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="text-slate-500 dark:text-slate-400">
                মোট বিল: <strong className="text-slate-900 dark:text-white">৳ {totalBill.toLocaleString()}</strong>
              </span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-rose-700 dark:text-rose-400">
                বকেয়া: <strong className="font-bold">৳ {dueAmount.toLocaleString()}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Printable Document Body (A4/A5 Crisp 1-Page Layout) */}
        <div
          className="p-5 sm:p-7 space-y-3.5 text-slate-900 bg-white dark:bg-[#0f172a] print:p-4 print:space-y-3 print:bg-white print:text-black"
          id="printable-area"
        >
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b-2 border-slate-900 dark:border-slate-700 print:border-black pb-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#881337] text-white font-black text-base print:border print:border-black">
                  P
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white print:text-black">
                    PrintOS Commercial Press
                  </h1>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-700">
                    142/A Arambagh, Fakirapool Press Area, Dhaka • Phone: +880 1711-223344
                  </p>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="inline-block rounded-md bg-[#881337] print:bg-black px-3 py-1 text-xs font-black uppercase tracking-wider text-white">
                {docType === 'job_card' ? 'FACTORY JOB DOCKET (প্রেস স্লিপ)' : 'COMMERCIAL BILL (কাস্টমার বিল)'}
              </div>
              <div className="mt-1 space-y-0.5 text-xs">
                <p className="font-mono font-black text-slate-900 dark:text-white print:text-black text-sm">
                  {docType === 'job_card' ? jobCardNumber : invoiceNumber}
                </p>
                <p className="text-slate-600 dark:text-slate-400 print:text-slate-700 text-[11px]">
                  Date: <strong>{currentDate}</strong> | Due: <strong className="text-rose-700 print:text-black">{dueDate}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Quick Client & Order Summary Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 rounded-xl border border-slate-300 dark:border-slate-700 print:border-black bg-slate-50 dark:bg-slate-900 print:bg-white p-3.5 text-xs">
            <div className="sm:col-span-5 space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:text-slate-600">
                Client / কাস্টমার
              </span>
              <p className="font-bold text-sm text-slate-900 dark:text-white print:text-black truncate">
                {clientName}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 print:text-slate-700 flex items-center gap-1">
                <Phone className="h-3 w-3 inline" /> +880 1712-345678 (Tejgaon, Dhaka)
              </p>
            </div>

            <div className="sm:col-span-4 space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:text-slate-600">
                Job Title / কাজের নাম
              </span>
              <p className="font-bold text-sm text-slate-900 dark:text-white print:text-black truncate">
                {jobTitle}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 print:text-slate-700">
                Type: {category}
              </p>
            </div>

            <div className="sm:col-span-3 text-left sm:text-right space-y-0.5 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-700 print:border-black pt-2 sm:pt-0 sm:pl-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 print:text-slate-600">
                Total Quantity / অর্ডার সংখ্যা
              </span>
              <p className="text-xl sm:text-2xl font-black font-mono text-[#881337] dark:text-rose-400 print:text-black">
                {quantity.toLocaleString()} <span className="text-xs font-normal">Pcs</span>
              </p>
            </div>
          </div>

          {/* Billing & Advance Settlement Bar (ঐচ্ছিক অগ্রিম ও বকেয়া হিসাব) */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border-2 border-slate-900 dark:border-slate-700 print:border-black bg-slate-50 dark:bg-slate-900 print:bg-white text-xs">
            <div className="flex items-center gap-4 sm:gap-6">
              <div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 print:text-slate-600 uppercase block">
                  মোট চুক্তি/বিল (Total Bill)
                </span>
                <p className="font-mono font-black text-sm text-slate-900 dark:text-white print:text-black">
                  ৳ {totalBill.toLocaleString()}
                </p>
              </div>

              <div className="border-l border-slate-300 dark:border-slate-700 print:border-black pl-3 sm:pl-4">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 print:text-slate-600 uppercase block">
                  জমা অগ্রিম (Advance Paid)
                </span>
                <p className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-300 print:text-black">
                  ৳ {advancePaid.toLocaleString()}
                </p>
              </div>

              <div className="border-l border-slate-300 dark:border-slate-700 print:border-black pl-3 sm:pl-4">
                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 print:text-slate-600 uppercase block">
                  ডেলিভারিতে বকেয়া (Due on Delivery)
                </span>
                <p className={`font-mono font-black text-sm print:text-black ${dueAmount > 0 ? 'text-[#881337] dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  ৳ {dueAmount.toLocaleString()}
                </p>
              </div>
            </div>

            <div>
              <span className={`text-[11px] font-bold px-3 py-1 rounded-full border print:border-black ${
                dueAmount === 0 && totalBill > 0
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                  : advancePaid > 0
                  ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                  : 'bg-slate-200 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {dueAmount === 0 && totalBill > 0
                  ? 'সম্পূর্ণ পরিশোধিত (Paid in Full ✓)'
                  : advancePaid > 0
                  ? `অগ্রিম গ্রহণ: ৳ ${advancePaid.toLocaleString()} (${Math.round((advancePaid / (totalBill || 1)) * 100)}%)`
                  : 'বকেয়া অর্ডার (No Advance Taken)'}
              </span>
            </div>
          </div>

          {docType === 'job_card' ? (
            /* 1-PAGE PRACTICAL PRESS FLOOR SPECIFICATIONS */
            <div className="space-y-3">
              
              {/* SECTION 1: Paper & Cutting Instructions (কাগজের মাপ ও ছাঁটাই নির্দেশ) */}
              <div className="rounded-xl border-2 border-slate-900 dark:border-slate-700 print:border-black p-3 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 print:border-black pb-1.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#881337] dark:text-rose-400 print:text-black flex items-center gap-1.5">
                    <Scissors className="h-3.5 w-3.5" />
                    ১. কাগজের হিসাব ও কাটিং সাইজ (Paper & Cutting Specs)
                  </h4>
                  <span className="text-[11px] font-bold bg-amber-100 dark:bg-amber-950 print:bg-white text-amber-900 dark:text-amber-200 print:text-black px-2 py-0.5 rounded border border-amber-300 print:border-black">
                    কাটিং মাস্টার ফলো করুন
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 print:bg-white border border-slate-200 dark:border-slate-700 print:border-black">
                    <span className="text-slate-500 dark:text-slate-400 print:text-slate-600 text-[10px] block">
                      কাগজের ধরন ও জিএসএম
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white print:text-black mt-0.5">
                      {paperType}
                    </p>
                    <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-300 print:text-black">
                      {gsm} GSM
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 print:bg-white border border-slate-200 dark:border-slate-700 print:border-black">
                    <span className="text-slate-500 dark:text-slate-400 print:text-slate-600 text-[10px] block">
                      মূল সাইজ (Full Sheet)
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white print:text-black mt-0.5">
                      {fullSheetSize}
                    </p>
                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 print:text-black">
                      ১ শিটে {piecesPerSheet} টি (Cut Part)
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 print:bg-white border border-slate-200 dark:border-slate-700 print:border-black">
                    <span className="text-slate-500 dark:text-slate-400 print:text-slate-600 text-[10px] block">
                      মোট শিট (৫% অপচয়সহ)
                    </span>
                    <p className="font-black text-base text-slate-900 dark:text-white print:text-black mt-0.5 font-mono">
                      {totalSheetsRequired.toLocaleString()} শিট
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-slate-600">
                      (ছাপা + {wastageSheets} অপচয়)
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 print:bg-white border-2 border-emerald-500 dark:border-emerald-700 print:border-black">
                    <span className="text-emerald-800 dark:text-emerald-300 print:text-black text-[10px] font-black block">
                      গোডাউন থেকে রিম ছাড়
                    </span>
                    <p className="font-black text-base text-emerald-950 dark:text-emerald-100 print:text-black mt-0.5 font-mono">
                      {reamsPart > 0 ? `${reamsPart} রিম ` : ''}{sheetsRemainder > 0 ? `${sheetsRemainder} শিট` : ''}
                    </p>
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 print:text-black">
                      (= {totalReamsRequired} Reams)
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Printing Specs (ছাপা ও প্লেটের হিসাব) */}
              <div className="rounded-xl border-2 border-slate-900 dark:border-slate-700 print:border-black p-3 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 print:border-black pb-1.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#881337] dark:text-rose-400 print:text-black flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    ২. ছাপা ও প্লেটের হিসাব (CTP Plate & Machine Printing)
                  </h4>
                  <span className="text-[11px] font-bold bg-blue-100 dark:bg-blue-950 print:bg-white text-blue-900 dark:text-blue-200 print:text-black px-2 py-0.5 rounded border border-blue-300 print:border-black">
                    মেশিন মাস্টার (ওস্তাদ)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 print:bg-white border border-slate-200 dark:border-slate-700 print:border-black">
                    <span className="text-slate-500 dark:text-slate-400 print:text-slate-600 text-[10px] block">
                      ছাপার মেশিন
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white print:text-black mt-0.5 truncate">
                      {machineName}
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-slate-600">
                      Offset Floor #1
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 print:bg-white border border-slate-200 dark:border-slate-700 print:border-black">
                    <span className="text-slate-500 dark:text-slate-400 print:text-slate-600 text-[10px] block">
                      রঙ ও পিঠ (Color & Side)
                    </span>
                    <p className="font-bold text-slate-900 dark:text-white print:text-black mt-0.5">
                      {colors}
                    </p>
                    <span className="text-[10px] font-bold text-rose-800 dark:text-rose-300 print:text-black">
                      {sides}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 print:bg-white border border-slate-200 dark:border-slate-700 print:border-black">
                    <span className="text-slate-500 dark:text-slate-400 print:text-slate-600 text-[10px] block">
                      CTP প্লেট সংখ্যা
                    </span>
                    <p className="font-black text-base text-slate-900 dark:text-white print:text-black mt-0.5 font-mono">
                      {plateCount} টি প্লেট
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-slate-600">
                      {colors.includes('4') ? 'C + M + Y + K' : 'Black / Spot'}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 print:bg-white border border-slate-200 dark:border-slate-700 print:border-black">
                    <span className="text-slate-500 dark:text-slate-400 print:text-slate-600 text-[10px] block">
                      মোট ইমপ্রেশন / ছাপা
                    </span>
                    <p className="font-black text-base text-[#881337] dark:text-rose-400 print:text-black mt-0.5 font-mono">
                      {impressions.toLocaleString()} Imp.
                    </p>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 print:text-slate-600">
                      মেশিন কাউন্টার রিডিং
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Finishing & Bindery (ফিনিশিং ও বাঁধাই) */}
              <div className="rounded-xl border-2 border-slate-900 dark:border-slate-700 print:border-black p-3 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 print:border-black pb-1.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#881337] dark:text-rose-400 print:text-black flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    ৩. পোস্ট প্রেস ও বাঁধাই (Post-Press & Binding Instructions)
                  </h4>
                  <span className="text-[11px] font-bold bg-purple-100 dark:bg-purple-950 print:bg-white text-purple-900 dark:text-purple-200 print:text-black px-2 py-0.5 rounded border border-purple-300 print:border-black">
                    বাইন্ডিং ও ফিনিশিং
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  {/* Lamination */}
                  <div className={`p-2.5 rounded-lg border ${
                    hasLamination
                      ? 'border-rose-400 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/40 print:bg-white print:border-black'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 print:bg-white print:border-black'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white print:text-black">লেমিনেশন (Lamination)</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        hasLamination
                          ? 'bg-rose-700 text-white print:bg-black'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 print:text-black'
                      }`}>
                        {hasLamination ? 'হবে (YES)' : 'নেই (NO)'}
                      </span>
                    </div>
                    <p className="mt-1 font-semibold text-xs text-[#881337] dark:text-rose-300 print:text-black">
                      {laminationType}
                    </p>
                  </div>

                  {/* Die Cutting */}
                  <div className={`p-2.5 rounded-lg border ${
                    hasDieCutting
                      ? 'border-rose-400 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/40 print:bg-white print:border-black'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 print:bg-white print:border-black'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white print:text-black">ডাই কাটিং ও খাঁজ (Die Cut)</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        hasDieCutting
                          ? 'bg-rose-700 text-white print:bg-black'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 print:text-black'
                      }`}>
                        {hasDieCutting ? 'হবে (YES)' : 'সাধারণ ছাঁটাই'}
                      </span>
                    </div>
                    <p className="mt-1 font-semibold text-xs text-[#881337] dark:text-rose-300 print:text-black">
                      {hasDieCutting ? 'ডাই ব্লক অনুযায়ী খাঁজ ও পাঞ্চ' : 'স্ট্রেট কাটিং'}
                    </p>
                  </div>

                  {/* Binding */}
                  <div className={`p-2.5 rounded-lg border ${
                    hasBinding
                      ? 'border-rose-400 dark:border-rose-800 bg-rose-50/70 dark:bg-rose-950/40 print:bg-white print:border-black'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 print:bg-white print:border-black'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white print:text-black">বাঁধাই (Binding)</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        hasBinding
                          ? 'bg-rose-700 text-white print:bg-black'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 print:text-black'
                      }`}>
                        {hasBinding ? 'হবে (YES)' : 'নেই (NO)'}
                      </span>
                    </div>
                    <p className="mt-1 font-semibold text-xs text-[#881337] dark:text-rose-300 print:text-black">
                      {bindingType}
                    </p>
                  </div>
                </div>

                {/* Operator Special Note */}
                {notes && (
                  <div className="mt-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 print:bg-white border border-amber-300 dark:border-amber-800 print:border-black text-xs text-amber-950 dark:text-amber-200 print:text-black">
                    <span className="font-bold">বিশেষ নোট (Special Instructions): </span>
                    {notes}
                  </div>
                )}
              </div>

              {/* SECTION 4: Floor Progress Sign-off Checklist (কাজের ধাপ চেকলিস্ট) */}
              <div className="rounded-xl border border-slate-300 dark:border-slate-700 print:border-black p-3 bg-slate-50/60 dark:bg-slate-900/60 print:bg-white">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-400 print:text-black block mb-2">
                  ফ্যাক্টরি ফ্লোর চেকলিস্ট (মাস্টাররা কাজ শেষ করে টিক দিন ও সই করুন):
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <label className="flex items-center gap-2 p-1.5 rounded border border-slate-200 dark:border-slate-800 print:border-black bg-white dark:bg-slate-850 print:bg-white">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-400 text-rose-800 accent-[#881337]" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 print:text-black">১. কাগজ কাটিং</span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 rounded border border-slate-200 dark:border-slate-800 print:border-black bg-white dark:bg-slate-850 print:bg-white">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-400 text-rose-800 accent-[#881337]" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 print:text-black">২. CTP প্লেট রেডি</span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 rounded border border-slate-200 dark:border-slate-800 print:border-black bg-white dark:bg-slate-850 print:bg-white">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-400 text-rose-800 accent-[#881337]" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 print:text-black">৩. ছাপা সম্পন্ন</span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 rounded border border-slate-200 dark:border-slate-800 print:border-black bg-white dark:bg-slate-850 print:bg-white">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-400 text-rose-800 accent-[#881337]" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 print:text-black">৪. লেমিনেশন</span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 rounded border border-slate-200 dark:border-slate-800 print:border-black bg-white dark:bg-slate-850 print:bg-white">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-400 text-rose-800 accent-[#881337]" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 print:text-black">৫. ডাই/খাঁজ কাটিং</span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 rounded border border-slate-200 dark:border-slate-800 print:border-black bg-white dark:bg-slate-850 print:bg-white">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-400 text-rose-800 accent-[#881337]" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 print:text-black">৬. বাঁধাই সম্পন্ন</span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 rounded border border-slate-200 dark:border-slate-800 print:border-black bg-white dark:bg-slate-850 print:bg-white">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-400 text-rose-800 accent-[#881337]" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 print:text-black">৭. বান্ডিল প্যাকিং</span>
                  </label>
                  <label className="flex items-center gap-2 p-1.5 rounded border border-slate-200 dark:border-slate-800 print:border-black bg-white dark:bg-slate-850 print:bg-white">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-400 text-rose-800 accent-[#881337]" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 print:text-black">৮. ডেলিভারি রেডি</span>
                  </label>
                </div>
              </div>

            </div>
          ) : (
            /* COMMERCIAL BILL / CLIENT TAX INVOICE */
            <div className="space-y-4">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 print:bg-slate-100 text-slate-700 dark:text-slate-200 uppercase text-[10px] font-bold border-b border-slate-300 dark:border-slate-700 print:border-black">
                  <tr>
                    <th className="py-2.5 px-3">SL</th>
                    <th className="py-2.5 px-3">Description of Work (কাজের বিবরণ)</th>
                    <th className="py-2.5 px-3 text-right">Quantity</th>
                    <th className="py-2.5 px-3 text-right">Unit Rate</th>
                    <th className="py-2.5 px-3 text-right">Total (৳)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 print:divide-slate-200">
                  <tr>
                    <td className="py-3 px-3 font-mono text-slate-500 print:text-black">01</td>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-white print:text-black">
                      <div className="font-bold">{jobTitle}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 print:text-slate-600">
                        {paperType} ({gsm} GSM), {colors}, {hasLamination ? laminationType : ''}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      {quantity.toLocaleString()} Pcs
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      ৳ {perPieceCost > 0 ? perPieceCost.toFixed(2) : (finalSellingPrice / (quantity || 1)).toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold font-mono text-slate-900 dark:text-white print:text-black">
                      ৳ {finalSellingPrice.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Invoice Totals with Advance Breakdown */}
              <div className="flex justify-end pt-2">
                <div className="w-72 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400 print:text-slate-700">
                    <span>Subtotal (মোট বিল)</span>
                    <span className="font-mono font-semibold">৳ {totalBill.toLocaleString()}</span>
                  </div>
                  
                  {advancePaid > 0 && (
                    <div className="flex justify-between text-emerald-700 dark:text-emerald-400 print:text-slate-800 font-semibold">
                      <span>Less Advance Deposit (জমা অগ্রিম)</span>
                      <span className="font-mono">- ৳ {advancePaid.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between border-t-2 border-slate-900 dark:border-slate-700 print:border-black pt-1.5 font-bold text-sm text-slate-900 dark:text-white print:text-black">
                    <span>Net Due Balance (অবশিষ্ট বকেয়া)</span>
                    <span className={`font-mono ${dueAmount > 0 ? 'text-[#881337] dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'} print:text-black`}>
                      ৳ {dueAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Signatures & Barcode Footer */}
          <div className="pt-4 border-t-2 border-slate-900 dark:border-slate-700 print:border-black flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400 print:text-black">
            <div className="flex items-center gap-3">
              <div className="font-mono text-xl tracking-widest text-slate-900 dark:text-white print:text-black font-bold border border-slate-300 dark:border-slate-700 print:border-black px-2.5 py-0.5 rounded bg-slate-50 dark:bg-slate-900 print:bg-white">
                |||| | ||||| |||| ||
              </div>
              <div className="text-[10px]">
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 print:text-black">{jobCardNumber}</p>
                <p>Printed via PrintOS Smart ERP</p>
              </div>
            </div>

            <div className="flex gap-6 sm:gap-10 text-center text-[10px]">
              <div>
                <div className="w-20 border-b border-slate-400 print:border-black mb-1" />
                <span className="font-semibold text-slate-700 dark:text-slate-300 print:text-black">কাগজ গোডাউন</span>
              </div>
              <div>
                <div className="w-20 border-b border-slate-400 print:border-black mb-1" />
                <span className="font-semibold text-slate-700 dark:text-slate-300 print:text-black">মেশিন মাস্টার</span>
              </div>
              <div>
                <div className="w-20 border-b border-slate-400 print:border-black mb-1" />
                <span className="font-semibold text-slate-700 dark:text-slate-300 print:text-black">বাইন্ডিং ইনচার্জ</span>
              </div>
              <div>
                <div className="w-20 border-b border-slate-400 print:border-black mb-1" />
                <span className="font-semibold text-slate-700 dark:text-slate-300 print:text-black">কাস্টমার সই</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
