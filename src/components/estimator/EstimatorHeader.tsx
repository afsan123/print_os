'use client';

import React from 'react';
import {
  Calculator,
  Bookmark,
  RotateCcw,
  FileText,
  Sparkles,
} from 'lucide-react';

interface EstimatorHeaderProps {
  onSaveTemplate: () => void;
  onReset: () => void;
  onCreateInvoiceAndJobCard: () => void;
  onOpenTemplatesModal: () => void;
}

export const EstimatorHeader: React.FC<EstimatorHeaderProps> = ({
  onSaveTemplate,
  onReset,
  onCreateInvoiceAndJobCard,
  onOpenTemplatesModal,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] p-5 sm:p-6 lg:px-7 shadow-2xs">
      {/* Title & Badge */}
      <div className="flex items-center gap-4 sm:gap-5">
        <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#23A8FF] to-[#1D5DFF] text-white shadow-md shadow-[#1D5DFF]/25 ring-1 ring-white/20">
          <Calculator className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Smart Print Cost Estimator
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-[#D8E3FF]/70 font-normal">
            Get accurate cost estimates, set your profit margin and create invoice instantly.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onOpenTemplatesModal}
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#071A3D] px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-[#D8E3FF] hover:bg-[#F5F7FA] dark:hover:bg-[#122A59] hover:border-[#1D5DFF]/30 transition-colors shadow-2xs"
          title="Load pre-built printing job presets"
        >
          <Sparkles className="h-4 w-4 text-[#23A8FF]" />
          <span>Presets</span>
        </button>

        <button
          onClick={onSaveTemplate}
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#071A3D] px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-[#D8E3FF] hover:bg-[#F5F7FA] dark:hover:bg-[#122A59] hover:border-[#1D5DFF]/30 transition-colors shadow-2xs"
        >
          <Bookmark className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <span>Save as Template</span>
        </button>

        <button
          onClick={onReset}
          type="button"
          className="inline-flex items-center gap-2 rounded-xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#071A3D] px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-[#D8E3FF] hover:bg-[#F5F7FA] dark:hover:bg-[#122A59] hover:border-[#1D5DFF]/30 transition-colors shadow-2xs"
        >
          <RotateCcw className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          <span>Reset</span>
        </button>

        <button
          onClick={onCreateInvoiceAndJobCard}
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-[#1D5DFF] hover:bg-[#154cdb] text-white px-5 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-md hover:shadow-[#1D5DFF]/25 active:scale-[0.98]"
        >
          <FileText className="h-4 w-4" />
          <span>Create Invoice & Job Card</span>
        </button>
      </div>
    </div>
  );
};
