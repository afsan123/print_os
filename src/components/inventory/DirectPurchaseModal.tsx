'use client';

import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Building2,
  FileCheck,
  Printer,
  DollarSign,
  AlertCircle,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { PaperSupplier, PurchaseBill } from '@/types/inventory';

interface DirectPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobData: {
    jobTitle: string;
    client: string;
    category: string;
    paperType: string;
    gsm: number;
    fullSheetSize: string;
    reams: number;
    sheets: number;
    ratePerReam: number;
    jobId?: string;
  } | null;
  suppliers: PaperSupplier[];
  onCreateBill: (billData: Omit<PurchaseBill, 'id'>) => PurchaseBill;
  onSuccessToast?: (msg: string) => void;
}

export const DirectPurchaseModal: React.FC<DirectPurchaseModalProps> = ({
  isOpen,
  onClose,
  jobData,
  suppliers,
  onCreateBill,
  onSuccessToast,
}) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [ratePerReam, setRatePerReam] = useState(jobData?.ratePerReam || 3500);
  const [reams, setReams] = useState(jobData?.reams || 1.0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Credit (30 Days)' | 'bKash / Nagad' | 'Bank Cheque'>('Cash');
  const [paidAmount, setPaidAmount] = useState(ratePerReam * reams);
  const [notes, setNotes] = useState('Direct buy for immediate press run.');
  const [createdBill, setCreatedBill] = useState<PurchaseBill | null>(null);

  if (!isOpen || !jobData) return null;

  const totalAmount = Math.round(reams * ratePerReam);
  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const paymentStatus =
      paidAmount >= totalAmount ? 'paid' : paidAmount > 0 ? 'partial' : 'due';

    const bill = onCreateBill({
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      linkedJobId: jobData.jobId,
      linkedJobTitle: jobData.jobTitle,
      paperType: jobData.paperType,
      gsm: jobData.gsm,
      fullSheetSize: jobData.fullSheetSize,
      reams: reams,
      sheets: Math.round(reams * 500),
      ratePerReam: ratePerReam,
      totalAmount: totalAmount,
      paidAmount: paidAmount,
      paymentStatus: paymentStatus,
      paymentMethod: paymentMethod,
      procurementType: 'direct_job',
      purchaseDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      notes: notes,
    });

    setCreatedBill(bill);
    onSuccessToast?.(`Purchase Bill ${bill.id} created for ${jobData.jobTitle}!`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#0f172a] text-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-700 text-white">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Direct Paper Purchase Slip</h3>
              <p className="text-xs text-slate-400">
                JIT Procurement • Buy paper directly for Job Card
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setCreatedBill(null);
              onClose();
            }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {createdBill ? (
          /* Bill Created Success & Voucher View */
          <div className="p-6 space-y-5">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3 text-emerald-900">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-sm">Purchase Bill Created Successfully!</p>
                <p className="text-xs text-emerald-700 font-mono">Bill #{createdBill.id}</p>
              </div>
            </div>

            {/* Voucher Card */}
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Linked Job Card:</span>
                <span className="font-bold text-slate-900 font-mono">{createdBill.linkedJobId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Supplier / Mill Vendor:</span>
                <span className="font-bold text-slate-900">{createdBill.supplierName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Paper Specification:</span>
                <span className="font-semibold text-slate-900">
                  {createdBill.paperType} ({createdBill.gsm} GSM)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sheet Dimensions:</span>
                <span className="font-mono text-slate-800">{createdBill.fullSheetSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reams To Deliver:</span>
                <span className="font-mono font-bold text-rose-900">
                  {createdBill.reams} Reams ({createdBill.sheets} Sheets)
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm">
                <span>Total Amount:</span>
                <span className="font-mono text-slate-950">৳ {createdBill.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment Status:</span>
                <span className="uppercase font-bold text-emerald-700 font-mono">{createdBill.paymentStatus} ({createdBill.paymentMethod})</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>Print Paper Chalan</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreatedBill(null);
                  onClose();
                }}
                className="rounded-xl bg-[#881337] px-5 py-2 text-xs font-bold text-white hover:bg-[#700f2e] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Input Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Linked Job Box */}
            <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3.5 space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                  Target Production Order
                </span>
                <span className="font-mono font-bold text-rose-950">{jobData.jobId}</span>
              </div>
              <p className="font-bold text-slate-900 text-sm">{jobData.jobTitle}</p>
              <p className="text-slate-600">
                Client: <span className="font-semibold text-slate-800">{jobData.client}</span> • {jobData.category}
              </p>
            </div>

            {/* Select Supplier */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Select Paper Supplier / Vendor <span className="text-rose-600">*</span>
              </label>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full h-10.5 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
              >
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.address.split(',')[0]})
                  </option>
                ))}
              </select>
            </div>

            {/* Paper specs display */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 text-[10px]">Paper Type & GSM</span>
                <p className="font-bold text-slate-800">{jobData.paperType}</p>
                <p className="text-slate-500 text-[11px]">{jobData.gsm} GSM</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Full Sheet Size</span>
                <p className="font-bold text-slate-800">{jobData.fullSheetSize}</p>
                <p className="text-slate-500 text-[11px]">Exact Press Yield</p>
              </div>
            </div>

            {/* Reams & Rate Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Reams To Buy (রিম)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0.1"
                  value={reams}
                  onChange={(e) => setReams(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Rate Per Ream (৳)
                </label>
                <input
                  type="number"
                  step="50"
                  min="100"
                  value={ratePerReam}
                  onChange={(e) => setRatePerReam(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>
            </div>

            {/* Total Calculation Row */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white text-xs">
              <span className="font-semibold">Total Bill Amount:</span>
              <span className="font-mono text-base font-extrabold text-emerald-400">
                ৳ {totalAmount.toLocaleString()}
              </span>
            </div>

            {/* Payment Method & Paid Amount */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Payment Terms</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as 'Cash' | 'Credit (30 Days)' | 'bKash / Nagad' | 'Bank Cheque')}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                >
                  <option value="Cash">Cash on Delivery</option>
                  <option value="Credit (30 Days)">Vendor Credit (30 Days)</option>
                  <option value="bKash / Nagad">bKash / Nagad</option>
                  <option value="Bank Cheque">Bank Cheque</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Amount Paid (৳)</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#881337] hover:bg-[#700f2e] text-white px-5 py-2 text-xs font-bold transition-all shadow-xs"
              >
                Confirm Purchase Bill
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
