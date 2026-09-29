'use client';

import React, { useState } from 'react';
import {
  Settings,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Info,
  Sun,
  Moon,
  Building2,
  Compass,
  Save,
  Check,
  Package,
} from 'lucide-react';
import { checkAppwriteHealth, AppwriteHealthResult } from '@/lib/appwrite';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

interface AppSettingsViewProps {
  appwriteStatus: {
    checked: boolean;
    connected: boolean;
    endpoint: string;
    projectId: string;
    databaseId: string;
  };
  onRefreshConnection: () => void;
  isInventoryEnabled?: boolean;
  onToggleInventory?: () => void;
  onNavigateToInventory?: () => void;
}

export const AppSettingsView: React.FC<AppSettingsViewProps> = ({
  appwriteStatus,
  onRefreshConnection,
  isInventoryEnabled = false,
  onToggleInventory,
  onNavigateToInventory,
}) => {
  const { theme, setTheme } = useTheme();
  const { user, updatePressProfile, resetOnboarding } = useAuth();
  const [testing, setTesting] = useState(false);
  const [healthResult, setHealthResult] = useState<AppwriteHealthResult | null>(null);

  const [profileForm, setProfileForm] = useState({
    pressName: user?.pressProfile?.pressName || 'পদ্মা অফসেট প্রেস & প্রিন্টিং',
    ownerName: user?.pressProfile?.ownerName || 'রফিক হোসেন',
    phone: user?.pressProfile?.phone || '+880 1711-234567',
    address: user?.pressProfile?.address || 'আরামবাগ প্রেস মার্কেট, মতিঝিল, ঢাকা-১০০০',
    defaultPlateCost: user?.pressProfile?.defaultPlateCost || 250,
    defaultImpressionRate: user?.pressProfile?.defaultImpressionRate || 120,
    defaultAdvancePercent: user?.pressProfile?.defaultAdvancePercent || 30,
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    await updatePressProfile({
      ...profileForm,
      defaultPlateCost: Number(profileForm.defaultPlateCost),
      defaultImpressionRate: Number(profileForm.defaultImpressionRate),
      defaultAdvancePercent: Number(profileForm.defaultAdvancePercent),
    });
    setProfileSaving(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const runDiagnostics = async () => {
    setTesting(true);
    try {
      const res = await checkAppwriteHealth();
      setHealthResult(res);
      onRefreshConnection();
    } catch {
      setHealthResult(null);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-sm">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                সিস্টেম ও প্রেস সেটিংস (System & Press Settings)
              </h1>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold flex items-center gap-1.5 ${
                appwriteStatus.connected
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800'
                  : 'bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${appwriteStatus.connected ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                {appwriteStatus.connected ? 'Cloud Synced' : 'Offline Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              প্রেস প্রোফাইল, বাণিজ্যিক রেট, গুদাম ইনভেন্টরি ও ডিসপ্লে থিম কনফিগারেশন
            </p>
          </div>
        </div>

        <button
          onClick={runDiagnostics}
          disabled={testing}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1D5DFF] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#154cdb] transition-colors shadow-sm disabled:opacity-50 active:scale-[0.98]"
        >
          <RefreshCw className={`h-4 w-4 ${testing ? 'animate-spin' : ''}`} />
          <span>{testing ? 'যাচাই হচ্ছে...' : 'ক্লাউড সিঙ্ক যাচাই করুন'}</span>
        </button>
      </div>

      {/* Live Diagnostic Banner */}
      {healthResult && (
        <div
          className={`rounded-2xl border p-5 transition-all shadow-xs ${
            healthResult.databaseStatus === 'ready'
              ? 'border-emerald-200 bg-emerald-50/80 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
              : 'border-amber-200 bg-amber-50/80 text-amber-950 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                  healthResult.databaseStatus === 'ready'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {healthResult.databaseStatus === 'ready' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Info className="h-5 w-5" />
                )}
              </div>
              <div className="space-y-1 text-xs">
                <h3 className="font-bold text-sm">
                  {healthResult.databaseStatus === 'ready'
                    ? 'ক্লাউড সিঙ্ক্রোনাইজেশন সম্পূর্ণ সক্রিয় ও সুরক্ষিত'
                    : 'অফলাইন রেজিলিয়েন্স মোড সক্রিয় (Offline Safe)'}
                </h3>
                <p className="leading-relaxed">
                  {healthResult.databaseStatus === 'ready'
                    ? 'প্রেসের যাবতীয় খতিয়ান, ইনভয়েস, চালান এবং জব কার্ড রিয়েল-টাইমে সুরক্ষিত ক্লাউডে সিঙ্ক রয়েছে।'
                    : 'ক্লাউড সার্ভিস সাময়িক বিরতিতে থাকলেও সিস্টেম লোকাল মেমরিতে নিরাপদে কাজ করছে। নেটওয়ার্ক সংযোগ পাওয়ার পর স্বয়ংক্রিয়ভাবে সিঙ্ক হবে।'}
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>TLS 1.3 সুরক্ষিত</span>
            </div>
          </div>
        </div>
      )}

      {/* Theme Appearance Preferences Card */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 shadow-sm transition-colors">
            {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Appearance & Display Theme (ডিসপ্লে থিম)
              </h3>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 dark:text-slate-300 capitalize">
                Current: {theme} Mode
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Toggle between high-contrast day mode and eye-friendly dark mode for late-night factory shifts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setTheme('light')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-2xs ${
              theme === 'light'
                ? 'bg-[#1D5DFF] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Sun className="h-4 w-4" />
            <span>Light Mode (লাইট মোড)</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-2xs ${
              theme === 'dark'
                ? 'bg-[#1D5DFF] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <Moon className="h-4 w-4" />
            <span>Dark Mode (ডার্ক মোড)</span>
          </button>
        </div>
      </div>

      {/* Optional Godown Inventory & Workflow Preferences Card */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 dark:bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/30 shadow-sm transition-colors">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Warehouse / Godown Inventory (গুদাম ইনভেন্টরি ট্র্যাকিং)
              </h3>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                isInventoryEnabled
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400'
                  : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {isInventoryEnabled ? 'Active (সক্রিয়)' : 'Disabled / ঐচ্ছিক (Default)'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-xl">
              {isInventoryEnabled
                ? 'গুদাম স্টক সক্রিয় আছে। পারচেজ বিলের কাগজ স্বয়ংক্রিয়ভাবে ইনভেন্টরিতে যোগ হবে।'
                : 'ছোট প্রেসের জন্য ইনভেন্টরি ঐচ্ছিক। বেশিরভাগ ছোট প্রেসে গুদাম থাকে না — তারা প্রতি কাজের জন্য সরাসরি কাগজ কেনেন।'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          {isInventoryEnabled && onNavigateToInventory && (
            <button
              type="button"
              onClick={onNavigateToInventory}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1D5DFF] hover:bg-[#154cdb] text-white px-4 py-2.5 text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
            >
              <Package className="h-4 w-4" />
              <span>Go to Godown Stock (গুদাম স্টকে যান ➔)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleInventory}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all shadow-2xs ${
              isInventoryEnabled
                ? 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <span>{isInventoryEnabled ? 'Disable Inventory' : 'Enable Godown Stock (সক্রিয় করুন)'}</span>
          </button>
        </div>
      </div>

      {/* Press Profile & Commercial Identity Settings */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                প্রেস প্রোফাইল ও বাণিজ্যিক তথ্য (Press Identity & Commercial Setup)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ইনভয়েস, চালান এবং এস্টিমেটরে প্রদর্শিত আপনার প্রেসের নাম, ফোন, ঠিকানা ও স্ট্যান্ডার্ড কোটেশন রেট
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetOnboarding}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 transition-colors self-start sm:self-auto shadow-2xs"
          >
            <Compass className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>অনবোর্ডিং উইজার্ড পুনরায় চালান</span>
          </button>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                প্রেস বা প্রতিষ্ঠানের নাম
              </label>
              <input
                type="text"
                value={profileForm.pressName}
                onChange={(e) => setProfileForm({ ...profileForm, pressName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-rose-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                মালিকের নাম
              </label>
              <input
                type="text"
                value={profileForm.ownerName}
                onChange={(e) => setProfileForm({ ...profileForm, ownerName: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-rose-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                মোবাইল নম্বর
              </label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-rose-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              প্রেসের কারখানা ও দোকানের ঠিকানা
            </label>
            <input
              type="text"
              value={profileForm.address}
              onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-rose-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                গড় CTP প্লেট রেট (প্রতি প্লেট)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400 font-mono">৳</span>
                <input
                  type="number"
                  value={profileForm.defaultPlateCost}
                  onChange={(e) => setProfileForm({ ...profileForm, defaultPlateCost: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-3 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ছাপাই রেট (প্রতি ১০০০ ইম্প্রেশন)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400 font-mono">৳</span>
                <input
                  type="number"
                  value={profileForm.defaultImpressionRate}
                  onChange={(e) => setProfileForm({ ...profileForm, defaultImpressionRate: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-3 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ডিফল্ট অগ্রিম চাওয়া % (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs font-bold text-slate-400 font-mono">%</span>
                <input
                  type="number"
                  value={profileForm.defaultAdvancePercent}
                  onChange={(e) => setProfileForm({ ...profileForm, defaultAdvancePercent: Number(e.target.value) })}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-8 pr-3 py-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {profileSaved && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-in fade-in">
                <Check className="h-4 w-4" />
                <span>সফলভাবে সংরক্ষিত হয়েছে!</span>
              </span>
            )}
            <button
              type="submit"
              disabled={profileSaving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1D5DFF] hover:bg-[#154cdb] text-white px-5 py-2.5 text-xs font-bold shadow-sm hover:shadow-md hover:shadow-[#1D5DFF]/25 transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              <Save className="h-4 w-4" />
              <span>{profileSaving ? 'সংরক্ষণ হচ্ছে...' : 'প্রেস প্রোফাইল সংরক্ষণ করুন'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Enterprise Security & Cloud Data Protection */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1D5DFF] dark:text-[#23A8FF]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                সিস্টেম সিকিউরিটি ও ক্লাউড ডাটা ইন্টিগ্রিটি (System Security & Cloud Integrity)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                এন্টারপ্রাইজ-গ্রেড ডাটা সুরক্ষা, রিয়েল-টাইম ক্লাউড ব্যাকআপ ও জিরো-ডাউনটাইম অফলাইন রেজিলিয়েন্স
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              সিস্টেম সচল ও সুরক্ষিত
            </span>
          </div>
        </div>

        {/* Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">এন্ড-টু-এন্ড এনক্রিপশন</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                TLS 1.3 / AES-256
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              প্রেসের সমস্ত আর্থিক লেনদেন, কাস্টমার ডিটেইলস ও বিলিং রেকর্ড আন্তর্জাতিক মানের এনক্রিপশনে সুরক্ষিত।
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">ক্লাউড সিঙ্ক্রোনাইজেশন</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                Real-Time
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              নতুন এস্টিমেট, চালান বা জব কার্ড তৈরির সাথে সাথে তা স্বয়ংক্রিয়ভাবে সুরক্ষিত ক্লাউডে ব্যাকআপ হয়।
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">অফলাইন রেজিলিয়েন্স</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-900">
                Zero-Downtime
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              ইন্টারনেট সাময়িক ড্রপ হলেও ফ্যাক্টরির কাজ থামবে না—লোকাল ইন-মেমরি ক্যাশে সব কাজ নিরবচ্ছিন্ন চলবে।
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">অ্যাক্সেস ও রোল কন্ট্রোল</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                RBAC Protected
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              মালিক, ম্যানেজার ও কারিগরদের জন্য নির্দিষ্ট পারমিশন কার্যকর থাকায় অননুমোদিত ডেটা পরিবর্তন অসম্ভব।
            </p>
          </div>
        </div>

        {/* Security reassurance banner */}
        <div className="rounded-xl border border-emerald-200/80 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <p className="text-xs text-emerald-900 dark:text-emerald-200">
              সকল ব্যাকএন্ড ক্লাউড সার্ভিস ও ডাটাবেস সিক্রেট এনভায়রনমেন্ট কনফিগারেশনের অধীনে নিরাপদে সংরক্ষিত।
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold hidden sm:inline">
            PrintOS v2.4 Enterprise
          </span>
        </div>
      </div>
    </div>
  );
};
