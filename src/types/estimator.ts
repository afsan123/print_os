export type PaperPriceMode = 'ream' | 'sheet';

export type PrintColorMode = '1 Color' | '2 Color' | '4 Color (CMYK)';

export type PrintSidesMode = 'One Side' | 'Two Side (Work & Turn)';

export type LaminationType = 'Matte Lamination' | 'Gloss Lamination' | 'Thermal' | 'Spot UV';

export type BindingType = 'Saddle Stitch' | 'Perfect Bind' | 'Pad Gluing' | 'Hard Cover' | 'Spiral Wire';

export interface JobSpecs {
  jobTitle: string;
  client: string;
  category: string;
  targetQuantity: number;
}

export interface PaperConfig {
  paperType: string;
  fullSheetSize: string;
  gsm: number;
  priceMode: PaperPriceMode;
  pricePerReam: number;
  pricePerSheet: number;
  piecesPerFullSheet: number;
  wastagePercent: number; // default 5%
}

export interface PressConfig {
  colors: PrintColorMode;
  sides: PrintSidesMode;
  costPerPlate: number;
  impressionRatePerThousand: number;
}

export interface FinishingConfig {
  lamination: {
    enabled: boolean;
    type: LaminationType;
    ratePerPcs: number;
  };
  dieCutting: {
    enabled: boolean;
    dieSetupCharge: number;
    punchRatePerPcs: number;
  };
  binding: {
    enabled: boolean;
    type: BindingType;
    ratePerPcs: number;
  };
}

export interface AdditionalExpenses {
  transport: number;
  otherExpenses: number;
  notes: string;
}

export interface CalculationResult {
  // Paper metrics
  rawSheetsRequired: number;
  wastageSheets: number;
  totalSheetsRequired: number;
  totalReamsRequired: number;
  effectivePaperPricePerSheet: number;
  paperCost: number;

  // CTP & Plates
  plateCount: number;
  plateCost: number;

  // Printing & Press
  machineImpressions: number;
  printingCost: number;

  // Finishing
  laminationCost: number;
  dieCuttingCost: number;
  bindingCost: number;

  // Expenses
  transportCost: number;
  otherExpensesCost: number;

  // Totals & Pricing
  totalProductionCost: number;
  profitMarginPercent: number;
  profitAmount: number;
  finalSellingPrice: number;
  perPieceCost: number;
}

export interface EstimatorState {
  jobSpecs: JobSpecs;
  paperConfig: PaperConfig;
  pressConfig: PressConfig;
  finishingConfig: FinishingConfig;
  additionalExpenses: AdditionalExpenses;
  profitMarginPercent: number;
}

export interface PrintTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  state: EstimatorState;
}

export interface ClientRecord {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  balance: number;
  bin?: string;
  creditLimit?: number;
  createdAt?: string;
}
