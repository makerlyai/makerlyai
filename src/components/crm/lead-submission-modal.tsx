"use client";

import React, { useState } from "react";
import { RequirementType, REQUIREMENT_OPTIONS, User } from "@/lib/crm/types";
import {
  Plus,
  Sparkles,
  Coins,
  Building,
  User as UserIcon,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  FileSpreadsheet,
  Flame,
} from "lucide-react";
import { MakerlyLogoIcon } from "./makerly-logo";

interface LeadSubmissionModalProps {
  isOpen: boolean;
  activeUser: User;
  onClose: () => void;
  onOpenBulkImport?: () => void;
  onSubmit: (leadData: {
    clientName: string;
    phone: string;
    email: string;
    businessName: string;
    requirement: string;
    notes?: string;
  }) => void;
}

export const LeadSubmissionModal: React.FC<LeadSubmissionModalProps> = ({
  isOpen,
  activeUser,
  onClose,
  onOpenBulkImport,
  onSubmit,
}) => {
  const [clientName, setClientName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [requirement, setRequirement] = useState<string>(REQUIREMENT_OPTIONS[0]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmit({
        clientName,
        phone,
        email,
        businessName,
        requirement,
        notes,
      });

      setIsSubmitting(false);
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        // Reset form
        setClientName("");
        setBusinessName("");
        setPhone("");
        setEmail("");
        setNotes("");
        onClose();
      }, 1000);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-obsidian-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-obsidian-950 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#efe7d1] border border-[#2952cc]/30 shadow-xs p-1.5 transition-transform hover:scale-105">
              <MakerlyLogoIcon className="w-full h-full" color="#2952cc" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Submit New Lead
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Partner Attribution: <strong className="text-slate-800 dark:text-brand-300">{activeUser.name}</strong> ({activeUser.role})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-white transition-all"
          >
            ✕
          </button>
        </div>

        {/* 15% / 20% Commission Banner for Partners */}
        <div className="flex items-center justify-between border-b border-blue-200 dark:border-brand-500/20 bg-blue-50/80 dark:bg-gradient-to-r dark:from-brand-950/60 dark:to-obsidian-900 px-6 py-2.5 text-xs text-blue-900 dark:text-brand-300">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-[#2952cc] dark:text-brand-400" />
            <span>
              <strong>15% Commission</strong> standard • <strong>🔥 20% for High Ticket (&gt; ₹1L)</strong> approved by Owner Tousif Raza.
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
            AUTO-TRACKED
          </span>
        </div>

        {/* Bulk Import Prompt */}
        {onOpenBulkImport && (
          <div className="flex items-center justify-between border-b border-white/[0.08] bg-obsidian-950/70 px-6 py-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
              <span>Have multiple leads in a sheet?</span>
            </div>
            <button
              type="button"
              onClick={onOpenBulkImport}
              className="font-medium text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
            >
              Bulk Import Excel / CSV &rarr;
            </button>
          </div>
        )}

        {/* Intake Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="mt-3 text-base font-bold text-white">
                Lead Successfully Submitted!
              </h4>
              <p className="mt-1 text-xs text-slate-400">
                Added to the MakerlyAI pipeline. Attributed to {activeUser.name}.
              </p>
            </div>
          ) : (
            <>
              {/* Row 1: Client Name & Business Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">
                    Client Name *
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="h-8.5 w-full rounded-md border border-white/[0.08] bg-obsidian-950 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-600 focus:border-brand-500/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">
                    Business / Company Name *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Acme Logistics"
                      required
                      className="h-8.5 w-full rounded-md border border-white/[0.08] bg-obsidian-950 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-600 focus:border-brand-500/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="h-8.5 w-full rounded-md border border-white/[0.08] bg-obsidian-950 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-600 focus:border-brand-500/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">
                    Client Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@acmelogistics.com"
                      required
                      className="h-8.5 w-full rounded-md border border-white/[0.08] bg-obsidian-950 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-600 focus:border-brand-500/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Requirement Selection */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                  Primary Requirement *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {REQUIREMENT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setRequirement(opt)}
                      className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-left text-xs font-medium transition-all ${
                        requirement === opt
                          ? "border-brand-500/50 bg-brand-500/20 text-brand-200"
                          : "border-white/[0.08] bg-obsidian-950 text-slate-400 hover:bg-obsidian-850 hover:text-slate-200"
                      }`}
                    >
                      <Sparkles className="h-3 w-3 text-brand-400 flex-shrink-0" />
                      <span className="truncate">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes / Context */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-300">
                  Notes &amp; Context
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Details regarding their tech stack, budget expectation, urgency, or specific pain points..."
                  rows={3}
                  className="w-full rounded-md border border-white/[0.08] bg-obsidian-950 p-3 text-xs text-slate-200 placeholder-slate-600 focus:border-brand-500/50 focus:outline-none resize-none"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-white/[0.08] pt-4">
                <div className="text-[11px] text-slate-500 font-mono">
                  Attribution: {activeUser.name} &bull; Timestamp: Now
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md border border-white/[0.08] px-3.5 py-1.5 text-xs text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 rounded-md bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-brand-500 active:scale-95 disabled:opacity-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>{isSubmitting ? "Submitting..." : "Submit Lead"}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

