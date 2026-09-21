"use client";

import React, { useState } from "react";
import { Lead, LeadStatus, PIPELINE_STATUSES, User } from "@/lib/crm/types";
import { StatusBadge } from "./status-badge";
import { formatCurrency } from "@/lib/crm/commission";
import {
  Mail,
  Phone,
  Calendar,
  User as UserIcon,
  ChevronRight,
  ClockAlert,
  Sparkles,
  Filter,
  Flame,
  CheckCircle2,
} from "lucide-react";

interface LeadTableProps {
  leads: Lead[];
  activeUser: User;
  onSelectLead: (lead: Lead) => void;
  onUpdateStatus: (leadId: string, status: LeadStatus) => void;
  onOpenEmailComposer: (lead: Lead) => void;
  onBoostCommission?: (leadId: string) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  activeUser,
  onSelectLead,
  onUpdateStatus,
  onOpenEmailComposer,
  onBoostCommission,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [assignedFilter, setAssignedFilter] = useState<string>("all");
  const [onlyMyLeads, setOnlyMyLeads] = useState<boolean>(false);
  const [onlyOverdue, setOnlyOverdue] = useState<boolean>(false);
  const [onlyHighTicket, setOnlyHighTicket] = useState<boolean>(false);

  const isAdmin = activeUser.role === "admin";
  const now = new Date().getTime();

  // Unique assignees for filter
  const assignees = Array.from(
    new Set(leads.map((l) => l.assignedToName).filter(Boolean))
  );

