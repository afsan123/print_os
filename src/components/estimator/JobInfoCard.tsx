'use client';

import React from 'react';
import { FileText, Plus, UserPlus } from 'lucide-react';
import { JobSpecs, ClientRecord } from '@/types/estimator';
import { JOB_CATEGORIES } from '@/lib/constants';

interface JobInfoCardProps {
  specs: JobSpecs;
  clients: ClientRecord[];
  onUpdate: (patch: Partial<JobSpecs>) => void;
  onOpenNewClientModal: () => void;
}

export const JobInfoCard: React.FC<JobInfoCardProps> = ({
  specs,
  clients,
  onUpdate,
  onOpenNewClientModal,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs transition-all hover:border-slate-300">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {/* Circular Badge 1 (Crimson) */}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#881337] text-xs font-bold text-white shadow-2xs">
            1
          </span>
          <FileText className="h-4 w-4 text-slate-500" />
          <h2 className="text-base font-bold text-slate-900">Job Information</h2>
        </div>
        <span className="text-xs text-slate-400 hidden sm:inline">
          Tell us about this print job
        </span>
      </div>

      {/* Form Fields Grid */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Job Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Job Title <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            value={specs.jobTitle}
            onChange={(e) => onUpdate({ jobTitle: e.target.value })}
            placeholder="e.g. Company Leaflet"
            className="w-full h-10.5 px-3.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all shadow-2xs"
          />
        </div>

        {/* Client Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">
              Client <span className="text-rose-600">*</span>
            </label>
            <button
              type="button"
              onClick={onOpenNewClientModal}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:text-rose-900 hover:underline"
            >
              <Plus className="h-3 w-3" />
              <span>New Client</span>
            </button>
          </div>
          <select
            value={specs.client}
            onChange={(e) => onUpdate({ client: e.target.value })}
            className="w-full h-10.5 px-3.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all shadow-2xs cursor-pointer truncate"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Category</label>
          <select
            value={specs.category}
            onChange={(e) => onUpdate({ category: e.target.value })}
            className="w-full h-10.5 px-3.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all shadow-2xs cursor-pointer"
          >
            {JOB_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Target Quantity */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Target Quantity (Pcs) <span className="text-rose-600">*</span>
          </label>
          <input
            type="number"
            min={1}
            step={100}
            value={specs.targetQuantity || ''}
            onChange={(e) => onUpdate({ targetQuantity: Math.max(0, parseInt(e.target.value) || 0) })}
            placeholder="10,000"
            className="w-full h-10.5 px-3.5 rounded-xl border border-slate-300 bg-white text-sm font-medium font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all shadow-2xs"
          />
        </div>
      </div>
    </div>
  );
};
