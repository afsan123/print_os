'use client';

import React, { useState } from 'react';
import { X, MessageCircle, Copy, Check, ExternalLink } from 'lucide-react';
import { EstimatorState, CalculationResult } from '@/types/estimator';

interface WhatsAppQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: EstimatorState;
  calc: CalculationResult;
}

export const WhatsAppQuoteModal: React.FC<WhatsAppQuoteModalProps> = ({
  isOpen,
  onClose,
  state,
  calc,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('+8801712345678');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const quoteMessage = `*PRINT QUOTATION - PrintOS Press*
---------------------------------------
*Client:* ${state.jobSpecs.client}
*Job Title:* ${state.jobSpecs.jobTitle}
*Category:* ${state.jobSpecs.category}
*Target Quantity:* ${state.jobSpecs.targetQuantity.toLocaleString()} Pcs

*SPECIFICATIONS:*
• Paper: ${state.paperConfig.paperType} (${state.paperConfig.gsm} GSM)
• Sheet Size: ${state.paperConfig.fullSheetSize}
• Printing: ${state.pressConfig.colors} (${state.pressConfig.sides})
${state.finishingConfig.lamination.enabled ? `• Lamination: ${state.finishingConfig.lamination.type}\n` : ''}${state.finishingConfig.dieCutting.enabled ? `• Die Cutting: Setup & Punch included\n` : ''}${state.finishingConfig.binding.enabled ? `• Binding: ${state.finishingConfig.binding.type}\n` : ''}
*PRICE SUMMARY:*
• Production Cost: ৳ ${calc.totalProductionCost.toLocaleString()}
• Total Selling Price: *৳ ${calc.finalSellingPrice.toLocaleString()}*
• Rate Per Piece: *৳ ${calc.perPieceCost.toFixed(2)} / pc*

*Delivery:* In 2-3 working days.
*Payment Terms:* 50% Advance with Purchase Order.

_Thank you for your business!_
PrintOS Press & Packaging Ltd., Dhaka`;

  const handleCopy = () => {
    navigator.clipboard.writeText(quoteMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(quoteMessage);
    const url = cleanNumber
      ? `https://wa.me/${cleanNumber}?text=${encodedText}`
      : `https://wa.me/?text=${encodedText}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-emerald-50/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Send WhatsApp Quotation
              </h3>
              <p className="text-xs text-slate-500">
                Instant branded quote to client mobile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-emerald-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Phone Number Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Recipient WhatsApp Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+880 1712-345678"
              className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all shadow-2xs"
            />
          </div>

          {/* Formatted Message Preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Message Preview
              </label>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-[#e7f8ee]/40 p-4 text-xs font-mono text-slate-800 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed shadow-inner">
              {quoteMessage}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
          <button
            onClick={onClose}
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleOpenWhatsApp}
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white transition-colors shadow-xs"
          >
            <span>Open in WhatsApp</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
