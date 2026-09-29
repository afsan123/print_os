'use client';

import React, { useState } from 'react';
import { FileText, Plus, Tag, X } from 'lucide-react';
import { JobSpecs, ClientRecord } from '@/types/estimator';
import { useCustomSpecs } from '@/hooks/useCustomSpecs';

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
  const { categories, addCategory } = useCustomSpecs();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState('');

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryInput.trim()) return;
    const added = addCategory(newCategoryInput);
    if (added) {
      onUpdate({ category: added });
    }
    setNewCategoryInput('');
    setIsAddingCategory(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs transition-all hover:border-slate-300">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1D5DFF] text-xs font-bold text-white shadow-2xs">
            1
          </span>
          <FileText className="h-4 w-4 text-slate-500" />
          <h2 className="text-base font-bold text-slate-900 font-heading">Job Information</h2>
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
            Job Title <span className="text-[#FF008C]">*</span>
          </label>
          <input
            type="text"
            value={specs.jobTitle}
            onChange={(e) => onUpdate({ jobTitle: e.target.value })}
            placeholder="e.g. Company Leaflet"
            className="w-full h-10.5 px-3.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all shadow-2xs font-body"
          />
        </div>

        {/* Client Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">
              Client <span className="text-[#FF008C]">*</span>
            </label>
            <button
              type="button"
              onClick={onOpenNewClientModal}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D5DFF] hover:text-[#154cdb] hover:underline"
            >
              <Plus className="h-3 w-3" />
              <span>New Client</span>
            </button>
          </div>
          <select
            value={specs.client}
            onChange={(e) => onUpdate({ client: e.target.value })}
            className="w-full h-10.5 px-3.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all shadow-2xs cursor-pointer truncate"
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
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700">Category</label>
            <button
              type="button"
              onClick={() => setIsAddingCategory(true)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1D5DFF] hover:text-[#154cdb] hover:underline"
            >
              <Plus className="h-3 w-3" />
              <span>New Category</span>
            </button>
          </div>
          <select
            value={specs.category}
            onChange={(e) => {
              if (e.target.value === '__add_new_category__') {
                setIsAddingCategory(true);
              } else {
                onUpdate({ category: e.target.value });
              }
            }}
            className="w-full h-10.5 px-3.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all shadow-2xs cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="__add_new_category__" className="font-bold text-[#1D5DFF]">
              + Add New Category...
            </option>
          </select>
        </div>

        {/* Target Quantity */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">
            Target Quantity (Pcs) <span className="text-[#FF008C]">*</span>
          </label>
          <input
            type="number"
            min={1}
            step={100}
            value={specs.targetQuantity || ''}
            onChange={(e) => onUpdate({ targetQuantity: Math.max(0, parseInt(e.target.value) || 0) })}
            placeholder="10,000"
            className="w-full h-10.5 px-3.5 rounded-xl border border-slate-300 bg-white text-sm font-medium font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* Add New Category Modal */}
      {isAddingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#1D5DFF]">
                  <Tag className="h-4 w-4" />
                </span>
                <h3 className="font-bold text-sm text-slate-900 font-heading">Add New Category</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddingCategory(false);
                  setNewCategoryInput('');
                }}
                className="text-slate-400 hover:text-slate-600 rounded p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Name (ক্যাটাগরির নাম)
                </label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Sticker & Label, Shopping Bag, Sweet Box"
                  value={newCategoryInput}
                  onChange={(e) => setNewCategoryInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingCategory(false);
                    setNewCategoryInput('');
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCategoryInput.trim()}
                  className="px-4 py-2 rounded-xl bg-[#1D5DFF] text-xs font-bold text-white hover:bg-[#154cdb] transition-colors disabled:opacity-50 shadow-xs"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
