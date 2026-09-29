'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Printer,
  Building2,
  Phone,
  MapPin,
  Wrench,
  Percent,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  PartyPopper,
  Coins,
  ShieldCheck,
  Check,
  FileText,
  Truck,
  Users,
  Package,
  BarChart3,
  Calculator,
  DollarSign,
  ClipboardList,
  Layers,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PressProfile } from '@/types/auth';
import confetti from 'canvas-confetti';

const AVAILABLE_EQUIPMENT = [
  { id: 'heidelberg_4c', label: 'Heidelberg Speedmaster 74 (4-Color Offset Press)', category: 'Offset Machine', icon: '🖨️' },
  { id: 'heidelberg_2c', label: 'Heidelberg GTO / SORM (1 or 2-Color Offset)', category: 'Offset Machine', icon: '📄' },
  { id: 'polar_cutter', label: 'Polar 115 High-Speed Programmable Paper Cutter', category: 'Cutting', icon: '✂️' },
  { id: 'thermal_ctp', label: 'Thermal CTP Plate Setter (Kodak / Screen Trendsetter)', category: 'Pre-Press', icon: '🎯' },
  { id: 'lamination_uv', label: 'Automatic Thermal Film Lamination & UV Varnish', category: 'Finishing', icon: '✨' },
  { id: 'die_cutting', label: 'Automatic Die-Punching & Carton Creasing Machine', category: 'Packaging', icon: '📦' },
  { id: 'book_binding', label: 'Automatic Perfect Binding & Saddle Stitching Machine', category: 'Binding', icon: '📚' },
  { id: 'digital_press', label: 'Digital High-Speed Color Production Press (Konica / Xerox)', category: 'Digital', icon: '🖥️' },
];

const AVAILABLE_SHEET_SIZES = [
  { size: '20" x 30"', label: 'Double Crown (ডাবল ক্রাউন)', popular: true },
  { size: '23" x 36"', label: 'Royal Size (রয়্যাল সাইজ)', popular: true },
  { size: '25" x 37"', label: 'Commercial Poster (পোস্টার সাইজ)', popular: true },
  { size: '28" x 40"', label: 'Super Royal (সুপার রয়্যাল)', popular: false },
  { size: '18" x 24"', label: 'Demi Size (ডেমি সাইজ)', popular: false },
];

// Feature modules shown in Step 4
const FEATURES = [
  {
    icon: ClipboardList,
    color: 'bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400',
    title: 'জব কার্ড (Job Card)',
    titleEn: 'Production Job Card',
    desc: 'প্রতিটি প্রিন্টিং অর্ডারের বিস্তারিত — কাজের নাম, কাগজ, রঙ, পরিমাণ, ডেডলাইন এবং স্ট্যাটাস এক জায়গায় ট্র্যাক করুন।',
  },
  {
    icon: FileText,
    color: 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400',
    title: 'বিক্রয় ইনভয়েস (Sales Invoice)',
    titleEn: 'Sales & Billing',
    desc: 'পেশাদার ইনভয়েস তৈরি করুন, অগ্রিম ও বাকি পেমেন্ট ট্র্যাক করুন এবং ক্লায়েন্টকে সরাসরি পাঠান।',
  },
  {
    icon: Truck,
    color: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
    title: 'ডেলিভারি চালান',
    titleEn: 'Delivery Chalan',
    desc: 'মাল পাঠানোর সময় গেট পাস সহ চালান তৈরি করুন। আংশিক ও পূর্ণ ডেলিভারি ট্র্যাক করুন।',
  },
  {
    icon: Users,
    color: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400',
    title: 'ক্লায়েন্ট ম্যানেজমেন্ট',
    titleEn: 'Client Ledger',
    desc: 'প্রতিটি ক্লায়েন্টের পূর্ণ ইতিহাস — মোট বিল, পেমেন্ট, বাকি, এবং সব ইনভয়েস একসাথে দেখুন।',
  },
  {
    icon: Package,
    color: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
    title: 'সাপ্লায়ার ও কাগজ ক্রয় (ঐচ্ছিক ইনভেন্টরি)',
    titleEn: 'Suppliers & Purchases (Optional Stock)',
    desc: 'কাজের জন্য সরাসরি কাগজ ক্রয়ের হিসাব ও সাপ্লায়ার লেজার। ছোট প্রেসের জন্য গুদাম স্টক রাখা ঐচ্ছিক।',
  },
  {
    icon: DollarSign,
    color: 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
    title: 'ক্যাশ বই ও খরচ',
    titleEn: 'Cash Book & Expenses',
    desc: 'দৈনিক নগদ আয়-ব্যয়, ফ্যাক্টরি খরচ এবং ক্যাশ ব্যালেন্স রিয়েল-টাইমে দেখুন।',
  },
  {
    icon: Users,
    color: 'bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400',
    title: 'বেতন ও শ্রমিক',
    titleEn: 'Payroll Management',
    desc: 'কর্মী তালিকা, মাসিক বেতন, অতিরিক্ত কাজের ভাতা, এবং বেতন স্লিপ তৈরি করুন।',
  },
  {
    icon: Calculator,
    color: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400',
    title: 'প্রিন্ট এস্টিমেটর',
    titleEn: 'Print Cost Estimator',
    desc: 'কাগজ, প্লেট, ছাপাই, লেমিনেশন হিসেব করে অটোমেটিক কোটেশন তৈরি করুন।',
  },
  {
    icon: BarChart3,
    color: 'bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400',
    title: 'লাভ-লোকসান রিপোর্ট',
    titleEn: 'Profit & Loss Report',
    desc: 'মাসিক বিক্রয়, সরাসরি খরচ, এবং পকেটে নেট মুনাফা — ৩ ধাপের সহজ হিসাবে।',
  },
];

