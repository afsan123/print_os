'use client';

import React, { useState } from 'react';
import { X, Sparkles, Check, Bookmark, ArrowRight, Layers } from 'lucide-react';
import { PrintTemplate } from '@/types/estimator';

interface TemplatePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: PrintTemplate[];
  onSelectTemplate: (template: PrintTemplate) => void;
  onSaveCurrentAsTemplate?: (name: string, description: string) => void;
  isSavingMode?: boolean;
}

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  isOpen,
  onClose,
  templates,
  onSelectTemplate,
  onSaveCurrentAsTemplate,
  isSavingMode = false,
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'save'>(
    isSavingMode ? 'save' : 'browse'
  );
  const [templateName, setTemplateName] = useState('');
  const [templateDesc, setTemplateDesc] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!templateName.trim() || !onSaveCurrentAsTemplate) return;

    onSaveCurrentAsTemplate(templateName.trim(), templateDesc.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#881337] text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Job Templates & Presets
              </h3>
              <p className="text-xs text-slate-500">
                Load proven commercial press estimates or save your custom setup
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-slate-200 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('browse')}
                className={`rounded-md px-3 py-1.5 transition-all ${
                  activeTab === 'browse'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Browse Presets
              </button>
              <button
                onClick={() => setActiveTab('save')}
                className={`rounded-md px-3 py-1.5 transition-all ${
                  activeTab === 'save'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Save As Template
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {activeTab === 'browse' ? (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => {
                    onSelectTemplate(tpl);
                    onClose();
                  }}
                  className="group flex items-start justify-between p-4 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 transition-all cursor-pointer shadow-2xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 group-hover:text-rose-900">
                        {tpl.name}
                      </span>
                      <span className="rounded bg-slate-100 text-slate-600 px-2 py-0.5 text-[10px] font-semibold">
                        {tpl.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {tpl.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-slate-600">
                      <span>Qty: {tpl.state.jobSpecs.targetQuantity.toLocaleString()} pcs</span>
                      <span>•</span>
                      <span>{tpl.state.paperConfig.paperType}</span>
                      <span>•</span>
                      <span>{tpl.state.pressConfig.colors}</span>
                      <span>•</span>
                      <span className="font-semibold text-rose-800">
                        {tpl.state.profitMarginPercent}% Margin
                      </span>
                    </div>
                  </div>

                  <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-[#881337] group-hover:text-white transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4 max-w-md mx-auto py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Template Name <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g. Standard 8-Page Booklet 170 GSM"
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all shadow-2xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Description & Specs Summary
                </label>
                <textarea
                  rows={3}
                  value={templateDesc}
                  onChange={(e) => setTemplateDesc(e.target.value)}
                  placeholder="Briefly describe paper, finishing, and intended use case..."
                  className="w-full p-3 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 transition-all shadow-2xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savedSuccess}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#881337] hover:bg-[#700f2e] text-white px-5 py-2 text-xs font-bold transition-all shadow-xs"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" />
                      <span>Save Current Template</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
