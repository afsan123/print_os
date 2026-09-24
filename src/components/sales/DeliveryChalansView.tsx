'use client';

import React, { useState } from 'react';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  Plus,
  ArrowRight,
  Package,
  FileCheck2,
  Calendar,
  AlertCircle,
  Car,
} from 'lucide-react';
import { DeliveryChalan, ChalanStatus } from '@/types/sales';

interface DeliveryChalansViewProps {
  chalans: DeliveryChalan[];
  onOpenNewChalanModal: () => void;
  onOpenPrintModal: (chalan: DeliveryChalan) => void;
  onUpdateStatus: (chalanId: string, status: ChalanStatus, receivedBy?: string) => void;
  onGoToEstimator: () => void;
}

export const DeliveryChalansView: React.FC<DeliveryChalansViewProps> = ({
  chalans,
  onOpenNewChalanModal,
  onOpenPrintModal,
  onUpdateStatus,
  onGoToEstimator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'dispatched' | 'delivered'>('all');

  // Metrics
  const totalChalans = chalans.length;
  const dispatchedCount = chalans.filter((c) => c.status === 'dispatched').length;
  const deliveredCount = chalans.filter((c) => c.status === 'delivered').length;
  const totalPcsDelivered = chalans.reduce((acc, c) => acc + c.deliveredQuantity, 0);

  // Filtered
  const filteredChalans = chalans.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.gatePassNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.jobId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTransportLabel = (mode: DeliveryChalan['transportMode']) => {
    switch (mode) {
      case 'rickshaw_van':
        return 'Rickshaw Van';
      case 'pickup_truck':
        return 'Pickup Truck';
      case 'delivery_boy':
        return 'Delivery Boy';
      case 'client_pickup':
        return 'Client Pickup';
      default:
        return mode;
    }
  };

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-sm">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Delivery Chalans & Gate Passes (চালান)
              </h1>
              <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                {chalans.length} Dispatches
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Goods delivery notes, factory security gate passes, bundle packaging counts, and customer receiving acknowledgments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={onOpenNewChalanModal}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-800 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Issue New Delivery Chalan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Chalans Issued
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileCheck2 className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">{totalChalans}</p>
          <p className="text-xs text-slate-500 mt-1">Official press dispatch vouchers</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Dispatched / In-Transit
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Truck className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-amber-600 font-mono mt-2">{dispatchedCount}</p>
          <p className="text-xs text-amber-600 mt-1 font-medium">Currently out for delivery</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Successfully Delivered
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-600 font-mono mt-2">{deliveredCount}</p>
          <p className="text-xs text-emerald-600 mt-1 font-medium">Signed & received by client</p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Quantity Delivered
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Package className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">
            {totalPcsDelivered.toLocaleString('en-IN')} pcs
          </p>
          <p className="text-xs text-slate-500 mt-1">Dispatched across all jobs</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chalan #, gate pass, client..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-600 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['all', 'dispatched', 'delivered'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {st === 'all' ? 'All Chalans' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Chalans Table */}
      <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="p-4">Chalan & Gate Pass #</th>
                <th className="p-4">Client & Destination</th>
                <th className="p-4">Job Reference</th>
                <th className="p-4">Delivered Qty / Order</th>
                <th className="p-4">Packaging Info</th>
                <th className="p-4">Transport & Driver</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredChalans.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No delivery chalans match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredChalans.map((ch) => (
                  <tr key={ch.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4">
                      <p className="font-mono font-bold text-indigo-950 text-sm">{ch.id}</p>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                        <span className="rounded bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 text-[10px] font-mono text-indigo-700 font-semibold">
                          {ch.gatePassNo}
                        </span>
                        <span>• {ch.deliveryDate}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-900 text-xs">{ch.clientName}</p>
                      <p className="text-[11px] text-slate-500 truncate max-w-xs">{ch.deliveryAddress}</p>
                    </td>

                    <td className="p-4">
                      <span className="inline-block font-mono font-bold text-rose-900 text-[11px]">
                        {ch.jobId}
                      </span>
                      <p className="text-[11px] text-slate-600 truncate max-w-xs">{ch.jobTitle}</p>
                    </td>

                    <td className="p-4">
                      <div className="font-mono font-bold text-slate-900 text-sm">
                        {ch.deliveredQuantity.toLocaleString('en-IN')} pcs
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1 font-mono">
                        <span>Total: {ch.totalOrderQuantity.toLocaleString('en-IN')}</span>
                        {ch.remainingBalance > 0 ? (
                          <span className="text-amber-600 font-semibold">
                            (Bal: {ch.remainingBalance.toLocaleString('en-IN')})
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-semibold">(Complete)</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-slate-800 font-mono text-xs">
                        {ch.packageCount} Packages
                      </p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[180px]">
                        {ch.packageDescription}
                      </p>
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-slate-800 text-xs">
                        {getTransportLabel(ch.transportMode)}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[160px]">
                        {ch.vehicleNumber || 'Standard'} {ch.driverName ? `• ${ch.driverName}` : ''}
                      </p>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                          ch.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {ch.status === 'delivered' ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Delivered</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3" />
                            <span>In-Transit</span>
                          </>
                        )}
                      </span>
                      {ch.receivedBy && (
                        <p className="text-[9px] text-emerald-700 mt-0.5 truncate max-w-[120px]">
                          Recv: {ch.receivedBy}
                        </p>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      {ch.status === 'dispatched' && (
                        <button
                          onClick={() => {
                            const receiver = prompt('Enter receiver name & designation:', 'Store Receiving Incharge');
                            if (receiver) {
                              onUpdateStatus(ch.id, 'delivered', receiver);
                            }
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Mark Delivered</span>
                        </button>
                      )}
                      <button
                        onClick={() => onOpenPrintModal(ch)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                      >
                        <Printer className="h-3 w-3 text-slate-400" />
                        <span>Print Chalan</span>
                      </button>
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
