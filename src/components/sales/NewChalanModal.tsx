'use client';

import React, { useState, useEffect } from 'react';
import { X, Truck, Package, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { TransportMode, DeliveryChalan } from '@/types/sales';

interface NewChalanModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialJobData?: {
    jobId: string;
    clientName: string;
    jobTitle: string;
    totalQuantity: number;
    deliveredQuantity: number;
  } | null;
  onCreateChalan: (data: {
    jobId: string;
    clientName: string;
    deliveryAddress: string;
    jobTitle: string;
    totalOrderQuantity: number;
    previouslyDelivered: number;
    deliveredQuantity: number;
    packageCount: number;
    packageDescription: string;
    transportMode: TransportMode;
    vehicleNumber?: string;
    driverName?: string;
    driverPhone?: string;
    deliveryDate?: string;
  }) => DeliveryChalan;
  onSuccessToast: (msg: string) => void;
}

export const NewChalanModal: React.FC<NewChalanModalProps> = ({
  isOpen,
  onClose,
  initialJobData,
  onCreateChalan,
  onSuccessToast,
}) => {
  const [jobId, setJobId] = useState('JC-2025-0842');
  const [clientName, setClientName] = useState('ABC Pharma Ltd.');
  const [jobTitle, setJobTitle] = useState('Company Promotional Leaflet (150 GSM Art Paper)');
  const [deliveryAddress, setDeliveryAddress] = useState('Tejgaon I/A, Central Warehouse, Dhaka');
  const [totalOrderQuantity, setTotalOrderQuantity] = useState(10000);
  const [previouslyDelivered, setPreviouslyDelivered] = useState(0);
  const [deliveredQuantity, setDeliveredQuantity] = useState(5000);
  const [packageCount, setPackageCount] = useState(10);
  const [packageDescription, setPackageDescription] = useState('10 Bundles × 500 Pcs with Kraft paper packing');
  const [transportMode, setTransportMode] = useState<TransportMode>('rickshaw_van');
  const [vehicleNumber, setVehicleNumber] = useState('Van #08 (Arambagh Fleet)');
  const [driverName, setDriverName] = useState('Mohammad Rafiq');
  const [driverPhone, setDriverPhone] = useState('+880 1822-445566');
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (initialJobData) {
      setJobId(initialJobData.jobId);
      setClientName(initialJobData.clientName);
      setJobTitle(initialJobData.jobTitle);
      setTotalOrderQuantity(initialJobData.totalQuantity);
      setPreviouslyDelivered(initialJobData.deliveredQuantity);
      const remaining = Math.max(0, initialJobData.totalQuantity - initialJobData.deliveredQuantity);
      setDeliveredQuantity(remaining);
      setPackageCount(Math.ceil(remaining / 500) || 1);
      setPackageDescription(`${Math.ceil(remaining / 500) || 1} Bundles wrapped in Kraft paper`);
    }
  }, [initialJobData]);

  if (!isOpen) return null;

  const remainingAfterThis = Math.max(0, totalOrderQuantity - (previouslyDelivered + deliveredQuantity));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (deliveredQuantity <= 0) {
      alert('Delivered quantity must be greater than zero.');
      return;
    }

    const created = onCreateChalan({
      jobId,
      clientName,
      deliveryAddress,
      jobTitle,
      totalOrderQuantity,
      previouslyDelivered,
      deliveredQuantity,
      packageCount,
      packageDescription,
      transportMode,
      vehicleNumber,
      driverName,
      driverPhone,
      deliveryDate,
    });

    onSuccessToast(`Chalan ${created.id} & Gate Pass ${created.gatePassNo} issued successfully!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-700 text-white">
              <Truck className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Issue Delivery Chalan & Gate Pass (চালান)</h3>
              <p className="text-xs text-slate-500">Record factory dispatch and package logistics</p>
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
          {/* Job & Client Meta */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Job Card Reference *</label>
              <input
                type="text"
                value={jobId}
                onChange={(e) => setJobId(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-mono font-bold text-slate-900 focus:border-indigo-600 focus:outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Client / Consignee *</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-900 focus:border-indigo-600 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Product / Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Delivery Destination Address *</label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800"
              required
            />
          </div>

          {/* Quantities & Partial Delivery Box */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-3">
            <div className="flex items-center justify-between text-indigo-950 font-bold">
              <span>Quantity Reconciliation</span>
              <span className="text-[11px] font-normal text-indigo-700">Supports Partial Deliveries</span>
            </div>

            <div className="grid grid-cols-3 gap-3 font-mono text-center">
              <div className="rounded-lg bg-white border border-slate-200 p-2">
                <span className="text-[10px] font-sans text-slate-500">Order Total</span>
                <p className="font-bold text-slate-900 mt-0.5">{totalOrderQuantity.toLocaleString()} pcs</p>
              </div>
              <div className="rounded-lg bg-white border border-slate-200 p-2">
                <span className="text-[10px] font-sans text-slate-500">Previously Sent</span>
                <p className="font-bold text-slate-700 mt-0.5">{previouslyDelivered.toLocaleString()} pcs</p>
              </div>
              <div className="rounded-lg bg-white border border-slate-200 p-2">
                <span className="text-[10px] font-sans text-indigo-700 font-semibold">Remaining Bal</span>
                <p className="font-bold text-indigo-700 mt-0.5">{remainingAfterThis.toLocaleString()} pcs</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="font-bold text-slate-900">Delivering Now (Pcs) *</label>
                <input
                  type="number"
                  min={1}
                  max={totalOrderQuantity - previouslyDelivered}
                  value={deliveredQuantity}
                  onChange={(e) => setDeliveredQuantity(Number(e.target.value))}
                  className="w-full rounded-xl border border-indigo-300 bg-white p-2.5 font-mono font-black text-indigo-950 text-sm focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-900">Package / Bundle Count *</label>
                <input
                  type="number"
                  min={1}
                  value={packageCount}
                  onChange={(e) => setPackageCount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-mono font-bold text-slate-900 text-sm focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Packaging Description</label>
              <input
                type="text"
                value={packageDescription}
                onChange={(e) => setPackageDescription(e.target.value)}
                placeholder="e.g. 10 Bundles × 500 pcs in Kraft paper with strapping"
                className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs"
              />
            </div>
          </div>

          {/* Transport & Carrier Details */}
          <div className="space-y-3 pt-1">
            <label className="font-bold text-slate-800">Transport & Gate Pass Details</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { key: 'rickshaw_van', label: 'Rickshaw Van' },
                { key: 'pickup_truck', label: 'Pickup Truck' },
                { key: 'delivery_boy', label: 'Press Courier' },
                { key: 'client_pickup', label: 'Client Pickup' },
              ].map((t) => (
                <button
                  type="button"
                  key={t.key}
                  onClick={() => setTransportMode(t.key as TransportMode)}
                  className={`rounded-xl border py-2 text-center font-bold text-[11px] transition-all ${
                    transportMode === t.key
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Vehicle No</label>
                <input
                  type="text"
                  placeholder="Dhaka Metro-Ta 11-4521"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Driver / Dispatcher</label>
                <input
                  type="text"
                  placeholder="Rafiq Miah"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Driver Phone</label>
                <input
                  type="text"
                  placeholder="+880 1822-..."
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
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
              className="rounded-xl bg-indigo-700 px-5 py-2.5 font-bold text-white hover:bg-indigo-800 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Issue Chalan & Gate Pass</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
