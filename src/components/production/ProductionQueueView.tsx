'use client';

import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  ArrowRight,
  ArrowLeft,
  Barcode,
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Printer,
  ChevronRight,
  Sparkles,
  Flame,
  Plus,
} from 'lucide-react';
import {
  ProductionJob,
  PressMachine,
  ProductionStage,
  JobPriority,
} from '@/types/production';
import { PRODUCTION_STAGES } from '@/hooks/useProductionQueue';
import { MachineStatusWidget } from './MachineStatusWidget';
import { BarcodeScannerModal } from './BarcodeScannerModal';

interface ProductionQueueViewProps {
  jobs: ProductionJob[];
  filteredJobs: ProductionJob[];
  machines: PressMachine[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterMachine: string;
  onFilterMachineChange: (mId: string) => void;
  filterPriority: string;
  onFilterPriorityChange: (p: string) => void;
  showLiveTelemetry: boolean;
  onToggleTelemetry: () => void;
  isBarcodeScannerOpen: boolean;
  onOpenBarcodeScanner: () => void;
  onCloseBarcodeScanner: () => void;
  onAdvanceStage: (jobId: string, operatorStamp?: string) => void;
  onRollbackStage: (jobId: string) => void;
  onMoveJobToStage: (jobId: string, stage: ProductionStage) => void;
  onGoToEstimator: () => void;
}

export const ProductionQueueView: React.FC<ProductionQueueViewProps> = ({
  jobs,
  filteredJobs,
  machines,
  searchQuery,
  onSearchChange,
  filterMachine,
  onFilterMachineChange,
  filterPriority,
  onFilterPriorityChange,
  showLiveTelemetry,
  onToggleTelemetry,
  isBarcodeScannerOpen,
  onOpenBarcodeScanner,
  onCloseBarcodeScanner,
  onAdvanceStage,
  onRollbackStage,
  onMoveJobToStage,
  onGoToEstimator,
}) => {
  const [draggedJobId, setDraggedJobId] = useState<string | null>(null);
  const [showMachineWidget, setShowMachineWidget] = useState(true);

  // Group filtered jobs by stage
  const jobsByStage: Record<ProductionStage, ProductionJob[]> = {
    prepress: [],
    press: [],
    coating: [],
    finishing: [],
    bindery: [],
    qc: [],
    ready: [],
  };

  filteredJobs.forEach((job) => {
    if (jobsByStage[job.currentStage]) {
      jobsByStage[job.currentStage].push(job);
    }
  });

  const urgentCount = jobs.filter((j) => j.priority === 'urgent' || j.priority === 'express').length;
  const readyCount = jobs.filter((j) => j.currentStage === 'ready').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Summary Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#881337] text-white shadow-sm shadow-rose-950/20">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Production Floor Queue
              </h1>
              <span className="rounded-full bg-rose-100 text-[#881337] px-2.5 py-0.5 text-xs font-bold font-mono">
                {jobs.length} Active Jobs
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal">
              7-stage commercial press Kanban tracking from CTP plates to delivery
            </p>
          </div>
        </div>

        {/* Quick KPI pills & Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Urgent Jobs Alert Pill */}
          {urgentCount > 0 && (
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 border border-rose-200 px-3 py-2 text-xs font-bold text-rose-800">
              <Flame className="h-4 w-4 text-rose-600 animate-bounce" />
              <span>{urgentCount} Urgent Orders</span>
            </div>
          )}

          {/* Optional Toggle 1: Live Impression Telemetry */}
          <button
            type="button"
            onClick={onToggleTelemetry}
            className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold border transition-all ${
              showLiveTelemetry
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Optional: Toggle live impression counters and completion timers"
          >
            <Activity className={`h-4 w-4 ${showLiveTelemetry ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span>Telemetry: {showLiveTelemetry ? 'ON' : 'OFF'}</span>
          </button>

          {/* Optional Tool 2: Barcode Quick Scanner */}
          <button
            type="button"
            onClick={onOpenBarcodeScanner}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            title="Optional: Machine master quick barcode gun scanner"
          >
            <Barcode className="h-4 w-4 text-slate-600" />
            <span>Barcode Scanner</span>
          </button>

          {/* Machine Widget Toggle */}
          <button
            type="button"
            onClick={() => setShowMachineWidget((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            <span>Presses</span>
          </button>

          {/* Create New Estimate Link */}
          <button
            onClick={onGoToEstimator}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#881337] hover:bg-[#700f2e] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>New Job Estimate</span>
          </button>
        </div>
      </div>

      {/* Machine Status Collapsible Widget */}
      {showMachineWidget && (
        <MachineStatusWidget
          machines={machines}
          selectedMachineId={filterMachine}
          onSelectMachineFilter={onFilterMachineChange}
        />
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs">
        <div className="flex items-center gap-2 w-full sm:w-80">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filter by Job ID, client, or title..."
            className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Machine Filter */}
          <select
            value={filterMachine}
            onChange={(e) => onFilterMachineChange(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="all">All Press Machines</option>
            {machines.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => onFilterPriorityChange(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-500"
          >
            <option value="all">All Priorities</option>
            <option value="normal">Normal Priority</option>
            <option value="urgent">Urgent Priority</option>
            <option value="express">Express Priority</option>
          </select>
        </div>
      </div>

      {/* 7-Stage Horizontal Kanban Board */}
      <div className="overflow-x-auto pb-6">
        <div className="grid grid-cols-7 gap-4 min-w-[1540px]">
          {PRODUCTION_STAGES.map((stage, sIdx) => {
            const stageJobs = jobsByStage[stage.id] || [];

            return (
              <div
                key={stage.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedJobId) {
                    onMoveJobToStage(draggedJobId, stage.id);
                    setDraggedJobId(null);
                  }
                }}
                className="flex flex-col rounded-2xl border border-slate-200/90 bg-slate-50/50 p-3 shadow-2xs min-h-[650px]"
              >
                {/* Stage Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-white text-[11px] font-bold ${stage.badgeBg}`}
                    >
                      {sIdx + 1}
                    </span>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 leading-tight">
                        {stage.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-medium truncate max-w-[130px]">
                        {stage.id === 'prepress' && 'সিটিপি প্লেট (CTP)'}
                        {stage.id === 'press' && 'অফসেট ছাপা (Print)'}
                        {stage.id === 'coating' && 'ল্যামিনেশন (Lam)'}
                        {stage.id === 'finishing' && 'ডাইস কাটিং (Die-Cut)'}
                        {stage.id === 'bindery' && 'বাইন্ডিং ও পেস্টিং'}
                        {stage.id === 'qc' && 'চেকিং ও প্যাকিং (QC)'}
                        {stage.id === 'ready' && 'ডেলিভারি প্রস্তুত (Ready)'}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-white border border-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700 font-mono shadow-2xs">
                    {stageJobs.length}
                  </span>
                </div>

                {/* Droppable Cards Container */}
                <div className="flex-1 space-y-3 overflow-y-auto max-h-[720px] pr-0.5">
                  {stageJobs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 rounded-xl border border-dashed border-slate-200 text-slate-400 text-center p-4">
                      <p className="text-xs font-medium">No jobs in {stage.name}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Drag card here</p>
                    </div>
                  ) : (
                    stageJobs.map((job) => {
                      const isUrgent = job.priority === 'urgent';
                      const isExpress = job.priority === 'express';
                      const isReady = job.currentStage === 'ready';
                      const machine = machines.find((m) => m.id === job.assignedMachineId);

                      const getNextStageLabel = (cur: ProductionStage) => {
                        switch (cur) {
                          case 'prepress':
                            return '→ To Press (ছাপায় পাঠান)';
                          case 'press':
                            return '→ To Lam (ল্যামিনেশন)';
                          case 'coating':
                            return '→ To Die-Cut (কাটিং)';
                          case 'finishing':
                            return '→ To Bindery (বাইন্ডিং)';
                          case 'bindery':
                            return '→ To QC (চেকিং)';
                          case 'qc':
                            return '✓ Ready (প্রস্তুত)';
                          default:
                            return '✓ Ready at Gate';
                        }
                      };

                      return (
                        <div
                          key={job.id}
                          draggable
                          onDragStart={() => setDraggedJobId(job.id)}
                          className={`group rounded-xl border bg-white p-3.5 shadow-2xs hover:shadow-sm transition-all cursor-grab active:cursor-grabbing space-y-2.5 ${
                            isExpress
                              ? 'border-rose-400 ring-1 ring-rose-400/30'
                              : isUrgent
                              ? 'border-amber-400 ring-1 ring-amber-400/30'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {/* Card Top: Job ID & Priority Badge */}
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                              {job.id}
                            </span>
                            {isExpress ? (
                              <span className="rounded-full bg-rose-600 text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <Flame className="h-2.5 w-2.5" /> Express
                              </span>
                            ) : isUrgent ? (
                              <span className="rounded-full bg-amber-500 text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                                Urgent
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400">
                                Due: {job.dueDate.split(' ')[0]} {job.dueDate.split(' ')[1]}
                              </span>
                            )}
                          </div>

                          {/* Client & Title */}
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-900 transition-colors line-clamp-2">
                              {job.jobTitle}
                            </h4>
                            <p className="text-[11px] font-semibold text-slate-500 mt-0.5 truncate">
                              {job.client}
                            </p>
                          </div>

                          {/* Specifications Pills */}
                          <div className="flex flex-wrap gap-1.5 text-[10px]">
                            <span className="rounded bg-slate-100 text-slate-700 font-mono font-bold px-1.5 py-0.5">
                              {job.quantity.toLocaleString()} pcs
                            </span>
                            <span className="rounded bg-slate-100 text-slate-600 px-1.5 py-0.5">
                              {job.colors}
                            </span>
                            {job.hasLamination && (
                              <span className="rounded bg-emerald-50 text-emerald-700 px-1.5 py-0.5">
                                Lam
                              </span>
                            )}
                            {job.hasDieCutting && (
                              <span className="rounded bg-amber-50 text-amber-700 px-1.5 py-0.5">
                                Die
                              </span>
                            )}
                          </div>

                          {/* Optional Telemetry Widget (When ON) */}
                          {showLiveTelemetry && job.currentStage === 'press' && (
                            <div className="rounded-lg bg-slate-50 border border-slate-200/80 p-2 space-y-1.5 text-[10px]">
                              <div className="flex items-center justify-between text-slate-600 font-mono">
                                <span>Impressions:</span>
                                <span className="font-bold text-slate-900">
                                  {job.currentImpressions.toLocaleString()} /{' '}
                                  {job.targetImpressions.toLocaleString()}
                                </span>
                              </div>
                              {/* Progress bar */}
                              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-rose-700 transition-all duration-500"
                                  style={{
                                    width: `${Math.min(
                                      100,
                                      (job.currentImpressions / Math.max(1, job.targetImpressions)) * 100
                                    )}%`,
                                  }}
                                />
                              </div>
                              <div className="flex items-center justify-between text-slate-500 text-[9px]">
                                <span>Speed: 14,000/hr</span>
                                <span className="font-bold text-rose-800">
                                  ETA: ~{job.estimatedMinutesRemaining}m
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Operator Stamp if stamped */}
                          {job.operatorStamp && (
                            <p className="text-[10px] text-slate-400 italic truncate border-t border-slate-100 pt-1">
                              ✓ {job.operatorStamp}
                            </p>
                          )}

                          {/* Quick Stage Progression Controls (Touch & Tablet Optimized) */}
                          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>Machine: <strong className="text-slate-600">{machine?.name.split(' ')[0] || 'Unassigned'}</strong></span>
                              {sIdx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => onRollbackStage(job.id)}
                                  className="inline-flex items-center gap-0.5 text-slate-400 hover:text-slate-700 hover:underline transition-colors"
                                  title="Rollback to previous stage"
                                >
                                  <ArrowLeft className="h-3 w-3" />
                                  <span>Back</span>
                                </button>
                              )}
                            </div>

                            {!isReady && (
                              <button
                                type="button"
                                onClick={() => onAdvanceStage(job.id)}
                                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#881337] hover:bg-[#700f2e] text-white py-1.5 px-2.5 text-[11px] font-bold transition-all shadow-2xs hover:shadow-xs active:scale-[0.98]"
                                title="Advance to next production stage"
                              >
                                <span>{getNextStageLabel(job.currentStage)}</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optional Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isBarcodeScannerOpen}
        onClose={onCloseBarcodeScanner}
        jobs={jobs}
        onAdvanceStage={onAdvanceStage}
      />
    </div>
  );
};
