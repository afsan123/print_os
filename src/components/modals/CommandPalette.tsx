'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Calculator,
  FileText,
  Users,
  Receipt,
  Layers,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
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

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  const allNavItems: { key: NavItemKey; label: string; icon: any; section: string }[] = [
    { key: 'estimator', label: 'Smart Cost Estimator', icon: Calculator, section: 'Jobs & Production' },
    { key: 'job_cards', label: 'Job Cards & Dockets', icon: FileText, section: 'Jobs & Production' },
    { key: 'production_queue', label: 'Machine Production Queue', icon: Layers, section: 'Jobs & Production' },
    { key: 'invoices', label: 'Commercial Invoices', icon: Receipt, section: 'Sales' },
    { key: 'clients', label: 'Client Accounts Directory', icon: Users, section: 'Sales' },
  ];
  const navigationItems = allNavItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-20 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3.5 bg-slate-50/50">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, client name, or job template..."
            className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <kbd className="rounded border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-mono text-slate-400 shadow-2xs">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Templates Section */}
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