  // Filter leads
  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== "all" && lead.status !== statusFilter) return false;
    if (assignedFilter !== "all" && lead.assignedToName !== assignedFilter) return false;
    if (onlyMyLeads && lead.createdBy !== activeUser.id) return false;
    if (onlyHighTicket && !lead.isHighTicket && (lead.dealValue || 0) < 100000) return false;
    if (onlyOverdue) {
      if (!lead.nextFollowupDate || lead.status === "Closed Won" || lead.status === "Closed Lost") {
        return false;
      }
      return new Date(lead.nextFollowupDate).getTime() < now;
    }
    return true;
  });

  return (
    <div className="space-y-3">
      {/* Filter Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-obsidian-900/60 p-3 shadow-sm backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Filter className="h-3.5 w-3.5" />
            <span className="font-semibold">Filter:</span>
          </div>

          {/* Status Select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-obsidian-850 px-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors focus:border-brand-500 focus:bg-white dark:focus:bg-obsidian-800 focus:outline-none"
          >
            <option value="all">All Stages ({leads.length})</option>
            {PIPELINE_STATUSES.map((status) => {
              const count = leads.filter((l) => l.status === status).length;
              return (
                <option key={status} value={status}>
                  {status} ({count})
                </option>
              );
            })}
          </select>

          {/* Assignee Select (for Admin) */}
          {isAdmin && (
            <select
              value={assignedFilter}
              onChange={(e) => setAssignedFilter(e.target.value)}
              className="h-8 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-obsidian-850 px-2.5 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors focus:border-brand-500 focus:bg-white dark:focus:bg-obsidian-800 focus:outline-none"
            >
              <option value="all">All Assignees</option>
              {assignees.map((name) => (
                <option key={name as string} value={name as string}>
                  {name}
                </option>
              ))}
            </select>
          )}

          {/* High Ticket Filter Toggle (> 100k) */}
          <button
            onClick={() => setOnlyHighTicket(!onlyHighTicket)}
            className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-all ${
              onlyHighTicket
                ? "border border-amber-400 bg-amber-50 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/20 dark:text-amber-300 shadow-xs"
                : "border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-obsidian-850 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-obsidian-800"
            }`}
          >
            <Flame className="h-3 w-3 text-amber-500" />
            <span>High Ticket (&gt; ₹1L)</span>
          </button>

          {/* My Leads Filter Toggle */}
          <button
            onClick={() => setOnlyMyLeads(!onlyMyLeads)}
            className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-all ${
              onlyMyLeads
                ? "border border-brand-400 bg-brand-50 text-brand-900 dark:border-brand-500/40 dark:bg-brand-500/20 dark:text-brand-300 shadow-xs"
                : "border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-obsidian-850 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-obsidian-800"
            }`}
          >
            <UserIcon className="h-3 w-3" />
            <span>My Submitted Leads</span>
          </button>

          {/* Overdue Filter Toggle */}
          <button
            onClick={() => setOnlyOverdue(!onlyOverdue)}
            className={`flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold transition-all ${
              onlyOverdue
                ? "border border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-500/40 dark:bg-rose-500/20 dark:text-rose-300 shadow-xs"
                : "border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-obsidian-850 text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-obsidian-800"
            }`}
          >
            <ClockAlert className="h-3 w-3 text-rose-500" />
            <span>Overdue Follow-ups</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Showing <strong className="text-slate-900 dark:text-slate-200">{filteredLeads.length}</strong> of {leads.length} leads
        </div>
      </div>

      {/* Notion/Linear-Style Data Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-obsidian-900/60 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Table Header */}
            <thead className="border-b border-slate-200 dark:border-white/[0.08] bg-slate-50/90 dark:bg-obsidian-950/70 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
              <tr>
                <th className="px-4 py-3">Client &amp; Contact</th>
                <th className="px-4 py-3">Business</th>
                <th className="px-4 py-3">Requirement / Reason</th>
                <th className="px-4 py-3">Pipeline Stage</th>
                <th className="px-4 py-3">Assigned Closer</th>
                <th className="px-4 py-3">Submitted By</th>
                <th className="px-4 py-3">Next Follow-up</th>
                <th className="px-4 py-3 text-right">Deal &amp; Comm</th>
                <th className="px-4 py-3 text-center">Quick Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-slate-400">
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No leads match the selected filter.</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Try clearing filters or click &quot;Submit Lead&quot; to add a new lead.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const isOverdue =
                    lead.nextFollowupDate &&
                    lead.status !== "Closed Won" &&
                    lead.status !== "Closed Lost" &&
                    new Date(lead.nextFollowupDate).getTime() < now;

                  const followupDateObj = lead.nextFollowupDate
                    ? new Date(lead.nextFollowupDate)
                    : null;

                  const isHigh = lead.isHighTicket || (lead.dealValue || 0) >= 100000;
                  const is20Percent = lead.commissionRate === 20;

                  return (
                    <tr
                      key={lead.id}
                      className="group transition-colors hover:bg-slate-50/80 dark:hover:bg-white/[0.02]"
                    >
                      {/* Client Name & Contact */}
                      <td
                        onClick={() => onSelectLead(lead)}
                        className="cursor-pointer px-4 py-3.5"
                      >
                        <div className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-300">
                          {lead.clientName}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>{lead.email}</span>
                          <span>•</span>
                          <span className="font-mono">{lead.phone}</span>
                        </div>
                      </td>

                      {/* Business Name */}
                      <td
                        onClick={() => onSelectLead(lead)}
                        className="cursor-pointer px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200"
                      >
                        {lead.businessName}
                      </td>

                      {/* Requirement & Reason */}
                      <td
                        onClick={() => onSelectLead(lead)}
                        className="cursor-pointer px-4 py-3.5"
                      >
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-obsidian-850 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                            <Sparkles className="h-2.5 w-2.5 text-brand-500" />
                            <span>{lead.requirement}</span>
                          </span>
                          {lead.reason && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                              {lead.reason}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Pipeline Stage Dropdown or Badge */}
                      <td className="px-4 py-3.5">
                        {isAdmin ? (
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              onUpdateStatus(lead.id, e.target.value as LeadStatus)
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="h-7 cursor-pointer rounded-full border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-obsidian-850 px-2.5 text-[11px] font-semibold text-slate-800 dark:text-slate-200 transition-colors hover:border-slate-300 dark:hover:border-white/20 focus:border-brand-500 focus:outline-none"
                          >
                            {PIPELINE_STATUSES.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <StatusBadge status={lead.status} />
                        )}
                      </td>

                      {/* Assigned Closer */}
                      <td
                        onClick={() => onSelectLead(lead)}
                        className="cursor-pointer px-4 py-3.5 text-slate-700 dark:text-slate-300"
                      >
                        {lead.assignedToName ? (
                          <div className="flex items-center gap-1.5">
                            <span className="h-5 w-5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300 flex items-center justify-center text-[10px] font-bold">
                              {lead.assignedToName.charAt(0)}
                            </span>
                            <span className="font-medium text-[11px]">{lead.assignedToName}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Unassigned</span>
                        )}
                      </td>

                      {/* Submitted By */}
                      <td
                        onClick={() => onSelectLead(lead)}
                        className="cursor-pointer px-4 py-3.5 text-slate-500 dark:text-slate-400 font-mono text-[11px]"
                      >
                        {lead.createdByName}
                      </td>

                      {/* Next Follow-up */}
                      <td
                        onClick={() => onSelectLead(lead)}
                        className="cursor-pointer px-4 py-3.5 font-mono text-[11px]"
                      >
                        {followupDateObj ? (
                          <div className="flex items-center gap-1.5">
                            {isOverdue && (
                              <span
                                title="Overdue follow-up!"
                                className="inline-flex items-center rounded bg-rose-50 dark:bg-rose-500/20 px-1 py-0.2 text-[9px] font-bold text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30"
                              >
                                OVERDUE
                              </span>
                            )}
                            <span className={isOverdue ? "text-rose-600 dark:text-rose-300 font-semibold" : "text-slate-600 dark:text-slate-300"}>
                              {followupDateObj.toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">&mdash;</span>
                        )}
                      </td>

                      {/* Deal Value & High Ticket / Commission */}
                      <td
                        onClick={() => onSelectLead(lead)}
                        className="cursor-pointer px-4 py-3.5 text-right font-mono"
                      >
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {lead.dealValue > 0 ? formatCurrency(lead.dealValue) : "TBD"}
                        </div>
                        {isHigh && (
                          <div className="mt-1 flex items-center justify-end gap-1">
                            <span className="inline-flex items-center gap-0.5 rounded bg-amber-50 dark:bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                              <Flame className="h-2.5 w-2.5 text-amber-500" />
                              <span>High Ticket</span>
                            </span>
                          </div>
                        )}
                        <div className="text-[10px] mt-0.5">
                          {is20Percent ? (
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              20% Comm (Boosted)
                            </span>
                          ) : (
                            <span className="text-slate-500 dark:text-slate-400 font-medium">
                              15% Comm
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Quick Actions (Meaningful Light Minimal with Actions) */}
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Owner 20% Boost Button (Only MakerlyAI / Tousif Raza can decide) */}
                          {isAdmin && isHigh && !is20Percent && onBoostCommission && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onBoostCommission(lead.id);
                              }}
                              title="Owner Tousif Raza: Increase partner commission to 20% for this High Ticket sale"
                              className="inline-flex items-center gap-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:hover:bg-amber-500/25 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 px-2 py-1 text-[10px] font-bold transition-all shadow-xs active:scale-95"
                            >
                              <Flame className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                              <span>Boost 20%</span>
                            </button>
                          )}

                          {isHigh && is20Percent && (
                            <span
                              title="20% High Ticket Commission approved by Owner: MakerlyAI (Tousif Raza)"
                              className="inline-flex items-center gap-0.5 rounded bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 px-1.5 py-0.5 text-[9px] font-semibold"
                            >
                              <CheckCircle2 className="h-2.5 w-2.5" />
                              <span>20% OK</span>
                            </span>
                          )}

                          {/* Send Email */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenEmailComposer(lead);
                            }}
                            title="Send quick email"
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-brand-50 hover:text-brand-600 dark:text-slate-400 dark:hover:bg-brand-500/20 dark:hover:text-brand-300 border border-transparent hover:border-brand-200 dark:hover:border-transparent transition-all"
                          >
                            <Mail className="h-3.5 w-3.5" />
                          </button>

                          {/* Call Client */}
                          <a
                            href={`tel:${lead.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            title="Call client"
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 dark:text-slate-400 dark:hover:bg-emerald-500/20 dark:hover:text-emerald-300 border border-transparent hover:border-emerald-200 dark:hover:border-transparent transition-all"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>

                          {/* Open Details */}
                          <button
                            onClick={() => onSelectLead(lead)}
                            title="View lead details"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white transition-all"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

