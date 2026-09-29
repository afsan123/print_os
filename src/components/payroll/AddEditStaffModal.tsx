'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  UserPlus,
  Edit3,
  Briefcase,
  Phone,
  Wrench,
  DollarSign,
  Clock,
  Sparkles,
  Calendar,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { StaffMember, StaffRole } from '@/types/payroll';

interface AddEditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staffToEdit?: StaffMember | null;
  onSaveStaff: (
    data: Omit<StaffMember, 'id' | 'netPayable' | 'paidAmount' | 'status' | 'overtimeAmount'> & { id?: string }
  ) => void;
  onSuccessToast?: (msg: string) => void;
}

const ROLE_OPTIONS: { role: StaffRole; label: string; labelBn: string; defaultDept: StaffMember['department'] }[] = [
  { role: 'machine_master', label: 'Offset Machine Master', labelBn: 'অফসেট মেশিন মাস্টার', defaultDept: 'Press Floor' },
  { role: 'machine_helper', label: 'Machine Helper', labelBn: 'মেশিন হেল্পার', defaultDept: 'Press Floor' },
  { role: 'cutter_master', label: 'Cutting Master', labelBn: 'কাটিং মাস্টার', defaultDept: 'Post-Press' },
  { role: 'ctp_operator', label: 'CTP Operator', labelBn: 'সিটিপি অপারেটর', defaultDept: 'Pre-Press' },
  { role: 'designer', label: 'Pre-Press Graphic Designer', labelBn: 'গ্রাফিক ডিজাইনার', defaultDept: 'Pre-Press' },
  { role: 'bindery_worker', label: 'Bindery / Finishing Operator', labelBn: 'বাইন্ডিং ও ফোল্ডিং কারিগর', defaultDept: 'Post-Press' },
  { role: 'delivery_driver', label: 'Logistics & Delivery Staff', labelBn: 'ডেলিভারি ও লজিস্টিকস', defaultDept: 'Logistics' },
  { role: 'manager', label: 'Press & Production Manager', labelBn: 'প্রেস ও প্রোডাকশন ম্যানেজার', defaultDept: 'Administration' },
];

const DEPARTMENTS: StaffMember['department'][] = [
  'Press Floor',
  'Pre-Press',
  'Post-Press',
  'Logistics',
  'Administration',
];

