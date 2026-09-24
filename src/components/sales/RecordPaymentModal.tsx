'use client';

import React, { useState, useEffect } from 'react';
import { X, CreditCard, DollarSign, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { SalesInvoice, ClientPaymentMethod } from '@/types/sales';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: SalesInvoice | null;
  onRecordPayment: (
    invoiceId: string,
    amount: number,
    paymentMethod: ClientPaymentMethod,
    referenceNumber?: string,
    bankName?: string,
    chequeDate?: string,
    notes?: string
  ) => void;
  onSuccessToast: (msg: string) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onRecordPayment,
  onSuccessToast,
}) => {
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<ClientPaymentMethod>('cash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [chequeDate, setChequeDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (invoice) {
      setAmount(invoice.dueAmount);
      setReferenceNumber('');
      setBankName('');
      setChequeDate('');
      setNotes('');
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    onRecordPayment(
      invoice.id,
      amount,
      method,
      referenceNumber || undefined,
      bankName || undefined,
      chequeDate || undefined,
      notes || undefined
    );

    onSuccessToast(
      `Payment of ৳ ${amount.toLocaleString('en-IN')} recorded for Invoice ${invoice.id}`
    );
    onClose();
  };

  const fmt = (v: number) => `৳ ${Math.round(v).toLocaleString('en-IN')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <CreditCard className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Record Client Payment</h3>
              <p className="text-xs text-slate-500 font-mono">Invoice: {invoice.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Invoice Summary Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Client / Account:</span>
              <span className="font-bold text-slate-900 text-sm">{invoice.clientName}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Job Title:</span>
              <span className="truncate max-w-[240px] font-medium">{invoice.jobTitle}</span>
            </div>
            <div className="border-t border-slate-200 pt-2 grid grid-cols-3 gap-2 font-mono text-center">
              <div>
                <p className="text-[10px] text-slate-500 font-sans">Total Bill</p>
                <p className="font-bold text-slate-900">{fmt(invoice.totalAmount)}</p>
              </div>
              <div>
                <p className="text-[10px] text-emerald-600 font-sans">Already Paid</p>
                <p className="font-bold text-emerald-600">{fmt(invoice.advancePaid)}</p>
              </div>
              <div>
                <p className="text-[10px] text-rose-700 font-sans">Current Due</p>
                <p className="font-bold text-rose-700">{fmt(invoice.dueAmount)}</p>
              </div>
            </div>
          </div>

          {/* Amount to Pay */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-bold text-slate-700">Payment Amount (৳) *</label>
              <button
                type="button"
                onClick={() => setAmount(invoice.dueAmount)}
                className="text-[11px] font-bold text-emerald-700 hover:underline"
              >
                Pay Full Due ({fmt(invoice.dueAmount)})
              </button>
            </div>
            <input
              type="number"
              min={1}
              max={invoice.dueAmount * 2}
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-base font-bold font-mono text-slate-900 focus:border-emerald-600 focus:outline-none"
              required
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Payment Method</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { key: 'cash', label: 'Cash' },
                { key: 'cheque', label: 'Cheque' },
                { key: 'bank_transfer', label: 'Bank (BEFTN)' },
                { key: 'bkash', label: 'bKash / MFS' },
              ].map((m) => (
                <button
                  type="button"
                  key={m.key}
                  onClick={() => setMethod(m.key as ClientPaymentMethod)}
                  className={`rounded-xl border py-2 text-center font-bold transition-all ${
                    method === m.key
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conditional Cheque / Reference fields */}
          {method === 'cheque' && (
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Cheque No</label>
                <input
                  type="text"
                  placeholder="e.g. CHQ-92841"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Bank Name</label>
                <input
                  type="text"
                  placeholder="e.g. City Bank Ltd."
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                />
              </div>
            </div>
          )}

          {(method === 'bkash' || method === 'bank_transfer') && (
            <div className="space-y-1">
              <label className="font-semibold text-slate-600">Transaction Reference / TrxID</label>
              <input
                type="text"
                placeholder="e.g. 9X281Z491"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-mono"
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-600">Payment Notes (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Cleared at showroom desk"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2.5 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-5 py-2.5 font-bold text-white hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Confirm & Record ৳ {amount.toLocaleString('en-IN')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
