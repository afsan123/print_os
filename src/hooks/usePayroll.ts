'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { SalaryPaymentPayload, StaffMember } from '@/types/payroll';

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-001',
    name: 'Rafiqul Islam',
    nameBn: 'রফিকুল ইসলাম',
    phone: '+880 1711-123456',
    role: 'machine_master',
    roleLabel: 'Offset Machine Master',
    department: 'Press Floor',
    assignedMachine: 'Heidelberg SM 74',
    baseSalary: 32000,
    overtimeHours: 12,
    overtimeRate: 200,
    overtimeAmount: 2400,
    productionBonus: 1500,
    advanceDeduction: 0,
    netPayable: 35900,
    paidAmount: 0,
    status: 'pending',
    joinedDate: '2022-02-01',
  },
  {
    id: 'staff-002',
    name: 'Shamsul Alam',
    nameBn: 'শামসুল আলম',
    phone: '+880 1811-123456',
    role: 'machine_helper',
    roleLabel: 'Machine Helper',
    department: 'Press Floor',
    assignedMachine: 'Heidelberg SM 74',
    baseSalary: 19000,
    overtimeHours: 10,
    overtimeRate: 120,
    overtimeAmount: 1200,
    productionBonus: 500,
    advanceDeduction: 1000,
    netPayable: 19700,
    paidAmount: 10000,
    status: 'partial',
    paymentMethod: 'cash',
    paymentDate: '2026-09-20',
    joinedDate: '2023-05-12',
  },
  {
    id: 'staff-003',
    name: 'Tarek Aziz',
    nameBn: 'তারেক আজিজ',
    phone: '+880 1911-123456',
    role: 'ctp_operator',
    roleLabel: 'CTP Operator',
    department: 'Pre-Press',
    assignedMachine: 'CTP Plate Setter',
    baseSalary: 26000,
    overtimeHours: 4,
    overtimeRate: 160,
    overtimeAmount: 640,
    productionBonus: 0,
    advanceDeduction: 0,
    netPayable: 26640,
    paidAmount: 26640,
    status: 'paid',
    paymentMethod: 'bank',
    paymentDate: '2026-09-25',
    joinedDate: '2021-07-08',
  },
];

const STORAGE_KEY = 'print_os_payroll_staff';

export function usePayroll() {
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [activeStaffForPay, setActiveStaffForPay] = useState<StaffMember | null>(null);
  const [activeStaffForSlip, setActiveStaffForSlip] = useState<StaffMember | null>(null);
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [staffToEdit, setStaffToEdit] = useState<StaffMember | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);

  // Load staff from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStaff(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load payroll staff:', e);
    }
  }, []);

  const saveStaffToStorage = (updatedStaff: StaffMember[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStaff));
    } catch (e) {
      console.error('Failed to save payroll staff:', e);
    }
  };

  // Add a new employee
  const addStaff = useCallback(
    (
      newStaffData: Omit<
        StaffMember,
        'id' | 'netPayable' | 'paidAmount' | 'status' | 'overtimeAmount'
      >
    ) => {
      const overtimeHours = Number(newStaffData.overtimeHours) || 0;
      const overtimeRate = Number(newStaffData.overtimeRate) || 0;
      const overtimeAmount = overtimeHours * overtimeRate;
      const baseSalary = Number(newStaffData.baseSalary) || 0;
      const productionBonus = Number(newStaffData.productionBonus) || 0;
      const advanceDeduction = Number(newStaffData.advanceDeduction) || 0;
      const netPayable = Math.max(
        0,
        baseSalary + overtimeAmount + productionBonus - advanceDeduction
      );

      const newMember: StaffMember = {
        ...newStaffData,
        id: `staff-${Date.now().toString().slice(-4)}`,
        overtimeHours,
        overtimeRate,
        overtimeAmount,
        baseSalary,
        productionBonus,
        advanceDeduction,
        netPayable,
        paidAmount: 0,
        status: 'pending',
      };

      setStaff((prev) => {
        const updated = [newMember, ...prev];
        saveStaffToStorage(updated);
        return updated;
      });

      return newMember;
    },
    []
  );

  // Update existing employee
  const updateStaff = useCallback((updatedMember: StaffMember) => {
    const overtimeHours = Number(updatedMember.overtimeHours) || 0;
    const overtimeRate = Number(updatedMember.overtimeRate) || 0;
    const overtimeAmount = overtimeHours * overtimeRate;
    const baseSalary = Number(updatedMember.baseSalary) || 0;
    const productionBonus = Number(updatedMember.productionBonus) || 0;
    const advanceDeduction = Number(updatedMember.advanceDeduction) || 0;
    const netPayable = Math.max(
      0,
      baseSalary + overtimeAmount + productionBonus - advanceDeduction
    );
    const paidAmount = Number(updatedMember.paidAmount) || 0;
    const status = (
      paidAmount >= netPayable ? 'paid' : paidAmount > 0 ? 'partial' : 'pending'
    ) as 'paid' | 'partial' | 'pending';

    const fullMember: StaffMember = {
      ...updatedMember,
      overtimeHours,
      overtimeRate,
      overtimeAmount,
      baseSalary,
      productionBonus,
      advanceDeduction,
      netPayable,
      paidAmount,
      status,
    };

    setStaff((prev) => {
      const updated = prev.map((m) => (m.id === fullMember.id ? fullMember : m));
      saveStaffToStorage(updated);
      return updated;
    });
  }, []);

  // Remove employee
  const removeStaff = useCallback((staffId: string) => {
    setStaff((prev) => {
      const updated = prev.filter((m) => m.id !== staffId);
      saveStaffToStorage(updated);
      return updated;
    });
  }, []);

  // Record salary payment
  const recordSalaryPayment = useCallback((payload: SalaryPaymentPayload) => {
    setStaff((current) => {
      const updated = current.map((member) => {
        if (member.id !== payload.staffId) return member;
        const paidAmount = Math.min(
          member.netPayable,
          member.paidAmount + Math.max(0, payload.amount)
        );
        return {
          ...member,
          paidAmount,
          paymentMethod: payload.paymentMethod,
          paymentDate: payload.paymentDate,
          status: (paidAmount >= member.netPayable ? 'paid' : 'partial') as
            | 'paid'
            | 'partial',
        };
      });
      saveStaffToStorage(updated);
      return updated;
    });
    setActiveStaffForPay(null);
  }, []);

  const metrics = useMemo(
    () => ({
      headcount: staff.length,
      totalPayroll: staff.reduce((total, member) => total + member.netPayable, 0),
      totalDisbursed: staff.reduce((total, member) => total + member.paidAmount, 0),
      totalPending: staff.reduce(
        (total, member) => total + Math.max(0, member.netPayable - member.paidAmount),
        0
      ),
      paidCount: staff.filter((member) => member.status === 'paid').length,
      pendingCount: staff.filter((member) => member.status !== 'paid').length,
    }),
    [staff]
  );

  return {
    staff,
    metrics,
    activeStaffForPay,
    setActiveStaffForPay,
    activeStaffForSlip,
    setActiveStaffForSlip,
    isAddStaffModalOpen,
    setIsAddStaffModalOpen,
    staffToEdit,
    setStaffToEdit,
    staffToDelete,
    setStaffToDelete,
    addStaff,
    updateStaff,
    removeStaff,
    recordSalaryPayment,
  };
}