export const AddEditStaffModal: React.FC<AddEditStaffModalProps> = ({
  isOpen,
  onClose,
  staffToEdit,
  onSaveStaff,
  onSuccessToast,
}) => {
  const isEditing = !!staffToEdit;

  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffRole>('machine_master');
  const [roleLabel, setRoleLabel] = useState('Offset Machine Master');
  const [department, setDepartment] = useState<StaffMember['department']>('Press Floor');
  const [assignedMachine, setAssignedMachine] = useState('');
  const [baseSalary, setBaseSalary] = useState<number>(25000);
  const [overtimeHours, setOvertimeHours] = useState<number>(0);
  const [overtimeRate, setOvertimeRate] = useState<number>(150);
  const [productionBonus, setProductionBonus] = useState<number>(0);
  const [advanceDeduction, setAdvanceDeduction] = useState<number>(0);
  const [joinedDate, setJoinedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Populate form when modal opens or editing target changes
  useEffect(() => {
    if (staffToEdit) {
      setName(staffToEdit.name || '');
      setNameBn(staffToEdit.nameBn || '');
      setPhone(staffToEdit.phone || '');
      setRole(staffToEdit.role || 'machine_master');
      setRoleLabel(staffToEdit.roleLabel || 'Offset Machine Master');
      setDepartment(staffToEdit.department || 'Press Floor');
      setAssignedMachine(staffToEdit.assignedMachine || '');
      setBaseSalary(staffToEdit.baseSalary || 0);
      setOvertimeHours(staffToEdit.overtimeHours || 0);
      setOvertimeRate(staffToEdit.overtimeRate || 150);
      setProductionBonus(staffToEdit.productionBonus || 0);
      setAdvanceDeduction(staffToEdit.advanceDeduction || 0);
      setJoinedDate(staffToEdit.joinedDate || new Date().toISOString().split('T')[0]);
      setNotes(staffToEdit.notes || '');
    } else {
      // Defaults for new employee
      setName('');
      setNameBn('');
      setPhone('+880 1');
      setRole('machine_master');
      setRoleLabel('Offset Machine Master');
      setDepartment('Press Floor');
      setAssignedMachine('Heidelberg SM 74');
      setBaseSalary(25000);
      setOvertimeHours(0);
      setOvertimeRate(150);
      setProductionBonus(0);
      setAdvanceDeduction(0);
      setJoinedDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [staffToEdit, isOpen]);

  if (!isOpen) return null;

  const handleRoleChange = (newRole: StaffRole) => {
    setRole(newRole);
    const selected = ROLE_OPTIONS.find((r) => r.role === newRole);
    if (selected) {
      setRoleLabel(selected.label);
      if (!isEditing) {
        setDepartment(selected.defaultDept);
      }
    }
  };

  const overtimeAmount = (overtimeHours || 0) * (overtimeRate || 0);
  const netPayable = Math.max(
    0,
    (baseSalary || 0) + overtimeAmount + (productionBonus || 0) - (advanceDeduction || 0)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveStaff({
      ...(isEditing && staffToEdit ? { id: staffToEdit.id } : {}),
      name: name.trim(),
      nameBn: nameBn.trim() || name.trim(),
      phone: phone.trim() || '+880 1700-000000',
      role,
      roleLabel,
      department,
      assignedMachine: assignedMachine.trim() || undefined,
      baseSalary: Number(baseSalary) || 0,
      overtimeHours: Number(overtimeHours) || 0,
      overtimeRate: Number(overtimeRate) || 0,
      productionBonus: Number(productionBonus) || 0,
      advanceDeduction: Number(advanceDeduction) || 0,
      joinedDate,
      notes: notes.trim() || undefined,
    });

    if (onSuccessToast) {
      onSuccessToast(
        isEditing
          ? `Staff member "${name}" updated successfully.`
          : `New staff member "${name}" added to payroll ledger.`
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl my-6 rounded-2xl bg-white dark:bg-[#111827] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-[#0B224F] text-[#1D5DFF] dark:text-[#23A8FF]">
              {isEditing ? <Edit3 className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                {isEditing ? 'কর্মী তথ্য ও বেতন সমন্বয় (Edit Employee)' : 'নতুন কর্মী যুক্ত করুন (Add New Employee)'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEditing
                  ? `Updating details and compensation for ${staffToEdit?.name}`
                  : 'Register machine master, helper, operator or office staff'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Section: Personal Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D5DFF] dark:text-[#23A8FF] flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Personal & Contact Info (ব্যক্তিগত ও যোগাযোগের তথ্য)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rafiqul Islam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#1D5DFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  বাংলা নাম (Name in Bengali)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: রফিকুল ইসলাম"
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#1D5DFF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Phone className="h-3 w-3 text-slate-400" />
                  <span>Mobile Number (মোবাইল নম্বর)</span>
                </label>
                <input
                  type="text"
                  placeholder="+880 1711-123456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#1D5DFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-400" />
                  <span>Joining Date (যোগদানের তারিখ)</span>
                </label>
                <input
                  type="date"
                  value={joinedDate}
                  onChange={(e) => setJoinedDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#1D5DFF]"
                />
              </div>
            </div>
          </div>

          {/* Section: Job Assignment */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D5DFF] dark:text-[#23A8FF] flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              <span>Role & Unit Assignment (পদবি ও কর্মক্ষেত্র)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Designation / Role (পদবি) *
                </label>
                <select
                  value={role}
                  onChange={(e) => handleRoleChange(e.target.value as StaffRole)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#1D5DFF]"
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.role} value={opt.role}>
                      {opt.label} ({opt.labelBn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department (বিভাগ) *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as StaffMember['department'])}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#1D5DFF]"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Wrench className="h-3 w-3 text-slate-400" />
                <span>Assigned Machine / Station (নির্দিষ্ট প্রেস মেশিন / কাজের টেবিল)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Heidelberg SM 74, Polar 115 Cutter, CTP Plate Setter"
                value={assignedMachine}
                onChange={(e) => setAssignedMachine(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#1D5DFF]"
              />
            </div>
          </div>

          {/* Section: Salary & Compensation */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1D5DFF] dark:text-[#23A8FF] flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5" />
              <span>Salary & Compensations (মাসিক বেতন ও ওভারটাইম রেট)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Base Salary (মূল বেতন ৳) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">৳</span>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    required
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(Number(e.target.value))}
                    className="w-full h-10 pl-7 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#1D5DFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span>OT Rate (৳/ঘণ্টা)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">৳</span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={overtimeRate}
                    onChange={(e) => setOvertimeRate(Number(e.target.value))}
                    className="w-full h-10 pl-7 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#1D5DFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  OT Hours (ওভারটাইম ঘণ্টা)
                </label>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(Number(e.target.value))}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-[#1D5DFF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-emerald-600" />
                  <span>Production Bonus (উৎপাদন বোনাস ৳)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">৳</span>
                  <input
                    type="number"
                    min={0}
                    step={200}
                    value={productionBonus}
                    onChange={(e) => setProductionBonus(Number(e.target.value))}
                    className="w-full h-10 pl-7 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-emerald-600 focus:outline-none focus:border-[#1D5DFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 text-rose-600" />
                  <span>Advance / Dadan (দাদন / অগ্রিম কর্তন ৳)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">৳</span>
                  <input
                    type="number"
                    min={0}
                    step={500}
                    value={advanceDeduction}
                    onChange={(e) => setAdvanceDeduction(Number(e.target.value))}
                    className="w-full h-10 pl-7 pr-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-rose-600 focus:outline-none focus:border-[#1D5DFF]"
                  />
                </div>
              </div>
            </div>

            {/* Live Calculation Preview Card */}
            <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/60 dark:bg-[#0B224F]/40 p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300">Base Salary (মূল বেতন):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">৳ {baseSalary.toLocaleString()}</span>
              </div>
              {overtimeHours > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
                  <span>Overtime Pay ({overtimeHours} hrs × ৳{overtimeRate}):</span>
                  <span className="font-mono font-bold">+৳ {overtimeAmount.toLocaleString()}</span>
                </div>
              )}
              {productionBonus > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
                  <span>Production Bonus (উৎপাদন বোনাস):</span>
                  <span className="font-mono font-bold">+৳ {productionBonus.toLocaleString()}</span>
                </div>
              )}
              {advanceDeduction > 0 && (
                <div className="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400">
                  <span>Advance Deduction (দাদন কর্তন):</span>
                  <span className="font-mono font-bold">-৳ {advanceDeduction.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-blue-200 dark:border-blue-800 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase">
                  Net Payable Salary (মোট প্রদেয় বেতন):
                </span>
                <span className="text-base font-black font-mono text-[#071A3D] dark:text-[#23A8FF]">
                  ৳ {netPayable.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1D5DFF] hover:bg-[#154cdb] text-xs font-bold text-white shadow-xs transition-colors disabled:opacity-50"
            >
              {isEditing ? <Edit3 className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              <span>{isEditing ? 'Save Changes' : 'Add Employee to Payroll'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
