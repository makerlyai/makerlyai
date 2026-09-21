"use client";

import React, { useState } from "react";
import { Lead, User } from "@/lib/crm/types";
import {
  Mail,
  Sparkles,
  CheckCircle2,
  CalendarPlus,
  UserCheck,
  Copy,
  Check,
  Flame,
} from "lucide-react";
import { generateAIMessage } from "@/lib/crm/email-templates";

interface OneTapActionsProps {
  lead: Lead;
  activeUser: User;
  onOpenEmailComposer: (lead: Lead) => void;
  onMarkContacted: (leadId: string) => void;
  onScheduleFollowup: (leadId: string, days: number) => void;
  onAssignSenior: (leadId: string) => void;
  onBoostCommission?: (leadId: string) => void;
}

export const OneTapActions: React.FC<OneTapActionsProps> = ({
  lead,
  activeUser,
  onOpenEmailComposer,
  onMarkContacted,
  onScheduleFollowup,
  onAssignSenior,
  onBoostCommission,
}) => {
  const [showAIModal, setShowAIModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [showScheduleDropdown, setShowScheduleDropdown] = useState(false);

  const handleGenerateAIMessage = () => {
    const msg = generateAIMessage(lead, "persuasive");
    setAiMessage(msg);
    setShowAIModal(true);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(aiMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAdmin = activeUser.role === "admin";
  const isHigh = lead.isHighTicket || (lead.dealValue || 0) >= 100000;
  const is20Percent = lead.commissionRate === 20;

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-2">
        {/* 1. Send Email */}
        <button
          onClick={() => onOpenEmailComposer(lead)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-brand-200 dark:border-brand-500/30 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 px-3 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300 transition-all active:scale-95 shadow-xs"
        >
          <Mail className="h-3.5 w-3.5" />
          <span>Send Email</span>
        </button>

        {/* 2. Generate AI Message */}
        <button
          onClick={handleGenerateAIMessage}
          className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 dark:border-purple-500/30 bg-purple-50 hover:bg-purple-100 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 px-3 py-1.5 text-xs font-semibold text-purple-700 dark:text-purple-300 transition-all active:scale-95 shadow-xs"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Generate Message</span>
        </button>

        {/* 3. Mark as Contacted (Admin / Closer) */}
        {isAdmin && lead.status === "New" && (
          <button
            onClick={() => onMarkContacted(lead.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-200 dark:border-cyan-500/30 bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/20 px-3 py-1.5 text-xs font-semibold text-cyan-700 dark:text-cyan-300 transition-all active:scale-95 shadow-xs"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Mark as Contacted</span>
          </button>
        )}

        {/* 4. Schedule Follow-up */}
        <div className="relative">
          <button
            onClick={() => setShowScheduleDropdown(!showScheduleDropdown)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 dark:border-amber-500/30 bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 transition-all active:scale-95 shadow-xs"
          >
            <CalendarPlus className="h-3.5 w-3.5" />
            <span>Schedule Follow-up</span>
          </button>

          {showScheduleDropdown && (
            <div className="absolute left-0 mt-1.5 z-40 w-44 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-obsidian-900 p-1 shadow-xl">
              <button
                onClick={() => {
                  onScheduleFollowup(lead.id, 1);
                  setShowScheduleDropdown(false);
                }}
                className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-800"
              >
                Tomorrow (+1 Day)
              </button>
              <button
                onClick={() => {
                  onScheduleFollowup(lead.id, 3);
                  setShowScheduleDropdown(false);
                }}
                className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-800"
              >
                In 3 Days
              </button>
              <button
                onClick={() => {
                  onScheduleFollowup(lead.id, 7);
                  setShowScheduleDropdown(false);
                }}
                className="w-full rounded-lg px-2.5 py-1.5 text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-800"
              >
                Next Week (+7 Days)
              </button>
            </div>
          )}
        </div>

        {/* 5. Assign to Senior Closer */}
        {isAdmin && lead.assignedToName !== "MakerlyAI Closer" && (
          <button
            onClick={() => onAssignSenior(lead.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300 transition-all active:scale-95 shadow-xs"
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Assign Senior</span>
          </button>
        )}

        {/* 6. Owner Tousif Raza High-Ticket 20% Boost Button */}
        {isAdmin && isHigh && !is20Percent && onBoostCommission && (
          <button
            onClick={() => onBoostCommission(lead.id)}
            title="Owner MakerlyAI (Tousif Raza): Increase partner commission to 20% for this High Ticket sale"
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 dark:border-amber-500/50 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/20 dark:to-orange-500/20 px-3 py-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 transition-all hover:shadow-md hover:border-amber-400 active:scale-95 shadow-xs"
          >
            <Flame className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>🔥 Boost to 20% (Owner)</span>
          </button>
        )}

        {isHigh && is20Percent && (
          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <Check className="h-3.5 w-3.5" />
            <span>20% High Ticket Approved by Owner Tousif Raza</span>
          </span>
        )}
      </div>

      {/* AI Message Modal */}
      {showAIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-obsidian-900 p-6 shadow-2xl text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  AI Outreach Message
                </h3>
              </div>
              <button
                onClick={() => setShowAIModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-obsidian-950 p-3.5 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
              {aiMessage}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Ready for WhatsApp or direct SMS outreach
              </span>
              <button
                onClick={handleCopyMessage}
                className="flex items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-purple-600 hover:bg-slate-800 dark:hover:bg-purple-500 px-3 py-1.5 text-xs font-semibold text-white transition-all shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
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
          </div>
        </div>
      )}
    </div>
  );
};

