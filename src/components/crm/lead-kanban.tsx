"use client";

import React from "react";
import { Lead, LeadStatus, PIPELINE_STATUSES, User } from "@/lib/crm/types";
import { formatCurrency } from "@/lib/crm/commission";
import { StatusBadge } from "./status-badge";
import {
  Calendar,
  ClockAlert,
  Sparkles,
  ChevronRight,
  ArrowRight,
  User as UserIcon,
  Flame,
  Mail,
  Phone,
  CheckCircle2,
} from "lucide-react";

interface LeadKanbanProps {
  leads: Lead[];
  activeUser: User;
  onSelectLead: (lead: Lead) => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onOpenEmailComposer?: (lead: Lead) => void;
  onBoostCommission?: (leadId: string) => void;
}

export const LeadKanban: React.FC<LeadKanbanProps> = ({
  leads,
  activeUser,
  onSelectLead,
  onUpdateStatus,
  onOpenEmailComposer,
  onBoostCommission,
}) => {
  const isAdmin = activeUser.role === "admin";
  const now = new Date().getTime();

  // Helper to get next stage
  const getNextStatus = (current: LeadStatus): LeadStatus | null => {
    const currentIndex = PIPELINE_STATUSES.indexOf(current);
    if (currentIndex >= 0 && currentIndex < PIPELINE_STATUSES.length - 2) {
      return PIPELINE_STATUSES[currentIndex + 1];
    }
    return null;
  };

  return (
    <div className="flex gap-3.5 overflow-x-auto pb-4 pt-1">
      {PIPELINE_STATUSES.map((status) => {
        const stageLeads = leads.filter((l) => l.status === status);
        const stageValue = stageLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0);

        return (
          <div
            key={status}
            className="flex w-80 flex-shrink-0 flex-col rounded-xl border border-slate-200/90 dark:border-white/[0.08] bg-slate-100/70 dark:bg-obsidian-900/50 p-3 backdrop-blur-md"
          >
            {/* Column Header */}
            <div className="mb-3 flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.06] pb-2.5 px-1">
              <div className="flex items-center gap-2">
                <StatusBadge status={status} size="sm" />
                <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                  {stageLeads.length}
                </span>
              </div>
              {stageValue > 0 && (
                <span className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  {formatCurrency(stageValue)}
                </span>
              )}
            </div>

            {/* Cards Container */}
            <div className="flex flex-1 flex-col gap-2.5 min-h-[350px]">
              {stageLeads.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-white/[0.06] p-4 text-center text-xs text-slate-400 dark:text-slate-600 font-medium">
                  Empty stage
                </div>
              ) : (
                stageLeads.map((lead) => {
                  const isOverdue =
                    lead.nextFollowupDate &&
                    lead.status !== "Closed Won" &&
                    lead.status !== "Closed Lost" &&
                    new Date(lead.nextFollowupDate).getTime() < now;

                  const nextStatus = getNextStatus(lead.status);
                  const isHigh = lead.isHighTicket || (lead.dealValue || 0) >= 100000;
                  const is20Percent = lead.commissionRate === 20;

                  return (
                    <div
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="group relative cursor-pointer rounded-xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-obsidian-850 p-3.5 shadow-xs transition-all hover:border-brand-400 dark:hover:border-brand-500/40 hover:shadow-md hover:-translate-y-0.5"
                    >
                      {/* Top: Business & Requirement */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-300">
                            {lead.businessName}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {lead.clientName}
                          </p>
                        </div>
                      </div>

                      {/* Requirement & High Ticket Tag */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 dark:bg-obsidian-950 px-2 py-0.5 text-[10px] font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.05]">
                          <Sparkles className="h-2.5 w-2.5 text-brand-500" />
                          <span className="truncate max-w-[150px]">{lead.requirement}</span>
                        </span>

                        {isHigh && (
                          <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 dark:bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                            <Flame className="h-2.5 w-2.5 text-amber-500" />
                            <span>High Ticket (&gt; ₹1L)</span>
                          </span>
                        )}
                      </div>

                      {/* Reason or Notes snippet */}
                      {(lead.reason || lead.notes) && (
                        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed bg-slate-50/70 dark:bg-obsidian-900/50 rounded p-1.5 border border-slate-100 dark:border-white/[0.04]">
                          {lead.reason || lead.notes}
                        </p>
                      )}

                      {/* Deal Value, Commission & Followup */}
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-white/[0.06] pt-2.5 text-[11px]">
                        <div>
                          <div className="font-mono font-bold text-slate-900 dark:text-slate-100">
                            {lead.dealValue > 0 ? (
                              formatCurrency(lead.dealValue)
                            ) : (
                              <span className="text-slate-400 font-normal">TBD</span>
                            )}
                          </div>
                          <div className="text-[10px] font-semibold mt-0.5">
                            {is20Percent ? (
                              <span className="text-emerald-600 dark:text-emerald-400">
                                20% Comm (Owner Approved)
                              </span>
                            ) : (
                              <span className="text-slate-500 dark:text-slate-400 font-medium">
                                15% Comm
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Next Followup */}
                        {lead.nextFollowupDate && (
                          <div
                            className={`flex items-center gap-1 text-[10px] font-mono ${
                              isOverdue ? "text-rose-600 dark:text-rose-400 font-bold" : "text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {isOverdue && <ClockAlert className="h-2.5 w-2.5" />}
                            <span>
                              {new Date(lead.nextFollowupDate).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Row: Email, Call, Owner 20% Boost, Advance */}
                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-white/[0.05] pt-2">
                        <div className="flex items-center gap-1">
                          {onOpenEmailComposer && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenEmailComposer(lead);
                              }}
                              title="Send Email"
                              className="rounded p-1 text-slate-400 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/20 dark:hover:text-brand-300"
                            >
                              <Mail className="h-3 w-3" />
                            </button>
                          )}
                          <a
                            href={`tel:${lead.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            title="Call"
                            className="rounded p-1 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/20 dark:hover:text-emerald-300"
                          >
                            <Phone className="h-3 w-3" />
                          </a>

                          {/* Owner 20% Boost Button on Kanban Card */}
                          {isAdmin && isHigh && !is20Percent && onBoostCommission && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onBoostCommission(lead.id);
                              }}
                              title="Owner Tousif Raza: Boost commission to 20%"
                              className="inline-flex items-center gap-0.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 px-1.5 py-0.5 text-[9px] font-bold"
                            >
                              <Flame className="h-2.5 w-2.5 text-amber-600 dark:text-amber-400" />
                              <span>20% Boost</span>
                            </button>
                          )}
                        </div>

                        {/* Admin Quick Advance Button */}
                        {isAdmin && nextStatus && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateStatus(lead.id, nextStatus);
                            }}
                            className="flex items-center gap-1 rounded-md border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-obsidian-900 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 dark:hover:border-brand-500 dark:hover:bg-brand-500/20 dark:hover:text-brand-200"
                          >
                            <span>➔ {nextStatus}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

