'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Search,
  Calculator,
  FileText,
  Users,
  Receipt,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { type LucideIcon } from 'lucide-react';
import { ClientRecord, PrintTemplate } from '@/types/estimator';
import { NavItemKey } from '@/components/layout/Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  clients: ClientRecord[];
  templates: PrintTemplate[];
  onSelectClient: (clientName: string) => void;
  onSelectTemplate: (template: PrintTemplate) => void;
  onNavigate: (tab: NavItemKey) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  clients,
  templates,
  onSelectClient,
  onSelectTemplate,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.company.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase())
  );

  const allNavItems: { key: NavItemKey; label: string; icon: LucideIcon; section: string }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: Calculator, section: 'Overview' },
    { key: 'estimator', label: 'Smart Cost Estimator', icon: Calculator, section: 'Jobs & Production' },
    { key: 'job_cards', label: 'Job Cards & Dockets', icon: FileText, section: 'Jobs & Production' },
    { key: 'production_queue', label: 'Machine Production Queue', icon: Layers, section: 'Jobs & Production' },
    { key: 'invoices', label: 'Commercial Invoices', icon: Receipt, section: 'Sales' },
    { key: 'clients', label: 'Client Accounts Directory', icon: Users, section: 'Sales' },
    { key: 'delivery_chalans', label: 'Delivery Chalans', icon: FileText, section: 'Sales' },
    { key: 'suppliers', label: 'Suppliers', icon: Users, section: 'Purchases' },
    { key: 'purchase_bills', label: 'Purchase Bills', icon: Receipt, section: 'Purchases' },
    { key: 'inventory', label: 'Godown Paper Inventory & Stock (গুদাম)', icon: Layers, section: 'Purchases' },
    { key: 'cash_book', label: 'Cash Book', icon: Receipt, section: 'Finance' },
    { key: 'transactions', label: 'Transactions Ledger', icon: Receipt, section: 'Finance' },
    { key: 'expenses', label: 'Expenses', icon: Receipt, section: 'Finance' },
    { key: 'payroll', label: 'Payroll', icon: Users, section: 'Finance' },
    { key: 'profit_loss', label: 'Profit & Loss', icon: Receipt, section: 'Reports' },
    { key: 'debtors', label: 'Debtors & Receivables', icon: Users, section: 'Reports' },
    { key: 'sales_reports', label: 'Sales Reports', icon: Receipt, section: 'Reports' },
    { key: 'settings', label: 'Settings', icon: Sparkles, section: 'System' },
  ];
  const navigationItems = allNavItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-20 p-4 backdrop-blur-xs"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-labelledby="command-palette-title" className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5 bg-slate-50/50">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, client name, or job template..."
            className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <kbd className="rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-400 shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Templates Section */}
          <h2 id="command-palette-title" className="sr-only">Quick search</h2>
          {filteredTemplates.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-rose-700" />
                <span>Printing Templates</span>
              </div>
              <div className="mt-1 space-y-1">
                {filteredTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTemplate(t);
                      onNavigate('estimator');
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-rose-50 text-slate-800 transition-colors group"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-rose-900">
                        {t.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {t.category} • {t.state.jobSpecs.targetQuantity.toLocaleString()} pcs
                      </p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-rose-700" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Section */}
          {navigationItems.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Navigation
              </div>
              <div className="mt-1 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        onNavigate(item.key);
                        onClose();
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-100 text-slate-800 transition-colors"
                    >
                      <Icon className="h-4 w-4 text-slate-500" />
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{item.label}</p>
                        <p className="text-[10px] text-slate-400">{item.section}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clients Section */}
          {filteredClients.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="h-3 w-3 text-emerald-700" />
                <span>Clients</span>
              </div>
              <div className="mt-1 space-y-1">
                {filteredClients.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectClient(c.name);
                      onNavigate('estimator');
                      onClose();
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-emerald-50 text-slate-800 transition-colors group"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-emerald-900">
                        {c.name}
                      </p>
                      <p className="text-[11px] text-slate-500">{c.company} • {c.phone}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                      Use in Estimator
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredTemplates.length === 0 && navigationItems.length === 0 && filteredClients.length === 0 && (
            <div className="py-8 text-center text-slate-400">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
