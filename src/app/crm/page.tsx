"use client";

import React, { useState, useEffect } from "react";
import {
  Lead,
  Activity,
  User,
  LeadStatus,
  CRMStats,
} from "@/lib/crm/types";
import {
  getStoredLeads,
  saveStoredLeads,
  getStoredActivities,
  getStoredUsers,
  getActiveUser,
  setActiveUser,
  createLead,
  createBulkLeads,
  updateLead,
  executeOneTapAction,
  createActivity,
  calculateStats,
} from "@/lib/crm/crm-store";
import { CRMHeader } from "@/components/crm/crm-header";
import { StatsRibbon } from "@/components/crm/stats-ribbon";
import { LeadTable } from "@/components/crm/lead-table";
import { LeadKanban } from "@/components/crm/lead-kanban";
import { LeadDetailDrawer } from "@/components/crm/lead-detail-drawer";
import { EmailComposerModal } from "@/components/crm/email-composer-modal";
import { LeadSubmissionModal } from "@/components/crm/lead-submission-modal";
import { BulkImportModal } from "@/components/crm/bulk-import-modal";
import { MakerlyLogoIcon } from "@/components/crm/makerly-logo";
import { AuthGate } from "@/components/crm/auth-gate";
import { OwnerAccessManager } from "@/components/crm/owner-access-manager";
import {
  AuthSession,
  getAuthSession,
  logoutSession,
  getAccessRequests,
} from "@/lib/crm/auth-store";
import { ShieldCheck, UserCheck, Sparkles, Filter, FileSpreadsheet, Bot, Globe, ChevronDown, ChevronUp } from "lucide-react";

