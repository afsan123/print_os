export type ProcurementMode = 'direct_buy' | 'godown_stock';

export type BillPaymentStatus = 'paid' | 'partial' | 'due';

export interface PaperSupplier {
  id: string;
  name: string;
  company: string;
  contactPerson?: string;
  phone: string;
  email: string;
  address: string;
  bin?: string;
  paperSpecialties: string[];
  balance: number; // outstanding payable to vendor
  rating?: number;
}

export interface PurchaseBill {
  id: string;                      // e.g. "PB-2025-0312"
  supplierId: string;
  supplierName: string;
  linkedJobId?: string;           // e.g. "JC-2025-0842" if bought directly for a job
  linkedJobTitle?: string;
  paperType: string;
  gsm: number;
  fullSheetSize: string;
  reams: number;
  sheets: number;
  ratePerReam: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: BillPaymentStatus;
  paymentMethod: 'Cash' | 'Credit (30 Days)' | 'bKash / Nagad' | 'Bank Cheque';
  procurementType: 'direct_job' | 'godown_stock';
  purchaseDate: string;
  notes?: string;
}

export interface GodownWarehouse {
  id: string;
  name: string;
  location: string;
  inChargeName: string;
  phone: string;
}

export interface StockItem {
  id: string;
  godownId: string;
  godownName: string;
  paperType: string;
  gsm: number;
  fullSheetSize: string;
  reamsAvailable: number;
  sheetsAvailable: number;
  averageUnitCost: number;
  minThresholdReams: number; // triggers low-stock badge
  lastRestocked: string;
}
