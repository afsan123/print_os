'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Printer,
  Lock,
  Mail,
  User,
  Building2,
  Phone,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  LogIn,
  UserPlus,
  KeyRound,
  Compass,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

export const AuthModal: React.FC = () => {
  const { login, register, demoLogin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPressName, setRegPressName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regError, setRegError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginEmail || !loginPassword) {
      setLoginError('ইমেইল এবং পাসওয়ার্ড উভয়ই পূরণ করুন।');
      return;
    }

    const res = await login(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.error || 'লগইন ব্যর্থ হয়েছে।');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    if (!regName || !regEmail || !regPassword) {
      setRegError('অনুগ্রহ করে নাম, ইমেইল এবং পাসওয়ার্ড পূরণ করুন।');
      return;
    }
    if (regPassword.length < 8) {
      setRegError('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।');
      return;
    }

    const res = await register(
      regName,
      regEmail,
      regPassword,
      regPressName || `${regName} প্রেস`,
      regPhone
    );
    if (!res.success) {
      setRegError(res.error || 'রেজিস্ট্রেশন সম্পন্ন করা যায়নি।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl border border-[#E8EDF5] dark:border-[#162E63] bg-white dark:bg-[#0B224F] shadow-2xl overflow-hidden my-8 transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Banner - Primary Brand Gradient */}
        <div style={{ background: 'linear-gradient(135deg, #23A8FF 0%, #1D5DFF 50%, #071A3D 100%)' }} className="p-7 text-white text-center relative overflow-hidden">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-[#00C8FF]/20 blur-2xl" />

          <div className="relative z-10 flex flex-col items-center">
            <Image
              src="/logo-white.png"
              alt="PrintOS Logo"
              width={200}
              height={67}
              priority
              className="h-11 w-auto object-contain mb-2.5"
            />
            <span className="text-[11px] uppercase bg-white/20 text-white px-3 py-0.5 rounded-full font-mono font-bold tracking-wider">
              Cloud ERP
            </span>
            <p className="text-xs text-white/90 mt-2 max-w-sm font-medium">
              বাণিজ্যিক অফসেট ও ডিজিটাল প্রিন্টিং প্রেস ম্যানেজমেন্ট প্ল্যাটফর্ম
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="mt-6 flex rounded-xl bg-white/15 p-1 backdrop-blur-md border border-white/20">
            <button
              onClick={() => {
                setActiveTab('login');
                setLoginError(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-white text-[#1D5DFF] shadow-sm'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>লগইন (Sign In)</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setRegError(null);
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>নতুন একাউন্ট (Register)</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-medium">
                  {loginError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  ইমেইল অ্যাড্রেস (Email Address)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="owner@almadinapress.com"
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-rose-600 focus:outline-none focus:ring-1 focus:ring-rose-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  পাসওয়ার্ড (Password)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:border-rose-600 focus:outline-none focus:ring-1 focus:ring-rose-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-[#1D5DFF] hover:bg-[#154cdb] text-white py-3 text-xs font-bold shadow-md hover:shadow-lg hover:shadow-[#1D5DFF]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
              >
                {isLoading ? (
                  <span>প্রবেশ করা হচ্ছে...</span>
                ) : (
                  <>
                    <span>লগইন করুন</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Quick 1-Click Demo Login Options */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    ১-ক্লিকে তাৎক্ষণিক ডেমো লগইন
                  </span>
                  <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    No Password Needed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => demoLogin('owner')}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:border-rose-200 dark:hover:border-rose-800 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 flex items-center justify-center text-xs font-black">
                        👑
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-rose-700 dark:group-hover:text-rose-300">
                          মালিক (Press Owner)
                        </p>
                        <p className="text-[10px] text-slate-400">সম্পূর্ণ এক্সেস</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => demoLogin('manager')}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-200 dark:hover:border-blue-800 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-black">
                        💼
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                          ম্যানেজার (Manager)
                        </p>
                        <p className="text-[10px] text-slate-400">অর্ডার ও হিসাব</p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Test New Onboarding Button */}
                <button
                  type="button"
                  onClick={() => demoLogin('owner', true)}
                  className="w-full mt-2.5 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Compass className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>নতুন প্রেস অনবোর্ডিং উইজার্ড ট্রাই করুন (Test Setup Wizard)</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {regError && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-medium">
                  {regError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    আপনার নাম (Your Name)
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="রফিক হোসেন"
                      required
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    প্রেস বা প্রতিষ্ঠানের নাম
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={regPressName}
                      onChange={(e) => setRegPressName(e.target.value)}
                      placeholder="পদ্মা অফসেট প্রেস & প্রিন্টিং"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ইমেইল অ্যাড্রেস (Email)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="name@yourpress.com"
                    required
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:border-rose-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পাসওয়ার্ড (Password)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="কমপক্ষে ৮ অক্ষর"
                      required
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    মোবাইল নম্বর (Phone)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+880 1711-000000"
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:border-rose-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-[#1D5DFF] hover:bg-[#154cdb] text-white py-3 text-xs font-bold shadow-md hover:shadow-lg hover:shadow-[#1D5DFF]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99]"
                >
                  {isLoading ? (
                    <span>অ্যাকাউন্ট তৈরি হচ্ছে...</span>
                  ) : (
                    <>
                      <span>রেজিস্ট্রেশন করুন ও প্রেস সেটআপ শুরু করুন</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-500 text-center pt-2">
                রেজিস্ট্রেশনের পর আপনাকে ৩-ধাপের সহজ প্রেস সেটআপ উইজার্ডে নিয়ে যাওয়া হবে।
              </p>
            </form>
          )}

          {/* Footer Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>২৫৬-বিট এন্টারপ্রাইজ এনক্রিপশন ও অফলাইন রেজিলিয়েন্স দ্বারা সুরক্ষিত</span>
          </div>
        </div>
      </div>
    </div>
  );
};
