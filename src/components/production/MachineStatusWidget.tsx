'use client';

import React from 'react';
import { Printer, Activity, CheckCircle2, AlertCircle, Wrench, Zap } from 'lucide-react';
import { PressMachine } from '@/types/production';

interface MachineStatusWidgetProps {
  machines: PressMachine[];
  onSelectMachineFilter?: (machineId: string) => void;
  selectedMachineId?: string;
}

export const MachineStatusWidget: React.FC<MachineStatusWidgetProps> = ({
  machines,
  onSelectMachineFilter,
  selectedMachineId,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-rose-400">
            <Printer className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Offset Machine Floor Status</h3>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70 flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          3/4 Presses Active
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {machines.map((machine) => {
          const isSelected = selectedMachineId === machine.id;
          const isRunning = machine.status === 'running';
          const isSetup = machine.status === 'setup';
          const isIdle = machine.status === 'idle';

          return (
            <div
              key={machine.id}
              onClick={() => onSelectMachineFilter?.(isSelected ? 'all' : machine.id)}
              className={`rounded-xl p-3.5 border transition-all cursor-pointer ${
                isSelected
                  ? 'border-rose-600 bg-rose-50/70 dark:bg-rose-950/40 shadow-xs ring-1 ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase">
                    {machine.code}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[170px]">
                    {machine.name}
                  </h4>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize flex items-center gap-1 border ${
                    isRunning
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/50'
                      : isSetup
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-200/60 dark:border-amber-800/50'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300/60 dark:border-slate-700'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isRunning ? 'bg-emerald-600 dark:bg-emerald-400 animate-pulse' : isSetup ? 'bg-amber-600 dark:bg-amber-400' : 'bg-slate-400'
                    }`}
                  />
                  {machine.status}
                </span>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/70 dark:border-slate-800 text-[11px] space-y-1">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Speed:</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-100">
                    {machine.speedPerHour.toLocaleString()} imp/hr
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Operator:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-100 truncate max-w-[120px]">
                    {machine.operatorName}
                  </span>
                </div>
                {machine.currentJobTitle && (
                  <p className="truncate font-semibold text-[#881337] dark:text-rose-300 bg-white dark:bg-slate-950 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900/60 text-[10px]">
                    ▶ {machine.currentJobTitle}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
