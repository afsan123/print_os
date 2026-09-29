'use client';

import React, { useState } from 'react';
import { X, Barcode, CheckCircle2, ArrowRight, UserCheck, Sparkles } from 'lucide-react';
import { ProductionJob } from '@/types/production';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: ProductionJob[];
  onAdvanceStage: (jobId: string, operatorStamp?: string) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  jobs,
  onAdvanceStage,
}) => {
  const [scannedCode, setScannedCode] = useState('');
  const [operator, setOperator] = useState('Master Rafiqul Islam (Offset Press Line 1)');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const operators = [
    'Master Rafiqul Islam (Offset Press Line 1)',
    'Master Shamsul Alam (Offset Press Line 2)',
    'Master Tarek Aziz (Pre-Press & CTP)',
    'Master Anwar Hossain (Finishing & Die Cut)',
    'QC In-Charge Kamal (Inspection & Packaging)',
  ];

  const handleScanOrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedCode.trim()) return;

    const trimmed = scannedCode.trim().toUpperCase();
    const matchedJob = jobs.find(
      (j) => j.id.toUpperCase() === trimmed || j.id.replace(/-/g, '').includes(trimmed.replace(/-/g, ''))
    );

    if (matchedJob) {
      const stamp = `${operator.split(' ')[1]} (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`;
      onAdvanceStage(matchedJob.id, stamp);
      setFeedback({
        success: true,
        message: `Successfully stamped & advanced "${matchedJob.jobTitle}" (${matchedJob.id})!`,
      });
      setScannedCode('');
      setTimeout(() => setFeedback(null), 3500);
    } else {
      setFeedback({
        success: false,
        message: `No active job found matching "${scannedCode}". Try "JC-2025-0842" or "JC-2025-0845".`,
      });
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const quickScanSample = (jobId: string) => {
    setScannedCode(jobId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#071A3D] text-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1D5DFF] text-white">
              <Barcode className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading">Machine Master Quick Barcode Scanner</h3>
              <p className="text-xs text-slate-400">Shop-floor stage completion scanner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleScanOrSubmit} className="p-6 space-y-4">
          {/* Visual Scanner Area */}
          <div className="rounded-xl border-2 border-dashed border-[#23A8FF]/40 bg-[#F5F7FA] p-5 text-center space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-[#1D5DFF]">
              <Barcode className="h-6 w-6" />
            </div>
            <p className="text-xs font-semibold text-slate-800">
              Ready for Optical Handheld Barcode Gun or Manual Entry
            </p>
            <p className="text-[11px] text-slate-500">
              Scan barcode on printed job card or type Job ID below
            </p>
          </div>

          {/* Feedback alert */}
          {feedback && (
            <div
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                feedback.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {feedback.success ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <X className="h-4 w-4 shrink-0 text-rose-600" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* Operator Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <UserCheck className="h-3.5 w-3.5 text-slate-500" />
              <span>Machine Master / Operator</span>
            </label>
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="w-full h-10.5 px-3 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF]"
            >
              {operators.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>

          {/* Barcode / Job ID Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Scanned Barcode / Job Card ID
            </label>
            <div className="flex gap-2">
              <input
                autoFocus
                type="text"
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                placeholder="e.g. JC-2025-0842"
                className="flex-1 h-11 px-3.5 rounded-xl border border-slate-300 bg-white text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1D5DFF]/20 focus:border-[#1D5DFF] shadow-2xs"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1D5DFF] hover:bg-[#154cdb] text-white px-5 text-xs font-bold transition-all shadow-xs"
              >
                <span>Stamp</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Click Sample Barcodes */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Quick Scan Test Samples:
            </span>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {jobs.slice(0, 4).map((j) => (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => quickScanSample(j.id)}
                  className="rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#1D5DFF] border border-slate-200 px-2.5 py-1 text-[11px] font-mono text-slate-700 transition-colors"
                >
                  {j.id} ({j.category})
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
