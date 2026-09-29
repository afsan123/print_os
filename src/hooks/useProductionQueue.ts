'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { CalculationResult, EstimatorState } from '@/types/estimator';
import { PressMachine, ProductionJob, ProductionStage, StageDefinition } from '@/types/production';
import { appwriteService } from '@/lib/appwriteService';

export const PRODUCTION_STAGES: StageDefinition[] = [
  { id: 'prepress', name: 'Pre-Press', shortCode: 'CTP', description: 'Artwork and plate output', colorClass: 'text-sky-700', badgeBg: 'bg-sky-600' },
  { id: 'press', name: 'Offset Press', shortCode: 'PRINT', description: 'Printing run', colorClass: 'text-blue-700', badgeBg: 'bg-blue-600' },
  { id: 'coating', name: 'Coating', shortCode: 'LAM', description: 'Lamination and coating', colorClass: 'text-emerald-700', badgeBg: 'bg-emerald-600' },
  { id: 'finishing', name: 'Finishing', shortCode: 'DIE', description: 'Die cutting and trimming', colorClass: 'text-amber-700', badgeBg: 'bg-amber-600' },
  { id: 'bindery', name: 'Bindery', shortCode: 'BIND', description: 'Folding and binding', colorClass: 'text-purple-700', badgeBg: 'bg-purple-600' },
  { id: 'qc', name: 'Quality Check', shortCode: 'QC', description: 'Inspection and packing', colorClass: 'text-rose-700', badgeBg: 'bg-rose-600' },
  { id: 'ready', name: 'Ready', shortCode: 'READY', description: 'Ready for delivery', colorClass: 'text-slate-700', badgeBg: 'bg-slate-600' },
];

const INITIAL_MACHINES: PressMachine[] = [
  { id: 'sm74', name: 'Heidelberg Speedmaster SM 74', code: 'SM-74', colorCapability: '4 Color', speedPerHour: 9000, status: 'running', operatorName: 'Master Rafiqul Islam' },
  { id: 'gto52', name: 'Heidelberg GTO 52', code: 'GTO-52', colorCapability: '2 Color', speedPerHour: 6000, status: 'setup', operatorName: 'Master Shamsul Alam' },
  { id: 'ctp', name: 'CTP Plate Setter', code: 'CTP-01', colorCapability: 'Pre-Press', speedPerHour: 35, status: 'running', operatorName: 'Tarek Aziz' },
  { id: 'cut', name: 'Polar Paper Cutter', code: 'CUT-01', colorCapability: 'Finishing', speedPerHour: 900, status: 'idle', operatorName: 'Anwar Hossain' },
];

const INITIAL_JOBS: ProductionJob[] = [
  { id: 'JC-2026-0842', jobTitle: 'Company Leaflet', client: 'ABC Pharma Ltd.', category: 'Leaflet', quantity: 10000, dueDate: '30 Sep 2026', priority: 'urgent', currentStage: 'press', assignedMachineId: 'sm74', paperSpec: '150 GSM Art Paper (23 × 36 inch)', colors: '4 Color (CMYK)', platesCount: 4, hasLamination: true, laminationType: 'Matte Lamination', hasDieCutting: true, hasBinding: false, targetImpressions: 11000, currentImpressions: 6800, estimatedMinutesRemaining: 28, createdAt: '2026-09-27T09:00:00.000Z', lastUpdated: '2026-09-28T09:00:00.000Z' },
  { id: 'JC-2026-0845', jobTitle: 'Executive Visiting Cards', client: 'Beximco Consumer Brands', category: 'Visiting Card', quantity: 1000, dueDate: '29 Sep 2026', priority: 'express', currentStage: 'finishing', assignedMachineId: 'cut', paperSpec: '300 GSM Art Card (20 × 30 inch)', colors: '4 Color (CMYK)', platesCount: 8, hasLamination: true, laminationType: 'Matte Lamination', hasDieCutting: true, hasBinding: false, targetImpressions: 1000, currentImpressions: 1000, createdAt: '2026-09-27T10:00:00.000Z', lastUpdated: '2026-09-28T08:00:00.000Z' },
];

