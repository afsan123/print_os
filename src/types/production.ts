export type ProductionStage =
  | 'prepress'   // Pre-Press & CTP Plate Output
  | 'press'      // Offset Machine Printing Run
  | 'coating'    // Lamination & Coating
  | 'finishing'  // Die Cutting & Punching
  | 'bindery'    // Bindery, Folding & Pasting
  | 'qc'         // Quality Inspection & Packaging
  | 'ready';     // Finished & Ready for Delivery

export type JobPriority = 'normal' | 'urgent' | 'express';

export type MachineStatus = 'running' | 'idle' | 'maintenance' | 'setup';

export interface PressMachine {
  id: string;
  name: string;
  code: string;
  colorCapability: string;
  speedPerHour: number;
  status: MachineStatus;
  currentJobId?: string;
  currentJobTitle?: string;
  operatorName: string;
}

export interface ProductionJob {
  id: string;                      // e.g. "JC-2025-0842"
  jobTitle: string;
  client: string;
  category: string;
  quantity: number;
  dueDate: string;
  priority: JobPriority;
  currentStage: ProductionStage;
  assignedMachineId: string;
  
  // Technical specs
  paperSpec: string;
  colors: string;
  platesCount: number;
  hasLamination: boolean;
  laminationType?: string;
  hasDieCutting: boolean;
  hasBinding: boolean;
  bindingType?: string;
  notes?: string;

  // Optional telemetry & timestamps
  targetImpressions: number;
  currentImpressions: number;
  estimatedMinutesRemaining?: number;
  createdAt: string;
  lastUpdated: string;
  operatorStamp?: string;
}

export interface StageDefinition {
  id: ProductionStage;
  name: string;
  shortCode: string;
  description: string;
  colorClass: string;
  badgeBg: string;
}
