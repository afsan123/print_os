'use client';

import React from 'react';
import { X, FileSpreadsheet, Printer, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { SalesInvoice, ClientPaymentRecord } from '@/types/sales';

interface ClientStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string | null;
  invoices: SalesInvoice[];
  payments: ClientPaymentRecord[];
}

export const ClientStatementModal: React.FC<ClientStatementModalProps> = ({
  isOpen,
  onClose,
  clientName,
  invoices,
  payments,
}) => {
  if (!isOpen || !clientName) return null;

  const clientInvoices = invoices.filter((i) => i.clientName === clientName);
  const clientPayments = payments.filter((p) => p.clientName === clientName);

  const totalInvoiced = clientInvoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalPaid = clientPayments.reduce((acc, p) => acc + p.amount, 0);
  const balanceDue = totalInvoiced - totalPaid;

  const fmt = (v: number) => `৳ ${Math.round(v).toLocaleString('en-IN')}`;

  // Combine into chronological transactions
  type Transaction = {
    date: string;
    ref: string;
    description: string;
    debit: number; // Invoice
    credit: number; // Payment
  };

  const transactions: Transaction[] = [
    ...clientInvoices.map((inv) => ({
      date: inv.invoiceDate,
      ref: inv.id,
      description: `Invoice: ${inv.jobTitle}`,
      debit: inv.totalAmount,
      credit: 0,
    })),
    ...clientPayments.map((pay) => ({
      date: pay.paymentDate,
      ref: pay.id,
      description: `Payment Received (${pay.paymentMethod.toUpperCase()}${
        pay.referenceNumber ? ` - ${pay.referenceNumber}` : ''
      })`,
      debit: 0,
      credit: pay.amount,
    })),
  ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let runningBalance = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white">
              <FileSpreadsheet className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Client Account Statement & Ledger</h3>
              <p className="text-xs text-slate-500 font-medium">{clientName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
            >
              <Printer className="h-3.5 w-3.5 text-slate-400" />
              <span>Print Statement</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Statement Content */}
        <div className="p-8 space-y-6 text-xs text-slate-800 printable-voucher">
          {/* Press and Client Meta */}
          <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-black text-slate-900">PRINTOS PRESS & PACKAGING</h2>
              <p className="text-[11px] text-slate-500">Commercial Press Accounts Ledger</p>
              <p className="text-[11px] text-slate-500">Arambagh & Fakirapool, Dhaka</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Statement For</span>
              <p className="text-base font-black text-slate-900">{clientName}</p>
              <p className="text-[11px] text-slate-500 font-mono">Date: {new Date().toISOString().split('T')[0]}</p>
            </div>
          </div>

          {/* Balance Highlights */}
          <div className="grid grid-cols-3 gap-3 text-center font-mono">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-[10px] font-sans text-slate-500 uppercase font-semibold">Total Debited (Invoiced)</span>
              <p className="text-lg font-black text-slate-900 mt-1">{fmt(totalInvoiced)}</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
              <span className="text-[10px] font-sans text-emerald-700 uppercase font-semibold">Total Credited (Paid)</span>
              <p className="text-lg font-black text-emerald-700 mt-1">{fmt(totalPaid)}</p>
            </div>
            <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3">
              <span className="text-[10px] font-sans text-rose-700 uppercase font-semibold">Net Outstanding Due</span>
              <p className="text-lg font-black text-rose-700 mt-1">{fmt(balanceDue)}</p>
            </div>
          </div>

          {/* Chronological Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Reference #</th>
                  <th className="p-3">Particulars / Description</th>
                  <th className="p-3 text-right">Debit (৳)</th>
                  <th className="p-3 text-right">Credit (৳)</th>
                  <th className="p-3 text-right">Balance (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-slate-400 font-sans">
                      No billing or payment activity recorded for this client.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t, idx) => {
                    runningBalance += t.debit - t.credit;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-600 font-sans">{t.date}</td>
                        <td className="p-3 font-bold text-slate-800">{t.ref}</td>
                        <td className="p-3 font-sans text-slate-800 max-w-xs truncate">{t.description}</td>
                        <td className="p-3 text-right font-bold text-slate-900">
                          {t.debit > 0 ? fmt(t.debit) : '—'}
                        </td>
                        <td className="p-3 text-right font-bold text-emerald-600">
                          {t.credit > 0 ? fmt(t.credit) : '—'}
                        </td>
                        <td className="p-3 text-right font-black text-rose-700">
                          {fmt(runningBalance)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-8 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-mono">
            <span>Official Computer-Generated Accounts Ledger • PrintOS Press</span>
            <span>Accounts Manager Verification Signature</span>
          </div>
        </div>
      </div>
    </div>
  );
};
