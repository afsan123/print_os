'use client';

import React from 'react';
import { X, Printer, Truck, CheckCircle2, ShieldCheck } from 'lucide-react';
import { DeliveryChalan } from '@/types/sales';

interface ChalanPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  chalan: DeliveryChalan | null;
}

export const ChalanPrintModal: React.FC<ChalanPrintModalProps> = ({
  isOpen,
  onClose,
  chalan,
}) => {
  if (!isOpen || !chalan) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Top Header Controls (Hidden on Print) */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700 text-white">
              <Truck className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Delivery Chalan & Factory Gate Pass</h3>
              <p className="text-xs text-slate-500 font-mono">Chalan: {chalan.id} • Gate Pass: {chalan.gatePassNo}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-700 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-800 transition-colors shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print 3-Part Chalan</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Chalan Body */}
        <div className="p-8 space-y-6 text-slate-800 printable-voucher">
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 text-center relative">
            <div className="absolute right-0 top-0 border-2 border-slate-800 px-2.5 py-1 text-center font-mono">
              <p className="text-[10px] uppercase font-bold text-slate-500">Official Copy</p>
              <p className="text-xs font-black text-slate-900">FACTORY & GATE PASS</p>
            </div>

            <h1 className="text-2xl font-black tracking-wider text-slate-900">PRINTOS PRESS & PACKAGING</h1>
            <p className="text-xs text-slate-600 mt-0.5">
              142/A Arambagh, Inner Circular Road, Fakirapool, Motijheel, Dhaka-1000
            </p>
            <p className="text-xs text-slate-500 font-mono">
              Tel: +880 2 9345678 • Cell: +880 1711-009988 • BIN: 001928374-0102
            </p>

            <div className="mt-3 inline-block rounded-md bg-slate-900 text-white px-4 py-1 text-xs font-bold tracking-widest uppercase">
              DELIVERY CHALAN & FACTORY GATE PASS (চালান ও গেট পাস)
            </div>
          </div>

          {/* Meta Information Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5 rounded-lg border border-slate-200 p-3 bg-slate-50/50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consignee / Client</p>
              <p className="font-bold text-slate-900 text-sm">{chalan.clientName}</p>
              <p className="text-slate-600 leading-relaxed">{chalan.deliveryAddress}</p>
            </div>

            <div className="space-y-1 rounded-lg border border-slate-200 p-3 bg-slate-50/50 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans text-[11px]">Chalan No:</span>
                <span className="font-bold text-indigo-950">{chalan.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans text-[11px]">Gate Pass No:</span>
                <span className="font-bold text-indigo-700">{chalan.gatePassNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans text-[11px]">Job Card ID:</span>
                <span className="font-bold text-slate-800">{chalan.jobId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans text-[11px]">Delivery Date:</span>
                <span className="text-slate-800">{chalan.deliveryDate}</span>
              </div>
            </div>
          </div>

          {/* Itemized Delivery Table */}
          <div className="border border-slate-300 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Item Description</th>
                  <th className="p-3 text-right">Order Qty</th>
                  <th className="p-3 text-right">Delivered Now</th>
                  <th className="p-3 text-right">Remaining Balance</th>
                  <th className="p-3">Packaging Particulars</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3">
                    <p className="font-bold text-slate-900">{chalan.jobTitle}</p>
                    <p className="text-[11px] text-slate-500">Commercial Press Finished Print</p>
                  </td>
                  <td className="p-3 text-right font-mono font-bold">
                    {chalan.totalOrderQuantity.toLocaleString('en-IN')} pcs
                  </td>
                  <td className="p-3 text-right font-mono font-black text-indigo-900 text-sm">
                    {chalan.deliveredQuantity.toLocaleString('en-IN')} pcs
                  </td>
                  <td className="p-3 text-right font-mono text-slate-600 font-semibold">
                    {chalan.remainingBalance.toLocaleString('en-IN')} pcs
                  </td>
                  <td className="p-3">
                    <span className="font-bold text-slate-800">{chalan.packageCount} Packages</span>
                    <p className="text-[10px] text-slate-500">{chalan.packageDescription}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Logistics & Vehicle Detail */}
          <div className="rounded-lg border border-slate-200 p-3.5 bg-slate-50 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Transport & Carrier</span>
              <p className="font-bold text-slate-900 capitalize mt-0.5">
                {chalan.transportMode.replace('_', ' ')} • {chalan.vehicleNumber || 'Press Courier'}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Driver / Dispatcher</span>
              <p className="font-bold text-slate-900 mt-0.5">
                {chalan.driverName || 'Authorized Staff'} ({chalan.driverPhone || 'N/A'})
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Security Clearance</span>
              <p className="font-bold text-emerald-700 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="h-3.5 w-3.5" /> Checked & Cleared
              </p>
            </div>
          </div>

          {/* 4-Signature Verification Block */}
          <div className="pt-10 grid grid-cols-4 gap-4 text-center text-xs">
            <div className="border-t border-slate-400 pt-2">
              <p className="font-semibold text-slate-800">Prepared By</p>
              <p className="text-[10px] text-slate-500">Store / Dispatcher</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="font-semibold text-slate-800">Security Officer</p>
              <p className="text-[10px] text-slate-500">Gate Pass Checked</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="font-semibold text-slate-800">Driver / Carrier</p>
              <p className="text-[10px] text-slate-500">Goods in Charge</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="font-semibold text-slate-800">Received By & Seal</p>
              <p className="text-[10px] text-slate-500">Consignee Customer</p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-2 font-mono">
            Generated via PrintOS ERP • Printing Press Management System • Dhaka, Bangladesh
          </div>
        </div>
      </div>
    </div>
  );
};
