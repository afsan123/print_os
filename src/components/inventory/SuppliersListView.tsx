'use client';

import React, { useState, useMemo } from 'react';
import {
  Building2,
  Plus,
  Phone,
  Mail,
  MapPin,
  FileSpreadsheet,
  Banknote,
  Star,
  Search,
  X,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Printer,
  Sparkles,
  Package,
  Layers,
  FileText,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { PaperSupplier, PurchaseBill } from '@/types/inventory';

interface SuppliersListViewProps {
  suppliers: PaperSupplier[];
  purchaseBills: PurchaseBill[];
  onAddSupplier: (supplier: Omit<PaperSupplier, 'id'>) => void;
  onRecordPayment: (billId: string, amount: number) => void;
  onCreatePurchaseBill?: (billData: Omit<PurchaseBill, 'id'>) => PurchaseBill;
  onGoToEstimator: () => void;
}

export const SuppliersListView: React.FC<SuppliersListViewProps> = ({
  suppliers,
  purchaseBills,
  onAddSupplier,
  onRecordPayment,
  onCreatePurchaseBill,
  onGoToEstimator,
}) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterPayableStatus, setFilterPayableStatus] = useState<'all' | 'due' | 'clear'>('all');
  const [sortBy, setSortBy] = useState<'due_desc' | 'purchases_desc' | 'name' | 'rating'>('due_desc');
  const [activeHistoryTab, setActiveHistoryTab] = useState<'bills' | 'payments' | 'materials' | 'ledger'>('bills');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [paymentModalBill, setPaymentModalBill] = useState<PurchaseBill | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false);

  // New Supplier Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [bin, setBin] = useState('');
  const [specialties, setSpecialties] = useState('Art Paper 150 GSM, Art Card 300 GSM');
  const [openingBalance, setOpeningBalance] = useState<number>(0);

  // New Purchase Bill Form State (for selected supplier)
  const [billPaperType, setBillPaperType] = useState('Art Paper (আর্ট পেপার)');
  const [billGsm, setBillGsm] = useState(150);
  const [billSheetSize, setBillSheetSize] = useState('23 × 36 inch');
  const [billReams, setBillReams] = useState(2.0);
  const [billRate, setBillRate] = useState(3600);
  const [billPaymentMethod, setBillPaymentMethod] = useState<'Cash' | 'Credit (30 Days)' | 'bKash / Nagad' | 'Bank Cheque'>('Credit (30 Days)');
  const [billPaidNow, setBillPaidNow] = useState(0);
  const [billNotes, setBillNotes] = useState('Godown paper supply');

  // Helper formatting
  const fmt = (val: number) => `৳ ${Math.round(val).toLocaleString('en-IN')}`;

  // Helper to compute stats for any supplier
  const getSupplierStats = (supplierId: string, supplierName: string) => {
    const sBills = purchaseBills.filter(
      (b) =>
        b.supplierId === supplierId ||
        b.supplierName.toLowerCase() === supplierName.toLowerCase()
    );

    const totalPurchased = sBills.reduce((acc, b) => acc + b.totalAmount, 0);
    const totalPaid = sBills.reduce((acc, b) => acc + b.paidAmount, 0);
    const totalDue = sBills.reduce(
      (acc, b) => acc + Math.max(0, b.totalAmount - b.paidAmount),
      0
    );
    const totalReams = sBills.reduce((acc, b) => acc + b.reams, 0);

    return {
      bills: sBills,
      totalPurchased,
      totalPaid,
      totalDue,
      totalReams,
      billCount: sBills.length,
    };
  };

  // Grand totals across all vendors
  const totalAllPurchases = useMemo(
    () => purchaseBills.reduce((acc, b) => acc + b.totalAmount, 0),
    [purchaseBills]
  );
  const totalAllPaid = useMemo(
    () => purchaseBills.reduce((acc, b) => acc + b.paidAmount, 0),
    [purchaseBills]
  );
  const totalAllPayableDue = useMemo(
    () => purchaseBills.reduce((acc, b) => acc + Math.max(0, b.totalAmount - b.paidAmount), 0),
    [purchaseBills]
  );

  // Selected supplier & stats
  const selectedSupplier = useMemo(
    () => suppliers.find((s) => s.id === selectedSupplierId) || null,
    [suppliers, selectedSupplierId]
  );

  const selectedStats = useMemo(() => {
    if (!selectedSupplier) return null;
    return getSupplierStats(selectedSupplier.id, selectedSupplier.name);
  }, [selectedSupplier, purchaseBills]);

  // Processed suppliers for Directory list
  const processedSuppliers = useMemo(() => {
    return suppliers
      .map((s) => {
        const stats = getSupplierStats(s.id, s.name);
        return {
          ...s,
          totalPurchased: stats.totalPurchased,
          totalPaid: stats.totalPaid,
          totalDue: stats.totalDue,
          billCount: stats.billCount,
          totalReams: stats.totalReams,
        };
      })
      .filter((s) => {
        const q = search.toLowerCase().trim();
        const matchesSearch =
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.company.toLowerCase().includes(q) ||
          s.address.toLowerCase().includes(q) ||
          s.phone.toLowerCase().includes(q) ||
          s.paperSpecialties.some((spec) => spec.toLowerCase().includes(q));

        if (!matchesSearch) return false;

        if (filterPayableStatus === 'due') return s.totalDue > 0;
        if (filterPayableStatus === 'clear') return s.totalDue <= 0;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'due_desc') return b.totalDue - a.totalDue;
        if (sortBy === 'purchases_desc') return b.totalPurchased - a.totalPurchased;
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        return a.name.localeCompare(b.name);
      });
  }, [suppliers, purchaseBills, search, filterPayableStatus, sortBy]);

  // Avatar color generator
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-emerald-600 text-white',
      'bg-indigo-600 text-white',
      'bg-amber-600 text-white',
      'bg-rose-600 text-white',
      'bg-purple-600 text-white',
      'bg-blue-600 text-white',
      'bg-teal-600 text-white',
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  // Chronological ledger for selected supplier
  const vendorLedger = useMemo(() => {
    if (!selectedSupplier || !selectedStats) return [];

    type LedgerRow = {
      date: string;
      ref: string;
      particulars: string;
      debit: number; // Purchase Bill
      credit: number; // Payment Made
      balance: number; // Running Payable
    };

    const rawRows: {
      date: string;
      ref: string;
      particulars: string;
      debit: number;
      credit: number;
    }[] = [];

    selectedStats.bills.forEach((b) => {
      rawRows.push({
        date: b.purchaseDate,
        ref: b.id,
        particulars: `Purchase: ${b.paperType} (${b.reams} Reams @ ${b.ratePerReam})`,
        debit: b.totalAmount,
        credit: 0,
      });

      if (b.paidAmount > 0) {
        rawRows.push({
          date: b.purchaseDate,
          ref: `PAY-${b.id}`,
          particulars: `Payment Made (${b.paymentMethod}) for ${b.id}`,
          debit: 0,
          credit: b.paidAmount,
        });
      }
    });

    rawRows.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let running = 0;
    const finalRows: LedgerRow[] = rawRows.map((r) => {
      running += r.debit - r.credit;
      return {
        ...r,
        balance: running,
      };
    });

    return finalRows;
  }, [selectedSupplier, selectedStats]);

  // Handle Adding New Supplier
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddSupplier({
      name: name.trim(),
      company: company.trim() || name.trim(),
      contactPerson: contactPerson.trim() || undefined,
      phone: phone.trim() || '+880 1700-000000',
      email: email.trim() || 'vendor@example.com',
      address: address.trim() || 'Arambagh, Dhaka',
      bin: bin.trim() || undefined,
      paperSpecialties: specialties
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      balance: openingBalance || 0,
      rating: 4.8,
    });

    setIsAddModalOpen(false);
    setName('');
    setCompany('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setAddress('');
    setBin('');
    setOpeningBalance(0);
  };

  // Handle recording payment for a purchase bill
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalBill || paymentAmount <= 0) return;

    onRecordPayment(paymentModalBill.id, paymentAmount);
    setPaymentModalBill(null);
    setPaymentAmount(0);
  };

  // Handle creating purchase bill for selected supplier
  const handleCreateBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || !onCreatePurchaseBill) return;

    const total = Math.round(billReams * billRate);
    const paid = Math.min(total, billPaidNow);
    const paymentStatus = paid >= total ? 'paid' : paid > 0 ? 'partial' : 'due';

    onCreatePurchaseBill({
      supplierId: selectedSupplier.id,
      supplierName: selectedSupplier.name,
      paperType: billPaperType,
      gsm: billGsm,
      fullSheetSize: billSheetSize,
      reams: billReams,
      sheets: Math.round(billReams * 500),
      ratePerReam: billRate,
      totalAmount: total,
      paidAmount: paid,
      paymentStatus: paymentStatus,
      paymentMethod: billPaymentMethod,
      procurementType: 'godown_stock',
      purchaseDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      notes: billNotes,
    });

    setIsNewBillModalOpen(false);
    setBillReams(2.0);
    setBillPaidNow(0);
    setBillNotes('Godown paper supply');
  };

  // -------------------------------------------------------------
  // VIEW 1: SELECTED SUPPLIER HISTORY & DETAIL VIEW
  // -------------------------------------------------------------
  if (selectedSupplier && selectedStats) {
    const firstDueBill = selectedStats.bills.find(
      (b) => b.totalAmount - b.paidAmount > 0
    );

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Sticky Back Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setSelectedSupplierId(null)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#881337] dark:hover:text-rose-400 transition-colors w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>← Back to All Suppliers (সকল সাপ্লায়ার তালিকায় ফিরুন)</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              Vendor ID: {selectedSupplier.id}
            </span>
          </div>
        </div>

        {/* Supplier Profile Hero Banner */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left: Avatar & Details */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-bold text-xl shadow-md ${getAvatarColor(
                  selectedSupplier.name
                )}`}
              >
                {selectedSupplier.name.slice(0, 2).toUpperCase()}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                    {selectedSupplier.name}
                  </h2>
                  {selectedSupplier.rating && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 text-xs font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                      <span>{selectedSupplier.rating}</span>
                    </span>
                  )}
                  {selectedStats.totalDue > 0 ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 px-2.5 py-0.5 text-xs font-bold text-rose-800 dark:text-rose-300">
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>দেনা বাকি: {fmt(selectedStats.totalDue)}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 px-2.5 py-0.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>পরিশোধিত (No Payable Due)</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  <span>{selectedSupplier.company || selectedSupplier.name}</span>
                  {selectedSupplier.contactPerson && (
                    <span className="text-slate-400 text-xs">
                      • Contact: {selectedSupplier.contactPerson}
                    </span>
                  )}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-slate-400" />
                    <a
                      href={`tel:${selectedSupplier.phone}`}
                      className="hover:underline font-mono text-slate-700 dark:text-slate-300 font-semibold"
                    >
                      {selectedSupplier.phone}
                    </a>
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-slate-400" />
                    <span>{selectedSupplier.email}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span>{selectedSupplier.address}</span>
                  </span>
                  {selectedSupplier.bin && (
                    <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                      BIN: {selectedSupplier.bin}
                    </span>
                  )}
                </div>

                {/* Specialties Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1.5">
                  {selectedSupplier.paperSpecialties.map((spec, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium px-2 py-0.5"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Quick Vendor Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsNewBillModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#881337] hover:bg-[#700f2e] text-white px-4 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>New Purchase Bill (কাগজ ক্রয়)</span>
              </button>

              {firstDueBill && (
                <button
                  onClick={() => {
                    setPaymentModalBill(firstDueBill);
                    setPaymentAmount(firstDueBill.totalAmount - firstDueBill.paidAmount);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-xs"
                >
                  <Banknote className="h-4 w-4" />
                  <span>Pay Bill (টাকা পরিশোধ)</span>
                </button>
              )}

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all shadow-2xs"
              >
                <Printer className="h-4 w-4 text-slate-400" />
                <span>Print Ledger (খতিয়ান)</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Financial Performance Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Total Purchased (মোট ক্রয়)
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                <FileSpreadsheet className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
              {fmt(selectedStats.totalPurchased)}
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Across {selectedStats.billCount} purchase bills
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Total Paid to Vendor (পরিশোধ)
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Banknote className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">
              {fmt(selectedStats.totalPaid)}
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Cash, cheque, and bank transfers
            </p>
          </div>

          <div className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
                Outstanding Payable (দেনা/বকেয়া)
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                <AlertCircle className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black font-mono text-rose-700 dark:text-rose-400">
              {fmt(selectedStats.totalDue)}
            </p>
            <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400">
              {selectedStats.totalDue > 0 ? 'Pending payment settlement' : 'Account is fully cleared'}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Total Paper Supplied
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <Layers className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-xl sm:text-2xl font-black font-mono text-indigo-700 dark:text-indigo-300">
              {selectedStats.totalReams.toFixed(1)} Reams
            </p>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              ~{Math.round(selectedStats.totalReams * 500).toLocaleString()} full sheets
            </p>
          </div>
        </div>

        {/* History Navigation Tabs */}
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-xs overflow-hidden">
          {/* Tabs Bar */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 pt-3 overflow-x-auto bg-slate-50/70 dark:bg-slate-900/60">
            <button
              onClick={() => setActiveHistoryTab('bills')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeHistoryTab === 'bills'
                  ? 'border-[#881337] text-[#881337] dark:text-rose-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span>Purchase Bills (ক্রয় ভাউচার)</span>
              <span className="rounded-full bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold">
                {selectedStats.bills.length}
              </span>
            </button>

            <button
              onClick={() => setActiveHistoryTab('payments')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeHistoryTab === 'payments'
                  ? 'border-[#881337] text-[#881337] dark:text-rose-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Banknote className="h-4 w-4" />
              <span>Payments Paid (পরিশোধের বিবরণ)</span>
            </button>

            <button
              onClick={() => setActiveHistoryTab('materials')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeHistoryTab === 'materials'
                  ? 'border-[#881337] text-[#881337] dark:text-rose-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Paper & Raw Materials (কাগজ সরবরাহ)</span>
            </button>

            <button
              onClick={() => setActiveHistoryTab('ledger')}
              className={`pb-3 px-3 text-xs sm:text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeHistoryTab === 'ledger'
                  ? 'border-[#881337] text-[#881337] dark:text-rose-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Vendor Ledger (মহাজনি খতিয়ান)</span>
            </button>
          </div>

          {/* Tab 1: Purchase Bills */}
          {activeHistoryTab === 'bills' && (
            <div className="p-4 sm:p-6">
              {selectedStats.bills.length === 0 ? (
                <div className="py-12 text-center">
                  <FileSpreadsheet className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto" />
                  <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                    No Purchase Bills Recorded Yet
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Create purchase bills when buying paper reams or CTP plates from this vendor.
                  </p>
                  <button
                    onClick={() => setIsNewBillModalOpen(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#881337] text-white px-4 py-2 text-xs font-bold shadow-xs hover:bg-[#700f2e]"
                  >
                    Add Purchase Bill
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                        <th className="pb-3 pr-4">Bill ID</th>
                        <th className="pb-3 px-4">Date</th>
                        <th className="pb-3 px-4">Paper Specs</th>
                        <th className="pb-3 px-4 text-right">Reams / Qty</th>
                        <th className="pb-3 px-4 text-right">Rate / Ream</th>
                        <th className="pb-3 px-4 text-right">Total Bill</th>
                        <th className="pb-3 px-4 text-right">Paid Amount</th>
                        <th className="pb-3 px-4 text-right">Payable Due</th>
                        <th className="pb-3 px-4 text-center">Status</th>
                        <th className="pb-3 pl-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {selectedStats.bills.map((b) => {
                        const due = Math.max(0, b.totalAmount - b.paidAmount);
                        return (
                          <tr key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-3.5 pr-4 font-mono font-bold text-slate-900 dark:text-white">
                              {b.id}
                              {b.linkedJobId && (
                                <span className="block text-[10px] font-normal text-slate-500 dark:text-slate-400">
                                  For {b.linkedJobId}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                              {b.purchaseDate}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-200 max-w-[220px]">
                              <span>{b.paperType}</span>
                              <span className="block text-[10px] text-slate-500">
                                {b.gsm} GSM • {b.fullSheetSize}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                              {b.reams} Reams
                              <span className="block text-[10px] text-slate-400">
                                ({b.sheets} sheets)
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                              {fmt(b.ratePerReam)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                              {fmt(b.totalAmount)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                              {fmt(b.paidAmount)}
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono font-bold">
                              {due > 0 ? (
                                <span className="text-rose-700 dark:text-rose-400">{fmt(due)}</span>
                              ) : (
                                <span className="text-slate-400">৳ 0</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  b.paymentStatus === 'paid'
                                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                    : b.paymentStatus === 'partial'
                                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                                }`}
                              >
                                {b.paymentStatus}
                              </span>
                            </td>
                            <td className="py-3.5 pl-4 text-right">
                              {due > 0 ? (
                                <button
                                  onClick={() => {
                                    setPaymentModalBill(b);
                                    setPaymentAmount(due);
                                  }}
                                  className="rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 text-[11px] font-bold shadow-2xs transition-all"
                                >
                                  Pay Bill
                                </button>
                              ) : (
                                <span className="text-[11px] text-emerald-600 font-semibold">Cleared</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Payments Made */}
          {activeHistoryTab === 'payments' && (
            <div className="p-4 sm:p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                      <th className="pb-3 pr-4">Bill Ref</th>
                      <th className="pb-3 px-4">Payment Date</th>
                      <th className="pb-3 px-4">Paper Supplied</th>
                      <th className="pb-3 px-4">Payment Mode</th>
                      <th className="pb-3 px-4 text-right">Bill Total</th>
                      <th className="pb-3 px-4 text-right">Amount Paid</th>
                      <th className="pb-3 pl-4 text-right">Remaining Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {selectedStats.bills
                      .filter((b) => b.paidAmount > 0)
                      .map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 pr-4 font-mono font-bold text-slate-900 dark:text-white">
                            {b.id}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                            {b.purchaseDate}
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-200">
                            {b.paperType} ({b.reams} Reams)
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                              {b.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                            {fmt(b.totalAmount)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                            {fmt(b.paidAmount)}
                          </td>
                          <td className="py-3.5 pl-4 text-right font-mono text-slate-600 dark:text-slate-400">
                            {fmt(Math.max(0, b.totalAmount - b.paidAmount))}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Materials & Paper Types */}
          {activeHistoryTab === 'materials' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4">
                  <span className="text-[11px] text-slate-500 uppercase font-bold">Total Reams Sourced</span>
                  <p className="mt-1 text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {selectedStats.totalReams} Reams
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4">
                  <span className="text-[11px] text-slate-500 uppercase font-bold">Total Sheets Delivered</span>
                  <p className="mt-1 text-2xl font-black font-mono text-slate-900 dark:text-white">
                    {Math.round(selectedStats.totalReams * 500).toLocaleString()} Sheets
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4">
                  <span className="text-[11px] text-slate-500 uppercase font-bold">Declared Specialties</span>
                  <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                    {selectedSupplier.paperSpecialties.length} Categories
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-4 py-3 bg-slate-100 dark:bg-slate-800/80 font-bold text-xs text-slate-800 dark:text-slate-200">
                  Paper Materials Catalog from {selectedSupplier.name}
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                  {selectedSupplier.paperSpecialties.map((spec, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2"
                    >
                      <Package className="h-4 w-4 text-[#881337]" />
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Vendor Ledger */}
          {activeHistoryTab === 'ledger' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Vendor Ledger Statement (মহাজনি খতিয়ান)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Running account balance of bills debited and payments credited.
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-2xs"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-400" />
                  <span>Print Vendor Statement</span>
                </button>
              </div>

              {vendorLedger.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  No ledger entries recorded for this vendor yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider font-sans">
                        <th className="pb-3 pr-4">Date</th>
                        <th className="pb-3 px-4">Ref No.</th>
                        <th className="pb-3 px-4 font-sans">Particulars (বিবরণ)</th>
                        <th className="pb-3 px-4 text-right">Bill Debit (ক্রয়)</th>
                        <th className="pb-3 px-4 text-right">Credit (পরিশোধ)</th>
                        <th className="pb-3 pl-4 text-right">Balance Payable (দেনা)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {vendorLedger.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">{row.date}</td>
                          <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">{row.ref}</td>
                          <td className="py-3 px-4 font-sans text-slate-800 dark:text-slate-300 max-w-[280px] truncate">
                            {row.particulars}
                          </td>
                          <td className="py-3 px-4 text-right text-rose-700 dark:text-rose-400 font-bold">
                            {row.debit > 0 ? fmt(row.debit) : '—'}
                          </td>
                          <td className="py-3 px-4 text-right text-emerald-700 dark:text-emerald-400 font-bold">
                            {row.credit > 0 ? fmt(row.credit) : '—'}
                          </td>
                          <td className="py-3 pl-4 text-right font-black text-slate-900 dark:text-white">
                            {fmt(row.balance)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal: New Purchase Bill for Selected Vendor */}
        {isNewBillModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#111827] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-rose-50/50 dark:bg-rose-950/20 px-6 py-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    New Purchase Bill (কাগজ ক্রয় ভাউচার)
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Vendor: {selectedSupplier.name}
                  </p>
                </div>
                <button
                  onClick={() => setIsNewBillModalOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateBillSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Paper Type (কাগজের ধরন)
                    </label>
                    <select
                      value={billPaperType}
                      onChange={(e) => setBillPaperType(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
                    >
                      <option value="Art Paper (আর্ট পেপার)">Art Paper (আর্ট পেপার)</option>
                      <option value="Art Card (আর্ট কার্ড)">Art Card (আর্ট কার্ড)</option>
                      <option value="Offset Paper (অফসেট পেপার)">Offset Paper (অফসেট পেপার)</option>
                      <option value="Duplex Board (ডুপ্লেক্স বোর্ড)">Duplex Board (ডুপ্লেক্স বোর্ড)</option>
                      <option value="Swedish Board (সুইডিশ বোর্ড)">Swedish Board (সুইডিশ বোর্ড)</option>
                      <option value="Thermal CTP Plates">Thermal CTP Plates</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      GSM Weight
                    </label>
                    <input
                      type="number"
                      value={billGsm}
                      onChange={(e) => setBillGsm(parseInt(e.target.value) || 150)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Sheet Size (মাপ)
                    </label>
                    <input
                      type="text"
                      value={billSheetSize}
                      onChange={(e) => setBillSheetSize(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Reams (রিম সংখ্যা)
                    </label>
                    <input
                      type="number"
                      step={0.5}
                      min={0.5}
                      value={billReams}
                      onChange={(e) => setBillReams(parseFloat(e.target.value) || 1)}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Rate per Ream (দর)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-xs">
                        ৳
                      </span>
                      <input
                        type="number"
                        value={billRate}
                        onChange={(e) => setBillRate(parseInt(e.target.value) || 3000)}
                        className="w-full h-10 pl-6 pr-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Total Bill Amount
                    </label>
                    <div className="w-full h-10 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center font-mono font-bold text-sm text-slate-900 dark:text-white">
                      ৳ {Math.round(billReams * billRate).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Payment Mode
                    </label>
                    <select
                      value={billPaymentMethod}
                      onChange={(e) => setBillPaymentMethod(e.target.value as 'Credit (30 Days)' | 'Cash' | 'bKash / Nagad' | 'Bank Cheque')}
                      className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
                    >
                      <option value="Credit (30 Days)">Credit (30 Days)</option>
                      <option value="Cash">Cash (নগদ)</option>
                      <option value="bKash / Nagad">bKash / Nagad</option>
                      <option value="Bank Cheque">Bank Cheque (চেক)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Paid Now (এখন পরিশোধ)
                    </label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-xs">
                        ৳
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={Math.round(billReams * billRate)}
                        value={billPaidNow}
                        onChange={(e) => setBillPaidNow(parseInt(e.target.value) || 0)}
                        className="w-full h-10 pl-6 pr-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Remarks / Godown Note
                  </label>
                  <input
                    type="text"
                    value={billNotes}
                    onChange={(e) => setBillNotes(e.target.value)}
                    placeholder="e.g. Received at Arambagh Godown"
                    className="w-full h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsNewBillModalOpen(false)}
                    className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#881337] hover:bg-[#700f2e] text-white px-5 py-2 text-xs font-bold shadow-xs"
                  >
                    Create Purchase Bill
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Pay Due Purchase Bill */}
        {paymentModalBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-[#111827] shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Pay Supplier Bill
                  </h3>
                  <p className="text-xs text-slate-500">{paymentModalBill.id}</p>
                </div>
                <button
                  onClick={() => setPaymentModalBill(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900 p-3 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Bill:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">
                      ৳ {paymentModalBill.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Previously Paid:</span>
                    <span className="font-mono font-bold text-emerald-600">
                      ৳ {paymentModalBill.paidAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-1 font-bold">
                    <span className="text-rose-700 dark:text-rose-400">Current Due:</span>
                    <span className="font-mono text-rose-700 dark:text-rose-400">
                      ৳ {(paymentModalBill.totalAmount - paymentModalBill.paidAmount).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Payment Amount (টাকা)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400">
                      ৳
                    </span>
                    <input
                      type="number"
                      required
                      min={1}
                      max={paymentModalBill.totalAmount - paymentModalBill.paidAmount}
                      value={paymentAmount || ''}
                      onChange={(e) => setPaymentAmount(parseInt(e.target.value) || 0)}
                      className="w-full h-10 pl-7 pr-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPaymentModalBill(null)}
                    className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2 text-xs font-bold shadow-xs"
                  >
                    Confirm Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: SUPPLIERS DIRECTORY & KPI OVERVIEW (DEFAULT VIEW)
  // -------------------------------------------------------------
  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 sm:p-6 lg:px-7 shadow-xs">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl bg-[#881337] text-white shadow-sm shadow-rose-950/20">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Paper Suppliers & Mills (কাগজের মহাজন ও মিল)
              </h1>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs px-2.5 py-0.5">
                {suppliers.length} Vendors
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
              Commercial paper agencies, board distributors, CTP plate vendors, and mill accounts.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#881337] hover:bg-[#700f2e] text-white px-5 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-xs hover:shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Add Supplier (নতুন সাপ্লায়ার)</span>
          </button>

          <button
            onClick={onGoToEstimator}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Open Smart Estimator</span>
          </button>
        </div>
      </div>

      {/* 4 Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Vendors (মহাজন সংখ্যা)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black font-mono text-slate-900 dark:text-white">
            {suppliers.length}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Active paper mills & agencies
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Purchases (মোট ক্রয়)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <FileSpreadsheet className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black font-mono text-slate-900 dark:text-white">
            {fmt(totalAllPurchases)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Across {purchaseBills.length} purchase bills
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Paid Out (মোট পরিশোধ)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Banknote className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">
            {fmt(totalAllPaid)}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Cleared vendor payments
          </p>
        </div>

        <div className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 dark:text-rose-300">
              Outstanding Payable (মোট দেনা)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black font-mono text-rose-700 dark:text-rose-400">
            {fmt(totalAllPayableDue)}
          </p>
          <p className="mt-1 text-[11px] text-rose-600 dark:text-rose-400">
            Payable to paper agencies
          </p>
        </div>
      </div>

      {/* Search, Filter & Sorting Bar */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-4 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search suppliers by name, mill, phone, area..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#881337] shadow-2xs"
          />
        </div>

        {/* Filter Tabs & Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Pills */}
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => setFilterPayableStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterPayableStatus === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All ({suppliers.length})
            </button>
            <button
              onClick={() => setFilterPayableStatus('due')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterPayableStatus === 'due'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
              }`}
            >
              Has Due (দেনা আছে)
            </button>
            <button
              onClick={() => setFilterPayableStatus('clear')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterPayableStatus === 'clear'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
              }`}
            >
              Settled (পরিশোধিত)
            </button>
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'due_desc' | 'purchases_desc' | 'rating' | 'name')}
            aria-label="Sort suppliers by"
            className="h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#881337]"
          >
            <option value="due_desc">Sort: Highest Payable Due</option>
            <option value="purchases_desc">Sort: Highest Purchases</option>
            <option value="rating">Sort: Highest Rating</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Suppliers Cards Grid */}
      {processedSuppliers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-12 text-center space-y-3 shadow-xs">
          <Building2 className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No Suppliers Match Your Search
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or register a new paper vendor.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#881337] text-white px-4 py-2 text-xs font-bold shadow-xs hover:bg-[#700f2e]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Supplier</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {processedSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="group rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-5 shadow-xs hover:border-[#881337]/50 dark:hover:border-rose-500/50 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Bar: Avatar & Rating/Due Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold text-sm shadow-sm ${getAvatarColor(
                        supplier.name
                      )}`}
                    >
                      {supplier.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4
                        onClick={() => setSelectedSupplierId(supplier.id)}
                        className="font-bold text-slate-900 dark:text-white text-sm hover:text-[#881337] dark:hover:text-rose-400 cursor-pointer transition-colors line-clamp-1"
                        title="Click to view supplier history"
                      >
                        {supplier.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {supplier.company}
                      </p>
                    </div>
                  </div>

                  {supplier.totalDue > 0 ? (
                    <span className="shrink-0 rounded-md bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 px-2 py-0.5 text-[10px] font-bold">
                      দেনা: {fmt(supplier.totalDue)}
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-md bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                      পরিশোধিত
                    </span>
                  )}
                </div>

                {/* Specialties Badges */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {supplier.paperSpecialties.slice(0, 3).map((spec, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium px-2 py-0.5"
                    >
                      {spec}
                    </span>
                  ))}
                  {supplier.paperSpecialties.length > 3 && (
                    <span className="text-[10px] text-slate-400 self-center">
                      +{supplier.paperSpecialties.length - 3} more
                    </span>
                  )}
                </div>

                {/* Contact Info */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <a
                      href={`tel:${supplier.phone}`}
                      className="hover:underline font-mono text-slate-800 dark:text-slate-200 font-semibold"
                    >
                      {supplier.phone}
                    </a>
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{supplier.address}</span>
                  </p>
                </div>

                {/* Financial Metrics Strip */}
                <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2.5 text-center font-mono border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[9px] font-sans text-slate-400 uppercase font-bold block">
                      Purchased
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {fmt(supplier.totalPurchased)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-sans text-emerald-600 dark:text-emerald-400 uppercase font-bold block">
                      Paid
                    </span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      {fmt(supplier.totalPaid)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] font-sans text-rose-600 dark:text-rose-400 uppercase font-bold block">
                      Payable
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        supplier.totalDue > 0 ? 'text-rose-700 dark:text-rose-400' : 'text-slate-400'
                      }`}
                    >
                      {fmt(supplier.totalDue)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedSupplierId(supplier.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-[#881337] dark:hover:bg-rose-900 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-2xs flex-1 justify-center"
                >
                  <span>View History (হিস্ট্রি)</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => {
                    setSelectedSupplierId(supplier.id);
                    setIsNewBillModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Create Paper Purchase Bill"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Supplier Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-[#111827] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-rose-50/50 dark:bg-rose-950/20 px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Add Paper Supplier (নতুন মহাজন / মিল)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Register paper agency or material distributor in PrintOS
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-3.5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Vendor / Agency Name <span className="text-rose-600">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bengal Paper Mart"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Mill / Company
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Karnaphuli Paper Syndicate"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Kabir Ahmed"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Phone / Mobile
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1711..."
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="orders@paperagency.com"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    BIN / VAT No.
                  </label>
                  <input
                    type="text"
                    value={bin}
                    onChange={(e) => setBin(e.target.value)}
                    placeholder="000294819-0102"
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Market Address (বাজার ঠিকানা)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="42 Arambagh Press Commercial Area, Dhaka"
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Paper Specialties (comma separated)
                </label>
                <input
                  type="text"
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                  placeholder="Art Paper 150 GSM, Swedish Board 300 GSM, Offset"
                  className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Opening Payable Due (পূর্বের দেনা)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono font-bold text-slate-400 text-xs">
                    ৳
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={openingBalance || ''}
                    onChange={(e) => setOpeningBalance(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full h-10 pl-7 pr-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#881337] hover:bg-[#700f2e] text-white px-5 py-2 text-xs font-bold shadow-xs"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