export default function CRMPage() {
  const [mounted, setMounted] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [inboundLeads, setInboundLeads] = useState<any[]>([]);
  const [inboundExpanded, setInboundExpanded] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeUser, setActiveUserState] = useState<User>(getActiveUser());
  const [authSession, setAuthSessionState] = useState<AuthSession | null>(null);
  const [isAccessManagerOpen, setIsAccessManagerOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [emailComposerLead, setEmailComposerLead] = useState<Lead | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load stored state on mount
  useEffect(() => {
    setLeads(getStoredLeads());
    setActivities(getStoredActivities());
    const storedUsers = getStoredUsers();
    setUsers(storedUsers);

    // Load auth session and strictly sync activeUser
    const session = getAuthSession();
    setAuthSessionState(session);

    if (session) {
      if (session.role === "owner") {
        const ownerUser: User = {
          id: "usr-admin-tousif",
          name: "Tousif Raza",
          email: session.email,
          role: "admin",
          approved: true,
        };
        setActiveUser(ownerUser);
        setActiveUserState(ownerUser);
      } else {
        const partnerUser: User = {
          id: "usr-partner-" + session.email.toLowerCase().replace(/[^a-z0-9]/g, ""),
          name: session.name || session.email.split("@")[0],
          email: session.email,
          role: "partner",
          approved: true,
        };
        setActiveUser(partnerUser);
        setActiveUserState(partnerUser);
      }

      // Sync live leads from Supabase
      if (session.token) {
        fetch("/api/leads", {
          headers: { Authorization: `Bearer ${session.token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && Array.isArray(data.leads)) {
              setLeads(data.leads);
              saveStoredLeads(data.leads);
            }
            // Owner-only: inbound leads from chatbot & contact form
            if (data.inbound_leads && Array.isArray(data.inbound_leads)) {
              setInboundLeads(data.inbound_leads);
            }
          })
          .catch((err) => console.warn("[CRM] Initial lead sync notice:", err));
      }
    } else {
      setActiveUserState(getActiveUser());
    }

    // Refresh pending requests count
    const reqs = getAccessRequests();
    setPendingRequestsCount(reqs.filter((r) => r.status === "pending").length);

    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark");
    }
    setMounted(true);
  }, []);

  // Defensive invariant: If authenticated as partner, NEVER allow activeUser to be admin
  useEffect(() => {
    if (authSession && authSession.role === "partner" && activeUser.role !== "partner") {
      const partnerUser: User = {
        id: "usr-partner-" + authSession.email.toLowerCase().replace(/[^a-z0-9]/g, ""),
        name: authSession.name || authSession.email.split("@")[0],
        email: authSession.email,
        role: "partner",
        approved: true,
      };
      setActiveUser(partnerUser);
      setActiveUserState(partnerUser);
    }
  }, [authSession, activeUser]);

  const handleAuthorized = (session: AuthSession) => {
    setAuthSessionState(session);
    if (session.role === "owner") {
      const ownerUser: User = {
        id: "usr-admin-tousif",
        name: "Tousif Raza",
        email: session.email,
        role: "admin",
        approved: true,
      };
      setActiveUser(ownerUser);
      setActiveUserState(ownerUser);
    } else {
      const partnerUser: User = {
        id: "usr-partner-" + session.email.toLowerCase().replace(/[^a-z0-9]/g, ""),
        name: session.name || session.email.split("@")[0],
        email: session.email,
        role: "partner",
        approved: true,
      };
      setActiveUser(partnerUser);
      setActiveUserState(partnerUser);
    }

    // Sync live leads immediately after authentication
    if (session.token) {
      fetch("/api/leads", {
        headers: { Authorization: `Bearer ${session.token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.leads)) {
            setLeads(data.leads);
            saveStoredLeads(data.leads);
          }
          if (data.inbound_leads && Array.isArray(data.inbound_leads)) {
            setInboundLeads(data.inbound_leads);
          }
        })
        .catch((err) => console.warn("[CRM] Auth lead sync notice:", err));
    }
  };

  const handleLockCRM = () => {
    logoutSession();
    setAuthSessionState(null);
  };

  const refreshPendingCount = () => {
    const reqs = getAccessRequests();
    setPendingRequestsCount(reqs.filter((r) => r.status === "pending").length);
  };

  const handleUserChange = (user: User) => {
    // Role change is forbidden for partner sessions
    if (authSession?.role === "partner") {
      return;
    }
    setActiveUser(user);
    setActiveUserState(user);
  };

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof document !== "undefined") {
        if (next) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return next;
    });
  };

  // Status update
  const handleUpdateStatus = (leadId: string, status: LeadStatus) => {
    const updated = updateLead(leadId, { status }, activeUser);
    if (updated) {
      setLeads(getStoredLeads());
      setActivities(getStoredActivities());
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updated);
      }
    }
  };

  // Lead update (e.g. deal value, assignment)
  const handleUpdateLead = (leadId: string, updates: Partial<Lead>) => {
    const updated = updateLead(leadId, updates, activeUser);
    if (updated) {
      setLeads(getStoredLeads());
      setActivities(getStoredActivities());
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updated);
      }
    }
  };

  // Add note
  const handleAddNote = (leadId: string, noteContent: string) => {
    createActivity(leadId, "note", noteContent, activeUser.name);
    setActivities(getStoredActivities());
  };

  // One-tap actions
  const handleMarkContacted = (leadId: string) => {
    const updated = executeOneTapAction(leadId, "markContacted", activeUser);
    if (updated) {
      setLeads(getStoredLeads());
      setActivities(getStoredActivities());
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updated);
      }
    }
  };

  const handleScheduleFollowup = (leadId: string, days: number) => {
    const updated = executeOneTapAction(leadId, "scheduleFollowup", activeUser, {
      days,
    });
    if (updated) {
      setLeads(getStoredLeads());
      setActivities(getStoredActivities());
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updated);
      }
    }
  };

  const handleAssignSenior = (leadId: string) => {
    const updated = executeOneTapAction(leadId, "assignSenior", activeUser);
    if (updated) {
      setLeads(getStoredLeads());
      setActivities(getStoredActivities());
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updated);
      }
    }
  };

  // High ticket boost to 20% by Owner Tousif Raza
  const handleBoostCommission = (leadId: string) => {
    const updated = executeOneTapAction(leadId, "boostHighTicketCommission", activeUser);
    if (updated) {
      setLeads(getStoredLeads());
      setActivities(getStoredActivities());
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updated);
      }
    }
  };

  const handleSendEmail = (payload: {
    leadId: string;
    to: string;
    subject: string;
    body: string;
    templateId: string;
  }) => {
    const updated = executeOneTapAction(payload.leadId, "logEmailSent", activeUser, {
      subject: payload.subject,
      to: payload.to,
      templateId: payload.templateId,
    });
    if (updated) {
      setLeads(getStoredLeads());
      setActivities(getStoredActivities());
      if (selectedLead && selectedLead.id === payload.leadId) {
        setSelectedLead(updated);
      }
    }
  };

  const handleCreateLead = (leadData: {
    clientName: string;
    phone: string;
    email: string;
    businessName: string;
    requirement: string;
    notes?: string;
  }) => {
    const newLead = createLead(leadData, activeUser);
    setLeads(getStoredLeads());
    setActivities(getStoredActivities());
  };

  const handleBulkImport = (
    importedLeads: Array<{
      clientName: string;
      phone: string;
      email: string;
      businessName: string;
      requirement: string;
      notes?: string;
      dealValue?: number;
    }>
  ) => {
    createBulkLeads(importedLeads, activeUser);
    setLeads(getStoredLeads());
    setActivities(getStoredActivities());
  };

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC] dark:bg-obsidian-950 text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3 text-sm font-medium">
          <div className="w-9 h-9 rounded-xl bg-[#efe7d1] border border-[#2952cc]/30 flex items-center justify-center shadow-xs p-1">
            <MakerlyLogoIcon className="w-full h-full" color="#2952cc" />
          </div>
          <span>Initializing MakerlyAI.in CRM...</span>
        </div>
      </div>
    );
  }

  // Personal Authorization Gate Check
  if (!authSession || !authSession.isAuthorized) {
    return <AuthGate onAuthorized={handleAuthorized} />;
  }

  // Filter leads based on global search & partner permissions
  const partnerFilteredLeads =
    activeUser.role === "partner"
      ? leads.filter((l) => l.createdBy === activeUser.id)
      : leads;

  const searchedLeads = partnerFilteredLeads.filter((l) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.clientName.toLowerCase().includes(q) ||
      l.businessName.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      l.requirement.toLowerCase().includes(q)
    );
  });

  const stats = calculateStats(leads, activeUser);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-obsidian-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Header with Personal Authorization Controls */}
      <CRMHeader
        activeUser={activeUser}
        onUserChange={handleUserChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenBulkImportModal={() => setIsBulkImportOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        authSession={authSession}
        pendingRequestsCount={pendingRequestsCount}
        onOpenAccessManager={() => setIsAccessManagerOpen(true)}
        onLockCRM={handleLockCRM}
      />

      {/* Main CRM Workspace */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* Role Notice & Action Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-obsidian-900/60 px-4 py-3 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3">
            {activeUser.role === "admin" ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#efe7d1] border border-[#2952cc]/30 shadow-xs p-1.5 transition-transform hover:scale-105">
                <MakerlyLogoIcon className="w-full h-full" color="#2952cc" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30">
                <UserCheck className="h-5 w-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Active View: {activeUser.name}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    activeUser.role === "admin"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30"
                      : "bg-brand-50 text-brand-800 border border-brand-300 dark:bg-brand-500/20 dark:text-brand-300 dark:border-brand-500/30"
                  }`}
                >
                  {activeUser.role === "admin"
                    ? "Owner & Decision Maker"
                    : "Lead Partner • 15% Comm (High Ticket: 20%)"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {activeUser.role === "admin"
                  ? "Owner controls: High ticket sales (> ₹1,00,000) qualify for 20% commission boost, decided and approved only by you (Tousif Raza)."
                  : `Partner access: Showing only leads submitted by ${activeUser.name}. Standard commission is 15%; high-ticket sales (> ₹1,00,000) are eligible for 20% on Owner Tousif Raza's review.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBulkImportOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all active:scale-95 shadow-xs"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Bulk Import (Excel/CSV)</span>
            </button>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 text-white dark:bg-brand-600 px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-brand-500 transition-all active:scale-95 shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Submit Single Lead</span>
            </button>
          </div>
        </div>

        {/* Financial & Pipeline Stats Ribbon */}
        <StatsRibbon stats={stats} activeUser={activeUser} />

        {/* ── ADMIN-ONLY: Inbound Intelligence Panel ── */}
        {activeUser.role === "admin" && (
          <div className="rounded-2xl border border-[#2952cc]/25 bg-gradient-to-br from-[#0a0f1e]/90 via-[#0e1530]/80 to-[#1a2040]/90 shadow-xl backdrop-blur-md overflow-hidden">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.07]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2952cc]/20 border border-[#2952cc]/40">
                  <ShieldCheck className="h-4.5 w-4.5 text-[#6b8fff]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Inbound Intelligence</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    🔒 Owner-only · Leads from AI Chatbot &amp; Contact Form
                  </p>
                </div>
                <span className="ml-2 rounded-full bg-[#2952cc]/30 border border-[#2952cc]/50 text-[#a0b4ff] text-[10px] font-bold px-2.5 py-0.5">
                  {inboundLeads.length} lead{inboundLeads.length !== 1 ? "s" : ""}
                </span>
              </div>
              <button
                onClick={() => setInboundExpanded((p) => !p)}
                className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-xs"
              >
                {inboundExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {inboundExpanded ? "Collapse" : "Expand"}
              </button>
            </div>

            {/* Lead Rows */}
            {inboundExpanded && (
              <div className="divide-y divide-white/[0.05]">
                {inboundLeads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                      <Bot className="h-6 w-6 opacity-40" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">No inbound leads yet</p>
                    <p className="text-xs text-slate-600 mt-1">They will appear here once someone uses your chatbot or contact form</p>
                  </div>
                ) : (
                  inboundLeads.map((lead: any) => {
                    const isChatbot = lead.leadSource === "chatbot";
                    return (
                      <div
                        key={lead.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition-colors group"
                      >
                        {/* Source Badge */}
                        <div
                          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                            isChatbot
                              ? "bg-violet-500/15 border-violet-400/30 text-violet-300"
                              : "bg-emerald-500/15 border-emerald-400/30 text-emerald-300"
                          }`}
                        >
                          {isChatbot ? <Bot className="h-3 w-3" /> : <Globe className="h-3 w-3" />}
                          {isChatbot ? "AI Chatbot" : "Contact Form"}
                        </div>

                        {/* Lead Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white text-sm truncate">{lead.clientName}</span>
                            {lead.businessName && lead.businessName !== "Direct Client Project" && (
                              <span className="text-slate-400 text-xs truncate">· {lead.businessName}</span>
                            )}
                          </div>
                          <p className="text-slate-400 text-xs mt-0.5 line-clamp-1">{lead.requirement}</p>
                        </div>

                        {/* Contact */}
                        <div className="flex items-center gap-3 shrink-0 text-xs text-slate-400">
                          {lead.phone && lead.phone !== "Not provided" && (
                            <a href={`tel:${lead.phone}`} className="hover:text-emerald-400 transition-colors font-medium">
                              📞 {lead.phone}
                            </a>
                          )}
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} className="hover:text-[#6b8fff] transition-colors hidden sm:inline">
                              ✉ {lead.email}
                            </a>
                          )}
                        </div>

                        {/* Timestamp */}
                        <div className="shrink-0 text-[10px] text-slate-600 hidden md:block">
                          {new Date(lead.createdAt).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* Content View: Table vs Kanban */}
        {viewMode === "table" ? (
          <LeadTable
            leads={searchedLeads}
            activeUser={activeUser}
            onSelectLead={(lead) => setSelectedLead(lead)}
            onUpdateStatus={handleUpdateStatus}
            onOpenEmailComposer={(lead) => setEmailComposerLead(lead)}
            onBoostCommission={handleBoostCommission}
          />
        ) : (
          <LeadKanban
            leads={searchedLeads}
            activeUser={activeUser}
            onSelectLead={(lead) => setSelectedLead(lead)}
            onUpdateStatus={handleUpdateStatus}
            onOpenEmailComposer={(lead) => setEmailComposerLead(lead)}
            onBoostCommission={handleBoostCommission}
          />
        )}
      </main>

      {/* Slide-out Lead Detail Drawer */}
      <LeadDetailDrawer
        lead={selectedLead}
        activities={activities}
        users={users}
        activeUser={activeUser}
        isOpen={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        onUpdateLead={handleUpdateLead}
        onAddNote={handleAddNote}
        onOpenEmailComposer={(lead) => setEmailComposerLead(lead)}
        onMarkContacted={handleMarkContacted}
        onScheduleFollowup={handleScheduleFollowup}
        onAssignSenior={handleAssignSenior}
        onBoostCommission={handleBoostCommission}
      />

      {/* Email Composer Modal */}
      {emailComposerLead && (
        <EmailComposerModal
          lead={emailComposerLead}
          activeUser={activeUser}
          isOpen={Boolean(emailComposerLead)}
          onClose={() => setEmailComposerLead(null)}
          onSendEmail={handleSendEmail}
        />
      )}

      {/* Lead Submission Modal */}
      <LeadSubmissionModal
        isOpen={isSubmitModalOpen}
        activeUser={activeUser}
        onClose={() => setIsSubmitModalOpen(false)}
        onOpenBulkImport={() => {
          setIsSubmitModalOpen(false);
          setIsBulkImportOpen(true);
        }}
        onSubmit={handleCreateLead}
      />

      {/* Bulk Import Modal (.xlsx, .xls, .csv, paste) */}
      <BulkImportModal
        isOpen={isBulkImportOpen}
        activeUser={activeUser}
        onClose={() => setIsBulkImportOpen(false)}
        onBulkImport={handleBulkImport}
      />

      {/* Owner Authorizations Management Modal */}
      {authSession && (
        <OwnerAccessManager
          isOpen={isAccessManagerOpen}
          onClose={() => setIsAccessManagerOpen(false)}
          currentSession={authSession}
          onRequestsUpdated={refreshPendingCount}
        />
      )}
    </div>
  );
}