type Step = 1 | 2 | 3 | 4 | 5;

export const OnboardingWizard: React.FC = () => {
  const { user, completeOnboarding } = useAuth();

  const [step, setStep] = useState<Step>(1);

  const [pressName, setPressName] = useState('');
  const [ownerName, setOwnerName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [tagline, setTagline] = useState('');
  const [tradeLicense, setTradeLicense] = useState('');

  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedPaperSizes, setSelectedPaperSizes] = useState<string[]>([]);

  const [defaultPlateCost, setDefaultPlateCost] = useState<number>(250);
  const [defaultImpressionRate, setDefaultImpressionRate] = useState<number>(120);
  const [defaultAdvancePercent, setDefaultAdvancePercent] = useState<number>(30);

  useEffect(() => {
    if (step === 5) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#1D5DFF', '#23A8FF', '#FF008C', '#FFD400', '#00C8FF', '#10B981'],
        });
      } catch { /* graceful fallback */ }
    }
  }, [step]);

  const toggleEquipment = (label: string) => {
    setSelectedEquipment((prev) =>
      prev.includes(label) ? prev.filter((e) => e !== label) : [...prev, label]
    );
  };

  const togglePaperSize = (size: string) => {
    setSelectedPaperSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleFinish = async () => {
    const finalProfile: PressProfile = {
      pressName: pressName.trim() || 'আমার প্রেস',
      ownerName: ownerName.trim() || 'মালিক',
      phone: phone.trim(),
      email: user?.email || '',
      address: address.trim() || 'ঢাকা, বাংলাদেশ',
      tagline: tagline.trim(),
      tradeLicenseNo: tradeLicense.trim(),
      currency: 'BDT',
      currencySymbol: '৳',
      defaultPlateCost: Number(defaultPlateCost) || 250,
      defaultImpressionRate: Number(defaultImpressionRate) || 120,
      defaultAdvancePercent: Number(defaultAdvancePercent) || 30,
      equipment: selectedEquipment,
      preferredPaperSizes: selectedPaperSizes,
      onboardingCompleted: true,
      createdAt: new Date().toISOString(),
    };
    await completeOnboarding(finalProfile);
  };

  const STEPS = [
    { num: 1, label: '১. প্রেস পরিচিতি' },
    { num: 2, label: '২. মেশিন ও সাইজ' },
    { num: 3, label: '৩. কাজের রেট' },
    { num: 4, label: '৪. ফিচার সমূহ' },
    { num: 5, label: '৫. সমাপ্তি 🎉' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-3xl rounded-3xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] shadow-2xl overflow-hidden my-4 sm:my-6">

        {/* Wizard Header - Primary Brand Gradient */}
        <div style={{ background: 'linear-gradient(135deg, #23A8FF 0%, #1D5DFF 50%, #071A3D 100%)' }} className="p-5 sm:p-7 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 border border-white/30 backdrop-blur-sm p-1.5">
              <Image
                src="/logo-icon.png"
                alt="PrintOS"
                width={36}
                height={36}
                priority
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                PrintOS সেটআপ উইজার্ড
                <span className="text-[10px] uppercase bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">
                  Step {step} of 5
                </span>
              </h2>
              <p className="text-[11px] text-slate-300 mt-0.5">
                আপনার প্রেসের প্রোফাইল, মেশিন ও রেট কনফিগার করুন
              </p>
            </div>
          </div>

          {/* Progress bar stepper */}
          <div className="grid grid-cols-5 gap-1.5">
            {STEPS.map((s) => (
              <div key={s.num} className="space-y-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    s.num < step
                      ? 'bg-emerald-400'
                      : s.num === step
                      ? 'bg-rose-400'
                      : 'bg-white/20'
                  }`}
                />
                <p className="text-[9px] sm:text-[10px] font-bold truncate text-slate-300">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Body */}
        <div className="p-5 sm:p-8">

          {/* ─── STEP 1: Press Identity ─── */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  প্রেস ও কারখানার পরিচিতি
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    প্রেস বা প্রতিষ্ঠানের নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={pressName}
                    onChange={(e) => setPressName(e.target.value)}
                    placeholder="পদ্মা অফসেট প্রেস"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-rose-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মালিকের নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="মোহাম্মদ রফিক হোসেন"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-rose-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মোবাইল নম্বর <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+880 1711-234567"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ট্রেড লাইসেন্স নম্বর (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={tradeLicense}
                    onChange={(e) => setTradeLicense(e.target.value)}
                    placeholder="TRAD/DSCC/012938/2024"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-rose-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  কারখানা ও অফিসের ঠিকানা <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="আরামবাগ প্রেস মার্কেট, মতিঝিল, ঢাকা-১০০০"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white focus:border-rose-600 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  চালান ও ইনভয়েসের হেডারে এই ঠিকানা স্বয়ংক্রিয়ভাবে প্রিন্ট হবে
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রেসের স্লোগান (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="বাণিজ্যিক ও মানসম্মত কালার প্রিন্টিং সেবা"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-rose-600 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* ─── STEP 2: Machinery & Sheet Sizes ─── */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  মেশিনারি ও কাগজের সাইজ
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                আপনার কারখানায় যেসব মেশিন আছে তা সিলেক্ট করুন (এই তথ্য পরেও আপডেট করা যাবে):
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                {AVAILABLE_EQUIPMENT.map((eq) => {
                  const isChecked = selectedEquipment.includes(eq.label);
                  return (
                    <div
                      key={eq.id}
                      onClick={() => toggleEquipment(eq.label)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isChecked
                          ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-lg">{eq.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{eq.label}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{eq.category}</span>
                      </div>
                      <div className={`h-5 w-5 rounded-md flex items-center justify-center shrink-0 border ${
                        isChecked ? 'bg-rose-600 border-rose-600 text-white' : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {isChecked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  সাধারণ কাগজের সাইজ (Preferred Sheet Sizes):
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SHEET_SIZES.map((sz) => {
                    const isSelected = selectedPaperSizes.includes(sz.size);
                    return (
                      <button
                        key={sz.size}
                        type="button"
                        onClick={() => togglePaperSize(sz.size)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                        <span>{sz.size}</span>
                        <span className="text-[10px] opacity-75 font-normal">({sz.label.split('(')[1]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 3: Default Rates ─── */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 mb-3">
                <Coins className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  ডিফল্ট কোটেশন রেট ও অগ্রিম পলিসি
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                এস্টিমেটরে কোটেশন তৈরির সময় এই রেটগুলো ডিফল্ট হিসেবে বসবে (পরে যেকোনো সময় পরিবর্তন করা যাবে):
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    গড় CTP প্লেট রেট (প্রতি প্লেট)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400 font-mono">৳</span>
                    <input
                      type="number"
                      value={defaultPlateCost}
                      onChange={(e) => setDefaultPlateCost(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">সাধারণত ৳২০০ - ৳৩০০</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    ছাপাই রেট (প্রতি ১০০০ ইম্প্রেশন)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400 font-mono">৳</span>
                    <input
                      type="number"
                      value={defaultImpressionRate}
                      onChange={(e) => setDefaultImpressionRate(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">প্রতি কালার বা ফর্মায়</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    ডিফল্ট অগ্রিম % (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400 font-mono">%</span>
                    <input
                      type="number"
                      value={defaultAdvancePercent}
                      onChange={(e) => setDefaultAdvancePercent(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-3 py-2 text-xs font-mono font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">যেমন: ৩০% বা ৫০%</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-200 text-xs flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
                <span>অগ্রিম নেওয়ার বিষয়টি ঐচ্ছিক। প্রতিটি কাজের সময় আপনি প্রয়োজন অনুযায়ী অগ্রিম নির্ধারণ করতে পারবেন।</span>
              </div>
            </div>
          )}

          {/* ─── STEP 4: Feature Tour ─── */}
          {step === 4 && (
            <div className="animate-in fade-in duration-200">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    PrintOS-এ আপনি যা করতে পারবেন
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    ৯টি মডিউল — একটি ছোট প্রেস চালাতে আপনার যা যা দরকার সব এখানে আছে
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                {FEATURES.map((f, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 flex gap-3"
                  >
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${f.color}`}>
                      <f.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-900 dark:text-white leading-tight">{f.title}</p>
                      <p className="text-[10px] text-slate-400 font-mono mb-1">{f.titleEn}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-rose-50 to-emerald-50 dark:from-rose-950/30 dark:to-emerald-950/30 border border-rose-200/60 dark:border-rose-900/40 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  <strong>আপনার ওয়ার্কস্পেস একদম ফাঁকা শুরু হবে।</strong> প্রতিটি ইনভয়েস, ক্লায়েন্ট, জব কার্ড — সব আপনি নিজে তৈরি করবেন। কোনো ডেমো ডেটা নেই।
                </p>
              </div>
            </div>
          )}

          {/* ─── STEP 5: Celebration & Launch ─── */}
          {step === 5 && (
            <div className="text-center space-y-5 animate-in zoom-in-95 duration-200 py-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-md">
                <PartyPopper className="h-8 w-8 animate-bounce" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  অভিনন্দন! 🎉
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                  <strong>{pressName || 'আপনার প্রেস'}</strong> এখন PrintOS-এর সাথে সম্পূর্ণভাবে যুক্ত ও প্রস্তুত।
                </p>
              </div>

              {/* Summary Card */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/50 p-4 text-left max-w-lg mx-auto space-y-2 text-xs">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">আপনার প্রেস সারসংক্ষেপ</p>
                {[
                  { label: 'প্রতিষ্ঠান', value: pressName || '—' },
                  { label: 'মালিক', value: `${ownerName}${phone ? ` (${phone})` : ''}` },
                  { label: 'মেশিন', value: selectedEquipment.length > 0 ? `${selectedEquipment.length}টি কনফিগার করা` : 'পরে যোগ করুন' },
                  { label: 'প্লেট রেট', value: `৳${defaultPlateCost} / প্লেট` },
                  { label: 'ছাপাই রেট', value: `৳${defaultImpressionRate} / ১০০০` },
                ].map((row, i, arr) => (
                  <div key={i} className={`flex justify-between py-1.5 ${i < arr.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}>
                    <span className="text-slate-500 dark:text-slate-400">{row.label}:</span>
                    <span className="font-bold text-slate-900 dark:text-white text-right max-w-[60%] truncate">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-3 text-xs">
                {[
                  { icon: CheckCircle2, text: 'ক্লিন ওয়ার্কস্পেস', color: 'text-emerald-600' },
                  { icon: ShieldCheck, text: 'ক্লাউড ব্যাকআপ', color: 'text-blue-600' },
                  { icon: Layers, text: '৯টি মডিউল সক্রিয়', color: 'text-violet-600' },
              ].map((badge, i) => (
                  <span key={i} className={`inline-flex items-center gap-1.5 font-bold ${badge.color}`}>
                    <badge.icon className="h-4 w-4" /> {badge.text}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as Step)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>পূর্ববর্তী</span>
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev + 1) as Step)}
                disabled={step === 1 && !pressName.trim()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#1D5DFF] hover:bg-[#154cdb] text-white px-5 py-2.5 text-xs font-bold shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{step === 4 ? 'ড্যাশবোর্ডে যান' : 'পরবর্তী ধাপ'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-xs font-black shadow-lg transition-all"
              >
                <span>প্রেস ড্যাশবোর্ডে প্রবেশ করুন</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
