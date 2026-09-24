'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  EstimatorState,
  CalculationResult,
  PrintTemplate,
} from '@/types/estimator';
import { DEFAULT_ESTIMATOR_STATE, PRESET_TEMPLATES } from '@/lib/constants';

export function usePrintEstimator(initialState: EstimatorState = DEFAULT_ESTIMATOR_STATE) {
  const [state, setState] = useState<EstimatorState>(initialState);
  const [savedTemplates, setSavedTemplates] = useState<PrintTemplate[]>(PRESET_TEMPLATES);

  // Reactive Calculation Engine
  const calculations: CalculationResult = useMemo(() => {
    const { jobSpecs, paperConfig, pressConfig, finishingConfig, additionalExpenses, profitMarginPercent } = state;

    const qty = Math.max(0, Number(jobSpecs.targetQuantity) || 0);
    const pps = Math.max(1, Number(paperConfig.piecesPerFullSheet) || 1);
    const wastage = Math.max(0, Number(paperConfig.wastagePercent) || 0);

    // 1. Paper Calculation
    // Effective Sheet Price
    const effectiveSheetPrice =
      paperConfig.priceMode === 'ream'
        ? (Number(paperConfig.pricePerReam) || 0) / 500
        : Number(paperConfig.pricePerSheet) || 0;

    // Formula: ((Target Quantity / Pieces Per Sheet) * (1 + wastage / 100))
    const rawSheets = Math.ceil(qty / pps);
    const wastageSheets = Math.ceil(rawSheets * (wastage / 100));
    const totalSheetsRequired = rawSheets + wastageSheets;
    const totalReamsRequired = +(totalSheetsRequired / 500).toFixed(2);

    // Total Paper Cost
    const paperCost = Math.round(totalSheetsRequired * effectiveSheetPrice);

    // 2. CTP Plates
    let colorCount = 4;
    if (pressConfig.colors === '1 Color') colorCount = 1;
    else if (pressConfig.colors === '2 Color') colorCount = 2;
    else if (pressConfig.colors === '4 Color (CMYK)') colorCount = 4;

    const sidesMultiplier = pressConfig.sides === 'Two Side (Work & Turn)' ? 2 : 1;
    // Plates needed
    const plateCount = colorCount * (pressConfig.sides === 'Two Side (Work & Turn)' ? 2 : 1);
    const plateCost = plateCount * (Number(pressConfig.costPerPlate) || 0);

    // 3. Printing (Impressions)
    // Press impressions = totalSheetsRequired * sidesMultiplier
    // Commercial printing press impressions minimum 1,000 and rounds to next 500 or 1,000
    const pressSheets = totalSheetsRequired;
    const machineImpressions = Math.max(1000, pressSheets * sidesMultiplier);
    const impressionThousands = Math.ceil(machineImpressions / 1000);
    const printingCost = Math.round(impressionThousands * (Number(pressConfig.impressionRatePerThousand) || 0));

    // 4. Post-Press & Finishing
    // Lamination: qty * ratePerPcs
    const laminationCost = finishingConfig.lamination.enabled
      ? Math.round(qty * (Number(finishingConfig.lamination.ratePerPcs) || 0))
      : 0;

    // Die Cutting: dieSetupCharge + (qty * punchRatePerPcs)
    const dieCuttingCost = finishingConfig.dieCutting.enabled
      ? Math.round(
          (Number(finishingConfig.dieCutting.dieSetupCharge) || 0) +
            qty * (Number(finishingConfig.dieCutting.punchRatePerPcs) || 0)
        )
      : 0;

    // Binding: qty * ratePerPcs
    const bindingCost = finishingConfig.binding.enabled
      ? Math.round(qty * (Number(finishingConfig.binding.ratePerPcs) || 0))
      : 0;

    // 5. Additional Expenses
    const transportCost = Number(additionalExpenses.transport) || 0;
    const otherExpensesCost = Number(additionalExpenses.otherExpenses) || 0;

    // 6. Total Production Cost
    const totalProductionCost =
      paperCost +
      plateCost +
      printingCost +
      laminationCost +
      dieCuttingCost +
      bindingCost +
      transportCost +
      otherExpensesCost;

    // 7. Profit & Final Selling Price
    const margin = Math.max(0, Math.min(100, Number(profitMarginPercent) || 0));
    const profitAmount = Math.round(totalProductionCost * (margin / 100));
    const finalSellingPrice = totalProductionCost + profitAmount;
    const perPieceCost = qty > 0 ? +(finalSellingPrice / qty).toFixed(2) : 0;

    return {
      rawSheetsRequired: rawSheets,
      wastageSheets,
      totalSheetsRequired,
      totalReamsRequired,
      effectivePaperPricePerSheet: +effectiveSheetPrice.toFixed(2),
      paperCost,
      plateCount,
      plateCost,
      machineImpressions,
      printingCost,
      laminationCost,
      dieCuttingCost,
      bindingCost,
      transportCost,
      otherExpensesCost,
      totalProductionCost,
      profitMarginPercent: margin,
      profitAmount,
      finalSellingPrice,
      perPieceCost,
    };
  }, [state]);

  // Updaters
  const updateJobSpecs = useCallback((patch: Partial<EstimatorState['jobSpecs']>) => {
    setState((prev) => ({
      ...prev,
      jobSpecs: { ...prev.jobSpecs, ...patch },
    }));
  }, []);

  const updatePaperConfig = useCallback((patch: Partial<EstimatorState['paperConfig']>) => {
    setState((prev) => ({
      ...prev,
      paperConfig: { ...prev.paperConfig, ...patch },
    }));
  }, []);

  const updatePressConfig = useCallback((patch: Partial<EstimatorState['pressConfig']>) => {
    setState((prev) => ({
      ...prev,
      pressConfig: { ...prev.pressConfig, ...patch },
    }));
  }, []);

  const updateFinishingConfig = useCallback((patch: Partial<EstimatorState['finishingConfig']>) => {
    setState((prev) => ({
      ...prev,
      finishingConfig: { ...prev.finishingConfig, ...patch },
    }));
  }, []);

  const updateAdditionalExpenses = useCallback((patch: Partial<EstimatorState['additionalExpenses']>) => {
    setState((prev) => ({
      ...prev,
      additionalExpenses: { ...prev.additionalExpenses, ...patch },
    }));
  }, []);

  const setProfitMargin = useCallback((margin: number) => {
    setState((prev) => ({
      ...prev,
      profitMarginPercent: margin,
    }));
  }, []);

  const resetToDefault = useCallback(() => {
    setState(DEFAULT_ESTIMATOR_STATE);
  }, []);

  const loadTemplate = useCallback((template: PrintTemplate) => {
    setState(template.state);
  }, []);

  const saveCustomTemplate = useCallback((name: string, description: string) => {
    const newTemplate: PrintTemplate = {
      id: `custom-${Date.now()}`,
      name,
      description,
      category: state.jobSpecs.category,
      state: JSON.parse(JSON.stringify(state)),
    };
    setSavedTemplates((prev) => [newTemplate, ...prev]);
    return newTemplate;
  }, [state]);

  return {
    state,
    calculations,
    updateJobSpecs,
    updatePaperConfig,
    updatePressConfig,
    updateFinishingConfig,
    updateAdditionalExpenses,
    setProfitMargin,
    resetToDefault,
    loadTemplate,
    saveCustomTemplate,
    savedTemplates,
  };
}
