'use client';

import React from 'react';
import { JobInfoCard } from './JobInfoCard';
import { PaperConfigCard } from './PaperConfigCard';
import { PrintingSetupCard } from './PrintingSetupCard';
import { PostPressCard } from './PostPressCard';
import { AdditionalExpensesCard } from './AdditionalExpensesCard';
import { CostSummaryCard } from './CostSummaryCard';
import { EstimatorState, CalculationResult, ClientRecord } from '@/types/estimator';

interface EstimatorFormProps {
  state: EstimatorState;
  calculations: CalculationResult;
  clients: ClientRecord[];
  onUpdateJobSpecs: (patch: Partial<EstimatorState['jobSpecs']>) => void;
  onUpdatePaperConfig: (patch: Partial<EstimatorState['paperConfig']>) => void;
  onUpdatePressConfig: (patch: Partial<EstimatorState['pressConfig']>) => void;
  onUpdateFinishingConfig: (patch: Partial<EstimatorState['finishingConfig']>) => void;
  onUpdateAdditionalExpenses: (patch: Partial<EstimatorState['additionalExpenses']>) => void;
  onProfitMarginChange: (margin: number) => void;
  onOpenNewClientModal: () => void;
  onOpenWhatsAppModal: () => void;
  onCreateInvoiceAndJobCard: (advance?: number) => void;
}

export const EstimatorForm: React.FC<EstimatorFormProps> = ({
  state,
  calculations,
  clients,
  onUpdateJobSpecs,
  onUpdatePaperConfig,
  onUpdatePressConfig,
  onUpdateFinishingConfig,
  onUpdateAdditionalExpenses,
  onProfitMarginChange,
  onOpenNewClientModal,
  onOpenWhatsAppModal,
  onCreateInvoiceAndJobCard,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start">
      {/* Left Column (~65% width: 8 columns out of 12) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Row 1: Section 1 (Job Information) & Section 2 (Paper Configuration) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <JobInfoCard
            specs={state.jobSpecs}
            clients={clients}
            onUpdate={onUpdateJobSpecs}
            onOpenNewClientModal={onOpenNewClientModal}
          />
          <PaperConfigCard
            config={state.paperConfig}
            onUpdate={onUpdatePaperConfig}
          />
        </div>

        {/* Row 2: Section 3 (Printing Setup) & Section 4 (Post-Press & Finishing) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PrintingSetupCard
            config={state.pressConfig}
            onUpdate={onUpdatePressConfig}
          />
          <PostPressCard
            config={state.finishingConfig}
            onUpdate={onUpdateFinishingConfig}
          />
        </div>

        {/* Row 3: Section 5 (Additional Expenses) Spanning full width */}
        <AdditionalExpensesCard
          expenses={state.additionalExpenses}
          onUpdate={onUpdateAdditionalExpenses}
        />
      </div>

      {/* Right Column (~35% width: 4 columns out of 12) */}
      <div className="lg:col-span-4">
        <CostSummaryCard
          calc={calculations}
          profitMarginPercent={state.profitMarginPercent}
          onProfitMarginChange={onProfitMarginChange}
          onOpenWhatsAppModal={onOpenWhatsAppModal}
          onCreateInvoiceAndJobCard={onCreateInvoiceAndJobCard}
        />
      </div>
    </div>
  );
};
