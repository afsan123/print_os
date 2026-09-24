export type StaffRole =
  | 'machine_master'
  | 'machine_helper'
  | 'cutter_master'
  | 'ctp_operator'
  | 'designer'
  | 'bindery_worker'
  | 'delivery_driver'
  | 'manager';

export interface StaffMember {
  id: string;
  name: string;
  nameBn: string;
  phone: string;
  role: StaffRole;
  roleLabel: string;
  department: 'Press Floor' | 'Pre-Press' | 'Post-Press' | 'Logistics' | 'Administration';
  assignedMachine?: string;
  baseSalary: number;
  overtimeHours: number;
  overtimeRate: number;
  overtimeAmount: number;
  productionBonus: number;
  advanceDeduction: number; // দাদন / অগ্রিম কর্তন
  netPayable: number;
  paidAmount: number;
  status: 'paid' | 'pending' | 'partial';
  paymentMethod?: 'cash' | 'bank' | 'bkash';
  paymentDate?: string;
  joinedDate: string;
  notes?: string;
}

export interface SalaryPaymentPayload {
  staffId: string;
  amount: number;
  paymentMethod: 'cash' | 'bank' | 'bkash';
  paymentDate: string;
  notes?: string;
}
