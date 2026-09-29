'use client';

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Printer,
  Scissors,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Sparkles,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { ProductionJob, ProductionStage } from '@/types/production';

interface JobCardsViewProps {
  jobs: ProductionJob[];
  onOpenJobDocket: (job: ProductionJob) => void;
  onAdvanceStage: (jobId: string) => void;
  onGoToEstimator: () => void;
}

export const JobCardsView: React.FC<JobCardsViewProps> = ({
  jobs,
  onOpenJobDocket,
  onAdvanceStage,
  onGoToEstimator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');

  // KPIs
  const totalActive = jobs.length;
  const inPress = jobs.filter((j) => j.currentStage === 'press').length;
  const inFinishing = jobs.filter(
    (j) => j.currentStage === 'coating' || j.currentStage === 'finishing' || j.currentStage === 'bindery'
  ).length;
  const readyCount = jobs.filter((j) => j.currentStage === 'ready' || j.currentStage === 'qc').length;

  // Filtered list
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch =
        job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStage =
        selectedStage === 'all'
          ? true
          : selectedStage === 'finishing_all'
          ? ['coating', 'finishing', 'bindery'].includes(job.currentStage)
          : job.currentStage === selectedStage;

      return matchSearch && matchStage;
    });
  }, [jobs, searchQuery, selectedStage]);

  const getStageBadge = (stage: ProductionStage) => {
    switch (stage) {
      case 'prepress':
        return { label: 'Pre-Press (CTP প্লেট)', bg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900/60' };
      case 'press':
        return { label: 'In Press (মেশিনে ছাপা)', bg: 'bg-blue-50 dark:bg-blue-950/60 text-[#1D5DFF] dark:text-[#23A8FF] border-blue-200 dark:border-blue-900/60' };
      case 'coating':
        return { label: 'Lamination (লেমিনেশন)', bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/60' };
      case 'finishing':
        return { label: 'Die Cut (ডাই কাটিং)', bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/60' };
      case 'bindery':
        return { label: 'Bindery (বাঁধাই)', bg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-900/60' };
      case 'qc':
        return { label: 'QC & Packing (প্যাকিং)', bg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900/60' };
      case 'ready':
        return { label: 'Ready (ডেলিভারি রেডি)', bg: 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-900/60' };
      default:
        return { label: stage, bg: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] p-5 sm:p-6 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#23A8FF] to-[#1D5DFF] text-white shadow-md shadow-[#1D5DFF]/25 ring-1 ring-white/20">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Commercial Press Job Cards (জব কার্ড ও প্রেস স্লিপ)
              </h1>
              <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 px-2.5 py-0.5 text-xs font-bold text-[#1D5DFF] dark:text-[#23A8FF]">
                {jobs.length} Active Dockets
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-[#D8E3FF]/70 font-normal">
              Floor dockets with paper cutting formulas, plate counts, and bindery checklist for small printing presses
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onGoToEstimator}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1D5DFF] hover:bg-[#154cdb] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm hover:shadow-md hover:shadow-[#1D5DFF]/25 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>New Job Card (নূতন জব)</span>
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Active Dockets (মোট কাজ)
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Layers className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-2">{totalActive}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Orders in production line</p>
        </div>

        <div className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#D8E3FF]/70 uppercase tracking-wider">
              Offset Machine Press (ছাপা চলছে)
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#23A8FF]/10 text-[#23A8FF]">
              <Printer className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-[#23A8FF] font-mono mt-2">{inPress}</p>
          <p className="text-xs text-[#23A8FF] mt-1 font-medium">Under active cylinder impression</p>
        </div>

        <div className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#D8E3FF]/70 uppercase tracking-wider">
              Finishing & Binding (ফিনিশিং/বাঁধাই)
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
              <Scissors className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-purple-800 dark:text-purple-300 font-mono mt-2">{inFinishing}</p>
          <p className="text-xs text-purple-700 dark:text-purple-300 mt-1 font-medium">Lamination, Die & Stitching</p>
        </div>

        <div className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#D8E3FF]/70 uppercase tracking-wider">
              Ready for Delivery (ডেলিভারি রেডি)
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300">
              <CheckCircle2 className="h-4 w-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-teal-700 dark:text-teal-300 font-mono mt-2">{readyCount}</p>
          <p className="text-xs text-teal-700 dark:text-teal-300 mt-1 font-medium">Packed & verified by QC</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="rounded-2xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Job No, client, or job title..."
            className="w-full rounded-xl border border-slate-200 dark:border-[#162E63] bg-slate-50/50 dark:bg-[#071A3D] py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1D5DFF] transition-colors"
          />
        </div>

        {/* Stage Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { key: 'all', label: 'All (সব)' },
            { key: 'prepress', label: 'CTP প্লেট' },
            { key: 'press', label: 'মেশিনে ছাপা' },
            { key: 'finishing_all', label: 'ফিনিশিং ও বাঁধাই' },
            { key: 'ready', label: 'রেডি' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedStage(tab.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                selectedStage === tab.key
                  ? 'bg-[#1D5DFF] text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-[#071A3D] text-slate-600 dark:text-[#D8E3FF] hover:bg-slate-200 dark:hover:bg-[#122A59]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards Table */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Job No & Date</th>
                <th className="py-3.5 px-4">Customer & Work</th>
                <th className="py-3.5 px-4 text-right">Quantity</th>
                <th className="py-3.5 px-4">Paper & Cutting Spec</th>
                <th className="py-3.5 px-4">Press / Colors</th>
                <th className="py-3.5 px-4">Current Stage</th>
                <th className="py-3.5 px-4 text-right">Floor Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No job cards found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  const stageBadge = getStageBadge(job.currentStage);
                  const isUrgent = job.priority === 'urgent' || job.priority === 'express';

                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Job No */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {job.id}
                          {isUrgent && (
                            <span className="rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 text-[9px] font-bold px-1 py-0.2 border border-rose-300 dark:border-rose-900">
                              URGENT
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" /> Due: {job.dueDate}
                        </div>
                      </td>

                      {/* Customer & Work */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <div className="font-bold text-slate-900 dark:text-white truncate">
                          {job.jobTitle}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {job.client}
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="font-black text-sm text-[#1D5DFF] dark:text-[#23A8FF]">
                          {job.quantity.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 block">Pcs</span>
                      </td>

                      {/* Paper & Cutting */}
                      <td className="py-3.5 px-4 max-w-[200px]">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {job.paperSpec}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Scissors className="h-3 w-3 inline text-slate-400" />
                          {job.hasDieCutting ? 'Die Block Cut' : 'Standard Square Cut'}
                        </div>
                        {job.customFinishingSummary && (
                          <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold truncate max-w-[190px]" title={job.customFinishingSummary}>
                            ✨ {job.customFinishingSummary}
                          </div>
                        )}
                      </td>

                      {/* Press / Colors */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">
                          {job.colors}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400">
                          {job.platesCount} CTP Plates
                        </div>
                      </td>

                      {/* Current Stage */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${stageBadge.bg}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {stageBadge.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenJobDocket(job)}
                            type="button"
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-[#162E63] bg-slate-50 dark:bg-[#071A3D] hover:bg-white dark:hover:bg-[#122A59] text-slate-800 dark:text-[#D8E3FF] px-2.5 py-1.5 text-xs font-semibold transition-colors shadow-2xs"
                            title="Open / Print Small Press Floor Slip"
                          >
                            <Printer className="h-3.5 w-3.5" />
                            <span>Slip (স্লিপ)</span>
                          </button>

                          {job.currentStage !== 'ready' && (
                            <button
                              onClick={() => onAdvanceStage(job.id)}
                              type="button"
                              className="inline-flex items-center gap-1 rounded-lg bg-[#1D5DFF] hover:bg-[#154cdb] text-white px-2.5 py-1.5 text-xs font-bold transition-all shadow-2xs"
                              title="Advance to Next Stage"
                            >
                              <span>Next</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
