export interface InvoiceItem {
  description: string;
  quantity: number;
  unit: string;
  unitRate: number;
  total: number;
}

export type PaymentStatus = 'paid' | 'partial' | 'unpaid';

export interface SalesInvoice {
  id: string; // e.g., 'INV-2025-0421'
  jobId?: string; // e.g., 'JC-2025-0842'
  clientName: string;
  clientCompany?: string;
  clientPhone: string;
  clientAddress: string;
  clientBin?: string; // Business Identification Number
  jobTitle: string;
  quantity: number;
  unitRate: number;
  subtotal: number;
  taxRate: number; // e.g., 0 or 5 (%)
  taxAmount: number;
  totalAmount: number;
  advancePaid: number;
  dueAmount: number;
  paymentStatus: PaymentStatus;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
  createdAt: string;
}

export type ChalanStatus = 'draft' | 'dispatched' | 'delivered';
export type TransportMode = 'rickshaw_van' | 'pickup_truck' | 'delivery_boy' | 'client_pickup';

export interface DeliveryChalan {
  id: string; // e.g., 'CH-2025-0189'
  gatePassNo: string; // e.g., 'GP-2025-0189'
  jobId: string; // e.g., 'JC-2025-0842'
  invoiceId?: string; // e.g., 'INV-2025-0421'
  clientName: string;
  deliveryAddress: string;
  jobTitle: string;
  totalOrderQuantity: number;
  previouslyDelivered: number;
  deliveredQuantity: number;
  remainingBalance: number;
  packageCount: number; // Number of Bundles / Cartons
  packageDescription: string; // e.g., '10 Bundles × 500 Pcs in Kraft paper'
  transportMode: TransportMode;
  vehicleNumber?: string; // e.g., 'Dhaka Metro-Ta 11-4521'
  driverName?: string;
  driverPhone?: string;
  deliveryDate: string;
  status: ChalanStatus;
  receivedBy?: string;
  receiverPhone?: string;
  createdAt: string;
}

export type ClientPaymentMethod = 'cash' | 'cheque' | 'bank_transfer' | 'bkash';

export interface ClientPaymentRecord {
  id: string; // e.g., 'PAY-2025-0512'
  clientId?: string;
  clientName: string;
  invoiceId: string;
  amount: number;
  paymentMethod: ClientPaymentMethod;
  referenceNumber?: string; // Cheque number or TrxID
  bankName?: string;
  chequeDate?: string;
  paymentDate: string;
  notes?: string;
  recordedBy: string;
  createdAt: string;
}

export type AgingCategory = '0-15 days' | '16-30 days' | '31-60 days' | '60+ days overdue';

export interface DebtorSummary {
  clientName: string;
  company: string;
  phone: string;
  totalInvoiced: number;
  totalCollected: number;
  outstandingBalance: number;
  agingCategory: AgingCategory;
  lastPaymentDate?: string;
  creditLimit: number;
  status: 'healthy' | 'warning' | 'critical';
}
