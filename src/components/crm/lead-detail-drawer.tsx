"use client";

import React, { useState } from "react";
import { Lead, Activity, User, LeadStatus, PIPELINE_STATUSES } from "@/lib/crm/types";
import { formatCurrency, calculateCommission } from "@/lib/crm/commission";
import { StatusBadge } from "./status-badge";
import { OneTapActions } from "./one-tap-actions";
import {
  X,
  Building,
  User as UserIcon,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Coins,
  History,
  Send,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ClockAlert,
  ArrowRight,
  UserCheck,
  Flame,
  Check,
} from "lucide-react";

interface LeadDetailDrawerProps {
  lead: Lead | null;
  activities: Activity[];
  users: User[];
  activeUser: User;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLead: (leadId: string, updates: Partial<Lead>) => void;
  onAddNote: (leadId: string, noteContent: string) => void;
  onOpenEmailComposer: (lead: Lead) => void;
  onMarkContacted: (leadId: string) => void;
  onScheduleFollowup: (leadId: string, days: number) => void;
  onAssignSenior: (leadId: string) => void;
  onBoostCommission?: (leadId: string) => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  activities,
  users,
  activeUser,
  isOpen,
  onClose,
  onUpdateLead,
  onAddNote,
  onOpenEmailComposer,
  onMarkContacted,
  onScheduleFollowup,
  onAssignSenior,
  onBoostCommission,
}) => {
  const [newNote, setNewNote] = useState("");
  const [dealValueInput, setDealValueInput] = useState<string>(
    lead ? String(lead.dealValue || "") : ""
  );
  const [activeTab, setActiveTab] = useState<"overview" | "timeline">("overview");

  // Keep local deal value input synced
  React.useEffect(() => {
    if (lead) {
      setDealValueInput(lead.dealValue ? String(lead.dealValue) : "");
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  const isAdmin = activeUser.role === "admin";
  const now = new Date().getTime();
  const isOverdue =
    lead.nextFollowupDate &&
    lead.status !== "Closed Won" &&
    lead.status !== "Closed Lost" &&
    new Date(lead.nextFollowupDate).getTime() < now;

  const isHighTicket = lead.isHighTicket || (lead.dealValue || 0) >= 100000;
  const currentRate = lead.commissionRate || (isHighTicket ? 20 : 15);
  const leadActivities = activities.filter((a) => a.leadId === lead.id);

  const handleStatusChange = (newStatus: LeadStatus) => {
    onUpdateLead(lead.id, { status: newStatus });
  };

  const handleAssigneeChange = (userId: string) => {
    const selected = users.find((u) => u.id === userId);
    onUpdateLead(lead.id, {
      assignedTo: userId || null,
      assignedToName: selected ? selected.name : null,
    });
  };

  const handleDealValueBlur = () => {
    const num = parseFloat(dealValueInput) || 0;
    if (num !== lead.dealValue) {
      const high = num >= 100000;
      onUpdateLead(lead.id, {
        dealValue: num,
        isHighTicket: high,
        commission: (num * (currentRate / 100)),
      });
    }
  };

  const handleSetCommissionRate = (rate: number) => {
    if (!isAdmin) return;
    const value = lead.dealValue || 0;
    const newCommission = value * (rate / 100);
    onUpdateLead(lead.id, {
      commissionRate: rate,
      isHighTicket: value >= 100000 || rate === 20,
      commissionApprovedBy: "MakerlyAI (Tousif Raza)",
      commission: newCommission,
    });
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(lead.id, newNote.trim());
    setNewNote("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-xl border-l border-slate-200 dark:border-white/10 bg-white dark:bg-obsidian-950 text-slate-900 dark:text-slate-100 shadow-2xl flex flex-col">
          {/* Drawer Top Header */}
          <div className="border-b border-slate-200 dark:border-white/[0.08] bg-slate-50/80 dark:bg-obsidian-900 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30">
                  <Building className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                    {lead.businessName}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Client: <span className="font-semibold text-slate-700 dark:text-slate-200">{lead.clientName}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-white transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Actions Tray */}
            <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/[0.06]">
              <OneTapActions
                lead={lead}
                activeUser={activeUser}
                onOpenEmailComposer={onOpenEmailComposer}
                onMarkContacted={onMarkContacted}
                onScheduleFollowup={onScheduleFollowup}
                onAssignSenior={onAssignSenior}
                onBoostCommission={onBoostCommission}
              />
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-white/[0.08] bg-white dark:bg-obsidian-900/40 px-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition-all ${
                activeTab === "overview"
                  ? "border-brand-600 text-brand-600 dark:border-brand-500 dark:text-brand-300"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              Overview &amp; Management
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={`flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-semibold transition-all ${
                activeTab === "timeline"
                  ? "border-brand-600 text-brand-600 dark:border-brand-500 dark:text-brand-300"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span>Activity Log ({leadActivities.length})</span>
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {activeTab === "overview" ? (
              <>
                {/* Status & Assignment Row */}
                <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-obsidian-900/60 p-4">
                  {/* Status Picker */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Pipeline Stage
                    </label>
                    {isAdmin ? (
                      <select
                        value={lead.status}
                        onChange={(e) =>
                          handleStatusChange(e.target.value as LeadStatus)
                        }
                        className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-obsidian-950 px-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:border-brand-500 focus:outline-none"
                      >
                        {PIPELINE_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="mt-1">
                        <StatusBadge status={lead.status} size="md" />
                      </div>
                    )}
                  </div>

                  {/* Assignee Picker */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Assigned MakerlyAI Closer
                    </label>
                    {isAdmin ? (
                      <select
                        value={lead.assignedTo || ""}
                        onChange={(e) => handleAssigneeChange(e.target.value)}
                        className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-obsidian-950 px-2.5 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:border-brand-500 focus:outline-none"
                      >
                        <option value="">Unassigned</option>
                        {users.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} ({u.role})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center gap-2 mt-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <UserCheck className="h-3.5 w-3.5 text-brand-500" />
                        <span>{lead.assignedToName || "Unassigned"}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Financials & Commission Card (High Ticket Engine) */}
                <div className="rounded-xl border border-slate-200 dark:border-brand-500/20 bg-white dark:bg-gradient-to-br dark:from-brand-950/40 dark:via-obsidian-900 dark:to-obsidian-900 p-4 shadow-sm space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-brand-300">
                        Deal Financials &amp; Commission
                      </span>
                    </div>
                    {isHighTicket && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                        <Flame className="h-3 w-3 text-amber-500" />
                        <span>High Ticket Deal (&gt; ₹1,00,000)</span>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Deal Value */}
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Total Deal Value (₹ INR)
                      </label>
                      {isAdmin ? (
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-slate-400">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={dealValueInput}
                            onChange={(e) => setDealValueInput(e.target.value)}
                            onBlur={handleDealValueBlur}
                            placeholder="e.g. 150000"
                            className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-obsidian-950 pl-7 pr-3 font-mono text-xs font-bold text-slate-900 dark:text-white focus:border-brand-500 focus:bg-white dark:focus:bg-obsidian-900 focus:outline-none"
                          />
                        </div>
                      ) : (
                        <div className="font-mono text-base font-bold text-slate-900 dark:text-white mt-1">
                          {lead.dealValue > 0 ? formatCurrency(lead.dealValue) : "TBD"}
                        </div>
                      )}
                    </div>

                    {/* Calculated Partner Commission */}
                    <div>
                      <label className="mb-1 block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Partner Commission ({currentRate}%)
                      </label>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency((lead.dealValue || 0) * (currentRate / 100))}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({lead.status === "Closed Won" ? "Locked" : "Projected"})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Owner Commission Decision Panel (Decided ONLY by MakerlyAI / Tousif Raza) */}
                  <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-obsidian-950/80 p-3">
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                        <span className="font-bold text-slate-700 dark:text-slate-200">
                          Partner Commission Decision
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        Decided exclusively by Owner: <strong className="text-slate-800 dark:text-slate-200">MakerlyAI (Tousif Raza)</strong>
                      </span>
                    </div>

                    {isAdmin ? (
                      <div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                          As owner MakerlyAI (Tousif Raza), select the commission rate. High ticket sales (&gt; ₹1,00,000) are eligible for 20%:
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleSetCommissionRate(15)}
                            className={`flex-1 rounded-lg py-2 px-3 text-xs font-semibold transition-all border ${
                              currentRate === 15
                                ? "bg-slate-900 dark:bg-white text-white dark:text-obsidian-950 border-slate-900 dark:border-white shadow-xs"
                                : "bg-white dark:bg-obsidian-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-100"
                            }`}
                          >
                            15% Standard Rate
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetCommissionRate(20)}
                            className={`flex-1 rounded-lg py-2 px-3 text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                              currentRate === 20
                                ? "bg-amber-500 dark:bg-amber-500 text-white border-amber-500 shadow-xs"
                                : "bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/30 hover:bg-amber-100"
                            }`}
                          >
                            <Flame className="h-3.5 w-3.5" />
                            <span>🔥 20% High Ticket Boost</span>
                          </button>
                        </div>
                        {currentRate === 20 && (
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                            <Check className="h-3.5 w-3.5" />
                            <span>Approved by MakerlyAI (Tousif Raza) for 20% High Ticket payout.</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        {currentRate === 20 ? (
                          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Owner MakerlyAI (Tousif Raza) approved 20% High Ticket Commission for this sale!</span>
                          </div>
                        ) : (
                          <p>
                            Standard Rate: <strong>15%</strong>. Sales above ₹1,00,000 can be increased to <strong>20%</strong> at the discretion of owner <strong>MakerlyAI (Tousif Raza)</strong>.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact & Follow-up Details */}
                <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-obsidian-900/60 p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Contact &amp; Schedule
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Phone / WhatsApp</span>
                      <a
                        href={`tel:${lead.phone}`}
                        className="text-slate-800 dark:text-slate-200 hover:text-brand-600 font-mono font-medium"
                      >
                        {lead.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Email</span>
                      <a
                        href={`mailto:${lead.email}`}
                        className="text-slate-800 dark:text-slate-200 hover:text-brand-600 font-mono font-medium"
                      >
                        {lead.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Requirement</span>
                      <span className="text-brand-600 dark:text-brand-300 font-semibold">
                        {lead.requirement}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Submitted By Partner</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">
                        {lead.createdByName}
                      </span>
                    </div>
                  </div>

                  {lead.reason && (
                    <div className="border-t border-slate-200/80 dark:border-white/[0.06] pt-2 text-xs">
                      <span className="text-slate-400 dark:text-slate-500 block text-[11px]">Reason / Intake Notes:</span>
                      <p className="text-slate-700 dark:text-slate-300 mt-0.5">{lead.reason}</p>
                    </div>
                  )}

                  {/* Followup Date Picker */}
                  <div className="border-t border-slate-200/80 dark:border-white/[0.06] pt-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-amber-500" />
                        <span>Next Follow-up Date:</span>
                      </div>
                      {isOverdue && (
                        <span className="flex items-center gap-1 rounded bg-rose-50 dark:bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
                          <ClockAlert className="h-2.5 w-2.5" />
                          OVERDUE
                        </span>
                      )}
                    </div>

                    <input
                      type="date"
                      value={
                        lead.nextFollowupDate
                          ? new Date(lead.nextFollowupDate).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        onUpdateLead(lead.id, {
                          nextFollowupDate: val ? new Date(val).toISOString() : null,
                        });
                      }}
                      className="mt-1.5 h-8.5 w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-obsidian-950 px-2.5 text-xs text-slate-800 dark:text-slate-200 font-mono focus:border-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Notes & Remarks Section */}
                <div className="rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/70 dark:bg-obsidian-900/60 p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Lead Notes &amp; Client Context
                  </h4>

                  {lead.notes ? (
                    <p className="rounded-lg bg-white dark:bg-obsidian-950 p-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-white/[0.04]">
                      {lead.notes}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No notes provided during intake.</p>
                  )}

                  {/* Add Quick Remark / Note */}
                  <form onSubmit={handleAddNoteSubmit} className="mt-2 space-y-2">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add an internal progress note or call remark..."
                      rows={2}
                      className="w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-obsidian-950 p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:border-brand-500 focus:outline-none resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!newNote.trim()}
                        className="rounded-lg bg-slate-900 dark:bg-brand-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-all hover:bg-slate-800 dark:hover:bg-brand-500 disabled:opacity-40 shadow-xs"
                      >
                        Post Note
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              /* Activity Timeline Tab */
              <div className="space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Chronological Audit Log
                </div>

                {leadActivities.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No activities recorded yet.
                  </div>
                ) : (
                  <div className="relative border-l border-slate-200 dark:border-white/[0.08] pl-5 space-y-4 ml-2">
                    {leadActivities.map((act) => (
                      <div key={act.id} className="relative group">
                        {/* Dot */}
                        <div className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white dark:border-obsidian-950 bg-brand-500 group-hover:scale-125 transition-transform" />

                        <div className="rounded-xl border border-slate-200 dark:border-white/[0.06] bg-white dark:bg-obsidian-900/70 p-3.5 text-xs shadow-xs">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                            <span className="font-semibold text-slate-800 dark:text-slate-300">
                              {act.createdByName}
                            </span>
                            <span className="font-mono">
                              {new Date(act.createdAt).toLocaleString("en-IN", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                            {act.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

