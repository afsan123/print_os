export type CashEntryType = 'inflow' | 'outflow';

export type CashCategory =
  | 'client_advance'
  | 'cash_sale'
  | 'debtor_collection'
  | 'paper_purchase'
  | 'transport_fare'
  | 'worker_food'
  | 'maintenance'
  | 'utility'
  | 'petty_cash'
  | 'other';

export interface CashBookEntry {
  id: string; // e.g., 'CB-2025-0812'
  date: string;
  type: CashEntryType;
  category: CashCategory;
  particulars: string;
  voucherNo?: string;
  linkedJobId?: string;
  amount: number;
  balanceAfter: number;
  recordedBy: string;
  createdAt: string;
}

export type ExpenseCategory =
  | 'electricity_power'
  | 'machine_maintenance'
  | 'ink_chemicals'
  | 'factory_rent'
  | 'transport_logistics'
  | 'refreshments_tea'
  | 'office_admin'
  | 'staff_welfare';

export type ExpensePaymentMethod = 'cash' | 'bank' | 'bkash';

export interface ExpenseRecord {
  id: string; // e.g., 'EXP-2025-0319'
  date: string;
  category: ExpenseCategory;
  title: string;
  description?: string;
  amount: number;
  paymentMethod: ExpensePaymentMethod;
  receiptNo?: string;
  paidTo: string;
  approvedBy: string;
  createdAt: string;
}

export interface ProfitLossMetrics {
  period: string;
  grossRevenue: number;
  cogs: {
    paper: number;
    plates: number;
    printing: number;
    finishing: number;
    transport: number;
    total: number;
  };
  grossProfit: number;
  grossMarginPercent: number;
  operatingExpenses: {
    power: number;
    maintenance: number;
    rent: number;
    logistics: number;
    adminAndTea: number;
    total: number;
  };
  netProfit: number;
  netMarginPercent: number;
}
