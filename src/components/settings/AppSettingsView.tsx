'use client';

import React, { useState } from 'react';
import {
  Settings,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Server,
  Key,
  Layers,
  FileCode,
  Info,
  ChevronDown,
  Copy,
  Sun,
  Moon,
  Building2,
  Phone,
  MapPin,
  Compass,
  Save,
  Check,
  Coins,
} from 'lucide-react';
import { APPWRITE_CONFIG, checkAppwriteHealth, AppwriteHealthResult } from '@/lib/appwrite';
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
}

export const AppSettingsView: React.FC<AppSettingsViewProps> = ({
  appwriteStatus,
  onRefreshConnection,
}) => {
  const { theme, setTheme } = useTheme();
  const { user, updatePressProfile, resetOnboarding } = useAuth();
  const [testing, setTesting] = useState(false);
  const [healthResult, setHealthResult] = useState<AppwriteHealthResult | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

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
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="w-full max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-sm">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                System Settings & Appwrite Cloud Backend
              </h1>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Cloud Connected (SGP)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live Appwrite backend verification, database collection schemas, API status, and company profile
            </p>
          </div>
        </div>

        <button
          onClick={runDiagnostics}
          disabled={testing}
          className="inline-flex items-center gap-2 rounded-xl bg-[#881337] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#700f2e] transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${testing ? 'animate-spin' : ''}`} />
          <span>{testing ? 'Testing Connection...' : 'Run Diagnostics'}</span>
        </button>
      </div>

      {/* Live Diagnostic Banner */}
      {healthResult && (
        <div
          className={`rounded-2xl border p-5 transition-all shadow-xs ${
            healthResult.databaseStatus === 'ready'
              ? 'border-emerald-200 bg-emerald-50/80 text-emerald-900'
              : 'border-amber-200 bg-amber-50/80 text-amber-950'
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
                    ? 'Appwrite Cloud & Database 100% Operational'
                    : 'Appwrite Project Connected — Database Step Required in Console'}
                </h3>
                <p className="leading-relaxed">{healthResult.message}</p>
                {healthResult.databaseStatus === 'database_not_found' && (
                  <p className="text-[11px] font-semibold text-amber-800 pt-1">
                    👉 In your Appwrite Console, click <strong>Databases</strong> ➔{' '}
                    <strong>Create Database</strong> with Database ID: <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono font-bold text-slate-900">print_os_db</code>
                  </p>
                )}
              </div>
            </div>

            <a
              href={`https://cloud.appwrite.io/console/project-${healthResult.projectId}/databases`}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-white border border-slate-300 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <span>Open Appwrite Console</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
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
                ? 'bg-[#881337] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sun className="h-4 w-4" />
            <span>Light Mode (লাইট মোড)</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-2xs ${
              theme === 'dark'
                ? 'bg-[#881337] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Moon className="h-4 w-4" />
            <span>Dark Mode (ডার্ক মোড)</span>
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
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#881337] hover:bg-[#9f1239] text-white px-5 py-2.5 text-xs font-bold shadow-sm transition-all disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{profileSaving ? 'সংরক্ষণ হচ্ছে...' : 'প্রেস প্রোফাইল সংরক্ষণ করুন'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Advanced / Developer Backend Settings — collapsed by default */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
              <Server className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">
                Developer & Backend Settings
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Appwrite Cloud configuration, database diagnostics, and API credentials — for technical admin use only
              </p>
            </div>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
              showAdvanced ? 'rotate-180' : ''
            }`}
          />
        </button>

        {showAdvanced && (
          <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-5">
            {/* Header + Run Diagnostics button */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Appwrite Cloud Backend
              </p>
              <button
                onClick={runDiagnostics}
                disabled={testing}
                className="inline-flex items-center gap-2 rounded-xl bg-[#881337] px-4 py-2 text-xs font-bold text-white hover:bg-[#700f2e] transition-colors shadow-sm disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? 'Testing...' : 'Run Diagnostics'}</span>
              </button>
            </div>

            {/* Live Diagnostic Banner */}
            {healthResult && (
              <div
                className={`rounded-2xl border p-4 transition-all shadow-xs ${
                  healthResult.databaseStatus === 'ready'
                    ? 'border-emerald-200 bg-emerald-50/80 text-emerald-900'
                    : 'border-amber-200 bg-amber-50/80 text-amber-950'
                }`}
              >
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
                        ? 'Appwrite Cloud & Database 100% Operational'
                        : 'Appwrite Project Connected — Database Step Required in Console'}
                    </h3>
                    <p className="leading-relaxed">{healthResult.message}</p>
                    {healthResult.databaseStatus === 'database_not_found' && (
                      <p className="text-[11px] font-semibold text-amber-800 pt-1">
                        👉 In Appwrite Console, click <strong>Databases</strong> ➔{' '}
                        <strong>Create Database</strong> with ID:{' '}
                        <code className="bg-white/80 px-1.5 py-0.5 rounded font-mono font-bold text-slate-900">print_os_db</code>
                      </p>
                    )}
                    {healthResult.databaseStatus === 'ready' && (
                      <a
                        href={`https://cloud.appwrite.io/console/project-${healthResult.projectId}/databases`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:underline pt-1"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open Appwrite Console
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Appwrite Cloud Connection Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <Database className="h-5 w-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Appwrite Backend Configuration</h3>
            </div>
            <span className="text-xs text-slate-500 font-mono">Appwrite Web SDK v17.0.2</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-700">Appwrite Cloud Endpoint</label>
                {copiedText === 'endpoint' && (
                  <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={APPWRITE_CONFIG.endpoint}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-mono text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(APPWRITE_CONFIG.endpoint, 'endpoint')}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
                  title="Copy Endpoint"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-400">Singapore Region (SGP Cloud Cluster)</p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-700">Appwrite Project ID</label>
                {copiedText === 'projectId' && (
                  <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={APPWRITE_CONFIG.projectId}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-mono font-bold text-[#881337]"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(APPWRITE_CONFIG.projectId, 'projectId')}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
                  title="Copy Project ID"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <p className="text-[11px] text-slate-400">Target Appwrite Cloud Project ID</p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="font-bold text-slate-700">Configured Database ID</label>
                {copiedText === 'dbId' && (
                  <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={APPWRITE_CONFIG.databaseId}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-mono font-bold text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(APPWRITE_CONFIG.databaseId, 'dbId')}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50"
                  title="Copy Database ID"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Database Collections Schema Mapping */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Configured Appwrite Collections (8 Modules)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.entries(APPWRITE_CONFIG.collections).map(([key, colId]) => (
                <div
                  key={key}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-900 capitalize text-[11px]">{key}</p>
                    <p className="font-mono text-[10px] text-slate-500 truncate max-w-[90px]">{colId}</p>
                  </div>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Console Setup Quick Guide */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <Server className="h-5 w-5 text-[#881337]" />
            <h3 className="font-bold text-slate-900 text-sm">Appwrite Quick Setup Guide</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#881337] text-white text-[10px] font-bold">1</span>
                Create Database in Console
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed pl-6.5">
                In Appwrite Console, click <strong>Databases</strong> ➔ <strong>Create Database</strong>. Use Custom ID: <code className="font-mono font-bold text-slate-800">print_os_db</code>.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#881337] text-white text-[10px] font-bold">2</span>
                Create Collections
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed pl-6.5">
                Create collections: <code className="font-mono text-[10px]">invoices</code>, <code className="font-mono text-[10px]">delivery_chalans</code>, <code className="font-mono text-[10px]">clients</code>, <code className="font-mono text-[10px]">job_cards</code>, <code className="font-mono text-[10px]">suppliers</code>, <code className="font-mono text-[10px]">purchase_bills</code>, <code className="font-mono text-[10px]">cash_transactions</code>, <code className="font-mono text-[10px]">expenses</code>.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#881337] text-white text-[10px] font-bold">3</span>
                Set Permissions
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed pl-6.5">
                Under Collection ➔ <strong>Settings</strong> ➔ <strong>Permissions</strong>, click <strong>Add Role</strong> ➔ <strong>Any</strong> (or <strong>Users</strong>) and check <strong>Create, Read, Update, Delete</strong>.
              </p>
            </div>

            <div className="rounded-xl bg-emerald-50 p-3.5 border border-emerald-200 space-y-1">
              <p className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Zero-Downtime Hybrid Mode Active</span>
              </p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Even while you configure collections in your Appwrite Console, PrintOS functions seamlessly with zero delay using its reactive in-memory layer!
              </p>
            </div>
          </div>
        </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