export function useProductionQueue() {
  const [jobs, setJobs] = useState<ProductionJob[]>(INITIAL_JOBS);
  const [machines, setMachines] = useState<PressMachine[]>(INITIAL_MACHINES);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMachine, setFilterMachine] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showLiveTelemetry, setShowLiveTelemetry] = useState(true);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);

  // Sync machine assignments with active jobs
  const syncMachineAssignments = useCallback((nextJobs: ProductionJob[]) => {
    setMachines((current) => current.map((machine) => {
      const activeJob = nextJobs.find((job) => job.assignedMachineId === machine.id && job.currentStage !== 'ready');
      return activeJob ? { ...machine, currentJobId: activeJob.id, currentJobTitle: activeJob.jobTitle } : { ...machine, currentJobId: undefined, currentJobTitle: undefined };
    }));
  }, []);

  // Hydrate cloud job cards on mount
  useEffect(() => {
    appwriteService.fetchJobCards().then((cloudJobs) => {
      if (cloudJobs && cloudJobs.length > 0) {
        setJobs((prev) => {
          const cloudIds = new Set(cloudJobs.map((j) => j.id));
          const nonCloud = prev.filter((p) => !cloudIds.has(p.id));
          const merged = [...cloudJobs, ...nonCloud];
          syncMachineAssignments(merged);
          return merged;
        });
      }
    });
  }, [syncMachineAssignments]);

  const filteredJobs = useMemo(() => jobs.filter((job) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || [job.id, job.client, job.jobTitle].some((value) => value.toLowerCase().includes(query));
    return matchesSearch && (filterMachine === 'all' || job.assignedMachineId === filterMachine) && (filterPriority === 'all' || job.priority === filterPriority);
  }), [jobs, searchQuery, filterMachine, filterPriority]);

  const updateStage = useCallback((jobId: string, stage: ProductionStage, operatorStamp?: string) => {
    setJobs((current) => {
      const next = current.map((job) => job.id === jobId ? { ...job, currentStage: stage, operatorStamp: operatorStamp ?? job.operatorStamp, lastUpdated: new Date().toISOString() } : job);
      syncMachineAssignments(next);
      return next;
    });
    appwriteService.updateJobCardStage(jobId, stage, operatorStamp).catch(() => {});
  }, [syncMachineAssignments]);

  const advanceStage = useCallback((jobId: string, operatorStamp?: string) => {
    const job = jobs.find((item) => item.id === jobId);
    if (!job) return;
    const index = PRODUCTION_STAGES.findIndex((stage) => stage.id === job.currentStage);
    if (index < PRODUCTION_STAGES.length - 1) updateStage(jobId, PRODUCTION_STAGES[index + 1].id, operatorStamp);
  }, [jobs, updateStage]);

  const rollbackStage = useCallback((jobId: string) => {
    const job = jobs.find((item) => item.id === jobId);
    if (!job) return;
    const index = PRODUCTION_STAGES.findIndex((stage) => stage.id === job.currentStage);
    if (index > 0) updateStage(jobId, PRODUCTION_STAGES[index - 1].id);
  }, [jobs, updateStage]);

  const addJobFromEstimator = useCallback((state: EstimatorState, calc: CalculationResult) => {
    const id = `JC-2026-${String(1000 + jobs.length + 1).padStart(4, '0')}`;
    const job: ProductionJob = {
      id,
      jobTitle: state.jobSpecs.jobTitle,
      client: state.jobSpecs.client,
      category: state.jobSpecs.category,
      quantity: state.jobSpecs.targetQuantity,
      dueDate: 'In 3 Days',
      priority: 'normal',
      currentStage: 'prepress',
      assignedMachineId: 'ctp',
      paperSpec: `${state.paperConfig.paperType} (${state.paperConfig.fullSheetSize})`,
      colors: state.pressConfig.colors,
      platesCount: calc.plateCount,
      printBill: calc.printingCost,
      hasLamination: state.finishingConfig.lamination.enabled,
      laminationType: state.finishingConfig.lamination.type,
      hasDieCutting: state.finishingConfig.dieCutting.enabled,
      hasBinding: state.finishingConfig.binding.enabled,
      bindingType: state.finishingConfig.binding.type,
      hasCustomFinishing: (state.finishingConfig.customFinishings || []).some((c) => c.enabled && c.name.trim()),
      customFinishingSummary: (state.finishingConfig.customFinishings || [])
        .filter((c) => c.enabled && c.name.trim())
        .map((c) => c.name)
        .join(', '),
      customFinishingsJson: JSON.stringify(
        (state.finishingConfig.customFinishings || []).filter((c) => c.enabled && c.name.trim())
      ),
      notes: state.additionalExpenses.notes,
      targetImpressions: calc.machineImpressions,
      currentImpressions: 0,
      estimatedMinutesRemaining: Math.ceil(calc.machineImpressions / 100),
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    setJobs((current) => {
      const next = [job, ...current];
      syncMachineAssignments(next);
      return next;
    });
    appwriteService.saveJobCard(job).catch(() => {});
    return job;
  }, [jobs.length, syncMachineAssignments]);

  return {
    jobs,
    filteredJobs,
    machines,
    searchQuery,
    setSearchQuery,
    filterMachine,
    setFilterMachine,
    filterPriority,
    setFilterPriority,
    showLiveTelemetry,
    setShowLiveTelemetry,
    isBarcodeScannerOpen,
    setIsBarcodeScannerOpen,
    advanceStage,
    rollbackStage,
    moveJobToStage: updateStage,
    addJobFromEstimator,
  };
}
